/* 76° · screen: invoice · gate: pass */
// 76° template · one financial document — seed cobalt.
//
// THE INVOICE. `erp-purchase-order` drew the document a business SENDS to
// buy something; this is the document it sends to be PAID for something,
// and the difference is not decoration: a purchase order is read by the
// person who raised it, an invoice is read by a stranger in another
// company's accounts payable who has to find, in under a minute, what they
// owe, why they owe it, when it was due, and how to settle it.
//
// Four things this screen exists to draw:
//
//  1 · B55 `SumList` on the surface it was specified for. The invoice
//      footer — line total, discount, tax, deposit, balance — sits in the
//      amount card BESIDE the table, not inside it, because those charges
//      belong to the DOCUMENT and have no column in the line table to be
//      keyed to. The line total does have one, so it stays where B7 put
//      it: a real <tfoot>, via `totals`.
//  2 · That boundary, drawn on one screen so it cannot be misread. B7
//      `totals` closes the TABLE (the sum of a column it already has);
//      B55 closes the INVOICE (charges no column carries).
//  3 · The printed surface, which shipped in 0.6 and had no document to
//      prove itself on. Every decision below is reasoned for paper as well
//      as for the screen — see the print notes at each one.
//  4 · F13 without a breadcrumb: this invoice has a parent (PO-2291, the
//      order `erp-purchase-order` draws) and it states it as a FACT in the
//      record's own facts, which is a link a reader can follow rather than
//      a trail of chevrons above the title.
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
  SumList,
  StatusWord,
  Timeline,
  Divider,
  Banner,
  Badge,
  Button,
  ButtonLink,
} from '@/components/seventy-six';
import type { Column, SumRow, TimelineItem } from '@/components/seventy-six';

const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Invoices', href: '#invoices', active: true },
  { label: 'Payments', href: '#payments' },
  { label: 'Statements', href: '#statements' },
];

const subTabs = [
  { label: 'ALL', href: '#all' },
  { label: 'OUTSTANDING', href: '#outstanding', active: true },
  { label: 'PAID', href: '#paid' },
  { label: 'CREDIT NOTES', href: '#credit-notes' },
];

/* ── THE ARITHMETIC · every figure on this screen reconciles ─────────────
   Ship Gate 12 is checkable by hand from here down, which is the only way
   a mockup of a financial document is honest.

     12 seats  × $980.00   = $11,760.00
     40 hours  × $160.00   =  $6,400.00
     24 hours  × $145.00   =  $3,480.00
      2 days   × $1,200.00 =  $2,400.00
      4 months × $390.00   =  $1,560.00
                LINE TOTAL = $25,600.00   ← the table's own <tfoot>

     renewal discount 5% of $25,600.00    = −$1,280.00
     subtotal                             =  $24,320.00
     VAT at 20% of $24,320.00             =   $4,864.00
     invoice total                        =  $29,184.00
     deposit 25% of $29,184.00 (19 JUN)   =  −$7,296.00
     BALANCE DUE                          =  $21,888.00   ← the button

   Dates agree with the terms: issued 12 JUN 2026, Net 30, due 12 JUL 2026.
   The screen is dated 25 JUL 2026, so the balance is 13 days overdue, and
   that is the figure the banner states. ───────────────────────────────── */

interface Line {
  id: string;
  code: string;
  description: string;
  qty: string;
  unit: string;
  price: string;
  amount: string;
}

const LINES: Line[] = [
  { id: 'l1', code: 'LIC-OPS', description: 'Platform licence · Operations tier', qty: '12', unit: 'seats', price: '$980.00', amount: '$11,760.00' },
  { id: 'l2', code: 'SVC-INT', description: 'Integration build · ERP connectors', qty: '40', unit: 'hours', price: '$160.00', amount: '$6,400.00' },
  { id: 'l3', code: 'SVC-MIG', description: 'Data migration · historical orders', qty: '24', unit: 'hours', price: '$145.00', amount: '$3,480.00' },
  { id: 'l4', code: 'SVC-ONB', description: 'Onboarding workshop · on site', qty: '2', unit: 'days', price: '$1,200.00', amount: '$2,400.00' },
  { id: 'l5', code: 'SUP-PRI', description: 'Priority support · 4-hour response', qty: '4', unit: 'months', price: '$390.00', amount: '$1,560.00' },
];

const columns: Column<Line>[] = [
  { key: 'code', header: 'CODE', kind: 'id', render: (l) => l.code },
  { key: 'description', header: 'DESCRIPTION', render: (l) => l.description },
  { key: 'qty', header: 'QTY', kind: 'num', render: (l) => l.qty },
  { key: 'unit', header: 'UNIT', render: (l) => l.unit },
  { key: 'price', header: 'UNIT PRICE', kind: 'num', render: (l) => l.price },
  { key: 'amount', header: 'AMOUNT', kind: 'num', render: (l) => l.amount },
];

/* B55 · the amount block, outside the table. Seven charges, each one
   checkable against the one above it, and exactly ONE closing figure — the
   balance, which is also the amount on the primary. The minus signs are in
   the STRINGS: the component never sees a number and never derives a sign
   (C9). */
const CHARGES: SumRow[] = [
  { label: 'LINE TOTAL', amount: '$25,600.00', note: '5 lines · stated in full below' },
  { label: 'RENEWAL DISCOUNT', amount: '−$1,280.00', note: '5% of $25,600.00 · agreed 04 JUN 2026' },
  { label: 'SUBTOTAL', amount: '$24,320.00' },
  { label: 'VAT 20%', amount: '$4,864.00', note: '20% of $24,320.00' },
  { label: 'INVOICE TOTAL', amount: '$29,184.00' },
  { label: 'DEPOSIT PAID', amount: '−$7,296.00', note: '25% of $29,184.00 · received 19 JUN 2026' },
  { label: 'BALANCE DUE', amount: '$21,888.00', strong: true },
];

/* B41 · the invoice's life, including what has NOT happened yet — which is
   why this is a Timeline and not a B9 feed. The due date is `bad` because
   it passed unpaid; the second reminder is `pending` because it is dated
   and has not been sent. */
const HISTORY: TimelineItem[] = [
  { id: 'h1', group: '12 JUN', time: '12 JUN · 09:04', dateTime: '2026-06-12T09:04', title: 'Issued', body: 'Sent to accounts payable at Halcyon Supply against PO-2291.', actor: 'NORTHWIND BILLING', tone: 'done' },
  { id: 'h2', time: '12 JUN · 16:22', dateTime: '2026-06-12T16:22', title: 'Viewed', body: 'Opened from the emailed link.', actor: 'HALCYON SUPPLY', tone: 'done' },
  { id: 'h3', group: '19 JUN', time: '19 JUN · 10:15', dateTime: '2026-06-19T10:15', title: 'Deposit received', body: '$7,296.00 by bank transfer — 25% of the invoice, per the agreed terms.', actor: 'HALCYON SUPPLY', tone: 'done' },
  { id: 'h4', group: '12 JUL', time: '12 JUL', dateTime: '2026-07-12', title: 'Balance fell due', body: 'The remaining $21,888.00 was payable on this date under Net 30.', tone: 'bad' },
  { id: 'h5', group: '16 JUL', time: '16 JUL · 08:00', dateTime: '2026-07-16T08:00', title: 'First reminder sent', body: 'To the same accounts payable address as the invoice.', actor: 'NORTHWIND BILLING', tone: 'done' },
  { id: 'h6', group: 'SCHEDULED', time: '29 JUL', dateTime: '2026-07-29', title: 'Second reminder', body: 'Sent only if the balance is still open on that date.', tone: 'pending' },
];

export function InvoiceCheckout() {
  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar app="Billing" nav={<BandNav items={nav} />} />
        <BandSubTabs items={subTabs} />
        {/* F12 · the closed header: a title, ONE line under it, and the
            buttons. No kicker, no mono note. The one seed primary on this
            screen is the act — "Pay $21,888.00" — and it lives in the
            amount card beside the figure it names, not up here (A2: one
            primary per view region, and the region that owns the number is
            the region that owns the button). */}
        <PageHero
          title="INV-2026-0412"
          titleSoft="· Halcyon Supply"
          context="Issued 12 JUN 2026 · Net 30 · balance due 12 JUL 2026"
          actions={
            <Button variant="ghost" onClick={() => window.print()}>
              Print invoice
            </Button>
          }
        />
      </Band>

      <Sheet aria-label="Invoice INV-2026-0412">
        {/* B22 at the top of the sheet, stating the one condition that
            changes what the reader should do. `warn` renders in INK — no
            amber surface enters the system (Law 2) — and it prints, which
            a toast never would. */}
        <Row overlap>
          <Banner
            tone="warn"
            title="The balance is 13 days overdue"
            action={<ButtonLink href="#accounts">Contact accounts</ButtonLink>}
          >
            $21,888.00 fell due on 12 JUL 2026 under Net 30 terms. Pay the balance to close the
            invoice, or reply to the accounts team to agree a date.
          </Banner>
        </Row>

        <Row split="main">
          <Card>
            <CardHead
              title="The invoice"
              subtitle="Stated as it was issued — an amendment is a credit note, never an edit"
              action={<ButtonLink href="#pdf">Original PDF</ButtonLink>}
            />
            {/* F13 · no breadcrumb. The parent document is a FACT in the
                record's own facts — PO-2291, the order this invoice bills
                against — which is a link the reader can follow and a fact
                they can read. */}
            <DescriptionList
              rows={[
                { term: 'INVOICE', kind: 'id', children: 'INV-2026-0412' },
                { term: 'FROM', children: 'Northwind Systems Ltd · VAT GB 418 2290 55' },
                { term: 'BILLED TO', children: 'Halcyon Supply Ltd · accounts payable' },
                { term: 'AGAINST', kind: 'id', children: 'PO-2291' },
                { term: 'STATUS', children: <StatusWord tone="bad">Overdue</StatusWord> },
                { term: 'ISSUED', children: '12 JUN 2026' },
                { term: 'TERMS', children: <>Net 30 · <Badge>USD</Badge></> },
                { term: 'DUE', children: '12 JUL 2026' },
                { term: 'LINES', kind: 'num', children: '5' },
              ]}
            />
          </Card>

          <Card>
            <CardHead title="Amount due" subtitle="Built from the lines below" />
            {/* B55, on the surface it was specified for. These charges
                belong to the DOCUMENT, not to any line: there is no column
                in the table for a renewal discount or a deposit, so keying
                them to one would be a lie about what they measure. The
                table's own closing figure — the line total — stays in B7's
                <tfoot>, where the column it sums already is.
                Rule 18: SumList carries no inset of its own, so it takes
                the card's padded body. */}
            <div className="sv-card__body">
              <SumList rows={CHARGES} />
              <Divider />
              {/* F14 · the total is INK and the button is SEED. One seed
                  rectangle on this screen, and it is the thing you click.
                  On paper the fill drops out and the label prints ink
                  (--sv-on-dark inverts for print), which is why the
                  remittance facts below carry the same instruction in
                  words: a printed invoice must be payable by someone who
                  cannot click anything. */}
              <Button variant="primary">Pay $21,888.00</Button>
            </div>
            <DescriptionList
              rows={[
                { term: 'PAY TO', children: 'Northwind Systems Ltd' },
                { term: 'BANK', children: 'Meridian Trust · account ending 3855' },
                { term: 'REFERENCE', kind: 'id', children: 'INV-2026-0412' },
              ]}
            />
          </Card>
        </Row>

        <Row>
          <Card>
            <CardHead
              title="Lines"
              subtitle="5 lines · quantity × unit price, extended"
              action={<ButtonLink href="#terms">Contract terms</ButtonLink>}
            />
            {/* leadHold holds CODE because it is the row's identity and is
                already declared kind="id" — the only column the amendment
                will hold, which is what keeps F3 refused.
                totals states the one figure that IS a column of this table:
                the sum of AMOUNT. On paper the browser repeats a <tfoot> at
                the bottom of every page, so a line table that breaks across
                two sheets carries its closing figure on both — and because
                the label names its own row ("LINE TOTAL"), the repeat is
                never mistaken for a per-page subtotal. */}
            <DataTable
              caption="Invoice lines"
              columns={columns}
              rows={LINES}
              rowKey={(l) => l.id}
              leadHold
              announcement="5 lines · $25,600.00 before discount and tax"
              totals={[{ label: 'LINE TOTAL', cells: { amount: '$25,600.00' }, strong: true }]}
            />
          </Card>
        </Row>

        <Row>
          <Card>
            <CardHead title="History" subtitle="This invoice, in order — including what has not happened yet" />
            {/* B41 draws a rail rather than hairline rows, so it carries no
                inset of its own and takes the card's padded body (rule 18). */}
            <div className="sv-card__body">
              <Timeline items={HISTORY} />
            </div>
          </Card>
        </Row>
      </Sheet>
    </div>
  );
}
