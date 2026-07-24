# Ecosystem Design DNA — Project Memory

**Purpose:** How world-class companies run ONE design language across MANY products — and the decision framework we use in this project when handed a CRM, ERP, POS, or any other system type. Companion to `DESIGN-STYLE-VOCABULARY.md`. Researched July 2026 from atlassian.design, design.google / Material 3 Expressive, and astryx.atmeta.com (Meta).

---

## PART 1 — HOW THE BIG ECOSYSTEMS DO IT

### Atlassian Design System (Jira, Confluence, Trello, Bitbucket…)

**Philosophy:** "Better teamwork by design" — one unified language so every app feels cohesive and familiar.

**What to steal:**

- **Tokens as the single source of truth.** Semantic naming that encodes intent, not value: `color.text.accent.red`, `elevation.surface.hovered`. Designers and devs read the same vocabulary; dark mode is a token swap, not a redesign.
- **Two-font strategy:** `Atlassian Sans` + `Atlassian Mono` inside products; `Charlie Sans` reserved for brand/marketing. Product type and brand type are DIFFERENT JOBS — never conflate them.
- **Enterprise-tuned type scale:** 7 heading sizes (32→12px, all Bold), body default is **14px/20** (not 16) with 12px for fine print — density is a first-class decision, not an afterthought. Dedicated **"Metric" styles** (bold 28/24/16) exclusively for numbers/KPIs.
- **Rem-based tokens** for accessibility scaling; heading levels used semantically (one h1, no skipping) for a11y.
- Dedicated **AI pattern collection (Rovo UI)** — AI surfaces get their own pattern language inside the same system rather than ad-hoc sparkle-gradients.

**Product uniqueness comes from:** product accent color + logo/wordmark, illustration style, domain-specific components — never from changing the grid, type scale, or token contract.

### Google / Material 3 Expressive (Search, Gmail, Android, Workspace…)

**Philosophy:** One adaptive system, personal to every user, expressive per product. M3 Expressive is backed by 46 research studies / 18,000+ participants showing expressive design measurably improves usability across ages.

**What to steal:**

- **Dynamic color via HCT:** brand seed color → algorithmically generated tonal palettes → **semantic color ROLES** (primary/on-primary/surface/surface-container…). Products and even users retheme without breaking contrast — because roles, not hexes, are the contract.
- **Shape as brand:** a shape library (35 shapes, corner-radius tokens, shape morphing) makes geometry itself a personality dial. Radius is identity, not decoration.
- **Motion physics:** springs (stiffness/damping) replaced duration/easing curves — motion has a *character* per product (calm vs zippy) on one physical system.
- **Emphasized type styles:** the scale includes expressive/emphasized variants (Google Sans Flex, variable) so hierarchy can flex from utilitarian to editorial within one ramp.
- **Material Theme Builder** mindset: theming is generative and tool-driven, not hand-picked hexes.

**Product uniqueness comes from:** seed color, shape character, motion character, and expression level (how emphasized the type/shapes are) — all dials on the SAME system.

### Meta / Astryx (open-source, powers 13,000+ internal apps)

**Philosophy:** "A design system that adapts to your workflow, not the other way around." Opinionated foundations, flexible skin.

**What to steal:**

- **Personality = a swappable theme package.** One component contract (160+ accessible React components), seven named themes — `neutral` (muted minimal), `butter`, `chocolate`, `gothic` (dark-only), `matcha`, `stone`, `y2k`. An entire mood is an npm install. This is the cleanest model of "same skeleton, different soul."
- **CSS custom properties + cascade layers** (`@layer reset`, `@layer astryx-base`) → tokens override cleanly under Tailwind or any stack.
- **Category subpath imports** (`core/Button`, `core/Layout`) — bundle discipline built into the architecture.
- **Agent-ready by design:** CLI + MCP (`astryx component`, `astryx init` generating AGENTS.md/CLAUDE.md) — the design system is documented FOR AI collaborators, matching exactly how we work in this project.

### Zoho (context, from general knowledge — verify before citing)

One corporate brand; ~50 apps each with its own accent color and app icon on a shared shell, nav, and component grammar. The lesson: at large app counts, **the app icon + accent hue carries product identity**; everything else must stay boringly consistent or the suite feels broken.

---

## PART 2 — THE UNIVERSAL PATTERN (our working model)

Every successful ecosystem separates three layers. We adopt this as law:

**Layer 1 — Invariant Core (never changes between products):**
Grid & breakpoints, spacing scale, type scale & hierarchy rules, component behavior/anatomy, interaction states, accessibility contracts, motion physics engine, token naming schema.

**Layer 2 — Semantic Token Skin (theme-able):**
Color roles (not hexes), elevation, radius tokens, font-family tokens, motion-character tokens. Dark mode and per-product theming live here.

**Layer 3 — Product Expression (where uniqueness lives):**
Seed/accent color, shape character (radius personality), motion character (calm↔springy), illustration & icon accent style, density default, expression level (utilitarian↔emphasized type), product wordmark.

**Rule:** A new product in the family = new Layer 3 + occasionally a Layer 2 theme. Touching Layer 1 for one product is a design-system bug.

---

## PART 3 — PER-SYSTEM-TYPE DECISION FRAMEWORK

When handed a system type, decide these seven dials FIRST: density, type scale default, radius, color temperature, nav pattern, motion character, font pairing. Defaults below (all fonts are deliberate picks — raw Inter/Roboto stays banned):

### CRM (pipeline, contacts, comms)
- Density: medium-high; body 14px, 13px in tables; generous row hover states.
- Layout: list-detail split views, right-side record panels, global command bar (⌘K).
- Radius 6–8px; cool neutral surfaces + ONE warm accent for pipeline stages; strong status chips.
- Type: grotesque with high x-height + tabular numerals — IBM Plex Sans, Public Sans, or Geist; mono for IDs (IBM Plex Mono).
- Motion: fast and minimal (150–200ms); optimistic UI on drag (kanban).
- Style DNA: Utilitarian × Bento (dashboards only).

### ERP (finance, inventory, manufacturing)
- Density: MAXIMUM; body 13–14px, tables 12–13px, 32–36px row heights, fixed headers, frozen columns.
- Layout: left rail modules > tabs > tables; keyboard-first (arrow-key cell nav, shortcuts everywhere); zero decoration in work areas.
- Radius 2–4px (squarer = more serious); near-monochrome surfaces; color RESERVED for status semantics (success/warn/danger/info) — Atlassian's discipline.
- Type: neutral grotesque + mandatory tabular/lining numerals — IBM Plex Sans, Söhne, or Untitled Sans; numbers may set in mono for column alignment.
- Motion: near-none (100–150ms fades); no layout-shifting animation ever.
- Style DNA: Utilitarian × Bauhaus. Metric type styles for KPIs.

### POS / Kiosk
- Density: LOW; touch targets ≥48–64px, body 16–18px, totals 28–40px bold.
- Layout: product grid + persistent cart column; max 2-level navigation; error-proof flows (confirm destructive, big undo).
- Radius 10–16px (friendly, fat buttons); very high contrast (sunlight/glare); tactile pressed states (scale + shade shift, <100ms feedback).
- Type: rounded-but-clear sans at large sizes — Figtree, General Sans, or DM Sans; huge tabular numerals for prices.
- Motion: instant feedback, zero decorative motion; latency reads as broken.
- Style DNA: Neo-Brutalist clarity (bold flat color states) on Utilitarian bones.

### Project Management / Collaboration
- Density: medium; 14px body; card + table + timeline views of the same data.
- Radius 8px; calm neutrals + per-project accent labels; presence/avatar system.
- Type: friendly grotesque — Geist, Plus Jakarta Sans; mono for issue keys.
- Motion: medium character; drag-drop physicality (springs, Material-style).
- Style DNA: Bento × Japandi calm.

### Fintech / Trading dashboards
- Density: high; real-time numbers NEVER shift layout (fixed-width tabular/mono numerals).
- Radius 4–6px; dark-mode-first is legitimate here; strict semantic triad (green/red/amber) tuned for color-blind safety (add shape/direction cues).
- Type: precision grotesque + mono pairing — Söhne + Söhne Mono, or IBM Plex Sans + Plex Mono.
- Motion: value-change ticks (flash fade), sub-100ms; spring physics only on panels, never on data.
- Style DNA: Utilitarian precision; Glassmorphism at most on marketing shell, never on data surfaces.

### Health & Wellness
- Density: low-medium; body 16px; generous line-height (1.6+).
- Radius 12–16px; warm off-white surfaces, muted greens/blues; NEVER punitive red for missed goals — neutral amber + supportive copy.
- Type: humanist sans — Source Sans 3, Nunito Sans, or Fraunces (display) for warmth.
- Motion: slow and soft (250–350ms, gentle springs); breathing-room animations.
- Style DNA: Japandi × Wabi Sabi; restrained Aurora for ambient/progress moments only.

### HRMS / Internal portals
- Density: medium; forms are the core screen — master form layout, inline validation, autosave.
- Radius 8px; approachable accent (people-centric warmth) on neutral shell.
- Type: Public Sans or Plus Jakarta Sans.
- Style DNA: Bento overview + Utilitarian forms.

### E-commerce admin / Marketplace back-office
- Density: high tables + image-heavy grids; thumbnail discipline (fixed ratios).
- Radius 6–8px; neutral shell so product imagery carries color.
- Type: Geist or Untitled Sans; tabular numerals for orders/revenue.
- Style DNA: Utilitarian × Bento.

### Marketing sites for any of the above
- The ONE place Layer-3 expression goes loud: display type, brand color saturation, editorial layouts, motion storytelling. The app stays quiet; the site sells the story. (Atlassian's Charlie Sans split.)

---

## PART 4 — WHAT "BEST OF ALL WORLDS" MEANS FOR MAX'S SYSTEM

The synthesis target for our own design system (drafted separately once identity questions are answered):

1. **Atlassian's token discipline + density realism** — semantic token naming, 14px enterprise default, Metric number styles, brand/product font split.
2. **Google's expression dials** — seed-color → role-based theming (HCT thinking), radius-as-personality, motion-as-character (physics, not durations), expression level per product.
3. **Meta's theme-package model** — every product = a named theme package on one component contract; cascade-layer CSS variables; agent-ready docs (the system ships with its own CLAUDE.md so AI collaborators build on-system).
4. **Zoho's suite lesson** — accent + icon carry app identity; the shell stays constant.
5. **Our anti-slop layer** — style vocabulary integration (each theme names its style DNA from DESIGN-STYLE-VOCABULARY.md), banned-default enforcement, per-industry dial presets from Part 3.

**Sources:** atlassian.design (foundations/typography, foundations/tokens), design.google, m3.material.io, astryx.atmeta.com/docs, supercharge.design/blog/material-3-expressive.
