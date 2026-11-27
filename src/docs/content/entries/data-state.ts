import type { DocEntry } from '../types';

export const dataStateEntry: DocEntry = {
  slug: 'data-state',
  name: 'DataState',
  book: 'B64',
  category: 'widgets',
  tagline: 'The four lifecycle states of a data region — loading, empty, error, ready — assembled once, around any widget.',
  job: 'State which of the four lifecycle states a data region is in, and draw the right one.',
  tags: ['loading', 'skeleton', 'empty state', 'error', 'lifecycle', 'async', 'fetch', 'region'],
  exports: ['DataState', 'DataStateProps', 'DataStatus'],
  files: ['components/seventy-six/data-state.tsx', 'components/seventy-six/data-state.css'],
  registryDeps: ['skeleton', 'empty-state', 'banner'],
  intro: [
    'The Craft Floor has always required every data region to ship <b>all four lifecycle states</b> — a skeleton after 300ms, an empty state, an inline error, and the loaded widget — and every screen re-assembled them by hand from Skeleton, EmptyState and Banner. Most screens shipped one or two. DataState is that assembly, once.',
    '<b>It holds no state of its own.</b> The caller says which state the data is in — <code>status="loading" | "empty" | "error" | "ready"</code> — and DataState draws it. A fast answer never flashes a skeleton (nothing paints for the first 300ms), the region is <code>aria-busy</code> and announces what is loading, and <code>minHeight</code> reserves the space so the card does not jump when the data lands.',
    'Errors are inline, at the region, in B22\'s voice: what happened, how to fix it, and a retry the caller names ("Load orders again"). Never a toast — a toast is for a result that happened somewhere else.',
  ],
  examples: [
    {
      title: 'The four states, one region',
      description: 'Switch the state; the card keeps its height and its head.',
      demoKey: 'datastate-four',
      code: `<Card>
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
</Card>`,
    },
  ],
  props: [
    {
      component: 'DataState',
      rows: [
        { name: 'status', type: "'loading' | 'empty' | 'error' | 'ready'", description: 'Which state the data is in. The caller owns it.' },
        { name: 'loadingLabel', type: 'string', defaultValue: 'catalog "Loading…"', description: 'Announced while loading: "Loading orders".' },
        { name: 'rows', type: 'number', defaultValue: '4', description: 'Skeleton rows drawn after the 300ms gate.' },
        { name: 'skeleton', type: 'ReactNode', description: 'A skeleton shaped like the widget, instead of the default rows.' },
        { name: 'empty', type: '{ sentence; action? }', description: 'B15: one sentence saying WHAT is empty and why, one action.' },
        { name: 'error', type: '{ title; body?; action? }', description: 'B22 inline error: what happened, how to fix it, a named retry.' },
        { name: 'minHeight', type: 'number | string', description: 'Reserved height while loading, so the card does not jump.' },
        { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'id, data-*, aria-* and style pass through to the region.' },
      ],
    },
  ],
  a11y: {
    notes: [
      'While loading the region is aria-busy and a visually hidden role="status" line names what is loading.',
      'The error is a B22 Banner with role="alert", so it is announced once when it appears.',
      'The skeleton is aria-hidden: a screen reader hears "Loading orders", never a row of shapes.',
    ],
  },
  donts: [
    'Never a spinner as the first paint — that is a skeleton.',
    'Never an error without what happened and what to do next.',
    'Never "No data" — say what is empty and why.',
    'Never a toast for a failed region — the failure is stated where the data would have been.',
  ],
  faq: [
    { q: 'Does it fetch?', a: 'No. It draws the state you pass. Fetch with whatever your product uses and map its state to status.' },
    { q: 'Why does nothing appear for the first 300ms?', a: 'A skeleton that flashes for 80ms is a flicker, not a state. Most answers arrive inside 300ms and never show one.' },
    { q: 'Can it wrap a MeterList or a Trend?', a: 'Yes. Inside a card, give a widget without its own inset a sv-card__body inside DataState.' },
  ],
};
