# 76° Component Specs (B1–B51)

Read the relevant section BEFORE implementing or reviewing any specific component — every prop, class, role, and keybinding below is taken verbatim from the shipped `src/components/seventy-six/*.tsx`.

## B1 · Band

**Anatomy** — `Band` renders `<header class="sv-band">`. Composed of `BandTopbar` (`app`, `nav`, `utilities?`) → `BandSubTabs` → `PageHero`. Topbar carries the wordmark (`.sv-band__wordmark` = `7` + seed `6` + `°` in `.sv-band__wordmark-deg`, `aria-label="Seventy Six Degrees"`), `.sv-band__appname`, nav, and the `.sv-band__utilities` cluster. `BandNav`/`BandSubTabs` take `items: BandNavItem[]` (`{label, href, active?}`) plus optional `renderLink(item, className, ariaCurrent)`. `PageHero` takes `title`, `titleSoft?`, `context?`, `actions?`, `headingLevel?: 1|2`.

**States** — Active nav item = `.sv-band__navlink--active` (white / 700 / 2px seed underline); active sub-tab = `.sv-band__subtab--active`. No background fills, hover, or press transforms on nav items. `BandSubTabs` returns `null` when `items.length === 0`.

**A11y** — `BandNav` is `<nav aria-label="Primary">`, `BandSubTabs` is `<nav aria-label="Section">`. Active items carry three cues: `aria-current="page"` + weight 700 + underline, never color alone. `PageHero` renders the page's single `h1` (`headingLevel` drops to 2 only when embedded under an existing h1). Icon-only buttons are legal only inside `utilities`, and need `aria-label`.

**Don't**
- No sidebar as primary navigation — horizontal nav only.
- No stat numbers in the hero; stats live on paper.
- No background fill / pill on a nav item — the underline is the state.
- No bare "76" — the degree mark is never omitted.

## B2 · Sheet & Row

**Anatomy** — `Sheet` renders `<main id="sv-content" class="sv-sheet">`. `Row` renders `<div class="sv-row sv-row--{split}">` with `split?: 'stats'|'main'|'full'` (default `full`) and `overlap?: boolean` → `data-overlap`. Splits: `stats` = 4×1fr (2×2 below 1000px), `main` = 1.7fr/1fr, `full`.

**States** — No interactive states. `overlap` applies the single `-44px` margin-top that pins the first row over the band edge.

**A11y** — `<main id="sv-content">` is the skip-link target and the main landmark. Focus order: the overlap row is the first content stop after the band.

**Don't**
- No second `overlap` row on the same page — exactly one.
- No custom grid fractions; compose only from `stats`/`main`/`full`.
- No cards touching — the 14px gutter is structural.
- No nested `Row` grid inside a `Row` cell (a stack of cards is fine).

## A4 · Card & CardHead

**Anatomy** — `Card` renders `<section class="sv-card">` by default; `as?: 'div'|'section'|'article'`, spreads `HTMLAttributes`. `CardHead` renders `<header class="sv-card__head">` with `<h3 class="sv-card__title">` (`title`, required), optional `.sv-card__subtitle`, and one right-aligned `.sv-card__action` (`action?`).

**States** — Static paper: one `--sv-shadow`, radius `--sv-r`, background `--sv-paper`, zero border. No hover lift, scale, or glow. A clickable card wraps the whole `Card` in the anchor and puts the focus ring there.

**A11y** — `CardHead` emits an `<h3>`; keep the heading ladder unskipped (one h1 in the hero). A linking card is itself the anchor with a focus ring; hover adds nothing beyond the cursor.

**Don't**
- No border, second shadow, or tinted background — contrast alone separates paper from wall.
- No hover lift / scale / glow — paper does not perform.
- No icon-only "⋯" menu as the head action; one seed text-link or mono range control only.
- No card-in-card nesting; use hairlines for sections.

## B3 · StatS1

**Anatomy** — Composes `Card` (`role="group"`) with an `aria-hidden` visual tree of three zones: `.sv-stat__top` (`.sv-stat__label.sv-mono` + optional `.sv-stat__delta.sv-num`), `.sv-stat__mid` (`.sv-stat__tile` icon + `.sv-stat__value.sv-num` with optional `.sv-stat__unit`), `.sv-stat__foot`. Props: `label`, `value` (string), `icon` (required), `footnote` (required), `unit?`, `delta?`, `deltaSuffix?` (default `%`), `footnoteText?`.

**States** — `delta >= 0` → `.sv-stat__delta--ok` with `▲`; else `.sv-stat__delta--bad` with `▼`. Omitting `delta` renders no delta and shifts nothing.

**A11y** — Card reads as ONE unit via computed `aria-label` (`label: value(unit), up/down |delta|suffix, footnoteText`); all visual internals are `aria-hidden`. Direction carried by the `▲/▼` glyph, never color alone. `.sv-num` = tabular-nums on value and delta.

**Don't**
- No sparkline, menu, or second value inside a stat (those are Trend / two stats).
- No icon on the right — the tile sits left of the value; the tile is the only tint.
- No footnote that paraphrases the value; it must add new information.
- No generic KPI card anatomy — S1 is the only stat.

## B4 · Progress

**Anatomy** — `<div class="sv-progress">` with `.sv-progress__title`, `.sv-progress__value.sv-num`, `.sv-progress__track[role=progressbar]` > `.sv-progress__fill`, and optional `.sv-progress__context`. Props: `title`, `current`, `target`, `format?: (c,t)=>string`, `context?`.

**States** — Fill width = `min(100, current/target*100)%`; clamps at 100% (transitions once, ~160ms). No red-fill state.

**A11y** — `role="progressbar"` with `aria-label={title}`, `aria-valuenow={current}`, `aria-valuemin={0}`, `aria-valuemax={target}`. Visible numbers carry the information; the bar could vanish losslessly.

**Don't**
- No percentage without absolute numbers present in the card.
- No red bar — overdue goes to a table/list with a StatusWord.
- No load animation beyond the single width transition.

## B5 · Trend

**Anatomy** — `<div class="sv-trend">` with optional `.sv-trend__legend`, an `<svg class="sv-trend__plot" role="img">`, and optional `.sv-trend__x.sv-mono` (`aria-hidden`). Line kind: `.sv-trend__line.sv-trend__stroke--{tone}` + a `.sv-trend__dot` (r=4) on the `seed` series only. Bar kind: `.sv-trend__bar.sv-trend__fill--{tone}` (rx=2). Props: `ariaLabel` (REQUIRED), `series: TrendSeries[]` (`{label, data, tone?}`), `xLabels?`, `kind?: 'line'|'bar'` (default line), `height?` (default 160), `legend?`.

**States** — No hover/animation. Series capped at 3 (`series.slice(0,3)`); tone defaults: index 0 = `seed`, rest = `compare` (`#D6DAE0`). Grid is horizontal hairlines only.

**A11y** — SVG is `role="img"` with `ariaLabel` as the takeaway (the accessible content). Series must be named directly or via `legend`, never referenced by color alone in copy. For decision-critical data pair with a "View data" table.

**Don't**
- No area/gradient fill under lines.
- No dual-axis, no donut/pie/radial/gauge — MeterList replaces those.
- No animated draw-in.
- No more than three series.

## B6 · MeterList

**Anatomy** — `<div class="sv-meters">` of `.sv-meters__row[role=progressbar]`, each with `.sv-meters__line` (`.sv-meters__label` + `.sv-meters__value.sv-num`), `.sv-meters__track` > `.sv-meters__fill`, and `.sv-meters__subtitle`. Prop: `items: MeterItem[]` (`{label, current, max, value, subtitle}`) — `subtitle` is required by the type.

**States** — Fill width = `min(100, current/max*100)%`. No hover, no sort animation (re-render in new order). Every bar is seed on wall.

**A11y** — Each row is `role="progressbar"` with `aria-label="{label}: {subtitle}"`, `aria-valuenow={current}`, `aria-valuemin={0}`, `aria-valuemax={max}` — a reader hears the absolute numbers, not "92 percent".

**Don't**
- No percentage-only row — the absolute `subtitle` is mandatory.
- No red fill for hot zones — escalate to a table + StatusWord.
- No per-row hue differentiation; seed on wall, every row.

## B7 · DataTable

**Anatomy** — `<div class="sv-table">` > `.sv-table__scroll` > `<table class="sv-table__table">` with visually-hidden `<caption>`, `<th scope="col" class="sv-table__th">`, and `.sv-table__row` `<tr>`s. Column `kind: 'text'|'id'|'num'|'status'` drives cell classes (`sv-table__cell--num sv-num` right/tabular, `sv-table__cell--id` mono). Optional `.sv-table__pager` (`.sv-mono.sv-num` range + prev/next `.sv-table__pagebtn`). Props: `caption`, `columns` (`{key, header, kind?, sortable?, sorted?, onSort?, render}`), `rows`, `rowKey`, `onRowOpen?`, `selectable?`, `selected?: Set`, `onSelect?`, `announcement?`, `page?`.

**States** — Rows hover in seed-tint; `.sv-table__row--selected` adds the system's only 2px left rule (`aria-selected`). Roving tabindex — focused row (`tabIndex=0`) shows hover visual + focus ring. Sortable headers render a `.sv-table__sort.sv-mono` button with `↑/↓`; sorting logic is the caller's job.

**A11y** — Keyboard: `↑/↓` move row focus, `Enter` opens (also double-click), `Space` toggles selection, `⇧+↑/↓` and `⇧Space` range-select from anchor, `Home/End` jump. Sortable `<th>` carries `aria-sort`. `announcement` renders in a visually-hidden `aria-live="polite"` region.

**Don't**
- No mobile card-ification — scroll horizontally, headers stay.
- No zebra striping; hairlines separate rows.
- No numbered pagination pills — range + prev/next only.
- No left rule except the 2px seed rule on selected rows; no relative timestamps in ERP.

## B8 · CardTabs

**Anatomy** — `<div class="sv-cardtabs">` of `.sv-cardtabs__tab` buttons (active = `.sv-cardtabs__tab--active`) with optional `.sv-cardtabs__count.sv-mono.sv-num`. Props: `tabs: CardTab[]` (`{id, label, count?}`), `active`, `onChange`, `mode?: 'tabs'|'filters'` (default `tabs`), `idBase?`.

**States** — Active tab = seed text + 2px underline on the card hairline (no pill/fill). In `tabs` mode the active tab is the only tab stop (`tabIndex=0`, others `-1`).

**A11y** — `mode="tabs"`: container `role="tablist"`, buttons `role="tab"` + `aria-selected` + `aria-controls="{base}-panel"` + `id="{base}-tab-{id}"`; `←/→`/`Home`/`End` move (selection follows focus); panel must carry `id="{idBase}-panel"`. `mode="filters"`: plain buttons with `aria-pressed`, no tab semantics and no arrow-key handling.

**Don't**
- No mixing modes — server filters never wear `role="tab"`.
- No third nesting level (that becomes a page).
- No pill or filled active state — underline + seed text is the whole state.

## B9 · ActivityList

**Anatomy** — `<ol class="sv-activity">` of `.sv-activity__row` `<li>`, each with `<time class="sv-activity__time sv-mono">` and `.sv-activity__sentence` (`<p>`). Prop: `items: ActivityItem[]` (`{time, dateTime?, children}`); entities wrapped in `<b>` inside `children`.

**States** — Static; hairlines separate rows. No hover styling of its own.

**A11y** — Ordered list (sequence is the semantics). Timestamps use `<time dateTime>` with the full ISO value also on `title`.

**Don't**
- No avatars, icons, or color-coded event types — the sentence carries meaning.
- No "3 minutes ago" in ERP contexts.
- No infinite feed inside an overview card; cap and link to the full log.

## B10 · Button

**Anatomy** — `Button` renders native `<button class="sv-btn sv-btn--{variant}">`. Props: `variant?: 'primary'|'ghost'|'danger'|'link'` (default `primary`), `pos?` → `.sv-btn--pos`, `isLoading?`, `loadingLabel?` (default `Working…`), `iconLeading?` (rendered in `aria-hidden` `.sv-btn__icon`), plus all `ButtonHTMLAttributes`. `ButtonLink` renders `<a class="sv-btn sv-btn--link">`.

**States** — Loading: width is locked to the pre-loading `offsetWidth`, label swaps to `loadingLabel`, `.sv-btn__spinner` (12px SVG) shows, `disabled` + `aria-busy` set. Disabled: wall fill + faint text + `cursor: not-allowed` (never opacity). `danger` becomes a red fill only with `data-confirm` inside a Dialog. No transform/size change on press.

**A11y** — Rendered as `<button>` or `<a>` only. `Tab` shows a 2px seed focus ring (offset 2px, always visible); `Enter`/`Space` activate natively. `isLoading` sets `aria-busy="true"` and blocks interaction. Icon-only buttons require `aria-label` and are legal only in the topbar utility cluster.

**Don't**
- No two seed-filled primaries in one view region.
- No red fill outside a Dialog's destructive confirm.
- No opacity-dimmed disabled — use wall fill + faint text.
- No vague labels ("Submit", "Click here", "Learn more"); no press transforms.

## B11 · Forms (Field, Select, Checkbox, Radio, Toggle)

**Anatomy** — Shared chrome: `.sv-field` wrapper, `.sv-field__label` (above, always), optional `.sv-field__hint`, `.sv-field__req.sv-mono` `*`, and `.sv-field__error`. `Field` = native `<input class="sv-field__input">` (`multiline` swaps to textarea). `Select` = native `<select class="sv-field__input sv-field__select">` in `.sv-field__selectwrap` + `.sv-field__chevron`. `Checkbox`/`Radio` = visually-hidden `.sv-check__input` + styled `.sv-check__box` proxy + `.sv-check__label`. `Toggle` = `.sv-toggle__input` + `.sv-toggle__track`/`__thumb`. Shared props: `label` (required), `hint?`, `error?`, `required?`, plus native input/select props.

**States** — Focus = 1.5px seed border, no glow. `error` adds `.sv-field__input--error`. Validation timing: on blur, then on change after the first error — never on first keystroke.

**A11y** — Every control is a real native input (Checkbox/Radio/Toggle are hidden inputs with styled proxies). `error` sets `aria-invalid` + `aria-describedby={id}-error`; `hint` links via `aria-describedby={id}-hint`. `required` renders the mono `*` AND the native attribute. `Toggle` carries `role="switch"` (announced on/off). `Space` toggles Checkbox/Toggle; `↑/↓` move within a Radio group / Select.

**Don't**
- No placeholder-as-label — the label is above, always.
- No focus glow ring; the border change is the focus state.
- No error toast — errors render at the field.
- No Toggle for anything that waits for Save (that's a Checkbox); no custom dropdown until a real combobox is needed.

## B12 · StatusWord

**Anatomy** — `<span class="sv-status sv-status--{tone}">` with an `aria-hidden` `.sv-status__dot` (6px) + the word. Props: `tone: 'ok'|'neutral'|'bad'` (required → `--sv-ok`/`--sv-ink-soft`/`--sv-bad`), `children: string` (required).

**States** — No interactive states; the dot never appears without a word.

**A11y** — The word IS the status — meaning never carried by color alone. The dot is `aria-hidden` decoration.

**Don't**
- No filled pill, badge, or chip — ever.
- No dot without a word.
- No ad-hoc status words — the vocabulary is registered per product.
- No coloring the table row/cell to echo the status — the word suffices; there is no amber tone (attention uses `neutral`).

## B13 · Dialog

**Anatomy** — Native `<dialog class="sv-dialog">` (`showModal()`), `.sv-dialog--wide` for 640px forms (default 480px). Inner `.sv-dialog__panel` > `<h2 class="sv-dialog__title">` + `.sv-dialog__body` + optional `.sv-dialog__footer` (ghost cancel + ONE primary/danger). Props: `open`, `onClose`, `title` (required), `wide?`, `destructive?`, `preventEscape?`, `footer?`, `children`.

**States** — `open` drives `showModal()`/`close()`. `destructive` disables scrim-click close (Esc still works). `preventEscape` blocks Esc mid-flight. Scrim is flat `rgba(27,31,38,.4)` — no blur.

**A11y** — `role="dialog"` + `aria-modal` (native) + `aria-labelledby` wired to the title id. `Esc` closes (suppressible via `preventEscape`); `Tab`/`⇧Tab` cycle inside via native focus trap. Focus moves to the first control on open, returns to the invoker on close. Scrim click closes non-destructive dialogs only.

**Don't**
- No "X" icon as the only close path — the footer names its cancel.
- No blur on the scrim.
- No stacked dialogs — a second decision is a second moment.
- No red-filled confirm outside this destructive footer.

## B14 · Toast

**Anatomy** — `ToastProvider` renders the app once, plus a `.sv-toaster` container. Each toast = `.sv-toast.sv-toast--{tone}` (2px left rule: seed for `info`, green for `ok`), bottom-left. `useToast()` returns `{ toast(message, tone?) }`; `tone?: 'ok'|'info'` (default `info`).

**States** — Auto-dismiss at 5000ms with pause-on-hover (`onMouseEnter`/`onMouseLeave`), resume with ≥800ms grace. Max two stacked (`prev.slice(-1)` + new); a third replaces the oldest. There is deliberately no error tone.

**A11y** — Container is `aria-live="polite"` (`aria-label="Notifications"`) — never interrupts mid-task. The 5s window + polite region ensures full announcement before removal. A toast must never be the only path to an action.

**Don't**
- No error toast — errors render inline at their source.
- No more than two stacked.
- No top-right placement — bottom-left only.
- No "Awesome!" / "Oops" copy or exclamation marks.

## B15 · EmptyState

**Anatomy** — `<div class="sv-empty">` with `.sv-empty__sentence` (`<p>`) and optional `.sv-empty__action`. Props: `sentence` (required, max two lines rendered), `action?` (exactly one primary Button; optional when no action exists).

**States** — Steady state; no interactive states of its own beyond the action Button.

**A11y** — Plain paragraph text — no live region (an empty state is steady, not an announcement). The action is a real Button with the standard focus contract.

**Don't**
- No illustration, mascot, or emoji.
- No "Oops" / "Nothing to see here" — say what would appear and why it's empty.
- No more than one action (two paths is a decision → a page).

## B16 · SearchCommand

**Anatomy** — Native `<dialog class="sv-command">` (reuses Dialog anatomy) with `.sv-command__panel` > `.sv-command__input` (mono) + `.sv-command__list` (`role="listbox"`). Results grouped under `.sv-command__group.sv-mono` labels; items = `.sv-command__item` (active = `--active`) with optional `.sv-command__hint.sv-mono`. `useSearchCommand()` returns `{ open, show, hide }`. Props: `open`, `onClose`, `items: CommandItem[]` (`{id, group, label, hint?, keywords?}`), `onPick`, `placeholder?` (default `Search…`), `bindShortcut?` (default true). Plain substring filter, capped at 12 results.

**States** — `activeIdx` drives `.sv-command__item--active`; mouse-enter sets active. Empty query shows all; no matches renders `.sv-command__none`.

**A11y** — Input is `role="combobox"` with `aria-expanded="true"`, `aria-controls="sv-command-list"`, and `aria-activedescendant` pointing at the active `role="option"` (`id="sv-cmd-{id}"`, `aria-selected`); `placeholder` doubles as `aria-label`. Group `<ul>`s are `role="presentation"`. Keys: `⌘K`/`Ctrl-K` toggle globally, `↑/↓` move (no wrap), `Enter` picks, `Esc` closes and returns focus.

**Don't**
- No fuzzy-match theatrics / highlighted letter fragments — plain substring.
- No recent-searches clutter in v1.
- No hijacking ⌘K with a second palette — one front door per app.

## B17 · Skeleton

**Anatomy** — `Skeleton` renders `<span class="sv-skeleton">` (`.sv-skeleton--round` for avatar ghosts), sized by props `width?` (default `100%`), `height?` (default 12), `round?`. `SkeletonGate` renders `children` only after a 300ms timeout. Skeletons must mirror the target anatomy (an S1 skeleton has three zones, e.g. `.stat-skeleton` / `.stat-skeleton__mid`).

**States** — Static `--sv-wall` blocks — no shimmer, pulse, or gradient sweep. `SkeletonGate` renders nothing until 300ms elapse, so fast loads never flash.

**A11y** — Skeletons are `aria-hidden`; loading is announced by the owning region (e.g. the DataTable's polite live region or `aria-busy` on the section), not by the blocks.

**Don't**
- No shimmer / pulse / gradient sweep.
- No generic gray rectangle — match the target component's anatomy.
- No skeleton for waits under 300ms — always gate.

## B18 · Tooltip

**Anatomy** — Renders the single `children` trigger (cloned) + a `<div class="sv-tooltip" popover="manual" role="tooltip">` in the top layer. Props: `content: string` (plain text, 11.5px white on ink), `children: ReactElement` (a single focusable trigger), `delay?` (default 300). A small placement routine positions above the trigger, flipping below when there is no room.

**States** — Hover shows after `delay`ms; keyboard focus shows immediately (`onFocus` → `showNow`); blur/mouse-leave hide. No arrow/beak decoration.

**A11y** — Tip carries `role="tooltip"`; the trigger receives `aria-describedby={id}` automatically. Focus shows it with no delay (no hover-dependent functionality). Never the sole carrier of a label — icon-only triggers still need their own `aria-label`.

**Don't**
- No interactive content inside (no links, no buttons).
- No tooltip as the only label for an icon button.
- No arrow/beak decoration; no instant-on hover (the 300ms delay prevents flicker sweeps).

---

# B19–B51 · the later taxonomy (condensed)

Added after v0.1.0. Same contract as above — one job, fixed anatomy, enumerated states, a Don't list — condensed to the load-bearing rules. The full text lives in `docs/76-COMPONENT-BOOK.md`.

## B19 · Combobox (v0.2.0)

The searchable select. Native `<select>` (B11) stays the default for short, known lists; the Combobox exists past ~10 options or when the user knows the value's NAME faster than its position. ARIA 1.2 pattern, `aria-activedescendant`, focus never leaves the input. B11 field chrome verbatim. **One job:** pick ONE value from a list too long to scan. **Don't** — never inside an `overflow` container, never multi-select, never free-text.

## B20 · Menu / MenuButton / SplitButton (v0.2.0)

An actions dropdown on the native `popover` top layer — light dismiss, Esc, focus return, zero z-index. Items are VERBS naming their object; a danger item turns `--sv-bad` and still confirms in a Dialog. **One job:** hold the secondary verbs one control cannot. **Don't** — never navigation (that is the Band), never selection (that is a Select/Combobox), never nested (F6).

## B21 · Drawer (v0.2.0)

Full-height paper panel from the screen edge on native `<dialog>.showModal()`. Head = 15/700 title + optional mono context + named close; scrolling body; sticky footer = ghost cancel + ONE primary. Sizes sm 360 · md 480 · lg 640 · full. Entry slides 24px, transform-only, 160ms, 0 under reduced motion; exit instant. **One job:** inspect or edit ONE record without leaving the sheet. Dialog interrupts for one decision; `Dialog size="full"` replaces the page.

## B22 · Banner (v0.2.0)

The inline notice — where B14 sends every error: in the flow, adjacent to its cause. Paper card, 2px left tone rule, 16px tone icon, 13/700 title, full-sentence body (what happened AND how to fix), at most one text-link action, optional dismiss. Tones info (seed) · ok · bad · warn IN INK — no amber (Law 2). `bad` is `role="alert"`. **Don't** — never auto-dismisses, never stacks past the worst condition, never replaces a field error.

## B23 · Badge (v0.2.0)

Mono uppercase tag for CATEGORY metadata: environment, plan, type, version. Wall-toned, hairline border, rectilinear — never a pill. Seed marks the current category, one per group. **Don't** — live state is a StatusWord (B12); quantities are stats or cells. If it can change while you watch, it is not a Badge.

## B24 · Plate (v0.3.0)

The band-less page type: wall edge to edge, one centred card ≤400px, mono `76°` wordmark 20px above, nothing else. Carries auth, 404, 500, maintenance, expired link. Card title is the page `<h1>`; the skip-link is omitted (the one registered C4 exception — a Plate has nothing to skip). **Don't** — never nav, never a PageHero, never a second card. Two decisions = two pages.

## B25 · PinField (v0.3.0)

The OTP input: 4–8 fixed single-character boxes (default 6), 40×46, 8px gaps, Fragment Mono 18 centred, bordered `--sv-field-line-strong` (an empty box has no label, value or fill, so its border owes the 3:1 non-text bar, C1). Typing advances, Backspace retreats, one paste fills every box. Semantically ONE input: `inputmode="numeric"`, `autocomplete="one-time-code"`, error announced once for the whole code. **Don't** — no masking, no auto-submit without a visible primary, no keyboard trap.

## B26 · SocialButton (v0.3.0)

B10 Ghost anatomy verbatim, full card width on a Plate. The provider mark is ONE path in `currentColor` at 16px — never brand hexes, never multi-color, never a raster (Law 2, A1). Label names provider and act: "Continue with Google". At most three, separated from the credential form by a hairline rule with a mono "OR". **Registered override:** a product bound by a provider's brand guidelines may restore that mark locally; the 76° layer stays currentColor.

## B27 · Accordion (v0.4.0)

Native `<details>`/`<summary>` on hairlines, mono meta right of the title, chevron drawn from borders rotating on `[open]`. `exclusive` uses the native `name` group; independent is the default. **One job:** fold SECONDARY detail away until asked for. **Don't** — never the primary job of a screen, never navigation, never animates height (A1), never nests.

## B28 · DescriptionList (v0.4.0)

A real `<dl>`: mono uppercase terms (table-header voice), 13/500 values, one hairline per pair, `kind="id"` mono and `kind="num"` tabular right. Collapses to one column below 520px (C7). **One job:** state labelled facts about ONE record. **Don't** — never compares two records (that is B7), never holds editing controls.

## B29 · Divider (v0.4.0)

A hairline, or a rule carrying mono uppercase text ("OR", "ARCHIVED"). Unlabelled renders `<hr>`; labelled renders `role="separator"` with the label as its accessible name. Band tokens on the band. **Don't** — never stands in for a heading, never two in a row, never first or last child of a card.

## B30 · Avatar / AvatarGroup (v0.4.0)

Initials from the name on `--sv-wall` at 24/32/44px, radius 50%; a photo only where the product holds one — never a silhouette, never stock (A2, F11). `tone="seed"` marks the current user. AvatarGroup overlaps at −6px with a paper ring drawn as an inset shadow and states the remainder in mono. **Don't** — never the sole carrier of a name (A4), never a presence dot welded on, never the full list on hover (C8), never image motion (Part E).

## B31 · Spinner / Busy (v0.4.0)

`sv-rotate` at 800ms — the ONE continuous animation in the system, shared with B10's loading button. `Busy` sets `aria-busy` + `aria-live="polite"` on a region with a REQUIRED sentence naming what is loading; children stay legible underneath at 0.4 opacity (no scrim, no blur). The B17 line: Skeleton is first paint, Busy is a region already holding content. Neither under 300ms. **Don't** — never a bare spinner without a sentence, never a full-page blocker, never a shimmer.

## B32 · Kbd (v0.4.0)

Real `<kbd>` in Fragment Mono 10.5 on a wall cap, hairline border with a 2px bottom, 3px radius; transparent with band tokens on the band. A `separator` turns a chord into a sequence. **Don't** — never prints an unbound shortcut, never clickable, never replaces a visible control (C4), never more than three caps.

## B33 · NumberField (v0.4.0)

Native `<input type="number">` in B11 chrome, right-aligned tabular 600, with a square 34px − / + pair replacing the browser spinners. The unit is stated in mono BESIDE the field, never as a placeholder. Bounds are ENFORCED: typing past `max` clamps, − disables at `min`, + at `max`. Step buttons carry aria-labels naming the object. **Don't** — never for a value people type in full, never unbounded where bounds exist.

## B34 · Slider (v0.4.0)

Native `<input type="range">` on B4 bar geometry: 3px wall track (radius 2), 14px seed thumb (50%), C3 focus ring. The mono readout beside the label is REQUIRED — the bar illustrates, the figure informs. **There is no filled track**: a two-tone fill needs a gradient, and A1 bans gradients. `format` also becomes `aria-valuetext`. **Don't** — never for an exact value (B33), never dual-thumb, never without the number.

## B35 · DateRangeField (v0.4.0)

**F4 is binding: 76° draws no month grid, ever.** A mono preset row (`7D · 30D · QTD · YTD · CUSTOM`, `aria-pressed`) over two native `<input type="date">` fields welded into one B11 Field, under a mono `aria-live` context line ("24 days · ends today"). The end field takes the start date as its `min`. A start after the end is caught by the field in B11 voice. **Don't** — never a month grid, a scheduler, or a compare overlay; never relative-only ranges (C9); never more than five presets.

## B36 · SearchField (v0.4.0)

The in-place filter: a native `<input type="search">` in B11 chrome with a 14px magnifier left, a NAMED clear button right (the WebKit cancel button is suppressed — unstyleable, unlabelled, invisible on the wall), and an optional mono `aria-live="polite"` result line stating how many of how many now match, rendered even when empty so the FIRST announcement is not lost. Escape clears and keeps focus. The B16 line: `SearchCommand` is ⌘K, a dialog, and it NAVIGATES; this filters what you are already looking at — shipping one does not excuse skipping the other. `labelHidden` is a REGISTERED A4 exception, legal only inside a CardHead or a B7 `FilterBar` that already names the set. **Don't** — never a submit button (it filters as you type, or it is a form); never `resultText` inside a FilterBar that also carries a FilterLine.

## B37 · FileField (v0.4.0)

Attach files, and state what happened to each. B11 label and hint over a drop zone whose 1px DASHED `--sv-field-line-strong` border is its only affordance and owes the 3:1 non-text bar (C1, B25's reasoning). The zone is a TARGET, not a control: a real `<input type="file">` and a named "Choose files" button carry the interaction, so the keyboard reaches everything without a fake `tabIndex` on a div. A mono constraint line names what is accepted and the ceiling; hairline-separated rows carry name, mono size, then B4's bar geometry while uploading, the WORD "Uploaded" when done, an error stating what and how when failed. It owns NO transport — uploading, retrying and cancelling are the product's. **Don't** — never status by colour alone (C5), never a byte count formatted in the component (C9 — `size` is a string), never a drop zone with no button.

## B38 · Tabs (v0.4.0)

Switches a WHOLE CONTENT REGION of the sheet, on the wall, directly above the region it switches — the third of three lookalikes: `BandSubTabs` (B1) NAVIGATE, `CardTabs` (B8) FILTER ONE CARD'S CONTENT in place, `Tabs` (B38) changes which set of cards the sheet shows. Pick by what changes, never by what it looks like. 14/700 soft labels → active `--sv-seed-text` under a 2px seed underline on the row's own hairline, optional mono tabular count, no fill on a tab ever. Real ARIA tabs only — `role="tablist"`, roving tabindex, ←/→ wrap, Home/End, automatic activation; there is no `filters` mode (that is B8's `aria-pressed`). Each tab owns its own `TabPanel` via a shared `idBase`. Below 1000px the row WRAPS, never scrolls; cap five — a sixth section is a band nav item. **Don't** — never for state a user should be able to link to or reload into; that is navigation, and it belongs on the band.

## B39 · Stepper (v0.4.0)

Where you are in a fixed sequence, and what remains: an `<ol>` of 24px `--sv-r` markers carrying mono step numbers — done seed-filled with a check in `--sv-on-dark`, current seed-filled with the number, upcoming `--sv-wall` behind a 1px `--sv-field-line-strong` border (its only affordance against the wall, C1) — each beside a label and optional note, joined by a 1px connector running seed behind the current step and `--sv-line` ahead of it. Below 620px it stands up vertically; nothing hides, nothing scrolls (C7). **A Stepper is a STATEMENT, not a control:** steps are plain text unless `onStepSelect` is passed, and even then only ALREADY-COMPLETED steps become buttons. The B4 line: Progress measures a quantity against a target, a Stepper counts named steps. `aria-current="step"` plus visually-hidden words ("Step 2 of 4, completed") — a seed fill is a colour (C5). **Don't** — never more than five steps, never a percentage beside it, never a step that can be skipped silently.

## B40 · TreeList (v0.4.0)

A hierarchy whose DEPTH is itself the information — a chart of accounts, a bill of materials, a folder tree, an org. The full ARIA tree pattern hand-rolled, zero dependencies: `role="tree"`/`treeitem`/`group`, ONE tab stop for the whole tree (roving tabindex), a border-drawn chevron rotating on expand, 18px indent per level, a mono meta column right of the label, and B7's selected-row language (`--sv-seed-tint` + the 2px seed left rule). Fully controlled — `expanded` is a `Set` the caller owns. Keyboard: ↑/↓ through VISIBLE nodes · → expands or moves to the first child · ← collapses or moves to the parent · Home/End · Enter/Space select. The `<li>` itself is the `treeitem` and carries the tabindex. The boundaries: B27 folds secondary detail and never nests, B7 holds flat records sharing columns, F3 refuses the data grid. **Don't** — no checkbox tree in v1, no inline row verbs (that is a B20 Menu), no lazy-load spinner inside a row, never deeper than the data genuinely is.

## B41 · Timeline (v0.4.0)

The ordered history of ONE record, with the gaps visible: an `<ol>` on a 1px `--sv-line` rail clipped at the first and last markers, a 7px dot ringed in paper by an inset shadow — `done` seed, `pending` paper behind a 1.5px `--sv-field-line-strong` ring, `bad` in `--sv-bad` — beside a mono absolute timestamp in a real `<time dateTime>`, a 13/600 title, an optional one-sentence body and an optional mono actor. An item's `group` renders a mono uppercase day divider, `role="presentation"` so it stays out of the `<ol>` count. The B9 line: `ActivityList` is a live flat feed across many records answering "what needs me"; a Timeline is one record and shows what has NOT happened yet — that is why it has a `pending` tone and a feed does not. Tone is ALSO stated in visually-hidden words (C5). **Don't** — never relative time as the only form, never two sentences of body, never an interactive row (a step that opens something is a link in its body).

## B42 · Popover (v0.4.0)

The non-modal panel holding a FEW CONTROLS beside the control that asked for it — a column chooser, a saved-view picker, a short explanation with a link. It earns its place at four boundaries: B18 `Tooltip` is a phrase with no interactive content; B20 `Menu` is a list of verbs with `role="menu"`; B21 `Drawer` is a workspace beside the work; B13 `Dialog` interrupts modally for one decision. Native `popover` attribute — top layer, light dismiss, Esc, zero z-index — paper, hairline, one shadow, min-width 220 / max-width 320; wider is a Drawer. It OWNS its trigger, so `aria-expanded`/`aria-controls` cannot drift, and `title`/`ariaLabel` are a mutually exclusive union so an unlabelled panel does not compile. Focus is NEVER trapped: tabbing past the last control closes it and carries on into the page. B20 Menu now stands on this component — `usePopoverAnchor` lives here and is deliberately not re-exported. **Don't** — never the only path to an action (C4), never navigation, never nested inside another popover, never an error surface (that is B22).

## B43 · CodeBlock (v0.4.0)

Code or a command, printed exactly as it must be typed: `--sv-wall` inside a 1px `--sv-line` border — the one place a bordered inset panel is right, because the code is a quotation and not a card — with an optional mono head naming the file or language, a copy control, and `<pre><code>` in Fragment Mono 12/1.6 at `overflow-x: auto` (never `hidden`, C7). `numbered` puts the gutter OUTSIDE the `<code>`, `aria-hidden`, unselectable and sticky. **No syntax highlighting, ever** — that is six to nine colours on one surface and Law 2 allows neutrals plus one seed; a snippet needing colour to parse is too long. The copy control reads "Copy", becomes "Copied" for two seconds at a locked minimum width (B10), announces through a visually-hidden polite region, and is NOT RENDERED when `navigator.clipboard` is absent. `role="region"` + `tabIndex={0}` apply only when the block actually scrolls, measured at runtime. **Don't** — no highlighting, no inline `<code>` use (that is B45 `Prose`), no code as an image, no tab row of filenames (that is B38 holding several CodeBlocks).

## B44 · DistributionStrip (v0.4.0)

**The donut, answered.** B6 `MeterList` measures each part against ITS OWN maximum ("Zone A is 92% full"); B44 divides ONE total into its shares ("46% of 128,953 clicks were mobile") — every donut a team has drawn was asking this question and being handed B6's answer. A B4-voiced value line (mono uppercase label left, formatted total right at 19/700 tabular) over one 10px strip at radius 2, segments in the given order separated by a 2px `--sv-paper` seam that is STRUCTURAL precisely because gradients are banned (A1). Tones run `--sv-seed` → `--sv-compare` → `--sv-ink-faint` → `--sv-field-line-strong`, the last step still visibly a FILL; a fifth part reuses the fourth. Then a legend, one row per part — 8px swatch, label, and the REQUIRED absolute figure beside the share, inherited whole from B6. The strip is `role="img"`; the legend IS the data, so deleting the strip must leave the card still answering the question. `total` is the denominator when the parts are a subset, and the `ariaLabel` says so in words. **Don't** — more than five rows is a B7 DataTable, a stack of strips comparing periods is B5 `kind="stacked"`, and it is never bent into a ring.

## B45 · Prose (v0.5)

The one component in 76° that styles elements it does not own. 13/1.5 is an instrument for scanning a table, so running copy — a changelog, a help article, a policy page — gets a second ramp scoped to one subtree: 16/1.6 on a ~66ch measure, a heading ramp that stays INSIDE the product ramp (27/21/17/15 — the display steps are rule 17's and are refused here), real list markers, a 2px `--sv-line` blockquote rule, inline `<code>` on a wall inset at the registered 3px radius, tables in the table-header voice, links underlined in `--sv-seed-line`. Markdown rendered to HTML drops straight in. It is also where F1 is answered — 76° composes a textarea plus a preview, and `Prose` is that preview and then the published article. Part E's ONE italic lives here and nowhere else (`prose.css` is the registered exception); a heading inside it is still upright. Heading LEVELS are the AUTHOR'S — it never renumbers. **Don't** — never wraps application UI, never a real snippet (that is B43), never nested, never used to smuggle a second type scale into a product screen.

## B46 · Split (v0.4.0)

The band-less page, cut in half, with the card ACROSS THE CUT: two flat surfaces — ink and wall, side by side or stacked — meeting on one seam, with a B24 `Plate` centred ON that seam so half the card is on ink and half on wall. **This is B2's overlap, finished** — the only 76° layout in which paper crosses a surface boundary rather than resting on one. The halves carry NOTHING (no statement, widget, screenshot or illustration), so they are `aria-hidden` and the page reads as exactly the Plate it composes; A1 refuses the gradient, which is also what leaves a hard edge to straddle. B24 is composed verbatim with one consequence: the wordmark and the footer move INTO the card as hairline-ruled rows, because centred above and below a seam they would land half on ink and half on paper. `side` cuts vertically, `stacked` horizontally, and below 1000px `side` becomes `stacked` on its own; no skip link (B24's waiver), no new z-index (one grid cell, DOM order). **Don't** — no text on either half, no gradient between the surfaces, no second card and no second decision, no Split for 404, 500, maintenance or an expired link where a plain Plate is the whole answer.

## B47 · Masthead (v0.5)

**The hero, refused as imagery and rebuilt as type.** F11 bans hero photography, illustration and 3D, A2 bans the stock-photo card, A1 bans the gradient every hero grows next — what is left is a claim, set large, with nothing behind it. There is no image slot, no video slot and no background slot, and adding one is a Book change rather than a prop. It is B1 `PageHero`'s public-surface sibling and speaks its vocabulary — `title` plus a receded `titleSoft` inside the same heading, one line of context, an actions cluster with ONE primary — differing only in ramp and surface: `--sv-display-1` on the wall instead of 27px on the band. Not a card: no paper, no shadow, no radius, no border. The steps clamp — 64px at full width, 34px at 320px, the size the same line takes in the product ramp — so a public page degrades INTO the system (C7). Actions keep B10's registered geometry. The eyebrow is a sibling LINE, never a heading. **Don't** — no image, video or background; no second primary; no paragraph in the statement (that is B45); no figure inside it (that is B50).

## B48 · FeatureList (v0.5)

The claim, itemised — a newspaper column where every competing library ships a grid of tinted icon tiles: a 1px `--sv-line` rule over each item, a mono ordinal, a 15/700 title, one sentence at 13.5, and an optional mono meta line. 3 across → 2 below 1000px → 1 below 620px, every track `minmax(0,1fr)`. **A statement, never a control:** nothing in an item is clickable, and a feature that needs a link puts it in the body where a reader can see what it points at — a card-sized hit area with no visible affordance is mystery meat (A2). The ordinal is derived from POSITION, never passed in, because a hand-written number drifts the moment an item is inserted. A real `<ul>` so the count is announced first; the ordinal is NOT `aria-hidden` (copy refers to items by number), and ordinals and meta take `--sv-ink-soft`, never faint (C2). **Don't** — no icons or tiles, no illustration, no card per item, no clickable item, no two-sentence body, no tenth item — at ten this is a page.

## B49 · CallToAction (v0.5)

The last row of a public page, and the only one that asks for anything: everything above states, this asks, which is why it holds exactly ONE primary — B10's rule is at its most binding here, because a page that asks for two things has asked for neither. Title at `--sv-display-3`, one sentence capped near 52ch, actions right, a mono note under them; below 720px it stacks with the actions full width. Two surfaces, one prop: `tone="paper"` is an ordinary card (radius 4, one `--sv-shadow`, zero border); `tone="band"` paints `--sv-band` and carries the `.sv-band` class so ghost buttons and focus rings inherit the band treatment already defined, and **ink takes no shadow** — it is the wall's opposite, not a card resting on it. Marks on ink paint `--sv-on-dark` (rule 16). There is no `urgency`, `countdown` or `scarcity` prop and there never will be — A3 is the copy contract. **Don't** — never two primaries, never "Get started" or "Learn more", never a form inside it (that is a page, or a B24 Plate), never a tinted "premium" surface.

## B50 · ProofRow (v0.5)

The figures that carry the claim, on the public surface — **not a StatS1, and the distinction is written down because it is the only thing stopping the next reader reaching for the card.** B3 is the product's signature KPI: icon tile, a delta against a comparison period, a footnote that adds information, read by someone who owns the number. B50 is a marketing row: no card, no icon, no delta, no comparison — a figure at `--sv-display-3` over a mono label, on the wall, between vertical hairlines, read by someone deciding whether to believe the claim above. "Generic marketing widget" is the same defect class A2 names for the admin one. The rules ARE the structure: a 1px `--sv-line` `border-left` on every item but the first; 4 across → 2×2 below 860px (where every item that starts a line drops its rule) → 1 below 520px. A real `<dl>` with the `<dt>` FIRST in the DOM and a single CSS `order` putting the figure on top, so reading order and visual order are both honest. Figures are PRE-FORMATTED by the caller (C9) and tabular (A4). **Don't** — never a delta or an arrow, never an icon or a card per figure, never more than four (a fifth is a B7 DataTable), never a figure the product cannot substantiate.

## B51 · SiteFooter (v0.5)

The last thing on a public page, and the only place a page is allowed to be a list of links: a `--sv-line` rule across the full width, a brand column carrying the `76°` wordmark (six in `--sv-seed-text`, the degree mark receded to `--sv-ink-faint` — never omitted) and one sentence at 34ch, up to four groups of at most six links, then a second hairline over the mono legal line and the secondary row. On the wall — no card, no shadow, no paper. **The accessibility is the design:** ONE `<nav aria-label="Footer">` covers the whole link region, because a `<nav>` per column hands a screen reader four identical unlabelled navigations, and each group's `<ul>` is labelled by its own title through `aria-labelledby` from a single `useId` base. The group titles are NOT headings — four h2s at the end of a document re-open an outline the content has closed. The wordmark carries one accessible name, "Seventy Six Degrees"; two marks per page, the band opens and the footer closes. `renderLink` is BandNav's adapter shape verbatim. **Don't** — no newsletter form, no social icon tiles (A2), no language picker that is the only path to anything (C4), no second wordmark on a page whose band already carries one, no fifth group — that is a sitemap page.

## Amendments to earlier specs

- **B1 · BandTopbar (v0.5) · the marketing shell** — `app` and `nav` are both optional: the marketing shell is the band with its product navigation REMOVED, keeping the wordmark and the right cluster, carrying marketing links instead of app sections, and with no `BandSubTabs` row at all (a public page has no section to sub-divide). Below 1000px `BandNav` still swaps itself for the left Drawer — the public surface inherits the 320px floor rather than re-solving it.
- **B2 · Row (v0.5) · the section break** — `space="section"` sets the row's top margin to 64px (40px below 1000px) instead of the 14px gutter: 14px separates two cards of one dashboard, not two arguments of one page. It exists for the public surface, and `[data-overlap]` still wins on the one row that carries it (an attribute selector beats this class), so a break can never cancel the signature move by accident.
- **B3 · StatS1 (v0.4.0)** — the delta chip is extracted as `Delta` (`▲`/`▼` + tabular figure, ok/bad); `polarity="down-good"` colours a fall as good for cost and churn. The old advice to flip the sign is WITHDRAWN — a card printing ▲ for a figure that fell is lying. `StatS1` takes `deltaPolarity`.
- **B5 · Trend (v0.4.0) · the stated column** — `yTicks` takes up to four PRE-FORMATTED labels, bottom to top, pinned to the four gridlines the plot already draws at 25/50/75/100 percent, and is `aria-hidden` because the required `ariaLabel` already carries the takeaway (the chart never formats a number, C9). `highlight` names the ONE column the chart is ABOUT — a PRINTED STATEMENT, never a hover tooltip (C8 forbids hover-dependent information): the other columns recede to `--sv-compare`, the chip is drawn in HTML because the plot is `preserveAspectRatio="none"`, and the matching x label goes ink at 700.
- **B5 · Trend (v0.4.0)** — `kind="stacked"` sums series per column and scales to the total (parts of ONE total only). `Sparkline` is the series at cell size, legal ONLY beside a printed figure.
- **B7 · DataTable (v0.4.0) · `FilterBar`** — the division is now complete and binding: **`CardTabs` (B8) switches between mutually exclusive presets · `FilterBar` SETS the filters · `FilterLine` STATES what is set**, and a card may carry all three, in that order. `FilterBar` is a layout with slots, not a filter engine: a hairline-bottomed row under the CardHead holding a `SearchField` and at most three Selects or Comboboxes left, an `actions` slot and a "Clear all" pushed right (shown only when something is set). It wraps and never scrolls, is `role="group"` with an `aria-label` and deliberately NOT `role="search"`, and holds NO live region — that is `FilterLine`'s job. **Don't** — never put the same dimension in both a FilterBar control and a CardTab.
- **B7 · DataTable (v0.4.0)** — `SelectionHead` replaces the CardHead in place while rows are selected (seed-tint, mono count, verbs, "Clear") — no floating bar, no new z-index. `FilterLine` states active filters as ONE mono line with a single "Clear all", doubling as the `aria-live` announcement — no chips, no pills.
- **B13 · Dialog (v0.2.0)** — `size` replaces `wide` (deprecated alias): `default` 480 · `wide` 640 · `full` (a takeover; no scrim, visible named close).
- **B14 · Toast (v0.2.0)** — grows into the full notification: 16px tone icon + 13/700 title + optional description, tones ok/info/warn/bad, sizes 360/440. warn renders in INK. ok/info auto-dismiss 5s polite; warn/bad persist, assertive. Max 3 stacked. An error still renders inline at its source FIRST — a `bad` toast may echo, never replace.
- **B19 · Combobox (v0.4.0) · multi-select** — "never multi-select" refused the IMPLEMENTATION every library ships (a growing wall of dismissible pills that reflows the form on every pick), not the job. Pass `multiple` and `value` becomes a `string[]`: Enter and click TOGGLE the active option and LEAVE THE LIST OPEN, the query survives the toggle, and Backspace on an empty query drops the value taken last. The selection is STATED, never worn — one mono line of running text under the field in the B7 `FilterLine` voice (tabular count, at most three named values, `+N more`, one "Clear"), which is the component's only live region. The two modes are a discriminated union, so single-select call sites are untouched. Free text is still refused: a Combobox may never mint an option its caller did not supply.
- **The dark surface (v0.2.0 + v0.2.1)** — opt-in `data-mode="dark"`, tokens only, no component branches on the mode. Surfaces invert; marks do not: band text, the on-band focus ring, the primary button label and the checkbox/radio mark all paint `--sv-on-dark`. `--sv-bad` is the exception — it brightens on dark, so its mark uses `--sv-on-bad`. `color: var(--sv-paper)` outside tokens.css is firewall rule 16.
