# Amenities Photo Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat 17-item pill-list `kv-amenities` section with 3 photo-led category panels (Play & Unwind / Connect & Work / Relax & Recharge), each pairing a placeholder lifestyle photo with a heading, one-line body copy, and that category's amenity tags — visually modeled on the Camellias Residences reference's "Wellness-centered amenities" section, minus its GSAP scroll-pin mechanic.

**Architecture:** No new injection point — this rewrites the existing `kv-amenities` entry's `html` string inside the shared `KV_SECTIONS` array (present at the end of both HTML files, see `ARCHITECTURE.md` §"New sections: React strips extra static siblings on hydration"). CSS is restyled in-place inside the single shared `kalpataru-brand.css`. Three placeholder photos are copied from `assets/` into the served `..._files/` folder.

**Tech Stack:** Static HTML/CSS only, no JS behavior added. No build step. Verification via the existing headless-Chrome `?probe=1` route in `local-server.js`, extended with new checks — this project's established substitute for a test framework.

**Reference:** Full design rationale, copy, and grouping table are in `docs/superpowers/specs/2026-08-28-amenities-photo-panels-design.md`. Read it before starting if anything below is ambiguous.

**File-sync rule:** `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` must stay content-identical (line-ending differences aside — `index.html` is CRLF, the FIND-named file is LF, this is pre-existing and harmless). Every HTML edit in this plan must be applied to **both** files identically.

**Note on the probe route:** `local-server.js`'s `/?probe=1` handler only ever reads and serves `index.html` (see `local-server.js:91`), never the FIND-named file. All probe-based verification in this plan checks `index.html`'s behavior; edits to the FIND-named file are kept in sync by exact-string mirroring, not independently verified by the probe.

---

### Task 1: Extend the dev probe with amenities-panel checks

**Files:**
- Modify: `local-server.js`

- [ ] **Step 1: Add panel/image/tag checks to the probe script**

Open `local-server.js`. Find this exact block (it's the last thing added to `out.sections` before the final `document.title` line):

```js
      var rera=document.querySelector('.kv-rera');
      out.sections['kv-rera']=rera?'found':'NOT FOUND';
      var navOverview=document.querySelector('a[href="#kv-overview"]');
      out.sections['nav-overview-link']=navOverview?'found':'NOT FOUND';
      document.title='PROBE::'+JSON.stringify(out);
```

Replace it with:

```js
      var rera=document.querySelector('.kv-rera');
      out.sections['kv-rera']=rera?'found':'NOT FOUND';
      var navOverview=document.querySelector('a[href="#kv-overview"]');
      out.sections['nav-overview-link']=navOverview?'found':'NOT FOUND';
      var navAmenities=document.querySelector('a[href="#kv-amenities"]');
      out.sections['nav-amenities-link']=navAmenities?'found':'NOT FOUND';
      var amenPanels=document.querySelectorAll('#kv-amenities .kv-amenities__panel');
      out.amenities={panelCount:amenPanels.length};
      out.amenities.panels=Array.prototype.map.call(amenPanels,function(p){
        var img=p.querySelector('.kv-amenities__media img');
        var h3=p.querySelector('.kv-amenities__copy h3');
        var tags=p.querySelectorAll('.kv-amenities__tags li');
        return {
          heading:h3?h3.textContent:'NO H3',
          imgSrc:img?img.getAttribute('src').split('/').pop():'NO IMG',
          imgNaturalSize:img?(img.naturalWidth+'x'+img.naturalHeight):'n/a',
          tagCount:tags.length
        };
      });
      var oldList=document.querySelector('#kv-amenities .kv-amenities__list');
      out.amenities.oldFlatListPresent=!!oldList;
      var amenText=document.getElementById('kv-amenities')?document.getElementById('kv-amenities').textContent:'';
      out.amenities.allSeventeenPresent=['Swimming Pool','Gymnasium','Multi-Purpose Hall','Squash Court','Community Centre','Creche','Business Lounge',"Kids' Play Area",'Fitness Zone','Games Room','Jogging Path','Landscaped Podium for Walking','Library and TV Lounge','Lounge Area','Spa','Sundecks','Waiting Niche'].every(function(name){return amenText.indexOf(name)>-1;});
      document.title='PROBE::'+JSON.stringify(out);
```

- [ ] **Step 2: Restart the dev server**

Run: `taskkill //F //IM node.exe` then `node local-server.js` (background it — it must stay running for every later probe check in this plan).

- [ ] **Step 3: Run the probe and confirm the new checks report the expected "not built yet" (red) state**

Run:
```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/?probe=1&scrollY=0" > probe1.html
node -e "const fs=require('fs');const h=fs.readFileSync('probe1.html','utf8');const m=h.match(/<title>PROBE::([\s\S]*?)<\/title>/);const d=JSON.parse(m[1].replace(/&quot;/g,'\"').replace(/&amp;/g,'&'));console.log(d.amenities);console.log('nav-amenities-link:',d.sections['nav-amenities-link'])"
```
Write `probe1.html` to the session scratchpad directory, not the repo.

Expected output: `panelCount:0`, `panels:[]`, `oldFlatListPresent:true` (the old list is still there — nothing built yet), `allSeventeenPresent:true` (the flat list still has all 17 names), `nav-amenities-link: found` (this link already exists from the prior content-sections plan). This is the expected red state before Task 4.

- [ ] **Step 4: Commit**

```bash
git add local-server.js
git commit -m "$(cat <<'EOF'
feat: extend dev probe to check amenities photo panels

Adds panel/image/tag checks and a regression check that all 17
original amenity names survive the upcoming grouping, so the redesign
can be verified against real computed/loaded state, not just markup
that looks right in source.
EOF
)"
```

---

### Task 2: Copy placeholder amenity photos into the served assets folder

**Files:**
- Create: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/enjoy.webp`
- Create: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/meet.webp`
- Create: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/relax.webp`

- [ ] **Step 1: Copy the 3 files**

Both HTML files sit in the repo root and reference the single long-named `_files/` folder by relative path (confirmed against the existing `apartment-video.mp4` reference at `index.html`'s `kv-video` entry — one copy serves both HTML files, no duplication needed, unlike what an earlier draft of the design spec assumed).

Run:
```bash
cp "assets/enjoy.webp" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/enjoy.webp"
cp "assets/meet.webp" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/meet.webp"
cp "assets/relax.webp" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/relax.webp"
```

- [ ] **Step 2: Verify the files landed**

Run: `ls -la "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/" | grep -E "enjoy|meet|relax"`

Expected: all 3 files listed, non-zero size (roughly 81KB / 42KB / 62KB respectively, matching their `assets/` source sizes).

- [ ] **Step 3: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/enjoy.webp" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/meet.webp" "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/relax.webp"
git commit -m "$(cat <<'EOF'
chore: add placeholder amenity category photos

enjoy.webp / meet.webp / relax.webp — stock lifestyle photos standing
in for real Kalpataru Vista amenity photography until it's available.
Used by the amenities photo panels built in the next commit.
EOF
)"
```

---

### Task 3: Rewrite the kv-amenities CSS block

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

- [ ] **Step 1: Replace the existing `--- kv-amenities ---` block**

Find this exact block (currently 4 lines, right after the `kv-benefits` block and before the `kv-cta` block):

```css
/* --- kv-amenities --- */
.kv-amenities{padding:6rem 0;background:#fff}
.kv-amenities__list{list-style:none;display:flex;flex-wrap:wrap;gap:.75rem;margin:2.5rem 0 0;padding:0}
.kv-amenities__list li{border:1px solid rgba(21,23,23,.18);border-radius:100px;padding:.65rem 1.35rem;font-size:.95rem;color:#151717;white-space:nowrap}
@media(min-width:768px){.kv-amenities{padding:8rem 0}}
```

Replace it with:

```css
/* --- kv-amenities: 3 photo-led category panels, alternating media/copy sides.
   Single photo per panel (not the Camellias reference's big+small pair) --
   only 1 placeholder photo exists per category right now, see design spec. */
.kv-amenities{padding:6rem 0;background:#fff}
.kv-amenities__panels{display:flex;flex-direction:column;gap:4rem;margin-top:3rem}
.kv-amenities__panel{display:grid;grid-template-columns:1fr;grid-template-areas:"media" "copy";gap:1.5rem;align-items:center}
.kv-amenities__media{grid-area:media;aspect-ratio:4/5;border-radius:1.25rem;overflow:hidden;background:#f1f1ef}
.kv-amenities__media img{display:block;width:100%;height:100%;object-fit:cover}
.kv-amenities__copy{grid-area:copy}
.kv-amenities__num{display:block;font-size:.85rem;font-weight:600;color:rgba(21,23,23,.4);letter-spacing:.05em;margin-bottom:1rem}
.kv-amenities__copy h3{font-size:clamp(1.5rem,2.5vw,2rem);font-weight:700;letter-spacing:-0.02em;line-height:1.15;color:#151717;margin:0 0 1rem;font-family:"Instrument Sans","Instrument Sans Fallback"}
.kv-amenities__copy p{font-size:1.05rem;line-height:1.6;color:rgba(21,23,23,.75);max-width:42ch;margin:0 0 1.5rem}
.kv-amenities__tags{list-style:none;display:flex;flex-wrap:wrap;gap:.6rem;margin:0;padding:0}
.kv-amenities__tags li{border:1px solid rgba(21,23,23,.18);border-radius:100px;padding:.5rem 1.1rem;font-size:.85rem;color:#151717;white-space:nowrap}
@media(min-width:768px){
  .kv-amenities{padding:8rem 0}
  .kv-amenities__panel{grid-template-columns:1fr 1fr;grid-template-areas:"media copy";gap:4rem}
  .kv-amenities__panel--reverse{grid-template-areas:"copy media"}
}
```

- [ ] **Step 2: Restart the dev server, run the probe**

Same commands as Task 1 Step 2–3.

Expected: unchanged from Task 1's red state (`panelCount:0`, `oldFlatListPresent:true`) — this task only changes CSS, and the old markup (still using `.kv-amenities__list`) has no matching class for the new rules yet, so nothing visually changes until Task 4. This step exists to catch a CSS syntax error early (check the terminal running `node local-server.js` for any read errors, and confirm the probe still returns valid JSON).

- [ ] **Step 3: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "$(cat <<'EOF'
feat: restyle kv-amenities for photo panels layout

Replaces the flat pill-list CSS with a 3-panel media/copy grid that
alternates sides via grid-template-areas (kv-amenities__panel--reverse
swaps media and copy columns). Markup update follows in the next
commit -- this alone is a no-op against the still-unchanged old list
markup.
EOF
)"
```

---

### Task 4: Rewrite the kv-amenities section markup

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`

- [ ] **Step 1: Replace the `kv-amenities` entry in the shared `KV_SECTIONS` array, in both HTML files**

**Do not use a literal HTML splice — it gets wiped by React hydration.** This edits the existing array entry in place (same mechanism documented in `ARCHITECTURE.md`'s "New sections" section) — same `id`/`anchor`/`pos`, only the `html` template literal's content changes.

In **both** `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`, find this exact substring (appears once in each file):

```
{id:'kv-amenities',anchor:'.why-us_root__aGsFp',pos:'beforebegin',html:`<section class="kv-amenities" id="kv-amenities"><div class="container_container__v5gtR"><div class="kv-section__eyebrow">03 — Amenities</div><h2 class="kv-section__heading">Everything a day could ask for</h2><ul class="kv-amenities__list"><li>Swimming Pool</li><li>Gymnasium</li><li>Multi-Purpose Hall</li><li>Squash Court</li><li>Community Centre</li><li>Creche</li><li>Business Lounge</li><li>Kids' Play Area</li><li>Fitness Zone</li><li>Games Room</li><li>Jogging Path</li><li>Landscaped Podium for Walking</li><li>Library and TV Lounge</li><li>Lounge Area</li><li>Spa</li><li>Sundecks</li><li>Waiting Niche</li></ul></div></section>`}
```

Replace it with:

```
{id:'kv-amenities',anchor:'.why-us_root__aGsFp',pos:'beforebegin',html:`<section class="kv-amenities" id="kv-amenities"><div class="container_container__v5gtR"><div class="kv-section__eyebrow">03 — Amenities</div><h2 class="kv-section__heading">Everything a day could ask for</h2><div class="kv-amenities__panels"><div class="kv-amenities__panel"><div class="kv-amenities__media"><img src="./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/enjoy.webp" alt="Bright games room with a pool table and table tennis table" loading="lazy"></div><div class="kv-amenities__copy"><span class="kv-amenities__num">01</span><h3>Play &amp; Unwind</h3><p>Games rooms, squash courts, and play areas — spaces built for the pure pleasure of downtime.</p><ul class="kv-amenities__tags"><li>Games Room</li><li>Squash Court</li><li>Kids' Play Area</li><li>Multi-Purpose Hall</li></ul></div></div><div class="kv-amenities__panel kv-amenities__panel--reverse"><div class="kv-amenities__media"><img src="./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/meet.webp" alt="Modern glass-walled meeting room" loading="lazy"></div><div class="kv-amenities__copy"><span class="kv-amenities__num">02</span><h3>Connect &amp; Work</h3><p>Business lounges and community spaces that keep you connected, without ever leaving home.</p><ul class="kv-amenities__tags"><li>Business Lounge</li><li>Community Centre</li><li>Library and TV Lounge</li></ul></div></div><div class="kv-amenities__panel"><div class="kv-amenities__media"><img src="./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/relax.webp" alt="Residents relaxing on a landscaped garden patio" loading="lazy"></div><div class="kv-amenities__copy"><span class="kv-amenities__num">03</span><h3>Relax &amp; Recharge</h3><p>Pool, spa, and open-air decks — everyday rituals of rest, right at your doorstep.</p><ul class="kv-amenities__tags"><li>Spa</li><li>Swimming Pool</li><li>Gymnasium</li><li>Sundecks</li><li>Jogging Path</li><li>Fitness Zone</li><li>Creche</li><li>Lounge Area</li><li>Landscaped Podium for Walking</li><li>Waiting Niche</li></ul></div></div></div></div></section>`}
```

**This entry's copy contains a literal apostrophe** (`Kids' Play Area`) — the array already uses backtick delimiters for exactly this reason. Double-check the backticks survived the edit, not straight quotes.

**Note the image `src` paths use the long FIND-named folder** (`./FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/...`) **in both HTML files** — including in `index.html`. This matches the existing `kv-video` entry's `apartment-video.mp4` reference (both HTML files are siblings in the repo root, so this relative path resolves correctly from either file) and avoids duplicating the 3 photos into a second folder.

- [ ] **Step 2: Restart the dev server, run the probe**

Same commands as Task 1 Step 3.

Expected:
- `panelCount:3`
- `panels` array has 3 entries with `heading` values `"Play & Unwind"`, `"Connect & Work"`, `"Relax & Recharge"` in that order
- each panel's `imgSrc` is `enjoy.webp`, `meet.webp`, `relax.webp` respectively
- each panel's `imgNaturalSize` is a real (non-`0x0`) dimension — confirms the image actually loaded, not a broken path
- `tagCount` values are `4`, `3`, `10` respectively
- `oldFlatListPresent:false`
- `allSeventeenPresent:true` (all 17 names still present, now inside the tag groups instead of the flat list)
- `nav-amenities-link: found` (unchanged — the nav link's `href="#kv-amenities"` still resolves, since the section kept its `id`)

If `imgNaturalSize` reports `0x0` for any panel, the image failed to load — check the `src` path against Task 2's actual copied filenames before continuing.

- [ ] **Step 3: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "$(cat <<'EOF'
feat: rebuild amenities section as 3 photo-led category panels

Replaces the flat 17-item pill list with Play & Unwind / Connect &
Work / Relax & Recharge panels, each pairing a placeholder photo with
a heading, one-line body copy, and that category's amenity tags. All
17 original amenity names are preserved, just regrouped -- none
dropped. Visual language modeled on the Camellias Residences
reference's "Wellness-centered amenities" section, without its
GSAP scroll-pin mechanic (no GSAP loaded in this bundle, and layering
hand-written scroll-trigger JS onto an already hydration-fragile page
isn't worth it for this pass -- see the design spec).
EOF
)"
```

---

### Task 5: Full scroll-depth and cross-file verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Run the probe at multiple scroll depths**

The hero is a scroll-scrubbed animation and the new panels sit well below it — per `ARCHITECTURE.md`, confirm nothing about the panels' visibility or image loading regresses as the page scrolls past them. Run the probe at four depths:

```bash
for y in 0 2000 5000 9000; do
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/?probe=1&scrollY=$y" > "probe_$y.html"
done
node -e "
const fs=require('fs');
[0,2000,5000,9000].forEach(function(y){
  const h=fs.readFileSync('probe_'+y+'.html','utf8');
  const m=h.match(/<title>PROBE::([\s\S]*?)<\/title>/);
  const data=JSON.parse(m[1].replace(/&quot;/g,'\"').replace(/&amp;/g,'&'));
  console.log('scrollY='+y, JSON.stringify(data.amenities));
});
"
```
Write the `probe_*.html` files to the session scratchpad directory, not the repo.

Expected at every depth: identical `amenities` object — `panelCount:3`, same 3 headings, all `imgNaturalSize` non-`0x0`, `oldFlatListPresent:false`, `allSeventeenPresent:true`. Nothing here is scroll-animated, so values shouldn't change across depths — this step exists to catch a scroll-driven inline style leaking onto the new section, consistent with this project's documented history of "looks right on load, breaks on scroll" bugs.

- [ ] **Step 2: If anything regresses, fix it and re-run before proceeding** (no code changes expected in the normal case)

- [ ] **Step 3: Confirm both HTML files are still content-identical**

```bash
node -e "
const fs=require('fs');
const norm=s=>s.replace(/\r\n/g,'\n');
const a=norm(fs.readFileSync('index.html','utf8'));
const b=norm(fs.readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8'));
console.log(a===b?'IDENTICAL':'DIVERGED');
"
```
Expected: `IDENTICAL`. If `DIVERGED`, find where the two files' content (not line endings) actually differs and fix it — likely a missed find/replace in Task 4.

- [ ] **Step 4: Manual visual check in a real browser**

Open `http://localhost:5000/#kv-amenities` in an actual browser window (not headless) and confirm: 3 panels render top-to-bottom with alternating image/text sides, images aren't stretched or cropped oddly at the `4:5` aspect ratio, tag pills wrap sensibly at both desktop and a narrow (mobile-width) window, and the nav's "Amenities" link scrolls to this section correctly. The probe checks existence/loading/computed-style facts, not whether the layout actually looks good — this step is the one place in the plan that catches a purely visual regression the probe can't express.

- [ ] **Step 5: Nothing to commit** (this task is verification-only; if Step 2 required fixes, commit those under their own message describing what regressed and why)
