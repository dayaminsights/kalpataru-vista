# Kalpataru Vista Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `kalpataru-vista.html`, a static luxury real-estate landing page for the fictionalized
"Kalpataru Vista" portfolio project, following the Camellias Residences repo's build pattern
(hand-authored HTML/CSS/JS, no build step, no framework).

**Architecture:** One HTML file + a two-layer CSS cascade (`kalpataru-vista.css` for tokens/system/
layout, `kalpataru-vista-theme.css` for the signature decorative treatments) + one `site.js` with
named `init*()` functions called from a single `DOMContentLoaded` listener. jQuery + GSAP +
ScrollTrigger + SplitText + Splide, loaded at the end of `<body>`, same stack as Camellias.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, `clamp()` fluid type), vanilla-pattern JS on
top of jQuery/GSAP/Splide (CDN `<script>` tags, no bundler), Google Fonts (Fraunces, Archivo, IBM
Plex Mono).

**Testing approach — read before starting:** This codebase has no test framework and no test suite,
matching the sibling Camellias repo. "Verify" steps below mean: open the page with Playwright in
headless Chromium (`npm install playwright` in a scratch dir if not already available — it is not a
project dependency), capture `console` + `requestfailed` events, and take a screenshot at 1440px and
390px widths. A task is not done until its verify step shows zero console errors and the new section
renders as described. Do this after every task, not just at the end.

**Design tokens (locked — do not redesign, wire these into the CSS exactly):**

Palette (named for the golf-course setting, not generic luxury defaults):
- `--fairway-900: #12261B` — near-black green, footer/dark chrome
- `--fairway-700: #1E4531` — primary deep green, headings on light bg, nav
- `--fairway-500: #3D6B4C` — mid green, secondary buttons/hover states
- `--gold-500: #B08D3F` — muted antique-brass gold, primary accent/CTA/dividers
- `--gold-300: #D9BE7C` — light gold, hover/highlight only
- `--sand-50: #F8F4EA` — page background (bunker-sand cream, not generic white-cream)
- `--sand-100: #F1EBDC` — card/section-alt background
- `--ink-900: #1B1A15` — body text
- `--white: #FFFFFF`

Type (three roles, each with a reason):
- Display — **Fraunces** (variable serif, warm/confident, used only for headings and pull quotes)
- Body — **Archivo** (architectural, clear at small sizes, used for all paragraph/UI text)
- Numeric/label — **IBM Plex Mono** (blueprint/scorecard feel, used ONLY for numbers: prices, sq.
  ft. figures, travel-time minutes, tab labels, the quick-facts strip) — this is the signature
  typographic move, do not use it for prose.

Signature element — **the horizon divider**: a thin gold line with a centered dot, used between
every major section, echoing the golf-course horizon view the towers are sold on. One shared
component (`.horizon-divider`), reused everywhere, animates its width in on scroll via the existing
`data-anim="element"` reveal system — no new one-off dividers.

Quick-facts strip reads as a golf scorecard row (three cells, thin gold rules between them, mono
numerals) — this is deliberate, not a generic icon-list.

---

## File Structure

```
kalpataru vista/
├── kalpataru-vista.html
├── kalpataru-vista_files/
│   ├── kalpataru-vista.css        # tokens, reset, type system, layout/grid, components
│   ├── kalpataru-vista-theme.css  # horizon-divider, hero overlay gradient, dark-chrome sections
│   └── site.js                    # all page scripting
├── assets/
│   ├── meet.webp / enjoy.webp / relax.webp    (already present)
│   └── hero-src/                              (user-supplied hero photos, may still be empty)
├── CLAUDE.md
```

No `logo.png`: the brand mark is an inline SVG/CSS wordmark (`.logo` component in the header),
not a raster file — simpler, crisp at any size, and avoids needing an image-generation step. This
is the one deviation from the design spec's file list; noted here rather than left silent.

---

### Task 1: Scaffold HTML shell + CSS/JS files

**Files:**
- Create: `kalpataru-vista.html`
- Create: `kalpataru-vista_files/kalpataru-vista.css`
- Create: `kalpataru-vista_files/kalpataru-vista-theme.css`
- Create: `kalpataru-vista_files/site.js`

- [ ] **Step 1: Create the HTML shell**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kalpataru Vista — 3 &amp; 4 BHK Residences, Sector 128, Noida Expressway</title>
<meta name="description" content="Kalpataru Vista: twin residential towers set on a 110-acre golf course along the Noida Expressway. 3 &amp; 4 BHK homes.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="kalpataru-vista_files/kalpataru-vista.css">
<link rel="stylesheet" href="kalpataru-vista_files/kalpataru-vista-theme.css">
</head>
<body>

<header class="header" id="header"><!-- Task 3 --></header>

<main>
<section class="hero" id="hero"><!-- Task 4 --></section>
<section class="quickfacts" id="quickfacts"><!-- Task 5 --></section>
<section class="overview" id="overview"><!-- Task 6 --></section>
<section class="amenities" id="amenities"><!-- Task 7 --></section>
<section class="specs" id="specifications"><!-- Task 8 --></section>
<section class="unitplans" id="floorplan"><!-- Task 9 --></section>
<section class="sitelayout" id="sitelayout"><!-- Task 10 --></section>
<section class="location" id="location"><!-- Task 10 --></section>
<section class="virtualtour" id="virtualtour"><!-- Task 11 --></section>
</main>

<footer class="footer" id="contact"><!-- Task 11 --></footer>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js"></script>
<script>gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);</script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<script src="kalpataru-vista_files/site.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create the CSS token/reset file**

```css
/* kalpataru-vista.css — tokens, reset, type system, layout */

:root {
  --fairway-900: #12261B;
  --fairway-700: #1E4531;
  --fairway-500: #3D6B4C;
  --gold-500: #B08D3F;
  --gold-300: #D9BE7C;
  --sand-50: #F8F4EA;
  --sand-100: #F1EBDC;
  --ink-900: #1B1A15;
  --white: #FFFFFF;

  --font-display: "Fraunces", serif;
  --font-body: "Archivo", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  --fs-display-xl: clamp(2.75rem, 2rem + 3vw, 5rem);
  --fs-display-lg: clamp(2rem, 1.5rem + 2vw, 3.25rem);
  --fs-heading: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
  --fs-body: 1rem;
  --fs-small: 0.875rem;
  --fs-mono: 0.95rem;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;
  --space-7: 9rem;

  --container-max: 1200px;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--sand-50);
  color: var(--ink-900);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--fairway-700);
  margin: 0 0 var(--space-2);
  line-height: 1.1;
}
h1 { font-size: var(--fs-display-xl); }
h2 { font-size: var(--fs-display-lg); }
h3 { font-size: var(--fs-heading); }
p { margin: 0 0 var(--space-2); }
a { color: inherit; }
ul { padding-left: 1.1em; }

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-3);
}
.section {
  padding: var(--space-6) 0;
}
.section-alt {
  background: var(--sand-100);
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-small);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold-500);
  display: block;
  margin-bottom: var(--space-1);
}
.mono {
  font-family: var(--font-mono);
}
.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-small);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.9em 1.8em;
  border-radius: 2px;
  border: 1px solid var(--gold-500);
  color: var(--fairway-900);
  background: transparent;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
}
.btn:hover { background: var(--gold-500); color: var(--white); }
.btn-solid { background: var(--gold-500); color: var(--white); }
.btn-solid:hover { background: var(--fairway-700); border-color: var(--fairway-700); }

[data-anim] { opacity: 0; }
```

- [ ] **Step 3: Create the theme file (signature treatments)**

```css
/* kalpataru-vista-theme.css — signature decorative layer, loaded after kalpataru-vista.css */

.horizon-divider {
  position: relative;
  height: 1px;
  max-width: 1100px;
  margin: var(--space-5) auto;
  background: linear-gradient(90deg, transparent, var(--gold-500) 20%, var(--gold-500) 80%, transparent);
}
.horizon-divider::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold-500);
  transform: translate(-50%, -50%);
}

.chrome-dark {
  background: var(--fairway-900);
  color: var(--sand-50);
}
.chrome-dark h1, .chrome-dark h2, .chrome-dark h3 {
  color: var(--sand-50);
}
.chrome-dark .eyebrow { color: var(--gold-300); }
```

- [ ] **Step 4: Create the JS skeleton**

```js
// site.js
document.addEventListener("DOMContentLoaded", function () {
  initScrollReveal();
});

function initScrollReveal() {
  const els = document.querySelectorAll('[data-anim="element"]');
  els.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
}
```

- [ ] **Step 5: Verify**

Open `kalpataru-vista.html` with Playwright (headless Chromium), confirm: page loads, title reads
"Kalpataru Vista — 3 & 4 BHK Residences, Sector 128, Noida Expressway", zero console errors, zero
failed requests (CDN scripts + Google Fonts all resolve), background is `#F8F4EA` (sand-50).

- [ ] **Step 6: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: scaffold Kalpataru Vista page shell, tokens, and JS skeleton"
```

---

### Task 2: Header + nav + logo

**Files:**
- Modify: `kalpataru-vista.html` (`<header class="header" id="header">` block)
- Modify: `kalpataru-vista_files/kalpataru-vista.css` (append header styles)
- Modify: `kalpataru-vista_files/site.js` (append `initHeaderScrollState`, `initMobileNav`)

- [ ] **Step 1: Write the header markup**

```html
<header class="header" id="header">
  <div class="container header__inner">
    <a href="#hero" class="logo" aria-label="Kalpataru Vista, home">
      <span class="logo__mark">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.2"/>
          <path d="M10 4 L10 16 M4 10 L16 10" stroke="currentColor" stroke-width="1"/>
        </svg>
      </span>
      <span class="logo__word">Kalpataru <em>Vista</em></span>
    </a>
    <nav class="nav">
      <a href="#overview">Overview</a>
      <a href="#amenities">Amenities</a>
      <a href="#specifications">Specifications</a>
      <a href="#floorplan">Floor Plans</a>
      <a href="#price">Price List</a>
      <a href="#location">Location</a>
      <a href="#contact" class="btn btn-solid">Enquire Now</a>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
```

- [ ] **Step 2: Style it**

```css
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: var(--space-2) 0;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header.is-scrolled {
  background: rgba(18, 38, 27, 0.92);
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  text-decoration: none;
  color: var(--white);
}
.logo__word { font-family: var(--font-display); font-size: 1.15rem; letter-spacing: 0.02em; }
.logo__word em { font-style: italic; color: var(--gold-300); }
.nav { display: flex; align-items: center; gap: var(--space-3); }
.nav a { color: var(--white); text-decoration: none; font-size: var(--fs-small); text-transform: uppercase; letter-spacing: 0.04em; }
.nav a:hover { color: var(--gold-300); }
.nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0; }
.nav-toggle span { display: block; width: 22px; height: 2px; background: var(--white); margin: 5px 0; }

@media (max-width: 860px) {
  .nav { position: fixed; top: 0; right: -100%; width: min(320px, 80vw); height: 100vh;
    background: var(--fairway-900); flex-direction: column; justify-content: center;
    align-items: flex-start; padding: var(--space-4); transition: right 0.3s ease; }
  .nav.is-open { right: 0; }
  .nav-toggle { display: block; }
}
```

- [ ] **Step 3: Wire up scroll-state and mobile nav in `site.js`**

```js
function initHeaderScrollState() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  });
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}
```

Update the `DOMContentLoaded` listener:

```js
document.addEventListener("DOMContentLoaded", function () {
  initHeaderScrollState();
  initMobileNav();
  initScrollReveal();
});
```

- [ ] **Step 4: Verify**

Playwright: header is fixed and transparent at scroll 0, gains `.is-scrolled` background after
scrolling 40px+. At 390px width, `.nav-toggle` is visible, clicking it slides `.nav` in from the
right and sets `aria-expanded="true"`; clicking a link closes it again. No console errors.

- [ ] **Step 5: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add header, nav, mobile menu, and inline SVG logo"
```

---

### Task 3: Hero section

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="hero" id="hero">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css` / `-theme.css`
- Modify: `kalpataru-vista_files/site.js` (`initHeroSlideshow`, `initSiteVisitForm`)

- [ ] **Step 1: Write the hero markup**

```html
<section class="hero" id="hero">
  <div class="hero__slides" id="heroSlides">
    <div class="hero__slide is-active" style="background-image:url('assets/hero-src/h1.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h2.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h3.webp')"></div>
    <div class="hero__slide" style="background-image:url('assets/hero-src/h4.webp')"></div>
  </div>
  <div class="hero__overlay"></div>
  <div class="container hero__inner">
    <div class="hero__copy">
      <span class="eyebrow">Sector 128 · Noida Expressway</span>
      <h1>Welcome to<br>Kalpataru Vista</h1>
      <p class="mono hero__rera">RERA No. UPRERAPRJ00000 <em>(placeholder, portfolio project)</em></p>
    </div>
    <form class="hero__form" id="siteVisitForm">
      <h3>Request a Site Visit</h3>
      <input type="text" name="name" placeholder="Name" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="tel" name="phone" placeholder="Contact Number" required>
      <textarea name="message" placeholder="Message"></textarea>
      <button type="submit" class="btn btn-solid">Contact Us</button>
      <p class="hero__form-success" hidden>Thanks — we'll be in touch shortly.</p>
    </form>
  </div>
</section>
```

- [ ] **Step 2: Style the hero**

```css
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
  background: linear-gradient(180deg, rgba(18,38,27,0.15) 0%, rgba(18,38,27,0.85) 90%);
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
  background: rgba(248, 244, 234, 0.96);
  color: var(--ink-900);
  padding: var(--space-3);
  border-top: 2px solid var(--gold-500);
  display: flex; flex-direction: column; gap: var(--space-1);
}
.hero__form input, .hero__form textarea {
  font-family: var(--font-body);
  padding: 0.7em; border: 1px solid var(--sand-100); background: var(--white);
}
.hero__form-success { color: var(--fairway-700); font-weight: 600; }

@media (max-width: 860px) {
  .hero__inner { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Slideshow + fake form submit in `site.js`**

```js
function initHeroSlideshow() {
  const slides = document.querySelectorAll("#heroSlides .hero__slide");
  if (slides.length < 2) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("is-active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-active");
  }, 5000);
}

function initSiteVisitForm() {
  const form = document.getElementById("siteVisitForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("input, textarea, button").forEach((el) => (el.hidden = true));
    form.querySelector(".hero__form-success").hidden = false;
  });
}
```

Add both calls to the `DOMContentLoaded` listener alongside the Task 2 calls.

- [ ] **Step 4: Verify**

Playwright: hero fills the viewport, slide rotates (poll `is-active` class changes after 5s+), if
`assets/hero-src/` is still empty the slide `<div>`s render as solid `--fairway-900` (no broken-image
icon since these are CSS backgrounds, not `<img>`) — confirm no console errors either way. Submitting
the form with all fields filled hides the inputs and reveals the success message; no network request
is fired (`page.on("request")` shows no POST).

- [ ] **Step 5: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add hero slideshow and site-visit form"
```

---

### Task 4: Quick-facts scorecard strip

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="quickfacts" id="quickfacts">`)
- Modify: `kalpataru-vista_files/kalpataru-vista-theme.css`

- [ ] **Step 1: Markup**

```html
<section class="quickfacts chrome-dark" id="quickfacts">
  <div class="container quickfacts__row">
    <div class="quickfacts__cell">
      <span class="eyebrow">Location</span>
      <p class="mono">Sector 128, Noida Expressway</p>
    </div>
    <div class="quickfacts__cell">
      <span class="eyebrow">Typology</span>
      <p class="mono">3 BHK · 4 BHK</p>
    </div>
    <div class="quickfacts__cell">
      <span class="eyebrow">Price</span>
      <p class="mono">₹4.06 Cr* – ₹5.02 Cr* onwards</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Style as a scorecard row**

```css
.quickfacts__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: var(--space-4) 0;
}
.quickfacts__cell {
  padding: 0 var(--space-3);
  border-left: 1px solid var(--gold-500);
  text-align: center;
}
.quickfacts__cell:first-child { border-left: none; }
.quickfacts__cell .mono { font-size: 1.05rem; margin: 0; }

@media (max-width: 700px) {
  .quickfacts__row { grid-template-columns: 1fr; gap: var(--space-2); }
  .quickfacts__cell { border-left: none; border-top: 1px solid var(--gold-500); padding-top: var(--space-2); }
  .quickfacts__cell:first-child { border-top: none; }
}
```

- [ ] **Step 3: Verify**

Playwright at 1440px: three cells in a row with visible gold rules between them. At 390px: cells
stack, rules move to top-border. No console errors.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add quick-facts scorecard strip"
```

---

### Task 5: Overview section + horizon divider wiring

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="overview" id="overview">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css`

- [ ] **Step 1: Markup**

```html
<section class="overview section" id="overview">
  <div class="container overview__grid">
    <div data-anim="element">
      <span class="eyebrow">Overview</span>
      <h2>Twin towers on a 110-acre golf course</h2>
      <p>Kalpataru Vista brings 3 &amp; 4 bed apartments and duplexes to a 110-acre lush green golf
      course setting, with balconies that sweep over the pool decks and fairways beyond.</p>
      <ul>
        <li>Contemporary designed multi-storeyed towers</li>
        <li>Balconies overlooking the pool decks and golf course</li>
        <li>Landscaped open spaces with recreational facilities</li>
        <li>Community centre with infinity-edge swimming pool</li>
        <li>Integrated safety and security system</li>
      </ul>
    </div>
    <div class="overview__credits" data-anim="element">
      <span class="eyebrow">Design Team</span>
      <dl>
        <dt>Design Architect</dt><dd>HB Design, Singapore</dd>
        <dt>Interior Design</dt><dd>Studio HBA</dd>
        <dt>Landscape Architect</dt><dd>Burega Farnell, Singapore</dd>
        <dt>Lighting Consultant</dt><dd>DJ Coalition, Sydney</dd>
      </dl>
    </div>
  </div>
  <div class="horizon-divider" data-anim="element"></div>
</section>
```

- [ ] **Step 2: Style**

```css
.overview__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-5);
}
.overview__credits dl { margin: 0; }
.overview__credits dt { font-family: var(--font-mono); font-size: var(--fs-small); color: var(--gold-500); margin-top: var(--space-2); }
.overview__credits dd { margin: 0 0 var(--space-1); }

@media (max-width: 860px) {
  .overview__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

Playwright: scrolling this section into view triggers `initScrollReveal` (opacity 0→1) on both grid
columns and the divider. Divider renders centered, max-width 1100px, gold gradient line with a
centered dot. No console errors.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add overview section and horizon-divider component"
```

---

### Task 6: Amenities section

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="amenities" id="amenities">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css`

- [ ] **Step 1: Markup**

```html
<section class="amenities section section-alt" id="amenities">
  <div class="container">
    <span class="eyebrow">Amenities</span>
    <h2>Kalpataru Vista Amenities</h2>
    <div class="horizon-divider" data-anim="element"></div>
    <div class="amenities__grid">
      <article class="amenity-card" data-anim="element">
        <img src="assets/meet.webp" alt="Community lounge at Kalpataru Vista">
        <h4>Meet</h4>
        <ul>
          <li>Community centre and amenity features</li>
          <li>Reception / waiting lounge</li>
          <li>Multipurpose room</li>
          <li>Lounge area with library / study</li>
          <li>Business centre</li>
        </ul>
      </article>
      <article class="amenity-card" data-anim="element">
        <img src="assets/enjoy.webp" alt="Recreational facilities at Kalpataru Vista">
        <h4>Enjoy</h4>
        <ul>
          <li>Indoor games room (pool table / board games)</li>
          <li>Gymnasium &amp; fitness centre</li>
          <li>Squash court</li>
          <li>Jogging path</li>
          <li>Kids' play area</li>
          <li>Crèche</li>
        </ul>
      </article>
      <article class="amenity-card" data-anim="element">
        <img src="assets/relax.webp" alt="Spa and pool at Kalpataru Vista">
        <h4>Relax</h4>
        <ul>
          <li>Spa with steam and massage room</li>
          <li>Shaded cabanas</li>
          <li>Landscaped pathways</li>
          <li>Seating alcoves</li>
          <li>Swimming pool with open-air jacuzzi</li>
        </ul>
      </article>
    </div>
    <p class="amenities__building">
      <strong>Building:</strong> elevators with auto-rescue device · grand entrance lobby · D.G.
      power backup · rainwater harvesting system.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Style**

```css
.amenities__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.amenity-card { background: var(--white); padding: var(--space-2); }
.amenity-card img { width: 100%; height: 200px; object-fit: cover; margin-bottom: var(--space-2); }
.amenities__building { font-size: var(--fs-small); color: var(--fairway-700); }

@media (max-width: 860px) {
  .amenities__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

Playwright: three amenity cards render in a row at 1440px, stack at 390px; `assets/meet.webp`,
`enjoy.webp`, `relax.webp` load with no 404s; cards fade in on scroll. No console errors.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add amenities section (meet/enjoy/relax + building amenities)"
```

---

### Task 7: Specifications tabs

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="specs" id="specifications">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css`
- Modify: `kalpataru-vista_files/site.js` (`initSpecTabs`)

- [ ] **Step 1: Markup**

```html
<section class="specs section" id="specifications">
  <div class="container">
    <span class="eyebrow">Specifications</span>
    <h2>Kalpataru Vista Specifications</h2>
    <div class="horizon-divider" data-anim="element"></div>
    <div class="specs__tabs" id="specTabs">
      <div class="specs__tab-list" role="tablist">
        <button class="specs__tab is-active" data-tab="complex" role="tab">Complex &amp; Building</button>
        <button class="specs__tab" data-tab="apartment" role="tab">Apartment</button>
        <button class="specs__tab" data-tab="kitchen" role="tab">Kitchen</button>
        <button class="specs__tab" data-tab="bathroom" role="tab">Bathroom</button>
        <button class="specs__tab" data-tab="security" role="tab">Security &amp; Safety</button>
        <button class="specs__tab" data-tab="terrace" role="tab">Terrace</button>
      </div>
      <div class="specs__panel is-active" data-panel="complex">
        <ul>
          <li>Elevators for each tower with auto rescue device</li>
          <li>Grand entrance lobby enhanced with premium finishes</li>
          <li>D.G. power backup for common areas and apartments</li>
          <li>Rain water harvesting system</li>
        </ul>
      </div>
      <div class="specs__panel" data-panel="apartment">
        <ul>
          <li>Living room, dining and passages with imported marble flooring</li>
          <li>Bedrooms with laminated wooden flooring</li>
          <li>VRV system in living, dining and bedrooms</li>
          <li>Balconies with MS &amp; glass railing and tile flooring</li>
        </ul>
      </div>
      <div class="specs__panel" data-panel="kitchen">
        <ul>
          <li>Vitrified tile flooring</li>
          <li>Granite platform</li>
          <li>Tile dado above platform</li>
          <li>Exhaust fan</li>
          <li>Modular kitchen with chimney and hob</li>
          <li>Provision of solar water heating system</li>
        </ul>
      </div>
      <div class="specs__panel" data-panel="bathroom">
        <ul>
          <li>Imported marble flooring in master bedroom toilet</li>
          <li>Marble and tile dado up to door height in master bedroom toilet</li>
          <li>Skid-resistant tile flooring with tile dado in other toilets</li>
          <li>Premium CP and sanitary fittings</li>
        </ul>
      </div>
      <div class="specs__panel" data-panel="security">
        <ul>
          <li>Firefighting systems</li>
          <li>CCTV covering designated common areas</li>
          <li>Video door phone with intercom system</li>
          <li>Security access control system</li>
        </ul>
      </div>
      <div class="specs__panel" data-panel="terrace">
        <ul>
          <li>Play area</li>
          <li>Outdoor seating</li>
          <li>Lounges</li>
          <li>BBQ space</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Style**

```css
.specs__tab-list { display: flex; flex-wrap: wrap; gap: var(--space-1); margin-bottom: var(--space-3); }
.specs__tab {
  font-family: var(--font-mono); font-size: var(--fs-small); text-transform: uppercase;
  background: none; border: 1px solid var(--sand-100); padding: 0.6em 1em; cursor: pointer;
}
.specs__tab.is-active { background: var(--fairway-700); color: var(--white); border-color: var(--fairway-700); }
.specs__panel { display: none; }
.specs__panel.is-active { display: block; }
```

- [ ] **Step 3: JS in `site.js`**

```js
function initSpecTabs() {
  const tabs = document.querySelectorAll(".specs__tab");
  const panels = document.querySelectorAll(".specs__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.querySelector(`.specs__panel[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
    });
  });
}
```

Add `initSpecTabs();` to the `DOMContentLoaded` listener.

- [ ] **Step 4: Verify**

Playwright: "Complex & Building" panel visible by default; clicking each of the other 5 tabs shows
only that tab's panel and marks that tab `.is-active`; no two panels visible at once. No console
errors.

- [ ] **Step 5: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add specifications tabs (6 categories)"
```

---

### Task 8: Unit plan cards

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="unitplans" id="floorplan">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css`

- [ ] **Step 1: Markup**

```html
<section class="unitplans section section-alt" id="floorplan">
  <div class="container">
    <div id="price"></div>
    <span class="eyebrow">Floor Plans</span>
    <h2>Kalpataru Vista Unit Layout Plan</h2>
    <div class="horizon-divider" data-anim="element"></div>
    <div class="unitplans__grid">
      <article class="unit-card" data-anim="element">
        <svg class="unit-card__icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="6" y="6" width="52" height="52" stroke="currentColor" stroke-width="1.5"/>
          <path d="M32 6 V58 M6 32 H58" stroke="currentColor" stroke-width="1"/>
        </svg>
        <h4>3 BHK Apartment</h4>
        <p class="mono">Super Area — 3011 sq.ft.</p>
        <p class="mono">Usable Area — 2007 sq.ft.</p>
        <p class="mono unit-card__price">₹4.06 Cr.* onwards</p>
      </article>
      <article class="unit-card" data-anim="element">
        <svg class="unit-card__icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="6" y="6" width="52" height="52" stroke="currentColor" stroke-width="1.5"/>
          <path d="M32 6 V58 M6 32 H58 M6 6 L58 58" stroke="currentColor" stroke-width="1"/>
        </svg>
        <h4>4 BHK Apartment</h4>
        <p class="mono">Super Area — 3938 sq.ft.</p>
        <p class="mono">Usable Area — 2625 sq.ft.</p>
        <p class="mono unit-card__price">₹5.02 Cr.* onwards</p>
      </article>
    </div>
    <p class="unitplans__note">*Prices are placeholder figures for this portfolio recreation.</p>
  </div>
</section>
```

- [ ] **Step 2: Style**

```css
.unitplans__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.unit-card { background: var(--white); padding: var(--space-3); text-align: center; }
.unit-card__icon { color: var(--gold-500); margin-bottom: var(--space-2); }
.unit-card__price { color: var(--fairway-700); font-size: 1.1rem; font-weight: 500; }
.unitplans__note { font-size: var(--fs-small); color: var(--fairway-500); margin-top: var(--space-2); }

@media (max-width: 700px) {
  .unitplans__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

Playwright: two unit cards side by side at 1440px, stacked at 390px, each showing its mono-styled
area/price figures and a distinct SVG icon (3BHK vs 4BHK icons differ). The header nav's "Price
List" link (`href="#price"`) scrolls to this section (there was no `id="price"` anywhere before
this task — Task 2's nav markup referenced it ahead of this section existing, which is expected
since Task 2 ships before Task 8). No console errors.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add 3BHK/4BHK unit plan cards"
```

---

### Task 9: Site layout + location advantages

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="sitelayout">` and `<section class="location">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css`

- [ ] **Step 1: Markup**

```html
<section class="sitelayout section" id="sitelayout">
  <div class="container">
    <span class="eyebrow">Site Layout</span>
    <h2>Kalpataru Vista Site Layout</h2>
    <div class="horizon-divider" data-anim="element"></div>
    <div class="sitelayout__plate" data-anim="element" aria-label="Site plan placeholder">
      <svg width="100%" height="320" viewBox="0 0 800 320" role="img">
        <rect width="800" height="320" fill="#F1EBDC"/>
        <circle cx="220" cy="160" r="90" fill="none" stroke="#3D6B4C" stroke-width="2"/>
        <circle cx="560" cy="160" r="90" fill="none" stroke="#3D6B4C" stroke-width="2"/>
        <path d="M40 280 Q400 40 760 280" fill="none" stroke="#B08D3F" stroke-width="1.5"/>
        <text x="400" y="300" text-anchor="middle" font-family="IBM Plex Mono" font-size="13" fill="#1B1A15">Twin Towers · Golf Course Vista (illustrative)</text>
      </svg>
    </div>
    <button class="btn sitelayout__download" type="button" disabled title="Demo placeholder — no file attached">Download Site Layout</button>
  </div>
</section>

<section class="location section section-alt" id="location">
  <div class="container location__grid">
    <div data-anim="element">
      <span class="eyebrow">Location</span>
      <h2>Kalpataru Vista Location Advantages</h2>
      <p><strong>Sector 128, along Noida Expressway.</strong></p>
      <ul class="location__list mono">
        <li>East Delhi — 20 mins</li>
        <li>Ghaziabad — 30 mins</li>
        <li>Connaught Place — 45 mins</li>
        <li>South Delhi — 25 mins</li>
        <li>Faridabad — 40 mins</li>
        <li>Indira Gandhi Airport — 40 mins</li>
        <li>Upcoming Jewar Airport — 55 mins</li>
        <li>Hospital &amp; School — 5 mins</li>
      </ul>
    </div>
    <svg class="location__map" data-anim="element" viewBox="0 0 400 400" role="img" aria-label="Location map placeholder">
      <rect width="400" height="400" fill="#F8F4EA"/>
      <path d="M200 40 L360 200 L200 360 L40 200 Z" fill="none" stroke="#B08D3F" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="10" fill="#1E4531"/>
      <text x="200" y="230" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" fill="#1B1A15">Sector 128</text>
    </svg>
  </div>
</section>
```

- [ ] **Step 2: Style**

```css
.sitelayout__plate { border: 1px solid var(--sand-100); }
.sitelayout__download { display: block; margin: var(--space-3) auto 0; cursor: not-allowed; opacity: 0.7; }
.location__grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: var(--space-4); align-items: center; }
.location__list { list-style: none; padding: 0; display: grid; gap: var(--space-1); }
.location__map { max-width: 320px; margin: 0 auto; }

@media (max-width: 860px) {
  .location__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

Playwright: site-plan SVG and map SVG both render (no broken-image icons — inline SVG can't 404),
the disabled "Download Site Layout" button is present and inert (click does nothing, no console
error), location list shows all 8 mono-styled travel-time lines, layout stacks correctly at 390px.
No console errors.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add site layout and location advantages sections"
```

---

### Task 10: Virtual tour + footer/contact

**Files:**
- Modify: `kalpataru-vista.html` (`<section class="virtualtour">` and `<footer class="footer" id="contact">`)
- Modify: `kalpataru-vista_files/kalpataru-vista.css`

- [ ] **Step 1: Markup**

```html
<section class="virtualtour section chrome-dark" id="virtualtour">
  <div class="container">
    <span class="eyebrow">Virtual Tour</span>
    <h2>Kalpataru Vista Virtual Tour</h2>
    <div class="horizon-divider" data-anim="element"></div>
    <div class="virtualtour__poster" data-anim="element">
      <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
        <rect width="800" height="450" fill="#12261B"/>
        <rect x="20" y="20" width="760" height="410" fill="none" stroke="#3D6B4C" stroke-width="1"/>
      </svg>
      <button class="virtualtour__play" type="button" aria-label="Play virtual tour (demo, non-functional)" disabled>
        <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="9,6 23,14 9,22" fill="#F8F4EA"/></svg>
      </button>
    </div>
  </div>
</section>

<footer class="footer chrome-dark" id="contact">
  <div class="container footer__grid">
    <div>
      <a href="#hero" class="logo">
        <span class="logo__mark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.2"/><path d="M10 4 L10 16 M4 10 L16 10" stroke="currentColor" stroke-width="1"/></svg>
        </span>
        <span class="logo__word">Kalpataru <em>Vista</em></span>
      </a>
      <p class="mono footer__contact">+91-00000 00000 · enquiries@kalpataruvista.example</p>
      <p class="footer__disclaimer">Portfolio recreation. Not the live site of any real developer or project.</p>
    </div>
    <nav class="footer__nav">
      <a href="#overview">Overview</a>
      <a href="#amenities">Amenities</a>
      <a href="#specifications">Specifications</a>
      <a href="#floorplan">Floor Plans</a>
      <a href="#location">Location</a>
    </nav>
  </div>
</footer>
```

- [ ] **Step 2: Style**

```css
.virtualtour__poster { position: relative; max-width: 800px; margin: 0 auto; aspect-ratio: 16/9; }
.virtualtour__play {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 64px; height: 64px; border-radius: 50%; border: 1px solid var(--gold-500);
  background: rgba(176, 141, 63, 0.25); display: flex; align-items: center; justify-content: center;
  cursor: not-allowed;
}
.footer { padding: var(--space-5) 0; }
.footer__grid { display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); }
.footer__contact { margin-top: var(--space-2); }
.footer__disclaimer { font-size: var(--fs-small); opacity: 0.7; max-width: 32em; }
.footer__nav { display: flex; flex-direction: column; gap: var(--space-1); }
.footer__nav a { color: var(--sand-50); text-decoration: none; }
.footer__nav a:hover { color: var(--gold-300); }
```

- [ ] **Step 3: Verify**

Playwright: virtual-tour poster renders full width with a centered disabled play button (cursor
`not-allowed`, click does nothing, no console error from a missing handler); footer shows logo,
placeholder contact line, disclaimer text, and nav links. No console errors anywhere on the page at
this point — this is the first full top-to-bottom render.

- [ ] **Step 4: Commit**

```bash
git add kalpataru-vista.html kalpataru-vista_files
git commit -m "feat: add virtual tour placeholder and footer/contact"
```

---

### Task 11: Full-page verification pass + CLAUDE.md

**Files:**
- Create: `CLAUDE.md`
- No code changes expected unless verification finds a defect — if it does, fix it in the relevant
  file from Tasks 1–10 before writing `CLAUDE.md`.

- [ ] **Step 1: Run the full Playwright pass**

In a scratch dir: `npm install playwright`, then a script that:
1. Launches headless Chromium, sets viewport to 1440×900, navigates to `kalpataru-vista.html` via
   `file://`.
2. Collects `console` and `requestfailed` events for the whole session.
3. Scrolls through every section (`#hero`, `#quickfacts`, `#overview`, `#amenities`,
   `#specifications`, `#floorplan`, `#sitelayout`, `#location`, `#virtualtour`, `#contact`),
   screenshotting each.
4. Repeats steps 1–3 at 390×844 (mobile).
5. Clicks through all 6 spec tabs and both hero-form fields to confirm the interactions from Tasks
   3 and 7 still work end-to-end on the assembled page (not just in isolation).

Expected: zero console errors, zero failed requests, all 10 sections visible and matching the
markup written in Tasks 1–10, mobile nav opens/closes, spec tabs switch, hero form fake-submits.

- [ ] **Step 2: Fix anything the pass surfaces**

If any section is missing, misstyled, or throws a console error, fix it in place in the file where
it was introduced (see the Files list of the relevant task above) — do not patch around it with a
new file.

- [ ] **Step 3: Write `CLAUDE.md`**

```markdown
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
live client's site.

## Commands

No build step, package manager, or test framework.

- **Run it**: open `kalpataru-vista.html` directly in a browser, or serve the folder statically.
- **Verify a change**: no test suite — drive the page in headless Chromium via Playwright
  (`npm install playwright` in a scratch dir) and check console errors / failed requests /
  screenshots at 1440px and 390px widths after any non-trivial UI change.

## Architecture

`kalpataru-vista.html` is the live page. Two stylesheets load in cascade order:
`kalpataru-vista_files/kalpataru-vista.css` (tokens, reset, type system, layout/components) then
`kalpataru-vista_files/kalpataru-vista-theme.css` (the signature decorative layer: the horizon
divider, dark chrome sections), loaded last. `kalpataru-vista_files/site.js` holds all scripting —
named `init*()` functions called from one `DOMContentLoaded` listener: header scroll-state, mobile
nav, hero slideshow, the fake site-visit form submit, generic `data-anim="element"` scroll-reveal,
and the specifications tabs.

**Design system**: green/gold "golf-course luxury" palette (`--fairway-*` greens, `--gold-*`
accents, `--sand-*` cream base — named for the golf-course setting, not generic terms). Three type
roles: Fraunces (display/headings only), Archivo (body), IBM Plex Mono (numbers/labels only — this
is the deliberate signature typographic move, don't use mono for prose). The horizon-divider
component (`.horizon-divider`) is the one repeated signature element between sections — reuse it,
don't invent new one-off dividers.

**No raster logo** — the brand mark is an inline SVG + CSS wordmark in the header/footer
(`.logo`), not a `logo.png` file.

**Hero images**: `assets/hero-src/h1.webp`–`h4.webp` are user-supplied and may not exist yet; the
hero slideshow degrades gracefully to a solid `--fairway-900` background (CSS `background-image` on
empty/missing files doesn't break layout, unlike an `<img>` would).

**`kalpataruvista.org.in.html` / `kalpataruvista.org.in_files/`** is the original downloaded
reference export — gitignored, kept only for content/visual reference, not part of the deliverable.
No text, filename, or asset from it should be linked from `kalpataru-vista.html`.

**`docs/superpowers/`** holds the design spec and this implementation plan — historical record of
decisions (palette choice, JS-stack choice, placeholder-vs-real-content choices), not live docs.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md for Kalpataru Vista repo"
```

---

## Post-plan note for the human

Drop real hero photos into `assets/hero-src/` as `h1.webp`, `h2.webp`, `h3.webp`, `h4.webp` whenever
ready — no code change needed, the hero section already points at those paths and falls back
gracefully if they're absent.
