import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    globals: true,
    hookTimeout: 120000,
    testTimeout: 30000,
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/scripts/**']
    }
  }
})
