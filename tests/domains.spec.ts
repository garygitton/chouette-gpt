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

  test('Devrait afficher la liste des domaines par défaut', async ({ page }) => {
    await page.goto('/?mock=true&mockMemory=8&autoDownload=false');

    // Click on the domain select trigger
    const selectTrigger = page.getByTestId('model-select-trigger');
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();

    // Verify all 11 domains are present in the dropdown list
    const smallOption = page.getByTestId('domain-option-small');
    const generalOption = page.getByTestId('domain-option-general');
    const mathsOption = page.getByTestId('domain-option-maths');
    const codeOption = page.getByTestId('domain-option-code');
    const medicineOption = page.getByTestId('domain-option-medicine');
    const legalOption = page.getByTestId('domain-option-legal');
    const writingOption = page.getByTestId('domain-option-writing');
    const translationOption = page.getByTestId('domain-option-translation');
    const educationOption = page.getByTestId('domain-option-education');
    const marketingOption = page.getByTestId('domain-option-marketing');
    const financeOption = page.getByTestId('domain-option-finance');

    await expect(smallOption).toBeVisible();
    await expect(generalOption).toBeVisible();
    await expect(mathsOption).toBeVisible();
    await expect(codeOption).toBeVisible();
    await expect(medicineOption).toBeVisible();
    await expect(legalOption).toBeVisible();
    await expect(writingOption).toBeVisible();
    await expect(translationOption).toBeVisible();
    await expect(educationOption).toBeVisible();
    await expect(marketingOption).toBeVisible();
    await expect(financeOption).toBeVisible();
  });

  test('Médecine devrait utiliser MedGemma sous 8GB de RAM et un Fallback sous 2GB de RAM', async ({ page }) => {
    await test.step('Avec 8 Go de RAM, Médecine utilise MedGemma-4B-Instruct', async () => {
      await page.goto('/?mock=true&mockMemory=8&autoDownload=false');

      // Click on dropdown
      await page.getByTestId('model-select-trigger').click();

      // Check option content for MedGemma
      const medicineOption = page.getByTestId('domain-option-medicine');
      await expect(medicineOption).toContainText('MedGemma-4B-Instruct');
      // No fallback badge should be visible for MedGemma since it's compatible
      await expect(medicineOption.locator('text=Fallback')).toHaveCount(0);

      // Select Médecine
      await medicineOption.click();

      // Model details card should show RAM required and model info
      const infoCard = page.locator('div').filter({ hasText: 'RAM Requise:' }).last();
      await expect(infoCard).toContainText('8.0 GB');
    });

    await test.step('Avec 2 Go de RAM, Médecine utilise un Fallback (Qwen2.5-0.5B-Instruct)', async () => {
      await page.goto('/?mock=true&mockMemory=2&autoDownload=false');

      // Click on dropdown
      await page.getByTestId('model-select-trigger').click();

      // Check option content
      const medicineOption = page.getByTestId('domain-option-medicine');
      await expect(medicineOption).toContainText('Qwen2.5-0.5B-Instruct');
      // Fallback badge must be present
      await expect(medicineOption.locator('text=Fallback')).toBeVisible();

      // Select Médecine
      await medicineOption.click();

      // Model details card should show fallback RAM required (2GB)
      const infoCard = page.locator('div').filter({ hasText: 'RAM Requise:' }).last();
      await expect(infoCard).toContainText('2.0 GB');
    });
  });
});
