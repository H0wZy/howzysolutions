import { content } from '../content'
import { vvvShowcase } from '../content/showcase-vvv'
import { locationFor } from '../route'
import { Cv } from './Cv'
import { Home } from './Home'
import { Legal } from './Legal'
import { LiveShowcase } from './LiveShowcase'
import { Mcp } from './Mcp'
import { Services } from './Services'
import { Showcase } from './Showcase'
import { Work } from './Work'
import { WorkIndex } from './WorkIndex'

/**
 * The body of one document: the route in `pathname` picks the view. The Next
 * app has a single catch-all page that renders this for every URL it
 * prerenders (src/app/[[...path]]/page.tsx), which is how the site keeps the
 * URL scheme the Vite build had, `/pt/` twins and trailing slashes included.
 *
 * It replaces what src/App.tsx (the hydrating pages) and the render() half of
 * src/entry-server.tsx (the static ones) did between them.
 */
export function Document({ pathname }: { pathname: string }) {
  const { route, locale } = locationFor(pathname)
  switch (route.page) {
    case 'home':
      return <Home content={content} locale={locale} pathname={pathname} />
    case 'services':
      return <Services content={content} locale={locale} pathname={pathname} />
    case 'cv':
      return <Cv content={content} locale={locale} pathname={pathname} />
    case 'mcp':
      return <Mcp content={content} locale={locale} pathname={pathname} />
    case 'work':
      return <Work content={content} locale={locale} projectId={route.id} pathname={pathname} />
    case 'workIndex':
      return <WorkIndex content={content} locale={locale} pageNumber={route.number} pathname={pathname} />
    case 'vvv':
      return <Showcase showcase={vvvShowcase} content={content} locale={locale} pathname={pathname} />
    case 'vvvLive':
      return <LiveShowcase locale={locale} pathname={pathname} />
    case 'privacy':
    case 'terms':
      return <Legal content={content} kind={route.page} locale={locale} pathname={pathname} />
    case 'legalApp':
      return <Legal content={content} kind={route.doc} appId={route.id} locale={locale} pathname={pathname} />
  }
}
