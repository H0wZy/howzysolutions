# Data Model: Howzy Solutions Brand and Portfolio Experience

The feature adds one design-time asset contract and reuses the site's existing runtime models. It does not add a database, API schema, or duplicate project taxonomy.

## BrandAsset

A documented production visual or live mark.

| Field | Type | Rules |
|---|---|---|
| `id` | stable string | Describes the role, not the source timestamp |
| `role` | `BrandRole` | One primary role per production placement |
| `source` | path or `live-text` | Points to one supplied source or the text signature |
| `productionPath` | path or `live-text` | Stable path used by code or metadata |
| `intrinsicSize` | width and height | Required for raster files |
| `minimumSize` | pixels | Must preserve recognition at the documented minimum |
| `crop` | `square`, `circle-safe`, `landscape`, or `none` | Placement contract |
| `background` | token/usage guidance | No CSS color literal outside `tokens.css` |
| `altTreatment` | text, localized key, or decorative empty alt | Essential identity remains in nearby text |
| `byteBudget` | integer bytes | Enforced during production review |
| `status` | `candidate`, `approved`, `derived`, `verified` | Only verified assets may be referenced by production code |

### BrandRole

- `primary-wordmark`
- `compact-mark`
- `editorial-portrait`
- `favicon`
- `social-avatar`
- `social-preview`

### Relationships

- One approved source may produce several size/crop derivatives.
- Every production placement resolves to exactly one BrandAsset role.
- The primary wordmark is live text and has no raster dependency.

### Validation

- Compact mark is recognizable at 32 by 32 pixels.
- Avatar is recognizable at 180 by 180 pixels in square and circular crops.
- Raster files have explicit dimensions and compression budgets.
- Unapproved exploratory files are never imported or referenced by metadata.

## NavigationItem

The existing route-derived top-level destination.

| Field | Type | Rules |
|---|---|---|
| `route` | existing `Route` union | Never a hand-built pathname |
| `labelKey` | existing `StringKey` | Present in both locale dictionaries |
| `href` | string or `null` | Produced by `pathFor`; `null` for current location |
| `order` | array position | Stable and identical across locales |
| `current` | boolean | Reflected with `aria-current="page"` |

### Relationships

- `trailFor` supplies route ancestry and current location.
- `topLevelLinks` supplies remaining destinations.
- `Chrome` composes both into one primary navigation surface.

## TopicAnchor

The existing `RailEntry` concept extended across meaningful documents.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Matches one real element id in the same document |
| `label` | existing `Localized` | English and Portuguese required |
| `order` | array position | Matches rendered source order |
| `current` | enhancement state | At most one entry has `aria-current="location"` |

### Relationships

- Home anchors map to its section sequence.
- CV anchors come from `railEntries(cv)`.
- Privacy anchors come from policy/project data.
- Project-detail anchors come from the same block descriptors used to render the article.

### Validation

- A rail renders only with at least two meaningful entries.
- Every entry target exists and every included target appears once.
- Without JavaScript, links still navigate to fragments.

## ProjectCategory

No new type is introduced. The entity is the existing `Project.kind: ProjectKind`, translated through `PROJECT_KIND`.

### Validation

- Every project has exactly one kind.
- Every kind maps to an English and Portuguese string key.
- List and detail surfaces render the same kind as a category Badge.
- Category and delivery state remain separate labels.

## LoadingPlaceholder

A view-only pending state for the hero portrait transfer.

| Field | Type | Rules |
|---|---|---|
| `geometry` | fixed aspect ratio and dimensions | Matches the final portrait frame |
| `motion` | static by default | Any future animation must stop under reduced motion |
| `semantics` | decorative | Hidden from assistive technology |
| `replacement` | opaque local image | Covers the backing layer when available |

### State transitions

```text
pending image bytes -> image visible
pending image bytes -> image error with adjacent identity text still present
```

Prerendered text and data have no loading transition.

## MotionPreference

The browser-provided `prefers-reduced-motion` media feature. It is not copied into React state or persisted.

| State | Behavior |
|---|---|
| standard | 1.1 s terminal cursor blink, smooth fragment scroll, existing short reveal/hover transitions |
| reduced | static cursor, immediate fragment jump, final reveal state, immediate feedback, no shimmer |

## Brand asset lifecycle

```text
candidate -> approved -> derived -> verified -> referenced
```

- `candidate -> approved`: visual role and source selected.
- `approved -> derived`: stable web files created with the required crop and dimensions.
- `derived -> verified`: size, byte budget, small-size recognition, circular crop, and contrast checked.
- `verified -> referenced`: application or metadata points to the stable production path.
- A failed verification returns the asset to `approved`; production references keep the last verified asset or the live-text fallback.
