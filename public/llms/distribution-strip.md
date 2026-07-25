# DistributionStrip · 76° UI (B44)

One total divided into its shares: a 10px strip with structural seams and a legend that prints every figure.

**One job:** Answer "what share is each part."
**Category:** widgets · **Exports:** DistributionStrip · **Tags:** distribution, share, part-to-whole, composition, donut-replacement, legend, strip

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/distribution-strip.json
```

Manual: copy components/seventy-six/distribution-strip.tsx, components/seventy-six/distribution-strip.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A2 bans donut, pie, radial and gauge charts. Until now the Book answered "use B6 MeterList", but that is a different question. **B6 measures each part against ITS OWN maximum** — utilization, "Zone A is 92% full". **B44 divides ONE total into its shares** — "46% of 128,953 sessions were mobile". Every donut a team has ever drawn was asking B44's question and being handed B6's answer.

The anatomy is fixed: a B4-voiced value line (mono label left, the 19/700 tabular total right), one 10px strip, and a legend beneath it. Segments are parted by a 2px `--sv-paper` seam, and that seam is structure rather than decoration — a gradient is banned (A1), so the seam is the only thing making the parts read as parts instead of one continuous smear. Four tones run in fixed order — seed, compare, ink-faint, and `--sv-field-line-strong`, which is the last step that is still visibly a fill; the hairline stays a rule, because a part of the total nobody can see is a part that was not stated. A fifth part reuses the fourth tone, which is the component saying the list should have ended at "Other".

The legend is **the data**. It repeats every figure as text, which is why the strip itself is `role="img"` illustration and nothing is carried by colour or width alone (C5). B6's rule is inherited whole: **an absolute figure sits beside every percentage, because a percentage alone is a defect**. "46%" states nothing until "59,318 · 46%" says how many.

`total` defaults to the sum of the parts. Pass it when the parts are a subset of something larger — the top three queues out of all of them — and the wall shows through for the remainder. A strip whose parts do not reach its stated total is legal only when the label and the `ariaLabel` say so.

## Examples

### Device share of one session total

The four parts sum to the total, so no total is passed. Each legend row prints the count and the share — the strip could be deleted and the card would still answer the question.

```tsx
import { DistributionStrip } from '@/components/seventy-six';

<DistributionStrip
  label="DEVICES ACCESSED · JULY"
  ariaLabel="128,953 sessions: mobile 46%, desktop 31%, tablet 15%, other 8%"
  parts={[
    { label: 'Mobile', value: 59318 },
    { label: 'Desktop', value: 39975 },
    { label: 'Tablet', value: 19343 },
    { label: 'Other', value: 10317 },
  ]}
/>
```

### Parts that are a subset of the total

The three named queues hold 3,180 of 4,720 tickets. `total` becomes the denominator, the unclaimed third stays wall, and the ariaLabel states the shortfall in words rather than leaving the gap to be inferred from a width.

```tsx
<DistributionStrip
  label="OPEN TICKETS · TOP THREE QUEUES"
  ariaLabel="Three queues hold 3,180 of 4,720 open tickets: billing 33%, shipping 21%, returns 13%; the remaining 1,540 are spread across nine smaller queues"
  total={4720}
  parts={[
    { label: 'Billing', value: 1540 },
    { label: 'Shipping', value: 1010 },
    { label: 'Returns', value: 630 },
  ]}
/>
```

## Props

### DistributionStrip

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | REQUIRED. The whole division stated in words, total included. |
| `label` | `string` | — | Mono uppercase name for the total, e.g. "DEVICES ACCESSED". |
| `parts` | `DistributionPart[]` | — | { label, value } — five at most; the fifth reuses the fourth tone. |
| `total` | `number` | `sum of parts` | The denominator. Pass it when the parts are a subset; the remainder shows as wall. |
| `format` | `(value: number) => string` | `grouped integer` | Formats the total and every absolute figure. Resolved per call, never at module scope. |

## Accessibility

- The strip is `role="img"` with the takeaway as its label — one reading of the division, not four segment announcements.
- The legend is an ordinary list under it, so every name and figure is read as text whether or not the illustration is. Swatches are `aria-hidden`: colour never carries a part (C5).
- `tabular-nums` on the total and on every legend figure, per A4.

## Don't

- No sixth part — five rows is the ceiling, and beyond it the answer is a B7 DataTable.
- No stack of strips comparing periods; parts of one total over time are B5 `kind="stacked"`.
- No strip whose parts do not sum to the stated total without saying so in the label and the ariaLabel.
- No hand-picked colour per part — the four tones run in order (Law 2).
- No bending it into a ring. That is the chart this component exists to replace.

## FAQ

**Why not just a donut, everyone reads them?**

They do not. Angle is the least accurately judged visual channel there is, so two slices of similar size are guesswork and the reader falls back on the printed labels — at which point the ring is decoration wrapped around a legend. A 10px strip plus the printed figures is both smaller and exact.

**What about a single percentage?**

That is B4 Progress — one value against one target. A strip with one segment is a bar with extra steps.

**MeterList or DistributionStrip?**

Does each item have its own ceiling? B6. Do the items divide one number between them? B44. "Zone A is 92% full" is B6; "mobile is 46% of sessions" is B44.
