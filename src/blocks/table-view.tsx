// Orders table view — filters, statuses, paginated ERP grid.
import { useState } from 'react';
import {
  Sheet,
  Row,
  Card,
  CardHead,
  CardTabs,
  DataTable,
  StatusWord,
  ButtonLink,
  useToast,
} from '@/components/seventy-six';

interface Order {
  id: string;
  customer: string;
  status: { tone: 'ok' | 'neutral' | 'bad'; label: string };
  total: string;
}

const ORDERS: Order[] = [
  { id: 'ORD-10482', customer: 'Northwind Freight', status: { tone: 'neutral', label: 'Pending' }, total: '$4,820' },
  { id: 'ORD-10481', customer: 'Halden Instruments', status: { tone: 'ok', label: 'Shipped' }, total: '$12,940' },
  { id: 'ORD-10479', customer: 'Cedar & Vale Co.', status: { tone: 'ok', label: 'Shipped' }, total: '$1,284' },
  { id: 'ORD-10478', customer: 'Meridian Foods', status: { tone: 'neutral', label: 'Pending' }, total: '$7,650' },
  { id: 'ORD-10476', customer: 'Orbit Supply', status: { tone: 'bad', label: 'On hold' }, total: '$482' },
  { id: 'ORD-10475', customer: 'Halden Instruments', status: { tone: 'ok', label: 'Shipped' }, total: '$9,310' },
];

const FILTERS = [
  { id: 'all', label: 'All', count: 248 },
  { id: 'pending', label: 'Pending', count: 42 },
  { id: 'shipped', label: 'Shipped', count: 191 },
];

export function TableView() {
  const [active, setActive] = useState('all');
  const { toast } = useToast();

  return (
    <Sheet aria-label="Orders">
      <Row split="full">
        <Card>
          <CardHead
            title="Orders"
            subtitle="Last 30 days"
            action={<ButtonLink href="#">Export</ButtonLink>}
          />
          <CardTabs mode="filters" tabs={FILTERS} active={active} onChange={setActive} />
          <DataTable
            caption="Orders in the last 30 days"
            rows={ORDERS}
            rowKey={(r) => r.id}
            onRowOpen={(r) => toast(`Opening ${r.id}`)}
            announcement={`${ORDERS.length} orders · ${FILTERS.find((f) => f.id === active)?.label}`}
            page={{ from: 1, to: 6, of: 248, onPrev: undefined, onNext: () => toast('Loading next page') }}
            columns={[
              { key: 'id', header: 'ORDER', kind: 'id', render: (r) => r.id },
              { key: 'customer', header: 'CUSTOMER', render: (r) => r.customer },
              {
                key: 'status',
                header: 'STATUS',
                kind: 'status',
                render: (r) => <StatusWord tone={r.status.tone}>{r.status.label}</StatusWord>,
              },
              { key: 'total', header: 'TOTAL', kind: 'num', render: (r) => r.total },
            ]}
          />
        </Card>
      </Row>
    </Sheet>
  );
}
