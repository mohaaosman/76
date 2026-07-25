/* 76° · screen: purchase order · gate: pass */
// 76° template · one operational document — seed cobalt.
//
// THE RECORD PAGE. Thirteen templates shipped before this one and none of
// them drew a record: every screen was a list, an overview or a decision.
// A management system is mostly neither — it is a person inside ONE named
// document, reading its facts, checking its lines, and acting on it.
//
// Three things this screen exists to draw, each of which the Book already
// mandated and no screen had composed:
//
//  1 · B28 defers record EDITING to "a Drawer with a form" (B21). This is
//      that pairing: the DescriptionList states, the Drawer edits, and the
//      page never navigates away from the document to change it.
//  2 · B11's top-of-form error summary — B52 — sits at the head of that
//      Drawer's form, indexing what failed while each field still states
//      its own error. The summary finds it; the field fixes it.
//  3 · B7's v0.6 `totals` and `leadHold`: the closing figures live in a real
//      <tfoot>, outside the row, focus, selection and pagination models, and
//      the line identity holds while fourteen columns of a wide document
//      scroll under it.
import { useState } from 'react';
import {
  Band,
  BandTopbar,
  BandNav,
  BandSubTabs,
  PageHero,
  Sheet,
  Row,
  Card,
  CardHead,
  DescriptionList,
  DataTable,
  StatusWord,
  Timeline,
  Divider,
  MeterList,
  Banner,
  Drawer,
  Field,
  NumberField,
  ErrorSummary,
  Badge,
  Button,
  ButtonLink,
  MenuButton,
} from '@/components/seventy-six';
import type { Column, FieldError } from '@/components/seventy-six';

const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Orders', href: '#orders' },
  { label: 'Procurement', href: '#procurement', active: true },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Reports', href: '#reports' },
];

const subTabs = [
  { label: 'REQUISITIONS', href: '#requisitions' },
  { label: 'PURCHASE ORDERS', href: '#purchase-orders', active: true },
  { label: 'RECEIPTS', href: '#receipts' },
  { label: 'SUPPLIERS', href: '#suppliers' },
];

/* Every figure on this page reconciles. The line extensions are qty × unit
   cost, the subtotal is their sum, VAT is 20% of it, and the total is the
   two added — Ship Gate 12 is checkable on this screen by hand, which is
   the only way a mockup of a financial document is honest. */
interface Line {
  id: string;
  sku: string;
  description: string;
  ordered: number;
  received: number;
  unit: string;
  cost: string;
  extended: string;
  state: string;
  tone: 'ok' | 'neutral' | 'bad';
}

const LINES: Line[] = [
  { id: 'l1', sku: 'PLT-4400', description: 'Euro pallet · heat-treated', ordered: 480, received: 480, unit: 'EA', cost: '$14.50', extended: '$6,960.00', state: 'Received', tone: 'ok' },
  { id: 'l2', sku: 'STR-0912', description: 'Stretch film 500mm · 23µm', ordered: 240, received: 240, unit: 'RL', cost: '$18.20', extended: '$4,368.00', state: 'Received', tone: 'ok' },
  { id: 'l3', sku: 'LBL-2201', description: 'Thermal label 100×150', ordered: 96, received: 40, unit: 'BX', cost: '$31.00', extended: '$2,976.00', state: 'Part received', tone: 'neutral' },
  { id: 'l4', sku: 'CRN-7730', description: 'Corner board 60mm', ordered: 600, received: 0, unit: 'EA', cost: '$2.90', extended: '$1,740.00', state: 'Awaiting', tone: 'neutral' },
  { id: 'l5', sku: 'TAP-1180', description: 'Packing tape 48mm · solvent', ordered: 360, received: 0, unit: 'RL', cost: '$4.10', extended: '$1,476.00', state: 'Awaiting', tone: 'neutral' },
  { id: 'l6', sku: 'BND-0450', description: 'PET strapping 12mm', ordered: 24, received: 0, unit: 'RL', cost: '$30.00', extended: '$720.00', state: 'Short-shipped', tone: 'bad' },
];

const HISTORY = [
  { id: 'h1', group: '18 JUL', time: '18 JUL · 09:12', dateTime: '2026-07-18T09:12', title: 'Requisition converted', body: 'REQ-8841 became this order at the approved supplier price.', actor: 'D. OKONKWO', tone: 'done' as const },
  { id: 'h2', time: '18 JUL · 11:40', dateTime: '2026-07-18T11:40', title: 'Approved', body: 'Within the $25,000 delegation for the packaging cost centre.', actor: 'M. ARANDA', tone: 'done' as const },
  { id: 'h3', group: '22 JUL', time: '22 JUL · 07:55', dateTime: '2026-07-22T07:55', title: 'Acknowledged by supplier', body: 'Confirmed for 24 July, two lines split to a second delivery.', actor: 'HALCYON SUPPLY', tone: 'done' as const },
  { id: 'h4', group: '24 JUL', time: '24 JUL · 14:28', dateTime: '2026-07-24T14:28', title: 'Goods receipt GRN-3319', body: '2 lines received in full, 1 part received against 96 ordered.', actor: 'A. NDIAYE', tone: 'done' as const },
  { id: 'h5', time: '24 JUL · 14:31', dateTime: '2026-07-24T14:31', title: 'Line 6 short-shipped', body: 'PET strapping did not arrive; the supplier has not restated a date.', actor: 'A. NDIAYE', tone: 'bad' as const },
  { id: 'h6', group: 'EXPECTED', time: '29 JUL', dateTime: '2026-07-29', title: 'Second delivery', body: 'Corner board and packing tape, per the acknowledgement.', tone: 'pending' as const },
];

const columns: Column<Line>[] = [
  { key: 'sku', header: 'SKU', kind: 'id', render: (l) => l.sku },
  { key: 'description', header: 'DESCRIPTION', render: (l) => l.description },
  { key: 'ordered', header: 'ORDERED', kind: 'num', render: (l) => l.ordered.toLocaleString() },
  { key: 'received', header: 'RECEIVED', kind: 'num', render: (l) => l.received.toLocaleString() },
  { key: 'unit', header: 'UOM', render: (l) => l.unit },
  { key: 'cost', header: 'UNIT COST', kind: 'num', render: (l) => l.cost },
  { key: 'extended', header: 'EXTENDED', kind: 'num', render: (l) => l.extended },
  { key: 'state', header: 'STATE', kind: 'status', render: (l) => <StatusWord tone={l.tone}>{l.state}</StatusWord> },
];

export function ErpPurchaseOrder() {
  const [editing, setEditing] = useState<Line | null>(null);
  const [ordered, setOrdered] = useState(0);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<FieldError[]>([]);

  function openLine(line: Line) {
    setEditing(line);
    setOrdered(line.ordered);
    setReason('');
    setErrors([]);
  }

  /* The validation is the template's, not the component's — B52 renders the
     index it is handed and owns no rules. Both failures state what and how
     to fix, per B11, and each one renders in the field as well as here. */
  function save() {
    const found: FieldError[] = [];
    if (editing && ordered < editing.received) {
      found.push({
        fieldId: 'po-ordered',
        label: 'Ordered quantity',
        message: `Cannot fall below the ${editing.received} already received. Reverse the receipt first.`,
      });
    }
    if (reason.trim().length < 4) {
      found.push({
        fieldId: 'po-reason',
        label: 'Reason',
        message: 'State why the quantity changed — the supplier sees this on the amendment.',
      });
    }
    setErrors(found);
    if (found.length === 0) setEditing(null);
  }

  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar app="Warehouse" nav={<BandNav items={nav} />} />
        <BandSubTabs items={subTabs} />
        <PageHero
          title="PO-2291"
          titleSoft="· Halcyon Supply"
          context="Raised 18 JUL · packaging cost centre · last event 24 JUL 14:31"
          actions={
            <>
              <ButtonLink href="#print">Print</ButtonLink>
              <MenuButton
                label="More"
                items={[
                  { label: 'Duplicate as new order', onSelect: () => undefined },
                  { label: 'Send amendment to supplier', onSelect: () => undefined },
                  'separator',
                  { label: 'Cancel order', onSelect: () => undefined, danger: true },
                ]}
              />
              <Button variant="primary">Close order</Button>
            </>
          }
        />
      </Band>

      <Sheet aria-label="Purchase order PO-2291">
        {/* One condition, stated where it happened and nowhere else: a toast
            for this would be gone before the reader finished the line table
            (A2, B22). */}
        <Row overlap>
          <Banner
            tone="warn"
            title="One line short-shipped"
            action={<ButtonLink href="#chase">Chase the supplier</ButtonLink>}
          >
            PET strapping (BND-0450) did not arrive with the 24 July delivery and the supplier has
            not restated a date. The order cannot close while a line is open.
          </Banner>
        </Row>

        <Row split="main">
          <Card>
            <CardHead
              title="The document"
              subtitle="Stated, not editable here — a fact changes in the Drawer that owns it"
              action={<ButtonLink href="#audit">Full audit trail</ButtonLink>}
            />
            <DescriptionList
              rows={[
                { term: 'ORDER', kind: 'id', children: 'PO-2291' },
                { term: 'SUPPLIER', children: 'Halcyon Supply · SUP-0148' },
                { term: 'STATUS', children: <StatusWord tone="neutral">Part received</StatusWord> },
                { term: 'TERMS', children: <>Net 30 · <Badge>FOB DESTINATION</Badge></> },
                { term: 'RAISED', children: '18 JUL 2026 by D. Okonkwo' },
                { term: 'APPROVED', children: '18 JUL 2026 by M. Aranda' },
                { term: 'DELIVER TO', children: 'Warehouse A · Bay 4, Dock 2' },
                { term: 'LINES', kind: 'num', children: '6' },
                { term: 'TOTAL DUE', kind: 'num', children: '$21,888.00' },
              ]}
            />
            {/* B6 measures each part against ITS OWN maximum, which is exactly
                what a receipt is: this line against this line's order. The
                absolute figures are required, never a bare percentage. */}
            {/* B6 carries no inset of its own, so it takes the card's padded
                body — the same wrapper `meter-panel` uses. A self-padded
                widget (DataTable, DescriptionList) sits directly in the card;
                a bar does not. */}
            <div className="sv-card__body">
              <Divider label="RECEIPT PROGRESS" align="start" />
              <MeterList
                items={[
                  { label: 'Euro pallet', current: 480, max: 480, value: '100%', subtitle: '480 of 480 EA received' },
                  { label: 'Stretch film', current: 240, max: 240, value: '100%', subtitle: '240 of 240 RL received' },
                  { label: 'Thermal label', current: 40, max: 96, value: '42%', subtitle: '40 of 96 BX received' },
                  { label: 'Corner board', current: 0, max: 600, value: '0%', subtitle: '0 of 600 EA received · expected 29 JUL' },
                  { label: 'Packing tape', current: 0, max: 360, value: '0%', subtitle: '0 of 360 RL received · expected 29 JUL' },
                  { label: 'PET strapping', current: 0, max: 24, value: '0%', subtitle: '0 of 24 RL received · no date restated' },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHead title="History" subtitle="This order, in order" />
            {/* B41 draws a rail, not hairline rows, so it carries no inset of
                its own and takes the card's padded body (rule 18). */}
            <div className="sv-card__body">
              <Timeline items={HISTORY} />
            </div>
          </Card>
        </Row>

        <Row>
          <Card>
            <CardHead
              title="Lines"
              subtitle="Open a line to amend its quantity · 6 lines, 1 short"
              action={<ButtonLink href="#receipts">Goods receipts</ButtonLink>}
            />
            {/* leadHold holds the SKU because it is the row's identity and is
                already declared kind="id" — the only column the amendment
                will hold, which is what keeps F3 refused. totals close the
                document in a real <tfoot>: not rows, so ↑/↓ never focuses
                them, Space never selects them and the count never counts
                them. */}
            <DataTable
              caption="Purchase order lines"
              columns={columns}
              rows={LINES}
              rowKey={(l) => l.id}
              onRowOpen={openLine}
              leadHold
              announcement="6 lines · 1 short-shipped"
              totals={[
                { label: 'SUBTOTAL', cells: { extended: '$18,240.00' } },
                { label: 'VAT 20%', cells: { extended: '$3,648.00' } },
                { label: 'TOTAL DUE', cells: { extended: '$21,888.00' }, strong: true },
              ]}
            />
          </Card>
        </Row>
      </Sheet>

      {/* B28's stated answer, finally composed: the record page STATES its
          facts and a Drawer EDITS one of them, beside the work rather than
          on another screen. */}
      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Amend line"
        context={editing ? `${editing.sku} · ${editing.description}` : undefined}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save}>
              Save amendment
            </Button>
          </>
        }
      >
        {/* The index at the head of the form, the statement at each field.
            B11 has required both since v0.1.0 and only one of them shipped. */}
        <ErrorSummary errors={errors} />
        <NumberField
          id="po-ordered"
          label="Ordered quantity"
          value={ordered}
          onValueChange={setOrdered}
          min={0}
          max={9999}
          unit={editing?.unit ?? 'EA'}
          hint={editing ? `${editing.received} already received against this line` : undefined}
          error={errors.find((e) => e.fieldId === 'po-ordered')?.message}
        />
        <Field
          id="po-reason"
          label="Reason"
          hint="Printed on the amendment the supplier receives"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={errors.find((e) => e.fieldId === 'po-reason')?.message}
        />
      </Drawer>
    </div>
  );
}
