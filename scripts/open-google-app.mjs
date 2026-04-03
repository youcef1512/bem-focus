import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import {
  getApp,
  metadataPath,
  playwrightLaunchArgs,
  readSessionMetadata,
  remoteDebuggingHost,
  remoteDebuggingPort,
  resolveChromeExecutable,
} from './lib/google-apps.mjs';

async function ensureAuthState() {
  try {
    await access(metadataPath);
  } catch {
    throw new Error('Missing saved Google auth state. Run "npm run auth:google" first.');
  }
}

async function waitForDebugger(endpointUrl) {
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${endpointUrl}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting for Chrome to expose the debugger endpoint.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error('Chrome did not expose the remote debugging endpoint in time.');
}

async function main() {
  const appName = process.argv[2];

  if (!appName) {
    throw new Error('Missing app name. Use "gemini" or "aistudio".');
  }

  await ensureAuthState();

  const app = getApp(appName);
  const session = await readSessionMetadata();
  const chromePath = await resolveChromeExecutable();
  const endpointUrl = `http://${remoteDebuggingHost}:${remoteDebuggingPort}`;
  let browser;
  const chromeProcess = spawn(
    chromePath,
    [
      `--remote-debugging-port=${remoteDebuggingPort}`,
      `--user-data-dir=${session.importedUserDataDir ?? session.profileDir}`,
      ...(session.profileName ? [`--profile-directory=${session.profileName}`] : []),
      '--new-window',
      '--no-first-run',
      '--no-default-browser-check',
      ...playwrightLaunchArgs,
      app.url,
    ],
    {
      detached: false,
      stdio: 'ignore',
    },
  );

  try {
    await waitForDebugger(endpointUrl);
    browser = await chromium.connectOverCDP(endpointUrl);
    const context = browser.contexts()[0];
    const [existingPage] = context.pages();
    const page = existingPage ?? (await context.newPage());

    await page.goto(app.url, { waitUntil: 'domcontentloaded' });

    console.log(`Opened ${app.label} with the imported Google Chrome session.`);
    console.log('Leave this window open while you work. Press Ctrl+C here to stop the attached browser process.');

    const cleanup = async () => {
      await browser.close();
      if (!chromeProcess.killed) {
        chromeProcess.kill();
      }
    };

    process.on('SIGINT', async () => {
      await cleanup();
      process.exit(0);
    });

    await new Promise(() => {});
  } finally {
    if (browser) {
      await browser.close();
    }
    if (!chromeProcess.killed) {
      chromeProcess.kill();
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
