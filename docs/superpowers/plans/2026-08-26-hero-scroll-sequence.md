# Hero Scroll-Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static crossfade hero background on `kalpataru-vista.html` with a pinned, scroll-scrubbed 428-frame walkthrough sequence (desktop only), sourced from `assets/KALPATARU SHOW APARTMENT/`, without touching the header or any other section.

**Architecture:** A `<canvas>` layer added to the existing `.hero` section, painted via a windowed/progressive frame loader (only fetches frames near the current scroll position, never the full 428-frame set upfront), driven by a `gsap.matchMedia()`-gated `ScrollTrigger` that pins `.hero` and scrubs frames as the user scrolls — same mechanism as the sibling Camellias Residences build's `initHeroSequence()`, adapted for a much larger frame count. Below 992px, the existing `.hero__slides` crossfade slideshow (already implemented, unchanged) keeps serving as the background — zero new code paths on mobile.

**Tech Stack:** Static HTML/CSS/JS (no build step), GSAP 3.13.0 + ScrollTrigger (already loaded via CDN in `kalpataru-vista.html`), `ffmpeg` (already installed, confirmed on PATH) for the one-time PNG→webp frame conversion, Playwright for manual verification (per `CLAUDE.md`'s established testing approach — this repo has no automated test suite).

**Reference spec:** `docs/superpowers/specs/2026-08-26-hero-scroll-sequence-design.md`

---

### Task 1: Keep the raw source renders out of git

The `assets/KALPATARU SHOW APARTMENT/` folder holds 428 raw PNGs, 583MB total — this is source
material for the conversion step, not something that ships with the page (same role as the
already-gitignored `kalpataruvista.org.in_files/` reference export).

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the ignore rule**

Add this line to `.gitignore` (after the existing two lines):

```
assets/KALPATARU SHOW APARTMENT/
```

- [ ] **Step 2: Verify it's ignored**

Run: `git check-ignore -v "assets/KALPATARU SHOW APARTMENT/scene00001.png"`
Expected: prints the `.gitignore` line and path, confirming the rule matches (exit code 0).

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore raw hero walkthrough source renders

583MB of source PNGs in assets/KALPATARU SHOW APARTMENT/ — reference
material for the frame-sequence conversion, not shipped page assets.
Same treatment as the existing kalpataruvista.org.in_files/ ignore."
```

---

### Task 2: Convert the 428-frame sequence to webp

Produces the actual asset the hero will scrub through: `assets/hero-src/apartment-sequence/frame-001.webp` … `frame-428.webp`, 1920×1088 (native resolution, unscaled), libwebp quality 92 (visually lossless). Command verified in a scratch run before writing this plan: ~130-140KB per frame, ~1920x1088 preserved, ~0.27s per frame.

**Files:**
- Create: `scripts/build-hero-frames.sh`
- Create: `assets/hero-src/apartment-sequence/frame-001.webp` … `frame-428.webp` (428 generated files)

- [ ] **Step 1: Write the conversion script**

Create `scripts/build-hero-frames.sh`:

```bash
#!/usr/bin/env bash
# Converts assets/KALPATARU SHOW APARTMENT/scene*.png (428 source renders,
# odd-numbered scene00001..scene00855) into a 1-indexed, zero-padded webp
# sequence for the pinned hero scroll animation.
#
# Re-run this any time the source renders in
# "assets/KALPATARU SHOW APARTMENT/" are swapped out.
set -euo pipefail

SRC="assets/KALPATARU SHOW APARTMENT"
OUT="assets/hero-src/apartment-sequence"

mkdir -p "$OUT"
rm -f "$OUT"/frame-*.webp

shopt -s nullglob
files=("$SRC"/scene*.png)
shopt -u nullglob

if [ "${#files[@]}" -eq 0 ]; then
  echo "No source frames found in '$SRC'" >&2
  exit 1
fi

i=1
for f in "${files[@]}"; do
  out=$(printf "%s/frame-%03d.webp" "$OUT" "$i")
  ffmpeg -y -loglevel error -i "$f" -c:v libwebp -q:v 92 -compression_level 6 "$out"
  i=$((i + 1))
done

echo "Converted ${#files[@]} frames into $OUT"
```

- [ ] **Step 2: Run it**

Run: `bash scripts/build-hero-frames.sh` (run in background or with an extended timeout — 428 sequential ffmpeg calls take roughly 2 minutes)
Expected: `Converted 428 frames into assets/hero-src/apartment-sequence`

- [ ] **Step 3: Verify frame count**

Run: `ls assets/hero-src/apartment-sequence | wc -l`
Expected: `428`

- [ ] **Step 4: Verify total size is in the expected range**

Run: `du -sh assets/hero-src/apartment-sequence`
Expected: somewhere in the 45-70MB range (measured single-frame average was ~135KB × 428 ≈ 58MB). If it's wildly outside this range, something's off with the `-q:v` setting — stop and investigate before continuing.

- [ ] **Step 5: Verify first and last frame dimensions**

Run: `ffmpeg -i assets/hero-src/apartment-sequence/frame-001.webp 2>&1 | grep Stream` and the same for `frame-428.webp`
Expected: both report `1920x1088`

- [ ] **Step 6: Spot-check visual quality**

Read `assets/hero-src/apartment-sequence/frame-001.webp` and `assets/hero-src/apartment-sequence/frame-428.webp` with the Read tool and eyeball them — confirm no visible compression artifacts (blocking, banding) and that they look like frames from the same walkthrough as the source PNGs.

- [ ] **Step 7: Commit**

```bash
git add scripts/build-hero-frames.sh assets/hero-src/apartment-sequence/
git commit -m "feat: generate 428-frame hero walkthrough sequence

Converts the full KALPATARU SHOW APARTMENT render set to webp
(q92, native 1920x1088, ~58MB total) via scripts/build-hero-frames.sh.
No frames dropped — full coverage kept per the design spec, since
scroll-driven animation is meant to extend across the site later.
Script is re-runnable if the source renders change."
```

---

### Task 3: Hero markup + scoped CSS

Adds the canvas layer to the hero section and the hero-scoped Camellias-palette custom properties, without touching the header or the site's shared `--fairway-*`/`--gold-*`/`--sand-*` tokens.

**Files:**
- Modify: `kalpataru-vista.html` (hero section, ~lines 43-67)
- Modify: `kalpataru-vista_files/kalpataru-vista.css` (Hero block, ~lines 150-195)

- [ ] **Step 1: Add the canvas layer to the hero markup**

In `kalpataru-vista.html`, find:

```html
  <div class="hero__slides" id="heroSlides">
    <div class="hero__slide is-active" style="background-image:url('assets/hero-src/h1.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h2.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h3.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h4.webp')"></div>
  </div>
  <div class="hero__overlay"></div>
```

Replace with:

```html
  <div class="hero__slides" id="heroSlides">
    <div class="hero__slide is-active" style="background-image:url('assets/hero-src/h1.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h2.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h3.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h4.webp')"></div>
  </div>
  <canvas class="hero__sequence" id="heroSequence" aria-hidden="true"></canvas>
  <div class="hero__overlay"></div>
```

(Canvas sits between the slides layer and the overlay, so the overlay's legibility gradient still
tints whichever background is actually showing — slides on mobile, sequence frames on desktop.
Everything below `.hero__overlay`, including `.hero__copy` and `#siteVisitForm`, is untouched.)

- [ ] **Step 2: Add hero-scoped palette tokens and canvas styling**

In `kalpataru-vista_files/kalpataru-vista.css`, find the `/* Hero */` block:

```css
/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.hero__slides { position: absolute; inset: 0; background: var(--fairway-900); }
.hero__slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transition: opacity 1.2s ease;
}
.hero__slide.is-active { opacity: 1; }
.hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(var(--fairway-900-rgb), 0.15) 0%, rgba(var(--fairway-900-rgb), 0.85) 90%);
}
.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
  color: var(--white);
}
.hero__copy h1 { color: var(--white); }
.hero__rera em { font-style: normal; color: var(--gold-300); font-size: var(--fs-small); }
.hero__form {
  background: rgba(var(--sand-50-rgb), 0.96);
  color: var(--ink-900);
  padding: var(--space-3);
  border-top: 2px solid var(--gold-500);
  display: flex; flex-direction: column; gap: var(--space-1);
}
.hero__form h2 { font-size: var(--fs-heading); }
.hero__form input, .hero__form textarea {
  font-family: var(--font-body);
  padding: 0.7em; border: 1px solid var(--sand-100); background: var(--white);
}
.hero__form-success { color: var(--fairway-700); font-weight: 600; }
```

Replace with:

```css
/* Hero
   Palette here is intentionally scoped to .hero only — Camellias
   Residences' exact hex values, not the site's shared --fairway-*/
   --gold-*/--sand-* tokens (see docs/superpowers/specs/2026-08-26-
   hero-scroll-sequence-design.md). Every other section keeps using
   the shared tokens untouched. */
.hero {
  --hero-green: #254441;
  --hero-green-rgb: 37, 68, 65;
  --hero-gold: #c9a13b;
  --hero-cream: #e7e1dc;
  --hero-cream-rgb: 231, 225, 220;
  --hero-ink: #121717;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.hero__slides { position: absolute; inset: 0; background: var(--hero-green); }
.hero__slide {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0; transition: opacity 1.2s ease;
}
.hero__slide.is-active { opacity: 1; }
.hero__sequence {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  display: none;
}
@media (min-width: 992px) {
  .hero__sequence { display: block; }
}
.hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(var(--hero-green-rgb), 0.15) 0%, rgba(var(--hero-green-rgb), 0.85) 90%);
}
.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
  color: var(--white);
}
.hero__copy h1 { color: var(--white); }
.hero__rera em { font-style: normal; color: var(--hero-gold); font-size: var(--fs-small); }
.hero__form {
  background: rgba(var(--hero-cream-rgb), 0.96);
  color: var(--hero-ink);
  padding: var(--space-3);
  border-top: 2px solid var(--hero-gold);
  display: flex; flex-direction: column; gap: var(--space-1);
}
.hero__form h2 { font-size: var(--fs-heading); }
.hero__form input, .hero__form textarea {
  font-family: var(--font-body);
  padding: 0.7em; border: 1px solid var(--hero-cream); background: var(--white);
}
.hero__form-success { color: var(--hero-green); font-weight: 600; }
.hero__form .btn-solid { background: var(--hero-gold); }
.hero__form .btn-solid:hover { background: var(--hero-green); }
```

(The last two rules scope the site-visit form's submit button to the hero palette via a descendant
selector — the shared `.btn-solid` rule itself, used by the header's "Enquire Now" button, is not
modified.)

- [ ] **Step 3: Visually sanity-check in a browser**

Open `kalpataru-vista.html` directly (`file://`) at a desktop width (≥992px). Expected: hero looks
the same as before except the background is now solid `--hero-green` (canvas is empty/untouched by
JS at this point in the plan — Task 4 wires up the actual drawing) and the form/RERA text now use
the Camellias-hex greens/gold/cream instead of the old fairway/gold/sand shades. No layout shift,
no console errors.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files/kalpataru-vista.css
git commit -m "feat: add hero canvas layer and scoped Camellias palette

Canvas sits between the existing slideshow and overlay, hidden below
992px. New --hero-* custom properties scoped to .hero carry Camellias
Residences' exact hex values without touching the shared design
tokens used elsewhere on the page."
```

---

### Task 4: Windowed frame loader + pinned scroll scrub

Wires the canvas up to actually draw frames, driven by scroll position, without eagerly fetching
all 428 frames.

**Files:**
- Modify: `kalpataru-vista_files/site.js`

- [ ] **Step 1: Add `initHeroSequence()`**

In `kalpataru-vista_files/site.js`, add this function (after `initHeroSlideshow`, before
`initSpecTabs` is a reasonable spot — order doesn't matter functionally since all `init*` functions
are independent):

```js
function initHeroSequence() {
  const canvas = document.getElementById("heroSequence");
  if (!canvas) return;
  const gsapReady = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (!gsapReady) return;

  const ctx = canvas.getContext("2d");
  const frameCount = 428;
  const lookAhead = 8;
  const framePath = (i) => `assets/hero-src/apartment-sequence/frame-${String(i).padStart(3, "0")}.webp`;

  const frames = new Map();
  let targetIndex = 1;
  let direction = 1;
  let lastPaintedIndex = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
  }

  function paint(index) {
    const img = frames.get(index);
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastPaintedIndex = index;
  }

  function requestFrame(index) {
    if (frames.has(index)) return;
    const img = new Image();
    img.onload = () => {
      if (index === targetIndex) paint(index);
    };
    img.src = framePath(index);
    frames.set(index, img);
  }

  function drawFrame(index) {
    const clamped = Math.min(Math.max(index, 1), frameCount);
    direction = clamped >= targetIndex ? 1 : -1;
    targetIndex = clamped;
    requestFrame(clamped);
    for (let step = 1; step <= lookAhead; step += 1) {
      const aheadIndex = clamped + step * direction;
      if (aheadIndex >= 1 && aheadIndex <= frameCount) requestFrame(aheadIndex);
    }
    paint(clamped);
  }

  resizeCanvas();
  drawFrame(1);
  window.addEventListener("resize", () => {
    resizeCanvas();
    if (lastPaintedIndex !== null) paint(lastPaintedIndex);
  });

  gsap.matchMedia().add("(min-width: 992px)", () => {
    const st = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "+=400%",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        drawFrame(Math.round(self.progress * (frameCount - 1)) + 1);
      },
    });
    return () => st.kill();
  });
}
```

- [ ] **Step 2: Call it from `DOMContentLoaded`**

Find:

```js
document.addEventListener("DOMContentLoaded", function () {
  initHeaderScrollState();
  initMobileNav();
  initHeroSlideshow();
  initSiteVisitForm();
  initScrollReveal();
  initSpecTabs();
});
```

Replace with:

```js
document.addEventListener("DOMContentLoaded", function () {
  initHeaderScrollState();
  initMobileNav();
  initHeroSlideshow();
  initHeroSequence();
  initSiteVisitForm();
  initScrollReveal();
  initSpecTabs();
});
```

- [ ] **Step 3: Manual smoke test in a browser**

Open `kalpataru-vista.html` at a desktop width (≥992px) and scroll down through the hero. Expected:
the hero pins, the canvas image advances as you scroll (frame 1 at the top, frame 428 near the end
of the pinned range), and it eventually releases into the `#quickfacts` section below. Open the
browser's network tab first — expected to see only a handful of `frame-*.webp` requests fire
initially (not all 428), with more streaming in as you scroll further.

Resize the browser below 992px (or reload at a mobile viewport). Expected: canvas is not visible,
`.hero__slides` crossfade is the background exactly as before, and the network tab shows zero
`apartment-sequence/frame-*.webp` requests.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista_files/site.js
git commit -m "feat: wire up windowed-loading pinned hero scroll sequence

initHeroSequence() scrubs the 428-frame walkthrough via a pinned
ScrollTrigger (gsap.matchMedia gated at 992px), fetching frames in a
small look-ahead window around the current scroll position instead of
preloading the full ~58MB set upfront. Sub-992px viewports are
unaffected — existing initHeroSlideshow still owns that background."
```

---

### Task 5: Full-page verification pass

Per `CLAUDE.md`'s established verification method (no automated test suite in this repo — Playwright
headless-Chromium drive-through is the documented way to check a change).

**Files:** none (verification only — script lives in the scratch dir, not committed)

- [ ] **Step 1: Ensure Playwright is available**

Run: `npm install playwright` in a scratch directory (not inside this repo), then
`npx playwright install chromium` if browsers aren't already installed.

- [ ] **Step 2: Write and run the verification script**

Save as `verify-hero.mjs` in the scratch directory:

```js
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pageUrl = "file://" + path.resolve("REPLACE_WITH_ABSOLUTE_PATH_TO/kalpataru-vista.html");

const browser = await chromium.launch();
const results = [];

for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("requestfailed", (req) => failedRequests.push(req.url()));

  await page.goto(pageUrl);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `hero-${viewport.name}-top.png` });

  if (viewport.name === "desktop") {
    // scroll partway through the pinned hero and recheck
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `hero-${viewport.name}-mid-scroll.png` });

    const frameRequestCount = failedRequests.filter((u) => u.includes("apartment-sequence")).length
      + (await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => r.name.includes("apartment-sequence")).length));
    results.push({ viewport: viewport.name, frameRequestCount });
  } else {
    const frameRequests = await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => r.name.includes("apartment-sequence")).length);
    results.push({ viewport: viewport.name, frameRequests });
  }

  // confirm the site-visit form still fake-submits
  await page.fill("#siteVisitForm input[name=name]", "Test User");
  await page.fill("#siteVisitForm input[name=email]", "test@example.com");
  await page.fill("#siteVisitForm input[name=phone]", "9999999999");
  await page.click("#siteVisitForm button[type=submit]");
  const successVisible = await page.isVisible(".hero__form-success");

  results.push({ viewport: viewport.name, consoleErrors, failedRequests, successVisible });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
```

Replace `REPLACE_WITH_ABSOLUTE_PATH_TO` with the actual absolute path to the repo
(`c:\Users\USER\Documents\GitHub\Earth matters\kalpataru vista`) before running.

Run: `node verify-hero.mjs`

Expected:
- Desktop viewport: `successVisible: true`, no `consoleErrors` beyond none, `frameRequestCount` present but far less than 428 (confirms windowed loading — a couple thousand pixels of scroll should trigger roughly a dozen-ish frame fetches, not hundreds).
- Mobile viewport: `successVisible: true`, `frameRequests: 0` (confirms zero sequence fetches below 992px), no console errors. The only expected failed requests are the pre-existing `assets/hero-src/h1.webp`-`h4.webp` (documented known limitation in `CLAUDE.md` — those files still don't exist, unrelated to this change).

- [ ] **Step 3: Review the screenshots**

Read `hero-desktop-top.png`, `hero-desktop-mid-scroll.png`, and `hero-mobile-top.png` with the Read
tool. Confirm: desktop shows a walkthrough frame filling the hero background with legible text over
it; the mid-scroll desktop shot shows a visibly different frame than the top one (proves the scrub
is actually advancing); mobile shows the existing slideshow background, unchanged from before this
plan.

- [ ] **Step 4: Fix anything the verification surfaces**

If console errors, failed requests (beyond the known h1-h4.webp gap), or a broken form submission
show up, fix them and re-run Step 2 before considering this plan done. No commit needed for this
task unless a fix was required — in which case commit the fix with a message describing what the
verification pass caught.
