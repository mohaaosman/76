import { useMemo, useState } from 'react';
import {
  Card,
  CardHead,
  PageHero,
  Row,
  Select,
  Sheet,
  StatS1,
  Tabs,
  TabPanel,
} from '@/components/seventy-six';
import { EntryTable } from '@/components/seventy-six/entry-table';
import type { EntryColumn } from '@/components/seventy-six/entry-table';
import { SettingList } from '@/components/seventy-six/setting-list';
import { LocaleProvider, createFormatters, localeNames } from '@/lib/i18n';
import type { ShippedLocale } from '@/lib/i18n';
import { HeroBand } from '../shell';
import { siteLocales, useSiteLocale } from '../site-i18n';

/**
 * The theming playground — the "Exploring" item, shipped. Every posture
 * the token layer knows (seed, mode, density, motion) and every language
 * the catalog ships, applied LIVE to one real screen, so a reader can
 * watch a goods receipt re-theme, re-pack and mirror without a reload.
 *
 * The preview is a WRAPPER declaring all four postures, never <html>:
 * that is the nearest-declaration rule every posture is built on, proven
 * on the page that documents it.
 */

type Seed = 'cobalt' | 'verdigris' | 'signal' | 'iris';
type Mode = 'light' | 'dark';
type Density = 'compact' | 'regular' | 'touch';

interface Line {
  sku: string;
  ordered: number;
  price: number;
}

const LINES: Line[] = [
  { sku: 'SKU-4471', ordered: 12, price: 186 },
  { sku: 'SKU-3108', ordered: 48, price: 24.5 },
  { sku: 'SKU-5520', ordered: 40, price: 18.75 },
  { sku: 'SKU-2207', ordered: 100, price: 3.2 },
];

/* The screen's OWN copy, per language. The component words (Post, Not
   saved, Expand…) come from the library catalog; this is the product's. */
const COPY: Record<ShippedLocale, {
  title: string;
  context: string;
  items: Record<string, string>;
  ordered: string;
  received: string;
  value: string;
  linesCard: string;
  linesSub: string;
  item: string;
  qtyOrdered: string;
  qtyReceived: string;
  lineValue: string;
  total: string;
  bounds: (n: string) => string;
  inputLabel: (sku: string) => string;
  statLines: string;
  statUnits: string;
  statValue: string;
  footLines: (n: string) => string;
  footUnits: (n: string) => string;
  footValue: string;
  settings: string;
  settingsSub: string;
  autoPost: string;
  autoOn: string;
  autoOff: string;
  notify: string;
  notifyOn: string;
  notifyOff: string;
  tabReceipt: string;
  tabSettings: string;
  summary: (a: string, b: string) => string;
}> = {
  en: {
    title: 'Goods receipt',
    context: 'PO-2291 · Halden Logistics · due 28 Nov 2026',
    items: { 'SKU-4471': 'Pallet racking, 2.4 m', 'SKU-3108': 'Shelf beam, 1.8 m', 'SKU-5520': 'Wire deck panel', 'SKU-2207': 'Anchor bolt kit' },
    ordered: 'ORDERED', received: 'RECEIVED', value: 'VALUE',
    linesCard: 'Lines on this delivery', linesSub: 'Type what arrived; post once',
    item: 'ITEM', qtyOrdered: 'ORDERED', qtyReceived: 'RECEIVED', lineValue: 'VALUE', total: 'TOTAL RECEIVED',
    bounds: (n) => `Enter 0 to ${n} — the order is for ${n}.`,
    inputLabel: (sku) => `Received, ${sku}`,
    statLines: 'LINES ORDERED', statUnits: 'UNITS RECEIVED', statValue: 'VALUE RECEIVED',
    footLines: (n) => `${n} units on the order`,
    footUnits: (n) => `${n} still outstanding`,
    footValue: 'At PO prices, before VAT',
    settings: 'Receiving rules', settingsSub: 'Take effect at once',
    autoPost: 'Post complete lines automatically', autoOn: 'A line that reaches its ordered quantity posts without a click.', autoOff: 'Every line waits for Post.',
    notify: 'Tell the buyer about short deliveries', notifyOn: 'The buyer gets one email per delivery that arrives short.', notifyOff: 'Short deliveries are recorded but nobody is emailed.',
    tabReceipt: 'Receipt', tabSettings: 'Rules',
    summary: (a, b) => `${a} of ${b} lines counted`,
  },
  fr: {
    title: 'Réception de marchandises',
    context: 'BC-2291 · Halden Logistics · échéance 28 nov. 2026',
    items: { 'SKU-4471': 'Rayonnage à palettes, 2,4 m', 'SKU-3108': 'Lisse, 1,8 m', 'SKU-5520': 'Panneau grillagé', 'SKU-2207': 'Kit de boulons d’ancrage' },
    ordered: 'COMMANDÉ', received: 'REÇU', value: 'VALEUR',
    linesCard: 'Lignes de cette livraison', linesSub: 'Saisissez ce qui est arrivé ; validez une fois',
    item: 'ARTICLE', qtyOrdered: 'COMMANDÉ', qtyReceived: 'REÇU', lineValue: 'VALEUR', total: 'TOTAL REÇU',
    bounds: (n) => `Saisissez de 0 à ${n} — la commande porte sur ${n}.`,
    inputLabel: (sku) => `Reçu, ${sku}`,
    statLines: 'LIGNES COMMANDÉES', statUnits: 'UNITÉS REÇUES', statValue: 'VALEUR REÇUE',
    footLines: (n) => `${n} unités commandées`,
    footUnits: (n) => `${n} encore attendues`,
    footValue: 'Aux prix du bon de commande, hors TVA',
    settings: 'Règles de réception', settingsSub: 'Effet immédiat',
    autoPost: 'Valider automatiquement les lignes complètes', autoOn: 'Une ligne qui atteint la quantité commandée est validée sans clic.', autoOff: 'Chaque ligne attend la validation.',
    notify: 'Prévenir l’acheteur des livraisons incomplètes', notifyOn: 'L’acheteur reçoit un e-mail par livraison incomplète.', notifyOff: 'Les livraisons incomplètes sont enregistrées sans e-mail.',
    tabReceipt: 'Réception', tabSettings: 'Règles',
    summary: (a, b) => `${a} lignes sur ${b} comptées`,
  },
  ar: {
    title: 'استلام البضائع',
    context: 'أمر الشراء PO-2291 · Halden Logistics · الاستحقاق 28 نوفمبر 2026',
    items: { 'SKU-4471': 'رفوف منصات، 2.4 م', 'SKU-3108': 'عارضة رف، 1.8 م', 'SKU-5520': 'لوح شبكي', 'SKU-2207': 'طقم مسامير تثبيت' },
    ordered: 'المطلوب', received: 'المستلَم', value: 'القيمة',
    linesCard: 'أسطر هذه الشحنة', linesSub: 'اكتب ما وصل، ثم رحّل مرة واحدة',
    item: 'الصنف', qtyOrdered: 'المطلوب', qtyReceived: 'المستلَم', lineValue: 'القيمة', total: 'إجمالي المستلَم',
    bounds: (n) => `أدخل من 0 إلى ${n} — الطلب على ${n}.`,
    inputLabel: (sku) => `المستلَم، ${sku}`,
    statLines: 'الأسطر المطلوبة', statUnits: 'الوحدات المستلَمة', statValue: 'القيمة المستلَمة',
    footLines: (n) => `${n} وحدة في الطلب`,
    footUnits: (n) => `${n} لم تصل بعد`,
    footValue: 'بأسعار أمر الشراء، قبل الضريبة',
    settings: 'قواعد الاستلام', settingsSub: 'تسري فورًا',
    autoPost: 'ترحيل الأسطر المكتملة تلقائيًا', autoOn: 'يُرحَّل السطر الذي يبلغ الكمية المطلوبة دون نقرة.', autoOff: 'ينتظر كل سطر الترحيل.',
    notify: 'إبلاغ المشتري بالشحنات الناقصة', notifyOn: 'يتلقى المشتري رسالة واحدة لكل شحنة ناقصة.', notifyOff: 'تُسجَّل الشحنات الناقصة دون إرسال بريد.',
    tabReceipt: 'الاستلام', tabSettings: 'القواعد',
    summary: (a, b) => `تم عدّ ${a} من ${b} أسطر`,
  },
  so: {
    title: 'Helitaanka alaabta',
    context: 'PO-2291 · Halden Logistics · waqtiga 28 Nof 2026',
    items: { 'SKU-4471': 'Khaanadaha baalada, 2.4 m', 'SKU-3108': 'Biinka khaanadda, 1.8 m', 'SKU-5520': 'Looxa silig', 'SKU-2207': 'Xirmada boolal' },
    ordered: 'LA DALBAY', received: 'LA HELAY', value: 'QIIMAHA',
    linesCard: 'Safafka keenistan', linesSub: 'Qor waxa yimid; hal mar gudbi',
    item: 'SHAYGA', qtyOrdered: 'LA DALBAY', qtyReceived: 'LA HELAY', lineValue: 'QIIMAHA', total: 'WADARTA LA HELAY',
    bounds: (n) => `Geli 0 ilaa ${n} — dalabku waa ${n}.`,
    inputLabel: (sku) => `La helay, ${sku}`,
    statLines: 'SAFAFKA LA DALBAY', statUnits: 'UNUGYADA LA HELAY', statValue: 'QIIMAHA LA HELAY',
    footLines: (n) => `${n} unug ayaa dalabka ku jira`,
    footUnits: (n) => `${n} weli lama helin`,
    footValue: 'Qiimaha PO, ka hor VAT',
    settings: 'Xeerarka helitaanka', settingsSub: 'Isla markiiba way shaqeeyaan',
    autoPost: 'Si toos ah u gudbi safafka dhammaystiran', autoOn: 'Safka gaara tirada la dalbay wuu gudbaa iyada oo aan la gujin.', autoOff: 'Saf kasta wuxuu sugayaa Gudbi.',
    notify: 'U sheeg iibsadaha keenista gaaban', notifyOn: 'Iibsaduhu wuxuu helayaa hal email keenis kasta oo gaaban.', notifyOff: 'Keenista gaaban waa la diiwaangeliyaa, email lama diro.',
    tabReceipt: 'Helitaanka', tabSettings: 'Xeerarka',
    summary: (a, b) => `${a} ka mid ah ${b} saf ayaa la tiriyay`,
  },
};

const ICON = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 5l6-3 6 3v6l-6 3-6-3V5zM2 5l6 3 6-3M8 8v6" strokeLinejoin="round" />
  </svg>
);

function ReceiptScreen({ locale }: { locale: ShippedLocale }) {
  const c = COPY[locale];
  const f = createFormatters(locale);
  const [values, setValues] = useState<Record<string, string>>({
    'SKU-4471': '12',
    'SKU-3108': '36',
    'SKU-5520': '40',
    'SKU-2207': '',
  });
  const [autoPost, setAutoPost] = useState(true);
  const [notify, setNotify] = useState(false);
  const [tab, setTab] = useState('receipt');
  const [posting, setPosting] = useState(false);

  /* The CALLER does the arithmetic and the formatting (C9) — in the
     reader's locale, via the caller-layer formatters. */
  const qty = (sku: string) => {
    const n = Number(values[sku]);
    return values[sku] === '' || Number.isNaN(n) ? 0 : n;
  };
  const orderedUnits = LINES.reduce((a, l) => a + l.ordered, 0);
  const receivedUnits = LINES.reduce((a, l) => a + Math.min(qty(l.sku), l.ordered), 0);
  const receivedValue = LINES.reduce((a, l) => a + Math.min(qty(l.sku), l.ordered) * l.price, 0);
  const counted = LINES.filter((l) => values[l.sku] !== '').length;

  const columns: EntryColumn<Line>[] = [
    { key: 'sku', header: 'SKU', kind: 'id', render: (l) => l.sku },
    { key: 'item', header: c.item, kind: 'text', render: (l) => c.items[l.sku] },
    { key: 'ordered', header: c.qtyOrdered, kind: 'num', render: (l) => f.number(l.ordered) },
    { key: 'received', header: c.qtyReceived, kind: 'entry' },
    { key: 'value', header: c.lineValue, kind: 'num', render: (l) => f.money(Math.min(qty(l.sku), l.ordered) * l.price, 'USD') },
  ];

  return (
    <>
      <div className="sv-band">
        <PageHero headingLevel={2} title={c.title} context={c.context} />
      </div>
      {/* Not <Sheet>: Sheet IS the page's <main id="sv-content">, and a
          preview inside a page is not a second main landmark. */}
      <div className="sv-sheet" role="region" aria-label={c.title}>
        <Row overlap split="stats">
          <StatS1
            label={c.statLines}
            value={f.number(LINES.length)}
            icon={ICON}
            footnote={c.footLines(f.number(orderedUnits))}
          />
          <StatS1
            label={c.statUnits}
            value={f.number(receivedUnits)}
            delta={Number(((receivedUnits / orderedUnits) * 100).toFixed(1))}
            deltaAgainst={c.ordered.toLowerCase()}
            icon={ICON}
            footnote={c.footUnits(f.number(orderedUnits - receivedUnits))}
          />
          <StatS1
            label={c.statValue}
            value={f.money(receivedValue, 'USD')}
            icon={ICON}
            footnote={c.footValue}
          />
        </Row>
        <Row>
          <Tabs
            label={c.linesCard}
            tabs={[
              { id: 'receipt', label: c.tabReceipt },
              { id: 'settings', label: c.tabSettings },
            ]}
            active={tab}
            onChange={setTab}
            idBase={`pg-${locale}`}
          />
        </Row>
        <TabPanel idBase={`pg-${locale}`} tabId="receipt" active={tab === 'receipt'}>
          <Row>
            <Card>
              <CardHead title={c.linesCard} subtitle={c.linesSub} />
              <EntryTable
                caption={c.linesCard}
                columns={columns}
                rows={LINES}
                rowKey={(l) => l.sku}
                values={values}
                onValueChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))}
                bounds={(l) => ({ min: 0, max: l.ordered })}
                boundsError={(l) => c.bounds(f.number(l.ordered))}
                inputLabel={(l) => c.inputLabel(l.sku)}
                sync={values['SKU-2207'] === '' ? undefined : { 'SKU-2207': 'unsaved' }}
                totals={[
                  {
                    label: c.total,
                    strong: true,
                    cells: { received: f.number(receivedUnits), value: f.money(receivedValue, 'USD') },
                  },
                ]}
                summary={c.summary(f.number(counted), f.number(LINES.length))}
                posting={posting}
                onPost={() => {
                  setPosting(true);
                  window.setTimeout(() => setPosting(false), 1200);
                }}
              />
            </Card>
          </Row>
        </TabPanel>
        <TabPanel idBase={`pg-${locale}`} tabId="settings" active={tab === 'settings'}>
          <Row>
            <Card>
              <CardHead title={c.settings} subtitle={c.settingsSub} />
              <div className="sv-card__body">
                <SettingList
                  label={c.settings}
                  rows={[
                    {
                      id: 'auto',
                      title: c.autoPost,
                      consequence: { on: c.autoOn, off: c.autoOff },
                      control: { kind: 'toggle', checked: autoPost, onChange: setAutoPost },
                    },
                    {
                      id: 'notify',
                      title: c.notify,
                      consequence: { on: c.notifyOn, off: c.notifyOff },
                      control: { kind: 'toggle', checked: notify, onChange: setNotify },
                    },
                  ]}
                />
              </div>
            </Card>
          </Row>
        </TabPanel>
      </div>
    </>
  );
}

export function PlaygroundPage() {
  const { locale: siteLocale } = useSiteLocale();
  const [seed, setSeed] = useState<Seed>('cobalt');
  const [mode, setMode] = useState<Mode>('light');
  const [density, setDensity] = useState<Density>('regular');
  const [motion, setMotion] = useState<'on' | 'off'>('on');
  const [locale, setLocale] = useState<ShippedLocale>(siteLocale);

  /* Remount on every posture change, so the motion posture's arrivals and
     the count-ups replay — the point of a playground is to watch it. */
  const key = useMemo(() => [seed, mode, density, motion, locale].join('-'), [seed, mode, density, motion, locale]);

  return (
    <>
      <HeroBand>
        <PageHero
          title="Playground"
          titleSoft="one screen, every posture"
          context="Swap the seed, the mode, the density, the motion and the language, and watch a real goods receipt re-theme, re-pack and mirror."
        />
      </HeroBand>
      <Sheet aria-label="Playground">
        <Row overlap>
          <Card>
            <CardHead title="Postures" subtitle="Declared on the preview's wrapper — never on <html>" />
            <div className="sv-card__body site-playground__controls">
              <Select label="Seed" value={seed} onChange={(e) => setSeed(e.target.value as Seed)}>
                <option value="cobalt">Cobalt · ERP</option>
                <option value="verdigris">Verdigris · CRM</option>
                <option value="signal">Signal · POS</option>
                <option value="iris">Iris · Health</option>
              </Select>
              <Select label="Mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
              <Select label="Density" value={density} onChange={(e) => setDensity(e.target.value as Density)}>
                <option value="compact">Compact · analyst</option>
                <option value="regular">Regular · default</option>
                <option value="touch">Touch · floor, ≥48px</option>
              </Select>
              <Select label="Motion" value={motion} onChange={(e) => setMotion(e.target.value as 'on' | 'off')}>
                <option value="on">On</option>
                <option value="off">Off</option>
              </Select>
              <Select label="Language" value={locale} onChange={(e) => setLocale(e.target.value as ShippedLocale)}>
                {siteLocales.map((l) => (
                  <option key={l} value={l} lang={l}>
                    {localeNames[l]}
                  </option>
                ))}
              </Select>
            </div>
            <p className="site-playground__stamp sv-mono">
              {`<div data-seed="${seed}"${mode === 'dark' ? ' data-mode="dark"' : ''} data-density="${density}" data-motion="${motion}">  ·  <LocaleProvider locale="${locale}">`}
            </p>
          </Card>
        </Row>
        <Row>
          <div
            key={key}
            className="site-playground__preview"
            data-seed={seed}
            data-mode={mode === 'dark' ? 'dark' : undefined}
            data-density={density}
            data-motion={motion}
          >
            <LocaleProvider locale={locale}>
              <ReceiptScreen locale={locale} />
            </LocaleProvider>
          </div>
        </Row>
      </Sheet>
    </>
  );
}
