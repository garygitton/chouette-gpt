import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Advanced Settings Compatibility & Model Rules', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Setup initial mock context
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
        
        // Mock GPU capabilities
        Object.defineProperty(window.navigator, 'gpu', {
          value: {
            requestAdapter: async () => ({
              features: { has: () => true },
              requestDevice: async () => ({ destroy: () => {} })
            })
          },
          configurable: true
        });
      } catch (e) {}
    });
  });

  test('Positive case: General model supports sampling and creative controls', async ({ page }) => {
    await page.goto('/?mock=true&showAllModels=true&autoDownload=false', { waitUntil: 'domcontentloaded' });

    // Download/Activate Qwen2.5-0.5B-Instruct (which supports sampling)
    const modelSelectTrigger = page.getByTestId('model-select-trigger');
    await modelSelectTrigger.click();

    const option = page.locator('[data-testid^="model-option-"]').filter({ hasText: 'Qwen2.5-0.5B-Instruct' }).first();
    await expect(option).toBeVisible();
    await option.click();

    // Accept download if visible
    const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
    try {
      await expect(acceptBtn).toBeVisible({ timeout: 2000 });
      await acceptBtn.click();
    } catch (e) {
      // already cached
    }

    // Verify it loads
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toBeVisible();

    // Check sampling controls in the right sidebar
    const samplingTrigger = page.getByTestId('accordion-sampling-trigger');
    await expect(samplingTrigger).toBeVisible();
    await samplingTrigger.click();

    // Warning alert should NOT be visible
    const alert = page.getByTestId('math-unsupported-alert');
    await expect(alert).toBeHidden();

    // Toggle and parameters should be enabled
    const creativeToggle = page.getByTestId('creative-mode-toggle');
    await expect(creativeToggle).toBeEnabled();

    const tempSlider = page.getByTestId('temperature-slider');
    await expect(tempSlider).not.toHaveClass(/opacity-50/);
  });

  test('Negative case: Math model disables sampling and shows warning', async ({ page }) => {
    await page.goto('/?mock=true&showAllModels=true&autoDownload=false', { waitUntil: 'domcontentloaded' });

    // Select the Math model
    const modelSelectTrigger = page.getByTestId('model-select-trigger');
    await modelSelectTrigger.click();

    const option = page.locator('[data-testid^="model-option-"]').filter({ hasText: 'Qwen2.5-Math-1.5B-Instruct' }).first();
    await expect(option).toBeVisible();
    await option.click();

    // Accept download if visible
    const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
    try {
      await expect(acceptBtn).toBeVisible({ timeout: 2000 });
      await acceptBtn.click();
    } catch (e) {
      // already cached
    }

    // Verify it loads
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toBeVisible();

    // Open sampling accordion
    const samplingTrigger = page.getByTestId('accordion-sampling-trigger');
    await samplingTrigger.click();

    // Alert SHOULD be visible
    const alert = page.getByTestId('math-unsupported-alert');
    await expect(alert).toBeVisible();

    // Toggle should be disabled
    const creativeToggle = page.getByTestId('creative-mode-toggle');
    await expect(creativeToggle).toBeDisabled();

    // Repetition penalty slider should be disabled/greyed-out
    const repPenaltyItem = page.getByTestId('parameter-repetition-penalty');
    await expect(repPenaltyItem).toHaveClass(/opacity-50 pointer-events-none/);
  });

  test('Edge case: Chatting with a model sends instructions and generates response', async ({ page }) => {
    await page.goto('/?mock=true&showAllModels=true&autoDownload=false', { waitUntil: 'domcontentloaded' });

    // Start loading the default model
    try {
      const downloadBtn = page.getByRole('button', { name: /Télécharger et activer/i }).first();
      await downloadBtn.click({ timeout: 5000 });
      
      // Accept download in the confirmation modal
      const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
      await acceptBtn.click({ timeout: 5000 });
    } catch (e) {
      // Already downloading or loaded
    }

    // Wait for the chatbot to be ready
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toBeVisible();

    const textarea = page.getByTestId('chat-textarea');
    await expect(textarea).toBeEnabled();
    await textarea.fill('Calculate 2 + 2');

    const sendBtn = page.getByTestId('send-button');
    await sendBtn.click();

    // Look for assistant message
    const assistantMessage = page.locator('.justify-start').last();
    await expect(assistantMessage).toBeVisible({ timeout: 10000 });
    
    // Wait for text to stream
    await expect(async () => {
      const text = await assistantMessage.textContent();
      expect(text?.length).toBeGreaterThan(5);
    }).toPass({ timeout: 20000 });
  });
});
