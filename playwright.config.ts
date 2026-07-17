import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 120000,
  expect: {
    timeout: 30000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  outputDir: 'data/test-results',
  reporter: [['list'], ['html', { outputFolder: 'data/playwright-report', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`,
    viewport: { width: 1280, height: 800 },
    locale: 'fr-FR',
    actionTimeout: 300000,
    navigationTimeout: 300000,
    screenshot: 'only-on-failure',
    launchOptions: {
      args: ['--host-resolver-rules=MAP chouette-gpt.localhost 127.0.0.1'],
    },
  },
  projects: [
    {
      name: 'ui-tests',
      testIgnore: ['**/webgpu-hardware.spec.ts', '**/real-wasm-inference.spec.ts'],
      use: { headless: true },
    },
    {
      name: 'webgpu-tests',
      testMatch: '**/webgpu-hardware.spec.ts',
      use: { headless: false },
    },
    {
      name: 'wasm-tests',
      testMatch: ['**/real-wasm-inference.spec.ts', '**/mocked-wasm-inference.spec.ts', '**/real-wasm-long-conversation.spec.ts'],
      use: { headless: !process.env.CI },
    }
  ],
  webServer: (process.env.BASE_URL && !process.env.BASE_URL.includes('localhost')) ? undefined : {
    command: process.env.CI ? `pnpm exec serve .output/public -l ${process.env.PORT || 3000}` : 'npm run dev',
    url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 300000,
  }
});
