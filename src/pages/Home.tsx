import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { experienceSince, workPage } from '../content/types'
import { periodLabel } from '../content/stats'
import { calendar } from '../content/contributions'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'
import { SectionLabel } from '../components/SectionLabel'
import { ProjectList } from '../components/ProjectList'
import { StatsPanel } from '../components/StatsPanel'
import { ContributionGrid } from '../components/ContributionGrid'
import { Terminal } from '../components/Terminal'

export function Home({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { profile, projects, stats } = content
  const { years, months } = experienceSince(profile.experienceStart)
  const { projects: pageOneProjects } = workPage(projects, 1)
  const period = periodLabel(stats)

  return (
    <>
      <Chrome locale={locale} path="h0wzy" pathname={pathname} />

      <main>
        <header className="section">
          <div className="wrap rise">
            <h1>
              {profile.handle}
              <span className="cursor" aria-hidden="true">
                ▋
              </span>
            </h1>
            <p className="tagline">{profile.tagline[locale]}</p>
            <p className="sub">
              {translate(locale, 'hero.role')} · {profile.location[locale]}
            </p>
            {/*
              FR-028: experience and tracked time are separate measurements over
              different periods, and each states its own.
            */}
            <p className="sub">
              <strong>{translate(locale, 'hero.experience', { years, months })}</strong>{' '}
              <span className="dim">({translate(locale, 'hero.experienceSince')})</span>
            </p>
            {/* FR-036: the same period wording as the activity section, never a second phrasing. */}
            <p className="sub dim">
              {stats.humanReadableTotal}, {translate(locale, period.key, period.params)}
            </p>
          </div>
        </header>

        <section className="section" id="terminal">
          <div className="wrap">
            <SectionLabel id="section.terminal" anchor="terminal" locale={locale} />
            <Terminal locale={locale} />
          </div>
        </section>

        <section className="section" id="about">
          <div className="wrap">
            <SectionLabel id="section.about" anchor="about" locale={locale} />
            {profile.bio[locale].map((para) => (
              <p key={para.slice(0, 40)} className="prose reveal">
                {para}
              </p>
            ))}
          </div>
        </section>

        <section className="section" id="work">
          <div className="wrap">
            <SectionLabel id="section.work" anchor="work" locale={locale} />
            <h2>{translate(locale, 'work.heading')}</h2>
            <p className="prose">{translate(locale, 'work.intro')}</p>
            <ProjectList projects={pageOneProjects} locale={locale} />
            <p className="prose">
              <a href={pathFor({ page: 'workIndex', number: 1 }, locale)}>
                {translate(locale, 'work.allWork')} →
              </a>
            </p>
          </div>
        </section>

        <section className="section" id="stats">
          <div className="wrap">
            <SectionLabel id="section.stats" anchor="stats" locale={locale} />
            <h2>{translate(locale, 'stats.heading')}</h2>
            <StatsPanel stats={stats} locale={locale} />
            <ContributionGrid calendar={calendar} locale={locale} />
          </div>
        </section>

        <section className="section" id="contact">
          <div className="wrap">
            <SectionLabel id="section.contact" anchor="contact" locale={locale} />
            <h2>{translate(locale, 'contact.heading')}</h2>
            <ul className="bullets">
              {profile.contacts.map((contact) => (
                <li key={contact.href}>
                  <span className="dim">{translate(locale, contact.labelKey)}: </span>
                  <a href={contact.href}>{contact.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="dim">{translate(locale, 'footer.builtWith')}</p>
        </div>
      </footer>
    </>
  )
}
