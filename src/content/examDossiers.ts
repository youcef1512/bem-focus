import dossiersJson from "../data/examDossiers.generated.json";
import type { ExamDossier, SubjectId } from "./schema";

type DossierJson = {
  generatedAt: string;
  source: string;
  entries: ExamDossier[];
};

const manifest = dossiersJson as DossierJson;

export const examDossiers = manifest.entries;

export function examDossierFor(subjectId: SubjectId, year: number) {
  return examDossiers.find((entry) => entry.subjectId === subjectId && entry.year === year);
}
