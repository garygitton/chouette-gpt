import { test, expect } from '@playwright/test';


test.describe('ChouetteGPT - Mocked WASM Inference', () => {
  test.setTimeout(60000); // 1 minute is more than enough for a 1MB mock model

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log(`[BROWSER REQUEST FAILED] ${request.url()}: ${request.failure()?.errorText}`));
    page.on('worker', worker => {
      console.log('Worker created:', worker.url());
      worker.on('console', msg => console.log('WORKER CONSOLE:', msg.text()));
    });

    // Bypass onboarding modal and activate mock engine
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {}
    });
  });

  test('Should download mocked tiny model and run inference', async ({ page }) => {
    await page.goto('?showAllModels=true&mock=true&autoDownload=false', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 30000 });
 
    const combobox = page.getByRole('combobox').first();
    await combobox.waitFor({ state: 'visible', timeout: 20000 });
    await combobox.click();
 
    const qwenOption = page.getByRole('option', { name: /Qwen2.5-0.5B/i });
    await qwenOption.click();
 
    const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
    try {
      await acceptBtn.click({ timeout: 10000 });
    } catch (e) {
      console.log('[TEST] Le modal de confirmation n\'est pas apparu ou le modèle est déjà chargé.');
    }
 
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toBeVisible({ timeout: 60000 });
 
    const textarea = page.getByTestId('chat-textarea');
    await expect(textarea).toBeEnabled({ timeout: 10000 });
 
    await textarea.fill('Dis moi Bonjour');
    const sendBtn = page.getByTestId('send-button');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();
 
    const assistantMessage = page.locator('.justify-start').last();
    await expect(assistantMessage).toBeVisible({ timeout: 15000 });
 
    await expect(async () => {
      const text = await assistantMessage.textContent();
      expect(text?.length).toBeGreaterThan(0);
    }).toPass({ timeout: 25000 });
  });

  test('Should allow selecting all major models', async ({ page }) => {
    await page.goto('?showAllModels=true&mock=true&autoDownload=false', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 30000 });

    const modelsToTest = [
      { name: /Llama-3.2-1B/i, expected: 'Llama-3.2-1B-Instruct' },
      { name: /Qwen2.5-Coder-1.5B/i, expected: 'Qwen2.5-Coder-1.5B-Instruct' },
      { name: /Qwen2.5-Math-1.5B/i, expected: 'Qwen2.5-Math-1.5B-Instruct' }
    ];

    for (const model of modelsToTest) {
      console.log(`[TEST] Selecting model: ${model.expected}`);
      const selectTrigger = page.getByTestId('model-select-trigger').first();
      await selectTrigger.click();

      const option = page.getByRole('option', { name: model.name });
      await option.click();

      // If the confirmation dialog pops up, dismiss it first
      const cancelDialogBtn = page.getByRole('button', { name: /Plus tard/i });
      try {
        await cancelDialogBtn.waitFor({ state: 'visible', timeout: 2000 });
        await cancelDialogBtn.click();
      } catch (e) {
        // Modal might not have popped up
      }

      // Verify the trigger value updated (after modal is closed to avoid aria-hidden blocks)
      await expect(selectTrigger).toContainText(model.expected);
      
      // Also cancel any loading state just in case
      const cancelLoadBtn = page.getByRole('button', { name: /Mettre en pause|Annuler/i }).first();
      if (await cancelLoadBtn.isVisible()) {
        await cancelLoadBtn.click();
      }
    }
  });
});
