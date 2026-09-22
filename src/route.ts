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
  | { page: 'cv' }
  | { page: 'privacy' }
  | { page: 'terms' }
  /** One app's block of one legal document, on a page of its own. */
  | { page: 'legalApp'; doc: 'privacy' | 'terms'; id: string }
  | { page: 'mcp' }

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
  // `/cv/`, not `/resume/`: the American term for a document this one is not
  // shaped like, and the word a recruiter scans for in both languages.
  if (rest === '/cv/' || rest === '/cv') return { page: 'cv' }
  if (rest === '/privacy-policy/' || rest === '/privacy-policy') return { page: 'privacy' }
  if (rest === '/terms-of-service/' || rest === '/terms-of-service') return { page: 'terms' }
  // One mechanism for both documents: a store reviewing one app asks for that
  // app's own terms URL and its own policy URL, which are the same shape.
  const appMatch = /^\/(privacy-policy|terms-of-service)\/([a-z0-9-]+)\/?$/.exec(rest)
  if (appMatch) {
    return { page: 'legalApp', doc: appMatch[1] === 'privacy-policy' ? 'privacy' : 'terms', id: appMatch[2] }
  }
  if (rest === '/mcp/' || rest === '/mcp') return { page: 'mcp' }
  if (rest === '/works/' || rest === '/works') return { page: 'workIndex', number: 1 }
  const pageMatch = /^\/works\/(\d+)\/?$/.exec(rest)
  if (pageMatch) return { page: 'workIndex', number: Number(pageMatch[1]) }
  const workMatch = /^\/works\/([a-z0-9-]+)\/?$/.exec(rest)
  return workMatch ? { page: 'work', id: workMatch[1] } : { page: 'home' }
}

export function locationFor(pathname: string): Location {
  const { locale, rest } = splitLocale(pathname)
  return { route: parseRoute(rest), locale }
}

/** Routes whose path carries nothing from the route but its name. */
const FIXED = {
  home: '/',
  cv: '/cv/',
  privacy: '/privacy-policy/',
  terms: '/terms-of-service/',
  mcp: '/mcp/',
} as const satisfies Record<string, string>

/** The canonical path for a route in a given locale. */
export function pathFor(route: Route, locale: Locale): string {
  const rest =
    route.page === 'work'
      ? `/works/${route.id}/`
      : route.page === 'legalApp'
        ? `${FIXED[route.doc]}${route.id}/`
        : route.page === 'workIndex'
          ? route.number <= 1
            ? '/works/'
            : `/works/${route.number}/`
          : FIXED[route.page]
  if (locale === DEFAULT_LOCALE) return rest
  return rest === '/' ? `/${locale}/` : `/${locale}${rest}`
}

/**
 * Routes whose document is complete as prerendered HTML: no handler, no state,
 * nothing for React to attach to. src/main.tsx skips hydration for these and
 * src/App.tsx does not import them, which is what keeps them out of the client
 * bundle (src/entry-server.tsx renders them instead).
 */
export function isStaticDocument(route: Route): boolean {
  return route.page === 'privacy' || route.page === 'terms' || route.page === 'legalApp'
}

/** The same page in another locale — what the language control links to. */
export function counterpart(pathname: string, locale: Locale): string {
  return pathFor(locationFor(pathname).route, locale)
}
