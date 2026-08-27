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

export function metaFor(pathname: string): { title: string; description: string; lang: Locale } {
  const { route, locale } = locationFor(pathname)
  const project =
    route.page === 'work' ? content.projects.find((p) => p.id === route.id) : undefined
  if (project) {
    return {
      title: `${project.name} · ${content.profile.name}`,
      description: project.summary[locale],
      lang: locale,
    }
  }
  if (route.page === 'workIndex') {
    return {
      title: `${translate(locale, 'work.listingTitle')} · ${content.profile.name}`,
      description: translate(locale, 'work.intro'),
      lang: locale,
    }
  }
  return {
    title: `${content.profile.name} · ${translate(locale, 'hero.role')}`,
    description: content.profile.tagline[locale],
    lang: locale,
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
