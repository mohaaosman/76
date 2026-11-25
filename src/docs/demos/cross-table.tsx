import type { ComponentType } from 'react';
import { CrossTable } from '@/components/seventy-six/cross-table';

/* Revenue by region and quarter, FY2026, $ thousands. Every row total is its
   four quarters, every column total its four regions, and both sets of
   totals meet at 5,383.5:
     rows    1,800.0 + 1,209.5 + 1,479.5 + 894.5 = 5,383.5
     columns 1,255.3 + 1,304.4 + 1,349.4 + 1,474.4 = 5,383.5
   The marked cell is the largest intersection, North in Q4. */
function CrossRevenue() {
  return (
    <CrossTable
      caption="Revenue by region and quarter, FY2026, $ thousands"
      rowDimension="Region"
      colDimension="Quarter"
      measure="Revenue ($K)"
      columns={[
        { key: 'q1', header: 'Q1' },
        { key: 'q2', header: 'Q2' },
        { key: 'q3', header: 'Q3' },
        { key: 'q4', header: 'Q4' },
      ]}
      rows={[
        { key: 'north', header: 'North' },
        { key: 'south', header: 'South' },
        { key: 'east', header: 'East' },
        { key: 'west', header: 'West' },
      ]}
      cells={{
        north: { q1: '412.6', q2: '438.9', q3: '451.2', q4: '497.3' },
        south: { q1: '288.4', q2: '301.7', q3: '296.5', q4: '322.9' },
        east: { q1: '356.0', q2: '349.2', q3: '371.8', q4: '402.5' },
        west: { q1: '198.3', q2: '214.6', q3: '229.9', q4: '251.7' },
      }}
      rowTotals={{ north: '1,800.0', south: '1,209.5', east: '1,479.5', west: '894.5' }}
      colTotals={{ q1: '1,255.3', q2: '1,304.4', q3: '1,349.4', q4: '1,474.4' }}
      grandTotal="5,383.5"
      highlight={{ row: 'north', col: 'q4', note: 'largest intersection' }}
    />
  );
}

/* Shipments by warehouse and carrier, July 2026. A carrier that does not
   serve a warehouse is an em dash, never a zero. Row totals:
     WH-A  1,240 + 860 + 412 + 2,075 = 4,587
     WH-B  980 + 655 + 318 + 244 + 1,130 = 3,327
     WH-C  1,415 + 290 + 176 + 640 = 2,521 */
function CrossShipments() {
  return (
    <div style={{ maxWidth: 560 }}>
      <CrossTable
        caption="Shipments by warehouse and carrier, July 2026"
        rowDimension="Warehouse"
        colDimension="Carrier"
        measure="Shipments"
        columns={[
          { key: 'dhl', header: 'DHL' },
          { key: 'maersk', header: 'Maersk' },
          { key: 'aramex', header: 'Aramex' },
          { key: 'fedex', header: 'FedEx' },
          { key: 'ups', header: 'UPS' },
          { key: 'fleet', header: 'Own fleet' },
        ]}
        rows={[
          { key: 'a', code: 'WH-A', header: 'Mogadishu' },
          { key: 'b', code: 'WH-B', header: 'Nairobi' },
          { key: 'c', code: 'WH-C', header: 'Djibouti' },
        ]}
        cells={{
          a: { dhl: '1,240', maersk: '860', aramex: '412', fedex: null, ups: null, fleet: '2,075' },
          b: { dhl: '980', maersk: null, aramex: '655', fedex: '318', ups: '244', fleet: '1,130' },
          c: { dhl: null, maersk: '1,415', aramex: '290', fedex: null, ups: '176', fleet: '640' },
        }}
        rowTotals={{ a: '4,587', b: '3,327', c: '2,521' }}
      />
    </div>
  );
}

export const crossTableDemos: Record<string, ComponentType> = {
  'cross-revenue': CrossRevenue,
  'cross-shipments': CrossShipments,
};
