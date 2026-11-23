import { describe, expect, it } from 'vitest'
import { privacy } from '../content/privacy'
import { terms } from '../content/terms'
import { LOCALES } from '../content/i18n/types'
import { pathFor } from '../route'
import { routes } from '../site'

/**
 * The legal documents are prerendered like every other document now (under the
 * Vite build they were the ones that skipped hydration; the Next app serves
 * every route the same way). What is left to hold is that each one is a real
 * route in both locales and says something in every section.
 */

describe('every legal route is a real prerendered document', () => {
  const emitted = new Set(routes().map((r) => r.pathname))

  it.each(LOCALES)('%s: emits each index and one page per app of each', (locale) => {
    for (const [doc, document] of [
      ['privacy', privacy],
      ['terms', terms],
    ] as const) {
      expect(emitted).toContain(pathFor({ page: doc }, locale))
      expect(document.projects.length, `${doc} has no app block`).toBeGreaterThan(0)
      for (const app of document.projects) {
        expect(emitted).toContain(pathFor({ page: 'legalApp', doc, id: app.id }, locale))
      }
    }
  })
})

describe('both documents are complete in both locales', () => {
  it.each([
    ['privacy', privacy],
    ['terms', terms],
  ] as const)('%s: dates itself and says something in every section', (_name, document) => {
    expect(document.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const blocks = [
      ...document.sections,
      ...document.projects.flatMap((entry) => entry.sections),
    ]
    expect(blocks.length).toBeGreaterThan(0)
    for (const locale of LOCALES) {
      expect(document.intro[locale].trim()).not.toBe('')
      for (const block of blocks) {
        expect(block.heading[locale].trim(), `${block.id} heading`).not.toBe('')
        const prose = block.body[locale].length + (block.items?.[locale].length ?? 0)
        expect(prose, `${block.id} body`).toBeGreaterThan(0)
      }
    }
  })

  it('keeps every anchor unique across a document', () => {
    for (const document of [privacy, terms]) {
      const ids = [
        ...document.sections.map((s) => s.id),
        ...document.projects.flatMap((entry) => [
          entry.id,
          ...entry.sections.map((s) => s.id),
        ]),
      ]
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
