import type { Locale } from '../content/i18n/types'
import type { Project } from '../content/types'
import { PROJECT_STATE } from '../content/types'
import { translate } from '../locale'

function StateBadge({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <span className={`badge badge-${project.state}`}>
      {translate(locale, PROJECT_STATE[project.state])}
    </span>
  )
}

/**
 * The metadata line separates its fields with a rule drawn in CSS rather than a
 * character (FR-003). It used to read `a · b · c · d · e — 368 commits · start → end`,
 * which is six middle dots, an em dash and an arrow in one line. The stack was
 * always a list in the data; now it is one in the markup too, and the separation
 * is geometry. See research.md D3.
 */
function MetaList({ items }: { items: string[] }) {
  return (
    <ul className="meta-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ProjectList({ projects, locale }: { projects: Project[]; locale: Locale }) {
  return (
    <ol className="project-list">
      {projects.map((project) => (
        <li key={project.id} className="project-row reveal">
          <div className="project-row-head">
            <a className="project-row-name" href={`/work/${project.id}/`}>
              {project.name}
            </a>
            <StateBadge project={project} locale={locale} />
          </div>
          <p className="project-row-summary">{project.summary[locale]}</p>
          <div className="project-row-meta">
            <MetaList items={project.stack.flatMap((g) => g.items).slice(0, 5)} />
            <MetaList
              items={[
                `${project.commits} ${translate(locale, 'work.commits')}`,
                translate(locale, 'work.period', {
                  start: project.period.start,
                  end: project.period.end,
                }),
              ]}
            />
          </div>
        </li>
      ))}
    </ol>
  )
}
