# Kalpataru Vista Website — Design Spec

## What this is

A static, no-build HTML/CSS/JS portfolio site for **Kalpataru Vista** — a real luxury residential
project in Sector 128, Noida Expressway (this is a fictionalized/portfolio recreation, not the
live client site — contact details and RERA number below are placeholders, not the real ones).
It follows the same build pattern as the existing **Camellias Residences** site in the `real
estate` repo: take a downloaded reference export as content/visual inspiration, rebuild from
scratch with a custom design system and JS layer, no dependency on the original platform's runtime
(the original `kalpataruvista.org.in.html` is a WordPress/Elementor export).

## Repo cleanup (before build starts)

- Delete the nested `real estate/` folder inside this directory — it's a stray duplicate of the
  separate Camellias repo and isn't part of this project.
- Keep `kalpataruvista.org.in.html` + `kalpataruvista.org.in_files/` as-is, untouched, as the
  reference export (same role as `Elyse Residence.html` in the Camellias repo). Not linked from the
  deliverable, not part of the shipped site.
- `assets/` holds three already-curated amenity photos (`meet.webp`, `enjoy.webp`, `relax.webp`)
  plus a new `assets/hero-src/` folder where the user will manually drop hero slideshow photos
  (originally `h1.webp`–`h4.webp` on the live site; not present in the scraped export and
  unreachable from this sandbox — no outbound network access). Build proceeds with a placeholder
  hero background until those land, then swaps in.
- `git init` this directory once cleanup is done, matching the sibling repo's pattern.

## Target folder structure

```
kalpataru vista/
├── kalpataru-vista.html          # the deliverable
├── kalpataru-vista_files/
│   ├── kalpataru-vista.css       # base design system (tokens, layout, components)
│   ├── kalpataru-vista-theme.css # green/gold palette override, loaded last
│   ├── site.js                   # all page scripting
│   └── logo.png                  # brand mark
├── assets/
│   ├── meet.webp / enjoy.webp / relax.webp   # amenity category photos (already have)
│   └── hero-src/                              # user drops hero photos here
├── kalpataruvista.org.in.html    # reference export — do not edit, do not ship
├── kalpataruvista.org.in_files/  # reference export assets — do not edit, do not ship
├── docs/superpowers/specs/       # this spec
└── CLAUDE.md
```

## Architecture

Mirrors the Camellias repo exactly:

- **`kalpataru-vista.html`** is the live page. `<head>` has one inline `<style>` block for
  one-off/fluid sizing plus two stylesheet links, in cascade order:
  1. `kalpataru-vista.css` — base tokens (CSS custom properties for color, type scale, spacing)
     and layout/component structure, unthemed.
  2. `kalpataru-vista-theme.css` — the green + gold "golf-course luxury" palette, loaded last so
     it wins the cascade. Deep forest/olive green + warm gold/bronze accents on a cream/white base.
- **`site.js`**: jQuery → GSAP → ScrollTrigger → ScrollToPlugin → SplitText → `gsap.registerPlugin`
  → Splide → `site.js`, loaded at the end of body. Same `init*()`-functions-called-from-one-
  `DOMContentLoaded` pattern as Camellias — hero intro reveal, generic `data-anim` scroll-reveal
  system, specs tabs, unit-plan cards, FAQ-style accordion if needed, mobile nav + header
  scroll-state, fake client-side form submit (no backend).
- Same verification method as Camellias: no test suite: drive the page in headless Chromium via
  Playwright, check console errors / failed requests / screenshots at desktop and mobile widths
  after any non-trivial UI change.

## Content sections (source: `kalpataruvista.org.in.html`)

1. **Hero** — background slideshow (4 photos, fade transition) + headline "Welcome to Kalpataru
   Vista" + fictional RERA placeholder + a "Request a Site Visit" form (name/email/phone/message,
   fake submit).
2. **Quick-facts strip** — location (Sector 128, Noida Expressway) / typology (3 BHK, 4 BHK) /
   starting price, as three icon items.
3. **Overview** — twin towers on a 110-acre golf course, sweeping pool-deck and golf-course views;
   design credits (Design Architect – HB Design Singapore; Interior – Studio HBA; Landscape –
   Burega Farnell, Singapore; Lighting – DJ Coalition, Sydney).
4. **Amenities** — three categories, each with a photo + list:
   - *Meet*: community centre, reception/lounge, multipurpose room, library/study, business centre.
   - *Enjoy*: indoor games room, gym, squash court, jogging path, kids' play area, crèche.
   - *Relax*: spa (steam/massage), shaded cabanas, landscaped pathways, seating alcoves, pool with
     open-air jacuzzi.
   Plus building-level amenities: elevators w/ auto-rescue, grand lobby, DG backup, rainwater
   harvesting.
5. **Specifications** — 6-tab layout: Complex & Building / Apartment / Kitchen / Bathroom /
   Security & Safety / Terrace (full item lists carried over verbatim from the export).
6. **Unit plans** — two cards: 3 BHK (super area 3011 sq.ft., usable 2007 sq.ft., ₹4.06 Cr*
   onwards) and 4 BHK (super area 3938 sq.ft., usable 2625 sq.ft., ₹5.02 Cr* onwards).
7. **Site layout** — single site-plan image placeholder (lightbox-style), "Download Site Layout"
   CTA (non-functional, matches original's download-gate pattern but as a disabled/decorative CTA
   here rather than a real gated download).
8. **Location advantages** — travel times (East Delhi 20 min, Ghaziabad 30 min, Connaught Place 45
   min, South Delhi 25 min, Faridabad 40 min, IGI Airport 40 min, upcoming Jewar Airport 55 min,
   hospital & school 5 min) alongside a location/map graphic.
9. **Virtual tour** — static poster-image section with a decorative (non-functional) play button
   overlay; no real video asset is available so no `<video>`/embed is wired up.
10. **Contact / footer** — fictional placeholder phone + email, logo, nav links.

RERA number and phone/email are invented placeholders, not the real project's — this is a
portfolio recreation, not the live client's site.

## Visual theme

Green + gold "golf-course luxury": deep forest/olive green as the primary accent (ties to the
110-acre golf course), warm gold/bronze for CTAs and highlight details, on a cream/off-white base
with dark charcoal text — same warm-neutral base approach as Camellias, different accent pair.

## Out of scope

- No real backend/form submission (client-side fake success, same as Camellias).
- No real download files for "Download Site Layout / Unit Layout / Location Details" CTAs —
  decorative or removed, not wired to real PDFs.
- Hero slideshow ships with a placeholder until the user manually supplies `assets/hero-src/`
  photos (network fetch isn't available in this environment).
