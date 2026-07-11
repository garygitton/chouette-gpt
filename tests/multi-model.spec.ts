import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Vérification du fonctionnement des 3 modèles', () => {
  // Give a very generous timeout to allow downloading all models (10 minutes)
  test.setTimeout(600000);

  const models = [
    'Qwen1.5-0.5B-Chat',
    'TinyLlama-1.1B-Chat',
    'Llama-3.2-1B-Instruct',
    'SmolLM-135M-Instruct',
    'Phi-3-mini-4k-instruct'
  ];

  for (const modelName of models) {
    test(`Tester le modèle ${modelName}`, async ({ page }) => {
      // Intercepter les requêtes HuggingFace pour servir les modèles locaux en cache
      await page.route('https://huggingface.co/**/*', async (route) => {
         const url = new URL(route.request().url());
         const parts = url.pathname.split('/');
         if (parts.length >= 6) {
           const repoId = parts[1] + '/' + parts[2];
           const fileParts = parts.slice(5);
           const localPath = path.join(process.cwd(), 'data', 'models', repoId, ...fileParts);
           if (fs.existsSync(localPath)) {
              return await route.fulfill({ path: localPath });
           }
         }
         await route.continue();
      });

      // 1. Ouvrir l'application
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Close WebGPU wizard if present
      try {
        const closeWizardBtn = page.getByTestId('close-wizard-btn');
        await expect(closeWizardBtn).toBeVisible({ timeout: 2000 });
        await closeWizardBtn.click();
      } catch (e) {
        // Modal didn't appear, continue
      }

      // 2. Sélectionner le modèle dans la sidebar
      const modelSelectTrigger = page.getByTestId('model-select-trigger');
      await modelSelectTrigger.click();

      // Find the specific model option and click it
      const option = page.locator(`[data-testid^="model-option-"]`).filter({ hasText: modelName });
      await expect(option).toBeVisible();
      await option.click();


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
