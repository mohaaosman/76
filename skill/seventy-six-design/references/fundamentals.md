# 76° Fundamentals — process, honesty, states, and physics

The discipline layer beneath the Six Laws. Nothing in this file changes what
76° looks like — it governs how a screen gets built, what must exist before
it ships, and the physics every interaction obeys. It merges the strongest
process rules from Hallmark (pre-flight, declared decisions, honest content,
the 8-state contract, the mobile floor) and Impeccable (layering physics,
motion materials, contrast fundamentals, structural bans) — adapted to 76°.
Where those systems' visual opinions conflict with the Six Laws (their
eyebrow bans, OKLCH mandates, theme rotation), **the Six Laws win**: 76° is
one locked system; it wants consistency, never variety.

## 1 · Working verbs

Every 76° request is one of three verbs. Detect from phrasing; default to
build.

- **build** (default) — new screen/component/app. Full flow: pre-flight →
  declare → build → Ship Gate.
- **audit `<target>`** — read the target, score it against the Slop Firewall
  (A1–A4), the Six Laws, and the E-gates below. Return a ranked punch list
  (worst first, each item citing the violated rule and the fix). **Do not
  edit anything.** Read any stamp comments first — they are the record of
  intent.
- **redesign `<target>`** — re-skin an existing screen to 76°. Preserve
  routes, information architecture, copy intent, data contracts, and
  component ownership; replace only the visual and interaction layer. Never
  a full rebuild unless the user explicitly confirms one. List files to be
  modified before touching them; stop and ask before any deletion.

## 2 · Step 0 — pre-flight scan (existing projects only)

Before touching code in a non-empty project, detect what exists — never
improvise over an established setup:

1. **Framework** — Next/Vite/Laravel-Inertia/Astro/vanilla (deps or config).
2. **76° presence** — `tokens.css`, `data-seed` attribute, `seventy-six-ui`
   imports, existing `/* 76° · … */` stamps.
3. **Fonts** — how Hanken Grotesk / Fragment Mono are loaded (or missing).
4. **Entry stylesheet** — the global CSS file and its framework directives.
5. **Seed** — which registered seed the product uses, if any.

State findings in one short block ("Pre-flight: Next 15 · tokens.css present
· seed verdigris · fonts via next/font"), then proceed. If nothing is found,
say one line ("No pre-flight signals — full 76° stack") and continue.

**Append-only rule:** never clobber an existing global stylesheet. Keep
framework directives (`@tailwind`, `@import`) in place; add the 76° token
import and base rules below them. Overwrite only on explicit request —
silently removing a framework's CSS entry un-styles the entire app.

## 3 · Declare, then build

Decisions are stated on the page, not made silently in your head.

- Before writing code, declare in one or two lines: screen name · seed ·
  widgets to be used (by taxonomy name) · anything from the brief you had to
  infer ("Going with: warehouse ops audience, ERP density. Redirect if
  wrong."). The user redirects in five seconds instead of after 500 lines.
- **Pre-emit self-critique:** before showing output, score it silently
  against six axes — Laws (all six hold?) · Hierarchy (one h1, scannable
  ladder?) · States (contract in §5 complete?) · Responsiveness (§6 floor
  passes?) · Honesty (§4 clean?) · Restraint (anything performing that
  should be informing?). Any weak axis → revise first. The Ship Gate is the
  exit exam; this is studying for it.

## 4 · Honest numbers, honest content

76° screens are instruments; an instrument that shows fabricated readings is
broken by definition.

- **Mockup data must be internally consistent.** Deltas match the values
  they compare, MeterList parts sum to their totals, table rows reconcile
  with the S1 stats above them, dates are coherent and use the system's
  absolute format. A dashboard whose numbers don't add up fails audit.
- **Never invent social proof** — no fabricated testimonials, logo walls,
  "trusted by 50,000+ teams", "10× faster" claims. If the user didn't supply
  it, it doesn't exist. Use labeled placeholders (`—`) or omit the section.
- **Production code never hardcodes demo metrics.** Values arrive via
  props/data contracts; demo fixtures live in clearly named fixture files.
- **Real chrome only.** Never hand-draw fake browser bars, phone frames, or
  IDE windows around content. Use a real screenshot in a `<figure>` with at
  most a hairline border, or nothing.

## 5 · The state contract

A component isn't done when it looks right — it's done when every state is
designed.

- **Interactive elements ship all 8 states:** default · hover ·
  `:focus-visible` · `:active` · disabled · loading · error · success.
  B10/B11 define the 76° anatomy for each; hover is enhancement-only
  (touch never depends on it) and disabled is never bare opacity.
- **Every data region ships its 4 lifecycle states:** loading (B17 static
  skeleton, only after 300ms) · empty (B15: one soft sentence + one action)
  · error (inline, states what happened and how to fix — never a toast) ·
  loaded. A screen designed only for the happy path is half a screen.
- **New components ship an 8-state preview.** When building a NEW registered
  component, also emit a small `<Name>.preview.html` rendering all 8 states
  stacked and labeled (force states via `.is-hover`/`.is-focus` classes).
  It's a review artifact, not production code — the user deletes it after.

## 6 · The responsive hard floor

A screen that breaks at 375px is a defect, not a variant. Verify — actually
reason through, don't assume — at **320 / 375 / 414 / 768 / 1000 / 1280**.

- No horizontal page scroll, ever: `overflow-x: clip` on `html`/`body`
  (never `hidden` — it kills sticky positioning and programmatic scroll).
- Grid tracks that carry content or images use `minmax(0, 1fr)`, never bare
  `1fr` — bare `1fr` lets content blow the track open.
- **No two-line clickable text:** buttons, nav items, and CTAs
  never wrap. Shorten the label or widen the container.
- `text-wrap: balance` on headings; `text-wrap: pretty` on long prose.
  Long words in headings survive via `overflow-wrap: anywhere; min-width: 0`.
- Prose measure 65–75ch. Data tables are exempt — they scroll horizontally
  with headers intact (B7), never reflow to cards, never truncate silently.
- The canonical splits already collapse (stats 4×1fr → 2×2 under 1000px);
  test them with the real content, not lorem — the viewport is part of the
  design.

## 7 · Motion physics

76° already limits motion to 120/160ms fades that collapse to 0 under
reduced motion. These are the laws of what little motion exists:

- Animate **transform, opacity, and color only** — never layout properties
  (the A1 firewall greps for this; B4's single bar-fill width transition is
  the registered exception).
- **Ease-out only.** No bounce, elastic, or overshoot: every
  `cubic-bezier()` y-component stays within [0, 1]. No browser-default
  `ease` as a considered choice.
- **The focus ring appears instantly.** Never animate `:focus-visible`
  appearance.
- **Content is never gated on animation.** Everything is visible by
  default; motion may enhance an already-visible element. Reveal-on-scroll
  that hides content until JS runs is a defect (hidden tabs and headless
  renderers never fire it).
- **Images never move on hover** — no scale/rotate/translate on `img`
  (including Tailwind `group-hover:scale-*` via a parent). The image is not
  the action target; if hover feedback is needed, tint the row or shift the
  border per spec.
- Prefer silent success over celebration; prefer optimistic update + Undo
  over confirmation dialogs (destructive actions still confirm with the
  typed object, per B10).

## 8 · Layering & overlay physics

- **Top layer first.** Native `<dialog>` + `showModal()` (B13) and the
  `popover` attribute (B18) render in the browser top layer — no z-index
  war exists. Reach for them before any manual stacking.
- When manual stacking is unavoidable, use the semantic ladder in
  `tokens.css` — `--sv-z-band` (10) → `--sv-z-sticky` (20) → `--sv-z-scrim`
  (30) → `--sv-z-dialog` (40) → `--sv-z-toast` (50) → `--sv-z-tip` (60) →
  `--sv-z-skip` (70, the C4 skip link — always wins). Arbitrary values
  (`999`, `9999`) are firewall hits.
- **The clipping rule:** a menu/tooltip/dropdown positioned `absolute`
  inside an `overflow: hidden/auto` container will be clipped. Escape via
  native popover/dialog, `position: fixed`, or a portal — never by removing
  the container's overflow.

## 9 · Typography & contrast fundamentals

- **No italic headings or display type — ever.** Emphasis in headings is
  carried by weight, the seed color, or the band-soft secondary-word
  pattern; italics survive only inside running body copy. (Fragment Mono
  has no italic; don't synthesize one.)
- Tracking floor: never tighter than −0.04em (the system's tightest
  registered value is −0.025em on stat values).
- **Placeholder text uses `--sv-ink-soft`**, not `--sv-ink-faint` — faint
  is 2.61:1 and fails AA; and a placeholder never substitutes for the label
  (B11).
- Soft text on colored/tinted surfaces uses the registered pair from the
  quick table (`--sv-band-soft` on band, etc.) — never a generic gray that
  washes out on the tint.

## 10 · Structural honesty

- **No paper on paper.** Cards never nest inside cards — Law 1 already
  implies it; this makes it explicit. Inside a card, structure comes from
  hairlines, spacing, and type — not another surface.
- Colored left-edge rules exist only in their two registered homes: the B7
  selected row and the B14 toast. As a decorative card accent they are
  banned.
- No gradient text (`background-clip: text`) — gradients are banned
  everywhere anyway; emphasis is weight or seed.
- S1 is the only KPI form; a "hero metric collage" of mixed big-number
  cards is a defect (Law 3: one widget, one job).

## 11 · The stamp

The first line of every screen's stylesheet (or entry component) is a
durable record:

```css
/* 76° · screen: warehouse-overview · seed: cobalt
 * widgets: S1×4 · Trend · MeterList · DataTable
 * states: 8-state ✓ · lifecycle ✓ · floor: 320–1280 ✓ · gate: pass */
```

Audits read stamps first; a stamp that lies (claims `gate: pass` over
firewall hits) is itself a finding. Stamps are how the system remembers.
