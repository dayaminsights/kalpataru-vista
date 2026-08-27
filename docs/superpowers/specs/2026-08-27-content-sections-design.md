# Content sections below the hero — design spec

Date: 2026-08-27

## Problem

`index.html` currently has only a header + hero above a stack of leftover **FIND**
React components (`why-us`, `arrows-section`, `testimonials`, `services`, `features`,
`latest-posts`, `outro`). These are live and unstyled for Kalpataru — the page
currently shows "Why FIND", fake testimonials, and a fake blog feed below the hero.
None of this is Kalpataru Vista content.

The official Kalpataru Vista marketing page (saved locally as
`Kalpataru Vista - Buy 3 & 4 BHK Flats in Noida by Kalpataru.html`) has the real
content. This spec covers extracting that content and building new sections that
visually match the hero, without touching the React hydration boundary (see
`ARCHITECTURE.md` — this is the load-bearing constraint of the whole repo).

## Content source (extracted from the official page)

- **Overview**: "Kalpataru Vista, in the booming hub of Noida, will fulfil your dream
  of living in the lap of luxury. The majestic twin towers, with 3 & 4 bed apartments
  and duplexes, are nestled in a massive 110-acre lush green golf course with
  breathtaking views." Tagline: "Welcome to the Kalpataru Vista, an address defined by
  space and serenity." Status strip: Status: OC Received · Location: Sector 128, Noida ·
  Typology: 3, 4 Bed Residences and Duplexes · Possession: Possession Ongoing.
- **Key Benefits** (4): Landscaped open spaces with ample recreational facilities ·
  Expansive views from your infinity pool · Island kitchen design · Large Sundecks with
  panoramic views of the Golf Course.
- **Amenities** (17): Swimming Pool, Gymnasium, Multi-Purpose Hall, Squash Court,
  Community Centre, Creche, Business Lounge, Kids' Play Area, Fitness Zone, Games Room,
  Jogging Path, Landscaped Podium For Walking, Library and TV lounge, Lounge Area, Spa,
  Sundecks, Waiting Niche.
- **RERA / compliance** (legally required disclosure, kept regardless of section scope):
  "RERA Reg. No. UPRERAPRJ14980. For details, please refer: http://up-rera.in/". Contact:
  +91 22 3064 3065 · sales@kalpataru.com.

Locate (map embed), Construction Update (timeline), and full RERA Details section are
explicitly out of scope for this pass (user decision).

## Design tokens (measured via the `?probe=1` route against the live hydrated hero —
see `ARCHITECTURE.md` on why this project reads computed styles instead of guessing)

- Font: `"Instrument Sans"` (Google Font, already loaded by the page) for everything.
- Ink color: `rgb(21, 23, 23)` (`#151717`) — body text, nav text, CTA button fill.
- CTA button ("Camellias style", already used in the hero/header): pill shape
  (`border-radius: 100px`), `#151717` fill, white text, `font-weight: 500`, no letter
  spacing/uppercase transform. Reuse this exact look for the new "Book Now" CTA.
- Headings: bold (700), tight negative letter-spacing at large sizes, same as the hero
  H1.
- Container: centered, generous horizontal padding, matches `.container_container__v5gtR`
  already used site-wide — new sections reuse that existing container class rather than
  inventing a new one, so alignment with the header/hero is automatic.

## Structural approach

New sections are **plain static HTML** (new classnames, e.g. `kv-overview`,
`kv-benefits`, `kv-amenities`, `kv-cta`), inserted directly in both HTML files between
the hero `</section>` and the first leftover FIND section. All FIND React sections
(`why-us_root`, `arrows-section_root`, `testimonials_root`, `services_root`,
`features_root`, `latest-posts_root`) get `display:none` in `kalpataru-brand.css`.
`outro_root` is replaced in role by the new `kv-cta` section and also hidden.

This sidesteps the hydration problem entirely: these are new DOM nodes with no
corresponding React component, so nothing re-renders or reverts them. All styling
lives in `kalpataru-brand.css`, appended after the existing rules (same file, same
"append-only" convention already established there).

Amenity icons: inline SVG, simple thin-stroke line icons (matching the hero logotype's
optical weight, not photos — no real amenity photography is available locally, see
`ARCHITECTURE.md` asset pipeline notes).

## Nav changes

Header keeps its current simple structure (logo + CTA), gains two anchor links —
Overview, Amenities — pointing at `#kv-overview` / `#kv-amenities`. No mega-menu (user
decision).

## Verification

Same headless-Chrome `?probe=1` methodology as the hero work: extend the probe script
in `local-server.js` to check the new sections exist, are visible, and that the FIND
sections are confirmed `display:none`, at a couple of scroll depths. Visual check via
`--dump-dom` is not enough on its own for layout — computed `getBoundingClientRect` on
each new section confirms no zero-height/overlap regressions.

## Build mechanics (subagent split)

Four independent content-drafting tasks (Overview, Key Benefits, Amenities, Closing
CTA/footer), each producing HTML + CSS as text output only — no direct file edits, to
avoid concurrent writes to the same two HTML files and one CSS file. Main thread splices
the four drafts into `index.html`, the long FIND-named HTML file, and
`kalpataru-brand.css` in one pass, then runs the probe sweep.
