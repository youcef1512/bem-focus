import { describe, expect, it } from "vitest";
import { buildInteractiveExam, examSources, lessons, studyPlan, subjects } from "../src/content";
import { buildMathExamSections } from "../src/features/math/remix";
import { isQuestionCorrect } from "../src/features/practice/evaluation";

describe("study plan", () => {
  it("covers the full 46-day sprint", () => {
    expect(studyPlan).toHaveLength(46);
    expect(studyPlan[0].date).toBe("2026-04-03");
    expect(studyPlan.at(-1)?.date).toBe("2026-05-18");
  });
});

describe("archive manifest", () => {
  it("includes 10 years across 9 subjects", () => {
    expect(examSources).toHaveLength(90);
    expect(new Set(examSources.map((entry) => entry.subjectId)).size).toBe(
      subjects.length,
    );
  });

  it("hosts most papers and corrections locally after hydration", () => {
    expect(examSources.filter((entry) => entry.localPaperPath).length).toBeGreaterThanOrEqual(75);
    expect(examSources.filter((entry) => entry.localCorrectionPath).length).toBeGreaterThanOrEqual(75);
  });
});

describe("content depth", () => {
  it("gives every non-math subject at least two lessons", () => {
    for (const subject of subjects.filter((entry) => entry.id !== "math")) {
      expect(lessons.filter((lesson) => lesson.subjectId === subject.id).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("builds multi-section guided exams outside math", () => {
    for (const subject of subjects.filter((entry) => entry.id !== "math")) {
      const exam = buildInteractiveExam(subject.id, 2025, "original");
      expect(exam).toBeDefined();
      expect(exam?.sections.length).toBeGreaterThanOrEqual(3);
      expect(exam?.sections.flatMap((section) => section.questions).length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("math remix", () => {
  it("is deterministic for the same seed", () => {
    const first = buildMathExamSections(2025, "remix", 2025);
    const second = buildMathExamSections(2025, "remix", 2025);
    expect(first[0].questions[0]).toEqual(second[0].questions[0]);
  });
});

describe("practice evaluation", () => {
  it("accepts numeric answers within tolerance", () => {
    const question = buildMathExamSections(2025, "original", 2025)[2].questions[0];
    if (question.type !== "number") {
      throw new Error("Unexpected question type");
    }
    expect(isQuestionCorrect(question, String(question.answer))).toBe(true);
  });
});
