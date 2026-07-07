import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - BDD Right Sidebar & Advanced Settings', () => {
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

  test('Onboarding : télécharger un modèle avant de discuter', async ({ page }) => {
    
    await test.step('Given je suis sur la page sans modèle chargé', async () => {
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      
      // The chat textarea should be disabled (no model loaded yet)
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeDisabled({ timeout: 15000 });
      
      // The download button should be visible
      const downloadBtn = page.getByRole('button', { name: /Télécharger/ });
      await expect(downloadBtn).toBeVisible();
    });

    await test.step('When je clique sur Télécharger & Démarrer', async () => {
      const downloadBtn = page.getByRole('button', { name: /Télécharger/ });
      await downloadBtn.click();
    });

    await test.step('Then la barre de progression apparaît et le moteur charge', async () => {
      // Progress bar should be visible - scoped to the main content (not token gauge in sidebar)
      const progressBar = page.locator('main [role="progressbar"]').first();
      await expect(progressBar).toBeVisible({ timeout: 10000 });
      
      // Cancel button should be visible
      const cancelBtn = page.getByRole('button', { name: 'Annuler' });
      await expect(cancelBtn).toBeVisible();
    });

    await test.step('And une fois le chargement terminé, le chat est disponible', async () => {
      // Wait for mock engine to finish (5 x 500ms = 2.5s)
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 15000 });
      
      // Suggested prompts should now be visible
      const promptCard = page.locator('button:has-text("Physique Quantique")');
      await expect(promptCard).toBeVisible({ timeout: 10000 });
    });
  });

  test('Vérifier et manipuler la barre latérale droite et ses paramètres', async ({ page, isMobile }) => {
    
    await test.step('Given je suis sur la page avec le modèle chargé (mock)', async () => {
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      
      // Trigger download to complete the engine load
      const downloadBtn = page.getByRole('button', { name: /Télécharger/ });
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.click();
      
      // Wait for engine to be ready
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 15000 });

      // If mobile, toggle the right sidebar
      if (isMobile) {
        const settingsToggleBtn = page.locator('header button').nth(2);
        await settingsToggleBtn.click();
      }

      const sidebarTitle = page.getByRole('heading', { name: 'Paramètres' });
      await expect(sidebarTitle).toBeVisible();
    });

    await test.step('When je modifie le Prompt Système', async () => {
      const systemPromptInput = page.getByPlaceholder('Comportement global de l\'assistant...');
      await expect(systemPromptInput).toBeVisible();
      await systemPromptInput.fill('Tu es un pirate qui répond avec "Arr!".');
      await expect(systemPromptInput).toHaveValue('Tu es un pirate qui répond avec "Arr!".');
    });

    await test.step('And je vérifie les curseurs de paramètres avancés', async () => {
      const sliders = page.locator('[role="slider"]');
      await expect(sliders).toHaveCount(6); // Temp, TopP, MaxTokens, TopK, FreqPen, PresPen
    });

    await test.step('Then je peux voir la jauge de tokens de session', async () => {
      await expect(page.getByText('Tokens de session')).toBeVisible();
      await expect(page.getByText('/ 8192')).toBeVisible();
    });

    await test.step('When je sélectionne un autre modèle dans la sidebar', async () => {
      // The right sidebar's combobox
      const modelSelectTrigger = page.locator('[data-testid="right-sidebar"] button[role="combobox"], [role="dialog"] button[role="combobox"]').first();
      await modelSelectTrigger.click();
      
      // Select any 2nd option in the dropdown
      const option = page.locator('[role="option"]').nth(1);
      await expect(option).toBeVisible();
      await option.click();
    });

    await test.step('Then une modale de confirmation demande mon autorisation', async () => {
      const dialogTitle = page.getByRole('heading', { name: 'Téléchargement du modèle' });
      await expect(dialogTitle).toBeVisible({ timeout: 5000 });
      
      // Cancel the download
      const cancelBtn = page.getByRole('button', { name: 'Annuler' });
      await cancelBtn.click();
      
      await expect(dialogTitle).not.toBeVisible();
    });
  });
});
