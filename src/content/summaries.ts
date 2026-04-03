import type { SummarySheet } from "./schema";

export const summarySheets: SummarySheet[] = [
  {
    id: "summary-math-core",
    subjectId: "math",
    title: "ملخص الرياضيات: القوانين والفخاخ الأساسية",
    recap: [
      "ابدئي دائماً بكتابة المعطيات ثم المطلوب.",
      "في المعادلات حافظي على التوازن: نفس العملية في الطرفين.",
      "في الدوال ركزي على جدول القيم ثم التمثيل البياني ثم القراءة.",
      "في فيثاغورس حددي الوتر أولاً: هو الضلع المقابل للزاوية القائمة.",
    ],
    memoryHooks: [
      "الوتر هو الأطول.",
      "الميل يجاوب على سؤال: كلما زادت x بواحد، ماذا يحدث لـ y؟",
      "النتيجة بدون وحدة في الهندسة أو الفيزياء غالباً ناقصة.",
    ],
    formulas: [
      { label: "فيثاغورس", value: "c² = a² + b²" },
      { label: "الدالة التآلفية", value: "f(x) = ax + b" },
      { label: "المتوسط", value: "مجموع القيم ÷ عددها" },
    ],
    examMoves: [
      "اكتبي القانون قبل التعويض.",
      "راجعي الإشارة قبل النتيجة النهائية.",
      "إذا ضعتِ، ارجعي إلى الرسم أو الجدول.",
    ],
    sourceRefs: [
      "وزارة التربية الوطنية: الوثائق الرسمية البيداغوجية 2017",
      "BEM math archive 2016-2025",
    ],
  },
  {
    id: "summary-math-final",
    subjectId: "math",
    title: "آخر 10 أيام في الرياضيات",
    recap: [
      "يومياً: 10 دقائق استرجاع، 20 دقيقة تمرين، 10 دقائق تصحيح.",
      "اختاري سؤال واحد سهل وسؤال واحد متوسط وسؤال واحد من موضوع سابق.",
      "إذا غلطتِ في فكرة مرتين، ديري لها بطاقة صغيرة خاصة.",
    ],
    memoryHooks: [
      "اليوم القصير خير من جلسة طويلة وتضييع التركيز.",
      "المهم هو الثبات، ماشي المثالية.",
    ],
    examMoves: [
      "ابدئي بما تعرفيه سريعاً لرفع الثقة.",
      "اتركي السؤال اللي حابسك ورجعي له بعدين.",
      "في النهاية راجعي الأعداد والإشارات.",
    ],
    sourceRefs: [
      "Retrieval Practice / Spacing",
      "BEM math archive 2016-2025",
    ],
  },
  {
    id: "summary-arabic",
    subjectId: "arabic",
    title: "ملخص العربية: فهم، قواعد، تعبير",
    recap: [
      "اقري المطلوب قبل النص.",
      "في القواعد ركزي على نوع الجملة ووظيفة الكلمة.",
      "في التعبير: مقدمة قصيرة، فكرتان واضحتان، خاتمة بسيطة.",
    ],
    memoryHooks: [
      "كل جواب لازم يكون على قد السؤال.",
      "الكلمة المفتاحية من النص تقوي الجواب.",
    ],
    examMoves: [
      "تجنبي النسخ الطويل من النص بلا فهم.",
      "راجعي الهمزات وعلامات الترقيم في التعبير.",
    ],
    sourceRefs: ["BEM Arabic archive 2016-2025"],
  },
  {
    id: "summary-french",
    subjectId: "french",
    title: "Résumé Français",
    recap: [
      "Repère le thème général puis lis les questions.",
      "Les verbes d’opinion servent à exprimer ton avis.",
      "La condition et l’opposition reviennent souvent dans les activités.",
    ],
    memoryHooks: [
      "Si + présent => présent/futur.",
      "Si + imparfait => conditionnel présent.",
    ],
    examMoves: [
      "Réponds avec une phrase complète quand c’est possible.",
      "Dans la production écrite, reste simple et clair.",
    ],
    sourceRefs: ["BEM French archive 2016-2025", "4AM French summaries"],
  },
  {
    id: "summary-english",
    subjectId: "english",
    title: "English Quick Sheet",
    recap: [
      "Read the title and the first line before answering.",
      "Use short sentences with clear subject + verb + complement.",
      "Revise connectors: because, so, but, first, then, finally.",
    ],
    memoryHooks: [
      "One idea per sentence.",
      "Capitals and punctuation matter in writing.",
    ],
    examMoves: [
      "Underline the keyword in the question.",
      "Reuse correct vocabulary from the text when useful.",
    ],
    sourceRefs: ["BEM English archive 2016-2025"],
  },
  {
    id: "summary-historygeo",
    subjectId: "historygeo",
    title: "ملخص التاريخ والجغرافيا",
    recap: [
      "في التاريخ: رتبي الأحداث من السبب إلى النتيجة.",
      "في الجغرافيا: اربطي كل مفهوم بمثال واضح من الجزائر.",
      "استعملي التواريخ المفصلية فقط، بدون تشتيت.",
    ],
    memoryHooks: [
      "1830 احتلال، 1954 ثورة، 1962 استقلال.",
      "اسألي دائماً: من؟ متى؟ لماذا؟ ماذا نتج؟",
    ],
    examMoves: [
      "جواب قصير منظم خير من فقرة طويلة مشتتة.",
      "إذا طلب التفسير، لا تكتفي بالتعريف.",
    ],
    sourceRefs: ["BEM History/Geo archive 2016-2025"],
  },
  {
    id: "summary-history-dates",
    subjectId: "historygeo",
    title: "ملخص التواريخ الأساسية في التاريخ",
    recap: [
      "14 جوان 1830: بداية الاحتلال الفرنسي.",
      "05 ماي 1931: تأسيس جمعية العلماء المسلمين الجزائريين.",
      "08 ماي 1945: المجازر.",
      "01 نوفمبر 1954: اندلاع الثورة التحريرية.",
      "20 أوت 1956: مؤتمر الصومام.",
      "19 سبتمبر 1958: الحكومة المؤقتة للجمهورية الجزائرية.",
      "19 مارس 1962: اتفاقيات إيفيان ووقف إطلاق النار.",
      "05 جويلية 1962: الاستقلال.",
    ],
    memoryHooks: [
      "1830 احتلال، 1954 ثورة، 1962 استقلال.",
      "19 مارس يسبق 05 جويلية: وقف إطلاق النار ثم الاستقلال.",
    ],
    examMoves: [
      "احفظي كل تاريخ مع حدث واحد واضح، لا مع فقرة طويلة.",
      "إذا طلب الترتيب الزمني، ابحثي أولاً عن أقدم وأحدث تاريخ.",
      "إذا طلب الشرح، اربطي التاريخ بسبب أو نتيجة.",
    ],
    sourceRefs: ["BEM History/Geo archive 2016-2025"],
  },
  {
    id: "summary-physics",
    subjectId: "physics",
    title: "ملخص الفيزياء",
    recap: [
      "حددي الرموز والوحدات قبل التعويض.",
      "افرقي بين المعطى والنتيجة المطلوبة.",
      "استعملي الجداول الصغيرة باش ما تتلخبطيش.",
    ],
    memoryHooks: [
      "القانون أولاً، التعويض ثانياً، الحساب ثالثاً.",
      "الوحدة جزء من الجواب.",
    ],
    formulas: [
      { label: "السرعة", value: "v = d / t" },
      { label: "شدة التيار", value: "I = U / R" },
    ],
    examMoves: [
      "راجعي إذا كانت النتيجة معقولة.",
      "لا تخلطي بين الساعات والثواني.",
    ],
    sourceRefs: ["BEM Physics archive 2016-2025"],
  },
  {
    id: "summary-science",
    subjectId: "science",
    title: "ملخص علوم الطبيعة والحياة",
    recap: [
      "خذي كل درس على شكل آلية: منبه -> انتقال -> استجابة.",
      "في المناعة: عنصر دفاع، دوره، النتيجة.",
      "في البيئة: سبب المشكلة ثم أثرها ثم الحل.",
    ],
    memoryHooks: [
      "الفهم يسبق الحفظ.",
      "الرسم الصغير يثبت الفكرة أكثر من فقرة طويلة.",
    ],
    examMoves: [
      "إذا طلب التفسير، اذكري السلسلة كاملة.",
      "إذا طلب التعريف، لا تدخلي في تفاصيل خارج المطلوب.",
    ],
    sourceRefs: ["BEM Science archive 2016-2025"],
  },
  {
    id: "summary-islamic",
    subjectId: "islamic",
    title: "ملخص العلوم الإسلامية",
    recap: [
      "ركزي على المعاني والقيم العملية في الحياة اليومية.",
      "تمييز بين الحكم، القيمة، والسلوك المطلوب.",
      "استنتاج الفائدة أو العبرة يكون بجملة قصيرة واضحة.",
    ],
    memoryHooks: [
      "كل نص عنده معنى، قيمة، وتطبيق.",
      "الجواب المختصر المنظم أفضل من الحشو.",
    ],
    examMoves: [
      "استعملي المصطلح الصحيح من الدرس.",
      "اربط الفكرة بالواقع إذا طلب التطبيق.",
    ],
    sourceRefs: ["BEM Islamic archive 2016-2025"],
  },
  {
    id: "summary-civics",
    subjectId: "civics",
    title: "ملخص التربية المدنية",
    recap: [
      "المواطنة = حقوق + واجبات + مشاركة.",
      "كل مؤسسة عندها دور محدد لازم يتسمى بوضوح.",
      "الأمثلة الحياتية تسهل الحفظ كثيراً.",
    ],
    memoryHooks: [
      "إذا حفظت المفهوم مع مثال، ما تنسايهش بسرعة.",
      "رتبي الجواب: تعريف، مثال، فائدة.",
    ],
    examMoves: [
      "جاوبي على قد السؤال: تعريف، تعداد، أو تفسير.",
      "في الوضعية الإدماجية اختاري مثال قريب من الواقع.",
    ],
    sourceRefs: ["BEM Civics archive 2016-2025"],
  },
];
