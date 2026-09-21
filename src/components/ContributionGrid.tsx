import { useEffect, useMemo, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ActivityPeriod } from '../content/types'
import { translate } from '../locale'
import { contributionLevels } from '../content/contributions'
import {
  LEARN_URL,
  addDays,
  columnsFor,
  daySentence,
  monthLabels,
  nextIndex,
  weekdayLabels,
  weekdayOf,
} from '../content/activity'

const LEVELS = [0, 1, 2, 3, 4] as const

const cellOf = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLElement>('td[data-i]') : null

/**
 * GitHub's contribution graph: a week per column, a weekday per row, one
 * square per day. Colour is never the only carrier: each cell holds its
 * sentence as visually hidden text, and the single tooltip shows that same
 * text, so a pointer, a keyboard and a screen reader all get one wording.
 *
 * One tab stop with roving focus (the grid pattern), one tooltip element and
 * delegated events. Hovering never re-renders the cells: the tooltip is
 * written imperatively from the handlers. It is a sibling of the scrolling
 * box rather than a child, so the box's overflow cannot clip it.
 */
export function ContributionGrid({ period, locale }: { period: ActivityPeriod; locale: Locale }) {
  const { start, counts } = period
  const length = counts.length
  const [active, setActive] = useState(length - 1)
  const bodyRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  const grid = useMemo(() => {
    const level = contributionLevels(counts)
    return {
      pad: weekdayOf(start),
      columns: columnsFor(start, length),
      months: monthLabels(locale, start, length),
      weekdays: weekdayLabels(locale),
      cells: counts.map((count, i) => ({
        level: level(count),
        sentence: daySentence(locale, addDays(start, i), count),
        spoken: daySentence(locale, addDays(start, i), count, true),
      })),
    }
  }, [counts, start, length, locale])

  // Like GitHub on a phone: open on the most recent weeks, not the oldest.
  useEffect(() => {
    const scroller = scrollRef.current
    if (scroller) scroller.scrollLeft = scroller.scrollWidth
  }, [])

  // Escape dismisses the tooltip wherever focus is, a hovered one included (WCAG 1.4.13).
  useEffect(() => {
    const dismiss = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') tipRef.current?.classList.remove('is-visible')
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [])

  function show(cell: HTMLElement) {
    const tip = tipRef.current
    const body = bodyRef.current
    if (!tip || !body) return
    tip.textContent = grid.cells[Number(cell.dataset.i)].sentence
    const c = cell.getBoundingClientRect()
    const b = body.getBoundingClientRect()
    // CSS caps the bubble at the body's width, so this range never inverts.
    const half = tip.offsetWidth / 2
    const x = Math.max(half, Math.min(c.left - b.left + c.width / 2, b.width - half))
    tip.style.left = `${x}px`
    tip.style.top = `${c.top - b.top}px`
    tip.classList.add('is-visible')
  }

  const hide = () => tipRef.current?.classList.remove('is-visible')

  /**
   * Back to the focused day, if the keyboard is in the grid and that day is
   * still on screen: a swipe can carry it out of the box (or under the sticky
   * weekday column), and a bubble over other days would describe the wrong one.
   */
  function settle() {
    const focused = cellOf(document.activeElement)
    const scroller = scrollRef.current
    if (!focused || !scroller?.contains(focused)) return hide()
    const c = focused.getBoundingClientRect()
    const left = focused.parentElement!.firstElementChild!.getBoundingClientRect().right
    if (c.left >= left - 1 && c.right <= scroller.getBoundingClientRect().right + 1) show(focused)
    else hide()
  }

  function onKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const from = cellOf(event.target)
    if (!from) return
    const next = nextIndex(Number(from.dataset.i), event.key, event.ctrlKey || event.metaKey, length, grid.pad)
    if (next === null) return
    event.preventDefault()
    setActive(next)
    bodyRef.current?.querySelector<HTMLElement>(`td[data-i="${next}"]`)?.focus()
  }

  function onFocus(event: FocusEvent<HTMLTableElement>) {
    const cell = cellOf(event.target)
    if (!cell) return
    setActive(Number(cell.dataset.i))
    show(cell)
  }

  function onBlur(event: FocusEvent<HTMLTableElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) hide()
  }

  return (
    <div className="contrib-body" ref={bodyRef}>
      <div className="contrib-scroll" ref={scrollRef} onScroll={settle}>
        <table
          className="contrib-table"
          role="grid"
          aria-readonly="true"
          aria-label={translate(locale, 'contrib.gridLabel')}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          onPointerOver={(event) => {
            const cell = cellOf(event.target)
            if (cell) show(cell)
            else settle()
          }}
          onPointerLeave={settle}
        >
          <thead aria-hidden="true">
            <tr>
              <th scope="col" />
              {grid.months.map((month, i) => (
                <th key={i} scope="col" colSpan={month.span}>
                  <span className="contrib-month">{month.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.weekdays.map((weekday, row) => (
              <tr key={row}>
                <th scope="row" className="contrib-weekday">
                  <span className="visually-hidden">{weekday.long}</span>
                  <span aria-hidden="true">{weekday.short}</span>
                </th>
                {Array.from({ length: grid.columns }, (_, column) => {
                  const i = column * 7 + row - grid.pad
                  if (i < 0 || i >= length) return <td key={column} />
                  const cell = grid.cells[i]
                  return (
                    <td
                      key={column}
                      data-i={i}
                      tabIndex={i === active ? 0 : -1}
                      className={`contrib-cell contrib-level-${cell.level}`}
                    >
                      <span className="visually-hidden">{cell.spoken}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="contrib-tip" ref={tipRef} aria-hidden="true" />

      <div className="contrib-foot metric-source">
        <a href={LEARN_URL} target="_blank" rel="noreferrer">
          {translate(locale, 'contrib.learnHow')}
        </a>
        {/* Decorative: every day's value is already text in its cell. */}
        <span className="contrib-legend" aria-hidden="true">
          {translate(locale, 'contrib.less')}
          {LEVELS.map((level) => (
            <span key={level} className={`contrib-swatch contrib-level-${level}`} />
          ))}
          {translate(locale, 'contrib.more')}
        </span>
      </div>
    </div>
  )
}
