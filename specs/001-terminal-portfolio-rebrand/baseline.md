# Pre-work Baseline

Measured on the commit immediately before implementation began, so V-014 has a committed
number to compare against rather than a remembered one.

**Command**: `npm ci && npm run build` (Vite 8.1.0, Node 22.22.2)

| Artifact | Raw | Gzipped |
|---|---:|---:|
| `dist/assets/index-*.js` | 1,805.01 KB | **519.32 KB** |
| `dist/assets/index-*.css` | 4.58 KB | 1.58 KB |
| `dist/index.html` | 0.46 KB | 0.30 KB |

**Constitution budget**: ≤ 120 KB initial JS gzipped, excluding a lazily imported WebGL
renderer. The baseline exceeds it by **4.3×**.

## Dependency groups, measured in isolation

Each group bundled alone with `esbuild --bundle --minify --format=esm`,
`NODE_ENV=production`, then `gzip -9`:

| Group | Gzipped |
|---|---:|
| `react` + `react-dom/client` | 58.7 KB |
| `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` | 358.1 KB |
| `framer-motion` | 44.5 KB |

**Target after this feature**: ≈ 99 KB initial, with the 358.1 KB WebGL group behind the
opt-in dynamic import required by FR-033.
