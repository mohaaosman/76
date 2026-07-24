# DataTable · 76° UI (B7)

The ERP workhorse: mono headers, mono IDs, dot+word statuses, right-aligned tabular numbers, full keyboard contract.

**One job:** Answer "what exactly happened."
**Category:** widgets · **Exports:** DataTable · **Tags:** table, data-grid, keyboard-navigation, sorting, selection, pagination, erp

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/data-table.json
```

Manual: copy components/seventy-six/data-table.tsx, components/seventy-six/data-table.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Column headers are Fragment Mono 9.5 uppercase; cells are 13/500 with 10.5px vertical padding; IDs render in mono soft; numeric columns are right-aligned, tabular, 600. Rows hover in seed-tint; a selected row adds the system's only 2px left rule. The last row is unruled.

Column `kind` does the type discipline for you: `id` gets mono, `num` gets right/tabular, `status` expects a StatusWord. Sorting is the caller's job — the table renders `aria-sort` and header buttons, your code reorders the rows.

On narrow screens the table scrolls horizontally inside its card. It never reflows into stacked blobs, and the header row never disappears.

## Examples

### Orders table with selection and keyboard nav

Click a row, then drive it entirely from the keyboard: ↑/↓ to move, Space to select, ⇧↓ to range-select, Enter to open.

```tsx
import { DataTable, StatusWord } from '@/components/seventy-six';

<DataTable
  caption="Open orders"
  rows={orders}
  rowKey={(o) => o.id}
  selectable
  selected={selected}
  onSelect={setSelected}
  onRowOpen={(o) => navigate(`/orders/${o.id}`)}
  announcement={`${orders.length} orders · Pending filter`}
  columns={[
    { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
    { key: 'customer', header: 'CUSTOMER', render: (o) => o.customer },
    { key: 'status', header: 'STATUS', kind: 'status',
      render: (o) => <StatusWord tone={o.tone}>{o.status}</StatusWord> },
    { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
  ]}
  page={{ from: 1, to: 5, of: 248, onNext: nextPage }}
/>
```

## Props

### DataTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | `string` | — | Visually-hidden <code>&lt;caption&gt;</code> naming the table for screen readers. |
| `columns` | `Column<Row>[]` | — | { key, header, kind?, sortable?, sorted?, onSort?, render }. |
| `rows / rowKey` | `Row[] / (row) => string` | — | Data and its stable key. |
| `onRowOpen` | `(row) => void` | — | Enter or double-click opens the row. |
| `selectable / selected / onSelect` | `boolean / Set<string> / (keys) => void` | — | Controlled selection; Space toggles, ⇧ extends. |
| `announcement` | `string` | — | aria-live polite text on data/filter changes ("12 orders · Pending"). |
| `page` | `{ from, to, of, onPrev?, onNext? }` | — | Mono "1–50 OF 248" + ghost prev/next. No numbered pill walk. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↑ / ↓ | Move row focus (roving tabindex). |
| Enter | Open the focused row. |
| Space | Toggle selection on the focused row. |
| ⇧ + ↑/↓ · ⇧Space | Range-select from the anchor row. |
| Home / End | Jump to first / last row. |

- Headers are `&lt;th scope="col"&gt;`; sortable headers are real buttons inside the th carrying `aria-sort`.
- Row count and filter state announce via a polite live region on change.
- The focused row shows the hover visual plus the focus ring — same information, keyboard or mouse.

## Don't

- No mobile "card-ification" — tables scroll horizontally, headers stay.
- No zebra striping; hairlines separate rows.
- No numbered pagination pill walks; range + prev/next only.
- No left rules except the 2px seed rule on selected rows.
- No relative timestamps in ERP contexts — absolute, in mono.

## FAQ

**How do I make a column sortable?**

Set sortable, render your current order into sorted ("ascending" | "descending"), and reorder rows in onSort. The table is deliberately headless about sort logic.

**How does selection work?**

Controlled: pass selectable, a Set of keys in selected, and onSelect. Space toggles, ⇧ extends from the last anchor, and the selected row gets seed-tint plus the 2px left rule.

**Where do filter tabs go?**

A CardTabs row (mode="filters") between the CardHead and the table — the Bissaa pattern. Update announcement when the filter changes.

**What about virtualization for 10,000 rows?**

Paginate at 50 (the Book's pager pattern) and keep the DOM small. If a screen truly needs infinite scroll, that is a new widget type to register — not a silent fork of this one.
