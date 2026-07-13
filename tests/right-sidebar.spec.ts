import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - Advanced Settings & Right Sidebar', () => {
  test.setTimeout(60000);

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

    // Abort third-party network requests to keep tests fast and offline-capable
    await page.route(/hits\.seeyoufarm\.com/, route => route.abort());
    await page.route(/shields\.io/, route => route.abort());
  });

  test('Onboarding : télécharger un modèle avant de discuter', async ({ page }) => {
    
    await test.step('Given je suis sur la page sans modèle chargé', async () => {
      await page.goto('/?mock=true&noAutoDownload=true', { waitUntil: 'domcontentloaded' });
      
      // The chat textarea should be disabled (no model loaded yet)
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeDisabled({ timeout: 15000 });
      
      // The download button should be visible in the sidebar
      const downloadBtn = page.getByTestId('sidebar').getByRole('button', { name: /Télécharger et activer/ });
      await expect(downloadBtn).toBeVisible();
    });

    await test.step('When je clique sur Télécharger et activer', async () => {
      const downloadBtn = page.getByTestId('sidebar').getByRole('button', { name: /Télécharger et activer/ });
      await downloadBtn.click();

      // Accept download in the confirmation modal
      const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
      await expect(acceptBtn).toBeVisible({ timeout: 5000 });
      await acceptBtn.click();
    });

    await test.step('Then la barre de progression apparaît et le moteur charge', async () => {
      const progressBar = page.getByRole('progressbar').first();
      await expect(progressBar).toBeVisible({ timeout: 10000 });
      
      // Pause button should be visible (was Annuler)
      const cancelBtn = page.getByRole('button', { name: 'Mettre en pause' });
      await expect(cancelBtn).toBeVisible();
    });

    await test.step('And une fois le chargement terminé, le chat est disponible', async () => {
      // Wait for the textarea to become enabled
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 15000 });
      
      // The status badge should say "Prêt"
      const statusBadge = page.getByTestId('model-status-badge');
      await expect(statusBadge).toContainText('Prêt');
    });
  });

  test('Vérifier et manipuler la barre latérale droite et ses paramètres', async ({ page }) => {
    await test.step('Given je suis sur la page avec le modèle chargé (mock)', async () => {
      await page.goto('/?mock=true', { waitUntil: 'networkidle' });
      
      // Click download button
      const downloadBtn = page.getByRole('button', { name: /Télécharger et activer l'IA/i });
      await expect(downloadBtn).toBeVisible({ timeout: 5000 });
      await downloadBtn.click();

      // Accept download in the confirmation modal
      const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
      await expect(acceptBtn).toBeVisible({ timeout: 5000 });
      await acceptBtn.click();

      // The chat textarea should be enabled (model loaded)
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 15000 });

      // Wait for the download to actually finish
      const statusBadge = page.getByTestId('model-status-badge');
      await expect(statusBadge).toBeVisible({ timeout: 10000 });
    });

    await test.step('When je modifie le Prompt Système', async () => {
      const sysPromptArea = page.getByPlaceholder('Comportement global de l\'assistant...');
      await expect(sysPromptArea).toBeVisible();
      
      await sysPromptArea.fill('Tu es un pirate.');
      // Simuler une perte de focus pour déclencher l'enregistrement
      await sysPromptArea.blur();
    });

    await test.step('And je vérifie les curseurs de paramètres avancés', async () => {
      // Ouvre l'accordéon des paramètres avancés
      const advancedToggle = page.getByRole('button', { name: 'Paramètres avancés' });
      await advancedToggle.click();
      
      const sliders = page.locator('[role="slider"]');
      await expect(sliders).toHaveCount(4); // Temp, TopP, MaxTokens, TopK
    });

    await test.step('Then je peux voir la jauge de tokens de conversation', async () => {
      const usageMeter = page.getByText(/Tokens de conversation/i);
      await expect(usageMeter).toBeVisible();
    });

    await test.step('When je sélectionne un autre modèle dans la sidebar', async () => {
      // The left sidebar's combobox
      const modelSelectTrigger = page.locator('[data-testid="sidebar"] button[role="combobox"], [role="dialog"] button[role="combobox"]').first();
      await modelSelectTrigger.click();
      
      // Select any 2nd option in the dropdown
      const option = page.locator('[role="option"]').nth(1);
      await expect(option).toBeVisible();
      await option.click({ force: true });
      await expect(option).toBeHidden();

      // Click "Télécharger et activer" button in the sidebar
      const downloadBtn = page.getByTestId('sidebar').getByRole('button', { name: /Télécharger et activer/i });
      await expect(downloadBtn).toBeVisible({ timeout: 5000 });
      await downloadBtn.click();

      // Accept download in the confirmation modal
      const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
      await expect(acceptBtn).toBeVisible({ timeout: 5000 });
      await acceptBtn.click();
    });

    await test.step('Then le chargement du nouveau modèle commence', async () => {
      // Vérifie que le statut de chargement ou "Prêt" apparaît
      const statusBadge = page.getByTestId('model-status-badge');
      await expect(statusBadge).toBeVisible({ timeout: 10000 });
    });
  });
});
