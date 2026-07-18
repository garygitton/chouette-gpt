import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Téléchargement automatique lors de la sélection', () => {
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding modal and use mock LLM mode
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
      } catch (e) {}

      try {
        Object.defineProperty(navigator, 'deviceMemory', {
          value: 8,
          configurable: true
        });
      } catch (e) {}
    });

    // Abort third-party network requests
    await page.route(/hits\.seeyoufarm\.com/, route => route.abort());
    await page.route(/shields\.io/, route => route.abort());
  });

  test('La sélection d\'un modèle (mode développeur) doit ouvrir automatiquement le popup de téléchargement', async ({ page }) => {
    // Navigate with mock=true and autoDownload=false (so it doesn't download on startup) and showAllModels=true
    await page.goto('/?mock=true&autoDownload=false&showAllModels=true');

    // Click select dropdown
    const selectTrigger = page.getByTestId('model-select-trigger');
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // Select Qwen2.5-1.5B-Instruct
    const option = page.locator('[data-testid^="model-option-"]').filter({ hasText: 'Qwen2.5-1.5B-Instruct' });
    await expect(option).toBeVisible();
    await option.click();

    // Verification: download dialog must open automatically
    const downloadDialog = page.getByRole('dialog').filter({ hasText: 'Autoriser le téléchargement' });
    await expect(downloadDialog).toBeVisible({ timeout: 5000 });
    
    // Check that it shows the correct model name
    await expect(downloadDialog.locator('text=Qwen2.5-1.5B-Instruct')).toBeVisible();

    // Accept download
    const acceptBtn = downloadDialog.getByRole('button', { name: /Accepter et Télécharger/i });
    await acceptBtn.click();

    // Verification: dialog closes and download starts
    await expect(downloadDialog).toBeHidden();
    
    // Check status becomes Prêt
    const statusBadge = page.getByTestId('model-status-badge');
    await expect(statusBadge).toContainText('Prêt', { timeout: 10000 });
  });

  test('La sélection d\'un domaine doit ouvrir automatiquement le popup de téléchargement', async ({ page }) => {
    // Navigate with mock=true and autoDownload=false
    await page.goto('/?mock=true&autoDownload=false');

    // Click select dropdown
    const selectTrigger = page.getByTestId('model-select-trigger');
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // Select Développement domain (which maps to Qwen2.5-Coder-1.5B-Instruct)
    const domainOption = page.getByTestId('domain-option-code');
    await expect(domainOption).toBeVisible();
    await domainOption.click();

    // Verification: download dialog must open automatically
    const downloadDialog = page.getByRole('dialog').filter({ hasText: 'Autoriser le téléchargement' });
    await expect(downloadDialog).toBeVisible({ timeout: 5000 });
    
    // Check that it shows the correct resolved model name (Qwen2.5-Coder-1.5B-Instruct)
    await expect(downloadDialog.locator('text=Qwen2.5-Coder-1.5B-Instruct')).toBeVisible();

    // Accept download
    const acceptBtn = downloadDialog.getByRole('button', { name: /Accepter et Télécharger/i });
    await acceptBtn.click();

    // Verification: dialog closes and download starts
    await expect(downloadDialog).toBeHidden();
  });
});
