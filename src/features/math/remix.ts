import type { ExamSection } from "../../content/schema";

function seededValue(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  const normalized = x - Math.floor(x);
  return Math.floor(normalized * (max - min + 1)) + min;
}

function buildAlgebraSection(
  year: number,
  mode: "original" | "remix",
  seed: number,
): ExamSection {
  const a = seededValue(seed + 11, 2, 6);
  const x = seededValue(seed + 13, 3, 9);
  const b = seededValue(seed + 17, 3, 9);
  const total = a * x + b;

  return {
    title: "التمرين 1: جبر سريع",
    note:
      mode === "original"
        ? "نفس روح مواضيع BEM: تبسيط، معادلة، وفهم الخطوات."
        : "Remix: نفس الفكرة لكن بالأعداد المتغيرة.",
    questions: [
      {
        id: `mx-a-${year}-1`,
        type: "number",
        prompt: `حل المعادلة: ${a}x + ${b} = ${total}`,
        answer: x,
        hints: [`اطرحي ${b} من الطرفين.`, `بعدها اقسمي على ${a}.`],
        explanation: `${a}x = ${total - b} ثم x = ${x}.`,
        sourceRefs: [`BEM math ${year}`],
      },
      {
        id: `mx-a-${year}-2`,
        type: "multiple-choice",
        prompt: "ما أول خطوة صحيحة في حل المعادلة؟",
        choices: [
          { id: "a", label: "أقسم على a مباشرة" },
          { id: "b", label: "أزيل الحد الثابت أولاً" },
          { id: "c", label: "أغير كل الإشارات" },
        ],
        correctChoiceId: "b",
        hints: ["الهدف هو عزل الحد الذي فيه x تدريجياً."],
        explanation: "المنهج الصحيح يبدأ بإزالة الحد الثابت.",
        sourceRefs: [`BEM math ${year}`],
      },
    ],
  };
}

function buildFunctionSection(
  year: number,
  mode: "original" | "remix",
  seed: number,
): ExamSection {
  const slope = seededValue(seed + 23, -4, 5) || 2;
  const intercept = seededValue(seed + 29, -3, 6);
  const x = seededValue(seed + 31, 1, 4);
  const fx = slope * x + intercept;

  return {
    title: "التمرين 2: دالة وتمثيل بياني",
    note:
      mode === "original"
        ? "فكرة قراءة مستقيم أو جدول قيم مثل مواضيع BEM."
        : "Remix: الميل والثابت تغيروا، لكن طريقة التفكير نفسها.",
    questions: [
      {
        id: `mx-f-${year}-1`,
        type: "number",
        prompt: `إذا كانت f(x) = ${slope}x ${intercept >= 0 ? "+" : "-"} ${Math.abs(intercept)}، فما قيمة f(${x})؟`,
        answer: fx,
        hints: [
          `عوّضي x بـ ${x}.`,
          "احسبي الضرب ثم أضيفي أو اطرحي الثابت.",
        ],
        explanation: `f(${x}) = ${slope} × ${x} ${intercept >= 0 ? "+" : "-"} ${Math.abs(intercept)} = ${fx}.`,
        sourceRefs: [`BEM math ${year}`],
      },
      {
        id: `mx-f-${year}-2`,
        type: "short-text",
        prompt: "إذا كان الميل موجباً، هل المستقيم صاعد أم نازل؟",
        acceptedAnswers: ["صاعد", "يصعد"],
        hints: ["راقبي تغير y عندما تكبر x."],
        explanation: "الميل الموجب يعطي مستقيماً صاعداً.",
        sourceRefs: [`BEM math ${year}`],
      },
    ],
  };
}

function buildGeometrySection(
  year: number,
  mode: "original" | "remix",
  seed: number,
): ExamSection {
  const legA = seededValue(seed + 41, 3, 8);
  const legB = seededValue(seed + 43, 4, 9);
  const hypotenuse = Math.sqrt(legA ** 2 + legB ** 2);

  return {
    title: "التمرين 3: هندسة ووضعية مركبة",
    note:
      mode === "original"
        ? "مثلث قائم + تفسير اختيار القانون."
        : "Remix: نفس البنية مع أضلاع جديدة.",
    questions: [
      {
        id: `mx-g-${year}-1`,
        type: "number",
        prompt: `مثلث قائم ضلعاه القائمان ${legA} و ${legB}. احسبي طول الوتر بالتقريب إلى 0.01.`,
        answer: Number(hypotenuse.toFixed(2)),
        tolerance: 0.02,
        hints: ["استعملي فيثاغورس.", `c² = ${legA ** 2} + ${legB ** 2}`],
        explanation: `c = √(${legA ** 2} + ${legB ** 2}) = ${hypotenuse.toFixed(2)}.`,
        sourceRefs: [`BEM math ${year}`],
      },
      {
        id: `mx-g-${year}-2`,
        type: "short-text",
        prompt: "لماذا اخترنا فيثاغورس هنا؟",
        acceptedAnswers: ["لأن المثلث قائم", "لأنه مثلث قائم"],
        hints: ["اسألي نفسك عن نوع المثلث."],
        explanation: "فيثاغورس تستعمل في المثلث القائم.",
        sourceRefs: [`BEM math ${year}`],
      },
    ],
  };
}

export function buildMathExamSections(
  year: number,
  mode: "original" | "remix",
  seed: number,
): ExamSection[] {
  return [
    buildAlgebraSection(year, mode, seed),
    buildFunctionSection(year, mode, seed + 100),
    buildGeometrySection(year, mode, seed + 200),
  ];
}
