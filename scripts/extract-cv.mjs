/*
 * Generates src/content/cv.generated.json from the CV repository's LaTeX source.
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-artifact.md
 *
 * CL-004 chose to derive this site's CV facts from H0wZy/curriculum-vitae
 * rather than transcribe them, so that a fact is written in exactly one place.
 * The cost of that choice is this file: a LaTeX parser is fragile against edits
 * to the document it reads.
 *
 * FR-079 is what makes the fragility safe, and it is the whole design:
 *
 *   ABSENCE DEGRADES.  No checkout, no main.tex, nothing readable -> warn,
 *   keep the committed artifact, exit 0. This is the ORDINARY case: the Vercel
 *   builder has no CV checkout, so every production build takes this path and
 *   renders the committed copy.
 *
 *   CORRUPTION FAILS.  Source present but a construct will not parse, a
 *   section is missing, a date is malformed, a telephone number reached the
 *   record -> name the construct and its line, leave the artifact untouched,
 *   exit 1.
 *
 * Collapsing those two into "always warn" would reproduce, through the back
 * door, the silent divergence that choosing a parser was meant to prevent.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'src', 'content', 'cv.generated.json')
const publicCv = join(root, 'public', 'cv')

const sourceDir = process.env.CV_SOURCE_DIR ?? join(root, '..', 'curriculum-vitae')
const texPath = join(sourceDir, 'overleaf', 'main.tex')
const sourceRef = join(sourceDir, 'overleaf', 'main.tex')

/* ------------------------------------------------------------------ exits */

class ParseError extends Error {}

/** Corruption. Names the construct and its line, leaves the artifact alone. */
function fail(message) {
  throw new ParseError(message)
}

/** Absence. Keeps the committed artifact, flips isFallback, exits 0. */
function degrade(message) {
  console.log(`! cv: ${message}`)
  if (existsSync(target)) {
    const kept = JSON.parse(readFileSync(target, 'utf8'))
    if (kept.isFallback !== true) {
      kept.isFallback = true
      writeFileSync(target, `${JSON.stringify(kept, null, 2)}\n`)
    }
    console.log('ok cv: committed artifact kept, every measured fact byte-identical')
  } else {
    console.log('! cv: no committed artifact - writing an empty fallback')
    writeFileSync(
      target,
      `${JSON.stringify(
        {
          capturedAt: '1970-01-01T00:00:00.000Z',
          sourceCommit: 'unknown',
          sourceRef,
          isFallback: true,
          headline: { en: '', pt: '' },
          summary: { en: '', pt: '' },
          documents: [],
          sections: [],
        },
        null,
        2,
      )}\n`,
    )
  }
  process.exit(0)
}

/* ------------------------------------------------------------------ lexing */

/**
 * Removes LaTeX comments while preserving every index, so that a line number
 * computed later still points at the line the author would look at. An escaped
 * `\%` is a percent sign in the document and is left alone.
 */
function stripComments(tex) {
  const out = tex.split('')
  for (let i = 0; i < out.length; i++) {
    if (out[i] !== '%') continue
    let backslashes = 0
    for (let k = i - 1; k >= 0 && out[k] === '\\'; k--) backslashes++
    if (backslashes % 2 === 1) continue // escaped \%
    while (i < out.length && out[i] !== '\n') out[i++] = ' '
  }
  return out.join('')
}

function lineCounter(tex) {
  return (index) => tex.slice(0, index).split('\n').length
}

/**
 * Reads a brace group starting at `open`, which must be a `{`. Returns the
 * content and the index just past the closing brace. Nesting is why this is
 * not a regex: `\tr{...\href{}{}...}` occurs in the awards section.
 */
function readGroup(tex, open, lineOf) {
  if (tex[open] !== '{') fail(`expected a brace group at ${sourceRef}:${lineOf(open)}`)
  let depth = 0
  for (let i = open; i < tex.length; i++) {
    const c = tex[i]
    if (c === '\\') {
      i++
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return { content: tex.slice(open + 1, i), end: i + 1 }
    }
  }
  fail(`unbalanced braces opened at ${sourceRef}:${lineOf(open)}`)
}

function skipSpace(tex, i) {
  while (i < tex.length && /\s/.test(tex[i])) i++
  return i
}

/**
 * Resolves every `\tr{EN}{PT}` in `tex` down to one locale's arm, recursively,
 * because the arms themselves contain `\tr`.
 */
function resolveTr(tex, locale, lineOf) {
  let out = ''
  let i = 0
  for (;;) {
    const at = tex.indexOf('\\tr', i)
    if (at === -1) return out + tex.slice(i)

    const afterName = at + 3
    // \trademark and friends: only `\tr` immediately followed by a group counts.
    const firstOpen = skipSpace(tex, afterName)
    if (tex[firstOpen] !== '{' || /[a-zA-Z]/.test(tex[afterName] ?? '')) {
      out += tex.slice(i, afterName)
      i = afterName
      continue
    }

    out += tex.slice(i, at)
    const first = readGroup(tex, firstOpen, lineOf)
    const secondOpen = skipSpace(tex, first.end)
    if (tex[secondOpen] !== '{') {
      fail(`\\tr with a single arm at ${sourceRef}:${lineOf(at)}`)
    }
    const second = readGroup(tex, secondOpen, lineOf)

    if (first.content.trim() === '' || second.content.trim() === '') {
      fail(`empty translation arm at ${sourceRef}:${lineOf(at)}`)
    }

    out += resolveTr(locale === 'en' ? first.content : second.content, locale, lineOf)
    i = second.end
  }
}

/* --------------------------------------------------------------- cleaning */

/** Unwraps `\macro{content}` to its content, repeatedly, for the given names. */
function unwrap(text, names) {
  const pattern = new RegExp(`\\\\(${names.join('|')})\\s*\\{`)
  for (;;) {
    const m = pattern.exec(text)
    if (!m) return text
    const open = m.index + m[0].length - 1
    const group = readGroup(text, open, () => 0)
    text = text.slice(0, m.index) + group.content + text.slice(group.end)
  }
}

/** `\href{url}{label}` occurrences, label cleaned, in document order. */
function extractLinks(tex, locale, lineOf) {
  const links = []
  let i = 0
  for (;;) {
    const at = tex.indexOf('\\href', i)
    if (at === -1) return links
    const urlOpen = skipSpace(tex, at + 5)
    const url = readGroup(tex, urlOpen, lineOf)
    const labelOpen = skipSpace(tex, url.end)
    if (tex[labelOpen] !== '{') fail(`\\href without a label at ${sourceRef}:${lineOf(at)}`)
    const label = readGroup(tex, labelOpen, lineOf)
    // The label commonly wraps an icon macro AND a \tr, so the translation has
    // to be resolved before cleaning. Cleaning first leaves "\trLiveProdução".
    links.push({
      href: url.content.trim(),
      label: clean(resolveTr(label.content, locale, lineOf), locale),
    })
    i = label.end
  }
}

/**
 * LaTeX to the plain text this site renders.
 *
 * The dash rules are the point of this function and not an afterthought. Spec
 * 002 removed every em dash from visitor-facing prose and built
 * punctuation.test.ts to keep it out; the CV writes `---`, and it writes
 * `Londrina - PR`, which the same test's ` - ` rule forbids. Extraction is
 * therefore a translation between two documents' conventions rather than a
 * copy (FR-054, research D6), and both substitutions below resolve to what
 * this site already does:
 *
 *   `A --- B`      title separator      -> `A: B`     (never a hyphen)
 *   `Londrina - PR` place separator     -> `Londrina, PR`
 *
 * The second matches profile.location, which has read `Londrina, Paraná,
 * Brazil` since 1.0.0. Neither may become ` - ` or ` -- `, which are the
 * substitutions that satisfy a find-and-replace while reproducing the exact
 * visual tell the rewrite existed to remove.
 */
function clean(tex, locale, { keepDashes = false } = {}) {
  let text = tex

  // Links become their label; the href is captured separately where it matters.
  text = text.replace(/\\href\s*\{[^}]*\}\s*/g, '')
  text = unwrap(text, ['textbf', 'textit', 'emph', 'texttt', 'small', 'large', 'Large'])

  text = text
    .replace(/\\fa[A-Za-z]+/g, '')
    .replace(/\\space/g, ' ')
    .replace(/\\(noindent|hfill|centering|raggedleft|par)\b/g, '')
    .replace(/\\(vspace|hspace|setlength|itemsep)\s*\*?\s*\{[^}]*\}/g, '')
    .replace(/\\setlength\\\w+\s*\{[^}]*\}/g, '')
    .replace(/\\textbar\\?/g, '|')
    .replace(/\\\\/g, ' ')

  // Escapes. `C\#` is the one a naive pass gets wrong first.
  text = text
    .replace(/\\#/g, '#')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .replace(/\\\$/g, '$')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')

  text = text.replace(/\{|\}/g, '')

  /*
   * Dashes, per the header comment above — except in a date range, where `--`
   * is the range separator and has to survive long enough for parseRange to
   * split on it. Normalising it here first is how the first run of this parser
   * turned `05/2025 -- Present` into an unparseable date.
   */
  if (!keepDashes) {
    text = text
      .replace(/\s*---\s*/g, ': ')
      .replace(/\s+--\s+/g, ': ')
      .replace(/\s+-\s+/g, ', ')
  }

  /*
   * Collapse runs of whitespace, then close the gap before punctuation — but
   * only where the mark actually ends a clause. Without the lookahead this
   * eats the space in "and .NET" and ships "and.NET", because a leading dot is
   * not always a full stop.
   */
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1')
    .trim()
  // A colon substitution can meet an existing one; `A: : B` is never intended.
  text = text.replace(/:\s*:/g, ':')

  if (locale && text === '') return ''
  return text
}

/** Both arms of a construct, each resolved and cleaned. */
function localized(tex, lineOf) {
  return {
    en: clean(resolveTr(tex, 'en', lineOf), 'en'),
    pt: clean(resolveTr(tex, 'pt', lineOf), 'pt'),
  }
}

/**
 * Splits a skills list on commas that are NOT inside parentheses.
 *
 * A plain `split(',')` turns `GCP (Cloud Run, Cloud SQL, GCS)` into three
 * skills, two of which are fragments with an unbalanced bracket. The CV uses
 * that construct four times, so this is the ordinary case and not an edge one.
 */
function splitTopLevel(text) {
  const out = []
  let depth = 0
  let current = ''
  for (const ch of text) {
    if (ch === '(' || ch === '[') depth++
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1)

    if (ch === ',' && depth === 0) {
      out.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  out.push(current)
  return out.map((s) => s.trim()).filter(Boolean)
}

/* ----------------------------------------------------------------- dates */

const MONTH_YEAR = /^(\d{2})\/(\d{4})$/
const YEAR = /^(\d{4})$/

function parseDate(raw, where) {
  const value = raw.trim()
  const my = MONTH_YEAR.exec(value)
  if (my) return `${my[2]}-${my[1]}`
  const y = YEAR.exec(value)
  if (y) return y[1]
  fail(`unparseable date "${value}" at ${where}`)
}

/**
 * `05/2025 -- Present` and `05/2025 -- 11/2025`. An ongoing role is `end: null`
 * and never a flag or a computed date; the CV's own `\tr{Present}{Presente}` is
 * discarded because the site already owns that word (FR-055).
 */
function parseRange(raw, where) {
  const value = raw.replace(/\\faCalendar/g, '').replace(/\\space/g, ' ').trim()
  const parts = value.split(/\s+--\s+/)
  if (parts.length === 1) return { start: parseDate(parts[0], where), end: null }
  if (parts.length !== 2) fail(`unparseable date range "${value}" at ${where}`)
  const start = parseDate(parts[0], where)
  const ongoing = /present|presente/i.test(parts[1])
  return { start, end: ongoing ? null : parseDate(parts[1], where) }
}

/* -------------------------------------------------------------- structure */

const SECTION_KINDS = {
  'Professional Experience': 'experience',
  'Awards & Highlights': 'awards',
  Skills: 'skills',
  Projects: 'projects',
  Education: 'education',
  Certifications: 'certifications',
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Every `\macro{..}{..}` occurrence with its arity, brace-balanced. */
function findMacros(tex, name, arity, lineOf) {
  const found = []
  let i = 0
  for (;;) {
    const at = tex.indexOf(`\\${name}`, i)
    if (at === -1) return found
    const after = at + name.length + 1
    if (/[a-zA-Z]/.test(tex[after] ?? '')) {
      i = after
      continue
    }
    const args = []
    let cursor = after
    for (let n = 0; n < arity; n++) {
      cursor = skipSpace(tex, cursor)
      if (tex[cursor] !== '{') {
        fail(`\\${name} expects ${arity} arguments at ${sourceRef}:${lineOf(at)}`)
      }
      const group = readGroup(tex, cursor, lineOf)
      args.push(group.content)
      cursor = group.end
    }
    found.push({ args, start: at, end: cursor, line: lineOf(at) })
    i = cursor
  }
}

/** The `\item` bodies of the first itemize block after `from`. */
function bulletsAfter(tex, from, lineOf) {
  const begin = tex.indexOf('\\begin{itemize}', from)
  if (begin === -1) return null
  // Only bullets that belong to THIS entry: anything past the next entry is not.
  const nextEntry = Math.min(
    ...['\\entry', '\\project', '\\section*']
      .map((m) => {
        const at = tex.indexOf(m, from)
        return at === -1 ? Infinity : at
      })
      .filter((n) => n > from),
  )
  if (begin > nextEntry) return null

  const end = tex.indexOf('\\end{itemize}', begin)
  if (end === -1) fail(`itemize opened but never closed at ${sourceRef}:${lineOf(begin)}`)
  const body = tex.slice(begin + '\\begin{itemize}'.length, end)

  const items = body
    .split(/\\item\b/)
    .slice(1)
    .map((raw) => raw.trim())
    .filter((raw) => raw !== '')

  return { items, en: items.map((i) => clean(resolveTr(i, 'en', lineOf), 'en')), pt: items.map((i) => clean(resolveTr(i, 'pt', lineOf), 'pt')) }
}

function bulletsLocalized(tex, from, lineOf) {
  const b = bulletsAfter(tex, from, lineOf)
  return b ? { en: b.en, pt: b.pt } : { en: [], pt: [] }
}

/* ------------------------------------------------------------------- main */

function extract() {
  const raw = readFileSync(texPath, 'utf8').split('\r\n').join('\n')
  const tex = stripComments(raw)
  const lineOf = lineCounter(tex)

  const bodyAt = tex.indexOf('\\begin{document}')
  if (bodyAt === -1) fail(`\\begin{document} not found in ${sourceRef}`)

  /*
   * The header minipage block is SKIPPED ENTIRELY and never read (FR-083, D8).
   * It carries a telephone number and a personal email address beside the
   * business one. What the page publishes instead is profile.contacts, authored
   * in this repository, so that editing the CV cannot publish a phone number by
   * accident. The assertion at the end of this file is the belt to this brace.
   */
  const headerEnd = tex.lastIndexOf('\\end{minipage}')
  const afterHeader = headerEnd === -1 ? bodyAt : headerEnd + '\\end{minipage}'.length

  const centerStart = tex.indexOf('\\begin{center}', afterHeader)
  const centerEnd = tex.indexOf('\\end{center}', centerStart)
  if (centerStart === -1 || centerEnd === -1) fail(`headline block not found in ${sourceRef}`)
  const headline = localized(tex.slice(centerStart + '\\begin{center}'.length, centerEnd), lineOf)

  const firstSection = tex.indexOf('\\section*', centerEnd)
  if (firstSection === -1) fail(`no \\section* found in ${sourceRef}`)
  const summary = localized(tex.slice(centerEnd + '\\end{center}'.length, firstSection), lineOf)
  if (!summary.en || !summary.pt) fail(`summary paragraph is empty in ${sourceRef}`)

  // Sections, in document order.
  const heads = findMacros(tex.slice(firstSection), 'section*', 1, (i) => lineOf(firstSection + i))
  if (heads.length === 0) fail(`no \\section* found in ${sourceRef}`)

  const sections = []
  for (const [index, head] of heads.entries()) {
    const title = localized(head.args[0], lineOf)
    const kind = SECTION_KINDS[title.en]
    if (!kind) fail(`section "${title.en}" is not one this site knows how to render`)

    const from = firstSection + head.end
    const to = index + 1 < heads.length ? firstSection + heads[index + 1].start : tex.length
    const body = tex.slice(from, to)
    const bodyLine = (i) => lineOf(from + i)

    sections.push({ id: slug(title.en), kind, title, entries: parseSection(kind, body, bodyLine) })
  }

  for (const required of Object.values(SECTION_KINDS)) {
    if (!sections.some((s) => s.kind === required)) {
      const name = Object.keys(SECTION_KINDS).find((k) => SECTION_KINDS[k] === required)
      fail(`section "${name}" not found`)
    }
  }

  return { headline, summary, sections }
}

/**
 * `\entry{1}{2}{3}{4}` is OVERLOADED: the same four arguments mean different
 * things inside different sections. Parsing is therefore driven by the
 * enclosing section and never by the macro name (research D5).
 */
function parseSection(kind, body, lineOf) {
  if (kind === 'skills') {
    const bullets = bulletsAfter(body, 0, lineOf)
    if (!bullets) fail('the Skills section has no itemize block')
    return bullets.items.map((item, i) => {
      const split = item.indexOf(':')
      if (split === -1) fail(`skill group without a label at ${sourceRef}:${lineOf(0)}`)
      const label = localized(item.slice(0, split), lineOf)
      const values = item.slice(split + 1)
      const items = (locale) => splitTopLevel(clean(resolveTr(values, locale, lineOf), locale))
      return { label, items: { en: items('en'), pt: items('pt') }, order: i }
    })
  }

  if (kind === 'projects') {
    return findMacros(body, 'project', 2, lineOf).map((m) => {
      const pt = extractLinks(m.args[1], 'pt', lineOf)
      return {
        /*
         * Localized, where data-model.md said "proper noun, not localized".
         * The CV writes `Telas Paraná --- \tr{Institutional Website}{Site
         * Institucional}`: the name is a proper noun but the descriptor bolted
         * onto it is not, and the two arrive as one string. Storing only the
         * English arm would put English on the Portuguese page (FR-054).
         */
        name: localized(m.args[0], lineOf),
        links: extractLinks(m.args[1], 'en', lineOf).map((link, i) => ({
          href: link.href,
          label: { en: link.label, pt: pt[i]?.label ?? link.label },
        })),
        detail: bulletsLocalized(body, m.end, lineOf),
      }
    })
  }

  const entries = findMacros(body, 'entry', 4, lineOf)
  if (entries.length === 0) fail(`section of kind "${kind}" has no \\entry`)

  return entries.map((m) => {
    const where = `${sourceRef}:${m.line}`
    const [one, two, three, four] = m.args

    if (kind === 'experience') {
      const first = clean(resolveTr(one, 'en', lineOf), 'en')
      const [employer, client] = first.split('|').map((s) => s.trim())
      const range = parseRange(clean(resolveTr(two, 'en', lineOf), 'en', { keepDashes: true }), where)
      return {
        employer,
        client: client ?? null,
        title: localized(three, lineOf),
        location: localized(four, lineOf),
        start: range.start,
        end: range.end,
        responsibilities: bulletsLocalized(body, m.end, lineOf),
      }
    }

    if (kind === 'awards') {
      return {
        title: localized(one, lineOf),
        date: parseDate(clean(resolveTr(two, 'en', lineOf), 'en'), where),
        project: localized(three, lineOf),
        evidence: linkOf(four, lineOf, where),
        detail: bulletsLocalized(body, m.end, lineOf),
      }
    }

    if (kind === 'education') {
      return {
        degree: localized(one, lineOf),
        end: parseDate(clean(resolveTr(two, 'en', lineOf), 'en'), where),
        institution: clean(resolveTr(three, 'en', lineOf), 'en'),
        location: localized(four, lineOf),
      }
    }

    // certifications
    return {
      name: clean(resolveTr(one, 'en', lineOf), 'en'),
      date: parseDate(clean(resolveTr(two, 'en', lineOf), 'en'), where),
      subject: localized(three, lineOf),
      issuer: linkOf(four, lineOf, where),
      detail: bulletsLocalized(body, m.end, lineOf),
    }
  })
}

function linkOf(tex, lineOf, where) {
  const en = extractLinks(tex, 'en', lineOf)
  const pt = extractLinks(tex, 'pt', lineOf)
  if (en.length === 0) fail(`expected an \\href at ${where}`)
  return { href: en[0].href, label: { en: en[0].label, pt: pt[0]?.label ?? en[0].label } }
}

/* -------------------------------------------------------------- documents */

/**
 * Both PDFs are copied here and served from this origin (FR-061, D12), and
 * their byte sizes are recorded so the page can state them without a request
 * (FR-059). A language whose file is absent records `present: false`, and the
 * page renders no control for it rather than a link to a 404 (FR-060).
 */
function documents() {
  const filesDir = join(sourceDir, 'files')
  const available = existsSync(filesDir) ? readdirSync(filesDir) : []
  mkdirSync(publicCv, { recursive: true })

  return [
    { locale: 'en', prefix: 'ENG_CV_' },
    { locale: 'pt', prefix: 'PTBR_CV_' },
  ].map(({ locale, prefix }) => {
    const filename = available.find((f) => f.startsWith(prefix) && f.endsWith('.pdf'))
    if (!filename) {
      console.log(`! cv: no ${prefix}*.pdf in ${filesDir} - no download control for ${locale}`)
      return { locale, filename: null, href: null, bytes: 0, present: false }
    }
    const from = join(filesDir, filename)
    const bytes = readFileSync(from)
    copyFileSync(from, join(publicCv, filename))
    return {
      locale,
      filename,
      href: `/cv/${filename}`,
      bytes: bytes.length,
      present: true,
    }
  })
}

/* ------------------------------------------------------------ assertions */

const FORBIDDEN_CONTACT = [
  [/\+?55\s?\d{2}\s?9?\d{4}/, 'telephone number'],
  [/\btel:/, 'tel: scheme'],
  [/h0wzymarcos@gmail\.com/, 'personal email address'],
]

const FORBIDDEN_DASH = [
  ['—', 'em dash'],
  ['–', 'en dash'],
  [' - ', 'spaced hyphen'],
  [' -- ', 'double hyphen'],
]

/**
 * Asserted over the SERIALISED ARTIFACT rather than over the page, so it fails
 * at extraction: the earliest point at which the mistake is visible and the
 * cheapest at which to fix it (D8).
 */
function assertClean(record) {
  const serialised = JSON.stringify(record)

  for (const [pattern, what] of FORBIDDEN_CONTACT) {
    if (pattern.test(serialised)) fail(`${what} in extracted record`)
  }

  for (const [needle, what] of FORBIDDEN_DASH) {
    if (!serialised.includes(needle)) continue
    const where = findDash(record, needle) ?? 'the record'
    fail(`${what} in ${where}`)
  }
}

/** Names the field a banned dash reached, because "somewhere" is not a message. */
function findDash(node, needle, path = '') {
  if (typeof node === 'string') return node.includes(needle) ? path : null
  if (Array.isArray(node)) {
    for (const [i, child] of node.entries()) {
      const hit = findDash(child, needle, `${path}[${i}]`)
      if (hit) return hit
    }
    return null
  }
  if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      const hit = findDash(child, needle, path ? `${path}.${key}` : key)
      if (hit) return hit
    }
  }
  return null
}

/* ------------------------------------------------------------------- run */

if (!existsSync(sourceDir)) degrade(`${sourceDir} not found - keeping the committed artifact`)
if (!existsSync(texPath)) degrade('main.tex unreadable - keeping the committed artifact')

let commit = 'unknown'
try {
  commit = execFileSync('git', ['-C', sourceDir, 'rev-parse', '--short', 'HEAD'], {
    encoding: 'utf8',
    // A CV source that is not a git checkout is a fine thing to be. Let this
    // report it in its own words instead of leaking git's fatal: to the build.
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()
} catch {
  console.log('! cv: could not read the source commit - the capture stamp will say so')
}

try {
  const { headline, summary, sections } = extract()
  const record = {
    capturedAt: new Date().toISOString(),
    sourceCommit: commit,
    sourceRef,
    isFallback: false,
    headline,
    summary,
    documents: documents(),
    sections,
  }

  assertClean(record)

  writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`)

  const counts = sections.map((s) => `${s.kind} ${s.entries.length}`).join(', ')
  console.log(`ok cv ${sections.length} sections from ${sourceRef}@${commit} (${counts})`)
  for (const doc of record.documents) {
    console.log(
      doc.present
        ? `ok cv ${doc.locale} ${doc.filename} ${(doc.bytes / 1024).toFixed(1)} KB`
        : `!  cv ${doc.locale} absent - no download control will render`,
    )
  }
} catch (error) {
  if (error instanceof ParseError) {
    console.error(`x cv: ${error.message}`)
    console.error('  the committed artifact is untouched; fix the source and run again')
    process.exit(1)
  }
  throw error
}
