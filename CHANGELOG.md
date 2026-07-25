# Changelog

All notable changes to **seventy-six-ui** (the 76° design system) are recorded
here. The format follows [Keep a Changelog](https://keepachangelog.com); the
project uses [semantic versioning](https://semver.org).

## [Unreleased]

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

[Unreleased]: https://github.com/mohaaosman/76/compare/v0.3.0-alpha.1...HEAD
[0.3.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.2.1...v0.3.0-alpha.1
[0.2.1]: https://github.com/mohaaosman/76/compare/v0.2.0-alpha.1...v0.2.1
[0.2.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.1.0-alpha.1...v0.2.0-alpha.1
[0.1.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.0.1...v0.1.0-alpha.1
[0.0.1]: https://github.com/mohaaosman/76/releases/tag/v0.0.1
