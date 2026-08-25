/**
 * Verifies every colour token in src/styles/tokens.css meets its WCAG floor,
 * in the site's one theme (dark — research D12). Gate V-009. A test, not a
 * comment: it exits non-zero.
 *
 * Contract: specs/001-terminal-portfolio-rebrand/contracts/design-tokens.md
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Line endings are normalised because the selector match below is literal and
// this script runs on both Windows (CRLF checkouts) and Linux.
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8').split('\r\n').join('\n')

/** Text tokens must clear 4.5:1; interactive boundaries 3:1 (FR-023, WCAG 1.4.11). */
const FLOORS = {
  '--fg': 4.5,
  '--dim': 4.5,
  '--accent': 4.5,
  '--accent-2': 4.5,
  '--danger': 4.5,
  '--border': 3,
  '--bar-ink': 3,
  '--grid-0': 3,
  '--grid-1': 3,
  '--grid-2': 3,
  '--grid-3': 3,
  '--grid-4': 3,
}
/** Decorative only. Exempt by WCAG, and must never be used on a control boundary. */
const DECORATIVE = new Set(['--line', '--surface'])

function parseBlock(selector) {
  const start = css.indexOf(selector)
  if (start === -1) return null
  const open = css.indexOf('{', start)
  const close = css.indexOf('}', open)
  const body = css.slice(open + 1, close)
  const tokens = {}
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[name] = value
  }
  return tokens
}

function channel(c) {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const n = hex.slice(1)
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const themes = {
  dark: parseBlock(":root,\n:root[data-theme='dark']"),
}

let failures = 0
let checked = 0

for (const [theme, tokens] of Object.entries(themes)) {
  if (!tokens) {
    console.error(`x could not parse the ${theme} token block in tokens.css`)
    failures++
    continue
  }
  const bg = tokens['--bg']
  if (!bg) {
    console.error(`x ${theme}: --bg is not defined`)
    failures++
    continue
  }

  for (const name of [...Object.keys(FLOORS), ...DECORATIVE]) {
    if (!(name in tokens)) {
      console.error(`x ${theme}: ${name} is missing - every token needs a value`)
      failures++
    }
  }

  for (const [name, floor] of Object.entries(FLOORS)) {
    if (!(name in tokens)) continue
    const r = ratio(tokens[name], bg)
    checked++
    const pass = r >= floor
    if (!pass) failures++
    console.log(
      `${pass ? 'ok' : 'XX'} ${theme.padEnd(5)} ${name.padEnd(11)} ${tokens[name]}  ` +
        `${r.toFixed(2)}:1  (floor ${floor}:1)`,
    )
  }
}

if (failures > 0) {
  console.error(`\nx contrast check failed: ${failures} problem(s)`)
  process.exit(1)
}
console.log(`\nok contrast check passed: ${checked} token/theme pairs meet their floor`)
