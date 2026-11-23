import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { services, stripImages, workImages } from '../content/services'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Arrow } from '../components/site/Arrow'
import { Lines } from '../components/site/Lines'
import { SiteFooter } from '../components/site/SiteFooter'
import { SiteNav } from '../components/site/SiteNav'

/**
 * The home page of the rebrand. A static document: nothing here has state, so
 * React is never shipped for it (src/route.ts, STATIC_PAGES), and everything
 * that moves is an enhancement in src/enhance/home.ts that finds its elements
 * by the data attributes below. Without scripting it is a complete page: the
 * portrait stands still, the index rows are links, and the intro never runs.
 */
export function Home({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { profile } = content
  const servicesPath = pathFor({ page: 'services' }, locale)

  return (
    <div className="site" data-page="home">
      {/*
        Covers the page only while html carries `intro-on`, which the inline
        script in index.html sets for a first visit that allows motion. A
        CSS animation takes it away on its own if the script never finishes.
      */}
      <div className="site-intro" aria-hidden="true">
        <div className="n" data-intro-count>
          000
        </div>
        <div className="w">
          <span>{translate(locale, 'home.intro.problem')}</span>{' '}
          <span>
            <Arrow />
          </span>{' '}
          <span>{translate(locale, 'home.intro.solved')}</span>
        </div>
        <div className="bar" data-intro-bar />
      </div>

      <SiteNav locale={locale} pathname={pathname} />

      <main id="main">
        <section className="hero" data-hero>
          <div className="strip" data-layer="-10" data-scroll="-0.1" aria-label={translate(locale, 'home.work.label')}>
            {stripImages.map((key) => {
              const image = workImages[key]
              return (
                <a key={key} href={pathFor({ page: 'work', id: image.projectId }, locale)}>
                  <img src={image.src} width={image.width} height={image.height} alt="" />
                  <span className="mono">{image.caption[locale]}</span>
                </a>
              )
            })}
          </div>

          <p className="lede">
            <b>{profile.name}.</b> {translate(locale, 'home.hero.lede')}
            <br />
            <a className="cta" href="#contato">
              {translate(locale, 'home.hero.cta')} <Arrow />
            </a>
          </p>

          <div className="face" data-face data-layer="-34" data-scroll="0.35">
            <img
              src="/home/portrait.webp"
              width="720"
              height="720"
              alt={translate(locale, 'home.hero.portraitAlt')}
              fetchPriority="high"
            />
          </div>

          <h1 className="word" data-layer="18" data-scroll="0.15">
            howzy<i>.</i>
          </h1>

          <div className="tag mono">
            <span>{translate(locale, 'home.hero.tag')}</span>
            <span data-face-hint hidden>
              {translate(locale, 'home.hero.hint')}
            </span>
          </div>
        </section>

        <section className="svc" id="svc" aria-labelledby="svc-heading">
          <h2 id="svc-heading">
            <span>{translate(locale, 'home.services.heading')}</span>
            <a href={pathFor({ page: 'workIndex', number: 1 }, locale)}>
              {translate(locale, 'home.services.allWorks')} <Arrow />
            </a>
          </h2>
          <ul>
            {services.map((service) => (
              <li key={service.id}>
                <a className="row" href={`${servicesPath}#${service.id}`} data-peek={workImages[service.peek].src}>
                  <h3>{service.title[locale].join(' ')}</h3>
                  <p>{service.homeNote}</p>
                  <span className="ar">
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="contact" id="contato" aria-labelledby="contact-heading">
          <h2 id="contact-heading">
            <a href={`${servicesPath}#contato`}>
              <Lines text={translate(locale, 'home.contact.heading')} />
            </a>
          </h2>
          <div className="ways mono">
            <a href={`${servicesPath}#contato`}>{translate(locale, 'home.contact.form')}</a>
            {profile.contacts.map((contact) => (
              <a key={contact.kind} href={contact.href}>
                {translate(locale, contact.labelKey)}
              </a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}
