# FunnelList · 76° UI (B61)

The narrowing — one total through an ordered sequence of steps, on B6's straight bars.

**One job:** State how one total narrows through an ordered sequence of steps.
**Category:** widgets · **Exports:** FunnelList, FunnelStep, FunnelListProps · **Tags:** funnel, conversion, checkout, pipeline, drop-off, steps, baseline

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/funnel-list.json
```

Manual: copy components/seventy-six/funnel-list.tsx, components/seventy-six/funnel-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

B6 **MeterList** measures each part against its own maximum. B44 **DistributionStrip** divides one total into parallel shares. A funnel's parts are not parallel: every step is a subset of the step before it. So it is an ordered list, every bar is drawn against the **first** step, and every step after the first states what it kept from the previous one — "41.2% of previous · 7,370 lost".

**The trapezoid stays refused**, for the same reason the donut does: it is a shape performing a number. The bars are B6's straight 3px bars, and the absolute figure is required on every step — a bare percentage is a defect.

**It never computes (C9).** Every figure, rate and loss is a pre-formatted string. `share` (0–1 of the first step) only draws the bar, by `scaleX` on a full-width fill — no width is ever set or animated.

When the conversion lines carry a comparison, `baseline` prints what they are compared against once at the head ("vs Q2 2026"), so no delta in the list is an unsourced assertion.

## Examples

### Checkout

Five steps from 48,200 product views to 3,210 orders. Every rate and loss reconciles with the figures.

```tsx
import { FunnelList } from '@/components/seventy-six';

<FunnelList
  label="Checkout funnel, July 2026"
  steps={[
    { label: 'Viewed a product', value: '48,200', share: 1 },
    { label: 'Added to cart', value: '12,530', share: 0.26,
      conversion: '26.0% of previous · 35,670 lost' },
    { label: 'Began checkout', value: '5,160', share: 0.1071,
      conversion: '41.2% of previous · 7,370 lost' },
    { label: 'Entered payment', value: '3,870', share: 0.0803,
      conversion: '75.0% of previous · 1,290 lost' },
    { label: 'Placed an order', value: '3,210', share: 0.0666,
      conversion: '82.9% of previous · 660 lost' },
  ]}
/>
```

### In a card, against a baseline

The deltas are step rates against Q2, and the head says so once.

```tsx
<Card>
  <CardHead title="Pipeline conversion" subtitle="Q3 2026 · 240 leads" />
  <div className="sv-card__body">
    <FunnelList
      label="Pipeline conversion, Q3 2026"
      baseline="Q2 2026"
      steps={[
        { label: 'Lead', value: '240', share: 1 },
        { label: 'Qualified', value: '150', share: 0.625,
          conversion: '62.5% of previous · 90 lost · ▲ 4.1 pts' },
        /* … */
      ]}
    />
  </div>
</Card>
```

## Props

### FunnelList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible name for the list, e.g. "Checkout funnel, July 2026". |
| `steps` | `FunnelStep[]` | — | In order. label · value (REQUIRED, PRE-FORMATTED) · share · optional conversion · optional id. |
| `steps[].share` | `number` | — | 0–1 of the FIRST step, for drawing the bar only. The first step is 1. |
| `steps[].conversion` | `string` | — | PRE-FORMATTED, from the previous step: "41.2% of previous · 7,370 lost". |
| `baseline` | `string` | — | What the comparisons are against, printed once at the head via the localized "vs …". |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | id, style, data-*, aria-*, event handlers — spread onto the root; ref forwards to it. className is appended. |

## Accessibility

- A real <ol>, so position in the sequence is announced; the mono ordinal is aria-hidden to avoid saying it twice.
- The bar is aria-hidden illustration — the absolute figure and the conversion line carry every number as text (C5).
- Figures are tabular and pre-formatted by the caller (C9).
- The bar grows from the inline start, so it mirrors in RTL.
- It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).

## Don't

- Never a trapezoid, a taper or any funnel shape — straight 3px bars only.
- Never a step without its absolute figure.
- Never steps that are not subsets of the one before; parallel parts are B44 or B6.
- Never green or red bars for good and bad steps — colour belongs to words and dots.
- Never more than seven steps; a longer sequence is a B7 DataTable.
- Never a delta in a conversion line without a stated baseline.

## FAQ

**FunnelList, MeterList or DistributionStrip?**

Is each part a subset of the one before? FunnelList. Is each part measured against its own capacity? MeterList. Do the parts divide one total side by side? DistributionStrip.

**Why is every bar drawn against the first step?**

So the bars compare across the whole sequence. The step-to-step rate is printed in the conversion line, where it can be read exactly.

**Why must I compute the rates?**

C9: formatting and arithmetic belong to the caller's layer, in the reader's locale. A component that rounds for you will one day disagree with the report.
