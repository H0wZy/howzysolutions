/**
 * The parity gate of spec 006 (User Story 1, SC-001): the same site, served by
 * Next.js. It reads every URL of a baseline build's sitemap, takes the baseline
 * document from a directory (the Vite build's dist/, one <path>/index.html per
 * URL) and the Next one from a running server, and compares what a visitor
 * sees: the <html lang>, the <title> and the visible text of <body> after
 * whitespace normalisation. Zero differences is a pass; anything else prints
 * the first difference of each failing pair and exits 1.
 *
 *   node scripts/parity-diff.mjs --baseline <dir> --origin http://localhost:3000
 *        [--exclude /,/pt/] [--no-script-text]
 *
 * Visible text means what is left when <script>, <style>, comments and tags are
 * gone and entities are decoded, so a script-free reader sees the same words.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, all) => (a.startsWith('--') ? [[a.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1]]] : [])),
)
const baseline = args.baseline
const origin = (args.origin ?? '').replace(/\/$/, '')
const exclude = new Set(String(args.exclude ?? '').split(',').filter(Boolean))
if (!baseline || !origin) {
  console.error('usage: node scripts/parity-diff.mjs --baseline <dir> --origin <url> [--exclude /,/pt/]')
  process.exit(2)
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)

/** Lang, title and the visible text of one document. */
export function facts(html) {
  const lang = html.match(/<html[^>]*\blang="([^"]*)"/i)?.[1] ?? ''
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim()
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? ''
  const text = decode(
    body
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
  return { lang, title, text }
}

const sitemap = readFileSync(join(baseline, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>https:\/\/howzysolutions\.com([^<]*)<\/loc>/g)].map((m) => m[1])

let failures = 0
let compared = 0
for (const path of urls) {
  if (exclude.has(path)) {
    console.log(`-- ${path.padEnd(36)} excluded`)
    continue
  }
  const file = join(baseline, path, 'index.html')
  if (!existsSync(file)) {
    console.log(`XX ${path.padEnd(36)} missing from the baseline`)
    failures++
    continue
  }
  const res = await fetch(origin + path, { redirect: 'manual' })
  if (res.status !== 200) {
    console.log(`XX ${path.padEnd(36)} answered ${res.status}`)
    failures++
    continue
  }
  const a = facts(readFileSync(file, 'utf8'))
  const b = facts(await res.text())
  compared++
  const problems = []
  if (a.lang !== b.lang) problems.push(`lang ${a.lang} != ${b.lang}`)
  if (a.title !== b.title) problems.push(`title "${a.title}" != "${b.title}"`)
  if (a.text !== b.text) {
    let i = 0
    while (i < a.text.length && a.text[i] === b.text[i]) i++
    problems.push(`text differs at ${i}: "${a.text.slice(Math.max(0, i - 30), i + 50)}" != "${b.text.slice(Math.max(0, i - 30), i + 50)}"`)
  }
  if (problems.length) {
    failures++
    console.log(`XX ${path.padEnd(36)} ${problems.join(' | ')}`)
  } else {
    console.log(`ok ${path.padEnd(36)} ${a.text.length} chars`)
  }
}

console.log(`\n${failures === 0 ? 'ok' : 'x'} parity: ${compared} documents compared, ${failures} differ (${urls.length} in the baseline sitemap, ${exclude.size} excluded)`)
process.exit(failures === 0 ? 0 : 1)
