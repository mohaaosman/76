# 76° — UI Library & Docs Site · Project Memory

**Status:** v1 shipped July 2026; the library is at v0.4.0, Book specs
B1–B35. Companion to `76-DESIGN-SYSTEM.md` and `76-COMPONENT-BOOK.md`.
This file is the record of the decisions taken at v1 — where a later
release superseded one, it is marked inline rather than rewritten.
`ROADMAP.md` carries what has shipped since.

## Decisions locked (with Max, 24 JUL 2026)

1. **Foundation: native-first.** All eighteen Book specs (B1–B18) ship on
   the platform — native `<dialog>` (Dialog, SearchCommand), the `popover`
   attribute (Tooltip), native `<select>`, real inputs behind styled
   proxies, hand-rolled SVG (Trend). **Zero runtime dependencies** beyond
   React. Radix is reserved for a future searchable combobox, which enters
   the Book as its own registered component when a product needs it.
   *(Superseded in v0.2.0: the Combobox entered the Book hand-rolled on the
   ARIA 1.2 pattern and Radix stayed on the bench. The zero-dependency rule
   has held through B35.)*
2. **Docs site: custom Vite + React**, built entirely from the library's
   own components — ink band nav (no sidebar), paper cards, overlap row.
   The site is the living proof of the system.
3. **Scope: the full Book in one push.** 19 components (B1–B18 + the Card
   paper primitive from A4), each fully documented. *(The Book has since
   grown to B35; the rule that every spec ships documented in the same
   change has held.)*
4. **AI layer: registry + markdown now, MCP later.** shadcn-compatible
   items at `/r/<slug>.json` (description, tags, category, Book ref in
   meta), `llms.txt` + `/llms/<slug>.md` generated from the same data the
   site renders, and a "Copy page for AI" button on every page. The MCP
   server is the deferred tier; its search metadata already exists.

## The doc page skeleton (every component, no exceptions)

Overview (one job) → Installation (CLI / Manual tabs) → live variations
with paired Preview / Code tabs → Props (per export) → Accessibility
(keyboard table + Part C notes) → Don't list (the Slop Firewall in prose)
→ FAQ (the API restated as Q&A — human help and LLM embedding fodder).

## Enforcement that ships with the code

- `npm run firewall` — Parts A1 + E as a lint (16 rules); CI-gateable,
  exits non-zero on any hit. Registered exceptions, each traceable to a
  Book spec: the `sv-rotate` spinner (B10's button, B31's Spinner), inset
  box-shadows as structural rules (B7 selected-row rule, B11 focus border,
  B30 avatar ring), the B4/B6 bar-fill width transition, and
  `foundations.tsx` as the palette specimen.
- `npm run check:sync` — the skill bundles verbatim copies of
  `slop-firewall.mjs` and `tokens.css`; this fails on drift.
- `scripts/shipgate-screens.mjs` — Playwright pass for Part D review.
- Motion collapses to 0ms under `prefers-reduced-motion` at the token
  layer (`--sv-t`, `--sv-t-fast`) — no `!important` anywhere.

## Deploy notes

`REGISTRY_BASE=https://domain npm run build` bakes real URLs into the
registry and llms outputs. Consumers install with
`npx shadcn@latest add <base>/r/<name>.json`; the `tokens` item
(tokens.css + base.css + cx.ts) comes along as a registry dependency.
