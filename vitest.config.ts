import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import dotenv from 'dotenv'

// Load .env file for integration tests
dotenv.config()

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
