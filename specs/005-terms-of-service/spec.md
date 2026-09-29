# Feature Specification: Terms of Service, and Per-App Legal Pages

**Feature Branch**: none. Shipped on `main` in `a358f5b` and `e45369f` (2026-09-22) without a spec.

**Created**: 2026-09-29 (retrospective)

**Status**: Implemented. Written after the fact because the constitution asks non-trivial work to start as a spec, and this did not; a code review on 2026-09-29 named the gap.

**Why it exists**: TikTok Shop's Partner Center reviews one app at a time and asks for that app's own privacy policy and terms URLs. The site already had a privacy policy; it needed terms, and each app needed a page of its own for both.

## Requirements

- **FR-001**: `/terms-of-service/` carries the general terms plus one block per app, in both locales. `/privacy-policy/` carries the same shape.
- **FR-002**: Each app has a page of its own for each document, `/<document>/<app-id>/`, because that URL is what a store is given.
- **FR-003**: One record shape (`LegalDocument`) and one component (`Legal.tsx`) render both documents, so they cannot drift apart. `LegalDocument.projects` is required and non-empty.
- **FR-004**: The legal documents are prerendered and never hydrated: `App` does not import them, `entry-server` renders them, `main.tsx` skips hydration for them. The JavaScript budget had 0.02 KB of headroom before these pages existed, so this is what made them fit. `static-documents.test.ts` checks the imports; `check-bundle.mjs` checks the built scripts for content that must not be there.
- **FR-005**: A general section flagged `withApp` is also shown on each app's own page. A reviewer reads that URL as the whole document, so what the general sections promise (rights, security, changes, applicable law) has to be on it (added 2026-09-29).
- **FR-006**: The old `/privacy/` path 301s to `/privacy-policy/`, and the old `viralvideogen` URLs (privacy policy, terms and project page, both locales, with and without the slash) 301 to `vvv` (`public/_redirects`, `redirects.test.ts`). TikTok's review was sent `/privacy/`; dropping the redirect breaks it.
- **FR-007**: The document states only what is true. In particular it names Cloudflare as the one third party that handles a visitor's request, which is why `/mcp/` no longer calls `api.github.com` from the browser.

## Not in scope

- Legal review of the text. The terms are the operator's own, for a one-person company, and say so.
- A light theme, cookies or analytics: none exist.
