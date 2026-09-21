export function smoothScrollBy(d: number): void {
  if (Math.abs(d) < 2) return
  const s = scrollY, t0 = performance.now(), f = (t: number) => {
    const p = Math.min((t - t0) / 400, 1)
    scrollTo(0, s + d * p * (2 - p))
    if (p < 1) requestAnimationFrame(f)
  }
  requestAnimationFrame(f)
}
