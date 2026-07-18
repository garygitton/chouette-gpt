import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Real WASM Inference', () => {
  // Real model download and compilation may take up to 5-6 minutes depending on bandwidth
  test.setTimeout(450000);

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log(`[BROWSER REQUEST FAILED] ${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => {
      if (response.status() === 404) {
        console.log(`[404 NOT FOUND] ${response.url()}`);
      }
    });
    page.on('worker', worker => {
      console.log('Worker created:', worker.url());
      worker.on('console', msg => console.log('WORKER CONSOLE:', msg.text()));
    });

    // Bypass onboarding modal
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
      } catch (e) {}
    });
  });

  test('Should download Qwen2.5-0.5B and run inference on CPU/WASM', async ({ page }) => {
    // 1. Load the app in real mode (no mock bypass) with showAllModels=true to list all models and autoDownload=false
    await page.goto('?showAllModels=true&autoDownload=false', { waitUntil: 'domcontentloaded' });

    // 2. Wait for Nuxt to mount the app
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 30000 });

    // 3. Click the model selector combobox
    const combobox = page.getByRole('combobox').first();
    await combobox.waitFor({ state: 'visible', timeout: 20000 });
    await combobox.click();

    // 4. Select the Qwen2.5-0.5B-Instruct model (which is fast and doesn't require WebGPU)
    const qwenOption = page.getByRole('option', { name: /Qwen2.5-0.5B/i });
    await qwenOption.click();

    // 5. Accept the download in the confirmation modal if visible
    const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
    try {
      await acceptBtn.click({ timeout: 10000 });
    } catch (e) {
      console.log('[TEST] Le modal de confirmation n\'est pas apparu ou le modèle est déjà chargé.');
    }

    // 6. Wait for the engine to finish loading (ready badge visible, text area enabled)
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toBeVisible({ timeout: 360000 });

    const textarea = page.getByTestId('chat-textarea');
    await expect(textarea).toBeEnabled({ timeout: 10000 });

    // 7. Send a simple message
    await textarea.fill('Dis moi "Bonjour" en un seul mot.');
    const sendBtn = page.getByTestId('send-button');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // 8. Verify the assistant's streaming response is outputted
    const assistantMessage = page.locator('.justify-start').last();
    await expect(assistantMessage).toBeVisible({ timeout: 15000 });

    await expect(async () => {
      const text = await assistantMessage.textContent();
      expect(text?.length).toBeGreaterThan(2);
    }).toPass({ timeout: 25000 });
  });
});
