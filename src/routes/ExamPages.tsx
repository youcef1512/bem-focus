import { startTransition, useDeferredValue, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  buildInteractiveExam,
  examSourceFor,
  examSources,
  summaryById,
  subjectById,
  subjects,
  type SubjectId,
} from "../content";
import { PrintActions, SectionHeading, Surface } from "../components/AppChrome";
import { PracticeDeck } from "../components/PracticeDeck";

function programmeBlocksForSubject(subjectId: SubjectId) {
  const subject = subjectById[subjectId];
  const summary = subject.summaryIds
    .map((summaryId) => summaryById[summaryId])
    .find((entry) => entry?.programSections?.length);

  return summary?.programSections ?? subject.roadmap;
}

function examMovesForSubject(subjectId: SubjectId) {
  return Array.from(
    new Set(
      subjectById[subjectId].summaryIds.flatMap(
        (summaryId) => summaryById[summaryId]?.examMoves ?? [],
      ),
    ),
  );
}

function commonTrapsForSubject(subjectId: SubjectId) {
  return Array.from(
    new Set(
      subjectById[subjectId].summaryIds.flatMap(
        (summaryId) => summaryById[summaryId]?.commonTraps ?? [],
      ),
    ),
  );
}

function quickChecksForSubject(subjectId: SubjectId) {
  return Array.from(
    new Set(
      subjectById[subjectId].summaryIds.flatMap(
        (summaryId) => summaryById[summaryId]?.quickChecks ?? [],
      ),
    ),
  );
}

function coachingStepsForSubject(subjectId: SubjectId, sectionTitles: string[]) {
  const sectionMap = sectionTitles.join(" -> ");

  switch (subjectId) {
    case "math":
      return [
        `قسمي الورقة فورًا إلى: ${sectionMap}. ابدئي بالتمرين الذي تعرفين فكرته، وليس بالضرورة الأول.`,
        "في كل سؤال: اكتبي المعطيات، حددي المطلوب، ثم القانون أو الفكرة قبل أي حساب. هذا يمنع الضياع في الوسط.",
        "إذا كان السؤال فيه شكل أو دالة، ارجعي للرسم: سمي الأضلاع، حددي الوتر، أو اقرئي المستقيم قبل الحساب.",
        "بعد كل نتيجة: راجعي الإشارة والوحدة وهل العدد معقول. إذا لم يكن معقولًا، ارجعي خطوة فقط وليس الحل كاملًا.",
      ];
    case "french":
      return [
        `بنية الورقة هنا واضحة: ${sectionMap}. اكتبي فوق المسودة نوع كل جزء حتى لا تختلط compréhension مع langue أو production.`,
        "في compréhension: اقرئي السؤال أولًا، ثم عودي للنص وابحثي عن الكلمة المفتاحية نفسها أو مرادفها قبل كتابة الجواب.",
        "في langue: حددي هل المطلوب قاعدة، زمن، رابط، أو تحويل. لا تبدئي الجواب قبل تسمية القاعدة في ذهنك.",
        "في production écrite: اكتبي هيكلًا صغيرًا من 3 أسطر: idée, argument, mini-conclusion. البساطة الصحيحة تربح أكثر من الزخرفة المكسرة.",
      ];
    case "english":
      return [
        `قسمي الورقة إلى: ${sectionMap}. في كل جزء قولي لنفسك: reading أم grammar أم writing؟`,
        "في reading: ابحثي عن the main idea أولًا، ثم المعلومة الدقيقة. لا تنقلي سطرًا كاملًا إذا كانت كلمة أو جملة قصيرة تكفي.",
        "في grammar: اختاري الصيغة الآمنة. جملة قصيرة صحيحة خير من تركيب طويل فيه خطأ زمن أو رابط.",
        "في writing: ابني paragraph صغيرًا من topic sentence ثم support ثم ending sentence، واستعملي should / because / in my opinion فقط إذا كنت متأكدة منها.",
      ];
    case "historygeo":
      return [
        `خريطة الورقة عادة تدور حول: ${sectionMap}. قبل الحل، ثبتي في رأسك محور التاريخ أو الجغرافيا أو المنهجية.`,
        "في التاريخ: اشتغلي بثلاثية ثابتة: ماذا حدث؟ لماذا حدث؟ وما النتيجة؟ إذا ضعتِ، ارجعي لهذه الثلاثية.",
        "في الترتيب الزمني: اكتبي التواريخ الأساسية أولًا على المسودة ثم رتبي الأحداث فوقها. لا ترتبي من الذاكرة الضبابية فقط.",
        "في الجغرافيا أو التعاريف: جواب قصير، مفهوم واضح، ومثال واحد صحيح أفضل من فقرة طويلة مبهمة.",
      ];
    case "physics":
      return [
        `قسمي الورقة إلى: ${sectionMap}. حددي سريعًا أين يوجد قانون وأين يوجد تفسير أو قراءة دارة.`,
        "في الحساب: اكتبي القانون أولًا، ثم عوضي بالقيم، ثم اكتبي الوحدة في السطر الأخير. لا تقفزي مباشرة للأرقام.",
        "إذا كان السؤال حول دارة أو جهاز: سمي العناصر واتجاه التيار أو نوع الربط قبل الاستنتاج.",
        "في آخر كل تمرين: اسألي نفسك هل النتيجة معقولة؟ إذا كانت السرعة أو التوتر أو المقاومة غير منطقية، فهناك سطر يحتاج مراجعة.",
      ];
    default:
      return [
        `الورقة مقسمة إلى: ${sectionMap}. اكتبي نوع كل جزء قبل أن تبدئي حتى لا تجاوبي بطريقة غير مناسبة.`,
        "ابحثي دائمًا عن الكلمة المفتاحية التي تحدد المهارة: تعريف، تفسير، ترتيب، قاعدة، أو كتابة.",
        "إذا كان السؤال ثقيلًا، ارجعي إلى المحور المقابل له في البرنامج الموجود أسفل هذه الصفحة، ثم عودي لنفس السؤال مباشرة.",
        "بعد إنهاء كل جزء، راجعي هل جوابك قصير وواضح ومرتبط بالمطلوب، لا مجرد معلومات عامة.",
      ];
  }
}

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
                    : "Guided practice + hosted PDF"}
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
  if (!source) {
    return <Navigate replace to="/past-exams" />;
  }

  const mode = searchParams.get("mode") === "remix" ? "remix" : "original";
  const exam = buildInteractiveExam(subjectId, year, mode, seed);
  const subject = subjectById[subjectId];
  const programmeBlocks = programmeBlocksForSubject(subjectId);
  const examMoves = examMovesForSubject(subjectId);
  const commonTraps = commonTrapsForSubject(subjectId);
  const quickChecks = quickChecksForSubject(subjectId);
  const coachingSteps = coachingStepsForSubject(
    subjectId,
    exam?.sections.map((section) => section.title) ?? [],
  );
  const summaryDownloads = subject.summaryIds
    .map((summaryId) => summaryById[summaryId])
    .filter((entry) => entry);

  if (!exam) {
    return <Navigate replace to="/past-exams" />;
  }

  return (
    <>
      <Surface className="lesson-hero">
        <SectionHeading
          eyebrow="Exam workbench"
          title={`${subject.name} ${year}`}
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

      <Surface>
        <SectionHeading
          eyebrow="Exam coach"
          title="كيف تخدمي هذه الورقة فعلاً"
          description="هنا لا يوجد OCR ولا نص مفكك. البداية تكون من منهجية واضحة: خريطة الورقة، خطوات الإنجاز، ثم الرجوع إلى PDF الأصلي، وبعدها التثبيت التفاعلي."
        />
        <div className="two-column-grid">
          <article className="lesson-section">
            <h3>من أول دقيقة إلى آخر دقيقة</h3>
            <div className="list-stack">
              {coachingSteps.map((step, index) => (
                <div key={step} className="block-row">
                  <p className="eyebrow">Step {index + 1}</p>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="lesson-section">
            <h3>خريطة المهارات داخل الورقة</h3>
            <div className="list-stack">
              {exam.sections.map((section) => (
                <div key={section.title} className="block-row">
                  <div className="hero-actions">
                    <strong>{section.title}</strong>
                    <span className="meta-pill">{section.questions.length} أسئلة تدريبية</span>
                  </div>
                  <p>{section.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="hero-actions">
          {summaryDownloads.map((summary) => (
            <a
              key={summary.id}
              className="action-button action-button--ghost"
              download
              href={`/downloads/summaries/${summary.id}.html`}
            >
              تحميل {summary.title}
            </a>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          eyebrow="Programme depth"
          title="محاور البرنامج الكامل التي ترجع لها هذه الورقة"
          description="إذا تعثرتِ في جزء من الامتحان، ارجعي مباشرة إلى هذا المحور بدل الدوران العشوائي بين الصفحات."
        />
        <div className="subject-grid">
          {programmeBlocks.map((block) => (
            <article key={block.title} className="lesson-section">
              <h3>{block.title}</h3>
              <ul className="inline-list">
                {block.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          eyebrow="Exam habits"
          title="كيف تربحي النقاط وتتفادي الأخطاء"
          description="هذه النقاط تجمع بين طريقة الإنجاز السريعة والأخطاء التي تتكرر عادة في هذه المادة."
        />
        <div className="two-column-grid">
          <article className="lesson-section">
            <h3>حركات تربحك النقاط</h3>
            <div className="list-stack">
              {examMoves.map((move) => (
                <div key={move} className="block-row">
                  <p>{move}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="lesson-section">
            <h3>أخطاء لازم ما تتعاودش</h3>
            <div className="list-stack">
              {commonTraps.map((trap) => (
                <div key={trap} className="block-row">
                  <p>{trap}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        {quickChecks.length ? (
          <>
            <h3>تحقق ذاتي قبل ما تشوفي التصحيح</h3>
            <ul className="inline-list">
              {quickChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </>
        ) : null}
      </Surface>

      <Surface>
        <SectionHeading
          eyebrow="Hosted archive"
          title="نسخة PDF كاملة داخل منصتنا"
          description="هذه هي الورقة الأصلية والتصحيح كما هما. استعمليهما كمرجع بصري بعد ما تثبتي الخطة من لوحة المدرب الموجودة فوق."
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
