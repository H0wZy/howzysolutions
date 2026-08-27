import { Fragment } from 'react'
import type { Locale } from '../content/i18n/types'
import { trailFor } from '../navigation'
import { translate } from '../locale'
import type { Route } from '../route'
import {
  Breadcrumb as Root,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

/**
 * The path to the current page (FR-069, FR-070, FR-075).
 *
 * Every ancestor is a real `a[href]`; the final item is not a link and carries
 * `aria-current="page"`, so the current position is programmatic rather than
 * painted. The whole thing is complete in the prerendered document and needs
 * no script (FR-046).
 *
 * The shadcn primitive supplies the markup shape and ships no behaviour this
 * depends on. Its `aria-label` is set here rather than there because FR-075
 * requires the landmark's name to be in the active locale.
 */
export function Breadcrumb({
  route,
  locale,
  leafLabel,
}: {
  route: Route
  locale: Locale
  /** The current page's own name, when it is data rather than a dictionary key. */
  leafLabel?: string
}) {
  const trail = trailFor(route, locale, leafLabel)
  if (trail.length === 0) return null

  return (
    <Root className="breadcrumb" aria-label={translate(locale, 'nav.breadcrumb')}>
      <BreadcrumbList>
        {trail.map((crumb, index) => {
          const text = crumb.labelKey ? translate(locale, crumb.labelKey) : (crumb.label ?? '')
          return (
            // The separator is a SIBLING of the item, not a child of it: it is
            // its own presentational <li>, which is what keeps the list a list
            // of steps rather than a list of steps-with-punctuation-inside.
            <Fragment key={`${crumb.href ?? 'current'}-${text}`}>
              <BreadcrumbItem>
                {crumb.href === null ? (
                  <BreadcrumbPage>{text}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{text}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < trail.length - 1 ? <BreadcrumbSeparator /> : null}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Root>
  )
}
