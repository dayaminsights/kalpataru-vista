# Download Layouts CTA + lead form — design spec

Date: 2026-08-28

## Problem

The overview section's third card ("3 & 4 Bed Residences & Duplexes") has a "Learn
More" button that just anchor-scrolls to `#kv-amenities`. User wants a functional CTA
here instead: "Download the Layouts", which opens a small lead-capture form so a
visitor can request the floor plans by leaving their contact details.

## Content & copy

- Button label: "Download the Layouts" (replaces "Learn More" on this one card only;
  the other two overview cards keep their existing "Learn More" links unchanged).
- Modal heading: "Get the Layouts"
- Modal body: one line, e.g. "Share your details and we'll send you the floor plans
  for Kalpataru Vista's 3 & 4 bed residences and duplexes."
- Fields: Name, Phone, Email (all required).
- Submit button label: "Send"

## Submission mechanism

No backend exists in this repo (static HTML capture, per `ARCHITECTURE.md`). On
submit: build a `mailto:sales@kalpataru.com` link — subject `Layout Download Request —
Kalpataru Vista`, body listing Name/Phone/Email — URI-encode all three field values,
then `window.location.href = ` that link. This mirrors the existing `mailto:` pattern
already used in the `kv-rera` section. No third-party form service, no new external
dependency.

## Structure & mechanics

- New `KV_SECTIONS` entry, `id:'kv-layouts-modal'`, anchored the same way as the other
  `kv-*` entries (`beforebegin` on `.why-us_root__aGsFp`). Contents: a fixed-position
  overlay (`.kv-modal`) hidden by default (no `is-open` class), containing a backdrop
  + dialog with heading, body copy, the 3-field form, Send button, and a close (×)
  button.
- Third overview card's existing `<a>` button: text changed to "Download the
  Layouts", `href` changed from `#kv-amenities` to `#kv-layouts-modal` (inert fallback
  for no-JS), plus a class (`kv-layouts-trigger`) for the click handler to target.
- New inline `<script>` appended after the existing `KV_SECTIONS`/amenities scripts,
  using **event delegation on `document`** (not a direct per-node listener) so it
  keeps working even if `MutationObserver` ever has to reinsert the section:
  - click on `.kv-layouts-trigger` → `preventDefault()`, add `is-open` to
    `#kv-layouts-modal`, focus the Name field.
  - click on `.kv-modal__backdrop` or the close button, or `Escape` keydown while open
    → remove `is-open`.
  - submit on the modal's `<form>` → `preventDefault()`, build the `mailto:` string
    from the three field values, assign to `location.href`, then close the modal and
    reset the form.
- CSS appended to `..._files/kalpataru-brand.css`: overlay covers viewport
  (`position:fixed;inset:0`), centered dialog card, simple opacity/visibility
  transition on `.is-open`, form fields styled with the site's existing font/color
  tokens (reuse `#151717` ink, `Instrument Sans`, existing input-like spacing — no new
  tokens). Mobile: dialog near-full-width with padding; desktop: fixed max-width,
  centered.
- Edited in both `index.html` and the FIND-named HTML file, kept in sync per
  `CLAUDE.md`. No JS-bundle patch needed — these are new, non-React-owned nodes,
  same mechanism as every other `kv-*` section.

## Verification

Extend the `?probe=1` script in `local-server.js` to report:
- `#kv-layouts-modal` exists and lacks `is-open` on initial load.
- After dispatching a `click` on `.kv-layouts-trigger`: modal has `is-open`, and
  `document.activeElement` is the Name input.
- After filling the 3 fields and dispatching `submit` on the form (with
  `location.href` assignment intercepted/stubbed so the probe doesn't actually
  navigate): the composed mailto string contains the correctly encoded field values,
  and the modal loses `is-open` afterward.
- After dispatching `Escape` while open: modal loses `is-open`.

Read via headless Chrome (`--dump-dom --virtual-time-budget=10000`) against
`http://localhost:5000/?probe=1`, per existing project methodology — not by reading
source.

## Out of scope

- Any backend/email-delivery service (mailto only, per user decision).
- Changes to the other two overview cards' buttons.
- Changes to the `kv-cta` section's existing "Book Now" tel link.
- Form validation beyond native HTML `required`/`type=email`/`type=tel` attributes.
