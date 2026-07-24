# 76° UI — Seventy Six Degrees

The component library and documentation site for the **76° design system**.
Flat, informational, corporate — paper on a wall. Compiled 1:1 from the
Component Book (`76-COMPONENT-BOOK.md`): all twenty-three specs, B1–B23.

## What's inside

```
src/
  styles/tokens.css            the ONLY file allowed to contain color literals
  styles/base.css              reset · focus contract (C3) · mono/tabular voices
  lib/cx.ts                    class combiner (the only "utility")
  components/seventy-six/      the library — one component per widget type
  docs/                        the documentation site (itself a 76° product)
    content/                   pure-data doc entries → site + markdown + registry
    demos.tsx                  live preview components
    site/                      shell, blocks, pages
docs/                          the 76° documentation set (system · book · dials · fundamentals)
skill/seventy-six-design/      the agent skill — SKILL.md + references + firewall
scripts/
  build-registry.mjs           emits public/r/*.json (shadcn-compatible items)
  build-llms.mjs               emits public/llms.txt + public/llms/*.md
  slop-firewall.mjs            Parts A1 + E as a lint (15 rules) — CI-gateable, exits non-zero
  shipgate-screens.mjs         Playwright screenshot pass for Part D review
```

## The fundamentals layer (v0.1.0)

The system now ships a discipline layer on top of the Six Laws — merged from
the strongest process rules in Hallmark and Impeccable, with the visual
system untouched: three working verbs (build / audit / redesign), a
pre-flight scan and append-only rule for existing projects, declared
decisions before code, honest internally-consistent numbers, the 8-state +
4-lifecycle-state contract, a 320–1280px responsive hard floor, motion and
layering physics (including the `--sv-z-*` ladder in tokens.css), and a
durable `/* 76° · screen: … */` stamp. Full text in
`docs/76-FUNDAMENTALS.md` and `skill/seventy-six-design/references/
fundamentals.md`; the machine-checkable half lives in the firewall (rules
11–15) and the Ship Gate is now 14 points.

## Documentation (`docs/`)

The canonical 76° documentation set, versioned with the code — see
`docs/README.md` for the reading order: `76-DESIGN-SYSTEM.md` (the
constitution), `76-COMPONENT-BOOK.md` (B1–B18 specs), `76-FUNDAMENTALS.md`
(the discipline layer), `76-UI-LIBRARY.md` (this library),
`ECOSYSTEM-DESIGN-DNA.md` (the three-layer model), and
`DESIGN-STYLE-VOCABULARY.md` (the shared design language).

## The interaction layer (v0.2.0)

Phase 2 closes the gaps that pushed products toward other libraries: a
**searchable Combobox** (B19, ARIA 1.2, hand-rolled), **Menu + SplitButton**
(B20, native popover top layer), the **Drawer** slide-over (B21, native
`<dialog>`, sm/md/lg/full), **full-screen Dialogs** (`size="full"`),
**notifications** with title + description + icon + four tones + two sizes,
the inline **Banner** (B22 — where errors actually render), **Badge** (B23),
and the **dark surface**: opt-in `data-mode="dark"`, tokens-only, AA
re-verified, per-seed dark text variants, toggle live in the docs band.

## Zero runtime dependencies

Every component runs on the platform: native `<dialog>` (Dialog, Drawer,
SearchCommand), the `popover` attribute (Tooltip, Menu, SplitButton), native
`<select>` for short lists with a hand-rolled ARIA 1.2 Combobox for long
ones, real inputs behind styled proxies (Checkbox/Radio/Toggle), and
hand-rolled SVG (Trend). React is the only peer — the searchable combobox
entered the Book and Radix stayed on the bench.

## Commands

```bash
npm install
npm run dev          # docs site at localhost:5173
npm run build        # registry + llms + typecheck + site → dist/
npm run firewall     # Slop Firewall (Part A1) — zero hits or non-zero exit
npm run registry     # rebuild public/r/*.json only
npm run llms         # rebuild public/llms.txt + public/llms/*.md only
REGISTRY_BASE=https://76.zifala.com npm run build   # default host, already baked; override to change it
```

## Consuming the library (shadcn model)

Deploy `dist/` anywhere static. Then, in any React project with a
`components.json`:

```bash
npx shadcn@latest add https://76.zifala.com/r/button.json
```

The item installs its source files (component + scoped CSS), pulls
`tokens.json` (tokens.css, base.css, cx.ts) as a registry dependency, and
rewrites import aliases through the consumer's `components.json`. You own
the code from that point.

Manual path: copy `styles/tokens.css`, `styles/base.css`, `lib/cx.ts` once,
then any component pair from `components/seventy-six/`.

## AI-ready layer

- `public/llms.txt` — index for assistants
- `public/llms/<slug>.md` — the full doc per component, generated from the
  same data the site renders (the "Copy page for AI" button yields the same)
- `public/r/<slug>.json` — registry items carrying description, feature
  tags, category, Book reference, and exports in `meta`
- MCP server: deliberately deferred until component volume justifies it;
  the metadata it would search already ships in every registry item.

## Registered firewall exceptions

Three, each traceable to a Book spec and allowlisted in
`scripts/slop-firewall.mjs`: the B10 loading spinner (`sv-rotate`), inset
box-shadows used as structural rules (B7 selected-row rule, B11 focus
border), and the single B4/B6 bar-fill width transition.

---

*76° — Seventy Six Degrees · the product is the design.*
