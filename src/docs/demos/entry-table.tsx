import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { EntryTable } from '@/components/seventy-six/entry-table';
import type { EntryColumn, EntrySync } from '@/components/seventy-six/entry-table';

/* Goods receipt against PO-2291 — five lines from Harbor & Co. Ordered
   quantities sum to 128 units: 12 + 48 + 24 + 36 + 8. */
interface PoLine {
  sku: string;
  item: string;
  ordered: number;
}

const LINES: PoLine[] = [
  { sku: 'SKU-4471', item: 'Pallet racking upright, 2.4m', ordered: 12 },
  { sku: 'SKU-4472', item: 'Racking beam, 2.7m', ordered: 48 },
  { sku: 'SKU-3108', item: 'Wire mesh deck', ordered: 24 },
  { sku: 'SKU-5520', item: 'Row spacer, 300mm', ordered: 36 },
  { sku: 'SKU-0912', item: 'Anchor bolt M12, box of 50', ordered: 8 },
];

const ORDERED_TOTAL = LINES.reduce((sum, l) => sum + l.ordered, 0); // 128

const COLUMNS: EntryColumn<PoLine>[] = [
  { key: 'sku', header: 'SKU', kind: 'id', render: (l) => l.sku },
  { key: 'item', header: 'ITEM', render: (l) => l.item },
  { key: 'ordered', header: 'ORDERED', kind: 'num', render: (l) => String(l.ordered) },
  { key: 'received', header: 'RECEIVED', kind: 'entry' },
];

/* The caller sums and formats; the component never does (C9). */
function receivedTotal(values: Record<string, string>): string {
  const n = LINES.reduce((sum, l) => {
    const v = Number(values[l.sku]);
    return sum + (values[l.sku]?.trim() && Number.isFinite(v) ? v : 0);
  }, 0);
  return n.toLocaleString('en-US');
}

function EntryReceipt() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);
  const [sync, setSync] = useState<Record<string, EntrySync>>({});
  const [posted, setPosted] = useState<string>();
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const entered = LINES.filter((l) => (values[l.sku] ?? '').trim() !== '');

  function post() {
    setPosting(true);
    setSync(Object.fromEntries(entered.map((l) => [l.sku, 'saving' as const])));
    timer.current = window.setTimeout(() => {
      setPosting(false);
      setSync({});
      setPosted(`Posted GR-50817 · ${entered.length} of ${LINES.length} lines · ${receivedTotal(values)} units`);
      setValues({});
    }, 1400);
  }

  return (
    <div>
      <EntryTable
        caption="Goods receipt for PO-2291, Harbor & Co"
        columns={COLUMNS}
        rows={LINES}
        rowKey={(l) => l.sku}
        values={values}
        onValueChange={(key, value) => {
          setPosted(undefined);
          setValues((prev) => ({ ...prev, [key]: value }));
          setSync((prev) => ({ ...prev, [key]: 'unsaved' }));
        }}
        bounds={(l) => ({ min: 0, max: l.ordered, step: 1 })}
        boundsError={(l) => `Enter 0 to ${l.ordered} — PO-2291 ordered ${l.ordered}.`}
        inputLabel={(l) => `Received, ${l.sku}`}
        sync={sync}
        totals={[
          {
            label: 'TOTAL UNITS',
            cells: { ordered: String(ORDERED_TOTAL), received: receivedTotal(values) },
            strong: true,
          },
        ]}
        summary={posted ?? `${entered.length} of ${LINES.length} lines counted`}
        onPost={post}
        posting={posting}
        postingLabel="Posting…"
      />
    </div>
  );
}

/* The states, held still: a compact ledger mid-session. SKU-4472 is
   waiting to save, SKU-3108 is saving, SKU-5520 failed on the server and
   SKU-0912 is over its bound (10 typed against 8 ordered). */
function EntryStates() {
  const [values, setValues] = useState<Record<string, string>>({
    'SKU-4471': '12',
    'SKU-4472': '40',
    'SKU-3108': '24',
    'SKU-5520': '30',
    'SKU-0912': '10',
  });
  return (
    <div data-density="compact">
      <EntryTable
        caption="Goods receipt for PO-2291, in progress"
        columns={COLUMNS}
        rows={LINES}
        rowKey={(l) => l.sku}
        values={values}
        onValueChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        bounds={(l) => ({ min: 0, max: l.ordered, step: 1 })}
        boundsError={(l) => `Enter 0 to ${l.ordered} — PO-2291 ordered ${l.ordered}.`}
        inputLabel={(l) => `Received, ${l.sku}`}
        sync={{ 'SKU-4472': 'unsaved', 'SKU-3108': 'saving', 'SKU-5520': 'failed' }}
        errors={{
          'SKU-5520': 'Bin B-14 is full. Choose another bin for SKU-5520, then post again.',
          'SKU-0912': 'Enter 0 to 8 — PO-2291 ordered 8.',
        }}
        summary="5 of 5 lines counted · 2 need attention"
        onPost={() => undefined}
      />
    </div>
  );
}

export const entryTableDemos: Record<string, ComponentType> = {
  'entry-table-receipt': EntryReceipt,
  'entry-table-states': EntryStates,
};
