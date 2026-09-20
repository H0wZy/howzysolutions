# Quickstart: Validate the Brand and Portfolio Experience

## Prerequisites

- Node.js and the repository dependencies installed.
- Feature implementation complete on `002-branding-portfolio-experience`.
- Approved production files present at the paths in [contracts/brand-assets.md](./contracts/brand-assets.md).

## 1. Run automated gates

```powershell
npm test
npm run lint
npm run build
```

Expected:

- Vitest, contrast, bundle, typecheck, lint, prerender, and build checks pass.
- Build emits 26 complete documents.
- Initial JavaScript is at or below 120 KB gzipped.
- No CSS color literal exists outside `src/styles/tokens.css`.
- No locale key, project kind, route, or fragment contract is missing.

## 2. Start the production preview

```powershell
npm run preview
```

Inspect `/`, `/work/`, one project detail, `/cv/`, `/privacy-policy/`, and their `/pt/` equivalents.

Expected:

- The same wordmark, compact mark, portrait language, and turquoise software accent appear consistently.
- English headings read `My projects` and `My activity`.
- Portuguese headings read `Meus projetos` and `Minha atividade`.
- No heading or metadata contains a fixed project count.

## 3. Verify assets

Use the sizes and views in [contracts/brand-assets.md](./contracts/brand-assets.md).

Expected:

- Compact mark is recognizable at 32 by 32 pixels.
- Avatar remains recognizable in an 180 pixel circular crop.
- Portrait retains graphite texture at its 220 pixel minimum.
- Social preview is 1200 by 630 and uses the same identity.
- Only stable production filenames appear in built HTML/CSS/JavaScript.

## 4. Verify responsive layout

Inspect at 320, 768, 999, 1000, 1440, and 2560 px widths in both locales.

Expected:

- Hero stacks cleanly and all identity facts remain text.
- Header wraps without clipping or horizontal page overflow.
- Section outlines are disclosures below 1000 px and side rails at or above 1000 px.
- Terminal, project badges, and activity rows remain contained and readable.
- Work index shows no redundant outline.

## 5. Verify navigation and terminal behavior

Follow [contracts/navigation.md](./contracts/navigation.md) and [contracts/visual-behavior.md](./contracts/visual-behavior.md).

Expected:

- Keyboard alone reaches every top-level route and rail link.
- Every fragment lands with its heading visible below sticky chrome.
- Direct fragment URLs work on first load.
- Terminal commands, history, completion, selection, and live announcements still work.
- The turquoise cursor completes a cycle in 1.0 to 1.2 seconds.
- Portuguese project links stay under `/pt/`.

## 6. Verify real loading and reduced motion

Throttle image transfer in browser developer tools, then emulate `prefers-reduced-motion: reduce`.

Expected:

- The portrait frame reserves its final geometry and exposes the restrained backing Skeleton only while the image is pending.
- No prerendered text or data flashes into a skeleton during hydration.
- Reduced motion makes cursor, scroll, reveal, and feedback transitions static or immediate.
- Focus indication remains immediate.
- CLS is at or below 0.05.

## 7. Verify no-JavaScript delivery and accessibility

Disable JavaScript and reload every representative route. Then re-enable it and run Lighthouse mobile plus a screen-reader/keyboard pass.

Expected:

- Complete content, global links, fragment links, image alternatives, and native disclosures remain usable without JavaScript.
- Terminal introduction remains present and its disabled input makes the unavailable enhancement honest.
- Lighthouse reports at least 95 Performance and 100 Accessibility.
- LCP is at or below 1.8 seconds and scrolling remains smooth on a mid-range phone.
