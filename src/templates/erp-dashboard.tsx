// 76° ERP operations overview — seed cobalt.
import { useState } from 'react';
import {
  Band, BandTopbar, BandNav, BandSubTabs, PageHero, Sheet, Row, Card, CardHead,
  StatS1, DataTable, StatusWord, CardTabs, ActivityList, MeterList, Button, useToast,
} from '@/components/seventy-six';

const svg = (d: string) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
);
const iRevenue = svg('M8 1v14|M11 4H6.5a2 2 0 000 4h3a2 2 0 010 4H4');
const iOrders = svg('M2 5l6-3 6 3v6l-6 3-6-3z|M2 5l6 3 6-3|M8 8v6');
const iFill = svg('M2 8l4 4 8-8');
const iValue = svg('M2 4l6-2 6 2-6 2z|M2 4v8l6 2 6-2V4');

type Order = { id: string; customer: string; status: string; tone: 'ok' | 'neutral' | 'bad'; total: string };
const ORDERS: Order[] = [
  { id: 'ORD-10482', customer: 'Northwind Trading', status: 'Shipped', tone: 'ok', total: '$18,240' },
  { id: 'ORD-10481', customer: 'Contoso Freight', status: 'Pending', tone: 'neutral', total: '$9,510' },
  { id: 'ORD-10479', customer: 'Fabrikam Retail', status: 'Shipped', tone: 'ok', total: '$24,880' },
  { id: 'ORD-10478', customer: 'Adventure Works', status: 'Delayed', tone: 'bad', total: '$3,120' },
  { id: 'ORD-10476', customer: 'Tailspin Depot', status: 'Pending', tone: 'neutral', total: '$12,640' },
  { id: 'ORD-10475', customer: 'Wingtip Supply', status: 'Shipped', tone: 'ok', total: '$7,905' },
];

const FILTERS = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'pending', label: 'Pending', count: 2 },
  { id: 'shipped', label: 'Shipped', count: 3 },
];

export function ErpDashboard() {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const rows = ORDERS.filter((o) => filter === 'all' || o.status.toLowerCase() === filter);

  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar
          app="Warehouse"
          nav={<BandNav items={[
            { label: 'Overview', href: '#', active: true },
            { label: 'Orders', href: '#orders' },
            { label: 'Inventory', href: '#inventory' },
            { label: 'Suppliers', href: '#suppliers' },
          ]} />}
          utilities={<Button variant="ghost" className="sv-mono" aria-label="Search, Command K">SEARCH ⌘K</Button>}
        />
        <BandSubTabs items={[
          { label: 'Today', href: '#today', active: true },
          { label: '7 days', href: '#week' },
          { label: 'Month', href: '#month' },
        ]} />
        <PageHero
          headingLevel={1}
          title="Overview"
          context="24 Jul · all zones · synced 2 min ago"
          actions={<>
            <Button variant="ghost">Export</Button>
            <Button variant="primary" onClick={() => toast('Order draft created', 'ok')}>Create order</Button>
          </>}
        />
      </Band>

      <Sheet aria-label="Warehouse overview">
        <Row split="stats" overlap>
          <StatS1 label="REVENUE · MTD" value="$482,190" delta={6} icon={iRevenue} footnote={<>target <b>$540,000</b></>} footnoteText="target $540,000" />
          <StatS1 label="OPEN ORDERS" value="1,284" delta={-3} icon={iOrders} footnote={<><b>42</b> awaiting pick</>} footnoteText="42 awaiting pick" />
          <StatS1 label="FILL RATE" value="96.4" unit="%" delta={1} icon={iFill} footnote={<>SLA floor <b>95%</b></>} footnoteText="SLA floor 95%" />
          <StatS1 label="ON-HAND VALUE" value="$2.94M" delta={2} icon={iValue} footnote={<>across <b>4</b> zones</>} footnoteText="across 4 zones" />
        </Row>

        <Row split="main">
          <Card>
            <CardHead title="Orders" subtitle="Live queue across all zones" />
            <CardTabs mode="filters" tabs={FILTERS} active={filter} onChange={setFilter} idBase="orders" />
            <DataTable
              caption="Recent orders"
              rowKey={(r) => r.id}
              rows={rows}
              announcement={`${rows.length} orders shown`}
              page={{ from: 1, to: rows.length, of: 1284 }}
              columns={[
                { key: 'id', header: 'ORDER', kind: 'id', render: (r) => r.id },
                { key: 'customer', header: 'CUSTOMER', kind: 'text', render: (r) => r.customer },
                { key: 'status', header: 'STATUS', kind: 'status', render: (r) => <StatusWord tone={r.tone}>{r.status}</StatusWord> },
                { key: 'total', header: 'TOTAL', kind: 'num', render: (r) => r.total },
              ]}
            />
          </Card>
          <Card>
            <CardHead title="Activity" subtitle="Zone events, newest first" />
            <ActivityList items={[
              { time: '14:28', dateTime: '2026-07-24T14:28:00+03:00', children: <><b>ORD-10482</b> shipped from <b>Zone A</b></> },
              { time: '14:05', dateTime: '2026-07-24T14:05:00+03:00', children: <><b>PO-2291</b> received, 320 pallets</> },
              { time: '13:47', dateTime: '2026-07-24T13:47:00+03:00', children: <><b>ORD-10478</b> flagged delayed by <b>M. Reyes</b></> },
              { time: '13:12', dateTime: '2026-07-24T13:12:00+03:00', children: <>Cycle count closed in <b>Zone C</b></> },
              { time: '12:38', dateTime: '2026-07-24T12:38:00+03:00', children: <><b>SKU-8840</b> dropped to reorder point</> },
              { time: '11:59', dateTime: '2026-07-24T11:59:00+03:00', children: <><b>ORD-10475</b> picked and staged</> },
            ]} />
          </Card>
        </Row>

        <Row split="main">
          <Card>
            <CardHead title="Warehouse utilization" subtitle="Pallet positions by zone" />
            <div className="sv-card__body">
            <MeterList items={[
              { label: 'Zone A · Ambient', current: 4320, max: 4700, value: '92%', subtitle: '4,320 of 4,700 pallet positions' },
              { label: 'Zone B · Cold', current: 1880, max: 2400, value: '78%', subtitle: '1,880 of 2,400 pallet positions' },
              { label: 'Zone C · Bulk', current: 3110, max: 3200, value: '97%', subtitle: '3,110 of 3,200 pallet positions' },
              { label: 'Zone D · Returns', current: 640, max: 1500, value: '43%', subtitle: '640 of 1,500 pallet positions' },
            ]} />
            </div>
          </Card>
          <Card>
            <CardHead title="Backorders" subtitle="Oldest awaiting replenishment" />
            <DataTable
              caption="Backordered SKUs"
              rowKey={(r) => r.id}
              rows={[
                { id: 'SKU-8840', customer: 'Aged 6 days', status: 'Delayed', tone: 'bad' as const, total: '1,200' },
                { id: 'SKU-4102', customer: 'Aged 3 days', status: 'Pending', tone: 'neutral' as const, total: '640' },
                { id: 'SKU-7715', customer: 'Aged 2 days', status: 'Pending', tone: 'neutral' as const, total: '318' },
              ]}
              columns={[
                { key: 'id', header: 'SKU', kind: 'id', render: (r) => r.id },
                { key: 'customer', header: 'AGE', kind: 'text', render: (r) => r.customer },
                { key: 'status', header: 'STATUS', kind: 'status', render: (r) => <StatusWord tone={r.tone}>{r.status}</StatusWord> },
                { key: 'total', header: 'UNITS', kind: 'num', render: (r) => r.total },
              ]}
            />
          </Card>
        </Row>
      </Sheet>
    </div>
  );
}
