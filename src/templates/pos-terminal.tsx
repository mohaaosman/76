// 76° POS template — Register 3 sale surface, seed signal (touch-first, scaled-up).
import {
  Band,
  BandTopbar,
  BandNav,
  PageHero,
  Sheet,
  Row,
  Card,
  CardHead,
  DataTable,
  StatS1,
  Button,
  useToast,
} from '@/components/seventy-six';

const NAV = [
  { label: 'Sale', href: '#sale', active: true },
  { label: 'Orders', href: '#orders' },
  { label: 'Shift', href: '#shift' },
];

type Line = { item: string; qty: string; price: string; line: string };

const LINES: Line[] = [
  { item: 'Flat white', qty: '2', price: '$4.20', line: '$8.40' },
  { item: 'Sourdough loaf', qty: '1', price: '$9.00', line: '$9.00' },
  { item: 'Chicken sandwich', qty: '3', price: '$12.50', line: '$37.50' },
  { item: 'Garden salad', qty: '2', price: '$11.00', line: '$22.00' },
  { item: 'Sparkling water', qty: '4', price: '$3.75', line: '$15.00' },
];

const columns = [
  { key: 'item', header: 'ITEM', kind: 'text' as const, render: (r: Line) => r.item },
  { key: 'qty', header: 'QTY', kind: 'num' as const, render: (r: Line) => r.qty },
  { key: 'price', header: 'PRICE', kind: 'num' as const, render: (r: Line) => r.price },
  { key: 'line', header: 'LINE', kind: 'num' as const, render: (r: Line) => r.line },
];

const CartIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="6" cy="14" r="1" /><circle cx="13" cy="14" r="1" />
    <path d="M1 1h2l1.5 9h8L15 4H4" />
  </svg>
);

export function PosTerminal() {
  const { toast } = useToast();
  return (
    <div data-seed="signal">
      <Band>
        <BandTopbar
          app="Register 3"
          nav={<BandNav items={NAV} />}
          utilities={<span className="sv-mono sv-num">14:32 · TILL OPEN</span>}
        />
        <PageHero
          headingLevel={1}
          breadcrumb={['REGISTER', 'SALE']}
          title="Current sale"
          context="Cashier Amina · 14:32"
          actions={<Button variant="ghost" onClick={() => toast('Sale held for Register 3', 'info')}>Hold sale</Button>}
        />
      </Band>
      <Sheet aria-label="Point of sale">
        <Row split="main" overlap>
          <Card>
            <CardHead title="Cart" subtitle="5 line items on this sale" />
            <DataTable
              caption="Line items on the current sale"
              columns={columns}
              rows={LINES}
              rowKey={(r) => r.item}
              announcement="5 items in cart"
            />
          </Card>
          <Card>
            <CardHead title="Total" />
            <StatS1
              label="GRAND TOTAL · DUE"
              value="$128.40"
              icon={CartIcon}
              footnote={<>3 items · tax <b>$9.40</b> included</>}
              footnoteText="3 items, tax $9.40 included"
            />
            <div className="sv-mono sv-num" style={{ display: 'grid', gap: 'var(--sv-s2)', marginTop: 'var(--sv-s5)' }}>
              <span>SUBTOTAL · $119.00</span>
              <span>TAX 8% · $9.40</span>
            </div>
            <div style={{ display: 'grid', gap: 'var(--sv-s3)', marginTop: 'var(--sv-s5)' }}>
              <Button variant="primary" onClick={() => toast('Charging $128.40 to card', 'info')}>Charge $128.40</Button>
              <Button variant="ghost" onClick={() => toast('Discount panel opened', 'info')}>Add discount</Button>
            </div>
          </Card>
        </Row>
      </Sheet>
    </div>
  );
}
