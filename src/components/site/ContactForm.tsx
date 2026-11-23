import type { Locale } from '../../content/i18n/types'
import { translate } from '../../content/i18n/translate'
import { CONTACT_ENDPOINT, CONTACT_LIMITS, TURNSTILE_SITE_KEY } from '../../content/contact'
import { services } from '../../content/services'
import { Arrow } from './Arrow'

/** What the Worker can answer with, and so what a visitor can be told. */
const STATUSES = ['sent', 'invalid', 'spam', 'failed'] as const

/**
 * The contact form. It posts to the Worker route (worker/index.ts) with or
 * without scripting: the plain POST gets a 303 back to this page with the
 * outcome in the fragment, and the four status lines below are shown by `:target`
 * (src/styles/site.css). With scripting, src/enhance/contact-form.ts sends it
 * with fetch instead and sets a data-state on the section, which shows the same
 * lines without leaving the page.
 *
 * The Turnstile widget is the one thing that cannot work without scripting, so
 * a <noscript> says so and points at email. While the owner has not set the
 * site key (src/content/contact.ts) the form is not rendered at all, because a
 * form whose check can never pass is worse than an honest sentence.
 */
export function ContactForm({
  locale,
  siteKey = TURNSTILE_SITE_KEY,
}: {
  locale: Locale
  /** Only a test passes this: the page always uses the one in src/content/contact.ts. */
  siteKey?: string
}) {
  if (!siteKey) {
    return <p className="note">{translate(locale, 'form.unavailable')}</p>
  }

  return (
    <>
      {STATUSES.map((status) => (
        <p key={status} id={status} className="status" data-status={status} role="status">
          {translate(locale, `form.${status}`)}
        </p>
      ))}
      <form method="post" action={CONTACT_ENDPOINT} data-contact-form data-sending={translate(locale, 'form.sending')}>
        <input type="hidden" name="lang" value={locale} />
        <label>
          <span className="mono">{translate(locale, 'form.name')}</span>
          <input name="name" autoComplete="name" required maxLength={CONTACT_LIMITS.name} />
        </label>
        <label>
          <span className="mono">{translate(locale, 'form.email')}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={CONTACT_LIMITS.email} />
        </label>
        <fieldset>
          <legend className="mono">{translate(locale, 'form.services')}</legend>
          <div className="chips">
            {services.map((service) => (
              <label key={service.id}>
                <input type="checkbox" name="service" value={service.id} />
                <span>{service.title[locale].join(' ')}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label>
          <span className="mono">{translate(locale, 'form.problem')}</span>
          <textarea name="problem" required maxLength={CONTACT_LIMITS.problem} />
        </label>
        {/* Only a bot fills this in: a person never sees it or tabs to it. */}
        <div className="hp" aria-hidden="true">
          <input name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="turnstile" data-turnstile data-sitekey={siteKey} data-lang={locale} />
        <noscript>
          <p className="note">{translate(locale, 'form.noscript')}</p>
        </noscript>
        <button type="submit" data-label={translate(locale, 'form.send')}>
          <span>{translate(locale, 'form.send')}</span> <Arrow />
        </button>
        <p className="note">{translate(locale, 'form.note')}</p>
      </form>
    </>
  )
}
