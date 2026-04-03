import path from 'node:path';
import { access, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, '..', '..');
export const authDir = path.join(repoRoot, 'playwright', '.auth');
export const profileDir = path.join(authDir, 'chrome-profile');
export const importedUserDataDir = path.join(authDir, 'imported-user-data');
export const storageStatePath = path.join(authDir, 'google-storage-state.json');
export const metadataPath = path.join(authDir, 'session-info.json');
export const browserChannel = 'chrome';
export const remoteDebuggingHost = '127.0.0.1';
export const remoteDebuggingPort = 9222;
export const chromeExecutableCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
export const playwrightLaunchArgs = [
  '--start-maximized',
  '--disable-blink-features=AutomationControlled',
];

export const apps = {
  gemini: {
    key: 'gemini',
    label: 'Google Gemini',
    url: 'https://gemini.google.com/app',
  },
  aistudio: {
    key: 'aistudio',
    label: 'Google AI Studio',
    url: 'https://aistudio.google.com/',
  },
};

export function getApp(name) {
  const normalized = String(name ?? '').trim().toLowerCase();
  const app = apps[normalized];

  if (!app) {
    throw new Error(`Unknown app "${name}". Use one of: ${Object.keys(apps).join(', ')}`);
  }

  return app;
}

export async function ensureAuthDirectories() {
  await mkdir(authDir, { recursive: true });
  await mkdir(profileDir, { recursive: true });
  await mkdir(importedUserDataDir, { recursive: true });
}

export async function resolveChromeExecutable() {
  for (const candidate of chromeExecutableCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next local Chrome path.
    }
  }

  throw new Error('Google Chrome executable not found. Set CHROME_PATH or install Google Chrome.');
}

export async function readSessionMetadata() {
  const raw = await readFile(metadataPath, 'utf8');
  return JSON.parse(raw);
}
