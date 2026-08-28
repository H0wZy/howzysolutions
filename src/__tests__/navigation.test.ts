import { describe, expect, it } from 'vitest'
import { topLevelLinks, trailFor } from '../navigation'
import { pathFor, type Route } from '../route'
import { LOCALES } from '../content/i18n/types'

/**
 * The breadcrumb is a pure function of the route, which is the whole reason it
 * can be tested here without a DOM (Principle VII, D11).
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-navigation.md
 */

describe('the breadcrumb trail', () => {
  it.each(LOCALES)('%s: the home page is its own trail, unlinked (FR-070)', (locale) => {
    // Amended 2026-08-27: the strip carries navigation on every page. The home
    // page's ancestry is itself, so the one crumb is the current page.
    expect(trailFor({ page: 'home' }, locale)).toEqual([{ labelKey: 'nav.home', href: null }])
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
      expect(trail.length).toBeGreaterThan(0)
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

/**
 * SC-012 as a gate rather than a comment. The CV page shipped linked from
 * nowhere — reachable only by typing the URL — because the requirement lived in
 * prose and nothing could fail. This is what fails now.
 */
describe('the top-level links in the chrome bar', () => {
  const routes: Route[] = [
    { page: 'home' },
    { page: 'workIndex', number: 1 },
    { page: 'work', id: 'telasparana' },
    { page: 'cv' },
  ]

  const destinations: Route[] = [{ page: 'workIndex', number: 1 }, { page: 'cv' }]

  it.each(LOCALES)(
    '%s: reaches every top-level destination from every page in one activation (FR-084, SC-012)',
    (locale) => {
      for (const route of routes) {
        const hrefs = topLevelLinks(route, locale).map((l) => l.href)
        for (const destination of destinations) {
          // Present, unless it IS this page — the current page is not a link.
          if (destination.page === route.page) {
            expect(hrefs).not.toContain(pathFor(destination, locale))
          } else {
            expect(hrefs).toContain(pathFor(destination, locale))
          }
        }
      }
    },
  )

  it.each(LOCALES)('%s: links stay inside this locale', (locale) => {
    for (const route of routes) {
      for (const link of topLevelLinks(route, locale)) {
        if (locale === 'en') expect(link.href).not.toMatch(/^\/pt\//)
        else expect(link.href).toMatch(/^\/pt\//)
      }
    }
  })
})
