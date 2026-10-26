import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

const at = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Same aliases as tsconfig.json (plan D3). Vitest does not read tsconfig paths.
export default defineConfig({
  resolve: {
    alias: {
      '@content': at('../src/content'),
      '@legacy': at('../src'),
      '@': at('./src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
})
