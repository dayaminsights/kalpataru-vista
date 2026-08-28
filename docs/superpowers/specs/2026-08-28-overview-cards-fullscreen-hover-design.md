# Overview cards — fullscreen hover expand — design spec

Date: 2026-08-28

## Problem

`.kv-overview__cards` (Location / Golf Course / Residences, see
`2026-08-28-overview-image-cards-design.md`) currently only does a mild
`transform:scale(1.08)` on hover. User wants hovering a card to grow it to fill the
entire screen, with left/right arrows to page between the three cards while expanded.

## Scope

Desktop/hover-capable pointers only (`matchMedia('(hover:hover) and (pointer:fine)')`).
Touch/mobile keeps today's static stacked-grid behavior unchanged — there's no hover to
trigger expansion, and no alternate tap-based entry point is being added.

## Behavior

**Open**: `mouseenter` on any `.kv-overview__card` captures its `getBoundingClientRect()`,
pins the card `position:fixed` at that exact rect, forces a reflow, then animates
`top/left/width/height` to `0/0/100vw/100vh` (~450ms ease) — a FLIP-style grow from grid
slot to fullscreen. `z-index` during/after expansion sits above nav/footer. The existing
`scale(1.08)` hover rule is suppressed while a card is `.is-expanded`.

**Arrows**: two fixed circular buttons, vertically centered at the left/right viewport
edges, hidden (`opacity:0;pointer-events:none`) by default and faded in via
`body.kv-overview-lightbox-open`. Clicking prev/next swaps the fullscreen card: the old
card's inline FLIP styles are cleared synchronously (invisible — instantly covered by the
incoming card, no flash), the new card is pinned fixed/fullscreen and opacity-crossfades
in (~300ms). No rect-travel animation on this hop, since it's fullscreen-to-fullscreen.
Wraps at both ends (Location → Golf → Residences → Location …).

**Close**: `document`-level `mouseleave` (the expanded card fills the whole viewport, so
"leaving" it only makes sense as leaving the browser viewport) and `Escape` both close.
Closing reverses the FLIP: temporarily clear inline styles to measure the card's natural
grid rect, animate the fixed box back to that rect, then strip the inline styles so the
CSS grid reclaims the card.

**Video/slideshow integration**: the Location card's video-reveal and the Golf card's
photo-slideshow (`initKvLocationVideo`, `initKvGolfSlideshow` in both HTML files) already
listen for real `mouseenter`/`mouseleave` on their card elements — untouched, so the
initial hover-open triggers them natively with no code changes. Arrow-driven swaps don't
produce real pointer events on the cards, so the swap function dispatches synthetic
`mouseenter`/`mouseleave` `MouseEvent`s at the outgoing/incoming card to keep video
playback and slideshow cycling in sync with whichever card is on screen.

## Structure & styling

- New CSS in `kalpataru-brand.css`: `.kv-overview__card.is-expanded` (position/z-index/
  radius/transition rules), `.kv-overview__arrow` (fixed circular buttons, prev/next
  variants for left/right placement), `body.kv-overview-lightbox-open .kv-overview__arrow`
  (visibility toggle).
- Two new arrow `<button>` elements added once, statically, inside the existing
  `.kv-overview__cards` template in the `KV_SECTIONS` injector (both HTML files).
- New `<script>` block, identical in both HTML files, added after the existing
  `initKvGolfSlideshow` script — same init-once (`dataset.kvXInited`) +
  `MutationObserver` retry pattern already used by the other `kv-overview` scripts (the
  markup is injected post-hydration, so init must tolerate running before the section
  exists).

## Mechanics / files touched

Per `CLAUDE.md`, `.kv-overview__cards` is plain injected markup (not React-owned) — no
JS bundle patch needed. Edits:

- `index.html` and `Kalpataru Vista - Buy 3 & 4 BHK Flats in Noida by Kalpataru.html` —
  add the two arrow buttons to the `kv-overview` template, add the new hover-expand
  script.
- `kalpataru-brand.css` — new rules under the existing `kv-overview` block.

## Verification

Extend the `?probe=1` script in `local-server.js` to report: whether simulating a
`mouseenter` on a `.kv-overview__card` sets `.is-expanded` and produces a computed rect
matching viewport bounds, whether `body.kv-overview-lightbox-open` toggles arrow
`opacity`/`pointer-events`, and whether a simulated arrow click swaps which card carries
`.is-expanded`. Read via headless Chrome per the project's existing methodology — not by
reading source.

## Out of scope

- Touch/mobile entry point for this interaction.
- A visible close (×) button — `Escape` and leaving the viewport are the close paths.
- Changing the Location/Golf/Residences card content, images, or copy.
