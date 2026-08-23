/**
 * Emits one real HTML document per route per locale by rendering each page to
 * static markup and injecting it into the built shell (research D3).
 *
 * This is what makes SC-001 and the JavaScript-disabled pass achievable: the
 * prose is in the payload before any script runs. It is also why no routing
 * library ships — every URL is a file, in every language.
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
  console.error('x prerender: could not find the root element in the built shell')
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

/**
 * hreflang alternates pointing at the real counterpart documents, plus the
 * document's own lang. Both only mean anything because each locale is a real
 * URL rather than a client-side toggle (FR-018).
 */
function withLangs(html, pathname, lang) {
  const links = server
    .alternates(pathname)
    .map((a) => `    <link rel="alternate" hreflang="${a.locale}" href="${a.href}" />`)
    .join('\n')
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace('</head>', `${links}\n  </head>`)
}

let written = 0

for (const { pathname } of server.routes()) {
  const meta = server.metaFor(pathname)
  let html = shell.replace(ROOT_DIV, `<div id="root">${server.render(pathname)}</div>`)
  html = withMeta(html, meta)
  html = withLangs(html, pathname, meta.lang)

  const outDir = pathname === '/' ? dist : join(dist, pathname)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
  written++
  console.log(`  ${pathname.padEnd(36)} ${(html.length / 1024).toFixed(1)} KB`)
}

console.log(`\nok prerendered ${written} documents`)
