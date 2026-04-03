import { Link } from "react-router-dom";
import { historyTimeline, studyPlan, summarySheets, subjects, lessons, researchResources } from "../content";
import { PrintActions, SectionHeading, Surface } from "../components/AppChrome";
import { PracticeDeck } from "../components/PracticeDeck";

export function DailyPlanPage() {
  const grouped = {
    foundation: studyPlan.filter((day) => day.phase === "foundation"),
    transfer: studyPlan.filter((day) => day.phase === "transfer"),
    consolidation: studyPlan.filter((day) => day.phase === "consolidation"),
  };

  return (
    <>
      <SectionHeading
        description="الخطة كلها مبنية على 46 يوم من 03 أفريل 2026 إلى 18 ماي 2026."
        eyebrow="46-day sprint"
        title="الخطة اليومية"
      />
      {Object.entries(grouped).map(([phase, days]) => (
        <Surface key={phase}>
          <SectionHeading
            eyebrow={phase}
            title={
              phase === "foundation"
                ? "المرحلة 1: إصلاح الأساس"
                : phase === "transfer"
                  ? "المرحلة 2: نقل الفهم إلى الامتحان"
                  : "المرحلة 3: تثبيت أخير"
            }
          />
          <div className="list-stack">
            {days.map((day) => (
              <div key={day.date} className="list-row">
                <div>
                  <strong>
                    اليوم {day.dayNumber} - {day.date}
                  </strong>
                  <p>{day.headline}</p>
                </div>
                <div className="mini-bullets">
                  {day.blocks.slice(0, 2).map((block) => (
                    <span key={`${day.date}-${block.label}`}>{block.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      ))}
    </>
  );
}

export function HistoryTimelinePage() {
  const timelineQuestions = [
    {
      id: "timeline-order",
      type: "reorder" as const,
      prompt: "رتبي هذه المحطات المفصلية:",
      items: [
        "الاستقلال",
        "مجازر 8 ماي 1945",
        "بداية الاحتلال",
        "اندلاع الثورة التحريرية",
      ],
      correctOrder: [
        "بداية الاحتلال",
        "مجازر 8 ماي 1945",
        "اندلاع الثورة التحريرية",
        "الاستقلال",
      ],
      hints: ["1830 ثم 1945 ثم 1954 ثم 1962."],
      explanation: "هذا الترتيب يعطيك العمود الفقري للقصة التاريخية.",
      sourceRefs: ["BEM History/Geo archive 2016-2025"],
    },
  ];

  return (
    <>
      <SectionHeading
        description="اقرئيها كقصة واحدة: حدث -> أثر -> انتقال للمرحلة التالية."
        eyebrow="Timeline story"
        title="التاريخ كسلسلة مترابطة"
      />
      <Surface>
        <div className="timeline-list">
          {historyTimeline.map((event) => (
            <article key={event.id} className="timeline-event">
              <span>{event.yearLabel}</span>
              <h3>{event.title}</h3>
              <p>{event.story}</p>
              <p className="callout">{event.whyItMatters}</p>
            </article>
          ))}
        </div>
      </Surface>
      <Surface>
        <PracticeDeck questions={timelineQuestions} title="ثبتي التسلسل الزمني" />
      </Surface>
    </>
  );
}

export function SummariesPage() {
  return (
    <>
      <SectionHeading
        description="صفحات قصيرة للطباعة أو Save as PDF، مع hooks للذاكرة وحركات امتحانية."
        eyebrow="Summary sheets"
        title="الملخصات"
      />
      <div className="subject-grid">
        {summarySheets.map((summary) => (
          <Surface key={summary.id} className="summary-card">
            <p className="eyebrow">{subjects.find((subject) => subject.id === summary.subjectId)?.name}</p>
            <h3>{summary.title}</h3>
            <ul className="inline-list">
              {summary.recap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {summary.formulas ? (
              <div className="formula-grid">
                {summary.formulas.map((formula) => (
                  <div key={formula.label} className="formula-pill">
                    <strong>{formula.label}</strong>
                    <span>{formula.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <PrintActions htmlDownloadPath={`/downloads/summaries/${summary.id}.html`} />
          </Surface>
        ))}
      </div>
    </>
  );
}

export function DownloadsPage() {
  return (
    <>
      <SectionHeading
        description="كل درس عنده HTML منفصل يفتح حتى بدون إنترنت، والنسخة الكاملة موجودة كحزمة مضغوطة."
        eyebrow="Offline pack"
        title="التحميلات والطباعة"
      />
      <Surface>
        <div className="hero-actions">
          <a className="action-button" download href="/downloads/offline-pack.zip">
            تحميل الحزمة الكاملة
          </a>
          <a className="action-button action-button--ghost" download href="/downloads/index.html">
            فتح فهرس Offline
          </a>
        </div>
      </Surface>

      <Surface>
        <SectionHeading eyebrow="Lessons" title="دروس HTML" />
        <div className="list-stack">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="list-row">
              <div>
                <strong>{lesson.title}</strong>
                <p>{lesson.summary}</p>
              </div>
              <div className="hero-actions">
                <a className="action-button action-button--ghost" download href={`/downloads/lessons/${lesson.id}.html`}>
                  تحميل
                </a>
                <Link className="action-button" to={`/lessons/${lesson.id}`}>
                  فتح داخل الموقع
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading eyebrow="Summaries" title="ملخصات HTML" />
        <div className="list-stack">
          {summarySheets.map((summary) => (
            <div key={summary.id} className="list-row">
              <div>
                <strong>{summary.title}</strong>
              </div>
              <a className="action-button action-button--ghost" download href={`/downloads/summaries/${summary.id}.html`}>
                تحميل
              </a>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading eyebrow="Sources" title="المصادر المعتمدة" />
        <div className="list-stack">
          {researchResources.map((resource) => (
            <div key={resource.url} className="list-row">
              <div>
                <strong>{resource.label}</strong>
                <p>{resource.url}</p>
              </div>
              <a className="action-button action-button--ghost" href={resource.url} target="_blank">
                فتح
              </a>
            </div>
          ))}
        </div>
      </Surface>
    </>
  );
}
