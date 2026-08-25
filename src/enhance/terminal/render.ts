import type { OutputLine } from '../../terminal/types'

/**
 * Turns engine output into DOM. Text only — the engine never emits markup, and
 * everything here is real, selectable, copyable text (FR-008, FR-034).
 */

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

export function renderLine(line: OutputLine): HTMLElement {
  switch (line.kind) {
    case 'blank':
      return el('div', 'term-blank')

    case 'text':
      return el('div', `term-text${line.tone ? ` tone-${line.tone}` : ''}`, line.text)

    case 'link': {
      const wrapper = el('div', 'term-text')
      const anchor = el('a', undefined, line.text)
      anchor.href = line.href
      if (/^https?:/.test(line.href)) {
        anchor.target = '_blank'
        anchor.rel = 'noreferrer noopener'
      }
      wrapper.append(anchor)
      return wrapper
    }

    case 'pairs': {
      const list = el('dl', 'term-pairs')
      for (const [label, value] of line.rows) {
        list.append(el('dt', undefined, label), el('dd', undefined, value))
      }
      return list
    }

    case 'table': {
      // Wide output scrolls inside itself; the page never scrolls sideways (V-031).
      const scroller = el('div', 'term-scroll')
      const table = el('table', 'term-table')
      const head = el('thead')
      const headRow = el('tr')
      for (const cell of line.head) headRow.append(el('th', undefined, cell))
      head.append(headRow)
      const body = el('tbody')
      for (const row of line.rows) {
        const tr = el('tr')
        for (const cell of row) tr.append(el('td', undefined, cell))
        body.append(tr)
      }
      table.append(head, body)
      scroller.append(table)
      return scroller
    }
  }
}

/**
 * The echoed command, shown above its output the way a shell does. Just the
 * caret, not the full multi-segment prompt the input line wears: scrollback
 * repeating session, path and shell on every command would bury the output
 * it exists to introduce.
 */
export function renderEcho(input: string): HTMLElement {
  const line = el('div', 'term-echo')
  line.append(el('span', 'term-prompt', '❯'), el('span', undefined, ` ${input}`))
  return line
}
