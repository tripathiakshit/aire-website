# AIRE Website — Design Tokens & Component Patterns

> **Status:** Reference doc — read before adding any new page.
> **Audience:** Future agents and developers extending the site.
> **Scope:** Catalogue of the *existing* design system; per-page extension guidance for Phase 1. **Not a redesign.**
> **Last verified against source:** 2026-05-28 (Astro v6, Tailwind v4, MDX).

Open this doc, find the pattern that matches what you're building, copy the snippet, fill in content. If you can't find a matching pattern: extend, don't invent. See §4 anti-patterns.

---

## 1 — Token inventory

All tokens defined in [`src/styles/global.css`](../../src/styles/global.css) under the Tailwind v4 `@theme` block.

### Colors

| Token | Hex | Intended use |
|---|---|---|
| `geo-primary` | `#0c498e` | Primary brand blue. Buttons (secondary), icon chips, accent blocks. |
| `geo-primary-dark` | `#071f3d` | Darker variant. Hero gradient overlay, hover state on primary buttons, footer sticky CTA text. |
| `geo-secondary` | `#a5c1da` | Light blue accent. Active nav link, decorative rings, italic-emphasis spans on dark hero, audience-track callouts. |
| `geo-alternate` | `#c8c7bf` | Warm neutral — defined but rarely used. Available for tertiary accents. |
| `geo-gold` | `#c9a84c` | Brand gold. Eyebrows, primary CTA fill, gold arrows (`→`), status pill borders for "in development / testing", outcome callouts, hover-border on cards. |
| `geo-slate` | `#1a2b3c` | Dark slate. Section background variant; header/footer base. |
| `geo-deep` | `#0d1827` | Deepest dark. Section background variant — paired alternately with `geo-slate`. |

### Typography

| Token | Stack | Use |
|---|---|---|
| `font-display` | `'Playfair Display', Georgia, 'Times New Roman', serif` | All headings (`h1`/`h2`/`h3`/`h4`) — applied via base styles in `global.css`. Also used inline for italic outcome lines and emphasis spans. |
| `font-sans` | `'Inter', system-ui, -apple-system, sans-serif` | Body text — applied to `body` via base styles. Always default unless `font-display` explicitly invoked. |

### Utilities defined in `global.css` (not Tailwind defaults)

| Class | Purpose | Definition |
|---|---|---|
| `.text-gradient` | Soft blue-to-white gradient text on dark | `linear-gradient(135deg, #a5c1da 0%, #ffffff 100%)` clipped to text. |
| `.text-gradient-gold` | Gold-to-white gradient text on dark | `linear-gradient(135deg, #c9a84c 0%, #e8d48c 60%, #ffffff 100%)` clipped to text. |
| `.card-dark` | Semi-transparent dark-bg card with hover lift | `bg-white/4 border border-white/8` + hover variant. |
| `.scrollbar-none` | Hide horizontal scrollbars on referenced-in marquees | Cross-browser. |
| `.hero-breathe` | 8-second opacity pulse for hero grid overlay | `@keyframes hero-breathe` 0.04 → 0.08. |
| `[data-reveal]` | Scroll-fade-in animation — opacity 0 + translateY(18px) → visible | Toggled by IntersectionObserver via a `.is-visible` class. Honours `prefers-reduced-motion`. |
| `#mobile-menu.open` | Mobile menu max-height slide | 0 → 520px over 280ms. |

---

## 2 — Component pattern catalogue

Patterns are listed in order of frequency. Each entry: **what it is**, **where it lives in code**, **minimal Astro snippet**.

### 2.1 Eyebrow

Small uppercase amber-gold label that sits above an `h2` or `h3`. Establishes section identity at a glance.

**Where:** Every section in [`src/pages/index.astro`](../../src/pages/index.astro) (e.g., line 39 hero; 128 services; 318 trusted-expertise) and every page hero in `src/pages/technologies/*.astro`.

**Snippet:**
```astro
<p class="text-geo-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">Section eyebrow text</p>
```

**Variants (tracking changes with role):**
- Main eyebrow: `tracking-[0.25em]` *(this default — use unless reason otherwise)*
- Hero eyebrow: `tracking-[0.3em]` (slightly wider for first impression — see e.g. CTA banner line 556)
- Dual-audience-strip mini-eyebrow: `text-[10px]` + `tracking-[0.18em]` (see §2.6)
- Status-pill text: `text-[10px]` + `tracking-[0.15em]` (see §2.5)

### 2.2 Display H2

Serif h2 in white on dark backgrounds. The site's primary section-title pattern.

**Where:** `src/pages/index.astro` line 129 ("Our Services"), line 319 ("Trusted Expertise…"), line 397 ("Proven Solutions in Action"), 590 ("Ready to Start a Project?"). `src/pages/technologies/index.astro` line 70 (hero), 137 (partner pitch), 167 (CTA).

**Snippet:**
```astro
<h2 class="font-display text-3xl md:text-5xl text-white mb-4 leading-tight">Section heading</h2>
```

Notes: Always paired with an eyebrow (§2.1) immediately above and a `mb-4` to `mb-6` gap before the lede. For very large hero h1, scale to `text-4xl sm:text-5xl md:text-7xl lg:text-8xl` and `mb-5` to `mb-6` (see homepage line 40).

### 2.3 Section background alternation

Sections alternate between `bg-geo-slate` and `bg-geo-deep` for visual rhythm. Hero typically uses `geo-slate` over a darkened image; subsequent dark sections alternate.

**Where:** `src/pages/index.astro` — Stats (70 `bg-geo-slate`) → Services (125 `bg-geo-deep`) → Quote strip (305 `bg-geo-slate`) → Trusted Expertise (315 `bg-geo-deep`) → Technologies (363 `bg-geo-slate`) → Driving Smarter Exploration (393 `bg-geo-deep`) → Principles (437 `bg-geo-slate`) → About Preview (505 `bg-geo-slate`) → CTA Banner (553 `bg-geo-slate`).

**Snippet:**
```astro
<section class="py-12 md:py-20 bg-geo-deep">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- content -->
  </div>
</section>
<section class="py-12 md:py-20 bg-geo-slate">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- content -->
  </div>
</section>
```

Standard section padding: `py-12 md:py-20` (mobile-first). Half-height bands like stats: `py-8 md:py-10`. CTA banner: `py-14 md:py-24`. Container `max-w-7xl` for grid sections, `max-w-4xl` for centred CTA, `max-w-3xl` for centred prose.

### 2.4 Product card (image + body, full-click link)

The recurring `/technologies` hub card. Full-click anchor wrapping a flex column.

**Where:** `src/pages/technologies/index.astro` lines 96–122 (the `products.map(...)` loop).

**Snippet:**
```astro
<a
  href={`/technologies/${p.slug}`}
  class="group flex flex-col overflow-hidden rounded-2xl border border-white/10 hover:border-geo-gold/60 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 bg-white/5"
>
  <div class="relative h-52 overflow-hidden">
    <Image src={p.img} alt={p.name} width={800}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <!-- status pill (§2.5) -->
  </div>
  <div class="p-6 flex flex-col flex-1">
    <p class="text-geo-gold text-[10px] font-semibold uppercase tracking-[0.25em] mb-2">{p.eyebrow}</p>
    <h3 class="font-display text-xl md:text-2xl text-white font-semibold mb-3 leading-snug">{p.name}</h3>
    <p class="text-slate-300 leading-relaxed text-sm mb-5 flex-1">{p.tagline}</p>
    <p class="text-geo-gold text-xs font-semibold uppercase tracking-wider">Read the case →</p>
  </div>
</a>
```

The `group` class on the outer anchor enables `group-hover:*` styling on the image (`scale-105`) and on any internal element. Grid context: typically `grid grid-cols-1 md:grid-cols-2 gap-6`.

### 2.5 Status pill

Small absolute-positioned label on the top-left of a card image. Conveys product maturity at a glance.

**Where:** `src/pages/technologies/index.astro` lines 108–110; `src/pages/technologies/[slug].astro` hero status pill (~127).

**Snippet — gold variant (in testing / in development):**
```astro
<div class="absolute top-3 left-3 px-3 py-1 bg-geo-deep/85 border border-geo-gold/60 text-geo-gold text-[10px] font-semibold uppercase tracking-[0.15em] rounded">
  In testing
</div>
```

**Snippet — emerald variant (production ready):**
```astro
<div class="absolute top-3 left-3 px-3 py-1 bg-geo-deep/85 border border-emerald-400/60 text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.15em] rounded">
  Production ready
</div>
```

Driven by `statusKind: 'gold' | 'green'` in the products data array. **No other variants exist**; do not invent (see §4).

### 2.6 Dual-audience strip

The footer strip on the homepage CAGE-IN feature card — a 2-column inner nav that splits a clickable parent into two distinct audience tracks. Implemented as a `<div>` parent (so the inner `<a>` children handle clicks, avoiding nested-anchor invalid HTML), with the parent navigating via JS only when the click target isn't an anchor.

**Where:** `src/pages/index.astro` lines 144–179 (the `id="cage-in-feature-card"` block); navigation script at lines 624–643.

**Snippet (structure):**
```astro
<div
  id="cage-in-feature-card"
  class="group flex flex-col overflow-hidden rounded-2xl border border-white/10 hover:border-geo-gold/60 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 mb-6 bg-white/5 cursor-pointer"
  data-href="/technologies/cage-in"
  role="link"
  tabindex="0"
  aria-label="..."
>
  <!-- Top: image + body (same as Product card pattern) -->
  <div class="flex flex-col sm:flex-row">
    <!-- image + body -->
  </div>

  <!-- Dual-audience strip -->
  <div class="border-t border-white/10 grid grid-cols-1 sm:grid-cols-2">
    <a href="/contact" class="block px-7 py-5 hover:bg-white/5 transition-colors sm:border-r border-white/10" onclick="event.stopPropagation()">
      <p class="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5">For Mining Companies</p>
      <p class="text-white text-sm leading-snug">
        Engage us to run it on your data <span class="text-geo-gold">→</span>
      </p>
    </a>
    <a href="/technologies" class="block px-7 py-5 hover:bg-white/5 transition-colors border-t sm:border-t-0 border-white/10" onclick="event.stopPropagation()">
      <p class="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5">For Fellow Consultants</p>
      <p class="text-white text-sm leading-snug">
        Licence the stack, deliver under your brand <span class="text-geo-gold">→</span>
      </p>
    </a>
  </div>
</div>
```

JS handler (already in `index.astro`):
```html
<script>
  const card = document.getElementById('cage-in-feature-card');
  const href = card?.getAttribute('data-href');
  if (card && href) {
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) return;
      window.location.href = href;
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; }
    });
  }
</script>
```

Reuse this pattern verbatim for any future card that needs to support BOTH a primary tap-anywhere link AND two distinct sub-CTAs.

### 2.7 Outcome callout

A bordered Playfair-italic block highlighting a single proof statement. Gold-toned: subtle bg + gold border + gold left-edge band.

**Where:** `src/pages/technologies/[slug].astro` ~180 (the "The outcome" block inside each product page's "What we built" section).

**Snippet:**
```astro
<div class="bg-geo-gold/8 border border-geo-gold/30 border-l-4 border-l-geo-gold rounded p-5">
  <p class="text-geo-gold text-[10px] font-semibold uppercase tracking-[0.25em] mb-2">The outcome</p>
  <p class="font-display italic text-white text-lg md:text-xl leading-snug">
    A ranked portfolio of 200+ targets in weeks, not years.
  </p>
</div>
```

Use sparingly: one per page. The italic Playfair is the "this is the punchline" cue.

### 2.8 `card-dark` info panel

Defined in `global.css`. The default mid-density container for inputs, outputs, deployment specs, or any structured list of named-and-bodied items.

**Where:** Defined `global.css` lines 87–94. Used in `src/pages/technologies/[slug].astro` ~187–198 (Inputs/Outputs/Deployment trio).

**Snippet:**
```astro
<div class="card-dark rounded-xl p-6">
  <p class="text-geo-gold text-[10px] font-semibold uppercase tracking-[0.25em] mb-2">Inputs</p>
  <p class="text-slate-300 text-sm leading-relaxed">Field one · Field two · Field three</p>
</div>
```

Stack 2–4 vertically with `space-y-4` for a side-column trio. Hover affordance comes from `card-dark:hover` in CSS — no extra Tailwind classes needed.

### 2.9 CTA buttons (primary / secondary)

Two-button-row pattern used in heros, CTA banners, and form contexts.

**Where:** `src/pages/index.astro` lines 47–58 (hero), 596–617 (CTA banner). `src/pages/technologies/index.astro` lines 184–195 (free-consultation CTA). `src/pages/technologies/[slug].astro` ~138–145 (product-page hero).

**Snippet (full row):**
```astro
<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
  <a href="/contact"
     class="w-full sm:w-auto px-8 py-3.5 rounded bg-geo-gold text-white font-semibold text-sm uppercase tracking-wider hover:bg-amber-500 transition-colors text-center">
    Primary action →
  </a>
  <a href="/contact"
     class="w-full sm:w-auto px-8 py-3.5 rounded border border-white/20 text-white/80 font-medium text-sm hover:bg-white/10 transition-colors">
    Secondary action
  </a>
</div>
```

Soft-CTA variant (used above the primary on home CTA banner, lines 595–611) uses `border-geo-secondary/50 text-geo-secondary hover:bg-geo-secondary/10` for download / schedule-call buttons. Use when you need three CTAs without overwhelming visual weight.

### 2.10 Section hero (eyebrow + h2 + lede)

The standard hero pattern for sub-pages. Three lines stacked + optional CTAs below.

**Where:** Every page hero. Best canonical example: `src/pages/technologies/index.astro` lines 67–80.

**Snippet:**
```astro
<section class="bg-geo-slate text-white py-16 md:py-24">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-reveal>
    <p class="text-geo-gold text-xs font-semibold uppercase tracking-[0.25em] mb-5">Eyebrow text</p>
    <h1 class="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.08] mb-6">
      Hero headline that sets up the page in one sentence.
    </h1>
    <p class="text-slate-400 text-base md:text-lg leading-relaxed max-w-prose mx-auto mb-5">
      Lede paragraph that earns the visitor's next 20 seconds.
    </p>
    <p class="text-slate-300 italic text-base md:text-lg max-w-prose mx-auto">
      Optional second-line emphasis in italics.
    </p>
  </div>
</section>
```

Image-backed full-bleed hero (homepage style): see `index.astro` lines 25–67.

### 2.11 `data-reveal` scroll-reveal

Drop `data-reveal` on any block (section, card, callout) to make it fade-and-translate in on scroll. CSS-driven; toggled by an IntersectionObserver elsewhere in the site.

**Where:** Used liberally across `src/pages/index.astro` and `src/pages/technologies/*.astro`.

**Snippet:**
```astro
<div data-reveal>
  <!-- This block animates in on scroll -->
</div>
```

CSS handles `prefers-reduced-motion: reduce` already — no extra work.

### 2.12 Dashed-border roadmap callout

A muted "in-progress" or "coming-later" treatment.

**Where:** `src/pages/technologies/index.astro` lines 125–131 (current Roadmap callout — to be removed/restructured per diagnostic A.5.1).

**Snippet:**
```astro
<div class="border border-dashed border-white/15 rounded-xl p-8 text-center bg-white/[0.02] mt-8" data-reveal>
  <p class="text-geo-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">Roadmap</p>
  <h3 class="font-display text-2xl md:text-3xl text-white mb-3">Heading</h3>
  <p class="text-slate-400 leading-relaxed max-w-prose mx-auto">Body prose.</p>
</div>
```

Repurpose this for `/for/explorer` and `/for/partner` stubs in Phase 1.

### 2.13 Existing reusable components

| Component | File | Use |
|---|---|---|
| `PageLayout` | `src/layouts/PageLayout.astro` | Default wrapper: BaseLayout + Header + `<main>` + Footer. Accepts `title`, `description`. **Use for every page.** |
| `BaseLayout` | `src/layouts/BaseLayout.astro` | Bare `<html>` shell + meta + fonts. Only use if you specifically need to skip Header/Footer (rare). |
| `Header` | `src/components/Header.astro` | Sticky nav, mobile hamburger, sticky bottom CTA. Nav links array at the top of the file — edit there to add `/for`. |
| `Footer` | `src/components/Footer.astro` | Brand block + quickLinks array + corporate disclaimer + bottom bar. Edit `quickLinks` array to add nav entries; edit prose for disclaimer extension. |
| `ServiceCard` | `src/components/ServiceCard.astro` | Existing reusable card with `card-dark` body, optional image, optional `href`. **Use for the new Services section on `/technologies`** (S1/S2/S3 from diagnostic). |
| `TechCard` | `src/components/TechCard.astro` | Used on the *deleted* legacy `/technologies.astro` page. May be revivable for the Methodology page later — for now treat as legacy. |
| `BlogCard` | `src/components/BlogCard.astro` | White-bg light-mode card for `/blog`. Does NOT use `card-dark` — by design (blog index is white). |
| `MapView` | `src/components/MapView.astro` | Mapbox GL JS map; reads `src/data/locations.json` and `PUBLIC_MAPBOX_TOKEN`. Only used on `/projects` and `/contact`. |

---

## 3 — Phase 1 page guidance

For each new or substantially-changed page, this section says what to reuse and what (if anything) to extend. Order matches the approved plan's Phase 1 sequence.

### 3.1 Pre-Phase-1 hub patch (`/technologies` index)

**Reuse:** Product card (§2.4), Status pill (§2.5), Section background alternation (§2.3), `data-reveal` (§2.11). Add OmniMiner using the same Product card pattern.

**Extend — Service card variant:** Three new cards (Gold Proxy Index / Drill Database / Spectral Classification) need to read as services with productisation noted, distinct from product cards. Use the **existing `ServiceCard` component** (`src/components/ServiceCard.astro`) for these — it already uses `card-dark` body which differs visually from product cards (the products use `bg-white/5` with hover border, services use `card-dark` with the gradient placeholder). Wire the title + 1-line description + reuse existing asset images (`gold-proxy-index_pic1.png`, `drill-database-corrections_pic1-min.png`).

Add a small `geo-secondary`-toned badge above each service-card title (NOT the gold/emerald status-pill pattern — these are a deliberately different shape):

```astro
<span class="inline-block px-2.5 py-1 bg-geo-secondary/15 text-geo-secondary text-[10px] font-semibold uppercase tracking-[0.15em] rounded">
  Service · Product in pipeline
</span>
```

Place this badge inside the ServiceCard body, above the `h3`. The `geo-secondary` colour (not gold) signals "service" vs "product" — rationale: gold/emerald are exclusively for product maturity (in-testing/in-dev/production-ready); services need a different visual language so the eye can immediately distinguish "active commercial offering with full product coming" from "shipped product."

**Section header for the new Services block:** standard Eyebrow + Display H2 (§2.1, §2.2). Suggested text: `"Services in active delivery"` / `"Methodologies you can engage today — products in pipeline."`

**Subsumption note on CAGE-IN card:** Add as a small italic strip inside the card body (below the tagline, above the "Read the case →" line) using the existing `text-slate-300 italic text-sm` pattern from the hero italic-sub-line — single-paragraph treatment, no border, no callout box. Keeps it lightweight.

**Remove:** the Roadmap callout (§2.12) entirely. The subsumption note + transparency-on-CAGE-IN-card carries the message; an empty Roadmap looks like a TODO.

### 3.2 CAGE-IN deep zone (`/technologies/cage-in`)

The dynamic-route page (`src/pages/technologies/[slug].astro`) is shared across all 4–5 products. Extending only the `cage-in` slug requires either: (a) a slug-conditional section in `[slug].astro`, or (b) a hard-coded `src/pages/technologies/cage-in.astro` that takes precedence over the dynamic route. **Recommended: (b)** — the CAGE-IN deep zone gets enough Circle 1 content that it deserves its own page; the dynamic route stays minimal for Bhumi3D / Batch GIS / OmniMiner / Varahmihir.

**Reuse:** Section background alternation (§2.3) so each new section gets its own band; Eyebrow + Display H2 (§2.1, §2.2) per section; `card-dark` info panel (§2.8) for the Performance benchmark grid; Outcome callout (§2.7) — but evolve into a "Living Methodology" extended treatment (see below); `data-reveal` (§2.11).

**Extend — Living Methodology section:** The fluid-software section deserves a richer treatment than the standard Outcome callout. Suggested: a full-section wide block with `bg-geo-gold/8` (matching outcome bg), thicker `border-l-8 border-l-geo-gold` (vs the `border-l-4` of the standard callout), an eyebrow + h2 + 70-word definition + a 3-stat strip below (each stat: small icon chip + label + 1-line example). This is a Phase 1 *extension* of the Outcome pattern — same colour family, scaled-up treatment for a flagship positioning anchor.

**Extend — Sensors & Indices section:** A 6-card grid (one per sensor family) using `card-dark` panels — each card: sensor name + 1-line capability + which evidence families it feeds. Below: a single line counting the 21 indices + 28 composites. **Do not enumerate indices** (counting is Circle 1; enumeration drifts to Circle 2).

**Extend — Deposit Models section:** A 12-chip grid (visually similar to the existing Deposit Type & Commodity Applicability section on the deleted-now-redirected `/cage-in.astro` — reference the git history at commit `75c46a5` for the old structure if helpful). Each chip is a product-card-lite: deposit-model name + 1-tag (e.g., "Validated" / "In testing"). **No weights, no veto rules — strict Circle 1.**

**Extend — Performance section:** A 3-column metric grid using `card-dark` panels. Each panel: large gold number (`font-display text-5xl text-geo-gold`) + label below + 1-line context. Reuse the `data-count-to` count-up animation pattern from the homepage stats bar (`src/pages/index.astro` lines 73–88).

**Extend — Validation section:** Stacked summary cards (one per terrain: Nevada / Titiribi / Rajasthan / Uganda) using `card-dark` panel + small static map or photo if available. Each card: terrain name + deposit type + 1-line outcome with a citation link.

**Extend — Methodology Citations section:** Plain list with citation-style formatting; each entry has a small "Read paper ↗" external link where the paper is publicly available. Reuse the `text-geo-secondary hover:text-geo-gold` link colour from the existing publications strip on the homepage.

**Cross-link to homepage fluid-software panel:** Add `id="living-methodology"` on the Living Methodology section so the homepage panel CTA (`/technologies/cage-in#living-methodology`) lands directly.

### 3.3 `/for/` parent (new — `src/pages/for/index.astro`)

**Reuse:** Section hero (§2.10), Product card (§2.4) — adapt for 3-card "audience track" grid, Eyebrow + Display H2 (§2.1, §2.2), `data-reveal`.

**Extend — Audience-track card variant:** 3 cards, each: large eyebrow ("For Indian Government & PSUs" / "For Commercial Explorers" / "For Strategic Partners"), `h3` title (the value-prop for that buyer), short body (~30 words describing buyer profile), CTA arrow ("See how we work with you →"). Visually distinct from product cards: use solid `bg-geo-slate` body (not `bg-white/5`), more padding (`p-8 md:p-10`), and a single icon chip in the top-left using `bg-geo-primary/20 text-geo-secondary` rounded-lg. Rationale: these are wayfinding cards, not product cards — they deserve a calmer treatment so the visitor reads each one rather than scans them as catalogue tiles.

**Add a fluid-software anchor panel** below the 3-card grid using the existing CTA banner pattern (§2.10 / `index.astro` lines 553–586) with the diagonal-line overlay. Eyebrow "Why our tools fit your file" / H2 "AI-backed fluid software" / 50-word definition / single CTA back to `/technologies/cage-in#living-methodology`.

### 3.4 `/for/government` landing (new — `src/pages/for/government.astro`)

**Reuse:** Section hero (§2.10), Section background alternation (§2.3), Eyebrow + Display H2 (§2.1, §2.2), Outcome callout (§2.7), `card-dark` (§2.8), CTA buttons (§2.9), `data-reveal`.

**Extend — Data callout panel:** For the NCMM capacity-gap section, build a 4-stat hero strip below the section h2 — same pattern as homepage stats bar (`index.astro` lines 70–91) but on `bg-geo-deep` ground rather than `bg-geo-slate`, and with 4 stats: ₹34,300 cr / 1,200 / 195 / 227. Each: `font-display text-5xl text-geo-gold` number + label.

**Extend — 4-archetype "Why CAGE-IN" grid:** A 4-card grid (`grid grid-cols-1 md:grid-cols-2 gap-6`) using `card-dark` panels, one per challenger archetype (academic hackathon prototypes / FOSS / international vendors / in-house GoI build). Each: icon chip (`bg-geo-primary/20`) + h3 (the archetype) + 2-line body explaining why CAGE-IN wins. Lucide icons: `GraduationCap` / `Code` / `Globe` / `Building`.

**Extend — Sovereign-by-design panel:** A 4-card grid (`grid grid-cols-2 md:grid-cols-4 gap-4`) of smaller pills (`p-5 card-dark`) — India-incorporated / India-held IP / India-resident processing / founder Indian national. Each: small Lucide icon (`MapPin`/`FileCheck`/`Server`/`UserCheck`) + 1-line label.

**Extend — Procurement options panel:** 3-card grid using Product card pattern (§2.4) minus the image — full-text panels. Each: eyebrow ("Primary route" / "Companion route" / "Easements") + h3 (GFR 194 / PPP-MII / Startup India) + 2-line body + "What this means →" link.

**Embed the Living Methodology / fluid software pitch** as a single mid-page Outcome callout (§2.7) — single sentence, italic Playfair, gold-bordered. Specifically positioned between Sovereign-by-design and Procurement options.

**Capacity-building section:** simple 2-column (`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center`) — left column text, right column existing image asset (suggested: `government-programs.png`). Eyebrow + h2 + 3-bullet list using the gold-arrow bullet pattern (`→`) from §4.

**Results-as-a-Service section:** 5-card grid (`grid grid-cols-1 md:grid-cols-5 gap-3`) of small `card-dark` panels, one per design choice (payment trigger / unit of pricing / phase structure / LDs / termination). Each: tiny eyebrow + 1-line body. Adapt the existing Stats bar layout for guidance.

**Final CTA banner:** Reuse the existing CTA banner pattern (`index.astro` lines 553–586) with a primary "Request a GSI Pilot Brief →" → `/contact?intent=gsi-pilot` and a secondary "Email a brief instead" → `/contact`. Footnote: `"No commitments · Results-as-a-Service · India-resident processing"` styled exactly like the `/technologies` hub's free-consultation CTA footnote.

### 3.5 `/for/explorer` and `/for/partner` Phase 1 stubs

**Reuse:** Section hero (§2.10), Dashed-border roadmap callout (§2.12), `data-reveal`.

**Pattern:** Minimal page. Just: PageLayout + standard section hero + a centred dashed-border callout (eyebrow "In development" / h3 "Page in development" / body explaining what's coming + brief fluid-software anchor) + a single CTA back to `/contact`. No grids, no extensive content. Both pages can share a small `<ForStub>` component if multiple instances start to look duplicative — but two stubs probably don't warrant that yet.

### 3.6 Homepage fluid-software panel

**Reuse:** Section background alternation (§2.3) — slot between existing "Trusted Expertise" (`bg-geo-deep`) and "Technologies Section" (`bg-geo-slate`), so the new panel goes on `bg-geo-slate`; Eyebrow + Display H2 (§2.1, §2.2); CTA buttons (§2.9).

**Extend — 3-stat arrow strip:** A new tight pattern. 3 inline blocks each rendered as `<icon> <label> → <example>`. Visual:

```astro
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" data-reveal>
  <div class="text-center">
    <div class="inline-flex w-12 h-12 rounded-full bg-geo-gold/15 text-geo-gold items-center justify-center mb-3">
      <!-- Lucide BookOpen icon -->
    </div>
    <p class="text-white font-semibold text-sm mb-1">New publication</p>
    <p class="text-slate-400 text-xs">→ deposit model evolves</p>
  </div>
  <!-- repeat for "New interpretation method" and "New mineral discovery" -->
</div>
```

Icons (lucide-astro): `BookOpen` (publication), `Compass` (interpretation), `Sparkles` (discovery).

Place this strip below the eyebrow + h2 + 70-word definition; above the CTA link `"How CAGE-IN evolves →"` → `/technologies/cage-in#living-methodology`.

### 3.7 Footer / About corporate-identity disclaimer extension

**No new patterns.** Edit the existing prose `<p class="text-slate-600 text-xs leading-relaxed mt-3">` paragraph in `src/components/Footer.astro` (around line 28) and the equivalent paragraph on `src/pages/about.astro`. Keep the same `text-slate-600 text-xs` styling. Just longer text.

---

## 4 — Anti-patterns / never-do

1. **Never introduce a new color outside the seven `geo-*` tokens** without (a) adding it to `src/styles/global.css` and (b) documenting it here. If you find yourself reaching for `bg-blue-500` or `text-amber-700`, stop — there's likely an existing `geo-*` token that fits, or extend `geo-alternate` (the underused warm neutral).
2. **Never use bullet characters (`•`).** Use `list-disc list-inside` (for short item lists) or the **gold arrow pattern** (for emphasised items):
   ```astro
   <ul class="text-slate-300 space-y-3 text-sm">
     <li class="flex items-start gap-3">
       <span class="text-geo-gold mt-0.5 shrink-0">→</span>
       Item text
     </li>
   </ul>
   ```
3. **Status pills only use the two defined colour pairs:** `border-geo-gold/60 text-geo-gold` (in testing / in development) OR `border-emerald-400/60 text-emerald-300` (production ready). No new statuses without extending this doc and `statusKind` in the products array. The Service card "Service · Product in pipeline" badge intentionally uses `geo-secondary` to NOT collide with these.
4. **Eyebrow tracking is canonical:** `[0.25em]` for main eyebrows (§2.1), `[0.3em]` for hero eyebrows, `[0.18em]` for the dual-audience-strip mini variant (§2.6), `[0.15em]` for status pills (§2.5). Do not deviate without a documented reason.
5. **Never insert architecture diagrams of CAGE-IN internals.** No process flow charts of the reasoning flowsheet, no Method A/B/Ensemble interaction diagrams, no annotated 12-veto charts, no Dempster-Shafer math visualisations. **All Circle 2/3 IP leak.** Use prose + simple counted lists + named-categories grids instead. See the approved plan §"Critical finding 3" at `C:\Users\drami\.claude\plans\c-users-drami-appdata-roaming-claude-lo-floofy-gem.md` for the binding Circle 1/2/3 boundary.
6. **Don't reach for `bg-white`.** This site is a dark-mode site. White backgrounds are reserved for `/blog` (light-mode by design) and nowhere else. If you need a lighter background on a dark page, use `bg-white/5` or `bg-white/[0.04]` (the `card-dark` foundation).
7. **Don't nest `<a>` tags.** If a card needs to be clickable AND contain its own anchors (see Dual-audience strip §2.6), use the `<div role="link" tabindex="0" data-href>` + JS pattern — this is the established way.
8. **Don't add new fonts.** Inter and Playfair Display are the only two. New fonts require updating `BaseLayout.astro` font preload and `global.css` token. Discourage strongly.
9. **Don't use `data-count-to` on the same page in multiple bars** — the existing stats bar (`index.astro` lines 73–88) reserves the animation for hero impact. Reuse only on `/for/government` (NCMM stats) — one place per page maximum.
10. **Don't ship a page without `data-reveal` on its primary content blocks.** The scroll-fade is part of the brand feel; pages without it look static next to the rest of the site.

---

## 5 — Update this doc when…

- A new color token is added to `global.css`
- A new component pattern emerges in 2+ places (promote it from one-off to documented)
- A new status pill variant is added
- A Phase 1 page ships and reveals a pattern the doc didn't anticipate
- Circle 1/2/3 boundary moves (currently fixed per the approved plan — but check before publishing technical content from any post-Phase-1 codebase changes)

---

## 6 — Where this doc fits in the design workflow

1. **`design:design-system`** (this skill) → produces this doc
2. **`design:ux-copy`** → consults this doc for component patterns; produces page-level copy referencing pattern names from here
3. **`design:design-critique`** → consults this doc to know what should-be-consistent vs what-should-vary
4. **`design:accessibility-review`** → consults this doc for icon usage / color-contrast pairs in patterns

Hand this doc to any of those skills as part of the prompt and they don't need to re-discover the system.
