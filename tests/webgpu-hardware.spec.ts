import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Real WebGPU hardware acceleration', () => {
  // Downloading a 150MB model locally might take 30-120 seconds depending on bandwidth
  test.setTimeout(300000); 

  test('Should load SmolLM in WebGPU and generate response', async ({ page }) => {
    // 0. Bypass onboarding modal
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
      } catch (e) {}
    });

    // Intercepter les requêtes HuggingFace pour servir les modèles locaux
    await page.route('https://huggingface.co/**/*', async (route) => {
       const url = new URL(route.request().url());
       const parts = url.pathname.split('/');
       if (parts.length >= 6) {
         const repoId = parts[1] + '/' + parts[2];
         const fileParts = parts.slice(5);
         const fs = require('fs');
         const path = require('path');
         const localPath = path.join(process.cwd(), 'data', 'models', repoId, ...fileParts);
         if (fs.existsSync(localPath)) {
            return await route.fulfill({ path: localPath });
         }
       }
       await route.continue();
    });

    // 1. Load the app in real mode (no mock bypass)
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // 2. Wait for Nuxt/Vite to compile and mount the app (Cold Start)
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 60000 });
    await page.waitForTimeout(2000);

    // 3. Switch model to SmolLM-135M to speed up the test
    const combobox = page.getByRole('combobox').first();
    await combobox.waitFor({ state: 'visible', timeout: 30000 });
    
    // Click to open dropdown
    await combobox.click();
    
    // Select SmolLM2
    const smolOption = page.getByRole('option', { name: /SmolLM2/i });
    await smolOption.click();

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
});
