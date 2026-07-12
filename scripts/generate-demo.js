import { chromium, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { renameSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';

async function run() {
  console.log('Starting Playwright for video recording (Headed WebGPU / Real Model)...');
  
  // Force headed mode and WebGPU launch arguments as defined in playwright.webgpu.config.ts
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--enable-unsafe-webgpu',
      '--enable-features=Vulkan',
      '--use-angle=vulkan'
    ]
  });

  const videoDir = path.resolve('data/videos');
  if (!existsSync(videoDir)) {
    mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Bypass onboarding but DO NOT set mock mode
  await page.addInitScript(() => {
    window.localStorage.setItem('chouette-onboarding-seen', 'true');
    // window.__mock_llm = true; -> Removed to use REAL WebGPU models
  });

  console.log('Navigating to app on port 3008...');
  await page.goto('http://localhost:3008/?noAutoDownload=true', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Trigger Real Download (Default is SmolLM2-135M)
  console.log('Clicking Download...');
  const downloadBtn = page.getByRole('button', { name: /Télécharger et activer/ });
  await downloadBtn.click();
  await page.waitForTimeout(2000);

  // 2. Pause Download
  console.log('Pausing Download...');
  const pauseBtn = page.getByRole('button', { name: 'Mettre en pause' }).first();
  await pauseBtn.click();
  await page.waitForTimeout(2000);

  // 3. Resume Download
  console.log('Resuming Download...');
  const resumeBtn = page.getByRole('button', { name: 'Reprendre' }).first();
  await resumeBtn.click();
  
  // 4. Wait for real download & WebGPU loading to finish (ready badge becomes visible)
  console.log('Waiting for WebGPU initialization & model download (this may take up to 2 minutes)...');
  const readyBadge = page.getByText(/Prêt à l'emploi/i).first();
  await readyBadge.waitFor({ state: 'visible', timeout: 180000 });
  console.log('Model loaded in VRAM!');
  await page.waitForTimeout(2000);

  // 5. Chat turn 1
  console.log('Typing message 1...');
  const input = page.getByTestId('chat-textarea');
  await input.focus();
  await input.pressSequentially("Bonjour ! Qui es-tu ? Présente-toi très brièvement.", { delay: 60 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for real streaming generation
  console.log('Waiting for response 1...');
  const submitBtn = page.getByTestId('send-button');
  // Send button is disabled during generation, wait for it to be enabled again
  await expect(submitBtn).toBeEnabled({ timeout: 60000 });
  await page.waitForTimeout(2000);

  // 6. Chat turn 2
  console.log('Typing message 2...');
  await input.focus();
  await input.pressSequentially("Merci pour cette présentation.", { delay: 60 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for response 2
  console.log('Waiting for response 2...');
  await expect(submitBtn).toBeEnabled({ timeout: 60000 });
  await page.waitForTimeout(2000);

  // 7. Interactive Sidebar: Change System Prompt
  console.log('Modifying System Prompt in Sidebar...');
  const systemPrompt = page.getByTestId('system-prompt-textarea');
  await systemPrompt.focus();
  await systemPrompt.fill('');
  await page.waitForTimeout(500);
  await systemPrompt.pressSequentially("Tu es un assistant de cybersécurité très concis.", { delay: 60 });
  await page.waitForTimeout(500);
  
  // Click chat input to trigger blur
  await input.focus();
  console.log('Prompt saved. Capturing feedback...');
  await page.waitForTimeout(3000);

  await context.close();
  await browser.close();
  console.log('Playwright closed.');

  // Find the generated video file
  const files = readdirSync(videoDir);
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
