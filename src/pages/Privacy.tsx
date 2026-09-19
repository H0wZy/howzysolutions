import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { translate } from '../locale'
import { Chrome } from '../components/Chrome'

/**
 * The privacy policy (src/content/privacy.ts). Its URL is what TikTok Shop's
 * Data Security and Privacy Review links to, so the path is a promise: it
 * stays /privacy/ for as long as the app exists.
 *
 * The contact is the profile's email contact rather than a second copy of the
 * address, so the two cannot drift apart.
 */
export function Privacy({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { privacy } = content
  const email = content.profile.contacts.find((c) => c.kind === 'email')

  return (
    <>
      <Chrome locale={locale} path="h0wzy/privacy" pathname={pathname} />
      <main>
        <header className="section">
          <div className="wrap">
            <h1>{translate(locale, 'privacy.title')}</h1>
            <p className="sub">{privacy.intro[locale]}</p>
            <p className="sub dim">
              <time dateTime={privacy.updated}>
                {translate(locale, 'privacy.updated', { date: privacy.updated })}
              </time>
              {email ? (
                <>
                  {' '}
                  {translate(locale, 'privacy.contact')} <a href={email.href}>{email.label}</a>
                </>
              ) : null}
            </p>
          </div>
        </header>

        {privacy.sections.map((section) => (
          <section key={section.id} className="section" id={section.id}>
            <div className="wrap">
              <h2>{section.heading[locale]}</h2>
              {section.body[locale].map((paragraph) => (
                <p key={paragraph} className="prose">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="prose">
                  {section.items[locale].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}
