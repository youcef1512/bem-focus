import archiveManifest from "../data/bemArchive.generated.json";
import { buildMathExamSections } from "../features/math/remix";
import type { ExamSection, ExamSource, InteractiveExam, SubjectId } from "./schema";

type ArchiveJson = {
  generatedAt: string;
  source: string;
  entries: ExamSource[];
};

const manifest = archiveManifest as ArchiveJson;

export const examSources: ExamSource[] = manifest.entries;

export function examSourceFor(subjectId: SubjectId, year: number) {
  return examSources.find(
    (entry) => entry.subjectId === subjectId && entry.year === year,
  );
}

export function examsForSubject(subjectId: SubjectId) {
  return examSources
    .filter((entry) => entry.subjectId === subjectId)
    .sort((left, right) => right.year - left.year);
}

function guidedSections(subjectId: SubjectId): ExamSection[] {
  switch (subjectId) {
    case "arabic":
      return [
        {
          title: "فهم النص",
          note: "تدريب سريع على استخراج الفكرة والسبب.",
          questions: [
            {
              id: "ar-exam-1",
              type: "short-text",
              prompt: "إذا طلب منك الكاتب سبب ظاهرة ما، ماذا تبحثين في النص؟",
              acceptedAnswers: [
                "أبحث عن الجملة التي تفسر السبب",
                "الجملة التي تفسر السبب",
              ],
              hints: ["السبب يكون تفسيراً، لا عنواناً فقط."],
              explanation: "نبحث عن العبارة التي تجيب عن لماذا.",
              sourceRefs: ["BEM Arabic archive 2016-2025"],
            },
          ],
        },
      ];
    case "french":
      return [
        {
          title: "Production courte",
          note: "جواب بسيط وصحيح خير من تكلف زائد.",
          questions: [
            {
              id: "fr-exam-1",
              type: "multiple-choice",
              prompt: "Choisis la meilleure ouverture pour un petit avis.",
              choices: [
                { id: "a", label: "A mon avis, ..." },
                { id: "b", label: "Parce que..." },
                { id: "c", label: "Quand même..." },
              ],
              correctChoiceId: "a",
              hints: ["L’introduction doit annoncer l’avis."],
              explanation: "A mon avis is a clear opener for an opinion.",
              sourceRefs: ["BEM French archive 2016-2025"],
            },
          ],
        },
      ];
    case "english":
      return [
        {
          title: "Reading and sentence building",
          note: "تمرين صغير قريب من شكل BEM.",
          questions: [
            {
              id: "en-exam-1",
              type: "short-text",
              prompt: "Write one short sentence using: protect / environment",
              acceptedAnswers: [
                "We must protect the environment.",
                "we must protect the environment",
              ],
              hints: ["Subject + modal + verb + object."],
              explanation: "A short, correct sentence is enough.",
              sourceRefs: ["BEM English archive 2016-2025"],
            },
          ],
        },
      ];
    case "historygeo":
      return [
        {
          title: "Chronology and explanation",
          note: "سؤالين مركزين على التسلسل والسبب.",
          questions: [
            {
              id: "hg-exam-1",
              type: "reorder",
              prompt: "رتبي: مؤتمر الصومام - الاستقلال - اندلاع الثورة",
              items: ["مؤتمر الصومام", "الاستقلال", "اندلاع الثورة"],
              correctOrder: ["اندلاع الثورة", "مؤتمر الصومام", "الاستقلال"],
              hints: ["1954 ثم 1956 ثم 1962."],
              explanation: "هذا هو التسلسل الزمني الصحيح.",
              sourceRefs: ["BEM History/Geo archive 2016-2025"],
            },
          ],
        },
      ];
    case "physics":
      return [
        {
          title: "Question numérique",
          note: "قانون ثم تعويض ثم وحدة.",
          questions: [
            {
              id: "phy-exam-1",
              type: "number",
              prompt: "تيار شدته 2 A ومقاومة 5 Ω. ما التوتر U؟",
              answer: 10,
              suffix: "V",
              hints: ["استعملي U = R × I."],
              explanation: "5 × 2 = 10 V.",
              sourceRefs: ["BEM Physics archive 2016-2025"],
            },
          ],
        },
      ];
    case "science":
      return [
        {
          title: "سلسلة علمية",
          note: "الفهم على شكل آلية.",
          questions: [
            {
              id: "sci-exam-1",
              type: "short-text",
              prompt: "في استجابة عصبية بسيطة، ماذا يأتي بعد المستقبل الحسي؟",
              acceptedAnswers: ["العصب", "عصب"],
              hints: ["فكري في مسار الرسالة."],
              explanation: "الرسالة العصبية تنتقل عبر عصب.",
              sourceRefs: ["BEM Science archive 2016-2025"],
            },
          ],
        },
      ];
    case "islamic":
      return [
        {
          title: "قيمة وتطبيق",
          note: "المطلوب غالباً تطبيق واضح ومباشر.",
          questions: [
            {
              id: "isl-exam-1",
              type: "short-text",
              prompt: "كيف تطبقين قيمة الأمانة في الدراسة؟",
              acceptedAnswers: ["لا أغش وأحافظ على الأمانة", "أبتعد عن الغش"],
              hints: ["جواب قصير وسلوكي."],
              explanation: "التطبيق يكون سلوكاً عملياً واضحاً.",
              sourceRefs: ["BEM Islamic archive 2016-2025"],
            },
          ],
        },
      ];
    case "civics":
      return [
        {
          title: "حق وواجب",
          note: "تمييز المفاهيم مع مثال بسيط.",
          questions: [
            {
              id: "civ-exam-1",
              type: "multiple-choice",
              prompt: "أي عبارة تمثل حقاً؟",
              choices: [
                { id: "a", label: "التمدرس" },
                { id: "b", label: "احترام القانون" },
                { id: "c", label: "المحافظة على الممتلكات العامة" },
              ],
              correctChoiceId: "a",
              hints: ["الحق شيء تستفيد منه."],
              explanation: "التمدرس من الحقوق الأساسية.",
              sourceRefs: ["BEM Civics archive 2016-2025"],
            },
          ],
        },
      ];
    default:
      return [];
  }
}

export function buildInteractiveExam(
  subjectId: SubjectId,
  year: number,
  mode: "original" | "remix",
  remixSeed = year,
): InteractiveExam | undefined {
  const source = examSourceFor(subjectId, year);
  if (!source) {
    return undefined;
  }

  if (subjectId === "math") {
    return {
      id: `exam-${subjectId}-${year}-${mode}`,
      subjectId,
      year,
      title:
        mode === "original"
          ? `رياضيات BEM ${year} - صيغة تفاعلية`
          : `رياضيات BEM ${year} - Remix`,
      durationMinutes: 75,
      mode,
      summary:
        mode === "original"
          ? "محاكاة تفاعلية بنفس البنية العامة: جبر، دوال/هندسة، ثم وضعية مركبة."
          : "نفس الأفكار لكن بأرقام جديدة حتى يتحقق الاسترجاع والفهم الحقيقي.",
      sections: buildMathExamSections(year, mode, remixSeed),
      sourceRefs: [source.paperUrl, source.correctionUrl],
    };
  }

  return {
    id: `exam-${subjectId}-${year}-${mode}`,
    subjectId,
    year,
    title:
      mode === "original"
        ? `${source.label} - Guided`
        : `${source.label} - Smart remix`,
    durationMinutes: 35,
    mode,
    summary:
      "الموضوع الأصلي متوفر كرابط PDF، وهنا نقدمو تدريباً موجهاً على نفس المهارات المتكررة.",
    sections: guidedSections(subjectId),
    sourceRefs: [source.paperUrl, source.correctionUrl],
  };
}
