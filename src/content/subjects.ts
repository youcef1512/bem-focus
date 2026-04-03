import type { Subject } from "./schema";

export const subjects: Subject[] = [
  {
    id: "math",
    name: "الرياضيات",
    shortLabel: "Math",
    accent: "#315f72",
    emphasis: "highest",
    overview:
      "المادة الأولى في البرنامج. نخدموها على شكل حصص قصيرة، أمثلة محلولة، واسترجاع دائم باش الثقة ترجع بسرعة.",
    focusAreas: [
      "الحساب والجبر",
      "الدوال والتمثيل البياني",
      "المثلثات والهندسة",
      "الاحتمالات والإحصاء",
    ],
    coaching:
      "ما تحفظيش الحل. شوفي الفكرة، سمي المعطيات، وبعدها حلي خطوة خطوة.",
    lessonIds: [
      "math-algebra",
      "math-functions",
      "math-geometry",
      "math-statistics",
      "math-exam-strategy",
    ],
    summaryIds: ["summary-math-core", "summary-math-final"],
  },
  {
    id: "arabic",
    name: "اللغة العربية",
    shortLabel: "Ar",
    accent: "#7a5340",
    emphasis: "high",
    overview:
      "التركيز هنا على فهم النص، القواعد الأكثر تكراراً، والتعبير القصير الواضح.",
    focusAreas: ["فهم النص", "القواعد", "التعبير الكتابي"],
    coaching:
      "قبل ما تجاوبي، حددي المطلوب: فهم؟ قاعدة؟ تعبير؟ هذا يوفر الوقت.",
    lessonIds: ["arabic-text-writing"],
    summaryIds: ["summary-arabic"],
  },
  {
    id: "french",
    name: "اللغة الفرنسية",
    shortLabel: "Fr",
    accent: "#45606f",
    emphasis: "high",
    overview:
      "نديروها بفهم المعنى، الروابط، les verbes d’opinion, la condition, et la production courte.",
    focusAreas: ["Compréhension", "Grammaire", "Expression écrite"],
    coaching: "اقري السؤال أولا، ثم النص، وبعدها خذي الكلمات المفتاحية.",
    lessonIds: ["french-opinion-condition"],
    summaryIds: ["summary-french"],
  },
  {
    id: "english",
    name: "اللغة الإنجليزية",
    shortLabel: "En",
    accent: "#3b6c67",
    emphasis: "high",
    overview:
      "القواعد الأساسية، reading, vocabulary, وكتابة فقرة قصيرة بطريقة منظمة.",
    focusAreas: ["Reading", "Grammar", "Paragraph writing"],
    coaching: "خلي الجملة بسيطة وصحيحة خير من جملة طويلة ومكسرة.",
    lessonIds: ["english-core"],
    summaryIds: ["summary-english"],
  },
  {
    id: "historygeo",
    name: "التاريخ والجغرافيا",
    shortLabel: "HG",
    accent: "#8e6148",
    emphasis: "medium",
    overview:
      "نربط الأحداث في سلسلة قصة واحدة، ونراجع الخرائط والمفاهيم على شكل نقاط ذاكرة.",
    focusAreas: ["التسلسل الزمني", "الأسباب والنتائج", "المفاهيم الجغرافية"],
    coaching: "اسألي روحك دائما: ماذا حدث؟ لماذا؟ وما النتيجة؟",
    lessonIds: ["historygeo-timeline"],
    summaryIds: ["summary-historygeo"],
  },
  {
    id: "physics",
    name: "العلوم الفيزيائية والتكنولوجيا",
    shortLabel: "Phy",
    accent: "#5a597d",
    emphasis: "medium",
    overview:
      "نركز على العلاقات الأساسية، الوحدات، وكيفاش نعوض بالأرقام بلا خلط.",
    focusAreas: ["الكهرباء", "السرعة", "الطاقة"],
    coaching: "اكتبي القانون قبل التعويض. هذا يمنع الأخطاء السريعة.",
    lessonIds: ["physics-formulas"],
    summaryIds: ["summary-physics"],
  },
  {
    id: "science",
    name: "علوم الطبيعة والحياة",
    shortLabel: "SVT",
    accent: "#4d7258",
    emphasis: "medium",
    overview:
      "الهدف هو الفهم قبل الحفظ: آلية، رسم بسيط، ثم كلمات مفتاحية للاسترجاع.",
    focusAreas: ["الجهاز العصبي", "المناعة", "البيئة"],
    coaching: "بدل ما تحفظي فقرة كاملة، احفظي سلسلة سبب ثم نتيجة.",
    lessonIds: ["science-systems"],
    summaryIds: ["summary-science"],
  },
  {
    id: "islamic",
    name: "العلوم الإسلامية",
    shortLabel: "Islam",
    accent: "#6d6940",
    emphasis: "medium",
    overview:
      "حفظ ذكي للمعاني والقيم مع ربط النص بالسؤال التطبيقي اللي يجي في الامتحان.",
    focusAreas: ["المعاني", "القيم", "الاستنتاج"],
    coaching: "جاوبي بالمعنى الواضح ثم دعميه بالكلمة المفتاحية الصحيحة.",
    lessonIds: ["islamic-values"],
    summaryIds: ["summary-islamic"],
  },
  {
    id: "civics",
    name: "التربية المدنية",
    shortLabel: "Civics",
    accent: "#7a6f63",
    emphasis: "medium",
    overview:
      "نديرو المؤسسات، الحقوق، والواجبات بطريقة أسئلة مباشرة وسيناريوهات قصيرة.",
    focusAreas: ["المواطنة", "المؤسسات", "الحقوق والواجبات"],
    coaching: "كل مفهوم اربطيه بمثال من الحياة اليومية باش يثبت.",
    lessonIds: ["civics-citizenship"],
    summaryIds: ["summary-civics"],
  },
];
