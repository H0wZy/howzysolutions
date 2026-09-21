import { renderToString } from 'react-dom/server'
import App from './App'
import { content } from './content'
import { LOCALES, type Locale } from './content/i18n/types'
import { translate } from './content/i18n/translate'
import { workPage } from './content/types'
import { locationFor, pathFor, type Route } from './route'

/**
 * Every route this site emits as a real document, in every locale (FR-006,
 * FR-016). English is unprefixed; Portuguese lives under /pt/. The listing
 * page count is derived from the data, never hardcoded (FR-020).
 */
export function routes(): Array<{ pathname: string; locale: Locale }> {
  const { total } = workPage(content.projects, 1)
  const pages: Route[] = [
    { page: 'home' },
    { page: 'cv' },
    { page: 'privacy' },
    { page: 'mcp' },
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
  return {
    title: `${content.profile.name} · ${translate(locale, 'hero.role')}`,
    description: content.profile.tagline[locale],
    ...social,
  }
}

/*
 * `renderToString`, not `renderToStaticMarkup`. Static markup is for HTML that
 * will never be hydrated: it strips the boundary comments hydrateRoot uses to
 * line the tree up, so hydrating it is how a page double-renders without ever
 * logging a mismatch. The client hydrates now (src/main.tsx), so this pass has
 * to emit markup that hydration can attach to.
 */
export function render(pathname: string): string {
  return renderToString(<App pathname={pathname} />)
}

export { LOCALES }
