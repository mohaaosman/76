# StatS1 · 76° UI (B3)

The signature stat and the only legal KPI card: label + delta, icon tile + value, and a footnote that earns its line.

**One job:** Answer "how much — and so what."
**Category:** widgets · **Exports:** StatS1 · **Tags:** kpi, stat-card, delta, tabular-numerals, icon-tile, footnote

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/stat-s1.json
```

Manual: copy components/seventy-six/stat-s1.tsx, components/seventy-six/stat-s1.css, components/seventy-six/card.tsx, components/seventy-six/card.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: card.

## Overview

Three zones, all required. **Top:** mono label left, colored delta right (▲/▼ + tabular value — the arrow glyph is the non-color cue). **Middle:** a 34px seed-tint icon tile beside the 24/800 tabular value. **Foot:** a hairline-separated 11.5px sentence whose load-bearing figure sits in bold ink.

The footnote is the discipline: it must contain information **not already in the card** — the target, the exposure, the oldest item's age. "Revenue is up" under a revenue number is a defect; "$610K target · 79% with 7 days left" is the point of the component.

"Generic admin KPI card" is a registered defect class (A2). If a stat needs a sparkline, it is a Trend; if it needs two values, it is two stats.

## Examples

### The canonical stat row

Four S1s in the stats split — the row that overlaps the band on every 76° overview.

```tsx
import { StatS1, Row } from '@/components/seventy-six';

<Row split="stats">
  <StatS1
    label="REVENUE · MTD"
    value="$482,190"
    delta={12.4}
    icon={<CoinsIcon />}
    footnote={<><b>$610K</b> target · 79% with 7 days left</>}
    footnoteText="$610K target, 79% reached with 7 days left"
  />
  <StatS1
    label="OPEN ORDERS"
    value="1,284"
    delta={-3.1}
    icon={<BoxIcon />}
    footnote={<>oldest open order is <b>4 days</b> · SLA is 5</>}
    footnoteText="Oldest open order is 4 days, SLA is 5"
  />
</Row>
```

### Without a comparison

When no comparison period exists the delta is simply omitted — the label never moves.

```tsx
<StatS1
  label="ACTIVE SKUS"
  value="4,207"
  icon={<TagIcon />}
  footnote={<><b>312</b> added this quarter across 3 categories</>}
  footnoteText="312 added this quarter across 3 categories"
/>
```

## Props

### StatS1

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Mono micro label, e.g. "REVENUE · MTD". |
| `value` | `string` | — | Pre-formatted display value; rendered 24/800 tabular. |
| `unit` | `string` | — | Suffix (%, pt, d) at 14/600 soft. |
| `delta` | `number` | — | Signed comparison; ▲/▼ + value in ok/bad. Omit when none exists. |
| `deltaSuffix` | `string` | `'%'` | Appended to the delta figure. |
| `icon` | `ReactNode` | — | 16px stroke icon; the tile provides the seed tint. |
| `footnote` | `ReactNode` | — | The "so what" line; put the load-bearing figure in <b>. |
| `footnoteText` | `string` | — | Plain-text footnote for the aria-label. |

## Accessibility

- The card reads as ONE unit: `aria-label="Revenue month to date: $482,190, up 12.4%, $610K target…"`; the visual internals are aria-hidden to avoid double-speak.
- Delta direction is never color-only — the arrow glyph carries it (C5).
- `tabular-nums` on the value and delta, per A4.

## Don't

- No sparklines, menus, or second values inside a stat.
- No icon on the right side; the tile sits left of the value.
- No tinted card backgrounds — the tile is the only tint.
- No footnote that paraphrases the value; it must add information.
- No generic KPI cards: S1 is the only stat anatomy.

## FAQ

**How do I format the value?**

Format upstream and pass a string ($482,190). The component handles type discipline (tabular, tracking) but not locale math.

**What if the metric got worse but down is good (e.g. returns)?**

The delta colors by sign. For inverse metrics, pass the delta whose sign matches sentiment — e.g. returns dropping 8% is delta={+8} labeled "RETURNS · FEWER" — or omit the delta and carry it in the footnote.

**Can the whole card link to a report?**

Yes — wrap it in the anchor; the whole card is the target, focus ring per C3, and hover shows nothing beyond the cursor.
