# SumList · 76° UI (B55)

The amount block — a set of charges and the figure they add up to.

**One job:** State a set of amounts and the figure they add up to.
**Category:** widgets · **Exports:** SumList · **Tags:** sum, total, invoice, checkout, billing, amounts, subtotal, tax

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/sum-list.json
```

Manual: copy components/seventy-six/sum-list.tsx, components/seventy-six/sum-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

It is **B44 DistributionStrip's arithmetic sibling, and the pairing is the point: B44 divides ONE total into its shares; SumList builds ONE total from its lines.** B44 starts with 128,953 sessions and asks how they split; this starts with a line total, a discount, a tax and a carriage charge and asks what the reader owes. They share a voice on purpose — mono label left, pre-formatted figure right, the closing figure at B4's 19/700 step — because they are the same arithmetic read in opposite directions.

**The boundary against B7, because someone will otherwise use the wrong one.** Inside a table the closing figures are B7's `totals`: a real `<tfoot>` keyed to the table's own columns, which the browser repeats at the foot of every printed page. SumList is that block wherever it sits <i>outside</i> a table. The test is not where it looks right — it is whether the amounts belong to the table's columns. A line total does. Shipping, a discount and tax belong to the **document**, and have no column to sit in.

**It never computes.** Every amount is a pre-formatted string the caller supplies (C9), the currency symbol and the minus sign on a discount included. A component that adds up the numbers it was handed is a component that can disagree with the invoice, and the invoice is the document of record.

## Examples

### The amount due

Line total, discount, tax, deposit — and the one figure the reader came for.

```tsx
import { SumList } from '@/components/seventy-six';

<SumList
  rows={[
    { label: 'LINE TOTAL', amount: '$25,600.00' },
    { label: 'DISCOUNT', amount: '−$1,280.00', note: '5% agreed rate' },
    { label: 'VAT 20%', amount: '$4,864.00', note: '20% of $24,320.00' },
    { label: 'DEPOSIT RECEIVED', amount: '−$7,296.00', note: '19 JUN 2026' },
    { label: 'BALANCE DUE', amount: '$21,888.00', strong: true },
  ]}
/>
```

## Props

### SumList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `SumRow[]` | — | label (mono uppercase) · amount (PRE-FORMATTED) · optional note · optional strong. |
| `rows[].strong` | `boolean` | — | The closing figure: stronger rule above it, 700 figures, a larger step. One per list. |

## Accessibility

- A real <dl>, so each label is announced with its own amount as one pair.
- Amounts are tabular (A4) and pre-formatted by the caller, because C9 puts number formatting at the localization layer.
- Nothing is aria-hidden: every mark on screen is also information.
- It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).

## Don't

- Never computes a sum — a component that adds up its own inputs can disagree with the document of record.
- Never a currency symbol the caller did not supply, and never a minus sign the component invented.
- Never inside a table; that is B7 totals, keyed to the table's own columns.
- Never more rows than a reader can check by eye — a dozen charges is a DataTable of charges.
- Never two closing figures: a set with two has not closed.

## FAQ

**SumList or DataTable totals?**

Does the amount belong to one of the table's columns? A line total does, and is a <tfoot> row. Shipping, tax and a discount belong to the document and have no column, so they are a SumList outside the table.

**Why must I format the amounts?**

C9 puts number and currency formatting at the localization layer. A component that formats has picked a locale and a currency for you, and it will be the wrong one somewhere.
