# TreeTable · 76° UI (B59)

The rolled-up table — a hierarchy whose every parent is the sum of its children, on B7's columns.

**One job:** State a hierarchy of rows in which every parent is the sum of its children, across the same numeric columns at every depth.
**Category:** widgets · **Exports:** TreeTable, TreeTableColumn, TreeTableNode, TreeTableTotal, TreeTableProps · **Tags:** tree, treegrid, hierarchy, trial balance, chart of accounts, rollup, budget, cost centre, table

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/tree-table.json
```

Manual: copy components/seventy-six/tree-table.tsx, components/seventy-six/tree-table.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

B40 **TreeList** moves through a hierarchy and carries one mono figure per node. B7 **DataTable** states flat records across columns. A trial balance is both at once — depth and columns — so it gets its own part: B40's keyboard model, indent and chevron verbatim, in B7's voice of mono headers and right-aligned tabular figures.

**It is not F3.** F3 refuses the data grid because the reader rearranges its shape: grouping at runtime, pinned and resized columns. Nothing here groups at runtime. A trial balance's depth **is** the chart of accounts — structure B40 already accepted as legitimate — set by the data and never by the reader. There is no resize, no pin, no regroup and no column chooser, and there never will be.

**It never computes (C9).** Every cell is a pre-formatted string, the parent's included. A component that adds up its own children can disagree with the ledger, and the ledger is the document of record. The caller states the parent's figures and owes the reader that they reconcile — which is the whole promise of the component: a reader can open any parent and check it by eye.

It is a real `<table role="treegrid">` with one tab stop. Parent rows are bold, because a parent is its own total. The closing figures sit in a `<tfoot>` outside the tree, exactly as B7's `totals`: never focused, never part of the hierarchy.

## Examples

### A balance sheet

Two roots, two levels, net assets in the foot. Every parent equals its children in every column, and closing = opening + movement on every row.

```tsx
import { TreeTable } from '@/components/seventy-six';

<TreeTable
  label="Balance sheet, July 2026, USD"
  labelHeader="Account"
  columns={[
    { key: 'open', header: 'Opening' },
    { key: 'move', header: 'Movement' },
    { key: 'close', header: 'Closing' },
  ]}
  nodes={[
    {
      id: '1000', code: '1000', label: 'Assets',
      cells: { open: '1,890,350.00', move: '32,745.00', close: '1,923,095.00' },
      children: [
        {
          id: '1100', code: '1100', label: 'Current assets',
          cells: { open: '765,550.00', move: '45,615.00', close: '811,165.00' },
          children: [
            { id: '1110', code: '1110', label: 'Cash at bank',
              cells: { open: '184,200.00', move: '22,640.00', close: '206,840.00' } },
            /* … */
          ],
        },
        /* … */
      ],
    },
    /* … Liabilities */
  ]}
  defaultExpanded={['1000', '1100']}
  totals={[{ label: 'Net assets', strong: true,
    cells: { open: '885,700.00', move: '51,490.00', close: '937,190.00' } }]}
/>
```

### Controlled, with a row verb

The screen owns the open set, so "Expand all" is one setState. Enter or double-click opens the row's own page.

```tsx
const [expanded, setExpanded] = useState(new Set(['6000']));

<Button variant="ghost" onClick={() => setExpanded(new Set(ALL_PARENTS))}>
  Expand all accounts
</Button>
<TreeTable
  label="Operating expenses against budget, Q3 2026, USD"
  labelHeader="Cost centre"
  columns={[
    { key: 'budget', header: 'Budget' },
    { key: 'actual', header: 'Actual' },
    { key: 'left', header: 'Remaining' },
  ]}
  nodes={BUDGET}
  expanded={expanded}
  onExpandedChange={setExpanded}
  onRowOpen={(node) => navigate(`/accounts/${node.id}`)}
/>
```

## Props

### TreeTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible name for the treegrid, e.g. "Balance sheet, July 2026, USD". |
| `labelHeader` | `string` | — | Header of the hierarchy column, e.g. "Account". Mono uppercase. |
| `columns` | `TreeTableColumn[]` | — | key · header · kind ("num" default, or "text"). The SAME columns at every depth. |
| `nodes` | `TreeTableNode[]` | — | id · label · optional mono code · cells (PRE-FORMATTED, keyed by column) · optional children. |
| `expanded` | `Set<string>` | — | Open parents. Pass it to control the tree; omit it and the table owns the set. |
| `defaultExpanded` | `Iterable<string>` | — | Initial open parents when uncontrolled. |
| `onExpandedChange` | `(next: Set<string>) => void` | — | Called on every open and close, controlled or not. |
| `onRowOpen` | `(node) => void` | — | Enter or double-click on a row. Without it, Enter toggles a parent. |
| `totals` | `TreeTableTotal[]` | — | label · cells (PRE-FORMATTED) · strong. A real <tfoot>, outside the tree. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | id, style, data-*, aria-*, event handlers — spread onto the root; ref forwards to it. className is appended. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Enters the treegrid at the last focused row (one tab stop) |
| ↑ / ↓ | Previous / next visible row |
| → (← in RTL) | Opens a closed parent; on an open parent, moves to its first child |
| ← (→ in RTL) | Closes an open parent; otherwise moves to the parent |
| Home / End | First / last visible row |
| Enter | onRowOpen, or toggles a parent when no row verb is given |

- A real <table role="treegrid">: every row carries aria-level, aria-setsize, aria-posinset, and parents aria-expanded.
- The label cell is <th scope="row">, so each figure is announced with the account it belongs to and the column it sits in.
- The chevron is a real button with tabindex -1 and the localized "Expand" / "Collapse" name — a 24px pointer target that never takes a tab stop from the row.
- Arrow keys are logical: useDirection() mirrors ← and → in an RTL subtree, and the chevron turns to the inline end.
- Figures are tabular and pre-formatted by the caller (C9). Parent weight is supplementary; aria-level carries the structure.
- Full-bleed like B7 — hairline rows to the card edge, cells inset 18px.

## Don't

- Never a column that means something different at another depth — that is two tables.
- Never a parent whose figures do not equal its children's. If an unposted adjustment explains the gap, it is a child row named as one.
- Never runtime grouping, resizing, pinning or a column chooser — F3 stands.
- Never a one-child level; it is a lie about the structure (B40).
- Never inline row verbs or checkboxes — act on a record from its own page.
- Never a component-computed total. The caller supplies every figure (C9).

## FAQ

**TreeTable or TreeList?**

Does every node carry the same columns of figures? Then TreeTable. A hierarchy you move through, with at most one mono figure per node, is B40 TreeList.

**TreeTable or DataTable?**

If the rows have no parent, they are records and belong in B7. TreeTable is only for a hierarchy whose parents ARE the sum of their children.

**Why will it not add up the children for me?**

Because the ledger is the document of record. A component that sums its inputs can round differently, or miss an adjustment, and then the screen disagrees with the books.

**Is this not the data grid F3 refuses?**

No. F3 refuses a table whose shape the reader rearranges at runtime. Here the depth is the chart of accounts, fixed by the data, and nothing about the shape is configurable.
