import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { render } from '../entry-server'
import { LOCALES } from '../content/i18n/types'
import { pathFor } from '../route'
import { CONSOLE_PRIVACY_URL, CONSOLE_URL } from '../content/showcase-vvv-live'

/*
 * vvv spec 039 FR-043, as amended on 2026-09-30: the console's page has no form,
 * sets no cookie of its own, collects no personal data and loads with the console down.
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

  it('claims no cookie of its own, in the title and in the body, never an absolute no-cookie', () => {
    // The privacy policy reserves the strictly necessary security cookie Cloudflare may set, so a page
    // that links to it cannot promise more. The qualifier must be in both places (title and body), and
    // any other 'no cookie' wording, singular or plural, is a claim of ours the policy does not make.
    // Cloudflare's own 'no cookies or local storage' is allowed: it is attributed, and tested below.
    const own = locale === 'en' ? /cookies? of its own/gi : /cookies? próprios?/gi
    const absolute =
      locale === 'en'
        ? /\bno cookies?\b(?! of its own| or local storage)|\bnever sets? (?:a |any )?cookies?/i
        : /\bsem cookies?\b(?! próprios?| nem armazenamento)|\bnão (?:define|grava|usa) cookies?\b(?! próprios?| nem armazenamento)|\bnunca define cookies?/i
    expect(html.match(own)?.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(html).not.toMatch(absolute)
  })

  it('attributes the no-cookie claim about the counter to Cloudflare instead of stating it as ours', () => {
    const attributed =
      locale === 'en'
        ? /Cloudflare states that this counting uses no cookies or local storage/
        : /A Cloudflare afirma que essa contagem não usa cookies nem armazenamento local/
    expect(html).toMatch(attributed)
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
