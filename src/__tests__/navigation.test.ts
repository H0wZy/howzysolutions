import { describe, expect, it } from 'vitest'
import {
  homeTopicAnchors,
  legalTopicAnchors,
  projectTopicAnchors,
  topLevelLinks,
  trailFor,
} from '../navigation'
import { pathFor, type Route } from '../route'
import { LOCALES } from '../content/i18n/types'
import { privacy } from '../content/privacy'
import { terms } from '../content/terms'
import { projects } from '../content/projects'
import { trackedTimeFor } from '../content/stats'

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

  it.each(LOCALES)("%s: an app's terms sit under the terms index, under home", (locale) => {
    const trail = trailFor({ page: 'termsApp', id: 'vvv' }, locale, 'vvv')
    expect(trail).toHaveLength(3)
    expect(trail[0].href).toBe(pathFor({ page: 'home' }, locale))
    expect(trail[1].href).toBe(pathFor({ page: 'terms' }, locale))
    expect(trail[2]).toEqual({ label: 'vvv', href: null })
  })
})

describe('every trail', () => {
  const routes: Route[] = [
    { page: 'home' },
    { page: 'workIndex', number: 1 },
    { page: 'work', id: 'telasparana' },
    { page: 'cv' },
    { page: 'privacy' },
    { page: 'terms' },
    { page: 'termsApp', id: 'vvv' },
    { page: 'mcp' },
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
    { page: 'privacy' },
    { page: 'terms' },
    { page: 'termsApp', id: 'vvv' },
  ]

  const destinations: Route[] = [
    { page: 'workIndex', number: 1 },
    { page: 'cv' },
    { page: 'privacy' },
  ]

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

describe('document outlines', () => {
  it('keeps home anchors in rendered source order and omits absent GitHub activity', () => {
    expect(homeTopicAnchors(true).map((entry) => entry.id)).toEqual([
      'terminal',
      'featured',
      'about',
      'work',
      'stats',
      'github',
      'contact',
    ])
    expect(homeTopicAnchors(false).map((entry) => entry.id)).toEqual([
      'terminal',
      'featured',
      'about',
      'work',
      'stats',
      'contact',
    ])
  })

  it.each([
    ['privacy', privacy],
    ['terms', terms],
  ] as const)('derives every %s anchor from the record in source order', (_name, document) => {
    const expected = [
      ...document.sections.map((section) => section.id),
      ...(document.projects ?? []).flatMap((project) => [
        project.id,
        ...project.sections.map((section) => section.id),
      ]),
    ]
    expect(legalTopicAnchors(document).map((entry) => entry.id)).toEqual(expected)
  })

  it("gives every app terms an id that is both its anchor and its own page", () => {
    // /terms-of-service/#vvv is the anchor on the index and
    // /terms-of-service/vvv/ is the same block on a page of its own, which is
    // the URL a store asks for. One id, so the two can never disagree.
    for (const app of terms.projects ?? []) {
      expect(legalTopicAnchors(terms).map((entry) => entry.id)).toContain(app.id)
      expect(pathFor({ page: 'termsApp', id: app.id }, 'en')).toBe(`/terms-of-service/${app.id}/`)
    }
    expect((terms.projects ?? []).length).toBeGreaterThan(0)
  })

  it('matches project anchors to the optional blocks that actually render', () => {
    for (const project of projects) {
      const ids = projectTopicAnchors(project, Boolean(trackedTimeFor(project.wakatimeProject))).map(
        (entry) => entry.id,
      )
      expect(ids).toContain('problem')
      expect(ids).toContain('capabilities')
      expect(ids).toContain('stack')
      expect(ids).toContain('development')
      expect(ids).toContain('limitations')
      expect(ids.includes('metrics')).toBe(Boolean(project.metrics?.length))
      expect(ids.includes('roadmap')).toBe(Boolean(project.roadmap?.en.length))
      expect(ids.includes('links')).toBe(Boolean(project.links?.length))
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
