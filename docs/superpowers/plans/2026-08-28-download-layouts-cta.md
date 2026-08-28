# Download Layouts CTA + Lead Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the overview section's "3 & 4 Bed Residences & Duplexes" card button into a "Download the Layouts" CTA that opens a modal lead form (Name/Phone/Email), which on submit opens a pre-filled `mailto:` to `sales@kalpataru.com`.

**Architecture:** This site has no test framework — verification is a headless-Chrome `?probe=1` route in `local-server.js` that reports computed state via `document.title` (see `CLAUDE.md`). Every task below substitutes "run the probe, check the JSON" for "run the test suite." The `kv-overview` card markup and a new `kv-layouts-modal` section both live in the runtime JS injector (`KV_SECTIONS` array, inline `<script>`), present in two files — `index.html` and `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` — which must be edited identically. No React/JS-bundle patch is needed: these are new, non-hydration-owned nodes, same mechanism as every other `kv-*` section (see `ARCHITECTURE.md`, "New sections: React strips extra static siblings on hydration").

**Tech Stack:** Plain HTML/CSS/JS (no build step), Node's `http` module (`local-server.js`), headless Chrome for verification.

---

### Task 1: Extend the probe script to check the modal + trigger + mailto composition

**Files:**
- Modify: `local-server.js:389-392` (insert new block right after the `locationVideo` else-branch closes, before `setTimeout(finishProbe,50);`)

Current text at that location:
```js
      } else {
        out.locationVideo={cardFound:false};
      }
      setTimeout(finishProbe,50);
      }
```

- [ ] **Step 1: Confirm the anchor text is still present**

Run: view `local-server.js` lines 385-395. Confirm the `} else { out.locationVideo={cardFound:false}; }` block is immediately followed by `setTimeout(finishProbe,50);`. If line numbers drifted, locate this block by content instead of number.

- [ ] **Step 2: Insert the layouts-modal probe block between those two lines**

```js
      } else {
        out.locationVideo={cardFound:false};
      }
      var layoutsModal=document.getElementById('kv-layouts-modal');
      var layoutsTrigger=document.querySelector('.kv-layouts-trigger');
      out.layoutsModal={
        modalFound:!!layoutsModal,
        openOnLoad:layoutsModal?layoutsModal.classList.contains('is-open'):null,
        triggerFound:!!layoutsTrigger,
        triggerText:layoutsTrigger?layoutsTrigger.textContent.trim():null,
        triggerHref:layoutsTrigger?layoutsTrigger.getAttribute('href'):null
      };
      if(layoutsModal&&layoutsTrigger){
        var capturedHref=null;
        window.__kvMailtoOverride=function(href){capturedHref=href;};
        layoutsTrigger.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
        out.layoutsModal.openAfterClick=layoutsModal.classList.contains('is-open');
        var active=document.activeElement;
        out.layoutsModal.focusedFieldName=active?active.getAttribute('name'):null;
        var form=document.getElementById('kv-layouts-form');
        out.layoutsModal.formFound=!!form;
        if(form){
          form.querySelector('[name="name"]').value='Test User';
          form.querySelector('[name="phone"]').value='9999999999';
          form.querySelector('[name="email"]').value='test@example.com';
          form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
        }
        out.layoutsModal.mailtoHref=capturedHref;
        out.layoutsModal.closedAfterSubmit=!layoutsModal.classList.contains('is-open');
        layoutsModal.classList.add('is-open');
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        out.layoutsModal.closedAfterEscape=!layoutsModal.classList.contains('is-open');
      }
      setTimeout(finishProbe,50);
      }
```

- [ ] **Step 3: Syntax-check the file**

Run: `node --check local-server.js`
Expected: no output (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add local-server.js
git commit -m "feat: extend dev probe to check download-layouts modal"
```

---

### Task 2: Add the modal CSS

**Files:**
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css` (append after the `kv-video` block at end of file)

The file currently ends with:
```css
@media(min-width:768px){
  .kv-video{padding:15rem 0}
  .kv-video__grid{grid-template-columns:auto 97.6rem;margin:0 0 10rem}
  .kv-video__text{font-size:5.6rem;letter-spacing:-.03em}
  .kv-video__preview{margin:0;aspect-ratio:auto;height:97.6rem}
}
```

- [ ] **Step 1: Append the `kv-modal` rules after that block**

```css

/* --- kv-layouts-modal: lead-capture modal opened from the overview
   "Download the Layouts" CTA --- */
.kv-modal{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s ease}
.kv-modal.is-open{opacity:1;visibility:visible}
.kv-modal__backdrop{position:absolute;inset:0;background:rgba(10,11,11,.6)}
.kv-modal__dialog{position:relative;width:100%;max-width:30rem;background:#fff;border-radius:1rem;padding:2.5rem 2rem 2rem;box-shadow:0 1.5rem 4rem rgba(0,0,0,.35)}
.kv-modal__close{position:absolute;top:1rem;right:1rem;width:2.25rem;height:2.25rem;border:none;background:transparent;font-size:1.5rem;line-height:1;color:#151717;cursor:pointer}
.kv-modal__dialog h3{font-size:1.5rem;font-weight:700;letter-spacing:-0.01em;color:#151717;margin:0 0 .75rem;font-family:"Instrument Sans","Instrument Sans Fallback"}
.kv-modal__body{font-size:1rem;line-height:1.5;color:rgba(21,23,23,.75);margin:0 0 1.5rem}
.kv-modal__form{display:flex;flex-direction:column;gap:1rem}
.kv-modal__field{display:flex;flex-direction:column;gap:.4rem;font-size:.85rem;color:#151717}
.kv-modal__field input{font:inherit;font-size:1rem;padding:.75rem .9rem;border:1px solid rgba(21,23,23,.2);border-radius:.5rem;background:#fff;color:#151717}
.kv-modal__field input:focus{outline:2px solid #151717;outline-offset:1px}
.kv-modal__form .button_button-round__TFjlU{margin-top:.5rem;align-self:flex-start}
```

- [ ] **Step 2: Commit**

```bash
git add "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-brand.css"
git commit -m "feat: add download-layouts modal styles"
```

---

### Task 3: Retarget the residence card's button and add the modal markup, in both HTML files

**Files:**
- Modify: `index.html` (inside the `KV_SECTIONS` array's `kv-overview` entry, and the `kv-cta` entry)
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` (same two entries, identical text at these locations)

**Step A — retarget the residence card's "Learn More" button.**

The third overview card currently contains (inside the `kv-overview` entry's `html` template literal):
```html
<h3>3 &amp; 4 Bed Residences &amp; Duplexes</h3><a class="button_button-round__TFjlU button_color-secondary__FZDOG button_inversed__slQcI" href="#kv-amenities"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Learn More">Learn More</span></div>
```

- [ ] **Step 1: In `index.html`, replace that exact text with:**

```html
<h3>3 &amp; 4 Bed Residences &amp; Duplexes</h3><a class="button_button-round__TFjlU button_color-secondary__FZDOG button_inversed__slQcI kv-layouts-trigger" href="#kv-layouts-modal"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Download the Layouts">Download the Layouts</span></div>
```

- [ ] **Step 2: Apply the identical replacement in `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`** (same old text, same new text — this stretch of the `kv-overview` entry is byte-identical between the two files).

**Step B — add the `kv-layouts-modal` entry to `KV_SECTIONS`.**

The `kv-cta` entry currently ends, immediately followed by the `kv-rera` entry:
```html
href="tel:+912230643065"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Book Now">Book Now</span></div></div></a></div></div></section>`},{id:'kv-rera'
```

- [ ] **Step 3: In `index.html`, replace that exact text with (inserting a new `kv-layouts-modal` entry between `kv-cta` and `kv-rera`):**

```html
href="tel:+912230643065"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Book Now">Book Now</span></div></div></a></div></div></section>`},{id:'kv-layouts-modal',anchor:'.why-us_root__aGsFp',pos:'beforebegin',html:`<div class="kv-modal" id="kv-layouts-modal"><div class="kv-modal__backdrop"></div><div class="kv-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="kv-layouts-modal-title"><button type="button" class="kv-modal__close" aria-label="Close">&times;</button><h3 id="kv-layouts-modal-title">Get the Layouts</h3><p class="kv-modal__body">Share your details and we'll send you the floor plans for Kalpataru Vista's 3 &amp; 4 bed residences and duplexes.</p><form class="kv-modal__form" id="kv-layouts-form"><label class="kv-modal__field"><span>Name</span><input type="text" name="name" required></label><label class="kv-modal__field"><span>Phone</span><input type="tel" name="phone" required></label><label class="kv-modal__field"><span>Email</span><input type="email" name="email" required></label><button type="submit" class="button_button-round__TFjlU button_color-primary__JJ7Hh"><div class="button_content__6Zh3n"><div class="button_button-round-text__IEwW5"><span data-text="Send">Send</span></div></div></button></form></div></div>`},{id:'kv-rera'
```

- [ ] **Step 4: Apply the identical replacement in `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`.**

- [ ] **Step 5: Syntax-check both files' inline `KV_SECTIONS` script parses**

Run:
```bash
node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>\(function\(\)\{var KV_SECTIONS[\s\S]*?\}\)\(\);<\/script>/)[0].slice(8,-9))"
node -e "new Function(require('fs').readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8').match(/<script>\(function\(\)\{var KV_SECTIONS[\s\S]*?\}\)\(\);<\/script>/)[0].slice(8,-9))"
```
Expected: no output, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat: retarget residence card CTA to download-layouts modal"
```

---

### Task 4: Add the modal open/close/submit script to both HTML files

**Files:**
- Modify: `index.html` (immediately after the `KV_SECTIONS` script's closing `</script>` tag, before the amenities-animation `<script>` block)
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` (same location)

The `KV_SECTIONS` script currently ends with, immediately followed by the amenities script:
```html
mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},8000);})();</script><script>(function(){
  function initKvAmenitiesAnimation(){
```

- [ ] **Step 1: In `index.html`, replace that exact text with (inserting a new script block between the two):**

```html
mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},8000);})();</script><script>(function(){
  function openKvModal(m){m.classList.add('is-open');var f=m.querySelector('input,textarea');if(f)f.focus();}
  function closeKvModal(m){m.classList.remove('is-open');}
  document.addEventListener('click',function(e){
    var trigger=e.target.closest('.kv-layouts-trigger');
    if(trigger){e.preventDefault();var m=document.getElementById('kv-layouts-modal');if(m)openKvModal(m);return;}
    var closeBtn=e.target.closest('.kv-modal__close');
    var backdrop=e.target.closest('.kv-modal__backdrop');
    if(closeBtn||backdrop){var m2=e.target.closest('.kv-modal');if(m2)closeKvModal(m2);}
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){var open=document.querySelector('.kv-modal.is-open');if(open)closeKvModal(open);}
  });
  document.addEventListener('submit',function(e){
    var form=e.target.closest('#kv-layouts-form');
    if(!form)return;
    e.preventDefault();
    var name=form.querySelector('[name="name"]').value;
    var phone=form.querySelector('[name="phone"]').value;
    var email=form.querySelector('[name="email"]').value;
    var subject=encodeURIComponent('Layout Download Request — Kalpataru Vista');
    var body=encodeURIComponent('Name: '+name+'\nPhone: '+phone+'\nEmail: '+email);
    var href='mailto:sales@kalpataru.com?subject='+subject+'&body='+body;
    if(window.__kvMailtoOverride){window.__kvMailtoOverride(href);}else{window.location.href=href;}
    var m=form.closest('.kv-modal');
    if(m)closeKvModal(m);
    form.reset();
  });
})();</script><script>(function(){
  function initKvAmenitiesAnimation(){
```

- [ ] **Step 2: Apply the identical replacement in `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`.**

- [ ] **Step 3: Syntax-check both files' new script parses**

Run:
```bash
node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/function openKvModal[\s\S]*?form\.reset\(\);\s*\}\);\s*\}\)\(\);/)[0])"
node -e "new Function(require('fs').readFileSync('FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html','utf8').match(/function openKvModal[\s\S]*?form\.reset\(\);\s*\}\);\s*\}\)\(\);/)[0])"
```
Expected: no output, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat: wire up download-layouts modal open/close/submit"
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
  "http://localhost:5000/?probe=1&scrollY=600" > probe-layouts.html
node -e "
const fs=require('fs');
const html=fs.readFileSync('probe-layouts.html','utf8');
const m=html.match(/<title>PROBE::([\s\S]*?)<\/title>/);
const data=JSON.parse(m[1]);
console.log(JSON.stringify(data.layoutsModal,null,2));
console.log('overview card 3 button:', data.overview.cards[2]);
"
```

Expected `data.layoutsModal`:
- `modalFound:true`, `openOnLoad:false`
- `triggerFound:true`, `triggerText:'Download the Layouts'`, `triggerHref:'#kv-layouts-modal'`
- `openAfterClick:true`
- `focusedFieldName:'name'`
- `formFound:true`
- `mailtoHref` starts with `mailto:sales@kalpataru.com?subject=Layout%20Download%20Request` and contains `Test%20User`, `9999999999`, `test%40example.com` (URI-encoded)
- `closedAfterSubmit:true`
- `closedAfterEscape:true`

Expected `data.overview.cards[2]`: `heading:'3 & 4 Bed Residences & Duplexes'`, `hasButton:true`, `buttonHref:'#kv-layouts-modal'`.

- [ ] **Step 3: If any expectation fails, diagnose and fix**

Common failure modes and where to look:
- `modalFound:false` → the `kv-layouts-modal` entry wasn't inserted correctly into `KV_SECTIONS` in `index.html` (Task 3 Step 3), or the dev server is serving a stale file (re-run Step 1).
- `triggerFound:false` or wrong `triggerText`/`triggerHref` → the button-retarget edit (Task 3 Step 1) didn't land, or landed on the wrong card.
- `openAfterClick:false` → the click-delegation script (Task 4) wasn't inserted, or a JS error is thrown before it registers — check `data.amenitiesAnim.jsErrors` in the same probe output for a stack trace.
- `mailtoHref:null` → either the click didn't open the modal (fix that first) or the form submit handler isn't matching `#kv-layouts-form` — check the form's `id` in the modal markup (Task 3 Step 3).
- `closedAfterEscape:false` → the `keydown` listener in Task 4 isn't registered, or `.kv-modal.is-open` selector mismatch.

Fix inline, restart the server, re-run Step 2 until all expectations pass.

- [ ] **Step 4: Clean up probe output files**

```bash
rm -f probe-layouts.html
```
(Scratch verification artifact, not a project file — don't commit it.)

---

## Self-review notes

- **Spec coverage:** button copy/placement (spec "Content & copy") → Task 3 Step A. Modal heading/body/fields/labels (spec "Content & copy" + "Structure & mechanics") → Task 3 Step B. `mailto:` composition (spec "Submission mechanism") → Task 4. Open/close/backdrop/Escape behavior (spec "Structure & mechanics") → Task 4. CSS/styling (spec "Structure & mechanics") → Task 2. Both-HTML-files sync (spec "Structure & mechanics") → Task 3 Steps 2/4, Task 4 Step 2. Verification plan (spec "Verification") → Task 1 + Task 5. No spec item left uncovered.
- **Placeholder scan:** no TBD/TODO; every step has literal code or literal commands with concrete expected output.
- **Consistency:** `kv-layouts-trigger` (button class), `kv-layouts-modal` (modal id), `kv-layouts-form` (form id), `kv-modal`/`kv-modal__backdrop`/`kv-modal__dialog`/`kv-modal__close`/`kv-modal__body`/`kv-modal__form`/`kv-modal__field` (CSS classes), and `window.__kvMailtoOverride` (probe hook) match exactly across Task 1 (probe), Task 2 (CSS), Task 3 (HTML), and Task 4 (JS).
