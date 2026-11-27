import { useState } from 'react';
import type { ComponentType } from 'react';
import { Button } from '@/components/seventy-six/button';
import { Card, CardHead } from '@/components/seventy-six/card';
import { CardTabs } from '@/components/seventy-six/card-tabs';
import { DataState } from '@/components/seventy-six/data-state';
import type { DataStatus } from '@/components/seventy-six/data-state';
import { DataTable } from '@/components/seventy-six/data-table';
import type { Column } from '@/components/seventy-six/data-table';
import { StatusWord } from '@/components/seventy-six/status-word';

interface Order {
  id: string;
  customer: string;
  status: 'Shipped' | 'Pending' | 'Delayed';
  total: string;
}

const ORDERS: Order[] = [
  { id: 'ORD-10482', customer: 'Northwind Trading', status: 'Shipped', total: '$18,240' },
  { id: 'ORD-10481', customer: 'Contoso Freight', status: 'Pending', total: '$9,510' },
  { id: 'ORD-10479', customer: 'Fabrikam Retail', status: 'Shipped', total: '$24,880' },
  { id: 'ORD-10478', customer: 'Adventure Works', status: 'Delayed', total: '$3,120' },
];

const tone = { Shipped: 'ok', Pending: 'neutral', Delayed: 'bad' } as const;

const columns: Column<Order>[] = [
  { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
  { key: 'customer', header: 'CUSTOMER', render: (o) => o.customer },
  { key: 'status', header: 'STATUS', render: (o) => <StatusWord tone={tone[o.status]}>{o.status}</StatusWord> },
  { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
];

function DataStateFour() {
  const [status, setStatus] = useState<DataStatus>('loading');
  return (
    <Card>
      <CardHead title="Orders" subtitle="Switch the state the data is in" />
      <CardTabs
        mode="filters"
        active={status}
        onChange={(id) => setStatus(id as DataStatus)}
        tabs={[
          { id: 'loading', label: 'Loading' },
          { id: 'empty', label: 'Empty' },
          { id: 'error', label: 'Error' },
          { id: 'ready', label: 'Ready' },
        ]}
      />
      <DataState
        status={status}
        loadingLabel="Loading orders"
        minHeight={226}
        empty={{
          sentence: 'No orders were placed today. Orders placed before midnight appear here as they arrive.',
          action: <Button variant="ghost">Open yesterday’s orders</Button>,
        }}
        error={{
          title: 'Orders did not load',
          body: 'The order service did not answer within 10 seconds. Nothing on this page was changed. Load the orders again; if it keeps failing, check the status page.',
          action: (
            <Button variant="ghost" onClick={() => setStatus('loading')}>
              Load orders again
            </Button>
          ),
        }}
      >
        <DataTable caption="Today’s orders" columns={columns} rows={ORDERS} rowKey={(o) => o.id} />
      </DataState>
    </Card>
  );
}

const MANY: Order[] = Array.from({ length: 24 }, (_, i) => {
  const base = ORDERS[i % ORDERS.length];
  return { ...base, id: `ORD-${10482 - i}` };
});

function TableCapped() {
  return (
    <Card>
      <CardHead title="Order queue" subtitle="24 orders · the header holds while the body scrolls" />
      <DataTable
        caption="Order queue"
        columns={columns}
        rows={MANY}
        rowKey={(o) => o.id}
        maxHeight={280}
      />
    </Card>
  );
}

export const dataStateDemos: Record<string, ComponentType> = {
  'datastate-four': DataStateFour,
  'table-capped': TableCapped,
};
