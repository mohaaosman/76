/* 76° · screen: payment checkout · gate: pass */
// 76° template · one transaction — seed signal.
//
// THE CARD PAYMENT, in the shape people expect from a modern checkout and
// built entirely from 76° parts — which means it also REFUSES what 76°
// refuses, and the refusals are the interesting half of this screen:
//
//  · No card-brand logos. B26 is binding on every provider mark in the
//    system: ONE path in `currentColor`, never a brand hex, never a raster.
//    The accepted brands are therefore NAMED IN TEXT, in the card number's
//    own hint, where a screen reader gets them for free and a greyscale
//    printer loses nothing (C5).
//  · No padlock, no trust badge, no "100% secure" line. A3 bans the whole
//    register; 76° speaks like a competent colleague, and a colleague does
//    not reassure you that they are honest. What replaces it is a factual
//    sentence about what the button does.
//  · No countdown, no "3 left", no reserved-cart timer. B49 states it
//    plainly — there is no `urgency` prop and there never will be — and a
//    checkout is exactly where that pressure is usually applied.
//  · One seed primary in each view region (A2), and F14: the total is INK,
//    the button is seed. If the figure were as loud as the button, the
//    reader would have two primaries and the screen would have none.
//
// The card number, expiry and security code are ORDINARY B11 Fields with
// the right `inputMode` and `autoComplete` (`cc-number`, `cc-exp`,
// `cc-csc`), so the browser's own autofill, password manager and one-time
// code plumbing all work. A masked, self-formatting input that inserts its
// own spaces is a component fighting the platform for the privilege of
// breaking paste — refused here, deliberately.
//
// Navigation is REAL. The step lives in the URL as a query parameter, so
// the back button, a reload and a shared link all behave: this template is
// mounted by the docs shell at `/templates/:slug`, a non-splat path, so a
// nested <Routes> could never match a sub-path — a query step is honest
// under any parent route, which is the point of putting it in the router
// rather than in local state.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Band,
  BandTopbar,
  PageHero,
  Sheet,
  Row,
  Card,
  CardHead,
  DataTable,
  DescriptionList,
  SumList,
  Stepper,
  ErrorSummary,
  Field,
  Checkbox,
  Divider,
  Button,
} from '@/components/seventy-six';
import type { Column, FieldError, SumRow, Step } from '@/components/seventy-six';

/* ── THE ARITHMETIC · every figure on this screen reconciles ─────────────
   Ship Gate 12, checkable by hand:

     6 × $84.00  = $504.00
     2 × $312.00 = $624.00
     8 × $46.50  = $372.00
             GOODS = $1,500.00
     shipping · two-day pallet   =    $95.00
     subtotal                    = $1,595.00
     VAT at 20% of $1,595.00     =   $319.00
     TOTAL                       = $1,914.00   ← the amount on the button

   Dates agree: the order is placed 25 JUL 2026 and the two-day pallet
   delivers 28 JUL 2026. The expiry field is validated against the same
   date, so a card that expired before it is rejected in B11's voice rather
   than accepted and charged. ────────────────────────────────────────── */

interface Item {
  id: string;
  sku: string;
  name: string;
  price: string;
  qty: string;
  amount: string;
}

const ITEMS: Item[] = [
  { id: 'i1', sku: 'FK-220', name: 'Field kit case', price: '$84.00', qty: '6', amount: '$504.00' },
  { id: 'i2', sku: 'TP-40', name: 'Thermal printer', price: '$312.00', qty: '2', amount: '$624.00' },
  { id: 'i3', sku: 'LBL-2201', name: 'Label roll 100×150 · box of 12', price: '$46.50', qty: '8', amount: '$372.00' },
];

const columns: Column<Item>[] = [
  { key: 'sku', header: 'SKU', kind: 'id', render: (i) => i.sku },
  { key: 'item', header: 'ITEM', render: (i) => `${i.name} · ${i.price} each` },
  { key: 'qty', header: 'QTY', kind: 'num', render: (i) => i.qty },
  { key: 'amount', header: 'AMOUNT', kind: 'num', render: (i) => i.amount },
];

/* B55 · the order summary's amount block. Note what is NOT here: this
   table carries no `totals`. Shipping and VAT belong to the ORDER, not to
   any item, and the table has no column that measures them — a <tfoot> row
   keyed to AMOUNT would be claiming that carriage is an item's extension.
   The charges that have no column are a SumList outside the table; the
   figures that ARE a column stay in B7's <tfoot>, which is why the invoice
   template uses `totals` and this one does not. */
const CHARGES: SumRow[] = [
  { label: 'GOODS', amount: '$1,500.00', note: '3 items · stated above' },
  { label: 'SHIPPING', amount: '$95.00', note: 'Two-day pallet · delivers 28 JUL 2026' },
  { label: 'SUBTOTAL', amount: '$1,595.00' },
  { label: 'VAT 20%', amount: '$319.00', note: '20% of $1,595.00' },
  { label: 'TOTAL', amount: '$1,914.00', strong: true },
];

/* B39 · three NAMED steps, and they are named because the flow genuinely
   has them: delivery was chosen before this screen, payment happens on it,
   the receipt follows it. No `onStepSelect` is passed, so this is a
   STATEMENT and not a control — B39's own rule, and the reason it is not a
   tab row. Three is well inside the cap of five. */
const STEPS: Step[] = [
  { id: 'delivery', label: 'Delivery', note: 'Warehouse A · two-day pallet' },
  { id: 'payment', label: 'Payment', note: 'Card, charged once' },
  { id: 'confirmation', label: 'Confirmation', note: 'Receipt by email' },
];

interface FormState {
  email: string;
  name: string;
  number: string;
  exp: string;
  csc: string;
  postcode: string;
}

const EMPTY: FormState = { email: '', name: '', number: '', exp: '', csc: '', postcode: '' };

/** The screen's date, in the two places that have to agree on it. */
const NOW_MM = 7;
const NOW_YY = 26;

const digitsOf = (value: string) => value.replace(/\D/g, '');

/* The rules are the TEMPLATE'S, never the component's: B52 renders the
   index it is handed and owns no validation, exactly as B11 states. Every
   message says what is wrong AND how to fix it, names no blame, opens with
   no "Please" and ends with no exclamation mark (A3). Each one also renders
   at its own field — the summary is the INDEX, the field error is the
   STATEMENT, and a long form needs both. */
function validate(form: FormState): FieldError[] {
  const found: FieldError[] = [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    found.push({
      fieldId: 'pay-email',
      label: 'Email for the receipt',
      message: 'Enter the address the receipt should go to, as name@company.com.',
    });
  }

  if (form.name.trim().length < 2) {
    found.push({
      fieldId: 'pay-name',
      label: 'Name on card',
      message: 'Enter the name exactly as it is printed on the card.',
    });
  }

  const card = digitsOf(form.number);
  if (card.length !== 16 && card.length !== 15) {
    found.push({
      fieldId: 'pay-cc-number',
      label: 'Card number',
      message: 'A card number is 16 digits — 15 on an American Express card. Check the number on the front of the card.',
    });
  }

  const exp = form.exp.trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
  const month = exp ? Number(exp[1]) : 0;
  const year = exp ? Number(exp[2]) : 0;
  if (!exp || month < 1 || month > 12) {
    found.push({
      fieldId: 'pay-cc-exp',
      label: 'Expiry',
      message: 'Enter the expiry as MM/YY, for example 09/28.',
    });
  } else if (year < NOW_YY || (year === NOW_YY && month < NOW_MM)) {
    found.push({
      fieldId: 'pay-cc-exp',
      label: 'Expiry',
      message: `That card expired in ${form.exp.trim()}. Use a card valid on 25 JUL 2026 or later.`,
    });
  }

  const csc = digitsOf(form.csc);
  if (csc.length < 3 || csc.length > 4) {
    found.push({
      fieldId: 'pay-cc-csc',
      label: 'Security code',
      message: 'The security code is the 3 digits on the back of the card — 4 on the front of an American Express card.',
    });
  }

  if (form.postcode.trim().length < 3) {
    found.push({
      fieldId: 'pay-postcode',
      label: 'Billing postcode',
      message: 'Enter the postcode the card statement is sent to.',
    });
  }

  return found;
}

const stack = { display: 'grid', gap: 'var(--sv-s4)' } as const;
/* auto-fit + minmax, never a bare `1fr 1fr`. A `1fr` track floors at its
   MIN-CONTENT width, so two fields whose hints run long forced the pair to
   360px and pushed a 320px page into a horizontal scroll — the exact defect
   Part E, C7 and Ship Gate point 11 all name. Below the width two 140px
   columns need, the pair becomes one column on its own. */
const pair = {
  display: 'grid',
  gap: 'var(--sv-s4)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
} as const;

export function PaymentCheckout() {
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitted, setSubmitted] = useState(false);
  /* What was actually charged, in this session. Not derived from the URL:
     a receipt is a fact about a payment that happened, and a link somebody
     pasted into a new tab has no payment behind it. */
  const [charged, setCharged] = useState<{ last4: string; email: string } | null>(null);

  /* The URL is the step, with ONE guard: `?step=confirmation` reloaded into
     a fresh session shows the form again rather than printing a receipt for
     a payment this screen cannot substantiate (Ship Gate 12). */
  const done = params.get('step') === 'confirmation' && charged !== null;

  function set(key: keyof FormState, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    /* B11 validation timing: never on the first keystroke. The form is
       checked on submit, and only after that first failure does typing
       re-check it — so a field corrects itself as the reader fixes it. */
    if (submitted) setErrors(validate(next));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(form);
    setSubmitted(true);
    setErrors(found);
    if (found.length > 0) return;
    setCharged({ last4: digitsOf(form.number).slice(-4), email: form.email.trim() });
    setParams({ step: 'confirmation' });
  }

  const errorFor = (fieldId: string) => errors.find((e) => e.fieldId === fieldId)?.message;

  return (
    <div data-seed="signal">
      <Band>
        {/* The v0.5 amendment, used for the reason it exists: `app` and
            `nav` are both optional, and a checkout deliberately carries no
            product navigation — the reader is finishing one act, and every
            link out of it is a way to lose the order. The wordmark and the
            store name stay, so the reader still knows whose till this is. */}
        <BandTopbar app="Halcyon Supply" />
        <PageHero
          title="Checkout"
          titleSoft="· order HS-4471"
          context="Two-day pallet to Warehouse A · placed 25 JUL 2026"
        />
      </Band>

      <Sheet aria-label="Checkout">
        <Row overlap>
          <Card>
            {/* B39 is self-padded, so it is a legal direct child of the
                card (rule 18). It states position; it does not offer to
                move you — you cannot click into a step you have not
                earned, and you cannot click back into one from here
                either, because this screen does not draw the delivery
                step and a control that goes nowhere is worse than none. */}
            <Stepper steps={STEPS} current={done ? 2 : 1} label="Checkout progress" />
          </Card>
        </Row>

        <Row split="main">
          {done && charged ? (
            <Card>
              <CardHead title="Payment received" subtitle="Charged once, in full — nothing else is owed on this order" />
              <DescriptionList
                rows={[
                  { term: 'ORDER', kind: 'id', children: 'HS-4471' },
                  { term: 'PAID', kind: 'num', children: '$1,914.00' },
                  { term: 'CARD', children: `Ends ${charged.last4}` },
                  { term: 'RECEIPT SENT TO', children: charged.email },
                  { term: 'DELIVERY', children: 'Two-day pallet · Warehouse A · 28 JUL 2026' },
                ]}
              />
              <div className="sv-card__body">
                {/* The one primary of this region, and it does what it
                    says: 0.6's printed surface turns this screen into a
                    receipt a reader can file. */}
                <Button variant="primary" onClick={() => window.print()}>
                  Print receipt
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHead
                title="Payment"
                subtitle="The card is charged once, when you submit this form"
              />
              <div className="sv-card__body">
                <form style={stack} onSubmit={submit} noValidate>
                  {/* B52 at the head of the form, indexing what failed and
                      linking to each field by its real id. Focus moves here
                      on every new set of errors; the fields still state
                      their own. */}
                  <ErrorSummary errors={errors} />

                  <Field
                    id="pay-email"
                    label="Email for the receipt"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    error={errorFor('pay-email')}
                  />

                  <Field
                    id="pay-name"
                    label="Name on card"
                    autoComplete="cc-name"
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    error={errorFor('pay-name')}
                  />

                  {/* The accepted brands, NAMED. B26 allows a provider mark
                      only as one currentColor path, and four of them in a
                      row is the logo strip A2 refuses — so the hint says
                      which cards work, which is the information the row of
                      logos was pretending to carry. */}
                  <Field
                    id="pay-cc-number"
                    label="Card number"
                    hint="Visa, Mastercard and American Express are accepted."
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                    value={form.number}
                    onChange={(e) => set('number', e.target.value)}
                    error={errorFor('pay-cc-number')}
                  />

                  <div style={pair}>
                    <Field
                      id="pay-cc-exp"
                      label="Expiry"
                      hint="MM/YY, as printed on the card"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      required
                      value={form.exp}
                      onChange={(e) => set('exp', e.target.value)}
                      error={errorFor('pay-cc-exp')}
                    />
                    <Field
                      id="pay-cc-csc"
                      label="Security code"
                      hint="3 digits on the back of the card"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      required
                      value={form.csc}
                      onChange={(e) => set('csc', e.target.value)}
                      error={errorFor('pay-cc-csc')}
                    />
                  </div>

                  <Field
                    id="pay-postcode"
                    label="Billing postcode"
                    hint="The postcode the card statement is sent to"
                    autoComplete="postal-code"
                    required
                    value={form.postcode}
                    onChange={(e) => set('postcode', e.target.value)}
                    error={errorFor('pay-postcode')}
                  />

                  {/* A Checkbox, not a Toggle: it takes effect when the
                      form is submitted, and anything that needs "Save" is a
                      checkbox (B11). */}
                  <Checkbox label="Save this card for the next order" />

                  {/* The act, named with its object and its amount (A3).
                      One seed rectangle in this region; every figure on the
                      screen stays ink (F14). */}
                  <Button type="submit" variant="primary">
                    Pay $1,914.00
                  </Button>
                </form>
              </div>
            </Card>
          )}

          <Card>
            <CardHead title="Order summary" subtitle="3 items · two-day pallet to Warehouse A" />
            <DataTable
              caption="Items in order HS-4471"
              columns={columns}
              rows={ITEMS}
              rowKey={(i) => i.id}
              announcement="3 items · $1,500.00 of goods"
            />
            {/* Rule 18: SumList carries no inset of its own, so it takes
                the card's padded body — and it sits here, outside the
                table, because these charges have no column in it. */}
            <div className="sv-card__body">
              <Divider label="CHARGES" align="start" />
              <SumList rows={CHARGES} />
            </div>
          </Card>
        </Row>
      </Sheet>
    </div>
  );
}
