import { describe, expect, it } from 'vitest'
import { projects } from '../projects'
import { technologies } from '../technologies'
import { profile } from '../profile'
import {
  PROJECT_KIND,
  PROJECT_STATE,
  STACK_GROUP,
  experienceSince,
  type Project,
} from '../types'
import { LOCALES } from '../i18n/types'

const techIds = new Set(technologies.map((t) => t.id))
const each = (fn: (p: Project) => void) => projects.forEach(fn)

describe('project records', () => {
  it('covers all nine repositories', () => {
    expect(projects).toHaveLength(9)
    expect(projects.map((p) => p.id).sort()).toEqual(
      [
        'authsys',
        'generative-ai-e2',
        'howzysolutions',
        'selzler-construtora',
        'skeeper-specs',
        'studiobiasantos',
        'telasparana',
        'terminal',
        'viralvideogen',
      ].sort(),
    )
  })

  it('has unique, slug-shaped ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    each((p) => expect(p.id, `bad id: ${p.id}`).toMatch(/^[a-z0-9-]+$/))
  })

  /* research D6 — a purely numeric id would collide with /work/{n}/ */
  it('never uses a purely numeric id', () => {
    each((p) => expect(p.id, p.id).not.toMatch(/^\d+$/))
  })

  it('uses only the defined kind and state vocabularies', () => {
    each((p) => {
      expect(Object.keys(PROJECT_KIND)).toContain(p.kind)
      expect(Object.keys(PROJECT_STATE)).toContain(p.state)
    })
  })

  /* FR-004 — the editorial rule that gives this portfolio its character. */
  it('states at least one limitation for every project, in both locales', () => {
    each((p) => {
      for (const locale of LOCALES) {
        expect(
          p.limitations[locale].length,
          `${p.id} has no declared limitation in ${locale}`,
        ).toBeGreaterThan(0)
        p.limitations[locale].forEach((line) => expect(line.trim()).not.toBe(''))
      }
    })
  })

  /* FR-003 — named in the spec because it is the one record most tempting to overstate. */
  it('presents authsys as a study skeleton, never as a working auth system', () => {
    const authsys = projects.find((p) => p.id === 'authsys')
    expect(authsys).toBeDefined()
    expect(authsys?.state).toBe('skeleton')
    expect(authsys?.kind).toBe('study')
  })

  it('orders every period start before its end', () => {
    each((p) => {
      expect(p.period.start, `${p.id}`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(p.period.end, `${p.id}`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(
        new Date(p.period.start).getTime(),
        `${p.id} period is inverted`,
      ).toBeLessThanOrEqual(new Date(p.period.end).getTime())
    })
  })

  it('resolves every stack reference to a known technology', () => {
    each((p) =>
      p.stack.forEach((group) => {
        expect(Object.keys(STACK_GROUP)).toContain(group.group)
        group.items.forEach((id) =>
          expect(techIds, `${p.id} references unknown technology '${id}'`).toContain(id),
        )
      }),
    )
  })

  it('fills every required prose field in both locales', () => {
    each((p) => {
      for (const locale of LOCALES) {
        expect(p.summary[locale].trim(), `${p.id}.summary.${locale}`).not.toBe('')
        expect(p.problem[locale].trim(), `${p.id}.problem.${locale}`).not.toBe('')
        expect(p.capabilities[locale].length, `${p.id}.capabilities.${locale}`).toBeGreaterThan(0)
        expect(p.development[locale].length, `${p.id}.development.${locale}`).toBeGreaterThan(0)
      }
    })
  })

  it('records a positive commit count for every project', () => {
    each((p) => expect(p.commits, `${p.id}`).toBeGreaterThan(0))
  })

  it('attributes a source to every published metric', () => {
    each((p) =>
      (p.metrics ?? []).forEach((m) => {
        for (const locale of LOCALES) {
          expect(m.source[locale].trim(), `${p.id} metric without source`).not.toBe('')
          expect(m.label[locale].trim()).not.toBe('')
        }
        expect(m.value.trim()).not.toBe('')
      }),
    )
  })
})

describe('technologies', () => {
  it('has unique ids and no orphan entries', () => {
    const ids = technologies.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    const referenced = new Set(projects.flatMap((p) => p.stack.flatMap((g) => g.items)))
    const orphans = ids.filter((id) => !referenced.has(id))
    expect(orphans, `unreferenced technologies: ${orphans.join(', ')}`).toEqual([])
  })
})

describe('author profile', () => {
  it('counts experience from January 2023', () => {
    expect(profile.experienceStart).toBe('2023-01-01')
  })

  it('derives the duration rather than storing it', () => {
    expect(experienceSince('2023-01-01', new Date('2026-08-19T00:00:00Z'))).toEqual({
      years: 3,
      months: 7,
    })
    expect(experienceSince('2023-01-01', new Date('2026-12-31T00:00:00Z'))).toEqual({
      years: 3,
      months: 11,
    })
    // The day-of-month rollback: one day short of the anniversary is still 11 months.
    expect(experienceSince('2023-03-15', new Date('2026-03-14T00:00:00Z'))).toEqual({
      years: 2,
      months: 11,
    })
  })

  it('offers at least one contact route', () => {
    expect(profile.contacts.length).toBeGreaterThan(0)
  })
})
