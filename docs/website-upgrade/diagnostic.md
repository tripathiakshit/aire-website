# AIRE Website Upgrade — Diagnostic (Deliverable A)

> **Status:** Draft for Amit's review.
> **Author:** Claude (working session 2026-05-28).
> **Source documents:** `Website_Upgrade_Brief_for_Claude_Code.md` (Cowork prior session); `Doc1_Nomination_Proposal_GSI_v2.docx`; `Doc2_Registrations_Roadmap_v2.docx`; `Doc3_Platformization_Moat_Plan_v2.docx` (all under `E:\MPXG Exploration Dropbox\amit tripathi\Proposals\MoM India\`).
> **Approved plan:** `C:\Users\drami\.claude\plans\c-users-drami-appdata-roaming-claude-lo-floofy-gem.md`.

This document is the diagnostic the approved plan calls for. It is **not** public copy — it is the working ground from which the Phase 1 pages get drafted.

---

## A.1 Current site IA audit

### Routes on disk (post today's session)

| Route | Source file | Purpose | Audience today | Recommendation |
|---|---|---|---|---|
| `/` | `src/pages/index.astro` | Homepage | Mixed (currently leans commercial) | Add fluid-software panel (Phase 1) |
| `/about` | `src/pages/about.astro` | Founder + company narrative | Mixed | Extend with corporate-identity sub-section (Phase 1) |
| `/blog/...` | `src/pages/blog/[...slug].astro` + `src/content/blog/*.mdx` | Content collection | Mixed | Out of scope Phase 1 |
| `/cage-in` | `src/pages/cage-in.astro` | 301 redirect to `/technologies/cage-in` | n/a | Keep as-is |
| `/cage-in-sample-report` | `src/pages/cage-in-sample-report.astro` | Demonstration document with fictional data | Technical evaluators | Out of scope Phase 1 |
| `/case-studies` | `src/pages/case-studies.astro` | Engagement walkthroughs | Mixed | Out of scope Phase 1 (gated on permission re-confirmation) |
| `/contact` | `src/pages/contact.astro` | Form + map | Mixed | Out of scope Phase 1 |
| `/gallery` | `src/pages/gallery.astro` | Image gallery | Mixed | Out of scope Phase 1 |
| `/projects` | `src/pages/projects.astro` | Map + project table (59 entries from `src/data/locations.json`) | Mixed | Out of scope Phase 1 |
| `/publications` | `src/pages/publications.astro` | Publication list | Mixed | **Master list must be built from scratch — parallel workstream (see A.3)** |
| `/services` | `src/pages/services.astro` | Service narrative | Mixed | Out of scope Phase 1 |
| `/team` | `src/pages/team.astro` | Team bios | Mixed | Out of scope Phase 1 |
| `/technologies` (index) | `src/pages/technologies/index.astro` | Product hub (4 cards + partner pitch + CTA) | Mixed (consultancy-buyer leaning) | **Pre-Phase-1 patch** (see A.5) |
| `/technologies/{slug}` | `src/pages/technologies/[slug].astro` | Per-product dynamic page (4 products) | Technical buyers | **CAGE-IN entry gets Phase 1 deep zone** |
| `/404` | `src/pages/404.astro` | Not found | n/a | Out of scope |
| `/for/...` | *(does not exist)* | Audience-track hub + landings | Targeted | **NEW in Phase 1** |

### Components in use

- `src/components/{Header,Footer,MapView,ServiceCard,TechCard,BlogCard}.astro`
- `src/layouts/{BaseLayout,PageLayout}.astro` — PageLayout wraps Header + Footer
- `lucide-astro` icons (Menu, X, Handshake, GraduationCap, RefreshCw, ShieldCheck, Lock used so far)

### Header nav (post today's session)

`/` Home · `/technologies` Technologies · `/projects` Projects · `/case-studies` Case Studies · `/team` Team · `/publications` Blogs & Publications · `/contact` Contact (pill).

Phase 1 needs a `/for` entry; rest unchanged.

### Footer quickLinks (post today's session)

Services (`/#services`), Technologies, Projects, Case Studies, About, Blogs & Publications, Contact.

Phase 1 adds nothing here — `/for` is intentionally not surfaced in the footer to keep the audience-track navigation a discovery via the hero / main nav rather than a default scan path.

### What the current site does well
- Tight visual system (geo-* tokens, font-display, eyebrow + h2 + lede pattern, status pills, dual-audience strip on CAGE-IN card).
- Honest corporate-identity disclaimer (GeoExploration LLC dormant; AiRE operating).
- Product hub is up-to-date as of today and clean.
- Build is fast, deploys cleanly to Netlify on push to `main`.

### Where the current site fails the brief
- **No `/for/government` landing** — institutional buyers see the consultant-positioned hero on `/` and have no targeted path.
- **No fluid-software anchor** — a primary positioning concept introduced by Amit, not yet on the site.
- **Product hub misrepresents Ensemble Geochem** (in Roadmap callout as "queued") and **does not list OmniMiner** (active in-development product).
- **No services section** — Gold Proxy Index, Drill Database, and Spectral Classification are absent (they're current revenue lines with products in pipeline).
- **CAGE-IN page lacks the depth** that the Doc 1 / Doc 3 substance can support — technical buyers see Inputs/Outputs/Deployment but no architecture overview, sensor list, deposit-model list, performance benchmarks, or validation cross-references.
- **Publications list is out of date** — the actual publication record stretches to the mid-1990s and the site does not reflect this.
- **No corporate-identity completeness** — the footer disclaimer mentions GeoExploration LLC but not the MPXG → AiRE rename.

---

## A.2 Per-product gap analysis

5 products + 3 services. Each row: site framing today → codebase/service reality (from README/CHANGELOG/metadata only — Circle 1 read) → Circle 1 publishable claims → audience relevance → recommendation.

### Product 1 — CAGE-IN Mineral Prospectivity (flagship)

| Field | Detail |
|---|---|
| Site today | One of 4 cards on `/technologies`; dedicated page at `/technologies/cage-in` with Problem / What we built / Inputs / Outputs / Deployment + 1 landing screenshot |
| Codebase | `AiRE-QGIS-PluginRepository\CAGE-IN-MineralProspectivity-vQ3.44`; public stable v1.0.0 (codename Garud, April 2026); 220+ regression test suite; multi-method architecture (Method A WLC + 12 deposit models + 12-veto consistency engine; Method B Random Forest with spatial-block cross-validation; Ensemble Fusion via Dempster-Shafer) |
| Circle 1 publishable | Multi-method architecture named; 6 sensor families (ASTER / Landsat 8-9 / Sentinel-2 / EMIT L2A-L2B / PALSAR SAR / EnMAP); 21 spectral indices + 28 composites counted; 6 evidence families named; performance (GPU-tiled CuPy, Numba 13.6× speedup, 2–5 min per 1,000 km²); 12 deposit-model categories named; cross-validation references (Nevada / Titiribi / Rajasthan / Uganda); output specification (composite score raster, anomaly polygons in GeoPackage, 3 probability surfaces, Conflict Map, RGB composites, Crosta PCA images); peer-reviewed methodology citations (Lowell & Guilbert 1970; Singer et al. 2008; Osinowo et al. 2021; Crosta et al. 2003; Rajendran & Nasir 2017; Drury & Hunt 1988; Serwa & Elbialy 2021; full list to confirm from codebase before publish) |
| Circle 2/3 — never publish | JSON weight values; 12-veto rules in implementation form; Method B feature engineering; Dempster-Shafer math specifics; reasoning flowsheet decision graph; normalisation parameters; Claude prompt template; module/file paths; internal version v3.1.10 |
| Audience relevance | Government (primary — pairs with `/for/government`); Commercial-explorer (secondary); Consultancy partners (tertiary) |
| Recommendation | **Deep zone** in Phase 1. Add sections: How it Works · Sensors & Indices · Deposit Models · Performance · Validation · Living Methodology / AI-Backed Fluid Software · Methodology Citations. Update current Problem/Solution structure to flow into the new sections. Add forward-looking subsumption note about Garud CAGE-IN Mineral Prospectivity Mapper. |

### Product 2 — Bhumi3DMapper

| Field | Detail |
|---|---|
| Site today | Card on `/technologies` with "Production ready" pill (green). Dedicated page at `/technologies/bhumi3dmapper` |
| Codebase | `AiRE-QGIS-PluginRepository\Bhumi3DMapper\bhumi3dmapper_v1.0.0_dev` — folder name still carries `_dev` suffix; metadata.txt present; no root README |
| Circle 1 publishable | 3D prospectivity scoring; Proximity model (resource delineation) + Blind model (greenfield step-out); config-driven multi-criterion pipeline; QGIS-integrated; SEDEX Pb-Zn / VMS / porphyry / epithermal adaptable; pure-Python core; ~50M cells per typical run |
| Audience relevance | Commercial-explorer (primary); Consultancy partners (secondary); Government (tertiary) |
| **Status reconciliation needed** | Folder name `_v1.0.0_dev` contradicts site's "Production ready" pill. Either the folder was never renamed after stable release, or the card overclaims. **Open dependency #1 from approved plan** — blocks hub patch deploy. Recommend asking Amit directly. |
| Recommendation | **Keep card** with corrected status. Brief fluid-software mention if 3D scoring updates with new deposit-model literature. Full deep-zone deferred to Phase 2. |

### Product 3 — Batch GIS File Loader

| Field | Detail |
|---|---|
| Site today | Card on `/technologies` with "Production ready" pill. Dedicated page at `/technologies/batch-gis-loader` |
| Codebase | `AiRE-QGIS-PluginRepository\Batch_GIS_File_Loader`; README + metadata; v1.0 source / v2.5 distribution zip dated 2025-03-25 |
| Circle 1 publishable | Recursive folder-tree scan; 20+ vector and raster formats; CRS / geometry / feature count preview; group-by FolderTree/Subfolder/Type; progress tracking + cancellation |
| Audience relevance | Consultancy partners (primary); Commercial-explorer (secondary) |
| Recommendation | **Keep** as-is. No deep zone in Phase 1. Status pill stays "Production ready." |

### Product 4 — OmniMiner (NEW to site)

| Field | Detail |
|---|---|
| Site today | **Not on site.** |
| Codebase | `AiRE-QGIS-PluginRepository\OmniMiner`; README present, marked "Under Development"; no semantic version; git history active Jan 2026 |
| Circle 1 publishable | Regional mineral reconnaissance from Landsat / Sentinel imagery; spectral analysis for mineral identification; QGIS processing integration; user-friendly interface |
| Audience relevance | Commercial-explorer (primary); Consultancy partners (secondary) |
| Recommendation | **Add card** to `/technologies` hub (in-development pill, gold). Stub dynamic-page entry in `[slug].astro` for navigability; populate Problem / What we built lightly using the README. No deep zone in Phase 1. |

### Product 5 — Varahamihir AI

| Field | Detail |
|---|---|
| Site today | Card on `/technologies` (gold "In Development" pill). Dedicated page at `/technologies/varahmihir` (note: spelling discrepancy — repo is `VarhamihirAI-Researcher` / `VarahamihirDevelopment`, site uses `varahmihir`. Diagnostic flag: confirm canonical spelling with Amit before deeper work) |
| Codebase | `VarhamihirAI-Researcher\VarahamihirDevelopment`; CLAUDE.md + requirements.txt present; internal ~v0.1–0.2; 826 unit tests passing as of 2026-04-08; full team-persona handoff in user's memory file |
| Circle 1 publishable | Area-scoped + commodity-scoped automated research across the open web; surfaces public-domain geological survey reports, academic literature, mineral-occurrence data; structured exploration intelligence brief with citations; designed for reconnaissance pre-field-mobilisation |
| Audience relevance | Commercial-explorer (primary — pre-rupee-in-field framing); Consultancy partners (secondary) |
| Recommendation | **Keep** as-is in Phase 1. Brief fluid-software mention (literature corpus is intrinsically evolving — natural fit). Full deep-zone deferred to Phase 2. |

### Service S1 — Gold Proxy Index

| Field | Detail |
|---|---|
| Site today | Mentioned on the legacy `/technologies.astro` (now deleted) and in homepage hero collateral elsewhere. Not currently visible after today's hub work. |
| Reality | **Service today; product in pipeline.** Methodology + data folder under `2Geoexploration LLC`; no standalone code repo. Methodology: structural / geological / analytical / mathematical proxies for coarse-gold deposition; solves the nugget effect. |
| Circle 1 publishable | Applicable to coarse-gold and nuggety deposits of any style; combines structural proximity, ore chemistry, and pathfinder element distributions; produces grade-proxy map; reduces infill drilling requirements |
| Audience relevance | Commercial-explorer (primary — coarse-gold operators); Consultancy partners (secondary) |
| Recommendation | **Add service card** to a new "Services" section on `/technologies` with "Service today · Product in pipeline" badge. No dedicated page in Phase 1. |

### Service S2 — Drill Database / QA-QC Corrections

| Field | Detail |
|---|---|
| Site today | Mentioned on legacy `/technologies.astro` (now deleted). |
| Reality | **Service today; product in pipeline.** No standalone code repo found. Multi-level QA/QC routines that clean drilling databases of errors by flagging locations of potential errors. |
| Circle 1 publishable | Multi-level QA/QC routines; data validation within defined ranges; 3-element / 5-element averages for numerical comparison; text-data multi-entry comparison; deviations flagged for supervisory verification |
| Audience relevance | Commercial-explorer (primary); Consultancy partners (secondary) |
| Recommendation | **Add service card** with "Service today · Product in pipeline" badge. No dedicated page in Phase 1. |

### Service S3 — Spectral Classification

| Field | Detail |
|---|---|
| Site today | Mentioned on legacy `/technologies.astro` (now deleted). |
| Reality | **Service today; product in pipeline.** Methodology referenced in brochures; no standalone code repo. |
| Circle 1 publishable | Spectral classification of mineral prospects over large regions; combines hyperspectral and multispectral signatures; methodology validated on AiRE's project portfolio |
| Audience relevance | Commercial-explorer (primary); Government (secondary) |
| Recommendation | **Add service card** with "Service today · Product in pipeline" badge. No dedicated page in Phase 1. |

### Items deliberately NOT on the site

- **CAGE-IN Geophysical Prospectivity** (v1.0.0 production-stable on disk) — subsumed into forthcoming Garud CAGE-IN Mineral Prospectivity Mapper per your direction.
- **CAGE-IN Alteration Prospectivity Mapper** (v0.6.0) — subsumed.
- **CAGE-IN Geochemical Parsing** (v0.3.0) — subsumed.
- **Ensemble Geochemical Prospectivity** (v1.0.0 production-stable) — subsumed. **Today's hub Roadmap callout incorrectly lists this as "queued" — must be corrected in the pre-Phase-1 patch.**
- **GRD Geosoft Grid Loader** — not an AiRE product per your direction; remove from any listing.

---

## A.3 Asset inventory + Publications backlog scoping

### Existing image assets (`src/assets/`)

Currently 31 files including: hero, geological_mapping, geospatial, geostatistics, cage-in_pic1, gold-proxy-index_pic1/2, drill-database-corrections_pic1/2, structural_modelling, mineral-intelligence, government-programs, exploration-skill-development, ai-geo-identifying-prospects, amit_tripathi (founder portrait), case studies pic 1–4, mineral-value-chain, skill-development, plus the 4 landing-page captures shipped today (cage-in-landing.png, bhumi3dmapper-landing.jpg, batch-gis-loader-landing.png, varahmihir-landing.png).

### Asset gap list per Phase 1 page

| Page | Needed | Have | Gap |
|---|---|---|---|
| Hub patch (Services section) | 3 service-card thumbnails (GPI, Drill DB, Spectral Classification) | Have gold-proxy-index_pic1, drill-database-corrections_pic1 | Need a Spectral Classification image — can synthesize from existing satellite/hyperspectral imagery, or new asset |
| Hub patch (OmniMiner card) | OmniMiner landing/preview image | None | Need one. If unavailable, reuse a Landsat/Sentinel composite from current assets as placeholder |
| CAGE-IN deep zone | Performance benchmark visualization (optional), validation map snippets (optional), architecture *prose* (no diagram per Circle 2 rules) | Have cage-in_pic1, cage-in-landing.png | Marginal — page can ship with existing assets; an architecture-diagram placeholder is not required |
| `/for/government` | Government-buyer imagery — official-looking but neutral; NCMM-aligned commodity visuals | Have mineral-intelligence, government-programs, mineral-value-chain | Sufficient |
| `/for/index` | Audience-track illustration | Adequate from existing | Sufficient |
| Homepage fluid-software panel | Optional small graphic | Adequate from existing | None required |
| Footer/about disclaimer | None | n/a | None |

### Publications backlog scoping

The current `/publications` page does not reflect the actual record. Per Amit, papers go back to **mid-1990s** with no master list maintained. This is a **build-from-scratch workstream**, not an audit.

**Suggested approach:**

1. **Source mining (1–2 weeks).**
   - Google Scholar query on "Amit Tripathi" + plausible co-authors, geology venues, India IDs
   - ResearchGate profile (if Amit has one — confirm)
   - ORCID lookup (confirm Amit's ORCID, if any)
   - Cross-reference against Dr. Tripathi's personal CV (paper copy or digital — Amit to point at the canonical file)
   - GoogleBooks for any chapter contributions
   - Mining Engineers' Journal / IGC / IIME / AusIMM proceedings indexes
   - Paper copies of conference proceedings in Amit's office, if any
2. **Citation normalization (3–5 days).**
   - Build BibTeX or CSL JSON list
   - Standardise on Chicago / IEEE / Vancouver — pick one for the site
   - Verify each citation: title, venue, year, page numbers, DOI where available
3. **Eyes-on pass with Amit (2–4 hours).**
   - Walk through each citation; flag any missing; flag any included that shouldn't be
4. **Site refresh (1 day).**
   - Update `/publications` page with the structured list
   - Add featured-publications anchor block on relevant pages (CAGE-IN deep zone, /for/government)

Estimated total: **2–4 weeks** of work, ~70% mine-able by me independently, ~30% requires Amit's input (point at sources, eyes-on pass).

**Phase 1 or early Phase 2?** Recommend treating as a parallel workstream starting in Phase 1 — the source mining can run in the background while the other Phase 1 pages ship.

### Case-study artefacts

Per your note, more case studies are available than the original brief surfaced — some named, some anonymised. Phase 2 blocker; please point at where these live when ready. **Not in Phase 1 scope.**

---

## A.4 Audience-segmentation analysis

### Current site (post today's work) — who it speaks to

- **Homepage hero** ("Tools built by exploration consultants — for exploration consultants") — speaks primarily to consultancy partners and consultants/explorer-CTOs. Does not address government, does not address strategic partners.
- **`/technologies` hub hero** ("For Exploration Consultants & Geoscience Teams") — same consultancy/explorer framing.
- **`/services`, `/case-studies`, `/team`, `/publications`** — generic mixed-audience.
- **No targeted institutional or strategic-partner content.**

### Who it should speak to

Per the brief, three audience tracks share a neutral home and split via `/for/{government,explorer,partner}`:

| Track | Audience | Lead with | De-emphasise |
|---|---|---|---|
| `/for/government` | GSI / State DGMs / MoM / NMET / NPEAs | NCMM alignment; Aatmanirbhar Bharat; Class-I local supplier; sovereign-by-design; India-resident processing; NPEA-ready; GFR Rule 166/194 procurement | Western reference clients |
| `/for/explorer` | TSX-V/TSX/ASX/AIM-listed juniors and majors; private explorers; consultancies | 30+ years founder experience; 60+ projects across 20+ countries; peer-reviewed methodology; NI 43-101 / JORC-aligned outputs; named Western reference clients (post-permission); PDAC visibility | Indian-government framing |
| `/for/partner` | NMDC / MECL / Vedanta / corporate venture arms / foreign mining majors | Technical depth + commercial flexibility + IP portfolio + roadmap | — |

### Recommendation: lighter `/for/{audience}` IA (you confirmed this)

- **`/for` parent**: neutral hub page explaining the three audience tracks, fluid-software anchor, CTAs into the three child pages
- **`/for/government`**: Phase 1, full content from Doc 1
- **`/for/explorer`**: Phase 1 stub, Phase 2 full (gated on case-study permission re-confirmation)
- **`/for/partner`**: Phase 1 stub, Phase 2 full (gated on strategic-partner conversations)
- **Header nav**: add a single `/for` entry between `/technologies` and `/projects`
- **Footer quickLinks**: do NOT add `/for` to footer (keeps the audience navigation a discovery via the hero, not a default scan path)

### Leakage management (binding)

- **Homepage** stays audience-neutral. No Aatmanirbhar Bharat / NCMM / Class-I language on `/`.
- **`/technologies` hub** stays consultancy/explorer-leaning (today's framing).
- **`/for/government`** is the ONLY place Indian-government language appears.
- **`/for/explorer`** does NOT mention Aatmanirbhar Bharat, NCMM, or Class-I.
- **`/for/partner`** sits in the middle; can reference both registers neutrally.

---

## A.5 Pre-Phase-1 patch to today's `/technologies` hub

Small follow-up PR before any Phase 1 page work. Five changes:

### A.5.1 Remove "Ensemble Geochem Prospectivity" from the Roadmap callout

Today's hub Roadmap callout reads: "Ensemble Geochem Prospectivity, NafaSell sales follow-up, and additional commodity-specific solvers are queued." Ensemble Geochem is **production-stable (v1.0.0)** and is being subsumed into Garud — not "queued."

**Recommendation:** Restructure the Roadmap callout into a forward-looking subsumption note (see A.5.5) OR delete the callout entirely. Cleaner if deleted — the subsumption note on the CAGE-IN card carries the message.

### A.5.2 Add OmniMiner card

Add a 5th product card to the product grid:

```ts
{
  slug: 'omniminer',
  name: 'OmniMiner',
  short: 'OmniMiner',
  tagline: 'Regional mineral reconnaissance from satellite imagery — spectral analysis for working geologists.',
  eyebrow: 'In Development · Regional Reconnaissance',
  status: 'In development',
  statusKind: 'gold' as const,
  img: /* TBD asset — reuse existing satellite/Landsat composite if no dedicated landing screenshot */,
}
```

Add corresponding entry to `src/pages/technologies/[slug].astro` `PRODUCTS` map and `getStaticPaths()`. Populate Problem / What we built lightly using the README.

### A.5.3 Add a Services section

Add a new section below the product grid (above the partner-pitch section). Three cards:

```ts
const services = [
  {
    slug: 'gold-proxy-index',  // no dedicated page in Phase 1; card links to /contact
    name: 'Gold Proxy Index',
    tagline: 'Methodology for coarse-gold deposit grade estimation — solves the nugget effect.',
    eyebrow: 'Service · Product in pipeline',
    img: goldProxyImg,
  },
  {
    slug: 'drill-database',
    name: 'Drill Database QA-QC',
    tagline: 'Multi-level corrections that clean drilling databases of data-entry errors.',
    eyebrow: 'Service · Product in pipeline',
    img: drillDbImg,
  },
  {
    slug: 'spectral-classification',
    name: 'Spectral Classification',
    tagline: 'Hyper- and multispectral classification of mineral prospects across large regions.',
    eyebrow: 'Service · Product in pipeline',
    img: /* TBD — synthesize from existing assets or new */,
  },
];
```

Visual treatment: same `card-dark` body, but a distinct eyebrow style (perhaps `text-geo-secondary` to distinguish service cards from product cards) and a "Service today · Product in pipeline" badge (similar to status pills but using `geo-secondary` border instead of gold/emerald).

Each service card links to `/contact?intent=service` for now; dedicated pages deferred to a future phase.

### A.5.4 Reconcile Bhumi3DMapper status

**Open dependency #1 from approved plan.** Folder name `_v1.0.0_dev` contradicts site's "Production ready" pill. Options:

- (a) Status pill stays "Production ready" — Amit confirms the folder rename simply lagged the stable release.
- (b) Status pill downgrades to "In testing" or "In development" — Amit confirms the card was overclaiming.

**This must resolve before the hub patch ships.** Ask Amit directly.

### A.5.5 Forward-looking subsumption + fluid-software note on the CAGE-IN card

Add a short strip below the CAGE-IN card body (similar visual treatment to the dual-audience strip on the homepage CAGE-IN feature card, but informational rather than navigational):

> **CAGE-IN is consolidating.** Multiple AiRE tools — geophysical, alteration, geochemical, and ensemble methods — are being unified into a forthcoming expanded product, **Garud CAGE-IN Mineral Prospectivity Mapper**. Built as AI-backed fluid software: the reasoning evolves as the geoscience literature evolves.

Circle 1 only. No mechanism details. No internal version numbers.

---

## A.6 Trust Center deferral rationale

Per Doc 2 + your approval: the Trust Center page is deferred to Phase 2+. Reasoning:

Most certifications referenced in the brief are unfiled or in-flight as of today:

| Credential | Status (Doc 2 + your notes) | Publishable today? |
|---|---|---|
| CIN U74999TG2017PTC115998 | Held since 2017 | Yes |
| PAN AAKCM9266D | Held; physical card re-issued under AiRE | Yes (corporate-identity block) |
| Udyam (MSME Micro/Services) | Re-registered under AiRE name (complete) | Yes (corporate-identity block) |
| GST | Trade-name amendment complete | Yes (corporate-identity block) |
| DPIIT Startup India recognition | Not filed (10-month window expires ~19 Mar 2027) | No |
| GeM seller registration | Not filed | No |
| NSIC SPRS | Not filed | No |
| QCI-NABET accreditation | Not filed | No |
| NPEA notification | Not filed (gated by QCI-NABET) | No |
| CERT-In audit | Not engaged (web platform not built yet) | No |
| ISO 27001 | Not certified | No |
| Patents (CAGE-IN methods) | Not filed | No |
| Trademarks (CAGE-IN, AiRE, Bhumi3DMapper, Varahmihir) | Not filed | No |
| Copyrights (plugin, engine, docs) | Not filed | No |

Publishing a Trust Center now would expose the gap. The right move is to publish a Trust Center in Phase 2+ once at least DPIIT (free, 2–4 weeks) and ideally NSIC SPRS (30–45 days) and CERT-In engagement have landed.

### Phase 1 footer/about disclaimer extension

Phase 1 extends only the existing corporate-identity disclaimer. Current footer reads (under the AiRE description):

> AI Resource Exploration (AIRE) is the operating entity, registered in India. GeoExploration LLC (Florida, est. 2012) is dormant; all active business operates through AIRE.

**Phase 1 extension:**

> AI Resource Exploration Private Limited (AiRE) is the operating entity, registered in India. AiRE was renamed from MPXG Exploration Private Limited by Special Resolution dated 02 January 2024 (Board Resolution 27 December 2023). CIN U74999TG2017PTC115998. PAN AAKCM9266D. Statutory transitions (PAN re-issue, GST trade-name amendment, Udyam re-registration in the AiRE name) are complete. GeoExploration LLC (Florida, est. 2012) is dormant; all active business operates through AiRE.

About page gets the same content as a "Corporate Identity" sub-section.

---

## Open dependencies — what blocks Phase 1

1. **Bhumi3DMapper status reconciliation** (Amit's call) — blocks A.5.4 (hub patch deploy).
2. **Varahmihir / Varahamihir spelling reconciliation** (Amit's call) — site uses `varahmihir`, repos use `Varahamihir` / `Varhamihir`. Cosmetic but should resolve before the deep zone work.
3. **Publications source pointer** (ResearchGate / ORCID / CV file path) — soft blocker for the parallel publications workstream.
4. **OmniMiner landing screenshot** (asset gap) — placeholder via existing satellite asset is acceptable; dedicated capture better.
5. **Spectral Classification card thumbnail** (asset gap) — same.

## Sign-off checklist for this diagnostic

Before Phase 1 work begins, please confirm:

- [ ] Per-product gap analysis (A.2) — every product/service framing is accurate and not fabricated
- [ ] Circle 1 publishable claims for CAGE-IN (A.2 product 1) — no Circle 2 leak
- [ ] Pre-Phase-1 hub patch list (A.5) — five changes are right
- [ ] Bhumi3DMapper status (A.5.4) — production-ready vs in-dev
- [ ] Varahmihir spelling (A.2 product 5) — canonical
- [ ] Trust Center deferral (A.6) — confirmed
- [ ] Footer/about disclaimer extension wording (A.6) — confirmed or edits

Once these confirmations land, the next deliverable is `docs/website-upgrade/design-tokens.md` (via the `design:design-system` skill), then the hub patch ships, then Phase 1 pages.
