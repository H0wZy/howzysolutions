/**
 * An arrow drawn in SVG, because Schibsted Grotesk's Latin subset has no
 * arrow glyph and a fallback font's arrow would not match the type around it.
 * It points right; CSS turns it (the index rows tilt it, the form button
 * leaves it).
 */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
