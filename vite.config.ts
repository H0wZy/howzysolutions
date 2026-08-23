import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev only. The shipped HTML is prerendered at build time (scripts/prerender.mjs),
 * and main.ts never hydrates — so without this the dev server serves an empty
 * #root, i.e. a black page. Same render path as the build, one route at a time.
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
          `<div id="root">${entry.render(pathname, 'en')}</div>`,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devPrerender()],
})
