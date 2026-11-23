import { content } from './content'
import { locationFor } from './route'
import { Work } from './pages/Work'
import { WorkIndex } from './pages/WorkIndex'
import { Cv } from './pages/Cv'
import { Mcp } from './pages/Mcp'

export default function App({ pathname }: { pathname: string }) {
  const { route, locale } = locationFor(pathname)
  if (route.page === 'cv') {
    return <Cv content={content} locale={locale} pathname={pathname} />
  }
  if (route.page === 'mcp') {
    return <Mcp content={content} locale={locale} pathname={pathname} />
  }
  if (route.page === 'work') {
    return <Work content={content} locale={locale} projectId={route.id} pathname={pathname} />
  }
  if (route.page === 'workIndex') {
    return (
      <WorkIndex
        content={content}
        locale={locale}
        pageNumber={route.number}
        pathname={pathname}
      />
    )
  }
  // The home page and /services/ are static documents (src/route.ts) and are
  // rendered by the server entry, never by this component.
  return null
}
