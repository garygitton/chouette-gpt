import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('ChouetteGPT - Real WebGPU hardware acceleration', () => {
  // Downloading a 150MB model locally might take 30-120 seconds depending on bandwidth
  test.setTimeout(300000); 

  test('Should load Qwen2.5-0.5B in WebGPU and generate response', async ({ page, context }) => {
    // 0. Bypass onboarding modal
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
      } catch (e) {}
    });

    // Intercepter les requêtes HuggingFace pour servir les modèles locaux
    await context.route('https://huggingface.co/**/*', async (route) => {
       const url = new URL(route.request().url());
       const parts = url.pathname.split('/');
       if (parts.length >= 6) {
         const repoId = parts[1] + '/' + parts[2];
         const fileParts = parts.slice(5);
         const localPath = path.join(process.cwd(), 'tests', 'fixtures', 'models', repoId, ...fileParts);
         if (fs.existsSync(localPath)) {
            return await route.fulfill({ path: localPath });
         }
       }
       await route.continue();
    });

    // 1. Load the app in real mode (no mock bypass) with showAllModels=true to bypass domain filters and autoDownload=false
    await page.goto('/?showAllModels=true&autoDownload=false', { waitUntil: 'domcontentloaded' });
    
    // 2. Wait for Nuxt/Vite to compile and mount the app (Cold Start)
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 60000 });
    await page.waitForTimeout(2000);

    // 3. Switch model to Qwen2.5-0.5B to speed up the test
    const combobox = page.getByRole('combobox').first();
    await combobox.waitFor({ state: 'visible', timeout: 30000 });
    
    // Click to open dropdown
    await combobox.click();
    
    // Select Qwen2.5-0.5B
    const qwenOption = page.getByRole('option', { name: /Qwen2.5-0.5B/i });
    await qwenOption.click();

    // Accept download in the automatic confirmation modal
    const downloadDialog = page.getByRole('dialog').filter({ hasText: 'Autoriser le téléchargement' });
    try {
      await expect(downloadDialog).toBeVisible({ timeout: 5000 });
      const acceptBtn = downloadDialog.getByRole('button', { name: /Accepter et Télécharger/i });
      await acceptBtn.click();
    } catch (e) {
      console.log('Download dialog not visible or already downloading/ready');
    }

    // 4. Wait for the engine to finish downloading and loading into VRAM
    // The UI should display "Prêt à l'emploi" once WebGPU is initialized
    const readyBadge = page.getByText(/Prêt à l'emploi/i).first();
    console.log('Waiting for model download and WebGPU initialization...');
    await expect(readyBadge).toBeVisible({ timeout: 180000 });

    // 5. Send a prompt to verify generation actually works
    // Dismiss wizard if present
    const closeWizardBtn = page.getByTestId('wizard-close-icon');
    try {
      await closeWizardBtn.waitFor({ state: 'visible', timeout: 2000 });
      await closeWizardBtn.click();
    } catch (e) {}

    const textarea = page.getByTestId('chat-textarea');
    await textarea.fill('Dis bonjour et présente toi très brièvement.');
    
    const submitBtn = page.getByTestId('send-button');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 6. Verify streaming generation starts
    const assistantMessage = page.locator('.justify-start').last();
    await expect(assistantMessage).toBeVisible({ timeout: 15000 });
    
    // 7. Verify text generation finishes (send button is back)
    console.log('Generating text...');
    await expect(submitBtn).toBeVisible({ timeout: 60000 });
    
    const generatedText = await assistantMessage.textContent();
    console.log(`Generated response: ${generatedText}`);
    expect(generatedText?.length).toBeGreaterThan(10);
  });

  test('Should load Llama-3.2-1B in WebGPU and generate response', async ({ page, context }) => {
    // 0. Bypass onboarding modal
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
      } catch (e) {}
    });

    // Intercepter les requêtes HuggingFace pour servir les modèles locaux
    await context.route('https://huggingface.co/**/*', async (route) => {
       const url = new URL(route.request().url());
       const parts = url.pathname.split('/');
       if (parts.length >= 6) {
         const repoId = parts[1] + '/' + parts[2];
         const fileParts = parts.slice(5);
         const localPath = path.join(process.cwd(), 'tests', 'fixtures', 'models', repoId, ...fileParts);
         if (fs.existsSync(localPath)) {
            return await route.fulfill({ path: localPath });
         }
       }
       await route.continue();
     });

    // 1. Load the app in real mode (no mock bypass) with showAllModels=true to bypass domain filters and autoDownload=false
    await page.goto('/?showAllModels=true&autoDownload=false', { waitUntil: 'domcontentloaded' });
    
    // 2. Wait for Nuxt/Vite to compile and mount the app (Cold Start)
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 60000 });
    await page.waitForTimeout(2000);

    // 3. Switch model to Llama-3.2-1B
    const combobox = page.getByRole('combobox').first();
    await combobox.waitFor({ state: 'visible', timeout: 30000 });
    
    // Click to open dropdown
    await combobox.click();
    
    // Select Llama-3.2-1B-Instruct
    const llamaOption = page.getByRole('option', { name: /Llama-3.2-1B/i }).first();
    await llamaOption.click();

    // Accept download in the automatic confirmation modal
    const downloadDialog = page.getByRole('dialog').filter({ hasText: 'Autoriser le téléchargement' });
    try {
      await expect(downloadDialog).toBeVisible({ timeout: 5000 });
      const acceptBtn = downloadDialog.getByRole('button', { name: /Accepter et Télécharger/i });
      await acceptBtn.click();
    } catch (e) {
      console.log('Download dialog not visible or already downloading/ready');
    }

    // 4. Wait for the engine to finish downloading and loading into VRAM
    const readyBadge = page.getByText(/Prêt à l'emploi/i).first();
    console.log('Waiting for Llama-3.2-1B download and WebGPU initialization...');
    await expect(readyBadge).toBeVisible({ timeout: 180000 });

    // 5. Send a prompt to verify generation actually works
    const closeWizardBtn = page.getByTestId('wizard-close-icon');
    try {
      await closeWizardBtn.waitFor({ state: 'visible', timeout: 2000 });
      await closeWizardBtn.click();
    } catch (e) {}

    const textarea = page.getByTestId('chat-textarea');
    await textarea.fill('Hello, who are you?');
    
    const submitBtn = page.getByTestId('send-button');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 6. Verify streaming generation starts
    const assistantMessage = page.locator('.justify-start').last();
    await expect(assistantMessage).toBeVisible({ timeout: 15000 });
    
    // 7. Verify text generation finishes
    console.log('Generating text...');
    await expect(submitBtn).toBeVisible({ timeout: 60000 });
    
    const generatedText = await assistantMessage.textContent();
    console.log(`Generated response: ${generatedText}`);
    expect(generatedText?.length).toBeGreaterThan(10);
  });
});
