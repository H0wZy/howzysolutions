import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'
import { content } from './content'
import { LOCALES, type Locale } from './content/i18n/types'
import { translate } from './locale'

/** Every route this site emits as a real document (FR-006). */
export function routes(): string[] {
  return ['/', ...content.projects.map((p) => `/work/${p.id}/`)]
}

export function metaFor(pathname: string, locale: Locale): { title: string; description: string } {
  const match = /^\/work\/([a-z0-9-]+)\/?$/.exec(pathname)
  const project = match ? content.projects.find((p) => p.id === match[1]) : undefined
  if (project) {
    return {
      title: `${project.name} — ${content.profile.name}`,
      description: project.summary[locale],
    }
  }
  return {
    title: `${content.profile.name} — ${translate(locale, 'hero.role')}`,
    description: content.profile.tagline[locale],
  }
}

export function render(pathname: string, locale: Locale): string {
  return renderToStaticMarkup(<App pathname={pathname} locale={locale} />)
}

export { LOCALES }
