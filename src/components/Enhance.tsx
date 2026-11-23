'use client'

import { useEffect } from 'react'
import type { Locale } from '../content/i18n/types'
import { initLocaleControl } from '../enhance/locale-control'
import { initReveal } from '../enhance/reveal'
import { smoothScrollBy } from '../enhance/scroll'
import { initSectionRail } from '../enhance/section-rail'
import { initThemeControl } from '../enhance/theme-control'

/**
 * The site's progressive enhancements, mounted once per document. It renders
 * nothing: every effect finds markup the server already produced and adds
 * behaviour to it, so a document without scripting is complete.
 *
 * The page-specific ones (the home page's motion, the services page's index and
 * form) are chunks of their own, fetched only by the page that has something
 * for them to attach to. This took over from `enhance()` in the Vite build's
 * the old client entry.
 */
export function Enhance({ locale }: { locale: Locale }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a')
      // Same page only: `/services/#contato` clicked on the home page must
      // navigate, not scroll to a different element that shares the id.
      const el =
        a?.hash && a.pathname === window.location.pathname ? document.getElementById(a.hash.slice(1)) : null
      if (a && el) {
        e.preventDefault()
        smoothScrollBy(el.getBoundingClientRect().top - 80)
        history.pushState(null, '', a.hash)
      }
    }
    document.addEventListener('click', onClick)
    initReveal()
    initSectionRail()
    initThemeControl(locale)
    initLocaleControl()
    const page = document.querySelector<HTMLElement>('.site')?.dataset.page
    if (page === 'home') void import('../enhance/home').then((m) => m.initHome())
    if (page === 'services') void import('../enhance/services').then((m) => m.initServices())
    return () => document.removeEventListener('click', onClick)
  }, [locale])

  return null
}
