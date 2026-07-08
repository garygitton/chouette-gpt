import { test, expect } from '@playwright/test';

test.describe('Feature: Model Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to prevent onboarding modal if we simulate no WebGPU
    await page.addInitScript(() => {
      window.localStorage.setItem('chouette-onboarding-seen', 'true');
      (window as any).__mock_llm = true;
    });
  });

  test('Scenario: Change model from Sidebar Selector', async ({ page }) => {
    await test.step('Given I am on the ChouetteGPT app', async () => {
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      const sidebar = page.getByTestId('sidebar');
      await expect(sidebar).toBeVisible();
    });

    await test.step('When I click on the Sidebar Model Selector', async () => {
      const sidebar = page.getByTestId('sidebar');
      const combobox = sidebar.getByRole('combobox').first();
      await expect(combobox).toBeVisible();
      await combobox.click();
    });

    await test.step('And I select the TinyLlama CPU model', async () => {
      // The option in the dropdown
      const option = page.getByRole('option', { name: /TinyLlama-1.1B-Chat/i });
      await expect(option).toBeVisible();
      await option.click();
    });

    await test.step('And I click on the Download button', async () => {
      const sidebar = page.getByTestId('sidebar');
      const downloadBtn = sidebar.getByRole('button', { name: /Télécharger et activer/i });
      await expect(downloadBtn).toBeVisible();
      await downloadBtn.click();
      
      // Wait for it to be ready
      const readyText = sidebar.getByText(/Prêt à l'emploi/i);
      await expect(readyText).toBeVisible({ timeout: 10000 });
    });

    await test.step('Then the model selector shows the new model', async () => {
      // Check the combobox text
      const sidebar = page.getByTestId('sidebar');
      const combobox = sidebar.getByRole('combobox').first();
      await expect(combobox).toContainText(/TinyLlama-1.1B-Chat/i);
    });
  });
});
