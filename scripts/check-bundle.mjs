/*
 * The JavaScript budget as a gate, not a note (spec 003 FR-050).
 *
 * The constitution's Performance budgets section caps initial JavaScript at
 * 120 KB gzipped. That number held for two years by being measured once, in
 * spec 001, and then never again — which was safe only while the client
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

/** Gzipped kilobytes of initial JavaScript. Constitution 2.1.0. */
const BUDGET_KB = 120

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
