# Toast · 76° UI (B14)

Bottom-left paper slips for success and neutral info only — errors always render inline at their source.

**One job:** Confirm that something finished, without demanding attention.
**Category:** primitives · **Exports:** ToastProvider, useToast · **Tags:** toast, notification, aria-live, auto-dismiss, success-feedback

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/toast.json
```

Manual: copy components/seventy-six/toast.tsx, components/seventy-six/toast.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Toasts are the system's quietest voice: a paper card with a 2px left rule (seed for info, green for ok), bottom-left, auto-dismissing after 5 seconds with pause-on-hover, at most two stacked. They confirm; they never warn — an error belongs inline next to the field or row that caused it (Firewall A2).

Wrap the app once in `ToastProvider`; fire from anywhere with `useToast()`. A toast may repeat an available action ("Undo" also in context) but must never be the only path to one.

## Examples

### Firing toasts

```tsx
import { ToastProvider, useToast, Button } from '@/components/seventy-six';

// main.tsx: <ToastProvider><App /></ToastProvider>

function SaveBar() {
  const { toast } = useToast();
  return (
    <>
      <Button variant="ghost" onClick={() => toast('Export started — July orders', 'info')}>
        Export July
      </Button>
      <Button variant="primary" onClick={() => toast('Order ORD-10482 created', 'ok')}>
        Create order
      </Button>
    </>
  );
}
```

### Even a problem stays calm

There is no error tone, by design (A2). A partial failure is stated factually on the info slip — no red, no "Oops". If the failure actually blocks the flow it belongs inline or in a Dialog, never in a toast.

```tsx
const { toast } = useToast();

<Button variant="ghost"
  onClick={() => toast('Import finished — 2 of 3 rows added, 1 needs review', 'info')}>
  Import with issues
</Button>
<Button variant="primary"
  onClick={() => toast('Import finished — 3 of 3 rows added', 'ok')}>
  Import clean
</Button>
```

## Props

### useToast → toast()

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | — | Calm, factual, specific. No exclamation marks (A3). |
| `tone` | `'ok' | 'info'` | `'info'` | ok = green left rule; info = seed. There is deliberately no error tone. |

## Accessibility

- The container is an `aria-live="polite"` region — announcements never interrupt the user mid-task.
- Auto-dismiss pauses on hover; the 5s window plus the polite region means content is announced in full before removal.
- Never put the only path to an action in a toast; undo must also exist in context.

## Don't

- No error toasts — errors render inline at their source.
- No more than two stacked; older toasts yield.
- No top-right placement; 76° toasts live bottom-left.
- No "Awesome!" / "Oops" copy — a toast speaks like a competent colleague.

## FAQ

**How do I show an error?**

Not with a toast. Render the error inline next to its cause — a Field error, a table-row StatusWord, or a Dialog if the failure blocks the flow. Toast tones are ok and info only, by design.

**How long do toasts stay?**

5 seconds, pausing while hovered, resuming with at least 800ms of grace. Two can stack; a third replaces the oldest.

**Can I add an action button to a toast?**

Yes, as a duplicate of an action that exists in context — a toast must never be the only path to anything.
