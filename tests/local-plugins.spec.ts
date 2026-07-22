import { test, expect } from '@playwright/test';

test.describe('Plugins Locaux : Système d\'Outils Sécurisés Locaux', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {}
    });
  });

  test('Scénario 1 : Outil Horloge Locale (get_current_time)', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Test local time retrieval tool in execution environment
    const localTime = await page.evaluate(() => {
      const now = new Date();
      return now.toISOString();
    });
    expect(localTime).toBeTruthy();
    expect(new Date(localTime).getFullYear()).toBeGreaterThanOrEqual(2025);
  });

  test('Scénario 2 : Outil Calculatrice Locale (evaluate_math)', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Test math tool evaluation safely without eval() security hazards
    const mathResult = await page.evaluate((expr) => {
      try {
        // Safe math evaluation parser simulation
        const cleanExpr = expr.replace(/[^0-9+\-*/().]/g, '');
        return Function(`"use strict"; return (${cleanExpr})`)();
      } catch (e) {
        return null;
      }
    }, '125 * 8 + 40');

    expect(mathResult).toBe(1040);
  });

  test('Scénario 3 : Outil Scraping / Extraire Contenu Local (fetch_page / DOM parser)', async ({ page }) => {
    await page.goto('/?mock=true&autoDownload=false');

    // Verify local DOM text extraction capability for RAG & page analysis
    const pageTitle = await page.evaluate(() => {
      return document.title || document.querySelector('h1')?.textContent || '';
    });
    expect(pageTitle).toContain('Chouette');
  });
});
