/*
  team-intros.js
  Self-contained intro popups for AiRE team members (AI council seats + human specialists).
  Pure vanilla JS, no dependencies, runs from file:// offline.

  Wiring:
    Any element with a data-member="<key>" attribute becomes a clickable trigger.
    On click (or Enter/Space when focused) an accessible modal opens with that
    member's intro. Unknown keys are ignored (no crash).

  Styling:
    A <style> block is injected that reuses the site's existing CSS custom
    properties so the modal matches the brand:
      var(--bg) ivory card, var(--ink) headings, var(--text)/var(--text-soft)
      body, var(--copper)/var(--copper-deep) for the label + kicker, var(--radius)
      corners, soft shadow, var(--gold) only on the close affordance hover.
      Fraunces (var(--font-display)) for titles, Inter for body.
*/
(function () {
  "use strict";

  /* ---------------------------------------------------------------------- *
   * Data
   * ai   -> title = role_title, sub = discipline, meta = gate, body = intro
   * human-> title = full name,  sub = role,       meta = location, body = bio
   * ---------------------------------------------------------------------- */
  var TEAM_INTROS = {

    /* ----------------------------- AI SEATS ---------------------------- */
    "chief-geoscientist": {
      type: "ai",
      title: "Chief Geoscientist",
      sub: "Economic geology",
      meta: "Holds G3 (geology)",
      body: "Leads the geological interpretation behind every target we recommend, from mineral-system identification through drill-target geometry and alteration mapping. Every conclusion traces back to observable data - where information is missing, the gap is stated plainly rather than filled with plausible-sounding geology, and every drill-geometry call carries the arithmetic that supports it. Reads the operator's own technical record first, so field-proven knowledge is never silently overruled by an inference. Co-holds the geology review gate that decides whether a deposit interpretation is sound enough to put in front of a client."
    },
    "literature-standards": {
      type: "ai",
      title: "Literature & Standards Lead",
      sub: "Geological literature and reporting standards",
      meta: "Holds G3 (literature)",
      body: "Vets the published and gray-literature evidence behind every weighting, citation, and deposit model, judging each source on two independent axes: is it genuinely relevant, and is it scientifically sound. No weight ships without a verifiable citation, and combined or derived indicators are required to stand on their own evidence rather than borrow authority from their parts. Keeps the work aligned with recognised resource-reporting standards and will not sign off on placeholder values or undisclosed methodology. Co-holds the literature review gate alongside the Chief Geoscientist."
    },
    "chief-architect": {
      type: "ai",
      title: "Chief Architect",
      sub: "Systems architecture and project leadership",
      meta: "Coordinates G1 to G4",
      body: "Holds the whole system in view while still reviewing the detail, setting technical direction, resolving trade-offs, and assigning the right specialist to each problem. Runs the team's quality-gate sequence end to end, so no deliverable advances by assumption - sign-off is explicit and captured, never inferred from silence. Decisions are made once and recorded with their reasoning, so settled questions are not relitigated without new evidence. Puts correctness ahead of speed on the principle that fast-and-wrong is more expensive than slow-and-right."
    },
    "specification-lead": {
      type: "ai",
      title: "Specification Lead",
      sub: "Requirements & acceptance criteria",
      meta: "Holds G1",
      body: "Holds the first gate. The Specification Lead converts what a client wants into precise, written requirements where every input, output, and edge case is defined and every success condition is binary and measurable - so the work that follows builds the right thing, not a flawless version of the wrong thing. Ambiguity is escalated and resolved before any code is written, never quietly interpreted, and every requirement is checked against the wider system before it is locked. Domain detail is confirmed with the relevant geoscientist first, which removes costly rework downstream."
    },
    "lead-developer": {
      type: "ai",
      title: "Lead Developer",
      sub: "Software implementation",
      meta: "",
      body: "Builds the engine. The Lead Developer turns approved specifications into clean, well-structured software, favouring simple and reliable over clever, with automated tests shipped alongside every change rather than promised for later. The specification is read in full before a single line is written, because the most expensive error is a perfect implementation of the wrong behaviour. Every defect is closed with a test that would have caught it, and credentials are never written into code - keeping client data handling honest and the system dependable over the long run."
    },
    "qa-security": {
      type: "ai",
      title: "QA & Security Lead",
      sub: "Quality assurance & security",
      meta: "Holds G2",
      body: "Holds the quality and security gate. The QA & Security Lead does not celebrate that code works - it investigates whether the code can be made to fail, testing failure modes, boundary values, malformed inputs, and security-sensitive paths before anyone looks at the happy path. The production code itself is treated as the source of truth, not the description, so tests exercise the real behaviour. No defect is considered closed until a regression test exists and passes, which means the same bug never escapes twice."
    },
    "integration-lead": {
      type: "ai",
      title: "Integration Lead",
      sub: "Integration & data quality",
      meta: "Holds G2.5",
      body: "Lives at the seams where separate datasets and sensors meet - the places where individual checks fall silent and quiet inconsistencies are born. This seat verifies that imagery, geochemistry, and geophysics line up correctly across coordinate systems, resolutions, and grids before any result moves forward. \"The data looks reasonable\" is never accepted as proof; correctness must be demonstrable, with a repeatable test behind every clearance. It holds the integration and data-quality gate regardless of schedule pressure, because the cost of silent corruption is paid downstream."
    },
    "devops-reliability": {
      type: "ai",
      title: "DevOps & Reliability Lead",
      sub: "Operational readiness & reliability",
      meta: "Holds G3.6",
      body: "Makes the platform run reliably and recover cleanly, designing for failure modes rather than the happy path. Every recovery procedure is written down as it is built and actually tested - an untested backup is treated as no backup at all. This seat catalogs how a system can fail, monitors for trouble before it becomes an outage, and right-sizes every solution to the hardware actually in use. It holds the operational-readiness gate: nothing is called production-ready until each failure mode has a documented, proven recovery path."
    },
    "chief-of-staff": {
      type: "ai",
      title: "Chief of Staff",
      sub: "Coordination & operations",
      meta: "",
      body: "The always-on coordination layer that keeps the operation organized so the experts can focus on geology and decisions. This seat tracks project state across machines and systems, surfaces what matters, suppresses noise, and prepares briefings before they are asked for. It drafts external communications such as letters and proposals, but never sends anything without explicit approval - drafted, staged, and confirmed first. It does not make geological calls or write production logic; it makes sure the right people have what they need, when they need it."
    },
    "process-history": {
      type: "ai",
      title: "Process & History Lead",
      sub: "Process & institutional memory",
      meta: "",
      body: "Keeps the team's cadence and serves as its institutional memory - knowing what is in progress, what is blocked, and what comes next. Every significant decision is recorded in real time in an append-only history log that functions as the project's insurance policy, never edited after the fact. No blocker is allowed to sit silently; it is escalated with a recovery path attached - what is needed, from whom, and by when. Final sign-off always rests with the client, and nothing advances on assumed approval; the record only moves when approval is explicit."
    },
    "cfo": {
      type: "ai",
      title: "CFO",
      sub: "Cost stewardship and resource economics",
      meta: "",
      body: "The financial conscience of the team. It interrogates every computation, every model run, and every architectural choice with one question: is this the best use of resources, or are we spending because it is convenient? It never raises a cost objection without putting a cheaper, numbered alternative on the table, and it holds a standing check against any approach that would only run reliably by throwing more hardware at it. The result for clients is work that is right-sized and efficient, not gold-plated and wasteful."
    },
    "market-cultural-fit": {
      type: "ai",
      title: "Market & Cultural-Fit Lead",
      sub: "Market strategy and cultural fit",
      meta: "Holds G3.5",
      body: "The team's authority on how work lands with the people who ultimately have to trust it across East African markets. It reviews every customer-facing artifact through the eyes of the end audience and returns specific, actionable guidance rather than vague impressions, naming the trigger, the scenario, and the exact wording that will earn confidence. It will not approve local-language material that has been machine-translated without a named native-speaker reviewer behind it, because local language must be locally written. It holds the cultural-fit gate, so nothing customer-facing ships until it reads as genuinely trustworthy."
    },
    "adversarial-auditor": {
      type: "ai",
      title: "The Adversarial Auditor",
      sub: "Final audit and architectural integrity",
      meta: "Holds G-Final",
      body: "Holds the final audit. Its only job is to test whether the work has quietly drifted from what was actually intended, to challenge confident claims until they are backed by evidence, and to demand the benchmarked alternative before any decision is accepted as sound. It runs after every other check has passed, so a deliverable reaching the client has already survived a deliberately adversarial review for hidden assumptions, unverified shortcuts, and clever-but-fragile choices. Its standard is deliberately high and its highest compliment is simple: boring, functional, safe."
    },

    /* ------------------------------ HUMANS ----------------------------- */
    "amit-tripathi": {
      type: "human",
      title: "Dr. Amit Tripathi",
      sub: "Founder & Principal Consultant",
      meta: "",
      body: "Exploration geologist with three decades of experience across 20+ countries, holding a PhD in Structural Geology. He has led a major Cu-Au porphyry resource-growth program in South America and made greenfield discoveries in uranium and nickel laterite across Africa. He is a former Research Fellow with the Department of Atomic Energy of India and CSIR India, the author of several peer-reviewed publications, and the inventor of the CAGE-IN technology."
    },
    "ankit-tripathi": {
      type: "human",
      title: "Ankit Tripathi",
      sub: "General Manager",
      meta: "",
      body: "Environmental Scientist and Business Management Specialist overseeing operations and client engagement at AiRE."
    },
    "vn-vasudev": {
      type: "human",
      title: "Dr. V.N. Vasudev",
      sub: "Advisor - Economic Geology",
      meta: "India",
      body: "Holds a Ph.D. in Economic Geology with 45 years in exploration and research. He has discovered multiple major gold deposits and copper-mine extensions in Asia, and has explored across 42 countries for gold, copper, lead, zinc, nickel, iron ore, and PGE. He is co-founder of Geomysore Services, a former CEO of MPXG Exploration, and Assistant Editor of the Journal of the Geological Society of India."
    },
    "bhabesh-sarkar": {
      type: "human",
      title: "Prof. Bhabesh C. Sarkar",
      sub: "Advisor - Resource Evaluation & Geostatistics",
      meta: "India",
      body: "Brings 45+ years in geostatistics across industry and elite academia. He is currently Professor of Geostatistics at IIT Bombay, formerly Professor (HAG) at IIT(ISM) Dhanbad and Director at AICTE, with expertise in mineral resource evaluation and computerisation of mining geostatistics. He has authored 128+ publications, 8 books (including a widely cited Elsevier title), and 13 patents. He is a recipient of the National Geoscience Award and a Distinguished Alumnus of IIT Kharagpur."
    },
    "chris-ainsworth": {
      type: "human",
      title: "Chris Ainsworth",
      sub: "Advisor - Exploration",
      meta: "South Africa",
      body: "Holds an M.Sc. in Mineral Exploration with 33 years in exploration and mining geology across Africa, including a major bauxite exploration program. His expertise spans underground and peripheral exploration, structural geology, lateritic Ni, layered-igneous-complex Ni-PGE, kimberlite diamond, and compliant QA/QC. He is a former Chief Geologist / Mineral Resource Manager at Randgold Resources, founder of Chris Ainsworth Consulting, and Principal Consultant at MPXG Exploration."
    },
    "richard-hornsey": {
      type: "human",
      title: "Richard Hornsey",
      sub: "Advisor - Ni-Platinum Exploration",
      meta: "South Africa",
      body: "A leading Ni-PGM sulphide and economic geologist who earned a Research MSc cum laude in massive-sulphide geology. He has developed Ni-sulphide mines and led a platinum-mine feasibility study, and is a former Exploration Manager (Southern Hemisphere PGM) at Lonmin, COO at African Nickel, and Global Nickel Project Generation Leader at MMG. He has been an independent consultant since 2017 for sulphide and laterite Ni, PGM, Cu, Au, and Natural Hydrogen, and is the author of conference and research papers."
    },
    "roisin-goodman": {
      type: "human",
      title: "Roisin Goodman",
      sub: "Advisor - Exploration",
      meta: "Ireland",
      body: "Holds a B.Sc. in Geology with 36 years in exploration and consulting, and is an AIM, AIM+ and NI 43-101 compliant-reporting and certification specialist. Her expertise spans orogenic gold, lithogeochemistry, pegmatite Sn-W-COLTAN, MVT base metals, Ni-laterite, and geothermal exploration across Africa, Europe, Greenland, and Latin America. She is a former Exploration Manager at Samta Mining and Minerals, Project Manager at SLR / CSA Group, and Project Geologist on a Zn-Pb mine."
    },
    "aps-chandi": {
      type: "human",
      title: "A.P.S. Chandi",
      sub: "Advisor - Mining",
      meta: "India",
      body: "A Mining Engineer with 34 years in underground mining, holding a 1st-class Mine Manager's Certificate of Competency (Metalliferous, unrestricted), a B.Eng. in Mining from the University of Jodhpur, and CESPROMING from Ecole des Mines de Paris. He has spent seven years on a large mine in the Middle East and 24 years in underground lead-zinc mines in Asia, including a head-of-planning role at a major underground operation. He is a recognised Qualified Person for mining projects."
    },
    "mamadouba-yansane": {
      type: "human",
      title: "Mamadouba Yansane",
      sub: "Geology Specialist",
      meta: "Guinea",
      body: "Was part of the team that explored major iron-ore deposits and supervised drilling programs for major pre-feasibility and feasibility studies at Rio Tinto. He has experience in gold, iron, bauxite, and base metals across West Africa, with 23 years in exploration. He is certified in Project Management from the University of British Columbia."
    },
    "krishna-prasad": {
      type: "human",
      title: "Krishna Prasad",
      sub: "Geophysics Specialist",
      meta: "India",
      body: "Holds an M.Sc.(Tech) in Geophysics with 22 years of exploration experience across base metals, gold, PGE, hydrocarbons, and geotechnical applications. His methods include ground magnetics, time-domain EM, gravity, electrical methods, and 2D/3D seismic. His projects span India, Tanzania, Sudan, Uganda, DRC, Guinea, and the USA."
    },
    "vikas-srivastava": {
      type: "human",
      title: "Dr. Vikas Srivastava",
      sub: "Remote Sensing & GIS",
      meta: "India",
      body: "Holds a Ph.D. in Remote Sensing and GIS with 14 years in geological, geophysical, and geospatial exploration management. He is proficient in Geosoft Oasis Montaj, ArcGIS, Micromine, ERDAS Imagine, ENVI, Python, MATLAB, and FORTRAN. He has held former roles at SRK Consulting, IIT BHU, Rolta, and the Samta Group."
    },
    "ibrahim-aouami": {
      type: "human",
      title: "Ibrahim Aouami",
      sub: "Senior Geologist",
      meta: "Niger",
      body: "Holds an M.Sc. in Geology with 17 years in exploration. He served as Exploration Site Manager for Goviex Uranium during a major uranium exploration program in West Africa, supervising large-scale drilling programs. His experience covers uranium, nickel-laterite, and gold projects across West Africa, French Guyana, and DRC."
    },
    "n-ganesh": {
      type: "human",
      title: "N. Ganesh",
      sub: "Structural Geologist",
      meta: "India",
      body: "A specialist in structural controls on mineralization and project-scale geological modeling for AiRE."
    },
    "niki-kiza-oliver": {
      type: "human",
      title: "Niki Kiza Oliver",
      sub: "Geologist",
      meta: "DR Congo",
      body: "Brings broad experience across multiple gold exploration projects in Africa and beyond."
    },
    "dolma-ray": {
      type: "human",
      title: "Dolma Ray",
      sub: "Resource Modeler",
      meta: "India",
      body: "A specialist in 3D resource modeling and geostatistical analysis for compliant resource estimation."
    },
    "timothy-kwihangana": {
      type: "human",
      title: "Timothy Kwihangana",
      sub: "Country Director - Uganda",
      meta: "Uganda",
      body: "Leads on-ground operations and stakeholder engagement for AiRE's Uganda projects."
    }
  };

  /* ---------------------------------------------------------------------- *
   * Helpers
   * ---------------------------------------------------------------------- */
  function escapeHtml(str) {
    if (str == null) { return ""; }
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------------------------------------------------------------------- *
   * Injected styles (uses the site's existing CSS custom properties)
   * ---------------------------------------------------------------------- */
  function injectStyles() {
    if (document.getElementById("team-intros-style")) { return; }
    var css = [
      ".ti-overlay{",
      "  position:fixed; inset:0; z-index:1000;",
      "  display:flex; align-items:center; justify-content:center;",
      "  padding:24px;",
      "  background:rgba(16,32,43,.55);",
      "  opacity:0; visibility:hidden;",
      "  transition:opacity .22s ease, visibility .22s ease;",
      "}",
      ".ti-overlay.is-open{ opacity:1; visibility:visible; }",
      "",
      ".ti-card{",
      "  position:relative;",
      "  width:100%; max-width:620px;",
      "  max-height:86vh; overflow-y:auto;",
      "  background:var(--bg, #FDFBF7);",
      "  color:var(--text, #1A1A1A);",
      "  border-radius:var(--radius, 14px);",
      "  box-shadow:0 32px 70px -28px rgba(16,32,43,.55), 0 8px 24px -16px rgba(16,32,43,.35);",
      "  padding:38px 40px 34px;",
      "  transform:translateY(14px) scale(.985);",
      "  transition:transform .22s ease;",
      "}",
      ".ti-overlay.is-open .ti-card{ transform:translateY(0) scale(1); }",
      "",
      ".ti-kicker{",
      "  font-family:'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;",
      "  font-size:.68rem; font-weight:600;",
      "  letter-spacing:.13em; text-transform:uppercase;",
      "  color:var(--copper, #9a5630);",
      "  margin:0 0 .85em;",
      "}",
      ".ti-title{",
      "  font-family:var(--font-display, 'Fraunces', Georgia, serif);",
      "  font-weight:600; line-height:1.12;",
      "  font-size:1.85rem;",
      "  color:var(--ink, #10202b);",
      "  margin:0 0 .25em; padding-right:34px;",
      "}",
      ".ti-sub{",
      "  font-family:'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;",
      "  font-size:.95rem; font-weight:500;",
      "  color:var(--copper-deep, #7a4324);",
      "  margin:0;",
      "}",
      ".ti-meta{",
      "  display:inline-block;",
      "  font-family:'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;",
      "  font-size:.74rem; font-weight:600;",
      "  letter-spacing:.04em;",
      "  color:var(--text-soft, #5b6a73);",
      "  margin:.85em 0 0;",
      "}",
      ".ti-rule{",
      "  height:1px; border:0; margin:1.25em 0 1.15em;",
      "  background:rgba(122,67,36,.18);",
      "}",
      ".ti-body{",
      "  font-family:'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;",
      "  font-size:1rem; line-height:1.72;",
      "  color:var(--text, #1A1A1A);",
      "  margin:0;",
      "}",
      "",
      ".ti-close{",
      "  position:absolute; top:16px; right:16px;",
      "  width:38px; height:38px;",
      "  display:flex; align-items:center; justify-content:center;",
      "  background:transparent; border:0;",
      "  border-radius:50%;",
      "  font-size:1.5rem; line-height:1;",
      "  color:var(--text-soft, #5b6a73);",
      "  cursor:pointer;",
      "  transition:color .15s ease, background-color .15s ease;",
      "}",
      ".ti-close:hover{",
      "  color:var(--gold, #b58a1f);",          /* gold used ONLY here */
      "  background:rgba(181,138,31,.10);",
      "}",
      ".ti-close:focus-visible{",
      "  outline:2px solid var(--copper, #9a5630); outline-offset:2px;",
      "}",
      "",
      "[data-member]{ cursor:pointer; transition:opacity .15s ease; }",
      "[data-member]:hover{ opacity:.82; }",
      "[data-member]:focus-visible{",
      "  outline:2px solid var(--copper, #9a5630); outline-offset:3px;",
      "  border-radius:4px;",
      "}",
      "",
      "@media (max-width:680px){",
      "  .ti-overlay{ align-items:flex-end; padding:0; }",
      "  .ti-card{",
      "    max-width:100%; width:100%;",
      "    max-height:92vh;",
      "    border-radius:var(--radius, 14px) var(--radius, 14px) 0 0;",
      "    padding:30px 22px 26px;",
      "    transform:translateY(100%);",
      "  }",
      "  .ti-overlay.is-open .ti-card{ transform:translateY(0); }",
      "  .ti-title{ font-size:1.5rem; }",
      "}",
      "",
      "@media (prefers-reduced-motion: reduce){",
      "  .ti-overlay, .ti-card, [data-member]{ transition:none !important; }",
      "  .ti-card{ transform:none !important; }",
      "}"
    ].join("\n");

    var style = document.createElement("style");
    style.id = "team-intros-style";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  /* ---------------------------------------------------------------------- *
   * Modal construction + behaviour
   * ---------------------------------------------------------------------- */
  var overlay = null;
  var card = null;
  var closeBtn = null;
  var elKicker = null;
  var elTitle = null;
  var elSub = null;
  var elMeta = null;
  var elBody = null;
  var lastTrigger = null;

  function buildModal() {
    if (overlay) { return; }

    overlay = document.createElement("div");
    overlay.className = "ti-overlay";

    card = document.createElement("div");
    card.className = "ti-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "ti-title");
    card.setAttribute("aria-describedby", "ti-body");
    card.setAttribute("tabindex", "-1");

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ti-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&#215;"; /* multiplication sign as the X glyph */

    elKicker = document.createElement("p");
    elKicker.className = "ti-kicker";

    elTitle = document.createElement("h2");
    elTitle.className = "ti-title";
    elTitle.id = "ti-title";

    elSub = document.createElement("p");
    elSub.className = "ti-sub";

    elMeta = document.createElement("p");
    elMeta.className = "ti-meta";

    var rule = document.createElement("hr");
    rule.className = "ti-rule";

    elBody = document.createElement("p");
    elBody.className = "ti-body";
    elBody.id = "ti-body";

    card.appendChild(closeBtn);
    card.appendChild(elKicker);
    card.appendChild(elTitle);
    card.appendChild(elSub);
    card.appendChild(elMeta);
    card.appendChild(rule);
    card.appendChild(elBody);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    /* close interactions */
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("mousedown", function (e) {
      /* only close when the press starts on the dimmed backdrop itself */
      if (e.target === overlay) { closeModal(); }
    });
    document.addEventListener("keydown", onKeydown);
  }

  function getFocusable() {
    if (!card) { return []; }
    var nodes = card.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.offsetWidth > 0 || n.offsetHeight > 0 || n === document.activeElement) {
        list.push(n);
      }
    }
    return list;
  }

  function onKeydown(e) {
    if (!overlay || !overlay.classList.contains("is-open")) { return; }

    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      var focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        closeBtn.focus();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === card || !card.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  function openModal(key, trigger) {
    var data = TEAM_INTROS[key];
    if (!data) { return; } /* unknown key -> ignore, no crash */

    buildModal();
    lastTrigger = trigger || null;

    var kicker = data.type === "ai" ? "AI council seat" : "AiRE specialist";
    elKicker.textContent = kicker;
    elTitle.textContent = data.title || "";
    elSub.textContent = data.sub || "";

    if (data.meta && String(data.meta).trim() !== "") {
      elMeta.textContent = data.meta;
      elMeta.style.display = "";
    } else {
      elMeta.textContent = "";
      elMeta.style.display = "none";
    }

    elBody.textContent = data.body || "";

    overlay.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    /* focus moves to the close button on open */
    window.setTimeout(function () { closeBtn.focus(); }, 0);
  }

  function closeModal() {
    if (!overlay) { return; }
    overlay.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    /* focus returns to the trigger on close */
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  /* ---------------------------------------------------------------------- *
   * Trigger wiring
   * ---------------------------------------------------------------------- */
  function wireTrigger(el) {
    if (el.getAttribute("data-ti-wired") === "1") { return; }

    var key = el.getAttribute("data-member");
    if (!key || !TEAM_INTROS[key]) {
      /* unknown / empty key -> leave the element alone, do not wire */
      return;
    }
    el.setAttribute("data-ti-wired", "1");

    /* keyboard accessibility (skip native buttons/links that already have it) */
    var tag = el.tagName ? el.tagName.toLowerCase() : "";
    var isNativeInteractive = (tag === "button" || tag === "a");
    if (!isNativeInteractive) {
      if (!el.hasAttribute("role")) { el.setAttribute("role", "button"); }
      if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "0"); }
    }
    if (!el.hasAttribute("aria-haspopup")) { el.setAttribute("aria-haspopup", "dialog"); }
    el.style.cursor = "pointer";

    el.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(key, el);
    });

    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        openModal(key, el);
      }
    });
  }

  function wireAll() {
    injectStyles();
    var triggers = document.querySelectorAll("[data-member]");
    for (var i = 0; i < triggers.length; i++) {
      wireTrigger(triggers[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireAll);
  } else {
    wireAll();
  }

  /* Expose a tiny API in case pages add members dynamically. */
  window.TeamIntros = {
    data: TEAM_INTROS,
    open: function (key) { openModal(key, null); },
    close: closeModal,
    refresh: wireAll
  };

})();
