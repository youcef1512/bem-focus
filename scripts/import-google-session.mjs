import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  apps,
  ensureAuthDirectories,
  importedUserDataDir,
  metadataPath,
} from './lib/google-apps.mjs';

const execFileAsync = promisify(execFile);

const excludedEntries = new Set([
  'Cache',
  'Code Cache',
  'DawnGraphiteCache',
  'GPUCache',
  'GrShaderCache',
  'Media Cache',
  'ShaderCache',
]);

async function assertChromeClosed() {
  const { stdout } = await execFileAsync('tasklist', ['/FI', 'IMAGENAME eq chrome.exe', '/FO', 'CSV', '/NH']);
  const hasChrome = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => line && !line.startsWith('INFO:'));

  if (hasChrome) {
    throw new Error('Chrome is still running. Close all Google Chrome windows first, then run "npm run auth:google" again.');
  }
}

function getChromeUserDataDir() {
  const localAppData = process.env.LOCALAPPDATA;

  if (!localAppData) {
    throw new Error('LOCALAPPDATA is not set.');
  }

  return path.join(localAppData, 'Google', 'Chrome', 'User Data');
}

async function readProfileSelection(userDataDir) {
  const localStatePath = path.join(userDataDir, 'Local State');
  const raw = await readFile(localStatePath, 'utf8');
  const parsed = JSON.parse(raw);
  const profileName = parsed?.profile?.last_used || 'Default';
  const cache = parsed?.profile?.info_cache?.[profileName] || {};

  return {
    localStatePath,
    profileName,
    profileLabel: cache.name || profileName,
    signedInUser: cache.user_name || null,
  };
}

async function copyChromeData(sourceUserDataDir, profileName) {
  const destinationProfileDir = path.join(importedUserDataDir, profileName);

  await rm(importedUserDataDir, { recursive: true, force: true });
  await mkdir(importedUserDataDir, { recursive: true });

  await cp(path.join(sourceUserDataDir, 'Local State'), path.join(importedUserDataDir, 'Local State'));
  await cp(path.join(sourceUserDataDir, profileName), destinationProfileDir, {
    recursive: true,
    filter: (source) => {
      const base = path.basename(source);
      return !excludedEntries.has(base);
    },
  });

  return destinationProfileDir;
}

async function main() {
  await ensureAuthDirectories();
  await assertChromeClosed();

  const sourceUserDataDir = getChromeUserDataDir();
  const { localStatePath, profileName, profileLabel, signedInUser } = await readProfileSelection(sourceUserDataDir);
  const destinationProfileDir = await copyChromeData(sourceUserDataDir, profileName);

  const metadata = {
    savedAt: new Date().toISOString(),
    mode: 'imported-standard-chrome-profile',
    localStatePath,
    profileName,
    profileLabel,
    signedInUser,
    sourceUserDataDir,
    importedUserDataDir,
    destinationProfileDir,
    apps: Object.values(apps).map((app) => ({
      key: app.key,
      label: app.label,
      url: app.url,
    })),
  };

  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  console.log('');
  console.log(`Imported Chrome profile "${profileLabel}" into ${importedUserDataDir}`);
  if (signedInUser) {
    console.log(`Signed-in account: ${signedInUser}`);
  }
  console.log(`Saved session metadata to ${metadataPath}`);
  console.log('Next: run "npm run open:gemini" or "npm run open:aistudio".');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
