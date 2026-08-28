# Overview section — image cards addition — design spec

Date: 2026-08-28

## Problem

The `kv-overview` section (eyebrow "01 — Overview" / heading / body / stats strip)
is text-only. The original FIND site's equivalent section, `features_root` ("Support
Beyond Buying and Selling"), pairs its intro text with a 3-card grid of photo + title +
short copy. User wants that visual pattern added to `kv-overview`, reusing FIND's
existing local images as placeholders until real Kalpataru photography is ready.

## Content

Three cards, appended after the existing stats `<dl>`, inside the same
`.container_container__v5gtR`:

| Card | Placeholder image | Title | Copy |
|---|---|---|---|
| Location | `mortgage-services.jpg` | Sector 128, Noida | Steps from the city's business core, minutes from the golf course you wake up to. |
| Golf Course | `property-management.jpg` | 110-Acre Golf Course | Twin towers set inside sprawling green, views from nearly every window. |
| Residences | `development.jpg` | 3 & 4 Bed Residences & Duplexes | Spacious layouts, island kitchens, private sundecks — built for how you live. |

All three image paths already exist under
`FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/`
and are already referenced elsewhere in the leftover FIND `features_root` markup, so no
new asset work is needed for this pass.

No "Learn More" button on the cards (unlike the FIND original, which opens a modal) —
this site has no subpages/modals for these topics, and a non-functional button would be
dishonest UI. Image + title + one line only.

## Structure & styling

- New markup: `<div class="kv-overview__cards">` containing 3×
  `<div class="kv-overview__card">` (`.kv-overview__card-media > img`,
  `.kv-overview__card-title > h3`, `.kv-overview__card-text > p`).
- Mobile: single column, stacked. Desktop (`min-width:768px`): 3-column grid, gap
  matching the section's existing rhythm (~2–3rem, consistent with `.kv-benefits__grid`
  and `.kv-amenities__panel` gaps already in the stylesheet).
- Card image: rounded corners, `aspect-ratio:4/5`, `object-fit:cover` — same treatment
  as `.kv-amenities__media` for visual consistency between the two sections.
- Typography/color: reuse existing tokens (`#151717` ink, `"Instrument Sans"`, same
  heading weight/tracking as `.kv-amenities__copy h3`, same body color as
  `.kv-overview__body`). No new tokens introduced.
- CSS appended under the existing `/* --- kv-overview --- */` block in
  `..._files/kalpataru-brand.css`.

## Mechanics

`kv-overview`'s HTML lives inside the `KV_SECTIONS` runtime-injector array (an inline
`<script>` in both HTML files that inserts section markup via `insertAdjacentHTML` after
hydration — see the array's `kv-overview` entry). This is the established mechanism for
every `kv-*` section already on the page (video, overview, benefits, amenities, cta) —
it sidesteps the React-hydration-overwrite problem described in `CLAUDE.md` entirely,
since these DOM nodes have no corresponding React component.

Edit: append the new `.kv-overview__cards` markup inside the existing `kv-overview`
entry's `html` template literal, in **both** `index.html` and
`Kalpataru Vista - Buy 3 & 4 BHK Flats in Noida by Kalpataru.html` (the two files must
stay in sync per `CLAUDE.md`). Add the corresponding CSS rules once, in the single
shared `kalpataru-brand.css`.

## Verification

Extend the `?probe=1` script in `local-server.js` to report: `.kv-overview__cards`
exists, has 3 `.kv-overview__card` children, each card's image has non-zero
`getBoundingClientRect` height (confirms the grid didn't collapse and images loaded),
and desktop vs. mobile column count via `getComputedStyle(...).gridTemplateColumns`
split-count at two viewport widths. Read via headless Chrome
(`--headless --disable-gpu --dump-dom --virtual-time-budget=10000`) against
`http://localhost:5000/?probe=1`, per the existing project methodology — not by reading
source.

## Out of scope

- Swapping in real Kalpataru photography (placeholder images stay until real assets are
  ready — noted as a rough edge, not fixed here).
- Any change to the stats strip, benefits section, or amenities section.
- Card click-through / modal behavior.
