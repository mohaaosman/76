# Dialog · 76° UI (B13)

Native <dialog> in a paper card on a flat scrim — focus trap, Esc, and top layer for free.

**One job:** Interrupt for one decision or one form.
**Category:** primitives · **Exports:** Dialog · **Tags:** dialog, modal, native-dialog, confirm, destructive-confirm, scrim

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/dialog.json
```

Manual: copy components/seventy-six/dialog.tsx, components/seventy-six/dialog.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Built on the platform: `showModal()` gives us the top layer, focus trapping, Esc handling, and `::backdrop` without a single dependency. The scrim is flat `rgba(27,31,38,.4)` — no blur, because glassmorphism is banned.

Anatomy: 15/700 title, 13/1.55 soft body, right-aligned footer with a ghost cancel and **one** primary or danger action. Three sizes: default 480px, `wide` 640px for forms, and `full` — a full-screen takeover for tasks that replace the page (composers, review flows), where the dialog becomes the wall and the work inside stays paper-on-wall. Only the full size gets a close button; smaller dialogs always exit through a named footer cancel.

Destructive confirms follow B10: the dialog title names the object ("Delete ORD-10482?"), and the confirming button is the single place a red fill is legal (`data-confirm` on a danger Button).

## Examples

### Confirm dialog

```tsx
import { useState } from 'react';
import { Dialog, Button } from '@/components/seventy-six';

const [open, setOpen] = useState(false);

<Button variant="ghost" onClick={() => setOpen(true)}>Archive order</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Archive ORD-10482?"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>Archive order</Button>
    </>
  }
>
  The order moves to the archive and leaves the open-orders table.
  You can restore it from Reports → Archive.
</Dialog>
```

### Full-screen dialog

size="full" — the dialog becomes the page: wall background, 1280px container, visible close, no scrim dismissal.

```tsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Compose purchase order"
  size="full"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Discard</Button>
      <Button variant="primary" onClick={submit}>Create purchase order</Button>
    </>
  }
>
  {/* A full working surface: Rows, Cards, Fields */}
</Dialog>
```

### Destructive confirm

destructive disables scrim-click close; the red fill appears here and nowhere else.

```tsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete ORD-10482?"
  destructive
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" data-confirm onClick={handleDelete}>
        Delete order
      </Button>
    </>
  }
>
  This permanently removes the order and its 3 line items.
  This cannot be undone.
</Dialog>
```

## Props

### Dialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled visibility; drives showModal()/close(). |
| `onClose` | `() => void` | — | Called on Esc, scrim click (non-destructive), or your cancel button. |
| `title` | `string` | — | The 15/700 title; wired to aria-labelledby. Required. |
| `size` | `'default' | 'wide' | 'full'` | `'default'` | 480px · 640px (forms) · full-screen takeover with visible close. |
| `wide` | `boolean` | `false` | Deprecated 0.1.x alias for size="wide". |
| `destructive` | `boolean` | `false` | Scrim click no longer closes; Esc still works unless preventEscape. |
| `preventEscape` | `boolean` | `false` | Blocks Esc while a destructive action is mid-flight. |
| `footer` | `ReactNode` | — | Right-aligned actions: ghost cancel + ONE primary/danger. |

## Accessibility

| Keys | Action |
| --- | --- |
| Esc | Closes the topmost layer (suppressible mid-destructive-confirm via preventEscape). |
| Tab / ⇧Tab | Cycles inside the dialog — native top-layer focus trapping. |

- `role="dialog"` semantics, `aria-modal`, and `aria-labelledby` come from the native element plus the wired title id.
- Focus moves to the first meaningful control on open and returns to the invoker on close — both native `showModal()` behaviors.
- Scrim click closes non-destructive dialogs only.

## Don't

- No "X" icon as the only close path — the footer names its cancel.
- No blur on the scrim; it is one flat rgba value.
- No stacked dialogs; a second decision is a second moment.
- No red-filled confirm outside this component's destructive footer.

## FAQ

**Why native <dialog> instead of a portal library?**

The platform now provides the hard parts — top layer, focus trap, Esc, backdrop — with better screen-reader behavior than most reimplementations, and it removes an entire dependency tree.

**How do I make a form dialog?**

Set wide (640px) and render your Field/Select components as children; the footer's primary names the operation ("Create order"). Validation follows B11: on blur, then on change after first error.

**How do I stop users closing during a delete?**

Set destructive (kills scrim close) and flip preventEscape while the request is in flight; re-enable when it settles.
