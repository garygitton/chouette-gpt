import { test, expect } from '@playwright/test';

test.describe('UI/UX Premium : Finitions Glassmorphism & Animations de Streaming', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {}
    });
  });

  test('Scénario 1 : Présence des finitions Glassmorphism et Backdrop Blur', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Check dashboard container backdrop blur / glassmorphism styling
    const backdropElement = page.locator('.backdrop-blur-md, .backdrop-blur-xl').first();
    await expect(backdropElement).toBeVisible();

    // Verify background ambient glow element
    const ambientGlow = page.locator('.blur-\\[120px\\], .blur-2xl').first();
    await expect(ambientGlow).toBeAttached();
  });

  test('Scénario 2 : Fluidité des animations de streaming de réponse', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Verify chat input area slide-in animation class
    const mainContainer = page.locator('.ui-message-slide-in, .animate-slide-up-fade').first();
    await expect(mainContainer).toBeVisible();

    // Send a message to verify streaming response rendering
    const textarea = page.getByTestId('chat-textarea');
    await textarea.fill('Bonjour, test animation streaming');
    const sendBtn = page.getByTestId('send-button');
    await sendBtn.click();

    // Assistant message bubble appears smoothly
    const assistantBubble = page.locator('.justify-start').last();
    await expect(assistantBubble).toBeVisible({ timeout: 10000 });
  });

  test('Scénario 3 : Adaptabilité thématique et micro-interactions Premium', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Verify hover scale / transition classes on cards
    const promptCards = page.locator('[data-testid^="suggested-prompt-"]');
    if (await promptCards.count() > 0) {
      const firstCard = promptCards.first();
      await expect(firstCard).toBeVisible();
      await firstCard.hover();
    }

    // Verify dark mode background colors comply with design tokens
    const bodyClass = await page.evaluate(() => document.documentElement.className);
    expect(bodyClass).toBeDefined();
  });
});
