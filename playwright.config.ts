import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: '**/webgpu-hardware.spec.ts',
  timeout: 120000,
  expect: {
    timeout: 30000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
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
    command: process.env.CI ? 'npm run build && node .output/server/index.mjs' : 'npm run dev',
    url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 300000,
  }
});
