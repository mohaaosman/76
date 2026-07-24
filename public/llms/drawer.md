# Drawer · 76° UI (B21)

The slide-over: a paper panel from the screen edge for detail-in-context, on native <dialog>.

**One job:** Inspect or edit ONE record without leaving the sheet.
**Category:** primitives · **Exports:** Drawer · **Tags:** drawer, slide-over, panel, detail-view, native-dialog, side-sheet

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/drawer.json
```

Manual: copy components/seventy-six/drawer.tsx, components/seventy-six/drawer.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button.

## Overview

The Drawer answers the moment a table row needs its full story: inspect the record, edit a field, review before commit — while the sheet stays visible behind the scrim as context. It is a full-height paper panel entering from the right (or left), on native `&lt;dialog&gt;.showModal()`: focus trap, Esc, backdrop, top layer, zero dependencies.

Anatomy: a hairline-separated head (15/700 title + optional mono context line + close), a scrolling body, and a sticky footer with a ghost cancel and **one** primary. Sizes: sm 360 · md 480 · lg 640 · full. Entry slides 24px on transform only, 160ms ease-out, collapsing to 0 under reduced motion.

The dividing line with Dialog: a Dialog interrupts for one decision; a Drawer opens a workspace beside the work. If the task replaces the page entirely, use `Dialog size="full"`.

## Examples

### Order detail drawer

```tsx
import { useState } from 'react';
import { Drawer, Button } from '@/components/seventy-six';

const [open, setOpen] = useState(false);

<Button variant="ghost" onClick={() => setOpen(true)}>Review ORD-10482</Button>
<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Order ORD-10482"
  context="CORRIDOR FOODS · 24 JUL · 3 LINES"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
      <Button variant="primary" onClick={approve}>Approve order</Button>
    </>
  }
>
  {/* Fields, MeterList, ActivityList — anything paper carries */}
</Drawer>
```

## Props

### Drawer

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open / onClose` | `boolean / () => void` | — | Controlled visibility; drives showModal()/close(). |
| `title` | `string` | — | The 15/700 head title; wired to aria-labelledby. |
| `context` | `string` | — | Mono metadata line under the title — ID, date, counts. |
| `side` | `'right' | 'left'` | `'right'` | Owning screen edge. |
| `size` | `'sm' | 'md' | 'lg' | 'full'` | `'md'` | 360 / 480 / 640 / takeover. Every size caps at 100vw. |
| `dismissible` | `boolean` | `true` | Scrim click closes; disable for unsaved-work drawers (Esc still works). |
| `footer` | `ReactNode` | — | Sticky, right-aligned: ghost cancel + ONE primary/danger. |

## Accessibility

| Keys | Action |
| --- | --- |
| Esc | Closes the drawer. |
| Tab / ⇧Tab | Cycles inside — native top-layer focus trapping. |

- Native dialog semantics: `aria-modal`, focus moves in on open and returns to the invoker on close.
- The close control carries a full name ("Close Order ORD-10482"), and the footer always duplicates the exit as a named cancel.
- Slide-in is transform-only and honors `prefers-reduced-motion` through the duration tokens.

## Don't

- No navigation inside a drawer — it is a workspace, not a page.
- No stacked drawers; a second record is a second visit.
- No drawer for a one-line decision — that is a Dialog.
- No body scroll-jacking; only the drawer body scrolls.

## FAQ

**Drawer or full-screen Dialog?**

Keep the sheet visible when it is context the user still needs (comparing, cross-checking): Drawer. Replace it when the task is self-contained (a composer, a wizard): Dialog size="full".

**Can I put a DataTable inside?**

Yes at lg or full — anything paper carries is legal in the body. At sm/md prefer key-value rows and MeterLists; tables need width to breathe.
