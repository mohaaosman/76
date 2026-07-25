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
- `animation` durations > 200ms; any `transition` on layout properties (width/height/top/left/margin); keyframe bounces/springs.
- `!important` — a component that needs it is mis-structured.
- Font families other than Hanken Grotesk / Fragment Mono (system stack fallbacks only).

**A2 · Banned patterns:**

- Sidebars as primary navigation at ≥1000px. Horizontal band nav is binding on desktop, and the band's nav never scrolls horizontally at any width. BELOW 1000px primary navigation IS a left sidebar: a B21 Drawer (`side="left"`, `size="sm"`) opened by a ghost button LABELLED "Menu" with a glyph beside it — never icon-only, that ban stands. BandSubTabs leaves the band below 1000px and nests, indented, beneath its parent nav item inside the drawer.
- Donut, pie, radial, and gauge charts in product screens. (W4 Meter list replaces them.)
- Filled status pills/badges/chips. Status = 6px dot + colored word.
- Icon-only buttons for primary actions; mystery-meat "⋯" as the only path to an action.
- Skeleton shimmer animations (use static skeleton blocks at `--sv-wall`).
- Emojis in product UI. Decorative illustrations in v1. Stock-photo cards.
- Toasts for errors that belong inline next to the field that caused them.
- More than one seed-colored primary button visible per view region.
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
2. Count colors on the screen: neutrals + one seed + at most both functional colors as words/dots. Anything else fails.
3. Every widget is a registered type (S1, Progress, Trend, MeterList, DataTable, CardTabs, ActivityList — from v0.2.0: Combobox, Menu, Drawer, Banner, Badge — from v0.3.0: Plate, PinField, SocialButton — from v0.4.0: Accordion, DescriptionList, Divider, Avatar, Spinner/Busy, Kbd, NumberField, Slider, DateRangeField) — if a new type was needed, it is named, single-jobbed, and added to Part B in the same change. If Part F refuses it, it is a screen, not a component.
4. Every S1 footnote passes the "so what" test (new information, not paraphrase).
5. Tab through the screen: visible focus everywhere, order sane, skip-link present (a Plate is the one exception, B24), ⌘K opens.
6. Squint test: the page reads as ink band + white paper on a platinum wall — a Plate (B24) reads as one card and a wordmark on the wall; nothing glows, nothing floats, nothing performs.
7. Copy audit vs A3: no exclamation marks, buttons name objects, errors say what and how to fix.
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

**F4 is BINDING ON THE DATE RANGE.** 76° draws no month grid, ever. A date range is two native `<input type="date">` fields welded into one Field (B11), preceded by a mono uppercase preset row — `7D · 30D · QTD · YTD · CUSTOM` — and followed by a mono context line ("24 days · ends today"). The browser draws the calendar. That composition shipped as **B35 `DateRangeField`** in v0.4.0 — the refusal now has a component, and it still contains no grid.

*Seventy Six Degrees — the product is the design.*
