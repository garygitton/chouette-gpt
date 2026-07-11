import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 30000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  outputDir: 'data/test-results',
  reporter: [['list'], ['html', { outputFolder: 'data/playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`,
    viewport: { width: 1280, height: 800 },
    headless: false,
    locale: 'fr-FR',
    actionTimeout: 300000,
    navigationTimeout: 300000,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: process.env.PORT ? `PORT=${process.env.PORT} npm run dev` : 'npm run dev',
    url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  }
});
