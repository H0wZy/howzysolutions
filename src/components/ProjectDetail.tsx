import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import type { Project, Technology } from '../content/types'
import { PROJECT_KIND, PROJECT_STATE, STACK_GROUP } from '../content/types'
import { periodLabel, stats, trackedTimeFor } from '../content/stats'
import { translate } from '../locale'
import { pathFor } from '../route'

function Block({
  labelKey,
  locale,
  children,
}: {
  labelKey: Parameters<typeof translate>[1]
  locale: Locale
  children: ReactNode
}) {
  // `project.problem` -> `problem`: a stable, readable fragment id per topic,
  // so a detail page is linkable section by section the way documentation is
  // (research D8, resolved).
  const anchor = labelKey.split('.')[1] ?? labelKey

  return (
    <section className="detail-block" id={anchor}>
      {/* The only heading this region has — styled as a "##" comment via
          .label, but it must be a real heading: the stack block's per-group
          h3s (frontend/backend/...) need an h2 ancestor or the page's
          heading order breaks (WCAG 1.3.1 / Lighthouse heading-order). */}
      <h2 className="label">
        <a className="label-link" href={`#${anchor}`}>
          <span className="label-hash" aria-hidden="true">
            ##
          </span>
          {translate(locale, labelKey)}
        </a>
      </h2>
      {children}
    </section>
  )
}

export function ProjectDetail({
  project,
  technologies,
  locale,
}: {
  project: Project
  technologies: Technology[]
  locale: Locale
}) {
  const nameOf = (id: string) => technologies.find((t) => t.id === id)?.name ?? id
  const tracked = trackedTimeFor(project.wakatimeProject)
  const period = periodLabel(stats)

  return (
    <article className="detail">
      <header className="detail-head">
        <h1>{project.name}</h1>
        <p className="detail-meta">
          <span className={`badge badge-${project.state}`}>
            {translate(locale, PROJECT_STATE[project.state])}
          </span>{' '}
          <span className="dim">{translate(locale, PROJECT_KIND[project.kind])}</span>
        </p>
        {project.context ? <p className="detail-context">{project.context[locale]}</p> : null}
        <p className="detail-meta dim">
          {project.period.start} → {project.period.end} · {project.commits}{' '}
          {translate(locale, 'work.commits')}
        </p>
      </header>

      <Block labelKey="project.problem" locale={locale}>
        <p>{project.problem[locale]}</p>
      </Block>

      <Block labelKey="project.capabilities" locale={locale}>
        <ul className="bullets">
          {project.capabilities[locale].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Block>

      <Block labelKey="project.stack" locale={locale}>
        <div className="stack-groups">
          {project.stack.map((group) => (
            <div key={group.group} className="stack-group">
              <h3>{translate(locale, STACK_GROUP[group.group])}</h3>
              <p>{group.items.map(nameOf).join(' · ')}</p>
            </div>
          ))}
        </div>
      </Block>

      {project.metrics?.length ? (
        <Block labelKey="project.metrics" locale={locale}>
          <dl className="metrics">
            {project.metrics.map((m) => (
              <div key={m.label[locale]} className="metric">
                <dt>{m.label[locale]}</dt>
                <dd>
                  <strong>{m.value}</strong>
                  {/* FR-027: a figure never appears without its source. */}
                  <span className="metric-source">{m.source[locale]}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Block>
      ) : null}

      <Block labelKey="project.development" locale={locale}>
        {project.development[locale].map((para) => (
          <p key={para.slice(0, 40)}>{para}</p>
        ))}
      </Block>

      {/*
        FR-004: limitations get the same prominence as capabilities. This is the
        editorial rule the whole portfolio is built on, not a disclaimer section.
      */}
      <Block labelKey="project.limitations" locale={locale}>
        <ul className="bullets bullets-limitations">
          {project.limitations[locale].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Block>

      {project.roadmap?.[locale].length ? (
        <Block labelKey="project.roadmap" locale={locale}>
          <ul className="bullets">
            {project.roadmap[locale].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Block>
      ) : null}

      {/* Rendered only when a measured figure exists — never a zero (data-model rule). */}
      {tracked ? (
        <Block labelKey="project.trackedTime" locale={locale}>
          <p>
            <strong>{tracked.text}</strong>{' '}
            <span className="metric-source">
              {translate(locale, 'stats.source')} ·{' '}
              {translate(locale, period.key, period.params)}
            </span>
          </p>
        </Block>
      ) : null}

      {project.links?.length ? (
        <Block labelKey="project.links" locale={locale}>
          <ul className="bullets">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer noopener">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      <p className="detail-back">
        <a href={pathFor({ page: 'workIndex', number: 1 }, locale)}>
          ← {translate(locale, 'work.backToAll')}
        </a>
      </p>
    </article>
  )
}
