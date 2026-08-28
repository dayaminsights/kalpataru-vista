# Amenities section — photo panels redesign

Date: 2026-08-28

## Problem

The current `kv-amenities` section (injected via the `KV_SECTIONS` mechanism, see
`ARCHITECTURE.md`) is a flat list of 17 amenity names as pill tags — no photography, no
grouping. Reference: `file:///C:/Users/USER/Documents/GitHub/real estate/Camellias
Residences.html`'s "Wellness-centered amenities" section, which pairs a photo with a
heading + short body copy per amenity category, in a scroll-pinned crossfade carousel
(GSAP ScrollTrigger, 3 slides: Wellness-centered amenities / Art & culture spaces /
Garden-infused retreats).

Goal: redesign `kv-amenities` to be photo-led like the reference, using the visual
language already established in this repo (pill tags, eyebrow/heading tokens,
`Instrument Sans`, `#151717` ink), without introducing the reference's GSAP scroll-pin
mechanic — this repo's Next.js bundle has no GSAP loaded, and layering hand-written
scroll-trigger JS on an already hydration-fragile page (see `ARCHITECTURE.md` §"New
sections: React strips extra static siblings on hydration") is not worth the risk for a
visual effect that a static layout can approximate.

## Decisions (from brainstorming)

- **Photos**: use the 3 existing placeholder stock photos in `assets/` — `enjoy.webp`
  (game room), `meet.webp` (meeting room), `relax.webp` (patio/garden gathering) — as
  category photos now. Not real Kalpataru Vista amenity photography; swap later when
  available.
- **Interaction**: static 3-panel layout. No scroll-pin, no crossfade JS. Same visual
  language as the reference (photo + heading + body copy per category) without the
  scroll-scrub mechanic.
- **Scope**: replace the existing flat pill-list section entirely — the old 17 items are
  folded into 3 category groups, not dropped.
- **Grouping** (all 17 original items accounted for, none dropped):

  | # | Category | Photo | Amenities |
  |---|---|---|---|
  | 01 | Play & Unwind | `enjoy.webp` | Games Room, Squash Court, Kids' Play Area, Multi-Purpose Hall |
  | 02 | Connect & Work | `meet.webp` | Business Lounge, Community Centre, Library and TV Lounge |
  | 03 | Relax & Recharge | `relax.webp` | Spa, Swimming Pool, Gymnasium, Sundecks, Jogging Path, Fitness Zone, Creche, Lounge Area, Landscaped Podium for Walking, Waiting Niche |

- **Copy** (Camellias-tone, one sentence per category):
  - Play & Unwind: "Games rooms, squash courts, and play areas — spaces built for the
    pure pleasure of downtime."
  - Connect & Work: "Business lounges and community spaces that keep you connected,
    without ever leaving home."
  - Relax & Recharge: "Pool, spa, and open-air decks — everyday rituals of rest, right at
    your doorstep."

- **Known deviation from reference**: Camellias pairs a big photo + an overlapping small
  inset photo per category (2 photos/slide). Only 1 placeholder photo exists per
  category here, so each panel gets a single photo, not a big+small pair. Easy follow-up
  once real amenity photography exists — not in scope now.

## Layout

Section keeps `id="kv-amenities"` / `class="kv-amenities"` — the nav anchors
(`#kv-amenities`, both desktop header and burger menu, injected via other
`KV_SECTIONS` entries) already point here and must keep working unchanged. Eyebrow
"03 — Amenities" and heading "Everything a day could ask for" are kept as-is.

Below the heading: 3 stacked panels, one per category row, alternating
image-left/text-right and text-left/image-right (same alternation idea as the existing
`kv-benefits` 2-column grid, applied per-row here instead). Stacks to a single column on
mobile (image above text), consistent with how every other `kv-*` section already
collapses at the `768px` breakpoint.

Each panel:
- **Image side**: single photo, `4:5` portrait crop via `object-fit:cover`, rounded
  corners (reuse the existing pill/rounded-corner radius language rather than inventing a
  new radius value).
- **Text side**: category number (`01`/`02`/`03`, same optical weight/treatment as
  `.kv-benefits__num`), `h3` category heading (`kv-section__heading`-family styling but
  sized down for a subsection, not the full page-heading clamp), one-sentence body copy,
  then that category's amenities as pill tags — reusing the existing
  `.kv-amenities__list li` pill CSS (border, radius 100px, padding), just scoped inside
  each panel instead of one long flat list. This is how no amenity item gets lost in the
  redesign.

## Assets

`enjoy.webp`, `meet.webp`, `relax.webp` currently exist only in `assets/` (source), not
yet in either `..._files/` served folder. Copy all 3 into both:
- `..._files/` (short name, next to `hero-building.webp`)
- `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real
  Estate_files/` (long name, mirrors the short one)

No resizing/recompression pass planned — same asset-pipeline limitation noted in
`ARCHITECTURE.md` (no ImageMagick/cwebp/pngquant available); revisit only if these ship
as final photography rather than placeholders.

## Mechanics

- No new injection point. Edit the existing `kv-amenities` entry's `html` template
  literal inside the shared `KV_SECTIONS` array — present at the end of **both**
  `index.html` and the long FIND-named HTML file (edit both, exact-string surgery, per
  the repo's standard dual-file workflow — see `CLAUDE.md`).
- Backtick template literal, same reason as every other entry: amenity copy has
  apostrophes ("Kids' Play Area").
- Root element keeps `id="kv-amenities"` so the `KV_SECTIONS` dedup check
  (`document.getElementById(s.id)`) still works.
- CSS: restyle the existing `/* --- kv-amenities --- */` block in
  `kalpataru-brand.css`. There is exactly one copy of this file (lives in the long
  FIND-named `..._files/` folder; `index.html`'s `<link>` points at that same path), so
  no duplication to keep in sync. Append new rules, don't touch unrelated blocks. New
  classes needed: `.kv-amenities__panel`,
  `.kv-amenities__media` (image wrapper), `.kv-amenities__num`, `.kv-amenities__copy`,
  `.kv-amenities__tags` (the per-panel pill list, replacing the old flat
  `.kv-amenities__list`).

## Verification

Extend the `?probe=1` route in `local-server.js` (per `CLAUDE.md`'s verification
methodology — real browser, not source-reading) to check:
- `#kv-amenities` exists and contains exactly 3 `.kv-amenities__panel` elements.
- Each panel's `<img>` has `naturalWidth > 0` (image actually loaded, not a broken src).
- All 17 original amenity names are present somewhere in the section's text content (none
  dropped during grouping).
- Old flat `.kv-amenities__list` class is gone (confirms full replacement, not
  duplication).
- Header nav link and burger-menu link to `#kv-amenities` still resolve to the new
  section (scroll target unchanged).
- Check at a couple of scroll depths / after the `MutationObserver`'s 8s window closes,
  consistent with how every other section in this repo has been verified.

## Out of scope

- Real amenity photography (placeholders only, per decision above).
- Big+small overlapping photo pair per category (reference's exact composition) —
  follow-up once real photos exist.
- Any scroll-linked animation (pin, crossfade, parallax) on this section.
