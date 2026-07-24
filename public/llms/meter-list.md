# MeterList · 76° UI (B6)

Named items with 3px bars and mandatory absolute numbers — the donut chart's replacement.

**One job:** Answer "how is each part doing."
**Category:** widgets · **Exports:** MeterList · **Tags:** meter, capacity, utilization, donut-replacement, progressbar-list

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/meter-list.json
```

Manual: copy components/seventy-six/meter-list.tsx, components/seventy-six/meter-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Rows of: soft label + bold tabular value, a 3px bar, and a subtitle with the real numbers. The subtitle is **required** — "92%" alone is a defect; "4,320 of 4,700 pallet positions" is the component doing its job.

Wherever a donut, pie, or gauge is tempting, this is the registered answer (A2). It ranks, it shows capacity, and it stays readable at a squint.

## Examples

### Warehouse utilization

```tsx
import { MeterList, Card, CardHead } from '@/components/seventy-six';

<Card>
  <CardHead title="Capacity" subtitle="By zone · live" />
  <div className="trend-pad">
    <MeterList
      items={[
        { label: 'Zone A · ambient', current: 4320, max: 4700, value: '92%', subtitle: '4,320 of 4,700 pallet positions' },
        { label: 'Zone B · chilled', current: 1180, max: 1600, value: '74%', subtitle: '1,180 of 1,600 pallet positions' },
        { label: 'Zone C · bonded', current: 410, max: 900, value: '46%', subtitle: '410 of 900 pallet positions' },
      ]}
    />
  </div>
</Card>
```

### A row near capacity

There is no red "danger" fill (A2) — a zone about to run out carries its warning in words inside the mandatory absolute-numbers subtitle, which is exactly what a screen reader hears too.

```tsx
<MeterList
  items={[
    { label: 'Zone A · ambient', current: 4630, max: 4700, value: '99%',
      subtitle: '4,630 of 4,700 — only 70 positions left, reorder space now' },
    { label: 'Zone B · chilled', current: 1180, max: 1600, value: '74%',
      subtitle: '1,180 of 1,600 pallet positions' },
    { label: 'Zone C · bonded', current: 410, max: 900, value: '46%',
      subtitle: '410 of 900 pallet positions' },
  ]}
/>
```

## Props

### MeterList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `MeterItem[]` | — | { label, current, max, value, subtitle } — subtitle (absolute numbers) is required by the type. |

## Accessibility

- Each row is a `role="progressbar"` labeled by its name AND absolute numbers — a screen reader hears "Zone A: 4,320 of 4,700 pallet positions", not "92 percent".

## Don't

- No percentage-only rows; the absolute subtitle is mandatory.
- No red fills for hot zones — a zone in trouble gets a row in a table with a StatusWord.
- No sorting animations; re-render in the new order.

## FAQ

**When is MeterList wrong?**

When there is one value against one target (use Progress) or when items need drilling into (use DataTable — meters are read-only summaries).

**Can bars use different colors per row?**

No. Seed on wall, every row. Differentiation comes from labels and values, not hue (Law 2).
