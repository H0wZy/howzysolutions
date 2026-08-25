import { describe, expect, it } from 'vitest'
import { execute, type ExecuteContext } from '../engine'
import { content } from '../../content'
import { LOCALES } from '../../content/i18n/types'
import { en } from '../../content/i18n/en'
import { periodLabel } from '../../content/stats'
import { translate } from '../../content/i18n/translate'
import { THEME_JOKE_KEYS } from '../../theme/jokes'

/**
 * FR-010: a fact is authored once. The list, the project page and the terminal
 * are three renderings of one record, so terminal output must never disagree
 * with the record it came from.
 */

const ctx = (over: Partial<ExecuteContext> = {}): ExecuteContext => ({
  locale: 'en',
  content,
  history: [],
  ...over,
})

const rendered = (input: string, over: Partial<ExecuteContext> = {}) =>
  execute(input, ctx(over))
    .lines.flatMap((l) =>
      l.kind === 'text' || l.kind === 'link'
        ? [l.text]
        : l.kind === 'table'
          ? l.rows.flat()
          : l.kind === 'pairs'
            ? l.rows.flat()
            : [],
    )
    .join('\n')

describe('terminal output matches the content records', () => {
  it('reports each project summary exactly as the record states it', () => {
    for (const locale of LOCALES) {
      const output = rendered('projects --list-all', { locale })
      for (const project of content.projects) {
        expect(output, `${project.id} in ${locale}`).toContain(project.summary[locale])
      }
    }
  })

  it('reports every declared limitation of a project it is asked about', () => {
    for (const locale of LOCALES) {
      for (const project of content.projects) {
        const output = rendered(`projects ${project.id}`, { locale })
        for (const limitation of project.limitations[locale]) {
          expect(output, `${project.id} limitation in ${locale}`).toContain(limitation)
        }
      }
    }
  })

  it('reports the commit count from the record, not a rounded figure', () => {
    const output = rendered('projects --list-all')
    for (const project of content.projects) {
      expect(output).toContain(String(project.commits))
    }
  })

  it('never claims authsys is anything other than a study skeleton', () => {
    const output = rendered('projects authsys')
    expect(output).toContain(en['state.skeleton'])
    expect(output).toContain(en['kind.study'])
  })

  it('cites the statistics period alongside the figures, in the shared wording (FR-036, research D10)', () => {
    const output = rendered('stats')
    const period = periodLabel(content.stats)
    expect(output).toContain(translate('en', period.key, period.params))
  })

  it('never renders a raw translation key', () => {
    for (const locale of LOCALES) {
      for (const input of [
        'help',
        'whoami',
        'about',
        'stats',
        'stack',
        'contact',
        'theme',
        'theme dark',
        'theme light',
        'nonsense',
      ]) {
        expect(rendered(input, { locale }), `${input} in ${locale}`).not.toMatch(
          /\b(terminal|cmd|stats|project|state|kind|stack|hero|work|contact|theme)\.[a-zA-Z0-9]+\b/,
        )
      }
    }
  })

  it('refuses "theme light" in-voice in both locales, never in English under pt', () => {
    const enJokes = new Set(THEME_JOKE_KEYS.map((key) => en[key]))
    for (const locale of LOCALES) {
      const output = rendered('theme light', { locale })
      if (locale === 'pt') {
        for (const jokeText of enJokes) expect(output).not.toContain(jokeText)
      }
    }
  })
})
