import { historyTimeline } from "./historyTimeline";
import { lessons } from "./lessons";
import { researchResources } from "./resources";
import { summarySheets } from "./summaries";
import { subjects } from "./subjects";
import { studyPlan } from "./studyPlan";

export { lessons, summarySheets, subjects, studyPlan, historyTimeline, researchResources };
export * from "./schema";
export * from "./exams";

export const lessonById = Object.fromEntries(
  lessons.map((lesson) => [lesson.id, lesson]),
);

export const summaryById = Object.fromEntries(
  summarySheets.map((summary) => [summary.id, summary]),
);

export const subjectById = Object.fromEntries(
  subjects.map((subject) => [subject.id, subject]),
);
