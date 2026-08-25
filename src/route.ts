import { DEFAULT_LOCALE, LOCALES, type Locale } from './content/i18n/types'

/**
 * Routing over prerendered documents. There is no router: every route below is
 * a real file emitted by scripts/prerender.mjs, and navigation is a link.
 *
 * English is canonical and unprefixed; Portuguese lives under /pt/. Real URLs
 * per locale are what make a Portuguese page shareable and indexable, and what
 * lets each document carry the right lang attribute with no JavaScript.
 */

export type Route =
  | { page: 'home' }
  | { page: 'workIndex'; number: number }
  | { page: 'work'; id: string }

export type Location = { route: Route; locale: Locale }

const NON_DEFAULT = LOCALES.filter((l) => l !== DEFAULT_LOCALE)

/** Splits a leading locale segment off the path, if there is one. */
export function splitLocale(pathname: string): { locale: Locale; rest: string } {
  for (const locale of NON_DEFAULT) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, rest: pathname.slice(locale.length + 1) || '/' }
    }
  }
  return { locale: DEFAULT_LOCALE, rest: pathname }
}

/**
 * A purely numeric segment is a page number, checked before the project id
 * pattern — the schema test guarantees no project id is purely numeric, which
 * is what makes this order unambiguous (research D6).
 */
export function parseRoute(rest: string): Route {
  if (rest === '/work/' || rest === '/work') return { page: 'workIndex', number: 1 }
  const pageMatch = /^\/work\/(\d+)\/?$/.exec(rest)
  if (pageMatch) return { page: 'workIndex', number: Number(pageMatch[1]) }
  const workMatch = /^\/work\/([a-z0-9-]+)\/?$/.exec(rest)
  return workMatch ? { page: 'work', id: workMatch[1] } : { page: 'home' }
}

export function locationFor(pathname: string): Location {
  const { locale, rest } = splitLocale(pathname)
  return { route: parseRoute(rest), locale }
}

/** The canonical path for a route in a given locale. */
export function pathFor(route: Route, locale: Locale): string {
  const rest =
    route.page === 'work'
      ? `/work/${route.id}/`
      : route.page === 'workIndex'
        ? route.number <= 1
          ? '/work/'
          : `/work/${route.number}/`
        : '/'
  if (locale === DEFAULT_LOCALE) return rest
  return rest === '/' ? `/${locale}/` : `/${locale}${rest}`
}

/** The same page in another locale — what the language control links to. */
export function counterpart(pathname: string, locale: Locale): string {
  return pathFor(locationFor(pathname).route, locale)
}
