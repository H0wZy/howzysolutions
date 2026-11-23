/**
 * Sends the contact form with fetch and shows the outcome in place. Without
 * this the form still posts to the Worker and is redirected back with the
 * outcome in the fragment (src/server/contact.ts); this only saves the reload.
 *
 * It also loads Cloudflare Turnstile, the spam check, and only when the form is
 * about to be used: when it nears the screen or takes focus. A visitor who never
 * reaches the form never contacts Cloudflare for it, and the privacy policy says
 * so. The site key is in the markup (src/content/contact.ts); the secret that
 * checks the answer is only ever in the Worker.
 */

type Outcome = 'sent' | 'invalid' | 'spam' | 'rate' | 'failed'

type Turnstile = {
  render: (el: HTMLElement, options: { sitekey: string; theme: 'dark'; language: string }) => string
  reset: (id?: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

function loadTurnstile(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()
    const script = document.createElement('script')
    script.src = TURNSTILE_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile did not load'))
    document.head.append(script)
  })
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]')
  const section = form?.closest<HTMLElement>('[data-contact]')
  const slot = form?.querySelector<HTMLElement>('[data-turnstile]')
  const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]')
  const label = button?.querySelector('span')
  if (!form || !section || !slot || !button || !label) return

  const show = (outcome: Outcome | '') => {
    if (outcome) section.dataset.state = outcome
    else delete section.dataset.state
  }

  let widget: string | undefined
  let loading: Promise<void> | undefined
  const mountWidget = () => {
    loading ??= loadTurnstile()
      .then(() => {
        if (widget || !window.turnstile) return
        widget = window.turnstile.render(slot, {
          sitekey: slot.dataset.sitekey ?? '',
          theme: 'dark',
          language: slot.dataset.lang === 'pt' ? 'pt-br' : 'en',
        })
      })
      .catch(() => show('failed'))
  }
  const near = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        near.disconnect()
        mountWidget()
      }
    },
    { rootMargin: '300px' },
  )
  near.observe(form)
  form.addEventListener('focusin', mountWidget, { once: true })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const original = label.textContent
    button.disabled = true
    label.textContent = form.dataset.sending ?? original
    // A leftover #sent from a plain post would keep :target showing its line.
    history.replaceState(null, '', window.location.pathname + window.location.search)
    show('')

    let outcome: Outcome = 'failed'
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: Outcome } | null
      outcome = body?.ok ? 'sent' : (body?.error ?? 'failed')
    } catch {
      /* The network is the failure; the visitor is told so below. */
    }

    if (outcome === 'sent') form.reset()
    // A token is good for one check, so the next send needs a fresh one.
    window.turnstile?.reset(widget)
    button.disabled = false
    label.textContent = original
    show(outcome)
    section.querySelector(`[data-status="${outcome}"]`)?.scrollIntoView({ block: 'nearest' })
  })
}
