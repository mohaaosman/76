---
name: seventy-six-design
description: "The 76° (Seventy Six Degrees) design system — the binding visual system for every product, screen, component, prototype, or mockup in Max's projects. Use this skill whenever building or reviewing ANY UI: React components, HTML pages, dashboards, ERP/CRM/POS screens, admin panels, forms, tables, charts, landing mockups, or artifacts — even if the user never says 76° or design system. Also use when styling anything with CSS/Tailwind, choosing colors or fonts, or when asked to critique a screen. If the output has pixels, this skill governs it."
version: 0.1.0-alpha.1
---

# 76° — Seventy Six Degrees

76° is **flat, informational, corporate — paper on a wall.** Every component
tells you information; none of them perform. Light-first, always. The wordmark
is `76°` — the degree mark is never omitted.

Every request is one of three verbs — **build** (default), **audit** (score
against the rules, ranked punch list, edit nothing), or **redesign** (re-skin
to 76° preserving routes, IA, copy intent, and data contracts). Verb behavior
is defined in `references/fundamentals.md` §1.

Build from this skill in this order:

1. **Pre-flight** (existing projects only): detect framework, tokens.css,
   fonts, seed, and stamps before touching code; state findings in one block;
   never clobber an existing global stylesheet — append-only
   (`references/fundamentals.md` §2).
2. Absorb the Six Laws and tokens below (they decide 90% of choices).
3. **Declare before building**: one line naming screen · seed · widgets ·
   inferred assumptions, so the user can redirect in five seconds instead of
   after 500 lines (`references/fundamentals.md` §3).
4. Compose screens ONLY from the widget taxonomy — never invent a hybrid.
5. For any component's exact anatomy, states, and a11y contract, read
   `references/component-specs.md` before writing it.
6. Build to the Craft Floor below — states, responsiveness, honesty, and
   physics are requirements, not polish.
7. Before showing output, self-critique (fundamentals §3), then run the Ship
   Gate (bottom of this file). For code, run `scripts/slop-firewall.mjs`
   against the source when Node is available. Stamp the output
   (fundamentals §11).

## The Six Laws

1. **Paper on a wall.** White cards on the platinum wall, separated by
   contrast alone: no borders, one 1px-breath shadow
   (`0 1px 2px rgba(16,20,28,.05)`), radius 4px. Nothing floats, nothing glows.
2. **Three colors, total.** Ink (+ soft/faint steps), the product seed, and
   functional green/red — which may only color *words and 6px dots*, never
   surfaces.
3. **Every widget has a type and one job.** If a widget needs two jobs, it is
   two widgets.
4. **Mono speaks metadata.** Labels, IDs, timestamps, column headers,
   sub-tabs — Fragment Mono, uppercase, tracked. Content speaks
   Hanken Grotesk. No other fonts in-product.
5. **The band is the chrome.** All navigation and page context live in the ink
   band; the paper below is 100% work. Nav is horizontal — a sidebar as
   primary nav is a defect.
6. **Numbers are instrumentation.** `tabular-nums` everywhere data lives;
   values bold; units and context soft; last period drawn in line-gray next to
   this period's seed.

## Tokens

`references/tokens.css` is the canonical file — copy it verbatim into new
projects; it is the ONLY file allowed to contain color literals. The core:

| Token | Value | Role |
|---|---|---|
| `--sv-band` / `--sv-band-line` / `--sv-band-soft` | #1B1F26 / #2C323B / #8A93A2 | ink band, its hairlines, its soft text |
| `--sv-wall` / `--sv-paper` | #F2F3F5 / #FFFFFF | platinum background / card surface (surface ONLY — never a mark) |
| `--sv-on-dark` | #FFFFFF, both modes | the mark on the band or on a seed fill: band text, on-band focus, primary button label, check mark |
| `--sv-ink` / `--sv-ink-soft` / `--sv-ink-faint` | #1C2026 / #667080 / #99A1AD | text ladder (faint never carries required info) |
| `--sv-line` / `--sv-field-line` | #E9EBEE / #D8DCE1 | hairlines / field borders |
| `--sv-seed` / `--sv-seed-deep` / `--sv-seed-tint` | per product | THE accent (default Cobalt #2C5BE0 / #1E44B4 / #EEF3FE) |
| `--sv-ok` / `--sv-bad` | #14804A / #C43D2E | words + 6px dots only, AA-verified |
| `--sv-on-bad` | #FFFFFF light / #1B1F26 dark | the mark on a `--sv-bad` fill (a dialog's final confirm) — flips, because `--sv-bad` brightens on dark |
| `--sv-r` / `--sv-shadow` | 4px / 0 1px 2px rgba(16,20,28,.05) | the only radius (50% avatars, 2–3px bars) and only shadow |
| `--sv-s1…s8` | 4→40px | 4px-base spacing scale |
| `--sv-t-fast` / `--sv-t` | 120ms / 160ms | the only durations; collapse to 0 under reduced motion |

Seed registry: ERP = Cobalt #2C5BE0 · CRM = Verdigris #12836F · POS = Signal
#D9531E (fills only; text uses #C24413 as `--sv-seed-text`). A new seed is
REJECTED unless seed-on-white ≥ 4.5:1 AND white-on-seed ≥ 4.5:1. Products
theme via `<html data-seed="...">` — nothing else may change per product.

## Typography

Hanken Grotesk (UI/content) + Fragment Mono (metadata). Never raw Inter,
Roboto, or system UI as the designed choice. Key sizes: H1 greeting 27/800 on
band; card title 13.5/700 + faint 11.5 subtitle; stat value 24/800 tabular,
tracking −.025em; body/table 13/500 (numeric cells 600); micro labels Mono
10/400 UPPERCASE tracking .13em; column headers Mono 9.5; IDs/timestamps Mono
10–11.5. POS scales up: body 16–18, values 28–40, targets ≥48px.

## Layout — the ink band + the sheet

Every screen: **Zone 1**, the ink band (topbar with `76°` wordmark +
horizontal nav; mono sub-tabs of the active section; page hero with
the page's ONE h1 → one soft context line → right-side actions,
max one primary). **Zone 2**, the paper sheet on the wall — 1280px container,
12-col grid, 14px gutters. The first card row overlaps the band by −44px:
the 76° signature, exactly once per page. Canonical splits: stats
`repeat(4,1fr)` (2×2 below 1000px) and content `1.7fr/1fr`.

## The widget taxonomy (compose from these ONLY)

- **S1 Signature stat** — the only KPI card: mono label + colored delta /
  34px seed-tint icon tile + bold tabular value / hairline footnote that adds
  NEW information (target, exposure, age). *How much, and so what.*
- **Progress** — value vs target + one 3px bar. *How far along.*
- **Trend** — flat 2–2.5px lines on hairline grid; seed = now, line-gray
  #D6DAE0 = before; no area fills, no donuts/gauges ever. *Which direction.*
- **MeterList** — label + bold value + 3px bar + REQUIRED absolute-numbers
  subtitle ("4,320 of 4,700 pallet positions"). Replaces every donut. *How is
  each part doing.*
- **DataTable** — mono headers, mono IDs, dot+word statuses, right-aligned
  tabular numbers, seed-tint row hover, full keyboard contract. *What exactly
  happened.*
- **CardTabs** — in-card filters on the card hairline.
- **ActivityList** — mono timestamp column + sentences with bold entities;
  absolute time in ERP contexts.

Card head is universal: bold title + faint subtitle left, ONE seed text-link
action right. Inventing a new widget type requires naming it, giving it one
job, and registering it in the Component Book in the same change.

## The Craft Floor (non-negotiable fundamentals)

Full detail in `references/fundamentals.md` — this is the digest:

- **States.** Every interactive element ships all 8 states (default · hover ·
  focus-visible · active · disabled · loading · error · success); every data
  region ships all 4 lifecycle states (loading skeleton after 300ms · empty ·
  inline error · loaded). Hover is enhancement-only. A happy-path-only screen
  is half a screen. New registered components ship an 8-state preview file.
- **Honesty.** Mockup numbers are internally consistent (deltas match values,
  parts sum to totals, tables reconcile with stats). No invented
  testimonials, logos, or "10× faster" claims. No hand-drawn fake browser/
  phone chrome — real screenshots or nothing.
- **Responsive floor.** Verify 320 / 375 / 414 / 768 / 1000 / 1280.
  `overflow-x: clip` on html/body (never `hidden`); content grid tracks use
  `minmax(0,1fr)`; no two-line buttons/nav links; `text-wrap: balance` on
  headings, `pretty` on prose; prose measure 65–75ch; tables scroll, never
  card-reflow.
- **Motion physics.** Transform/opacity/color only; ease-out only — no
  bounce/overshoot (cubic-bezier y within [0,1]); focus ring appears
  instantly; content never gated on scroll animation; images never move on
  hover.
- **Layering.** Native `<dialog>`/`popover` (top layer) first; otherwise the
  `--sv-z-*` ladder in tokens.css; no 999s; never position a dropdown
  `absolute` inside an `overflow` container — portal/fixed/popover out.
- **Type & contrast.** No italic headings ever (weight/seed carry emphasis);
  input placeholders use `--sv-ink-soft` (faint fails AA) and never replace
  labels; no paper-on-paper nesting inside cards.

## Voice (banned copy)

No exclamation marks. No "Oops/Whoops/Something went wrong" without saying
what. No "Please" opening errors, no blame. No empty enthusiasm ("Awesome!").
No vague CTAs — buttons name the action's object: "Create order", "Approve
PO-2291". Errors state what and how to fix: "Quantity must be a whole number
above 0." 76° speaks like a competent colleague.

## Accessibility contract (WCAG 2.2 AA, non-negotiable)

Everything readable is AA on its surface; `--sv-ink-faint` (2.6:1) never
solely carries information. Focus: `outline: 2px solid var(--sv-seed);
outline-offset: 2px` on `:focus-visible` (white on the band), never removed
without equal replacement. Status = word + dot; deltas = arrow glyph; active
tabs = weight + `aria-current` (underline supplementary). One h1, unskipped
headings, skip-link, ⌘K search in every app, full arrow-key tables in ERP.
Honor `prefers-reduced-motion` (all durations → 0; the design loses nothing).

## Reference files — when to read what

- `references/fundamentals.md` — the discipline layer: verbs (build/audit/
  redesign), pre-flight, declared decisions, honest content, the 8-state and
  lifecycle contracts, responsive floor, motion/layering physics, and the
  stamp. Read when starting work in an existing project, running audit or
  redesign, or unsure what "done" means for a component.
- `references/component-specs.md` — condensed B1–B35: anatomy, states, a11y,
  and Don't list per component. Read the relevant section BEFORE implementing
  or reviewing any specific component.
- `references/firewall-and-copy.md` — the machine-checkable banned-CSS/pattern
  list (A1–A4), the Part E fundamentals gates, and the full Ship Gate. Read
  when reviewing code or when unsure whether something is legal.
- `references/library.md` — the built React library (seventy-six-ui): file
  map, imports, registry install, doc-site conventions. Read when working in
  React so you consume the existing components instead of rebuilding them.
- `references/tokens.css` — copy verbatim into any new project.
- `references/system-dials.md` — per-system-type dials (ERP/CRM/POS/health…)
  and the three-layer ecosystem model. Read when starting a NEW product or
  choosing a seed.
- `scripts/slop-firewall.mjs` — run `node scripts/slop-firewall.mjs` from a
  project root (adjust SCAN_DIRS) to lint CSS/TSX for violations.

## Ship Gate — run before showing anything

1. Zero firewall hits (gradients, blur, non-token radius/shadow/colors,
   `!important`, >200ms animation, layout transitions, off-system fonts).
2. Count colors: neutrals + one seed + functional words/dots. Nothing else.
3. Every widget is a registered type; new types got registered first.
4. Every S1 footnote passes the "so what" test (new info, not paraphrase).
5. Keyboard pass: visible focus everywhere, sane order, skip-link, ⌘K.
6. Squint test: ink band + white paper on platinum wall; nothing glows,
   floats, or performs.
7. Copy audit: no exclamation marks; buttons name objects; errors say how to
   fix.
8. New colors contrast-checked; new seeds through the seed rule.
9. Every wordmark reads `76°` — never bare `76`.
10. State contract: 8 interaction states + 4 lifecycle states per data
    region; disabled is never bare opacity.
11. Responsive floor: reasoned through at 320/375/414/768/1000/1280; no
    horizontal scroll; no two-line clickables.
12. Honest numbers: mockup data reconciles (deltas, sums, dates); zero
    invented claims or fake chrome.
13. Physics: no italic headings, no image hover motion, no bounce easing,
    no arbitrary z-index, no paper-on-paper.
14. Output stamped (`/* 76° · screen: … · gate: pass */`) — and the stamp
    tells the truth.
