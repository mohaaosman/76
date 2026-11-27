# CrossTable · 76° UI (B60)

The matrix in figures — one measure at every intersection of two dimensions.

**One job:** State ONE measure at every intersection of two dimensions.
**Category:** widgets · **Exports:** CrossTable, CrossAxisItem, CrossTableProps · **Tags:** crosstab, matrix, pivot, two dimensions, region, quarter, totals, table

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/cross-table.json
```

Manual: copy components/seventy-six/cross-table.tsx, components/seventy-six/cross-table.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

B7 **DataTable** states records: each row a thing, each column a different attribute of it. A crosstab is neither — every cell is the **same** measure and both axes are dimensions. So both get real headers: `<th scope="col">` for one dimension, `<th scope="row">` for the other, and a corner cell that names both and the measure: `REGION × QUARTER · REVENUE ($K)`. A second measure is a second table.

**The heatmap stays refused.** CrossTable states the matrix in figures. A colour scale is six colours on one surface, it fails C5 the moment it carries meaning, and a reader cannot rank twenty shaded cells anyway. The one emphasis is `highlight`: a single cell in bold ink on the seed tint, because a reader can find one marked cell.

**It never computes (C9).** Cells, row totals, column totals and the grand total are pre-formatted strings, and the caller owes the reader that they reconcile. An intersection with no value is an em dash with an accessible "No value" — never a zero, because zero is a figure.

It scrolls horizontally inside its container and never reflows. The row-header column holds in place on `--sv-z-sticky`, so at 320px the reader still knows which row a figure belongs to.

## Examples

### Region × quarter, with totals

Row totals, column totals and the grand total all reconcile at 5,383.5. North in Q4 is the one marked cell.

```tsx
import { CrossTable } from '@/components/seventy-six';

<CrossTable
  caption="Revenue by region and quarter, FY2026, $ thousands"
  rowDimension="Region"
  colDimension="Quarter"
  measure="Revenue ($K)"
  columns={[{ key: 'q1', header: 'Q1' }, { key: 'q2', header: 'Q2' },
            { key: 'q3', header: 'Q3' }, { key: 'q4', header: 'Q4' }]}
  rows={[{ key: 'north', header: 'North' }, { key: 'south', header: 'South' },
         { key: 'east', header: 'East' }, { key: 'west', header: 'West' }]}
  cells={{
    north: { q1: '412.6', q2: '438.9', q3: '451.2', q4: '497.3' },
    /* … */
  }}
  rowTotals={{ north: '1,800.0', south: '1,209.5', east: '1,479.5', west: '894.5' }}
  colTotals={{ q1: '1,255.3', q2: '1,304.4', q3: '1,349.4', q4: '1,474.4' }}
  grandTotal="5,383.5"
  highlight={{ row: 'north', col: 'q4', note: 'largest intersection' }}
/>
```

### Empty intersections, scrolling

A carrier that does not serve a warehouse is an em dash. Six carriers in a narrow container scroll under the held warehouse column.

```tsx
<CrossTable
  caption="Shipments by warehouse and carrier, July 2026"
  rowDimension="Warehouse"
  colDimension="Carrier"
  measure="Shipments"
  columns={CARRIERS}
  rows={[{ key: 'a', code: 'WH-A', header: 'Mogadishu' }, /* … */]}
  cells={{
    a: { dhl: '1,240', maersk: '860', aramex: '412', fedex: null, ups: null, fleet: '2,075' },
    /* … */
  }}
  rowTotals={{ a: '4,587', b: '3,327', c: '2,521' }}
/>
```

## Props

### CrossTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | `string` | — | The table's caption and the scroll region's name. Visually hidden. |
| `rowDimension · colDimension · measure` | `string` | — | Printed in the corner as "ROW × COL · MEASURE". |
| `rows · columns` | `CrossAxisItem[]` | — | key · header · optional mono code (row headers). |
| `cells` | `Record<row, Record<col, string | null>>` | — | PRE-FORMATTED. Missing, null or empty renders an em dash with an accessible label. |
| `rowTotals` | `Record<row, string>` | — | A totals column, behind a stronger rule. |
| `colTotals` | `Record<col, string>` | — | A totals row in <tfoot>. |
| `grandTotal` | `string` | — | Where both totals meet. Needs rowTotals and colTotals. |
| `highlight` | `{ row, col, note? }` | — | ONE cell in bold ink on the seed tint. note is announced with the figure. |
| `totalLabel` | `string` | `'Total'` | Header of the totals column and row. |
| `noValueLabel` | `string` | `'No value'` | Announced for an empty intersection. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | id, style, data-*, aria-*, event handlers — spread onto the scroll region; ref forwards to it. className is appended. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab, then ← / → | Focuses the scroll region, then scrolls it |

- A real <table>: column dimension in <th scope="col">, row dimension in <th scope="row">, so every figure is announced with both of its coordinates.
- The scroll region is role="region", named by the caption, with tabindex 0 so a keyboard can scroll it (2.1.1).
- An empty cell is a visual em dash (aria-hidden) plus a visually hidden "No value" — silence would read as a missing cell.
- The highlight is carried by weight as well as the tint (C5); its note is spoken with the figure.
- The held row-header column uses inset-inline-start, so it holds on the correct side in RTL.

## Don't

- Never a colour scale, shaded cells or a heatmap — the matrix is stated in figures.
- Never more than one highlighted cell.
- Never two measures in one cell, or a second measure in the same table.
- Never a zero for "no value"; an absent intersection is an em dash.
- Never reflowed into cards on mobile — it scrolls, and the row header holds.
- Never component-computed totals (C9).

## FAQ

**CrossTable or DataTable?**

Are both axes dimensions, and is every cell the same measure? Then CrossTable. If the columns are different attributes of a record, it is B7.

**Can I shade the cells to show size?**

No. The heatmap is refused: a colour scale is six colours on one surface and carries meaning by colour alone. Mark the one cell that matters with highlight, and state the rest.

**What about roles × permissions?**

GrantMatrix was declined because this is its shape: a CrossTable whose cells are B11 Checkboxes, composed at the screen.
