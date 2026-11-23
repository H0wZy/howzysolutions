import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ContactForm } from '../../components/site/ContactForm'
import { SERVICE_IDS } from '../contact'
import { LOCALES } from '../i18n/types'
import { projects } from '../projects'
import { howSteps, services, workImages } from '../services'
import { locationFor, pathFor } from '../../route'
import { render } from '../../__tests__/render'
import { routes } from '../../site'

/**
 * The services record and the two pages built from it. What these hold is what
 * PRODUCT.md promises: every proof is a project that exists, nothing is
 * invented, and the owner's list of things he refused (dashes, numbering, an
 * empty box standing in for a picture) cannot come back unnoticed.
 */

const everyText = (): string[] => {
  const out: string[] = []
  for (const s of services) {
    for (const locale of LOCALES) {
      out.push(...s.title[locale], s.what[locale])
      for (const item of s.items) out.push(item.label[locale], item.tech[locale])
    }
    out.push(s.homeNote)
    for (const p of s.proof) if ('label' in p) out.push(p.label)
  }
  for (const step of howSteps) for (const locale of LOCALES) out.push(step.name[locale], step.text[locale])
  for (const image of Object.values(workImages)) {
    for (const locale of LOCALES) out.push(image.alt[locale], image.caption[locale])
  }
  return out
}

describe('the services record', () => {
  it('offers exactly the services the form can name', () => {
    expect(services.map((s) => s.id)).toEqual([...SERVICE_IDS])
  })

  it('points every proof at a project that exists, and every picture at a file', () => {
    const known = new Set(projects.map((p) => p.id))
    for (const s of services) {
      expect(s.proof.length, `${s.id} has no proof`).toBeGreaterThan(0)
      for (const p of s.proof) {
        if ('image' in p) expect(known.has(workImages[p.image].projectId), p.image).toBe(true)
        else if (p.projectId) expect(known.has(p.projectId), p.label).toBe(true)
      }
    }
    for (const image of Object.values(workImages)) {
      const file = fileURLToPath(new URL(`../../../public${image.src}`, import.meta.url))
      expect(existsSync(file), image.src).toBe(true)
      expect(image.width).toBeGreaterThan(0)
      expect(image.height).toBeGreaterThan(0)
    }
  })

  it('says something in both locales, everywhere', () => {
    for (const text of everyText()) expect(text.trim()).not.toBe('')
  })

  it('writes no em dash, en dash, spaced hyphen or double hyphen', () => {
    for (const text of everyText()) {
      expect(text).not.toMatch(/—|–| - | -- /)
    }
  })

  it('invents no number, price or client', () => {
    const prose = everyText().join('\n')
    expect(prose).not.toMatch(/R\$|US\$|\$\s?\d|\d+\s?%|\b\d{2,}\+?\s+(clients|clientes|projects|projetos)\b/i)
  })
})

describe.each(LOCALES)('the home page and /services/, %s', (locale) => {
  const home = render(pathFor({ page: 'home' }, locale))
  const page = render(pathFor({ page: 'services' }, locale))

  it.each([
    ['home', home],
    ['services', page],
  ])('%s: has one h1, an alt on every image, and no dash in its prose', (_name, html) => {
    expect(html.match(/<h1[ >]/g)).toHaveLength(1)
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) expect(img, img).toMatch(/\balt=/)
    const prose = html.replace(/<[^>]+>/g, ' ')
    expect(prose).not.toMatch(/—|–/)
  })

  it('has no numbered heading, badge or eyebrow', () => {
    for (const html of [home, page]) {
      expect(html).not.toMatch(/<h[1-3][^>]*>\s*0\d\b/)
      expect(html).not.toMatch(/class="[^"]*\b(badge|eyebrow|kicker)\b/)
    }
  })

  it('links every project it names to a route that is emitted', () => {
    const emitted = new Set(routes().map((r) => r.pathname))
    for (const html of [home, page]) {
      for (const [, href] of html.matchAll(/href="(\/(?:pt\/)?works\/[a-z0-9-]+\/)"/g)) {
        expect(emitted.has(href), href).toBe(true)
        expect(locationFor(href).route.page).not.toBe('home')
      }
    }
  })

  it('shows a text line, never an empty box, for a project with no picture', () => {
    expect(page).not.toMatch(/class="[^"]*\bph\b/)
    const games = services.find((s) => s.id === 'games')!
    expect(games.proof.every((p) => 'label' in p)).toBe(true)
    expect(page).toContain('Lei do Corre, devlog')
  })

  it('renders the whole form, with the honeypot and the widget slot, once a key is set', () => {
    const form = renderToString(createElement(ContactForm, { locale, siteKey: 'test-key' }))
    expect(form).toContain('action="/api/contact/"')
    expect(form).toContain('data-sitekey="test-key"')
    for (const id of SERVICE_IDS) expect(form).toContain(`value="${id}"`)
    for (const field of ['name', 'email', 'problem', 'website', 'lang']) expect(form).toContain(`name="${field}"`)
    // The honeypot is out of the tab order and hidden from assistive technology.
    expect(form).toMatch(/class="hp" aria-hidden="true"/)
    for (const status of ['sent', 'invalid', 'spam', 'failed']) expect(form).toContain(`id="${status}"`)
    // And without a key there is no form to fail.
    expect(renderToString(createElement(ContactForm, { locale, siteKey: '' }))).not.toContain('<form')
  })

  it('lists every service as a chip in the form only when a Turnstile key is set', () => {
    // With no site key the form is replaced by a sentence (src/content/contact.ts),
    // so a form must never be rendered without the widget's slot.
    if (page.includes('data-contact-form')) expect(page).toContain('data-turnstile')
    else expect(page).not.toContain('name="service"')
  })
})
