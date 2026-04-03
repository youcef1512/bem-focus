import { describe, expect, it } from "vitest";
import { examSources, studyPlan, subjects } from "../src/content";
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
