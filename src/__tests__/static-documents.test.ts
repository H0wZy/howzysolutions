import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { content } from '../content'
import { privacy } from '../content/privacy'
import { terms } from '../content/terms'
import { LOCALES } from '../content/i18n/types'
import { isStaticDocument, locationFor, pathFor } from '../route'
import { routes } from '../entry-server'

/**
 * The legal documents are prerendered and never hydrated, which is the only
 * reason the terms of service fit under the JavaScript budget at all: HEAD was
 * measured at 119.98 KB of 120 KB before they were added, and the pages plus
 * their prose cost about 3 KB gzipped.
 *
 * The saving is entirely in what src/App.tsx does NOT import, and nothing about
 * a working page would break if someone put it back. It would just get 3 KB
 * more expensive, silently, on every other page of the site. This is what
 * fails instead.
 */

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
const app = read('../App.tsx')

describe('the legal documents stay out of the client bundle', () => {
  it('is not imported by App, directly or through the content bundle', () => {
    expect(app).not.toMatch(/from '\.\/pages\/Legal'/)
    expect(app).not.toMatch(/\bprivacy\b|\bterms\b/)
    // The records are exported, but not as part of what every page carries.
    expect(Object.keys(content)).not.toContain('privacy')
    expect(Object.keys(content)).not.toContain('terms')
  })

  it('is rendered by the server entry instead', () => {
    const entry = read('../entry-server.tsx')
    expect(entry).toMatch(/from '\.\/pages\/Legal'/)
  })

  it('is the set of routes the client skips hydration for', () => {
    expect(read('../main.tsx')).toMatch(/isStaticDocument/)
    for (const { pathname } of routes()) {
      const { route } = locationFor(pathname)
      const legal = ['privacy', 'terms', 'legalApp'].includes(route.page)
      expect(isStaticDocument(route), pathname).toBe(legal)
    }
  })
})

describe('every legal route is a real prerendered document', () => {
  const emitted = new Set(routes().map((r) => r.pathname))

  it.each(LOCALES)('%s: emits each index and one page per app of each', (locale) => {
    for (const [doc, document] of [
      ['privacy', privacy],
      ['terms', terms],
    ] as const) {
      expect(emitted).toContain(pathFor({ page: doc }, locale))
      expect(document.projects?.length, `${doc} has no app block`).toBeGreaterThan(0)
      for (const app of document.projects ?? []) {
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
      ...(document.projects ?? []).flatMap((entry) => entry.sections),
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
        ...(document.projects ?? []).flatMap((entry) => [
          entry.id,
          ...entry.sections.map((s) => s.id),
        ]),
      ]
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
