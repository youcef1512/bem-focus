import type { PracticeQuestion } from "../../content/schema";

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?،؛]/g, "");
}

export function isQuestionCorrect(
  question: PracticeQuestion,
  answer: string | string[],
) {
  switch (question.type) {
    case "multiple-choice":
      return answer === question.correctChoiceId;
    case "short-text":
      if (typeof answer !== "string") {
        return false;
      }
      return question.acceptedAnswers.some(
        (accepted) => normalizeText(accepted) === normalizeText(answer),
      );
    case "number":
      if (typeof answer !== "string") {
        return false;
      }
      const parsed = Number(answer);
      if (Number.isNaN(parsed)) {
        return false;
      }
      return Math.abs(parsed - question.answer) <= (question.tolerance ?? 0);
    case "reorder":
      if (!Array.isArray(answer)) {
        return false;
      }
      return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
    case "multi-select":
      if (!Array.isArray(answer)) {
        return false;
      }
      return (
        [...answer].sort().join("|") ===
        [...question.correctChoiceIds].sort().join("|")
      );
  }
}
