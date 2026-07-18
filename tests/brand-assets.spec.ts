import { test, expect } from '@playwright/test';

test.describe('Brand Assets Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {}
    });

    await page.route(/hits\.seeyoufarm\.com/, route => route.abort());
    await page.route(/shields\.io/, route => route.abort());
  });

  test('should display the brand assets page and support language toggling', async ({ page }) => {
    await page.goto('/brand-assets?mock=true&autoDownload=false');

    // Verify main header is visible
    const header = page.locator('h1', { hasText: 'Brand Assets' });
    await expect(header).toBeVisible();

    // Verify French (default) text is present
    await expect(page.locator('text=Descriptions & Pitches').first()).toBeVisible();
    await expect(page.locator('text=Modèles Spécialisés par Métier').first()).toBeVisible();

    // Toggle to English
    await page.click('button:has-text("English")');

    // Verify English text is now visible
    await expect(page.locator('text=Domain-Specific Models').first()).toBeVisible();
  });
});
