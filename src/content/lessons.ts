import type { Lesson } from "./schema";

export const lessons: Lesson[] = [
  {
    id: "math-algebra",
    subjectId: "math",
    title: "رياضيات: إصلاح الجبر والحساب",
    shortTitle: "الجبر والحساب",
    durationMinutes: 35,
    difficulty: "repair",
    summary:
      "ترميم سريع للعمليات، الأولويات، النشر، التحليل، والمعادلات البسيطة والمتوسطة.",
    goals: [
      "تفكيك التمرين قبل الحساب",
      "منع أخطاء الإشارة",
      "التحكم في المعادلات خطوة بخطوة",
    ],
    phoneAwayRitual:
      "حطي الهاتف بعيد 25 دقيقة، خلي ورقة وقلم فقط، وابدئي بتمرين صغير جداً.",
    recallWarmup:
      "بدون ما تشوفي الدرس: اكتبي ترتيب الأولويات في العمليات واكتبي مثال قصير على معادلة.",
    finishLine:
      "في النهاية لازم تقدري تحلي معادلة خطية وحدك وتفسري كل خطوة بكلمة بسيطة.",
    sections: [
      {
        title: "1) كيف نبدأ؟",
        body: [
          "أي تمرين جبر نبدأوه بتسمية المعطى والمطلوب. السؤال الحقيقي هو: ماذا يجب أن أجد؟",
          "إذا كان عندك تعبير طويل، نظفيه بالأقواس والأولويات قبل أي شيء.",
        ],
        bullets: ["أقواس", "قوى إن وجدت", "ضرب وقسمة", "جمع وطرح"],
      },
      {
        title: "2) المعادلة ليست حرباً",
        body: [
          "المعادلة تشبه ميزان. كل عملية نديروها في طرف لازم نفس العملية في الطرف الآخر.",
          "الهدف هو ترك x وحدها في طرف.",
        ],
        callout: "الخطأ الشائع: تغيير الإشارة في طرف واحد فقط.",
      },
      {
        title: "3) متى نحلل ومتى ننشر؟",
        body: [
          "ننشر لما يكون عندنا قوس لازم يختفي.",
          "نحلل لما نحب نظهر عاملاً مشتركاً أو نبسط.",
        ],
        bullets: ["a(b + c) = ab + ac", "ab + ac = a(b + c)"],
      },
      {
        title: "4) مثال محلول",
        body: [
          "حل المعادلة: 3x + 5 = 20",
          "ننقص 5 من الطرفين: 3x = 15",
          "نقسم على 3: x = 5",
        ],
      },
    ],
    practice: [
      {
        id: "alg-1",
        type: "multiple-choice",
        prompt: "في التعبير 2 + 3 × 4، ما هي النتيجة الصحيحة؟",
        choices: [
          { id: "a", label: "20" },
          { id: "b", label: "14" },
          { id: "c", label: "24" },
        ],
        correctChoiceId: "b",
        hints: ["راجعي ترتيب الأولويات.", "الضرب قبل الجمع."],
        explanation: "3 × 4 = 12 ثم 12 + 2 = 14.",
        sourceRefs: ["BEM math 2016-2025: algebra warmups"],
      },
      {
        id: "alg-2",
        type: "number",
        prompt: "حل المعادلة: 4x - 8 = 20. كم قيمة x؟",
        answer: 7,
        hints: ["زيدي 8 للطرفين.", "بعدها اقسمي على 4."],
        explanation: "4x = 28 ثم x = 7.",
        sourceRefs: ["BEM math 2016-2025: equations"],
      },
      {
        id: "alg-3",
        type: "reorder",
        prompt: "رتبي خطوات حل: 5x + 3 = 18",
        items: [
          "نحصل على 5x = 15",
          "نقسم على 5",
          "ننقص 3 من الطرفين",
          "x = 3",
        ],
        correctOrder: [
          "ننقص 3 من الطرفين",
          "نحصل على 5x = 15",
          "نقسم على 5",
          "x = 3",
        ],
        hints: ["أول هدف: إزالة العدد الثابت.", "ثاني هدف: ترك x وحدها."],
        explanation: "نعزل الحد الذي فيه x تدريجياً.",
        sourceRefs: ["4AM algebra method"],
      },
      {
        id: "alg-4",
        type: "short-text",
        prompt: "اشرحي بكلمة أو كلمتين فقط: لماذا نطبق نفس العملية على الطرفين؟",
        acceptedAnswers: ["للمحافظة على التوازن", "نحافظ على التوازن", "التوازن"],
        hints: ["تخيلي المعادلة ميزاناً."],
        explanation: "الفكرة المركزية هي بقاء التساوي صحيحاً.",
        sourceRefs: ["Pedagogical docs 4AM math"],
      },
    ],
    summarySheetId: "summary-math-core",
    sourceRefs: [
      "وزارة التربية الوطنية: الوثائق الرسمية البيداغوجية 2017",
      "BEM math archive 2016-2025",
    ],
    examLinkYears: [2016, 2017, 2018, 2019, 2021],
    visual: "none",
  },
  {
    id: "math-functions",
    subjectId: "math",
    title: "رياضيات: الدوال والتمثيل البياني",
    shortTitle: "الدوال والبيان",
    durationMinutes: 35,
    difficulty: "build",
    summary:
      "فهم العلاقة بين x و y، جدول القيم، وقراءة المستقيم من الرسم بدون خوف.",
    goals: ["قراءة ميل المستقيم", "ربط الجدول بالرسم", "حل أسئلة المقارنة والقراءة"],
    phoneAwayRitual:
      "خلي الهاتف بعيد، وافتحي الصفحة مع قلم ومسطرة فقط. الرسم لازم يجي من يدك.",
    recallWarmup:
      "اكتبي من الذاكرة: إذا كانت f(x)=2x+1، ما هي f(0) و f(1)؟",
    finishLine:
      "لازم تقدري تقرئي مستقيم: أين يقطع محور y؟ وهل هو صاعد أو نازل؟",
    sections: [
      {
        title: "1) ما معنى دالة؟",
        body: [
          "الدالة تعطي لكل x قيمة مقابلة اسمها y أو f(x).",
          "المهم في 4AM هو القراءة، الحساب البسيط، والرسم.",
        ],
      },
      {
        title: "2) المستقيم التآلفي",
        body: [
          "في f(x)=ax+b، العدد a يمثل الميل، والعدد b يمثل نقطة التقاطع مع محور التراتيب.",
          "إذا كان a موجب فالمستقيم يصعد، وإذا كان سالباً يهبط.",
        ],
        callout: "الخطأ الشائع: الخلط بين a و b.",
      },
      {
        title: "3) من الجدول إلى الرسم",
        body: [
          "اختاري قيمتين أو ثلاثاً لـ x، احسبي y، ثم مثلي النقط.",
          "بعدها اربطيها بمسطرة إذا كان التمثيل خطياً.",
        ],
      },
      {
        title: "4) مثال محلول",
        body: [
          "إذا كانت f(x)=2x+1 فنجد: f(0)=1 و f(1)=3 و f(2)=5.",
          "هذه النقط (0,1) و(1,3) و(2,5) تعطي مستقيماً صاعداً.",
        ],
      },
    ],
    practice: [
      {
        id: "fun-1",
        type: "number",
        prompt: "إذا كانت f(x)=3x+2، ما قيمة f(4)؟",
        answer: 14,
        hints: ["عوّضي x بـ 4.", "3 × 4 ثم أضيفي 2."],
        explanation: "f(4)=3×4+2=14.",
        sourceRefs: ["BEM math archive 2016-2025: functions"],
      },
      {
        id: "fun-2",
        type: "multiple-choice",
        prompt: "في f(x)=ax+b، ماذا يمثل b غالباً؟",
        choices: [
          { id: "a", label: "ميل المستقيم" },
          { id: "b", label: "الترتيبة عند x = 0" },
          { id: "c", label: "عدد النقط" },
        ],
        correctChoiceId: "b",
        hints: ["فكري في f(0)."],
        explanation: "عندما x=0 نحصل على y=b.",
        sourceRefs: ["4AM function basics"],
      },
      {
        id: "fun-3",
        type: "short-text",
        prompt: "إذا كان a سالباً، هل المستقيم يصعد أم يهبط؟",
        acceptedAnswers: ["يهبط", "نازل", "ينزل"],
        hints: ["راقبي قيمة y عندما تكبر x."],
        explanation: "الميل السالب يعني أن y تنقص عندما x تكبر.",
        sourceRefs: ["BEM math archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-math-core",
    sourceRefs: ["BEM math archive 2016-2025: functions"],
    examLinkYears: [2018, 2019, 2022, 2024],
    visual: "function",
  },
  {
    id: "math-geometry",
    subjectId: "math",
    title: "رياضيات: المثلثات، فيثاغورس، والجيب",
    shortTitle: "الهندسة والمثلث",
    durationMinutes: 40,
    difficulty: "build",
    summary:
      "نفهم المثلث القائم، كيف نحدد الوتر، ومتى نستعمل فيثاغورس أو النسب المثلثية.",
    goals: ["تحديد الوتر بسرعة", "استعمال فيثاغورس في الاتجاه الصحيح", "قراءة مثلث قائم بدون ارتباك"],
    phoneAwayRitual:
      "الورقة تكون أفقية، ارسمي مثلثاً صغيراً من البداية، وخلي الهاتف خارج الطاولة.",
    recallWarmup:
      "من الذاكرة: ما هو الوتر؟ واكتبي علاقة فيثاغورس.",
    finishLine:
      "تقدري تشوفي مثلث قائم وتعرفي فوراً أي ضلع هو الوتر وأي قانون مناسب.",
    sections: [
      {
        title: "1) أول سؤال: أين الزاوية القائمة؟",
        body: [
          "بمجرد ما تشوفي الزاوية القائمة، الضلع المقابل لها هو الوتر.",
          "الوتر دائماً هو الأطول في المثلث القائم.",
        ],
      },
      {
        title: "2) فيثاغورس",
        body: [
          "إذا كان c هو الوتر و a و b ضلعين قائمين: c² = a² + b².",
          "إذا كنت تبحثي عن ضلع قائم، تنقلي الحد للجهة الأخرى.",
        ],
      },
      {
        title: "3) الجيب، جيب التمام، والظل",
        body: [
          "في هذا المستوى الأهم هو معرفة النسبة المناسبة حسب الضلع المطلوب والمعطيات.",
          "استعملي الرسم قبل القانون باش ما تخسريش الاتجاه.",
        ],
        callout: "الفخ: استعمال الوتر في المكان الخطأ.",
      },
    ],
    practice: [
      {
        id: "geo-1",
        type: "number",
        prompt: "مثلث قائم ضلعاه القائمان 3 سم و4 سم. كم طول الوتر؟",
        answer: 5,
        tolerance: 0.01,
        suffix: "سم",
        hints: ["استعملي c² = 3² + 4².", "9 + 16 = 25 ثم الجذر."],
        explanation: "c² = 25 إذن c = 5 سم.",
        sourceRefs: ["BEM math archive 2016-2025: geometry"],
      },
      {
        id: "geo-2",
        type: "multiple-choice",
        prompt: "ما هو الوتر في المثلث القائم؟",
        choices: [
          { id: "a", label: "أقصر ضلع" },
          { id: "b", label: "الضلع المقابل للزاوية القائمة" },
          { id: "c", label: "أي ضلع نختاره" },
        ],
        correctChoiceId: "b",
        hints: ["فكري في مكان الزاوية القائمة."],
        explanation: "الوتر يكون دائماً مقابل الزاوية القائمة.",
        sourceRefs: ["4AM geometry basics"],
      },
      {
        id: "geo-3",
        type: "short-text",
        prompt: "قبل أي قانون في المثلث القائم، ما أول شيء لازم تحدديه؟",
        acceptedAnswers: ["الوتر", "مكان الوتر", "الزاوية القائمة"],
        hints: ["هذا الشيء يحدد اختيارك للقانون."],
        explanation: "تحديد الوتر أو الزاوية القائمة هو الخطوة الأولى الصحيحة.",
        sourceRefs: ["Pedagogical docs 4AM math"],
      },
    ],
    summarySheetId: "summary-math-core",
    sourceRefs: ["BEM math archive 2016-2025: geometry"],
    examLinkYears: [2016, 2021, 2023, 2025],
    visual: "triangle",
  },
  {
    id: "math-statistics",
    subjectId: "math",
    title: "رياضيات: الإحصاء والتنظيم السريع للمعطيات",
    shortTitle: "الإحصاء",
    durationMinutes: 30,
    difficulty: "transfer",
    summary:
      "متوسطات، جداول، وتمثيل معطيات بطريقة تخليك ما تتلخبطيش يوم الامتحان.",
    goals: ["حساب المتوسط بسرعة", "تنظيم المعطيات", "قراءة السؤال بدقة"],
    phoneAwayRitual:
      "ديري 20 دقيقة مركزة فقط. هذا درس صغير لكن نقاطه مضمونة إذا كان التنظيم واضح.",
    recallWarmup: "من الذاكرة: كيف نحسب المتوسط الحسابي؟",
    finishLine: "المطلوب هو جواب صحيح ومنظم، مشي السرعة فقط.",
    sections: [
      {
        title: "1) المتوسط",
        body: [
          "المتوسط = مجموع القيم مقسوماً على عددها.",
          "إذا كان عندك جدول تكرارات، ديري مجموع (القيمة × التكرار) ثم قسمي على المجموع الكلي.",
        ],
      },
      {
        title: "2) تنظيم المعطيات",
        body: ["الجدول يخدمك: اكتبي القيم مرتبة، ثم التكرار، ثم الحساب."],
      },
    ],
    practice: [
      {
        id: "stat-1",
        type: "number",
        prompt: "ما متوسط القيم التالية: 6 ، 8 ، 10 ؟",
        answer: 8,
        hints: ["اجمعي القيم أولاً.", "بعدها اقسمي على 3."],
        explanation: "6 + 8 + 10 = 24 و 24 ÷ 3 = 8.",
        sourceRefs: ["BEM math archive 2016-2025: statistics"],
      },
      {
        id: "stat-2",
        type: "short-text",
        prompt: "لماذا الجدول يساعد في الإحصاء؟",
        acceptedAnswers: ["ينظم المعطيات", "باش ننظم المعطيات", "لتنظيم المعطيات"],
        hints: ["فكري في الهدف قبل الحساب."],
        explanation: "التنظيم يقلل الخطأ ويجعل الحساب أوضح.",
        sourceRefs: ["4AM statistics"],
      },
    ],
    summarySheetId: "summary-math-core",
    sourceRefs: ["BEM math archive 2016-2025: statistics"],
    examLinkYears: [2017, 2022, 2024],
    visual: "none",
  },
  {
    id: "math-exam-strategy",
    subjectId: "math",
    title: "رياضيات: كيف تتصرفي في موضوع BEM",
    shortTitle: "استراتيجية الامتحان",
    durationMinutes: 25,
    difficulty: "transfer",
    summary:
      "خطة عملية للوقت، اختيار البداية، واسترجاع الثقة إذا علقتِ في سؤال.",
    goals: ["توزيع الوقت", "رفع الثقة في أول 10 دقائق", "الخروج من التعطيل بسرعة"],
    phoneAwayRitual:
      "هذه الحصة للتصرف العقلي. اكتبي الخطة بيدك وخليها قدامك.",
    recallWarmup:
      "جاوبي بسرعة: إذا وقفتي في سؤال، ما هي أول حركة لازم تديريها؟",
    finishLine: "لازم يكون عندك بروتوكول واضح ليوم الامتحان، مشي فقط نوايا عامة.",
    sections: [
      {
        title: "1) أول 5 دقائق",
        body: ["اقري الموضوع كامل بنظرة سريعة.", "حددي سؤال سهل، متوسط، وصعب."],
      },
      {
        title: "2) كيف نبدأ؟",
        body: [
          "ابدئي بالسؤال اللي يعطيك نقطة وثقة بسرعة.",
          "لا تبدئي بأصعب سؤال فقط لأنه في البداية.",
        ],
      },
      {
        title: "3) إذا علقتِ",
        body: [
          "خط واحد تحت المعطيات، ارجعي للقانون، وإذا بقي الغموض اتركيه مؤقتاً.",
        ],
      },
    ],
    practice: [
      {
        id: "exam-1",
        type: "multiple-choice",
        prompt: "إذا علقتِ في سؤال 4 دقائق كاملة، ما أفضل تصرف؟",
        choices: [
          { id: "a", label: "نبقى حتى نكسره" },
          { id: "b", label: "نتركه مؤقتاً ونرجع له" },
          { id: "c", label: "نحذف السؤال من بالي نهائياً" },
        ],
        correctChoiceId: "b",
        hints: ["الوقت مورد محدود."],
        explanation: "الانتقال المؤقت يحافظ على النقاط الأخرى وعلى الهدوء.",
        sourceRefs: ["BEM exam strategy"],
      },
      {
        id: "exam-2",
        type: "short-text",
        prompt: "في أول خمس دقائق، ما الذي نبحث عنه؟",
        acceptedAnswers: [
          "السهل والمتوسط والصعب",
          "الأسئلة السهلة والمتوسطة والصعبة",
          "تصنيف الأسئلة",
        ],
        hints: ["الفكرة هي خريطة سريعة للموضوع."],
        explanation: "التصنيف السريع يعطيك خطة واضحة بدل الفوضى.",
        sourceRefs: ["BEM exam strategy"],
      },
    ],
    summarySheetId: "summary-math-final",
    sourceRefs: ["BEM exam strategy", "BEM math archive 2016-2025"],
    examLinkYears: [2016, 2018, 2021, 2025],
    visual: "none",
  },
  {
    id: "arabic-text-writing",
    subjectId: "arabic",
    title: "العربية: فهم النص والتعبير القصير",
    shortTitle: "فهم وتعبير",
    durationMinutes: 30,
    difficulty: "build",
    summary:
      "فهم المطلوب، استخراج الجواب من النص، ثم بناء تعبير قصير منظم.",
    goals: ["فهم السؤال", "استخراج الفكرة", "كتابة فقرة قصيرة"],
    phoneAwayRitual: "خذي 3 أنفاس، ثم اقرئي الأسئلة قبل النص.",
    recallWarmup:
      "ما الفرق بين السؤال الذي يطلب فكرة والسؤال الذي يطلب تعليلاً؟",
    finishLine: "الجواب يكون مختصراً، واضحاً، وفيه فكرة واحدة لكل جملة.",
    sections: [
      {
        title: "1) قبل قراءة النص",
        body: ["اقرئي الأسئلة أولاً باش عقلك يعرف واش يبحث."],
      },
      {
        title: "2) في التعبير",
        body: [
          "اكتبي مقدمة قصيرة جداً، ثم فكرة أولى وفكرة ثانية، ثم خاتمة بسيطة.",
        ],
      },
    ],
    practice: [
      {
        id: "ar-1",
        type: "multiple-choice",
        prompt: "في فهم النص، ما الأفضل أولاً؟",
        choices: [
          { id: "a", label: "أقرأ النص فقط" },
          { id: "b", label: "أقرأ الأسئلة ثم النص" },
          { id: "c", label: "أجاوب مباشرة" },
        ],
        correctChoiceId: "b",
        hints: ["الفكرة هي توجيه الانتباه."],
        explanation: "الأسئلة تعطيك خريطة بحث داخل النص.",
        sourceRefs: ["BEM Arabic archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-arabic",
    sourceRefs: ["BEM Arabic archive 2016-2025"],
    examLinkYears: [2017, 2020, 2023, 2025],
    visual: "none",
  },
  {
    id: "french-opinion-condition",
    subjectId: "french",
    title: "Français: opinion, condition et production",
    shortTitle: "Opinion et condition",
    durationMinutes: 30,
    difficulty: "build",
    summary:
      "Les structures les plus utiles pour comprendre et écrire sans surcharge.",
    goals: ["Repérer le sens", "Employer un verbe d’opinion", "Écrire 4-5 lignes"],
    phoneAwayRitual: "Lis à voix basse la consigne avant toute réponse.",
    recallWarmup: "Écris une phrase avec Je pense que.",
    finishLine: "Tu dois pouvoir écrire un petit avis correct avec une structure simple.",
    sections: [
      {
        title: "1) Verbes d’opinion",
        body: [
          "Je pense que, j’estime que, je trouve que permettent d’exprimer un avis.",
        ],
      },
      {
        title: "2) Condition",
        body: [
          "Si + présent => présent/futur. Si + imparfait => conditionnel présent.",
        ],
      },
    ],
    practice: [
      {
        id: "fr-1",
        type: "short-text",
        prompt: "Complète: A mon avis, l’école ...",
        acceptedAnswers: [
          "A mon avis, l’école est importante.",
          "a mon avis l’école est importante",
        ],
        hints: ["Une phrase simple suffit."],
        explanation: "Le but est d’exprimer un avis clair avec une phrase correcte.",
        sourceRefs: ["BEM French archive 2016-2025"],
      },
      {
        id: "fr-2",
        type: "multiple-choice",
        prompt: "Choisis la structure correcte.",
        choices: [
          { id: "a", label: "Si j’étudie, je réussirai." },
          { id: "b", label: "Si j’étudie, je réussirais." },
          { id: "c", label: "Si j’étudiais, je réussis." },
        ],
        correctChoiceId: "a",
        hints: ["Présent avec futur."],
        explanation: "Si + présent prend souvent le futur dans la proposition principale.",
        sourceRefs: ["4AM French grammar"],
      },
    ],
    summarySheetId: "summary-french",
    sourceRefs: ["BEM French archive 2016-2025", "4AM French summaries"],
    examLinkYears: [2018, 2021, 2024, 2025],
    visual: "none",
  },
  {
    id: "english-core",
    subjectId: "english",
    title: "English: reading, grammar and short writing",
    shortTitle: "English core",
    durationMinutes: 30,
    difficulty: "build",
    summary:
      "Short reading moves, core grammar, and a simple paragraph template for BEM tasks.",
    goals: [
      "Catch the main idea",
      "Use short grammar structures",
      "Write one clear paragraph",
    ],
    phoneAwayRitual: "Read the task twice before touching the answer line.",
    recallWarmup: "Write one sentence with because.",
    finishLine: "You should finish with one short but correct paragraph.",
    sections: [
      {
        title: "1) Reading move",
        body: [
          "Start with the title and first sentence. They usually reveal the topic.",
        ],
      },
      {
        title: "2) Short writing",
        body: [
          "Use a topic sentence, one support sentence, then a simple ending sentence.",
        ],
      },
    ],
    practice: [
      {
        id: "en-1",
        type: "multiple-choice",
        prompt: "Which connector gives a reason?",
        choices: [
          { id: "a", label: "because" },
          { id: "b", label: "but" },
          { id: "c", label: "finally" },
        ],
        correctChoiceId: "a",
        hints: ["Think cause."],
        explanation: "because introduces a reason.",
        sourceRefs: ["BEM English archive 2016-2025"],
      },
      {
        id: "en-2",
        type: "short-text",
        prompt: "Complete with one simple sentence: I study every day because ...",
        acceptedAnswers: [
          "I study every day because I want to succeed.",
          "i study every day because i want to succeed",
        ],
        hints: ["A short correct sentence is enough."],
        explanation: "The aim is a clear and correct sentence, not a fancy one.",
        sourceRefs: ["BEM English archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-english",
    sourceRefs: ["BEM English archive 2016-2025"],
    examLinkYears: [2016, 2019, 2023, 2025],
    visual: "none",
  },
  {
    id: "historygeo-timeline",
    subjectId: "historygeo",
    title: "تاريخ وجغرافيا: القصة الزمنية من الاحتلال إلى الدولة الحديثة",
    shortTitle: "القصة الزمنية",
    durationMinutes: 35,
    difficulty: "build",
    summary:
      "نراجع التاريخ كسلسلة مترابطة، والجغرافيا كأفكار مع أمثلة مباشرة من الجزائر.",
    goals: ["ترتيب الأحداث", "فهم السبب والنتيجة", "تثبيت التواريخ المفصلية"],
    phoneAwayRitual: "خذي ورقة وقسميها: سبب / حدث / نتيجة.",
    recallWarmup: "اكتبي من الذاكرة 3 تواريخ أساسية.",
    finishLine: "لازم تقدري تحكي السلسلة التاريخية في دقيقة واحدة بدون توقف طويل.",
    sections: [
      {
        title: "1) التاريخ كقصة",
        body: [
          "ما نحفظوش أحداثاً مفصولة. كل حدث يجر للي بعده.",
          "مثال: مجازر 1945 عمقت القناعة بأن الحل السلمي وحده لا يكفي.",
        ],
      },
      {
        title: "2) الجغرافيا",
        body: ["كل مفهوم لازم يجي معه مثال: السكان، التنمية، الموارد، المبادلات."],
      },
    ],
    practice: [
      {
        id: "hg-1",
        type: "reorder",
        prompt: "رتبي هذه المحطات التاريخية:",
        items: [
          "الاستقلال",
          "اندلاع الثورة التحريرية",
          "بداية الاحتلال الفرنسي",
        ],
        correctOrder: [
          "بداية الاحتلال الفرنسي",
          "اندلاع الثورة التحريرية",
          "الاستقلال",
        ],
        hints: ["فكري في 1830 ثم 1954 ثم 1962."],
        explanation: "1830 ثم 1954 ثم 1962.",
        sourceRefs: ["BEM History/Geo archive 2016-2025"],
      },
      {
        id: "hg-2",
        type: "short-text",
        prompt: "لماذا تعتبر مجازر 8 ماي 1945 حدثاً مفصلياً؟",
        acceptedAnswers: [
          "لأنها عمقت القطيعة مع الاستعمار",
          "لأنها بينت عنف الاستعمار وعمقت القطيعة",
          "عمقت القطيعة مع الحل السلمي",
        ],
        hints: ["الجواب يكون سبباً ونتيجة."],
        explanation: "هذا الحدث غيّر الوعي الوطني وبيّن حدود الوعود الاستعمارية.",
        sourceRefs: ["BEM History/Geo archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-historygeo",
    sourceRefs: ["BEM History/Geo archive 2016-2025"],
    examLinkYears: [2017, 2020, 2024, 2025],
    visual: "timeline",
  },
  {
    id: "physics-formulas",
    subjectId: "physics",
    title: "فيزياء: القانون ثم التعويض",
    shortTitle: "القوانين الأساسية",
    durationMinutes: 30,
    difficulty: "build",
    summary:
      "التركيز على السرعة، الكهرباء، والوحدات مع نفس طريقة العمل في كل تمرين.",
    goals: ["كتابة القانون", "التعويض المنظم", "حماية الوحدات"],
    phoneAwayRitual: "حضري جدول صغير: المعطيات / القانون / النتيجة.",
    recallWarmup: "اكتبي قانون السرعة من الذاكرة.",
    finishLine: "لازم يكون عندك روتين واضح لأي تمرين عددي.",
    sections: [
      {
        title: "1) نفس المنهج في كل مرة",
        body: ["معطيات -> قانون -> تعويض -> وحدة -> فحص معقولية النتيجة."],
      },
    ],
    practice: [
      {
        id: "phy-1",
        type: "number",
        prompt: "جسم قطع 120 m في 20 s. ما السرعة؟",
        answer: 6,
        suffix: "m/s",
        hints: ["استعملي v = d / t."],
        explanation: "120 ÷ 20 = 6 m/s.",
        sourceRefs: ["BEM Physics archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-physics",
    sourceRefs: ["BEM Physics archive 2016-2025"],
    examLinkYears: [2016, 2019, 2022, 2025],
    visual: "none",
  },
  {
    id: "science-systems",
    subjectId: "science",
    title: "علوم: الأنظمة الحيوية بطريقة الفهم",
    shortTitle: "الأنظمة الحيوية",
    durationMinutes: 30,
    difficulty: "build",
    summary:
      "بدل الحفظ الأعمى، نفهم التسلسل: منبه -> معالجة -> استجابة، أو مسبب -> دفاع -> نتيجة.",
    goals: ["فهم السلسلة", "استخراج الكلمات المفتاحية", "التعبير العلمي القصير"],
    phoneAwayRitual: "ارسمي سهمين قبل ما تقري: السبب ثم النتيجة.",
    recallWarmup: "اكتبي سلسلة بسيطة للجهاز العصبي.",
    finishLine: "تقدري تشرحي آلية قصيرة بجملة أو جملتين منظمتين.",
    sections: [
      {
        title: "1) الجهاز العصبي",
        body: ["منبه -> مستقبل حسي -> عصب -> مركز عصبي -> استجابة."],
      },
      {
        title: "2) المناعة",
        body: ["جسم غريب -> دفاع -> حماية. أهم شيء فهم الدور العام."],
      },
    ],
    practice: [
      {
        id: "sci-1",
        type: "short-text",
        prompt: "أكملي السلسلة: منبه -> ... -> استجابة",
        acceptedAnswers: [
          "مستقبل حسي -> عصب -> مركز عصبي",
          "مستقبل حسي ثم عصب ثم مركز عصبي",
        ],
        hints: ["فكري في الطريق الذي تسلكه الرسالة العصبية."],
        explanation: "الرسالة تنتقل من المستقبل نحو المركز العصبي ثم تخرج الاستجابة.",
        sourceRefs: ["BEM Science archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-science",
    sourceRefs: ["BEM Science archive 2016-2025"],
    examLinkYears: [2018, 2021, 2024, 2025],
    visual: "none",
  },
  {
    id: "islamic-values",
    subjectId: "islamic",
    title: "إسلامية: المعنى، القيمة، والتطبيق",
    shortTitle: "المعنى والقيمة",
    durationMinutes: 25,
    difficulty: "build",
    summary:
      "نخرج من النص المعنى ثم القيمة ثم التطبيق العملي، بلا حشو.",
    goals: ["فهم المعنى", "استخراج القيمة", "كتابة تطبيق قصير"],
    phoneAwayRitual: "اقرئي المطلوب وحددي: معنى أم قيمة أم حكم؟",
    recallWarmup: "اكتبي مثالاً واحداً على قيمة أخلاقية درستيها.",
    finishLine: "كل جواب يكون فيه مصطلح صحيح + تطبيق واضح.",
    sections: [
      {
        title: "1) ثلاثة أسئلة ثابتة",
        body: ["ماذا يعني النص؟ ما القيمة؟ كيف نطبقها؟"],
      },
    ],
    practice: [
      {
        id: "isl-1",
        type: "short-text",
        prompt: "إذا طلب منك تطبيق قيمة الصدق، كيف يكون الجواب؟",
        acceptedAnswers: [
          "أقول الحقيقة وأتجنب الكذب",
          "قول الحقيقة وتجنب الكذب",
        ],
        hints: ["أعطي سلوكاً عملياً واضحاً."],
        explanation: "الجواب التطبيقي يكون سلوكاً مباشراً من الحياة اليومية.",
        sourceRefs: ["BEM Islamic archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-islamic",
    sourceRefs: ["BEM Islamic archive 2016-2025"],
    examLinkYears: [2017, 2020, 2023, 2025],
    visual: "none",
  },
  {
    id: "civics-citizenship",
    subjectId: "civics",
    title: "مدنية: المواطنة والمؤسسات",
    shortTitle: "المواطنة والمؤسسات",
    durationMinutes: 25,
    difficulty: "build",
    summary:
      "المفاهيم الأساسية مع أمثلة يومية حتى ما يبقاش الدرس مجرد حفظ جاف.",
    goals: ["تعريف المفهوم", "ربطه بمثال", "التمييز بين حق وواجب"],
    phoneAwayRitual: "خذي دقيقة وفكري في مثال من حياتك قبل قراءة الملخص.",
    recallWarmup: "ما الفرق بين الحق والواجب؟",
    finishLine: "تقدري تعرفي المواطنة أو المؤسسة مع مثال واحد واضح.",
    sections: [
      {
        title: "1) المواطنة",
        body: ["المواطنة تعني الانتماء والمشاركة واحترام الحقوق والواجبات."],
      },
      {
        title: "2) المؤسسات",
        body: ["كل مؤسسة عندها دور. المهم هو تسمية الدور بوضوح."],
      },
    ],
    practice: [
      {
        id: "civ-1",
        type: "multi-select",
        prompt: "اختاري ما يدخل ضمن الواجبات:",
        choices: [
          { id: "a", label: "احترام القانون" },
          { id: "b", label: "المطالبة بالتعليم" },
          { id: "c", label: "المحافظة على الممتلكات العامة" },
        ],
        correctChoiceIds: ["a", "c"],
        hints: ["فكري في ما يجب على المواطن فعله."],
        explanation: "الحق شيء تستفيدين منه، والواجب شيء تؤدينه.",
        sourceRefs: ["BEM Civics archive 2016-2025"],
      },
    ],
    summarySheetId: "summary-civics",
    sourceRefs: ["BEM Civics archive 2016-2025"],
    examLinkYears: [2016, 2021, 2024, 2025],
    visual: "none",
  },
];
