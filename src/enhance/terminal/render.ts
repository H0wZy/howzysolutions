import type { OutputLine } from '../../terminal/types'

export function el<K extends keyof HTMLElementTagNameMap>(
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
      const w = el('div', 'term-text'), a = el('a', '', line.text)
      a.href = line.href
      if (/^http/.test(line.href)) {
        a.target = '_blank'
        a.rel = 'noreferrer'
      }
      w.append(a)
      return w
    }

    case 'pairs': {
      const list = el('dl', 'term-pairs')
      for (const [k, v] of line.rows) list.append(el('dt', '', k), el('dd', '', v))
      return list
    }

    case 'table': {
      const s = el('div', 'term-scroll'), t = el('table', 'term-table'), h = el('thead'), b = el('tbody'), hr = el('tr')
      for (const c of line.head) hr.append(el('th', '', c))
      h.append(hr)
      for (const r of line.rows) {
        const tr = el('tr')
        for (const c of r) tr.append(el('td', '', c))
        b.append(tr)
      }
      t.append(h, b)
      s.append(t)
      return s
    }
  }
}

export function renderEcho(input: string): HTMLElement {
  const line = el('div', 'term-echo')
  line.append(el('span', 'term-prompt', '❯'), ` ${input}`)
  return line
}
