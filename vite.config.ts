import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Dev only. The shipped HTML is prerendered at build time (scripts/prerender.mjs).
 * The client now hydrates that markup rather than replacing it, so the dev server
 * still has to serve a rendered #root or hydration would have nothing to attach
 * to. Same render path as the build, one route at a time.
 */
function devPrerender(): Plugin {
  return {
    name: 'dev-prerender',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        if (!ctx.server) return html
        const entry = await ctx.server.ssrLoadModule('/src/entry-server.tsx')
        const pathname = (ctx.originalUrl ?? ctx.path).split('?')[0]
        return html.replace(
          '<div id="root"></div>',
          `<div id="root">${entry.render(pathname)}</div>`,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devPrerender()],
  resolve: {
    // Declared here and in both tsconfigs. The root tsconfig is a solution file,
    // so a tool that reads it for aliases finds nothing — research D15.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
