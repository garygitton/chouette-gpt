import { test, expect } from '@playwright/test';

test.describe('WebGPU Onboarding', () => {
  // We use before block to mock navigator.gpu as undefined
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', err => {
      console.error(`[BROWSER UNHANDLED ERROR] ${err.stack || err.message}`);
      throw new Error(`Browser console error: ${err.message}`);
    });
    await page.addInitScript(() => {
      try {
        // Hide gpu from navigator correctly in modern Chromium
        delete (window.Navigator.prototype as any).gpu;
        // Clear localStorage so onboarding appears
        window.localStorage.clear();
      } catch (e) {
        // Ignore
      }
    });
  });

  test('should show the GPU onboarding modal if WebGPU is not supported', async ({ page }) => {
    // Navigate to the app
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for the modal title to appear via data-testid (language-agnostic)
    await expect(page.getByTestId('wizard-title')).toBeVisible({ timeout: 60000 });

    // Verify step 1 exists (about:config is Firefox-specific step text)
    await expect(page.locator('text=about:config').first()).toBeVisible();

    // Check that we can close the modal using the footer close button
    await page.getByTestId('wizard-close-btn').click();

    // Ensure the modal is hidden after closing
    await expect(page.getByTestId('wizard-title')).toBeHidden();
  });
});
