# Changelog

All notable changes to **seventy-six-ui** (the 76° design system) are recorded
here. The format follows [Keep a Changelog](https://keepachangelog.com); the
project uses [semantic versioning](https://semver.org).

## [Unreleased]

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

[Unreleased]: https://github.com/mohaaosman/76/compare/v0.1.0-alpha.1...HEAD
[0.1.0-alpha.1]: https://github.com/mohaaosman/76/compare/v0.0.1...v0.1.0-alpha.1
[0.0.1]: https://github.com/mohaaosman/76/releases/tag/v0.0.1
