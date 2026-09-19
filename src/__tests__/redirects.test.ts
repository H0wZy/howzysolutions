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
