import type { OutputLine } from '../../terminal/types'

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
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
      const anchor = el('a', '', line.text)
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
        list.append(el('dt', '', label), el('dd', '', value))
      }
      return list
    }

    case 'table': {
      const scroller = el('div', 'term-scroll')
      const table = el('table', 'term-table')
      const head = el('thead')
      const headRow = el('tr')
      for (const cell of line.head) headRow.append(el('th', '', cell))
      head.append(headRow)
      const body = el('tbody')
      for (const row of line.rows) {
        const tr = el('tr')
        for (const cell of row) tr.append(el('td', '', cell))
        body.append(tr)
      }
      table.append(head, body)
      scroller.append(table)
      return scroller
    }
  }
}

export function renderEcho(input: string): HTMLElement {
  const line = el('div', 'term-echo')
  line.append(el('span', 'term-prompt', '❯'), el('span', '', ` ${input}`))
  return line
}
