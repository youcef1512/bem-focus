import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type SubjectId =
  | "math"
  | "arabic"
  | "french"
  | "english"
  | "historygeo"
  | "physics"
  | "science"
  | "islamic"
  | "civics";

type ExamSource = {
  year: number;
  subjectId: SubjectId;
  label: string;
  paperUrl: string;
  correctionUrl: string;
  sourcePage: string;
  availability: "interactive" | "guided" | "paper";
};

const BASE_URL = "https://www.bem-algerie.net/";
const YEAR_START = 2016;
const YEAR_END = 2025;

const fileStemToSubject: Record<string, SubjectId | undefined> = {
  math: "math",
  ar: "arabic",
  francais: "french",
  english: "english",
  histogeo: "historygeo",
  physique: "physics",
  sciences: "science",
  islam: "islamic",
  cv: "civics",
};

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function buildAbsolute(relativeUrl: string) {
  return new URL(relativeUrl, BASE_URL).href;
}

function parseYearPage(year: number, html: string): ExamSource[] {
  const matches = [...html.matchAll(/href="([^"]+\.pdf)"/g)];
  const records = new Map<string, Partial<ExamSource>>();

  for (const match of matches) {
    const relativeUrl = match[1];
    const fileName = relativeUrl.split("/").pop();
    if (!fileName) {
      continue;
    }

    const normalized = fileName.replace(`${year}-`, "").replace(".pdf", "");
    const isCorrection = normalized.endsWith("-sol");
    const stem = normalized.replace("-sol", "");
    const subjectId = fileStemToSubject[stem];

    if (!subjectId) {
      continue;
    }

    const key = `${year}:${subjectId}`;
    const existing = records.get(key) ?? {};
    const absoluteUrl = buildAbsolute(relativeUrl);

    records.set(key, {
      ...existing,
      year,
      subjectId,
      label: `${subjectId} ${year}`,
      sourcePage: buildAbsolute(`sujets-${year}.html`),
      availability: subjectId === "math" ? "interactive" : "guided",
      ...(isCorrection
        ? { correctionUrl: absoluteUrl }
        : { paperUrl: absoluteUrl }),
    });
  }

  return [...records.values()]
    .filter((record) => record.paperUrl && record.correctionUrl)
    .map((record) => record as ExamSource);
}

async function main() {
  const entries: ExamSource[] = [];

  for (let year = YEAR_START; year <= YEAR_END; year += 1) {
    const sourcePage = `${BASE_URL}sujets-${year}.html`;
    const html = await fetchText(sourcePage);
    entries.push(...parseYearPage(year, html));
  }

  entries.sort((left, right) => {
    if (left.subjectId === right.subjectId) {
      return left.year - right.year;
    }

    return left.subjectId.localeCompare(right.subjectId);
  });

  const output = {
    generatedAt: new Date().toISOString(),
    source: "https://www.bem-algerie.net/sujets.html",
    entries,
  };

  const outputPath = path.resolve(
    process.cwd(),
    "src/data/bemArchive.generated.json",
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote ${entries.length} BEM archive entries to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
