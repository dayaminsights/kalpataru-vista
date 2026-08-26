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
2. **Frame count**: keep all 428 source frames — no downsampling. The user's stated end goal is
   scroll-driven animation across the whole site eventually (this phase is hero-only, but the
   frame set shouldn't be pre-cut in a way that throws away walkthrough coverage a later phase
   would want back). Full 428-frame webp set at visually-lossless quality lands ~100-150MB total,
   which rules out upfront eager preload (see Loading strategy below).
3. **Compression**: visually lossless webp (~q90-95) — no perceptible quality loss vs. the source
   PNGs, even under close inspection. This is separate from the frame-count decision above: frame
   count controls *coverage*, quality setting controls *fidelity per frame*, both matter and
   neither is traded off against the other here.
4. **Palette**: the new hero gets Camellias' exact hex values, scoped to the hero only, via new
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
  via `ScrollTrigger` (`pin: true, scrub: 1`) and scrubs through the frame sequence as the user
  scrolls, same mechanism as Camellias' `initHeroSequence()`/`initHeroAnimation()` pinned block.
- **Pin length**: Camellias paces ~45 frames over `+=200%` (~4.4% of a viewport-height of scroll
  per frame). Holding that same per-frame density across 428 frames would need roughly `+=1900%`
  of scroll — i.e. the hero alone would consume ~19 viewport-heights of scrolling, dwarfing every
  section below it. That's the right shape for the user's eventual "whole site is the scroll
  animation" vision, but oversized for a hero-only phase that still has unrelated sections
  (quickfacts, overview, amenities...) sitting right below it today. Compromise for this phase:
  pin length `+=400%` (~4 viewport-heights) — frames advance faster than Camellias' pacing but the
  hero stays a bounded, proportionate part of the page. This number is the one lever most likely
  to get revisited once the "everything else" phases turn more of the page into the same
  scroll-driven system — flag this if it feels off once it's actually scrolling in a browser.
- **Sub-992px**: no canvas, no pin. Keep the *existing* `.hero__slides` crossfade slideshow
  (`initHeroSlideshow`, already implemented and already degrades gracefully when images are
  missing) as the mobile/tablet background. No new mobile-specific code needed — reuses what's
  already there and already tested.
- This means the hero's mobile behavior is literally unchanged from today; only the desktop
  (≥992px) experience gets the new pinned frame-sequence treatment.

Rejected alternatives:
- **Universal pinned scrub on all breakpoints** — forces mobile visitors to download the frame
  sequence and pin-scrub UX degrades on small viewports; Camellias deliberately avoided this.
- **CSS-only scroll-linked opacity/scale on a single image** — cheapest, but doesn't use the frame
  sequence at all, defeats the point of having a full walkthrough render set.

## Assets

- Source: `assets/KALPATARU SHOW APARTMENT/scene00001.png` … `scene00855.png` (odd-numbered, 428
  files, step 2, native 1920×1088, ~1-2MB each PNG, ~500MB total).
- Output: convert all 428 frames 1:1 (no frame dropped), native 1920×1088 resolution kept as-is
  (already a sane web size, resizing isn't needed to hit reasonable per-frame weight), webp at
  ~q90-95. Written to a new folder: `assets/hero-src/apartment-sequence/frame-001.webp` …
  `frame-428.webp` (zero-padded 3-digit — 428 needs 3 digits, unlike Camellias' 2-digit 45-frame
  set).
- Conversion tool: whatever's available in-session (e.g. `ffmpeg`, or Node/sharp if present) —
  implementation detail decided at build time, not fixed here. Must be repeatable if the user later
  wants to swap the source renders.
- Expect the converted set to land roughly 100-150MB total on disk — acceptable because of the
  windowed loading strategy below (nothing close to that is fetched by a visitor who doesn't scroll
  the full hero).

## Markup changes (`kalpataru-vista.html`)

Inside `<section class="hero" id="hero">`:
- Keep `.hero__slides`/`.hero__overlay` structure (mobile/fallback background — unchanged).
- Add `<canvas data-hero="sequence" aria-hidden="true"></canvas>` as a new layer, hidden by default
  in CSS, shown only at `min-width: 992px` (same CSS-gate approach as Camellias'
  `[data-hero="sequence"] { display: none; } @media (min-width: 992px) { display: block; }`).
- `.hero__copy` and `.hero__form` (headline, RERA line, site-visit form) stay exactly as they are,
  just restyled to sit correctly over the new background layer.

## JS changes (`kalpataru-vista_files/site.js`)

`initHeroSequence()` is **not** a straight port of Camellias' version — that version eagerly builds
a 45-element `Image()` array upfront. At 428 frames that same pattern would mean ~100-150MB of
network requests firing the moment desktop `matchMedia` matches, before the visitor has scrolled at
all. Instead:

- **Windowed/progressive loading**: keep a `Map<index, Image>` of frames that have been requested
  so far (starts empty). On every `ScrollTrigger` `onUpdate`, compute the target frame index from
  scroll progress (`Math.round(progress * 427)`), and:
  - If that frame isn't in the map yet, create an `Image()`, set its `src`, add it to the map.
  - Also opportunistically request a small look-ahead window (e.g. the next ~8 frames in the
    current scroll direction) so frames are typically already decoding by the time they're needed,
    keeping the scrub feeling smooth rather than pop-in-on-demand.
  - `drawFrame(index)`: if `map.get(index)` exists and `.complete`, paint it (same cover-fit
    `drawImage` logic as Camellias). If not yet loaded, keep painting the last successfully-painted
    frame instead of blanking the canvas, so fast scrubbing never flashes empty — the canvas
    catches up to the true frame once the image finishes decoding.
  - No manual eviction needed: browser HTTP cache + normal GC handles memory; total data fetched
    naturally reflects how far a given visitor actually scrolled, not the full 428-frame set.
- Canvas 2D context setup, DPR-aware resize, and cover-fit `drawImage` math carry over from
  Camellias' version unchanged.
- Add a `gsap.matchMedia()` gate (desktop vs. not) inside the existing hero init flow:
  - Desktop: create the windowed-loading sequence controller above, then the pinned `ScrollTrigger`
    (`pin: true, scrub: 1, end: '+=400%'`, see pin-length note above) that scrubs `drawFrame` based
    on scroll progress (mirrors Camellias' `onUpdate` handler, minus the title/content
    yPercent/opacity choreography that isn't part of this scope since copy stays as-is — though a
    light equivalent fade/parallax on `.hero__copy` during the pin is reasonable groundwork, kept
    subtle).
  - Sub-992px: no pin, no canvas load — existing `initHeroSlideshow` continues to own the mobile
    background exactly as today, and zero frame requests fire.
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
- Confirm windowed loading actually stays windowed: scrolling partway through the pin should
  trigger noticeably fewer than 428 frame requests, not the full set upfront.
- Confirm the site-visit form (`#siteVisitForm`) still submits correctly (fake-submit success
  message) once assembled behind the new background layer.
- Confirm sub-992px viewport shows zero new network requests for the frame sequence (canvas should
  stay `display:none`, no `Image()` loads triggered).
