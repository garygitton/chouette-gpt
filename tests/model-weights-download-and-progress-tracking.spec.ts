import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - BDD Download', () => {
  test.setTimeout(120000);
  
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding modal, mock GPU, and use mock LLM mode
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        // Mock LLM so the engine loads instantly
        (window as any).__mock_llm = true;
      } catch (e) {
        // Ignore storage access errors
      }
    });
  });

  test('Téléchargement d\'un modèle au démarrage via la barre latérale', async ({ page }) => {
    
    await test.step('Given je suis sur la page d\'accueil sans modèle en cache', async () => {
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      
      // The chat textarea should be disabled (no model loaded yet)
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeDisabled({ timeout: 45000 });
      
      // The download button should be visible in the sidebar
      const sidebar = page.getByTestId('sidebar');
      const downloadBtn = sidebar.getByRole('button', { name: /Télécharger et activer/ });
      await expect(downloadBtn).toBeVisible();
    });

    await test.step('When je clique sur Télécharger et activer', async () => {
      const sidebar = page.getByTestId('sidebar');
      const downloadBtn = sidebar.getByRole('button', { name: /Télécharger et activer/ });
      await downloadBtn.click();
    });

    await test.step('Then le chat devient disponible une fois terminé', async () => {
      // Wait for mock engine to finish
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 30000 });
      
      // The sidebar should show that it's ready
      const sidebar = page.getByTestId('sidebar');
      const readyText = sidebar.getByText(/Prêt à l'emploi/i);
      await expect(readyText).toBeVisible({ timeout: 10000 });
    });
  });
});
