import { ORIGIN, alternates, routes } from '../../site'

export const dynamic = 'force-static'

/** The sitemap, from the same route list the pages are prerendered from. */
export function GET() {
  const urls = routes().map(({ pathname }) => {
    const alts = alternates(pathname)
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.locale}" href="${ORIGIN}${a.href}" />`)
      .join('\n')
    const priority =
      pathname === '/' || pathname === '/pt/'
        ? '1.0'
        : pathname.startsWith('/works/') || pathname.startsWith('/pt/works/')
          ? '0.8'
          : '0.6'
    return `  <url>
    <loc>${ORIGIN}${pathname}</loc>
${alts}
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
