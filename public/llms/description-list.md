# DescriptionList · 76° UI (B28)

The record readout — mono terms, informative values, on hairlines.

**One job:** State a set of labelled facts about ONE record.
**Category:** primitives · **Exports:** DescriptionList · **Tags:** description list, dl, record, detail, key value, metadata

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/description-list.json
```

Manual: copy components/seventy-six/description-list.tsx, components/seventy-six/description-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A real `<dl>`. Terms speak the same mono uppercase as a table header, values carry the information at 13/500, and each pair sits on a hairline. It is what a Drawer (B21) shows when you open a row, and what a detail page shows above its tables.

The line between this and a DataTable is the count of records: a table compares MANY rows on the same columns; a description list states many facts about ONE. Values take the table's own conventions — `kind="id"` goes mono, `kind="num"` goes tabular and right-aligned.

## Examples

### Order record

```tsx
import { DescriptionList } from '@/components/seventy-six';

<DescriptionList
  rows={[
    { term: 'ORDER', kind: 'id', children: 'ORD-10482' },
    { term: 'CUSTOMER', children: 'Halcyon Freight' },
    { term: 'STATUS', children: <StatusWord tone="ok">Fulfilled</StatusWord> },
    { term: 'TOTAL', kind: 'num', children: '$18,240.00' },
  ]}
/>
```

## Props

### DescriptionList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `DescriptionRow[]` | — | term · children · optional kind (text | id | num). |
| `layout` | `'columns' | 'stacked'` | `'columns'` | stacked puts the value under its term; below 520px columns stack on their own (C7). |

## Accessibility

- Real <dl>/<dt>/<dd> markup — screen readers announce the term with its value as one pair.
- Numeric values carry tabular figures (A4); ID values stay mono like their table cells.
- Below 520px the pairs stack rather than crush the value into a two-character gutter (C7).

## Don't

- No description list comparing two records side by side — that is a table.
- No interactive controls inside a value; a record that can be edited opens a Drawer with a form.
- No sentence-case terms — labels in 76° are mono uppercase, everywhere.
- No empty rows: a fact with no value is omitted, or stated as "None recorded".

## FAQ

**DescriptionList or DataTable?**

One record: DescriptionList. Many records on shared columns: DataTable (B7).

**Can a value hold a StatusWord or a Badge?**

Yes — values are ReactNode. Status stays a StatusWord (B12), category stays a Badge (B23).
