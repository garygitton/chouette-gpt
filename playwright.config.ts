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
    baseURL: 'http://localhost:3000/',
    viewport: { width: 1280, height: 800 },
    headless: true,
    locale: 'fr-FR',
    actionTimeout: 300000,
    navigationTimeout: 300000,
    screenshot: 'only-on-failure',
  }
});
