# EmptyState · 76° UI (B15)

One soft sentence + one primary action. No illustration, no humor, max two lines.

**One job:** Say what would appear here, why it is empty, and the one way forward.
**Category:** primitives · **Exports:** EmptyState · **Tags:** empty-state, zero-data, first-run, call-to-action

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/empty-state.json
```

Manual: copy components/seventy-six/empty-state.tsx, components/seventy-six/empty-state.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

An empty state is information, not a marketing moment. The sentence states what the region will contain and why it is currently empty ("No orders yet — orders appear here as soon as a channel syncs."). The single action is the most direct way to change that.

The copy rules of A3 apply with full force here, because empty states are where "slop voice" usually leaks in: no exclamation marks, no "Awesome!", no illustrations of empty boxes.

## Examples

### In a table card

```tsx
import { EmptyState, Button } from '@/components/seventy-six';

<EmptyState
  sentence="No orders yet — orders appear here as soon as a sales channel syncs."
  action={<Button variant="primary">Connect channel</Button>}
/>
```

### No results for a filter

The other empty case: not first-run, but a filter that matched nothing. The sentence names the active filter and points at the way back, and the single action clears it rather than starting from zero.

```tsx
<EmptyState
  sentence="No orders match “On hold · warehouse B”. Widen the filter or clear it to see the other 246 orders."
  action={<Button variant="primary">Clear filters</Button>}
/>
```

## Props

### EmptyState

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sentence` | `string` | — | What would appear here and why it is empty. Max two lines rendered. |
| `action` | `ReactNode` | — | Exactly one primary Button. Optional when no action exists. |

## Accessibility

- Plain paragraph text — no live region; an empty state is a steady state, not an announcement.
- The action is a real Button with the standard focus contract.

## Don't

- No illustrations, mascots, or emoji (A2 bans them in product UI).
- No "Oops" / "Nothing to see here" — say what and why.
- No more than one action; two paths is a decision, and decisions get pages.

## FAQ

**What if there is nothing the user can do?**

Omit the action. The sentence alone must still say why it is empty ("Reports appear after your first full day of data").

**Where does it go inside a card?**

In place of the widget body, under the universal CardHead — the head stays so the region keeps its name.
