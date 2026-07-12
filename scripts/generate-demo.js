import { chromium } from '@playwright/test';
import { execSync } from 'child_process';
import { renameSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';

async function run() {
  console.log('Starting Playwright for video recording (Extended Flow)...');
  const browser = await chromium.launch({ headless: true });
  const videoDir = path.resolve('data/videos');
  
  if (!existsSync(videoDir)) {
    mkdirSync(videoDir, { recursive: true });
  }

  // Adjust size to fit nicely in Github README
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Bypass onboarding
  await page.addInitScript(() => {
    window.localStorage.setItem('chouette-onboarding-seen', 'true');
    window.__mock_llm = true;
  });

  console.log('Navigating to app with noAutoDownload...');
  await page.goto('http://localhost:3008/?mock=true&noAutoDownload=true', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // 1. Download Model
  console.log('Clicking Download...');
  const downloadBtn = page.getByRole('button', { name: /Télécharger et activer/ });
  await downloadBtn.click();
  await page.waitForTimeout(1500);

  // 2. Pause Download (inside the overlay modal)
  console.log('Pausing Download...');
  const pauseBtn = page.getByRole('button', { name: 'Mettre en pause' }).first();
  await pauseBtn.click();
  await page.waitForTimeout(1500);

  // 3. Resume Download
  console.log('Resuming Download...');
  const resumeBtn = page.getByRole('button', { name: 'Reprendre' }).first();
  await resumeBtn.click();
  
  // Wait for loading to finish (about 4 seconds)
  console.log('Waiting for load completion...');
  await page.waitForTimeout(4000);

  // 4. Chat turn 1
  console.log('Typing message 1...');
  const input = page.locator('textarea').first();
  await input.focus();
  await input.pressSequentially("Bonjour ! Comment puis-je sécuriser mes données ?", { delay: 60 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for streaming completion
  console.log('Waiting for response 1...');
  await page.waitForTimeout(5000);

  // 5. Chat turn 2
  console.log('Typing message 2...');
  await input.focus();
  await input.pressSequentially("Merci pour ces précieux conseils.", { delay: 60 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for response 2
  console.log('Waiting for response 2...');
  await page.waitForTimeout(4000);

  // 6. Interactive Sidebar: Change System Prompt
  console.log('Modifying System Prompt in Sidebar...');
  const systemPrompt = page.getByTestId('system-prompt-textarea');
  await systemPrompt.focus();
  // Clear textarea
  await systemPrompt.fill('');
  await page.waitForTimeout(500);
  await systemPrompt.pressSequentially("Tu es un expert en cybersécurité.", { delay: 60 });
  await page.waitForTimeout(500);
  
  // Click chat input to trigger blur (and save visual feedback)
  await input.focus();
  console.log('Prompt saved. Waiting to capture feedback...');
  await page.waitForTimeout(3000);

  await context.close();
  await browser.close();
  console.log('Playwright closed.');

  // Find the generated video file
  const files = readdirSync(videoDir);
  // Sort files by creation time to get the newest video
  const videoFiles = files
    .filter(f => f.endsWith('.webm'))
    .map(name => ({ name, time: existsSync(path.join(videoDir, name)) ? statSync(path.join(videoDir, name)).mtime.getTime() : 0 }))
    .sort((a, b) => b.time - a.time);

  if (videoFiles.length === 0) {
    throw new Error('No video file was recorded!');
  }

  const inputPath = path.join(videoDir, videoFiles[0].name);
  const outputPath = path.resolve('public/demo.gif');

  console.log(`Converting ${inputPath} to ${outputPath} using ffmpeg...`);
  // Convert WebM to GIF using high quality palette settings in ffmpeg
  const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "fps=12,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outputPath}"`;
  
  execSync(ffmpegCmd);
  console.log('GIF generated successfully at public/demo.gif!');
}

run().catch(err => {
  console.error('Error generating GIF:', err);
  process.exit(1);
});
