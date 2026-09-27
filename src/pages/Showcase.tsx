import type { ReactNode } from 'react'
import type { Locale, Localized } from '../content/i18n/types'
import type { ContentBundle, Showcase as ShowcaseRecord, ShowcaseArt } from '../content/types'
import { privacy } from '../content/privacy'
import { terms } from '../content/terms'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'
import { SectionRail } from '../components/SectionRail'
import { Footer } from '../components/Footer'
import { Metrics } from '../components/Metrics'

/**
 * A designed summary of one project (spec 004): the hero, the pipeline as a
 * terminal transcript, the stages, the rule, the lanes, the record's own
 * numbers, and a FAQ.
 *
 * A static document, like the legal pages: rendered by src/entry-server.tsx,
 * never imported by src/App.tsx, never hydrated. Nothing here has a handler
 * (the FAQ is `<details>`), so the page costs the JavaScript budget nothing.
 * Anything interactive added here has to move the page into App and pay for
 * itself against the budget.
 *
 * The project's facts (name, period, commits, metrics) come from its record,
 * so the showcase and /works/<id>/ cannot disagree about them.
 */

/**
 * Artwork is grayscale line work on pure black. `mix-blend-mode: lighten` in
 * the stylesheet lets the black lose to --bg, so the picture reads as printed
 * on the page: hermes-agent's technique, over this site's ground (plan D3).
 */
function Art({ art, locale, lead = false }: { art: ShowcaseArt; locale: Locale; lead?: boolean }) {
  return (
    <figure className={lead ? 'showcase-art showcase-art-lead' : 'showcase-art'}>
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

/** The `##` label is the anchor's affordance, as SectionLabel draws it on the home page. */
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

export function Showcase({
  showcase,
  content,
  locale,
  pathname,
}: {
  showcase: ShowcaseRecord
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { hero, pipeline, stages, rule, lanes, numbers, faq } = showcase
  const project = content.projects.find((p) => p.id === showcase.projectId)
  const record = pathFor({ page: 'work', id: showcase.projectId }, locale)
  /* A legal page is linked only when that record has a block for this app. */
  const legal = (['privacy', 'terms'] as const).filter((doc) =>
    (doc === 'privacy' ? privacy : terms).projects?.some((app) => app.id === showcase.projectId),
  )

  return (
    <>
      <Chrome locale={locale} pathname={pathname} />
      <main className="document-layout">
        <SectionRail
          entries={[
            { id: 'overview', label: hero.label },
            { id: 'pipeline', label: pipeline.label },
            { id: 'stages', label: stages.label },
            { id: 'rule', label: rule.label },
            { id: 'lanes', label: lanes.label },
            ...(project?.metrics?.length ? [{ id: 'numbers', label: numbers.label }] : []),
            { id: 'faq', label: faq.label },
          ]}
          locale={locale}
        />
        <div className="document-body">
          <header className="section showcase-hero" id="overview">
            <div className="wrap">
              <div className={hero.art ? 'hero-grid' : undefined}>
                <div className="hero-copy">
                  {/* The former name reads the way /works/<id>/ shows it, from the
                      same record field, so a reader who knows the old name finds it. */}
                  <p className="label">
                    {hero.kicker[locale]}
                    {project?.formerName ? (
                      <span className="showcase-former">old {project.formerName}</span>
                    ) : null}
                  </p>
                  <h1 className="showcase-title">
                    {hero.title[locale].map((line, i) => (
                      <span key={line}>
                        {i > 0 ? ' ' : null}
                        <span className="showcase-title-line">{line}</span>
                      </span>
                    ))}
                  </h1>
                  <p className="sub">{hero.summary[locale]}</p>
                  {project ? (
                    <p className="detail-meta dim">
                      {project.period.start} → {project.period.end} · {project.commits}{' '}
                      {translate(locale, 'work.commits')}
                    </p>
                  ) : null}
                  <p className="showcase-actions">
                    <a className="btn" href={record}>
                      {translate(locale, 'privacy.aboutProject')}
                    </a>
                  </p>
                </div>
                {hero.art ? <Art art={hero.art} locale={locale} lead /> : null}
              </div>
            </div>
          </header>

          <Section id="pipeline" label={pipeline.label} heading={pipeline.heading} locale={locale}>
            <p className="prose">{pipeline.intro[locale]}</p>
            <pre className="showcase-term">
              {pipeline.lines.map((line) => (
                <span key={line.command} className="showcase-term-line">
                  <span className="showcase-term-cmd">
                    <span className="term-prompt" aria-hidden="true">
                      ❯{' '}
                    </span>
                    <code>{line.command}</code>
                  </span>
                  <span className="showcase-term-note"># {line.note[locale]}</span>
                </span>
              ))}
            </pre>
          </Section>

          <Section id="stages" label={stages.label} heading={stages.heading} locale={locale}>
            <ol className="showcase-stages">
              {stages.items.map((stage, i) => (
                <li key={stage.verb.en}>
                  <p className="showcase-stage-verb">
                    <span className="label-hash">#{i + 1}</span> {stage.verb[locale]}
                  </p>
                  <h3>{stage.heading[locale]}</h3>
                  <p>{stage.body[locale]}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="rule" label={rule.label} heading={rule.heading} locale={locale}>
            <p className="prose">{rule.body[locale]}</p>
            <ul className="bullets">
              {rule.points[locale].map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            {rule.art ? <Art art={rule.art} locale={locale} /> : null}
          </Section>

          <Section id="lanes" label={lanes.label} heading={lanes.heading} locale={locale}>
            {lanes.art ? <Art art={lanes.art} locale={locale} /> : null}
            <div className="showcase-lanes">
              {lanes.items.map((lane) => (
                <div key={lane.name.en}>
                  <h3>{lane.name[locale]}</h3>
                  <p>{lane.body[locale]}</p>
                </div>
              ))}
            </div>
          </Section>

          {project?.metrics?.length ? (
            <Section id="numbers" label={numbers.label} heading={numbers.heading} locale={locale}>
              <p className="prose dim">{numbers.note[locale]}</p>
              <Metrics metrics={project.metrics} locale={locale} />
            </Section>
          ) : null}

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
              <a className="nowrap" href={record}>
                {translate(locale, 'privacy.aboutProject')}
              </a>
              {legal.map((doc) => (
                <span key={doc}>
                  {' · '}
                  <a
                    className="nowrap"
                    href={pathFor({ page: 'legalApp', doc, id: showcase.projectId }, locale)}
                  >
                    {translate(locale, doc === 'privacy' ? 'legal.privacyFor' : 'legal.termsFor')}
                  </a>
                </span>
              ))}
            </p>
          </Section>

          <Footer locale={locale} />
        </div>
      </main>
    </>
  )
}
