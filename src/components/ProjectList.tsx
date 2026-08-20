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
          <p className="project-row-meta">
            {project.stack.flatMap((g) => g.items).slice(0, 5).join(' · ')}
            {' — '}
            {project.commits} {translate(locale, 'work.commits')}
            {' · '}
            {project.period.start} → {project.period.end}
          </p>
        </li>
      ))}
    </ol>
  )
}
