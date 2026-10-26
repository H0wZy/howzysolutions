// Parity gate (SC-001, contracts/routes.md section 5, task T014).
//
//   node scripts/parity-diff.mjs --a <vite base url> --b <next base url> [--allow scripts/parity-allow.json]
//
// Reads the 40 URLs from <a>/sitemap.xml, requests each from both sites without
// following redirects and without executing scripts, and compares: status, <html lang>,
// <title>, visible text, canonical, hreflang alternates and description. Then
// sitemap.xml and robots.txt byte for byte. Exit 1 on any difference that is not listed
// in parity-allow.json, printing the URL and the first 80 differing characters per side.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', middot: '·' }

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e) => {
    if (e[0] === '#') {
      const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(cp) && cp <= 0x10ffff ? String.fromCodePoint(cp) : m
    }
    return Object.hasOwn(NAMED_ENTITIES, e) ? NAMED_ENTITIES[e] : m
  })
}

function attr(tag, name) {
  const m = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag)
  return m ? decodeEntities(m[1] ?? m[2] ?? m[3] ?? '') : null
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? []
}

function squash(s) {
  return s.replace(/\s+/g, ' ').trim()
}

/**
 * Visible text of the body: script, style, template and noscript removed, comments
 * dropped, tags stripped, entities decoded, whitespace collapsed. The head is left out
 * because title, canonical, hreflang and description are compared as their own fields.
 */
export function visibleText(html) {
  const body = /<body\b[^>]*>([\s\S]*?)(?:<\/body>|$)/i.exec(html)
  let h = body ? body[1] : html
  h = h.replace(/<!--[\s\S]*?-->/g, '')
  for (const t of ['script', 'style', 'template', 'noscript']) {
    h = h.replace(new RegExp(`<${t}\\b[\\s\\S]*?</${t}\\s*>`, 'gi'), ' ')
  }
  h = h.replace(/<[^>]*>/g, ' ')
  return squash(decodeEntities(h))
}

/** The fields the gate compares, taken from one HTML response. */
export function normalise(html) {
  const htmlTag = tags(html, 'html')[0] ?? ''
  const title = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(html)
  const links = tags(html, 'link')
  const canonical = links.find((l) => attr(l, 'rel')?.toLowerCase() === 'canonical')
  const alternates = links
    .filter((l) => attr(l, 'rel')?.toLowerCase() === 'alternate' && attr(l, 'hreflang') !== null)
    .map((l) => `${attr(l, 'hreflang')} ${attr(l, 'href')}`)
    .sort()
  const description = tags(html, 'meta').find((m) => attr(m, 'name')?.toLowerCase() === 'description')
  return {
    lang: attr(htmlTag, 'lang'),
    title: title ? squash(decodeEntities(title[1])) : null,
    text: visibleText(html),
    canonical: canonical ? attr(canonical, 'href') : null,
    hreflang: alternates.join('\n'),
    description: description ? attr(description, 'content') : null,
  }
}

/** Differences between two responses: [{ field, a, b }]. */
export function diffPages(a, b) {
  const out = []
  if (a.status !== b.status) out.push({ field: 'status', a: String(a.status), b: String(b.status) })
  const na = normalise(a.html ?? '')
  const nb = normalise(b.html ?? '')
  for (const field of ['lang', 'title', 'text', 'canonical', 'hreflang', 'description']) {
    if (na[field] !== nb[field]) out.push({ field, a: String(na[field]), b: String(nb[field]) })
  }
  return out
}

/** Index of the first character at which two strings differ (the shorter length if one is a prefix). */
export function firstDiff(a, b) {
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i
  return n
}

/** Per difference: URL, field, and the 80 characters from the first mismatch on each side. */
export function formatDiff(url, d) {
  const i = firstDiff(d.a, d.b)
  const cut = (s) => JSON.stringify(s.slice(i, i + 80))
  return `${url} [${d.field}] at ${i}\n  a: ${cut(d.a)}\n  b: ${cut(d.b)}`
}

/** Drops differences listed in the allow file; every entry needs a reason. */
export function applyAllow(url, diffs, allow) {
  for (const e of allow) {
    if (!e.reason || !e.reason.trim()) throw new Error(`parity-allow entry without a reason: ${JSON.stringify(e)}`)
  }
  return diffs.filter((d) => !allow.some((e) => (e.url === '*' || e.url === url) && e.field === d.field))
}

export function sitemapPaths(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(decodeEntities(m[1])).pathname)
}

async function get(base, path) {
  try {
    const res = await fetch(new URL(path, base), { redirect: 'manual' })
    return { status: res.status, html: await res.text() }
  } catch (e) {
    return { status: `fetch failed: ${e.cause?.code ?? e.message}`, html: '' }
  }
}

function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : undefined
}

async function main() {
  const a = arg('a')
  const b = arg('b')
  if (!a || !b) {
    console.error('usage: node scripts/parity-diff.mjs --a <vite base url> --b <next base url> [--allow file]')
    process.exit(2)
  }
  const here = dirname(fileURLToPath(import.meta.url))
  const allow = JSON.parse(readFileSync(arg('allow') ?? join(here, 'parity-allow.json'), 'utf8')).allow ?? []

  const sitemapA = await get(a, '/sitemap.xml')
  if (sitemapA.status !== 200) {
    console.error(`cannot read ${a}/sitemap.xml: status ${sitemapA.status}`)
    process.exitCode = 2
    return
  }
  const paths = sitemapPaths(sitemapA.html)
  const failures = []
  for (const path of paths) {
    const [pa, pb] = await Promise.all([get(a, path), get(b, path)])
    let diffs = diffPages(pa, pb)
    if (pa.status !== 200) diffs.push({ field: 'status', a: String(pa.status), b: String(pb.status) })
    diffs = applyAllow(path, diffs, allow)
    for (const d of diffs) failures.push(formatDiff(path, d))
  }
  for (const path of ['/sitemap.xml', '/robots.txt']) {
    const [pa, pb] = await Promise.all([get(a, path), get(b, path)])
    const same = pa.html === pb.html && pa.status === pb.status
    const diffs = applyAllow(path, same ? [] : [{ field: 'bytes', a: `${pa.status} ${pa.html}`, b: `${pb.status} ${pb.html}` }], allow)
    for (const d of diffs) failures.push(formatDiff(path, d))
  }
  if (failures.length) {
    console.error(failures.join('\n'))
    console.error(`parity: ${failures.length} difference(s) over ${paths.length} URLs plus sitemap.xml and robots.txt`)
    // exitCode, not exit(): exiting with fetch sockets open trips a libuv assertion on Windows.
    process.exitCode = 1
    return
  }
  console.log(`parity: ${paths.length} URLs plus sitemap.xml and robots.txt identical`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
