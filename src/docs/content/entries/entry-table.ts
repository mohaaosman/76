import type { DocEntry } from '../types';

export const entryTableEntry: DocEntry = {
  slug: 'entry-table',
  name: 'EntryTable',
  book: 'B53',
  category: 'widgets',
  tagline: 'The typist table — one bounded number per line, posted once.',
  job: 'Type one bounded number into every row of a fixed list of lines, and post the lot once.',
  tags: ['entry', 'receipt', 'goods receipt', 'count', 'stock take', 'quantity', 'post', 'ledger', 'keyboard', 'erp'],
  exports: ['EntryTable', 'EntryColumn', 'EntryTotalsRow', 'EntrySync', 'EntryTableProps'],
  files: ['components/seventy-six/entry-table.tsx', 'components/seventy-six/entry-table.css'],
  registryDeps: ['button', 'field'],
  intro: [
    '<b>It is B7 DataTable\'s writing sibling, and the keyboard is the whole difference.</b> B7 is a reader: Enter opens a row and Space selects it. Here Enter and ↓ move the caret to the next line\'s input and ↑ to the previous one, because a clerk receiving forty lines types a figure and presses Enter forty times. It speaks B7\'s voice on purpose — mono headers, mono ids, tabular figures at the inline end — so a receipt reads like the purchase order it came from.',
    '<b>Enter never posts.</b> Past the last line Enter lands on the one primary button in the foot, labelled with the count it will carry ("Post 5 lines"), and posting is one deliberate press of its own. A line out of bounds is never posted: the button states every error and puts the caret on the first one.',
    '<b>The list is fixed, and it bounds without formatting.</b> Rows are the caller\'s lines; the table adds none, sorts none and pages none. The figure stays the string the reader typed (C9) — the component only reads it as a number to check <code>bounds(row)</code>, and the sentence stating the bound is the caller\'s, in the caller\'s locale.',
    'Each line can state its save state — <code>unsaved</code>, <code>saving</code>, <code>failed</code> — as a mono word and a 6px dot beside the input, from the catalog\'s <code>rowUnsaved</code>, <code>rowSaving</code> and <code>rowFailed</code>. Row padding and the input follow the density posture, so <code>data-density="compact"</code> serves the analyst and <code>"touch"</code> the dock.',
  ],
  examples: [
    {
      title: 'Goods receipt',
      description: 'Five lines of PO-2291. Type a figure, press Enter, and the caret moves down; out-of-bounds figures are stated on blur. The totals row is the caller\'s sum.',
      demoKey: 'entry-table-receipt',
      surface: 'paper',
      code: `import { EntryTable } from '@/components/seventy-six';

<EntryTable
  caption="Goods receipt for PO-2291, Harbor & Co"
  columns={[
    { key: 'sku', header: 'SKU', kind: 'id', render: (l) => l.sku },
    { key: 'item', header: 'ITEM', render: (l) => l.item },
    { key: 'ordered', header: 'ORDERED', kind: 'num', render: (l) => String(l.ordered) },
    { key: 'received', header: 'RECEIVED', kind: 'entry' },
  ]}
  rows={lines}
  rowKey={(l) => l.sku}
  values={values}
  onValueChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
  bounds={(l) => ({ min: 0, max: l.ordered, step: 1 })}
  boundsError={(l) => \`Enter 0 to \${l.ordered} — PO-2291 ordered \${l.ordered}.\`}
  inputLabel={(l) => \`Received, \${l.sku}\`}
  sync={sync}
  totals={[{ label: 'TOTAL UNITS', cells: { ordered: '128', received }, strong: true }]}
  summary="3 of 5 lines counted"
  onPost={post}
  posting={posting}
  postingLabel="Posting…"
/>`,
    },
    {
      title: 'Save states and server errors, compact',
      description: 'One line waiting to save, one saving, one rejected by the server with the fix, one over its bound — under the compact density posture.',
      demoKey: 'entry-table-states',
      surface: 'paper',
      code: `<div data-density="compact">
  <EntryTable
    {...receipt}
    sync={{ 'SKU-4472': 'unsaved', 'SKU-3108': 'saving', 'SKU-5520': 'failed' }}
    errors={{
      'SKU-5520': 'Bin B-14 is full. Choose another bin for SKU-5520, then post again.',
    }}
  />
</div>`,
    },
  ],
  props: [
    {
      component: 'EntryTable',
      rows: [
        { name: 'caption', type: 'string', description: 'Visually hidden table caption naming the document: "Goods receipt for PO-2291".' },
        { name: 'columns', type: 'EntryColumn<Row>[]', description: 'B7-shaped columns: key · header · kind (text | id | num | entry) · render. Exactly one column is kind "entry"; its render is ignored.' },
        { name: 'rows / rowKey', type: 'Row[] · (row) => string', description: 'The fixed list of lines and their stable keys.' },
        { name: 'values', type: 'Record<string, string>', description: 'Controlled raw strings exactly as typed, keyed by rowKey. "" means not entered.' },
        { name: 'onValueChange', type: '(key, value) => void', description: 'Every keystroke, as the raw string.' },
        { name: 'bounds', type: '(row) => { min, max, step? }', description: 'Inclusive bounds per line. Out-of-bounds or non-numeric values are errors.' },
        { name: 'boundsError', type: '(row) => string', description: 'The caller\'s sentence for an out-of-bounds line — what and how to fix.' },
        { name: 'inputLabel', type: '(row) => string', description: 'Accessible name of each line\'s input: "Received, SKU-4471".' },
        { name: 'errors', type: 'Record<string, string>', description: 'Errors the caller knows (a server rejection). Shown at once; win over the bounds sentence.' },
        { name: 'sync', type: "Record<string, 'unsaved' | 'saving' | 'failed'>", description: 'Per-line save state, stated as mono word + dot. Absent means saved.' },
        { name: 'totals', type: 'EntryTotalsRow[]', description: 'Closing figures in a real <tfoot>, keyed by column. PRE-FORMATTED; the component never sums.' },
        { name: 'changedCount', type: 'number', defaultValue: 'non-empty values', description: 'The count the post button names.' },
        { name: 'onPost', type: '() => void', description: 'Called by the post button only — never by Enter, never with a line out of bounds.' },
        { name: 'posting', type: 'boolean', defaultValue: 'false', description: 'Button shows postingLabel with a spinner; inputs go read-only, keeping the caret.' },
        { name: 'postingLabel', type: 'string', defaultValue: 't.working', description: 'The button label while posting: "Posting…".' },
        { name: 'summary', type: 'ReactNode', description: 'One soft sentence beside the button: "3 of 5 lines counted".' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'The whole receipt is closed: inputs and post disabled.' },
      ],
    },
  ],
  a11y: {
    keyboard: [
      { keys: 'Enter / ↓', action: 'Move to the next line\'s input (its figure is selected for overtyping). On the last line, Enter moves to the post button.' },
      { keys: '↑', action: 'Move to the previous line\'s input.' },
      { keys: 'Tab / ⇧Tab', action: 'Leave the table in document order.' },
      { keys: 'Enter / Space on the button', action: 'Post the lot, or state every error and focus the first.' },
    ],
    notes: [
      'A real <table> with <th scope="col"> headers and a hidden <caption>; totals are a <tfoot> with <th scope="row"> labels, outside the line model.',
      '↑/↓ are taken from the native number input on purpose: in a typist table the figure changes only when the reader types it.',
      'Each input has its own accessible name from inputLabel; an error sets aria-invalid and is joined to the input by aria-describedby, as is the save state.',
      'Save states are words from the catalog, never colour alone; only "failed" is red, and only the word and its dot.',
      'Bounds errors follow B11 timing: on blur, then on every keystroke once shown.',
      'Lifecycle: render Skeleton rows while lines load, an EmptyState when a document has no lines, and a Banner for a document that failed to load — the table itself is the loaded state.',
    ],
  },
  donts: [
    'Never Enter-to-post — posting is one deliberate press of the one button.',
    'Never an editable column that is not a number; a row of text inputs is a form (B11).',
    'Never two entry columns in one table — that is two passes, or a form per line.',
    'Never a total the component derived; pass totals pre-formatted.',
    'Never adds, removes, sorts, filters or pages lines while entry is open.',
    'Never a save state as colour alone.',
  ],
  faq: [
    { q: 'EntryTable or DataTable?', a: 'Does the reader type into the rows? If they read, open and select, it is B7. If they type a figure into every line and post, it is B53.' },
    { q: 'Why does Enter not submit?', a: 'A typist presses Enter after every figure. If Enter posted, the first line would post the receipt. Enter moves down; the post is its own keystroke.' },
    { q: 'Why must I write the bounds sentence?', a: 'The bound is a number, and C9 keeps number formatting at the caller. "Enter 0 to 1 200" and "Enter 0 to 1,200" are both right somewhere.' },
    { q: 'Can it sit directly in a Card?', a: 'Yes — like B7 it draws its rows to the card\'s edge, with the 18px inset on its cells.' },
  ],
};
