import { defineConfig } from 'vitest/config'

// Reuses the project's Vite resolution; no separate build pipeline (research D4).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
})
