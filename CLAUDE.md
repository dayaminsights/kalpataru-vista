# Kalpataru Vista — project memory

## What this repo actually is

A "Save Page As" capture of **findrealestate.com** (a Next.js app), being rebranded in place
into a sales site for **Kalpataru Vista**, a residential project in Noida (twin/quad
towers, 3 & 4 BHK). This is not a hand-authored site — it's someone else's compiled,
minified React app, edited by find/replace surgery. That constraint drives almost every
decision in this repo. Read `ARCHITECTURE.md` before making structural changes.

## Run it locally

```
node local-server.js
```

Serves on `http://localhost:5000/`. `local-server.js` is convenient for local dev (its
`?probe=1` route is the project's whole verification methodology, see below), but as of
the image patches described in ARCHITECTURE.md it is **no longer required to view the
site** — the page now works on a plain static file server too (confirmed against a bare
Node static server with no `/_next/image` route at all: 0 broken images, 0 requests to
that endpoint). This is what makes GitHub Pages hosting possible; see
`docs/superpowers/plans` history / git log for the patch that made this true if the image
handling ever needs revisiting.

Kill any previous instance first (`taskkill //F //IM node.exe` on Windows) — it doesn't
hot-reload and holds port 5000.

## The one rule that matters: hydration overwrites HTML

This is a client-hydrated React app. The HTML files are the **server-rendered snapshot**,
but on load, React re-renders from `page-01bc6cce4f7f3b4a.js` and **replaces** any DOM
content that component owns — silently reverting HTML edits that look successful in
`view-source` but vanish in the real browser.

Anything that turns out to be React-owned (so far: the nav/hero/footer logo SVG, the hero
headline/subhead/CTA text) must be patched **in the JS bundle itself**, not just the HTML.
Symptom if you get this wrong: the edit "sticks" in curl/grep output but reverts on page
load or after a scroll-triggered re-render.

**Workflow that works:**
1. `grep` the JS chunks under `..._files/*.js` for the string/markup you're changing.
2. If found, edit it there (exact string match, verify with `node --check file.js` after).
3. Also edit both HTML files for consistency at first paint (`index.html` and the long
   FIND-named file — keep them in sync, we don't know which one might get opened directly).
4. **Verify in a real browser, not by reading source.** See below.

## Verification: headless Chrome, not screenshots

Screenshot tools are sandboxed/blocked in this environment (file writes fail). Instead,
`local-server.js` has a `?probe=1` route that injects a script reporting computed styles,
element existence, and layout geometry via `document.title` after a 5s settle delay (long
enough for GSAP/hydration to finish). Read it with:

```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --dump-dom --virtual-time-budget=10000 --window-size=1900,900 \
  "http://localhost:5000/?probe=1&scrollY=0" > out.html
```

then parse the `<title>PROBE::{...}</title>` JSON out of `out.html` (Node, not the Read
tool — write output under the session scratchpad or a project-relative path, not `/tmp`,
which doesn't resolve consistently on Windows in this environment).

`scrollY=N` lets you check computed state at any scroll depth — needed because this hero
is a GSAP ScrollTrigger scroll-scrub animation, and "does it look right" depends on scroll
position, not just initial load.

**Extend the probe rather than guessing.** Every real bug found in this project so far
(logo not hiding, image disappearing, building fading out) was diagnosed by adding a new
computed-style check to the probe and reading the actual number — not by reasoning about
CSS specificity from the source.

## Where things live

| What | File |
|---|---|
| Brand overrides (all of them) | `..._files/kalpataru-brand.css` — appended-to, linked last in `<head>` |
| Patched React bundle | `..._files/page-01bc6cce4f7f3b4a.js` (original backed up as `.js.orig`) |
| Dev server + probe tooling | `local-server.js` |
| Vector logo source | `assets/logo.pdf` → `assets/logo.svg` (via `pdftocairo -svg`) |
| Nav/footer wordmark | `..._files/kalpataru-vista-logo.svg` |
| Hero building photo | `..._files/house.png` (replaces original `house.png`, transparent bg) |
| Raw/unused assets | `assets/` — includes an unused 428-frame apartment walkthrough sequence and show-apartment stills, not currently wired into the site |

## Known rough edges

- `house.png` is ~3.2MB (resized from a 6.4MB transparent PNG). No pngquant/cwebp/
  ImageMagick available in this environment — only .NET `System.Drawing` via PowerShell,
  which can resize but not seriously compress. If this ships, run it through real
  compression tooling elsewhere.
- The hero container's tall aspect ratio was tuned for the *original* FIND photo (near-
  square). The Kalpataru render is landscape; `object-position:top` compensates but the
  scroll-scrub zoom choreography was never re-tuned for the new proportions.
- `local-server.js` still has the `?probe=1` diagnostic route wired in. Harmless (inert
  without the query param) but strip it before treating this as production code.
- A prior from-scratch build attempt (custom scroll sequence, `docs/superpowers/` specs,
  frame-based hero) was abandoned in favor of this reskin approach — those files are
  deleted from the working tree but still in git history if that direction is worth
  revisiting.
- Nothing here has been committed yet (`git status` shows everything untracked/deleted).
