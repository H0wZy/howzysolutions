import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { render } from '../entry-server'
import { LOCALES } from '../content/i18n/types'
import { pathFor } from '../route'
import { CONSOLE_PRIVACY_URL, CONSOLE_URL } from '../content/showcase-vvv-live'

/*
 * vvv spec 039 FR-043: the console's page collects no data and loads with the
 * console down. Both are properties of the emitted HTML, so they are checked on
 * the HTML: no form, no script that reaches out, and no reference to another
 * origin except the two links a visitor has to follow to leave.
 */
describe.each(LOCALES)('/vvv/live/ in %s', (locale) => {
  const html = render(pathFor({ page: 'vvvLive' }, locale))
  const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)))

  it('has no form and no input to collect anything with', () => {
    expect(html).not.toMatch(/<form|<input|<textarea|<select/i)
  })

  it('references another origin only in the two links to the console', () => {
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
