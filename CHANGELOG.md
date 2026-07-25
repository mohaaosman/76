# Changelog

All notable changes to **seventy-six-ui** (the 76° design system) are recorded
here. The format follows [Keep a Changelog](https://keepachangelog.com); the
project uses [semantic versioning](https://semver.org).

## [Unreleased]

**The public surface.** 76° now dresses the pitch as well as the product, and
**not one refusal was repealed to do it** — no photography, no illustration,
no 3D, no logo cloud. F11 survived the surface it was written against, which
is how a refusal proves it was right. What actually changed is the type ramp:
three display steps, fenced by a new firewall rule to the three components
that set them.

### Added
- **Display tokens** — `--sv-display-1/2/3`. 64/48/34 at full width, clamping
  to 34/27/21 at 320px, which is the size each line takes in the product ramp,
  so a public page degrades *into* the system rather than out of it (C7).
- **Firewall rule 17** — `var(--sv-display-*)` is legal in `tokens.css` and in
  `masthead.css`, `cta.css`, `proof-row.css`, and nowhere else. B48
  `FeatureList` and B51 `SiteFooter` are marketing components too and are
  deliberately absent from that list: an allowance nobody uses is an allowance
  somebody will.
- **Prose (B45)** — the one component in the system that styles elements it
  does not own. A second type ramp scoped to one subtree: 16/1.6 on a ~66ch
  measure, a heading ramp that stays *inside* the product ramp (27/21/17/15 —
  the display steps are refused here), real list markers, a 2px blockquote
  rule, inline `<code>` on a wall inset, tables in the table-header voice.
  Markdown rendered to HTML drops straight in. It is also where **F1 is
  answered**: the refused WYSIWYG composes to a textarea plus a preview, and
  this is the preview. Part E's one italic lives here, and `prose.css` is the
  firewall's registered exception for it.
- **Masthead (B47)** — the hero, refused as imagery and rebuilt as type. No
  image slot, no video slot, no background slot; adding one is a Book change,
  not a prop. It speaks `PageHero`'s vocabulary — `title`, a receded
  `titleSoft` inside the same heading, one line of context, one primary — at
  display size on the wall instead of at 27px on the band. The buttons keep
  B10's registered geometry: a taller marketing button is a third button size
  the Book does not carry.
- **FeatureList (B48)** — the claim itemised as a newspaper column: a hairline
  over each item, a mono ordinal derived from position, a title, one sentence.
  A statement, never a control — nothing in an item is clickable. The ordinal
  is *not* `aria-hidden`, because copy refers to items by number and hiding a
  visible figure from a screen reader is the asymmetry C5 warns about.
- **CallToAction (B49)** — the last row of a public page and the only one that
  asks. Exactly one primary: B10 is not relaxed here, it is at its most
  binding, because a page that asks for two things has asked for neither.
  `tone="band"` paints the ink surface and rides the existing `.sv-band`
  re-toning, so it writes no ghost-button or focus rules of its own. Ink takes
  no shadow — it is the wall's opposite, not a card resting on it.
- **ProofRow (B50)** — figures at display size between vertical hairlines. It
  is **not** a StatS1, and the Book now says so by name: B3 is a measurement on
  paper with an icon tile, a delta and a footnote; this is a claim on the wall
  with none of the three. "Generic marketing widget" is the same defect class
  A2 already named "generic admin widget". A real `<dl>` with `<dt>` first in
  the DOM and one CSS `order` on the figure, so reading order and visual order
  are both honest.
- **SiteFooter (B51)** — one `<nav aria-label="Footer">` over the whole link
  region, and each group's `<ul>` labelled by its own title through
  `aria-labelledby`. The group titles are **not headings**: four h2s at the end
  of a document re-open an outline the content already closed. The wordmark
  carries one accessible name and its glyphs are `aria-hidden`, so `76°` is
  never spelled out.
- **`marketing-home` template** — the public page: masthead, proof row,
  feature columns, an FAQ on the B27 Accordion rather than a widget invented
  for it, and a band-toned close.
- **`pricing-page` template** — **pricing is a DataTable.** No tier cards, no
  "Most popular" pill, no three competing primaries. The plan is the column
  and the capability is the row, so every capability is stated for every plan
  instead of implied by its absence from a card. CardTabs filter which
  capabilities show, never which plans — hiding two of three is exactly what
  the card row does.

### Changed
- **BandTopbar (B1 amendment)** — `app` and `nav` are now optional. The
  marketing shell is the band with its product navigation removed: wordmark and
  right cluster kept, marketing links carried, no sub-tab row, because a public
  page has no section to sub-divide. Below 1000px `BandNav` still swaps to the
  left Drawer, so the public surface inherits the 320px floor rather than
  re-solving it.
- **Row (B2 amendment)** — `space="section"` sets a 64px top margin (40px below
  1000px). 14px separates two cards of one dashboard; it does not separate two
  arguments of one page. The `[data-overlap]` rule still wins on the one row
  that carries it.
- **Docs** — a fifth category, **Marketing**, holding B47–B51. The component
  index no longer claims "18 Book specs".

---

## [0.4.0] — 2026-07-25

**The taxonomy, closed.** The line-by-line inventory against Bootstrap,
Tailwind UI, shadcn/ui and Material — minus everything Part F refuses — is now
empty. Nine components (B36–B44) and three amendments finish what
`0.4.0-alpha.1` started, and a twelfth template puts most of them on one
screen. Zero runtime dependencies held: the new work runs on
`<input type="search">`, `<input type="file">`, the native `popover`
attribute, real `<ol>`/`<pre>` semantics, and one hand-rolled ARIA tree.

Numbering note: the remainder took **B36–B44**, so `Prose` — pencilled in as
B36 for 0.5 — becomes **B45**.

### Added
- **SearchField (B36)** — the in-place filter. A native `<input type="search">`
  in B11 chrome with a named clear button (the WebKit cancel button is
  suppressed: unstyleable, unlabelled, invisible on the wall) and an optional
  mono result line that is a live region from first paint, so the first
  announcement is not lost. It is not B16 `SearchCommand`: ⌘K is a dialog and
  it navigates; this filters what you are already looking at.
- **FileField (B37)** — attach files and state what happened to each. It owns
  no transport, by design: uploading, retrying and measuring are the product's
  work, and a component that owns the network cannot be installed from a
  registry. The drop zone is a target, not a control — a real file input and a
  named button carry the interaction, so the keyboard reaches everything
  without a fake `tabIndex` on a div. Its dashed border is
  `--sv-field-line-strong` for the same reason B25's PinField box is.
- **Tabs (B38)** — the wall-level tab row, and the third leg of a distinction
  that had gone unstated: `BandSubTabs` NAVIGATE, `CardTabs` FILTER one card,
  `Tabs` SWITCH a whole content region of the sheet. Real ARIA tabs only —
  there is no `filters` mode, because a tablist that is sometimes not a
  tablist is a defect. The row wraps below 1000px; it never scrolls.
- **Stepper (B39)** — where you are in a fixed sequence. A STATEMENT, not a
  control: steps are plain text unless `onStepSelect` is passed, and even then
  only already-completed steps become buttons. Every state is also carried in
  visually-hidden words, because a seed fill is a colour (C5).
- **TreeList (B40)** — a hierarchy whose depth is the information. The full
  ARIA tree pattern hand-rolled: one tab stop for the whole tree, ↑/↓/←/→/
  Home/End, and the `<li>` itself as the `treeitem` — a focusable inside a
  treeitem breaks the pattern.
- **Timeline (B41)** — one record's life, in order, with the gaps visible. The
  rail is clipped at the first and last markers so it never dangles past the
  sequence. It is not B9 `ActivityList`: a feed answers "what needs me" across
  many records, a Timeline shows what has NOT happened yet as well as what has.
- **Popover (B42)** — the non-modal panel that holds a few controls, defined
  entirely by its four neighbours (Tooltip, Menu, Drawer, Dialog). Labelling is
  enforced by the type system: `title` and `ariaLabel` are a mutually exclusive
  union, so an unlabelled panel does not compile. Tabbing past the last control
  closes it, and focus is returned to the trigger only when the panel still
  held it.
- **CodeBlock (B43)** — code printed exactly as it must be typed, and **no
  syntax highlighting, ever**: highlighting is six to nine colours on one
  surface, Ship Gate point 2 counts them, and Law 2 allows neutrals plus one
  seed. The line-number gutter sits outside the `<code>` so a copy never picks
  it up; the copy control is not rendered at all where `navigator.clipboard`
  is absent.
- **DistributionStrip (B44)** — the donut, answered. A2 has banned donuts since
  v0.1.0 and pointed at B6 `MeterList`, which answers a different question:
  **B6 measures each part against its own maximum, B44 divides ONE total into
  its shares.** Every donut a team has drawn was asking B44's question. One
  10px strip with structural 2px seams (a gradient is banned, so the seam does
  the work) over a legend that prints the absolute figure beside every
  percentage — B6's rule, inherited whole.
- **Split (B46)** — the band-less page, cut in half, with the card ACROSS the
  cut. Two flat surfaces meet on one seam — ink and wall — and the Plate sits
  centred on it, so half the card is on ink and half is on wall. **This is B2's
  overlap, finished**: the Sheet spends that move by pulling its first row 44px
  over the band edge so the dashboard stat cards straddle ink and wall; a Plate
  has no Sheet and no band, so the same physics arrive as a page type. It is
  the only 76° layout where paper crosses a surface boundary rather than
  resting on one. The halves carry **nothing** — no statement, no widget, no
  screenshot — so they are `aria-hidden` and the page reads as exactly the
  Plate it composes. A1 refuses gradients, so the cut is two real elements, and
  the hard pixel is what gives the card an edge to straddle. B24 is composed
  verbatim, with one consequence: the wordmark and footer move INTO the card as
  hairline-ruled rows, because centred above and below a seam-straddling card
  they would land half on ink and half on paper. Two orientations on one prop —
  `side` cuts left/right, `stacked` cuts top/bottom, and below 1000px `side`
  becomes `stacked` because a vertical seam behind a full-width card is a seam
  nobody can see.
- **All seven auth screens ride it.** Sign in, sign up, forgot, reset, verify,
  invite and the stacked variant are each a Plate on a cut surface and nothing
  else — the form is the only thing on the page with controls in it.
- **Sign in · stacked band** — the thirteenth template, the same screen with
  the cut rotated, so the gallery carries both types.
- **Analytics overview template** — the twelfth screen: four reconciling
  stats, a `Trend` whose peak column is printed rather than hovered,
  wall-level `Tabs` that switch the analysis while the KPIs stay put, the full
  `FilterBar` → `FilterLine` → `DataTable` stack, and a donut refused in
  favour of a strip.

### Changed
- **Combobox (B19) — multi-select, without the chip wall.** The "never
  multi-select" refusal is repealed: it was aimed at the implementation, not
  the job. `multiple` switches the props to a discriminated union, the list
  stays open while you pick, the query survives each toggle, and Backspace on
  an empty query drops the last value. The selection is **stated, never worn** —
  one mono line in the B7 `FilterLine` voice with a single "Clear", because A2
  bans pills and B23 keeps Badge category-only. Every single-select call site
  is untouched.
- **DataTable (B7) — `FilterBar`.** The division is now complete and binding:
  `CardTabs` switches presets · `FilterBar` sets · `FilterLine` states. A
  layout with slots, `role="group"` and not `role="search"`, and deliberately
  holding no live region — the announcement is FilterLine's, and two live
  regions for one change is a defect.
- **Trend (B5) — the stated column.** `highlight` prints a chip above the one
  column the chart is about and recedes the rest; `yTicks` labels the four
  gridlines the plot already drew. Printed, never hovered: C8 forbids
  hover-dependent information, and a chart that only tells the truth under a
  pointer has failed it.
- **Menu (B20) now stands on B42.** `usePopoverAnchor` moved into `popover.tsx`
  and Menu imports it. The hook no longer knows what a menu item is — each
  component supplies its own on-open focus — and it now declines to steal focus
  back when the panel closed because focus had already left it.

### Fixed
- **A seeded template drew light seed steps on dark paper.** Every product
  screen declares its seed on its own wrapper (`<div data-seed="cobalt">`), and
  a custom property resolves at the NEAREST declaration — so that wrapper's
  light-mode literals shadowed every dark step beneath it. On a dark surface,
  all five seeded templates were painting seed-as-text at 2.90:1 (an AA
  failure) and a white tint on dark paper. `tokens.css` now matches each seed
  in the descendant position as well as the same-element one, and derives the
  tint there too. Same class of defect as the v0.2.1 chrome hotfix, and fixed
  the same way: in the tokens, and nowhere else.
- **The 320px floor leaked on every dashboard template.** `.sv-row--stats` and
  `.sv-row--main` used bare `1fr` tracks, and a grid item's default
  `min-width: auto` let one wide table or one long tabular figure widen its own
  column and push the page into a horizontal scroll — 161px of it on the
  densest screen. Every track is `minmax(0, …)` now, as Ship Gate point 11 has
  always required, and the stat row goes single-file below 560px, because the
  S1 anatomy does not compress under about 200px. The S1 label truncates before
  the delta chip does. Verified at 0px overflow on ERP, AI and analytics.
- **`.sv-split` was two components.** B20's SplitButton had claimed the class
  since v0.2.0, and it silently won the cascade over B46's page type — the
  split screen rendered as an `inline-flex` button. The button's classes are
  `.sv-splitbtn*` now: a button holding the page type's name was the misnomer,
  and the collision was a live hazard for anyone else reaching for `sv-split`.
- **The cascade layer order was whatever the bundler emitted.** No
  `@layer` statement declared it, so a product's own rules could silently lose
  to a component's — and layer order beats specificity, so no amount of
  selector weight recovers it. `tokens.css` now declares
  `@layer sv-tokens, sv-base, sv-components, sv-site` once, where it loads
  first. The docs site's own back button was the first casualty.
- **The Trend highlight chip could escape its own component.** Printed above
  the tallest mark, it landed on the card head on a short plot. The plot takes
  the headroom now, so the bars keep their scale.
- **Trend x labels were misaligned.** `.sv-trend__x` used `justify-content:
  space-between`, which only ever lined up the first and last label; every one
  between them drifted off its bar. It is a real column grid now.
- **`DistributionStrip`'s fourth tone was invisible.** It drew at `--sv-line`
  (1.06:1 on paper) — a part of the total nobody can see is a part that was not
  stated. It is `--sv-field-line-strong` now; the hairline stays a rule.

## [0.4.0-alpha.1] — 2026-07-25

**Closing the product taxonomy.** The table's missing half, plus the nine
parts a product had to reach outside 76° to get (B27–B35). Every one of them
enters through the Book: named, single-jobbed, registered, documented, and
installable in the same change. Zero runtime dependencies held — the new work
runs on `<details>`, `<input type="range">`, `<input type="date">` and
hand-rolled SVG.

### Added
- **Accordion (B27)** — native `<details>`/`<summary>` sections on hairlines,
  with a mono meta column right of the title. `exclusive` uses the native
  `name` group, so one-at-a-time costs no JavaScript. It folds SECONDARY
  detail only: never the primary job of a screen, and never navigation.
- **DescriptionList (B28)** — the record readout. A real `<dl>` with mono
  uppercase terms and informative values on hairlines; `kind="id"` goes mono,
  `kind="num"` goes tabular and right-aligned. One record, many facts — the
  mirror of a DataTable's many records, shared columns.
- **Divider (B29)** — one hairline, optionally naming the group below it in
  mono. Unlabelled renders `<hr>`; labelled renders `role="separator"` with
  the label as its accessible name.
- **Avatar / AvatarGroup (B30)** — initials on wall at 24/32/44px, a photo
  only where the product genuinely holds one. The group overlaps a capped
  stack and states the remainder in mono; the names it hides stay reachable in
  the list it summarises, never in a hover.
- **Spinner / Busy (B31)** — the wait, stated. `Busy` requires a sentence
  naming what is loading and keeps existing content legible underneath while
  it refreshes. The B17 line is drawn explicitly: Skeleton is first paint,
  Busy is a region that already has content.
- **Kbd (B32)** — a key, printed. Real `<kbd>` caps in mono; documentation of
  a shortcut that already works, never a control.
- **NumberField (B33)** — the quantity input. Native number input in B11
  chrome with a square − / + pair replacing the unstyleable browser spinners,
  the unit stated beside the field, and bounds ENFORCED rather than merely
  announced.
- **Slider (B34)** — native `<input type="range">` on B4 bar geometry with the
  value printed in mono beside the label. No filled track: a two-tone fill
  needs a gradient, and A1 bans gradients — the number carries what the fill
  would have.
- **DateRangeField (B35)** — the F4 range with no month grid. A mono preset
  row (`7D · 30D · QTD · YTD · CUSTOM`) over two native date inputs welded into
  one Field, under an `aria-live` mono context line. `presetRange` is exported
  so a Menu, a URL parameter or a saved view computes the same ranges. F4's
  refusal now has a component, and it still draws no calendar.
- **SelectionHead** — what a selection DOES (B7 amendment). It replaces the
  CardHead in place: seed-tint row, mono count, the verbs, "Clear". No
  floating action bar and no new z-index; the card's own header already owns
  that row.
- **FilterLine** — how filter state is shown (B7 amendment). Active filters
  are ONE mono line of running text with a single "Clear all", and that line
  doubles as the `aria-live` announcement. No chips, no pills — B23 Badge
  stays category-only and non-dismissible.
- **Delta** (B3 amendment) — the arrow-and-figure chip extracted from the S1
  card so a table cell or a record row states a change in the same voice, from
  one implementation.
- **Trend `kind="stacked"` and `Sparkline`** (B5 amendment) — stacked columns
  scale to the TOTAL and are legal only for parts of one total; the Sparkline
  is legal only beside a printed figure.

### Changed
- **StatS1 takes `deltaPolarity`.** The previous guidance for inverse metrics
  — flip the delta's sign so the colour reads right — is WITHDRAWN. A card
  printing ▲ for a figure that fell is lying. Pass the real signed change and
  set `deltaPolarity="down-good"`; the arrow stays honest and the colour still
  reads correctly. Direction remains non-colour-carried (C5).
- **The Ship Gate is reconciled.** Part D of the Component Book carried nine
  points while the README and the agent skill both claimed fourteen; the Book
  now carries all fourteen, and the two are edited in the same change or
  neither is.
- **The skill's condensed specs cover B19–B35.** `component-specs.md` had
  stopped at B18, so the packaged skill described a system three releases
  behind the Book.
- **The site's roadmap page was three releases stale** — it still listed the
  Combobox and the dark surface as unshipped. It now mirrors `ROADMAP.md`.
- **The home page derives its spec count** from the doc entries instead of
  hardcoding "18 of 18".

- **The docs site is code-split.** Every route is a lazy chunk, so the
  landing page no longer ships the 36-entry doc corpus, the demo registry,
  and all eleven full-screen templates: the entry bundle drops from **623 kB
  to 268 kB** (186 kB → 85 kB gzipped) and the Vite 500 kB chunk warning is
  gone — split, not silenced with `chunkSizeWarningLimit`. The Shell carries
  a `Suspense` boundary around its outlet, so the band never blinks and the
  wall shows a B31 `Busy` while a page is in flight — the system answering
  its own question about what a fetching region looks like.
- **Corpus counts are inlined at build time.** `vite.config.ts` derives the
  component count and the Book range from the doc entries and defines them
  as constants, so the home page states real numbers without importing
  140 kB of prose to count them. Still derived, still one source of truth.
- **`SearchCommand` takes `onOpen`.** The ⌘K binding called
  `showModal()` directly, so the palette opened without `open` ever becoming
  true and the next `onClose()` had nothing to close — picking a result
  navigated but left the palette on screen. The shortcut now goes through
  the same state the trigger button uses.

### Fixed
- **NumberField cleared to its minimum.** `Number('')` is `0`, not "empty",
  so emptying the box to retype it clamped straight to `min` and the digits
  went nowhere. The field now holds what was typed until blur and only lets
  a real number out — clearing leaves it empty, out-of-range still clamps
  on the way out, and blur reconciles the box to the value.
- **React Doctor pass** — three errors and seven warnings, all verified
  against the code first: `CardTabs` passed `key` through a props spread
  (React 19 does not read it there); `BandSubTabs` wrote a ref during
  render, which can carry values from a render that never commits;
  `ToastProvider` built its context value inline, re-rendering every
  `useToast()` consumer in the tree on each toast; `DataTable` kept the
  ⇧-range anchor in state though only handlers read it, costing a re-render
  per selection; `Menu` gave an `<hr>` a redundant `role="separator"`;
  `ActivityList` keyed rows by array index, which is wrong for a feed that
  prepends — it now takes an optional `id`.
- Stale Book ranges across the documentation set: `README.md` (twice),
  `docs/README.md`, `docs/76-UI-LIBRARY.md`, the skill's `SKILL.md`,
  `README.md` and `system-dials.md` all claimed B1–B18 or B1–B23.
- `ROADMAP.md` claimed `Prose` as **B25** — a number already taken by
  PinField in v0.3.0. Prose is **B36**.
- The registered firewall exceptions were listed as three in the project
  README; there are four, and the skill's list now names B30's avatar ring and
  B31's spinner alongside B7/B11 and B10.
- The skill's firewall reference described `SCAN_DIRS` as three fixed
  directories; the script defaults to `src` and takes directories as
  arguments.

## [0.3.0-alpha.1] — 2026-07-25

**The entry layer, and the 320px floor made real.** Three new
registered components (B24–B26), six auth templates, and the two boundaries
the system had been leaning on without stating: what 76° refuses to build, and
what it refuses to support. Zero runtime dependencies held.

### Added
- **Plate (B24)** — the band-less page type. Wall edge to edge, one centred
  card carrying the whole decision, the mono `76°` wordmark above it, nothing
  else. Used by auth, 404, 500, maintenance and expired-link pages. The card
  title is the page's `<h1>`; the skip-link is omitted as a registered
  exception to C4, because a Plate has nothing to skip.
- **PinField (B25)** — the OTP / verification-code input: 4–8 fixed
  single-character boxes (default 6), typing advances, Backspace retreats, one
  paste fills every box. Semantically ONE input — `autocomplete="one-time-code"`,
  `inputmode="numeric"`, boxes presentational — so it is never a keyboard trap.
  Errors border every box as a unit, because the code is wrong as a unit.
- **SocialButton (B26)** — the federated-identity button on B10 Ghost anatomy.
  The provider mark is ONE path in `currentColor`; no brand hex ever enters the
  component layer, no multi-color mark, no raster. A registered override lets a
  product restore a provider's brand mark locally when its guidelines bind.
- **Six auth templates** — sign-in, sign-up, forgot, reset, verify and invite,
  composed from Plate + Field + SocialButton + PinField + Banner. Install with
  `npx shadcn add https://76.zifala.com/r/template-auth-<name>.json`.
- **Part F · The Refused** — eleven widget classes refused by name (F1–F11), so
  no one proposes them twice; every refusal ships with the composition that
  replaces it. F4 is binding on the date range: 76° draws no month grid, ever —
  two native date inputs, a mono preset row, and the browser's own calendar.
- **C10 · Direction** — 76° is LTR only, stated as a scope boundary rather than
  left implicit. The component layer uses physical direction properties and
  does not support RTL; Arabic, Hebrew, Persian and Urdu products are out of
  scope until the line is repealed. Logical properties were weighed and
  rejected for v1: a half-mirrored system reads as broken in a way a stated
  boundary does not.
- `--sv-seed-line` — the seed used as a 1–2px LINE (focus rings, focus borders,
  accent rules), split from the seed used as a fill. Tracks `--sv-seed` in
  light and `--sv-seed-text` in dark.
- `--sv-field-line-strong` (#7E8794 light / #6E7784 dark) — for controls whose
  border is the ONLY affordance. Ordinary fields keep the hairline; their label
  and value identify them.

### Changed
- **A2 amended to desktop scope.** The sidebar ban now reads "as primary
  navigation at ≥1000px". Below 1000px primary navigation IS a left sidebar: a
  B21 Drawer (`side="left"`, `size="sm"`) opened by a ghost button LABELLED
  "Menu" with a glyph beside it — never icon-only, that ban stands. BandSubTabs
  leaves the band below 1000px and nests, indented, beneath its parent nav item
  inside the drawer. The band's nav still never scrolls horizontally at any
  width; the 320px floor is now carried by a real navigation mechanism instead
  of a squeeze.
- The Component Book gains Part B specs B24–B26, Part F, and C10; the Ship
  Gate's registered-type list and squint test grow to name the Plate.

### Fixed
- Focus rings were drawn in `--sv-seed`, which does not brighten on dark — 
  2.90:1 on dark paper, under the 3:1 floor for non-text contrast, so visible
  focus was silently degraded on every non-band control in dark mode (C3,
  WCAG 1.4.11 / 2.4.11). 19 line declarations across 12 files now use
  `--sv-seed-line`: 6.16:1 cobalt, 7.19:1 verdigris, 7.65:1 signal. Light mode
  renders identically — the token resolves to `--sv-seed` there.
- PinField's boxes bordered in `--sv-field-line` — 1.38:1 light, 1.61:1 dark.
  An empty box has no label, no value and no fill, so that border is the only
  thing that says an input is there. Now `--sv-field-line-strong`: 3.63:1 and
  3.65:1.

## [0.2.1] — 2026-07-24

**Dark-chrome hotfix.** `--sv-paper` carried two meanings — the card surface
AND the near-white that sits on dark chrome or on a seed fill. Both were
#FFFFFF in light, so the collision was invisible; dark inverts paper to
#1B1F26 and every white-on-dark pair collapsed.

### Added
- `--sv-on-dark` (#FFFFFF, identical in both modes) — the mark on the band or
  on a seed fill: band text and nav states, the on-band focus ring, the
  primary button label, the on-band ghost button, the checkbox mark, the radio
  dot, the toggle thumb.
- `--sv-on-bad` (#FFFFFF light / #1B1F26 dark) — the mark on a `--sv-bad`
  fill. Unlike `--sv-on-dark` it flips, because `--sv-bad` itself brightens on
  dark to hold AA as text.
- Slop Firewall rule 16 — `color: var(--sv-paper)` outside `tokens.css` is now
  a defect. `--sv-paper` means the card surface and nothing else.
- Slop Firewall rule 17 — the color-literal scan now covers `.tsx` as well as
  `.css`, with `foundations.tsx` registered as the one exception (the palette
  specimen page prints and paints the very tokens it documents).

### Changed
- 13 sites across the system layer repointed off `--sv-paper`: five in
  `band.css`, three in `field.css`, two in `button.css`, one each in
  `tooltip.css` and `base.css` to `--sv-on-dark`, and the danger-confirm label
  in `button.css` to `--sv-on-bad`.
- The glassmorphism rule is now filter-context-specific — it matches
  `backdrop-filter` or `filter: …blur(…)` rather than a bare `blur(`, which
  false-flagged DOM `.blur()` calls and `onBlur` handlers in `.tsx` once the
  scan widened to those files.

### Fixed
- Dark mode: tooltip text, band base text, band nav hover/active, band subtab
  hover/active, the on-band ghost button, and docs code blocks all read
  1.15:1 on the band. Now 19.07:1.
- Dark mode: the on-band focus ring was 1.15:1 — visible focus was silently
  void on every band control, breaking C3. Now 19.07:1.
- Dark mode: the primary button label and the checkbox mark on the cobalt seed
  were 2.90:1. Now 5.71:1.
- Dark mode: the radio dot and the toggle thumb (both seed-filled) were
  2.90:1, under the 3:1 floor for non-text contrast. Now 5.71:1; the thumb on
  an unchecked track goes 1.61:1 → 10.29:1.
- The color-literal firewall rule only tested `.css` paths, so an inline SVG
  `fill="#4285F4"` in a `.tsx` passed. It now covers `.tsx` too, with the
  Foundations palette specimen as a registered exception.

## [0.2.0-alpha.1] — 2026-07-24

**Phase 2 — the interaction layer.** Five new registered components
(B19–B23), two amended ones, and the disciplined dark surface. Zero runtime
dependencies held: every overlay rides the native `<dialog>` element or the
`popover` attribute.

### Added
- **Combobox (B19)** — the searchable select. ARIA 1.2 combobox pattern with
  `aria-activedescendant`, local filtering across label + mono meta, full
  keyboard contract (arrows, Home/End, Enter, Esc-to-close then Esc-to-clear),
  B11 field chrome, and a named empty state.
- **Menu, MenuButton & SplitButton (B20)** — actions dropdowns on the native
  popover top layer: light dismiss, Esc, and focus return from the browser, no
  z-index. Items are verbs with optional icon, mono meta, danger tone, and
  separators. The SplitButton welds one primary verb to a chevron holding
  variants of the same job.
- **Drawer (B21)** — the slide-over on native `<dialog>.showModal()`: sizes
  sm 360 / md 480 / lg 640 / full, left or right, mono context line, scrolling
  body, sticky footer, transform-only 160ms entry honoring reduced motion.
- **Banner (B22)** — the inline notice and the surface errors belong on:
  tone rule + icon + 13/700 title + how-to-fix body, one text-link action,
  optional dismiss. `bad` announces as an alert. warn renders in ink — no
  amber enters the system.
- **Badge (B23)** — mono uppercase category tags (environment, plan, type,
  version), rectilinear, with a single seed tone for the active category.
  Status remains a StatusWord.
- **The dark surface** — opt-in `data-mode="dark"` changes tokens only:
  inverted neutral ladder (band darkest, cards lightest), AA-re-verified
  functional colors, per-seed dark `--sv-seed-text` variants, seed tints
  derived via `color-mix`, and `color-scheme` wired for native controls.
  A persisted LIGHT/DARK toggle ships in the docs band.

### Changed
- **Dialog (B13)** — new `size` prop: `default` 480 · `wide` 640 · `full`, a
  full-screen takeover (wall background, 1280px container, visible named
  close, no scrim dismissal). `wide` remains as a deprecated alias.
- **Toast (B14)** — grows into the full notification: title + description +
  16px tone icon, tones `ok/info/warn/bad`, sizes 360/440, dismiss control,
  and per-tone politeness (`status` vs `alert`; warn/bad persist). The
  `toast(message, tone)` shorthand keeps working. The A2 discipline holds:
  errors render inline at their source first.
- The toaster now takes its layer from the `--sv-z-*` ladder (was a literal).
- The Component Book gains Part B specs B19–B23 plus the B13/B14 and
  dark-surface amendments; the Ship Gate's registered-type list grows to
  match.

### Fixed
- Toast stacking respected its cap only implicitly; the cap is now explicit
  (3) and warn/bad no longer vanish mid-read — they persist until dismissed.

## [0.1.0-alpha.1] — 2026-07-24

First alpha. Adds the fundamentals discipline layer, composable blocks and
full-screen templates, a roadmap, more examples, and a cleanup pass.

### Added
- **Fundamentals layer** — three working verbs (build / audit / redesign), a
  pre-flight scan + append-only rule, declare-before-building, an honest-numbers
  rule, the 8-state + 4-lifecycle-state contract, a 320–1280px responsive floor,
  motion/layering physics (the `--sv-z-*` ladder), and a durable screen stamp.
  Documented in `docs/` and carried by the `seventy-six-design` skill.
- **Blocks** — 7 registry-installable composed sections: stats row, trend panel,
  table view, activity panel, meter panel, empty screen, dashboard header.
- **Templates** — 5 full-screen templates: ERP dashboard (cobalt), CRM pipeline
  (verdigris), POS terminal (signal), Settings (neutral), AI agent control
  center (cobalt). Install with `npx shadcn add https://76.zifala.com/r/template-<name>.json`.
- **Roadmap** — `ROADMAP.md` and a `/roadmap` page in the docs site.
- A second, distinct example on eight components (progress over target,
  near-capacity meter, selectable table, filter tabs with counts, CRM activity
  feed, empty-filter state, icon-button tooltip, info/error toasts).
- `.sv-card__body` padded card region for free content, and
  `scripts/check-sync.mjs` to guard the skill's mirrored files against drift.

### Changed
- The Slop Firewall grows to 15 rules (Part E fundamentals gates) and scans all
  of `src`; the dead `9px` radius entry (silently sliced off) was removed.
- Versions aligned to `0.1.0-alpha.1` across the package and the skill.
- npm tarball trimmed to the installable source + registry + build scripts,
  dropping the doc-site internals and the Playwright tool (140 → 115 files).

### Fixed
- Charts, progress bars, meters, forms, and the POS totals no longer sit flush
  against the card edge — free content is inset via `.sv-card__body`.

## [0.0.1] — 2026-07-24

Initial release.

### Added
- 18 components across the B1–B18 widget taxonomy; zero runtime dependencies,
  WCAG 2.2 AA.
- shadcn-compatible registry served from `https://76.zifala.com` — install any
  item with `npx shadcn add https://76.zifala.com/r/<name>.json`.
- AI-ready layer: an `llms.txt` index and a full markdown doc per component.
- `seventy-six-design` agent skill (skills.sh) with references and the Slop
  Firewall lint.
- Deployment: a Nixpacks build plus a zero-dependency Node static server for
  Coolify.

[Unreleased]: https://github.com/mohaaosman/76/compare/v0.4.0-alpha.1...HEAD
[0.4.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.3.0-alpha.1...v0.4.0-alpha.1
[0.3.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.2.1...v0.3.0-alpha.1
[0.2.1]: https://github.com/mohaaosman/76/compare/v0.2.0-alpha.1...v0.2.1
[0.2.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.1.0-alpha.1...v0.2.0-alpha.1
[0.1.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.0.1...v0.1.0-alpha.1
[0.0.1]: https://github.com/mohaaosman/76/releases/tag/v0.0.1
