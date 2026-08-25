# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## What this repo is

A static, no-build HTML/CSS/JS portfolio recreation of **Kalpataru Vista** — a real luxury
residential project in Sector 128, Noida Expressway — built the same way as the sibling
`real estate` repo's Camellias Residences site: a downloaded reference export
(`kalpataruvista.org.in.html` / `kalpataruvista.org.in_files/`) supplied the content and structure,
and the deliverable was rebuilt from scratch with original CSS/JS (no Elementor/WordPress runtime
dependency). Contact info, RERA number, and prices are fictional placeholders — this is not the
live client's site. The build is complete: all 10 content sections exist, are wired up, and pass a
full-page verification pass (see below).

## Commands

No build step, package manager, or test framework.

- **Run it**: open `kalpataru-vista.html` directly in a browser, or serve the folder statically.
- **Verify a change**: there is no test suite. Drive the page in headless Chromium via Playwright
  (`npm install playwright` in a scratch dir, `chromium.launch()`, navigate via `file://`) and check
  for console errors, failed requests, and screenshots at 1440×900 and 390×844 after any non-trivial
  UI change. When exercising interactions, also click through all 6 specification tabs and submit
  the hero site-visit form to confirm they still work once assembled on the full page. The only
  request that is *expected* to fail is `assets/hero-src/h1.webp`–`h4.webp` (see Known limitations
  below) — any other failed request or console error is a real regression.

## Architecture

`kalpataru-vista.html` is the live page. Two stylesheets load in cascade order:
`kalpataru-vista_files/kalpataru-vista.css` (tokens, reset, type system, layout/components) then
`kalpataru-vista_files/kalpataru-vista-theme.css` (the signature decorative layer: the horizon
divider, dark chrome sections), loaded last. `kalpataru-vista_files/site.js` holds all scripting —
six named `init*()` functions called from one `DOMContentLoaded` listener:

- `initHeaderScrollState` — toggles `.is-scrolled` on the fixed header past 40px of scroll.
- `initMobileNav` — opens/closes the off-canvas nav below 860px and closes it on link click.
- `initHeroSlideshow` — crossfades the 4 hero background slides every 5s.
- `initSiteVisitForm` — fake-submits the hero lead form (`preventDefault`, hides the fields, shows
  the success message).
- `initScrollReveal` — drives the `[data-anim="element"]` fade-up-on-scroll effect via
  `gsap`/`ScrollTrigger`.
- `initSpecTabs` — the 6-tab specifications component (Complex & Building / Apartment / Kitchen /
  Bathroom / Security & Safety / Terrace); click handling only, no keyboard support (see Known
  limitations).

External script stack (all loaded from CDN, in this order): jQuery 3.7.1, then GSAP 3.13.0 +
ScrollTrigger + ScrollToPlugin + SplitText (**pinned to 3.13.0, not 3.12.5** — 3.12.5's SplitText
404s on cdnjs; this was caught and fixed during the build), then Splide 4.1.4. Of the six `init*`
functions above, only `initScrollReveal` actually touches GSAP/ScrollTrigger — the other five
(`initHeroSlideshow`, `initSiteVisitForm`, `initSpecTabs`, `initHeaderScrollState`, `initMobileNav`)
are plain DOM/JS and work with the CDN scripts entirely absent (e.g. no network access). jQuery and
Splide are loaded but not currently wired to any behavior on the page — they're part of the
reference stack but unused so far; don't assume they're load-bearing.

**Graceful degradation of scroll-reveal**: `initScrollReveal()` checks
`typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined"` and also
`prefers-reduced-motion: reduce`. If either GSAP/ScrollTrigger failed to load or the visitor prefers
reduced motion, it immediately sets `opacity: 1; transform: none` on every `[data-anim="element"]`
instead of animating — so content is never stuck invisible. This matters because `[data-anim]`
elements start at `opacity: 0` in CSS by default (see `kalpataru-vista.css`); any future `data-anim`
usage relies on this fallback firing correctly.

**Design system**: green/gold "golf-course luxury" palette (`--fairway-*` greens, `--gold-*`
accents, `--sand-*` cream base — named for the golf-course setting, not generic terms). Three type
roles: Fraunces (display/headings only), Archivo (body), IBM Plex Mono (numbers/labels only — this
is the deliberate signature typographic move, don't use mono for prose). The horizon-divider
component (`.horizon-divider`) is the one repeated signature element between sections — reuse it,
don't invent new one-off dividers.

**RGB tokens for translucency**: `--fairway-900-rgb`, `--sand-50-rgb`, and `--gold-500-rgb` exist
in `kalpataru-vista.css` alongside their hex counterparts (`--fairway-900`, `--sand-50`,
`--gold-500`), specifically so translucent colors can be built with
`rgba(var(--fairway-900-rgb), 0.92)` etc. (used by `.header.is-scrolled`, `.hero__overlay`,
`.hero__form`, `.virtualtour__play`). These were added during code-quality fixes partway through
the build. When a new component needs an alpha-blended version of a token color, add the matching
`-rgb` triplet and use this pattern — don't hardcode a new one-off `rgba(r,g,b,a)` literal.

**No raster logo** — the brand mark is an inline SVG + CSS wordmark in the header/footer
(`.logo`), not a `logo.png` file.

**Hero images**: `assets/hero-src/h1.webp`–`h4.webp` are user-supplied and don't exist yet (the
folder exists but is currently empty); the hero slideshow degrades gracefully to a solid
`--fairway-900` background (CSS `background-image` on a missing file just doesn't paint, unlike an
`<img>` which would show a broken-image icon) — this is expected and intentional, not a bug to fix.

**CTA vs. contact routing** — easy to get backwards: the header's "Enquire Now" button and the
footer's "Enquire Now" nav link both point to `#siteVisitForm`, which is the lead-capture form
*inside the hero section* (`id="siteVisitForm"` is on the `<form>`, not a wrapper — the anchor
scrolls to the hero). `#contact` is a separate id, on the `<footer>` itself, which holds only static
placeholder phone/email and the portfolio disclaimer — it has no form and nothing on the page
links to it as a CTA target. If you add a new "get in touch" affordance, point it at
`#siteVisitForm`, not `#contact`.

**`kalpataruvista.org.in.html` / `kalpataruvista.org.in_files/`** is the original downloaded
reference export — gitignored, kept only for content/visual reference, not part of the deliverable.
No text, filename, or asset from it should be linked from `kalpataru-vista.html`.

**`docs/superpowers/`** holds the design spec and the implementation plan — historical record of
decisions (palette choice, JS-stack choice, placeholder-vs-real-content choices), not live docs.

## Known limitations (deliberate, tracked scope cuts — not oversights)

- **Hero slideshow images absent**: `assets/hero-src/` exists but is currently empty; the project
  owner hasn't dropped real photos in. The 4 resulting failed requests when opening the page are
  expected.
- **Accessibility backlog**, deferred during the build so it doesn't get silently "fixed" without
  context:
  - The mobile nav has no Escape-to-close, no focus trap, and the toggle button has no
    `aria-controls` pointing at the nav panel.
  - The specification tabs use `role="tab"` / `role="tablist"` but no `aria-selected`, no roving
    `tabindex`, and no arrow-key navigation between tabs.
  - Fragment-link anchor targets (e.g. the empty `<div id="price">` in the floor-plans section)
    lack `tabindex="-1"`, so keyboard/AT users jumping via nav links don't get proper focus
    placement on landing.

These are known gaps, not bugs — fix them deliberately if asked, rather than assuming they were
missed.
