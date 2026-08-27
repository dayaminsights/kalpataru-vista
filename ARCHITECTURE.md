# Architecture

## Origin

The two identically-sized HTML files (`index.html` and the long FIND-named one) are a
browser "Save Page As, Complete" capture of a live Next.js page. Everything under
`..._files/` is what the browser saved: hashed JS chunks (`*.js`, originally saved as
`*.js.download` — renamed back to `.js` so they'd parse as scripts), hashed CSS files,
and images. This means:

- Class names are CSS-module hashes (`hero_logo__FxgRj`, `header_logo__LO_Jk`) — stable
  identifiers to select on, but meaningless as names, don't try to rename them.
- The JS is a production Webpack/Next.js bundle — minified, chunked, single-letter vars.
  Treat it as a binary you patch with exact-string surgery, not code you refactor.
- There is no build step. No `npm install`, no bundler, no source maps. What you see in
  `..._files/*.js` is what ships. Edits there are the only way to change React-owned
  behavior.

## The rendering problem, precisely

Next.js SSR/SSG produces two things that must agree, and here they've been forked apart:

1. **Server-rendered HTML** — frozen in the `.html` files, what `curl`/`view-source`/grep
   shows.
2. **Client hydration** — on load, React attaches to that HTML and, for any component it
   owns, re-renders from its own state/props (sourced from the JS bundle), not from
   whatever's sitting in the DOM. If the JS bundle says `children:"Find What Moves You"`,
   that's what appears after hydration — regardless of what the HTML says.

Static text/markup edits are only durable if they don't get touched by a mounted
component. In practice, anything visually prominent enough to be worth rebranding (logo,
headline, CTA) turned out to be React-owned. The tell: an edit that verifies via `curl` or
`grep` but reverts when the page actually loads in a browser, or specifically after a
scroll event re-triggers a GSAP-driven re-render.

**Fix pattern**, used repeatedly in this repo:
1. `grep` the exact string across `..._files/*.js` to find which chunk owns it.
2. Patch that exact string in the JS (see `page-01bc6cce4f7f3b4a.js.orig` for the
   pre-patch original, for diffing/reverting).
3. `node --check <file>.js` to confirm you didn't break the minified syntax.
4. Patch the HTML too, for correctness at first paint before JS has hydrated.
5. Verify against the *hydrated* DOM (see below), not the HTML source.

## Verification: why headless Chrome + a probe route, not screenshots

Screenshot tools (both the Artifact tool's constraints and headless Chrome's own
`--screenshot` flag) can't write files in this sandboxed environment. So verification
happens by injecting a script into the page that reads `getComputedStyle`/
`getBoundingClientRect` on the elements in question, and reports the result via
`document.title` (readable from `--dump-dom` stdout, no file write needed).

That's the `?probe=1` route in `local-server.js` — see `CLAUDE.md` for the invocation.
It supports `&scrollY=N` because this hero is scroll-scrubbed (GSAP ScrollTrigger): a
style that's correct at `scrollY=0` can be wrong at `scrollY=3000` if a scroll-driven
inline style or opacity tween fights the CSS override. Several bugs in this project were
specifically "looks right on load, breaks on scroll" — always check a spread of scroll
depths, not just zero, when touching anything hero-related.

## Brand override strategy

Rather than hand-editing 12+ minified original CSS files (fragile, hard to review, hard
to revert), all Kalpataru-specific styling lives in one new file,
`..._files/kalpataru-brand.css`, linked last in `<head>` so its rules win by source order
even without `!important` in most cases. A few rules do use `!important` where they're
specifically overriding a *scroll-driven inline style* set by JS on every frame — a plain
external rule can still lose to that without it.

Current contents (roughly, in file order — read the file directly for the authoritative
state):

- **Hero cutout mask** — `.hero_composite__3blHB`'s `mask-image` is a data-URI SVG built
  from the Kalpataru logo's real vector path data (see Asset pipeline below), replacing
  the original "FIND Real Estate" letterform mask. `mask-size` values are kept at the
  original two breakpoints so the reveal animation's scale math still lines up.
- **Outline draw-on stroke** — `.hero_logo__FxgRj path` stroke-width is rescaled to match
  the original's optical weight (the new logo's viewBox has different proportions than
  the original 977-unit-wide one), and stroke color is overridden per current direction
  (see git history / ask before assuming it's still white or black).
- **Nav/footer wordmark** — original SVGs hidden (`display:none`), replaced with a
  `background-image` of `kalpataru-vista-logo.svg` on the wrapping `<a>`/container. This
  sidesteps hydration entirely since it's pure CSS, not DOM content React would revert.
- **Hero image aspect fix** — `object-position:top` on the building `<img>`, because the
  container's height was tuned for the original near-square photo; the Kalpataru render
  is landscape, and `object-fit:contain`'s default center alignment pushed all the visible
  content below the fold.
- **Cutout fill swap** — the *nested* copy of `hero_house` living inside
  `.hero_composite__3blHB` (used to reveal the building photo through the letter shapes)
  is hidden, and the container gets a flat `background:#000` instead — letters cut out to
  solid black rather than a photo.
- **Building stays visible** — `.hero_house__aJy7p{opacity:1!important}` defeats a
  GSAP-driven fade-out that used to hide the (outer, main) building image later in the
  scroll. Verified holding across an 8-point scroll sweep on both desktop and mobile
  viewports, not just at rest.

## The hero visual stack (bottom to top, current state)

1. `hero_house__aJy7p` (outer/standalone) — the building photo, full image, forced
   always-visible.
2. `hero_logo__FxgRj` — SVG outline, transparent fill + colored stroke, draws in via
   scroll (stroke-dasharray animation). Vector paths are the real Kalpataru logotype now.
3. `hero_composite__3blHB` — absolutely positioned, `mask-image` clips it to the same
   logotype shape. Currently filled solid black (see above) instead of a second photo
   layer; opacity is scroll-driven by the original GSAP timeline (untouched).
4. `hero_clouds__bC7V4` — decorative cloud images, unrelated to branding, left alone.

## New sections: React strips extra static siblings on hydration

The "content sections" plan (Overview / Key Benefits / Amenities / CTA, stacked above
the hidden `why-us_root__aGsFp` etc.) originally assumed a brand-new `<section>` with no
matching React component couldn't be reverted by hydration, since no component owns it.
**That assumption is false.** The container that lists `why-us_root__aGsFp` and its
sibling sections is itself React-owned (`why-us_root__aGsFp` is referenced in
`page-01bc6cce4f7f3b4a.js`). Inserting a static extra `<section>` as a sibling in that
list creates a server-HTML/hydration mismatch; React's hydration recovery wipes the
mismatched subtree, and the extra node disappears in-browser within milliseconds — even
though `curl`/`grep`/view-source show it present. Confirmed by probing at
`--virtual-time-budget=1`: the node is already gone.

**Working fix**: don't put new sections in the server-rendered HTML at all. Instead,
inject them with a small inline `<script>` right before `</body>` that runs on parse,
finds the anchor node (`.why-us_root__aGsFp`), and does `insertAdjacentHTML('beforebegin', ...)`.
Since hydration never sees the extra node in the initial DOM, there's no mismatch and
nothing to clean up. A `MutationObserver` on `document.body` re-runs the insert if
anything removes it later (defensive; disconnects after 8s). This is the pattern used for
`kv-overview` (Task 3) and should be reused for the remaining `kv-*` sections (Tasks 4-7)
— do not repeat the "insert `<section class="kv-...">...` directly before
`why-us_root__aGsFp`" literal HTML-splice instructions as originally written in the plan
without adapting them to this script-injection approach.

## Asset pipeline notes

No Python, ImageMagick, cwebp, or pngquant available in this environment — everything
image-related was done with tools already on the machine:

- **PDF → real vector paths**: `pdftocairo -svg logo.pdf logo.svg` (poppler, found via
  winget package path) extracts actual `<path d="...">` data, not a raster embed. This is
  what makes the mask/logo swaps look like real vector logos instead of blurry PNGs.
- **Background removal / crop / resize**: PowerShell + `System.Drawing`
  (`Bitmap.LockBits` for a fast per-pixel alpha key on the near-white background,
  `Graphics.DrawImage` for resize/crop). No sophisticated matting — works because the
  source renders had a clean, near-uniform white background, not a photographic one.
- **Headless verification**: Chrome for Windows, `--headless --disable-gpu --dump-dom`.
  `--screenshot` does not work here (sandboxed file write); dump-dom + injected probe
  script does.
