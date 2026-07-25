# Combobox · 76° UI (B19)

The searchable select — ARIA 1.2 combobox pattern, hand-rolled, zero dependencies.

**One job:** Pick ONE value from a list too long to scan.
**Category:** forms · **Exports:** Combobox · **Tags:** combobox, searchable-select, autocomplete, typeahead, listbox, filter

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

## Props

### Combobox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label above the input — never replaced by the placeholder (B11). |
| `options` | `ComboOption[]` | — | { value, label, meta?, disabled? }. meta renders mono, right-aligned, and is searched. |
| `value` | `string | null` | — | Controlled selected value. |
| `onChange` | `(value, option) => void` | — | Fires on commit and on clear (null). |
| `error / hint / required` | `string / string / boolean` | — | B11 field chrome; error sets aria-invalid + describedby. |
| `emptyText` | `string` | `'No matching options.'` | No-match copy — state what, like every 76° empty state. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↓ / ↑ | Open the list / move the active option. |
| Home / End | First / last match. |
| Enter | Commit the active option. |
| Esc | Close the list; pressed again on a closed field, clear the selection. |
| Tab | Close and move on — never traps. |

- ARIA 1.2 pattern: `role="combobox"` input, `aria-expanded`, `aria-controls`, and `aria-activedescendant` pointing at the active `role="option"`.
- Focus stays in the input the whole time; the active option is conveyed, not focused.
- The selected option carries `aria-selected` and a seed tick.

## Don't

- No Combobox for lists a native Select scans in one glance (≤ ~10 options).
- No multi-select — that is a different job and a future component.
- No listbox inside an overflow container; portal the field out or use a Dialog.
- No free-text values — the Combobox picks from the list; a creatable input is a Field.

## FAQ

**Select or Combobox?**

Count the options. If the user scans, Select. If the user searches, Combobox. Both wear identical B11 field chrome, so swapping later costs nothing.

**Async options?**

Filter locally up to a few thousand rows — it is faster than any spinner. Past that, debounce the query upstream and pass the fetched page as options.
