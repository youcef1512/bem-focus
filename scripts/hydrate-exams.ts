import { access } from "node:fs/promises";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type ExamSource = {
  year: number;
  subjectId: string;
  label: string;
  paperUrl: string;
  correctionUrl: string;
  localPaperPath?: string;
  localCorrectionPath?: string;
  sourcePage: string;
  availability: "interactive" | "guided" | "paper";
};

type ArchiveJson = {
  generatedAt: string;
  source: string;
  entries: ExamSource[];
};

type IssueRecord = {
  year: number;
  subjectId: string;
  kind: "paper" | "correction";
  url: string;
};

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "src", "data", "bemArchive.generated.json");
const OUTPUT_ROOT = path.join(ROOT, "public", "backend", "exams");

async function readManifest() {
  const raw = await readFile(MANIFEST_PATH, "utf8");
  return JSON.parse(raw) as ArchiveJson;
}

async function readExistingIssues() {
  try {
    const raw = await readFile(path.join(OUTPUT_ROOT, "issues.json"), "utf8");
    return JSON.parse(raw) as IssueRecord[];
  } catch {
    return [];
  }
}

async function downloadBinary(url: string, filePath: string) {
  try {
    await access(filePath);
    return;
  } catch {
    // file does not exist yet
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20_000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36",
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to download ${url}: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      await writeFile(filePath, Buffer.from(arrayBuffer));
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
  }

  throw lastError;
}

function localAssetPaths(entry: ExamSource) {
  const dir = path.join(OUTPUT_ROOT, String(entry.year));
  const paperFileName = `${entry.subjectId}-paper.pdf`;
  const correctionFileName = `${entry.subjectId}-correction.pdf`;

  return {
    dir,
    paperDiskPath: path.join(dir, paperFileName),
    correctionDiskPath: path.join(dir, correctionFileName),
    paperPublicPath: `/backend/exams/${entry.year}/${paperFileName}`,
    correctionPublicPath: `/backend/exams/${entry.year}/${correctionFileName}`,
  };
}

async function main() {
  const manifest = await readManifest();
  const existingIssues = await readExistingIssues();
  const issues: IssueRecord[] = [];

  for (const entry of manifest.entries) {
    const paths = localAssetPaths(entry);
    await mkdir(paths.dir, { recursive: true });
    const paperKnownMissing = existingIssues.some(
      (issue) =>
        issue.url === entry.paperUrl &&
        issue.kind === "paper" &&
        issue.year === entry.year &&
        issue.subjectId === entry.subjectId,
    );
    const correctionKnownMissing = existingIssues.some(
      (issue) =>
        issue.url === entry.correctionUrl &&
        issue.kind === "correction" &&
        issue.year === entry.year &&
        issue.subjectId === entry.subjectId,
    );
    try {
      if (paperKnownMissing) {
        throw new Error("Known missing upstream paper");
      }
      await downloadBinary(entry.paperUrl, paths.paperDiskPath);
      entry.localPaperPath = paths.paperPublicPath;
    } catch {
      entry.localPaperPath = undefined;
      if (!paperKnownMissing) {
        issues.push({
          year: entry.year,
          subjectId: entry.subjectId,
          kind: "paper",
          url: entry.paperUrl,
        });
      }
    }

    try {
      if (correctionKnownMissing) {
        throw new Error("Known missing upstream correction");
      }
      await downloadBinary(entry.correctionUrl, paths.correctionDiskPath);
      entry.localCorrectionPath = paths.correctionPublicPath;
    } catch {
      entry.localCorrectionPath = undefined;
      if (!correctionKnownMissing) {
        issues.push({
          year: entry.year,
          subjectId: entry.subjectId,
          kind: "correction",
          url: entry.correctionUrl,
        });
      }
    }
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(
    path.join(OUTPUT_ROOT, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(OUTPUT_ROOT, "issues.json"),
    `${JSON.stringify(
      [...existingIssues, ...issues].filter(
        (issue, index, all) =>
          all.findIndex(
            (candidate) =>
              candidate.url === issue.url &&
              candidate.kind === issue.kind &&
              candidate.year === issue.year &&
              candidate.subjectId === issue.subjectId,
          ) === index,
      ),
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(
    `Hydrated ${manifest.entries.length} hosted exam assets into ${OUTPUT_ROOT} with ${issues.length} upstream issues`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
