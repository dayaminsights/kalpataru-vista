# Kalpataru Vista — Pricing & AI Proposal Page

**Date:** 2026-08-31
**Status:** Approved for implementation

## What this is

A standalone `pricing.html` on the Kalpataru Vista site: Dayam Insights' investment proposal to the client for building and running this website, plus an AI sales agent that talks to buyers on the site. Modelled section-for-section on the World of Anush proposal (`https://dayaminsights.github.io/world-of-anush/pricing.html`), restyled in Kalpataru's palette, reachable from a new "Pricing" item in the site's top bar.

Not buyer-facing apartment pricing. The audience is the client, one reader, sent a link.

## Decisions taken

| Decision | Choice |
|---|---|
| What is priced | Dayam Insights to Kalpataru agency proposal |
| Pricing shape | One price for the website; the AI agent priced separately as an add-on |
| AI pricing model | One-time setup plus monthly retainer scaled by conversation volume |
| Price derivation | Gurgaon market baseline x 1.2 |
| Visual direction | Kalpataru brand, standalone CSS, zero React-bundle styling risk |
| Nav | "Pricing" item in header, burger menu and footer |
| Indexing | `noindex, nofollow` |

## Pricing — derivation

Every number is a researched Gurgaon/NCR market baseline multiplied by 1.2. **This working is internal.** The page cites the published Gurgaon rates as reassurance that the quote sits inside them, but it never shows a baseline figure or the multiplier — see "The multiplier is internal" below.

### Market baselines (cited on-page)

| Work | Gurgaon/NCR range | Source |
|---|---|---|
| Brochure/service site, custom design | Rs 60,000 – Rs 2,50,000 | websenor.com/website-development-cost-in-gurgaon/ |
| Agency custom build, integrations, advanced functionality | Rs 1,00,000 – Rs 5,00,000+ | websenor.com/website-development-cost-in-gurgaon/ |
| Standard custom site, Delhi NCR | Rs 50,000 – Rs 2,00,000 | mayankdigitallabs.in/blog/website-cost-delhi-ncr-2026 |
| Custom web application | Rs 2,00,000 – Rs 10,00,000 | mayankdigitallabs.in/blog/how-much-does-a-website-cost-in-india-2026 |
| Same scope, junior-heavy vs senior-only team | Rs 80,000 vs Rs 3,00,000 | codingclave.com/cost/website-development-cost-in-delhi |
| AI chatbot, entry build | Rs 30,000 – Rs 75,000 | codingclave.com/blog/ai-chatbot-development-cost-india-2026 |
| Gurugram real-estate WhatsApp lead-qualification bot, 7 weeks | Rs 3,10,000 | codingclave.com/blog/ai-chatbot-development-cost-india-2026 |
| Bot running cost, LLM plus WhatsApp fees | Rs 5,000 – Rs 20,000/mo | codingclave.com/blog/ai-chatbot-development-cost-india-2026 |

### Final prices

| Line | Baseline | x1.2 | Quote |
|---|---|---|---|
| **The website build** | Rs 1,15,000 | Rs 1,38,000 | **Rs 1,38,000** |
| AI agent setup | Rs 75,000 | Rs 90,000 | **Rs 90,000** |
| AI Starter, up to 500 conversations/mo | Rs 10,000/mo | Rs 12,000 | **Rs 12,000/mo** |
| AI Growth, up to 1,500/mo | Rs 18,000/mo | Rs 21,600 | **Rs 22,000/mo** |
| AI Scale, up to 4,000/mo | Rs 32,000/mo | Rs 38,400 | **Rs 38,000/mo** |
| Beyond Scale | — | — | **Rs 8 per conversation** |

AI add-ons (flat, not derived): voice agent Rs 1,40,000 setup plus Rs 18,000/mo; WhatsApp Business API agent Rs 45,000 setup plus Rs 6,000/mo with Meta conversation fees at cost; additional languages Rs 35,000 one-time.

Displayed currency format on the page: the rupee sign, a thin space, then Indian digit grouping — for example 1,38,000 not 138,000.

### The multiplier is internal — never shown to the client

The baseline and the ×1.2 columns above are **how the price was arrived at, not something the page says.** Showing a client the arithmetic behind their own quote invites them to argue the multiplier instead of judging the price, and it complicates a document whose whole job is to be simple.

**No baseline figure and no "× 1.2" appears anywhere on the page.** The market section may still say the price is benchmarked against published Gurgaon rates, and may still cite those rates — that is the reassurance. It must not show the working.

### One price, not three tiers

The page quotes **one number for the website: Rs 1,38,000.** The three-tier ladder is retired. A single confident figure is easier to say yes to than a menu, and this client is expected to bring repeat work.

The AI sales agent is **a separate, optional add-on. It is explicitly not in the website quote.** Its price is revealed on its own, after its own case is made, and only then are the two shown together.

## What the website build covers — Rs 1,38,000, 3 to 4 weeks

This is the whole scope, and it is what the "what we build" section on the page describes. Lead with the five things the client asked to see named:

- **The hero** — the scroll-choreographed opening already built and live
- **Amenities** — the photo panels
- **FAQs, written for both kinds of search** — structured for AI answer engines (GEO/AEO) as well as conventional search (SEO), so the project gets surfaced when a buyer asks an assistant as well as when they type into Google
- **Forms with WhatsApp integration** — an enquiry goes straight to the sales team's phone
- **Overview, unit layout and the closing call to action** — the rest of the built page

Plus: basic SEO (meta, Open Graph, sitemap), GA4, the RERA footer block, QA at phone, tablet and desktop widths, and one round of content revisions.

## AI sales agent — an optional add-on, priced separately

**Not included in the Rs 1,38,000.** It is pitched on its own merits, its price is revealed after its case is made, and only then is it shown added to the quote.

Setup Rs 90,000 covers:
- Trained on the price sheet, floor plans, RERA filings, payment plan and locality data
- Chat widget styled in the site's own type and palette
- Lead capture writing to CRM, WhatsApp and email
- Sentiment and intent scoring on every conversation
- Hot-lead rules: an instant WhatsApp ping to the sales team when intent crosses a threshold
- Weekly intel digest: top objections, budget signals, questions it could not answer

The monthly retainer covers LLM tokens, hosting, monthly prompt tuning and the dashboard.

## Included, and what happens after

Two recurring things, and they are **deliberately different products**. Write them so no reader thinks they are being charged twice for one job.

| | Free period | After |
|---|---|---|
| **Hosting & care** — keeping the site up: VPS, SSL, CDN, daily backups, uptime | 6 months | Rs 4,000 to Rs 6,000 per month, month to month, no lock-in |
| **Support & maintenance** — changing the site: content edits, new sections, fixes, new work | 3 months | Rs 3,000 per hour |

**The domain is the client's.** They buy and own it; we point it at the site. Say this plainly rather than leaving it to be discovered — an unstated assumption about who buys the domain is exactly the kind of thing that sours a handover.

## Payment terms

Build: 40% on signing, 30% on design approval, 30% on go-live.
AI agent setup: 50% on signing, 50% on go-live. Retainer billed monthly in advance.

## Business impact — every claim cited on-page

**Only four of the eight below now appear on the page** — see "What was cut, and why". The four that ship are the 78% first-responder figure, the 917-minute average, the 21× five-minute figure, and the 20–35% chat uplift. They chain into one argument. The other four remain here as reserve, in case a figure needs swapping.

| Claim | Number | Source |
|---|---|---|
| Buyers go with whoever replies first | 78% | sierrainteractive.com/insights/blog/speed-to-lead-real-estate/ |
| Reply in 5 minutes rather than 30 (MIT/InsideSales, 1.25M leads) | 21x more likely to qualify | jamilacademy.com/blog/real-estate-lead-routing-speed-to-lead |
| Average agent reply time | 917 minutes, over 15 hours | agentzap.ai/blog/real-estate-lead-statistics |
| Brokerages that hit the 5-minute window | 9% | agentzap.ai/blog/real-estate-lead-statistics |
| Site chatbots against static forms | 20 to 35% more leads | scalify.ai/blog/chatbot-on-website-statistics-2026-usage-conversions-roi |
| Businesses reporting more qualified leads from AI chat | 64% | click-vision.com/ai-lead-generation-statistics |
| 1 second page load against 6 seconds | 39% against 18% conversion | envisagedigital.co.uk/website-load-time-statistics/ |
| Property searches on mobile | over 60% | contempothemes.com/why-speed-still-matters-real-estate-website-load-times-vs-bounce-rates/ |

Presentation rule: every figure carries a visible superscript footnote number linking to a numbered source list at the foot of that section. No uncited number appears anywhere on the page. Framing is explicitly tentative — the heading is "Tentative business impact", these are benchmarks, not promises.

## Page structure

**This is a sales pitch, not a dossier.** The first build ran to 3,990 words — a sixteen-minute read that buried the prices two-thirds down. It has been restructured to lead with price and to fit a single sitting.

**Total word budget: ~1,400. This is a hard constraint, not a target to drift past.** Per-section budgets below are the discipline that keeps it there. If a section wants more room, something else gives it up.

| # | Section | Words | Content |
|---|---|---|---|
| 1 | **Cover** | ~80 | Full-bleed render, eyebrow "Website & AI Investment Proposal", H1 "Kalpataru Vista", one-sentence subhead, "View the live site" link, contact bar: Dayam Insights, +91 78776 40693, +351 913 212 367, dayaminsights@gmail.com |
| 2 | **"Your investment"** | ~180 | Immediately after the cover. **One price — Rs 1,38,000 — and no derivation.** See the price-prominence rules below. |
| 3 | **"What we build"** | ~200 | Image-led. Names the hero, amenities, FAQs written for GEO/AEO and SEO, and forms with WhatsApp integration. Captions do the talking, not paragraphs. |
| 4 | **"An AI that talks to your buyers"** | ~350 | The optional add-on, and the largest section. Keeps the built mock conversation. Makes its case, **then** reveals its price. Closes with the side-by-side block below. |
| 4b | **"Website, or website and agent"** | ~120 | Sits at the foot of section 4, not as its own section. Two cards side by side, styled exactly like the section 2 price card: website alone at Rs 1,38,000, website plus agent at Rs 2,28,000 one-time with the agent's monthly shown separately. The client asked for this comparison explicitly. |
| 5 | **"Why this price is fair"** | ~180 | A single three-column comparison — template shop, Dayam Insights, full-service agency. Cites published Gurgaon rates. **Shows no arithmetic.** |
| 6 | **"What this does for sales"** | ~150 | Four cited figures, no more. |
| 7 | **"What's included, and the terms"** | ~180 | Hosting & care against support & maintenance as two distinct products, plus the domain being the client's. |
| 8 | **"Ready to move forward?"** | ~50 | Phone and email. |

### Vertical rhythm — a specific fix, not a general aspiration

The client has called out gaps and spacing as wrong. The current page sets its section padding, heading margins and card gaps ad hoc, so the interval between a heading and its content varies section to section and some bands sit much further apart than others.

Put every vertical gap on **one spacing scale expressed as tokens**, and use only those tokens. One value for the gap between sections, one for heading-to-body, one for body-to-component, one for the gap between cards. No bespoke margins.

The specific bug visible in the shipped page: in the tier cards, the "most picked" tag sits in the flow above the price, so the flagged card's figure lands a line lower than its neighbours and the three prices do not share a baseline. Whatever survives into the new comparison cards must not repeat this — the figures share one axis whether or not a card carries a tag.

A back-link to the site sits fixed at top-left, matching the reference page's `pricing-back` element.

### Price prominence

The prices are the point of the document, and in the first build they read as one more table on a long page. They now lead.

- Section 2 sits directly under the cover, before any justification. A firm confident in its price states it first; the market comparison and the impact figures then read as support rather than as build-up.
- **One figure, and it is the largest thing on the page after the cover headline.** Fraunces at display size. With the tier ladder retired there is no menu to compare against, so the number carries the section by itself and should be set that way — generous space around it, nothing competing.
- **No derivation line.** The baseline and the multiplier are internal. What sits beneath the figure is the timeline (3 to 4 weeks) and what it covers, not the working.
- The AI agent's price gets the same typographic treatment when it is finally revealed in section 4, so the two read as comparable figures rather than a headline price and a footnote.

### What was cut, and why

- **The eight-row market baseline table.** Two comparison structures were doing one job. The three-column grid survives; the baselines compress into one cited sentence, so the sourcing survives without the table.
- **Four of the eight impact figures.** The four that remain form the actual argument chain: buyers go with whoever answers first (78%), the industry average reply is 917 minutes, answering inside five minutes qualifies 21× more, and site chat delivers 20–35% more leads. The rest were corroboration nobody needed.
- **Most of "what's actually in it".** The reader has seen the site. Images and captions, not 677 words of prose.
- **The separate inclusions and terms sections.** Both answered "what is the deal"; they are now one.

Citations are **not** cut. Every figure that remains keeps its footnote and its source link — the sourcing is what makes the price defensible, and it costs almost no words.

## Visual design

Palette drawn from `kalpataru-brand.css`:

| Token | Value | Role |
|---|---|---|
| `--kv-ink` | `#151717` | primary text, dark grounds |
| `--kv-ink-deep` | `#2c1512` | headings, deep warm ground |
| `--kv-brown` | `#855c3a` | secondary text, hairlines |
| `--kv-tan` | `#c89b6e` | accent: eyebrows, rules, price emphasis, focus ring |
| `--kv-cream` | `#FBF1EA` | base section ground |
| `--kv-cream-deep` | `#f1f1ef` | alternate band |
| `--kv-rust` | `#9d3a2c` | single alert accent, used sparingly |

Type: Fraunces (already loaded from Google Fonts in `index.html` at weight 300, `opsz 9..144`) for headings; Instrument Sans (local woff2 files in the `_files` directory) for body. Reuse the existing font loading so the page reads as the same brand.

### The layout system — taken from the World of Anush proposal

That page is Dayam Insights' own house style for a client proposal, and this page is its sibling. Reuse its structural grammar directly, restyled in the Kalpataru palette. It is a **card system**, not a hairline specification sheet: white surfaces floating on cream, each with a `1px` cream-deep border, a small radius and a soft shadow; accent borders reserved for the two rows that matter.

| Component | Structure |
|---|---|
| `feature-block` | Grid, `190px 1fr`, image column beside copy, on a white card. Below ~640px it stacks. |
| `feature-media` | `aspect-ratio: 5/7` portrait, `object-fit: cover`, `2px` tan ring. Optional slow Ken Burns drift; optional hover-swap to a second image. |
| `feature-copy` | A pill tag in uppercase tracked sans with an accent border, then a bold sans name, then soft-ink body copy, then an optional accent hint line. |
| `market-row` | White card per competitor. **Our row** takes a `2px` tan border, the cream-deep ground and no shadow, so it reads as the answer without shouting. |
| `impact-row` | Flex, baseline-aligned: a large Fraunces tabular numeral in tan, then the claim in soft ink with the key phrase in full ink. One citation line under the group. |
| `price-card` | White card, tan rule, the figure at display size. Used for the single quote in section 2 and reused for the two comparison cards at the foot of section 4. |
| `price-compare` | The side-by-side pair: website alone against website plus agent. Figures share one baseline whether or not a card carries a tag. |
| `cta-final` | Cream-deep panel, centred, closing the page. |

Keep the accent discipline of the reference: tan is the single accent, spent on the price figures, the "us" market row, the impact numerals and image rings. Rust is for at most one thing on the page. Everything else is ink, soft brown and cream.

Tables scroll inside their own container on narrow screens; the page body never scrolls horizontally at any width.

### Imagery — evidence, not decoration

The reference carries only six images, and every one is proof of the thing described beside it, with a caption that names it precisely. Match that discipline: an image earns its place by showing something the copy claims. No stock, no filler, no image without a real alt description.

All assets already exist in the `_files` directory. Nothing new is added to the repo. **Every image must be visually checked before placement** — filenames in this repo are not always reliable descriptions.

| Where | Image | Shows |
|---|---|---|
| Cover | `kv-why-architect.jpg` | The twin towers over the golf course — verified: exterior render, wide, works full-bleed under a scrim |
| "What's actually in it" — hero | `house.webp` | The building cutout that the hero scrub animates |
| — amenities | `amenities-1--big.avif` | The amenities photo panels |
| — residences | `kv-residence-plan-1.jpg` | A unit plan as the plan explorer shows it |
| — site layout | `site-layout.webp` | The site layout plate |
| — location | `map-direction.webp` | The location/connectivity map |
| — interiors | `kv-why-interior.jpg` | The interior photography in the Why Vista essay |
| ~~Flagship tier~~ | ~~`apartment-video-poster.jpg`~~ | **Dropped.** The frame-scrub walkthrough was a Flagship feature, and retiring the tier ladder puts it out of scope. Do not show a still from footage the quote does not pay for. The asset is freed; use it elsewhere only if it genuinely illustrates something the build includes. |
| Closing CTA | `kv-why-golf-course.jpg` | The golf frontage |

Two images may use the reference's hover-swap (`demo` / `hover-img`) where a second asset genuinely shows a second state — for example a residence plan swapping to another unit type. Do not use it decoratively.

**The AI section gets no photograph.** There is no asset for a product that does not exist yet, and a stock chatbot image would be a lie. Build the widget as real markup instead — a short, brand-styled mock conversation showing a buyer asking about a 4 BHK and the agent answering with a floor plate, capturing a phone number, and scoring intent. This is the page's centrepiece and the thing being sold; it should be the most designed object on the page. Label it plainly as an illustration of the proposed agent, not a live product.

## Technical approach

### New files
- `pricing.html` at repo root
- `FIND Real Estate ..._files/kalpataru-pricing.css` — its own stylesheet, **not** appended to `kalpataru-brand.css`, so a mistake here cannot affect the main site

The page is hand-authored static HTML. It loads no React, no bundle chunk, no GSAP. It is therefore immune to the hydration-overwrite rule that governs the rest of this repo.

### Nav integration — the one invasive change

The nav is React-owned. Labels live in two JS chunks:

| Chunk | Array | Feeds | Link component |
|---|---|---|---|
| `8314-539f3dc843f460bb.js` | `B` of `{title, href}` | header nav **and** burger menu, two render sites | `c()` |
| `1324-f76849f4515b2e93.js` | `M` of `{label, href}` | footer nav, one render site | `g()` |

Both render sites use the Next.js Link component. A `pricing.html` href passed to Link would be intercepted by the client router and fail in this static capture. So each render site needs a fallback: render a plain `"a"` when the href is not a `#` anchor, and the Link component otherwise.

Steps:
1. `8314`: add a Pricing entry to `B`; at both render sites replace the bare `c()` reference with a conditional yielding `"a"` for non-anchor hrefs.
2. `1324`: add a Pricing entry to `M`; the same conditional on `g()`.
3. Mirror the resulting markup into `index.html` and the long FIND-named HTML file, in all three places (header nav, burger menu nav, footer nav), so first paint matches hydration.
4. Run `node --check` on each patched chunk.

Back up each chunk to `.js.orig` before editing if no backup exists.

### Verification

Headless Chrome through `local-server.js`, per this repo's established method. The probe is extended with checks asserting, after hydration settles:
- a header nav anchor whose text is "Pricing" exists and whose href ends in `pricing.html`
- the same in the burger menu and in the footer
- the element is a real anchor tag, not a router-intercepted Link
- `pricing.html` itself renders: all ten section headings present, no horizontal body scroll at 360px, 768px and 1440px widths, and zero broken images

Reading the source is not verification. Every claim of completion cites probe output.

## Out of scope

- Any change to the existing homepage's content, layout or bundle behaviour beyond the nav arrays
- Buyer-facing apartment pricing
- A working AI agent. The page sells it; it does not implement it.
- Compression of existing oversized assets
