import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Vérification du fonctionnement des 3 modèles', () => {
  // Give a very generous timeout to allow downloading all models (10 minutes)
  test.setTimeout(600000);

  const models = [
    'SmolLM2-135M-Instruct',
    'Qwen2.5-0.5B-Instruct',
    'Llama-3.2-1B-Instruct',
    'Qwen2.5-1.5B-Instruct',
    'Llama-3.2-3B-Instruct',
    'Phi-3.5-mini-instruct'
  ];

  for (const modelName of models) {
    test(`Tester le modèle ${modelName}`, async ({ page, context }) => {
      // Écouter les logs du navigateur pour le debug
      page.on('console', msg => console.log(`[BROWSER LOG (${modelName})]`, msg.text()));
      page.on('pageerror', exception => console.error(`[BROWSER ERROR (${modelName})]`, exception.stack || exception.message));

      // Intercepter les requêtes HuggingFace pour servir les modèles locaux en cache
      await context.route('https://huggingface.co/**/*', async (route) => {
         const url = new URL(route.request().url());
         const parts = url.pathname.split('/');
         if (parts.length >= 6) {
           const repoId = parts[1] + '/' + parts[2];
           const fileParts = parts.slice(5);
           const localPath = path.join(process.cwd(), 'tests', 'fixtures', 'models', repoId, ...fileParts);
           if (fs.existsSync(localPath)) {
              return await route.fulfill({ path: localPath });
           }
         }
         await route.continue();
      });

      // 0. Bypass onboarding modal
      await page.addInitScript(() => {
        try {
          window.localStorage.setItem('chouette-onboarding-seen', 'true');
        } catch (e) {}
      });

      // 1. Ouvrir l'application
      // On mock l'inférence pour TOUS les modèles dans ce test E2E pour éviter les crashs WebGPU/WASM
      // en mode headless. L'exécution réelle est testée dans webgpu-hardware.spec.ts
      const url = '/?mock=true';
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // 2. Sélectionner le modèle dans la sidebar
      const modelSelectTrigger = page.getByTestId('model-select-trigger');
      await modelSelectTrigger.click();

      // Find the specific model option and click it
      const option = page.locator(`[data-testid^="model-option-"]`).filter({ hasText: modelName });
      await expect(option).toBeVisible();
      await option.click();
      await expect(option).toBeHidden();

      // 3. Télécharger et activer
      const downloadBtn = page.getByTestId('sidebar').getByRole('button', { name: /Télécharger et activer/i });
      await expect(downloadBtn).toBeVisible({ timeout: 5000 });
      await downloadBtn.click();

      // Accept download in the confirmation modal
      const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
      await expect(acceptBtn).toBeVisible({ timeout: 5000 });
      await acceptBtn.click();

      // 4. Attendre que le statut passe à "Prêt"
      const statusBadge = page.getByTestId('model-status-badge');
      await expect(statusBadge).toContainText('Prêt', { timeout: 300000 }); // 5 minutes for download

      // 5. Envoyer un message
      const textarea = page.getByTestId('chat-textarea');
      await textarea.fill('Bonjour, comment vas-tu ? Dis moi juste "je vais bien".');
      
      const submitBtn = page.getByTestId('send-button');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // 6. Vérifier que le modèle répond
      const assistantMessage = page.locator('.justify-start').last();
      await expect(assistantMessage).toBeVisible({ timeout: 10000 });

      // Attendre un peu de texte (plus de 10 caractères)
      await expect(async () => {
        const textContent = await assistantMessage.textContent();
        expect(textContent?.length).toBeGreaterThan(10);
      }).toPass({ timeout: 120000 }); // 2 minutes for generation

      // Stop the generation
      const stopBtn = page.locator('button').filter({ hasText: 'Interrompre' }).first();
      if (await stopBtn.isVisible()) {
         await stopBtn.click();
      }
    });
  }
});
