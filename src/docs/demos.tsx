import { useState } from 'react';
import type { ComponentType, FormEvent, ReactNode } from 'react';
import {
  Accordion,
  ActivityList,
  Avatar,
  AvatarGroup,
  Badge,
  Busy,
  CallToAction,
  CaptionRow,
  ErrorSummary,
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
  CodeBlock,
  DataTable,
  DateRangeField,
  Delta,
  DescriptionList,
  Dialog,
  DistributionStrip,
  Divider,
  Drawer,
  EmptyState,
  FeatureList,
  Field,
  FileField,
  FilterBar,
  FilterLine,
  IndexRow,
  Kbd,
  Masthead,
  MenuButton,
  MeterList,
  NumberField,
  PageHero,
  PinField,
  Plate,
  PlateHead,
  Popover,
  ProofRow,
  Progress,
  Prose,
  Radio,
  Row,
  SearchCommand,
  SearchField,
  Select,
  SelectionHead,
  SiteFooter,
  SumList,
  Skeleton,
  Slider,
  SocialButton,
  Sparkline,
  Spinner,
  SplitButton,
  StatS1,
  StatusWord,
  Stepper,
  TabPanel,
  Tabs,
  Timeline,
  Toggle,
  Tooltip,
  Trend,
  TreeList,
  useSearchCommand,
  useToast,
} from '@/components/seventy-six';
import type { FileRow, FieldError } from '@/components/seventy-six';

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
const pairCols = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--sv-s4)' } as const;
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

/* ------------------------------------------------ Accordion */

const orderSections = [
  { id: 'lines', title: 'Line items', meta: '14 SKUS', children: <p>Fourteen SKUs across three pallets. Two lines are short-picked and route to the overflow bay.</p> },
  { id: 'ship', title: 'Shipping', meta: 'DHL · 24 JUL', children: <p>DHL Express, collected 24 JUL 14:28, tracking 8471 2290 4471.</p> },
  { id: 'audit', title: 'Audit trail', meta: '6 EVENTS', children: <p>Created by A. Yusuf, approved by K. Berg, released to the floor at 09:12.</p> },
];

function AccordionBasic() {
  return (
    <Accordion sections={orderSections.map((s, i) => ({ ...s, defaultOpen: i === 0 }))} />
  );
}

function AccordionExclusive() {
  return <Accordion exclusive name="demo-sections" sections={orderSections} />;
}

/* ------------------------------------------------ DescriptionList */

function DescriptionRecord() {
  return (
    <DescriptionList
      rows={[
        { term: 'ORDER', kind: 'id', children: 'ORD-10482' },
        { term: 'CUSTOMER', children: 'Halcyon Freight' },
        { term: 'STATUS', children: <StatusWord tone="ok">Fulfilled</StatusWord> },
        { term: 'RELEASED', children: '24 JUL · 09:12' },
        { term: 'TOTAL', kind: 'num', children: '$18,240.00' },
      ]}
    />
  );
}

/* ------------------------------------------------ Divider */

function DividerBasic() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Divider />
      <Divider label="OR" />
      <Divider label="ARCHIVED" align="start" />
    </div>
  );
}

/* ------------------------------------------------ Avatar */

const team = [
  { name: 'Amina Yusuf' },
  { name: 'Karl Berg' },
  { name: 'Priya Raman' },
  { name: 'Tomas Nowak' },
  { name: 'Lena Fischer' },
  { name: 'Sam Okonkwo' },
];

function AvatarGroupDemo() {
  return (
    <div className="demo-row">
      <Avatar name="Amina Yusuf" size="lg" />
      <Avatar name="Karl Berg" tone="seed" />
      <span className="demo-row" style={{ gap: 8 }}>
        <AvatarGroup people={team} max={4} />
        <span style={{ fontSize: 12.5, color: 'var(--sv-ink-soft)' }}>Assigned to the July close</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------ Spinner & Busy */

function SpinnerBasic() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <span className="demo-row" style={{ gap: 8, fontSize: 12.5, color: 'var(--sv-ink-soft)' }}>
        <Spinner label="Saving" />
        Saving draft…
      </span>
      <Busy label="Loading July orders…" minHeight={120} />
    </div>
  );
}

function SpinnerOver() {
  const [busy, setBusy] = useState(false);
  const figures = (
    <DescriptionList
      rows={[
        { term: 'OPEN ORDERS', kind: 'num', children: '248' },
        { term: 'PICKED TODAY', kind: 'num', children: '1,412' },
      ]}
    />
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="demo-row">
        <Button variant="ghost" onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1800); }}>
          Refresh figures
        </Button>
      </div>
      {busy ? (
        <Busy label="Refreshing figures…" minHeight={90}>
          {figures}
        </Busy>
      ) : (
        figures
      )}
    </div>
  );
}

/* ------------------------------------------------ Kbd */

function KbdBasic() {
  return (
    <div className="demo-row" style={{ fontSize: 12.5, color: 'var(--sv-ink-soft)' }}>
      <span className="demo-row" style={{ gap: 8 }}>
        <Kbd keys={['⌘', 'K']} /> Search
      </span>
      <span className="demo-row" style={{ gap: 8 }}>
        <Kbd keys={['G', 'O']} separator="then" /> Go to orders
      </span>
      <span className="demo-row" style={{ gap: 8 }}>
        <Kbd keys={['Esc']} /> Close
      </span>
    </div>
  );
}

/* ------------------------------------------------ NumberField */

function NumberBasic() {
  const [qty, setQty] = useState(12);
  return (
    <div className="demo-form">
      <NumberField
        label="Pallet positions"
        hint="Whole pallets only — partials go on the overflow line."
        value={qty}
        onValueChange={setQty}
        min={1}
        max={48}
        unit="pallets"
      />
    </div>
  );
}

function NumberError() {
  const [value, setValue] = useState(5200);
  return (
    <div className="demo-form">
      <NumberField
        label="Reorder point"
        value={value}
        onValueChange={setValue}
        step={100}
        max={9000}
        error={value > 4700 ? 'Reorder point must be below the maximum stock level of 4,700.' : undefined}
      />
    </div>
  );
}

/* ------------------------------------------------ Slider */

function SliderBasic() {
  const [threshold, setThreshold] = useState(40);
  return (
    <div className="demo-form">
      <Slider
        label="Alert threshold"
        hint="Below this, the warehouse raises a replenishment task."
        value={threshold}
        onValueChange={setThreshold}
        step={5}
        format={(v) => `${v}%`}
      />
    </div>
  );
}

/* ------------------------------------------------ DateRangeField */

function DateRangeBasic() {
  const [range, setRange] = useState({ from: '2026-06-26', to: '2026-07-25' });
  return (
    <div className="demo-form">
      <DateRangeField label="Reporting period" value={range} onValueChange={setRange} today="2026-07-25" />
    </div>
  );
}

function DateRangeError() {
  const [range, setRange] = useState({ from: '2026-07-30', to: '2026-07-02' });
  return (
    <div className="demo-form">
      <DateRangeField label="Reporting period" value={range} onValueChange={setRange} today="2026-07-25" />
    </div>
  );
}

/* ------------------------------------------------ Delta & Sparkline */

function DeltaInline() {
  return (
    <DescriptionList
      rows={[
        { term: 'REVENUE MTD', children: <span className="demo-row" style={{ gap: 10 }}>$482,190 <Delta value={12.4} /></span> },
        { term: 'COST PER ORDER', children: <span className="demo-row" style={{ gap: 10 }}>$4.18 <Delta value={-6.2} polarity="down-good" /></span> },
        {
          term: 'ORDERS / DAY',
          children: (
            <span className="demo-row" style={{ gap: 10 }}>
              312 <Sparkline data={[180, 224, 251, 198, 262, 296, 312]} ariaLabel="Orders per day, trending up over seven days" />
            </span>
          ),
        },
      ]}
    />
  );
}

function TrendStacked() {
  return (
    <Card>
      <CardHead title="Volume by channel" subtitle="Parts of one total" />
      <div className="trend-pad">
        <Trend
          kind="stacked"
          legend
          ariaLabel="Weekly volume by channel, total peaking Thursday at 412 orders"
          series={[
            { label: 'Direct', data: [120, 148, 161, 202, 186, 92, 61] },
            { label: 'Partner', data: [40, 52, 58, 141, 78, 34, 22] },
            { label: 'Marketplace', data: [20, 24, 32, 69, 32, 16, 15] },
          ]}
          xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
          height={140}
        />
      </div>
    </Card>
  );
}

/* ------------------------------------------------ Selection head & filter line */

function TableSelectionHead() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { notify } = useToast();
  const count = selected.size;
  return (
    <Card>
      {count > 0 ? (
        <SelectionHead
          count={count}
          noun="invoice"
          onClear={() => setSelected(new Set())}
          actions={
            <>
              <Button variant="ghost" onClick={() => notify({ tone: 'ok', title: `Sent ${count} invoice${count === 1 ? '' : 's'}` })}>
                Send {count}
              </Button>
              <Button variant="danger" onClick={() => notify({ tone: 'warn', title: 'Deleting confirms in a dialog first' })}>
                Delete
              </Button>
            </>
          }
        />
      ) : (
        <CardHead title="Draft invoices" subtitle="July · unsent" />
      )}
      <FilterLine
        count={`${draftInvoices.length} of 248`}
        filters={[
          { label: 'Status', value: 'Draft' },
          { label: 'Period', value: 'July' },
        ]}
        onClearAll={() => notify({ tone: 'info', title: 'Filters cleared' })}
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

/* ------------------------------------------------ SearchField */

const SEARCH_ORDERS = [
  { ref: 'ORD-10482', customer: 'Northwind Trading' },
  { ref: 'ORD-10481', customer: 'Contoso Freight' },
  { ref: 'ORD-10479', customer: 'Fabrikam Retail' },
  { ref: 'ORD-10478', customer: 'Adventure Works' },
  { ref: 'ORD-10476', customer: 'Tailspin Depot' },
  { ref: 'ORD-10475', customer: 'Wingtip Supply' },
];

function SearchBasic() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const matches = SEARCH_ORDERS.filter(
    (o) => o.ref.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q),
  );
  return (
    <div className="demo-form">
      <SearchField
        label="Search orders"
        placeholder="Reference, customer, or PO number"
        hint="Filters the list below as you type."
        value={query}
        onValueChange={setQuery}
        resultText={`${matches.length} of ${SEARCH_ORDERS.length} match`}
      />
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {matches.map((o) => (
          <li
            key={o.ref}
            style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--sv-line)', fontSize: 12.5 }}
          >
            <span className="sv-mono" style={{ color: 'var(--sv-ink-soft)' }}>{o.ref}</span>
            <span>{o.customer}</span>
          </li>
        ))}
        {matches.length === 0 && (
          <li style={{ padding: '6px 0', fontSize: 12.5, color: 'var(--sv-ink-soft)' }}>
            No order matches “{query}”. Search by reference, customer, or PO number.
          </li>
        )}
      </ul>
    </div>
  );
}

function SearchInline() {
  const [query, setQuery] = useState('');
  /* No resultText inside a FilterBar: the FilterLine below it announces
     the change, and two live regions for one change is a defect (B7). */
  return (
    <FilterBar
      label="Order filters"
      active={query !== ''}
      onClearAll={() => setQuery('')}
      controls={
        <SearchField
          label="Search orders"
          labelHidden
          placeholder="Search orders"
          value={query}
          onValueChange={setQuery}
        />
      }
    />
  );
}

/* ------------------------------------------------ FileField */

const FILE_ROWS: FileRow[] = [
  { id: '1', name: 'july-actuals.csv', size: '2.4 MB', status: 'uploading', percent: 62 },
  { id: '2', name: 'q2-forecast.xlsx', size: '1.1 MB', status: 'done' },
  { id: '3', name: 'depot-codes.csv', size: '318 KB', status: 'uploading', percent: 0 },
];

function FileBasic() {
  const [files, setFiles] = useState<FileRow[]>(FILE_ROWS);
  const { notify } = useToast();
  return (
    <div className="demo-form" style={{ maxWidth: 460 }}>
      <FileField
        label="Import files"
        hint="The importer reads the first sheet of each workbook."
        constraint="CSV · XLSX · MAX 10 MB"
        accept=".csv,.xlsx"
        files={files}
        onAdd={(added) => {
          notify({ tone: 'info', title: `${added.length} file${added.length === 1 ? '' : 's'} queued` });
          setFiles((prev) => [
            ...prev,
            ...added.map((f, i) => ({
              id: `new-${prev.length + i}`,
              name: f.name,
              size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
              status: 'uploading' as const,
              percent: 0,
            })),
          ]);
        }}
        onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    </div>
  );
}

function FileError() {
  const [files, setFiles] = useState<FileRow[]>([
    {
      id: '1',
      name: 'full-export.xlsx',
      size: '18.2 MB',
      status: 'error',
      error: 'Over the 10 MB limit. Compress it or split it into two files.',
    },
  ]);
  return (
    <div className="demo-form" style={{ maxWidth: 460 }}>
      <FileField
        label="Import files"
        constraint="CSV · XLSX · MAX 10 MB"
        files={files}
        onAdd={() => undefined}
        onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    </div>
  );
}

/* ------------------------------------------------ Tabs */

function TabsBasic() {
  const [section, setSection] = useState('summary');
  return (
    <div>
      <Tabs
        label="Report sections"
        idBase="demo-report"
        active={section}
        onChange={setSection}
        tabs={[
          { id: 'summary', label: 'Summary' },
          { id: 'lines', label: 'Line items', count: 148 },
          { id: 'audit', label: 'Audit', count: 6 },
        ]}
      />
      <TabPanel idBase="demo-report" tabId="summary" active={section === 'summary'}>
        <Card style={{ marginTop: 14 }}>
          <CardHead title="Summary" subtitle="July · warehouse A" />
          <div className="trend-pad">
            <MeterList
              items={[
                { label: 'Invoiced', current: 412, max: 480, value: '86%', subtitle: '412 of 480 lines invoiced' },
                { label: 'Reconciled', current: 388, max: 480, value: '81%', subtitle: '388 of 480 lines reconciled' },
              ]}
            />
          </div>
        </Card>
      </TabPanel>
      <TabPanel idBase="demo-report" tabId="lines" active={section === 'lines'}>
        <Card style={{ marginTop: 14 }}>
          <CardHead title="Line items" subtitle="148 lines · July" />
          <DataTable
            caption="Report line items"
            rows={draftInvoices.slice(0, 3)}
            rowKey={(r) => r.id}
            columns={[
              { key: 'id', header: 'LINE', kind: 'id', render: (r) => r.id },
              { key: 'customer', header: 'CUSTOMER', render: (r) => r.customer },
              { key: 'total', header: 'TOTAL', kind: 'num', render: (r) => r.total },
            ]}
          />
        </Card>
      </TabPanel>
      <TabPanel idBase="demo-report" tabId="audit" active={section === 'audit'}>
        <Card style={{ marginTop: 14 }}>
          <CardHead title="Audit" subtitle="6 events" />
          <ActivityList
            items={[
              { id: 'a', time: '14:28', children: <><b>M. Reyes</b> reopened the period</> },
              { id: 'b', time: '11:04', children: <>Report locked by <b>A. Yusuf</b></> },
            ]}
          />
        </Card>
      </TabPanel>
    </div>
  );
}

/* ------------------------------------------------ Stepper */

const ONBOARDING = [
  { id: 'account', label: 'Account', note: 'Created 12 Jul' },
  { id: 'contract', label: 'Contract', note: 'Signed 14 Jul' },
  { id: 'kyc', label: 'Verification' },
  { id: 'live', label: 'Go live' },
];

function StepperBasic() {
  return (
    <div style={{ maxWidth: 620 }}>
      <Stepper label="Onboarding progress" current={2} steps={ONBOARDING} />
    </div>
  );
}

function StepperNavigable() {
  const [step, setStep] = useState(2);
  return (
    <div className="demo-form" style={{ maxWidth: 620 }}>
      <Stepper label="Checkout" current={step} steps={ONBOARDING} onStepSelect={setStep} />
      <p style={{ fontSize: 12.5, color: 'var(--sv-ink-soft)' }}>
        Completed steps are buttons; <b>{ONBOARDING[step].label}</b> and everything after it are not
        yet earned.
      </p>
    </div>
  );
}

/* ------------------------------------------------ TreeList */

const ACCOUNTS = [
  {
    id: 'assets',
    label: 'Assets',
    meta: '1000',
    children: [
      {
        id: 'current',
        label: 'Current assets',
        meta: '1100',
        children: [
          { id: 'cash', label: 'Cash at bank', meta: '1110' },
          { id: 'receivable', label: 'Trade receivables', meta: '1120' },
        ],
      },
      { id: 'fixed', label: 'Fixed assets', meta: '1200' },
    ],
  },
  {
    id: 'liabilities',
    label: 'Liabilities',
    meta: '2000',
    children: [{ id: 'payable', label: 'Trade payables', meta: '2100' }],
  },
  { id: 'equity', label: 'Equity', meta: '3000' },
];

function TreeBasic() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['assets']));
  const [selected, setSelected] = useState<string | null>('current');
  return (
    <div style={{ maxWidth: 360 }}>
      <TreeList
        label="Chart of accounts"
        nodes={ACCOUNTS}
        expanded={expanded}
        onExpandedChange={setExpanded}
        selected={selected}
        onSelect={(id) => setSelected(id)}
      />
    </div>
  );
}

/* ------------------------------------------------ Timeline */

function TimelineRecord() {
  return (
    <div style={{ maxWidth: 460 }}>
      <Timeline
        items={[
          {
            id: 'placed',
            group: '22 JUL',
            time: '09:14',
            dateTime: '2026-07-22T09:14:00+03:00',
            title: 'Order placed',
            actor: 'Halcyon Freight',
          },
          {
            id: 'picked',
            time: '11:02',
            dateTime: '2026-07-22T11:02:00+03:00',
            title: 'Picked',
            body: '14 SKUs from warehouse A.',
            actor: 'A. Yusuf',
          },
          {
            id: 'shipped',
            group: '24 JUL',
            time: '08:40',
            dateTime: '2026-07-24T08:40:00+03:00',
            title: 'Shipped',
            body: 'DHL · 4820 1183 55',
          },
          { id: 'delivered', time: '26 JUL', title: 'Delivery expected', tone: 'pending' },
        ]}
      />
    </div>
  );
}

function TimelineFailed() {
  return (
    <div style={{ maxWidth: 460 }}>
      <Timeline
        items={[
          { id: 'queued', time: '02:00', dateTime: '2026-07-25T02:00:00+03:00', title: 'Run queued' },
          {
            id: 'extract',
            time: '02:01',
            dateTime: '2026-07-25T02:01:00+03:00',
            title: 'Extract complete',
            body: '18,402 rows read.',
          },
          {
            id: 'load',
            time: '02:06',
            dateTime: '2026-07-25T02:06:00+03:00',
            title: 'Load failed',
            tone: 'bad',
            body: 'Duplicate key on invoice_no at row 9,118.',
            actor: 'etl-worker-3',
          },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------ Popover */

function PopoverBasic() {
  return (
    <div className="demo-row">
      <Popover label="Columns" ariaLabel="Choose visible columns" align="end">
        <div className="demo-form" style={{ gap: 'var(--sv-s2)' }}>
          <Checkbox label="Customer" defaultChecked />
          <Checkbox label="Total" defaultChecked />
          <Checkbox label="Dispatched" />
        </div>
      </Popover>
    </div>
  );
}

function PopoverTitled() {
  return (
    <div className="demo-row">
      <Popover label="About this total" title="How the total is calculated">
        <p style={{ fontSize: 12.5, color: 'var(--sv-ink-soft)' }}>
          Line totals, less order-level discounts, plus shipping. Tax is applied at invoicing, so
          this figure can differ from the invoice by the tax line.
        </p>
        <ButtonLink href="#totals">Read the totals rules</ButtonLink>
      </Popover>
    </div>
  );
}

/* ------------------------------------------------ CodeBlock */

const CODE_SNIPPET = `<DataTable
  columns={columns}
  rows={rows}
  empty="No orders match this filter."
/>`;

function CodeBasic() {
  return (
    <CodeBlock label="TERMINAL" code="npx shadcn@latest add https://76.zifala.com/r/code-block.json" />
  );
}

function CodeNumbered() {
  return <CodeBlock label="orders-table.tsx" numbered code={CODE_SNIPPET} />;
}

/* ------------------------------------------------ DistributionStrip */

function DistBasic() {
  return (
    <div style={{ maxWidth: 420 }}>
      <DistributionStrip
        label="DEVICES ACCESSED · JULY"
        ariaLabel="128,953 sessions: mobile 46%, desktop 31%, tablet 15%, other 8%"
        parts={[
          { label: 'Mobile', value: 59318 },
          { label: 'Desktop', value: 39975 },
          { label: 'Tablet', value: 19343 },
          { label: 'Other', value: 10317 },
        ]}
      />
    </div>
  );
}

function DistPartial() {
  return (
    <div style={{ maxWidth: 420 }}>
      <DistributionStrip
        label="OPEN TICKETS · TOP THREE QUEUES"
        ariaLabel="Three queues hold 3,180 of 4,720 open tickets: billing 33%, shipping 21%, returns 13%; the remaining 1,540 are spread across nine smaller queues"
        total={4720}
        parts={[
          { label: 'Billing', value: 1540 },
          { label: 'Shipping', value: 1010 },
          { label: 'Returns', value: 630 },
        ]}
      />
    </div>
  );
}

/* ------------------------------------------------ Trend · the stated column */

function TrendHighlight() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Trend
        kind="bar"
        ariaLabel="Orders per weekday peak on Thursday at 312, a quarter above the weekday average"
        series={[{ label: 'Orders', data: [180, 224, 251, 312, 296, 142, 98], tone: 'seed' }]}
        xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
        yTicks={['90', '180', '270', '360']}
        highlight={{ index: 3, label: 'THU · 312' }}
        height={140}
      />
    </div>
  );
}

/* ------------------------------------------------ FilterBar · set, stated, applied */

function FilterBarBasic() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('pending');
  const q = query.trim().toLowerCase();
  const rows = draftInvoices.filter((r) => r.customer.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  const active = query !== '' || status !== 'all';
  const filters = [
    ...(status !== 'all' ? [{ label: 'Status', value: status === 'pending' ? 'Pending' : 'On hold' }] : []),
    { label: 'Period', value: 'July' },
  ];

  function clearAll() {
    setQuery('');
    setStatus('all');
  }

  return (
    <Card>
      <CardHead title="Orders" subtitle="July · warehouse A" />
      <FilterBar
        label="Filter orders"
        active={active}
        onClearAll={clearAll}
        controls={
          <>
            <SearchField
              label="Search orders"
              labelHidden
              placeholder="Search orders"
              value={query}
              onValueChange={setQuery}
            />
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="hold">On hold</option>
            </Select>
          </>
        }
        actions={
          <Popover label="Saved views" ariaLabel="Saved views" align="end">
            <div className="demo-form" style={{ gap: 'var(--sv-s2)' }}>
              <Radio name="demo-view" label="Everything open" defaultChecked />
              <Radio name="demo-view" label="Awaiting my approval" />
              <Radio name="demo-view" label="Overdue by 7 days" />
            </div>
          </Popover>
        }
      />
      <FilterLine count={`${rows.length} of 248`} filters={filters} onClearAll={clearAll} />
      <DataTable
        caption="Open orders"
        rows={rows}
        rowKey={(r) => r.id}
        announcement={`${rows.length} orders shown`}
        columns={[
          { key: 'id', header: 'INVOICE', kind: 'id', render: (r) => r.id },
          { key: 'customer', header: 'CUSTOMER', render: (r) => r.customer },
          { key: 'total', header: 'TOTAL', kind: 'num', render: (r) => r.total },
        ]}
      />
    </Card>
  );
}

/* ------------------------------------------------ Combobox · the stated selection */

function ComboboxMulti() {
  const [picked, setPicked] = useState<string[]>(['c-127', 'c-152']);
  return (
    <div style={{ maxWidth: 340 }}>
      <Combobox
        multiple
        noun="account"
        label="Accounts in this report"
        options={DEMO_CUSTOMERS}
        value={picked}
        onChange={(values) => setPicked(values)}
        placeholder="Type a name or C-number"
        hint="Pick as many as the report covers — the list stays open."
      />
    </div>
  );
}

/* ------------------------------------------------ Split (B46) */

/* Both orientations preview as the real screens they are, scaled into the
   doc surface. A miniature of a page type is a lie about the page type. */
function SplitFrame({ src, label }: { src: string; label: string }) {
  return (
    <iframe className="demo-screen" src={`${window.location.pathname}#/templates/${src}`} title={label} />
  );
}

function SplitSide() {
  return <SplitFrame src="auth-sign-in" label="Sign in, panel beside the form" />;
}

function SplitStacked() {
  return <SplitFrame src="auth-stacked" label="Sign in, ink band above the form" />;
}

/* ------------------------------------------------ v0.6 · the promises kept */

const ERRORS: FieldError[] = [
  { fieldId: 'po-supplier', label: 'Supplier', message: 'Choose a supplier before submitting.' },
  { fieldId: 'po-qty', label: 'Quantity', message: 'Quantity must be a whole number above 0.' },
  { fieldId: 'po-date', label: 'Delivery date', message: 'The delivery date is before the order date.' },
];

function ErrSumBasic() {
  /* autoFocus is off in the demo only: a doc page carries eight previews, and
     a component that grabs focus on mount would fight the reader for the page.
     In a form it defaults on, because B11 requires the move. */
  return (
    <div style={{ maxWidth: 520 }}>
      <ErrorSummary errors={ERRORS} autoFocus={false} />
    </div>
  );
}

function ErrSumForm() {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const qtyError = errors.find((e) => e.fieldId === 'demo-qty')?.message;
  const reasonError = errors.find((e) => e.fieldId === 'demo-reason')?.message;

  function submit(e: FormEvent) {
    e.preventDefault();
    const found: FieldError[] = [];
    if (!/^\d+$/.test(qty) || Number(qty) < 1) {
      found.push({ fieldId: 'demo-qty', label: 'Quantity', message: 'Quantity must be a whole number above 0.' });
    }
    if (reason.trim().length < 4) {
      found.push({ fieldId: 'demo-reason', label: 'Reason', message: 'State why the quantity changed — the supplier sees this.' });
    }
    setErrors(found);
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 520, display: 'grid', gap: 14 }} noValidate>
      {/* The index at the head, the statement at each field. Both, always. */}
      <ErrorSummary errors={errors} />
      <Field
        id="demo-qty"
        label="Quantity"
        hint="Whole units, above zero"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        error={qtyError}
      />
      <Field
        id="demo-reason"
        label="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={reasonError}
      />
      <div>
        <Button variant="primary" type="submit">
          Save amendment
        </Button>
      </div>
    </form>
  );
}

interface TotalLine {
  sku: string;
  description: string;
  qty: number;
  cost: string;
  extended: string;
}

const TOTAL_LINES: TotalLine[] = [
  { sku: 'PLT-4400', description: 'Euro pallet · heat-treated', qty: 480, cost: '$14.50', extended: '$6,960.00' },
  { sku: 'STR-0912', description: 'Stretch film 500mm', qty: 240, cost: '$18.20', extended: '$4,368.00' },
  { sku: 'LBL-2201', description: 'Thermal label 100×150', qty: 96, cost: '$31.00', extended: '$2,976.00' },
  { sku: 'CRN-7730', description: 'Corner board 60mm', qty: 600, cost: '$2.90', extended: '$1,740.00' },
];

function TableTotals() {
  return (
    <Card>
      <CardHead title="Purchase order lines" subtitle="PO-2291 · Halcyon Supply" />
      <DataTable
        caption="Purchase order lines with closing figures"
        rows={TOTAL_LINES}
        rowKey={(l) => l.sku}
        leadHold
        columns={[
          { key: 'sku', header: 'SKU', kind: 'id', render: (l) => l.sku },
          { key: 'description', header: 'DESCRIPTION', render: (l) => l.description },
          { key: 'qty', header: 'QTY', kind: 'num', render: (l) => l.qty.toLocaleString() },
          { key: 'cost', header: 'UNIT COST', kind: 'num', render: (l) => l.cost },
          { key: 'extended', header: 'EXTENDED', kind: 'num', render: (l) => l.extended },
        ]}
        totals={[
          { label: 'SUBTOTAL', cells: { extended: '$16,044.00' } },
          { label: 'VAT 20%', cells: { extended: '$3,208.80' } },
          { label: 'TOTAL DUE', cells: { extended: '$19,252.80' }, strong: true },
        ]}
      />
    </Card>
  );
}

/* ------------------------------------------------ v0.5 · the public surface */

/* Every heading in these demos is level 2: the docs page already owns its
   h1, and a Masthead that ships a second one breaks the outline (A4). */

function MastheadBasic() {
  return (
    <Masthead
      headingLevel={2}
      title="Flat, informational, corporate."
      titleSoft="Paper on a wall."
      statement="Fifty-one component specifications with one job each, zero runtime dependencies, and WCAG 2.2 AA verified on both surfaces."
      actions={
        <>
          <Button variant="primary">Install the registry</Button>
          <ButtonLink href="#/components">Browse the components</ButtonLink>
        </>
      }
    />
  );
}

function MastheadCentred() {
  return (
    <Masthead
      headingLevel={2}
      align="center"
      title="One system, stated once."
      statement="Every widget is a registered type. If it is not in the Book, it is not on the screen."
      actions={<ButtonLink href="#/components">Open the taxonomy</ButtonLink>}
    />
  );
}

function FeaturesThree() {
  return (
    <FeatureList
      ariaLabel="What the system ships"
      items={[
        {
          id: 'taxonomy',
          title: 'A closed taxonomy',
          body: 'Fifty-one specifications, each with one job. A screen that needs a type the Book does not carry either gets the type named, or gets composed from the ones that exist.',
          meta: 'B1 — B51',
        },
        {
          id: 'deps',
          title: 'Zero runtime dependencies',
          body: 'Native element first: details, dialog, popover, and input type="date". The browser already draws the calendar, and it draws it localized.',
          meta: 'REACT 19 ONLY',
        },
        {
          id: 'a11y',
          title: 'AA on both surfaces',
          body: 'Every token pair is contrast-verified on light and dark paper, and no meaning anywhere is carried by colour alone.',
          meta: 'WCAG 2.2 AA',
        },
      ]}
    />
  );
}

function CtaPaper() {
  return (
    <CallViewFrame>
      <CallToAction
        headingLevel={3}
        title="Install the registry"
        statement="Every component installs on its own, with the tokens as the one shared dependency."
        actions={
          <>
            <Button variant="primary">Copy the install command</Button>
            <ButtonLink href="#/components">Browse the components</ButtonLink>
          </>
        }
      />
    </CallViewFrame>
  );
}

function CtaBand() {
  return (
    <CallViewFrame>
      <CallToAction
        headingLevel={3}
        tone="band"
        title="Read the Component Book"
        statement="Every specification, every refusal by name, and the fourteen-point gate each screen passes before it ships."
        actions={<Button variant="primary">Open the Book</Button>}
      />
    </CallViewFrame>
  );
}

/* The CTA is a full-bleed row; the demo surface is narrower than a page, so
   it is framed rather than stretched — the component's own layout is what is
   being shown, not the wall's width. */
function CallViewFrame({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: 860 }}>{children}</div>;
}

function ProofBasic() {
  return (
    <ProofRow
      ariaLabel="The system in figures"
      items={[
        { id: 'components', figure: '51', label: 'BOOK SPECS', note: 'B1 to B51, each with one job' },
        { id: 'deps', figure: '0', label: 'RUNTIME DEPS', note: 'React and the platform, nothing else' },
        { id: 'contrast', figure: '4.5:1', label: 'MINIMUM CONTRAST', note: 'Verified on light and dark paper' },
        { id: 'floor', figure: '320px', label: 'LAYOUT FLOOR', note: 'Nothing hidden, nothing scrolled sideways' },
      ]}
    />
  );
}

function FooterBasic() {
  return (
    <SiteFooter
      statement="A component library for products that state their information rather than perform it."
      groups={[
        {
          title: 'SYSTEM',
          links: [
            { label: 'Components', href: '#/components' },
            { label: 'Foundations', href: '#/foundations' },
            { label: 'Blocks', href: '#/blocks' },
          ],
        },
        {
          title: 'RESOURCES',
          links: [
            { label: 'Templates', href: '#/templates' },
            { label: 'AI-ready layer', href: '#/ai' },
          ],
        },
        {
          title: 'PROJECT',
          links: [
            { label: 'Roadmap', href: '#/roadmap' },
            { label: 'Introduction', href: '#/' },
          ],
        },
      ]}
      legal="© 2026 SEVENTY SIX DEGREES · MIT"
      secondary={[
        { label: 'Licence', href: '#/' },
        { label: 'Status', href: '#/' },
      ]}
    />
  );
}

function ProseBasic() {
  return (
    <Prose>
      <h2>Why the donut is refused</h2>
      <p>
        A2 has banned donut, pie, radial and gauge charts since v0.1.0, and pointed at{' '}
        <code>MeterList</code> as the replacement — but that was a different question. The two
        components answer two questions, and picking the wrong one is how the donut keeps getting
        proposed.
      </p>
      <ul>
        <li>
          <b>B6 MeterList</b> measures each part against <i>its own</i> maximum: “Zone A is 92%
          full.”
        </li>
        <li>
          <b>B44 DistributionStrip</b> divides one total into its shares: “46% of 128,953 clicks
          were mobile.”
        </li>
      </ul>
      <blockquote>
        Every donut a team has ever drawn was asking B44’s question and being handed B6’s answer.
      </blockquote>
      <p>
        Both require the absolute figure beside the share. A percentage on its own is a defect, in
        either component — see <a href="#/components/distribution-strip">DistributionStrip</a>.
      </p>
    </Prose>
  );
}

function ProseMarkdown() {
  return (
    <Prose>
      <h3>Release checklist</h3>
      <p>Four gates, in this order. None of them is optional:</p>
      <ol>
        <li>
          <code>npm run firewall</code> — zero hits across <code>src</code>.
        </li>
        <li>
          <code>npm run check:sync</code> — the skill mirrors match their sources.
        </li>
        <li>
          <code>tsc -b</code> and <code>vite build</code>.
        </li>
        <li>The fourteen-point Ship Gate, by hand.</li>
      </ol>
      <table>
        <thead>
          <tr>
            <th>Gate</th>
            <th>Checks</th>
            <th>Blocking</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Firewall</td>
            <td>17</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Ship Gate</td>
            <td>14</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <p>
        <small>Rendered from markdown. Nothing on this page was styled by hand.</small>
      </p>
    </Prose>
  );
}

/* ------------------------------------------------ v0.7 · the money block */

function SumBasic() {
  return (
    <div style={{ maxWidth: 420 }}>
      {/* Every figure reconciles: 25,600 − 1,280 = 24,320; VAT 20% of that is
          4,864; 24,320 + 4,864 = 29,184; less the 7,296 deposit = 21,888. */}
      <SumList
        rows={[
          { label: 'LINE TOTAL', amount: '$25,600.00' },
          { label: 'DISCOUNT', amount: '\u2212$1,280.00', note: '5% agreed rate' },
          { label: 'VAT 20%', amount: '$4,864.00', note: '20% of $24,320.00' },
          { label: 'DEPOSIT RECEIVED', amount: '\u2212$7,296.00', note: '19 JUN 2026' },
          { label: 'BALANCE DUE', amount: '$21,888.00', strong: true },
        ]}
      />
    </div>
  );
}


/* ------------------------------------------------ v0.8 · the cover */

function IndexBasic() {
  return (
    <IndexRow
      ariaLabel="Contents"
      items={[
        { id: 'foundations', label: 'Foundations', href: '#/foundations', meta: 'TOKENS' },
        { id: 'components', label: 'Components', href: '#/components', meta: '56 SPECS' },
        { id: 'blocks', label: 'Blocks', href: '#/blocks', meta: 'SECTIONS' },
        { id: 'templates', label: 'Templates', href: '#/templates', meta: 'SCREENS' },
      ]}
    />
  );
}

function CaptionBasic() {
  return (
    <CaptionRow captions={['never a screenshot', 'always the shipped code', 'figures that reconcile']} />
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
  'accordion-basic': AccordionBasic,
  'accordion-exclusive': AccordionExclusive,
  'dl-record': DescriptionRecord,
  'divider-basic': DividerBasic,
  'avatar-group': AvatarGroupDemo,
  'spinner-basic': SpinnerBasic,
  'spinner-over': SpinnerOver,
  'kbd-basic': KbdBasic,
  'number-basic': NumberBasic,
  'number-error': NumberError,
  'slider-basic': SliderBasic,
  'daterange-basic': DateRangeBasic,
  'daterange-error': DateRangeError,
  'delta-inline': DeltaInline,
  'trend-stacked': TrendStacked,
  'table-selection': TableSelectionHead,
  'search-basic': SearchBasic,
  'search-inline': SearchInline,
  'file-basic': FileBasic,
  'file-error': FileError,
  'tabs-basic': TabsBasic,
  'stepper-basic': StepperBasic,
  'stepper-navigable': StepperNavigable,
  'tree-basic': TreeBasic,
  'timeline-record': TimelineRecord,
  'timeline-failed': TimelineFailed,
  'popover-basic': PopoverBasic,
  'popover-titled': PopoverTitled,
  'code-basic': CodeBasic,
  'code-numbered': CodeNumbered,
  'dist-basic': DistBasic,
  'dist-partial': DistPartial,
  'trend-highlight': TrendHighlight,
  'filterbar-basic': FilterBarBasic,
  'combobox-multi': ComboboxMulti,
  'split-side': SplitSide,
  'split-stacked': SplitStacked,
  'masthead-basic': MastheadBasic,
  'masthead-centred': MastheadCentred,
  'features-three': FeaturesThree,
  'cta-paper': CtaPaper,
  'cta-band': CtaBand,
  'proof-basic': ProofBasic,
  'footer-basic': FooterBasic,
  'prose-basic': ProseBasic,
  'prose-markdown': ProseMarkdown,
  'errsum-basic': ErrSumBasic,
  'errsum-form': ErrSumForm,
  'table-totals': TableTotals,
  'sum-basic': SumBasic,
  'index-basic': IndexBasic,
  'caption-basic': CaptionBasic,
};
