import type { PhaseId, StudyDay, SubjectId } from "./schema";

const FOUNDATION_START = new Date("2026-04-03T00:00:00");
const FOUNDATION_END = new Date("2026-04-17T00:00:00");
const TRANSFER_END = new Date("2026-05-08T00:00:00");
const CONSOLIDATION_END = new Date("2026-05-18T00:00:00");

const supportRotation: SubjectId[] = [
  "french",
  "english",
  "arabic",
  "physics",
  "science",
  "historygeo",
  "islamic",
  "civics",
];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function resolvePhase(date: Date): PhaseId {
  if (date <= FOUNDATION_END) {
    return "foundation";
  }

  if (date <= TRANSFER_END) {
    return "transfer";
  }

  return "consolidation";
}

function headlineForPhase(phase: PhaseId, dayNumber: number) {
  switch (phase) {
    case "foundation":
      return `اليوم ${dayNumber}: نبني الأساس ونصلح الضعف`;
    case "transfer":
      return `اليوم ${dayNumber}: نحول الفهم إلى أداء امتحاني`;
    case "consolidation":
      return `اليوم ${dayNumber}: تثبيت سريع وهادئ قبل BEM`;
  }
}

function blocksForPhase(phase: PhaseId, support: SubjectId) {
  if (phase === "foundation") {
    return [
      {
        label: "Reset",
        minutes: 5,
        task: "تنفس + إبعاد الهاتف + كتابة هدف الحصة في سطر واحد",
      },
      {
        label: "Math Recall",
        minutes: 10,
        task: "استرجاع سريع بدون دفتر: قانون أو فكرة رئيسية من أمس",
      },
      {
        label: "Math Build",
        minutes: 25,
        task: "درس رياضيات قصير + مثال محلول + تمرين واحد مستقل",
      },
      {
        label: "Support",
        minutes: 15,
        task: `مادة مساندة: ${support}`,
      },
      {
        label: "Close",
        minutes: 5,
        task: "اكتبي خطأ واحد وقع اليوم وكيف تتفاديه غداً",
      },
    ];
  }

  if (phase === "transfer") {
    return [
      {
        label: "Reset",
        minutes: 5,
        task: "هاتف بعيد + نظرة على خطة اليوم",
      },
      {
        label: "Math Drill",
        minutes: 20,
        task: "تمرين BEM أو جزء من موضوع سابق بتوقيت قصير",
      },
      {
        label: "Math Review",
        minutes: 15,
        task: "تصحيح + استخراج سبب الخطأ",
      },
      {
        label: "Support Exam",
        minutes: 15,
        task: `تطبيق قصير في ${support} أو ملخص سريع`,
      },
      {
        label: "Close",
        minutes: 5,
        task: "بطاقة حفظ قصيرة أو قانون واحد",
      },
    ];
  }

  return [
    {
      label: "Reset",
      minutes: 5,
      task: "هاتف بعيد + تذكير: المطلوب هدوء وثبات وليس ضغط",
    },
    {
      label: "Math Light",
      minutes: 15,
      task: "استرجاع قانونين + سؤال واحد سهل + سؤال متوسط",
    },
    {
      label: "Summary",
      minutes: 15,
      task: `ملخص مطبوع أو بطاقة ذاكرة في ${support}`,
    },
    {
      label: "Micro Exam",
      minutes: 10,
      task: "محاكاة قصيرة: جواب واحد مضبوط تحت توقيت",
    },
    {
      label: "Close",
      minutes: 5,
      task: "إيقاف المراجعة قبل التعب الذهني القوي",
    },
  ];
}

export function buildStudyPlan(): StudyDay[] {
  const days: StudyDay[] = [];
  let current = FOUNDATION_START;
  let index = 0;

  while (current <= CONSOLIDATION_END) {
    const phase = resolvePhase(current);
    const supportSubjectId = supportRotation[index % supportRotation.length];
    const dayNumber = days.length + 1;

    days.push({
      dayNumber,
      date: toIsoDate(current),
      phase,
      headline: headlineForPhase(phase, dayNumber),
      mainSubjectId: "math",
      supportSubjectId,
      blocks: blocksForPhase(phase, supportSubjectId),
      resetNote:
        phase === "consolidation"
          ? "إذا حسيتِ بتعب، وقفي. النوعية أهم من الكمية."
          : "جلسة قصيرة ومنظمة خير من جلسة طويلة مشتتة.",
    });

    current = addDays(current, 1);
    index += 1;
  }

  return days;
}

export const studyPlan = buildStudyPlan();
