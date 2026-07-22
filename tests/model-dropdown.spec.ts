import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Model Selector Search & Language Alignment', () => {
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding modal and use mock LLM mode
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {}
    });

    // Abort third-party network requests
    await page.route(/hits\.seeyoufarm\.com/, route => route.abort());
    await page.route(/shields\.io/, route => route.abort());
  });

  test('Should filter domains by typing in the search bar', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Click on the domain select trigger to open the dropdown
    const selectTrigger = page.getByTestId('model-select-trigger');
    await selectTrigger.click();

    // The search input should be visible inside the dropdown
    const searchInput = page.locator('input[placeholder="Rechercher un modèle..."]');
    await expect(searchInput).toBeVisible();

    // Type "Développement" to filter
    await searchInput.fill('Développement');

    // "Développement" option should be visible
    const codeOption = page.getByTestId('domain-option-code');
    await expect(codeOption).toBeVisible();

    // "Petit / Léger" option should NOT be visible when searching "Développement"
    const smallOption = page.getByTestId('domain-option-small');
    await expect(smallOption).not.toBeVisible();
  });

  test('Should translate domain names dynamically when the language changes', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    const langSelect = page.getByTestId('language-select-trigger');
    if (await langSelect.count() > 0) {
      await langSelect.click();
      const enOption = page.getByTestId('language-item-en');
      await enOption.click();

      // Now verify domains in the dropdown are translated
      const selectTrigger = page.getByTestId('model-select-trigger');
      await selectTrigger.click();

      // The search input placeholder should now be in English
      const searchInput = page.locator('input[placeholder="Search a model..."]');
      await expect(searchInput).toBeVisible();

      // The Code domain should be translated to "Development"
      const codeOption = page.getByTestId('domain-option-code');
      await expect(codeOption).toContainText('Development');

      // The Small domain should be translated to "Small"
      const smallOptionEn = page.getByTestId('domain-option-small');
      await expect(smallOptionEn).toContainText('Small');
    }
  });

  test('Should translate domain names to Spanish and Chinese', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    const langSelect = page.getByTestId('language-select-trigger');
    if (await langSelect.count() > 0) {
      // 1. Spanish test
      await langSelect.click();
      await page.getByTestId('language-item-es').click();

      const selectTrigger = page.getByTestId('model-select-trigger');
      await selectTrigger.click();

      const codeOptionEs = page.getByTestId('domain-option-code');
      await expect(codeOptionEs).toContainText('Desarrollo');

      // Close dropdown
      await page.keyboard.press('Escape');

      // 2. Chinese test
      await langSelect.click();
      await page.getByTestId('language-item-zh').click();

      await selectTrigger.click();

      const codeOptionZh = page.getByTestId('domain-option-code');
      await expect(codeOptionZh).toContainText('代码开发');
    }
  });

  test('Should align brand assets initial language with settingsStore language', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Switch to English first
    const langSelect = page.getByTestId('language-select-trigger');
    if (await langSelect.count() > 0) {
      await langSelect.click();
      await page.getByTestId('language-item-en').click();

      // Navigate to /brand-assets
      await page.goto('/brand-assets?mock=true&autoDownload=false');

      // English button should be active/selected, and English text should show
      await expect(page.locator('text=Role-Specific Specialized Models').first()).toBeVisible();
    }
  });
});
