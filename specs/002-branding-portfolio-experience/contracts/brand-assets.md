# Brand Asset Contract

Only the placements below are production identity. Every other file in `src/assets/branding/` remains exploratory source material and is not imported or emitted.

| Role | Source | Production output | Required size | Minimum use | Background and crop | Accessible treatment | Byte ceiling |
|---|---|---|---|---|---|---|---|
| Primary wordmark | live `profile.handle` text | live `h0wzy` plus CSS cursor | responsive text | 96 px wide | no crop; dark page ground | real text; cursor hidden from assistive technology | N/A |
| Editorial portrait | `Imagem do Codex 19 de set. de 2026, 16_29_11.png` | `src/assets/branding/h0wzy-portrait.webp` | 720 x 720 | 220 px wide | opaque dark editorial frame; preserve graphite texture and turquoise cursor | `alt=""` because adjacent name, role, and biography carry the identity | 160 KB |
| Compact mark | `Imagem do Codex 19 de set. de 2026, 16_49_23.png` | `public/brand/h0wzy-mark-512.png` | 512 x 512 | 32 x 32 | square; retain inner safe area | nearby text names H0wZy; standalone use label is `H0wZy` | 80 KB |
| Favicon | compact mark derivative | `public/favicon-32.png` | 32 x 32 | 32 x 32 | square, no transparent detail outside safe area | browser chrome, no page alt | 8 KB |
| Touch icon | compact mark derivative | `public/apple-touch-icon.png` | 180 x 180 | 180 x 180 | square with platform-safe inset | browser chrome, no page alt | 40 KB |
| Social avatar | compact mark derivative | `public/brand/h0wzy-avatar.png` | 512 x 512 | 180 x 180 | important pixels survive a circular crop | recommended external alt: `H0wZy` | 80 KB |
| Social preview | portrait plus live wordmark system | `public/brand/h0wzy-social-card.png` | 1200 x 630 | 600 x 315 | landscape; no locale-specific prose inside pixels | localized `og:image:alt` from the dictionaries | 250 KB |

## Production rules

1. Do not reference timestamp filenames from components, HTML, or metadata.
2. Do not emit the full exploratory set.
3. Strip metadata that is not required for rendering.
4. Store width and height in markup for every page image.
5. Keep essential identity as text when images fail.
6. If the compact mark fails the 32 px or circular-crop check, keep the current live-text cursor mark until a corrected derivative passes.
7. Do not trace the graphite portrait into a polished vector; its texture is part of the identity.

## Review views

- Compact mark at 512, 180, 64, and 32 pixels.
- Avatar at 180 pixels in square and circle masks.
- Portrait at 720, 360, and 220 pixels on the production background.
- Social card at full size and at a 300 px feed preview.
