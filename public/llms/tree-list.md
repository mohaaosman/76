# TreeList · 76° UI (B40)

The full ARIA tree, hand-rolled — depth drawn, one tab stop, no dependency.

**One job:** Move through a HIERARCHY whose depth is itself the information.
**Category:** primitives · **Exports:** TreeList · **Tags:** tree, treeview, hierarchy, nested, folders, chart of accounts

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/tree-list.json
```

Manual: copy components/seventy-six/tree-list.tsx, components/seventy-six/tree-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Nested `<ul>`/`<li>` carrying the real ARIA tree: `role="tree"` on the root, `role="treeitem"` on every `<li>`, `role="group"` on each open branch, and `aria-level`, `aria-setsize` and `aria-posinset` on every row. Depth is 18px per level set inline as a custom property, because the indent is the only thing that varies down the tree; a leaf holds the 7px chevron slot open so every label on a level starts at the same x. The selected row wears B7's language — seed-tint plus a 2px seed left rule, the only other place in the system a left rule is allowed. Nothing here is stateful: `expanded` is a `Set` the caller owns.

The boundaries are tight. B27 **Accordion** folds SECONDARY detail on one flat list, never nests and never navigates; B7 **DataTable** holds flat records that all share the same columns. A tree is neither, and it is not F3's refused data grid either — it is for a chart of accounts, a bill of materials, a folder tree, an org. The platform has no `<tree>` element, so the pattern is hand-rolled with zero dependencies: **one tab stop for the whole tree** on a roving tabindex, arrow keys walking the visible nodes depth-first. The `<li>` itself is the treeitem and there is no chevron button, because a focusable inside a treeitem breaks the pattern.

## Examples

### A chart of accounts

Controlled throughout — the caller holds the open set and the selection.

```tsx
import { useState } from 'react';
import { TreeList } from '@/components/seventy-six';

const [expanded, setExpanded] = useState(new Set(['assets']));
const [selected, setSelected] = useState<string | null>('current');

<TreeList
  label="Chart of accounts"
  expanded={expanded}
  onExpandedChange={setExpanded}
  selected={selected}
  onSelect={(id) => setSelected(id)}
  nodes={[
    {
      id: 'assets',
      label: 'Assets',
      meta: '1000',
      children: [
        { id: 'current', label: 'Current assets', meta: '1100' },
        { id: 'fixed', label: 'Fixed assets', meta: '1200' },
      ],
    },
    { id: 'liabilities', label: 'Liabilities', meta: '2000' },
  ]}
/>
```

## Props

### TreeList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | REQUIRED accessible name for the tree, e.g. "Chart of accounts". |
| `nodes` | `TreeNode[]` | — | id · label · optional mono meta · children. |
| `expanded / onExpandedChange` | `Set<string> / (next) => void` | — | Ids of the OPEN parents. Fully controlled — the tree owns no data state. |
| `selected` | `string | null` | — | The selected id, or null for "a selection exists, none made". Omit it entirely and rows carry no aria-selected. |
| `onSelect` | `(id: string, node: TreeNode) => void` | — | Fired by Enter, Space and a pointer. A pointer on a parent also toggles its branch. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↑ / ↓ | Move focus to the previous / next VISIBLE row. |
| → | Open a closed parent; on an open one, step to its first child. A leaf does nothing. |
| ← | Close an open parent; on a closed one or a leaf, move to the parent row. |
| Home / End | Jump to the first / last visible row. |
| Enter / Space | Select the focused row. |

- One tab stop for the whole tree: the roving index lands on the last focused row, else the selection, else the first row. Both fallbacks matter — collapsing a parent can take the focused node off screen.
- The focus ring is drawn on the row, not the treeitem: a treeitem owns its whole subtree, and a ring around that reads as a selection of the branch. Equal replacement, per C3.
- aria-level, aria-setsize and aria-posinset are on every row, so depth and position are announced instead of counted.
- The keys the tree owns stop at the row that handles them; treeitems nest, and without that a child's keystroke would run every ancestor's handler and move focus twice.
- The chevron is aria-hidden — aria-expanded on the treeitem carries the open state (C5).

## Don't

- No checkbox tree; bulk selection over a hierarchy needs tri-state and is a different problem.
- No inline row verbs — acting on a record is a Menu (B20) on that record's page.
- No lazy-load spinner inside a row; fetch the branch, then render it.
- No level that exists to hold a single child — a one-child level is a lie about the structure.
- No button inside a treeitem; a focusable there breaks the one-tab-stop contract.
- No tree standing in for a table — flat records sharing columns are B7.

## FAQ

**TreeList or Accordion?**

Accordion (B27) folds secondary detail on one flat list and explicitly never nests. TreeList is for depth that is itself the information.

**Why is the whole tree one tab stop?**

That is the tree pattern: tab to the widget once, arrow within it. A tab stop per row turns a 400-account ledger into 400 presses.

**Why no dependency?**

The whole of it is a roving tabindex over a depth-first list of the visible nodes, plus the ARIA a nested list already implies. A package for that is weight without information.

**Is this the data grid F3 refuses?**

No. F3 refuses column resize, pinning and grouping over flat records — that is DataTable (B7) plus a Drawer (B21). A tree carries no columns.
