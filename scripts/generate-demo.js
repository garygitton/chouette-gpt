import { chromium, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { renameSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';

async function run() {
  console.log('Starting Playwright for video recording (Real Llama-1B WebGPU in English)...');
  let skipSeconds = 0;
  
  // Launch headed Chromium with WebGPU flags
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

  // Log browser console and errors to help debug
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  // Bypass onboarding and set application language to English
  await page.addInitScript(() => {
    window.localStorage.setItem('chouette-onboarding-seen', 'true');
    window.localStorage.setItem('app_language', 'en');
  });

  const startTime = Date.now();
  console.log('Navigating to app...');
  await page.goto('http://localhost:3008/?noAutoDownload=true', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Switch model to Qwen2.5-0.5B-Instruct
  console.log('Selecting Qwen2.5-0.5B-Instruct model...');
  const modelTrigger = page.getByTestId('model-select-trigger');
  await modelTrigger.click();
  await page.waitForTimeout(1000);

  const qwenOption = page.getByTestId('model-option-onnx-community/Qwen2.5-0.5B-Instruct');
  await qwenOption.click();
  await page.waitForTimeout(1500);

  // 2. Pause Download (inside overlay modal) if it appears
  console.log('Checking if download dialog is present...');
  const pauseBtn = page.getByRole('button', { name: 'Mettre en pause' }).first();
  try {
    await pauseBtn.waitFor({ state: 'visible', timeout: 3000 });
    console.log('Pausing Download...');
    await pauseBtn.click();
    await page.waitForTimeout(1500);

    // 4. Resume Download
    console.log('Resuming Download...');
    const resumeBtn = page.getByRole('button', { name: 'Reprendre' }).first();
    await resumeBtn.click();
  } catch (e) {
    console.log('Download dialog did not appear (model likely already cached). Skipping pause/resume.');
  }
  
  // 5. Wait for download & WebGPU compilation (can take up to 2-3 mins if uncached)
  console.log('Waiting for WebGPU initialization & model load (Qwen-0.5B)...');
  const readyBadge = page.getByText(/Prêt à l'emploi/i).first();
  await readyBadge.waitFor({ state: 'visible', timeout: 180000 });
  console.log('Qwen-0.5B successfully loaded in VRAM!');
  
  const readyTime = Date.now();
  skipSeconds = Math.max(0, (readyTime - startTime) / 1000 - 1.5);
  console.log(`Model is ready. Skipping first ${skipSeconds.toFixed(2)} seconds of initialization in the final GIF.`);
  
  await page.waitForTimeout(2000);

  // 6. Chat turn 1 (English)
  console.log('Typing message 1...');
  const input = page.getByTestId('chat-textarea');
  await input.focus();
  await input.pressSequentially("Hello! Explain what data sovereignty means in one simple sentence.", { delay: 60 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for real streaming generation
  console.log('Waiting for response 1...');
  const submitBtn = page.getByTestId('send-button');
  await expect(submitBtn).toBeEnabled({ timeout: 60000 });
  await page.waitForTimeout(2000);

  // 7. Chat turn 2 (English)
  console.log('Typing message 2...');
  await input.focus();
  await input.pressSequentially("Thank you, that was very clear!", { delay: 60 });
  await page.waitForTimeout(500);
  await input.press('Enter');

  // Wait for response 2
  console.log('Waiting for response 2...');
  await expect(submitBtn).toBeEnabled({ timeout: 60000 });
  await page.waitForTimeout(2000);

  // 8. Interactive Sidebar: Change System Prompt
  console.log('Modifying System Prompt...');
  const systemPrompt = page.getByTestId('system-prompt-textarea');
  await systemPrompt.focus();
  await systemPrompt.fill('');
  await page.waitForTimeout(500);
  await systemPrompt.pressSequentially("You are a helpful and concise cybersecurity expert.", { delay: 60 });
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

  console.log(`Converting ${inputPath} to ${outputPath} using ffmpeg (skipping first ${skipSeconds.toFixed(2)}s)...`);
  // Convert WebM to GIF using high quality palette settings in ffmpeg and seeking to skip the initialization phase
  const ffmpegCmd = `ffmpeg -y -ss ${skipSeconds.toFixed(2)} -i "${inputPath}" -vf "fps=12,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outputPath}"`;
  
  execSync(ffmpegCmd);
  console.log('GIF generated successfully at public/demo.gif!');
}

run().catch(err => {
  console.error('Error generating GIF:', err);
  process.exit(1);
});
