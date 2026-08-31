# Pricing & AI Proposal Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone `pricing.html` proposal page on the Kalpataru Vista site, reachable from a new "Pricing" item in the header, burger menu and footer.

**Architecture:** The page is hand-authored static HTML with its own stylesheet — no React, no bundle chunk, no GSAP — so it is immune to this repo's hydration-overwrite rule. The only invasive change is the nav, which is React-owned: two JS chunks hold the nav arrays and three render sites use the Next.js `Link` component, which would intercept a cross-page href. Each render site gets a plain-anchor fallback for non-`#` hrefs, and both HTML snapshots are updated to match.

**Tech Stack:** Static HTML/CSS. Fraunces (Google Fonts, already linked) and Instrument Sans (local woff2). Verification is headless Chrome against `local-server.js`'s `?probe=1` route — this repo has no unit-test framework, so the probe *is* the test harness. Every task below follows the same red/green cycle against it.

**Spec:** `docs/superpowers/specs/2026-08-31-pricing-page-design.md`. All prices, copy, citations and section headers live there. **Never invent a number.** Read the spec.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `local-server.js` | Modify | Probe harness: add footer-nav reporting and a `/pricing.html?probe=1` route |
| `FIND Real Estate ..._files/8314-539f3dc843f460bb.js` | Modify | `B` nav array + header and burger render sites |
| `FIND Real Estate ..._files/1324-f76849f4515b2e93.js` | Modify | `M` nav array + footer render site |
| `index.html` | Modify | First-paint snapshot: three nav locations |
| `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html` | Modify | Same, kept in sync |
| `FIND Real Estate ..._files/kalpataru-pricing.css` | Create | All styling for the proposal page. Standalone — never appended to `kalpataru-brand.css` |
| `pricing.html` | Create | The ten-section proposal page |

Throughout this plan `$F` means the directory `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files`.

## Working Conventions

Run the server before probing, and kill any previous instance first — it does not hot-reload and it holds port 5000:

```bash
taskkill //F //IM node.exe 2>/dev/null; node local-server.js &
```

Probe command (from repo root; write output under the session scratchpad, never `/tmp`):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu \
  --dump-dom --virtual-time-budget=10000 --window-size=1900,900 \
  "http://localhost:5000/?probe=1&scrollY=0" > out.html
```

Then parse the `<title>PROBE::{...}</title>` JSON out of `out.html` with Node — not the Read tool.

**Reading the source is not verification.** Every claim that a task is done cites probe output.

---

### Task 1: Extend the probe harness

**Files:**
- Modify: `local-server.js` (probe route around line 88-120, output builder around line 115)

- [ ] **Step 1: Add footer-nav reporting to the probe output**

The probe already reports `out.navItems` (header) and `out.burgerItems` (burger menu). Find the line that sets `out.burgerItems` and add immediately after it:

```js
      var footerItems=Array.prototype.map.call(document.querySelectorAll('.footer_nav-link__LFUNG'),function(a){return {text:a.textContent,href:a.getAttribute('href'),tag:a.tagName};});
      out.footerItems=footerItems;
      out.pageErrors=(window.__kvErrs||[]).concat(window.__jsErrors||[]);
```

The `pageErrors` key is new. Page errors are currently only reachable nested inside `out.amenitiesAnim.jsErrors` and one section's `jsErrors`; a top-level key is what later tasks assert against.

- [ ] **Step 2: Report the tag name on header and burger items too**

The whole point is proving these are real anchors and not router-intercepted `Link`s. Find the existing `navItems` and `burgerItems` mapping functions and add `tag:a.tagName` to each returned object, alongside the existing `text` and `href` keys.

- [ ] **Step 3: Add a probe route for pricing.html**

The existing route is gated on `pathname === "/"`. Add a second route immediately after it, before the `fs.stat` fallthrough:

```js
  if (pathname === "/pricing.html" && url.parse(reqUrl, true).query.probe) {
    const html = fs.readFileSync(path.join(ROOT, "pricing.html"), "utf8");
    const probe = `<script>
      setTimeout(function(){
        var out={};
        out.headings=Array.prototype.map.call(document.querySelectorAll('h1,h2'),function(h){return h.textContent.trim().slice(0,80);});
        out.bodyScrollW=document.documentElement.scrollWidth;
        out.viewportW=document.documentElement.clientWidth;
        out.hasHorizontalScroll=document.documentElement.scrollWidth>document.documentElement.clientWidth+1;
        out.brokenImages=Array.prototype.map.call(document.images,function(i){return (i.complete&&i.naturalWidth>0)?null:(i.getAttribute('src')||'?');}).filter(Boolean);
        out.imageCount=document.images.length;
        document.title='PROBE::'+JSON.stringify(out);
      },2000)</script></body>`;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html.replace("</body>", probe));
    return;
  }
```

- [ ] **Step 4: Verify the server still starts and the existing probe still works**

```bash
taskkill //F //IM node.exe 2>/dev/null; node local-server.js &
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/?probe=1&scrollY=0" > out.html
node -e "const m=require('fs').readFileSync('out.html','utf8').match(/PROBE::(\{.*?\})<\/title>/s);const o=JSON.parse(m[1]);console.log(JSON.stringify({nav:o.navItems,burger:o.burgerItems,footer:o.footerItems},null,1));"
```

Expected: `nav` and `burger` each list five items — Overview, Amenities, Residences, Site Layout, Why Vista — each with `tag:"A"`. `footer` lists four. **No Pricing item yet.** That absence is the failing test the next task fixes.

- [ ] **Step 5: Commit**

```bash
git add local-server.js
git commit -m "test(probe): report footer nav, element tags, and pricing page state"
```

---

### Task 2: Header and burger nav — the 8314 chunk

**Files:**
- Modify: `$F/8314-539f3dc843f460bb.js`

Read the spec's "Nav integration" section before starting.

- [ ] **Step 1: Back up the chunk if no backup exists**

```bash
cd "$F"; [ -f 8314-539f3dc843f460bb.js.orig ] || cp 8314-539f3dc843f460bb.js 8314-539f3dc843f460bb.js.orig
```

- [ ] **Step 2: Add the Pricing entry to the `B` array**

Find this exact string:

```
{title:"Why Vista",href:"#kv-why"}]
```

Replace with:

```
{title:"Why Vista",href:"#kv-why"},{title:"Pricing",href:"pricing.html"}]
```

- [ ] **Step 3: Give the header render site an anchor fallback**

The header nav maps `B` and renders each item through `c()`, the Next.js `Link`. A `pricing.html` href passed to `Link` is intercepted by the client router and will not navigate in this static capture. Find this exact string:

```
d()["nav-item"],children:(0,r.jsx)(c(),{href:e.href,children:(0,r.jsx)("span",{"data-text":e.title
```

Replace with:

```
d()["nav-item"],children:(0,r.jsx)(e.href.startsWith("#")?c():"a",{href:e.href,children:(0,r.jsx)("span",{"data-text":e.title
```

- [ ] **Step 4: Give the burger render site an anchor fallback**

Same array, different render site. Find this exact string:

```
w()["nav-item"],children:(0,r.jsx)(c(),{href:e.href,children:e.title})
```

Replace with:

```
w()["nav-item"],children:(0,r.jsx)(e.href.startsWith("#")?c():"a",{href:e.href,children:e.title})
```

Note: the burger menu's *sub*-item render also contains `(0,r.jsx)(c(),{href:e.href,children:e.title})`, but it is preceded by `w()["nav-sub-item"]`. Do not touch it — the string above is unique because of the `w()["nav-item"]` prefix.

- [ ] **Step 5: Syntax-check**

```bash
node --check "$F/8314-539f3dc843f460bb.js"
```

Expected: no output, exit 0.

- [ ] **Step 6: Probe — header and burger now carry Pricing as a real anchor**

Restart the server, re-run the probe command from Task 1 Step 4.

Expected: `nav` and `burger` each now list **six** items, the sixth being `{text:"Pricing", href:"pricing.html", tag:"A"}`. If `tag` is not `"A"`, the fallback did not take — recheck Steps 3 and 4.

- [ ] **Step 7: Commit**

```bash
git add "$F/8314-539f3dc843f460bb.js"
git commit -m "feat(nav): add Pricing to header and burger menu"
```

---

### Task 3: Footer nav — the 1324 chunk

**Files:**
- Modify: `$F/1324-f76849f4515b2e93.js`

- [ ] **Step 1: Back up the chunk if no backup exists**

```bash
cd "$F"; [ -f 1324-f76849f4515b2e93.js.orig ] || cp 1324-f76849f4515b2e93.js 1324-f76849f4515b2e93.js.orig
```

- [ ] **Step 2: Add the Pricing entry to the `M` array**

The footer array uses `label`, not `title`. Find this exact string:

```
{label:"Why Vista",href:"#kv-why"}]
```

Replace with:

```
{label:"Why Vista",href:"#kv-why"},{label:"Pricing",href:"pricing.html"}]
```

- [ ] **Step 3: Give the footer render site an anchor fallback**

Find this exact string:

```
M.map(e=>(0,o.jsx)(g(),{className:i()["nav-link"],href:e.href,
```

Replace with:

```
M.map(e=>(0,o.jsx)(e.href.startsWith("#")?g():"a",{className:i()["nav-link"],href:e.href,
```

- [ ] **Step 4: Syntax-check**

```bash
node --check "$F/1324-f76849f4515b2e93.js"
```

Expected: no output, exit 0.

- [ ] **Step 5: Probe — footer now carries Pricing as a real anchor**

Restart the server, re-run the probe.

Expected: `footer` now lists **five** items, the fifth `{text:"Pricing", href:"pricing.html", tag:"A"}`.

- [ ] **Step 6: Commit**

```bash
git add "$F/1324-f76849f4515b2e93.js"
git commit -m "feat(nav): add Pricing to footer nav"
```

---

### Task 4: Mirror the nav into both HTML snapshots

The HTML files are the server-rendered snapshot. Without this, "Pricing" flickers in only after hydration.

**Files:**
- Modify: `index.html`
- Modify: `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html`

The two files are byte-identical copies. Make every edit in both.

- [ ] **Step 1: Add the header nav item**

Find this exact string (it appears once per file):

```
<div class="header_nav-item__Wn05d"><a href="#kv-why"><span data-text="Why Vista">Why Vista</span></a></div>
```

Append immediately after it:

```
<div class="header_nav-item__Wn05d"><a href="pricing.html"><span data-text="Pricing">Pricing</span></a></div>
```

- [ ] **Step 2: Add the burger menu item**

Locate the last `burger-menu_nav-item__mCA9u` div — the one whose `aria-label` is `Why Vista`. Copy that entire div, change both `aria-label` occurrences and every visible text node from `Why Vista` to `Pricing`, and change the `href` from `#kv-why` to `pricing.html`. The burger item contains nested per-character animation spans; preserving the exact inner structure matters less than matching the wrapper, because React replaces this subtree on hydration anyway — but keep it well-formed.

- [ ] **Step 3: Add the footer nav link**

Find this exact string:

```
<a class="footer_nav-link__LFUNG" href="#kv-why"><span data-text="Why Vista">Why Vista</span></a>
```

Append immediately after it:

```
<a class="footer_nav-link__LFUNG" href="pricing.html"><span data-text="Pricing">Pricing</span></a>
```

- [ ] **Step 4: Confirm the two HTML files are still identical**

```bash
diff -q index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html" && echo IDENTICAL
```

Expected: `IDENTICAL`.

- [ ] **Step 5: Probe — first paint and post-hydration agree**

Re-run the probe. Expected: unchanged from Task 3 — six header items, six burger items, five footer items, all `tag:"A"`. A regression here means the HTML edit broke markup React then choked on; check `pageErrors` in the probe output, which must be empty.

- [ ] **Step 6: Commit**

```bash
git add index.html "FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate.html"
git commit -m "feat(nav): mirror Pricing link into both HTML snapshots"
```

---

### Task 5: The stylesheet

**Files:**
- Create: `$F/kalpataru-pricing.css`

Read the spec's "Visual design" section first. This file is standalone: nothing in it may affect the main site, and it is never appended to `kalpataru-brand.css`.

- [ ] **Step 1: Write the token block and base**

Start the file with exactly these tokens, then build everything else from them — no raw hex anywhere below this block:

```css
:root{
  --kv-ink:#151717;
  --kv-ink-deep:#2c1512;
  --kv-brown:#855c3a;
  --kv-tan:#c89b6e;
  --kv-cream:#FBF1EA;
  --kv-cream-deep:#f1f1ef;
  --kv-rust:#9d3a2c;
  --kv-serif:"Fraunces",Georgia,"Times New Roman",serif;
  --kv-sans:"Instrument Sans KV","Instrument Sans",-apple-system,"Segoe UI",sans-serif;
  --kv-pad:clamp(20px,5vw,72px);
  --kv-measure:68ch;
}
```

- [ ] **Step 2: Declare the local Instrument Sans face**

The main site already declares `Instrument Sans KV`, but this page does not load the main stylesheet. Declare it here against the woff2 files that already sit in the same directory:

```css
@font-face{
  font-family:"Instrument Sans KV";
  src:url("instrument-sans-latin.woff2") format("woff2");
  font-weight:400 700;
  font-display:swap;
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+20B9,U+2122;
}
```

The `U+20B9` range matters — that is the rupee sign, which this page is full of.

- [ ] **Step 3: Build the section system**

Write, in order: a page base (cream ground, ink text, `--kv-sans` body, no body horizontal overflow); the fixed top-left back-link; the full-bleed cover with a dark scrim over the photo; the glance strip as a responsive grid; a generic `section` rhythm with a tan hairline divider and `h2` in `--kv-serif` weight 300; a table wrapper that gets `overflow-x:auto` so wide tables scroll inside themselves rather than pushing the page; tier cards; the footnote/citation styles; and the closing CTA.

Every table on this page must sit inside that scrolling wrapper. Horizontal body scroll is a hard failure in the final task.

- [ ] **Step 4: Commit**

```bash
git add "$F/kalpataru-pricing.css"
git commit -m "feat(pricing): stylesheet for the proposal page"
```

---

### Task 6: Page shell, cover, glance strip, and what is already built

**Files:**
- Create: `pricing.html`

Read spec sections "Page structure" items 1-3 and "Visual design". Copy comes from the spec verbatim where the spec gives it.

- [ ] **Step 1: Write the document head**

Include: `<meta name="robots" content="noindex, nofollow">`, the viewport meta, a `<title>` of `Kalpataru Vista — Website & AI Investment Proposal`, `theme-color` of `#FBF1EA`, the two Google Fonts preconnects and the existing Fraunces stylesheet link copied from `index.html`, and a link to `FIND Real Estate _ Purchase, Rent or Sell Commercial and Residential Real Estate_files/kalpataru-pricing.css`. URL-encode the spaces in that path as `%20`.

- [ ] **Step 2: Write the back-link and cover**

Back-link: a fixed anchor to `index.html` reading "Kalpataru Vista" with a left-chevron SVG.

Cover: full-bleed `kv-why-landscape.jpg` from the `_files` directory under a scrim, carrying the eyebrow "Website & AI Investment Proposal", `<h1>Kalpataru Vista</h1>`, the subhead, a "View the live site" link back to `index.html`, and the contact bar — prepared by Dayam Insights, +91 78776 40693 tagged IN, +351 913 212 367 tagged PT, dayaminsights@gmail.com. Phone numbers are `tel:` links, the address a `mailto:`.

- [ ] **Step 3: Write the glance strip**

Four items with the labels Already live / Next to build / Priced by / Optional, each with a one-line value drawn from the spec.

- [ ] **Step 4: Write section 3**

`<h2>The site you've already seen — what's actually in it</h2>` followed by the feature breakdown of the built homepage: the scroll-scrubbed hero, the overview cards, the amenities panels, the unit-layout section, the closing CTA. Describe what is genuinely there — do not invent features the site does not have.

- [ ] **Step 5: Probe**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=6000 --window-size=1440,900 "http://localhost:5000/pricing.html?probe=1" > outp.html
node -e "const m=require('fs').readFileSync('outp.html','utf8').match(/PROBE::(\{.*?\})<\/title>/s);console.log(m[1]);"
```

Expected: `headings` contains "Kalpataru Vista" and "The site you've already seen — what's actually in it"; `brokenImages` is `[]`; `hasHorizontalScroll` is `false`.

If the cover crop reads wrong when you inspect it, swap the image to `bg.jpg` per the spec.

- [ ] **Step 6: Commit**

```bash
git add pricing.html
git commit -m "feat(pricing): cover, glance strip, and what is already built"
```

---

### Task 7: Market positioning and business impact

**Files:**
- Modify: `pricing.html`

Read spec sections "Market baselines" and "Business impact". **Every figure on this page must match the spec exactly and must carry a citation.**

- [ ] **Step 1: Write the market section**

`<h2>Where this sits in the Gurgaon market</h2>`. Render the spec's eight-row baseline table inside the scrolling table wrapper, each row's source as a real link opening in a new tab with `rel="noopener noreferrer"`. Follow it with a three-column positioning comparison — template shop, Dayam Insights, full-service agency — across price, timeline, custom animation, AI, and code ownership.

State the pricing method in one plain sentence: these are market baselines and the quoted prices are those baselines times 1.2.

- [ ] **Step 2: Write the business impact section**

`<h2>Tentative business impact</h2>`. Render the spec's eight cited claims as benchmark cards. Each figure carries a superscript footnote number; the numbers resolve to an ordered source list at the foot of the section, each entry a link.

Keep the framing tentative — these are published industry benchmarks, not promises about this project. Say so in a line of body copy.

- [ ] **Step 3: Probe**

Re-run the pricing probe. Expected: `headings` now contains "Where this sits in the Gurgaon market" and "Tentative business impact"; `hasHorizontalScroll` is still `false` — the baseline table is the widest thing on the page and is the most likely thing to break this.

- [ ] **Step 4: Cross-check every number against the spec**

```bash
grep -oE '[0-9][0-9,]*|[0-9]+x|[0-9]+%' pricing.html | sort -u
```

Read the output and confirm each figure appears in the spec. Any number on the page that is not in the spec is a defect — fix it rather than justifying it.

- [ ] **Step 5: Commit**

```bash
git add pricing.html
git commit -m "feat(pricing): market positioning and cited business impact"
```

---

### Task 8: What is included, and good to know

**Files:**
- Modify: `pricing.html`

Read spec sections "Included free", "Payment terms", and the tier contents.

- [ ] **Step 1: Write the inclusions checklist**

`<h2>Everything in the price below</h2>` followed by a checklist of what every tier carries regardless of level: the build itself, responsive QA across mobile, tablet and desktop, basic SEO and analytics, the enquiry form with WhatsApp handoff, launch support, and the free hosting and management window.

- [ ] **Step 2: Write the good-to-know section**

`<h2>Good to know</h2>` covering, from the spec: 6 months free hosting with VPS, SSL, CDN and daily backups; 3 months free hands-on management; Rs 4,000 to Rs 6,000 per month after that, month to month, no lock-in; revision rounds by tier; who owns the code; and the payment schedule — 40/30/30 on the build, 50/50 on AI setup, retainer monthly in advance.

- [ ] **Step 3: Probe**

Re-run the pricing probe. Expected: both new headings present, `hasHorizontalScroll` false.

- [ ] **Step 4: Commit**

```bash
git add pricing.html
git commit -m "feat(pricing): inclusions and terms"
```

---

### Task 9: The three prices

**Files:**
- Modify: `pricing.html`

Read the spec's "Final prices" and "Tier contents" sections. These numbers are the point of the page. Transcribe, do not compute.

- [ ] **Step 1: Write the pricing section**

`<h2>Three prices, by scope of build</h2>` with three cards:

| Card | Price | Timeline |
|---|---|---|
| Essential | Rs 1,38,000 | 3 to 4 weeks |
| Signature | Rs 2,40,000 | 5 to 7 weeks |
| Flagship | Rs 3,90,000 | 8 to 11 weeks |

Signature carries a "most picked" flag. Each card lists its bullets from the spec, with Signature and Flagship opening on an "everything in the tier before, plus" line.

Format every price with the rupee sign, a thin space, and Indian digit grouping — `₹ 1,38,000`.

- [ ] **Step 2: Show the derivation**

Under the cards, a short line per tier giving the Gurgaon baseline and the multiplier, so the price reads as benchmarked rather than asserted: Rs 1,15,000, Rs 2,00,000 and Rs 3,25,000 baselines, each times 1.2.

- [ ] **Step 3: Probe and verify the prices survived**

Re-run the pricing probe, then:

```bash
grep -c '1,38,000\|2,40,000\|3,90,000' pricing.html
```

Expected: at least 3. And `headings` contains "Three prices, by scope of build".

- [ ] **Step 4: Commit**

```bash
git add pricing.html
git commit -m "feat(pricing): the three build tiers"
```

---

### Task 10: The AI sales agent and the closing CTA

**Files:**
- Modify: `pricing.html`

Read the spec's "AI sales agent" section. This is the section the whole page was commissioned for — give it the most room.

- [ ] **Step 1: Write the AI section**

`<h2>An AI that talks to your buyers</h2>`. Cover what it does, from the spec: trained on the price sheet, floor plans, RERA filings, payment plan and locality; a chat widget in the site's own type and palette; lead capture writing to CRM, WhatsApp and email; sentiment and intent scoring on every conversation; an instant WhatsApp ping to sales when intent crosses a threshold; a weekly intel digest of objections, budget signals and unanswered questions.

Tie it to the cited benchmarks already on the page — the average agent replies in 917 minutes and only 9% of brokerages hit the five-minute window. An agent that answers at 3am in four seconds is the argument. Reference the footnotes rather than restating uncited numbers.

- [ ] **Step 2: Write the AI pricing block**

Setup ₹ 90,000 one-time, benchmarked against the Rs 75,000 entry-build baseline times 1.2, and set against the Rs 3,10,000 a Gurugram real-estate firm paid for a comparable lead-qualification bot — cite it.

Then the monthly table: Starter ₹ 12,000 up to 500 conversations, Growth ₹ 22,000 up to 1,500, Scale ₹ 38,000 up to 4,000, and ₹ 8 per conversation beyond. State that the retainer covers LLM tokens, hosting, monthly prompt tuning and the dashboard.

Then add-ons: voice agent ₹ 1,40,000 plus ₹ 18,000/mo; WhatsApp Business API ₹ 45,000 plus ₹ 6,000/mo with Meta fees at cost; additional languages ₹ 35,000.

- [ ] **Step 3: Write the closing CTA**

`<h2>Ready to move forward?</h2>` centred, with the phone numbers and email as live `tel:` and `mailto:` links, matching the cover's contact details exactly.

- [ ] **Step 4: Probe**

Re-run the pricing probe. Expected: `headings` contains all ten section headings from the spec, in the spec's order.

- [ ] **Step 5: Commit**

```bash
git add pricing.html
git commit -m "feat(pricing): AI sales agent section and closing CTA"
```

---

### Task 11: Responsive pass and final verification

**Files:**
- Modify: `$F/kalpataru-pricing.css` as needed
- Modify: `pricing.html` as needed

- [ ] **Step 1: Probe at three widths**

```bash
for W in 360 768 1440; do
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=6000 --window-size=$W,900 "http://localhost:5000/pricing.html?probe=1" > "outp-$W.html"
  echo "--- $W ---"
  node -e "const m=require('fs').readFileSync('outp-$W.html','utf8').match(/PROBE::(\{.*?\})<\/title>/s);const o=JSON.parse(m[1]);console.log(JSON.stringify({w:o.viewportW,scrollW:o.bodyScrollW,hscroll:o.hasHorizontalScroll,broken:o.brokenImages,headings:o.headings.length}));"
done
```

Expected at every width: `hscroll:false`, `broken:[]`, `headings` at least 11 — the `h1` plus the nine `h2` section headings plus any sub-headings.

- [ ] **Step 2: Fix whatever fails**

Overflow at 360px almost always traces to a table that escaped its scrolling wrapper, or a long unbroken string like an email address or URL. Fix the cause; do not paper over it with `overflow:hidden` on the body, which hides the symptom and clips content.

- [ ] **Step 3: Re-probe the homepage for regressions**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --dump-dom --virtual-time-budget=10000 --window-size=1900,900 "http://localhost:5000/?probe=1&scrollY=0" > out.html
node -e "const m=require('fs').readFileSync('out.html','utf8').match(/PROBE::(\{.*?\})<\/title>/s);const o=JSON.parse(m[1]);console.log(JSON.stringify({nav:o.navItems,burger:o.burgerItems,footer:o.footerItems,errs:o.pageErrors},null,1));"
```

Expected: six header items, six burger items, five footer items, all `tag:"A"`, Pricing pointing at `pricing.html`, and no page errors.

- [ ] **Step 4: Confirm the site still works as plain static files**

The repo's GitHub Pages hosting depends on the page working without `local-server.js`. Serve the directory with a bare static server on a different port and load `/pricing.html`, confirming zero broken images and no request to `/_next/image`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix(pricing): responsive pass across 360, 768 and 1440"
```

---

## Definition of Done

- `pricing.html` renders all ten spec sections at 360px, 768px and 1440px with no horizontal body scroll and no broken images
- Every number on the page appears in the spec; every claimed statistic carries a visible, linked citation
- "Pricing" appears in the header nav, burger menu and footer, as a real `<a>`, surviving hydration
- Both HTML snapshots are byte-identical to each other
- `node --check` passes on both patched chunks
- The homepage probe shows no regressions and no page errors
- The page works on a plain static file server, not just `local-server.js`
