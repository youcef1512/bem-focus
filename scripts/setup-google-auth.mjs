import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline/promises';
import {
  apps,
  ensureAuthDirectories,
  metadataPath,
  profileDir,
  resolveChromeExecutable,
} from './lib/google-apps.mjs';

async function main() {
  await ensureAuthDirectories();
  const chromePath = await resolveChromeExecutable();
  const chromeArgs = [
    `--user-data-dir=${profileDir}`,
    '--new-window',
    '--no-first-run',
    '--no-default-browser-check',
    apps.gemini.url,
    apps.aistudio.url,
  ];

  const chrome = spawn(chromePath, chromeArgs, {
    detached: true,
    stdio: 'ignore',
  });
  chrome.unref();

  console.log('');
  console.log('A normal Google Chrome window should open for sign-in.');
  console.log('1. Sign in to your Google account there.');
  console.log('2. Confirm both Gemini and AI Studio load successfully.');
  console.log('3. Close that dedicated Chrome window when finished so the profile unlocks.');
  console.log('4. Return here and press Enter to mark the session as ready.');
  console.log('');

  const rl = readline.createInterface({ input, output });
  await rl.question('Press Enter after you finish signing in and close the dedicated Chrome window: ');
  rl.close();

  const metadata = {
    savedAt: new Date().toISOString(),
    mode: 'manual-chrome-profile',
    apps: Object.values(apps).map((app) => ({
      key: app.key,
      label: app.label,
      url: app.url,
    })),
    chromePath,
    profileDir,
  };

  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  console.log('');
  console.log(`Saved browser profile to ${profileDir}`);
  console.log(`Saved session metadata to ${metadataPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
