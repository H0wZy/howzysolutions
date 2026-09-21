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
import { writeAllMarkdown } from './generate-mcp-markdown.mjs'

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

const ORIGIN = 'https://howzysolutions.com'

/** Replaces the shell's title/description and adds the route's sharing card. */
function withMeta(html, { title, description, image, imageAlt }) {
  const social = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Howzy Solutions" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:image" content="${ORIGIN}${escapeAttr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${ORIGIN}${escapeAttr(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}" />`,
  ].join('\n    ')

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(description)}" />`,
    )
    .replace('</head>', `    ${social}\n  </head>`)
}

/**
 * hreflang alternates pointing at the real counterpart documents, plus the
 * document's own lang and canonical URL. Both only mean anything because each
 * locale is a real URL rather than a client-side toggle (FR-018).
 * Absolute URLs are required by the hreflang and canonical specifications.
 */
function withLangs(html, pathname, lang) {
  const canonical = `    <link rel="canonical" href="${ORIGIN}${pathname}" />`
  const links = server
    .alternates(pathname)
    .map((a) => `    <link rel="alternate" hreflang="${a.locale}" href="${ORIGIN}${a.href}" />`)
    .join('\n')
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace('</head>', `${canonical}\n${links}\n  </head>`)
}

/**
 * Injects Schema.org JSON-LD structured data defining the Person and WebSite
 * entities so search engines explicitly recognize "howzysolutions" and Marcos "H0wZy" Junior.
 */
function withStructuredData(html, locale) {
  const isEn = locale === 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${ORIGIN}/#person`,
        name: 'Marcos "H0wZy" Junior',
        alternateName: ['H0wZy', 'Howzy', 'Marcos Junior'],
        url: ORIGIN,
        jobTitle: 'Full-stack Software Engineer',
        sameAs: ['https://github.com/H0wZy', 'https://linktr.ee/howzy'],
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: ORIGIN,
        name: 'Howzy Solutions',
        alternateName: ['howzysolutions', 'HowzySolutions', 'howzysolutions.com'],
        description: isEn
          ? 'Personal portfolio of Marcos "H0wZy" Junior, full-stack developer.'
          : 'Portfólio pessoal de Marcos "H0wZy" Junior, desenvolvedor full-stack.',
        publisher: { '@id': `${ORIGIN}/#person` },
        inLanguage: ['en', 'pt-BR'],
      },
    ],
  }
  const scriptTag = `    <script type="application/ld+json">${JSON.stringify(schema)}</script>`
  return html.replace('</head>', `${scriptTag}\n  </head>`)
}

/**
 * The Latin subset covers every character both locales actually render (it
 * includes the Latin-1 Supplement, so Portuguese diacritics are in range).
 * Without a preload, this file is only discovered once the browser has
 * parsed the stylesheet and reached its @font-face, so text first paints in
 * the fallback face and reflows into JetBrains Mono once the download
 * lands — a measured CLS regression (T065). The filename is content-hashed
 * by Vite, so it is read out of the shell's own built CSS rather than
 * hardcoded.
 */
function findLatinFontHref() {
  const cssHref = shell.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"/)?.[1]
  const css = cssHref ? readFileSync(join(dist, cssHref), 'utf8') : ''
  return css.match(/url\((\/assets\/jetbrains-mono-latin-wght-normal-[^)]+\.woff2)\)/)?.[1]
}

const fontHref = findLatinFontHref()
if (!fontHref) {
  console.warn('! prerender: could not locate the Latin JetBrains Mono file to preload')
}

function withFontPreload(html) {
  if (!fontHref) return html
  const link = `    <link rel="preload" as="font" type="font/woff2" href="${fontHref}" crossorigin />`
  return html.replace('</head>', `${link}\n  </head>`)
}

function generateSitemap(routes) {
  const urls = routes.map(({ pathname }) => {
    const alts = server
      .alternates(pathname)
      .map(
        (a) =>
          `    <xhtml:link rel="alternate" hreflang="${a.locale}" href="${ORIGIN}${a.href}" />`,
      )
      .join('\n')
    const priority =
      pathname === '/' || pathname === '/pt/'
        ? '1.0'
        : pathname.startsWith('/works/') || pathname.startsWith('/pt/works/')
          ? '0.8'
          : '0.6'
    return `  <url>
    <loc>${ORIGIN}${pathname}</loc>
${alts}
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
}

let written = 0
const allRoutes = server.routes()

for (const { pathname, locale } of allRoutes) {
  const meta = server.metaFor(pathname)
  let html = shell.replace(ROOT_DIV, `<div id="root">${server.render(pathname)}</div>`)
  html = withMeta(html, meta)
  html = withLangs(html, pathname, meta.lang)
  html = withStructuredData(html, locale)
  html = withFontPreload(html)

  const outDir = pathname === '/' ? dist : join(dist, pathname)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
  written++
  console.log(`  ${pathname.padEnd(36)} ${(html.length / 1024).toFixed(1)} KB`)
}

const sitemap = generateSitemap(allRoutes)
writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(join(root, 'public', 'sitemap.xml'), sitemap, 'utf8')
console.log('ok emitted sitemap.xml for 26 routes')

writeAllMarkdown()

console.log(`\nok prerendered ${written} documents`)
