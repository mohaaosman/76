# 76° Component Specs (B1–B18)

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
