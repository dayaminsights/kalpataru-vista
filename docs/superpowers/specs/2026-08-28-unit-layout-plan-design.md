# Unit Layout Plan section — design

## Why

User asked for a "Unit Layout" section mirroring kalpataruvista.org.in's own "Kalptaru Vista
Unit Layout Plan" block. Placement chosen for sales psychology: after Amenities (desire
built), before Site Layout & Specifications (reference material) — this is the moment a
visitor is picturing themselves living there and wants specifics, so it's the highest-intent
point to route into lead capture. Also mid-page, so scrollers who never reach the bottom CTA
still hit a conversion point.

## Source facts (fetched from live site, DNS to that domain is blocked in this sandbox so
fetched via `curl --resolve` to its IP)

- 3 BHK — Super Area 3,011 sq ft, Total Useable Area 2,007 sq ft, ₹4.06 Cr* onwards
- 4 BHK — Super Area 3,938 sq ft, Total Useable Area 2,625 sq ft, ₹5.02 Cr* onwards
- Duplex mentioned only in general marketing copy on their site too, no separate spec row —
  we won't fabricate numbers for it either, just a one-line mention under the cards.
- Their own card CTA is "Download Unit Layout", gated behind a lead form — same pattern this
  repo's `kv-layouts-modal` already implements. Reusing it, not building a second modal.
- Their card thumbnail is a generic reused icon image (both BHK cards point to the same file),
  not a real per-unit floor-plan drawing — the real drawing is what gets emailed after the
  form. We follow the same approach: an inline SVG blueprint-style icon per card, not a
  fabricated "real" floor plan.
- Deliberately excluded: their live "Tower A: 14th floor slab / Tower B: 33rd floor slab"
  construction-progress line. That's a ticker they update; baking a specific floor count into
  this static reskin would go stale within weeks.

## What ships

New entry in the shared `KV_SECTIONS` array (see `ARCHITECTURE.md`'s "New sections" doc),
inserted in **both** `index.html` and the FIND-named HTML file, positioned between the
existing `kv-amenities` and `kv-plans` entries (array order = visual order, per existing
mechanism).

```
{id:'kv-unit-layout', anchor:'.why-us_root__aGsFp', pos:'beforebegin', html:`...`}
```

Markup shape (following `kv-plans__spec-group` card conventions already in
`kalpataru-brand.css`):

```html
<section class="kv-unit-layout" id="kv-unit-layout">
  <div class="container_container__v5gtR">
    <div class="kv-section__eyebrow">03 — Unit Layout Plan</div>
    <h2 class="kv-section__heading">Unit Layout Plan</h2>
    <div class="kv-unit-layout__grid">
      <div class="kv-unit-layout__card">
        <div class="kv-unit-layout__icon"><!-- inline SVG blueprint glyph --></div>
        <h3>3 BHK Apartment</h3>
        <ul>
          <li>Super Area — 3,011 sq ft</li>
          <li>Total Useable Area — 2,007 sq ft</li>
          <li>₹4.06 Cr* Onwards</li>
        </ul>
        <a class="button_button-round__TFjlU button_color-secondary__FZDOG kv-layouts-trigger" href="#kv-layouts-modal">Download Unit Layout</a>
      </div>
      <div class="kv-unit-layout__card"><!-- 4 BHK, same shape --></div>
    </div>
    <p class="kv-unit-layout__note">Duplex residences also available — enquire for details.</p>
  </div>
</section>
```

Reuses the existing `.kv-layouts-trigger` → `#kv-layouts-modal` lead-gate wiring already
built (no new modal, no new form, no new JS beyond the `KV_SECTIONS` array entry).

## Renumbering

Section eyebrows are sequential (`01 — Overview`, `02 — Amenities`, ...). Inserting this
section as `03` bumps the following three:

| Section | Old | New |
|---|---|---|
| kv-plans (Site Layout & Specifications) | 03 | 04 |
| kv-why (Why Kalpataru Vista) | 04 | 05 |
| kv-cta (Get in Touch) | 05 | 06 |

Both HTML files need the eyebrow text edits.

## Styling

New rules appended to `..._files/kalpataru-brand.css`: `.kv-unit-layout__grid` (2-column
card grid, responsive to 1-column below the existing mobile breakpoint used elsewhere in this
file), `.kv-unit-layout__card` (border/padding matching `.kv-plans__spec-group`),
`.kv-unit-layout__icon` (sized inline SVG), `.kv-unit-layout__note` (small, centered,
muted).

## Verification

Per `CLAUDE.md`: this is a brand-new static `<section>`, not touching any React-owned
component, so it doesn't need JS-bundle patching — only the `KV_SECTIONS` HTML-injection
mechanism (already proven safe against hydration wipe by every other `kv-*` section) and the
CSS file. Verify via `?probe=1`:
- Section exists (`document.getElementById('kv-unit-layout')`) and sits in DOM order
  between amenities and site-layout sections.
- Clicking `.kv-layouts-trigger` inside the new cards opens `#kv-layouts-modal` (same check
  already used for the existing overview-card trigger — extend rather than duplicate).
- Renumbered eyebrows read correctly at both HTML files.
- Card grid layout at a couple of viewport widths (desktop + mobile breakpoint already used
  elsewhere in `kalpataru-brand.css`).

## Explicitly out of scope

- No real per-unit floor-plan diagram images (none exist in this repo; the live source site
  doesn't show real ones either, only an icon — real diagram is what gets emailed after the
  lead form, which is outside this section's job).
- No duplex-specific area/price figures (not published on the source site).
- No construction-progress ticker content.
