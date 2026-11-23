/**
 * The home page's motion, as an enhancement: nothing here is needed to read or
 * use the page. It is a chunk of its own (src/main.tsx imports it only on the
 * home page) and runs after the document is complete. Each part finds its
 * elements by the data attributes src/pages/Home.tsx renders and does nothing
 * when they are absent.
 *
 * With prefers-reduced-motion the intro never shows and the parallax and the
 * portrait's WebGL never start; the portrait stays a still picture. The same
 * still picture stands where there is no WebGL or no fine pointer.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initHome(): void {
  initIntro()
  initPeek()
  if (reduced()) return
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  initParallax(hero)
  const face = hero.querySelector<HTMLElement>('[data-face]')
  if (face && window.matchMedia('(pointer: fine)').matches) {
    // The shader code is the heaviest part of the page's script and only a
    // visitor with a pointer can use it, so it is a chunk of its own.
    void import('./face-gl').then((m) => {
      if (m.mountFaceGL(face)) {
        const hint = hero.querySelector<HTMLElement>('[data-face-hint]')
        if (hint) hint.hidden = false
      }
    })
  }
}

/**
 * The counter and the phrase. index.html decided whether this visit gets one
 * (first of the session, motion allowed, no deep link) by putting `intro-on`
 * on <html>; without it the element is display:none and is simply removed.
 */
function initIntro(): void {
  const el = document.querySelector<HTMLElement>('.site-intro')
  if (!el) return
  const root = document.documentElement
  if (!root.classList.contains('intro-on') || reduced()) {
    el.remove()
    root.classList.remove('intro-on')
    return
  }
  const count = el.querySelector('[data-intro-count]')
  const bar = el.querySelector<HTMLElement>('[data-intro-bar]')
  const words = [...el.querySelectorAll('.w span')]
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / 1800)
    if (count) count.textContent = String(Math.round(p * 100)).padStart(3, '0')
    if (bar) bar.style.width = `${p * 100}%`
    words.forEach((w, i) => w.classList.toggle('on', p > i / words.length + 0.1))
    if (p < 1) {
      requestAnimationFrame(tick)
      return
    }
    window.setTimeout(() => {
      el.classList.add('done')
      window.setTimeout(() => {
        el.remove()
        root.classList.remove('intro-on')
      }, 1000)
    }, 350)
  }
  requestAnimationFrame(tick)
}

/** A picture of the service's work follows the cursor over its row. Pointer devices only. */
function initPeek(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const rows = [...document.querySelectorAll<HTMLElement>('[data-peek]')]
  if (!rows.length) return
  const peek = document.createElement('div')
  peek.id = 'peek'
  peek.setAttribute('aria-hidden', 'true')
  const img = document.createElement('img')
  img.alt = ''
  peek.append(img)
  document.body.append(peek)
  for (const row of rows) {
    // Warm the cache, so the first hover does not show an empty frame.
    new Image().src = row.dataset.peek ?? ''
    row.addEventListener('pointerenter', () => {
      img.src = row.dataset.peek ?? ''
      peek.classList.add('on')
    })
    row.addEventListener('pointerleave', () => peek.classList.remove('on'))
  }
  window.addEventListener(
    'pointermove',
    (e) => {
      peek.style.left = `${e.clientX}px`
      peek.style.top = `${e.clientY}px`
    },
    { passive: true },
  )
}

/**
 * Layers at different depths answer the pointer and the scroll. The loop runs
 * only while the hero is on screen.
 */
function initParallax(hero: HTMLElement): void {
  const layers = [...hero.querySelectorAll<HTMLElement>('[data-layer]')].map((el) => ({
    el,
    depth: Number(el.dataset.layer),
    scroll: Number(el.dataset.scroll ?? 0),
  }))
  let tx = 0
  let ty = 0
  let x = 0
  let y = 0
  let visible = true
  let raf = 0

  hero.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    },
    { passive: true },
  )
  hero.addEventListener('pointerleave', () => {
    tx = 0
    ty = 0
  })

  const frame = () => {
    x += (tx - x) * 0.07
    y += (ty - y) * 0.07
    for (const l of layers) {
      l.el.style.transform = `translate3d(${x * l.depth}px, ${y * l.depth - window.scrollY * l.scroll}px, 0)`
    }
    raf = visible ? requestAnimationFrame(frame) : 0
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !raf) raf = requestAnimationFrame(frame)
  }).observe(hero)
  raf = requestAnimationFrame(frame)
}
