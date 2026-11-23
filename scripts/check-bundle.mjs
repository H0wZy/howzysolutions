/*
 * What a visitor downloads, measured and guarded (spec 006 SC-004, SC-005).
 *
 * There is no JavaScript ceiling since constitution 3.0.0 (2026-10-26), so this
 * does not fail on size: it prints the initial JavaScript of the heaviest and the
 * lightest document, gzipped, so the figure is read at every build and recorded in
 * the spec that changes it. (The Vite build measured 8.28 KB for a static
 * document and 120.47 KB for a hydrating one.)
 *
 * It does fail on two things:
 *   1. a secret in anything the browser can fetch (SC-005): a Worker secret's
 *      name, or the shape of a Resend key, anywhere under dist/client;
 *   2. a build with no JavaScript at all, which is a broken build, not a small one.
 *
 * Runs after `npm run build` and inside `npm test` when dist/client exists.
 * vinext writes each prerendered document to dist/client/_vinext/static-cache.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const client = join(root, 'dist', 'client')
const cache = join(client, '_vinext', 'static-cache')

if (!existsSync(cache)) {
  console.error('x bundle: dist/client/_vinext/static-cache not found, run the build before the gate')
  process.exit(1)
}

const gzip = (file) => gzipSync(readFileSync(file), { level: 9 }).length
const kb = (bytes) => (bytes / 1024).toFixed(2)

// Initial JavaScript of a document: the scripts its HTML loads (async or preloaded), each once.
const documents = readdirSync(cache)
  .filter((name) => name.endsWith('.html'))
  .map((name) => {
    const html = readFileSync(join(cache, name), 'utf8')
    const title = (html.match(/<title>([^<]*)/)?.[1] ?? name).replace(/&quot;/g, '"')
    const scripts = [...new Set([...html.matchAll(/\bsrc="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]))]
    return { title, scripts, gzip: scripts.reduce((sum, s) => sum + gzip(join(client, s)), 0) }
  })
  .sort((a, b) => a.gzip - b.gzip)

if (documents.length === 0 || documents.every((d) => d.scripts.length === 0)) {
  console.error('x bundle: no document loads any JavaScript, that is a broken build')
  process.exit(1)
}

const chunkDir = join(client, '_next', 'static', 'chunks')
const chunks = readdirSync(chunkDir).filter((n) => n.endsWith('.js'))
const everything = chunks.reduce((sum, n) => sum + gzip(join(chunkDir, n)), 0)
const lightest = documents[0]
const heaviest = documents.at(-1)
console.log(`  documents                      ${documents.length}`)
console.log(`  lightest   gzip ${kb(lightest.gzip).padStart(8)} KB  ${lightest.scripts.length} scripts  ${lightest.title}`)
console.log(`  heaviest   gzip ${kb(heaviest.gzip).padStart(8)} KB  ${heaviest.scripts.length} scripts  ${heaviest.title}`)
console.log(`  all ${chunks.length} chunks   gzip ${kb(everything).padStart(8)} KB  (lazy enhancement chunks included)`)

// SC-005: no secret in anything the browser can fetch.
const SECRET_NAMES = ['RESEND_API_KEY', 'TURNSTILE_SECRET', 'CONTACT_TO', 'WAKATIME_API_KEY', 'GITHUB_TOKEN']
const SECRET_SHAPES = [/\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}\b/, /\bgh[pousr]_[A-Za-z0-9]{30,}\b/]
const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
let leaks = 0
for (const file of walk(client).filter((f) => /\.(js|html|css|json|txt|md|xml|rsc|webmanifest)$/.test(f))) {
  const text = readFileSync(file, 'utf8')
  for (const name of SECRET_NAMES) {
    if (text.includes(name)) {
      console.error(`x bundle: "${name}" is in ${file.slice(root.length + 1)}`)
      leaks++
    }
  }
  for (const shape of SECRET_SHAPES) {
    if (shape.test(text)) {
      console.error(`x bundle: ${shape} matches in ${file.slice(root.length + 1)}`)
      leaks++
    }
  }
}
if (leaks) process.exit(1)

console.log(`ok bundle: no credential name or shape in dist/client (${walk(client).length} files scanned)`)
