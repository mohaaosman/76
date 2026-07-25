# Timeline · 76° UI (B41)

One record's history on a clipped rail — including what has not happened.

**One job:** State the ordered HISTORY of ONE record, with the gaps visible.
**Category:** primitives · **Exports:** Timeline · **Tags:** timeline, history, audit trail, events, record, pending

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/timeline.json
```

Manual: copy components/seventy-six/timeline.tsx, components/seventy-six/timeline.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A real `<ol>` down a 1px rail: an 11px marker per row, an absolute mono timestamp in a real `<time dateTime>`, a 13/600 title, one sentence of body and an optional mono actor. The rail is clipped at the first and last markers so the line never dangles past the sequence, and a day divider restarts it the same way. The marker's ring is an `inset` shadow, not an elevation one, so what reads is a dot sitting cleanly on the line rather than crossing it. There are no hairlines anywhere in it — the rail carries the rhythm.

The boundary is B9 **ActivityList**: a live, flat feed answering "what needs me", newest first, across many records. A Timeline is one record's life, and it states what has **not** happened yet as well as what has. That is why `pending` is a first-class tone rather than an omitted row — a gap the reader cannot see is a gap nobody chases.

## Examples

### An order's life

The last row has not happened. It is still stated, with a pending marker and the date it is expected.

```tsx
import { Timeline } from '@/components/seventy-six';

<Timeline
  items={[
    { id: 'placed', group: '22 JUL', time: '09:14', dateTime: '2026-07-22T09:14:00+03:00',
      title: 'Order placed', actor: 'Halcyon Freight' },
    { id: 'picked', time: '11:02', dateTime: '2026-07-22T11:02:00+03:00',
      title: 'Picked', body: '14 SKUs from warehouse A.', actor: 'A. Yusuf' },
    { id: 'shipped', group: '24 JUL', time: '08:40', dateTime: '2026-07-24T08:40:00+03:00',
      title: 'Shipped', body: 'DHL · 4820 1183 55' },
    { id: 'delivered', time: '26 JUL', title: 'Delivery expected', tone: 'pending' },
  ]}
/>
```

### A run that failed

The bad row names what failed. "The run failed" states that something went wrong and nothing else (A3).

```tsx
<Timeline
  items={[
    { id: 'queued', time: '02:00', title: 'Run queued' },
    { id: 'extract', time: '02:01', title: 'Extract complete', body: '18,402 rows read.' },
    { id: 'load', time: '02:06', title: 'Load failed', tone: 'bad',
      body: 'Duplicate key on invoice_no at row 9,118.', actor: 'etl-worker-3' },
  ]}
/>
```

## Props

### Timeline

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TimelineItem[]` | — | In display order — the component renders the order it is given. |

### TimelineItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `time` | `string` | — | Absolute display time, e.g. "24 JUL · 14:28". Never "3 minutes ago" (C9). |
| `dateTime` | `string` | — | The machine timestamp, used for <time dateTime> and the title attribute. |
| `title` | `string` | — | What happened, in a few words. |
| `body` | `ReactNode` | — | One sentence. Two is a record page. |
| `actor` | `string` | — | Who did it — mono, under the body. |
| `tone` | `'done' | 'pending' | 'bad'` | `'done'` | Seed dot, hollow ring, or bad. Each is also stated in words. |
| `group` | `string` | — | Mono uppercase day divider rendered ABOVE this item. |

## Accessibility

- A real <ol>, so assistive tech announces position in the sequence without being told.
- Every row states its tone in visually-hidden words before the title ("Completed", "Not started", "Failed") — a coloured dot is colour-only meaning (C5), and the dot itself is aria-hidden.
- Day dividers render as role="presentation" siblings, so they stay out of the list's count: a divider is not a step in the history.
- Timestamps are absolute, in mono, inside a real <time dateTime>, with the machine value also on title (C9).
- The pending marker's ring takes `--sv-field-line-strong`, because that ring is the dot's only affordance (C1).

## Don't

- No relative timestamps — "3 minutes ago" is not a record (C9).
- No timeline as a feed across many records; that is ActivityList (B9).
- No dropping the rows that have not happened yet — the gap is the information.
- No second sentence in a body; a row needing a paragraph is a record page.
- No elevation shadow on the marker; the ring is an inset, and the dot sits on the rail, not above it.
- No tone carried by the dot alone — every marker says its state in words (C5).

## FAQ

**Timeline or ActivityList?**

One record's life, including what is still pending: Timeline. A live feed across many records answering "what needs me": ActivityList (B9).

**Oldest first or newest first?**

Either — the component renders the order the caller passes. A record page usually reads oldest first, because the pending rows then sit at the bottom where the reader is heading.

**Where does a failure explanation go?**

In the body, in one sentence naming what failed and where. A bad tone with no sentence states only that something went wrong (A3).
