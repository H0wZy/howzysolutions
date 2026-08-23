import { content } from './content'
import { locationFor } from './route'
import { Home } from './pages/Home'
import { Work } from './pages/Work'

export default function App({ pathname }: { pathname: string }) {
  const { route, locale } = locationFor(pathname)
  return route.page === 'work' ? (
    <Work content={content} locale={locale} projectId={route.id} pathname={pathname} />
  ) : (
    <Home content={content} locale={locale} pathname={pathname} />
  )
}
