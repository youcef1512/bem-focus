import { useMemo, useState } from "react";
import { summaryById, subjectById } from "../content";
import type { ExamDossier, ExamPromptCard, ProgramBlock, SubjectId } from "../content/schema";

type ExamPromptWorkbenchProps = {
  dossier: ExamDossier;
};

type StairItem = {
  title: string;
  body: string;
};

function matchesTopic(block: ProgramBlock, topic: string) {
  return (
    block.title.includes(topic) ||
    topic.includes(block.title) ||
    block.details.some((detail) => detail.includes(topic) || topic.includes(detail))
  );
}

function relevantProgramme(subjectId: SubjectId, prompt: ExamPromptCard) {
  const subject = subjectById[subjectId];
  const programme = subject.summaryIds
    .map((summaryId) => summaryById[summaryId]?.programSections ?? [])
    .flat();

  const matches = programme.filter((block) =>
    prompt.linkedTopics.some((topic) => matchesTopic(block, topic) || matchesTopic(block, prompt.skillTag)),
  );

  const deduped: ProgramBlock[] = [];
  for (const block of matches) {
    if (!deduped.some((entry) => entry.title === block.title)) {
      deduped.push(block);
    }
  }

  return deduped.slice(0, 3);
}

function buildStairs(subjectId: SubjectId, prompt: ExamPromptCard): StairItem[] {
  const base = [
    {
      title: "1. ثبتي المحور",
      body: `هذا السؤال تابع لمحور: ${prompt.skillTag}. قبل الجواب سميه بصوت واضح أو اكتبيه فوق الورقة.`,
    },
    {
      title: "2. رجّعي الفكرة القبلية",
      body: prompt.recallFirst,
    },
    {
      title: "3. ابني بداية الحل",
      body: prompt.startSteps[0] ?? "اكتبي أول خطوة صغيرة فقط ثم ثبتيها قبل الانتقال.",
    },
  ];

  if (subjectId === "math" || prompt.kind === "calculation") {
    return [
      base[0],
      {
        title: "2. اكتبي المعطيات ثم المطلوب",
        body: "لا تبدئي بالحساب مباشرة. سطري المعطيات، ثم اكتبي المطلوب، ثم القانون أو الفكرة المناسبة.",
      },
      {
        title: "3. افتحي الحل بخطوة واحدة",
        body: prompt.startSteps[0] ?? "اختاري أول تحويل أو أول قانون فقط، ثم اكملي بالتدرج.",
      },
      {
        title: "4. راقبي الإشارة والوحدة",
        body: "في آخر السطرين الأخيرين راجعي الإشارة، المعقولية، والوحدة النهائية.",
      },
    ];
  }

  if (subjectId === "historygeo" || subjectId === "civics" || subjectId === "islamic") {
    return [
      base[0],
      {
        title: "2. حددي نوع المطلوب",
        body: "هل السؤال يطلب تاريخًا، تعريفًا، سببًا، نتيجةً، أم فقرةً؟ هذا يحدد شكل الجواب من البداية.",
      },
      {
        title: "3. اربطي الجواب بدليل",
        body: "بعد الفكرة الأساسية أضيفي تاريخًا أو مثالًا أو نتيجةً حتى لا يبقى الجواب عامًا.",
      },
      {
        title: "4. اختمي بجملة مباشرة",
        body: "الجواب القصير المنظم أفضل من كلام كثير بلا رابط واضح مع التعليمة.",
      },
    ];
  }

  if (subjectId === "arabic" || subjectId === "french" || subjectId === "english") {
    if (prompt.skillTag === "Compréhension" || prompt.skillTag === "Reading") {
      return [
        base[0],
        {
          title: "2. حددي كلمة السؤال المفتاحية",
          body: "في أسئلة الفهم: pourquoi / selon le texte / true-false / main idea ... هذه الكلمة تحدد أين تبحثين في السند.",
        },
        {
          title: "3. ارجعي إلى السطر المناسب فقط",
          body: "لا تعيدي قراءة النص كله بعشوائية. ابحثي عن الجملة أو الفقرة الأقرب للكلمة المفتاحية ثم استخرجي الفكرة.",
        },
        {
          title: "4. صيغي الجواب بجملة قصيرة",
          body: "أفضل جواب هنا هو جملة قصيرة ونظيفة تستعمل مفردة من السند بدل ترجمة طويلة أو نسخ كامل.",
        },
      ];
    }

    if (prompt.skillTag === "Lexique" || prompt.skillTag === "Vocabulary") {
      return [
        base[0],
        {
          title: "2. ثبتي الكلمة المستهدفة",
          body: "حددي الكلمة أو العبارة المطلوبة أولاً ولا تخرجيها من سياقها.",
        },
        {
          title: "3. استعملي الجملة المحيطة كدليل",
          body: "المعنى الصحيح يخرج من الجملة قبلها أو بعدها: هل الكلمة تشير إلى سبب، معنى، أو بديل لغوي؟",
        },
        {
          title: "4. اختاري معنىً منسجمًا لا شرحًا عامًا",
          body: "اكتبي المعنى أو المرادف الذي يصلح مكانها في نفس الجملة تقريبًا.",
        },
      ];
    }

    if (prompt.skillTag === "Langue et grammaire" || prompt.skillTag === "Grammar") {
      return [
        base[0],
        {
          title: "2. اسألي: ما الذي سيتغير؟",
          body: "هل المطلوب ضمير، عدد، زمن، ربط، أم إعادة كتابة؟ هذه الخطوة تمنعك من تغيير الجملة كلها.",
        },
        {
          title: "3. انسخي ثم بدلي الجزء المقصود فقط",
          body: "ثبتي هيكل الجملة، ثم غيّري العنصر المطلوب وحده قبل مراجعة المطابقة.",
        },
        {
          title: "4. افحصي المطابقة النهائية",
          body: "راجعي الفعل، الضمير، المفرد/الجمع، وعلامات الترقيم حتى لا تسقطي في أخطاء التحويل.",
        },
      ];
    }

    if (prompt.skillTag === "Production écrite" || prompt.skillTag === "Writing") {
      return [
        base[0],
        {
          title: "2. حضري موقفك قبل الكتابة",
          body: "حددي الرسالة الأساسية: نصيحة، إقناع، وصف، أو رأي. ثم اكتبي 3 أفكار قصيرة فقط.",
        },
        {
          title: "3. ابني الفقرة من 4 أجزاء",
          body: "افتتاحية قصيرة، فكرتان أو ثلاث مرتبات، مثال صغير أو تعليل، ثم خاتمة بسيطة.",
        },
        {
          title: "4. احمي اللغة من الفوضى",
          body: "استعملي جملاً قصيرة وروابط واضحة بدل جمل طويلة مكسرة.",
        },
      ];
    }

    return [
      base[0],
      {
        title: "2. حددي هل هو فهم أم لغة أم كتابة",
        body: "لا تخلطي بين سؤال الفهم وسؤال القاعدة أو الإنتاج. كل واحد عنده طريقة جواب مختلفة.",
      },
      {
        title: "3. خذي كلمة مفتاحية من السند",
        body: "في الفهم أو اللغة، استعملي كلمة دقيقة من النص أو القاعدة كي يبقى جوابك مربوطًا بالمطلوب.",
      },
      {
        title: "4. اكتبي جوابًا نظيفًا",
        body: "في الكتابة: افتتاحية قصيرة، فكرة واضحة، دعم صغير، ثم خاتمة قصيرة.",
      },
    ];
  }

  return base;
}

function buildTransferMission(subjectId: SubjectId, prompt: ExamPromptCard) {
  if (subjectId === "math" || prompt.kind === "calculation") {
    return "بعد هذا السؤال، أعيدي نفس الفكرة مع تغيير عدد واحد فقط: عدد أكبر، إشارة مختلفة، أو وحدة أخرى.";
  }

  if (subjectId === "historygeo") {
    return "بعد الحل، حاولي إعادة نفس الجواب مرة ثانية لكن بصيغة: حدث -> سبب -> نتيجة.";
  }

  if (subjectId === "arabic") {
    return "بعد الحل، اكتبي جملة ثانية بنفس الفكرة ولكن بكلماتك أنت، لا بالنسخ الحرفي من السند.";
  }

  if (subjectId === "french" || subjectId === "english") {
    return "بعد الحل، أعيدي نفس المهارة في جملة أقصر وأوضح حتى يثبت النموذج الصحيح في الذاكرة.";
  }

  return "بعد الحل، أعيدي الجواب في سطر واحد منظم حتى تتأكد الفكرة الأساسية قبل الانتقال.";
}

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

  const current =
    filteredPrompts.find((prompt) => prompt.id === activePromptId) ??
    filteredPrompts[0] ??
    dossier.prompts[0];
  const currentIndex = filteredPrompts.findIndex((prompt) => prompt.id === current.id);
  const currentStepCount = revealedStepCount[current.id] ?? 0;
  const activePage =
    dossier.pages.find((page) => page.pageNumber === activePageNumber) ??
    dossier.pages.find((page) => page.pageNumber === current.pageNumber) ??
    dossier.pages[0];

  const subject = subjectById[dossier.subjectId];
  const stairs = useMemo(() => buildStairs(dossier.subjectId, current), [current, dossier.subjectId]);
  const programmeMatches = useMemo(
    () => relevantProgramme(dossier.subjectId, current),
    [current, dossier.subjectId],
  );
  const transferMission = useMemo(
    () => buildTransferMission(dossier.subjectId, current),
    [current, dossier.subjectId],
  );

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
            dossier.sections.find((section) => section.title === nextSection)?.promptIds.includes(prompt.id),
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
          <h3>الورقة الأصلية مفككة إلى أسئلة مع سلم بناء قبل الجواب</h3>
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
            <p className="question-label">هذا السؤال مربوط بالبرنامج</p>
            <p className="practice-context">{subject.name}</p>
            <div className="programme-mini-stack">
              {programmeMatches.length ? (
                programmeMatches.map((block) => (
                  <article key={`${current.id}-${block.title}`} className="programme-mini-card">
                    <strong>{block.title}</strong>
                    <ul className="inline-list">
                      {block.details.slice(0, 5).map((detail) => (
                        <li key={`${block.title}-${detail}`}>{detail}</li>
                      ))}
                    </ul>
                  </article>
                ))
              ) : (
                <p className="callout">
                  هذا السؤال راجع غالبًا إلى محور <strong>{current.skillTag}</strong>. إذا شعرتِ أنه ثقيل، ارجعي أولًا
                  إلى ملخص المادة ثم عودي إليه.
                </p>
              )}
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
            <p className="question-label">سلم البناء قبل الجواب</p>
            <div className="stair-grid">
              {stairs.map((item) => (
                <article key={`${current.id}-${item.title}`} className="stair-card">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>

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

            <div className="transfer-note">
              <strong>بعد ما تحلي:</strong>
              <p>{transferMission}</p>
            </div>
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
              <p>• افتحي السؤال من الخريطة، ثم ثبتي المحور من سُلّم البناء قبل أن تبدئي الجواب.</p>
              <p>• إذا كان السؤال ثقيلًا، ارجعي إلى المحور المرتبط به في البرنامج ثم عودي مباشرة إلى نفس السؤال.</p>
              <p>• لا تنتقلي بسرعة. هدف هذه الورشة هو بناء طريقة حل قابلة للإعادة، وليس مجرد كتابة جواب واحد.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
