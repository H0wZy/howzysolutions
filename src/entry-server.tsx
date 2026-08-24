import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'
import { content } from './content'
import { LOCALES, type Locale } from './content/i18n/types'
import { translate } from './content/i18n/translate'
import { locationFor, pathFor, type Route } from './route'

/**
 * Every route this site emits as a real document, in every locale (FR-006,
 * FR-016). English is unprefixed; Portuguese lives under /pt/.
 */
export function routes(): Array<{ pathname: string; locale: Locale }> {
  const pages: Route[] = [
    { page: 'home' },
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
  return {
    title: `${content.profile.name} · ${translate(locale, 'hero.role')}`,
    description: content.profile.tagline[locale],
    lang: locale,
  }
}

export function render(pathname: string): string {
  return renderToStaticMarkup(<App pathname={pathname} />)
}

export { LOCALES }
