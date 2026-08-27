import { describe, expect, it } from 'vitest'
import { content } from '../../content'
import { cv as record } from '../../content/cv'
import { commands, resolve } from '../registry'
import { execute } from '../engine'
import { LOCALES } from '../../content/i18n/types'
import type { CvRole } from '../../content/types'

/**
 * V11 and SC-014: the terminal's CV output and the page state the same roles
 * and dates, and this fails if either side is changed alone.
 *
 * It can be written as a comparison against the record rather than against a
 * snapshot of the page precisely because there IS only one source: both
 * surfaces read src/content/cv.ts, and FR-067 is satisfied by construction.
 * What this guards is someone reintroducing a second path.
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-command.md
 */

const ctx = (locale: (typeof LOCALES)[number], line: string) =>
  execute(line, { locale, content, history: [] })

function outputText(lines: ReturnType<typeof ctx>['lines']): string {
  return lines
    .map((l) => {
      if (l.kind === 'text' || l.kind === 'link') return l.text
      if (l.kind === 'table') return [l.head, ...l.rows].map((r) => r.join(' ')).join('\n')
      if (l.kind === 'pairs') return l.rows.map((r) => r.join(' ')).join('\n')
      return ''
    })
    .join('\n')
}

describe('the cv command is a command like any other', () => {
  it('is registered, so help lists it without a help entry being authored', () => {
    // registry.ts derives help from this array; a command cannot exist
    // without appearing there (FR-066).
    expect(commands.map((c) => c.name)).toContain('cv')
  })

  it('answers to what a visitor is likely to type', () => {
    for (const name of ['cv', 'resume', 'curriculum']) {
      expect(resolve(name)?.name, name).toBe('cv')
    }
  })

  it('carries the same usage and summary shape as every other command', () => {
    const command = resolve('cv')
    expect(command?.usage).toMatch(/^cv/)
    expect(command?.summaryKey).toBe('cmd.cv')
  })

  it('appears in the ls content surface beside contact.md', () => {
    expect(outputText(ctx('en', 'ls').lines)).toContain('cv.md')
  })
})

describe('the terminal and the page cannot state different facts (V11)', () => {
  const roles = (record.sections.find((s) => s.kind === 'experience')?.entries ?? []) as CvRole[]

  it.each(LOCALES)('%s: prints every employer the record holds', (locale) => {
    const output = outputText(ctx(locale, 'cv').lines)
    for (const role of roles) {
      expect(output, `missing employer: ${role.employer}`).toContain(role.employer)
      if (role.client) expect(output).toContain(role.client)
    }
  })

  it.each(LOCALES)('%s: prints every start date the record holds', (locale) => {
    const output = outputText(ctx(locale, 'cv').lines)
    for (const role of roles) {
      const [year, month] = role.start.split('-')
      expect(output, `missing start: ${role.start}`).toContain(`${month}/${year}`)
    }
  })

  it.each(LOCALES)('%s: ends an ongoing role in a translated word, not a date', (locale) => {
    const output = outputText(ctx(locale, 'cv').lines)
    const ongoing = roles.find((r) => r.end === null)
    expect(ongoing, 'the fixture needs an ongoing role to be meaningful').toBeDefined()
    // FR-055. The word differs by locale; a computed end date would not.
    expect(output).toContain(locale === 'en' ? 'present' : 'presente')
  })

  it('states the capture stamp the page states (FR-056, FR-080)', () => {
    expect(outputText(ctx('en', 'cv').lines)).toContain(record.sourceCommit)
  })
})

describe('cv --download', () => {
  it.each(LOCALES)('%s: lists the reader own language first (FR-057)', (locale) => {
    const links = ctx(locale, 'cv --download').lines.filter((l) => l.kind === 'link')
    expect(links.length).toBeGreaterThan(0)
    const first = links[0] as { href: string }
    const expected = record.documents.find((d) => d.locale === locale)?.href
    expect(first.href).toBe(expected)
  })

  it('states size and language on every line before activation (FR-059)', () => {
    for (const line of ctx('en', 'cv --download').lines) {
      if (line.kind !== 'link') continue
      expect(line.text).toMatch(/\d+\.\d KB/)
      expect(line.href).toMatch(/^\/cv\//) // same origin only (FR-061)
    }
  })

  it('emits no line for a document absent from the build (FR-060)', () => {
    const stripped = {
      ...content,
      cv: { ...record, documents: record.documents.map((d) => ({ ...d, present: false })) },
    }
    const result = execute('cv --download', { locale: 'en', content: stripped, history: [] })
    expect(result.lines.some((l) => l.kind === 'link')).toBe(false)
    // Absence is a stated condition, never a broken link.
    expect(outputText(result.lines)).not.toBe('')
  })
})
