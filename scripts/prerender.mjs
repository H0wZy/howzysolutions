/**
 * Emits one real HTML document per route by rendering each page to static markup
 * and injecting it into the built shell (research D3).
 *
 * This is what makes SC-001 and the JavaScript-disabled pass of US1 achievable:
 * the prose is in the payload before React parses. It is also why no routing
 * library ships — every URL is a file.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const server = await import(pathToFileURL(join(root, 'dist-server/entry-server.js')).href)
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const ROOT_DIV = '<div id="root"></div>'
if (!shell.includes(ROOT_DIV)) {
  console.error('✗ prerender: could not find the root element in the built shell')
  process.exit(1)
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/** Replaces the shell's title/description with the ones this route declares. */
function withMeta(html, { title, description }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(description)}" />`,
    )
}

/** hreflang alternates, one per locale (T070). */
function withAlternates(html, pathname) {
  const links = server.LOCALES.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${pathname}" />`,
  ).join('\n')
  return html.replace('</head>', `${links}\n  </head>`)
}

const DEFAULT_LOCALE = 'en'
let written = 0

for (const pathname of server.routes()) {
  const markup = server.render(pathname, DEFAULT_LOCALE)
  const meta = server.metaFor(pathname, DEFAULT_LOCALE)

  let html = shell.replace(ROOT_DIV, `<div id="root">${markup}</div>`)
  html = withMeta(html, meta)
  html = withAlternates(html, pathname)

  const outDir = pathname === '/' ? dist : join(dist, pathname)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
  written++
  console.log(`  ${pathname.padEnd(34)} ${(html.length / 1024).toFixed(1)} KB`)
}

console.log(`\n✓ prerendered ${written} routes`)
