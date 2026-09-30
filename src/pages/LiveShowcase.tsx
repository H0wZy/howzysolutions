import type { ReactNode } from 'react'
import type { Locale, Localized } from '../content/i18n/types'
import type { ShowcaseArt } from '../content/types'
import { CONSOLE_PRIVACY_URL, CONSOLE_URL, vvvLive as page } from '../content/showcase-vvv-live'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'
import { SectionRail } from '../components/SectionRail'
import { Footer } from '../components/Footer'

/**
 * The live console's page (vvv spec 039 FR-043): a static document, rendered by
 * src/entry-server.tsx and never hydrated, like /vvv/. It collects nothing and
 * requests nothing from another origin, so it loads with the console down.
 * Screenshots are real UI, so they are not blended into the ground the way the
 * line-work artwork on /vvv/ is (`showcase-shot`, not `showcase-art`).
 */

function Shot({ art, locale, lead = false }: { art: ShowcaseArt; locale: Locale; lead?: boolean }) {
  return (
    <figure className="showcase-shot">
      <img
        src={art.src}
        width={art.width}
        height={art.height}
        alt={art.alt[locale]}
        loading={lead ? 'eager' : 'lazy'}
        fetchPriority={lead ? 'high' : undefined}
        decoding="async"
      />
    </figure>
  )
}

function Section({
  id,
  label,
  heading,
  locale,
  children,
}: {
  id: string
  label: Localized
  heading: Localized
  locale: Locale
  children: ReactNode
}) {
  return (
    <section className="section" id={id}>
      <div className="wrap">
        <p className="label">
          <a className="label-link" href={`#${id}`}>
            <span className="label-hash" aria-hidden="true">
              ##
            </span>
            {label[locale]}
          </a>
        </p>
        <h2>{heading[locale]}</h2>
        {children}
      </div>
    </section>
  )
}

export function LiveShowcase({ locale, pathname }: { locale: Locale; pathname: string }) {
  const { hero, does, shots, notice, privacy, faq } = page
  const showcase = pathFor({ page: 'vvv' }, locale)

  return (
    <>
      <Chrome locale={locale} pathname={pathname} />
      <main className="document-layout">
        <SectionRail
          entries={[
            { id: 'overview', label: hero.label },
            { id: 'does', label: does.label },
            { id: 'screens', label: shots.label },
            { id: 'notice', label: notice.label },
            { id: 'privacy', label: privacy.label },
            { id: 'faq', label: faq.label },
          ]}
          locale={locale}
        />
        <div className="document-body">
          <header className="section showcase-hero" id="overview">
            <div className="wrap">
              <div className="hero-grid">
                <div className="hero-copy">
                  <p className="label">{hero.kicker[locale]}</p>
                  <h1 className="showcase-title">
                    {hero.title[locale].map((line, i) => (
                      <span key={line}>
                        {i > 0 ? ' ' : null}
                        <span className="showcase-title-line">{line}</span>
                      </span>
                    ))}
                  </h1>
                  <p className="sub">{hero.summary[locale]}</p>
                  <p className="showcase-actions">
                    <a className="btn" href={CONSOLE_URL} rel="noopener">
                      {hero.signIn[locale]}
                    </a>
                  </p>
                  <p className="sub dim">{hero.signInNote[locale]}</p>
                </div>
              </div>
              <Shot art={hero.art} locale={locale} lead />
            </div>
          </header>

          <Section id="does" label={does.label} heading={does.heading} locale={locale}>
            <ol className="showcase-stages">
              {does.items.map((item, i) => (
                <li key={item.verb.en}>
                  <p className="showcase-stage-verb">
                    <span className="label-hash">#{i + 1}</span> {item.verb[locale]}
                  </p>
                  <h3>{item.heading[locale]}</h3>
                  <p>{item.body[locale]}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="screens" label={shots.label} heading={shots.heading} locale={locale}>
            <p className="prose dim">{shots.note[locale]}</p>
            {shots.items.map((shot) => (
              <div key={shot.src}>
                <Shot art={shot} locale={locale} />
                <p className="sub dim">{shot.caption[locale]}</p>
              </div>
            ))}
          </Section>

          <Section id="notice" label={notice.label} heading={notice.heading} locale={locale}>
            <p className="prose">{notice.body[locale]}</p>
            <ul className="bullets">
              {notice.points[locale].map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Shot art={notice.art} locale={locale} />
          </Section>

          <Section id="privacy" label={privacy.label} heading={privacy.heading} locale={locale}>
            <p className="prose">{privacy.body[locale]}</p>
            <p className="sub">
              <a className="nowrap" href={CONSOLE_PRIVACY_URL} rel="noopener">
                {privacy.policy[locale]}
              </a>
            </p>
          </Section>

          <Section id="faq" label={faq.label} heading={faq.heading} locale={locale}>
            <div className="showcase-faq">
              {faq.items.map((item) => (
                <details key={item.question.en}>
                  <summary>{item.question[locale]}</summary>
                  <p className="prose">{item.answer[locale]}</p>
                </details>
              ))}
            </div>
            <p className="sub dim">
              <a className="nowrap" href={showcase}>
                vvv
              </a>
            </p>
          </Section>

          <Footer locale={locale} />
        </div>
      </main>
    </>
  )
}
