# SearchCommand · 76° UI (B16)

The ⌘K palette every 76° app ships — dialog anatomy, mono input, grouped results.

**One job:** Be the keyboard front door to everything.
**Category:** primitives · **Exports:** SearchCommand, useSearchCommand · **Tags:** command-palette, search, cmd-k, keyboard, combobox, dialog

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/search-command.json
```

Manual: copy components/seventy-six/search-command.tsx, components/seventy-six/search-command.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Every 76° app ships ⌘K — it is the keyboard front door (C4). The palette reuses Dialog anatomy on native `<dialog>`: a mono input, results grouped under mono labels, arrow keys + Enter, Esc to leave.

Feed it a flat list of `CommandItem`s (id, group, label, optional mono hint and keywords); it filters client-side and calls `onPick`. For server-backed search, debounce upstream and swap the items prop.

## Examples

### Wiring the palette

```tsx
import { SearchCommand, useSearchCommand, Button } from '@/components/seventy-six';

const search = useSearchCommand(); // ⌘K binds automatically

<Button variant="ghost" onClick={search.show}>Search (⌘K)</Button>
<SearchCommand
  open={search.open}
  onClose={search.hide}
  placeholder="SEARCH ORDERS, PRODUCTS, PAGES…"
  items={[
    { id: 'ord-10482', group: 'ORDERS', label: 'ORD-10482 · Nasra Ali', hint: '$482.19' },
    { id: 'ord-10476', group: 'ORDERS', label: 'ORD-10476 · Bloom Retail', hint: '$1,204.00' },
    { id: 'page-inventory', group: 'PAGES', label: 'Inventory', hint: 'G then I' },
  ]}
  onPick={(item) => navigate(item.id)}
/>
```

## Props

### SearchCommand

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open / onClose` | `boolean / () => void` | — | Controlled visibility; pair with useSearchCommand(). |
| `items` | `CommandItem[]` | — | { id, group, label, hint?, keywords? } — groups render as mono labels. |
| `onPick` | `(item) => void` | — | Called on Enter or click; the palette closes itself. |
| `placeholder` | `string` | `'Search…'` | Mono placeholder; also the input's aria-label. |
| `onOpen` | `() => void` | — | Called when ⌘K opens the palette — pass the same setter that drives <code>open</code>, or the shortcut and the state desync. |
| `bindShortcut` | `boolean` | `true` | Binds ⌘K / Ctrl-K globally while mounted. |

## Accessibility

| Keys | Action |
| --- | --- |
| ⌘K / Ctrl-K | Opens (or closes) the palette from anywhere. |
| ↑ / ↓ | Moves the active option; wraps are deliberate non-features. |
| Enter | Picks the active option. |
| Esc | Closes and returns focus to the invoker. |

- The input is a `role="combobox"` with `aria-activedescendant` pointing at the active `role="option"` — the screen-reader combobox pattern, on a native dialog.
- Results live in a labeled listbox; group labels are presentational.

## Don't

- No fuzzy-match theatrics with highlighted letter fragments — plain substring match, plain results.
- No recent-searches clutter in v1; the palette is a router, not a feed.
- No hijacking ⌘K when a second palette is mounted — one front door per app.

## FAQ

**How do I open it programmatically?**

useSearchCommand() returns { open, show, hide }; call show() from your search button and pass open/hide to the component.

**Does it search the server?**

The component filters the items you pass. For server search, treat items as the current result set and refresh it as the user types upstream.

**What goes in hint?**

A mono fragment on the right edge: an ID, an amount, a shortcut. Metadata voice, per Law 4.
