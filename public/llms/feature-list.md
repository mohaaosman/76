# FeatureList · 76° UI (B48)

The claim, itemised — type on hairlines, never icon tiles.

**One job:** State what the product does, one item at a time.
**Category:** marketing · **Exports:** FeatureList · **Tags:** features, marketing, landing, list, grid, benefits

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/feature-list.json
```

Manual: copy components/seventy-six/feature-list.tsx, components/seventy-six/feature-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Every library answers this with a grid of tinted icon tiles. A2 refuses the icon-led card, F11 refuses the illustration it grows into, and Law 2 will not spend six colours on a decorative glyph — so what is left is a newspaper column: a rule, a number, a title, one sentence.

It is a **statement, never a control**. Nothing in an item is clickable; if a feature needs a link, the link lives inside its body where the reader can see what it points at.

## Examples

### Three across

A column rule per item, a mono ordinal, a title, one sentence.

```tsx
import { FeatureList } from '@/components/seventy-six';

<FeatureList
  ariaLabel="What the system ships"
  items={[
    { id: 'taxonomy', title: 'A closed taxonomy', body: 'Fifty-one specifications, each with one job. If a screen needs a type that is not in the Book, the type gets named or the screen gets composed.', meta: 'B1 — B51' },
    { id: 'deps', title: 'Zero runtime dependencies', body: 'Native element first: <details>, <dialog>, [popover], <input type="date">. The browser already draws the calendar.', meta: 'REACT 19 ONLY' },
    { id: 'a11y', title: 'AA on both surfaces', body: 'Every token pair is contrast-verified in light and dark, and no meaning is ever carried by colour alone.', meta: 'WCAG 2.2 AA' },
  ]}
/>
```

## Props

### FeatureList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `FeatureItem[]` | — | id · title · body (one sentence) · optional mono meta. |
| `columns` | `2 | 3` | `3` | Across at full width. Steps to 2 below 1000px and 1 below 620px. |
| `numbered` | `boolean` | `true` | Mono ordinals derived from the index — never passed in. |
| `ariaLabel` | `string` | — | Names the list when its section heading is elsewhere. |

## Accessibility

- A real <ul>, so the count is announced before the items.
- The ordinal is NOT aria-hidden: copy refers to items by number, and hiding a visible figure from a screen reader is the asymmetry C5 warns about.
- Ordinals and meta lines use --sv-ink-soft, never --sv-ink-faint — C2 forbids faint as a sole carrier.
- Content tracks are minmax(0, 1fr) so a long unbreakable word cannot blow the grid out at 320px (C7).

## Don't

- No icons and no tinted tiles (A2) — the rule and the ordinal are the structure.
- No illustration (F11).
- No card per item; cards are for work, and this is a statement.
- No clickable item — a link lives inside the body.
- No two-sentence body, and no tenth item: at ten this is a page.

## FAQ

**Why no icons?**

A2 bans icon-only affordances and Law 2 allows neutrals plus one seed. A twelve-icon feature grid is either twelve seed glyphs, which is a wall of one colour, or six hues, which fails Ship Gate point 2.

**Can an item link to a page?**

The body can hold a link. The item itself never becomes a click target — a card-sized hit area with no visible affordance is mystery meat (A2).
