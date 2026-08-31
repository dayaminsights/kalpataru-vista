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
| Tier axis | Scope of build (Essential / Signature / Flagship) |
| AI pricing model | One-time setup plus monthly retainer scaled by conversation volume |
| Price derivation | Gurgaon market baseline x 1.2 |
| Visual direction | Kalpataru brand, standalone CSS, zero React-bundle styling risk |
| Nav | "Pricing" item in header, burger menu and footer |
| Indexing | `noindex, nofollow` |

## Pricing — derivation

Every number is a researched Gurgaon/NCR market baseline multiplied by 1.2. The baselines and their sources are published on the page itself in the market section; the page shows its work, because a self-evidently benchmarked price is easier to accept than an asserted one.

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
| Essential | Rs 1,15,000 | Rs 1,38,000 | **Rs 1,38,000** |
| Signature | Rs 2,00,000 | Rs 2,40,000 | **Rs 2,40,000** |
| Flagship | Rs 3,25,000 | Rs 3,90,000 | **Rs 3,90,000** |
| AI agent setup | Rs 75,000 | Rs 90,000 | **Rs 90,000** |
| AI Starter, up to 500 conversations/mo | Rs 10,000/mo | Rs 12,000 | **Rs 12,000/mo** |
| AI Growth, up to 1,500/mo | Rs 18,000/mo | Rs 21,600 | **Rs 22,000/mo** |
| AI Scale, up to 4,000/mo | Rs 32,000/mo | Rs 38,400 | **Rs 38,000/mo** |
| Beyond Scale | — | — | **Rs 8 per conversation** |

AI add-ons (flat, not derived): voice agent Rs 1,40,000 setup plus Rs 18,000/mo; WhatsApp Business API agent Rs 45,000 setup plus Rs 6,000/mo with Meta conversation fees at cost; additional languages Rs 35,000 one-time.

Displayed currency format on the page: the rupee sign, a thin space, then Indian digit grouping — for example 1,38,000 not 138,000.

## Tier contents

**Essential — Rs 1,38,000 — 3 to 4 weeks**
- The scroll-choreographed site already built: hero scrub, overview, amenities, unit layout, closing CTA
- Up to 6 sections
- Enquiry form with WhatsApp handoff
- Basic SEO (meta, Open Graph, sitemap), GA4, RERA footer block
- Mobile, tablet and desktop QA
- 1 round of content revisions

**Signature — Rs 2,40,000 — 5 to 7 weeks — flagged "most picked"**
- Everything in Essential, plus:
- Unit-plan explorer: 3 and 4 BHK, floor plates, carpet-area toggle
- Photo gallery and location-intelligence map (metro, schools, employment hubs, drive times)
- Gated e-brochure download
- CRM webhook (Zoho, Salesforce or Sell.Do) with lead-source tagging
- Two ad landing-page variants for Meta and Google campaigns
- Core Web Vitals pass
- 3 rounds of revisions

**Flagship — Rs 3,90,000 — 8 to 11 weeks**
- Everything in Signature, plus:
- Frame-scrub apartment walkthrough built from the 428-frame sequence already shot
- Multi-tower and multi-project template
- Broker and channel-partner portal: login, inventory sheet, commission documents
- Sales-team admin to edit price, availability and copy without a developer
- English and Hindi
- RealEstateListing schema and locality landing pages

## AI sales agent

Attaches to any tier. Setup Rs 90,000 covers:
- Trained on the price sheet, floor plans, RERA filings, payment plan and locality data
- Chat widget styled in the site's own type and palette
- Lead capture writing to CRM, WhatsApp and email
- Sentiment and intent scoring on every conversation
- Hot-lead rules: an instant WhatsApp ping to the sales team when intent crosses a threshold
- Weekly intel digest: top objections, budget signals, questions it could not answer

The monthly retainer covers LLM tokens, hosting, monthly prompt tuning and the dashboard.

## Included free

- 6 months hosting: VPS, SSL, CDN, daily backups
- 3 months hands-on management
- After that, Rs 4,000 to Rs 6,000 per month care, month to month, no lock-in

## Payment terms

Build: 40% on signing, 30% on design approval, 30% on go-live.
AI agent setup: 50% on signing, 50% on go-live. Retainer billed monthly in advance.

## Business impact — every claim cited on-page

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

Mirrors the World of Anush proposal, header for header:

1. **Cover** — full-bleed Kalpataru render, eyebrow "Website & AI Investment Proposal", H1 "Kalpataru Vista", a one-sentence subhead, a "View the live site" link back to `index.html`, and a contact bar: prepared by Dayam Insights, +91 78776 40693, +351 913 212 367, dayaminsights@gmail.com
2. **Glance strip** — four items: Already live / Next to build / Priced by / Optional
3. **"The site you've already seen — what's actually in it"** — feature breakdown of the built homepage
4. **"Where this sits in the Gurgaon market"** — the baseline table above, plus a three-column positioning comparison: template shop, Dayam Insights, full-service agency
5. **"Tentative business impact"** — cited benchmark cards
6. **"Everything in the price below"** — feature checklist
7. **"Good to know"** — hosting, revisions, ownership, payment terms, timeline
8. **"Three prices, by scope of build"** — three tier cards, Signature flagged "most picked"
9. **"An AI that talks to your buyers"** — what it does, setup price, the volume table, add-ons
10. **"Ready to move forward?"** — closing CTA with phone and email

A back-link to the site sits fixed at top-left, matching the reference page's `pricing-back` element.

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

A light page on cream with a dark cover photo under a scrim — matching the reference's structure, not its colours. Generous whitespace, left-aligned body copy, hairline section dividers in tan. Tables scroll inside their own container on narrow screens; the page body never scrolls horizontally.

Cover image: `kv-why-landscape.jpg` from the `_files` directory, with `bg.jpg` as a fallback if the crop reads wrong. No new assets are added to the repo.

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
