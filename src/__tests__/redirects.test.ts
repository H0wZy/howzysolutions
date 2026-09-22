import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { LOCALES } from '../content/i18n/types'
import { pathFor } from '../route'

/**
 * The privacy policy moved from /privacy/ to /privacy-policy/ after TikTok
 * Shop's review had been sent with the old URL. This fails if the redirect is
 * dropped or stops landing on the route's real path.
 */
const rules = readFileSync(fileURLToPath(new URL('../../public/_redirects', import.meta.url)), 'utf8')
  .split('\n')
  .filter((line) => line.trim() && !line.startsWith('#'))
  .map((line) => line.trim().split(/\s+/))

describe('the old /privacy/ link', () => {
  it.each(LOCALES)('%s: 301s to the privacy policy route', (locale) => {
    const target = pathFor({ page: 'privacy' }, locale)
    const old = locale === 'en' ? '/privacy/' : `/${locale}/privacy/`
    for (const from of [old, old.slice(0, -1)]) {
      expect(rules, from).toContainEqual([from, target, '301'])
    }
  })
})

/**
 * The app was renamed from viralvideogen to vvv after its terms URL had been
 * given out, and its policy page and project page moved with it. This fails if
 * any of the three old paths stops landing on its new page.
 */
describe("the app's old URLs", () => {
  const moved = (locale: (typeof LOCALES)[number]) => [
    ['terms', '/terms-of-service/', pathFor({ page: 'legalApp', doc: 'terms', id: 'vvv' }, locale)],
    ['policy', '/privacy-policy/', pathFor({ page: 'legalApp', doc: 'privacy', id: 'vvv' }, locale)],
    ['project', '/works/', pathFor({ page: 'work', id: 'vvv' }, locale)],
  ]

  it.each(LOCALES)('%s: 301s every one to its renamed page', (locale) => {
    const prefix = locale === 'en' ? '' : `/${locale}`
    for (const [what, base, target] of moved(locale)) {
      const old = `${prefix}${base}viralvideogen/`
      for (const from of [old, old.slice(0, -1)]) {
        expect(rules, `${what}: ${from}`).toContainEqual([from, target, '301'])
      }
    }
  })
})

describe('the old /work/ links', () => {
  it.each(LOCALES)('%s: 301s to the works route', (locale) => {
    const target = pathFor({ page: 'workIndex', number: 1 }, locale)
    const old = locale === 'en' ? '/work/' : `/${locale}/work/`
    for (const from of [old, old.slice(0, -1)]) {
      expect(rules, from).toContainEqual([from, target, '301'])
    }
    const splatFrom = locale === 'en' ? '/work/*' : `/${locale}/work/*`
    const splatTarget = locale === 'en' ? '/works/:splat' : `/${locale}/works/:splat`
    expect(rules, splatFrom).toContainEqual([splatFrom, splatTarget, '301'])
  })
})

describe('clean CV routes', () => {
  it('redirects /cv.pdf to /cv.pdf/eng', () => {
    expect(rules).toContainEqual(['/cv.pdf', '/cv.pdf/eng', '302'])
    expect(rules).toContainEqual(['/cv.pdf/', '/cv.pdf/eng', '302'])
  })

  it('redirects /pt/cv.pdf to /cv.pdf/ptbr', () => {
    expect(rules).toContainEqual(['/pt/cv.pdf', '/cv.pdf/ptbr', '302'])
    expect(rules).toContainEqual(['/pt/cv.pdf/', '/cv.pdf/ptbr', '302'])
  })

  it('redirects /cv.md to /cv.md/eng', () => {
    expect(rules).toContainEqual(['/cv.md', '/cv.md/eng', '302'])
    expect(rules).toContainEqual(['/cv.md/', '/cv.md/eng', '302'])
  })

  it('redirects /pt/cv.md to /cv.md/ptbr', () => {
    expect(rules).toContainEqual(['/pt/cv.md', '/cv.md/ptbr', '302'])
    expect(rules).toContainEqual(['/pt/cv.md/', '/cv.md/ptbr', '302'])
  })
})

