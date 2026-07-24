# 76° — The Component Book · Foolproof Specifications

**Companion to `76-DESIGN-SYSTEM.md`. Binding for every screen shipped in this project.** The purpose of this volume is that no human or AI collaborator can produce off-system UI even by accident. Every component has: one job, a fixed anatomy, enumerated states, an accessibility contract, and a Don't list. Anything not specified here defaults to the Six Laws; anything that contradicts them is a defect.

---

## PART A — THE SLOP FIREWALL (machine-checkable)

These rules are written to be lintable. Grep the codebase; any hit is a violation.

**A1 · Banned CSS — zero tolerance in product code:**

- `linear-gradient|radial-gradient|conic-gradient` — no gradients, ever, including "subtle" ones.
- `backdrop-filter|blur(` — no glassmorphism.
- `border-radius` values other than `var(--sv-r)` (4px), `50%` (avatars/dots), or `2px`–`3px` (bars). No 8, no 12, no 16, no `9999px` pills.
- `box-shadow` values other than `var(--sv-shadow)`. No stacked shadows, no colored glows, no inset "depth."
- `text-shadow`, `filter: drop-shadow` — never.
- Any hex/rgb/hsl color literal outside `tokens.css`. Components reference tokens only.
- `animation` durations > 200ms; any `transition` on layout properties (width/height/top/left/margin); keyframe bounces/springs.
- `!important` — a component that needs it is mis-structured.
- Font families other than Hanken Grotesk / Fragment Mono (system stack fallbacks only).

**A2 · Banned patterns:**

- Sidebars as primary navigation. Nav is horizontal in the band. Full stop.
- Donut, pie, radial, and gauge charts in product screens. (W4 Meter list replaces them.)
- Filled status pills/badges/chips. Status = 6px dot + colored word.
- Icon-only buttons for primary actions; mystery-meat "⋯" as the only path to an action.
- Skeleton shimmer animations (use static skeleton blocks at `--sv-wall`).
- Emojis in product UI. Decorative illustrations in v1. Stock-photo cards.
- Toasts for errors that belong inline next to the field that caused them.
- More than one seed-colored primary button visible per view region.
- Dark mode. 76° is light-first only until Max repeals this line.
- KPI cards that are not the S1 anatomy. "Generic admin widget" is a defect class.

**A3 · Banned copy (UX writing):**

- Exclamation marks. "Oops", "Uh oh", "Whoops", "Something went wrong" without saying *what*.
- "Please" at the start of error messages; blame-the-user phrasing.
- Empty enthusiasm ("Awesome!", "Great job!"). 76° speaks like a competent colleague: calm, factual, specific.
- Vague CTAs: "Click here", "Learn more", "Submit". Buttons name the action's object: "Create order", "Export July", "Approve PO-2291".

**A4 · Required (presence-checkable):**

- `font-variant-numeric: tabular-nums` on every element that renders a number that can change.
- Every `<table>` numeric column right-aligned; every ID cell in Fragment Mono.
- Every card: exactly one `--sv-shadow`, radius `--sv-r`, background `--sv-paper`, zero border.
- Every screen: one `<h1>`, heading levels unskipped, one `<main>`, band nav in `<nav aria-label="Primary">`, sub-tabs in `<nav aria-label="Section">`.
- Every interactive element: visible focus state (spec in Part C). Every icon: `aria-hidden="true"` with an adjacent text label, or an `aria-label` if genuinely alone (allowed only in the topbar utility cluster).

---

## PART B — COMPONENT SPECIFICATIONS

Naming: React components in `resources/js/components/seventy-six/`, prefix-free filenames, exported as listed. Class prefix `sv-`.

### B1 · Band (chrome zone)

**`Band`** — the ink container. Three rows max (Topbar, SubTabs, PageHero). Background `--sv-band`; internal hairlines `--sv-band-line`; container 1280px, 40px side padding (18px < 1000px viewport).

**`BandTopbar`** — wordmark `76°` (six in seed, degree mark in `--sv-band-soft`) + app name after a hairline · `BandNav` · right cluster (search trigger, notifications, avatar).
- States: nav item default `--sv-band-soft` → hover white → active white + 2px seed underline flush with the row hairline. No background fills on nav items.
- A11y: `<nav aria-label="Primary">`; active link `aria-current="page"`; underline is supplementary — active state is also carried by text color/weight (non-color cue: `aria-current` + weight 700).

**`BandSubTabs`** — children of the active nav item, Fragment Mono 10.5 uppercase, tracking .13em. Same underline behavior. Collapses (renders nothing) when the section has no children. Never nests deeper — a third level becomes in-card tabs (B8) or a page.
- A11y: `<nav aria-label="Section">`, `aria-current="page"` on active. These are links, not ARIA tabs — they navigate.

**`PageHero`** — `<h1>` (27/800; secondary word `--sv-band-soft`) → context line (13, `--sv-band-soft`: date · scope · last sync) → right: actions (max: one mono range control, two ghosts, ONE primary). Bottom padding 68px for the overlap.
- Don't: no stat numbers inside the hero (stats live on paper), no more than one sentence of context.

### B2 · Sheet & Grid

**`Sheet`** — the wall. `max-width:1280px`, padding matches band. First child row gets `data-overlap`: `margin-top:-44px`. Exactly one overlap row per page — it is a signature, not a repeating trick.
Grid: 12-col, 14px gutters. Canonical splits: stats `repeat(4,1fr)` (2×2 below 1000px); content `1.7fr/1fr`; full-width tables allowed. Cards never touch: minimum 14px gap.

### B3 · `StatS1` — the signature stat (the only KPI card)

Anatomy, top to bottom — all three zones REQUIRED:
1. **Top** (padding 14/18/0): mono label 10/uppercase/`--sv-ink-soft` left · delta right: `▲`/`▼` + tabular value, 12/700, `--sv-ok`/`--sv-bad`. Delta omitted only when no comparison exists (then right side stays empty — never move the label).
2. **Mid** (8/18/14): icon tile 34px, radius 4, `--sv-seed-tint` bg, 16px stroke icon in seed (stroke-width 2) · value 24/800, tabular, tracking −.025em. Unit suffixes (%, pt, d) at 14/600 `--sv-ink-soft`.
3. **Foot**: 1px `--sv-line` top hairline; 11.5px sentence, `--sv-ink-soft`, with the load-bearing figure in `<b>` 600 ink. The footnote must contain *information not already in the card* (target, exposure, oldest age, plan count). A footnote that paraphrases the value is a defect.
- States: none interactive by default. If the card links, whole card is the anchor, focus ring per Part C, hover = nothing visual beyond cursor (paper does not lift).
- A11y: value + label read as one unit — `aria-label="Revenue month to date: $482,190, up 12.4%"` on the card, inner text `aria-hidden` where duplicated. Delta arrows are text glyphs, announced via the label, direction NEVER color-only (arrow glyph is the non-color cue).
- Don't: no sparklines here, no menus, no two values, no icon on the right, no tinted card backgrounds.

### B4 · `Progress`

Soft title 12/500 → value line "current / target" 19/700 tabular → 3px bar (track `--sv-wall`, fill seed, radius 2) → faint context line. Fill never animates on load beyond a single 160ms width transition.
- A11y: `role="progressbar"` with `aria-valuenow/min/max` and `aria-label`; the visible numbers are the primary information — the bar is illustration.
- Don't: no percentages without absolute numbers somewhere in the card; no red bars (danger is a word, not a bar — if something is overdue it goes to a table/list, not a meter).

### B5 · `Trend` (chart card)

Head: title/subtitle left, mono range right. Optional legend row: 14×2px swatches + 11.5 labels. Plot: single-weight 2–2.5px lines, round joins; grid = 1px `--sv-line` horizontals only; current period = seed, comparison = `#D6DAE0` (the ONLY permitted non-token color, alias it as `--sv-compare`); terminal dot 4px on the live series only. Bars: flat seed for primary series, `--sv-ink-faint` for secondary; no rounded bar tops beyond 2px.
- A11y: chart `role="img"` + `aria-label` summarizing the takeaway ("Revenue trending up, $482K MTD vs $431K in June"); provide the data as a visually-hidden table or an adjacent "View data" affordance for anything decision-critical.
- Don't: no area fills, no gradient fills, no dual-axis charts, no more than 3 series, no animated draw-in.

### B6 · `MeterList`

Rows of: label 12.5/500 soft + value 12.5/700 tabular right → 3px bar → faint absolute-numbers subtitle ("4,320 of 4,700 pallet positions" — REQUIRED; a percentage alone is a defect). 13px row gap.
- A11y: each row `role="progressbar"` labeled by its name and absolute numbers.

### B7 · `DataTable`

Head (universal card head) → optional `CardTabs` filter row → table. Columns: header Fragment Mono 9.5 uppercase `--sv-ink-soft`; cells 13/500, 10.5px vertical padding, 18px horizontal; IDs `Mono 11 --sv-ink-soft`; numbers right/tabular/600; row hover `--sv-seed-tint`; row hairlines `--sv-line`; last row unruled. Selected row: seed-tint bg + 2px seed left rule (the only left-rule use).
- Keyboard (ERP contract): table focusable; ↑/↓ move row focus, Enter opens, Space selects, ⇧ range-selects, Home/End jump. Focused row = same visual as hover + focus ring on the row.
- A11y: `<th scope="col">`; sortable headers are `<button>`s inside `th` with `aria-sort`; row count + filter state announced via `aria-live="polite"` region on change; never remove header row on mobile — tables scroll horizontally in a card, they do not reflow into blobs.
- Pagination: mono "1–50 OF 248" left, ghost prev/next right. No numbered pill walk.

### B8 · `CardTabs` (in-card filters)

13.5/600, soft → active seed text + 2px seed underline; sits on the card's hairline. These FILTER content in place (unlike BandSubTabs, which navigate).
- A11y: real `role="tablist"/"tab"/"tabpanel"` with arrow-key movement, or — when they drive a server-side filter — buttons with `aria-pressed`. Pick by behavior, never mix.

### B9 · `ActivityList`

Rows: mono timestamp 10 faint (fixed column) + 12.5 sentence, entities in 600 ink. Hairline separated. Timestamps absolute (14:28), never "3 minutes ago" in ERP contexts (relative allowed in consumer seeds, absolute on hover-title always).

### B10 · Buttons

- **Primary**: seed bg, white text 12.5/700, radius 4, padding 8/16, no shadow. Hover: `--sv-seed-deep`. Active: seed-deep + no transform. Disabled: `--sv-wall` bg + `--sv-ink-faint` text + `cursor:not-allowed` (never opacity on the whole button). Loading: label → "Saving…" + inline 12px spinner, width locked to pre-loading size.
- **Ghost**: transparent, hairline border (`--sv-line` on paper, `--sv-band-line` on band), ink/white text. Hover: border → seed, text unchanged.
- **Danger**: ghost anatomy with `--sv-bad` text; NEVER a red fill except the final confirm inside a dialog.
- **Text link action**: 12/600 seed, no underline until hover.
- **POS variant**: same anatomy ≥48px height, 14–15/700, press feedback <100ms = `--sv-seed-tint` flash (product buttons) or seed-deep (pay button). One pay-primary per POS screen, full column width, amount inside in mono.
- Rules: one primary per view region; destructive actions get a typed-object confirm ("Delete ORD-10482?") with Danger confirm; buttons never move or resize on state change.
- A11y: `<button>`/`<a>` only (no clickable divs); min hit area 24×24 desktop / 48×48 POS; focus per Part C.

### B11 · Forms (`Field`, `Select`, `Checkbox`, `Radio`, `Toggle`)

Label 12/600 ink above; optional hint 11.5 soft below label; input: white bg, 1px `#D8DCE1` border (alias `--sv-field-line`), radius 4, 13/500, padding 9/12; placeholder `--sv-ink-faint` and NEVER a substitute for the label. Focus: border → 1.5px seed, no glow. Error: border → `--sv-bad` + 11.5 bad text below stating what and how to fix ("Quantity must be a whole number above 0"), `aria-describedby` wired, `aria-invalid="true"`. Disabled: wall bg. Required: mono `*` after label + `required` attribute.
- Checkbox/Radio: 16px, 1.5px ink-soft border, checked = seed fill + white glyph; label is part of the hit area.
- Toggle: 32×18, wall track → seed track; only for instant-effect settings — anything needing "Save" is a checkbox.
- Selects: native `<select>` until a searchable combobox is genuinely required; then full ARIA combobox pattern with listbox, aria-activedescendant, and type-ahead.
- Validation timing: on blur, then on change after first error. Never on first keystroke. Submit reveals a top-of-form error summary linking to each field (focus moves to summary).

### B12 · `StatusWord`

6px `currentColor` dot + word, 12/600. Vocabulary is REGISTERED per product (ERP: Fulfilled=ok, Pending=neutral soft, On hold=bad, …) — inventing statuses ad hoc is a defect. Meaning never carried by color alone: the word IS the meaning; the dot is rhythm.

### B13 · `Dialog`

Paper card, radius 4, `--sv-shadow`, max 480px (forms 640px), on `rgba(27,31,38,.4)` scrim (flat, no blur). Title 15/700, body 13/1.55 soft, footer right-aligned: ghost cancel + one primary/danger. No "X" as the only close.
- A11y: `role="dialog" aria-modal="true" aria-labelledby`; focus moves to first meaningful control, trapped, Esc closes (unless mid-destructive-confirm), focus returns to invoker on close. Scrim click closes non-destructive dialogs only.

### B14 · `Toast`

Bottom-left, paper card, 13/500, hairline left-ruled in `--sv-ok`/`--sv-bad`/seed (2px), auto-dismiss 5s with pause-on-hover, max 2 stacked. Success and neutral info only — errors render inline at their source (Firewall A2).
- A11y: container `aria-live="polite"`; never contain the only path to an action (undo also available in context).

### B15 · `EmptyState`

One soft sentence stating what would appear here and why it's empty + one primary action. No illustration, no humor, max 2 lines.

### B16 · `SearchCommand` (⌘K)

Topbar trigger (B1) opens a Dialog-anatomy palette: mono input, grouped results (mono group labels), ↑/↓ + Enter, Esc. Every 76° app ships it — it is the keyboard front door.

### B17 · `Skeleton`

Static `--sv-wall` blocks matching the target component's anatomy (an S1 skeleton has three zones). No shimmer, no pulse. Appears only after 300ms of waiting (avoid flash).

### B18 · `Tooltip`

Ink bg, white 11.5 text, radius 4, 6/10 padding, 300ms delay. Supplementary info only — never the sole carrier of a label (Firewall A4). Keyboard-focusable triggers show it on focus.

---

## PART C — THE ACCESSIBILITY CONTRACT (WCAG 2.2 AA, non-negotiable)

**C1 · Contrast (verified against tokens — re-verify if any token changes):**

| Pair | Ratio | Use |
|---|---|---|
| `--sv-ink` on paper | 15.7:1 | body, values ✓ |
| `--sv-ink-soft` on paper | 4.99:1 | secondary text, micro-labels ✓ AA |
| `--sv-ink-faint` on paper | 2.61:1 | ✗ FAILS — see C2 |
| `--sv-seed` (Cobalt) on paper | 5.70:1 | text links, active tabs ✓ |
| white on `--sv-seed` | 5.70:1 | primary buttons ✓ |
| `--sv-ok` #14804A on paper | 4.98:1 | ✓ AA (darkened from #178A50 which failed at 4.39) |
| `--sv-bad` on paper | 5.18:1 | ✓ AA |
| `--sv-band-soft` on band | 5.32:1 | band secondary text ✓ |
| white on band | 17.9:1 | band primary ✓ |

**Rule for new seeds:** a candidate seed is REJECTED unless seed-on-white ≥ 4.5:1 AND white-on-seed ≥ 4.5:1. (Verdigris #12836F: 5.0/5.0 ✓ · Signal #D9531E: 4.0 on white — text use fails; Signal products use `#C24413` for seed-as-text and keep #D9531E for fills with white text at 4.6 ✓. Register both as `--sv-seed` / `--sv-seed-text` when they differ.)

**C2 · The faint rule:** `--sv-ink-faint` (2.6:1) may never be the sole carrier of information. Permitted: disabled labels, placeholder ghosts, decorative mono flourishes whose content also exists accessibly (e.g., a timestamp repeated in an `aria-label`). Anything a user must READ uses `--sv-ink-soft` minimum. When in doubt: soft.

**C3 · Focus:** every interactive element shows `outline: 2px solid var(--sv-seed); outline-offset: 2px` on `:focus-visible` (on the band: white outline). Focus is never `outline:none`'d without a replacement of equal visibility. Focus order follows visual order; the overlap row is focus-first content after the band.

**C4 · Keyboard:** everything mouse-doable is keyboard-doable. Global: ⌘K search, Esc closes topmost layer. Tables per B7. Tabs arrow-navigate. No keyboard traps outside dialogs. Skip-link ("Skip to content") as first tab stop, visually appearing on focus over the band.

**C5 · Non-color meaning:** status = word + dot; deltas = arrow glyph + sign; active tabs = weight + `aria-current`, underline supplementary; chart series = labeled directly or in legend, never "the blue line" in copy; required fields = `*` + attribute.

**C6 · Screen readers:** landmarks (`header/nav/main`); one h1; S1 cards read as single labeled units; live regions: `polite` for filters/toasts/table updates, `assertive` only for destructive failures; icons `aria-hidden` beside text.

**C7 · Motion & zoom:** honor `prefers-reduced-motion` (all transitions → 0ms; 76° loses nothing, by design). Layout survives 200% zoom and 320px width without content loss; tables scroll, never truncate silently.

**C8 · Touch (POS):** targets ≥48×48px with ≥8px separation; feedback <100ms; no hover-dependent functionality anywhere (hover is enhancement only, all products).

**C9 · Language:** `lang` attribute set; dates absolute in mono (24 JUL, not 7/24); numbers localized at the formatting layer, tabular always.

---

## PART D — THE SHIP GATE (run before showing Max anything)

1. Grep Part A1 patterns — zero hits.
2. Count colors on the screen: neutrals + one seed + at most both functional colors as words/dots. Anything else fails.
3. Every widget is a registered type (S1, Progress, Trend, MeterList, DataTable, CardTabs, ActivityList) — if a new type was needed, it is named, single-jobbed, and added to Part B in the same change.
4. Every S1 footnote passes the "so what" test (new information, not paraphrase).
5. Tab through the screen: visible focus everywhere, order sane, skip-link present, ⌘K opens.
6. Squint test: the page reads as ink band + white paper on a platinum wall; nothing glows, nothing floats, nothing performs.
7. Copy audit vs A3: no exclamation marks, buttons name objects, errors say what and how to fix.
8. Contrast spot-check anything new against C1; new seeds through the C1 seed rule.
9. The degree mark: every wordmark reads `76°` — never bare `76`.

*Seventy Six Degrees — the product is the design.*
