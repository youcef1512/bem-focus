import { historyTimeline } from "../../content/historyTimeline";
import type { PracticeQuestion, TimelineEvent } from "../../content/schema";

type QuestionFactory = (round: number) => PracticeQuestion[];

const historyEvents = historyTimeline.filter((event) => event.id !== "modern-algeria");

const historyCoreIds = [
  "1830",
  "1931",
  "1945",
  "1954",
  "1956",
  "1958",
  "1962-evian",
  "1962-independence",
];

const historyCoreEvents = historyCoreIds
  .map((id) => historyEvents.find((event) => event.id === id))
  .filter((event): event is TimelineEvent => Boolean(event));

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return function next() {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: number) {
  const random = mulberry32(seed);
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function pickMany<T>(items: T[], count: number, seed: number) {
  return shuffle(items, seed).slice(0, Math.min(count, items.length));
}

function eventLabel(event: TimelineEvent) {
  return `${event.yearLabel} - ${event.title}`;
}

function dateChoice(event: TimelineEvent) {
  return `${event.yearLabel} - ${event.title}`;
}

function buildReorderQuestion(
  prefix: string,
  events: TimelineEvent[],
  round: number,
  title: string,
): PracticeQuestion {
  const correctOrder = events.map(eventLabel);
  const shuffledItems = shuffle(correctOrder, round * 13 + 7);

  return {
    id: `${prefix}-reorder-${round}`,
    type: "reorder",
    prompt: title,
    context: "كل مرة تضغطي على مجموعة جديدة راح تتبدل المحطات ويولي الترتيب من جديد.",
    items: shuffledItems,
    correctOrder,
    hints: [
      `ثبتي الأول: ${events[0].yearLabel}.`,
      `وثبتي الأخير: ${events.at(-1)?.yearLabel ?? events[events.length - 1].yearLabel}.`,
    ],
    explanation: "ابدئي بالأقدم والأحدث، ثم رتبي الوسط بينهما.",
    sourceRefs: ["BEM History/Geo archive 2016-2025", "historyTimeline content"],
  };
}

function buildDateToEventQuestion(prefix: string, event: TimelineEvent, choices: TimelineEvent[], round: number): PracticeQuestion {
  const options = shuffle(choices, round * 17 + 5).map((choice, index) => ({
    id: `${prefix}-date-choice-${round}-${index}`,
    label: choice.title,
  }));
  const correct = options.find((choice) => choice.label === event.title);

  return {
    id: `${prefix}-date-match-${round}`,
    type: "multiple-choice",
    prompt: `ما الحدث المرتبط بالتاريخ ${event.yearLabel} ؟`,
    context: "ثبتي التاريخ أولاً ثم اربطيه بحدث واحد واضح.",
    choices: options,
    correctChoiceId: correct?.id ?? options[0].id,
    hints: [
      "لا تبحثي عن فقرة كاملة. ابحثي عن اسم الحدث فقط.",
      "حاولي ربط التاريخ بكلمة مفتاحية واحدة قبل الاختيار.",
    ],
    explanation: `${event.yearLabel} يرتبط بـ ${event.title}.`,
    sourceRefs: ["BEM History/Geo archive 2016-2025", "historyTimeline content"],
  };
}

function buildWhyItMattersQuestion(
  prefix: string,
  event: TimelineEvent,
  optionsPool: TimelineEvent[],
  round: number,
): PracticeQuestion {
  const distractors = pickMany(
    optionsPool.filter((entry) => entry.id !== event.id),
    3,
    round * 19 + 11,
  );
  const options = shuffle([event, ...distractors], round * 23 + 3).map((choice, index) => ({
    id: `${prefix}-impact-choice-${round}-${index}`,
    label: choice.whyItMatters,
  }));
  const correct = options.find((choice) => choice.label === event.whyItMatters);

  return {
    id: `${prefix}-impact-${round}`,
    type: "multiple-choice",
    prompt: `ما الأهمية الأقرب لهذا الحدث: ${event.title} ؟`,
    context: "في التاريخ ما يكفيش حفظ الاسم فقط. لازم تعرفي لماذا هذا الحدث محوري.",
    choices: options,
    correctChoiceId: correct?.id ?? options[0].id,
    hints: [
      "ابحثي عن النتيجة أو الدور الذي فتح مرحلة جديدة.",
      "الأهمية تكون غالبًا جملة تربط الحدث بما بعده.",
    ],
    explanation: event.whyItMatters,
    sourceRefs: ["BEM History/Geo archive 2016-2025", "historyTimeline content"],
  };
}

function buildSequenceBridgeQuestion(
  prefix: string,
  orderedEvents: TimelineEvent[],
  round: number,
): PracticeQuestion {
  const focusIndex = Math.min(1 + (round % Math.max(orderedEvents.length - 2, 1)), orderedEvents.length - 2);
  const previous = orderedEvents[focusIndex - 1];
  const current = orderedEvents[focusIndex];
  const next = orderedEvents[focusIndex + 1];
  const choices = shuffle(
    [previous, current, next, orderedEvents.at(-1) ?? next].filter(
      (event, index, array) => array.findIndex((entry) => entry.id === event.id) === index,
    ),
    round * 29 + 9,
  ).map((choice, index) => ({
    id: `${prefix}-bridge-choice-${round}-${index}`,
    label: dateChoice(choice),
  }));
  const correct = choices.find((choice) => choice.label === dateChoice(next));

  return {
    id: `${prefix}-bridge-${round}`,
    type: "multiple-choice",
    prompt: `بعد ${current.title} مباشرة، أي محطة تأتي في هذه السلسلة؟`,
    context: "هذا السؤال يدربك على الربط بين المحطات، ليس حفظ كل تاريخ بمعزل.",
    choices,
    correctChoiceId: correct?.id ?? choices[0].id,
    hints: [
      `ثبتي ما قبلها: ${previous.yearLabel}.`,
      "ابحثي عن الحدث الذي يفتح المرحلة الموالية مباشرة.",
    ],
    explanation: `بعد ${current.title} تأتي محطة ${next.title} (${next.yearLabel}).`,
    sourceRefs: ["BEM History/Geo archive 2016-2025", "historyTimeline content"],
  };
}

function buildHistoryQuestionSet(
  prefix: string,
  pool: TimelineEvent[],
  round: number,
  reorderTitle: string,
): PracticeQuestion[] {
  const orderedEvents = pickMany(pool, 5, round * 31 + 1).sort(
    (left, right) => pool.findIndex((event) => event.id === left.id) - pool.findIndex((event) => event.id === right.id),
  );
  const dateEvent = orderedEvents[(round + 1) % orderedEvents.length];
  const impactEvent = orderedEvents[(round + 3) % orderedEvents.length];

  return [
    buildReorderQuestion(prefix, orderedEvents.slice(0, 4), round, reorderTitle),
    buildDateToEventQuestion(prefix, dateEvent, orderedEvents, round),
    buildWhyItMattersQuestion(prefix, impactEvent, pool, round),
    buildSequenceBridgeQuestion(prefix, orderedEvents, round),
  ];
}

export const buildHistoryStoryRecallSet: QuestionFactory = (round) =>
  buildHistoryQuestionSet(
    "history-story",
    historyEvents,
    round,
    "رتبي هذه المحطات من الأقدم إلى الأحدث:",
  );

export const buildHistoryDatesRecallSet: QuestionFactory = (round) =>
  buildHistoryQuestionSet(
    "history-dates",
    historyCoreEvents,
    round,
    "رتبي هذه التواريخ الأساسية حسب التسلسل التاريخي:",
  );

export function practiceFactoryForLesson(lessonId: string): QuestionFactory | undefined {
  if (lessonId === "historygeo-timeline") {
    return buildHistoryStoryRecallSet;
  }

  if (lessonId === "history-dates-core") {
    return buildHistoryDatesRecallSet;
  }

  return undefined;
}
