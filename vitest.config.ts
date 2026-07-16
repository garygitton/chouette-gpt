import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src'),
      '#imports': path.resolve(__dirname, './tests/unit/mocks/imports.ts')
    }
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.ts']
  }
})
