import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { examSources, studyPlan, subjects, subjectById } from "../content";
import { PrintActions, SectionHeading, Surface } from "../components/AppChrome";
import { TimelineStrip } from "../components/Visuals";

function currentStudyDay() {
  const todayIso = new Date().toISOString().slice(0, 10);
  return (
    studyPlan.find((day) => day.date === todayIso) ??
    studyPlan[0]
  );
}

export function HomePage() {
  const today = currentStudyDay();
  const latestMath = examSources
    .filter((entry) => entry.subjectId === "math")
    .sort((left, right) => right.year - left.year)[0];

  return (
    <>
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="hero-grid"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="hero-copy">
          <p className="eyebrow">Calm notebook mode</p>
          <h2>برنامج قصير، واضح، ومبني خصيصاً لآخر 46 يوم قبل BEM</h2>
          <p className="hero-text">
            نخدمو بالميني-دروس، الاسترجاع النشط، ومواضيع BEM التفاعلية. الرياضيات
            هي المسار الأعمق، لكن كامل المواد الأساسية موجودة مع ملخصات وطباعة.
          </p>
          <div className="hero-actions">
            <Link className="action-button" to="/daily-plan">
              افتحي خطة اليوم
            </Link>
            <Link className="action-button action-button--ghost" to="/subjects/math">
              ابدئي بالرياضيات
            </Link>
            {latestMath ? (
              <Link
                className="action-button action-button--ghost"
                to={`/past-exams/math/${latestMath.year}`}
              >
                موضوع رياضيات {latestMath.year}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="hero-side">
          <div className="stat-band">
            <div>
              <strong>46</strong>
              <span>يوماً</span>
            </div>
            <div>
              <strong>9</strong>
              <span>مواد</span>
            </div>
            <div>
              <strong>{examSources.length}</strong>
              <span>روابط أرشيف</span>
            </div>
          </div>
          <div className="phone-ritual">
            <p className="eyebrow">طريقة الدراسة</p>
            <h3>STAIRS داخل المراجعة</h3>
            <p>Step, test, explain, recall, then move.</p>
            <ul className="inline-list">
              <li>1. الهاتف بعيد</li>
              <li>2. سؤال استرجاع سريع</li>
              <li>3. مثال محلول</li>
              <li>4. تمرين مستقل</li>
              <li>5. تصحيح قصير</li>
            </ul>
          </div>
        </div>
      </motion.section>

      <Surface className="today-surface">
        <SectionHeading
          description="هذا هو القالب الافتراضي لليوم. إذا فتحتي التطبيق في يوم آخر، راح يوافق التاريخ تلقائياً."
          eyebrow="Today"
          title={today.headline}
        />
        <div className="two-column-grid">
          <div>
            <p className="day-chip">
              المادة الرئيسية: {subjectById[today.mainSubjectId].name}
            </p>
            <p className="day-chip day-chip--secondary">
              مادة الدعم: {subjectById[today.supportSubjectId].name}
            </p>
            <div className="block-list">
              {today.blocks.map((block) => (
                <div key={`${today.date}-${block.label}`} className="block-row">
                  <strong>{block.label}</strong>
                  <span>{block.minutes} min</span>
                  <p>{block.task}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="coach-note">
            <h3>كيفاش تراجعي بلا ما تهلكي روحك</h3>
            <p>خدمة قصيرة + تكرار يومي خير من جلسة كبيرة وتعب كامل.</p>
            <ul className="inline-list">
              <li>بدلي المادة إذا حسيتِ دماغك طار.</li>
              <li>راجعي الخطأ، ماشي غير النتيجة.</li>
              <li>احفظي بالقصة والسلسلة، ماشي بالفقرات الطويلة.</li>
            </ul>
            <PrintActions />
          </div>
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          description="الرياضيات أولاً، ثم اللغات، ثم المواد العلمية والحفظية بتدوير خفيف."
          eyebrow="Priorities"
          title="التركيز حسب المادة"
        />
        <div className="subject-strip">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              className="subject-peek"
              style={{ borderColor: subject.accent }}
              to={`/subjects/${subject.id}`}
            >
              <strong>{subject.name}</strong>
              <p>{subject.overview}</p>
            </Link>
          ))}
        </div>
      </Surface>

      <Surface>
        <SectionHeading
          description="التاريخ يتقدم كقصة سلسلة، باش التواريخ ما يبقاوش مبعثرين."
          eyebrow="History chain"
          title="Timeline من 1830 إلى اليوم"
        />
        <TimelineStrip />
        <div className="hero-actions">
          <Link className="action-button action-button--ghost" to="/history-timeline">
            افتحي Timeline الكامل
          </Link>
        </div>
      </Surface>
    </>
  );
}
