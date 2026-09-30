import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { render } from '../entry-server'
import { LOCALES } from '../content/i18n/types'
import { pathFor } from '../route'
import { CONSOLE_PRIVACY_URL, CONSOLE_URL } from '../content/showcase-vvv-live'

/*
 * vvv spec 039 FR-043, as amended on 2026-09-30: the console's page has no form,
 * sets no cookie, collects no personal data and loads with the console down.
 * The amendment exists because Cloudflare Web Analytics, which the operator
 * keeps on, adds a script at the edge that this repository does not contain.
 * These checks read the HTML the repository emits, so they can neither see that
 * script nor prove its absence; what they do is hold the page to two things it
 * can control: the HTML loads nothing of its own from another origin, and the
 * copy discloses the script, so a page that stops saying so fails here.
 */
describe.each(LOCALES)('/vvv/live/ in %s', (locale) => {
  const html = render(pathFor({ page: 'vvvLive' }, locale))
  const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)))

  it('discloses the edge-injected visit counter instead of denying it', () => {
    expect(html).toContain('static.cloudflareinsights.com')
    expect(html).toMatch(/Cloudflare/)
    // The claims the page can no longer make while the counter is on.
    expect(html).not.toMatch(/runs no analytics|no analytics(?![a-z])(?! of its own)|não roda analytics|não carrega script, fonte ou imagem de outro site|collects nothing|não coleta nada/i)
  })

  it('has no form and no input to collect anything with', () => {
    expect(html).not.toMatch(/<form|<input|<textarea|<select/i)
  })

  it('references another origin only in the two links to the console (the counter is added at the edge)', () => {
    const external = [...html.matchAll(/(?:href|src|action)="(https?:\/\/[^"]+)"/g)].map((m) => m[1])
    expect(external.sort()).toEqual([CONSOLE_PRIVACY_URL, CONSOLE_URL].sort())
    expect(html).not.toMatch(/<link[^>]+href="https?:/i)
    expect(html).not.toMatch(/<script[^>]+src="https?:/i)
  })

  it('names no console origin in an attribute that loads anything', () => {
    // A link is followed by the visitor; an image, script or frame would be fetched by the page.
    expect(html).not.toMatch(/<(img|script|iframe|link)[^>]+vvv(-hml)?\.howzysolutions\.com/i)
  })

  it('points every image at a same-origin file that exists under public/', () => {
    for (const src of [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])) {
      expect(src.startsWith('/'), src).toBe(true)
      expect(() => read(`../../public${src}`), src).not.toThrow()
    }
  })
})
