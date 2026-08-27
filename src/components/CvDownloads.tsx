import type { Locale } from '../content/i18n/types'
import type { CvDocument, CvView } from '../content/types'
import { documentFor } from '../content/cv'
import { translate } from '../locale'

/**
 * The CV download, in the language of the page being read.
 *
 * US2's whole point: a visitor reading in Portuguese gets the Portuguese PDF
 * as the PRIMARY control (FR-057) and the English one as a secondary control
 * labelled with the language it delivers rather than with a generic word
 * (FR-058). No intermediate language choice, one activation (SC-006).
 *
 * Both are real anchors with `download`, so they are keyboard-operable with
 * visible focus from the site's own `:focus-visible` rule and they work with
 * scripting unavailable (FR-062, SC-008). Nothing here is scripted.
 */

const INTL_LOCALE: Record<Locale, string> = { en: 'en-US', pt: 'pt-BR' }

/**
 * FR-059: state the size before the visitor commits to fetching it. Formatted
 * through Intl rather than a helper — Principle II, rung 3: the language does
 * this (34.1 KB, and 34,1 KB for a reader whose decimal mark is a comma).
 */
function sizeLabel(bytes: number, locale: Locale): string {
  const kb = new Intl.NumberFormat(INTL_LOCALE[locale], {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(bytes / 1024)
  return `${kb} KB`
}

function DownloadLink({
  document: doc,
  labelKey,
  locale,
  primary,
}: {
  document: CvDocument
  labelKey: 'cv.download.primary' | 'cv.download.other'
  locale: Locale
  primary: boolean
}) {
  const language = translate(locale, `cv.language.${doc.locale}`)
  return (
    <a
      className={primary ? 'btn' : undefined}
      href={doc.href ?? undefined}
      download={doc.filename ?? undefined}
      hrefLang={doc.locale}
      type="application/pdf"
    >
      {translate(locale, labelKey, { language })}{' '}
      {/*
        FR-059: language and size before activation. Joined by a comma in the
        component rather than through a `{language}, {size}` dictionary key —
        that key would be identical in both locales, and the locale parity gate
        is right to read a string identical in both as one that was never
        translated. A comma is punctuation, not prose.
      */}
      <span className="dim">
        ({language}, {sizeLabel(doc.bytes, locale)})
      </span>
    </a>
  )
}

export function CvDownloads({ cv, locale }: { cv: CvView; locale: Locale }) {
  const other: Locale = locale === 'en' ? 'pt' : 'en'
  const mine = documentFor(locale, cv)
  const theirs = documentFor(other, cv)

  /*
   * FR-060: a control is never rendered for a file that was absent at
   * extraction. Absence is a stated condition, not a link to a 404 — which is
   * why `documentFor` returns undefined for `present: false` rather than a
   * document with a null href that something downstream might still render.
   */
  if (!mine && !theirs) {
    return <p className="dim">{translate(locale, 'cv.unavailableAll')}</p>
  }

  return (
    <div className="cv-downloads">
      {mine ? (
        <DownloadLink document={mine} labelKey="cv.download.primary" locale={locale} primary />
      ) : (
        <p className="dim">
          {translate(locale, 'cv.unavailable', {
            language: translate(locale, `cv.language.${other}`),
          })}
        </p>
      )}
      {theirs ? (
        <p className="sub">
          <DownloadLink
            document={theirs}
            labelKey="cv.download.other"
            locale={locale}
            primary={false}
          />
        </p>
      ) : null}
    </div>
  )
}
