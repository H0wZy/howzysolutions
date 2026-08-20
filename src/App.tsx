import type { Locale } from './content/i18n/types'
import { content } from './content'
import { routeFor } from './route'
import { Home } from './pages/Home'
import { Work } from './pages/Work'

export default function App({ pathname, locale }: { pathname: string; locale: Locale }) {
  const route = routeFor(pathname)
  return route.page === 'work' ? (
    <Work content={content} locale={locale} projectId={route.id} />
  ) : (
    <Home content={content} locale={locale} />
  )
}
