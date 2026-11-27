import type { DocEntry } from '../types';

export const funnelListEntry: DocEntry = {
  slug: 'funnel-list',
  name: 'FunnelList',
  book: 'B61',
  category: 'widgets',
  tagline: 'The narrowing — one total through an ordered sequence of steps, on B6\'s straight bars.',
  job: 'State how one total narrows through an ordered sequence of steps.',
  tags: ['funnel', 'conversion', 'checkout', 'pipeline', 'drop-off', 'steps', 'baseline'],
  exports: ['FunnelList', 'FunnelStep', 'FunnelListProps'],
  files: ['components/seventy-six/funnel-list.tsx', 'components/seventy-six/funnel-list.css'],
  intro: [
    'B6 <b>MeterList</b> measures each part against its own maximum. B44 <b>DistributionStrip</b> divides one total into parallel shares. A funnel\'s parts are not parallel: every step is a subset of the step before it. So it is an ordered list, every bar is drawn against the <b>first</b> step, and every step after the first states what it kept from the previous one — "41.2% of previous · 7,370 lost".',
    '<b>The trapezoid stays refused</b>, for the same reason the donut does: it is a shape performing a number. The bars are B6\'s straight 3px bars, and the absolute figure is required on every step — a bare percentage is a defect.',
    '<b>It never computes (C9).</b> Every figure, rate and loss is a pre-formatted string. <code>share</code> (0–1 of the first step) only draws the bar, by <code>scaleX</code> on a full-width fill — no width is ever set or animated.',
    'When the conversion lines carry a comparison, <code>baseline</code> prints what they are compared against once at the head ("vs Q2 2026"), so no delta in the list is an unsourced assertion.',
  ],
  examples: [
    {
      title: 'Checkout',
      description: 'Five steps from 48,200 product views to 3,210 orders. Every rate and loss reconciles with the figures.',
      demoKey: 'funnel-checkout',
      surface: 'paper',
      code: `import { FunnelList } from '@/components/seventy-six';

<FunnelList
  label="Checkout funnel, July 2026"
  steps={[
    { label: 'Viewed a product', value: '48,200', share: 1 },
    { label: 'Added to cart', value: '12,530', share: 0.26,
      conversion: '26.0% of previous · 35,670 lost' },
    { label: 'Began checkout', value: '5,160', share: 0.1071,
      conversion: '41.2% of previous · 7,370 lost' },
    { label: 'Entered payment', value: '3,870', share: 0.0803,
      conversion: '75.0% of previous · 1,290 lost' },
    { label: 'Placed an order', value: '3,210', share: 0.0666,
      conversion: '82.9% of previous · 660 lost' },
  ]}
/>`,
    },
    {
      title: 'In a card, against a baseline',
      description: 'The deltas are step rates against Q2, and the head says so once.',
      demoKey: 'funnel-pipeline',
      code: `<Card>
  <CardHead title="Pipeline conversion" subtitle="Q3 2026 · 240 leads" />
  <div className="sv-card__body">
    <FunnelList
      label="Pipeline conversion, Q3 2026"
      baseline="Q2 2026"
      steps={[
        { label: 'Lead', value: '240', share: 1 },
        { label: 'Qualified', value: '150', share: 0.625,
          conversion: '62.5% of previous · 90 lost · ▲ 4.1 pts' },
        /* … */
      ]}
    />
  </div>
</Card>`,
    },
  ],
  props: [
    {
      component: 'FunnelList',
      rows: [
        { name: 'label', type: 'string', description: 'Accessible name for the list, e.g. "Checkout funnel, July 2026".' },
        { name: 'steps', type: 'FunnelStep[]', description: 'In order. label · value (REQUIRED, PRE-FORMATTED) · share · optional conversion · optional id.' },
        { name: 'steps[].share', type: 'number', description: '0–1 of the FIRST step, for drawing the bar only. The first step is 1.' },
        { name: 'steps[].conversion', type: 'string', description: 'PRE-FORMATTED, from the previous step: "41.2% of previous · 7,370 lost".' },
        { name: 'baseline', type: 'string', description: 'What the comparisons are against, printed once at the head via the localized "vs …".' },
        { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'id, style, data-*, aria-*, event handlers — spread onto the root; ref forwards to it. className is appended.' },
      ],
    },
  ],
  a11y: {
    notes: [
      'A real <ol>, so position in the sequence is announced; the mono ordinal is aria-hidden to avoid saying it twice.',
      'The bar is aria-hidden illustration — the absolute figure and the conversion line carry every number as text (C5).',
      'Figures are tabular and pre-formatted by the caller (C9).',
      'The bar grows from the inline start, so it mirrors in RTL.',
      'It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).',
    ],
  },
  donts: [
    'Never a trapezoid, a taper or any funnel shape — straight 3px bars only.',
    'Never a step without its absolute figure.',
    'Never steps that are not subsets of the one before; parallel parts are B44 or B6.',
    'Never green or red bars for good and bad steps — colour belongs to words and dots.',
    'Never more than seven steps; a longer sequence is a B7 DataTable.',
    'Never a delta in a conversion line without a stated baseline.',
  ],
  faq: [
    { q: 'FunnelList, MeterList or DistributionStrip?', a: 'Is each part a subset of the one before? FunnelList. Is each part measured against its own capacity? MeterList. Do the parts divide one total side by side? DistributionStrip.' },
    { q: 'Why is every bar drawn against the first step?', a: 'So the bars compare across the whole sequence. The step-to-step rate is printed in the conversion line, where it can be read exactly.' },
    { q: 'Why must I compute the rates?', a: 'C9: formatting and arithmetic belong to the caller\'s layer, in the reader\'s locale. A component that rounds for you will one day disagree with the report.' },
  ],
};
