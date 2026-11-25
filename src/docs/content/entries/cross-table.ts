import type { DocEntry } from '../types';

export const crossTableEntry: DocEntry = {
  slug: 'cross-table',
  name: 'CrossTable',
  book: 'B60',
  category: 'widgets',
  tagline: 'The matrix in figures — one measure at every intersection of two dimensions.',
  job: 'State ONE measure at every intersection of two dimensions.',
  tags: ['crosstab', 'matrix', 'pivot', 'two dimensions', 'region', 'quarter', 'totals', 'table'],
  exports: ['CrossTable', 'CrossAxisItem', 'CrossTableProps'],
  files: ['components/seventy-six/cross-table.tsx', 'components/seventy-six/cross-table.css'],
  intro: [
    'B7 <b>DataTable</b> states records: each row a thing, each column a different attribute of it. A crosstab is neither — every cell is the <b>same</b> measure and both axes are dimensions. So both get real headers: <code>&lt;th scope="col"&gt;</code> for one dimension, <code>&lt;th scope="row"&gt;</code> for the other, and a corner cell that names both and the measure: <code>REGION × QUARTER · REVENUE ($K)</code>. A second measure is a second table.',
    '<b>The heatmap stays refused.</b> CrossTable states the matrix in figures. A colour scale is six colours on one surface, it fails C5 the moment it carries meaning, and a reader cannot rank twenty shaded cells anyway. The one emphasis is <code>highlight</code>: a single cell in bold ink on the seed tint, because a reader can find one marked cell.',
    '<b>It never computes (C9).</b> Cells, row totals, column totals and the grand total are pre-formatted strings, and the caller owes the reader that they reconcile. An intersection with no value is an em dash with an accessible "No value" — never a zero, because zero is a figure.',
    'It scrolls horizontally inside its container and never reflows. The row-header column holds in place on <code>--sv-z-sticky</code>, so at 320px the reader still knows which row a figure belongs to.',
  ],
  examples: [
    {
      title: 'Region × quarter, with totals',
      description: 'Row totals, column totals and the grand total all reconcile at 5,383.5. North in Q4 is the one marked cell.',
      demoKey: 'cross-revenue',
      surface: 'paper',
      code: `import { CrossTable } from '@/components/seventy-six';

<CrossTable
  caption="Revenue by region and quarter, FY2026, $ thousands"
  rowDimension="Region"
  colDimension="Quarter"
  measure="Revenue ($K)"
  columns={[{ key: 'q1', header: 'Q1' }, { key: 'q2', header: 'Q2' },
            { key: 'q3', header: 'Q3' }, { key: 'q4', header: 'Q4' }]}
  rows={[{ key: 'north', header: 'North' }, { key: 'south', header: 'South' },
         { key: 'east', header: 'East' }, { key: 'west', header: 'West' }]}
  cells={{
    north: { q1: '412.6', q2: '438.9', q3: '451.2', q4: '497.3' },
    /* … */
  }}
  rowTotals={{ north: '1,800.0', south: '1,209.5', east: '1,479.5', west: '894.5' }}
  colTotals={{ q1: '1,255.3', q2: '1,304.4', q3: '1,349.4', q4: '1,474.4' }}
  grandTotal="5,383.5"
  highlight={{ row: 'north', col: 'q4', note: 'largest intersection' }}
/>`,
    },
    {
      title: 'Empty intersections, scrolling',
      description: 'A carrier that does not serve a warehouse is an em dash. Six carriers in a narrow container scroll under the held warehouse column.',
      demoKey: 'cross-shipments',
      surface: 'paper',
      code: `<CrossTable
  caption="Shipments by warehouse and carrier, July 2026"
  rowDimension="Warehouse"
  colDimension="Carrier"
  measure="Shipments"
  columns={CARRIERS}
  rows={[{ key: 'a', code: 'WH-A', header: 'Mogadishu' }, /* … */]}
  cells={{
    a: { dhl: '1,240', maersk: '860', aramex: '412', fedex: null, ups: null, fleet: '2,075' },
    /* … */
  }}
  rowTotals={{ a: '4,587', b: '3,327', c: '2,521' }}
/>`,
    },
  ],
  props: [
    {
      component: 'CrossTable',
      rows: [
        { name: 'caption', type: 'string', description: 'The table\'s caption and the scroll region\'s name. Visually hidden.' },
        { name: 'rowDimension · colDimension · measure', type: 'string', description: 'Printed in the corner as "ROW × COL · MEASURE".' },
        { name: 'rows · columns', type: 'CrossAxisItem[]', description: 'key · header · optional mono code (row headers).' },
        { name: 'cells', type: 'Record<row, Record<col, string | null>>', description: 'PRE-FORMATTED. Missing, null or empty renders an em dash with an accessible label.' },
        { name: 'rowTotals', type: 'Record<row, string>', description: 'A totals column, behind a stronger rule.' },
        { name: 'colTotals', type: 'Record<col, string>', description: 'A totals row in <tfoot>.' },
        { name: 'grandTotal', type: 'string', description: 'Where both totals meet. Needs rowTotals and colTotals.' },
        { name: 'highlight', type: '{ row, col, note? }', description: 'ONE cell in bold ink on the seed tint. note is announced with the figure.' },
        { name: 'totalLabel', type: 'string', defaultValue: "'Total'", description: 'Header of the totals column and row.' },
        { name: 'noValueLabel', type: 'string', defaultValue: "'No value'", description: 'Announced for an empty intersection.' },
      ],
    },
  ],
  a11y: {
    keyboard: [{ keys: 'Tab, then ← / →', action: 'Focuses the scroll region, then scrolls it' }],
    notes: [
      'A real <table>: column dimension in <th scope="col">, row dimension in <th scope="row">, so every figure is announced with both of its coordinates.',
      'The scroll region is role="region", named by the caption, with tabindex 0 so a keyboard can scroll it (2.1.1).',
      'An empty cell is a visual em dash (aria-hidden) plus a visually hidden "No value" — silence would read as a missing cell.',
      'The highlight is carried by weight as well as the tint (C5); its note is spoken with the figure.',
      'The held row-header column uses inset-inline-start, so it holds on the correct side in RTL.',
    ],
  },
  donts: [
    'Never a colour scale, shaded cells or a heatmap — the matrix is stated in figures.',
    'Never more than one highlighted cell.',
    'Never two measures in one cell, or a second measure in the same table.',
    'Never a zero for "no value"; an absent intersection is an em dash.',
    'Never reflowed into cards on mobile — it scrolls, and the row header holds.',
    'Never component-computed totals (C9).',
  ],
  faq: [
    { q: 'CrossTable or DataTable?', a: 'Are both axes dimensions, and is every cell the same measure? Then CrossTable. If the columns are different attributes of a record, it is B7.' },
    { q: 'Can I shade the cells to show size?', a: 'No. The heatmap is refused: a colour scale is six colours on one surface and carries meaning by colour alone. Mark the one cell that matters with highlight, and state the rest.' },
    { q: 'What about roles × permissions?', a: 'GrantMatrix was declined because this is its shape: a CrossTable whose cells are B11 Checkboxes, composed at the screen.' },
  ],
};
