# BEM Focus

Interactive 4AM/BEM preparation web app for Algeria with:

- a 46-day sprint plan from April 3, 2026 to May 18, 2026
- 9 core subjects
- deeper interactive math lessons and remixable exam practice
- a chained history timeline
- printable summary sheets
- downloadable standalone HTML lessons and an offline ZIP pack
- a generated 2016-2025 BEM archive manifest with paper/correction links

## Stack

- React 19
- Vite
- TypeScript
- Framer Motion
- Playwright
- Vitest

## Scripts

```powershell
npm install
npm run dev
npm run ingest:bem
npm run generate:downloads
npm test
npm run test:e2e
npm run build
```

## Notes

- `scripts/ingest-bem.ts` scrapes `bem-algerie.net` year pages for 2016-2025.
- `scripts/generate-downloads.ts` builds standalone HTML lesson and summary files into `public/downloads/`.
- The app is designed for calm, low-distraction study sessions with short active-recall cycles.
