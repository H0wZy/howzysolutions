/*
 * Writes the date this build ran, so that a value derived from "now" is
 * derived ONCE and both bundles carry the same answer.
 *
 * Why this exists: the site hydrates now. src/pages/Home.tsx renders a
 * duration computed from profile.experienceStart, and the prerender pass and
 * the visitor's browser are different instants — separated by however long the
 * deploy sits. The moment those two straddle a month boundary, the server says
 * "3y 6mo", the client says "3y 7mo", and React reports a hydration mismatch
 * on a number nobody edited (spec 003 research D3, hazard 1).
 *
 * Baking the date into a committed artifact makes both builds read one value,
 * so they cannot disagree no matter when the page is opened. FR-007 asked for
 * the figure to be derived on every build rather than hand-maintained; this
 * keeps that and drops only the part that was never wanted, which is deriving
 * it twice.
 *
 * Same contract as fetch-wakatime.mjs and fetch-github.mjs: generated, typed,
 * committed, consumed as ordinary content.
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'src', 'content', 'build.generated.json')

// Date, not timestamp: the duration this feeds is whole years and months, so a
// finer stamp would only churn the diff on every build without changing a
// rendered character.
const builtOn = new Date().toISOString().slice(0, 10)

let previous = null
try {
  previous = JSON.parse(readFileSync(target, 'utf8')).builtOn
} catch {
  /* First run, or the artifact was removed. Either way it is about to exist. */
}

if (previous === builtOn) {
  console.log(`ok build stamp unchanged (${builtOn})`)
} else {
  writeFileSync(target, `${JSON.stringify({ builtOn }, null, 2)}\n`)
  console.log(`ok build stamp ${previous ?? '(none)'} -> ${builtOn}`)
}
