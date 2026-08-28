# Overview Cards Fullscreen Hover Expand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hovering any of the three `.kv-overview__card` cards (Location / 110-Acre Golf Course / Residences) grows it to fill the entire viewport (FLIP grow animation), with fixed left/right arrow buttons to page between the three cards while expanded, closing when the cursor leaves the browser viewport or on `Escape`.

**Architecture:** This site has no test framework — verification is a headless-Chrome `?probe=1` route in `local-server.js` that reports computed state via `document.title` (see `CLAUDE.md`). Every task below substitutes "run the probe, check the JSON" for "run the test suite." The `.kv-overview__cards` markup lives in the runtime JS injector (`KV_SECTIONS` array, inline `<script>`), present in two files — `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` — which must be edited identically. No React/JS-bundle patch is needed: this markup is not React-owned (see `ARCHITECTURE.md`, "New sections: React strips extra static siblings on hydration"). Desktop/hover-capable pointers only — gated by `matchMedia('(hover:hover) and (pointer:fine)')` — so touch/mobile is untouched. Full design rationale: `docs/superpowers/specs/2026-08-28-overview-cards-fullscreen-hover-design.md`.

**Tech Stack:** Plain HTML/CSS/JS (no build step), Node's `http` module (`local-server.js`), headless Chrome for verification.

---

### Task 1: Extend the probe script to check the fullscreen-expand + arrow-nav behavior

**Files:**
- Modify: `local-server.js` (insert new block right after the `layoutsModal` block's closing `}` of `if(layoutsModal&&layoutsTrigger){...}`, before `Promise.all(probeWaits)...`)

Current text at that location:
```js
}catch(layoutsModalErr){out.layoutsModalErr=(layoutsModalErr&&layoutsModalErr.stack)?layoutsModalErr.stack:String(layoutsModalErr);}
      }
      Promise.all(probeWaits).then(function(){setTimeout(finishProbe,50);});
```

- [ ] **Step 1: Confirm the anchor text is still present**

Run: `node -e "console.log(require('fs').readFileSync('local-server.js','utf8').includes('}catch(layoutsModalErr)'))"`
Expected: `true`. If `false`, locate the `if(layoutsModal&&layoutsTrigger){...}` block by content instead and use its closing brace (the one immediately before `Promise.all(probeWaits)`) as the insertion point.

- [ ] **Step 2: Insert the overview-expand probe block between those lines**

Replace:
```js
}catch(layoutsModalErr){out.layoutsModalErr=(layoutsModalErr&&layoutsModalErr.stack)?layoutsModalErr.stack:String(layoutsModalErr);}
      }
      Promise.all(probeWaits).then(function(){setTimeout(finishProbe,50);});
```
with:
```js
}catch(layoutsModalErr){out.layoutsModalErr=(layoutsModalErr&&layoutsModalErr.stack)?layoutsModalErr.stack:String(layoutsModalErr);}
      }
      var expandCards=document.querySelectorAll('#kv-overview .kv-overview__card');
      var prevArrow=document.querySelector('#kv-overview .kv-overview__arrow--prev');
      var nextArrow=document.querySelector('#kv-overview .kv-overview__arrow--next');
      out.overviewExpand={cardCount:expandCards.length,prevArrowFound:!!prevArrow,nextArrowFound:!!nextArrow};
      if(expandCards.length===3&&prevArrow&&nextArrow){
        try{
        var golfCard=expandCards[1];
        golfCard.dispatchEvent(new MouseEvent('mouseenter',{bubbles:false}));
        void golfCard.offsetWidth;
        out.overviewExpand.expandedRightAfterHover=golfCard.classList.contains('is-expanded');
        out.overviewExpand.lightboxOpenRightAfterHover=document.body.classList.contains('kv-overview-lightbox-open');
        probeWaits.push(new Promise(function(resolveExpandWait){
          setTimeout(function(){
            var r=golfCard.getBoundingClientRect();
            out.overviewExpand.rectAfterFlip={top:Math.round(r.top),left:Math.round(r.left),width:Math.round(r.width),height:Math.round(r.height)};
            out.overviewExpand.arrowOpacityAfterHover=getComputedStyle(prevArrow).opacity;
            nextArrow.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            out.overviewExpand.residencesExpandedAfterNextClick=expandCards[2].classList.contains('is-expanded');
            out.overviewExpand.golfStillExpandedAfterNextClick=golfCard.classList.contains('is-expanded');
            document.dispatchEvent(new MouseEvent('mouseleave',{bubbles:false}));
            setTimeout(function(){
              out.overviewExpand.anyExpandedAfterDocLeave=document.querySelector('#kv-overview .kv-overview__card.is-expanded')!==null;
              out.overviewExpand.lightboxOpenAfterDocLeave=document.body.classList.contains('kv-overview-lightbox-open');
              resolveExpandWait();
            },550);
          },500);
        }));
        }catch(expandErr){out.overviewExpandErr=(expandErr&&expandErr.stack)?expandErr.stack:String(expandErr);}
      }
      Promise.all(probeWaits).then(function(){setTimeout(finishProbe,50);});
```

- [ ] **Step 3: Syntax-check the file**

Run: `node --check local-server.js`
Expected: no output (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add local-server.js
git commit -m "feat: extend dev probe to check overview-card fullscreen expand"
```

---

### Task 2: Add the `.is-expanded` and arrow CSS

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css`

The file currently has, inside the `kv-overview` block's `@media(min-width:768px)` rule:
```css
@media(min-width:768px){
  .kv-overview{padding:9rem 0}
  .kv-overview__top{grid-template-columns:1fr 1fr;gap:4rem;align-items:start;margin-bottom:4rem}
  .kv-overview__cards{grid-template-columns:repeat(3,1fr);gap:2rem}
  .kv-overview__card-overlay h3{font-size:1.6rem}
}

/* --- kv-amenities: pinned scroll sequence, ported from the Camellias Residences
```

- [ ] **Step 1: Insert new rules between the `@media` block's closing `}` and the `kv-amenities` comment**

Replace:
```css
  .kv-overview__card-overlay h3{font-size:1.6rem}
}

/* --- kv-amenities: pinned scroll sequence, ported from the Camellias Residences
```
with:
```css
  .kv-overview__card-overlay h3{font-size:1.6rem}
}

/* --- kv-overview fullscreen hover-expand: card grows to fill the viewport via a
   JS-driven FLIP animation (see the inline script after initKvGolfSlideshow). Base
   hover-scale is neutralized while expanded since scale() would distort the
   position:fixed box the JS sets to 100vw/100vh. --- */
.kv-overview__card.is-expanded,.kv-overview__card.is-expanded:hover{transform:none;box-shadow:none;border-radius:0;z-index:1000}
.kv-overview__card.is-expanded .kv-overview__card-media,.kv-overview__card.is-expanded .kv-overview__card-video{border-radius:0}
.kv-overview__arrow{position:fixed;top:50%;transform:translateY(-50%);z-index:1001;width:3rem;height:3rem;border-radius:50%;border:none;background:rgba(21,23,23,.55);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .25s ease,background-color .25s ease}
.kv-overview__arrow:hover{background-color:rgba(21,23,23,.85)}
.kv-overview__arrow svg{width:1.4rem;height:1.4rem}
.kv-overview__arrow--prev{left:1.5rem}
.kv-overview__arrow--next{right:1.5rem}
body.kv-overview-lightbox-open .kv-overview__arrow{opacity:1;pointer-events:auto}
@media(prefers-reduced-motion:reduce){
  .kv-overview__card.is-expanded{transition:none!important}
  .kv-overview__arrow{transition:none}
}

/* --- kv-amenities: pinned scroll sequence, ported from the Camellias Residences
```

- [ ] **Step 2: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "feat: add fullscreen hover-expand + arrow styles for overview cards"
```

---

### Task 3: Add the arrow buttons to the `kv-overview` template, in both HTML files

**Files:**
- Modify: `index.html` (inside the `KV_SECTIONS` array's `kv-overview` entry)
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` (same entry, identical text at this location)

The `.kv-overview__cards` container currently opens with, immediately followed by the first (Location) card:
```html
<div class="kv-overview__cards"><div class="kv-overview__card" id="kv-location-card">
```

- [ ] **Step 1: In `index.html`, replace that exact text with:**

```html
<div class="kv-overview__cards"><button type="button" class="kv-overview__arrow kv-overview__arrow--prev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"></path></svg></button><button type="button" class="kv-overview__arrow kv-overview__arrow--next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"></path></svg></button><div class="kv-overview__card" id="kv-location-card">
```

- [ ] **Step 2: Apply the identical replacement in `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`** (same old text, same new text — this stretch of the `kv-overview` entry is byte-identical between the two files).

- [ ] **Step 3: Syntax-check both files' inline `KV_SECTIONS` script parses**

Run:
```bash
node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>\(function\(\)\{var KV_SECTIONS[\s\S]*?\}\)\(\);<\/script>/)[0].slice(8,-9))"
node -e "new Function(require('fs').readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8').match(/<script>\(function\(\)\{var KV_SECTIONS[\s\S]*?\}\)\(\);<\/script>/)[0].slice(8,-9))"
```
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat: add prev/next arrow buttons to overview cards"
```

---

### Task 4: Add the fullscreen hover-expand script to both HTML files

**Files:**
- Modify: `index.html` (immediately after the `initKvGolfSlideshow` script's closing `})();</script>`, before the `initKvWhyGallery` script block — note `index.html` uses CRLF line endings in this stretch)
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` (same location — uses LF line endings in this stretch)

The golf-slideshow script currently ends with, immediately followed by the `kv-why` gallery script:
```
initKvGolfSlideshow();
var kvGolfMo=new MutationObserver(initKvGolfSlideshow);
kvGolfMo.observe(document.body,{childList:true,subtree:true});
setTimeout(function(){kvGolfMo.disconnect();},8000);
})();</script>
<script>(function(){
function initKvWhyGallery(){
```

- [ ] **Step 1: In `index.html`, replace that exact text (with CRLF line endings) with (inserting a new script block between the two):**

```
initKvGolfSlideshow();
var kvGolfMo=new MutationObserver(initKvGolfSlideshow);
kvGolfMo.observe(document.body,{childList:true,subtree:true});
setTimeout(function(){kvGolfMo.disconnect();},8000);
})();</script>
<script>(function(){
function initKvOverviewExpand(){
var section=document.getElementById('kv-overview');
if(!section||section.dataset.kvExpandInited==='1')return;
var cardsWrap=section.querySelector('.kv-overview__cards');
var cards=cardsWrap?Array.prototype.slice.call(cardsWrap.querySelectorAll('.kv-overview__card')):[];
var prevBtn=section.querySelector('.kv-overview__arrow--prev');
var nextBtn=section.querySelector('.kv-overview__arrow--next');
if(!cardsWrap||cards.length!==3||!prevBtn||!nextBtn)return;
section.dataset.kvExpandInited='1';
if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
var current=-1;
var animating=false;
var FLIP_MS=450;
var FADE_MS=300;
function fireSynthetic(card,type){
card.dispatchEvent(new MouseEvent(type,{bubbles:false}));
}
function expandFromGrid(card){
if(animating||current!==-1)return;
var i=cards.indexOf(card);
if(i===-1)return;
animating=true;
current=i;
var r=card.getBoundingClientRect();
card.style.transition='none';
card.style.position='fixed';
card.style.margin='0';
card.style.top=r.top+'px';
card.style.left=r.left+'px';
card.style.width=r.width+'px';
card.style.height=r.height+'px';
card.classList.add('is-expanded');
document.body.classList.add('kv-overview-lightbox-open');
void card.offsetWidth;
card.style.transition='top '+FLIP_MS+'ms ease,left '+FLIP_MS+'ms ease,width '+FLIP_MS+'ms ease,height '+FLIP_MS+'ms ease';
requestAnimationFrame(function(){
card.style.top='0px';
card.style.left='0px';
card.style.width='100vw';
card.style.height='100vh';
});
setTimeout(function(){animating=false;},FLIP_MS);
}
function switchTo(nextIndex){
if(animating||current===-1||nextIndex===current)return;
animating=true;
var oldCard=cards[current];
var newCard=cards[nextIndex];
fireSynthetic(oldCard,'mouseleave');
oldCard.classList.remove('is-expanded');
oldCard.style.cssText='';
newCard.style.transition='none';
newCard.style.position='fixed';
newCard.style.margin='0';
newCard.style.top='0px';
newCard.style.left='0px';
newCard.style.width='100vw';
newCard.style.height='100vh';
newCard.style.opacity='0';
newCard.classList.add('is-expanded');
void newCard.offsetWidth;
newCard.style.transition='opacity '+FADE_MS+'ms ease';
requestAnimationFrame(function(){
newCard.style.opacity='1';
});
fireSynthetic(newCard,'mouseenter');
current=nextIndex;
setTimeout(function(){animating=false;},FADE_MS);
}
function collapseToGrid(){
if(current===-1||animating)return;
animating=true;
var card=cards[current];
current=-1;
fireSynthetic(card,'mouseleave');
document.body.classList.remove('kv-overview-lightbox-open');
card.style.transition='none';
card.style.position='';
card.style.top='';
card.style.left='';
card.style.width='';
card.style.height='';
card.style.margin='';
var r=card.getBoundingClientRect();
card.style.position='fixed';
card.style.top='0px';
card.style.left='0px';
card.style.width='100vw';
card.style.height='100vh';
void card.offsetWidth;
card.style.transition='top '+FLIP_MS+'ms ease,left '+FLIP_MS+'ms ease,width '+FLIP_MS+'ms ease,height '+FLIP_MS+'ms ease';
requestAnimationFrame(function(){
card.style.top=r.top+'px';
card.style.left=r.left+'px';
card.style.width=r.width+'px';
card.style.height=r.height+'px';
});
setTimeout(function(){
card.classList.remove('is-expanded');
card.style.cssText='';
animating=false;
},FLIP_MS);
}
cards.forEach(function(card){
card.addEventListener('mouseenter',function(){expandFromGrid(card);});
});
prevBtn.addEventListener('click',function(e){
e.preventDefault();
if(current===-1)return;
switchTo((current-1+cards.length)%cards.length);
});
nextBtn.addEventListener('click',function(e){
e.preventDefault();
if(current===-1)return;
switchTo((current+1)%cards.length);
});
document.addEventListener('mouseleave',function(){
collapseToGrid();
});
document.addEventListener('keydown',function(e){
if(e.key==='Escape')collapseToGrid();
});
}
initKvOverviewExpand();
var kvExpandMo=new MutationObserver(initKvOverviewExpand);
kvExpandMo.observe(document.body,{childList:true,subtree:true});
setTimeout(function(){kvExpandMo.disconnect();},8000);
})();</script>
<script>(function(){
function initKvWhyGallery(){
```

Note: paste this block using an editor/tool that preserves `index.html`'s existing CRLF line endings for this stretch (don't introduce mixed LF into a CRLF region).

- [ ] **Step 2: Apply the identical script insertion in `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`** (same anchor text, same inserted script — this file uses LF line endings in this stretch, so paste with LF, not CRLF).

- [ ] **Step 3: Syntax-check both files' new script parses**

Run:
```bash
node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/\(function\(\)\{\s*function initKvOverviewExpand[\s\S]*?kvExpandMo\.disconnect\(\);\},8000\);\s*\}\)\(\);/)[0])"
node -e "new Function(require('fs').readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8').match(/\(function\(\)\{\s*function initKvOverviewExpand[\s\S]*?kvExpandMo\.disconnect\(\);\},8000\);\s*\}\)\(\);/)[0])"
```
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat: add fullscreen hover-expand behavior to overview cards"
```

---

### Task 5: Verify in headless Chrome and fix any issues

**Files:** none (verification only; fix-forward into Task 1-4 files if something's wrong)

- [ ] **Step 1: Kill any stale server, start `local-server.js`**

```bash
taskkill //F //IM node.exe
node local-server.js
```
(Run the server in the background — e.g. a separate terminal/background process — since Step 2 needs it listening on port 5000.)

- [ ] **Step 2: Run the probe**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --dump-dom --virtual-time-budget=10000 --window-size=1900,900 \
  "http://localhost:5000/?probe=1&scrollY=600" > probe-expand.html
node -e "
const fs=require('fs');
const html=fs.readFileSync('probe-expand.html','utf8');
const m=html.match(/<title>PROBE::([\s\S]*?)<\/title>/);
const data=JSON.parse(m[1]);
console.log(JSON.stringify(data.overviewExpand,null,2));
console.log('jsErr:', data.overviewExpandErr||'none');
"
```

Expected `data.overviewExpand`:
- `cardCount:3`, `prevArrowFound:true`, `nextArrowFound:true`
- `expandedRightAfterHover:true`
- `lightboxOpenRightAfterHover:true`
- `rectAfterFlip`: `top:0`, `left:0`, `width` and `height` matching the 1900×900 window (within a few px of `1900`/`900`)
- `arrowOpacityAfterHover:'1'`
- `residencesExpandedAfterNextClick:true`
- `golfStillExpandedAfterNextClick:false`
- `anyExpandedAfterDocLeave:false`
- `lightboxOpenAfterDocLeave:false`
- `data.overviewExpandErr` is `'none'`

- [ ] **Step 3: If any expectation fails, diagnose and fix**

Common failure modes and where to look:
- `prevArrowFound:false` / `nextArrowFound:false` → the arrow-button markup wasn't inserted correctly into the `kv-overview` template (Task 3), or the dev server is serving a stale file (re-run Step 1).
- `expandedRightAfterHover:false` → `initKvOverviewExpand` never registered its `mouseenter` listeners — check `data.overviewExpandErr` for a stack trace, and confirm `cards.length===3` (the `!cardsWrap||cards.length!==3||...` guard silently no-ops if the card count doesn't match).
- `rectAfterFlip` not full-viewport → the FLIP `requestAnimationFrame` target values didn't apply, or `--virtual-time-budget` didn't let the 500ms `setTimeout` in the probe elapse before reading the rect — confirm the probe's own `setTimeout(...,500)` is comfortably longer than `FLIP_MS` (450) in the script.
- `residencesExpandedAfterNextClick:false` or `golfStillExpandedAfterNextClick:true` → `switchTo` isn't being reached from the arrow click handler, or the `current`/`animating` guards are blocking it — check `prevBtn`/`nextBtn` were correctly queried inside `#kv-overview` (Task 3's markup places them as the first two children of `.kv-overview__cards`, so `section.querySelector('.kv-overview__arrow--prev')` must resolve to them, not `null`).
- `anyExpandedAfterDocLeave:true` or `lightboxOpenAfterDocLeave:true` → the `document.addEventListener('mouseleave', ...)` in Task 4 isn't registered, or `collapseToGrid`'s own `animating`/`current===-1` guard is rejecting the call — check the probe's `document.dispatchEvent(new MouseEvent('mouseleave',...))` fires after the arrow-click sequence, not before (ordering matters: `collapseToGrid` uses `current`, which `switchTo` must have already updated to `2`).
- Any `data.overviewExpandErr` present → read the stack trace; it points at the exact line in Task 4's script that threw.

Fix inline, restart the server, re-run Step 2 until all expectations pass.

- [ ] **Step 4: Manually confirm the FLIP/crossfade animation looks right (probe only checks end-state, not the animation itself)**

With the server running from Step 1, open `http://localhost:5000/` in a real browser (not headless), scroll to the "01 — Overview" section, and hover each of the three cards in turn:
- Confirm each grows smoothly to fill the screen (not an instant jump).
- Confirm the golf card's photo slideshow and the location card's video still play while expanded.
- Confirm the arrows crossfade between cards without a flash of the underlying grid.
- Confirm moving the cursor off the browser window (or pressing Escape) shrinks the card back down to its grid slot.
- Confirm on a touch device / with browser dev-tools device emulation (no hover), the cards behave exactly as before this change (static grid, tap does nothing extra).

This step has no machine-checkable pass/fail criterion — it exists because the probe only samples discrete end-states (`is-expanded` present/absent, computed rects) and cannot observe whether the CSS transition itself is smooth or janky.

- [ ] **Step 5: Clean up probe output file**

```bash
rm -f probe-expand.html
```
(Scratch verification artifact, not a project file — don't commit it.)

---

## Self-review notes

- **Spec coverage:** Open/FLIP-grow behavior (spec "Trigger & animation") → Task 4's `expandFromGrid`. Arrow crossfade swap + wraparound (spec "Arrows") → Task 4's `switchTo`, arrow click handlers, Task 3's markup. Close via viewport-leave + Escape + reverse-FLIP (spec "Close") → Task 4's `collapseToGrid`, `document` `mouseleave`/`keydown` listeners. Video/slideshow sync via synthetic events (spec "Video/slideshow integration") → Task 4's `fireSynthetic` calls in `switchTo` and `collapseToGrid` (native events already cover the initial real hover). CSS for expanded state and arrows (spec "Structure & styling") → Task 2. Both-HTML-files sync (spec "Mechanics / files touched") → Task 3 Steps 1-2, Task 4 Steps 1-2. Desktop-only gating (spec "Scope") → Task 4's `matchMedia` check. Verification plan (spec "Verification") → Task 1 + Task 5. No spec item left uncovered.
- **Placeholder scan:** no TBD/TODO; every step has literal code or literal commands with concrete expected output.
- **Consistency:** `kv-overview-lightbox-open` (body class), `is-expanded` (card class), `kv-overview__arrow`/`--prev`/`--next` (button classes), `initKvOverviewExpand`/`kvExpandMo` (function/observer names), `expandCards`/`prevArrow`/`nextArrow` (probe variable names) match exactly across Task 1 (probe), Task 2 (CSS), Task 3 (HTML), and Task 4 (JS).
- **Known accepted quirk (not fixed here, out of scope per spec):** because the arrow buttons sit at a higher `z-index` than the expanded card and overlap it, moving the cursor onto an arrow fires a real `mouseleave` on the card underneath — for the Location/Golf cards this causes their existing hover-only video/slideshow scripts to pause/reset while the arrow is being hovered (the fullscreen-expand state itself is unaffected, since it only listens for `document`-level `mouseleave`, not the card's). Solving this would require rerouting arrow hit-testing (e.g. `pointer-events` tricks) — deferred as unnecessary complexity for a cosmetic hiccup, per spec's YAGNI framing.
