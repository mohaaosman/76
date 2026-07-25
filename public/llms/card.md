# Card · 76° UI (A4)

The paper primitive: one shadow, one radius, zero border. Every widget composes it.

**One job:** Be the sheet of paper a widget is printed on.
**Category:** primitives · **Exports:** Card, CardHead · **Tags:** card, surface, paper, card-head, container

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/card.json
```

Manual: copy components/seventy-six/card.tsx, components/seventy-six/card.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Card is not a widget type — it is the paper the widgets are printed on. It enforces the A4 checklist mechanically: background `--sv-paper`, radius `--sv-r`, exactly one `--sv-shadow`, no border. If you find yourself styling a second shadow or a tinted background, you are building a defect.

**CardHead** is the universal head: bold 13.5 title with an optional faint subtitle on the left, and at most one action on the right — a seed text link or a mono range control, never an icon-only mystery menu.

## Examples

### Card with universal head

```tsx
import { Card, CardHead, ButtonLink } from '@/components/seventy-six';

<Card>
  <CardHead
    title="Open orders"
    subtitle="Updated 14:32 · warehouse A"
    action={<ButtonLink href="/orders">View all</ButtonLink>}
  />
  {/* widget body */}
</Card>
```

## Props

### Card

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `'div' | 'section' | 'article'` | `'section'` | Semantic element. Cards that link wrap the whole card in the anchor instead. |
| `…rest` | `HTMLAttributes` | — | className, aria-label, etc. |

### CardHead

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Bold 13.5/700 title. Required. |
| `subtitle` | `string` | — | Faint 11.5 subtitle under the title. |
| `action` | `ReactNode` | — | ONE action, right-aligned — a ButtonLink or mono range control. |

## Accessibility

- CardHead renders an `<h3>`; keep the page's heading ladder unskipped (one h1 in the hero, h2s for page sections if needed).
- If the whole card links somewhere, the card itself is the anchor with a focus ring per C3 — hover shows nothing beyond the cursor; paper does not lift.

## Don't

- No borders, no second shadow, no tinted backgrounds — contrast alone separates paper from wall.
- No hover lift, scale, or glow. Paper does not perform.
- No icon-only "⋯" menu as the head action.
- No card-in-card nesting; if a card needs sections, use hairlines.

## FAQ

**How do I make a card clickable?**

Wrap the Card in the anchor/Link and put the focus ring on the anchor. The Book's rule: whole card is the target, hover adds nothing visual beyond the cursor.

**Can I change the elevation?**

No. There is exactly one shadow token in the system. Depth hierarchies are expressed by layout, not by stacking shadows.

**Where do filter tabs go?**

Directly under CardHead, using the CardTabs component — the Bissaa pattern used by DataTable.
