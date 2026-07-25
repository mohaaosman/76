# Combobox · 76° UI (B19)

The searchable select — ARIA 1.2 combobox pattern, hand-rolled, zero dependencies.

**One job:** Pick one value — or a set of them — from a list too long to scan.
**Category:** forms · **Exports:** Combobox · **Tags:** combobox, searchable-select, multi-select, autocomplete, typeahead, listbox, filter

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/combobox.json
```

Manual: copy components/seventy-six/combobox.tsx, components/seventy-six/combobox.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

Native `<select>` (B11) stays the default for short, known lists. The Combobox exists for the moment the list grows past roughly ten options, or the user knows the value's **name** faster than its position: customers, SKUs, warehouses, assignees. Typing filters; arrows walk the matches; Enter commits; Escape closes, then clears.

It follows the ARIA 1.2 combobox pattern with `aria-activedescendant` — focus never leaves the input, so the screen-reader experience matches the visual one. Options can carry mono `meta` (an ID, a count) that is searched along with the label.

The listbox is a child of the field and must not sit inside an `overflow` container (Firewall E) — lift the field out, or put the picker in a Dialog.

**The v0.4.0 amendment: multi-select.** The original spec refused it outright, which was a refusal of the usual implementation rather than of the job. Pass `multiple` and `value` becomes a `string[]`: Enter and click toggle the active option and **leave the list open**, the query survives the toggle so three matches of one search are taken without retyping it, and Backspace on an empty query drops the value taken last. The two modes are a discriminated union, so they cannot be mixed by accident and every existing single-select call site is untouched.

What is refused is the chip wall. A multi-selection is **stated, never worn**: one mono line of running text under the field, in the B7 `FilterLine` voice, naming at most three values and counting the rest, ending in a single Clear. A2 bans pills, B23 keeps Badge category-only and non-dismissible, and a growing row of chips reflows the form on every pick while a one-line statement holds its ground. That line is also the only live region in the component.

## Examples

### Searchable customer picker

```tsx
import { useState } from 'react';
import { Combobox } from '@/components/seventy-six';

const customers = [
  { value: 'c-101', label: 'Almeida Logistics', meta: 'C-101' },
  { value: 'c-114', label: 'Bantam Freight',    meta: 'C-114' },
  { value: 'c-127', label: 'Corridor Foods',    meta: 'C-127' },
  // …400 more
];

const [customer, setCustomer] = useState<string | null>(null);

<Combobox
  label="Customer"
  options={customers}
  value={customer}
  onChange={(v) => setCustomer(v)}
  placeholder="Type a name or ID"
  hint="Search across 400 accounts by name or C-number."
/>
```

### Validation follows B11

Error on blur, stated with a fix; the empty state names what did not match.

```tsx
<Combobox
  label="Assignee"
  required
  options={people}
  value={assignee}
  onChange={setAssignee}
  error="Pick an assignee — orders cannot dispatch unassigned."
  emptyText="No one matches. Check the spelling or invite them from Settings → Team."
/>
```

### Multi-select, stated as one line

The list stays open while you pick, the query survives each toggle, and the selection states itself in the FilterLine voice underneath. No chips, and nothing reflows.

```tsx
const [picked, setPicked] = useState<string[]>(['c-127', 'c-152']);

<Combobox
  multiple
  noun="account"
  label="Accounts in this report"
  options={customers}
  value={picked}
  onChange={(values) => setPicked(values)}
  placeholder="Type a name or C-number"
  hint="Pick as many as the report covers — the list stays open."
/>

// The line under the field reads:
// 2 ACCOUNTS · Corridor Foods · Fairline Imports        Clear
```

## Props

### Combobox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label above the input — never replaced by the placeholder (B11). |
| `options` | `ComboOption[]` | — | { value, label, meta?, disabled? }. meta renders mono, right-aligned, and is searched. |
| `multiple` | `boolean` | — | Switches the props to the multi union: value becomes string[] and onChange receives (values, options). |
| `value` | `string | null | string[]` | — | Controlled selection. string | null in single mode, string[] in pick order when multiple. |
| `onChange` | `(value, option) => void` | — | Single: fires on commit and on clear (null). Multi: fires on every toggle with the full array. |
| `noun` | `string` | `'selected'` | Multi only. The singular noun the selection line counts: "account" reads "3 ACCOUNTS". |
| `error / hint / required` | `string / string / boolean` | — | B11 field chrome; error sets aria-invalid + describedby. |
| `emptyText` | `string` | `'No matching options.'` | No-match copy — state what, like every 76° empty state. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↓ / ↑ | Open the list / move the active option. |
| Home / End | First / last match. |
| Enter | Single: commit the active option and close. Multi: toggle it and stay open. |
| Backspace | Multi only, on an empty query: drops the value taken last. |
| Esc | Close the list; pressed again on a closed field, clear the selection. |
| Tab | Close and move on — never traps. |

- ARIA 1.2 pattern: `role="combobox"` input, `aria-expanded`, `aria-controls`, and `aria-activedescendant` pointing at the active `role="option"`.
- Focus stays in the input the whole time; the active option is conveyed, not focused.
- The selected option carries `aria-selected` and a seed tick.
- In multi mode the listbox adds `aria-multiselectable="true"`, and the selection line is `aria-live="polite"` — one announcement per toggle, and no second live region anywhere in the component.

## Don't

- No Combobox for lists a native Select scans in one glance (≤ ~10 options).
- No chips for a multi-selection — the line states it, and a dismissible chip is a control row pretending to be state (A2, B23).
- No listbox inside an overflow container; portal the field out or use a Dialog.
- No free-text values — the Combobox picks from the list; a creatable input is a Field.

## FAQ

**Select or Combobox?**

Count the options. If the user scans, Select. If the user searches, Combobox. Both wear identical B11 field chrome, so swapping later costs nothing.

**Async options?**

Filter locally up to a few thousand rows — it is faster than any spinner. Past that, debounce the query upstream and pass the fetched page as options.

**Why did multi-select take until v0.4.0?**

Because the refusal in v0.2.0 was aimed at the chip wall every implementation ships with, and the replacement — a stated mono line — did not exist until B7 shipped FilterLine. The pattern had to be invented before the feature could be allowed.

**Multi-select or a column of checkboxes?**

Count again. Under about ten options a checkbox group shows every choice at once and costs no interaction model. The multi Combobox is for the set you have to search for.
