import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { experienceDuration, profile } from '../profile'
import { experienceSince } from '../types'
import { en } from '../i18n/en'
import { pt } from '../i18n/pt'
import { LOCALES } from '../i18n/types'
import buildStamp from '../build.generated.json'

/**
 * Guards the hydration hazard that research D3 names first: a value derived
 * from `now` during render disagrees between the prerender pass and the
 * visitor's browser the moment those two straddle a month boundary. The site
 * hydrates, so that disagreement is a markup mismatch on a number nobody
 * edited (FR-047, SC-002).
 */
describe('the experience duration is derived once, at build time', () => {
  it('comes from the committed build stamp rather than the clock', () => {
    expect(experienceDuration).toEqual(
      experienceSince(profile.experienceStart, new Date(`${buildStamp.builtOn}T00:00:00Z`)),
    )
  })

  it('is computed once, so two reads cannot differ', () => {
    expect(experienceDuration).toBe(experienceDuration)
  })

  it('stamps a plain calendar date, which is all a whole-months figure needs', () => {
    expect(buildStamp.builtOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('still counts from the degree in 2023, not from employment in May 2025', () => {
    // The two clocks measure different things and must never be collapsed into
    // one number (constitution, Honesty in Self-Reported Metrics; FR-063).
    expect(profile.experienceStart).toBe('2023-01-01')
  })
})

/**
 * SC-010, FR-063. Three clocks, three periods: time in IT from the 2023
 * degree, the degree's own range, and employment from May 2025. A later copy
 * edit that drops a scope reintroduces exactly the overstatement this feature
 * removed, and prose is the easiest thing in the repository to change without
 * noticing what it was load-bearing for.
 */
describe('every clock states what it counts', () => {
  it.each(LOCALES)('%s names the 2023 start beside the duration', (locale) => {
    const dictionary = locale === 'en' ? en : pt
    expect(dictionary['hero.experienceSince']).toContain('2023')
    expect(dictionary['hero.experienceSince']).toMatch(/2025/)
  })

  it.each(LOCALES)('%s does not let the duration claim to be time employed', (locale) => {
    const dictionary = locale === 'en' ? en : pt
    // The figure counts time in the field, which began with the degree. It is
    // not time spent building software professionally, which began May 2025.
    expect(dictionary['hero.experience']).not.toMatch(/building software|construindo software/)
  })

  it.each(LOCALES)('%s names all three periods where they appear together', (locale) => {
    const note = (locale === 'en' ? en : pt)['stats.experienceNote']
    for (const year of ['2023', '2025', '2026']) {
      expect(note, `${locale} note is missing ${year}`).toContain(year)
    }
  })
})

/**
 * The rule the fix above only satisfies for one value. Anything rendered under
 * App that reads the clock reintroduces the same mismatch somewhere else, so
 * the ban is checked across the render tree rather than trusted to memory.
 *
 * What counts is reading the CLOCK, not constructing a date. `new Date(iso)`
 * built from a value in the content bundle is deterministic — server and
 * client hand it the same string and get the same answer, which is exactly
 * what ContributionGrid does with the calendar window. Only the no-argument
 * form and `Date.now()` return something that depends on when the code ran.
 */
describe('nothing in the render tree reads the clock', () => {
  const roots = ['src/pages', 'src/components']

  /** Comments are prose about the rule, not applications of it. */
  function stripComments(source: string): string {
    return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  }

  function tsxFilesUnder(dir: string): string[] {
    const out: string[] = []
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) out.push(...tsxFilesUnder(full))
      else if (entry.name.endsWith('.tsx')) out.push(full)
    }
    return out
  }

  const files = roots.flatMap((r) => tsxFilesUnder(r))

  it('finds files to check, so a passing result means something', () => {
    expect(files.length).toBeGreaterThan(5)
  })

  it.each(files)('%s calls neither new Date() nor Date.now()', (file) => {
    const source = stripComments(readFileSync(file, 'utf8'))
    expect(source).not.toMatch(/new Date\(\s*\)/)
    expect(source).not.toMatch(/Date\.now\(\s*\)/)
  })
})
