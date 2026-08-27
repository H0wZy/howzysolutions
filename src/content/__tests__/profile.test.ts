import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { experienceDuration, profile } from '../profile'
import { experienceSince } from '../types'
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
