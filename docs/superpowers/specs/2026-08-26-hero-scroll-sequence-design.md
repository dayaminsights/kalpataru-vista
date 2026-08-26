# Hero Scroll-Sequence Redesign — Design Spec

## What this is

A redesign of the hero section (`#hero`) on `kalpataru-vista.html` only. Everything else on the
page — the header/nav, and every section below the hero — is out of scope and stays as-is. The
goal: replace the current static crossfade hero slideshow with a pinned, scroll-scrubbed image
sequence, matching the pattern already proven in the sibling **Camellias Residences** build
(`Camellias Residences_files/site.js`'s `initHeroSequence()` + the pinned `ScrollTrigger` in
`initHeroAnimation()`), using frames sourced from `assets/KALPATARU SHOW APARTMENT/` (428 raw
`scene#####.png` walkthrough renders supplied by the user).

## Scope

**In scope:**
- The `<section class="hero" id="hero">` markup, its hero-local CSS, and hero-specific JS.
- A new curated/optimized frame-sequence asset set derived from `assets/KALPATARU SHOW APARTMENT/`.

**Out of scope (unchanged):**
- `<header class="header">` — untouched.
- Every other section (`#quickfacts` through `#virtualtour`, footer).
- The global design tokens in `kalpataru-vista.css` (`--fairway-*`, `--gold-*`, `--sand-*`, etc.) —
  not modified. Documented in `CLAUDE.md` as an intentional palette choice; this spec does not
  revise that.
- Hero copy/content: headline ("Welcome to Kalpataru Vista"), eyebrow, RERA placeholder line, and
  the `#siteVisitForm` lead form (fields, fake-submit behavior) all stay exactly as they are today.
  Only the visual treatment around them changes.

## Decisions

1. **Copy/layout**: keep as-is. Only restyle + add the scroll-sequence background.
2. **Frame count**: downsample the 428 source PNGs to ~40-50 evenly-spaced frames (matches
   Camellias' 45-frame precedent), resized and converted to webp to keep page weight reasonable.
3. **Palette**: the new hero gets Camellias' exact hex values, scoped to the hero only, via new
   hero-local CSS custom properties — **not** a change to the site's shared `--fairway-*`/
   `--gold-*`/`--sand-*` tokens:
   - `--hero-green: #254441`
   - `--hero-gold: #c9a13b`
   - `--hero-cream: #e7e1dc`
   - `--hero-ink: #121717`
   These are defined in a scoped block (e.g. `.hero { --hero-green: ...; }`) and used only for
   hero-internal overlay/text/button treatments. Rest of the page keeps its current
   `--fairway-900`/`--gold-500`/`--sand-50` shades untouched.

## Approach (selected: desktop-only pinned scrub, mirroring Camellias)

- **Desktop (`min-width: 992px`)**: a `<canvas data-hero="sequence">` layer pins the hero section
  via `ScrollTrigger` (`pin: true, scrub: 1, end: '+=200%'`) and scrubs through the frame sequence
  as the user scrolls, identical in mechanism to Camellias'
  `initHeroSequence()`/`initHeroAnimation()` pinned block.
- **Sub-992px**: no canvas, no pin. Keep the *existing* `.hero__slides` crossfade slideshow
  (`initHeroSlideshow`, already implemented and already degrades gracefully when images are
  missing) as the mobile/tablet background. No new mobile-specific code needed — reuses what's
  already there and already tested.
- This means the hero's mobile behavior is literally unchanged from today; only the desktop
  (≥992px) experience gets the new pinned frame-sequence treatment.

Rejected alternatives:
- **Universal pinned scrub on all breakpoints** — forces mobile visitors to download 40-50 webp
  frames and pin-scrub UX degrades on small viewports; Camellias deliberately avoided this.
- **CSS-only scroll-linked opacity/scale on a single image** — cheapest, but doesn't use the frame
  sequence at all, defeats the point of having a walkthrough render set.

## Assets

- Source: `assets/KALPATARU SHOW APARTMENT/scene00001.png` … `scene00855.png` (odd-numbered, 428
  files, step 2, ~1-2MB each PNG).
- Output: pick ~45 evenly-spaced source frames (stride ≈ 428/45 ≈ 9-10 source frames apart),
  resize to a max long-edge (e.g. 1920px) and convert to webp, written to a new folder:
  `assets/hero-src/apartment-sequence/frame-01.webp` … `frame-45.webp` (zero-padded 2-digit,
  matching Camellias' `frame-01.webp` naming convention exactly).
- Conversion tool: whatever's available in-session (e.g. `ffmpeg`, or Node/sharp if present) —
  implementation detail decided at build time, not fixed here. Must be repeatable if the user later
  wants to swap the source renders.

## Markup changes (`kalpataru-vista.html`)

Inside `<section class="hero" id="hero">`:
- Keep `.hero__slides`/`.hero__overlay` structure (mobile/fallback background — unchanged).
- Add `<canvas data-hero="sequence" aria-hidden="true"></canvas>` as a new layer, hidden by default
  in CSS, shown only at `min-width: 992px` (same CSS-gate approach as Camellias'
  `[data-hero="sequence"] { display: none; } @media (min-width: 992px) { display: block; }`).
- `.hero__copy` and `.hero__form` (headline, RERA line, site-visit form) stay exactly as they are,
  just restyled to sit correctly over the new background layer.

## JS changes (`kalpataru-vista_files/site.js`)

- Port `initHeroSequence()` from Camellias almost verbatim: canvas 2D context, DPR-aware resize,
  cover-fit `drawImage`, lazy `Image()` array load keyed to the new 45-frame path, `drawFrame(index)`
  API.
- Add a `gsap.matchMedia()` gate (desktop vs. not) inside the existing hero init flow:
  - Desktop: load the sequence, create the pinned `ScrollTrigger` that scrubs `drawFrame` based on
    scroll progress (mirrors Camellias' `onUpdate` handler, minus the title/content
    yPercent/opacity choreography that isn't part of this scope since copy stays as-is — though a
    light equivalent fade/parallax on `.hero__copy` during the pin is reasonable groundwork, kept
    subtle).
  - Sub-992px: no pin, no canvas load — existing `initHeroSlideshow` continues to own the mobile
    background exactly as today.
- Must degrade safely if GSAP/ScrollTrigger fail to load or aren't present, same principle as the
  existing `initScrollReveal` fallback documented in `CLAUDE.md` — canvas simply stays hidden
  (CSS default) and the existing slideshow/static background is what's visible instead.

## CSS changes (`kalpataru-vista_files/kalpataru-vista.css` and/or `-theme.css`)

- New hero-scoped custom properties (`--hero-green`, `--hero-gold`, `--hero-cream`, `--hero-ink`)
  declared on `.hero`, used only within hero-descendant selectors (overlay tint, form background/
  border, button colors, RERA/eyebrow text color) — does not touch or redefine the shared
  `--fairway-*`/`--gold-*`/`--sand-*` tokens used elsewhere on the page.
- `[data-hero="sequence"]` canvas: `position:absolute; inset:0; width:100%; height:100%;
  display:none;`, flipped to `display:block` only inside the `min-width: 992px` media query —
  same technique as Camellias.

## Testing / verification

Per `CLAUDE.md`'s existing verification approach (Playwright, headless Chromium, `file://`):
- Screenshot hero at 1440×900 (desktop, canvas sequence active) and 390×844 (mobile, existing
  slideshow still active) before/after.
- Scroll through the pinned hero region on desktop and confirm frames advance smoothly without
  console errors or failed requests (aside from any pre-existing expected gaps).
- Confirm the site-visit form (`#siteVisitForm`) still submits correctly (fake-submit success
  message) once assembled behind the new background layer.
- Confirm sub-992px viewport shows zero new network requests for the 45-frame sequence (canvas
  should stay `display:none`, no `Image()` loads triggered).
