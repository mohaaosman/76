# Notification · 76° UI (B14)

Bottom-left paper notifications — title, description, icon, four tones, two sizes. Errors still render inline first.

**One job:** Report that something happened, without demanding attention.
**Category:** primitives · **Exports:** ToastProvider, useToast · **Tags:** toast, notification, aria-live, auto-dismiss, tones, title-description

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/toast.json
```

Manual: copy components/seventy-six/toast.tsx, components/seventy-six/toast.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Notifications are the system's quietest voice: a paper card bottom-left with a 2px left tone rule, a 16px tone icon, a 13/700 title, and an optional one-sentence description. Four tones — `info` (seed), `ok` (green), `warn` (ink — no amber enters the system), `bad` (red) — and two sizes (360px / 440px). ok/info auto-dismiss after 5s with pause-on-hover; warn/bad persist until dismissed and announce assertively.

The B14 discipline holds: an error ALWAYS renders inline at its source first — a `bad` notification may echo a failure that happened elsewhere (a background job, another tab), never replace the inline surface (Firewall A2). At most three stack; older ones yield.

Wrap the app once in `ToastProvider`; fire `notify({…})` from anywhere with `useToast()`. The 0.1.x `toast(message, tone)` shorthand still works. A notification may repeat an available action but must never be the only path to one.

## Examples

### Full anatomy — title, description, tone

```tsx
import { ToastProvider, useToast, Button } from '@/components/seventy-six';

// main.tsx: <ToastProvider><App /></ToastProvider>

function SaveBar() {
  const { notify } = useToast();
  return (
    <>
      <Button variant="ghost"
        onClick={() => notify({ tone: 'info', title: 'Export started', description: 'July orders — 2,400 rows. We will notify you here when the file is ready.' })}>
        Export July
      </Button>
      <Button variant="primary"
        onClick={() => notify({ tone: 'ok', title: 'Order ORD-10482 created', description: '3 lines · Corridor Foods · dispatch queued.' })}>
        Create order
      </Button>
    </>
  );
}
```

### warn and bad — sticky, still calm

warn/bad persist until dismissed and announce as alerts. They echo a failure whose inline surface exists elsewhere — they never replace it (A2).

```tsx
const { notify } = useToast();

<Button variant="ghost"
  onClick={() => notify({ tone: 'warn', title: 'Sync degraded', description: 'Prices last updated 42 minutes ago. Orders still submit.' })}>
  Degrade sync
</Button>
<Button variant="ghost"
  onClick={() => notify({ tone: 'bad', title: 'Export failed — storage full', description: 'The July file was not written. Free space in Settings → Storage, then retry.' })}>
  Fail export
</Button>
```

## Props

### useToast → notify(options)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Calm, factual, specific. No exclamation marks (A3). |
| `description` | `string` | — | One sentence of context under the title. |
| `tone` | `'ok' | 'info' | 'warn' | 'bad'` | `'info'` | Left rule + icon. warn is ink — no amber in the system. |
| `icon` | `ReactNode` | — | 16px stroke icon; defaults to the tone icon. |
| `size` | `'default' | 'lg'` | `'default'` | 360px · 440px for two-line descriptions. |
| `duration` | `number` | — | ms before auto-dismiss. Defaults: 5000 for ok/info; 0 (sticky) for warn/bad. |

### useToast → toast() (0.1.x shorthand)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | — | Becomes the title of an ok/info notification. |
| `tone` | `'ok' | 'info'` | `'info'` | The shorthand deliberately keeps only the quiet tones. |

## Accessibility

- ok/info render `role="status"` (polite); warn/bad render `role="alert"` and persist until dismissed.
- Auto-dismiss pauses on hover; the 5s window plus the polite region means content is announced in full before removal.
- Never put the only path to an action in a toast; undo must also exist in context.

## Don't

- No bad notification as the ONLY error surface — the inline error at the source comes first (A2).
- No more than three stacked; older notifications yield.
- No top-right placement; 76° toasts live bottom-left.
- No "Awesome!" / "Oops" copy — a toast speaks like a competent colleague.

## FAQ

**How do I show an error?**

Inline first, always: a Field error, a Banner above the form, a table-row StatusWord. A bad notification is for failures whose surface is elsewhere — a background job, another tab — and it echoes, never replaces.

**How long do toasts stay?**

5 seconds, pausing while hovered, resuming with at least 800ms of grace. Two can stack; a third replaces the oldest.

**Can I add an action button to a toast?**

Yes, as a duplicate of an action that exists in context — a toast must never be the only path to anything.
