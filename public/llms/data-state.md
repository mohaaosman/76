# DataState · 76° UI (B64)

The four lifecycle states of a data region — loading, empty, error, ready — assembled once, around any widget.

**One job:** State which of the four lifecycle states a data region is in, and draw the right one.
**Category:** widgets · **Exports:** DataState, DataStateProps, DataStatus · **Tags:** loading, skeleton, empty state, error, lifecycle, async, fetch, region

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/data-state.json
```

Manual: copy components/seventy-six/data-state.tsx, components/seventy-six/data-state.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: skeleton, empty-state, banner.

## Overview

The Craft Floor has always required every data region to ship **all four lifecycle states** — a skeleton after 300ms, an empty state, an inline error, and the loaded widget — and every screen re-assembled them by hand from Skeleton, EmptyState and Banner. Most screens shipped one or two. DataState is that assembly, once.

**It holds no state of its own.** The caller says which state the data is in — `status="loading" | "empty" | "error" | "ready"` — and DataState draws it. A fast answer never flashes a skeleton (nothing paints for the first 300ms), the region is `aria-busy` and announces what is loading, and `minHeight` reserves the space so the card does not jump when the data lands.

Errors are inline, at the region, in B22's voice: what happened, how to fix it, and a retry the caller names ("Load orders again"). Never a toast — a toast is for a result that happened somewhere else.

## Examples

### The four states, one region

Switch the state; the card keeps its height and its head.

```tsx
<Card>
  <CardHead title="Orders" subtitle="Live queue" />
  <DataState
    status={status}
    loadingLabel="Loading orders"
    minHeight={226}
    empty={{ sentence: 'No orders were placed today.', action: <Button variant="ghost">Open yesterday’s orders</Button> }}
    error={{
      title: 'Orders did not load',
      body: 'The order service did not answer within 10 seconds. Load the orders again.',
      action: <Button variant="ghost" onClick={retry}>Load orders again</Button>,
    }}
  >
    <DataTable caption="Today’s orders" columns={columns} rows={orders} rowKey={(o) => o.id} />
  </DataState>
</Card>
```

## Props

### DataState

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `'loading' | 'empty' | 'error' | 'ready'` | — | Which state the data is in. The caller owns it. |
| `loadingLabel` | `string` | `catalog "Loading…"` | Announced while loading: "Loading orders". |
| `rows` | `number` | `4` | Skeleton rows drawn after the 300ms gate. |
| `skeleton` | `ReactNode` | — | A skeleton shaped like the widget, instead of the default rows. |
| `empty` | `{ sentence; action? }` | — | B15: one sentence saying WHAT is empty and why, one action. |
| `error` | `{ title; body?; action? }` | — | B22 inline error: what happened, how to fix it, a named retry. |
| `minHeight` | `number | string` | — | Reserved height while loading, so the card does not jump. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | id, data-*, aria-* and style pass through to the region. |

## Accessibility

- While loading the region is aria-busy and a visually hidden role="status" line names what is loading.
- The error is a B22 Banner with role="alert", so it is announced once when it appears.
- The skeleton is aria-hidden: a screen reader hears "Loading orders", never a row of shapes.

## Don't

- Never a spinner as the first paint — that is a skeleton.
- Never an error without what happened and what to do next.
- Never "No data" — say what is empty and why.
- Never a toast for a failed region — the failure is stated where the data would have been.

## FAQ

**Does it fetch?**

No. It draws the state you pass. Fetch with whatever your product uses and map its state to status.

**Why does nothing appear for the first 300ms?**

A skeleton that flashes for 80ms is a flicker, not a state. Most answers arrive inside 300ms and never show one.

**Can it wrap a MeterList or a Trend?**

Yes. Inside a card, give a widget without its own inset a sv-card__body inside DataState.
