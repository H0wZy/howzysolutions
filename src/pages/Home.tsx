import { useEffect } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { experienceSince } from '../content/types'
import { translate } from '../locale'
import { Chrome } from '../components/Chrome'
import { SectionLabel } from '../components/SectionLabel'
import { ProjectList } from '../components/ProjectList'

/**
 * Reveal-on-scroll. Replaces what framer-motion did, at zero transferred bytes
 * (research D1). No-op under prefers-reduced-motion, where CSS already pins the
 * final state.
 */
function useRevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export function Home({ content, locale }: { content: ContentBundle; locale: Locale }) {
  useRevealOnScroll()
  const { profile, projects, stats } = content
  const { years, months } = experienceSince(profile.experienceStart)

  return (
    <>
      <Chrome locale={locale} path="h0wzy" />

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
          <p className="sub dim">
            {stats.humanReadableTotal} {translate(locale, 'stats.total')} —{' '}
            {translate(locale, 'stats.range', {
              start: stats.range.start,
              end: stats.range.end,
            })}
          </p>
        </div>
      </header>

      <section className="section" id="about">
        <div className="wrap">
          <SectionLabel id="section.about" locale={locale} />
          {profile.bio[locale].map((para) => (
            <p key={para.slice(0, 40)} className="prose reveal">
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <SectionLabel id="section.work" locale={locale} />
          <h2>{translate(locale, 'work.heading')}</h2>
          <p className="prose">{translate(locale, 'work.intro')}</p>
          <ProjectList projects={projects} locale={locale} />
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap">
          <SectionLabel id="section.contact" locale={locale} />
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

      <footer className="footer">
        <div className="wrap">
          <p className="dim">{translate(locale, 'footer.builtWith')}</p>
        </div>
      </footer>
    </>
  )
}
