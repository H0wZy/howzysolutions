import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import { locationFor, pathFor } from '../route'
import { topLevelLinks } from '../navigation'
import { ThemeControl } from './ThemeControl'
import { LocaleControl } from './LocaleControl'
import { Breadcrumb } from './Breadcrumb'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'

/**
 * Sticky editor-style bar, plus the breadcrumb beneath it.
 *
 * The breadcrumb lives here because every page already renders Chrome, and a
 * trail derived from the route needs no page to remember to ask for it —
 * which is the same reason FR-069 says it is derived rather than authored.
 *
 * The top-level links do the same job for the same reason (FR-084, SC-012).
 * Which ones render is `topLevelLinks`, next to the trail it mirrors, so the
 * reachability guarantee is a unit test rather than markup nobody can assert.
 */
export function Chrome({
  locale,
  pathname,
  controls,
  leafLabel,
}: {
  locale: Locale
  pathname: string
  controls?: ReactNode
  /** The current page's own name, where that name is data (a project). */
  leafLabel?: string
}) {
  const { route } = locationFor(pathname)

  return (
    <header className="chrome">
      <div className="chrome-brand">
        <a className="chrome-mark" href={pathFor({ page: 'home' }, locale)} aria-label="H0wZy">
          <img src="/brand/h0wzy-mark-512.png" width="28" height="28" alt="" />
          <span>h0wzy</span>
        </a>
        <Breadcrumb route={route} locale={locale} leafLabel={leafLabel} />
      </div>
      <div className="chrome-actions">
        <NavigationMenu aria-label={translate(locale, 'nav.primary')}>
          <NavigationMenuList>
            {topLevelLinks(route, locale).map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink className="chrome-btn" href={link.href}>
                  {translate(locale, link.labelKey)}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <span className="chrome-controls">
          {controls}
          <LocaleControl locale={locale} pathname={pathname} />
          <ThemeControl locale={locale} />
        </span>
      </div>
    </header>
  )
}
