import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Gestion des Domaines et Fallbacks', () => {
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

  test('Devrait afficher uniquement les domaines avec un modèle disponible', async ({ page }) => {
    await page.goto('/?mock=true&mockMemory=8&autoDownload=false');

    // Click on the domain select trigger
    const selectTrigger = page.getByTestId('model-select-trigger');
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // Verify active domains (small, general, code) are present in the dropdown list
    const smallOption = page.getByTestId('domain-option-small');
    const generalOption = page.getByTestId('domain-option-general');
    const codeOption = page.getByTestId('domain-option-code');

    await expect(smallOption).toBeVisible();
    await expect(generalOption).toBeVisible();
    await expect(codeOption).toBeVisible();

    // Verify unbacked domains without explicit models (e.g. maths, medicine, legal) are NOT displayed
    const mathsOption = page.getByTestId('domain-option-maths');
    const medicineOption = page.getByTestId('domain-option-medicine');
    const legalOption = page.getByTestId('domain-option-legal');

    await expect(mathsOption).toHaveCount(0);
    await expect(medicineOption).toHaveCount(0);
    await expect(legalOption).toHaveCount(0);
  });

  test('Le domaine Développement utilise le modèle dédié Qwen2.5-Coder-0.5B-Instruct', async ({ page }) => {
    await page.goto('/?mock=true&mockMemory=8&autoDownload=false');

    // Click on dropdown
    await page.getByTestId('model-select-trigger').click();

    // Check option content for Code domain
    const codeOption = page.getByTestId('domain-option-code');
    await expect(codeOption).toContainText('Qwen2.5-Coder-0.5B-Instruct');

    // Select Développement
    await codeOption.click();

    // Model details card should show RAM required and model info
    const infoCard = page.locator('div').filter({ hasText: 'RAM Requise:' }).last();
    await expect(infoCard).toContainText('1.0 GB');
  });
});
