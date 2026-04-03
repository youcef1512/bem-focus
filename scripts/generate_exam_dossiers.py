from __future__ import annotations

import json
import os
import re
import subprocess
from collections import defaultdict
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "src" / "data" / "bemArchive.generated.json"
OUTPUT_PATH = ROOT / "src" / "data" / "examDossiers.generated.json"
TMP_ROOT = ROOT / "tmp" / "exam_ocr"
TESSERACT_PATH = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
TESSDATA_PREFIX = ROOT / "tmp" / "tessdata"

ARABIC_SUBJECTS = {"arabic", "historygeo", "physics", "science", "islamic", "civics", "math"}
FRENCH_SUBJECTS = {"french"}
ENGLISH_SUBJECTS = {"english"}

ARABIC_VERBS = (
    "رتب",
    "أرتب",
    "احسب",
    "أحسب",
    "أكمل",
    "استخرج",
    "بين",
    "بيّن",
    "وضح",
    "وضّح",
    "فسر",
    "فسّر",
    "علل",
    "أدرس",
    "اكتب",
    "عرّف",
    "عرف",
    "قارن",
    "استنتج",
)

LATIN_SECTION_PATTERNS = (
    "part",
    "activity",
    "question",
    "reading comprehension",
    "compréhension",
    "production",
    "langue",
    "grammar",
    "writing",
)

LATIN_QUESTION_RE = re.compile(
    r"^(?:question\s*\d+|task\s*\d+|activity\s*\d+|\(?\d+\)?\s*[-.)/:]|\(?[ivx]+\)?\s*[-.)])",
    re.IGNORECASE,
)
ARABIC_QUESTION_RE = re.compile(r"^\(?[0-9٠-٩]+\)?\s*[-.)/:]")
OPTION_RE = re.compile(r"^[a-dA-D][\-\.\)]\s+.+")

HEADER_NOISE_PATTERNS = (
    "الجمهورية الجزائرية",
    "وزارة التربية",
    "الديوان الوطني",
    "امتحان شهادة التعليم المتوسط",
    "اختبار في مادة",
    "duration",
    "durée",
    "name:",
    "page ",
)

TOPIC_RULES: dict[str, list[tuple[str, str]]] = {
    "math": [
        (r"معادل|نشر|تحليل|عبارة|x|جبر", "الجبر والمعادلات"),
        (r"دال|مستقيم|تمثيل|جدول|graph|function", "الدوال والتمثيل"),
        (r"مثلث|فيثاغورس|جيب|زاوية|وتر|هندس", "الهندسة والمثلثات"),
        (r"متوسط|احص|احتمال|جدول", "الإحصاء والتنظيم"),
    ],
    "arabic": [
        (r"فكرة|نص|استخرج|علل|فسر", "فهم النص"),
        (r"إعراب|وظيفة|أسلوب|جمع|اسم|فعل|جملة", "القواعد واللغة"),
        (r"اكتب|فقرة|نصا|تعبير", "التعبير الكتابي"),
    ],
    "french": [
        (r"compr|texte|id[ée]e|th[èe]me", "Compréhension"),
        (r"grammaire|langue|verbe|connecteur|condition", "Langue et grammaire"),
        (r"r[ée]dige|production|paragraphe", "Production écrite"),
    ],
    "english": [
        (r"read|text|main idea|topic|comprehension", "Reading"),
        (r"grammar|connector|tense|modal", "Grammar"),
        (r"write|paragraph|advice|opinion", "Writing"),
    ],
    "historygeo": [
        (r"رتب|تاريخ|متى|timeline|chron", "التسلسل الزمني"),
        (r"فسر|علل|نتائج|أسباب|why|cause", "الأسباب والنتائج"),
        (r"عرف|مفهوم|جغراف|تنمية|سكان", "المفاهيم والتعاريف"),
    ],
    "physics": [
        (r"احسب|قانون|سرعة|طاقة|توتر|تيار|مقاومة", "القوانين والحساب"),
        (r"دارة|مصباح|تركيب|سلسلة|تفرع", "الدوائر الكهربائية"),
        (r"فسر|علل|استنتج", "التحليل العلمي"),
    ],
    "science": [
        (r"مناعة|جسم مضاد|دفاع", "المناعة"),
        (r"عصب|منبه|استجابة|رسالة", "الاتصال العصبي"),
        (r"بيئة|تلوث|توازن", "البيئة"),
    ],
    "islamic": [
        (r"قيم|عبرة|استنتج|معنى", "المعاني والقيم"),
        (r"حكم|سلوك|تطبيق", "التطبيق والسلوك"),
    ],
    "civics": [
        (r"مواطنة|حق|واجب", "المواطنة والحقوق"),
        (r"مؤسسة|دولة|بلدية|هيئة", "المؤسسات"),
        (r"قانون|مشاركة|انتخاب", "المشاركة والقانون"),
    ],
}

FALLBACK_TOPICS = {
    "math": "مهارة رياضيات",
    "arabic": "مهارة عربية",
    "french": "Compétence de français",
    "english": "English skill",
    "historygeo": "مفهوم تاريخ/جغرافيا",
    "physics": "مفهوم فيزياء",
    "science": "مفهوم علوم",
    "islamic": "مفهوم علوم إسلامية",
    "civics": "مفهوم مدني",
}


@dataclass
class PromptCard:
    prompt: str
    page_number: int
    section_title: str
    kind: str
    skill_tag: str
    linked_topics: list[str]
    options: list[str]
    original_lines: list[str]
    recall_first: str
    start_steps: list[str]
    answer_frame: list[str]
    pitfalls: list[str]
    self_check: list[str]


def utc_timestamp() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def detect_lang(subject_id: str) -> str:
    if subject_id in ENGLISH_SUBJECTS:
        return "eng"
    if subject_id in FRENCH_SUBJECTS:
        return "fra+eng"
    if subject_id in ARABIC_SUBJECTS:
        return "ara+eng"
    return "eng"


def clean_line(text: str) -> str:
    cleaned = (
        text.replace("\u200f", " ")
        .replace("\u200e", " ")
        .replace("\ufeff", " ")
        .replace("â€", " ")
    )
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = cleaned.strip("|")
    return cleaned


def is_noise_line(line: str) -> bool:
    lowered = line.lower()
    if len(line) <= 1:
        return True
    return any(pattern in lowered for pattern in HEADER_NOISE_PATTERNS)


def is_option_line(line: str) -> bool:
    return bool(OPTION_RE.match(line))


def is_latin_section(line: str) -> bool:
    lowered = line.lower()
    return any(pattern in lowered for pattern in LATIN_SECTION_PATTERNS)


def is_arabic_heading(line: str) -> bool:
    return any(token in line for token in ("الجزء", "الوضعية", "النشاط", "التعليمة", "السند"))


def is_latin_question_start(line: str) -> bool:
    return bool(LATIN_QUESTION_RE.match(line))


def is_arabic_question_start(line: str) -> bool:
    return bool(ARABIC_QUESTION_RE.match(line)) or line.startswith(ARABIC_VERBS)


def strip_latin_prefix(line: str) -> str:
    return re.sub(
        r"^(?:question\s*\d+|task\s*\d+|activity\s*\d+|\(?\d+\)?\s*[-.)/:]|\(?[ivx]+\)?\s*[-.)])\s*",
        "",
        line,
        flags=re.IGNORECASE,
    ).strip()


def strip_arabic_prefix(line: str) -> str:
    return re.sub(r"^\(?[0-9٠-٩]+\)?\s*[-.)/:]\s*", "", line).strip()


def infer_kind(prompt: str, options: list[str]) -> str:
    if options:
        return "multiple-choice"
    if re.search(r"رتب|match|order|associe|relie", prompt, re.IGNORECASE):
        return "ordering"
    if re.search(r"احسب|calculate|calcule|compute", prompt, re.IGNORECASE):
        return "calculation"
    if re.search(r"اكتب|write|rédige|produis|paragraph|production|فقرة", prompt, re.IGNORECASE):
        return "writing"
    if re.search(r"وضح|فسر|علل|why|explain|justify|pourquoi|justifie", prompt, re.IGNORECASE):
        return "analysis"
    return "response"


def infer_topics(subject_id: str, prompt: str) -> tuple[str, list[str]]:
    matches = [
        label
        for pattern, label in TOPIC_RULES.get(subject_id, [])
        if re.search(pattern, prompt, re.IGNORECASE)
    ]
    if not matches:
        matches = [FALLBACK_TOPICS.get(subject_id, "Core skill")]
    unique: list[str] = []
    for label in matches:
        if label not in unique:
            unique.append(label)
    return unique[0], unique[:3]


def build_answer_frame(subject_id: str, kind: str, skill_tag: str) -> list[str]:
    if subject_id == "math" or kind == "calculation":
        return [
            "المعطيات:",
            "المطلوب:",
            "القانون أو الفكرة:",
            "التعويض أو الخطوات:",
            "النتيجة النهائية:",
        ]
    if subject_id in {"historygeo", "civics", "islamic"}:
        return [
            "أحدد المفهوم أو الحدث:",
            "أذكر الفكرة الأساسية:",
            "أضيف السبب أو المثال أو النتيجة:",
        ]
    if subject_id == "arabic" and "التعبير" in skill_tag:
        return ["مقدمة قصيرة:", "فكرة أولى:", "فكرة ثانية أو مثال:", "خاتمة قصيرة:"]
    if subject_id in {"french", "english"} and kind == "writing":
        return ["Opening sentence", "Main idea", "Support or example", "Closing sentence"]
    return ["أفهم المطلوب:", "أستخرج الدليل أو القاعدة:", "أكتب الجواب المختصر:"]


def build_pitfalls(subject_id: str, kind: str) -> list[str]:
    if subject_id == "math" or kind == "calculation":
        return [
            "القفز إلى الحساب قبل كتابة المعطيات والقانون.",
            "نسيان الوحدة أو الإشارة النهائية.",
        ]
    if subject_id == "historygeo":
        return [
            "خلط التاريخ بالنتيجة أو خلط الحدث بسبب حدث آخر.",
            "كتابة تعريف عام بينما السؤال يطلب تفسيرًا أو تعليلاً.",
        ]
    if subject_id == "arabic":
        return [
            "نسخ النص كما هو بدل الجواب على قدر المطلوب.",
            "الخلط بين فهم النص والقواعد أو ترك التعبير دون تنظيم.",
        ]
    if subject_id in {"french", "english"}:
        return [
            "جملة طويلة ومكسرة بدل جملة قصيرة صحيحة.",
            "الإجابة خارج المطلوب أو دون كلمة مفتاحية من النص.",
        ]
    return [
        "الإجابة العامة جدًا دون ربطها بالمطلوب المباشر.",
        "ترك السؤال دون فحص نهائي أو دون مثال داعم عند الحاجة.",
    ]


def build_pedagogy(
    prompt: str,
    kind: str,
    subject_id: str,
) -> tuple[str, list[str], list[str], list[str], list[str], str, list[str]]:
    skill_tag, linked_topics = infer_topics(subject_id, prompt)
    answer_frame = build_answer_frame(subject_id, kind, skill_tag)
    pitfalls = build_pitfalls(subject_id, kind)

    if kind == "multiple-choice":
        return (
            "قبل الاختيار، اقري السؤال كامل ثم قارني بين جميع الخيارات قبل تثبيت الجواب.",
            [
                "حددي ما الذي يطلبه السؤال بالضبط.",
                "اشطبي الخيارين المستبعدين أولاً.",
                "اختاري الجواب ثم ارجعي إلى النص أو القاعدة التي تدعمه.",
            ],
            [
                "هل الخيار الذي اخترته يجيب فعلاً على السؤال لا على جزء منه فقط؟",
                "هل تجاهلت خياراً يبدو صحيحاً لكنه خارج السياق؟",
            ],
            answer_frame,
            pitfalls,
            skill_tag,
            linked_topics,
        )
    if kind == "ordering":
        return (
            "ابدئي بأقدم وأحدث عنصر أولاً، ثم املئي الوسط.",
            [
                "حددي أول عنصر وآخر عنصر من الذاكرة أو من المعطيات.",
                "قارني بين العناصر الباقية زوجًا بزوج.",
                "راجعي الترتيب الكامل مرة أخيرة قبل تثبيته.",
            ],
            [
                "هل كل عنصر في مكانه الزمني أو المنطقي الصحيح؟",
                "هل يوجد عنصر واحد يحتاج رجوعًا للسند؟",
            ],
            answer_frame,
            pitfalls,
            skill_tag,
            linked_topics,
        )
    if kind == "calculation":
        return (
            "قبل الحساب، اكتبي المعطيات والمطلوب ثم القانون.",
            [
                "استخرجي المعطيات من السؤال كما هي.",
                "اكتبي القانون المناسب قبل التعويض.",
                "نفذي الحساب ثم أضيفي الوحدة إذا كانت مطلوبة.",
            ],
            [
                "هل استعملت القانون الصحيح؟",
                "هل النتيجة معقولة وبالوحدة المناسبة؟",
            ],
            answer_frame,
            pitfalls,
            skill_tag,
            linked_topics,
        )
    if kind == "writing":
        return (
            "قسمي الجواب إلى بداية واضحة، فكرة أو فكرتين، ثم خاتمة قصيرة.",
            [
                "حددي نوع المطلوب: فقرة أو نص قصير أو تطبيق.",
                "اكتبي سطرًا افتتاحيًا يفتح الموضوع مباشرة.",
                "أضيفي مثالاً أو تعليلاً ثم اختمي بجملة بسيطة.",
            ],
            [
                "هل الجواب منظم أم مجرد جمل مبعثرة؟",
                "هل أجبت عن المطلوب دون حشو خارج الموضوع؟",
            ],
            answer_frame,
            pitfalls,
            skill_tag,
            linked_topics,
        )
    if kind == "analysis":
        return (
            "ابحثي عن سبب أو أثر أو دليل قبل كتابة الجواب.",
            [
                "حددي الكلمة المفتاحية: لماذا؟ كيف؟ بماذا تفسر؟",
                "استخرجي الدليل من السند أو من القاعدة.",
                "اكتبي جوابًا قصيرًا ثم دعميه بمثال أو تعليل.",
            ],
            [
                "هل الجواب فيه فكرة ودليل، أم مجرد تعريف عام؟",
                "هل استعملت كلمة من السند أو من الدرس تقوي الجواب؟",
            ],
            answer_frame,
            pitfalls,
            skill_tag,
            linked_topics,
        )
    if subject_id in {"historygeo", "civics", "islamic"}:
        return (
            "حددي المفهوم ثم اربطيه بسبب أو مثال أو فائدة حسب المطلوب.",
            [
                "اقري الفعل الأساسي في السؤال.",
                "اختاري من الدرس الكلمة المفتاحية الأقرب للمطلوب.",
                "ابني جوابًا قصيرًا ومنظمًا.",
            ],
            [
                "هل الجواب على قدر السؤال؟",
                "هل فيه مثال أو تعليل عندما يكون ذلك مطلوبًا؟",
            ],
            answer_frame,
            pitfalls,
            skill_tag,
            linked_topics,
        )
    return (
        "ابدئي بتحديد ما يريده السؤال قبل التفكير في الجواب.",
        [
            "اقري السؤال ببطء وحددي المطلوب.",
            "استخرجي الفكرة أو القاعدة المرتبطة به.",
            "اكتبي جوابًا قصيرًا ثم راجعيه.",
        ],
        [
            "هل جاوبت على المطلوب نفسه؟",
            "هل يمكن تبسيط الجواب أكثر مع الحفاظ على الدقة؟",
        ],
        answer_frame,
        pitfalls,
        skill_tag,
        linked_topics,
    )


def render_page_image(pdf_path: Path, page_number: int) -> Path:
    TMP_ROOT.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(pdf_path))
    page = document[page_number - 1]
    image_path = TMP_ROOT / f"{pdf_path.stem}-page-{page_number}.png"
    page.render(scale=2).to_pil().save(image_path)
    return image_path


def ocr_page(image_path: Path, lang: str) -> str:
    env = os.environ.copy()
    env["TESSDATA_PREFIX"] = str(TESSDATA_PREFIX)
    result = subprocess.run(
        [
            str(TESSERACT_PATH),
            str(image_path),
            "stdout",
            "-l",
            lang,
            "--psm",
            "6",
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="ignore",
        env=env,
        check=False,
    )
    return result.stdout


def extract_lines(text: str) -> list[str]:
    lines = [clean_line(line) for line in text.splitlines()]
    return [line for line in lines if line and not is_noise_line(line)]


def build_prompt_card(
    subject_id: str,
    prompt_text: str,
    page_number: int,
    section_title: str,
    original_lines: list[str],
    options: list[str] | None = None,
) -> PromptCard | None:
    normalized_prompt = clean_line(prompt_text)
    if len(normalized_prompt) < 6:
        return None
    normalized_options = [clean_line(option) for option in (options or []) if clean_line(option)]
    kind = infer_kind(normalized_prompt, normalized_options)
    recall, steps, check, answer_frame, pitfalls, skill_tag, linked_topics = build_pedagogy(
        normalized_prompt,
        kind,
        subject_id,
    )
    return PromptCard(
        prompt=normalized_prompt,
        page_number=page_number,
        section_title=section_title,
        kind=kind,
        skill_tag=skill_tag,
        linked_topics=linked_topics,
        options=normalized_options,
        original_lines=[clean_line(line) for line in original_lines if clean_line(line)],
        recall_first=recall,
        start_steps=steps,
        answer_frame=answer_frame,
        pitfalls=pitfalls,
        self_check=check,
    )


def parse_latin_page(subject_id: str, lines: list[str], page_number: int) -> list[PromptCard]:
    prompts: list[PromptCard] = []
    section_title = "Original page"
    index = 0

    while index < len(lines):
        line = lines[index]
        if is_latin_section(line):
            section_title = line
            index += 1
            continue

        if is_latin_question_start(line):
            original = [line]
            options: list[str] = []
            prompt_lines = [strip_latin_prefix(line)]
            cursor = index + 1

            while cursor < len(lines):
                candidate = lines[cursor]
                if is_latin_section(candidate) or is_latin_question_start(candidate):
                    break
                original.append(candidate)
                if is_option_line(candidate):
                    options.append(candidate)
                else:
                    prompt_lines.append(candidate)
                cursor += 1

            card = build_prompt_card(
                subject_id,
                " ".join(part for part in prompt_lines if part and not is_option_line(part)),
                page_number,
                section_title,
                original,
                options,
            )
            if card:
                prompts.append(card)
            index = cursor
            continue

        if any(token in line.lower() for token in ("write", "complete", "match", "choose", "rédige", "recopie", "fill")):
            card = build_prompt_card(subject_id, line, page_number, section_title, [line])
            if card:
                prompts.append(card)
        index += 1

    return prompts


def parse_arabic_page(subject_id: str, lines: list[str], page_number: int) -> list[PromptCard]:
    prompts: list[PromptCard] = []
    section_title = "الصفحة الأصلية"
    index = 0

    while index < len(lines):
        line = lines[index]
        if is_arabic_heading(line):
            section_title = line
            if line.startswith("التعليمة"):
                original = [line]
                prompt_lines = [line.split(":", 1)[-1].strip()] if ":" in line else [line]
                cursor = index + 1
                while cursor < len(lines):
                    candidate = lines[cursor]
                    if is_arabic_heading(candidate) or is_arabic_question_start(candidate):
                        break
                    original.append(candidate)
                    prompt_lines.append(candidate)
                    cursor += 1
                card = build_prompt_card(
                    subject_id,
                    " ".join(part for part in prompt_lines if part),
                    page_number,
                    section_title,
                    original,
                )
                if card:
                    prompts.append(card)
                index = cursor
                continue
            index += 1
            continue

        if is_arabic_question_start(line) or "؟" in line or "ØŸ" in line:
            original = [line]
            prompt_lines = [strip_arabic_prefix(line)]
            cursor = index + 1
            while cursor < len(lines):
                candidate = lines[cursor]
                if is_arabic_heading(candidate) or is_arabic_question_start(candidate):
                    break
                if len(candidate) <= 3:
                    cursor += 1
                    continue
                original.append(candidate)
                prompt_lines.append(candidate)
                cursor += 1
            card = build_prompt_card(
                subject_id,
                " ".join(part for part in prompt_lines if part),
                page_number,
                section_title,
                original,
            )
            if card:
                prompts.append(card)
            index = cursor
            continue
        index += 1

    return prompts


def dedupe_prompts(prompts: list[PromptCard]) -> list[PromptCard]:
    seen: set[str] = set()
    unique: list[PromptCard] = []
    for prompt in prompts:
        key = f"{prompt.page_number}:{clean_line(prompt.prompt)}"
        if len(clean_line(prompt.prompt)) < 6 or key in seen:
            continue
        seen.add(key)
        unique.append(prompt)
    return unique


def build_entry(entry: dict[str, Any]) -> dict[str, Any]:
    local_path = entry.get("localPaperPath")
    if not local_path:
        return {}

    paper_path = ROOT / "public" / local_path.lstrip("/").replace("/", os.sep)
    if not paper_path.exists():
        return {}

    lang = detect_lang(entry["subjectId"])
    document = pdfium.PdfDocument(str(paper_path))
    prompts: list[PromptCard] = []
    pages_data: list[dict[str, Any]] = []

    for page_number in range(1, len(document) + 1):
        image_path = render_page_image(paper_path, page_number)
        text = ocr_page(image_path, lang)
        lines = extract_lines(text)
        page_prompts = (
            parse_latin_page(entry["subjectId"], lines, page_number)
            if entry["subjectId"] in ENGLISH_SUBJECTS or entry["subjectId"] in FRENCH_SUBJECTS
            else parse_arabic_page(entry["subjectId"], lines, page_number)
        )
        pages_data.append(
            {
                "pageNumber": page_number,
                "headline": lines[:4],
                "transcript": lines,
            }
        )
        prompts.extend(page_prompts)

    prompts = dedupe_prompts(prompts)
    if not prompts:
        prompts = [
            PromptCard(
                prompt="راجعي الصفحة الأصلية مباشرة: لم ننجح في استخراج سؤال واضح بشكل آلي من هذه النسخة.",
                page_number=1,
                section_title="Fallback",
                kind="response",
                skill_tag="رجوع إلى الأصل",
                linked_topics=["الموضوع الأصلي"],
                options=[],
                original_lines=pages_data[0]["headline"] if pages_data else [],
                recall_first="ابدئي من PDF الأصلي ثم اكتبي المطلوب بكلماتك قبل الحل.",
                start_steps=[
                    "اقري الصفحة الأصلية بهدوء.",
                    "حددي المطلوب.",
                    "حوّلي السؤال إلى جواب قصير.",
                ],
                answer_frame=["أقرأ السؤال:", "أحدد المطلوب:", "أكتب بداية جوابي:"],
                pitfalls=["القفز إلى الجواب دون تثبيت النص الأصلي."],
                self_check=["هل استخرجت المطلوب بدقة من الصفحة الأصلية؟"],
            )
        ]

    serialized_prompts: list[dict[str, Any]] = []
    prompts_by_page: dict[int, list[str]] = defaultdict(list)
    section_map: dict[str, dict[str, Any]] = {}

    for idx, prompt in enumerate(prompts):
        prompt_id = f"{entry['subjectId']}-{entry['year']}-prompt-{idx + 1}"
        serialized_prompts.append(
            {
                "id": prompt_id,
                "pageNumber": prompt.page_number,
                "sectionTitle": prompt.section_title,
                "prompt": prompt.prompt,
                "kind": prompt.kind,
                "skillTag": prompt.skill_tag,
                "linkedTopics": prompt.linked_topics,
                "options": prompt.options,
                "originalLines": prompt.original_lines,
                "recallFirst": prompt.recall_first,
                "startSteps": prompt.start_steps,
                "answerFrame": prompt.answer_frame,
                "pitfalls": prompt.pitfalls,
                "selfCheck": prompt.self_check,
            }
        )
        prompts_by_page[prompt.page_number].append(prompt_id)
        bucket = section_map.setdefault(
            prompt.section_title,
            {"title": prompt.section_title, "promptIds": [], "pageNumbers": set()},
        )
        bucket["promptIds"].append(prompt_id)
        bucket["pageNumbers"].add(prompt.page_number)

    serialized_pages = [
        {
            "pageNumber": page["pageNumber"],
            "headline": page["headline"],
            "transcript": page["transcript"],
            "promptIds": prompts_by_page.get(page["pageNumber"], []),
        }
        for page in pages_data
    ]

    serialized_sections = [
        {
            "title": payload["title"],
            "promptIds": payload["promptIds"],
            "pageNumbers": sorted(payload["pageNumbers"]),
        }
        for payload in section_map.values()
    ]

    return {
        "id": f"{entry['subjectId']}-{entry['year']}",
        "subjectId": entry["subjectId"],
        "year": entry["year"],
        "title": entry["label"],
        "sourcePaperPath": local_path,
        "pageCount": len(document),
        "ocrLanguage": lang,
        "sections": serialized_sections,
        "pages": serialized_pages,
        "prompts": serialized_prompts,
    }


def main() -> None:
    if not TESSERACT_PATH.exists():
        raise SystemExit("Tesseract is required at C:\\Program Files\\Tesseract-OCR\\tesseract.exe")
    if not TESSDATA_PREFIX.exists():
        raise SystemExit(f"TESSDATA_PREFIX is missing: {TESSDATA_PREFIX}")

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    dossier_entries: list[dict[str, Any]] = []

    for entry in manifest["entries"]:
        built = build_entry(entry)
        if built:
            dossier_entries.append(built)

    OUTPUT_PATH.write_text(
        json.dumps(
            {
                "generatedAt": utc_timestamp(),
                "source": "OCR from hosted exam PDFs",
                "entries": dossier_entries,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {len(dossier_entries)} exam dossiers to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
