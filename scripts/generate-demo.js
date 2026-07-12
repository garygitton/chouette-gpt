import { chromium } from '@playwright/test';
import { execSync } from 'child_process';
import { renameSync, readdirSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

async function run() {
  console.log('Starting Playwright for video recording...');
  const browser = await chromium.launch({ headless: true });
  const videoDir = path.resolve('data/videos');
  
  if (!existsSync(videoDir)) {
    mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1020, height: 680 }
    },
    viewport: { width: 1020, height: 680 }
  });

  const page = await context.newPage();

  // Bypass onboarding
  await page.addInitScript(() => {
    window.localStorage.setItem('chouette-onboarding-seen', 'true');
    window.__mock_llm = true;
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:3008/?mock=true', { waitUntil: 'domcontentloaded' });
  
  // Wait for the mock download to trigger and complete
  console.log('Waiting for model download and load...');
  await page.waitForTimeout(6000);

  // Focus and type in the input area
  console.log('Typing message...');
  const input = page.locator('textarea').first();
  await input.focus();
  await input.pressSequentially("Bonjour ! Peux-tu m'expliquer brièvement ChouetteGPT ?", { delay: 100 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for streaming completion
  console.log('Waiting for response...');
  await page.waitForTimeout(6000);

  // Open the technical details collapsible
  console.log('Interacting with technical details...');
  const toggle = page.getByText('Voir les détails techniques');
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.waitForTimeout(2000);
  }

  // Focus input again
  await input.focus();
  await page.waitForTimeout(1000);

  await context.close();
  await browser.close();
  console.log('Playwright closed.');

  // Find the generated video file
  const files = readdirSync(videoDir);
  const videoFile = files.find(f => f.endsWith('.webm'));
  if (!videoFile) {
    throw new Error('No video file was recorded!');
  }

  const inputPath = path.join(videoDir, videoFile);
  const outputPath = path.resolve('public/demo.gif');

  console.log(`Converting ${inputPath} to ${outputPath} using ffmpeg...`);
  // Convert WebM to GIF using high quality palette settings in ffmpeg
  const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "fps=15,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outputPath}"`;
  
  execSync(ffmpegCmd);
  console.log('GIF generated successfully at public/demo.gif!');
}

run().catch(err => {
  console.error('Error generating GIF:', err);
  process.exit(1);
});
