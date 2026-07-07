import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - BDD Multi-Download', () => {
  test.setTimeout(120000);
  
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding modal, mock GPU, and use mock LLM mode
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        // Mock LLM so the engine loads instantly
        (window as any).__mock_llm = true;
        // Fake GPU so all MLC models appear as compatible
        Object.defineProperty(window.navigator, 'gpu', {
          value: {
            requestAdapter: async () => ({
              features: { has: () => true },
              requestDevice: async () => ({ destroy: () => {} })
            })
          },
          configurable: true
        });
      } catch (e) {
        // Ignore storage access errors
      }
    });
  });

  test('Sélection et téléchargement de plusieurs modèles au démarrage', async ({ page }) => {
    
    await test.step('Given je suis sur la page d\'accueil sans modèle en cache', async () => {
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      
      // The chat textarea should be disabled (no model loaded yet)
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeDisabled({ timeout: 45000 });
      
      // The download button should be visible
      const downloadBtn = page.getByRole('button', { name: /Télécharger/ });
      await expect(downloadBtn).toBeVisible();
    });

    await test.step('When je sélectionne deux modèles différents via les checkboxes', async () => {
      // Find the checkboxes
      const checkboxes = page.locator('button[role="checkbox"]');
      
      // By default, the first model might be checked
      // Let's just click the first two checkboxes to ensure at least 2 are checked
      const count = await checkboxes.count();
      if (count >= 2) {
        const isFirstChecked = await checkboxes.nth(0).getAttribute('aria-checked') === 'true';
        if (!isFirstChecked) {
          await checkboxes.nth(0).click();
        }
        const isSecondChecked = await checkboxes.nth(1).getAttribute('aria-checked') === 'true';
        if (!isSecondChecked) {
          await checkboxes.nth(1).click();
        }
      }
    });

    await test.step('And je clique sur Télécharger & Démarrer', async () => {
      const downloadBtn = page.getByRole('button', { name: /Télécharger/ });
      await downloadBtn.click();
    });

    await test.step('Then je vois la progression indiquant le téléchargement de plusieurs modèles', async () => {
      // We should see [1/2] or [1/3] in the progress text
      const progressText = page.locator('main').getByText(/\[1\/\d+\]/);
      await expect(progressText).toBeVisible({ timeout: 10000 });
    });

    await test.step('And le chat devient disponible une fois la file terminée', async () => {
      // Wait for mock engine to finish all models
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 30000 });
      
      // Suggested prompts should now be visible (Card is used now instead of button)
      const promptCard = page.locator('[data-testid="suggested-prompt-physique-quantique"]');
      await expect(promptCard).toBeVisible({ timeout: 10000 });
    });
  });
});
