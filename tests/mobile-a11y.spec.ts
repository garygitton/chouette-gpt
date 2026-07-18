import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Mobile Accessibility and Responsiveness', () => {
  // Use a mobile viewport (e.g. iPhone 13 Pro)
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test('should pass axe-core accessibility checks on mobile layout', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/?mock=true&autoDownload=false');

    // Wait for the main UI elements to be visible
    await expect(page.getByTestId('chat-textarea')).toBeVisible({ timeout: 120000 });

    // The chat input area should fit in the viewport
    const boundingBox = await page.getByTestId('chat-textarea').boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(390);

    // Check accessibility of the default landing state
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .disableRules(['landmark-one-main', 'region'])
      .analyze();

    // Assert that there are no critical accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);

    // Open the left sidebar via the mobile menu button
    await page.getByLabel('Ouvrir le menu principal').click();
    
    // Check accessibility with sidebar open
    const sidebarA11yResults = await new AxeBuilder({ page }).analyze();
    expect(sidebarA11yResults.violations).toEqual([]);
  });
});
