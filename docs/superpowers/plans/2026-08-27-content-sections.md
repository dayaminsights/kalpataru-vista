# Below-Hero Content Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the leftover FIND React sections below the hero (currently live, showing "Why FIND" / fake testimonials / a fake blog feed) with real Kalpataru Vista content — Overview, Key Benefits, Amenities, and a closing CTA — sourced from the official downloaded page, styled to match the hero's measured design tokens.

**Architecture:** New sections are plain static HTML (fresh classnames, no React ties) inserted directly into both HTML files between the hero and the first leftover FIND section. All leftover FIND React sections get `display:none`. Everything lives outside the React hydration boundary, so none of it can be silently reverted on load/scroll — the load-bearing constraint documented in `ARCHITECTURE.md`. All new CSS is appended to the existing `..._files/kalpataru-brand.css` (append-only convention already established there).

**Tech Stack:** Static HTML/CSS only. No build step (matches the rest of the repo — see `ARCHITECTURE.md`). Verification via the existing headless-Chrome `?probe=1` route in `local-server.js`, extended with new checks — this project's established substitute for a test framework (screenshot tools are sandboxed/broken in this environment; see `CLAUDE.md`).

**Reference:** Full content source, measured design tokens, and section copy are in `docs/superpowers/specs/2026-08-27-content-sections-design.md`. Read it before starting if anything below is ambiguous.

**File-sync rule:** `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` are currently byte-identical. Every HTML edit in this plan must be applied to **both** files identically, or they will drift (see `CLAUDE.md` — "keep them in sync, we don't know which one might get opened directly").

---

### Task 1: Extend the dev probe with section checks

**Files:**
- Modify: `local-server.js`

- [ ] **Step 1: Add section-existence/visibility checks to the probe script**

Open `local-server.js`. Find the line (inside the `setTimeout` callback of the `/?probe=1` handler):

```js
      document.title='PROBE::'+JSON.stringify(out);
```

Replace it with:

```js
      out.sections={};
      ['why-us_root__aGsFp','arrows-section_root__yyPBl','testimonials_root__PiYLZ','services_root__Ch_WM','features_root__CCic6','latest-posts_root__W0OHF','outro_root__stMHm'].forEach(function(c){
        var el=document.querySelector('.'+c);
        out.sections[c]=el?getComputedStyle(el).display:'NOT FOUND';
      });
      var bareSections=document.querySelectorAll('section:not([class])');
      out.sections['bare-sections']=bareSections.length?Array.prototype.map.call(bareSections,function(s){return getComputedStyle(s).display}).join(','):'none present';
      ['kv-overview','kv-benefits','kv-amenities','kv-cta'].forEach(function(id){
        var el=document.getElementById(id);
        if(!el){out.sections[id]='NOT FOUND';return;}
        var r=el.getBoundingClientRect();
        out.sections[id]=getComputedStyle(el).display+' height='+Math.round(r.height);
      });
      var rera=document.querySelector('.kv-rera');
      out.sections['kv-rera']=rera?'found':'NOT FOUND';
      var navOverview=document.querySelector('a[href="#kv-overview"]');
      out.sections['nav-overview-link']=navOverview?'found':'NOT FOUND';
      document.title='PROBE::'+JSON.stringify(out);
```

- [ ] **Step 2: Restart the dev server**

Run: `taskkill //F //IM node.exe` then `node local-server.js` (background it, e.g. `node local-server.js &`, or a separate terminal — it must stay running for the probe checks in later tasks).

- [ ] **Step 3: Run the probe and confirm the new checks report the expected "not built yet" state**

Run:
```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/?probe=1&scrollY=0" > probe1.html
node -e "const fs=require('fs');const h=fs.readFileSync('probe1.html','utf8');const m=h.match(/<title>PROBE::([\s\S]*?)<\/title>/);console.log(JSON.parse(m[1].replace(/&quot;/g,'\"').replace(/&amp;/g,'&')).sections)"
```
Write `probe1.html` to the session scratchpad directory, not the repo.

Expected output: the seven leftover-section keys all report `block` (still visible — not hidden yet), `bare-sections` reports two `block` entries, and `kv-overview`/`kv-benefits`/`kv-amenities`/`kv-cta`/`kv-rera`/`nav-overview-link` all report `NOT FOUND` (nothing built yet). This is the expected "red" state before Tasks 2–7.

- [ ] **Step 4: Commit**

```bash
git add local-server.js
git commit -m "$(cat <<'EOF'
feat: extend dev probe to check below-hero content sections

Adds visibility/existence checks for the leftover FIND sections and
the new kv-* sections being built in this plan, so each task can
verify against real computed styles instead of reading source.
EOF
)"
```

---

### Task 2: Hide the leftover FIND React sections

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

- [ ] **Step 1: Append the hide rule**

The file currently ends with:

```css
/* keep the building visible through the whole scroll, no fade-out */
.hero_house__aJy7p{opacity:1!important;visibility:visible!important}
```

Append after it:

```css

/* hide leftover FIND React sections below the hero — replaced by static
   kv-* sections built in this plan. These are React-owned components; do
   not delete the markup (hydration owns it), just hide it. */
.why-us_root__aGsFp,
.arrows-section_root__yyPBl,
section:not([class]),
.testimonials_root__PiYLZ,
.services_root__Ch_WM,
.features_root__CCic6,
.latest-posts_root__W0OHF,
.outro_root__stMHm{display:none}
```

- [ ] **Step 2: Restart the dev server** (same command as Task 1 Step 2 — CSS is not hot-reloaded reliably, and the probe route reads `index.html` fresh each request but the browser may cache the stylesheet; restarting is cheap and removes doubt)

- [ ] **Step 3: Run the probe, confirm all leftover sections are now hidden**

Run the same probe command as Task 1 Step 3.

Expected: all seven leftover-section keys report `none`, and `bare-sections` reports `none,none`.

- [ ] **Step 4: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "$(cat <<'EOF'
fix: hide leftover FIND sections below the hero

Why FIND / testimonials / fake blog feed / outro were still live and
unbranded. Hidden via display:none rather than removed — they're
React-owned components, deleting the DOM would fight hydration.
EOF
)"
```

---

### Task 3: Build the Overview section

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

- [ ] **Step 1: Insert the Overview section markup**

In **both** `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`, find this exact substring (appears once in each file):

```
<section class="why-us_root__aGsFp">
```

Replace it with (note: this *prepends* the new section, the `why-us_root` section tag itself is unchanged and stays right after):

```
<section class="kv-overview" id="kv-overview"><div class="container_container__v5gtR"><div class="kv-section__eyebrow">01 — Overview</div><h2 class="kv-section__heading">An address defined by space and serenity</h2><p class="kv-overview__body">Kalpataru Vista, in the booming hub of Noida, will fulfil your dream of living in the lap of luxury. The majestic twin towers, with 3 &amp; 4 bed apartments and duplexes, are nestled in a massive 110-acre lush green golf course with breathtaking views.</p><dl class="kv-overview__stats"><div class="kv-overview__stat"><dt>Status</dt><dd>OC Received</dd></div><div class="kv-overview__stat"><dt>Location</dt><dd>Sector 128, Noida</dd></div><div class="kv-overview__stat"><dt>Typology</dt><dd>3, 4 Bed Residences &amp; Duplexes</dd></div><div class="kv-overview__stat"><dt>Possession</dt><dd>Possession Ongoing</dd></div></dl></div></section><section class="why-us_root__aGsFp">
```

- [ ] **Step 2: Append the Overview section CSS**

Append to the end of `kalpataru-brand.css` (after the hide rule from Task 2):

```css

/* --- kv-overview --- */
.kv-overview{padding:6rem 0;background:#fff}
.kv-section__eyebrow{font-size:.875rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(21,23,23,.55);margin-bottom:1rem}
.kv-section__heading{font-size:clamp(2rem,4vw,3.5rem);font-weight:700;letter-spacing:-0.02em;line-height:1.1;color:#151717;margin:0 0 1.5rem;max-width:32ch;font-family:"Instrument Sans","Instrument Sans Fallback"}
.kv-overview__body{font-size:1.125rem;line-height:1.6;color:rgba(21,23,23,.8);max-width:60ch;margin:0 0 3rem}
.kv-overview__stats{display:grid;grid-template-columns:repeat(2,1fr);gap:2rem;margin:0;padding-top:2rem;border-top:1px solid rgba(21,23,23,.12)}
.kv-overview__stat dt{font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:rgba(21,23,23,.5);margin:0 0 .35rem}
.kv-overview__stat dd{font-size:1.15rem;font-weight:600;color:#151717;margin:0}
@media(min-width:768px){.kv-overview{padding:9rem 0}.kv-overview__stats{grid-template-columns:repeat(4,1fr)}}
```

- [ ] **Step 3: Restart the dev server, run the probe**

Same commands as Task 1 Step 2–3.

Expected: `kv-overview` reports `block height=<some number greater than 300>` (exact number doesn't matter, zero or `NOT FOUND` means something's wrong).

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "$(cat <<'EOF'
feat: add Overview section below the hero

Real Kalpataru Vista copy (twin towers, 110-acre golf course setting,
status/location/typology/possession) replacing the empty space where
the hidden FIND section used to render.
EOF
)"
```

---

### Task 4: Build the Key Benefits section

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

- [ ] **Step 1: Insert the Key Benefits section markup**

In both HTML files, find (now unique after Task 3's edit):

```
<section class="why-us_root__aGsFp">
```

Replace with:

```
<section class="kv-benefits" id="kv-benefits"><div class="container_container__v5gtR"><div class="kv-section__eyebrow">02 — Key Benefits</div><ul class="kv-benefits__grid"><li class="kv-benefits__item"><span class="kv-benefits__num">01</span><p>Landscaped open spaces with ample recreational facilities</p></li><li class="kv-benefits__item"><span class="kv-benefits__num">02</span><p>Expansive views from your infinity pool</p></li><li class="kv-benefits__item"><span class="kv-benefits__num">03</span><p>Island kitchen design</p></li><li class="kv-benefits__item"><span class="kv-benefits__num">04</span><p>Large Sundecks with panoramic views of the Golf Course</p></li></ul></div></section><section class="why-us_root__aGsFp">
```

- [ ] **Step 2: Append the Key Benefits section CSS**

```css

/* --- kv-benefits --- */
.kv-benefits{padding:6rem 0;background:#f1f1ef}
.kv-benefits__grid{list-style:none;display:grid;grid-template-columns:1fr;gap:2.5rem;margin:0;padding:0}
.kv-benefits__item{display:flex;gap:1.25rem;align-items:flex-start;border-top:1px solid rgba(21,23,23,.12);padding-top:1.5rem}
.kv-benefits__num{font-size:.85rem;font-weight:600;color:rgba(21,23,23,.4);letter-spacing:.05em;flex-shrink:0;padding-top:.2rem}
.kv-benefits__item p{margin:0;font-size:1.3rem;font-weight:500;line-height:1.4;color:#151717;max-width:36ch}
@media(min-width:768px){.kv-benefits{padding:8rem 0}.kv-benefits__grid{grid-template-columns:repeat(2,1fr);gap:3rem 4rem}}
```

- [ ] **Step 3: Restart the dev server, run the probe**

Expected: `kv-benefits` reports `block height=<nonzero>`.

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "$(cat <<'EOF'
feat: add Key Benefits section below the hero
EOF
)"
```

---

### Task 5: Build the Amenities section

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

- [ ] **Step 1: Insert the Amenities section markup**

In both HTML files, find:

```
<section class="why-us_root__aGsFp">
```

Replace with:

```
<section class="kv-amenities" id="kv-amenities"><div class="container_container__v5gtR"><div class="kv-section__eyebrow">03 — Amenities</div><h2 class="kv-section__heading">Everything a day could ask for</h2><ul class="kv-amenities__list"><li>Swimming Pool</li><li>Gymnasium</li><li>Multi-Purpose Hall</li><li>Squash Court</li><li>Community Centre</li><li>Creche</li><li>Business Lounge</li><li>Kids' Play Area</li><li>Fitness Zone</li><li>Games Room</li><li>Jogging Path</li><li>Landscaped Podium for Walking</li><li>Library and TV Lounge</li><li>Lounge Area</li><li>Spa</li><li>Sundecks</li><li>Waiting Niche</li></ul></div></section><section class="why-us_root__aGsFp">
```

- [ ] **Step 2: Append the Amenities section CSS**

```css

/* --- kv-amenities --- */
.kv-amenities{padding:6rem 0;background:#fff}
.kv-amenities__list{list-style:none;display:flex;flex-wrap:wrap;gap:.75rem;margin:2.5rem 0 0;padding:0}
.kv-amenities__list li{border:1px solid rgba(21,23,23,.18);border-radius:100px;padding:.65rem 1.35rem;font-size:.95rem;color:#151717;white-space:nowrap}
@media(min-width:768px){.kv-amenities{padding:8rem 0}}
```

- [ ] **Step 3: Restart the dev server, run the probe**

Expected: `kv-amenities` reports `block height=<nonzero>`.

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "$(cat <<'EOF'
feat: add Amenities section below the hero
EOF
)"
```

---

### Task 6: Build the closing CTA section and footer RERA disclosure

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

- [ ] **Step 1: Insert the CTA section markup**

In both HTML files, find:

```
<section class="why-us_root__aGsFp">
```

Replace with:

```
<section class="kv-cta" id="kv-cta"><div class="container_container__v5gtR"><div class="kv-section__eyebrow kv-section__eyebrow--light">04 — Get in Touch</div><h2 class="kv-cta__heading">Book your residence at Kalpataru Vista</h2><p class="kv-cta__body">Twin towers. 3 &amp; 4 bed apartments and duplexes. A 110-acre golf course setting in Sector 128, Noida.</p><div class="kv-cta__actions"><a class="button_button-round__TFjlU button_color-primary__JJ7Hh button_inversed__slQcI" href="tel:+912230643065"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Book Now">Book Now</span></div></div></a></div></div></section><section class="why-us_root__aGsFp">
```

- [ ] **Step 2: Insert the footer RERA disclosure**

In both HTML files, find this exact substring (appears once in each file):

```
<div class="footer_copyright-container__yt1ht">
```

Replace with:

```
<div class="kv-rera">RERA Reg. No. UPRERAPRJ14980. For details, please refer <a href="http://up-rera.in/" target="_blank" rel="noopener">up-rera.in</a>.</div><div class="footer_copyright-container__yt1ht">
```

- [ ] **Step 3: Append the CTA and RERA CSS**

```css

/* --- kv-cta --- */
.kv-cta{padding:7rem 0;background:#151717;color:#fff}
.kv-section__eyebrow--light{color:rgba(255,255,255,.55)}
.kv-cta__heading{font-size:clamp(2rem,4vw,3.25rem);font-weight:700;letter-spacing:-0.02em;line-height:1.15;color:#fff;margin:0 0 1.25rem;max-width:26ch;font-family:"Instrument Sans","Instrument Sans Fallback"}
.kv-cta__body{font-size:1.1rem;line-height:1.6;color:rgba(255,255,255,.75);max-width:48ch;margin:0 0 2.5rem}
@media(min-width:768px){.kv-cta{padding:9rem 0}}

/* --- footer RERA disclosure --- */
.kv-rera{font-size:.8rem;line-height:1.5;color:rgba(255,255,255,.55);max-width:60ch;padding:1.5rem 0 0}
.kv-rera a{color:inherit;text-decoration:underline}
```

- [ ] **Step 4: Restart the dev server, run the probe**

Expected: `kv-cta` reports `block height=<nonzero>`, `kv-rera` reports `found`.

- [ ] **Step 5: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "$(cat <<'EOF'
feat: add closing CTA section and RERA disclosure

RERA Reg. No. UPRERAPRJ14980 is a legally required disclosure for
Indian real estate marketing (UP-RERA) — kept in scope even though the
full RERA Details section was deferred.
EOF
)"
```

---

### Task 7: Add Overview/Amenities anchor links to the header nav

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`

**Scope note:** the existing header nav still has leftover FIND items (Search / Agents / Join, and a Sign In button linking to `app.findrealestate.com`). Those are a pre-existing issue out of scope for this plan (not part of the approved spec, and changing them may hit the same hydration-revert risk the hero text did — needs its own investigation). This task only *adds* two new links; it does not touch the existing ones.

- [ ] **Step 1: Insert the anchor links**

In both HTML files, find this exact substring (appears once in each file):

```
<nav class="header_nav__if_jI">
```

Replace with:

```
<nav class="header_nav__if_jI"><div class="header_nav-item__Wn05d"><a href="#kv-overview"><span data-text="Overview">Overview</span></a></div><div class="header_nav-item__Wn05d"><a href="#kv-amenities"><span data-text="Amenities">Amenities</span></a></div>
```

- [ ] **Step 2: Restart the dev server, run the probe**

Expected: `nav-overview-link` reports `found`.

- [ ] **Step 3: Verify the links actually scroll to the right sections (manual check, probe can't click)**

Run:
```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/#kv-amenities" > probe2.html
```
then grep `probe2.html` for `kv-amenities` to confirm the id exists at the anchor target (full click-behavior testing isn't available in this environment — this is a sanity check that the id/href pair is correct, not a substitute for a manual browser check before shipping).

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "$(cat <<'EOF'
feat: add Overview/Amenities anchor links to header nav
EOF
)"
```

---

### Task 8: Full scroll-depth verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Run the probe at multiple scroll depths**

The hero is a GSAP ScrollTrigger scroll-scrub animation — per `ARCHITECTURE.md`, styles that are correct at `scrollY=0` can break further down the page. Run the probe at four depths:

```
for y in 0 2000 5000 9000; do
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/?probe=1&scrollY=$y" > "probe_$y.html"
done
node -e "
const fs=require('fs');
[0,2000,5000,9000].forEach(function(y){
  const h=fs.readFileSync('probe_'+y+'.html','utf8');
  const m=h.match(/<title>PROBE::([\s\S]*?)<\/title>/);
  const data=JSON.parse(m[1].replace(/&quot;/g,'\"').replace(/&amp;/g,'&'));
  console.log('scrollY='+y, JSON.stringify(data.sections));
});
"
```
Write the `probe_*.html` files to the session scratchpad directory.

Expected at every depth: all seven leftover-section keys `none`, `bare-sections` `none,none`, `kv-overview`/`kv-benefits`/`kv-amenities`/`kv-cta` all `block height=<nonzero>` (heights won't change with scroll — these aren't scroll-animated — but confirm they don't collapse to 0 or disappear), `kv-rera` `found`, `nav-overview-link` `found`.

- [ ] **Step 2: If anything regresses, fix it and re-run before proceeding** (no code changes expected in the normal case — this step exists to catch a scroll-driven inline style from the GSAP hero timeline leaking onto the new sections, per the project's documented history of "looks right on load, breaks on scroll" bugs)

- [ ] **Step 3: Final review — read both HTML files' diffs against git history to confirm they're still identical**

```bash
diff index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html" && echo IDENTICAL
```
Expected: `IDENTICAL`. If not, find where they diverged (likely a missed find/replace in one of Tasks 3–7) and fix it.
