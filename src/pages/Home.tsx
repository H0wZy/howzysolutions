import { Fragment } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { experienceDuration } from '../content/profile'
import { periodLabel } from '../content/stats'
import { activity } from '../content/contributions'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'
import { SectionLabel } from '../components/SectionLabel'
import { StatsPanel } from '../components/StatsPanel'
import { GithubActivity } from '../components/GithubActivity'
import { Footer } from '../components/Footer'
import { Terminal } from '../components/Terminal'
import { Skeleton } from '../components/ui/skeleton'
import { SectionRail } from '../components/SectionRail'
import { Typewriter } from '../components/Typewriter'
import { homeTopicAnchors } from '../navigation'
import portrait from '../assets/branding/h0wzy-portrait.webp'

export function Home({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { profile, stats } = content
  // Build-time value, not `new Date()`: nothing under App may derive from the
  // clock during render, or prerender and hydration disagree (FR-047).
  const { years, months } = experienceDuration
  const period = periodLabel(stats)
  /* Every project that carries a card, in the order `projects` lists them. */
  const featured = content.projects.flatMap((project) =>
    project.featured ? [{ project, card: project.featured }] : [],
  )
  /* Wraps both ways, so the arrows on the first and last cards never dead-end. */
  const radioId = (i: number) =>
    `featured-${featured[(i + featured.length) % featured.length].project.id}`

  return (
    <>
      <Chrome locale={locale} pathname={pathname} />

      <main className="document-layout">
        <SectionRail entries={homeTopicAnchors(Boolean(activity.periods['last-year']))} locale={locale} />
        <div className="document-body">
        <header className="section hero">
          <div className="wrap hero-grid">
            <div className="hero-copy rise">
              <h1 className="hero-title">
                <span className="hero-greeting">{translate(locale, 'hero.greeting')}</span>
                <span className="hero-handle">H0wZy</span>
              </h1>
              <p className="tagline">
                <Typewriter phrases={profile.taglines[locale]} />
              </p>
              {/* Each half stays whole and the line may break between them: the whole line
                  as one nowrap run was 109px wider than a 390px Portuguese screen. */}
              <p className="sub">
                <span className="nowrap">{translate(locale, 'hero.role')}</span>
                {' · '}
                <span className="nowrap">{profile.location[locale]}</span>
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
              <p className="hero-links">
                <a href="#terminal">{translate(locale, 'section.terminal')}</a>
                <a href="#featured">{translate(locale, 'section.featured')}</a>
                <a href="#work">{translate(locale, 'section.work')}</a>
              </p>
            </div>

            <figure className="hero-portrait">
              <Skeleton className="hero-portrait-skeleton" />
              <img
                src={portrait}
                width="720"
                height="720"
                alt=""
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          </div>
        </header>

        <section className="section" id="terminal">
          <div className="wrap">
            <SectionLabel id="section.terminal" anchor="terminal" locale={locale} />
            <Terminal locale={locale} />
          </div>
        </section>

        <section className="section" id="featured">
          <div className="wrap">
            <SectionLabel id="section.featured" anchor="featured" locale={locale} />
            {/*
              One card at a time, switched by a radio group rather than by
              state: the checked radio's card shows (components.css), so the
              strip works with scripting unavailable and costs no JavaScript.
              Keyboard users get native radio behaviour (arrows move between
              cards, a focused radio outlines its card); the numbered labels
              are the same radios for a pointer, so they are hidden from
              assistive technology rather than announced twice.
            */}
            {featured.map(({ project, card }, i) => {
              const href = pathFor(project.showcase?.route ?? { page: 'work', id: project.id }, locale)
              return (
                <Fragment key={project.id}>
                  {featured.length > 1 ? (
                    <input
                      type="radio"
                      name="featured"
                      id={radioId(i)}
                      className="featured-radio visually-hidden"
                      defaultChecked={i === 0}
                      aria-label={translate(locale, 'featured.show', { name: card.name })}
                    />
                  ) : null}
                  <div className="featured-card p-5 rounded border border-[var(--border)] bg-[var(--surface)] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded border border-[var(--accent)] text-[var(--accent)] font-semibold">
                          {card.version ? `${card.name} ${card.version}` : card.name}
                        </span>
                        <span className="text-xs font-mono text-[var(--dim)]">{card.tagline[locale]}</span>
                      </div>
                      <a href={href} className="font-mono text-xs text-[var(--accent)] hover:underline">
                        {translate(locale, 'work.openShowcase')} →
                      </a>
                    </div>

                    <p className="prose text-sm text-[var(--fg)]">{card.pitch[locale]}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--term-user)]">
                      {card.chain[locale].map((step, j) => (
                        <Fragment key={step}>
                          {j > 0 ? <span className="text-[var(--dim)]">{card.joiner}</span> : null}
                          <span>{step}</span>
                        </Fragment>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <a href={href} className="btn text-xs font-mono">
                          {translate(locale, 'featured.explore', { name: card.name })} →
                        </a>
                        <code className="text-xs font-mono px-3 py-1.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--fg)] select-all">
                          {card.command}
                        </code>
                      </div>
                      {featured.length > 1 ? (
                        <div className="pagination-list featured-pager" aria-hidden="true">
                          <label className="pagination-link pagination-edge" htmlFor={radioId(i - 1)}>
                            ←
                          </label>
                          {featured.map((other, j) => (
                            <label
                              key={other.project.id}
                              className={j === i ? 'pagination-link is-current' : 'pagination-link'}
                              htmlFor={radioId(j)}
                            >
                              {j + 1}
                            </label>
                          ))}
                          <label className="pagination-link pagination-edge" htmlFor={radioId(i + 1)}>
                            →
                          </label>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Fragment>
              )
            })}
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
            <p className="prose">
              <a className="btn" href={pathFor({ page: 'workIndex', number: 1 }, locale)}>
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
          </div>
        </section>

        {/* FR-043: no artifact ever captured means no section, never an empty one. */}
        {activity.periods['last-year'] ? (
          <section className="section" id="github">
            <div className="wrap">
              <SectionLabel id="section.github" anchor="github" locale={locale} />
              <GithubActivity activity={activity} locale={locale} />
            </div>
          </section>
        ) : null}

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

        <Footer locale={locale} />
        </div>
      </main>
    </>
  )
}
