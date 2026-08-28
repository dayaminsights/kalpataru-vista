# Overview Image Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-card image grid (Location / Golf Course / Residences) to the `kv-overview` section, below the existing stats strip, using FIND's leftover local images as placeholders.

**Architecture:** This site has no test framework — verification is a headless-Chrome `?probe=1` route in `local-server.js` that reports computed styles/geometry via `document.title` (see `CLAUDE.md`). Every task below substitutes "run the probe, check the JSON" for "run the test suite." `kv-overview`'s HTML lives in a runtime JS injector (`KV_SECTIONS` array, inline `<script>`) present verbatim in two files — `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` — which must be edited identically.

**Tech Stack:** Plain HTML/CSS/JS (no build step), Node's `http` module (`local-server.js`), headless Chrome for verification.

---

### Task 1: Extend the probe script to check the new cards

**Files:**
- Modify: `local-server.js:228` (insert new block right after this line, before `document.title=...` on line 229)

- [ ] **Step 1: Read the current probe script region to confirm line numbers still match**

Run: view `local-server.js` lines 220-230. Confirm line 228 is still:
```js
      out.amenities.allSeventeenPresent=['Swimming Pool','Gymnasium','Multi-Purpose Hall','Squash Court','Community Centre','Creche','Business Lounge',"Kids' Play Area",'Fitness Zone','Games Room','Jogging Path','Landscaped Podium for Walking','Library and TV Lounge','Lounge Area','Spa','Sundecks','Waiting Niche'].every(function(name){return amenText.indexOf(name)>-1;});
```
If line numbers drifted, locate this line by content instead of number.

- [ ] **Step 2: Insert the overview-cards probe block immediately after that line**

Insert this exact block (between the `allSeventeenPresent` line and `document.title='PROBE::'+JSON.stringify(out);`):

```js
      var overviewCards=document.querySelectorAll('#kv-overview .kv-overview__card');
      out.overview={cardCount:overviewCards.length};
      out.overview.cards=Array.prototype.map.call(overviewCards,function(c){
        var img=c.querySelector('.kv-overview__card-media img');
        var h3=c.querySelector('.kv-overview__card-title h3');
        return {
          heading:h3?h3.textContent:'NO H3',
          imgSrc:img?img.getAttribute('src').split('/').pop():'NO IMG',
          imgNaturalSize:img?(img.naturalWidth+'x'+img.naturalHeight):'n/a',
          mediaHeight:img?Math.round(img.getBoundingClientRect().height):0
        };
      });
      var cardsGrid=document.querySelector('#kv-overview .kv-overview__cards');
      out.overview.gridColumns=cardsGrid?getComputedStyle(cardsGrid).gridTemplateColumns.split(' ').length:0;
```

- [ ] **Step 3: Syntax-check the file**

Run: `node --check local-server.js`
Expected: no output (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add local-server.js
git commit -m "feat: extend dev probe to check overview image cards"
```

---

### Task 2: Add the cards CSS

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css:59-60`

Current text at that location (the end of the `kv-overview` block):
```css
.kv-overview__stat dd{font-size:1.15rem;font-weight:600;color:#151717;margin:0}
@media(min-width:768px){.kv-overview{padding:9rem 0}.kv-overview__stats{grid-template-columns:repeat(4,1fr)}}
```

- [ ] **Step 1: Replace it with the cards rules + extended media query**

```css
.kv-overview__stat dd{font-size:1.15rem;font-weight:600;color:#151717;margin:0}
.kv-overview__cards{display:grid;grid-template-columns:1fr;gap:2rem;margin-top:3rem}
.kv-overview__card-media{aspect-ratio:4/5;border-radius:1.25rem;overflow:hidden;background:#f1f1ef}
.kv-overview__card-media img{display:block;width:100%;height:100%;object-fit:cover}
.kv-overview__card-title h3{font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;line-height:1.2;color:#151717;margin:1rem 0 .5rem;font-family:"Instrument Sans","Instrument Sans Fallback"}
.kv-overview__card-text p{font-size:1rem;line-height:1.5;color:rgba(21,23,23,.75);margin:0}
@media(min-width:768px){.kv-overview{padding:9rem 0}.kv-overview__stats{grid-template-columns:repeat(4,1fr)}.kv-overview__cards{grid-template-columns:repeat(3,1fr);gap:2.5rem;margin-top:4rem}}
```

- [ ] **Step 2: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "feat: add overview image-cards styles"
```

---

### Task 3: Add the cards markup to the `kv-overview` entry in both HTML files

**Files:**
- Modify: `index.html` (inside the `KV_SECTIONS` array, the `kv-overview` entry's `html` template literal)
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` (same entry, identical text — confirmed byte-identical between the two files before this change)

The `kv-overview` entry currently ends with:
```html
...<dl class="kv-overview__stats"><div class="kv-overview__stat"><dt>Status</dt><dd>OC Received</dd></div><div class="kv-overview__stat"><dt>Location</dt><dd>Sector 128, Noida</dd></div><div class="kv-overview__stat"><dt>Typology</dt><dd>3, 4 Bed Residences &amp; Duplexes</dd></div><div class="kv-overview__stat"><dt>Possession</dt><dd>Possession Ongoing</dd></div></dl></div></section>`
```

- [ ] **Step 1: In `index.html`, replace `</dl></div></section>` (the one immediately following the `kv-overview__stats` block above — verify by matching the full preceding stats markup, since `</dl></div></section>` alone is not unique in the file) with the cards markup + original closing tags**

New text (cards block inserted between `</dl>` and `</div></section>`):
```html
</dl><div class="kv-overview__cards"><div class="kv-overview__card"><div class="kv-overview__card-media"><img alt="" loading="lazy" src="./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/mortgage-services.jpg"></div><div class="kv-overview__card-title"><h3>Sector 128, Noida</h3></div><div class="kv-overview__card-text"><p>Steps from the city's business core, minutes from the golf course you wake up to.</p></div></div><div class="kv-overview__card"><div class="kv-overview__card-media"><img alt="" loading="lazy" src="./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/property-management.jpg"></div><div class="kv-overview__card-title"><h3>110-Acre Golf Course</h3></div><div class="kv-overview__card-text"><p>Twin towers set inside sprawling green, views from nearly every window.</p></div></div><div class="kv-overview__card"><div class="kv-overview__card-media"><img alt="" loading="lazy" src="./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/development.jpg"></div><div class="kv-overview__card-title"><h3>3 &amp; 4 Bed Residences &amp; Duplexes</h3></div><div class="kv-overview__card-text"><p>Spacious layouts, island kitchens, private sundecks — built for how you live.</p></div></div></div></div></section>
```

- [ ] **Step 2: Apply the identical replacement to `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`**

Same old text, same new text as Step 1 (the two files' `kv-overview` entries are byte-identical, so the same edit applies verbatim).

- [ ] **Step 3: Syntax-check both files' inline script parses**

Run:
```bash
node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>\(function\(\)\{var KV_SECTIONS[\s\S]*?\}\)\(\);<\/script>/)[0].slice(8,-9))"
node -e "new Function(require('fs').readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8').match(/<script>\(function\(\)\{var KV_SECTIONS[\s\S]*?\}\)\(\);<\/script>/)[0].slice(8,-9))"
```
Expected: no output, exit code 0 (confirms the extracted script text is valid JS after the edit — catches unbalanced quotes/backticks from the copy-paste).

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat: add location/golf-course/residences image cards to overview"
```

---

### Task 4: Verify in headless Chrome and fix any issues

**Files:** none (verification only; fix-forward into Task 2/3 files if something's wrong)

- [ ] **Step 1: Kill any stale server, start `local-server.js`**

```bash
taskkill //F //IM node.exe
node local-server.js
```
(Run the server in the background — e.g. a separate terminal/background process — since Step 2 needs it listening on port 5000.)

- [ ] **Step 2: Run the probe at desktop width**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --dump-dom --virtual-time-budget=10000 --window-size=1900,900 \
  "http://localhost:5000/?probe=1&scrollY=600" > probe-desktop.html
node -e "
const fs=require('fs');
const html=fs.readFileSync('probe-desktop.html','utf8');
const m=html.match(/<title>PROBE::([\s\S]*?)<\/title>/);
const data=JSON.parse(m[1]);
console.log(JSON.stringify(data.overview,null,2));
console.log('kv-overview section:', data.sections['kv-overview']);
"
```

Expected: `data.overview.cardCount === 3`; each of the 3 `cards` entries has a non-empty `heading` (`Sector 128, Noida` / `110-Acre Golf Course` / `3 & 4 Bed Residences & Duplexes`), an `imgSrc` ending in `.jpg`, `imgNaturalSize` that is not `n/a` (image actually loaded), and `mediaHeight > 0`. `data.overview.gridColumns === 3` (desktop 3-col grid). `data.sections['kv-overview']` shows `display:block` (or similar non-none) with a height much larger than before (stats strip + cards).

- [ ] **Step 3: Run the probe at mobile width**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --dump-dom --virtual-time-budget=10000 --window-size=390,844 \
  "http://localhost:5000/?probe=1&scrollY=600" > probe-mobile.html
node -e "
const fs=require('fs');
const html=fs.readFileSync('probe-mobile.html','utf8');
const m=html.match(/<title>PROBE::([\s\S]*?)<\/title>/);
const data=JSON.parse(m[1]);
console.log(JSON.stringify(data.overview,null,2));
"
```

Expected: `cardCount === 3`, `gridColumns === 1` (mobile single column).

- [ ] **Step 4: If any expectation fails, diagnose and fix**

Common failure modes and where to look:
- `cardCount !== 3` or headings wrong → the `kv-overview` `html` template literal in `index.html` (Task 3) wasn't edited correctly, or the dev server is serving a stale file (re-run Step 1).
- `imgNaturalSize === '0x0'` or `'n/a'` → image path wrong or file missing; confirm `mortgage-services.jpg` / `property-management.jpg` / `development.jpg` exist under `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/`.
- `gridColumns` wrong at either width → the CSS media query in Task 2 has a typo or the `768px` breakpoint doesn't match the test viewport width.
- `data.sections['kv-overview']` missing or `NOT FOUND` → the `KV_SECTIONS` inline script threw before `ensure()` ran; re-check Task 3 Step 3's syntax check.

Fix inline, restart the server, re-run Steps 2-3 until both pass.

- [ ] **Step 5: Clean up probe output files**

```bash
rm -f probe-desktop.html probe-mobile.html
```

(These are scratch verification artifacts, not project files — don't commit them.)

---

## Self-review notes

- **Spec coverage:** content/copy (spec table) → Task 3. Layout/CSS (mobile 1-col, desktop 3-col, rounded 4/5 images, no button) → Task 2 + Task 3. Mechanics (edit `KV_SECTIONS` in both HTML files) → Task 3. Verification (probe extension + headless-Chrome check at both widths) → Task 1 + Task 4. No spec item left uncovered.
- **Placeholder scan:** no TBD/TODO; every step has literal code or literal commands with concrete expected output.
- **Consistency:** class names (`kv-overview__cards`, `kv-overview__card`, `kv-overview__card-media`, `kv-overview__card-title`, `kv-overview__card-text`) match exactly between the CSS (Task 2), the HTML (Task 3), and the probe selectors (Task 1).
