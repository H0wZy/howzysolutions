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
  '--term-user': 4.5,
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

/**
 * Every block written under this selector. There are two: the palette, whose
 * values are literals, and the shadcn mapping, whose values are var()
 * references to the first (spec 003 D2). Both have to be read, because the
 * component library paints with the second set of names.
 */
function blockBodies(selector) {
  const bodies = []
  let from = 0
  for (;;) {
    const start = css.indexOf(selector, from)
    if (start === -1) break
    const open = css.indexOf('{', start)
    const close = css.indexOf('}', open)
    if (open === -1 || close === -1) break
    bodies.push(css.slice(open + 1, close))
    from = close
  }
  return bodies
}

function parseBlock(selector) {
  const bodies = blockBodies(selector)
  if (bodies.length === 0) return null
  const tokens = {}
  for (const [, name, value] of bodies[0].matchAll(
    /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g,
  )) {
    tokens[name] = value
  }
  return tokens
}

/** `--muted-foreground: var(--dim)` from any block under the selector. */
function parseReferences(selector) {
  const refs = {}
  for (const body of blockBodies(selector)) {
    for (const [, name, target] of body.matchAll(/(--[\w-]+)\s*:\s*var\(\s*(--[\w-]+)\s*\)\s*;/g)) {
      refs[name] = target
    }
  }
  return refs
}

/**
 * Follows a name to the literal it eventually paints with. Bounded, because a
 * mapping that points at itself is a mistake and should say so rather than
 * hang the build.
 */
function resolve(name, tokens, refs, depth = 0) {
  if (name in tokens) return tokens[name]
  if (depth > 4 || !(name in refs)) return null
  return resolve(refs[name], tokens, refs, depth + 1)
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

/*
 * The shadcn mapping (spec 003 FR-049, SC-003, D2).
 *
 * Without this half the gate reports on colours nobody renders: a component
 * library paints with `--muted-foreground` and `--border`, and until now this
 * script had never heard of either. Each row names the ground the colour is
 * actually read against, because "foreground on --bg" is the wrong question for
 * a token that only ever sits on a card.
 */
const MAPPED = [
  { name: '--foreground', ground: '--background', floor: 4.5 },
  { name: '--muted-foreground', ground: '--background', floor: 4.5 },
  { name: '--card-foreground', ground: '--card', floor: 4.5 },
  { name: '--popover-foreground', ground: '--popover', floor: 4.5 },
  { name: '--secondary-foreground', ground: '--secondary', floor: 4.5 },
  { name: '--primary', ground: '--background', floor: 4.5 },
  { name: '--primary-foreground', ground: '--primary', floor: 4.5 },
  { name: '--accent-foreground', ground: '--accent', floor: 4.5 },
  { name: '--destructive', ground: '--background', floor: 4.5 },
  { name: '--destructive-foreground', ground: '--destructive', floor: 4.5 },
  { name: '--border', ground: '--background', floor: 3 },
  { name: '--input', ground: '--background', floor: 3 },
  { name: '--ring', ground: '--background', floor: 3 },
]

const refs = parseReferences(":root,\n:root[data-theme='dark']")
const palette = themes.dark

if (palette) {
  console.log('')
  for (const { name, ground, floor } of MAPPED) {
    const fg = resolve(name, palette, refs)
    const bgHex = resolve(ground, palette, refs)

    if (!fg || !bgHex) {
      console.error(
        `x shadcn ${name} does not resolve to a colour in tokens.css — the mapping is` +
          ' incomplete, or it declares a literal instead of a var() (Principle VI)',
      )
      failures++
      continue
    }

    const r = ratio(fg, bgHex)
    checked++
    const pass = r >= floor
    if (!pass) failures++
    console.log(
      `${pass ? 'ok' : 'XX'} map   ${name.padEnd(24)} ${fg} on ${bgHex}  ` +
        `${r.toFixed(2)}:1  (floor ${floor}:1)`,
    )
  }

  /*
   * A mapped name that resolves to a literal rather than to a palette token is
   * the two-palette failure SC-003 exists to prevent, so it is checked rather
   * than trusted.
   */
  for (const { name } of MAPPED) {
    // --border is this palette's own token and shadcn happens to want the same
    // name for the same thing, so it is a literal here by right, not by slip.
    if (name in FLOORS || DECORATIVE.has(name)) continue
    if (name in palette && !(name in refs)) {
      console.error(`x shadcn ${name} is declared as a literal colour, not a reference`)
      failures++
    }
  }
}

if (failures > 0) {
  console.error(`\nx contrast check failed: ${failures} problem(s)`)
  process.exit(1)
}
console.log(`\nok contrast check passed: ${checked} token/theme pairs meet their floor`)
