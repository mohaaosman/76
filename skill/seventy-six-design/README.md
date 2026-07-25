# seventy-six-design

The **76° (Seventy Six Degrees)** design system, packaged as an agent skill.

76° is flat, informational, corporate — *paper on a wall.* White cards on a
platinum wall, three colors total, mono for metadata, numbers as
instrumentation, all navigation in one ink band. Every component tells you
information; none of them perform.

This skill makes an AI coding assistant build and review UI to that system —
React components, dashboards, ERP/CRM/POS screens, admin panels, forms,
tables, charts, mockups, and artifacts — whether or not the prompt ever says
"76°".

Since v0.1.0 the skill also carries a **fundamentals layer**: three working
verbs (build / audit / redesign), a pre-flight scan for existing projects,
declared decisions before code, an honest-numbers rule, the 8-state + 4-
lifecycle-state contract, a 320–1280px responsive hard floor, motion and
layering physics, and a durable stamp on every screen. The visual system is
unchanged — the fundamentals govern process and craft, not pixels.

## What's inside

```
SKILL.md                      the Six Laws, tokens, taxonomy, Craft Floor, Ship Gate
references/
  fundamentals.md             the discipline layer: verbs · pre-flight · states · floor · physics · stamp
  component-specs.md          B1–B35: anatomy · states · a11y · Don't, per component
  firewall-and-copy.md        A1–A4 + Part E fundamentals gates + the 14-point Ship Gate
  library.md                  the seventy-six-ui React library: exports + shadcn install
  system-dials.md             three-layer ecosystem model + per-system seeds (ERP/CRM/POS/health)
  tokens.css                  the canonical token file (copy verbatim into new projects)
scripts/
  slop-firewall.mjs           machine-checkable lint (16 rules) — exits non-zero on any violation
```

## Install

```bash
npx skills add mohaaosman/76@seventy-six-design -g -y
```

Browse the ecosystem at <https://skills.sh/>. The companion component library
lives at <https://76.zifala.com> and installs via the shadcn registry:

```bash
npx shadcn@latest add https://76.zifala.com/r/skeleton.json
```

## License

MIT.
