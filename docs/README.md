# 76° — Documentation

The canonical documentation set for the **76° (Seventy Six Degrees)** design
system, versioned alongside the component library. Flat, informational,
corporate — paper on a wall.

Reading order:

1. **[76-DESIGN-SYSTEM.md](76-DESIGN-SYSTEM.md)** — the constitution: the
   Six Laws, the token set, typography, layout (the ink band + the sheet),
   and the widget taxonomy.
2. **[76-COMPONENT-BOOK.md](76-COMPONENT-BOOK.md)** — the Component Book,
   B1–B35: anatomy, states, accessibility contract, and the Don't list for
   every registered component — plus Part F, the refusals, each with the
   composition that replaces it.
3. **[76-FUNDAMENTALS.md](76-FUNDAMENTALS.md)** — the discipline layer
   (v0.1.0): working verbs (build / audit / redesign), pre-flight, declared
   decisions, honest numbers, the 8-state + 4-lifecycle-state contract, the
   responsive hard floor, motion and layering physics, and the stamp.
4. **[76-UI-LIBRARY.md](76-UI-LIBRARY.md)** — the seventy-six-ui React
   library: what ships, how it installs (shadcn registry), and how the docs
   site is generated.
5. **[ECOSYSTEM-DESIGN-DNA.md](ECOSYSTEM-DESIGN-DNA.md)** — the three-layer
   ecosystem model and how each product (ERP, CRM, POS, …) gets exactly one
   seed and nothing else.
6. **[DESIGN-STYLE-VOCABULARY.md](DESIGN-STYLE-VOCABULARY.md)** — the shared
   design vocabulary used across briefs and critiques.

The enforcement layer lives in code, not prose: `scripts/slop-firewall.mjs`
(A1 + Part E, 16 machine-checkable rules, CI-gateable) and the 14-point Ship
Gate, carried identically in Part D of the Book and in
`skill/seventy-six-design/references/firewall-and-copy.md`. The
agent-skill packaging of this documentation is
`skill/seventy-six-design/` — same rules, condensed for assistants.

The wordmark is `76°` — the degree mark is never omitted.
