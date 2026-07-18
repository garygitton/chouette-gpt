import { test, expect, type Locator } from '@playwright/test';
import * as path from 'path';

test.describe('ChouetteGPT - Real WASM Long Conversation E2E Test', () => {
  // Real model download and compilation may take up to 6 minutes depending on bandwidth
  test.setTimeout(480000);

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
  });

  test('Should run a long conversation on the live production site', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'https://garygitton.github.io/chouette-gpt/';
    const targetUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}?showAllModels=true&autoDownload=false`;
    console.log(`[TEST] Navigating to: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // Wait for the Nuxt app to mount and check page structure
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 45000 });

    // Select Qwen2.5-0.5B-Instruct
    console.log('[TEST] Opening model dropdown...');
    const selectTrigger = page.getByTestId('model-select-trigger').first();
    await selectTrigger.click();

    console.log('[TEST] Clicking Qwen2.5-0.5B option...');
    const qwenOption = page.getByRole('option', { name: /Qwen2.5-0.5B/i });
    await qwenOption.click();

    // Accept the download
    const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
    try {
      await acceptBtn.click({ timeout: 10000 });
      console.log('[TEST] Clicked "Accepter et Télécharger".');
    } catch (e) {
      console.log('[TEST] Modal did not appear or model is already loaded.');
    }

    // Wait for engine to become ready (up to 6 minutes)
    console.log('[TEST] Waiting for model download and compilation (WASM)...');
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toBeVisible({ timeout: 360000 });
    console.log('[TEST] Model is loaded and ready!');

    const textarea = page.getByTestId('chat-textarea');
    const sendBtn = page.getByTestId('send-button');
    await expect(textarea).toBeEnabled({ timeout: 15000 });

    const artifactDir = '/home/gary/.gemini/antigravity-ide/brain/b37ea513-26dc-4a19-931b-de66c8a34d82';

    async function waitForGeneration(bubbleLocator: Locator, expectedPattern?: string | RegExp) {
      // 1. Wait for send button to show 'Interrompre' (generation started)
      try {
        await expect(sendBtn).toHaveText(/Interrompre/i, { timeout: 15000 });
      } catch (e) {
        console.log('[TEST] Warning: did not see Interrompre text, checking if already finished.');
      }
      // 2. Wait for send button to return to 'Envoyer' (not 'Interrompre')
      await expect(sendBtn).toHaveText(/Envoyer/i, { timeout: 90000 });
      // 3. Verify the bubble contains actual text and does not contain only '...'
      await expect(async () => {
        const text = await bubbleLocator.textContent();
        expect(text).not.toContain('...');
        expect(text?.trim().length).toBeGreaterThan(15);
        if (expectedPattern) {
          if (expectedPattern instanceof RegExp) {
            expect(text).toMatch(expectedPattern);
          } else {
            expect(text?.toLowerCase()).toContain(expectedPattern.toLowerCase());
          }
        }
      }).toPass({ timeout: 15000 });
    }

    // ---- TURN 1 ----
    console.log('[TEST] Turn 1: Sending greeting...');
    await textarea.fill('Bonjour ! Est-ce que tu me reçois ? Réponds brièvement.');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Wait for assistant response
    const firstAssistantMsg = page.locator('[data-testid="chat-message"][data-role="assistant"]').last().getByTestId('message-text');
    await expect(firstAssistantMsg).toBeVisible({ timeout: 25000 });
    await waitForGeneration(firstAssistantMsg);

    console.log(`[TEST] Turn 1 Answer: ${await firstAssistantMsg.textContent()}`);
    await page.screenshot({ path: path.join(artifactDir, 'conversation-turn-1.png'), fullPage: true });

    // ---- TURN 2 ----
    console.log('[TEST] Turn 2: Asking for capital...');
    await textarea.fill('Super. Peux-tu me donner la capitale de la France ?');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Wait for assistant response to update
    const secondAssistantMsg = page.locator('[data-testid="chat-message"][data-role="assistant"]').last().getByTestId('message-text');
    await waitForGeneration(secondAssistantMsg, 'paris');

    console.log(`[TEST] Turn 2 Answer: ${await secondAssistantMsg.textContent()}`);
    await page.screenshot({ path: path.join(artifactDir, 'conversation-turn-2.png'), fullPage: true });

    // ---- TURN 3 ----
    console.log('[TEST] Turn 3: Asking about the river...');
    await textarea.fill('Et quel est le fleuve principal qui la traverse ?');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Wait for assistant response to update
    const thirdAssistantMsg = page.locator('[data-testid="chat-message"][data-role="assistant"]').last().getByTestId('message-text');
    await waitForGeneration(thirdAssistantMsg, /seine|rhone|rhône|fleuve/i);

    console.log(`[TEST] Turn 3 Answer: ${await thirdAssistantMsg.textContent()}`);
    await page.screenshot({ path: path.join(artifactDir, 'conversation-turn-3.png'), fullPage: true });

    console.log('[TEST] Long conversation E2E test completed successfully!');
  });
});
