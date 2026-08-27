import { describe, expect, it } from 'vitest'
import { trailFor } from '../navigation'
import { pathFor, type Route } from '../route'
import { LOCALES } from '../content/i18n/types'

/**
 * The breadcrumb is a pure function of the route, which is the whole reason it
 * can be tested here without a DOM (Principle VII, D11).
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-navigation.md
 */

describe('the breadcrumb trail', () => {
  it.each(LOCALES)('%s: the home page has no trail at all (FR-070)', (locale) => {
    // A path with one element is not a path.
    expect(trailFor({ page: 'home' }, locale)).toEqual([])
  })

  it.each(LOCALES)('%s: the work listing sits under home', (locale) => {
    const trail = trailFor({ page: 'workIndex', number: 1 }, locale)
    expect(trail).toHaveLength(2)
    expect(trail[0].href).toBe(pathFor({ page: 'home' }, locale))
    expect(trail[1].href).toBeNull()
  })

  it.each(LOCALES)('%s: a project sits under the listing, under home', (locale) => {
    const trail = trailFor({ page: 'work', id: 'telasparana' }, locale, 'Telas Paraná')
    expect(trail).toHaveLength(3)
    expect(trail[0].href).toBe(pathFor({ page: 'home' }, locale))
    expect(trail[1].href).toBe(pathFor({ page: 'workIndex', number: 1 }, locale))
    expect(trail[2]).toEqual({ label: 'Telas Paraná', href: null })
  })

  it.each(LOCALES)('%s: the CV sits directly under home', (locale) => {
    const trail = trailFor({ page: 'cv' }, locale)
    expect(trail).toHaveLength(2)
    expect(trail[0].href).toBe(pathFor({ page: 'home' }, locale))
    expect(trail[1]).toEqual({ labelKey: 'cv.title', href: null })
  })
})

describe('every trail', () => {
  const routes: Route[] = [
    { page: 'home' },
    { page: 'workIndex', number: 1 },
    { page: 'work', id: 'telasparana' },
    { page: 'cv' },
  ]

  it.each(LOCALES)('%s: marks exactly one crumb as the current page (FR-069)', (locale) => {
    for (const route of routes) {
      const trail = trailFor(route, locale)
      if (trail.length === 0) continue
      expect(trail.filter((c) => c.href === null)).toHaveLength(1)
      // And it is the last one: a current page in the middle of a path is not
      // a path, it is a bug.
      expect(trail[trail.length - 1].href).toBeNull()
    }
  })

  it.each(LOCALES)('%s: gives every ancestor a real href in this locale', (locale) => {
    for (const route of routes) {
      for (const crumb of trailFor(route, locale).slice(0, -1)) {
        expect(crumb.href).not.toBeNull()
        if (locale === 'en') expect(crumb.href).not.toMatch(/^\/pt\//)
        else expect(crumb.href).toMatch(/^\/pt\//)
      }
    }
  })

  it('labels every crumb exactly one way, by key or by name', () => {
    for (const locale of LOCALES) {
      for (const route of routes) {
        for (const crumb of trailFor(route, locale, 'Telas Paraná')) {
          const hasKey = crumb.labelKey !== undefined
          const hasLabel = crumb.label !== undefined
          expect(hasKey !== hasLabel, JSON.stringify(crumb)).toBe(true)
        }
      }
    }
  })
})
