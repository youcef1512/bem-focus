import { startTransition, useDeferredValue, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  buildInteractiveExam,
  examDossierFor,
  examSourceFor,
  examSources,
  subjectById,
  subjects,
  type SubjectId,
} from "../content";
import { PrintActions, SectionHeading, Surface } from "../components/AppChrome";
import { ExamPromptWorkbench } from "../components/ExamPromptWorkbench";
import { PracticeDeck } from "../components/PracticeDeck";

export function ExamsPage() {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<SubjectId | "all">("all");
  const deferredQuery = useDeferredValue(query);

  const filtered = examSources.filter((entry) => {
    const matchesSubject = activeSubject === "all" || entry.subjectId === activeSubject;
    const matchesQuery =
      deferredQuery.trim() === "" ||
      entry.year.toString().includes(deferredQuery) ||
      subjectById[entry.subjectId].name.includes(deferredQuery) ||
      entry.label.includes(deferredQuery);

    return matchesSubject && matchesQuery;
  });

  return (
    <>
      <SectionHeading
        description="كل السنوات من 2016 إلى 2025 مفهرسة. كل صفحة امتحان فيها الورشة التفاعلية أولًا، ثم PDF الأصلي والتصحيح داخل المنصة."
        eyebrow="BEM archive"
        title="امتحانات BEM السابقة"
      />

      <Surface>
        <div className="filters-row">
          <label className="answer-field">
            <span>بحث</span>
            <input
              onChange={(event) =>
                startTransition(() => {
                  setQuery(event.target.value);
                })
              }
              placeholder="مثلاً: 2025 أو رياضيات"
              value={query}
            />
          </label>
          <div className="subject-strip">
            <button
              className={activeSubject === "all" ? "choice-button choice-button--active" : "choice-button"}
              onClick={() => setActiveSubject("all")}
              type="button"
            >
              الكل
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                className={
                  activeSubject === subject.id
                    ? "choice-button choice-button--active"
                    : "choice-button"
                }
                onClick={() => setActiveSubject(subject.id)}
                type="button"
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      </Surface>

      <Surface>
        <div className="list-stack">
          {filtered.map((entry) => (
            <div key={`${entry.subjectId}-${entry.year}`} className="list-row">
              <div>
                <strong>
                  {subjectById[entry.subjectId].name} - {entry.year}
                </strong>
                <p>
                  {entry.availability === "interactive"
                    ? "Interactive remake + remix"
                    : "Full-paper reconstruction dossier + hosted PDF"}
                </p>
              </div>
              <div className="hero-actions">
                <Link className="action-button" to={`/past-exams/${entry.subjectId}/${entry.year}`}>
                  فتح
                </Link>
                <a
                  className="action-button action-button--ghost"
                  href={entry.localPaperPath ?? entry.paperUrl}
                  target="_blank"
                >
                  PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </>
  );
}

export function ExamDetailPage() {
  const params = useParams<{ subjectId: SubjectId; year: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [seed, setSeed] = useState(Number(params.year));
  const subjectId = params.subjectId;
  const year = Number(params.year);

  if (!subjectId || Number.isNaN(year)) {
    return <Navigate replace to="/past-exams" />;
  }

  const source = examSourceFor(subjectId, year);
  const dossier = examDossierFor(subjectId, year);
  if (!source) {
    return <Navigate replace to="/past-exams" />;
  }

  const mode = searchParams.get("mode") === "remix" ? "remix" : "original";
  const exam = buildInteractiveExam(subjectId, year, mode, seed);

  if (!exam) {
    return <Navigate replace to="/past-exams" />;
  }

  return (
    <>
      <Surface className="lesson-hero">
        <SectionHeading
          eyebrow="Exam workbench"
          title={`${subjectById[subjectId].name} ${year}`}
          description={exam.summary}
        />
        <div className="hero-actions">
          <button
            className={mode === "original" ? "action-button" : "action-button action-button--ghost"}
            onClick={() => setSearchParams({ mode: "original" })}
            type="button"
          >
            Original mode
          </button>
          <button
            className={mode === "remix" ? "action-button" : "action-button action-button--ghost"}
            onClick={() => setSearchParams({ mode: "remix" })}
            type="button"
          >
            Remix mode
          </button>
          {subjectId === "math" && mode === "remix" ? (
            <button
              className="action-button action-button--ghost"
              onClick={() => setSeed((value) => value + 1)}
              type="button"
            >
              بدل الأرقام
            </button>
          ) : null}
        </div>
        <div className="hero-actions">
          <a
            className="action-button action-button--ghost"
            href={source.localPaperPath ?? source.paperUrl}
            target="_blank"
          >
            الموضوع الكامل على منصتنا
          </a>
          <a
            className="action-button action-button--ghost"
            href={source.localCorrectionPath ?? source.correctionUrl}
            target="_blank"
          >
            التصحيح الكامل على منصتنا
          </a>
          <PrintActions />
        </div>
      </Surface>

      {dossier ? (
        <Surface>
          <SectionHeading
            eyebrow="Reconstruction dossier"
            title="إعادة بناء الامتحان من الصفحات الأصلية"
            description={`الورشة تبدأ من السؤال الأصلي نفسه لسنة ${year}. إذا كان OCR ناقصًا في سطر واحد، ثبتيه من PDF ثم واصلي هنا.`}
          />
          <div className="lesson-meta">
            <span className="meta-pill">{dossier.pageCount} pages</span>
            <span className="meta-pill meta-pill--warm">{dossier.prompts.length} extracted prompts</span>
            <span className="meta-pill">{dossier.ocrLanguage}</span>
          </div>
          <ExamPromptWorkbench dossier={dossier} />
        </Surface>
      ) : null}

      <Surface>
        <SectionHeading
          eyebrow="Hosted archive"
          title="نسخة PDF كاملة داخل منصتنا"
          description="الورشة التفاعلية فوق هي نقطة البداية. هذه النسخة الكاملة تبقى مرجعًا للتثبيت إذا كان OCR ناقصًا في سطر أو صورة أو جدول."
        />
        {!source.localPaperPath || !source.localCorrectionPath ? (
          <p className="callout">
            بعض ملفات هذه السنة ناقصة من المصدر الأصلي. المنصة تعرض ما تم استضافته محليًا وتبقي رابط المصدر كخطة احتياط.
          </p>
        ) : null}
        <div className="two-column-grid">
          <div className="pdf-panel">
            <h3>الموضوع الأصلي</h3>
            <iframe
              className="pdf-frame"
              src={source.localPaperPath ?? source.paperUrl}
              title={`paper-${subjectId}-${year}`}
            />
          </div>
          <div className="pdf-panel">
            <h3>التصحيح</h3>
            <iframe
              className="pdf-frame"
              src={source.localCorrectionPath ?? source.correctionUrl}
              title={`correction-${subjectId}-${year}`}
            />
          </div>
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          eyebrow={mode === "original" ? "After the original paper" : "Remix training"}
          title={
            mode === "original"
              ? "ثبتي الفكرة بعد الورقة الأصلية"
              : "نفس المهارات بصيغة تدريبية"
          }
          description={
            mode === "original"
              ? "بعد ما تكملي السؤال من الورقة الأصلية، استعملي هذا الجزء لتثبيت نفس المهارة بأسئلة أوضح ومصحوبة بتغذية راجعة."
              : "هذه النسخة تحافظ على بنية المهارة لكن تغيّر الصياغة أو الأرقام حتى يكون الفهم حقيقيًا."
          }
        />
        <div className="list-stack">
          {exam.sections.map((section) => (
            <article key={section.title} className="lesson-section">
              <SectionHeading
                eyebrow="Skill transfer"
                title={section.title}
                description={section.note}
              />
              <PracticeDeck questions={section.questions} title={section.title} />
            </article>
          ))}
        </div>
      </Surface>
    </>
  );
}
