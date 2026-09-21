import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import type { Project, Technology } from '../content/types'
import { PROJECT_KIND, PROJECT_STATE, STACK_GROUP } from '../content/types'
import { periodLabel, stats, trackedTimeFor } from '../content/stats'
import { SourceLink } from './SourceLink'
import { translate } from '../locale'
import { pathFor } from '../route'
import { projectTopicAnchors } from '../navigation'
import { Badge } from './ui/badge'

function Block({
  anchor,
  labelKey,
  locale,
  children,
}: {
  anchor: string
  labelKey: Parameters<typeof translate>[1]
  locale: Locale
  children: ReactNode
}) {
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
  const sections = projectTopicAnchors(project, Boolean(tracked))
  const content: Record<string, ReactNode> = {
    problem: <p>{project.problem[locale]}</p>,
    capabilities: (
      <ul className="bullets">
        {project.capabilities[locale].map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    ),
    stack: (
      <div className="stack-groups">
        {project.stack.map((group) => (
          <div key={group.group} className="stack-group">
            <h3>{translate(locale, STACK_GROUP[group.group])}</h3>
            <p>{group.items.map(nameOf).join(' · ')}</p>
          </div>
        ))}
      </div>
    ),
    metrics: project.metrics?.length ? (
      <dl className="metrics">
        {project.metrics.map((metric) => (
          <div key={metric.label[locale]} className="metric">
            <dt>{metric.label[locale]}</dt>
            <dd>
              <strong>{metric.value}</strong>
              <span className="metric-source">{metric.source[locale]}</span>
            </dd>
          </div>
        ))}
      </dl>
    ) : null,
    development: project.development[locale].map((paragraph) => (
      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
    )),
    limitations: (
      <ul className="bullets bullets-limitations">
        {project.limitations[locale].map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    ),
    roadmap: project.roadmap ? (
      <ul className="bullets">
        {project.roadmap[locale].map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    ) : null,
    trackedTime: tracked ? (
      <p>
        <strong>{tracked.text}</strong>{' '}
        <span className="metric-source">
          <SourceLink locale={locale} />
          {` · ${translate(locale, period.key, period.params)}`}
        </span>
      </p>
    ) : null,
    links: project.links?.length ? (
      <ul className="bullets">
        {project.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer noopener">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    ) : null,
  }

  return (
    <article className="detail">
      <header className="detail-head">
        <h1>{project.name}</h1>
        <p className="detail-meta">
          <Badge>{translate(locale, PROJECT_KIND[project.kind])}</Badge>{' '}
          <Badge className={`badge-${project.state}`}>
            {translate(locale, PROJECT_STATE[project.state])}
          </Badge>
        </p>
        {project.context ? <p className="detail-context">{project.context[locale]}</p> : null}
        <p className="detail-meta dim">
          {project.period.start} → {project.period.end} · {project.commits}{' '}
          {translate(locale, 'work.commits')}
        </p>
      </header>

      {project.id === 'mcp' ? (
        <div className="p-4 rounded bg-[var(--surface)] border border-[var(--accent)] flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <strong className="text-sm text-[var(--fg)] block font-mono">
              {locale === 'pt' ? 'Showcase Interativo & Live Hub' : 'Interactive Showcase & Live Hub'}
            </strong>
            <span className="text-xs text-[var(--dim)]">
              {locale === 'pt'
                ? 'Acesse a demonstracao visual com TUI, bridges de IA, conectores e documentacao.'
                : 'Access the visual preview with TUI, AI bridges, connector widgets and docs.'}
            </span>
          </div>
          <a
            href={pathFor({ page: 'mcp' }, locale)}
            className="btn text-xs font-mono"
          >
            {locale === 'pt' ? 'Abrir Showcase' : 'Open Showcase'} →
          </a>
        </div>
      ) : null}

      {sections.map((section) => (
        <Block key={section.id} anchor={section.id} labelKey={section.labelKey} locale={locale}>
          {content[section.id]}
        </Block>
      ))}

      <p className="detail-back">
        <a href={pathFor({ page: 'workIndex', number: 1 }, locale)}>
          ← {translate(locale, 'work.backToAll')}
        </a>
      </p>
    </article>
  )
}
