import { experienceSince, type AuthorProfile, type ExperienceDuration } from './types'
import buildStamp from './build.generated.json'

export const profile: AuthorProfile = {
  name: 'Marcos "H0wZy" Junior',
  handle: 'h0wzy',

  tagline: {
    en: 'I build software that states what it cannot do.',
    pt: 'Construo software que declara o que não consegue fazer.',
  },

  bio: {
    en: [
      'Full-stack developer working across Next.js and .NET for client products, Python for AI and pipeline work, and infrastructure defined in Terraform rather than clicked into a console.',
      'Most of what I ship is for real businesses in Paraná (perimeter security, civil construction, independent professionals) where the measure of the work is whether the phone stops being the only way in.',
      'The habit I care about most is documenting the limitation alongside the feature. A classifier I built, measured and switched off is worth more in a README than one I shipped without measuring.',
    ],
    pt: [
      'Desenvolvedor full-stack trabalhando com Next.js e .NET em produtos para cliente, Python em IA e pipelines, e infraestrutura definida em Terraform em vez de clicada no console.',
      'A maior parte do que entrego é para empresas reais do Paraná (proteção perimetral, construção civil, profissionais autônomos) onde a medida do trabalho é o telefone deixar de ser o único canal de entrada.',
      'O hábito que mais prezo é documentar a limitação junto da funcionalidade. Um classificador que construí, medi e desliguei vale mais num README do que um que entreguei sem medir.',
    ],
  },

  /*
   * When this author entered IT — the Systems Analysis and Development degree
   * at Unicesumar, 2023. It is NOT when employment began; that is May 2025 at
   * TCS and it is stated on the CV page. The two count different things and the
   * constitution's Honesty in Self-Reported Metrics clause forbids placing them
   * so one reads as corroborating the other (spec 003, FR-063).
   */
  experienceStart: '2023-01-01',

  location: {
    en: 'Londrina, Paraná, Brazil',
    pt: 'Londrina, Paraná, Brasil',
  },

  contacts: [
    {
      kind: 'email',
      href: 'mailto:howzysolutions@gmail.com',
      label: 'howzysolutions@gmail.com',
      labelKey: 'contact.email',
    },
    {
      kind: 'github',
      href: 'https://github.com/H0wZy',
      label: 'github.com/H0wZy',
      labelKey: 'contact.github',
    },
    {
      kind: 'linktree',
      href: 'https://linktr.ee/h0wzymarcos',
      label: 'linktr.ee/h0wzymarcos',
      labelKey: 'contact.linktree',
    },
  ],
}

/**
 * Derived ONCE, from the committed build stamp — never from the clock the
 * render happens to be running on.
 *
 * FR-007 asked for this figure to be derived on every build instead of
 * hand-maintained, and it still is: scripts/stamp-build.mjs rewrites the stamp
 * whenever a build runs on a new day. What changed with hydration is that
 * "every build" acquired a second meaning. Prerender and the visitor's browser
 * are different instants, so `new Date()` under App would eventually have the
 * server rendering "3y 6mo" and the client rendering "3y 7mo" — a hydration
 * mismatch on a number nobody touched (FR-047, research D3).
 *
 * Nothing under App may call `new Date()` during render. This is the value it
 * reads instead.
 */
export const experienceDuration: ExperienceDuration = experienceSince(
  profile.experienceStart,
  new Date(`${buildStamp.builtOn}T00:00:00Z`),
)
