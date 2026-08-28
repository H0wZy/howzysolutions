import type { Locale } from './content/i18n/types'
import type { StringKey } from './content/i18n/en'
import { pathFor, type Route } from './route'

/**
 * The breadcrumb trail, as a pure function of the route.
 *
 * Derived, never authored per page (FR-069, D11). `Route` is already a
 * discriminated union, so the trail falls out of it, and `pathFor` already
 * translates a route into the active locale's URL — which is what makes a
 * Portuguese breadcrumb link Portuguese documents for free.
 *
 * This lives beside route.ts rather than under components/ because it is logic
 * over `Route` and Principle VII wants that kind of logic unit-tested without
 * a DOM.
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-navigation.md
 */

export type Crumb = {
  /** Resolved through the dictionary, so the trail is in the active locale. */
  labelKey?: StringKey
  /**
   * A name that belongs in neither dictionary because it is identical in both
   * — a project's own name. Same reasoning that keeps WAKATIME.name out of
   * i18n (FR-054). Exactly one of `labelKey` and `label` is set.
   */
  label?: string
  /**
   * `null` marks the current page. That is what makes it not a link and what
   * earns it `aria-current="page"` (FR-069, FR-075).
   */
  href: string | null
}

/**
 * The site's top-level destinations, in the order the chrome bar shows them.
 * Home is not among them: it is already the breadcrumb's first crumb on every
 * page below the top level, and the trail is where a visitor looks for the way
 * up.
 */
const TOP_LEVEL: { route: Route; labelKey: StringKey }[] = [
  { route: { page: 'workIndex', number: 1 }, labelKey: 'nav.work' },
  { route: { page: 'cv' }, labelKey: 'nav.cv' },
]

/**
 * The top-level links the chrome bar renders (FR-084, SC-012).
 *
 * A destination is dropped when it IS the current page, by the same rule the
 * trail's final crumb follows: the current page is not a link. Everything else
 * is present, which is what makes every top-level destination one activation
 * from every other — Chrome renders on every page, so this list is the whole
 * guarantee rather than a link authored per page and forgotten on the next one.
 *
 * Pure, and over `Route`, so the guarantee is a unit test rather than a comment
 * (Principle VII). The CV page shipped reachable from nowhere precisely because
 * nothing here could be asserted.
 */
export function topLevelLinks(
  route: Route,
  locale: Locale,
): { labelKey: StringKey; href: string }[] {
  return TOP_LEVEL.filter((entry) => entry.route.page !== route.page).map((entry) => ({
    labelKey: entry.labelKey,
    href: pathFor(entry.route, locale),
  }))
}

/**
 * @param leafLabel The current page's own name, when that name is data rather
 *   than a dictionary string. Only the project route needs it.
 */
export function trailFor(route: Route, locale: Locale, leafLabel?: string): Crumb[] {
  const home: Crumb = { labelKey: 'nav.home', href: pathFor({ page: 'home' }, locale) }

  switch (route.page) {
    /*
     * FR-070 as amended 2026-08-27: the home page carries the trail too, so the
     * strip under the chrome bar holds navigation on every page rather than
     * appearing only once a visitor has gone somewhere. The trail is still the
     * page's own ancestry, which on the home page is the home page — so the
     * single crumb is the current page and therefore not a link, the same rule
     * every other trail's final crumb follows.
     */
    case 'home':
      return [{ ...home, href: null }]

    case 'workIndex':
      return [home, { labelKey: 'work.listingTitle', href: null }]

    case 'work':
      return [
        home,
        { labelKey: 'work.listingTitle', href: pathFor({ page: 'workIndex', number: 1 }, locale) },
        { label: leafLabel ?? route.id, href: null },
      ]

    case 'cv':
      return [home, { labelKey: 'cv.title', href: null }]
  }
}
