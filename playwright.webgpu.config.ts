import { defineConfig } from '@playwright/test';
import defaultConfig from './playwright.config';

export default defineConfig({
  ...defaultConfig,
  testMatch: '**/webgpu-hardware.spec.ts',
  webServer: undefined,
  use: {
    ...defaultConfig.use,
    baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`,
    headless: false, // Force headed mode to support WebGPU natively on desktop
    launchOptions: {
      args: [
        '--enable-unsafe-webgpu',
        '--enable-features=Vulkan',
        '--use-angle=vulkan'
      ]
    }
  }
});
