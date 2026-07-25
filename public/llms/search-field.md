# SearchField · 76° UI (B36)

The in-place filter — native search, B11 chrome, one named clear, a live count.

**One job:** Filter a set that is ALREADY on screen by typing.
**Category:** forms · **Exports:** SearchField · **Tags:** search, filter, input, live region, clear, form

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/search-field.json
```

Manual: copy components/seventy-six/search-field.tsx, components/seventy-six/search-field.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

A native `<input type="search">` wearing B11 chrome — label above, optional hint, an error that says **what** and **how to fix it** — with a magnifier on the left and one clear button on the right. The right padding is reserved from the first paint, so the text does not shift when the clear appears on the first keystroke. The only native part removed is WebKit's cancel button: it is unstyleable, unlabelled, and invisible on the wall. Ours is a real button whose `aria-label` names the field it empties ("Clear search orders"), and it hands focus back to the input.

The boundary is the rule. **This is not B16 SearchCommand.** ⌘K is the keyboard front door to the whole application — a dialog, opened over the page, that takes you somewhere else. SearchField filters what you are already looking at, in place, on every keystroke: no button to press, no page to wait for, no destination. They answer different questions, and shipping one does not excuse skipping the other.

The result line is a mono `aria-live="polite"` region under the field, and it is rendered even when `resultText` is empty. A live region inserted at the same moment as its first text is routinely missed, so the region sits in the accessibility tree from the start and only its text changes. Empty, it collapses to zero height and eats the field gap, so an absent count leaves no hole.

## Examples

### Filtering a list in place

```tsx
import { useState } from 'react';
import { SearchField } from '@/components/seventy-six';

const [query, setQuery] = useState('');
const matches = orders.filter((o) => o.ref.includes(query));

<SearchField
  label="Search orders"
  placeholder="Reference, customer, or PO number"
  hint="Filters the list below as you type."
  value={query}
  onValueChange={setQuery}
  resultText={`${matches.length} of ${orders.length} match`}
/>
```

### Inside a FilterBar

labelHidden is legal here: the FilterBar already names the set on screen (B7).

```tsx
<FilterBar
  label="Order filters"
  active={query !== ''}
  onClearAll={() => setQuery('')}
  controls={
    <SearchField
      label="Search orders"
      labelHidden
      placeholder="Search orders"
      value={query}
      onValueChange={setQuery}
    />
  }
/>
// No resultText here — the FilterLine below the bar announces the change.
```

## Props

### SearchField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Names the set being filtered: "Search orders", not "Search". Also names the clear button. |
| `value` | `string` | — | Controlled value. |
| `onValueChange` | `(value: string) => void` | — | Fires on every keystroke, and with an empty string on clear and on Esc. |
| `placeholder` | `string` | `'Search'` | States the scope. Never the label — it vanishes on the first keystroke. |
| `labelHidden` | `boolean` | — | Registered exception. Hides the label visually, legal only where a CardHead or a FilterBar already names the set. |
| `hint` | `string` | — | One line under the label stating what the field filters. |
| `resultText` | `string` | — | Mono count under the field, announced politely: "12 OF 248 MATCH". The caller counts; the field states. |
| `error` | `string` | — | What went wrong AND how to fix it. Wires aria-invalid + describedby. |

## Accessibility

| Keys | Action |
| --- | --- |
| Esc | Clears the filter and keeps focus in the input. On an already empty field it does nothing, so Esc still reaches an enclosing Dialog or Popover. |
| Tab | The input, then the clear button — which exists only while there is something to clear. |

- `type="search"` keeps the platform semantics and the search-shaped touch keyboard; only WebKit's cancel button is suppressed, and a named button replaces it.
- The clear button carries an aria-label naming its field ("Clear search orders") — never a bare "×" (A4) — and returns focus to the input it emptied.
- The result line owns its own `aria-live="polite"` region and is deliberately left out of aria-describedby: naming it there would read the count again on every focus.
- That region is rendered empty rather than removed. `display: none` would drop it out of the accessibility tree and lose the first announcement.
- labelHidden moves the label into `sv-visually-hidden`: it is still the accessible name, still in the tree, and the placeholder is still not the label (B11).
- Errors are wired through aria-describedby with aria-invalid="true", stated below the field (B11).

## Don't

- No placeholder standing in for the label — the placeholder is never a label (B11).
- No labelHidden without a CardHead or a FilterBar naming the set on screen; it is a registered exception, not a shortcut.
- No bare "Search" as the label; name the set being filtered (A4).
- No submit button and no Enter-to-search — a filter that needs a round trip and a wait is a form, not this.
- No resultText on a SearchField that sits in a FilterBar beside a FilterLine; two live regions for one change is a defect (B7).
- No SearchField as the app's only search. Filtering a table is not navigating the product (B16).

## FAQ

**SearchField or SearchCommand (B16)?**

Ask what the typing does. Narrows a set that is already rendered: SearchField. Crosses the app and lands you somewhere else: SearchCommand. A product that filters well and cannot be navigated from the keyboard is still missing B16.

**Where is the debounce?**

In your query layer, not here. The field fires onValueChange on every keystroke because its job is filtering what is already loaded; deferring a network call is the caller's decision, and a component that guesses the delay is wrong for half its uses.

**Why is the count a separate line instead of text in the field?**

The count is an announcement, not part of the value. It lives in a live region so it is read when it changes, and stays out of the input so typing never has to compete with it.
