import { test, expect } from '@playwright/test';

test.describe('UI & Experimental Mentions', () => {
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding modal and use mock LLM mode to prevent capability-check issues
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {
        // Ignore storage access errors
      }
    });

    // Abort third-party network requests to keep tests fast and offline-capable
    await page.route(/hits\.seeyoufarm\.com/, route => route.abort());
    await page.route(/shields\.io/, route => route.abort());
  });

  test('should display experimental badges and disclaimers on the dashboard', async ({ page }) => {
    // Navigate to the app (mock mode to bypass heavy model loading)
    await page.goto('/?mock=true&autoDownload=false');

    // 1. Verify the "Expérimental" badge is present next to the title
    const experimentalBadge = page.locator('text=Expérimental').first();
    await expect(experimentalBadge).toBeVisible();

    // 2. Verify the project objective text is present
    const projectObjective = page.locator('text=Objectif du projet :').first();
    await expect(projectObjective).toBeVisible();

    // 3. Verify the minimalist "C" logo is present instead of an owl
    const logoC = page.locator('text=C').first();
    await expect(logoC).toBeVisible();

    // Ensure the word "chouette" (owl) isn't used as an image alt text anywhere
    const owlImages = page.locator('img[alt*="chouette" i]');
    await expect(owlImages).toHaveCount(0);
  });

  test('should display the experimental disclaimer in the chat interface', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false&showAllModels=true');

    // Select the model so the chat interface is visible 
    await page.waitForSelector('text=Modèle IA Local');
    await page.click('button[role="combobox"]');
    await page.getByRole('option', { name: /Qwen2.5/i }).first().click({ force: true });

    // Wait for the Select dropdown animation to finish
    await page.waitForTimeout(500);

    // Verify the chat disclaimer contains the experimental text
    const disclaimer = page.locator('text=Projet expérimental visant à tester les limites des LLMs locaux');
    await expect(disclaimer).toBeVisible();
  });
});
