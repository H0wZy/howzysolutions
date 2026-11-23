import type { Metadata } from 'next'
import { Document } from '../../views/Document'
import { ORIGIN, alternates, metaFor, pathnameOf, routes, type PathParams } from '../../site'

/**
 * One page for every document. The URLs are the ones src/site.ts lists, each
 * prerendered at build time; anything else is a plain 404, never the home page
 * with a 200 (the Vite site's rule, kept).
 */
export const dynamicParams = false

export function generateStaticParams(): PathParams[] {
  return routes().map(({ pathname }) => ({ path: pathname.split('/').filter(Boolean) }))
}

export async function generateMetadata({ params }: { params: Promise<PathParams> }): Promise<Metadata> {
  const pathname = pathnameOf((await params).path)
  const meta = metaFor(pathname)
  const image = `${ORIGIN}${meta.image}`
  return {
    metadataBase: new URL(ORIGIN),
    title: { absolute: meta.title },
    description: meta.description,
    icons: {
      icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    alternates: {
      canonical: `${ORIGIN}${pathname}`,
      languages: Object.fromEntries(alternates(pathname).map((a) => [a.locale, `${ORIGIN}${a.href}`])),
    },
    openGraph: {
      type: 'website',
      siteName: 'Howzy Solutions',
      title: meta.title,
      description: meta.description,
      images: [{ url: image, width: 1200, height: 630, alt: meta.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [{ url: image, alt: meta.imageAlt }],
    },
  }
}

export default async function Page({ params }: { params: Promise<PathParams> }) {
  return <Document pathname={pathnameOf((await params).path)} />
}
