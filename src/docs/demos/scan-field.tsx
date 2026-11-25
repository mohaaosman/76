import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { ScanField } from '@/components/seventy-six/scan-field';
import type { ScanResult } from '@/components/seventy-six/scan-field';

/* The same PO-2291 receipt the EntryTable demo posts: five lines, the
   counts start at what the dock has already booked today. */
const PO: Record<string, { item: string; ordered: number; received: number }> = {
  'SKU-4471': { item: 'Pallet racking upright, 2.4m', ordered: 12, received: 2 },
  'SKU-4472': { item: 'Racking beam, 2.7m', ordered: 48, received: 40 },
  'SKU-3108': { item: 'Wire mesh deck', ordered: 24, received: 24 },
  'SKU-5520': { item: 'Row spacer, 300mm', ordered: 36, received: 0 },
  'SKU-0912': { item: 'Anchor bolt M12, box of 50', ordered: 8, received: 5 },
};

function ScanReceive() {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(Object.entries(PO).map(([k, v]) => [k, v.received])),
  );
  /* Read inside the lookup's timeout, so it must be the latest count, not
     the one captured when the scan arrived — a fast gun outruns a render. */
  const countsRef = useRef(counts);
  countsRef.current = counts;
  const [last, setLast] = useState<ScanResult>();
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onScan(raw: string) {
    const id = raw.toUpperCase();
    /* The lookup takes a moment; the line says so rather than going blank. */
    setLast({ id, tone: 'pending', text: 'Looking up on PO-2291' });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const line = PO[id];
      if (!line) {
        setLast({ id, tone: 'bad', text: 'Not on PO-2291. Check the label, or set the carton aside for returns.' });
        return;
      }
      const have = countsRef.current[id];
      if (have >= line.ordered) {
        setLast({
          id,
          tone: 'bad',
          text: `${line.item} · all ${line.ordered} already received. Set this carton aside as over-delivery.`,
        });
        return;
      }
      const next = have + 1;
      countsRef.current = { ...countsRef.current, [id]: next };
      setCounts(countsRef.current);
      setLast({ id, tone: 'ok', text: `${line.item} · ${next} of ${line.ordered} received` });
    }, 500);
  }

  return (
    <div style={{ maxWidth: 440 }}>
      <ScanField
        label="Carton barcode"
        hint="Scan or type, then press Enter. Try SKU-4471, SKU-3108 or SKU-9999."
        onScan={onScan}
        last={last}
      />
    </div>
  );
}

function ScanStates() {
  return (
    <div style={{ maxWidth: 440, display: 'grid', gap: 18 }}>
      <ScanField label="Bin location" onScan={() => undefined} />
      <ScanField
        label="Carton barcode"
        onScan={() => undefined}
        last={{ id: 'SKU-4472', tone: 'ok', text: 'Racking beam, 2.7m · 41 of 48 received' }}
      />
      <ScanField
        label="Carton barcode"
        onScan={() => undefined}
        last={{ id: 'SKU-9999', tone: 'bad', text: 'Not on PO-2291. Check the label, or set the carton aside for returns.' }}
      />
      <ScanField label="Carton barcode" onScan={() => undefined} disabled />
    </div>
  );
}

export const scanFieldDemos: Record<string, ComponentType> = {
  'scan-field-receive': ScanReceive,
  'scan-field-states': ScanStates,
};
