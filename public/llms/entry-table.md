# EntryTable · 76° UI (B53)

The typist table — one bounded number per line, posted once.

**One job:** Type one bounded number into every row of a fixed list of lines, and post the lot once.
**Category:** widgets · **Exports:** EntryTable, EntryColumn, EntryTotalsRow, EntrySync, EntryTableProps · **Tags:** entry, receipt, goods receipt, count, stock take, quantity, post, ledger, keyboard, erp

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/entry-table.json
```

Manual: copy components/seventy-six/entry-table.tsx, components/seventy-six/entry-table.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button, field.

## Overview

**It is B7 DataTable's writing sibling, and the keyboard is the whole difference.** B7 is a reader: Enter opens a row and Space selects it. Here Enter and ↓ move the caret to the next line's input and ↑ to the previous one, because a clerk receiving forty lines types a figure and presses Enter forty times. It speaks B7's voice on purpose — mono headers, mono ids, tabular figures at the inline end — so a receipt reads like the purchase order it came from.

**Enter never posts.** Past the last line Enter lands on the one primary button in the foot, labelled with the count it will carry ("Post 5 lines"), and posting is one deliberate press of its own. A line out of bounds is never posted: the button states every error and puts the caret on the first one.

**The list is fixed, and it bounds without formatting.** Rows are the caller's lines; the table adds none, sorts none and pages none. The figure stays the string the reader typed (C9) — the component only reads it as a number to check `bounds(row)`, and the sentence stating the bound is the caller's, in the caller's locale.

Each line can state its save state — `unsaved`, `saving`, `failed` — as a mono word and a 6px dot beside the input, from the catalog's `rowUnsaved`, `rowSaving` and `rowFailed`. Row padding and the input follow the density posture, so `data-density="compact"` serves the analyst and `"touch"` the dock.

## Examples

### Goods receipt

Five lines of PO-2291. Type a figure, press Enter, and the caret moves down; out-of-bounds figures are stated on blur. The totals row is the caller's sum.

```tsx
import { EntryTable } from '@/components/seventy-six';

<EntryTable
  caption="Goods receipt for PO-2291, Harbor & Co"
  columns={[
    { key: 'sku', header: 'SKU', kind: 'id', render: (l) => l.sku },
    { key: 'item', header: 'ITEM', render: (l) => l.item },
    { key: 'ordered', header: 'ORDERED', kind: 'num', render: (l) => String(l.ordered) },
    { key: 'received', header: 'RECEIVED', kind: 'entry' },
  ]}
  rows={lines}
  rowKey={(l) => l.sku}
  values={values}
  onValueChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
  bounds={(l) => ({ min: 0, max: l.ordered, step: 1 })}
  boundsError={(l) => `Enter 0 to ${l.ordered} — PO-2291 ordered ${l.ordered}.`}
  inputLabel={(l) => `Received, ${l.sku}`}
  sync={sync}
  totals={[{ label: 'TOTAL UNITS', cells: { ordered: '128', received }, strong: true }]}
  summary="3 of 5 lines counted"
  onPost={post}
  posting={posting}
  postingLabel="Posting…"
/>
```

### Save states and server errors, compact

One line waiting to save, one saving, one rejected by the server with the fix, one over its bound — under the compact density posture.

```tsx
<div data-density="compact">
  <EntryTable
    {...receipt}
    sync={{ 'SKU-4472': 'unsaved', 'SKU-3108': 'saving', 'SKU-5520': 'failed' }}
    errors={{
      'SKU-5520': 'Bin B-14 is full. Choose another bin for SKU-5520, then post again.',
    }}
  />
</div>
```

## Props

### EntryTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | `string` | — | Visually hidden table caption naming the document: "Goods receipt for PO-2291". |
| `columns` | `EntryColumn<Row>[]` | — | B7-shaped columns: key · header · kind (text | id | num | entry) · render. Exactly one column is kind "entry"; its render is ignored. |
| `rows / rowKey` | `Row[] · (row) => string` | — | The fixed list of lines and their stable keys. |
| `values` | `Record<string, string>` | — | Controlled raw strings exactly as typed, keyed by rowKey. "" means not entered. |
| `onValueChange` | `(key, value) => void` | — | Every keystroke, as the raw string. |
| `bounds` | `(row) => { min, max, step? }` | — | Inclusive bounds per line. Out-of-bounds or non-numeric values are errors. |
| `boundsError` | `(row) => string` | — | The caller's sentence for an out-of-bounds line — what and how to fix. |
| `inputLabel` | `(row) => string` | — | Accessible name of each line's input: "Received, SKU-4471". |
| `errors` | `Record<string, string>` | — | Errors the caller knows (a server rejection). Shown at once; win over the bounds sentence. |
| `sync` | `Record<string, 'unsaved' | 'saving' | 'failed'>` | — | Per-line save state, stated as mono word + dot. Absent means saved. |
| `totals` | `EntryTotalsRow[]` | — | Closing figures in a real <tfoot>, keyed by column. PRE-FORMATTED; the component never sums. |
| `changedCount` | `number` | `non-empty values` | The count the post button names. |
| `onPost` | `() => void` | — | Called by the post button only — never by Enter, never with a line out of bounds. |
| `posting` | `boolean` | `false` | Button shows postingLabel with a spinner; inputs go read-only, keeping the caret. |
| `postingLabel` | `string` | `t.working` | The button label while posting: "Posting…". |
| `summary` | `ReactNode` | — | One soft sentence beside the button: "3 of 5 lines counted". |
| `disabled` | `boolean` | `false` | The whole receipt is closed: inputs and post disabled. |
| `…rest / ref` | `HTMLAttributes<HTMLDivElement>` | — | Spread onto the root. ref is a plain prop (React 19) because the component is generic. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter / ↓ | Move to the next line's input (its figure is selected for overtyping). On the last line, Enter moves to the post button. |
| ↑ | Move to the previous line's input. |
| Tab / ⇧Tab | Leave the table in document order. |
| Enter / Space on the button | Post the lot, or state every error and focus the first. |

- A real <table> with <th scope="col"> headers and a hidden <caption>; totals are a <tfoot> with <th scope="row"> labels, outside the line model.
- ↑/↓ are taken from the native number input on purpose: in a typist table the figure changes only when the reader types it.
- Each input has its own accessible name from inputLabel; an error sets aria-invalid and is joined to the input by aria-describedby, as is the save state.
- Save states are words from the catalog, never colour alone; only "failed" is red, and only the word and its dot.
- Bounds errors follow B11 timing: on blur, then on every keystroke once shown.
- Lifecycle: render Skeleton rows while lines load, an EmptyState when a document has no lines, and a Banner for a document that failed to load — the table itself is the loaded state.

## Don't

- Never Enter-to-post — posting is one deliberate press of the one button.
- Never an editable column that is not a number; a row of text inputs is a form (B11).
- Never two entry columns in one table — that is two passes, or a form per line.
- Never a total the component derived; pass totals pre-formatted.
- Never adds, removes, sorts, filters or pages lines while entry is open.
- Never a save state as colour alone.

## FAQ

**EntryTable or DataTable?**

Does the reader type into the rows? If they read, open and select, it is B7. If they type a figure into every line and post, it is B53.

**Why does Enter not submit?**

A typist presses Enter after every figure. If Enter posted, the first line would post the receipt. Enter moves down; the post is its own keystroke.

**Why must I write the bounds sentence?**

The bound is a number, and C9 keeps number formatting at the caller. "Enter 0 to 1 200" and "Enter 0 to 1,200" are both right somewhere.

**Can it sit directly in a Card?**

Yes — like B7 it draws its rows to the card's edge, with the 18px inset on its cells.
