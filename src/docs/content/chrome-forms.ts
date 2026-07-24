import type { DocEntry } from './types';

export const chrome: DocEntry[] = [
  /* ================================================================ B1 */
  {
    slug: 'band',
    name: 'Band',
    book: 'B1',
    category: 'chrome',
    tagline: 'The ink chrome zone: topbar with wordmark and horizontal nav, mono sub-tabs, and the page hero.',
    job: 'Carry ALL navigation and page context, so the paper below is 100% work.',
    tags: ['header', 'navigation', 'topbar', 'hero', 'no-sidebar', 'wordmark'],
    exports: ['Band', 'BandTopbar', 'BandNav', 'BandSubTabs', 'PageHero'],
    files: ['components/seventy-six/band.tsx', 'components/seventy-six/band.css'],
    intro: [
      'Every 76° screen is two zones, and this is the first: three stacked rows on <code>--sv-band</code> inside a 1280px container. <b>Topbar:</b> the 76° wordmark (six in seed, degree mark in band-soft — never omitted), the app name behind a hairline, horizontal nav, and the utility cluster. <b>Sub-tabs:</b> the active section\'s children in mono uppercase, collapsing to nothing when there are none. <b>PageHero:</b> the page\'s single h1 → one soft context line, with page-level actions on the right.',
      'Navigation is horizontal. A sidebar as primary nav is a firewall violation (A2) — full stop. The active item is white at weight 700 with a 2px seed underline flush to the row hairline; no background fills on nav items, ever.',
      'The hero\'s 68px bottom padding is load-bearing: it is what the Sheet\'s first row overlaps into. Stats never render in the hero — numbers live on paper.',
    ],
    examples: [
      {
        title: 'Full band composition',
        demoKey: 'band-full',
        surface: 'band',
        code: `import { Band, BandTopbar, BandNav, BandSubTabs, PageHero, Button } from '@/components/seventy-six';

<Band>
  <BandTopbar
    app="Warehouse"
    nav={
      <BandNav
        items={[
          { label: 'Overview', href: '/', active: true },
          { label: 'Operations', href: '/ops' },
          { label: 'Inventory', href: '/inventory' },
          { label: 'Reports', href: '/reports' },
        ]}
      />
    }
    utilities={<button className="site-search sv-mono">SEARCH ⌘K</button>}
  />
  <BandSubTabs
    items={[
      { label: 'ORDERS', href: '/ops/orders', active: true },
      { label: 'PICKING', href: '/ops/picking' },
      { label: 'DISPATCH', href: '/ops/dispatch' },
    ]}
  />
  <PageHero
    title="Good afternoon,"
    titleSoft="Warehouse A"
    context="24 JUL · all zones · synced 14:32"
    actions={<Button variant="primary">Create order</Button>}
  />
</Band>`,
      },
    ],
    props: [
      {
        component: 'BandTopbar',
        rows: [
          { name: 'app', type: 'string', description: 'App name after the wordmark hairline.' },
          { name: 'nav', type: 'ReactNode', description: 'A BandNav.' },
          { name: 'utilities', type: 'ReactNode', description: 'Right cluster: search trigger, notifications, avatar. The one place icon-only buttons are legal (with aria-label).' },
        ],
      },
      {
        component: 'BandNav / BandSubTabs',
        rows: [
          { name: 'items', type: 'BandNavItem[]', description: '{ label, href, active? }. SubTabs render nothing when empty.' },
          { name: 'renderLink', type: '(item, className, ariaCurrent) => ReactNode', description: 'Adapter for router Links — keeps the component router-agnostic.' },
        ],
      },
      {
        component: 'PageHero',
        rows: [
          { name: 'title / titleSoft', type: 'string', description: 'The h1 (27/800); the soft secondary word in band-soft.' },
          { name: 'context', type: 'string', description: 'One sentence max: date · scope · last sync.' },
          { name: 'actions', type: 'ReactNode', description: 'Max: one mono range control, two ghosts, ONE primary.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Primary nav is <code>&lt;nav aria-label="Primary"&gt;</code>; sub-tabs are <code>&lt;nav aria-label="Section"&gt;</code> — they are links that navigate, never ARIA tabs.',
        'Active state carries three cues: <code>aria-current="page"</code>, weight 700, and the underline — never color alone (C5).',
        'PageHero renders the page\'s ONE h1. The skip-link lands on the Sheet, the first content after the band.',
      ],
    },
    donts: [
      'No sidebars as primary navigation. Ever.',
      'No stat numbers in the hero — stats live on paper.',
      'No third nav level — that becomes CardTabs or a page.',
      'No bare "76" — the wordmark always carries the degree mark.',
      'No background fills on nav items; the underline is the state.',
    ],
    faq: [
      { q: 'How do I use it with React Router?', a: 'Pass renderLink={(item, className, ariaCurrent) => <Link to={item.href} className={className} aria-current={ariaCurrent}>{item.label}</Link>} — the components stay router-agnostic.' },
      { q: 'What if a section has no children?', a: 'Pass an empty items array to BandSubTabs and the row renders nothing — the band simply gets shorter.' },
      { q: 'How many actions can the hero hold?', a: 'The Book\'s ceiling: one mono range control, two ghost buttons, and one primary. More than that means the page is trying to be two pages.' },
    ],
  },

  /* ================================================================ B2 */
  {
    slug: 'sheet',
    name: 'Sheet & Row',
    book: 'B2',
    category: 'chrome',
    tagline: 'The platinum wall and its 12-col grid — including the signature -44px overlap row.',
    job: 'Hold the paper: grid, gutters, and the one overlap per page.',
    tags: ['layout', 'grid', 'main', 'overlap', 'wall', 'responsive'],
    exports: ['Sheet', 'Row'],
    files: ['components/seventy-six/sheet.tsx', 'components/seventy-six/sheet.css'],
    intro: [
      'Sheet is the <code>&lt;main&gt;</code> — the wall the paper hangs on, sharing the band\'s 1280px container and side padding. Row is the grid: 14px gutters with three canonical splits — <b>stats</b> (4×1fr, folding to 2×2 below 1000px), <b>main</b> (1.7fr/1fr), and <b>full</b>.',
      'The signature move: the first row of every top-level page carries <code>overlap</code>, pulling the paper -44px up over the band edge. Exactly one overlap row per page — it is a signature, not a repeating trick.',
    ],
    examples: [
      {
        title: 'The canonical overview skeleton',
        demoKey: 'sheet-skeleton',
        code: `import { Sheet, Row } from '@/components/seventy-six';

<Sheet>
  <Row split="stats" overlap>
    {/* four StatS1 cards */}
  </Row>
  <Row split="main">
    {/* Trend card · MeterList card */}
  </Row>
  <Row split="main">
    {/* DataTable card · ActivityList card */}
  </Row>
</Sheet>`,
      },
    ],
    props: [
      {
        component: 'Row',
        rows: [
          { name: 'split', type: "'stats' | 'main' | 'full'", defaultValue: "'full'", description: 'The canonical grid splits.' },
          { name: 'overlap', type: 'boolean', defaultValue: 'false', description: 'The single -44px overlap row. One per page.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Sheet renders <code>&lt;main id="sv-content"&gt;</code> — the skip-link target and the screen-reader main landmark.',
        'Focus order: the overlap row is the first content stop after the band (C3).',
      ],
    },
    donts: [
      'No second overlap row on the same page.',
      'No custom grid fractions per screen — compose from the three splits.',
      'No cards touching: 14px minimum gap is structural.',
    ],
    faq: [
      { q: 'Can I nest Rows?', a: 'A Row cell can contain a stack of cards (grid rows form naturally), but never a second Row grid — if a region needs its own grid, it is probably its own page section.' },
      { q: 'What happens below 1000px?', a: 'stats folds to 2×2, main stacks to one column, side padding drops to 18px — all built into the two components.' },
    ],
  },
];

export const forms: DocEntry[] = [
  /* ================================================================ B11 */
  {
    slug: 'field',
    name: 'Forms',
    book: 'B11',
    category: 'forms',
    tagline: 'Field, Select, Checkbox, Radio, Toggle — labels above, seed focus without glow, errors that say how to fix.',
    job: 'Collect one value per control, honestly labeled.',
    tags: ['form', 'input', 'select', 'checkbox', 'radio', 'toggle', 'switch', 'validation', 'error-message'],
    exports: ['Field', 'Select', 'Checkbox', 'Radio', 'Toggle'],
    files: ['components/seventy-six/field.tsx', 'components/seventy-six/field.css'],
    intro: [
      'Every control follows the same skeleton: a 12/600 label above (the placeholder is <b>never</b> a substitute), an optional 11.5 hint, the control itself — white with a hairline border, radius 4 — and, when needed, an error line in functional red stating <b>what went wrong and how to fix it</b>: "Quantity must be a whole number above 0."',
      'Focus is a 1.5px seed border with no glow ring. Validation timing is fixed system-wide: on blur, then on change after the first error — never on the first keystroke. Submit failures render a top-of-form error summary that links to each field and takes focus.',
      '<b>Select stays native</b> until a searchable combobox is genuinely required (then the full ARIA combobox pattern, as its own registered component). <b>Toggle</b> is only for instant-effect settings — anything that waits for "Save" is a Checkbox.',
    ],
    examples: [
      {
        title: 'A complete form group',
        demoKey: 'form-basic',
        surface: 'paper',
        code: `import { Field, Select, Checkbox, Toggle } from '@/components/seventy-six';

<Field
  label="Quantity"
  hint="Whole units, per carton"
  required
  inputMode="numeric"
  placeholder="0"
/>
<Select label="Zone" required defaultValue="a">
  <option value="a">Zone A · ambient</option>
  <option value="b">Zone B · chilled</option>
</Select>
<Checkbox label="Notify the picking team" defaultChecked />
<Toggle label="Auto-print labels" />`,
      },
      {
        title: 'Error state',
        description: 'The error is text a colleague would say — what and how to fix — wired via aria-describedby and aria-invalid.',
        demoKey: 'form-error',
        surface: 'paper',
        code: `<Field
  label="Quantity"
  required
  defaultValue="-2"
  error="Quantity must be a whole number above 0"
/>`,
      },
    ],
    props: [
      {
        component: 'Field / Select (shared chrome)',
        rows: [
          { name: 'label', type: 'string', description: 'The visible label. Required — placeholders never substitute.' },
          { name: 'hint', type: 'string', description: '11.5 soft line under the label.' },
          { name: 'error', type: 'string', description: 'What went wrong and how to fix it. Sets aria-invalid + describedby.' },
          { name: 'required', type: 'boolean', description: 'Mono * after the label + native required.' },
          { name: '…rest', type: 'native input/select props', description: 'value, onChange, type, inputMode, disabled…' },
        ],
      },
      {
        component: 'Checkbox / Radio / Toggle',
        rows: [
          { name: 'label', type: 'string', description: 'Part of the hit area, always.' },
          { name: '…rest', type: 'native input props', description: 'checked, defaultChecked, onChange, name, disabled…' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Space', action: 'Toggles Checkbox / Toggle; opens native Select.' },
        { keys: '↑ / ↓', action: 'Moves within a Radio group / native Select options.' },
      ],
      notes: [
        'Every control is a real native input — Checkbox, Radio, and Toggle are visually-hidden inputs with styled proxies, so form posts, autofill, and AT all behave.',
        'Toggle carries <code>role="switch"</code>; its state is announced as on/off.',
        'Errors are announced via <code>aria-describedby</code> the moment they render; required fields carry both the mono * and the attribute (C5).',
      ],
    },
    donts: [
      'No placeholder-as-label. The label is above the field, always.',
      'No focus glow rings; the border change is the focus state.',
      'No validation on first keystroke.',
      'No error toasts — errors render at the field (A2).',
      'No Toggle for anything that needs a Save button.',
      'No custom dropdown until a searchable combobox is genuinely required.',
    ],
    faq: [
      { q: 'How do I mark a field required?', a: 'Pass required — it renders the mono asterisk after the label and sets the native attribute, satisfying the C5 double-cue rule.' },
      { q: 'How should error copy read?', a: 'State what and how to fix, no blame, no "Please" openers: "Quantity must be a whole number above 0". The A3 copy rules are enforced in review.' },
      { q: 'Toggle or Checkbox?', a: 'Does flipping it take effect instantly? Toggle. Does it wait for a Save/Submit? Checkbox. This is behavioral, not aesthetic.' },
      { q: 'Where is the combobox?', a: 'Deliberately absent. Native Select covers v1; a searchable ARIA combobox joins the Book as its own registered component (with Radix as a candidate foundation) when a real product needs one.' },
    ],
  },
];
