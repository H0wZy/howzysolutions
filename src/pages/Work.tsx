import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { Chrome } from '../components/Chrome'
import { ProjectDetail } from '../components/ProjectDetail'

export function Work({
  content,
  locale,
  projectId,
}: {
  content: ContentBundle
  locale: Locale
  projectId: string
}) {
  const project = content.projects.find((p) => p.id === projectId)

  // Prerendering only emits pages for real ids, so this is the deep-link-to-a-
  // removed-project case (spec edge case) rather than a routing bug.
  if (!project) {
    return (
      <>
        <Chrome locale={locale} path="h0wzy/work" />
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
      <Chrome locale={locale} path={`h0wzy/work/${project.id}`} />
      <main className="section">
        <div className="wrap">
          <ProjectDetail
            project={project}
            technologies={content.technologies}
            locale={locale}
          />
        </div>
      </main>
    </>
  )
}
