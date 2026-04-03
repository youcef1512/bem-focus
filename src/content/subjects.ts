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
    roadmap: [
      {
        title: "الأعداد والحساب",
        details: [
          "الأولويات في العمليات",
          "الكتابة العلمية والقوى",
          "التناسب والنسب المئوية",
        ],
      },
      {
        title: "الجبر والمعادلات",
        details: [
          "النشر والتحليل",
          "المعادلات من الدرجة الأولى",
          "حل جملة معادلتين البسيطة",
        ],
      },
      {
        title: "الدوال والتمثيل",
        details: [
          "جدول القيم",
          "الدالة التآلفية",
          "قراءة مستقيم من الرسم",
        ],
      },
      {
        title: "الهندسة",
        details: [
          "فيثاغورس",
          "المثلث القائم والنسب المثلثية",
          "المحيط، المساحة، والحجم",
        ],
      },
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
    roadmap: [
      {
        title: "فهم النص",
        details: ["الفكرة العامة", "الأفكار الجزئية", "التعليل والاستنتاج"],
      },
      {
        title: "القواعد",
        details: ["أنواع الجمل", "الإعراب الأساسي", "الأساليب والتراكيب"],
      },
      {
        title: "التعبير",
        details: ["بناء فقرة", "تنظيم الأفكار", "سلامة اللغة"],
      },
    ],
    coaching:
      "قبل ما تجاوبي، حددي المطلوب: فهم؟ قاعدة؟ تعبير؟ هذا يوفر الوقت.",
    lessonIds: ["arabic-reading-strategy", "arabic-text-writing"],
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
    roadmap: [
      {
        title: "Compréhension",
        details: ["Repérer le thème", "Trouver l’idée", "Répondre clairement"],
      },
      {
        title: "Langue",
        details: ["Opinion", "Condition", "Connecteurs logiques"],
      },
      {
        title: "Production",
        details: ["Paragraphe court", "Message", "Texte argumentatif simple"],
      },
    ],
    coaching: "اقري السؤال أولا، ثم النص، وبعدها خذي الكلمات المفتاحية.",
    lessonIds: ["french-reading-method", "french-opinion-condition"],
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
    roadmap: [
      {
        title: "Reading",
        details: ["Main idea", "Specific information", "Vocabulary in context"],
      },
      {
        title: "Grammar",
        details: ["Tenses", "Modals", "Connectors"],
      },
      {
        title: "Writing",
        details: ["Short paragraph", "Giving advice", "Expressing opinion"],
      },
    ],
    coaching: "خلي الجملة بسيطة وصحيحة خير من جملة طويلة ومكسرة.",
    lessonIds: ["english-reading-vocabulary", "english-core"],
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
    roadmap: [
      {
        title: "التاريخ الوطني",
        details: ["المقاومات", "الحركة الوطنية", "الثورة التحريرية", "الاستقلال"],
      },
      {
        title: "الجغرافيا",
        details: ["السكان", "التنمية", "الموارد", "العلاقة مع العالم"],
      },
      {
        title: "منهجية",
        details: ["تعريف", "تفسير", "ترتيب زمني", "وضعية إدماجية"],
      },
    ],
    coaching: "اسألي روحك دائما: ماذا حدث؟ لماذا؟ وما النتيجة؟",
    lessonIds: ["history-dates-core", "historygeo-timeline"],
    summaryIds: ["summary-history-dates", "summary-historygeo"],
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
    roadmap: [
      {
        title: "الحركة",
        details: ["السرعة", "المسافة", "الزمن"],
      },
      {
        title: "الكهرباء",
        details: ["التيار", "التوتر", "المقاومة", "الدارة"],
      },
      {
        title: "منهجية الحل",
        details: ["قانون", "تعويض", "وحدة", "فحص المعقولية"],
      },
    ],
    coaching: "اكتبي القانون قبل التعويض. هذا يمنع الأخطاء السريعة.",
    lessonIds: ["physics-electricity", "physics-formulas"],
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
    roadmap: [
      {
        title: "الوظائف الحيوية",
        details: ["الاتصال العصبي", "التنظيم", "الاستجابة"],
      },
      {
        title: "الدفاع عن الجسم",
        details: ["المناعة", "دور الأجسام المضادة", "الحماية"],
      },
      {
        title: "البيئة",
        details: ["توازن النظام البيئي", "التلوث", "الحلول"],
      },
    ],
    coaching: "بدل ما تحفظي فقرة كاملة، احفظي سلسلة سبب ثم نتيجة.",
    lessonIds: ["science-nervous-immunity", "science-systems"],
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
    roadmap: [
      {
        title: "فهم النصوص",
        details: ["المعنى العام", "القيمة", "الحكم أو العبرة"],
      },
      {
        title: "التطبيق",
        details: ["سلوك عملي", "ربط بالحياة اليومية", "جواب مختصر واضح"],
      },
    ],
    coaching: "جاوبي بالمعنى الواضح ثم دعميه بالكلمة المفتاحية الصحيحة.",
    lessonIds: ["islamic-meanings", "islamic-values"],
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
    roadmap: [
      {
        title: "المواطنة",
        details: ["حق", "واجب", "مشاركة", "احترام القانون"],
      },
      {
        title: "المؤسسات",
        details: ["الدولة", "الجماعات المحلية", "الهيئات الاجتماعية"],
      },
    ],
    coaching: "كل مفهوم اربطيه بمثال من الحياة اليومية باش يثبت.",
    lessonIds: ["civics-rights-duties", "civics-citizenship"],
    summaryIds: ["summary-civics"],
  },
];
