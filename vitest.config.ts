import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Reuses the project's Vite resolution; no separate build pipeline (research D4).
export default defineConfig({
  // Declared here as well as in vite.config.ts, because this config does not
  // extend that one. Without it, any test that reaches a shadcn-generated
  // component fails on `@/lib/utils` — which is a resolution error dressed up
  // as a missing file, and takes a minute to recognise as neither.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
})
