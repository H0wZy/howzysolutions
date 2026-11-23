import { content, privacy, terms } from './content'
import { vvvShowcase } from './content/showcase-vvv'
import { vvvLive } from './content/showcase-vvv-live'
import { LOCALES, type Locale } from './content/i18n/types'
import { translate } from './content/i18n/translate'
import { workPage } from './content/types'
import { locationFor, pathFor, type Route } from './route'

/**
 * What the site knows about its own routes, with no rendering in it: the list of
 * documents, their locale twins and their metadata. The Next app builds its
 * static params, its metadata and its sitemap from this, and the tests assert
 * against it. It was the top half of src/entry-server.tsx under the Vite build.
 */

export const ORIGIN = 'https://howzysolutions.com'

/** The two legal records, keyed by the route page that renders each index. */
const LEGAL = { privacy, terms } as const

/**
 * Every route this site emits as a real document, in every locale (FR-006,
 * FR-016). English is unprefixed; Portuguese lives under /pt/. The listing
 * page count is derived from the data, never hardcoded (FR-020).
 */
export function routes(): Array<{ pathname: string; locale: Locale }> {
  const { total } = workPage(content.projects, 1)
  const pages: Route[] = [
    { page: 'home' },
    { page: 'services' },
    { page: 'cv' },
    { page: 'privacy' },
    { page: 'terms' },
    // One document per app per record, because a store reviews one app and
    // asks for its own terms URL and its own policy URL.
    ...(['privacy', 'terms'] as const).flatMap((doc) =>
      LEGAL[doc].projects.map((app) => ({ page: 'legalApp' as const, doc, id: app.id })),
    ),
    { page: 'mcp' },
    { page: 'vvv' },
    { page: 'vvvLive' },
    ...Array.from({ length: total }, (_, i) => ({ page: 'workIndex' as const, number: i + 1 })),
    ...content.projects.map((p) => ({ page: 'work' as const, id: p.id })),
  ]
  return LOCALES.flatMap((locale) =>
    pages.map((route) => ({ pathname: pathFor(route, locale), locale })),
  )
}

/** The same page in the other locales, for hreflang alternates (T070). */
export function alternates(pathname: string): Array<{ locale: Locale; href: string }> {
  const { route } = locationFor(pathname)
  return LOCALES.map((locale) => ({ locale, href: pathFor(route, locale) }))
}

export type PageMeta = {
  title: string
  description: string
  lang: Locale
  image: '/brand/h0wzy-social-card.png'
  imageAlt: string
}

export function metaFor(pathname: string): PageMeta {
  const { route, locale } = locationFor(pathname)
  const social = {
    lang: locale,
    image: '/brand/h0wzy-social-card.png' as const,
    imageAlt: translate(locale, 'meta.socialImageAlt'),
  }
  const project =
    route.page === 'work' ? content.projects.find((p) => p.id === route.id) : undefined
  if (project) {
    return {
      title: `${project.name} · ${content.profile.name}`,
      description: project.summary[locale],
      ...social,
    }
  }
  if (route.page === 'services') {
    return {
      title: `${translate(locale, 'services.meta.title')} · ${content.profile.name}`,
      description: translate(locale, 'services.lead'),
      ...social,
    }
  }
  if (route.page === 'workIndex') {
    return {
      title: `${translate(locale, 'work.listingTitle')} · ${content.profile.name}`,
      description: translate(locale, 'work.intro'),
      ...social,
    }
  }
  /*
   * Without this branch the CV page would inherit the home page's title and
   * description, and the punctuation test over route metadata would not catch
   * it because that test only looks for dashes (research D13).
   */
  if (route.page === 'cv') {
    return {
      title: `${translate(locale, 'cv.title')} · ${content.profile.name}`,
      description: translate(locale, 'cv.metaDescription'),
      ...social,
    }
  }
  if (route.page === 'privacy') {
    return {
      title: `${translate(locale, 'privacy.title')} · ${content.profile.name}`,
      description: translate(locale, 'privacy.metaDescription'),
      ...social,
    }
  }
  if (route.page === 'terms') {
    return {
      title: `${translate(locale, 'terms.title')} · ${content.profile.name}`,
      description: translate(locale, 'terms.metaDescription'),
      ...social,
    }
  }
  if (route.page === 'legalApp') {
    const app = LEGAL[route.doc].projects.find((a) => a.id === route.id)
    const document = route.doc === 'privacy' ? 'privacy.title' : 'terms.title'
    return {
      title: `${app?.name ?? route.id} · ${translate(locale, document)} · ${content.profile.name}`,
      description:
        app?.summary[locale][0] ??
        translate(locale, route.doc === 'privacy' ? 'privacy.metaDescription' : 'terms.metaDescription'),
      ...social,
    }
  }
  if (route.page === 'mcp') {
    return {
      title: `H0wZy/mcp · Multi-Agent MCP Hub · ${content.profile.name}`,
      description:
        locale === 'pt'
          ? 'Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.'
          : 'The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.',
      ...social,
    }
  }
  if (route.page === 'vvv') {
    return {
      title: `${vvvShowcase.meta.title[locale]} · ${content.profile.name}`,
      description: vvvShowcase.meta.description[locale],
      ...social,
    }
  }
  if (route.page === 'vvvLive') {
    return {
      title: `${vvvLive.meta.title[locale]} · ${content.profile.name}`,
      description: vvvLive.meta.description[locale],
      ...social,
    }
  }
  return {
    title: `${content.profile.name} · ${translate(locale, 'hero.role')}`,
    description: translate(locale, 'home.hero.lede'),
    ...social,
  }
}

/** The params of the catch-all segment: absent for `/`, one entry per path part. */
export type PathParams = { path?: string[] }

/** `['pt', 'works', 'vvv']` back to `/pt/works/vvv/`: every document's path ends in a slash. */
export function pathnameOf(path?: string[]): string {
  return path && path.length > 0 ? `/${path.join('/')}/` : '/'
}
