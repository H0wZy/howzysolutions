/*
 * The JavaScript budget as a gate, not a note (spec 003 FR-050).
 *
 * The constitution's Performance budgets section caps initial JavaScript at
 * 125 KB gzipped (120 KB until 2026-09-29, constitution 2.2.0). The original
 * number held for two years by being measured once, in spec 001, and then
 * never again — which was safe only while the client
 * shipped no framework. It ships one now: measured 2026-08-27, the hydrated
 * site sits at 104.76 KB, leaving about 15 KB. That is roughly two more
 * components, so the next careless import is the one that matters and a human
 * remembering to re-measure is not a control.
 *
 * Runs at the end of `npm run build` and inside `npm test`. Exits non-zero.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/** Gzipped kilobytes of initial JavaScript. Constitution 2.2.0. */
const BUDGET_KB = 125

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assets = join(root, 'dist', 'assets')

if (!existsSync(assets)) {
  console.error('x bundle: dist/assets not found — run the build before the gate')
  process.exit(1)
}

const files = readdirSync(assets)
  .filter((name) => name.endsWith('.js'))
  .map((name) => {
    const bytes = readFileSync(join(assets, name))
    return { name, raw: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length }
  })
  .sort((a, b) => b.gzip - a.gzip)

if (files.length === 0) {
  console.error('x bundle: no JavaScript emitted — that is not a pass, it is a broken build')
  process.exit(1)
}

/*
 * Everything in dist/assets counts. This site has no lazily imported chunk to
 * exclude: the WebGL renderer the budget's exclusion clause was written for was
 * withdrawn in spec 001 (CL-002). If one returns, this is the line that has to
 * learn the difference, and it should fail loudly until it does rather than
 * quietly stop counting something.
 */
const totalGzip = files.reduce((sum, f) => sum + f.gzip, 0)
const kb = totalGzip / 1024
const headroom = BUDGET_KB - kb

for (const f of files) {
  console.log(
    `  ${f.name.padEnd(30)} raw ${(f.raw / 1024).toFixed(2)} KB   gzip ${(f.gzip / 1024).toFixed(2)} KB`,
  )
}

/*
 * The static documents stay out of the client bundle (spec 004, and the legal
 * pages before it). static-documents.test.ts checks that App does not import
 * them; this checks the built artifact, which is what a visitor downloads: a
 * sentence only the legal records and the /vvv/ record contain must not be in
 * any script. Each sentinel must also be in the page it came from, or it has
 * gone stale and would pass forever without testing anything.
 */
const STATIC_ONLY = [
  { text: '13.709/2018', page: 'privacy-policy/index.html' },
  { text: 'Original out.', page: 'vvv/index.html' },
  { text: 'Your live,', page: 'vvv/live/index.html' },
]
const scripts = files.map((f) => readFileSync(join(assets, f.name), 'utf8')).join('\n')
for (const { text, page } of STATIC_ONLY) {
  const html = existsSync(join(root, 'dist', page)) ? readFileSync(join(root, 'dist', page), 'utf8') : ''
  if (!html.includes(text)) {
    console.error(`x bundle: sentinel "${text}" is not in dist/${page}, so it no longer guards anything`)
    process.exit(1)
  }
  if (scripts.includes(text)) {
    console.error(`x bundle: "${text}" from dist/${page} is in the client bundle; a static document leaked in`)
    process.exit(1)
  }
}

/*
 * The split is only worth what it saves the static documents. Their entry is
 * the enhancements and nothing else, so if it grows past this, React or a page
 * has been imported into it and every legal page pays for the app again.
 * Likewise the app pages must preload the app chunk, or hydration waits a round
 * trip behind the entry.
 */
const STATIC_ENTRY_MAX_KB = 20
{
  const page = readFileSync(join(root, 'dist', 'vvv', 'index.html'), 'utf8')
  const src = page.match(/<script type="module"[^>]*src="\/assets\/([^"]+\.js)"/)?.[1]
  const entry = files.find((f) => f.name === src)
  if (!entry) {
    console.error('x bundle: could not find the entry script /vvv/ loads')
    process.exit(1)
  }
  const entryKb = entry.gzip / 1024
  console.log(`  static document entry          gzip ${entryKb.toFixed(2)} KB (max ${STATIC_ENTRY_MAX_KB} KB)`)
  if (entryKb > STATIC_ENTRY_MAX_KB) {
    console.error(`x bundle: the static entry is ${entryKb.toFixed(2)} KB gzipped, over ${STATIC_ENTRY_MAX_KB} KB`)
    process.exit(1)
  }
  const home = readFileSync(join(root, 'dist', 'index.html'), 'utf8')
  if (!/rel="modulepreload"[^>]*hydrate-/.test(home)) {
    console.error('x bundle: the home page does not preload the app chunk')
    process.exit(1)
  }
}

if (kb > BUDGET_KB) {
  console.error(
    `x bundle: ${kb.toFixed(2)} KB gzipped over a ${BUDGET_KB} KB budget by ${(-headroom).toFixed(2)} KB`,
  )
  console.error(
    '  Rework the change, or amend the budget in .specify/memory/constitution.md with this',
  )
  console.error('  measurement in the amendment. Never exceed it silently.')
  process.exit(1)
}

console.log(
  `ok bundle ${kb.toFixed(2)} KB gzipped of ${BUDGET_KB} KB (${headroom.toFixed(2)} KB headroom)`,
)
