import { test, expect } from '@playwright/test';

test.describe('Feature: Model Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to prevent onboarding modal if we simulate no WebGPU
    await page.addInitScript(() => {
      window.localStorage.setItem('chouette-onboarding-seen', 'true');
    });
  });

  test('Scenario: Change model from Top Selector', async ({ page }) => {
    await test.step('Given I am on the ChouetteGPT app', async () => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
    });

    await test.step('When I click on the Top Model Selector', async () => {
      const combobox = page.getByTestId('top-model-selector').first();
      await expect(combobox).toBeVisible();
      await combobox.click();
    });

    await test.step('And I select the TinyLlama CPU model', async () => {
      // The option in the dropdown
      const option = page.getByRole('option', { name: /TinyLlama-1.1B-Chat \(CPU\)/i });
      await expect(option).toBeVisible();
      await option.click();
    });

    await test.step('And I confirm the model download dialog', async () => {
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      const dialogAccept = dialog.getByRole('button', { name: /Télécharger et Charger/i });
      await expect(dialogAccept).toBeVisible();
      await dialogAccept.click();
      
      // Dialog should disappear
      await expect(dialog).toBeHidden();
    });

    await test.step('Then the model selector shows the new model', async () => {
      // Check the combobox text
      const combobox = page.getByTestId('top-model-selector').first();
      await expect(combobox).toContainText(/TinyLlama-1.1B-Chat \(CPU\)/i);
    });
  });
});
