# Button · 76° UI (B10)

Native <button> with four registered variants — no shadows, no transforms, one primary per view region.

**One job:** Trigger exactly one named action.
**Category:** primitives · **Exports:** Button, ButtonLink · **Tags:** button, primary, ghost, danger, loading-state, pos-touch-target, text-link

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/button.json
```

Manual: copy components/seventy-six/button.tsx, components/seventy-six/button.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Four variants, each with a registered job. **primary** is a seed fill with white text — the one loud element a view region is allowed. **ghost** is transparent with a hairline border that turns seed on hover. **danger** is ghost anatomy with red text; it only becomes a red fill as the final confirm inside a Dialog (add `data-confirm`). **link** is the 12/600 seed text action used in card heads.

Buttons never move or resize on state change. The loading state locks the button to its pre-loading width, swaps the label for `loadingLabel`, and shows the one sanctioned continuous animation in the system: a 12px inline spinner. Disabled is a wall-colored fill with faint text — never opacity on the whole button.

The `pos` flag applies the POS contract: identical anatomy at ≥48px height, 14.5/700 label, and press feedback under 100ms.

## Examples

### Variants

One primary per view region; everything else is quiet. Buttons name the action's object — never "Submit" or "Click here".

```tsx
import { Button, ButtonLink } from '@/components/seventy-six';

<Button variant="primary">Create order</Button>
<Button variant="ghost">Export July</Button>
<Button variant="danger">Delete draft</Button>
<ButtonLink href="/orders">View all</ButtonLink>
```

### Loading & disabled

Width is locked before the label swaps, so nothing shifts. Disabled keeps full label contrast rules: wall fill, faint text, not-allowed cursor.

```tsx
<Button variant="primary" isLoading loadingLabel="Saving…">
  Save changes
</Button>
<Button variant="primary" disabled>Approve PO-2291</Button>
```

### POS variant

Same bones at ≥48px. Press feedback is a seed-tint flash on product buttons; the single pay-primary uses seed-deep.

```tsx
<Button variant="ghost" pos>Iced latte · $4.50</Button>
<Button variant="primary" pos>Charge $23.80</Button>
```

## Props

### Button

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' | 'ghost' | 'danger' | 'link'` | `'primary'` | The registered variant. One primary per view region. |
| `pos` | `boolean` | `false` | POS contract: ≥48px height, larger label, <100ms press feedback. |
| `isLoading` | `boolean` | `false` | Locks width, swaps label for <code>loadingLabel</code>, sets <code>aria-busy</code>, disables the button. |
| `loadingLabel` | `string` | `'Working…'` | Label shown while loading — name the operation ("Saving…"). |
| `iconLeading` | `ReactNode` | — | 16px stroke icon before the label. Icon-only buttons must add <code>aria-label</code>. |
| `…rest` | `ButtonHTMLAttributes` | — | Everything a native button takes: type, onClick, disabled, aria-*. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Moves focus; focus ring is 2px seed, offset 2px, always visible. |
| Enter / Space | Activates — native button semantics, nothing re-implemented. |

- Rendered as `&lt;button&gt;` or `&lt;a&gt;` only — never a clickable div.
- Icon-only buttons are allowed solely in the topbar utility cluster and require an `aria-label`; the icon itself is `aria-hidden`.
- Loading sets `aria-busy="true"` and disables interaction; the label change is announced because it is real text, not a spinner alone.
- Minimum hit area 24×24 on desktop, 48×48 in POS contexts.

## Don't

- No two seed-filled primaries in the same view region.
- No red fill outside a dialog's final destructive confirm.
- No opacity-dimmed disabled state — use the wall fill + faint text spec.
- No vague labels: "Submit", "Click here", and "Learn more" are banned copy (A3). Name the object: "Create order".
- No transforms or size changes on press — feedback is color only.

## FAQ

**Which variants are available?**

primary (seed fill), ghost (hairline border), danger (ghost anatomy, red text), and link (seed text action). Set them via the variant prop.

**How do I show a loading state?**

Set isLoading and give a loadingLabel like "Saving…". The button locks its width, shows a 12px inline spinner, sets aria-busy, and ignores clicks until isLoading turns false.

**How do I disable a button?**

Pass the native disabled prop. It renders a wall-colored fill with faint text and cursor: not-allowed.

**How do I make a button full-width?**

Buttons are inline-flex; apply width: 100% from the parent layout (e.g. a grid column). The POS pay-primary is the one case the Book prescribes full column width.

**Can a button render as a link?**

Use ButtonLink for text-link actions, or wrap your router's Link with the sv-btn classes — the styles are class-based, so any anchor can carry them.
