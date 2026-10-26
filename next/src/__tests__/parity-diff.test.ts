import { describe, expect, it } from 'vitest'
import { applyAllow, diffPages, firstDiff, formatDiff, normalise, sitemapPaths, visibleText } from '../../scripts/parity-diff.mjs'

const viteDoc = `<!doctype html><html lang="en"><head><title>Marcos &amp; Co</title>
<link rel="canonical" href="https://howzysolutions.com/cv/">
<link rel="alternate" hreflang="pt" href="https://howzysolutions.com/pt/cv/">
<link rel="alternate" hreflang="en" href="https://howzysolutions.com/cv/">
<meta name="description" content="A CV"><style>p{color:red}</style></head>
<body><script>var x = 1</script><main><h1>Hello</h1>
  <p>one   two&nbsp;three</p><template><p>hidden</p></template><noscript>no</noscript></main></body></html>`

// The same page as React renders it: comments between text nodes, other whitespace, other attribute order.
const nextDoc = `<!DOCTYPE html><html lang="en"><head><meta name="description" content="A CV"/>
<link href="https://howzysolutions.com/cv/" rel="alternate" hreflang="en"/>
<link href="https://howzysolutions.com/pt/cv/" rel="alternate" hreflang="pt"/>
<link rel="canonical" href="https://howzysolutions.com/cv/"/><title>Marcos &amp; Co</title></head>
<body><main><h1>Hello</h1><!-- --><p>one two three</p></main><script>self.__x=1</script></body></html>`

describe('parity-diff normaliser', () => {
  it('strips script, style, template and noscript and collapses whitespace', () => {
    expect(visibleText(viteDoc)).toBe('Hello one two three')
  })

  it('extracts the compared fields', () => {
    expect(normalise(viteDoc)).toEqual({
      lang: 'en',
      title: 'Marcos & Co',
      text: 'Hello one two three',
      canonical: 'https://howzysolutions.com/cv/',
      hreflang: 'en https://howzysolutions.com/cv/\npt https://howzysolutions.com/pt/cv/',
      description: 'A CV',
    })
  })

  it('reads the sitemap locations as pathnames', () => {
    const xml = '<urlset><url><loc>https://howzysolutions.com/</loc></url><url><loc>https://howzysolutions.com/pt/cv/</loc></url></urlset>'
    expect(sitemapPaths(xml)).toEqual(['/', '/pt/cv/'])
  })
})

describe('parity-diff comparison', () => {
  it('finds no difference between two renderings of the same page', () => {
    expect(diffPages({ status: 200, html: viteDoc }, { status: 200, html: nextDoc })).toEqual([])
  })

  it('reports each field that differs, and the printer shows the first 80 differing characters', () => {
    const changed = nextDoc.replace('lang="en"', 'lang="pt"').replace('<h1>Hello</h1>', '<h1>Hello there, this heading was changed on purpose and it is quite long indeed</h1>')
    const diffs = diffPages({ status: 200, html: viteDoc }, { status: 404, html: changed })
    expect(diffs.map((d) => d.field)).toEqual(['status', 'lang', 'text'])
    const text = diffs.find((d) => d.field === 'text')
    expect(text).toBeDefined()
    if (!text) return
    expect(firstDiff(text.a, text.b)).toBe('Hello '.length)
    const lines = formatDiff('/cv/', text).split('\n')
    expect(lines[0]).toBe('/cv/ [text] at 6')
    expect(lines[1]).toBe('  a: "one two three"')
    expect(JSON.parse(lines[2].slice(5))).toHaveLength(80)
  })

  it('an allow entry removes only its URL and field, and needs a reason', () => {
    const diffs = [
      { field: 'status', a: '307', b: '308' },
      { field: 'text', a: 'x', b: 'y' },
    ]
    expect(applyAllow('/cv', diffs, [{ url: '/cv', field: 'status', reason: 'accepted' }])).toEqual([diffs[1]])
    expect(applyAllow('/other', diffs, [{ url: '/cv', field: 'status', reason: 'accepted' }])).toEqual(diffs)
    expect(() => applyAllow('/cv', diffs, [{ url: '/cv', field: 'status', reason: ' ' }])).toThrow(/reason/)
  })
})
