import { useState } from 'react';
import type { ComponentType, FormEvent } from 'react';
import {
  ActivityList,
  Badge,
  Band,
  BandNav,
  BandSubTabs,
  BandTopbar,
  Banner,
  Button,
  ButtonLink,
  Card,
  Combobox,
  CardHead,
  CardTabs,
  Checkbox,
  DataTable,
  Dialog,
  Drawer,
  EmptyState,
  Field,
  MenuButton,
  MeterList,
  PageHero,
  PinField,
  Plate,
  PlateHead,
  Progress,
  Row,
  SearchCommand,
  Select,
  Skeleton,
  SocialButton,
  SplitButton,
  StatS1,
  StatusWord,
  Toggle,
  Tooltip,
  Trend,
  useSearchCommand,
  useToast,
} from '@/components/seventy-six';

/* Shared demo icons — 16px stroke, seed color comes from the tile. */
const IconCoins = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" />
    <path d="M11 5.5a4.5 4.5 0 1 1-5.4 5.4" />
  </svg>
);
const IconBox = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 5l6-3 6 3v6l-6 3-6-3V5zM2 5l6 3 6-3M8 8v6" strokeLinejoin="round" />
  </svg>
);
const IconTag = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 2h5.5L14 8.5 8.5 14 2 7.5V2z" strokeLinejoin="round" />
    <circle cx="5.5" cy="5.5" r="0.5" />
  </svg>
);

/* ------------------------------------------------ Button */

function ButtonVariants() {
  return (
    <div className="demo-row">
      <Button variant="primary">Create order</Button>
      <Button variant="ghost">Export July</Button>
      <Button variant="danger">Delete draft</Button>
      <ButtonLink href="#/components/button">View all</ButtonLink>
    </div>
  );
}

function ButtonStates() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="demo-row">
      <Button
        variant="primary"
        isLoading={loading}
        loadingLabel="Saving…"
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1800);
        }}
      >
        Save changes
      </Button>
      <Button variant="primary" disabled>
        Approve PO-2291
      </Button>
    </div>
  );
}

function ButtonPos() {
  return (
    <div className="demo-row">
      <Button variant="ghost" pos>
        Iced latte · $4.50
      </Button>
      <Button variant="primary" pos>
        Charge $23.80
      </Button>
    </div>
  );
}

/* ------------------------------------------------ StatusWord */

function StatusTones() {
  return (
    <div className="demo-row">
      <StatusWord tone="ok">Fulfilled</StatusWord>
      <StatusWord tone="neutral">Pending</StatusWord>
      <StatusWord tone="bad">On hold</StatusWord>
    </div>
  );
}

const miniOrders = [
  { id: 'ORD-10482', customer: 'Nasra Ali', status: 'Fulfilled', tone: 'ok' as const, total: '$482.19' },
  { id: 'ORD-10476', customer: 'Bloom Retail', status: 'Pending', tone: 'neutral' as const, total: '$1,204.00' },
  { id: 'ORD-10471', customer: 'Deka Wholesale', status: 'On hold', tone: 'bad' as const, total: '$310.75' },
];

function StatusTable() {
  return (
    <DataTable
      caption="Orders by status"
      rows={miniOrders}
      rowKey={(o) => o.id}
      columns={[
        { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
        { key: 'status', header: 'STATUS', kind: 'status', render: (o) => <StatusWord tone={o.tone}>{o.status}</StatusWord> },
        { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
      ]}
    />
  );
}

/* ------------------------------------------------ Card */

function CardBasic() {
  return (
    <Card>
      <CardHead
        title="Open orders"
        subtitle="Updated 14:32 · warehouse A"
        action={<ButtonLink href="#/components/card">View all</ButtonLink>}
      />
      <p className="site-prose site-prose--tight">
        The widget body renders here — a table, a meter list, an activity feed. The head stays
        universal.
      </p>
    </Card>
  );
}

/* ------------------------------------------------ Dialog */

function DialogBasic() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-row">
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Archive order
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Archive ORD-10482?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Archive order
            </Button>
          </>
        }
      >
        The order moves to the archive and leaves the open-orders table. You can restore it from
        Reports → Archive.
      </Dialog>
    </div>
  );
}

function DialogDestructive() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <div className="demo-row">
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete order
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete ORD-10482?"
        destructive
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              data-confirm
              onClick={() => {
                setOpen(false);
                toast('Order ORD-10482 deleted', 'ok');
              }}
            >
              Delete order
            </Button>
          </>
        }
      >
        This permanently removes the order and its 3 line items. This cannot be undone.
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------ Toast */

function ToastBasic() {
  const { notify } = useToast();
  return (
    <div className="demo-row">
      <Button
        variant="ghost"
        onClick={() =>
          notify({
            tone: 'info',
            title: 'Export started',
            description: 'July orders — 2,400 rows. We will notify you here when the file is ready.',
          })
        }
      >
        Export July
      </Button>
      <Button
        variant="primary"
        onClick={() =>
          notify({
            tone: 'ok',
            title: 'Order ORD-10482 created',
            description: '3 lines · Corridor Foods · dispatch queued.',
          })
        }
      >
        Create order
      </Button>
    </div>
  );
}

function ToastError() {
  const { notify } = useToast();
  return (
    <div className="demo-row">
      <Button
        variant="ghost"
        onClick={() =>
          notify({
            tone: 'warn',
            title: 'Sync degraded',
            description: 'Prices last updated 42 minutes ago. Orders still submit; totals may lag.',
          })
        }
      >
        Degrade sync
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          notify({
            tone: 'bad',
            title: 'Export failed — storage full',
            description: 'The July file was not written. Free space in Settings → Storage, then retry.',
          })
        }
      >
        Fail export
      </Button>
    </div>
  );
}

/* ------------------------------------------------ v0.2.0 · interaction layer */

const DEMO_CUSTOMERS = [
  { value: 'c-101', label: 'Almeida Logistics', meta: 'C-101' },
  { value: 'c-114', label: 'Bantam Freight', meta: 'C-114' },
  { value: 'c-127', label: 'Corridor Foods', meta: 'C-127' },
  { value: 'c-133', label: 'Delta Provisions', meta: 'C-133' },
  { value: 'c-140', label: 'Eastgate Retail', meta: 'C-140' },
  { value: 'c-152', label: 'Fairline Imports', meta: 'C-152' },
  { value: 'c-166', label: 'Granary Wholesale', meta: 'C-166' },
  { value: 'c-171', label: 'Harbor & Sons', meta: 'C-171' },
  { value: 'c-185', label: 'Interport Trading', meta: 'C-185' },
  { value: 'c-190', label: 'Junction Foods', meta: 'C-190' },
  { value: 'c-204', label: 'Keystone Dairy', meta: 'C-204' },
  { value: 'c-211', label: 'Lattice Supply', meta: 'C-211' },
];

function ComboboxBasic() {
  const [customer, setCustomer] = useState<string | null>('c-127');
  return (
    <div style={{ maxWidth: 340 }}>
      <Combobox
        label="Customer"
        options={DEMO_CUSTOMERS}
        value={customer}
        onChange={(v) => setCustomer(v)}
        placeholder="Type a name or C-number"
        hint="Search across 12 accounts by name or ID."
      />
    </div>
  );
}

function ComboboxError() {
  const [assignee, setAssignee] = useState<string | null>(null);
  return (
    <div style={{ maxWidth: 340 }}>
      <Combobox
        label="Assignee"
        required
        options={DEMO_CUSTOMERS.slice(0, 5)}
        value={assignee}
        onChange={(v) => setAssignee(v)}
        error={assignee ? undefined : 'Pick an assignee — orders cannot dispatch unassigned.'}
        emptyText="No one matches. Check the spelling or invite them from Settings → Team."
      />
    </div>
  );
}

function MenuBasic() {
  const { notify } = useToast();
  const say = (title: string) => notify({ tone: 'info', title });
  return (
    <div className="demo-row">
      <MenuButton
        label="Actions"
        items={[
          { label: 'Duplicate order', onSelect: () => say('Order duplicated as ORD-10483') },
          { label: 'Export as CSV', onSelect: () => say('Export started — ORD-10482'), meta: '⌘E' },
          'separator',
          { label: 'Archive order', onSelect: () => say('Archive needs a confirm Dialog'), danger: true },
        ]}
      />
    </div>
  );
}

function SplitBasic() {
  const { notify } = useToast();
  return (
    <div className="demo-row">
      <SplitButton
        label="Create order"
        onClick={() => notify({ tone: 'ok', title: 'Order ORD-10484 created' })}
        items={[
          { label: 'Create draft order', onSelect: () => notify({ tone: 'info', title: 'Draft order started' }) },
          { label: 'Create from template', onSelect: () => notify({ tone: 'info', title: 'Pick a template to continue' }) },
        ]}
      />
    </div>
  );
}

function DrawerBasic() {
  const [open, setOpen] = useState(false);
  const { notify } = useToast();
  return (
    <div className="demo-row">
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Review ORD-10482
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Order ORD-10482"
        context="CORRIDOR FOODS · 24 JUL · 3 LINES"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setOpen(false);
                notify({ tone: 'ok', title: 'Order ORD-10482 approved' });
              }}
            >
              Approve order
            </Button>
          </>
        }
      >
        <MeterList
          items={[
            { label: 'Picked', current: 3, max: 3, value: '100%', subtitle: '3 of 3 lines picked' },
            { label: 'Packed', current: 2, max: 3, value: '67%', subtitle: '2 of 3 lines packed' },
            { label: 'Invoiced', current: 0, max: 3, value: '0%', subtitle: '0 of 3 lines invoiced' },
          ]}
        />
      </Drawer>
    </div>
  );
}

function DialogFull() {
  const [open, setOpen] = useState(false);
  const { notify } = useToast();
  return (
    <div className="demo-row">
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Compose purchase order
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Compose purchase order"
        size="full"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Discard
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setOpen(false);
                notify({ tone: 'ok', title: 'Purchase order PO-2291 created' });
              }}
            >
              Create purchase order
            </Button>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 'var(--sv-s4)', maxWidth: 480 }}>
          <Field label="Supplier" placeholder="Granary Wholesale" />
          <Field label="Reference" placeholder="PO-2291" />
        </div>
      </Dialog>
    </div>
  );
}

function BannerTones() {
  const [showOk, setShowOk] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 'var(--sv-s3)' }}>
      <Banner tone="info" title="Import running">
        1,204 of 2,400 rows processed. You can keep working — we will notify you here.
      </Banner>
      {showOk && (
        <Banner tone="ok" title="Backup complete" onDismiss={() => setShowOk(false)}>
          All 14 tables copied to cold storage at 03:00.
        </Banner>
      )}
      <Banner tone="warn" title="Sync degraded" action={<ButtonLink href="#retry">Retry sync</ButtonLink>}>
        Prices last updated 42 minutes ago. Orders still submit; totals may lag.
      </Banner>
      <Banner tone="bad" title="Submit failed — 2 fields need fixes">
        Quantity must be a whole number above 0. Customer is required.
      </Banner>
    </div>
  );
}

function BadgeBasic() {
  return (
    <div className="demo-row">
      <Badge>B2B</Badge>
      <Badge>EU-WEST</Badge>
      <Badge>V2</Badge>
      <Badge tone="seed">CURRENT PLAN</Badge>
    </div>
  );
}

/* ------------------------------------------------ Tooltip */

function TooltipBasic() {
  return (
    <div className="demo-row">
      <Tooltip content="Exports the filtered view · ⌘E">
        <Button variant="ghost">Export July</Button>
      </Tooltip>
      <Tooltip content="Created 24 JUL 14:32 by Nasra Ali">
        <Button variant="ghost">ORD-10482</Button>
      </Tooltip>
    </div>
  );
}

const IconInfo = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 7.25v4M8 4.75h.01" strokeLinecap="round" />
  </svg>
);

function TooltipIcon() {
  return (
    <div className="demo-row">
      <Tooltip content="Totals exclude tax and shipping · updated 14:32">
        <Button variant="ghost" aria-label="About this total" iconLeading={IconInfo} />
      </Tooltip>
    </div>
  );
}

/* ------------------------------------------------ EmptyState */

function EmptyBasic() {
  return (
    <EmptyState
      sentence="No orders yet — orders appear here as soon as a sales channel syncs."
      action={<Button variant="primary">Connect channel</Button>}
    />
  );
}

function EmptyFiltered() {
  return (
    <EmptyState
      sentence="No orders match “On hold · warehouse B”. Widen the filter or clear it to see the other 246 orders."
      action={<Button variant="primary">Clear filters</Button>}
    />
  );
}

/* ------------------------------------------------ Skeleton */

function SkeletonStat() {
  return (
    <Card className="demo-skeleton-card">
      <div className="demo-skeleton-zone">
        <Skeleton width={120} height={10} />
      </div>
      <div className="demo-skeleton-zone demo-skeleton-mid">
        <Skeleton width={34} height={34} />
        <Skeleton width={96} height={24} />
      </div>
      <div className="demo-skeleton-zone demo-skeleton-foot">
        <Skeleton height={12} />
      </div>
    </Card>
  );
}

/* ------------------------------------------------ SearchCommand */

function CommandBasic() {
  const search = useSearchCommand();
  return (
    <div className="demo-row">
      <Button variant="ghost" onClick={search.show}>
        Search (⌘K)
      </Button>
      <SearchCommand
        open={search.open}
        onClose={search.hide}
        bindShortcut={false}
        placeholder="SEARCH ORDERS, PRODUCTS, PAGES…"
        items={[
          { id: 'ord-10482', group: 'ORDERS', label: 'ORD-10482 · Nasra Ali', hint: '$482.19' },
          { id: 'ord-10476', group: 'ORDERS', label: 'ORD-10476 · Bloom Retail', hint: '$1,204.00' },
          { id: 'page-inventory', group: 'PAGES', label: 'Inventory', hint: 'G THEN I' },
          { id: 'page-reports', group: 'PAGES', label: 'Reports', hint: 'G THEN R' },
        ]}
        onPick={() => undefined}
      />
    </div>
  );
}

/* ------------------------------------------------ StatS1 */

function StatRowDemo() {
  return (
    <div className="demo-grid-2">
      <StatS1
        label="REVENUE · MTD"
        value="$482,190"
        delta={12.4}
        icon={IconCoins}
        footnote={
          <>
            <b>$610K</b> target · 79% with 7 days left
          </>
        }
        footnoteText="$610K target, 79% reached with 7 days left"
      />
      <StatS1
        label="OPEN ORDERS"
        value="1,284"
        delta={-3.1}
        icon={IconBox}
        footnote={
          <>
            oldest open order is <b>4 days</b> · SLA is 5
          </>
        }
        footnoteText="Oldest open order is 4 days, SLA is 5"
      />
    </div>
  );
}

function StatNoDelta() {
  return (
    <div className="demo-grid-2">
      <StatS1
        label="ACTIVE SKUS"
        value="4,207"
        icon={IconTag}
        footnote={
          <>
            <b>312</b> added this quarter across 3 categories
          </>
        }
        footnoteText="312 added this quarter across 3 categories"
      />
    </div>
  );
}

/* ------------------------------------------------ Progress */

function ProgressBasic() {
  return (
    <div className="demo-narrow">
      <Progress
        title="July revenue target"
        current={482190}
        target={610000}
        format={(c, t) => `$${(c / 1000).toFixed(0)}K / $${(t / 1000).toFixed(0)}K`}
        context="79% · 7 days remaining"
      />
    </div>
  );
}

function ProgressOver() {
  return (
    <div className="demo-narrow">
      <Progress
        title="Q3 units shipped vs target"
        current={9360}
        target={9000}
        format={(c, t) => `${c.toLocaleString('en-US')} / ${t.toLocaleString('en-US')} units`}
        context="104% of target · bar caps at 100%, the overage lives in this line"
      />
    </div>
  );
}

/* ------------------------------------------------ Trend */

const july = [12, 14, 13, 16, 18, 17, 19, 22, 21, 24, 23, 26, 28, 27, 30, 29, 32, 34, 33, 36, 38, 37, 40, 42];
const june = [11, 12, 13, 12, 14, 15, 16, 15, 17, 18, 17, 19, 20, 21, 20, 22, 23, 22, 24, 25, 26, 25, 27, 28];

function TrendLine() {
  return (
    <Card>
      <CardHead title="Revenue" subtitle="Daily · July vs June" />
      <div className="trend-pad">
        <Trend
          ariaLabel="Revenue trending up: $482K month to date against $431K at this point in June"
          series={[
            { label: 'July', data: july, tone: 'seed' },
            { label: 'June', data: june, tone: 'compare' },
          ]}
          legend
          xLabels={['01 JUL', '08 JUL', '15 JUL', '22 JUL']}
        />
      </div>
    </Card>
  );
}

function TrendBar() {
  return (
    <Card>
      <CardHead title="Orders by weekday" subtitle="Last 7 days" />
      <div className="trend-pad">
        <Trend
          kind="bar"
          ariaLabel="Orders per weekday peaking Thursday at 312"
          series={[{ label: 'Orders', data: [180, 224, 251, 312, 296, 142, 98], tone: 'seed' }]}
          xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
          height={120}
        />
      </div>
    </Card>
  );
}

/* ------------------------------------------------ MeterList */

function MeterBasic() {
  return (
    <Card>
      <CardHead title="Capacity" subtitle="By zone · live" />
      <div className="trend-pad">
        <MeterList
          items={[
            { label: 'Zone A · ambient', current: 4320, max: 4700, value: '92%', subtitle: '4,320 of 4,700 pallet positions' },
            { label: 'Zone B · chilled', current: 1180, max: 1600, value: '74%', subtitle: '1,180 of 1,600 pallet positions' },
            { label: 'Zone C · bonded', current: 410, max: 900, value: '46%', subtitle: '410 of 900 pallet positions' },
          ]}
        />
      </div>
    </Card>
  );
}

function MeterCritical() {
  return (
    <Card>
      <CardHead title="Capacity" subtitle="By zone · live" />
      <div className="trend-pad">
        <MeterList
          items={[
            { label: 'Zone A · ambient', current: 4630, max: 4700, value: '99%', subtitle: '4,630 of 4,700 — only 70 positions left, reorder space now' },
            { label: 'Zone B · chilled', current: 1180, max: 1600, value: '74%', subtitle: '1,180 of 1,600 pallet positions' },
            { label: 'Zone C · bonded', current: 410, max: 900, value: '46%', subtitle: '410 of 900 pallet positions' },
          ]}
        />
      </div>
    </Card>
  );
}

/* ------------------------------------------------ DataTable */

const orders = [
  { id: 'ORD-10482', customer: 'Nasra Ali', status: 'Fulfilled', tone: 'ok' as const, total: '$482.19' },
  { id: 'ORD-10476', customer: 'Bloom Retail', status: 'Pending', tone: 'neutral' as const, total: '$1,204.00' },
  { id: 'ORD-10471', customer: 'Deka Wholesale', status: 'On hold', tone: 'bad' as const, total: '$310.75' },
  { id: 'ORD-10469', customer: 'Sahan Coffee', status: 'Fulfilled', tone: 'ok' as const, total: '$96.40' },
  { id: 'ORD-10462', customer: 'Harbor & Co', status: 'Pending', tone: 'neutral' as const, total: '$2,090.00' },
];

function TableFull() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  return (
    <Card>
      <CardHead title="Open orders" subtitle="July · warehouse A" action={<ButtonLink href="#/components/data-table">View all</ButtonLink>} />
      <DataTable
        caption="Open orders"
        rows={orders}
        rowKey={(o) => o.id}
        selectable
        selected={selected}
        onSelect={setSelected}
        onRowOpen={(o) => toast(`Opening ${o.id}`, 'info')}
        announcement={`${orders.length} orders shown`}
        columns={[
          { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
          { key: 'customer', header: 'CUSTOMER', render: (o) => o.customer },
          { key: 'status', header: 'STATUS', kind: 'status', render: (o) => <StatusWord tone={o.tone}>{o.status}</StatusWord> },
          { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
        ]}
        page={{ from: 1, to: 5, of: 248, onNext: () => toast('Next page', 'info') }}
      />
    </Card>
  );
}

const draftInvoices = [
  { id: 'INV-3320', customer: 'Bloom Retail', total: '$1,204.00' },
  { id: 'INV-3319', customer: 'Deka Wholesale', total: '$310.75' },
  { id: 'INV-3317', customer: 'Harbor & Co', total: '$2,090.00' },
  { id: 'INV-3312', customer: 'Sahan Coffee', total: '$96.40' },
];

function TableSelect() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const count = selected.size;
  return (
    <Card>
      <CardHead
        title="Draft invoices"
        subtitle="July · unsent"
        action={
          <ButtonLink
            href="#/components/data-table"
            aria-disabled={count === 0 || undefined}
            onClick={(e) => {
              e.preventDefault();
              if (count > 0) toast(`Sending ${count} invoice${count === 1 ? '' : 's'}`, 'info');
            }}
          >
            {count > 0 ? `Send ${count}` : 'Send selected'}
          </ButtonLink>
        }
      />
      <DataTable
        caption="Draft invoices"
        rows={draftInvoices}
        rowKey={(r) => r.id}
        selectable
        selected={selected}
        onSelect={setSelected}
        announcement={`${count} of ${draftInvoices.length} invoices selected`}
        columns={[
          { key: 'id', header: 'INVOICE', kind: 'id', render: (r) => r.id },
          { key: 'customer', header: 'CUSTOMER', render: (r) => r.customer },
          { key: 'total', header: 'TOTAL', kind: 'num', render: (r) => r.total },
        ]}
      />
    </Card>
  );
}

/* ------------------------------------------------ CardTabs */

function CardTabsBasic() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? orders : orders.filter((o) => (filter === 'pending' ? o.tone === 'neutral' : o.tone === 'bad'));
  return (
    <Card>
      <CardHead title="Orders" subtitle="July · warehouse A" />
      <CardTabs
        mode="filters"
        tabs={[
          { id: 'all', label: 'All', count: orders.length },
          { id: 'pending', label: 'Pending', count: 2 },
          { id: 'hold', label: 'On hold', count: 1 },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        caption="Orders filtered"
        rows={filtered}
        rowKey={(o) => o.id}
        announcement={`${filtered.length} orders · ${filter}`}
        columns={[
          { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
          { key: 'status', header: 'STATUS', kind: 'status', render: (o) => <StatusWord tone={o.tone}>{o.status}</StatusWord> },
          { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
        ]}
      />
    </Card>
  );
}

const invoices = [
  { id: 'INV-3320', customer: 'Bloom Retail', status: 'Paid', tone: 'ok' as const, total: '$1,204.00' },
  { id: 'INV-3319', customer: 'Deka Wholesale', status: 'Due', tone: 'neutral' as const, total: '$310.75' },
  { id: 'INV-3317', customer: 'Harbor & Co', status: 'Overdue', tone: 'bad' as const, total: '$2,090.00' },
  { id: 'INV-3312', customer: 'Sahan Coffee', status: 'Paid', tone: 'ok' as const, total: '$96.40' },
  { id: 'INV-3308', customer: 'Nasra Ali', status: 'Due', tone: 'neutral' as const, total: '$482.19' },
];

function CardTabsCounts() {
  const [filter, setFilter] = useState('all');
  const count = (tone: 'ok' | 'neutral' | 'bad') => invoices.filter((i) => i.tone === tone).length;
  const filtered =
    filter === 'all'
      ? invoices
      : invoices.filter((i) => (filter === 'paid' ? i.tone === 'ok' : filter === 'due' ? i.tone === 'neutral' : i.tone === 'bad'));
  return (
    <Card>
      <CardHead title="Invoices" subtitle="July · receivables" />
      <CardTabs
        mode="filters"
        tabs={[
          { id: 'all', label: 'All', count: invoices.length },
          { id: 'paid', label: 'Paid', count: count('ok') },
          { id: 'due', label: 'Due', count: count('neutral') },
          { id: 'overdue', label: 'Overdue', count: count('bad') },
        ]}
        active={filter}
        onChange={setFilter}
      />
      <DataTable
        caption="Invoices filtered"
        rows={filtered}
        rowKey={(i) => i.id}
        announcement={`${filtered.length} invoices · ${filter}`}
        columns={[
          { key: 'id', header: 'INVOICE', kind: 'id', render: (i) => i.id },
          { key: 'status', header: 'STATUS', kind: 'status', render: (i) => <StatusWord tone={i.tone}>{i.status}</StatusWord> },
          { key: 'total', header: 'TOTAL', kind: 'num', render: (i) => i.total },
        ]}
      />
    </Card>
  );
}

/* ------------------------------------------------ ActivityList */

function ActivityBasic() {
  return (
    <Card>
      <CardHead title="Activity" subtitle="Today · all zones" action={<ButtonLink href="#/components/activity-list">View log</ButtonLink>} />
      <ActivityList
        items={[
          { time: '14:28', dateTime: '2026-07-24T14:28:00+03:00', children: (<><b>ORD-10482</b> picked complete — 12 of 12 items</>) },
          { time: '13:51', dateTime: '2026-07-24T13:51:00+03:00', children: (<><b>PO-2291</b> approved by <b>Nasra Ali</b></>) },
          { time: '11:04', dateTime: '2026-07-24T11:04:00+03:00', children: (<>Zone B temperature back in range after <b>18 min</b></>) },
        ]}
      />
    </Card>
  );
}

function ActivityRelative() {
  return (
    <Card>
      <CardHead title="Pipeline activity" subtitle="Today · West team" action={<ButtonLink href="#/components/activity-list">View log</ButtonLink>} />
      <ActivityList
        items={[
          { time: '15:12', dateTime: '2026-07-24T15:12:00+03:00', children: (<><b>Acme Corp</b> deal moved to <b>Negotiation</b> — $48K</>) },
          { time: '13:40', dateTime: '2026-07-24T13:40:00+03:00', children: (<><b>Priya Nair</b> booked a demo for <b>Northwind</b></>) },
          { time: '11:26', dateTime: '2026-07-24T11:26:00+03:00', children: (<><b>Deka Wholesale</b> replied — awaiting a revised quote</>) },
        ]}
      />
    </Card>
  );
}

/* ------------------------------------------------ Band */

function BandFull() {
  return (
    <div className="demo-band-frame">
      <Band>
        <BandTopbar
          app="Warehouse"
          nav={
            <BandNav
              items={[
                { label: 'Overview', href: '#/components/band', active: true },
                { label: 'Operations', href: '#/components/band' },
                { label: 'Inventory', href: '#/components/band' },
                { label: 'Reports', href: '#/components/band' },
              ]}
            />
          }
          utilities={
            <span className="site-search sv-mono" aria-hidden="true">
              SEARCH <kbd className="site-kbd">⌘K</kbd>
            </span>
          }
        />
        <BandSubTabs
          items={[
            { label: 'ORDERS', href: '#/components/band', active: true },
            { label: 'PICKING', href: '#/components/band' },
            { label: 'DISPATCH', href: '#/components/band' },
          ]}
        />
        <PageHero
          headingLevel={2}
          title="Good afternoon,"
          titleSoft="Warehouse A"
          context="24 JUL · all zones · synced 14:32"
          actions={<Button variant="primary">Create order</Button>}
        />
      </Band>
    </div>
  );
}

/* ------------------------------------------------ Sheet */

function SheetSkeleton() {
  return (
    <div className="demo-sheet-mini">
      <div className="demo-sheet-band" aria-hidden="true" />
      <Row split="stats" overlap>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="demo-sheet-card" aria-label={`Stat placeholder ${i}`} />
        ))}
      </Row>
      <Row split="main">
        <Card className="demo-sheet-card demo-sheet-card--tall" aria-label="Chart placeholder" />
        <Card className="demo-sheet-card demo-sheet-card--tall" aria-label="Meter placeholder" />
      </Row>
    </div>
  );
}

/* ------------------------------------------------ Forms */

function FormBasic() {
  return (
    <div className="demo-form">
      <Field label="Quantity" hint="Whole units, per carton" required inputMode="numeric" placeholder="0" />
      <Select label="Zone" required defaultValue="a">
        <option value="a">Zone A · ambient</option>
        <option value="b">Zone B · chilled</option>
      </Select>
      <Checkbox label="Notify the picking team" defaultChecked />
      <Toggle label="Auto-print labels" />
    </div>
  );
}

function FormError() {
  return (
    <div className="demo-form">
      <Field label="Quantity" required defaultValue="-2" error="Quantity must be a whole number above 0" />
    </div>
  );
}

/* ------------------------------------------------ v0.3.0 · auth layer */

/* A Plate IS a page: inside a preview tile it drops its viewport height
   and its own padding, and the preview wall stands in for the wall. */
const plateFit = { minHeight: 0, padding: 0 } as const;
const stackTight = { display: 'grid', gap: 'var(--sv-s2)' } as const;
const stackForm = { display: 'grid', gap: 'var(--sv-s4)' } as const;
const pairCols = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sv-s4)' } as const;
const orRule = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  gap: 'var(--sv-s3)',
  margin: 'var(--sv-s5) 0',
} as const;
const hairline = { height: '1px', background: 'var(--sv-line)' } as const;
const softInk = { color: 'var(--sv-ink-soft)' } as const;
const seedLink = { color: 'var(--sv-seed-text)' } as const;
const fullWidth = { width: '100%' } as const;
const plateFoot = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--sv-s3) var(--sv-s4)',
  justifyContent: 'space-between',
  marginTop: 'var(--sv-s4)',
} as const;
const authNarrow = { maxWidth: 340 } as const;

function hold(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

/* ------------------------------------------------ Plate */

function PlateBasic() {
  return (
    <Plate
      style={plateFit}
      footer={
        <>
          Trouble signing in?{' '}
          <a href="#support" style={seedLink}>
            Contact support
          </a>
        </>
      }
    >
      <PlateHead title="Sign in" context="Northwind operations console" />

      <div style={stackTight}>
        <SocialButton provider="google" />
        <SocialButton provider="apple" />
        <SocialButton provider="github" />
      </div>

      <div style={orRule}>
        <span style={hairline} aria-hidden="true" />
        <span className="sv-mono" style={softInk}>
          Or
        </span>
        <span style={hairline} aria-hidden="true" />
      </div>

      <form style={stackForm} onSubmit={hold} noValidate>
        <Field label="Email" type="email" required autoComplete="email" inputMode="email" />
        <Field label="Password" type="password" required autoComplete="current-password" />
        <Button type="submit" variant="primary" style={fullWidth}>
          Sign in
        </Button>
      </form>

      <div style={plateFoot}>
        <ButtonLink href="#reset">Forgot password?</ButtonLink>
        <ButtonLink href="#sign-up">Create an account</ButtonLink>
      </div>
    </Plate>
  );
}

function PlateError() {
  return (
    <Plate style={plateFit} footer="ERR-4041 · 25 JUL 09:14 UTC">
      <PlateHead
        title="Page not found"
        context="The address is right but nothing is filed under it. It may have been renamed or archived."
      />
      <Button variant="primary" style={fullWidth}>
        Back to the dashboard
      </Button>
    </Plate>
  );
}

function PlateWide() {
  return (
    <Plate
      width="md"
      style={plateFit}
      footer={
        <a href="#signin" style={seedLink}>
          Back to sign in
        </a>
      }
    >
      <PlateHead title="Create account" context="Northwind operations console" />
      <form style={stackForm} onSubmit={hold} noValidate>
        <div style={pairCols}>
          <Field label="First name" required autoComplete="given-name" />
          <Field label="Last name" required autoComplete="family-name" />
        </div>
        <Field label="Work email" type="email" required autoComplete="email" inputMode="email" />
        <Field
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          hint="At least 12 characters. A phrase you have not used elsewhere works well."
        />
        <Button type="submit" variant="primary" style={fullWidth}>
          Create account
        </Button>
      </form>
    </Plate>
  );
}

/* ------------------------------------------------ PinField */

function PinBasic() {
  const [code, setCode] = useState('');
  return (
    <form style={{ ...stackForm, ...authNarrow }} onSubmit={hold} noValidate>
      <PinField
        label="Verification code"
        hint="Six digits, valid for 10 minutes"
        name="code"
        value={code}
        onChange={setCode}
      />
      <Button type="submit" variant="primary" style={fullWidth}>
        Verify email
      </Button>
    </form>
  );
}

function PinError() {
  return (
    <div style={authNarrow}>
      <PinField
        label="Verification code"
        hint="Six digits, valid for 10 minutes"
        defaultValue="418311"
        error="That code did not match. Retype it from the email, or resend the code."
      />
    </div>
  );
}

function PinAlpha() {
  return (
    <div style={authNarrow}>
      <PinField
        label="Invitation code"
        length={8}
        charset="alphanumeric"
        hint="Eight characters from the invitation email"
        name="invite_code"
      />
    </div>
  );
}

/* ------------------------------------------------ SocialButton */

function SocialStack() {
  const { notify } = useToast();
  const start = (provider: string) => notify({ tone: 'info', title: `Handing off to ${provider}` });
  return (
    <div style={{ ...stackTight, ...authNarrow }}>
      <SocialButton provider="google" onClick={() => start('Google')} />
      <SocialButton provider="apple" onClick={() => start('Apple')} />
      <SocialButton provider="github" onClick={() => start('GitHub')} />
    </div>
  );
}

function SocialSignup() {
  return (
    <div style={{ ...stackTight, ...authNarrow }}>
      <SocialButton provider="google" action="Sign up with" />
      <SocialButton provider="microsoft" action="Sign up with" />
    </div>
  );
}

function SocialLoading() {
  const [handing, setHanding] = useState<string | null>(null);
  const start = (provider: string) => {
    setHanding(provider);
    setTimeout(() => setHanding(null), 1800);
  };
  return (
    <div style={{ ...stackTight, ...authNarrow }}>
      <SocialButton provider="google" isLoading={handing === 'google'} onClick={() => start('google')} />
      <SocialButton provider="github" isLoading={handing === 'github'} onClick={() => start('github')} />
    </div>
  );
}

/* ------------------------------------------------ registry */

export const demos: Record<string, ComponentType> = {
  'button-variants': ButtonVariants,
  'button-states': ButtonStates,
  'button-pos': ButtonPos,
  'status-tones': StatusTones,
  'status-table': StatusTable,
  'card-basic': CardBasic,
  'dialog-basic': DialogBasic,
  'dialog-full': DialogFull,
  'dialog-destructive': DialogDestructive,
  'toast-basic': ToastBasic,
  'toast-error': ToastError,
  'tooltip-basic': TooltipBasic,
  'tooltip-icon': TooltipIcon,
  'empty-basic': EmptyBasic,
  'empty-filtered': EmptyFiltered,
  'skeleton-stat': SkeletonStat,
  'command-basic': CommandBasic,
  'stat-row': StatRowDemo,
  'stat-nodelta': StatNoDelta,
  'progress-basic': ProgressBasic,
  'progress-over': ProgressOver,
  'trend-line': TrendLine,
  'trend-bar': TrendBar,
  'meter-basic': MeterBasic,
  'meter-critical': MeterCritical,
  'table-full': TableFull,
  'table-select': TableSelect,
  'cardtabs-basic': CardTabsBasic,
  'cardtabs-counts': CardTabsCounts,
  'activity-basic': ActivityBasic,
  'activity-relative': ActivityRelative,
  'sheet-skeleton': SheetSkeleton,
  'band-full': BandFull,
  'form-basic': FormBasic,
  'form-error': FormError,
  'combobox-basic': ComboboxBasic,
  'combobox-error': ComboboxError,
  'menu-basic': MenuBasic,
  'split-basic': SplitBasic,
  'drawer-basic': DrawerBasic,
  'banner-tones': BannerTones,
  'badge-basic': BadgeBasic,
  'plate-basic': PlateBasic,
  'plate-error': PlateError,
  'plate-wide': PlateWide,
  'pin-basic': PinBasic,
  'pin-error': PinError,
  'pin-alpha': PinAlpha,
  'social-stack': SocialStack,
  'social-signup': SocialSignup,
  'social-loading': SocialLoading,
};
