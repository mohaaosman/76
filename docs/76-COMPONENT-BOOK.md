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
- Any hex/rgb/hsl color literal outside `tokens.css` — in `.css` and in `.tsx` alike (an inline SVG `fill="#4285F4"` is the same defect). Components reference tokens only. The Foundations page is the one registered exception: it is the palette specimen.
- `color: var(--sv-paper)` — paper is the card surface, not a mark. Use `--sv-on-dark`.
- `animation` durations > 200ms; any `transition` on layout properties (width/height/top/left/margin); keyframe bounces/springs. **One registered amendment: `--sv-t-count` is 640ms** — see "The motion posture" in Part B. It is the only duration in the system over the ceiling, it is off by default, and the ceiling stands for everything else.
- `!important` — a component that needs it is mis-structured.
- Font families other than Hanken Grotesk / Fragment Mono (system stack fallbacks only).
- **Rule 18 — nothing touches the paper's edge by accident.** `.sv-card` carries no padding *by design*: a DataTable's rows are hairline-ruled edge to edge and a CardHead owns its own row, so a card that padded everything would have to un-pad them again. The cost is that a widget with no inset of its own — a `MeterList`, a `Trend`, a `Field`, a `Prose`, a `Timeline` — dropped straight into a `<Card>` renders flush against the corners. It has happened more than once, it is invisible in a diff, and until now the only thing standing between the system and it was a comment. A capitalised component that is a **direct child of `<Card>`** must either be full-bleed by specification or self-padded (both lists are registered in `slop-firewall.mjs`), or sit inside `<div className="sv-card__body">`. This is the one firewall rule that reads structure rather than lines, because the defect is a parent/child relationship. Adding a name to the allowlist is a Book change — it is a claim that the component draws to the card's edge on purpose.
- **Rule 17 —** `var(--sv-display-1|2|3)` anywhere but `tokens.css` and the three marketing components that set display type (`masthead.css`, `cta.css`, `proof-row.css`). The product ramp tops out at 27px; a dashboard that grows a 64px number has left the system. B48 `FeatureList` and B51 `SiteFooter` are marketing too and are deliberately NOT on that list — an allowance nobody uses is an allowance somebody will.

**A2 · Banned patterns:**

- Sidebars as primary navigation at ≥1000px. Horizontal band nav is binding on desktop, and the band's nav never scrolls horizontally at any width. BELOW 1000px primary navigation IS a left sidebar: a B21 Drawer (`side="left"`, `size="sm"`) opened by a ghost button LABELLED "Menu" with a glyph beside it — never icon-only, that ban stands. BandSubTabs leaves the band below 1000px and nests, indented, beneath its parent nav item inside the drawer.
- Donut, pie, radial, and gauge charts in product screens. Two components replace them, and picking the wrong one is how the donut keeps getting proposed: **B44 `DistributionStrip`** divides ONE total into its shares, **B6 `MeterList`** measures each part against its own maximum.
- Filled status pills/badges/chips. Status = 6px dot + colored word.
- Icon-only buttons for primary actions; mystery-meat "⋯" as the only path to an action.
- Skeleton shimmer animations (use static skeleton blocks at `--sv-wall`).
- Emojis in product UI. Decorative illustrations in v1. Stock-photo cards.
- Toasts for errors that belong inline next to the field that caused them.
- More than one seed-colored primary button visible per view region.
- **A kicker above a title, or a mono note under an actions cluster.** The header anatomy is closed and it is three things: a **title**, **ONE line under it**, and **ONE or TWO buttons**. Nothing above the title, nothing below the buttons. Refused by name as F12.
- **Breadcrumbs.** Refused by name as F13.
- **A stat wearing the colour a button wears.** The seed FILL belongs to the ACTION. A view region gets one seed-filled primary, and every figure on that screen is ink — a stat's accent is `--sv-seed-tint` behind a 34px icon tile (B3) or a 3px bar (B4, B6), never the fill itself. When a stat and a call to action share a surface they must not share a colour: if the number is as loud as the button, the reader has two primaries and the screen has none.
- Dark mode implemented anywhere but the tokens. Light-first stands as the default surface; dark is opt-in and token-only — the spec is "The dark surface" (Part B, v0.2.0) plus its v0.2.1 amendment. A component that branches on the mode is a defect.
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
- Below 1000px: `BandNav` leaves the band and moves into a left Drawer (B21, `side="left"`, `size="sm"`), opened by a ghost "Menu" button with a glyph beside it — the topbar keeps wordmark, app name, and the right cluster. The nav never becomes a horizontal scroller (A2).
- A11y: `<nav aria-label="Primary">`; active link `aria-current="page"`; underline is supplementary — active state is also carried by text color/weight (non-color cue: `aria-current` + weight 700). The drawer's nav keeps the same landmark and `aria-current`; the "Menu" button carries `aria-expanded`.

**`BandSubTabs`** — children of the active nav item, Fragment Mono 10.5 uppercase, tracking .13em. Same underline behavior. Collapses (renders nothing) when the section has no children. Never nests deeper — a third level becomes in-card tabs (B8) or a page.
- Below 1000px: the sub-tab row leaves the band and nests inside the drawer, indented one step under its parent nav item — same mono type, no underline, still links. It never becomes a horizontal scroller.
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

### B19 · `Combobox` (v0.2.0)

The searchable select. Native `<select>` (B11) stays the default for short, known lists; the Combobox exists when a list passes ~10 options or the user knows the value's NAME faster than its position. ARIA 1.2 pattern, `aria-activedescendant`, focus never leaves the input. B11 field chrome verbatim: label above, error states what and how to fix, empty state names what didn't match. One job: pick ONE value from a list too long to scan. Never inside an `overflow` container; never multi-select; never free-text.

### B20 · `Menu` / `MenuButton` / `SplitButton` (v0.2.0)

An actions dropdown on the native `popover` top layer — light dismiss, Esc, focus return, zero z-index. Items are VERBS naming their object; a danger item turns `--sv-bad` and still confirms in a Dialog. Never navigation (that is the Band), never selection (that is a Select/Combobox). The SplitButton welds ONE primary verb to a chevron holding variants of the SAME job — never unrelated actions. One job: hold the secondary verbs one control cannot.

### B21 · `Drawer` (v0.2.0)

The slide-over: a full-height paper panel from the screen edge on native `<dialog>.showModal()`. Head = 15/700 title + optional mono context + named close; scrolling body; sticky footer = ghost cancel + ONE primary. Sizes sm 360 · md 480 · lg 640 · full, all capped at 100vw. Entry slides 24px, transform-only, 160ms ease-out, 0 under reduced motion; exit is instant. Dialog interrupts for one decision; Drawer opens a workspace beside the work; `Dialog size="full"` replaces the page. One job: inspect or edit ONE record without leaving the sheet.

### B22 · `Banner` (v0.2.0)

The inline notice — the surface B14 sends every error at: in the flow, adjacent to its cause. Paper card, 2px left tone rule, 16px tone icon, 13/700 title, full-sentence body (what happened AND how to fix), at most one text-link action, optional dismiss. Tones: info (seed) · ok (green) · bad (red) · warn in INK — no amber surface enters the system (Law 2). `bad` is `role="alert"`; the rest are polite. Never auto-dismisses; never stacks past the worst condition; never a field error's replacement.

### B23 · `Badge` (v0.2.0)

A small mono uppercase tag for CATEGORY metadata: environment, plan, type, version. Wall-toned, hairline border, rectilinear — never a pill. Seed tone marks the current/active category, one per group. Live state is a StatusWord (dot + word); quantities are stats or cells. If it can change while you watch, it is not a Badge.

### B24 · `Plate` (v0.3.0)

The band-less page type. Wall background edge to edge; one centred card, max 400px, holding the whole decision; the mono `76°` wordmark 20px above it (six in seed, degree mark `--sv-ink-faint`); nothing else on the page. The card is ordinary paper — radius 4, `--sv-shadow`, zero border, 28px padding — with title 15/700, at most one soft sentence, the fields or the statement, then ONE primary at full card width. Used by auth (sign in, register, reset, verify), 404, 500, maintenance, expired link. One job: carry a single decision on a page that has no navigation.
- States: none — the Plate is a layout. Its contents carry their own states (B10, B11, B15, B22).
- A11y: the card title is the page's `<h1>` (the wordmark is not a heading); `<main>` wraps the card; focus lands on the first meaningful control. The skip-link is omitted — a registered exception to C4, because a Plate has nothing to skip.
- Don't: never carries nav, never carries a PageHero, never carries a second card, never a background image, never an illustration, never a "back to the app" band. Two decisions = two pages.

### B25 · `PinField` (v0.3.0)

The OTP / verification-code input: a row of fixed single-character boxes, 4–8 (default 6), B11 field chrome per box — white bg, 1px `--sv-field-line-strong`, radius 4 (NOT the ordinary `--sv-field-line`: an empty box carries no label, value or fill, so its border is the sole affordance and owes the 3:1 non-text bar, C1) — with the character in Fragment Mono 18, centred, box 40×46, 8px gaps. Label above per B11; hint below names the delivery and the window ("Sent to ···4192 · valid 10 minutes"). Typing advances, Backspace retreats, one paste fills every box. One job: enter a short fixed-length code.
- States: default · focus — the active box takes the 1.5px seed border, no glow · filled · error — every box borders `--sv-bad` (the code is wrong as a unit, never per character) with 11.5 bad text stating what and how ("That code has expired. Request a new one.") · disabled (wall bg) · verifying — boxes lock, the primary reads "Verifying…" at locked width (B10).
- A11y: ONE input semantically — `inputmode="numeric"`, `autocomplete="one-time-code"`, `aria-label` naming the code; boxes are presentation and `aria-hidden` where they duplicate. Error wired through `aria-describedby` + `aria-invalid="true"`, announced politely. Tab enters and leaves the field as a unit — never a keyboard trap.
- Don't: no auto-submit without a visible primary; no masking (a code is not a password); no countdown that hides the resend action; never used for a variable-length secret — that is a B11 Field.

### B26 · `SocialButton` (v0.3.0)

The federated-identity button. B10 Ghost anatomy verbatim — transparent, hairline border, ink text 12.5/700, radius 4, padding 8/16, full card width on a Plate. The provider mark is ONE path drawn in `currentColor` at 16px, left of the label — never brand hexes, never a multi-color mark, never a raster image (Law 2, A1). The label names the provider and the act: "Continue with Google". Stacked, at most three, separated from the credential form by a hairline rule with a mono uppercase "OR". One job: hand authentication to one named provider.
- States: per B10 Ghost — hover border → seed, text unchanged; loading label → "Redirecting…" at locked width; disabled per B10.
- A11y: `<button>`/`<a>` only; the mark is `aria-hidden="true"` beside its text label (A4). The provider name lives in the text and is never carried by the mark alone.
- Don't: no row of icon-only provider tiles (A2); no provider brand colors in the component layer; no mixing "Sign in with…" and "Continue with…" in one stack.
- Registered override: a product bound by a provider's strict brand guidelines may restore that provider's mark and colors LOCALLY, declared in the product's own overrides. The 76° component layer stays currentColor.

### B27 · `Accordion` (v0.4.0)

Native `<details>`/`<summary>` sections, hairline-ruled, with a mono uppercase meta column right of the title (count, date, status) so the reader knows whether opening it is worth the click. Summary 13/600 ink; panel 13/1.55 `--sv-ink-soft`, indented 14px to the chevron. The chevron is drawn from borders and rotates on `[open]` — transform only, `--sv-t-fast`. `exclusive` sets the native `name` group; independent is the default, because closing a section the reader opened is a surprise. One job: fold SECONDARY detail out of the way until it is asked for.
- States: closed · open · summary hover · summary focus (C3 ring) — no disabled state; a section with nothing in it is not rendered.
- A11y: the platform owns the expanded state — no `aria-expanded` to keep in sync. Summary is a native tab stop; Enter/Space toggles. The chevron is supplementary (C5): the panel itself carries the state.
- Don't: never holds the primary job of a screen; never navigation (that is B1, and deeper than one level is a page — F6); never animates height (A1); never nests.

### B28 · `DescriptionList` (v0.4.0)

The record readout: a real `<dl>` where terms speak Fragment Mono 9.5 uppercase `--sv-ink-soft` (the table-header voice) and values carry the information at 13/500 ink, each pair on a `--sv-line` hairline, last row unruled. Value `kind` inherits the table's type discipline — `id` goes mono 11 soft, `num` goes tabular 600 and right-aligned. Grid is `minmax(110px,168px) 1fr`, collapsing to one column below 520px (C7). One job: state a set of labelled facts about ONE record.
- States: none interactive. A fact with no value is omitted or stated ("None recorded") — never an empty row.
- A11y: real `<dl>/<dt>/<dd>`, so each term is announced with its value as one pair. Numeric values carry `tabular-nums` (A4).
- Don't: never compares two records side by side (that is B7); never holds editing controls (that is a Drawer with a form); never sentence-case terms.

### B29 · `Divider` (v0.4.0)

A hairline at `--sv-line`, or — with a label — a rule carrying mono uppercase 9.5 text in `--sv-ink-soft`: the "OR" between a social stack and a credential form (B26), an "ARCHIVED" break in a list, a "DANGER ZONE" step in settings. `align="start"` drops the leading rule and runs the trailing one past the label. On the band it switches to `--sv-band-line` / `--sv-band-soft` automatically. One job: separate two groups that share a surface.
- A11y: unlabelled renders a real `<hr>`; labelled renders `role="separator"` with the label as its accessible name, the visible text `aria-hidden` so it is not read twice.
- Don't: never stands in for a heading; never two in a row; never the first or last child of a card; never inside a table (rows carry their own hairlines).

### B30 · `Avatar` / `AvatarGroup` (v0.4.0)

Initials derived from the name, 700 weight on `--sv-wall`, at 24/32/44px, radius `50%` (registered alongside status dots). A photo only where the product genuinely holds one — never a silhouette, never stock (A2, F11). `tone="seed"` marks the current user, one per group. **AvatarGroup** overlaps a capped stack at −6px with a 1.5px paper ring drawn as an `inset` shadow, and states the remainder in mono ("+7"). One job: identify a PERSON beside their name.
- States: static. Images never move on hover (Part E) — the row tints, the face does not.
- A11y: an initials avatar is `role="img"` labelled with the full name, initials `aria-hidden`; a photo avatar takes the name as `alt` — never empty, never "avatar". The overflow chip reads "N more", and the names it hides are reachable in the list it summarises (A4).
- Don't: never the sole carrier of a name (A4); never a generic placeholder face; never welds a presence dot onto the face (that is a B12 StatusWord beside the name); never reveals the full list on hover (C8).

### B31 · `Spinner` / `Busy` (v0.4.0)

**`Spinner`** — the 12/16/20px mark, `sv-rotate` at 800ms linear: the ONE continuous animation in the system, allowlisted in A1 and shared verbatim with the B10 loading button. **`Busy`** — a whole region at `aria-busy`, one centred 16px spinner and a REQUIRED sentence naming what is loading ("Loading July orders…"), `minHeight` matched to the component it replaces so nothing jumps. Passing children keeps existing content legible underneath at 0.4 opacity — it is still true until it changes; no scrim, no blur (A1). One job: state that a region is fetching, and name what.
- States: idle (not rendered) · inline · regional · refreshing-over-content.
- The B17 boundary: Skeleton is FIRST PAINT, where the anatomy is known and the data is not. Busy is a region that already has content and is fetching the next of it. Neither appears under 300ms of waiting.
- A11y: Busy sets `aria-busy="true"` + `aria-live="polite"` so the label announces once; a labelled Spinner is `role="status"`; an unlabelled one is decorative and must sit inside a region that announces. Copy obeys A3 — no "Please wait", no exclamation marks.
- Don't: never a bare spinner without a sentence; never a full-page blocking spinner (regions load, pages do not freeze); never a shimmer (A2).

### B32 · `Kbd` (v0.4.0)

A key, printed: real `<kbd>` elements in Fragment Mono 10.5 on a `--sv-wall` cap with a hairline border, a 2px bottom border, and the registered 3px radius — the one skeuomorphic gesture in 76°, earned because a key cap is a physical object. On the band the cap goes transparent and takes band tokens. A `separator` ("then") turns a chord into a sequence. One job: print the key that triggers something.
- A11y: real `<kbd>` semantics; glyph keys are characters, not images, so they scale and translate. A printed shortcut never replaces a visible control (C4) — it labels one that already exists.
- Don't: never prints a shortcut the app does not bind; never clickable; never a pill; never longer than three caps.

### B33 · `NumberField` (v0.4.0)

The quantity input: native `<input type="number">` in B11 chrome, right-aligned tabular 600, with a square 34px − / + pair in B10 ghost anatomy replacing the browser spinners, which duplicate the job, cannot be styled to system, and are unusable on touch (C8). The unit is stated in mono BESIDE the field, never inside it as a placeholder (B11). Bounds are ENFORCED, not merely announced: typing past `max` clamps, − disables at `min`, + at `max`. One job: enter a bounded QUANTITY.
- States: per B11 — default · focus (1.5px seed border) · **empty mid-edit** (the box holds what was typed, including nothing, until blur — a number prop cannot express "empty", and `Number('')` is `0`, which is an entry, not an absence) · error (`--sv-bad` border + 11.5 bad text stating what and how) · disabled (wall bg on field and both buttons).
- A11y: each step button carries an `aria-label` naming the object ("Decrease pallet positions") — never a bare glyph (A4). `inputmode="numeric"`. Errors wire `aria-describedby` + `aria-invalid`. Validation timing per B11: on blur, then on change after the first error.
- Don't: never a stepper for a value people type in full (a price, a year — that is a Field); never unbounded where real bounds exist; never a unit inside the input.

### B34 · `Slider` (v0.4.0)

Native `<input type="range">` on the B4 bar geometry: 3px track at radius 2, 14px seed thumb at `50%`, the C3 focus ring at 2px offset. The track is `--sv-field-line-strong`, NOT B4's `--sv-wall`: a Progress track carries a seed fill that identifies the control, this one carries nothing, so the track itself is the affordance and owes the 3:1 non-text bar (WCAG 1.4.11 — wall would be 1.06:1 on paper). Same reasoning as the B25 PinField border. The mono readout sits beside the label and updates with the thumb — B4's rule holds, the bar illustrates and the printed figure informs. **There is no filled track**: a two-tone fill requires a gradient, gradients are banned (A1), and the number carries what the fill would have. One job: set a value whose POSITION in a range matters more than its digits.
- States: default · focus · disabled (thumb goes `--sv-ink-faint`, cursor not-allowed).
- A11y: native slider semantics supply valuemin/max/now; `format` also becomes `aria-valuetext` so "40%" is announced rather than "40". The visible readout is `aria-hidden` — the input already announces it. Arrow keys step, Home/End jump.
- Don't: never for a value people know exactly (that is B33); never dual-thumb (two bounds are two fields — see B35); never without the printed number; never a gradient track.

### B35 · `DateRangeField` (v0.4.0)

The range, without a calendar — **F4 is binding, 76° draws no month grid, ever.** A mono uppercase preset row (`7D · 30D · QTD · YTD · CUSTOM`, CardTabs voice, `aria-pressed`, seed-tint when active) over two native `<input type="date">` fields welded into one B11 Field by a mono `→`, under a mono context line stating what the range means ("24 days · ends today"). The browser draws the picker: localized, keyboard-complete, screen-reader-tested, free. `presetRange` is exported so a Menu, a URL parameter or a saved view computes the same ranges. One job: choose a DATE RANGE.
- States: default · a preset active · custom (no preset pressed) · error — a start after the end is caught by the field itself and stated in B11 voice ("The start date is after the end date. Move the start date back."); a caller-supplied `error` overrides it.
- A11y: a real `<fieldset>`/`<legend>`; each input adds its own `aria-label` ("Reporting period, start date"); presets are buttons with `aria-pressed` so the active range is a state, not a colour (C5); the context line is `aria-live="polite"`. The end field takes the start date as its `min`, so the invalid half is unreachable rather than merely rejected.
- Don't: never a month grid, a scheduler, or a compare-to-previous overlay (F4); never relative-only ranges without the absolute dates (C9); never more than five presets; never silently clamps an inverted range.

### B36 · `SearchField` (v0.4.0)

The in-place filter: a native `<input type="search">` in B11 chrome with a 14px magnifier left, a NAMED clear button right (the WebKit cancel button is suppressed — it is unstyleable, unlabelled, and invisible on the wall), and an optional mono `aria-live="polite"` result line under the field stating how many of how many now match. Escape clears and keeps focus. The live region is rendered even when empty, so the FIRST announcement is not lost. One job: filter a set that is ALREADY on screen by typing.
- The B16 boundary: `SearchCommand` is ⌘K, a dialog, the keyboard front door to the whole app, and it NAVIGATES. This filters what you are already looking at. Shipping one does not excuse skipping the other.
- `labelHidden` is a REGISTERED EXCEPTION to A4, legal only inside a CardHead or a B7 `FilterBar` that already names the set. The placeholder is still never the label (B11).
- Don't: never a submit button (the list filters as you type, or it is a form); never `resultText` inside a FilterBar that also carries a FilterLine — two live regions for one change is a defect.

### B37 · `FileField` (v0.4.0)

Attach files, and state what happened to each. B11 label and hint over a drop zone whose 1px DASHED border is `--sv-field-line-strong` — the border is the zone's only affordance and owes the 3:1 non-text bar (WCAG 1.4.11), the same reasoning as B25's PinField box. The zone is a TARGET, not a control: a real `<input type="file">` and a named "Choose files" button carry the interaction, so the keyboard reaches everything without a fake `tabIndex` on a div. A mono constraint line names what is accepted and the ceiling. Rows below are hairline-separated: name, mono size, then B4's bar geometry worn directly (`progress.css` is imported rather than restated) while uploading, the WORD "Uploaded" while done, and an error stating what and how while failed. One job: attach files and report each one's state.
- It owns NO transport. Uploading, retrying, cancelling and measuring are the product's; the component renders the state it is handed. A component that owns the network cannot be installed from a registry.
- A11y: the row list is a live region rendered from the start; each uploading row is a `role="progressbar"` named for its file; the remove button reads "Remove" and carries `aria-label="Remove july-actuals.csv"` (A3, A4).
- Don't: never a status carried by colour alone (C5); never a formatted byte count computed in the component (C9 — `size` is a string); never a drop zone with no button, which is unreachable by keyboard.

### B38 · `Tabs` (v0.4.0)

Three components look alike and are not interchangeable. **`BandSubTabs` (B1) NAVIGATE** — links, a URL change, on the band. **`CardTabs` (B8) FILTER ONE CARD'S CONTENT** in place, on that card's hairline. **`Tabs` (B38) SWITCH A WHOLE CONTENT REGION OF THE SHEET**, on the wall, directly above the region they switch. Pick by what changes, never by what it looks like. 14/700 labels soft → active `--sv-seed-text` under a 2px seed underline sitting ON the row's own hairline, an optional mono tabular count, no fill on a tab ever — a tinted tab on the wall reads as a pill. Each tab owns its OWN `TabPanel`, tied by a shared `idBase`. One job: switch which set of cards the sheet shows without touching the URL.
- Real ARIA tabs only: `role="tablist"`, roving tabindex, ←/→ wrap, Home/End, automatic activation. There is no `filters` mode — `aria-pressed` buttons are B8's job, and a tablist that is sometimes not a tablist is a defect.
- Below 1000px the row WRAPS. It never becomes a horizontal scroller: A2's ban is written for the band and it reads on every nav-like row.
- Cap: five. A sixth section is a band nav item.
- Don't: never for state a user should be able to link to or reload into — that is navigation, and it belongs on the band.

### B39 · `Stepper` (v0.4.0)

Where you are in a fixed sequence, and what remains. An `<ol>` of 24px markers at `--sv-r` carrying mono step numbers — done: seed fill plus a check in `--sv-on-dark`; current: seed fill plus the number; upcoming: `--sv-wall` with a 1px `--sv-field-line-strong` border, because that border is its only affordance against the wall (C1). Beside each, the label and an optional note; between them, a 1px connector that runs seed behind the current step and `--sv-line` ahead of it. Below 620px the sequence stands up vertically — nothing hides, nothing scrolls (C7). One job: state position in a named sequence.
- **A Stepper is a STATEMENT, not a control.** Steps are plain text unless `onStepSelect` is passed, and even then only ALREADY-COMPLETED steps become buttons: you cannot click into a step you have not earned.
- The B4 boundary: a Progress bar measures a quantity against a target; a Stepper counts named steps.
- A11y: `aria-current="step"` on the current one, and every step's state ALSO stated in visually-hidden words ("Step 2 of 4, completed") — a seed fill is a colour, and colour never carries meaning alone (C5).
- Don't: never more than five steps (that is a checklist, or a screen); never a percentage beside it; never a step that can be skipped silently.

### B40 · `TreeList` (v0.4.0)

A hierarchy whose DEPTH is itself the information: a chart of accounts, a bill of materials, a folder tree, an org. The full ARIA tree pattern, hand-rolled, zero dependencies — `role="tree"` / `treeitem` / `group`, ONE tab stop for the whole tree (roving tabindex), a border-drawn chevron that rotates on expand, 18px of indent per level, and a mono meta column right of the label. The selected row wears B7's language: `--sv-seed-tint` plus a 2px seed left rule. Fully controlled: `expanded` is a `Set` the caller owns. One job: move through a hierarchy.
- The boundaries: B27 `Accordion` folds SECONDARY detail, never nests, never navigates. B7 `DataTable` holds flat records sharing columns. F3 refuses the data grid. A tree is none of those.
- Keyboard: ↑/↓ move through VISIBLE nodes · → expands, or moves to the first child · ← collapses, or moves to the parent · Home/End · Enter/Space select.
- The `<li>` itself is the `treeitem` and carries the tabindex — a focusable `<button>` inside a treeitem breaks the pattern.
- Don't: no checkbox tree in v1; no inline row verbs (that is a B20 Menu on a record page); no lazy-load spinner inside a row; never deeper than the data genuinely is.

### B41 · `Timeline` (v0.4.0)

The ordered history of ONE record, with the gaps visible. An `<ol>` on a 1px `--sv-line` rail, clipped at the first and last markers so the line never dangles past the sequence, with a 7px dot on it ringed in paper by an `inset` shadow: `done` in seed, `pending` in paper behind a 1.5px `--sv-field-line-strong` ring, `bad` in `--sv-bad`. Content is a mono absolute timestamp in a real `<time dateTime>`, a 13/600 title, an optional one-sentence body, and an optional mono actor. An item's `group` renders a mono uppercase day divider above it. One job: state one record's life in order.
- The B9 boundary: `ActivityList` is a live, flat feed answering "what needs me", newest first, across many records. A Timeline is one record, and it shows what has NOT happened yet as well as what has — that is why it has a `pending` tone and a feed does not.
- A11y: the tone is ALSO stated in visually-hidden words ("Completed", "Not started", "Failed") — a coloured dot is colour-only meaning (C5). Timestamps absolute in mono (C9). Day dividers are `role="presentation"` siblings, so they stay out of the `<ol>` count.
- Don't: never relative time ("3 minutes ago") as the only form; never two sentences of body (that is a record page); never an interactive row — a step that opens something is a link in its body.

### B42 · `Popover` (v0.4.0)

The non-modal panel that holds a FEW CONTROLS beside the control that asked for it: a column chooser, a saved-view picker, a short explanation with a link. It earns its place only at the boundaries of four neighbours — **B18 `Tooltip`** is a phrase with no interactive content, on hover or focus; **B20 `Menu`** is a list of verbs with `role="menu"` and its own keyboard model; **B21 `Drawer`** is a workspace beside the work; **B13 `Dialog`** interrupts for one decision, modally. Built on the native `popover` attribute: top layer, light dismiss, Esc, and NO z-index. Paper, hairline, one shadow, `min-width` 220 / `max-width` 320 — wider is a Drawer. One job: park a few controls next to their trigger.
- It OWNS its trigger, exactly as `MenuButton` does, so `aria-expanded` and `aria-controls` cannot drift from what is on screen. Labelling is enforced by the type system: `title` and `ariaLabel` are a mutually exclusive union, so an unlabelled panel does not compile.
- Focus is never trapped: opening moves focus into the panel, and tabbing past the last control CLOSES it and carries on into the page — a panel left standing behind the focus ring is one nobody can see they have left. Focus returns to the trigger only when the panel still held it.
- **B20 Menu now stands on this component.** `usePopoverAnchor` — which places a top-layer panel under its trigger, since the top layer does not anchor itself until CSS anchor positioning is baseline — lives here and Menu imports it. It is deliberately not re-exported from the barrel: it is those two components' implementation, not public API.
- Don't: never the only path to an action (C4); never navigation (that is the Band); never nested inside another popover; never an error surface (that is B22 Banner, inline at its cause).

### B43 · `CodeBlock` (v0.4.0)

Code or a command, printed exactly as it must be typed. `--sv-wall` inside a 1px `--sv-line` border — the one place in the system a bordered inset panel is right, because the code is a quotation and not a card. An optional mono head naming the file or language, a copy control, and `<pre><code>` in Fragment Mono 12/1.6 with `overflow-x: auto` (never `hidden` — the firewall rejects it and C7 forbids silent truncation). `numbered` puts the gutter OUTSIDE the `<code>`, `aria-hidden` and unselectable, sticky so the numbers hold while the code scrolls under them. One job: print code exactly.
- **No syntax highlighting, ever.** Highlighting is six to nine colours on one surface; Ship Gate point 2 counts the colours on a screen and Law 2 allows neutrals plus one seed. A reader who needs colour to parse a snippet has been handed a snippet that is too long. A product that overrides this owns the gate consequence and declares it in its own overrides, exactly as B26 permits for provider brand marks.
- The copy control reads "Copy", becomes "Copied" for two seconds at a locked minimum width (B10: buttons never resize on state change), announces through a visually-hidden polite region rather than through the label alone, and is NOT RENDERED when `navigator.clipboard` is absent — a control that cannot work is not shown.
- A11y: `role="region"` and `tabIndex={0}` are applied only when the block actually scrolls, measured at runtime. A keyboard user must be able to scroll it; an unnecessary tab stop on a block that does not scroll is its own defect.
- Don't: no highlighting; no inline `<code>` use (that is running copy, and B45 `Prose`); no code as an image; no tab row of filenames (that is B38 Tabs holding several CodeBlocks).

### B44 · `DistributionStrip` (v0.4.0)

**The donut, answered.** A2 has banned donut, pie, radial and gauge charts since v0.1.0 and pointed at B6 `MeterList` as the replacement — but that was a different question. **B6 measures each part against ITS OWN maximum** (utilization: "Zone A is 92% full"). **B44 divides ONE total into its shares** ("46% of 128,953 clicks were mobile"). Every donut a team has ever drawn was asking B44's question and being handed B6's answer.

Anatomy: a B4-voiced value line — mono uppercase label left, the formatted total right at 19/700 tabular — then one 10px strip at radius 2, its segments laid in the given order and separated by a 2px `--sv-paper` seam, which is STRUCTURAL precisely because a gradient is banned (A1) and the parts must read as parts. Tones run `--sv-seed` → `--sv-compare` → `--sv-ink-faint` → `--sv-field-line-strong`, which is the last step still visibly a FILL — the hairline stays a rule, because a part of the total nobody can see is a part that was not stated (WCAG 1.4.11). A fifth part reuses the fourth tone. Then a legend, one row per part: an 8px swatch, the label, and — REQUIRED, inherited whole from B6 — the absolute figure beside the share. **A percentage alone is a defect.** One job: state how one total divides.
- A11y: the strip is `role="img"` carrying the takeaway. The legend is THE DATA: it repeats every figure as text, so nothing is carried by colour or width alone (C5). Delete the strip and the card still answers the question — that is the test it must pass.
- `total` is the denominator when the parts are a subset; the unclaimed remainder stays wall, and the `ariaLabel` says so in words rather than leaving a gap to be inferred from a width.
- Don't: more than five rows is a B7 DataTable; a stack of strips comparing periods is B5 `kind="stacked"`; a strip whose parts do not sum to the stated total without saying so; and it is never bent into a ring.

### B46 · `Split` (v0.4.0)

The band-less page, cut in half, with the card ACROSS THE CUT. Two flat surfaces meet on one seam — ink and wall, side by side or stacked — and the Plate sits centred on that seam, so half the card is on ink and half is on wall. There is no panel, no hero, no second column, and nothing to read on either half. One job: carry a single decision on the line between two surfaces.

**This is B2's overlap, finished.** The Sheet spends that move once per page by pulling its first row 44px over the band edge, so the stat cards on every 76° dashboard straddle the boundary between the ink band and the platinum wall. A Plate has no Sheet and no band, so the same physics arrive as a page type: not a card that peeks over an edge, a card that STRADDLES one. It is the only 76° layout in which paper crosses a surface boundary rather than resting on one.

**The halves carry nothing.** No statement, no widget, no screenshot, no illustration, no photograph. They hold no text, so they are `aria-hidden` and the page reads to a screen reader as exactly the Plate it composes — the cut is a visual fact, not information. A1 refuses gradients, so it is two real elements rather than a colour stop; that is also why it lands on a hard pixel instead of a soft blend, which is what gives the card an edge to straddle.

**B24 is composed verbatim, with one consequence: everything the Plate puts on the wall moves INTO the card.** Centred above and below a seam-straddling card, the wordmark and the footer would each land half on ink and half on paper — ink type on ink, which reads as a rendering fault rather than a design. Both become hairline-ruled rows of the card, left-aligned like every other line in it, and the Plate's own slots are emptied (`wordmark={null}`, footer intercepted). Nothing else changes: same anatomy, same one h1, same one primary, same 400px measure.

- **Two orientations, one prop.** `side` cuts left/right, card on the vertical seam. `stacked` cuts top/bottom, card on the horizontal one. Below 1000px `side` becomes `stacked` on its own, because a vertical seam behind a card grown to full width is a seam nobody can see. The card stays centred at every width, so it never stops straddling — nothing is hidden and nothing scrolls (C7).
- **No skip link, and that is deliberate.** B24 waives C4's skip link because a Plate has nothing to skip; a Split has nothing either, since the halves are empty. The first tab stop is the first control in the card.
- **No new z-index.** The halves and the Plate share one grid cell, so the card floats over the seam by DOM order rather than by stacking context.
- Don't: no text on either half (a statement there is a landing page, and F11 refuses the imagery it grows into next); no widget, screenshot or illustration (A2, F11); no gradient between the surfaces (A1 — and a soft blend leaves no edge to straddle); no second card and no second decision (B24); no Split for 404, 500, maintenance or an expired link, where a plain Plate is the whole answer; no wordmark or footer left on the wall for the seam to cut through.

### B45 · `Prose` (v0.5)

The one component in 76° that styles elements it does not own. Running copy — a changelog, a help article, a policy page, a public page — is not what the product ramp was built for: 13/1.5 is an instrument for scanning a table, and two screens of it defeat a reader. `Prose` is a second ramp scoped to one subtree: 16/1.6 on a ~66ch measure, a heading ramp that stays INSIDE the product ramp (27/21/17/15 — the display steps are rule 17's and are refused here), real list markers, a 2px `--sv-line` blockquote rule, inline `<code>` on a wall inset at the registered 3px radius, tables in the table-header voice, and links underlined in `--sv-seed-line`. Markdown rendered to HTML drops straight in. One job: **set running copy the system did not author.**

- **It is also where F1 is answered.** 76° refuses the WYSIWYG toolbar and composes a textarea plus a preview instead. `Prose` is that preview, and the same component sets the published article afterwards.
- **Part E's one italic.** Italic is legal in running body copy and nowhere else; this is that place, and `prose.css` is the firewall's registered exception. A heading inside it is still upright.
- A11y: no roles, no ARIA. Heading LEVELS are the AUTHOR'S — the component styles what it is given and never renumbers, because the outline is the author's structure and re-ranking it rewrites what a screen reader announces.
- Don't: never wraps application UI (a card, a table or a form inside it inherits type it was not designed for); never a real snippet, which is B43 `CodeBlock`; never nested; never used to smuggle a second type scale into a product screen.

### B47 · `Masthead` (v0.5)

**The hero, refused as imagery and rebuilt as type.** F11 bans hero photography, illustration and 3D; A2 bans the stock-photo card; A1 bans the gradient every hero grows next. What is left is what a masthead always was — a claim, set large, with nothing behind it. There is **no image slot, no video slot and no background slot**, and adding one is a Book change rather than a prop. One job: **open a public page with the claim, set in type.**

It is B1 `PageHero`'s public-surface sibling and speaks its vocabulary deliberately: `title` plus a receded `titleSoft` inside the same heading, one line of context, ONE or TWO buttons. **The anatomy is closed by F12** — there is no `eyebrow` prop and no `note` prop, and the refusal is enforced by the slots not existing. The difference is the ramp and the surface — `--sv-display-1` on the wall, instead of 27px on the band. It is not a card: no paper, no shadow, no radius, no border.

- **The steps clamp.** `--sv-display-1` is 64px at full width and 34px at 320px — the size the same line takes in the product ramp — so a public page degrades INTO the system rather than out of it (C7). At the floor the tracking and leading relax back toward the product ramp, because −0.03em/1.05 steadies a 64px line and closes the counters on a 34px one.
- The actions keep B10's registered geometry. A taller marketing button is a third button size the Book does not carry, and "the type above it is large" is not a reason the taxonomy accepts.
- A11y: the heading is a real `h1` (or `h2` when embedded), with `titleSoft` inside it so the accessible name is the whole claim. The eyebrow is a sibling LINE, never a heading — an h2 above the h1 puts a rung above the claim in the outline.
- Don't: no kicker above the title and no mono note under the actions (F12); no third button; no image, video or background; no second primary; no paragraph in the statement (that is B45); no figure inside it (that is B50); no breadcrumb near it (F13).

### B48 · `FeatureList` (v0.5)

The claim, itemised. Every competing library answers this with a grid of tinted icon tiles; A2 refuses the icon-led card, F11 refuses the illustration that follows it, and Law 2 will not spend six colours on decorative glyphs. What is left is a newspaper column: a 1px `--sv-line` rule over each item, a mono ordinal, a 15/700 title, one sentence at 13.5, and an optional mono meta line. 3 across → 2 below 1000px → 1 below 620px, every track `minmax(0,1fr)`. One job: **state what the product does, one item at a time.**

- **A statement, never a control.** Nothing in an item is clickable. If a feature needs a link, the link lives in its body where a reader can see what it points at — a card-sized hit area with no visible affordance is mystery meat (A2).
- The ordinal is derived from POSITION, never passed in: a hand-written number drifts the moment an item is inserted, and a claim that miscounts itself is worse than an unnumbered one.
- A11y: a real `<ul>`, so the count is announced first. The ordinal is **not** `aria-hidden` — copy refers to items by number, and hiding a visible figure from a screen reader is exactly the asymmetry C5 warns about. Ordinals and meta take `--sv-ink-soft`, never faint (C2).
- Don't: no icons or tiles; no illustration; no card per item; no clickable item; no two-sentence body; no tenth item — at ten this is a page.

### B49 · `CallToAction` (v0.5)

The last row of a public page, and the only one that asks for anything. Everything above it states; this asks. That is why it holds exactly ONE primary: B10's rule is not relaxed on the public surface, it is at its most binding here, because a page that asks for two things has asked for neither. Title at `--sv-display-3`, one sentence capped near 52ch, the actions on the right, a mono note under them — and below 720px it stacks with the actions full width in a column. One job: **name the one act the page wants.**

- **Two surfaces, one prop.** `tone="paper"` is an ordinary card (A4: radius 4, one `--sv-shadow`, zero border). `tone="band"` paints `--sv-band` and takes the band's own tokens, carrying the `.sv-band` class so ghost buttons and focus rings inside it inherit the band treatment already defined in `button.css` and `base.css` — it writes none of its own. **Ink takes no shadow**: it is the wall's opposite, not a card resting on it.
- Marks on ink paint with `--sv-on-dark`. `color: var(--sv-paper)` is firewall rule 16 and would collapse every white-on-ink pair on dark.
- There is no `urgency`, `countdown` or `scarcity` prop, and there never will be: A3 is the copy contract, and a clock that pressures the reader is the opposite of a competent colleague.
- Don't: never two primaries; never a mono line of terms under the actions (F12); never "Get started" or "Learn more" (A3 — the button names its object); never a form inside it (that is a page, or a B24 Plate); never a tinted "premium" surface.

### B50 · `ProofRow` (v0.5)

The figures that carry the claim, on the public surface. **It is not a StatS1, and the distinction is written down because it is the only thing stopping the next reader reaching for the card.** B3 is the product's signature KPI: an icon tile, a delta against a comparison period, a footnote that adds information — a measurement on paper, in a dashboard, read by someone who owns the number. B50 is a marketing row: no card, no icon, no delta, no comparison. A figure at `--sv-display-3`, a mono label under it, on the wall, between vertical hairlines, read by someone deciding whether to believe the claim above. A2 names "generic admin widget" as a defect class; "generic marketing widget" is the same defect, and both start by reaching for the component that is already built. One job: **state the few figures that prove the claim.**

- The rules between items are the structure: a 1px `--sv-line` `border-left` on every item but the first. 4 across → 2×2 below 860px (where every item that starts a line drops its rule — a rule between nothing and nothing is worse than none) → 1 below 520px.
- A11y: a real `<dl>`, so each figure is announced with its label as one pair. The `<dt>` is FIRST in the DOM and a single CSS `order` puts the figure on top, so reading order and visual order are both honest and nothing is announced backwards. Nothing in the row is focusable, so the swap costs nothing.
- Figures are PRE-FORMATTED by the caller (C9) and tabular (A4).
- Don't: never a delta or an arrow (a public page has no comparison period); never an icon or a card per figure; never more than four — a fifth is a B7 DataTable; never a figure the product cannot substantiate (Ship Gate 12).

### B51 · `SiteFooter` (v0.5)

The last thing on a public page, and the only place a page is allowed to be a list of links. A `--sv-line` rule across the full width, then a brand column carrying the `76°` wordmark (six in `--sv-seed-text`, the degree mark receded to `--sv-ink-faint` — never omitted) and one sentence at 34ch, then up to four groups of at most six links, then a second hairline over the mono legal line and the secondary row. On the wall: no card, no shadow, no paper. One job: **close a public page with everything it owes the reader.**

- **The accessibility is the design.** ONE `<nav aria-label="Footer">` covers the whole link region: a footer that wraps each column in its own `<nav>` hands a screen reader four identical unlabelled navigations. Each group's `<ul>` is labelled by its own title through `aria-labelledby`, with ids from a single `useId` base.
- **The group titles are not headings.** Four h2s at the end of a document re-open the outline after the content has closed it, and they skip or duplicate levels depending on what the page above used (A4). A link group is a labelled list, so it is labelled as one.
- The wordmark carries one accessible name, "Seventy Six Degrees"; its glyph spans are `aria-hidden` so it is never spelled out. Two marks per page — the band opens, the footer closes — and nothing between them carries a third.
- `renderLink` is BandNav's adapter shape verbatim, so one function wires the band and the footer alike.
- Don't: no newsletter form (a form is a page, or a Plate); no social icon tiles (A2); no language picker that is the only path to anything (C4); no second wordmark on a page whose band already carries one; no fifth group — that is a sitemap page.

### B52 · `ErrorSummary` (v0.6)

**B11 has required this since v0.1.0 and the barrel never had it.** B11's validation contract ends: *"Submit reveals a top-of-form error summary linking to each field (focus moves to summary)."* Every 76° form that shipped skipped that sentence. B22 Banner's `bad` anatomy verbatim — paper card, 2px `--sv-bad` left rule, 16px tone icon, 13/700 title — with an `<ol>` body, one entry per failed field: a fragment link carrying the field's own LABEL, then the message in B11's voice. One job: **index a failed submit's field errors as one list of links to the fields that caused them.**

- **It never replaces the inline field error.** A2 sends every error to its source, B11 states it at the field, B22 says it again. The summary is the INDEX; the field error is the STATEMENT. A long form failing on field eleven needs both — one to find it, one to fix it.
- **No `role="alert"`, and the omission is the specification.** Focus moves here on a failed submit, and focusing an element already announces its content; an alert would announce the same event twice. That is the defect `FilterBar` refuses when it declines a second live region. Focus is what B11 mandates, so focus is what ships.
- Focus moves again when the SET of errors changes, not only when it first appears — a second failed submit is a second event.
- Each entry is a real fragment link to the input's own `id`, so the browser moves focus with no scripted scrolling. The list is an `<ol>` because the order is the form's order.
- The title states a tabular COUNT ("3 fields need attention"), never "Oops", never "Please", never an exclamation mark (A3). Tone is carried by the rule, the icon and the sentence, never by colour alone (C5).
- Don't: never replaces the field error; never a toast (A2); never lists an error with no field to point at (that is B22); never renders when empty.

### B7 · `DataTable` — v0.6 amendment · `totals`

The row every ledger, invoice, goods receipt and stock transfer ends with. **Before this the only way to draw one was to push a fake record into `rows`, where ↑/↓ focuses it, Space selects it, `onRowOpen` opens it and `page.of` counts it — four lies for one row.** `totals` takes `{ label, cells, strong? }[]` and renders a real `<tfoot>`: the label occupies the first column as a `<th scope="row">` in the mono uppercase header voice, and every other cell is keyed by `Column.key` and inherits that column's own `kind` — a `num` column's total is right-aligned and tabular exactly as its body cells are. A `strong` row takes a heavier top rule and 700 figures. One job: **state a table's closing figures outside the row, focus, selection and pagination models.**

### B7 · `DataTable` — v0.6 amendment · `leadHold`

A purchase-order line table is fourteen columns wide; at column seven the reader has lost which line they are on. `leadHold` holds the first column in place while the rest scrolls under it, with a `--sv-line` right rule marking the seam and `--sv-z-sticky` from the registered ladder. One job: **hold the row's identity column in place while the rest of a wide table scrolls under it.**

**It is self-limiting, and that is what keeps F3 refused.** F3 refuses the configurable data grid — column resize, pin, group, a toolbar the reader drives at runtime. This is not a pin: it is not caller-configurable per column, it is not draggable, and it applies to the first column ONLY when that column is already declared `kind: 'id'` — the row identity B7 already names. Passed on a table whose first column is anything else, it is IGNORED. **F3 protects against a table whose shape the reader rearranges; this lets the reader rearrange nothing.**

### The printed surface — v0.6

**C7 promises tables scroll and never truncate silently, and until 0.6 there was not one `@media print` rule in the repository.** On paper a scroll region has no scrollbar, so every column past the fold was gone with nothing on the page to say so — which made C7 structurally unkeepable on the one output surface every ERP, finance and admin product actually ships: the purchase order, the picking list, the invoice, the period report.

**It is specified exactly as the dark surface was, and inherits its governing rule verbatim: no component may branch on the medium.** The printed surface changes tokens in `tokens.css` and page rules in `base.css`, and nowhere else. A `print.css` was proposed and refused for that reason — a separate stylesheet is an invitation for a component to reach into it.

The band prints as paper with a rule under it, because a 1280px ink rectangle is a page of toner and a header nobody can annotate. `--sv-shadow` goes `none` and the card's edge comes from a hairline instead, because A4's zero-border rule exists to protect an elevation that does not exist on paper. Meaning is never carried by colour in 76° (C5), so a greyscale printer loses nothing that was load-bearing.

### B46 · `Split` — v0.6.1 amendment · the card's measure is a constant

`.sv-split__plate` centred the Plate on both axes, which shrink-wrapped it to its widest LINE: the same 400px card came out 400px on *Create account* — whose password hint runs to two lines — and **286px on *Sign in***, whose longest line is a button label. **A card's measure is a constant of the system, never a function of the copy inside it.** Two auth screens side by side have to be the same object. The plate now stretches horizontally and centres vertically; it paints nothing, so stretching is free, and the Plate's own `justify-items: center` still puts its 400px inner exactly on the seam.

**The wordmark is centred.** It is the one line in the card that is — the title, the fields and the footer stay left, because that is how the system sets type. The mark is not type in that sense: it is what the page belongs to, it is the same object on all seven auth screens, and B24 already centres it above the card on a plain Plate. When B46 moves it INTO the card it keeps the position it had.

### B26 · `SocialButton` — v0.6.1 amendment · the stack goes UNDER the form

The provider stack sits **below** the credential form, under the hairline `OR`, not above it. A federated button above the fields makes the page's first offer someone else's, and it puts three ghost buttons between the reader and the two inputs they came to fill. The credential form is the page's job; the providers are the alternative to it, and an alternative is stated after the thing it is an alternative to.

### B28 · `DescriptionList` — v0.6.1 amendment · the row's inset

Rows take **18px horizontal padding — exactly B7's cell inset.** B28 already says the value `kind` inherits the table's type discipline; it inherits the table's INSET for the same reason. The hairline still runs edge to edge, as a `<tr>` border does, but the type no longer touches the paper's corner — which is the defect firewall rule 18 exists to catch, and which this row was quietly committing everywhere it was a direct child of a card.

### B55 · `SumList` (v0.7)

**B44 `DistributionStrip`'s arithmetic sibling, and the pairing is the point: B44 divides ONE total into its shares; B55 builds ONE total FROM its lines.** B44 starts with 128,953 sessions and asks how they split; B55 starts with a line total, a discount, a tax and a carriage charge and asks what the reader owes. They share a voice deliberately — mono uppercase label left, pre-formatted figure right, the closing figure at B4's 19/700 step — because they are the same arithmetic read in opposite directions. One job: **state a set of amounts and the figure they add up to.**

**The boundary against B7, stated here because someone will otherwise use the wrong one.** INSIDE a table the closing figures are B7's `totals`: a real `<tfoot>` keyed to the table's own columns and repeated by the browser at the foot of every printed page. `SumList` is that block wherever it sits OUTSIDE a table — the amount-due card beside an invoice, the order summary beside a payment form. The test is not where the block looks right, it is whether the amounts belong to the table's columns: a line total does; shipping, a discount and tax belong to the DOCUMENT and have no column to sit in.

- **It never computes.** Every amount is a pre-formatted string the caller supplies (C9, A4), the currency symbol and the minus sign on a discount included. A component that adds up the numbers it was handed can disagree with the invoice, and the invoice is the document of record.
- It carries no inset of its own — inside a `<Card>` it takes `sv-card__body` (rule 18), like B6 and B41.
- Don't: never computes a sum; never a currency symbol the caller did not supply; never a minus the component invented; never more rows than a reader can check by eye; never inside a table — that is B7 `totals`.

### B5 · `Trend` — v0.7 amendment · the fit, the readout, and the opt-in draw

**The fit was a bug, and it is worth naming.** A chart card in a `main` split stretches to match the taller card beside it, and the plot rendered ~90px tall at the top of a ~490px card with 250px of dead paper beneath. **A chart card is the one card whose content should GROW into the space it is given** — every other card wraps its content and lets the grid stretch the paper, but a chart placed at the top of a card it did not fill has not been fitted, it has been dropped in. The plot now fills the height available, with a floor so a short card cannot squash it.

**`readouts` is enhancement, and that is the whole of its licence under C8.** C8 forbids hover-dependent information and B5's `highlight` amendment exists precisely because "a chart that only tells the truth under a pointer has failed C8". So: the readout row is **printed from the first frame**, it always names and states SOME column, and every figure it prints is a figure the marks already encode. Pointing at a column changes which one is stated; it never reveals a figure that was hidden. The strip is keyboard-reachable with a roving tab stop and arrow keys, because a pointer-only affordance fails C4 as well as C8. A reader who never touches the chart loses nothing — that is the test.

**The animated draw-in stays refused by default.** B5's Don't list is unamended: with the motion posture absent, the chart renders its finished state on first paint, exactly as it always has. Under `[data-motion="on"]` a line may animate its own `stroke-dashoffset`, which is legal precisely because the *un-animated* state is the finished line — the final state is correct whether or not the animation ever runs.

### The motion posture — v0.6.1

**Motion is a registered, opt-in posture, declared on a wrapper and resolved at the nearest declaration — exactly as `data-mode` and `data-seed` are.** `<div data-motion="on">` turns `--sv-t-enter` and `--sv-t-count` from `0ms` into durations; absent, they are zero and every animated path renders its finished state on first paint. `prefers-reduced-motion: reduce` collapses it to zero no matter what anyone declared, and so does print. The reduce block matches the bare `[data-motion]` attribute rather than `:root`, for the same reason the v0.4.0 seed amendment matches the descendant position: a nested wrapper's literal would otherwise shadow it.

**The governing rule, and the test: motion never carries information.** Every figure a count-up animates to is already printed and already in the accessible name at first paint. Delete every animation in the system and no screen states one thing less — which is the same test B44 `DistributionStrip` passes ("delete the strip and the card still answers the question"). A motion that fails that test is a defect, not a setting.

**A1's 200ms ceiling is amended once, by name.** `--sv-t-enter` is **200ms — at the ceiling, not over it**: the ceiling is a definition, not a budget, and one opacity step plus 6px does not need more. `--sv-t-count` is **640ms, and that IS an amendment**, stated here rather than smuggled past a grep that would never have seen it (it is not a CSS `animation`). The argument: the ceiling protects a reader who is *waiting*, and nobody waits on a count-up whose figure is already announced; below ~400ms a six-digit count is a flicker, so the real choice was a readable count or none at all. It is fenced three ways — off by default, zero under reduced motion, zero on paper.

**`countTo` + `format` are an inseparable pair** on B3 `StatS1` and B50 `ProofRow` — a union type, the same enforcement B42 `Popover` uses for `title`/`ariaLabel`. The component still never formats a number (C9), the pre-formatted string stays the source of truth, and the screen reader never hears a number counting: the animated mark is `aria-hidden` and the final figure is present, in words, from first paint.

### B1 · `BandTopbar` — v0.6.1 amendment · `navAlign`

`navAlign="center"` centres the nav in the row, brand left and utilities right. A product band reads left to right — brand, then the sections of the app, in the order the work happens. **A public page has no work and no order:** its links are peers, and centring them says so. Product screens keep `start`, which is the default. Below 1000px the nav leaves the band for the drawer (A2) and the rule has nothing left to centre.

### B1 · `BandTopbar` — v0.5 amendment · the marketing shell

`app` and `nav` are both optional. **The marketing shell is the band with its product navigation removed**: it keeps the wordmark and the right cluster, carries marketing links instead of app sections, and has no `BandSubTabs` row at all, because a public page has no section to sub-divide. A public page is not an app, so the wordmark stands alone and the hairline has nothing to divide. Below 1000px `BandNav` still swaps itself for the left Drawer — the public surface inherits the 320px floor rather than re-solving it.

### B2 · `Row` — v0.5 amendment · the section break

`space="section"` sets the row's top margin to 64px (40px below 1000px) instead of the 14px gutter. **14px separates two cards of one dashboard; it does not separate two arguments of one page.** It exists for the public surface and a product screen has no use for it. The overlap rule still wins on the one row that carries it — `[data-overlap]` is an attribute selector and this is a class — so a break can never cancel the signature move by accident.

### B19 · `Combobox` — v0.4.0 amendment

**Multi-select is specified, and the refusal it replaces was aimed at the wrong thing.** "Never multi-select" refused the implementation every library ships — a growing wall of dismissible pills that reflows the form on every pick — not the job. Pass `multiple` and `value` becomes a `string[]`: Enter and click TOGGLE the active option and LEAVE THE LIST OPEN, the query survives the toggle so three matches of one search are taken without retyping it, and Backspace on an empty query drops the value taken last. The two modes are a discriminated union, so they cannot be mixed and every single-select call site is untouched.

The selection is **STATED, never worn**: one mono line of running text under the field in the B7 `FilterLine` voice — a tabular count, at most three named values, `+N more`, and one "Clear". A2 bans pills, B23 keeps Badge category-only and non-dismissible, and that line is the component's only live region. Free text is still refused: a Combobox may never mint an option its caller did not supply. The job becomes "pick one value — or a set of them — from a list too long to scan."

### B7 · `DataTable` — v0.4.0 amendment · `FilterBar`

The third of three, and the division is now complete and binding: **`CardTabs` (B8) switches between mutually exclusive presets · `FilterBar` SETS the filters · `FilterLine` STATES what is set.** A card may carry all three, in that order, and each does exactly one of the three jobs.

`FilterBar` is a layout with slots, not a filter engine: a hairline-bottomed row under the CardHead holding a `SearchField` and at most three Selects or Comboboxes on the left, an `actions` slot and a "Clear all" pushed right, appearing only when something is actually set. It wraps when it runs out of room and never scrolls. `role="group"` with an `aria-label`, deliberately NOT `role="search"` — this filters a set in place, it does not search a site. It holds **no live region**: the announcement is `FilterLine`'s job, and two live regions for one change is a defect.
- Don't: never put the same dimension in both a FilterBar control and a CardTab — the reader cannot tell which one won.

### B5 · `Trend` — v0.4.0 amendment · the stated column

**`yTicks`** takes up to four PRE-FORMATTED labels, bottom to top, pinned to the four gridlines the plot already draws at 25/50/75/100 percent. The chart never formats a number (C9), and the column is `aria-hidden` because the required `ariaLabel` already carries the takeaway.

**`highlight`** names the ONE column the chart is ABOUT. It is a PRINTED STATEMENT, never a hover tooltip — C8 forbids hover-dependent information, so the chip is always visible. The other columns recede to `--sv-compare`, the chip is drawn in HTML rather than SVG because the plot is `preserveAspectRatio="none"` and would stretch any `<text>`, and the matching x label goes ink at 700. A chart that only tells the truth under a pointer has failed C8, and `highlight` is not a substitute for interaction.

(`.sv-trend__x` moved from `space-between` to a real column grid in the same change, fixing a latent misalignment: every x label between the first and the last used to drift off its bar.)

### B3 · `StatS1` — v0.4.0 amendment

The delta chip is extracted as **`Delta`** — `▲`/`▼` + tabular figure, 12/700, `--sv-ok`/`--sv-bad` — so a table cell, a DescriptionList row or a Trend head states a change in exactly the S1 voice, from one implementation. `polarity` handles inverse metrics honestly: `down-good` colours a fall as ok, and the previous guidance to flip the sign is WITHDRAWN — a card that prints ▲ for a figure that fell is lying. Direction stays non-colour-carried: the arrow glyph plus a visually-hidden "up"/"down" is the cue (C5). `StatS1` takes `deltaPolarity` and passes it through. The A2 ban stands: a stat that needs a sparkline is a Trend.

### B5 · `Trend` — v0.4.0 amendment

**`kind="stacked"`** sums the series per column and scales the plot to the TOTAL, segments running bottom-up seed → compare → faint. Legal only where the segments are parts of one real total; unrelated measures sharing an axis are two charts. **`Sparkline`** is the series at cell size — no axes, no grid, no labels, no interaction, scaled to its own min/max — and is legal ONLY beside a printed figure, because a line with no scale states nothing on its own (B4). Both keep B5's contract: `role="img"` with a required takeaway label, max three series, no fills, no draw-in.

### B7 · `DataTable` — v0.4.0 amendment

The table's missing half: what a selection DOES, and how filter state is shown.

**`SelectionHead`** replaces the CardHead IN PLACE while rows are selected — same row, same padding, `--sv-seed-tint` background, mono uppercase count in `--sv-seed-text`, the verbs, and "Clear". No floating action bar and no new z-index: the card's own header already owns that row. Keep to three verbs; the fourth belongs in a B20 Menu. Destructive verbs still route through the typed-object Dialog confirm (B10).

**`FilterLine`** states active filters as ONE mono line of running text — an optional tabular count, then `Label: Value · Label: Value` — with a single "Clear all", and that line doubles as the `aria-live="polite"` announcement. No chips and no pills: B23 Badge stays category-only and non-dismissible, and a filter you can dismiss individually is a control row, not a statement of state.

### B14 · `Toast` — v0.2.0 amendment

The toast grows into the full notification: 16px tone icon + 13/700 title + optional one-sentence description, tones `ok · info · warn · bad`, sizes 360/440, dismiss control. `warn` renders in ink (no amber, Law 2). ok/info auto-dismiss at 5s, polite; warn/bad persist until dismissed, assertive. The A2 discipline is unchanged: an error ALWAYS renders inline at its source first — a `bad` toast may ECHO a failure whose surface is elsewhere (a background job, another tab), never replace it. Max 3 stacked.

### B13 · `Dialog` — v0.2.0 amendment

`size` replaces `wide` (kept as a deprecated alias): `default` 480 · `wide` 640 · `full` — a takeover where the dialog becomes the wall, the work inside stays paper-on-wall, a visible named close appears, and scrim dismissal is off (there is no scrim to click).

### The dark surface — v0.2.0 amendment

Light-first stands: light is the default, dark is opt-in via `<html data-mode="dark">`. Dark changes ONLY tokens — the same paper-on-a-wall physics, inverted: the band stays the darkest thing on screen, the wall recedes, cards stay the lightest surface in view. Functional and seed-as-text steps are re-verified AA on dark paper; per-seed dark text variants live in tokens.css and nowhere else. No component may branch on the mode.

**A seed declared on a wrapper is still a seed — v0.4.0 amendment.** A product screen declares its seed on its own element (`<div data-seed="cobalt">`), not on `<html>`. A custom property resolves at the NEAREST declaration, so that wrapper's light-mode literals shadow every dark step below it: the whole screen paints seed-as-text at 2.90:1 and a white tint on dark paper. `tokens.css` therefore matches each seed in the DESCENDANT position as well as the same-element one, and derives the dark tint there too. A seeded region inside a dark document is exactly as AA-verified as a seeded document — and the fix lives in the tokens, where every dark-mode fix lives.

**Surfaces invert; marks do not — v0.2.1 amendment.** `--sv-paper` means the card surface and nothing else, so it inverts. The band and the seed do NOT invert, so the mark that sits on them must not either: band text, the on-band focus ring, the primary button label, and the checkbox/radio mark all paint with `--sv-on-dark`, white in both modes. `--sv-bad` is the exception that proves the rule — it brightens on dark, so the mark on its one legal fill uses `--sv-on-bad`, which flips with it. Painting a mark with `--sv-paper` is a firewall defect (rule 16).

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

**C10 · Direction — a stated scope boundary:** 76° is LTR only. The component layer uses physical direction properties (`left`/`right`, `margin-left`, `text-align:right` on numeric columns, `side="left"` on the nav drawer) and does not support RTL. Arabic, Hebrew, Persian and Urdu products are OUT OF SCOPE until this line is repealed. This is a weighed decision, not an oversight: logical properties were considered and rejected for v1 because a half-mirrored system — a band that flips while numeric alignment, the overlap, and focus order do not — reads as broken in a way a stated boundary does not. Repealing it is one system-wide change (band, overlap, drawer side, table alignment, focus order, tokens), never a per-component patch.

---

## PART D — THE SHIP GATE (run before showing Max anything)

**Fourteen points.** All must pass. Points 1–9 are the original visual gate; 10–14 arrived with the fundamentals layer (v0.1.0) and are stated here so the Book and `skill/seventy-six-design` carry the same gate — they are edited in the same change or neither is.

1. Grep Part A1 patterns — zero hits.
2. Count colors on the screen: neutrals + one seed + at most both functional colors as words/dots. Anything else fails. **Then check WHERE the seed landed (F14): the one seed fill is on the action, and every figure on the screen is ink.**
3. Every widget is a registered type (S1, Progress, Trend, MeterList, DataTable, CardTabs, ActivityList — from v0.2.0: Combobox, Menu, Drawer, Banner, Badge — from v0.3.0: Plate, PinField, SocialButton — from v0.4.0: Accordion, DescriptionList, Divider, Avatar, Spinner/Busy, Kbd, NumberField, Slider, DateRangeField, SearchField, FileField, Tabs, Stepper, TreeList, Timeline, Popover, CodeBlock, DistributionStrip, Split — from v0.5: Prose, and on the PUBLIC surface only, Masthead, FeatureList, CallToAction, ProofRow, SiteFooter — from v0.6: ErrorSummary — from v0.7: SumList) — if a new type was needed, it is named, single-jobbed, and added to Part B in the same change. If Part F refuses it, it is a screen, not a component.
4. Every S1 footnote passes the "so what" test (new information, not paraphrase).
5. Tab through the screen: visible focus everywhere, order sane, skip-link present (a Plate is the one exception, B24), ⌘K opens.
6. Squint test: the page reads as ink band + white paper on a platinum wall — a Plate (B24) reads as one card and a wordmark on the wall; nothing glows, nothing floats, nothing performs.
7. Copy audit vs A3: no exclamation marks, buttons name objects, errors say what and how to fix. Header audit vs F12: no kicker above a title, no mono note under an actions cluster, one or two buttons.
8. Contrast spot-check anything new against C1; new seeds through the C1 seed rule.
9. The degree mark: every wordmark reads `76°` — never bare `76`.
10. State contract: 8 interaction states on every interactive element, 4 lifecycle states on every data region; disabled is never bare opacity (Part E).
11. Responsive floor: reasoned through at 320/375/414/768/1000/1280 — no horizontal scroll, no two-line clickables, `minmax(0,1fr)` content tracks (C7, Part E).
12. Honest numbers: mockup data reconciles — deltas, sums and dates agree; zero invented claims, testimonials, or fake chrome (Part E).
13. Physics: no italic headings, no image hover motion, no bounce easing, no arbitrary z-index, no paper-on-paper (firewall rules 11–15 + Part E).
14. Stamped: the entry file opens with the `/* 76° · screen: … · gate: pass */` stamp — and the stamp tells the truth.

---

## PART F — THE REFUSED

The test: **if a widget's job needs more than one sentence, or it carries an internal toolbar or sub-taxonomy, it is a SCREEN composed of 76° parts — not a component.** These are refused by name so no one proposes them twice. Every refusal ships with the composition that replaces it.

| # | Refused | Compose instead |
|---|---|---|
| F1 | Rich-text / WYSIWYG toolbar | A textarea + a preview |
| F2 | Kanban board widget | A template (the CRM template already carries one) |
| F3 | Data grid (column resize, pin, group) | DataTable (B7) + Drawer (B21) |
| F4 | Calendar / scheduler grid | A screen, never a part |
| F5 | Carousel / slider | A list or a grid |
| F6 | Nested multi-level menus | One level, then a page |
| F7 | Password strength meter | The rule stated up front + an inline error |
| F8 | Tour / coachmark overlays | EmptyState (B15) + docs |
| F9 | Color picker, star rating | Out of taxonomy |
| F10 | Drag-drop dashboard layout | The fixed 12-column grid (B2) |
| F11 | Hero imagery, stock photography, illustration | Type, hairline, and real data |
| F12 | The kicker above a title · the mono note under an actions cluster | The closed header: title · one line · one or two buttons |
| F13 | Breadcrumbs | The Band states where you are; a record page states its own parent in its facts |
| F14 | A stat and a call to action in the same colour | The seed fill is the action's; every figure is ink |

### F12 · The closed header

**A header is a title, ONE line under it, and ONE or TWO buttons.** Nothing above the title. Nothing below the buttons.

The **kicker** — the mono uppercase category line sitting above a heading ("COMPONENT LIBRARY · v0.5", "PRICING", "OUR PLATFORM") — states the page's category to a reader who is already on the page, pushes the claim down the sheet, and adds a rung above the h1 that the document outline does not have. The **note** — the mono line of terms, licences and counts under the actions ("MIT · ZERO DEPENDENCIES · REACT 19") — is a footnote nobody reads, set in the voice reserved for metadata, doing the job the line above the buttons already had.

Both are refused because both are the same failure: **a slot filled because it exists.** So the refusal is enforced by the props not existing. B47 `Masthead` has no `eyebrow` and no `note`; B49 `CallToAction` has no `note`. A term that is load-bearing goes in the statement, or on the page the button opens. A third button is a B20 Menu, or it is a page.

### F13 · Breadcrumbs

Where you are is the Band's job (B1): the nav item is `aria-current`, the sub-tab row names the section, and the `PageHero` h1 names the page. A breadcrumb restates all three in a fourth voice, and it grows the nested multi-level structure F6 already refuses. A record page that genuinely has a parent states it as a **fact** — a `DescriptionList` row naming the order, the account or the requisition it came from, which is a link the reader can follow and a fact they can read, rather than a trail of chevrons above the title.

*(This closes the 0.8 `PathLine` proposal, which was a breadcrumb by another name. The drill path a reader took is not a component; the level above the current one is a link in the record's own facts.)*

### F14 · The stat and the action never share a colour

**The seed fill belongs to the action.** A view region gets one seed-filled primary (A2), and everything that states a number on that region is ink: a `StatS1` value, a `ProofRow` figure, a `DistributionStrip` total, a table's `num` column. The seed appears in a stat only as `--sv-seed-tint` behind a 34px icon tile (B3) or as the 3px bar B4 and B6 explicitly call illustration — never as the figure's own colour and never as a fill behind it.

The reason is arithmetic, not taste. **If the number is as loud as the button, the reader has two primaries, and a screen with two primaries has none.** Law 2 spends one accent per screen; a stat that takes it has taken it from the one control that needed it. This is why B50 `ProofRow` sets its figures in `--sv-ink` while the `CallToAction` below it carries the only seed rectangle on the page, and why B3 puts the seed in a 34px tile beside the value rather than in the value.

Corollary for the public surface: a `ProofRow` and a `CallToAction` on one page are the test case. Squint at it (Ship Gate 6) — exactly one thing should be coloured, and it should be the thing you click.

**F11'S REPLACEMENT COLUMN IS LOAD-BEARING: "type, hairline, and REAL DATA".** Every library the public page is measured against puts product photography where its hero is. F11 refuses that and A2 refuses the stock-photo card — but a component library has the one asset that qualifies as real data: **the components themselves, running, at rest, with figures that reconcile.** The 76° landing page therefore carries a SPECIMEN row — a live `StatS1` row, a live `DataTable` with its `<tfoot>`, a live `MeterList` — rendered by the same code the installer ships. Nothing on it is a picture of the product; it IS the product. It is not `aria-hidden`, because it is real and focusable, and a reader may tab into it.

**F11 SURVIVED THE PUBLIC SURFACE.** v0.5 dressed the pitch without repealing a single refusal: no photography, no illustration, no 3D, no logo cloud. B47 `Masthead` has no image slot, B48 `FeatureList` has no icon, and B50 `ProofRow` has no chart. The one thing that changed is the type ramp — three display steps, fenced to those components by firewall rule 17. A refusal that survives the surface it was written against is a refusal that was right.

**F4 is BINDING ON THE DATE RANGE.** 76° draws no month grid, ever. A date range is two native `<input type="date">` fields welded into one Field (B11), preceded by a mono uppercase preset row — `7D · 30D · QTD · YTD · CUSTOM` — and followed by a mono context line ("24 days · ends today"). The browser draws the calendar. That composition shipped as **B35 `DateRangeField`** in v0.4.0 — the refusal now has a component, and it still contains no grid.

*Seventy Six Degrees — the product is the design.*
