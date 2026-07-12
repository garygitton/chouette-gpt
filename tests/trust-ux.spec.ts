import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - BDD Trust UX', () => {
  test.setTimeout(120000);
  
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding modal, mock GPU, and use mock LLM mode
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        (window as any).__mock_llm = true;
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
      }
    });
  });

  test('Vérification des éléments de confiance et du mode Expert', async ({ page }) => {
    
    await test.step('Given un nouvel utilisateur arrive sur la page', async () => {
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      // Wait for page to be interactive by checking the sidebar
      const sidebar = page.getByTestId('sidebar');
      await expect(sidebar).toBeVisible({ timeout: 45000 });
    });

    await test.step('Then il voit les badges de confidentialité et les explications pédagogiques', async () => {
      // Trust badges
      await expect(page.getByText('100% Privé').first()).toBeVisible();
      await expect(page.getByText('Hors-ligne').first()).toBeVisible();
      await expect(page.getByText('Zéro Pistage').first()).toBeVisible();
      
      // Minimalist CTA instead of mini-tutorial
      await expect(page.getByText('Sélectionnez un modèle dans la barre latérale pour commencer')).toBeVisible();
    });

    await test.step('And le jargon technique est masqué par défaut', async () => {
      await expect(page.getByText('Bonne nouvelle !')).toBeVisible();
      
      // Technical details like WebGPU or CPU Cores should be hidden
      const technicalDetails = page.getByText(/GB RAM •/);
      await expect(technicalDetails).not.toBeVisible();
    });

    await test.step('When il clique sur "Voir les détails techniques"', async () => {
      // Shadcn CollapsibleTrigger defaults to role="button" unless changed
      const toggle = page.getByText('Voir les détails techniques');
      await toggle.click();
    });

    await test.step('Then le composant avec le score et la RAM s\'affiche correctement', async () => {
      const technicalDetails = page.getByText(/GB RAM •/);
      await expect(technicalDetails).toBeVisible({ timeout: 5000 });
    });
  });
});
