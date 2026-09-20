import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { Chrome } from '../components/Chrome'
import { ProjectDetail } from '../components/ProjectDetail'
import { SectionRail } from '../components/SectionRail'
import { trackedTimeFor } from '../content/stats'
import { projectTopicAnchors } from '../navigation'

export function Work({
  content,
  locale,
  projectId,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  projectId: string
  pathname: string
}) {
  const project = content.projects.find((p) => p.id === projectId)

  // Prerendering only emits pages for real ids, so this is the deep-link-to-a-
  // removed-project case (spec edge case) rather than a routing bug.
  if (!project) {
    return (
      <>
        <Chrome locale={locale} pathname={pathname} />
        <main className="section">
          <div className="wrap">
            <h1>404</h1>
            <p className="prose">
              <a href="/">← /</a>
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      {/* The leaf crumb is the project's own name: data, not a dictionary
          string, because it is identical in both locales (FR-054). */}
      <Chrome
        locale={locale}
        pathname={pathname}
        leafLabel={project.name}
      />
      <main className="document-layout">
        <SectionRail
          entries={projectTopicAnchors(project, Boolean(trackedTimeFor(project.wakatimeProject)))}
          locale={locale}
        />
        <div className="document-body section">
          <div className="wrap">
            <ProjectDetail
              project={project}
              technologies={content.technologies}
              locale={locale}
            />
          </div>
        </div>
      </main>
    </>
  )
}
