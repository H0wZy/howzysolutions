import type { Locale } from '../content/i18n/types'
import { ORIGIN } from '../site'

/**
 * Schema.org JSON-LD for the Person and the WebSite, so search engines connect
 * "howzysolutions" with Marcos "H0wZy" Junior. Server-rendered into <head>.
 */
export function StructuredData({ locale }: { locale: Locale }) {
  const en = locale === 'en'
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${ORIGIN}/#person`,
        name: 'Marcos "H0wZy" Junior',
        alternateName: ['H0wZy', 'Howzy', 'Marcos Junior'],
        url: ORIGIN,
        jobTitle: 'Full-stack Software Engineer',
        sameAs: ['https://github.com/H0wZy', 'https://linktr.ee/howzy'],
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: ORIGIN,
        name: 'Howzy Solutions',
        alternateName: ['howzysolutions', 'HowzySolutions', 'howzysolutions.com'],
        description: en
          ? 'Personal portfolio of Marcos "H0wZy" Junior, full-stack developer.'
          : 'Portfólio pessoal de Marcos "H0wZy" Junior, desenvolvedor full-stack.',
        publisher: { '@id': `${ORIGIN}/#person` },
        inLanguage: ['en', 'pt-BR'],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
