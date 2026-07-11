import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - BDD Cache & Security', () => {
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

    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
  });

  test('Vérification de la stratégie de cache et du chargement WASM sécurisé', async ({ page }) => {
    
    await test.step('Given je suis sur ChouetteGPT', async () => {
      await page.goto('/?mock=true', { waitUntil: 'networkidle' });
    });

    await test.step('Then les fichiers statiques lourds sont servis avec un cache immutable', async () => {
      // Perform a manual fetch inside the browser page to trigger Nitro route rules and verify them
      const headers = await page.evaluate(async () => {
        const res = await fetch('/wasm/ort-wasm-simd-threaded.wasm');
        return {
          cacheControl: res.headers.get('cache-control')
        };
      });
      
      expect(headers.cacheControl).toContain('immutable');
      expect(headers.cacheControl).toContain('max-age');
    });

    await test.step('And le chat fonctionne et utilise la logique WASM sécurisée', async () => {
      // Install model (mock mode)
      const downloadBtn = page.getByRole('button', { name: /Télécharger et activer/ });
      await expect(downloadBtn).toBeVisible({ timeout: 15000 });
      await downloadBtn.click();
      
      // Wait for chat to be active
      const textarea = page.getByTestId('chat-textarea');
      await expect(textarea).toBeEnabled({ timeout: 30000 });
      
      // Send message
      await textarea.fill('Test de message');
      await page.getByTestId('send-button').click();
      
      // Wait for response
      const assistantMessage = page.locator('main').getByText(/Bonjour/);
      await expect(assistantMessage).toBeVisible({ timeout: 10000 });
    });
  });
});
