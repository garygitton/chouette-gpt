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
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000/',
    viewport: { width: 1280, height: 800 },
    headless: true,
    locale: 'fr-FR',
    actionTimeout: 300000,
    navigationTimeout: 300000,
    screenshot: 'only-on-failure',
    launchOptions: {
      args: [
        '--host-resolver-rules=MAP chouette-gpt.localhost 127.0.0.1'
      ]
    }
  },
  webServer: {
    command: 'VITE_DEVTOOLS_DISABLE_CLIENT_AUTH=true PORT=3000 npm run dev',
    url: 'http://127.0.0.1:3000/',
    timeout: 300 * 1000,
    reuseExistingServer: !process.env.CI,
  }
});
