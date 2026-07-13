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

    // Abort third-party network requests to keep tests fast and offline-capable
    await page.route(/hits\.seeyoufarm\.com/, route => route.abort());
    await page.route(/shields\.io/, route => route.abort());
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
      await expect(page.getByText("Télécharger et activer l'IA").first()).toBeVisible();
    });
  });
});
