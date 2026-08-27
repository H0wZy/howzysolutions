import { describe, expect, it } from 'vitest'
import { cv, documentFor, educationRange, projectIdFor, railEntries } from '../cv'
import { projects } from '../projects'
import { technologies } from '../technologies'
import { CV_SECTION_KIND } from '../types'
import type { CvSkillGroup } from '../types'
import { LOCALES } from '../i18n/types'

/**
 * The artifact is generated, so these are not tests of hand-written data. They
 * are the assertions that decide whether a REGENERATED artifact is safe to
 * ship — the parser can be edited, main.tex can be edited, and this is what
 * notices when either goes wrong in a way the parser itself did not catch.
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-artifact.md
 */

describe('the CV artifact', () => {
  it('was extracted, not degraded, in this checkout', () => {
    // A committed fallback would mean the page ships whatever was last good,
    // which is correct behaviour on Vercel and a mistake to commit from here.
    expect(cv.isFallback).toBe(false)
    expect(cv.sourceCommit).not.toBe('unknown')
  })

  it('carries every section this site knows how to render (V2)', () => {
    const found = cv.sections.map((s) => s.kind)
    for (const kind of Object.values(CV_SECTION_KIND)) {
      expect(found, `missing section: ${kind}`).toContain(kind)
    }
  })

  it('gives every section an anchor the rail can link to', () => {
    for (const section of cv.sections) {
      expect(section.id).toMatch(/^[a-z0-9-]+$/)
      expect(section.entries.length).toBeGreaterThan(0)
    }
    expect(new Set(cv.sections.map((s) => s.id)).size).toBe(cv.sections.length)
  })

  it('fills both arms of every localized string (V1)', () => {
    for (const section of cv.sections) {
      for (const locale of LOCALES) {
        expect(section.title[locale], `${section.id} title.${locale}`).not.toBe('')
      }
    }
    for (const locale of LOCALES) {
      expect(cv.headline[locale]).not.toBe('')
      expect(cv.summary[locale]).not.toBe('')
    }
  })
})

/**
 * FR-083, V4. Asserted over the SERIALISED artifact rather than over the page,
 * because that is the earliest point the mistake is visible. The CV source
 * carries all three of these in its header block; this site must carry none.
 *
 * scripts/extract-cv.mjs already refuses to write a record containing them.
 * This is the second lock: extraction can be edited, and the decision that the
 * telephone number stays unpublished should not depend on nobody widening a
 * regex.
 */
describe('nothing personal reached the record', () => {
  const serialised = JSON.stringify(cv)

  it.each([
    ['a Brazilian telephone number', /\+?55\s?\d{2}\s?9?\d{4}/],
    ['a tel: scheme', /\btel:/],
    ['the personal email address', /h0wzymarcos@gmail\.com/],
  ])('contains no %s', (_what, pattern) => {
    expect(pattern.test(serialised)).toBe(false)
  })

  it('publishes contact details from profile.ts instead, where they are authored', () => {
    // FR-082 lists exactly what may be published; profile.ts is where that
    // list lives, so editing the CV can never publish a phone number.
    expect(serialised).not.toContain('@gmail.com')
  })
})

/**
 * V8. The spec's one hard requirement about skills: a technology name is not
 * spelled two different ways on two pages. A CHECK, not a merge — merging the
 * CV's grouping into this site's technology vocabulary would put the CV's
 * grouping under this site's authority, which contradicts CL-004.
 */
describe('technology names agree with the site vocabulary', () => {
  it('spells a known technology the same way the technologies record does', () => {
    const known = new Map(technologies.map((t) => [t.name.toLowerCase(), t.name]))
    const offenders: string[] = []

    for (const section of cv.sections) {
      if (section.kind !== 'skills') continue
      for (const group of section.entries as CvSkillGroup[]) {
        for (const locale of LOCALES) {
          for (const item of group.items[locale]) {
            const canonical = known.get(item.toLowerCase())
            if (canonical && canonical !== item) {
              offenders.push(`${item} should be ${canonical}`)
            }
          }
        }
      }
    }

    expect(offenders, offenders.join('; ')).toEqual([])
  })
})

/** V9, FR-064. A map that points at nothing silently stops suppressing. */
describe('the site-held layer', () => {
  it('maps every CV project name to a project that exists', () => {
    for (const [name, id] of Object.entries(cv.projectIds)) {
      expect(projects.some((p) => p.id === id), `${name} -> ${id}`).toBe(true)
    }
  })

  it('maps names that actually appear in the extracted record', () => {
    const section = cv.sections.find((s) => s.kind === 'projects')
    const names = (section?.entries ?? []).map((e) => (e as { name: { en: string } }).name.en)
    for (const name of Object.keys(cv.projectIds)) {
      expect(names, `projectIds key not found in the CV: ${name}`).toContain(name)
    }
  })

  it('resolves Telas Paraná to its own page, so the CV does not restate it', () => {
    const section = cv.sections.find((s) => s.kind === 'projects')
    const telas = (section?.entries ?? []).find((e) =>
      (e as { name: { en: string } }).name.en.startsWith('Telas Paraná'),
    ) as { name: { en: string } }
    expect(projectIdFor(telas.name.en)).toBe('telasparana')
  })

  it('states the degree range with the start this site holds, not the CV (FR-081)', () => {
    // The CV carries the completion year only. FR-063 needs the 2023 start,
    // because that start is what the home page's figure counts.
    expect(educationRange('Unicesumar', '2025')).toBe('2023-2025')
  })

  it('returns the bare year for an institution it holds no start for', () => {
    expect(educationRange('Somewhere Else', '2025')).toBe('2025')
  })
})

describe('the surfaces derived from the record', () => {
  it('derives one rail entry per section, in document order (D10)', () => {
    expect(railEntries().map((e) => e.id)).toEqual(cv.sections.map((s) => s.id))
  })

  it('offers a document per locale, from this origin only (FR-061)', () => {
    for (const locale of LOCALES) {
      const doc = documentFor(locale)
      expect(doc, `no document for ${locale}`).toBeDefined()
      expect(doc?.href).toMatch(/^\/cv\//)
      expect(doc?.bytes).toBeGreaterThan(0)
    }
  })

  it('returns nothing for a document that was absent at extraction (FR-060)', () => {
    // V10: absence must render no control, so it must not be representable as
    // a document with an href that something downstream might still use.
    const absent = { ...cv, documents: [{ ...cv.documents[0], present: false }] }
    expect(documentFor('en', absent)).toBeUndefined()
  })
})

/** FR-055: the ongoing state is the ABSENCE of an end date, never a flag. */
describe('an ongoing role', () => {
  it('records end as null rather than a computed or hardcoded date', () => {
    const experience = cv.sections.find((s) => s.kind === 'experience')
    const roles = (experience?.entries ?? []) as Array<{ end: string | null; start: string }>
    expect(roles.some((r) => r.end === null)).toBe(true)
    for (const role of roles) {
      expect(role.start).toMatch(/^\d{4}-\d{2}$/)
      if (role.end !== null) expect(role.end).toMatch(/^\d{4}-\d{2}$/)
    }
  })

  it('starts employment in May 2025, which is not when time in IT began', () => {
    const experience = cv.sections.find((s) => s.kind === 'experience')
    const roles = (experience?.entries ?? []) as Array<{ end: string | null; start: string }>
    const earliest = roles.map((r) => r.start).sort()[0]
    expect(earliest).toBe('2025-05')
  })
})
