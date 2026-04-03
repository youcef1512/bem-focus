import { useState } from "react";
import { isQuestionCorrect } from "../features/practice/evaluation";
import type { PracticeQuestion } from "../content/schema";

type PracticeDeckProps = {
  title: string;
  questions: PracticeQuestion[];
};

function initialAnswer(question: PracticeQuestion): string | string[] {
  if (question.type === "reorder") {
    return [...question.items];
  }

  if (question.type === "multi-select") {
    return [];
  }

  return "";
}

export function PracticeDeck({ title, questions }: PracticeDeckProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hintCount, setHintCount] = useState<Record<string, number>>({});
  const current = questions[index];
  const currentAnswer = answers[current.id] ?? initialAnswer(current);
  const isChecked = checked[current.id] ?? false;
  const isCorrect = isChecked ? isQuestionCorrect(current, currentAnswer) : null;
  const hintsToShow = hintCount[current.id] ?? 0;

  function updateAnswer(value: string | string[]) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
  }

  function moveItem(offset: number, currentIndex: number) {
    if (!Array.isArray(currentAnswer)) {
      return;
    }

    const nextIndex = currentIndex + offset;
    if (nextIndex < 0 || nextIndex >= currentAnswer.length) {
      return;
    }

    const reordered = [...currentAnswer];
    const [item] = reordered.splice(currentIndex, 1);
    reordered.splice(nextIndex, 0, item);
    updateAnswer(reordered);
  }

  function toggleMultiSelect(choiceId: string) {
    const selected = Array.isArray(currentAnswer) ? currentAnswer : [];
    updateAnswer(
      selected.includes(choiceId)
        ? selected.filter((value) => value !== choiceId)
        : [...selected, choiceId],
    );
  }

  const score = questions.filter((question) => {
    const answer = answers[question.id] ?? initialAnswer(question);
    return checked[question.id] && isQuestionCorrect(question, answer);
  }).length;

  return (
    <div className="practice-deck">
      <div className="practice-header">
        <div>
          <p className="eyebrow">Recall Lab</p>
          <h3>{title}</h3>
        </div>
        <p className="practice-score">
          {score} / {questions.length}
        </p>
      </div>

      <div className="practice-progress">
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="practice-card">
        <p className="question-label">
          سؤال {index + 1} / {questions.length}
        </p>
        <h4>{current.prompt}</h4>
        {current.context ? <p className="practice-context">{current.context}</p> : null}

        {current.type === "multiple-choice" ? (
          <div className="choice-grid">
            {current.choices.map((choice) => (
              <button
                key={choice.id}
                className={
                  currentAnswer === choice.id ? "choice-button choice-button--active" : "choice-button"
                }
                onClick={() => updateAnswer(choice.id)}
                type="button"
              >
                {choice.label}
              </button>
            ))}
          </div>
        ) : null}

        {current.type === "short-text" || current.type === "number" ? (
          <label className="answer-field">
            <span>اكتبي جوابك</span>
            <input
              inputMode={current.type === "number" ? "decimal" : "text"}
              onChange={(event) => updateAnswer(event.target.value)}
              value={typeof currentAnswer === "string" ? currentAnswer : ""}
            />
          </label>
        ) : null}

        {current.type === "reorder" ? (
          <div className="reorder-list">
            {(Array.isArray(currentAnswer) ? currentAnswer : current.items).map(
              (item, itemIndex) => (
                <div key={`${item}-${itemIndex}`} className="reorder-item">
                  <span>{item}</span>
                  <div className="reorder-controls">
                    <button onClick={() => moveItem(-1, itemIndex)} type="button">
                      ↑
                    </button>
                    <button onClick={() => moveItem(1, itemIndex)} type="button">
                      ↓
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : null}

        {current.type === "multi-select" ? (
          <div className="choice-grid">
            {current.choices.map((choice) => {
              const selected = Array.isArray(currentAnswer) && currentAnswer.includes(choice.id);
              return (
                <button
                  key={choice.id}
                  className={selected ? "choice-button choice-button--active" : "choice-button"}
                  onClick={() => toggleMultiSelect(choice.id)}
                  type="button"
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="practice-actions">
          <button
            className="action-button"
            onClick={() =>
              setChecked((previous) => ({
                ...previous,
                [current.id]: true,
              }))
            }
            type="button"
          >
            تحقق
          </button>
          <button
            className="action-button action-button--ghost"
            onClick={() =>
              setHintCount((previous) => ({
                ...previous,
                [current.id]: Math.min(
                  current.hints.length,
                  (previous[current.id] ?? 0) + 1,
                ),
              }))
            }
            type="button"
          >
            Hint
          </button>
        </div>

        {hintsToShow > 0 ? (
          <div className="hint-stack">
            {current.hints.slice(0, hintsToShow).map((hint) => (
              <p key={hint}>• {hint}</p>
            ))}
          </div>
        ) : null}

        {isChecked ? (
          <div className={isCorrect ? "feedback feedback--good" : "feedback feedback--bad"}>
            <p>{isCorrect ? "صحيح. ممتاز." : "مش صحيح بعد. شوفي الشرح وحاولي من جديد."}</p>
            <p>{current.explanation}</p>
          </div>
        ) : null}
      </div>

      <div className="practice-nav">
        <button
          className="action-button action-button--ghost"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          type="button"
        >
          السابق
        </button>
        <button
          className="action-button"
          disabled={index === questions.length - 1}
          onClick={() => setIndex((value) => Math.min(questions.length - 1, value + 1))}
          type="button"
        >
          التالي
        </button>
      </div>
    </div>
  );
}
