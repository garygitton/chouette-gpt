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

    // Bypass onboarding modal
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
      } catch (e) {}
    });

    // Mock the transformers worker completely for fast UI E2E testing
    await page.route('**/transformers.worker*.js', async route => {
      const mockWorkerScript = `
        self.onmessage = function(event) {
          const { type, payload } = event.data;
          if (type === 'init') {
            self.postMessage({ type: 'progress', payload: { text: 'Mock loading...', progress: 0.5 } });
            setTimeout(() => {
              self.postMessage({ type: 'init_done', payload: { device: 'mock-webgpu' } });
            }, 500);
          } else if (type === 'generate') {
            const { generationId } = payload;
            self.postMessage({ type: 'generate_chunk', payload: 'B', generationId });
            self.postMessage({ type: 'generate_chunk', payload: 'onjour', generationId });
            self.postMessage({ type: 'generate_chunk', payload: ' !', generationId });
            self.postMessage({ type: 'generate_done', generationId });
          }
        };
      `;
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: mockWorkerScript
      });
    });
  });

  test('Should download mocked tiny model and run inference', async ({ page }) => {
    await page.goto('?showAllModels=true', { waitUntil: 'domcontentloaded' });
    const content = await page.evaluate(() => document.body.innerHTML);
    console.log('PAGE CONTENT DUMP:', content);
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
});
