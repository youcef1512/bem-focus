import { useMemo, useState } from "react";
import type { ExamDossier } from "../content/schema";

type ExamPromptWorkbenchProps = {
  dossier: ExamDossier;
};

export function ExamPromptWorkbench({ dossier }: ExamPromptWorkbenchProps) {
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [activePromptId, setActivePromptId] = useState(dossier.prompts[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [revealedStepCount, setRevealedStepCount] = useState<Record<string, number>>({});
  const [showRecall, setShowRecall] = useState<Record<string, boolean>>({});
  const [showChecklist, setShowChecklist] = useState<Record<string, boolean>>({});
  const [showAnswerFrame, setShowAnswerFrame] = useState<Record<string, boolean>>({});
  const [showPitfalls, setShowPitfalls] = useState<Record<string, boolean>>({});
  const [activePageNumber, setActivePageNumber] = useState(dossier.pages[0]?.pageNumber ?? 1);

  const filteredPrompts = useMemo(() => {
    if (sectionFilter === "all") {
      return dossier.prompts;
    }
    const visibleIds = new Set(
      dossier.sections.find((section) => section.title === sectionFilter)?.promptIds ?? [],
    );
    return dossier.prompts.filter((prompt) => visibleIds.has(prompt.id));
  }, [dossier.prompts, dossier.sections, sectionFilter]);

  const current = filteredPrompts.find((prompt) => prompt.id === activePromptId) ?? filteredPrompts[0] ?? dossier.prompts[0];
  const currentIndex = filteredPrompts.findIndex((prompt) => prompt.id === current.id);
  const currentStepCount = revealedStepCount[current.id] ?? 0;
  const activePage =
    dossier.pages.find((page) => page.pageNumber === activePageNumber) ??
    dossier.pages.find((page) => page.pageNumber === current.pageNumber) ??
    dossier.pages[0];

  function jumpToPrompt(promptId: string) {
    const prompt = dossier.prompts.find((entry) => entry.id === promptId);
    if (!prompt) {
      return;
    }
    setActivePromptId(promptId);
    setActivePageNumber(prompt.pageNumber);
  }

  function selectSection(nextSection: string) {
    setSectionFilter(nextSection);
    const targetPrompts =
      nextSection === "all"
        ? dossier.prompts
        : dossier.prompts.filter((prompt) =>
            dossier.sections
              .find((section) => section.title === nextSection)
              ?.promptIds.includes(prompt.id),
          );
    if (targetPrompts[0]) {
      setActivePromptId(targetPrompts[0].id);
      setActivePageNumber(targetPrompts[0].pageNumber);
    }
  }

  return (
    <div className="exam-workbench">
      <div className="practice-header">
        <div>
          <p className="eyebrow">Original Exam Reconstruction</p>
          <h3>الامتحان سؤالًا بسؤال مع نص الصفحات الأصلية</h3>
        </div>
        <p className="practice-score">
          {currentIndex + 1} / {filteredPrompts.length}
        </p>
      </div>

      <div className="practice-progress">
        <span style={{ width: `${((currentIndex + 1) / Math.max(filteredPrompts.length, 1)) * 100}%` }} />
      </div>

      <div className="exam-section-strip">
        <button
          className={sectionFilter === "all" ? "choice-button choice-button--active" : "choice-button"}
          onClick={() => selectSection("all")}
          type="button"
        >
          كل الامتحان
        </button>
        {dossier.sections.map((section) => (
          <button
            key={section.title}
            className={sectionFilter === section.title ? "choice-button choice-button--active" : "choice-button"}
            onClick={() => selectSection(section.title)}
            type="button"
          >
            {section.title}
            <span className="choice-note">{section.promptIds.length} سؤال</span>
          </button>
        ))}
      </div>

      <div className="exam-workbench-grid">
        <aside className="exam-sidebar">
          <div className="practice-card">
            <p className="question-label">خريطة الأسئلة</p>
            <div className="exam-question-map">
              {filteredPrompts.map((prompt, promptIndex) => (
                <button
                  key={prompt.id}
                  className={prompt.id === current.id ? "choice-button choice-button--active" : "choice-button"}
                  onClick={() => jumpToPrompt(prompt.id)}
                  type="button"
                >
                  <strong>
                    س{promptIndex + 1} - ص{prompt.pageNumber}
                  </strong>
                  <span>{prompt.skillTag}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="practice-card">
            <p className="question-label">صفحات الورقة الأصلية</p>
            <div className="exam-page-strip">
              {dossier.pages.map((page) => (
                <button
                  key={page.pageNumber}
                  className={
                    activePage.pageNumber === page.pageNumber
                      ? "choice-button choice-button--active"
                      : "choice-button"
                  }
                  onClick={() => setActivePageNumber(page.pageNumber)}
                  type="button"
                >
                  <strong>صفحة {page.pageNumber}</strong>
                  <span>{page.promptIds.length} عناصر</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="exam-main-column">
          <div className="practice-card">
            <div className="lesson-meta">
              <span className="meta-pill">Page {current.pageNumber}</span>
              <span className="meta-pill meta-pill--warm">{current.sectionTitle}</span>
              <span className="meta-pill">{current.kind}</span>
              <span className="meta-pill">{current.skillTag}</span>
            </div>

            <p className="question-label">السؤال الحالي</p>
            <h4>{current.prompt}</h4>

            {current.linkedTopics.length ? (
              <ul className="inline-list">
                {current.linkedTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            ) : null}

            {current.options.length ? (
              <div className="choice-grid">
                {current.options.map((option) => (
                  <div key={option} className="choice-button choice-button--static">
                    {option}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="callout">
              <strong>النص المستخرج لهذا السؤال:</strong>
              {current.originalLines.map((line) => (
                <p key={`${current.id}-${line}`}>{line}</p>
              ))}
            </div>

            <label className="answer-field">
              <span>جوابك أو خطواتك</span>
              <textarea
                className="answer-textarea"
                onChange={(event) =>
                  setNotes((previous) => ({
                    ...previous,
                    [current.id]: event.target.value,
                  }))
                }
                rows={8}
                value={notes[current.id] ?? ""}
              />
            </label>

            <div className="practice-actions">
              <button
                className="action-button action-button--ghost"
                onClick={() =>
                  setShowRecall((previous) => ({
                    ...previous,
                    [current.id]: !previous[current.id],
                  }))
                }
                type="button"
              >
                فهم المطلوب
              </button>
              <button
                className="action-button"
                onClick={() =>
                  setRevealedStepCount((previous) => ({
                    ...previous,
                    [current.id]: Math.min(current.startSteps.length, (previous[current.id] ?? 0) + 1),
                  }))
                }
                type="button"
              >
                الخطوة التالية
              </button>
              <button
                className="action-button action-button--ghost"
                onClick={() =>
                  setShowAnswerFrame((previous) => ({
                    ...previous,
                    [current.id]: !previous[current.id],
                  }))
                }
                type="button"
              >
                قالب الجواب
              </button>
              <button
                className="action-button action-button--ghost"
                onClick={() =>
                  setShowPitfalls((previous) => ({
                    ...previous,
                    [current.id]: !previous[current.id],
                  }))
                }
                type="button"
              >
                أخطاء شائعة
              </button>
              <button
                className="action-button action-button--ghost"
                onClick={() =>
                  setShowChecklist((previous) => ({
                    ...previous,
                    [current.id]: !previous[current.id],
                  }))
                }
                type="button"
              >
                تحقق ذاتي
              </button>
            </div>

            {showRecall[current.id] ? (
              <div className="hint-stack">
                <p>{current.recallFirst}</p>
              </div>
            ) : null}

            {currentStepCount > 0 ? (
              <div className="hint-stack">
                {current.startSteps.slice(0, currentStepCount).map((step) => (
                  <p key={step}>• {step}</p>
                ))}
              </div>
            ) : null}

            {showAnswerFrame[current.id] ? (
              <div className="feedback feedback--good">
                {current.answerFrame.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            ) : null}

            {showPitfalls[current.id] ? (
              <div className="feedback feedback--bad">
                {current.pitfalls.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            ) : null}

            {showChecklist[current.id] ? (
              <div className="feedback feedback--good">
                {current.selfCheck.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            ) : null}
          </div>

          <div className="practice-nav">
            <button
              className="action-button action-button--ghost"
              disabled={currentIndex <= 0}
              onClick={() => jumpToPrompt(filteredPrompts[Math.max(currentIndex - 1, 0)].id)}
              type="button"
            >
              السابق
            </button>
            <button
              className="action-button"
              disabled={currentIndex >= filteredPrompts.length - 1}
              onClick={() =>
                jumpToPrompt(filteredPrompts[Math.min(currentIndex + 1, filteredPrompts.length - 1)].id)
              }
              type="button"
            >
              التالي
            </button>
          </div>
        </div>

        <aside className="exam-transcript-column">
          <div className="practice-card">
            <p className="question-label">النص الكامل للصفحة الأصلية</p>
            <div className="lesson-meta">
              <span className="meta-pill">Page {activePage.pageNumber}</span>
              <span className="meta-pill meta-pill--warm">{activePage.promptIds.length} عناصر مرتبطة</span>
            </div>
            <div className="exam-transcript">
              {activePage.transcript.map((line, index) => (
                <p key={`${activePage.pageNumber}-${index}-${line}`}>{line}</p>
              ))}
            </div>
          </div>

          <div className="practice-card">
            <p className="question-label">كيف تستعملي هذه الورشة</p>
            <div className="hint-stack">
              <p>• افتحي السؤال من خريطة الورقة، ثم اقري السطر الأصلي قبل الحل.</p>
              <p>• استعملي "فهم المطلوب" قبل "الخطوة التالية" حتى ما يكونش الحل آلي.</p>
              <p>• إذا كان OCR ناقصًا في سطر واحد، ثبتيه من PDF ثم واصلي هنا.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
