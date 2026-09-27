# Artwork prompts: vvv showcase

The images on `/vvv/` are generated outside this repository from the prompts below (FR-012).
They are written in English because image models follow English more literally.

**What shipped (2026-09-27)**: Google Flow, Nano Banana Pro, 0 credits, two variants each, with
the style block pasted in front of every subject (Flow has no conversation memory). Picked: hero
variant 1 (the diagonal muse), rule variant 2 (dividers set on the film), lanes variant 2 (the
radial halo around the arch). Flow's ratios have no 3:2, so the landscapes are 16:9. ChatGPT with
the same prompts is the fallback if a regeneration is wanted.

## Why this style works on this site

hermes-agent.nousresearch.com ships its art as **grayscale** files and colours it with CSS: the
hero `<figure>` carries `mix-blend-mode: lighten` over a blue section (read from the live page on
2026-09-27). Black pixels lose to the blue, white lines win, and the picture looks printed on
the page.

This site does the same over its own warm near-black `--bg`. So the only hard requirement on an
image is a **pure black background**. Anything darker than `--bg` (#0c0b0a) disappears into it,
and the white line work stays. No colour is baked into the files, so no colour literal enters
the repository.

## How to use

1. Paste the **style block** once, at the start of a new ChatGPT conversation.
2. Generate the hero first. For each next image, start the message with
   `Same style as the previous image:` and paste its prompt.
3. If a result comes back tinted, grey-backed or blurred, reply:
   `Redo it as pure white line engraving on a solid #000000 black background. No colour, no grey background, no glow.`
4. Download each as PNG at full size. The repository keeps them as WebP under `public/vvv/`.

## Style block (paste first)

```text
I am going to ask you for a series of images for a website. Keep one consistent style across all of them.

Medium: a 16th to 17th century copperplate engraving, in the manner of Hendrick Goltzius, Albrecht Dürer and Gustave Doré, printed as WHITE ink on a PURE BLACK background, like an inverted print. Fine burin lines, cross-hatching and stippling model every form. No flat grey fills.

Palette: strictly monochrome. White, silver and grey line work on a solid #000000 black background. No colour at all: no blue, no sepia, no gold. No glow, no bloom, no fog, no gradient, no vignette, no paper texture in the background.

Graphic language: the classical figure is collaged with precise, perfectly straight, ruler-drawn lines. Bundles of thin parallel lines fan out from the figure to the edges of the canvas, and a full circle of fine radiating lines (a sunburst halo) sits behind the figure. Behind the figure there is a flat rectangular panel filled with a dense engraved texture.

Composition: one clear subject, centred, crisp edges, generous empty black around it. Only the ruled lines may run off the edges.

Never include: text, letters, numbers, anything that reads as writing, logos, signatures, watermarks, borders or frames, photographic elements, a 3D render look, blur or depth of field.
```

## 1. Hero (square, 1:1, 1024 x 1024)

Slot: `hero`, right column of the first screen.

```text
Square image, 1:1. A classical muse of storytelling, crowned with a laurel wreath, floating diagonally from lower left to upper right, her robes rippling in deep cross-hatching. Her face is calm and turned slightly down, eyes open. With both raised hands she pulls taut two bundles of thin straight lines that fan out towards the corners of the canvas; halfway along, the lines become strips of 35 mm film with sprocket holes and tiny empty frames. Behind her, a square panel engraved as a dense grid of tiny film frames crossed by thin lightning-like cracks. Behind the panel, a full circle of fine radiating lines.
```

Variant closer to the hermes-agent hero, if wanted: add
`She has six muscular arms spread around her like a wheel, each fist gripping its own bundle of lines.`

## 2. The rule: measured, not believed (landscape, 3:2, 1536 x 1024)

Slot: `rule`.

```text
Landscape image, 3:2. Lachesis, the Fate who measures the thread of life, seated in profile on a stone block with her arms extended. She holds a pair of drafting dividers against a single strip of 35 mm film that stretches horizontally across the entire image, edge to edge. Fine tick marks run along the film, and thin measuring lines radiate from the dividers' points like a precise geometric diagram. Behind her, a rectangular panel of engraved cracked marble; behind the panel, a half circle of fine radiating lines.
```

## 3. Two lanes: Janus (landscape, 3:2, 1536 x 1024)

Slot: `lanes`. Janus is the god of gates and of looking two ways at once: two accounts, and a
gate before anything is posted.

```text
Landscape image, 3:2. Janus, the two-faced Roman god of gates and beginnings, as a marble bust on a short plinth, framed by a classical stone archway. One bearded face looks left, the other looks right. From each face a bundle of thin straight lines fans out horizontally towards its own edge of the canvas, one to the left and one to the right. Inside the arch, behind the bust, a rectangular panel of dense engraved hatching; a sunburst of fine rays radiates from the arch's keystone.
```

## After generation

- Convert each PNG to WebP: hero at 720 x 720, the landscapes at 1280 x 853.
- Put the files in `public/vvv/` (served at `/vvv/<file>.webp`, outside the immutable `/assets/*` cache rule).
- Declare each one in `src/content/showcase-vvv.ts` with its width, height and alt text in both locales.
