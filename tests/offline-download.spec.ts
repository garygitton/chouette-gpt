import { test, expect } from '@playwright/test';

test.describe('Model Download & Pause Flow', () => {
  test('should allow pausing and resuming model download', async ({ page }) => {
    // Log console messages to diagnose any client-side errors
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    // Navigate to the app (using the mock mode so it downloads a fake small payload and we can control it)
    await page.goto('/?mock=true');

    // Click "Télécharger et activer l'IA" button on the landing dashboard
    const downloadBtn = page.getByRole('button', { name: /Télécharger et activer l'IA/i });
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });
    await downloadBtn.click();

    // Accept download in the confirmation modal
    const acceptBtn = page.getByRole('button', { name: /Accepter et Télécharger/i });
    await expect(acceptBtn).toBeVisible({ timeout: 5000 });
    await acceptBtn.click();

    // Verify the download modal appears
    const loadingModal = page.locator('text=Téléchargement en cours').first();
    await expect(loadingModal).toBeVisible({ timeout: 15000 });

    // Wait a brief moment to let the mock download progress start
    await page.waitForTimeout(500);

    // Press Escape to pause the download
    await page.keyboard.press('Escape');

    // Verify the modal disappears
    await expect(loadingModal).toBeHidden();

    // Verify that the "En pause" state is shown in the sidebar model selector
    const pausedText = page.locator('text=En pause').first();
    await expect(pausedText).toBeVisible();

    await page.waitForTimeout(1000);

    // Click "Reprendre" in the sidebar
    await page.getByRole('button', { name: /Reprendre/i }).click({ force: true });

    // The modal should reappear
    await expect(loadingModal).toBeVisible();

    // Now wait for the engine to be ready
    const readyText = page.locator('text=Prêt à l\'emploi').first();
    await expect(readyText).toBeVisible({ timeout: 15000 });
    
    // The download modal should disappear after finishing
    await expect(loadingModal).toBeHidden();
  });
});
