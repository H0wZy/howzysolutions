/**
 * The copy affordance's glyph: two overlapping sheets, or a tick once copied.
 * One drawing for every "copy" button on the site (the CV and MCP header
 * actions used to carry a byte-identical copy each).
 */
export function CopyIcon({ ok }: { ok: boolean }) {
  return (
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
      {ok ? <path d="m20 6-11 11-5-5" className="text-[var(--accent)]" /> : <path d="M16 4H4v12m4-8h12v12H8z" />}
    </svg>
  )
}
