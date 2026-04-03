import { Link, Navigate, useParams } from "react-router-dom";
import type { SubjectId } from "../content";
import { lessonById, summaryById, subjectById, subjects, examsForSubject } from "../content";
import { PrintActions, SectionHeading, Surface } from "../components/AppChrome";
import { PracticeDeck } from "../components/PracticeDeck";
import { FunctionPlot, TimelineStrip, TriangleSketch } from "../components/Visuals";

function visualFor(lessonId: string) {
  if (lessonId === "math-functions") {
    return <FunctionPlot />;
  }

  if (lessonId === "math-geometry") {
    return <TriangleSketch />;
  }

  if (lessonId === "historygeo-timeline") {
    return <TimelineStrip />;
  }

  return null;
}

export function SubjectsPage() {
  return (
    <>
      <SectionHeading
        description="كل مادة فيها دروس قصيرة، تدريب تفاعلي، وملخصات قابلة للطباعة."
        eyebrow="Subjects"
        title="المواد الأساسية في البرنامج"
      />
      <div className="subject-grid">
        {subjects.map((subject) => (
          <Surface key={subject.id} className="subject-card">
            <p className="eyebrow">{subject.shortLabel}</p>
            <h3>{subject.name}</h3>
            <p>{subject.overview}</p>
            <ul className="inline-list">
              {subject.focusAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <Link className="action-button" to={`/subjects/${subject.id}`}>
                فتح المادة
              </Link>
            </div>
          </Surface>
        ))}
      </div>
    </>
  );
}

export function SubjectDetailPage() {
  const params = useParams<{ subjectId: SubjectId }>();
  const subject = params.subjectId ? subjectById[params.subjectId] : undefined;

  if (!subject) {
    return <Navigate replace to="/subjects" />;
  }

  const subjectLessons = subject.lessonIds.map((lessonId) => lessonById[lessonId]);
  const subjectSummaries = subject.summaryIds.map((summaryId) => summaryById[summaryId]);
  const subjectExams = examsForSubject(subject.id);
  const primaryProgramme = subjectSummaries[0]?.programSections ?? subject.roadmap;

  return (
    <>
      <Surface className="subject-hero" style={{ borderColor: subject.accent }}>
        <SectionHeading eyebrow={subject.shortLabel} title={subject.name} description={subject.coaching} />
        <p>{subject.overview}</p>
        <ul className="inline-list">
          {subject.focusAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </Surface>

      <Surface>
        <SectionHeading eyebrow="Lessons" title="الدروس القصيرة" />
        <div className="list-stack">
          {subjectLessons.map((lesson) => (
            <div key={lesson.id} className="list-row">
              <div>
                <strong>{lesson.title}</strong>
                <p>{lesson.summary}</p>
              </div>
              <div className="hero-actions">
                <Link className="action-button" to={`/lessons/${lesson.id}`}>
                  افتحي الدرس
                </Link>
                <Link className="action-button action-button--ghost" to={`/practice/${lesson.id}`}>
                  Practice
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          eyebrow="Programme map"
          title="خريطة المراجعة بعمق"
          description="هذه ليست عناوين عامة فقط. هذا هو تقسيم المراجعة العملي داخل المادة."
        />
        <div className="list-stack">
          {primaryProgramme.map((block) => (
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
        <SectionHeading eyebrow="Summaries" title="ملخصات سريعة" />
        <div className="list-stack">
          {subjectSummaries.map((summary) => (
            <div key={summary.id} className="list-row">
              <div>
                <strong>{summary.title}</strong>
                <p>{summary.recap[0]}</p>
              </div>
              <a
                className="action-button action-button--ghost"
                download
                href={`/downloads/summaries/${summary.id}.html`}
              >
                تحميل HTML
              </a>
            </div>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          eyebrow="Archive"
          title="كل امتحانات 2016-2025 المرتبطة بالمادة"
          description="النسخ التفاعلية وملفات PDF المستضافة داخل المنصة موجودة هنا كاملة، ماشي غير آخر خمس سنوات."
        />
        <div className="list-stack">
          {subjectExams.map((exam) => (
            <div key={`${exam.subjectId}-${exam.year}`} className="list-row">
              <div>
                <strong>{exam.year}</strong>
                <p>{exam.label}</p>
              </div>
              <div className="hero-actions">
                <Link className="action-button" to={`/past-exams/${exam.subjectId}/${exam.year}`}>
                  فتح التمرين التفاعلي
                </Link>
                <a
                  className="action-button action-button--ghost"
                  href={exam.localPaperPath ?? exam.paperUrl}
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

export function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = params.lessonId ? lessonById[params.lessonId] : undefined;

  if (!lesson) {
    return <Navigate replace to="/subjects" />;
  }

  return (
    <>
      <Surface className="lesson-hero">
        <SectionHeading eyebrow={lesson.shortTitle} title={lesson.title} description={lesson.summary} />
        <div className="lesson-meta">
          <span className="meta-pill">{lesson.durationMinutes} min</span>
          <span className="meta-pill meta-pill--warm">{lesson.finishLine}</span>
        </div>
        <PrintActions htmlDownloadPath={`/downloads/lessons/${lesson.id}.html`} />
      </Surface>

      <Surface>
        <div className="two-column-grid">
          <div>
            <h3>قبل ما تبداي</h3>
            <p>{lesson.phoneAwayRitual}</p>
            <p>{lesson.recallWarmup}</p>
          </div>
          <div>
            <h3>هدف الحصة</h3>
            <ul className="inline-list">
              {lesson.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      </Surface>

      <Surface>
        <SectionHeading eyebrow="Walkthrough" title="الشرح خطوة بخطوة" />
        <div className="list-stack">
          {lesson.sections.map((section) => (
            <article key={section.title} className="lesson-section">
              <h3>{section.title}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul className="inline-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {section.callout ? <p className="callout">{section.callout}</p> : null}
            </article>
          ))}
        </div>
      </Surface>

      {visualFor(lesson.id) ? <Surface>{visualFor(lesson.id)}</Surface> : null}

      <Surface>
        <PracticeDeck questions={lesson.practice} title={`تطبيق: ${lesson.shortTitle}`} />
      </Surface>
    </>
  );
}

export function PracticePage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = params.lessonId ? lessonById[params.lessonId] : undefined;

  if (!lesson) {
    return <Navigate replace to="/subjects" />;
  }

  return (
    <>
      <SectionHeading
        description={lesson.finishLine}
        eyebrow="Practice mode"
        title={`تدريب مستقل: ${lesson.title}`}
      />
      <Surface>
        <PracticeDeck questions={lesson.practice} title={lesson.title} />
      </Surface>
      <Surface>
        <div className="hero-actions">
          <Link className="action-button action-button--ghost" to={`/lessons/${lesson.id}`}>
            رجوع إلى الشرح
          </Link>
        </div>
      </Surface>
    </>
  );
}
