import type { ReactNode } from 'react'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource-variable/schibsted-grotesk/index.css'
import '../../index.css'
import { Enhance } from '../../components/Enhance'
import { StructuredData } from '../../components/StructuredData'
import { locationFor } from '../../route'
import { pathnameOf, type PathParams } from '../../site'

/**
 * The root layout lives inside the catch-all segment, which is the one place it
 * can know which document it is wrapping: <html lang> follows the URL, because
 * each locale is a real URL (FR-018) and no script is needed to say so.
 *
 * Dark is the only theme (constitution VI), so data-theme is a constant.
 * suppressHydrationWarning is for the two attributes the inline script below
 * may change before React looks: the stored locale and the intro class.
 */

/*
 * Runs before first paint, for the reason the Vite shell's script did: anything
 * inside React runs after, and that is the flash. It applies a stored locale and
 * decides whether this visit gets the home page's intro (first of the session,
 * home only, no deep link, motion allowed). No storage means no intro; the page
 * is complete without it.
 */
const BEFORE_PAINT = `;(function () {
  try {
    var locale = localStorage.getItem('h0wzy.locale')
    if (locale === 'en' || locale === 'pt') document.documentElement.lang = locale
  } catch (e) {}
  try {
    if (
      (location.pathname === '/' || location.pathname === '/pt/') &&
      !location.hash &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !sessionStorage.getItem('h0wzy.intro')
    ) {
      sessionStorage.setItem('h0wzy.intro', '1')
      document.documentElement.classList.add('intro-on')
    }
  } catch (e) {}
})()`

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<PathParams>
}) {
  const pathname = pathnameOf((await params).path)
  const { locale } = locationFor(pathname)
  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
        <StructuredData locale={locale} />
      </head>
      <body>
        {children}
        <Enhance locale={locale} />
      </body>
    </html>
  )
}
