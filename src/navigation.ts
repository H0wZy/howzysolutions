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
 * @param leafLabel The current page's own name, when that name is data rather
 *   than a dictionary string. Only the project route needs it.
 */
export function trailFor(route: Route, locale: Locale, leafLabel?: string): Crumb[] {
  const home: Crumb = { labelKey: 'nav.home', href: pathFor({ page: 'home' }, locale) }

  switch (route.page) {
    /*
     * FR-070: a path with one element is not a path. The home page shows no
     * breadcrumb at all rather than a breadcrumb containing only itself.
     */
    case 'home':
      return []

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
