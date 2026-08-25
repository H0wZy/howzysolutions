import { content } from './content'
import { locationFor } from './route'
import { Home } from './pages/Home'
import { Work } from './pages/Work'
import { WorkIndex } from './pages/WorkIndex'

export default function App({ pathname }: { pathname: string }) {
  const { route, locale } = locationFor(pathname)
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
  return <Home content={content} locale={locale} pathname={pathname} />
}
