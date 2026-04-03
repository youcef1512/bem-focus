export const SUBJECT_IDS = [
  "math",
  "arabic",
  "french",
  "english",
  "historygeo",
  "physics",
  "science",
  "islamic",
  "civics",
] as const;

export type SubjectId = (typeof SUBJECT_IDS)[number];

export type PhaseId = "foundation" | "transfer" | "consolidation";

export type QuestionChoice = {
  id: string;
  label: string;
  note?: string;
};

type QuestionBase = {
  id: string;
  prompt: string;
  context?: string;
  hints: string[];
  explanation: string;
  sourceRefs: string[];
};

export type MultipleChoiceQuestion = QuestionBase & {
  type: "multiple-choice";
  choices: QuestionChoice[];
  correctChoiceId: string;
};

export type ShortTextQuestion = QuestionBase & {
  type: "short-text";
  acceptedAnswers: string[];
};

export type NumericQuestion = QuestionBase & {
  type: "number";
  answer: number;
  tolerance?: number;
  suffix?: string;
};

export type ReorderQuestion = QuestionBase & {
  type: "reorder";
  items: string[];
  correctOrder: string[];
};

export type MultiSelectQuestion = QuestionBase & {
  type: "multi-select";
  choices: QuestionChoice[];
  correctChoiceIds: string[];
};

export type PracticeQuestion =
  | MultipleChoiceQuestion
  | ShortTextQuestion
  | NumericQuestion
  | ReorderQuestion
  | MultiSelectQuestion;

export type LessonSection = {
  title: string;
  body: string[];
  bullets?: string[];
  callout?: string;
};

export type Lesson = {
  id: string;
  subjectId: SubjectId;
  title: string;
  shortTitle: string;
  durationMinutes: number;
  difficulty: "repair" | "build" | "transfer";
  summary: string;
  goals: string[];
  phoneAwayRitual: string;
  recallWarmup: string;
  finishLine: string;
  sections: LessonSection[];
  practice: PracticeQuestion[];
  summarySheetId: string;
  sourceRefs: string[];
  examLinkYears: number[];
  visual: "triangle" | "function" | "timeline" | "none";
};

export type SummarySheet = {
  id: string;
  subjectId: SubjectId;
  title: string;
  recap: string[];
  memoryHooks: string[];
  formulas?: { label: string; value: string }[];
  examMoves: string[];
  sourceRefs: string[];
};

export type Subject = {
  id: SubjectId;
  name: string;
  shortLabel: string;
  accent: string;
  emphasis: "highest" | "high" | "medium";
  overview: string;
  focusAreas: string[];
  coaching: string;
  lessonIds: string[];
  summaryIds: string[];
};

export type ExamSource = {
  year: number;
  subjectId: SubjectId;
  label: string;
  paperUrl: string;
  correctionUrl: string;
  sourcePage: string;
  availability: "interactive" | "guided" | "paper";
};

export type ExamSection = {
  title: string;
  note: string;
  questions: PracticeQuestion[];
};

export type InteractiveExam = {
  id: string;
  subjectId: SubjectId;
  year: number;
  title: string;
  durationMinutes: number;
  mode: "original" | "remix";
  summary: string;
  sections: ExamSection[];
  sourceRefs: string[];
};

export type TimelineEvent = {
  id: string;
  yearLabel: string;
  title: string;
  story: string;
  whyItMatters: string;
};

export type StudyBlock = {
  label: string;
  minutes: number;
  task: string;
};

export type StudyDay = {
  dayNumber: number;
  date: string;
  phase: PhaseId;
  headline: string;
  mainSubjectId: SubjectId;
  supportSubjectId: SubjectId;
  blocks: StudyBlock[];
  resetNote: string;
};
