# 76° — Seventy Six Degrees · The Design System · Project Memory (FINAL)

**Status:** Locked by Max, July 2026. This is the governing design system for every product built in this project. Read together with `DESIGN-STYLE-VOCABULARY.md` (style language) and `ECOSYSTEM-DESIGN-DNA.md` (multi-product architecture + per-system-type dials).

**Name:** **76°** — *Seventy Six Degrees.* Seven days · six (24H → 2+4=6) · the degree mark makes it a measurement, not a number. The degree symbol is NEVER omitted in the brand name or wordmark. Wordmark: `76°` — the six in the product seed color, the degree mark in soft neutral. Spoken/written form: "Seventy Six Degrees"; short form `76°`; code prefix `sv-` (seventy-six).

**Reference artifact:** `76-final.html` (in this folder) is the canonical visual reference — the ink-band ERP overview. When in doubt, open it.

**Companion volume:** `76-COMPONENT-BOOK.md` — the foolproof component specifications, accessibility contract, and the Slop Firewall. Both documents are binding; the Component Book wins on component-level detail.

---

## 1 · IDENTITY

76 is **flat, informational, corporate — paper on a wall.** Every component tells you information; none of them perform. The product and its function are the design. Light-first, always.

Taste sources (what Max approved): Shreyu's airy light shell and widget clarity; Surface/Bissaa/Triangl's ink header-band architecture with overlapping white cards; Stripe-level craft in restraint; instrument-panel discipline (mono metadata, tabular numerals).

Explicitly rejected — never propose again: gradients of any kind, layered/decorative shadows, glassmorphism, dark-first UI, large radii and pillowy cards, sidebars as primary nav, decorative sparkline clutter on stat cards, more than three colors on a screen, dial/gauge theatrics, "card that screams it's a card."

## 2 · THE SIX LAWS

1. **Paper on a wall.** White cards on the platinum wall, separated by contrast alone: no borders, one 1px breath of shadow (`0 1px 2px rgba(16,20,28,.05)`), radius 4px. Never blended, never floating.
2. **Three colors, total.** Ink (+ its soft/faint steps), the product seed, and functional green/red — which may only color *words and 6px dots*, never surfaces.
3. **Every widget has a type and one job.** No hybrids. If a widget needs two jobs, it is two widgets.
4. **Mono speaks metadata.** Labels, IDs, timestamps, column headers, sub-tabs, date ranges — always Fragment Mono, small caps tracking. Content speaks Hanken Grotesk.
5. **The band is the chrome.** All navigation and page context live in the ink band; the paper below is 100% work.
6. **Numbers are instrumentation.** Tabular numerals everywhere data lives; values bold; units and context soft; last period always drawn in line-gray next to this period's seed color.

## 3 · TOKENS (CSS custom properties)

```css
:root {
  /* neutrals — the wall & the ink */
  --sv-band:       #1B1F26;   /* ink band (header) */
  --sv-band-line:  #2C323B;   /* hairlines on band */
  --sv-band-soft:  #8A93A2;   /* soft text on band */
  --sv-wall:       #F2F3F5;   /* platinum background */
  --sv-paper:      #FFFFFF;   /* card surface */
  --sv-ink:        #1C2026;   /* primary text */
  --sv-ink-soft:   #667080;   /* secondary text */
  --sv-ink-faint:  #99A1AD;   /* labels, hints */
  --sv-line:       #E9EBEE;   /* internal hairlines */

  /* seed — Layer 3, per product (default: Cobalt) */
  --sv-seed:       #2C5BE0;
  --sv-seed-deep:  #1E44B4;   /* pressed */
  --sv-seed-tint:  #EEF3FE;   /* icon tiles, selected rows */

  /* functional — words and dots ONLY (contrast-verified on paper) */
  --sv-ok:         #14804A;   /* 4.98:1 on white — AA ✓ (was #178A50 @ 4.39, failed) */
  --sv-bad:        #C43D2E;   /* 5.18:1 on white — AA ✓ */

  /* geometry & elevation */
  --sv-r:          4px;       /* the only radius (avatars: 50%) */
  --sv-shadow:     0 1px 2px rgba(16,20,28,.05);   /* the only shadow */

  /* spacing scale (4px base) */
  --sv-s1: 4px; --sv-s2: 8px; --sv-s3: 12px; --sv-s4: 16px;
  --sv-s5: 20px; --sv-s6: 24px; --sv-s7: 32px; --sv-s8: 40px;
}
```

**Per-product seed registry** (extend as products are born — one seed per product, tint = seed at ~8% on white, deep = seed darkened ~20%):

| Product type | Seed name | Hex |
|---|---|---|
| ERP | Cobalt | #2C5BE0 |
| CRM | Verdigris | #12836F |
| POS | Signal | #D9531E |
| (next product) | pick a new named seed | — |

## 4 · TYPOGRAPHY

**Faces:** Hanken Grotesk (UI + content) · Fragment Mono (metadata). No other fonts in-product. Marketing sites may add a display face later (separate decision, Atlassian's brand/product split).

| Role | Face | Size/LH | Weight | Notes |
|---|---|---|---|---|
| Page greeting/H1 | Hanken | 27/1.2 | 800 | On band; secondary word in --sv-band-soft |
| Card title | Hanken | 13.5 | 700 | With soft subtitle 11.5 faint below |
| Stat value | Hanken | 24/1.1 | 800 | tabular-nums, letter-spacing -.025em |
| Body / table cell | Hanken | 13/1.5 | 500 | 600 for numeric cells |
| Soft subtitle / footnote | Hanken | 11.5 | 400–500 | --sv-ink-soft or faint |
| Micro label (widget) | Fragment Mono | 10 | 400 | UPPERCASE, tracking .13em, faint |
| Column header | Fragment Mono | 9.5 | 400 | UPPERCASE, tracking .1em |
| Sub-tabs / ranges | Fragment Mono | 10–10.5 | 400 | UPPERCASE, tracking .13em |
| IDs & timestamps | Fragment Mono | 10–11.5 | 400 | ORD-10482, 14:32 |

POS surfaces scale up: body 16–18, values 28–40, touch targets ≥48px — same faces, same laws.

## 5 · LAYOUT ARCHITECTURE — "THE INK BAND" (A1–A2)

Every 76 app screen is two zones:

**Zone 1 — Ink band** (--sv-band), three stacked rows, all inside a 1280px container:
1. **Topbar:** wordmark `76` + app name (hairline-separated) · horizontal nav (NEVER a sidebar) · search + avatar right. Active item: white text + 2px seed underline flush to the row's bottom hairline.
2. **Sub-tabs:** the active menu item's children, grouped as mono uppercase tabs directly under the header (Triangl pattern). Same underline behavior. If a section has no children, this row collapses.
3. **Page context (hero):** H1 greeting or page title → soft context line (date · scope · last sync). Right side: page-level actions (ghost buttons on band + one seed primary). Bottom padding ~68px to make room for the overlap.

**Zone 2 — Paper sheet** on the wall. The first row of cards **overlaps the band by ~44px** (`margin-top:-44px`) — paper pinned over the band edge. This overlap is the 76 signature move; every top-level page has it.

Grid: 12-col, 14px gutters. Common splits: 4× stat row; 1.7fr/1fr for chart+meter and table+activity rows. Density: ERP tables 13px text, 10.5px cell padding; rows hover in --sv-seed-tint.

## 6 · WIDGET TAXONOMY (Law 3) — each type, one question

- **S1 · Signature stat** *(the 76 stat — never use a generic KPI card)*. Three zones: **top** mono label left + colored delta right · **middle** seed-tint icon tile (34px) + bold tabular value · **foot** hairline-separated footnote that always says something useful ("$610K target · 79% with 7 days left"). Answers *how much, and so what.*
- **W2 · Progress** — value against target + one 3px bar + soft subtitle. *How far along.*
- **W3 · Trend** — value + flat single-weight line chart on hairline grid; comparison period in line-gray (#D6DAE0). No area fills. *Which direction.* (Report pages, not overviews.)
- **W4 · Meter list** — named items, each: soft label + bold value + 3px bar + faint real-number subtitle ("4,320 of 4,700 pallet positions"). *How is each part doing.*
- **W5 · Table** — optional in-card filter tabs (Bissaa pattern) under the card head; mono column headers; mono IDs; dot+word statuses; tabular right-aligned numbers. *What exactly happened.*
- **W6 · Activity/List** — mono timestamp column + sentence rows with bold entities. *What needs me.*

Card head is universal: bold title + faint subtitle left, one seed text-link action right. Never icon-only mystery menus for primary actions.

## 7 · COMPONENT RULES

- **Buttons:** Primary = seed fill, white text, radius 4, no shadow, pressed = seed-deep. Ghost = transparent + hairline. On-band ghost uses band-line hairline. POS buttons: same anatomy at ≥48px height; pressed state = tint fill, instant (<100ms).
- **Status:** always dot (6px, currentColor) + colored word. ok=green word, attention=soft-ink word, danger=red word. Never pills, never filled chips.
- **Forms:** labels 12/600 above field; fields white, hairline #D8DCE1 border, radius 4; focus = 1.5px seed border, no glow rings; inline validation in functional colors as text.
- **Charts:** flat only. Lines 2–2.5px; bars flat seed/ink-faint; hairline gridlines; no legends when two series can be labeled by color convention (seed = now, gray = before). Donuts/gauges banned in-product.
- **Motion:** 120–160ms opacity/transform fades; nothing moves layout; POS feedback instant. No springs, no bounces.
- **Empty states:** one soft sentence + one primary action. No illustrations in v1.
- **Accessibility:** all text pairs AA on their surface; status never color-only (dot+word); one h1 per page; heading levels never skip; keyboard: ⌘K global search, full arrow-key tables in ERP.

## 8 · STACK MAPPING (Laravel + Inertia + React + Tailwind)

- Tokens ship as CSS variables in `@layer base` (`:root` + `[data-seed="..."]` per product); Tailwind reads them via `theme.extend.colors` → `seed: 'var(--sv-seed)'` etc. Dark band values are literal, not a dark mode.
- Fonts: self-host Hanken Grotesk + Fragment Mono (variable where available) via `@font-face`; preload both.
- Components live in `resources/js/components/seventy-six/`: `Band`, `BandNav`, `BandSubTabs`, `PageHero`, `Sheet`, `StatS1`, `Progress`, `Trend`, `MeterList`, `DataTable`, `ActivityList`, `Button`, `StatusWord`, `Field`. One component per widget type — the taxonomy is the component API.
- Each product app sets `<html data-seed="cobalt">` (or its own registered seed). Nothing else may change per product.
- `font-variant-numeric: tabular-nums` is a utility applied to every numeric cell/value by default in `StatS1`/`DataTable`.

## 9 · PROPOSAL PROTOCOL (how we work from now on)

When a new product/screen is requested in this project: (1) identify system type → pull the density/type dials from `ECOSYSTEM-DESIGN-DNA.md` Part 3; (2) assign or reuse a seed from the registry; (3) compose screens ONLY from the widget taxonomy — inventing a new widget type requires naming it, giving it one job, and adding it to §6; (4) verify against the Six Laws before showing Max. Options presented to Max should be *placement/composition* variants, not re-theming — the theme is locked.
