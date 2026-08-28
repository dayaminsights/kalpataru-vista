# Unit Layout Plan section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Unit Layout Plan" section (3 BHK / 4 BHK spec cards, reusing the existing lead-gate modal) between Amenities and Site Layout & Specifications, per `docs/superpowers/specs/2026-08-28-unit-layout-plan-design.md`.

**Architecture:** This is a static-HTML reskin repo (see `CLAUDE.md`/`ARCHITECTURE.md`), not a component framework — there is no test runner. New sections are injected via the shared `KV_SECTIONS` array (a small inline `<script>` at the end of each HTML file) rather than server-rendered HTML, because the server-rendered container is React-owned and hydration wipes any extra static sibling. Verification is a headless-Chrome probe (`?probe=1` route in `local-server.js`) that reports computed DOM state via `document.title`, not a unit-test suite — every task's "verify" step uses that mechanism instead of `pytest`/`jest`-style test code.

**Tech Stack:** Plain HTML/CSS/vanilla JS (no build step), headless Chrome for verification.

---

## File Structure

| File | Responsibility |
|---|---|
| `..._files/kalpataru-brand.css` | New `.kv-unit-layout*` rules (grid, card, icon, note), appended at end of file |
| `index.html` | New `kv-unit-layout` entry in `KV_SECTIONS`; renumbered eyebrows on `kv-plans`/`kv-why`/`kv-cta` |
| `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` | Same two edits, mirrored |
| `local-server.js` | Probe route extended to report the new section's DOM state |

No JS bundle patch needed — this section isn't React-owned (see Architecture above).

---

### Task 1: Add CSS for the new section

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css` (append at end of file)

- [ ] **Step 1: Read the end of the file to confirm the exact current tail**

Run: read the last ~15 lines of `kalpataru-brand.css` with the Read tool (use an offset near the end) so the appended block starts on a clean new line and doesn't duplicate an existing rule name.

- [ ] **Step 2: Append the new rules**

Add this block at the end of the file:

```css
.kv-unit-layout__grid{display:grid;grid-template-columns:1fr;gap:1.5rem;margin-top:1rem}
.kv-unit-layout__card{border:1px solid rgba(21,23,23,.12);border-radius:1rem;padding:2rem;display:flex;flex-direction:column;gap:1.25rem;align-items:flex-start}
.kv-unit-layout__icon{width:2.75rem;height:2.75rem;color:#151717}
.kv-unit-layout__icon svg{display:block;width:100%;height:100%}
.kv-unit-layout__card h3{margin:0;font-size:1.3rem;font-weight:700;letter-spacing:-0.01em;color:#151717;font-family:"Instrument Sans","Instrument Sans Fallback"}
.kv-unit-layout__card ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5rem}
.kv-unit-layout__card li{font-size:1rem;line-height:1.5;color:#151717;padding-left:1.1rem;position:relative}
.kv-unit-layout__card li::before{content:'';position:absolute;left:0;top:.55em;width:.4rem;height:.4rem;border-radius:50%;background:#151717}
.kv-unit-layout__note{margin:2rem 0 0;font-size:.9rem;color:rgba(21,23,23,.55);text-align:center}
@media(min-width:768px){
  .kv-unit-layout__grid{grid-template-columns:repeat(2,1fr);gap:2rem}
}
```

- [ ] **Step 3: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "style: add Unit Layout Plan section CSS"
```

---

### Task 2: Add the `kv-unit-layout` entry and renumber eyebrows in `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Insert the new `KV_SECTIONS` entry between `kv-amenities` and `kv-plans`**

Find this exact substring (the boundary between the `kv-amenities` entry and the `kv-plans` entry):

```
<div class="kv-amenities-trigger is-last"></div></div></div></div></section>`},{id:'kv-plans'
```

Replace it with (note: **backtick template literal** for `html`, per `ARCHITECTURE.md` — this copy has no apostrophes today, but stay consistent with the rest of the file):

```
<div class="kv-amenities-trigger is-last"></div></div></div></div></section>`},{id:'kv-unit-layout',anchor:'.why-us_root__aGsFp',pos:'beforebegin',html:`<section class="kv-unit-layout" id="kv-unit-layout"><div class="container_container__v5gtR"><div class="kv-section__eyebrow">03 — Unit Layout Plan</div><h2 class="kv-section__heading">Unit Layout Plan</h2><div class="kv-unit-layout__grid"><div class="kv-unit-layout__card"><div class="kv-unit-layout__icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="36" height="36" rx="1"></rect><line x1="6" y1="24" x2="42" y2="24"></line><line x1="24" y1="6" x2="24" y2="24"></line><line x1="6" y1="34" x2="24" y2="34"></line></svg></div><h3>3 BHK Apartment</h3><ul><li>Super Area &#8211; 3,011 sq ft</li><li>Total Useable Area &#8211; 2,007 sq ft</li><li>&#8377;4.06 Cr* Onwards</li></ul><a class="button_button-round__TFjlU button_color-secondary__FZDOG button_inversed__slQcI kv-layouts-trigger" href="#kv-layouts-modal"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Download Unit Layout">Download Unit Layout</span></div></div></a></div><div class="kv-unit-layout__card"><div class="kv-unit-layout__icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="36" height="36" rx="1"></rect><line x1="6" y1="24" x2="42" y2="24"></line><line x1="24" y1="6" x2="24" y2="42"></line><line x1="24" y1="34" x2="42" y2="34"></line></svg></div><h3>4 BHK Apartment</h3><ul><li>Super Area &#8211; 3,938 sq ft</li><li>Total Useable Area &#8211; 2,625 sq ft</li><li>&#8377;5.02 Cr* Onwards</li></ul><a class="button_button-round__TFjlU button_color-secondary__FZDOG button_inversed__slQcI kv-layouts-trigger" href="#kv-layouts-modal"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Download Unit Layout">Download Unit Layout</span></div></div></a></div></div><p class="kv-unit-layout__note">Duplex residences also available &#8211; enquire for details.</p></div></section>`},{id:'kv-plans'
```

- [ ] **Step 2: Renumber the three eyebrows that come after the new section**

Three separate exact-string replacements in the same file:

```
03 — Site Layout &amp; Specifications
```
→
```
04 — Site Layout &amp; Specifications
```

```
04 — Why Kalpataru Vista
```
→
```
05 — Why Kalpataru Vista
```

```
05 — Get in Touch
```
→
```
06 — Get in Touch
```

- [ ] **Step 3: Verify the file still parses as valid HTML-with-script**

Run: `node --check index.html` will fail (it's not a JS file) — instead just confirm no stray backtick/quote broke the inline script by checking it's still valid JS on its own. Extract and check the trailing script block:

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const start=html.lastIndexOf('<script>(function(){');
const end=html.indexOf('</script>', start);
const js=html.slice(start+8, end);
new Function(js);
console.log('OK: inline KV_SECTIONS script is syntactically valid');
"
```
Expected: `OK: inline KV_SECTIONS script is syntactically valid`

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Unit Layout Plan section to index.html"
```

---

### Task 3: Mirror the same two edits in the FIND-named HTML file

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`

- [ ] **Step 1: Apply the identical `KV_SECTIONS` insertion from Task 2 Step 1**

Same find/replace: locate `<div class="kv-amenities-trigger is-last"></div></div></div></div></section>`},{id:'kv-plans'` in this file and replace with the same expanded string from Task 2 Step 1.

- [ ] **Step 2: Apply the identical three eyebrow renumbers from Task 2 Step 2**

Same three replacements (`03 — Site Layout...` → `04 —...`, etc.) in this file.

- [ ] **Step 3: Verify with the same inline-script syntax check as Task 2 Step 3, pointed at this file**

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8');
const start=html.lastIndexOf('<script>(function(){');
const end=html.indexOf('</script>', start);
const js=html.slice(start+8, end);
new Function(js);
console.log('OK: inline KV_SECTIONS script is syntactically valid');
"
```
Expected: `OK: inline KV_SECTIONS script is syntactically valid`

- [ ] **Step 4: Diff the two HTML files' trailing scripts to confirm they're identical**

```bash
node -e "
const fs=require('fs');
const a=fs.readFileSync('index.html','utf8');
const b=fs.readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8');
const grab=h=>h.slice(h.lastIndexOf('<script>(function(){'));
console.log(grab(a)===grab(b) ? 'OK: trailing scripts match' : 'MISMATCH: files diverged');
"
```
Expected: `OK: trailing scripts match`

- [ ] **Step 5: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat: add Unit Layout Plan section to FIND-named HTML file"
```

---

### Task 4: Extend the probe route to report the new section

**Files:**
- Modify: `local-server.js:215` (id list) and a new block after `local-server.js:295` (the existing `kvPlans` block)

- [ ] **Step 1: Add `'kv-unit-layout'` to the existing id-list check**

Find (local-server.js:215):

```js
      ['kv-video','kv-overview','kv-amenities','kv-plans','kv-why','kv-cta'].forEach(function(id){
```

Replace with:

```js
      ['kv-video','kv-overview','kv-amenities','kv-unit-layout','kv-plans','kv-why','kv-cta'].forEach(function(id){
```

- [ ] **Step 2: Add a dedicated `kvUnitLayout` block, modeled on the existing `kvPlans` block**

Find the existing block (local-server.js:279-295):

```js
      var kvPlans=document.getElementById('kv-plans');
      if(kvPlans){
```

Insert this new block immediately **before** that line:

```js
      var kvUnitLayout=document.getElementById('kv-unit-layout');
      if(kvUnitLayout){
        var ulCards=kvUnitLayout.querySelectorAll('.kv-unit-layout__card');
        var ulGrid=kvUnitLayout.querySelector('.kv-unit-layout__grid');
        var ulTriggers=kvUnitLayout.querySelectorAll('.kv-layouts-trigger');
        out.kvUnitLayout={
          gridColumns:ulGrid?getComputedStyle(ulGrid).gridTemplateColumns:null,
          cardCount:ulCards.length,
          cardHeadings:Array.prototype.map.call(ulCards,function(c){return (c.querySelector('h3')||{}).textContent;}),
          cardSpecs:Array.prototype.map.call(ulCards,function(c){return Array.prototype.map.call(c.querySelectorAll('li'),function(li){return li.textContent;});}),
          triggerCount:ulTriggers.length,
          noteText:(kvUnitLayout.querySelector('.kv-unit-layout__note')||{}).textContent,
          domOrder:{
            afterAmenities:!!(document.getElementById('kv-amenities')&&document.getElementById('kv-amenities').compareDocumentPosition(kvUnitLayout)&Node.DOCUMENT_POSITION_FOLLOWING),
            beforePlans:!!(document.getElementById('kv-plans')&&kvUnitLayout.compareDocumentPosition(document.getElementById('kv-plans'))&Node.DOCUMENT_POSITION_FOLLOWING)
          }
        };
      } else out.kvUnitLayout='kv-unit-layout element NOT FOUND';
```

- [ ] **Step 3: Verify `node --check` on the server file**

Run: `node --check local-server.js`
Expected: no output (silent success)

- [ ] **Step 4: Commit**

```bash
git add local-server.js
git commit -m "feat: extend probe route to report kv-unit-layout section"
```

---

### Task 5: Run the full probe and confirm everything renders correctly

**Files:** none (verification only)

- [ ] **Step 1: Kill any previous server instance and start a fresh one**

```bash
taskkill //F //IM node.exe 2>/dev/null; node local-server.js &
sleep 1
```

- [ ] **Step 2: Run the headless-Chrome probe**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --dump-dom --virtual-time-budget=10000 --window-size=1900,900 \
  "http://localhost:5000/?probe=1&scrollY=0" > "$TEMP/kv-probe-unit-layout.html"
```

- [ ] **Step 3: Parse and inspect the `kvUnitLayout` and section-order fields**

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync(process.env.TEMP+'/kv-probe-unit-layout.html','utf8');
const m=html.match(/<title>PROBE::([\s\S]*?)<\/title>/);
const data=JSON.parse(m[1]);
console.log('sections.kv-unit-layout:', data.sections['kv-unit-layout']);
console.log('kvUnitLayout:', JSON.stringify(data.kvUnitLayout, null, 2));
"
```

Expected: `sections.kv-unit-layout` shows a non-zero height (not `NOT FOUND`); `kvUnitLayout.cardCount` is `2`; `cardHeadings` is `["3 BHK Apartment","4 BHK Apartment"]`; `cardSpecs` shows the three spec lines per card with the correct sq-ft/price figures; `triggerCount` is `2`; `domOrder.afterAmenities` and `domOrder.beforePlans` are both `true`.

- [ ] **Step 4: Confirm the renumbered eyebrows read correctly**

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync(process.env.TEMP+'/kv-probe-unit-layout.html','utf8');
['04 — Site Layout','05 — Why Kalpataru Vista','06 — Get in Touch'].forEach(function(s){
  console.log(s, '->', html.includes(s) ? 'FOUND' : 'MISSING');
});
"
```

Expected: all three print `FOUND`.

- [ ] **Step 5: Confirm the reused lead-gate modal still opens from the existing trigger (regression check)**

Read the `layoutsModal` field already produced by the existing probe code (local-server.js:475 area) from the same parsed `data` object — reuse the Step 3 script's `data` variable, or re-parse and print `data.layoutsModal`. Confirm it still reports the modal opening/closing correctly, unaffected by the new section (this checks for CSS/JS collisions from Task 1's new class names).

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync(process.env.TEMP+'/kv-probe-unit-layout.html','utf8');
const m=html.match(/<title>PROBE::([\s\S]*?)<\/title>/);
const data=JSON.parse(m[1]);
console.log('layoutsModal:', JSON.stringify(data.layoutsModal, null, 2));
"
```

Expected: same modal-open/close behavior as before this change (no regressions).

- [ ] **Step 6: Stop the dev server**

```bash
taskkill //F //IM node.exe
```

No commit for this task — it's verification-only. If any check fails, fix the relevant task's file and re-run from Step 1.
