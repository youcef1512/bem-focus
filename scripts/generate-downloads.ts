import { createWriteStream } from "node:fs";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import archiver from "archiver";
import { lessons, summarySheets, subjectById } from "../src/content";

const ROOT = process.cwd();
const tempRoot = path.join(ROOT, "output", "offline-source");
const publicRoot = path.join(ROOT, "public", "downloads");

const baseCss = `
  body { font-family: "Segoe UI", Tahoma, Arial, sans-serif; color: #2b2419; background: #f7f3ea; margin: 0; }
  main { width: min(960px, 100% - 2rem); margin: 0 auto; padding: 2rem 0 3rem; }
  .sheet { background: rgba(255,250,241,.96); border: 1px solid rgba(58,53,41,.14); border-radius: 28px; padding: 1.4rem; margin-bottom: 1rem; }
  h1, h2, h3 { margin-top: 0; }
  p, li { line-height: 1.8; }
  .eyebrow { color: #315f72; text-transform: uppercase; letter-spacing: .16em; font-size: .78rem; }
  .pill { display: inline-block; margin: .2rem .4rem .2rem 0; padding: .45rem .8rem; border-radius: 999px; background: rgba(49,95,114,.08); }
  .links a { display: inline-block; margin: .3rem .5rem .3rem 0; }
`;

function documentTemplate(title: string, body: string) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>${baseCss}</style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`;
}

function lessonHtml(lessonId: string) {
  const lesson = lessons.find((entry) => entry.id === lessonId)!;
  const subject = subjectById[lesson.subjectId];
  return documentTemplate(
    lesson.title,
    `
      <section class="sheet">
        <p class="eyebrow">BEM Focus Offline</p>
        <h1>${lesson.title}</h1>
        <p>${subject.name}</p>
        <p>${lesson.summary}</p>
        <div class="pill">${lesson.durationMinutes} min</div>
        <div class="pill">${lesson.finishLine}</div>
      </section>
      <section class="sheet">
        <h2>قبل ما تبدأي</h2>
        <p>${lesson.phoneAwayRitual}</p>
        <p>${lesson.recallWarmup}</p>
      </section>
      <section class="sheet">
        <h2>الأهداف</h2>
        <ul>${lesson.goals.map((goal) => `<li>${goal}</li>`).join("")}</ul>
      </section>
      ${lesson.sections
        .map(
          (section) => `
            <section class="sheet">
              <h2>${section.title}</h2>
              ${section.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
              ${
                section.bullets
                  ? `<ul>${section.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
                  : ""
              }
              ${section.callout ? `<p><strong>تذكير:</strong> ${section.callout}</p>` : ""}
            </section>
          `,
        )
        .join("")}
      <section class="sheet">
        <h2>أسئلة الاسترجاع</h2>
        <ol>${lesson.practice.map((question) => `<li>${question.prompt}</li>`).join("")}</ol>
      </section>
    `,
  );
}

function summaryHtml(summaryId: string) {
  const summary = summarySheets.find((entry) => entry.id === summaryId)!;
  const subject = subjectById[summary.subjectId];
  const program = summary.programSections ?? subject.roadmap;

  return documentTemplate(
    summary.title,
    `
      <section class="sheet">
        <p class="eyebrow">BEM Focus Summary</p>
        <h1>${summary.title}</h1>
        <p>${subject.name}</p>
      </section>
      <section class="sheet">
        <h2>الخلاصة</h2>
        <ul>${summary.recap.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
      <section class="sheet">
        <h2>البرنامج الكامل في المادة</h2>
        ${program
          .map(
            (block) => `
              <h3>${block.title}</h3>
              <ul>${block.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
            `,
          )
          .join("")}
      </section>
      ${
        summary.studySequence?.length
          ? `<section class="sheet">
              <h2>ترتيب المراجعة</h2>
              <ul>${summary.studySequence.map((item) => `<li>${item}</li>`).join("")}</ul>
            </section>`
          : ""
      }
      <section class="sheet">
        <h2>Memory hooks</h2>
        <ul>${summary.memoryHooks.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
      ${
        summary.formulas
          ? `<section class="sheet">
              <h2>Formulas</h2>
              <ul>${summary.formulas.map((formula) => `<li><strong>${formula.label}:</strong> ${formula.value}</li>`).join("")}</ul>
            </section>`
          : ""
      }
      <section class="sheet">
        <h2>حركات امتحانية</h2>
        <ul>${summary.examMoves.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>
      ${
        summary.commonTraps?.length
          ? `<section class="sheet">
              <h2>أخطاء شائعة</h2>
              <ul>${summary.commonTraps.map((item) => `<li>${item}</li>`).join("")}</ul>
            </section>`
          : ""
      }
      ${
        summary.quickChecks?.length
          ? `<section class="sheet">
              <h2>فحص سريع</h2>
              <ul>${summary.quickChecks.map((item) => `<li>${item}</li>`).join("")}</ul>
            </section>`
          : ""
      }
    `,
  );
}

async function zipDirectory(sourceDir: string, zipFilePath: string) {
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (error: Error) => reject(error));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function main() {
  await rm(tempRoot, { force: true, recursive: true });
  await rm(publicRoot, { force: true, recursive: true });

  await mkdir(path.join(tempRoot, "lessons"), { recursive: true });
  await mkdir(path.join(tempRoot, "summaries"), { recursive: true });

  for (const lesson of lessons) {
    await writeFile(
      path.join(tempRoot, "lessons", `${lesson.id}.html`),
      lessonHtml(lesson.id),
      "utf8",
    );
  }

  for (const summary of summarySheets) {
    await writeFile(
      path.join(tempRoot, "summaries", `${summary.id}.html`),
      summaryHtml(summary.id),
      "utf8",
    );
  }

  const indexHtml = documentTemplate(
    "BEM Focus Offline",
    `
      <section class="sheet">
        <p class="eyebrow">Offline pack</p>
        <h1>BEM Focus</h1>
        <p>فهرس الدروس والملخصات القابلة للفتح مباشرة من Windows.</p>
      </section>
      <section class="sheet">
        <h2>الدروس</h2>
        <ul class="links">${lessons
          .map((lesson) => `<li><a href="./lessons/${lesson.id}.html">${lesson.title}</a></li>`)
          .join("")}</ul>
      </section>
      <section class="sheet">
        <h2>الملخصات</h2>
        <ul class="links">${summarySheets
          .map((summary) => `<li><a href="./summaries/${summary.id}.html">${summary.title}</a></li>`)
          .join("")}</ul>
      </section>
    `,
  );

  await writeFile(path.join(tempRoot, "index.html"), indexHtml, "utf8");
  await mkdir(publicRoot, { recursive: true });
  await cp(tempRoot, publicRoot, { recursive: true });
  await zipDirectory(tempRoot, path.join(publicRoot, "offline-pack.zip"));
  console.log(`Generated offline downloads in ${publicRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
