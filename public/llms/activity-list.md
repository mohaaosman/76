# ActivityList · 76° UI (B9)

A mono timestamp column beside sentence rows with bold entities. Absolute time, always.

**One job:** Answer "what needs me."
**Category:** widgets · **Exports:** ActivityList · **Tags:** activity, feed, timeline, audit-log, timestamps

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/activity-list.json
```

Manual: copy components/seventy-six/activity-list.tsx, components/seventy-six/activity-list.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A fixed mono timestamp column and 12.5px sentences where the entities — order IDs, names, amounts — sit in 600 ink. Hairlines separate rows; the sentence reads like a colleague's note: "PO-2291 approved by **Nasra Ali**".

Timestamps are absolute in ERP contexts (14:28, 24 JUL) — "3 minutes ago" is banned there. Consumer seeds may go relative, but the absolute value always exists on hover via `title` and in the datetime attribute.

## Examples

### Today's activity

```tsx
import { ActivityList, Card, CardHead } from '@/components/seventy-six';

<Card>
  <CardHead title="Activity" subtitle="Today · all zones" />
  <ActivityList
    items={[
      { time: '14:28', dateTime: '2026-07-24T14:28:00+03:00',
        children: <><b>ORD-10482</b> picked complete — 12 of 12 items</> },
      { time: '13:51', dateTime: '2026-07-24T13:51:00+03:00',
        children: <><b>PO-2291</b> approved by <b>Nasra Ali</b></> },
      { time: '11:04', dateTime: '2026-07-24T11:04:00+03:00',
        children: <>Zone B temperature back in range after <b>18 min</b></> },
    ]}
  />
</Card>
```

### A CRM pipeline feed

Same widget, a different domain: deals, contacts, and amounts are the bold entities in a sales feed. The timestamps stay absolute and the sentence still reads like a colleague's note — no avatars, no coloured event types.

```tsx
<ActivityList
  items={[
    { time: '15:12', dateTime: '2026-07-24T15:12:00+03:00',
      children: <><b>Acme Corp</b> deal moved to <b>Negotiation</b> — $48K</> },
    { time: '13:40', dateTime: '2026-07-24T13:40:00+03:00',
      children: <><b>Priya Nair</b> booked a demo for <b>Northwind</b></> },
    { time: '11:26', dateTime: '2026-07-24T11:26:00+03:00',
      children: <><b>Deka Wholesale</b> replied — awaiting a revised quote</> },
  ]}
/>
```

## Props

### ActivityList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ActivityItem[]` | — | { time, dateTime?, children } — children is the sentence with entities in <b>. |

## Accessibility

- Rendered as an ordered list — the sequence is the semantics.
- Timestamps use `&lt;time dateTime&gt;` with the full ISO value on title.

## Don't

- No avatars, icons, or color-coded event types — the sentence carries the meaning.
- No "3 minutes ago" in ERP contexts.
- No infinite feeds inside overview cards; cap the list and link to the full log.

## FAQ

**How many items should an overview card show?**

Five to eight, with a "View log" text-link action in the CardHead. The widget answers "what needs me", not "everything that happened".

**Can rows link to their objects?**

Wrap the entity in your router's Link inside the sentence — the bold entity is the natural target.
