import { useState } from 'react'
import type { Locale } from '../../content/i18n/types'
import { translate } from '../../locale'

export function CvHeaderActions({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const mdUrl = locale === 'pt' ? '/pt/cv.md' : '/cv.md'

  const copy = async () => {
    try {
      const res = await fetch(mdUrl)
      await navigator.clipboard.writeText(await res.text())
      setCopied(true)
      setOpen(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.open(mdUrl, '_blank')
    }
  }

  return (
    <div
      className="relative inline-flex items-center font-mono"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        onClick={copy}
        className="chrome-btn inline-flex items-center gap-1.5 text-xs bg-[var(--surface)] hover:text-[var(--accent)] rounded-r-none border-r-0"
        title={translate(locale, 'cv.copyPage')}
      >
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {copied ? (
            <path d="m20 6-11 11-5-5" className="text-[var(--accent)]" />
          ) : (
            <path d="M16 4H4v12m4-8h12v12H8z" />
          )}
        </svg>
        <span>{translate(locale, copied ? 'cv.copied' : 'cv.copyPage')}</span>
      </button>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="chrome-btn px-2 text-xs bg-[var(--surface)] hover:text-[var(--accent)] rounded-l-none"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={translate(locale, 'cv.menuTrigger')}
      >
        <span>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-52 rounded border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-1 z-50 flex flex-col gap-0.5 text-xs"
        >
          <a
            role="menuitem"
            href={mdUrl}
            target="_blank"
            rel="noreferrer"
            className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="text-[10px] px-1 py-0.5 rounded border border-[var(--accent)] font-bold">
              M↓
            </span>
            <span>{translate(locale, 'cv.viewMarkdown')}</span>
          </a>

          <a
            role="menuitem"
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--text)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="text-[10px] px-1 py-0.5 rounded border border-[var(--border)] font-bold text-[var(--dim)]">
              PDF
            </span>
            <span>{translate(locale, 'cv.downloadPdfEn')}</span>
          </a>

          <a
            role="menuitem"
            href="/pt/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--text)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="text-[10px] px-1 py-0.5 rounded border border-[var(--border)] font-bold text-[var(--dim)]">
              PDF
            </span>
            <span>{translate(locale, 'cv.downloadPdfPt')}</span>
          </a>
        </div>
      )}
    </div>
  )
}
