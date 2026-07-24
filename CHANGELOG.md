# Changelog

All notable changes to **seventy-six-ui** (the 76° design system) are recorded
here. The format follows [Keep a Changelog](https://keepachangelog.com); the
project uses [semantic versioning](https://semver.org).

## [Unreleased]

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

[Unreleased]: https://github.com/mohaaosman/76/compare/v0.2.0-alpha.1...HEAD
[0.2.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.1.0-alpha.1...v0.2.0-alpha.1
[0.1.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.0.1...v0.1.0-alpha.1
[0.0.1]: https://github.com/mohaaosman/76/releases/tag/v0.0.1
