import archiveManifest from "../data/bemArchive.generated.json";
import { buildMathExamSections } from "../features/math/remix";
import { buildGuidedExamSections } from "./guidedExamSections";
import type { ExamSource, InteractiveExam, SubjectId } from "./schema";

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
    durationMinutes: 50,
    mode,
    summary:
      "النسخة الأصلية PDF موجودة داخل المنصة، وهنا تدريب تفاعلي مقسم إلى أقسام تشبه بنية المادة: فهم، مفاهيم/لغة، ثم كتابة أو تطبيق.",
    sections: buildGuidedExamSections(subjectId),
    sourceRefs: [source.paperUrl, source.correctionUrl],
  };
}
