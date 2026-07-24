import type { DocEntry } from './types';

export const primitives: DocEntry[] = [
  /* ================================================================ B10 */
  {
    slug: 'button',
    name: 'Button',
    book: 'B10',
    category: 'primitives',
    tagline: 'Native <button> with four registered variants — no shadows, no transforms, one primary per view region.',
    job: 'Trigger exactly one named action.',
    tags: ['button', 'primary', 'ghost', 'danger', 'loading-state', 'pos-touch-target', 'text-link'],
    exports: ['Button', 'ButtonLink'],
    files: ['components/seventy-six/button.tsx', 'components/seventy-six/button.css'],
    intro: [
      'Four variants, each with a registered job. <b>primary</b> is a seed fill with white text — the one loud element a view region is allowed. <b>ghost</b> is transparent with a hairline border that turns seed on hover. <b>danger</b> is ghost anatomy with red text; it only becomes a red fill as the final confirm inside a Dialog (add <code>data-confirm</code>). <b>link</b> is the 12/600 seed text action used in card heads.',
      'Buttons never move or resize on state change. The loading state locks the button to its pre-loading width, swaps the label for <code>loadingLabel</code>, and shows the one sanctioned continuous animation in the system: a 12px inline spinner. Disabled is a wall-colored fill with faint text — never opacity on the whole button.',
      'The <code>pos</code> flag applies the POS contract: identical anatomy at ≥48px height, 14.5/700 label, and press feedback under 100ms.',
    ],
    examples: [
      {
        title: 'Variants',
        description: 'One primary per view region; everything else is quiet. Buttons name the action\'s object — never "Submit" or "Click here".',
        demoKey: 'button-variants',
        surface: 'paper',
        code: `import { Button, ButtonLink } from '@/components/seventy-six';

<Button variant="primary">Create order</Button>
<Button variant="ghost">Export July</Button>
<Button variant="danger">Delete draft</Button>
<ButtonLink href="/orders">View all</ButtonLink>`,
      },
      {
        title: 'Loading & disabled',
        description: 'Width is locked before the label swaps, so nothing shifts. Disabled keeps full label contrast rules: wall fill, faint text, not-allowed cursor.',
        demoKey: 'button-states',
        surface: 'paper',
        code: `<Button variant="primary" isLoading loadingLabel="Saving…">
  Save changes
</Button>
<Button variant="primary" disabled>Approve PO-2291</Button>`,
      },
      {
        title: 'POS variant',
        description: 'Same bones at ≥48px. Press feedback is a seed-tint flash on product buttons; the single pay-primary uses seed-deep.',
        demoKey: 'button-pos',
        surface: 'paper',
        code: `<Button variant="ghost" pos>Iced latte · $4.50</Button>
<Button variant="primary" pos>Charge $23.80</Button>`,
      },
    ],
    props: [
      {
        component: 'Button',
        rows: [
          { name: 'variant', type: "'primary' | 'ghost' | 'danger' | 'link'", defaultValue: "'primary'", description: 'The registered variant. One primary per view region.' },
          { name: 'pos', type: 'boolean', defaultValue: 'false', description: 'POS contract: ≥48px height, larger label, <100ms press feedback.' },
          { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Locks width, swaps label for <code>loadingLabel</code>, sets <code>aria-busy</code>, disables the button.' },
          { name: 'loadingLabel', type: 'string', defaultValue: "'Working…'", description: 'Label shown while loading — name the operation ("Saving…").' },
          { name: 'iconLeading', type: 'ReactNode', description: '16px stroke icon before the label. Icon-only buttons must add <code>aria-label</code>.' },
          { name: '…rest', type: 'ButtonHTMLAttributes', description: 'Everything a native button takes: type, onClick, disabled, aria-*.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Tab', action: 'Moves focus; focus ring is 2px seed, offset 2px, always visible.' },
        { keys: 'Enter / Space', action: 'Activates — native button semantics, nothing re-implemented.' },
      ],
      notes: [
        'Rendered as <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> only — never a clickable div.',
        'Icon-only buttons are allowed solely in the topbar utility cluster and require an <code>aria-label</code>; the icon itself is <code>aria-hidden</code>.',
        'Loading sets <code>aria-busy="true"</code> and disables interaction; the label change is announced because it is real text, not a spinner alone.',
        'Minimum hit area 24×24 on desktop, 48×48 in POS contexts.',
      ],
    },
    donts: [
      'No two seed-filled primaries in the same view region.',
      'No red fill outside a dialog\'s final destructive confirm.',
      'No opacity-dimmed disabled state — use the wall fill + faint text spec.',
      'No vague labels: "Submit", "Click here", and "Learn more" are banned copy (A3). Name the object: "Create order".',
      'No transforms or size changes on press — feedback is color only.',
    ],
    faq: [
      { q: 'Which variants are available?', a: 'primary (seed fill), ghost (hairline border), danger (ghost anatomy, red text), and link (seed text action). Set them via the variant prop.' },
      { q: 'How do I show a loading state?', a: 'Set isLoading and give a loadingLabel like "Saving…". The button locks its width, shows a 12px inline spinner, sets aria-busy, and ignores clicks until isLoading turns false.' },
      { q: 'How do I disable a button?', a: 'Pass the native disabled prop. It renders a wall-colored fill with faint text and cursor: not-allowed.' },
      { q: 'How do I make a button full-width?', a: 'Buttons are inline-flex; apply width: 100% from the parent layout (e.g. a grid column). The POS pay-primary is the one case the Book prescribes full column width.' },
      { q: 'Can a button render as a link?', a: 'Use ButtonLink for text-link actions, or wrap your router\'s Link with the sv-btn classes — the styles are class-based, so any anchor can carry them.' },
    ],
  },

  /* ================================================================ B12 */
  {
    slug: 'status-word',
    name: 'StatusWord',
    book: 'B12',
    category: 'primitives',
    tagline: 'A 6px currentColor dot + a colored word. The word is the meaning; the dot is rhythm.',
    job: 'State the status of one thing, in one word.',
    tags: ['status', 'badge-replacement', 'dot', 'semantic-color', 'no-pills'],
    exports: ['StatusWord'],
    files: ['components/seventy-six/status-word.tsx', 'components/seventy-six/status-word.css'],
    intro: [
      'This is the system\'s entire status vocabulary: <b>ok</b> renders the green word, <b>neutral</b> the soft-ink word, <b>bad</b> the red word. Functional colors may color words and 6px dots — never surfaces (Law 2), which is why filled pills, badges, and chips are firewall violations.',
      'Status wording is <b>registered per product</b>: an ERP might register Fulfilled=ok, Pending=neutral, On hold=bad. Inventing statuses ad hoc is a defect — add new words to the product\'s registry first.',
    ],
    examples: [
      {
        title: 'The three tones',
        demoKey: 'status-tones',
        surface: 'paper',
        code: `import { StatusWord } from '@/components/seventy-six';

<StatusWord tone="ok">Fulfilled</StatusWord>
<StatusWord tone="neutral">Pending</StatusWord>
<StatusWord tone="bad">On hold</StatusWord>`,
      },
      {
        title: 'In a table cell',
        description: 'The natural habitat: DataTable status columns, where the dot+word pattern scans in a fast vertical sweep.',
        demoKey: 'status-table',
        surface: 'paper',
        code: `{
  key: 'status',
  header: 'STATUS',
  kind: 'status',
  render: (row) => <StatusWord tone={row.tone}>{row.status}</StatusWord>,
}`,
      },
    ],
    props: [
      {
        component: 'StatusWord',
        rows: [
          { name: 'tone', type: "'ok' | 'neutral' | 'bad'", description: 'Maps to --sv-ok, --sv-ink-soft, --sv-bad. Required.' },
          { name: 'children', type: 'string', description: 'The registered status word. Required — the dot never appears alone.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Meaning is never carried by color alone (C5): the word IS the status, so screen readers and color-blind users read exactly what sighted users read.',
        'The dot is <code>aria-hidden</code> decoration.',
      ],
    },
    donts: [
      'No filled pills, badges, or chips — ever (A2).',
      'No dot without a word; the dot is rhythm, not information.',
      'No ad-hoc status words: the vocabulary is registered per product.',
      'No coloring of table rows or cells to echo the status — the word is enough.',
    ],
    faq: [
      { q: 'Which colors are available?', a: 'Three tones: ok (green #14804A), neutral (soft ink), bad (red #C43D2E). All pass AA on paper. There is deliberately no yellow/amber tone — attention states use the neutral word.' },
      { q: 'How do I add a new status like "Escalated"?', a: 'Register the word and its tone in your product\'s status vocabulary, then use it: <StatusWord tone="bad">Escalated</StatusWord>. The registration step is what keeps status language consistent product-wide.' },
      { q: 'Can I use it outside tables?', a: 'Yes — activity rows, card footnotes, and detail panels all use the same dot+word. Only the hero is off-limits (stats live on paper).' },
    ],
  },

  /* ============================================================ Card */
  {
    slug: 'card',
    name: 'Card',
    book: 'A4',
    category: 'primitives',
    tagline: 'The paper primitive: one shadow, one radius, zero border. Every widget composes it.',
    job: 'Be the sheet of paper a widget is printed on.',
    tags: ['card', 'surface', 'paper', 'card-head', 'container'],
    exports: ['Card', 'CardHead'],
    files: ['components/seventy-six/card.tsx', 'components/seventy-six/card.css'],
    intro: [
      'Card is not a widget type — it is the paper the widgets are printed on. It enforces the A4 checklist mechanically: background <code>--sv-paper</code>, radius <code>--sv-r</code>, exactly one <code>--sv-shadow</code>, no border. If you find yourself styling a second shadow or a tinted background, you are building a defect.',
      '<b>CardHead</b> is the universal head: bold 13.5 title with an optional faint subtitle on the left, and at most one action on the right — a seed text link or a mono range control, never an icon-only mystery menu.',
    ],
    examples: [
      {
        title: 'Card with universal head',
        demoKey: 'card-basic',
        code: `import { Card, CardHead, ButtonLink } from '@/components/seventy-six';

<Card>
  <CardHead
    title="Open orders"
    subtitle="Updated 14:32 · warehouse A"
    action={<ButtonLink href="/orders">View all</ButtonLink>}
  />
  {/* widget body */}
</Card>`,
      },
    ],
    props: [
      {
        component: 'Card',
        rows: [
          { name: 'as', type: "'div' | 'section' | 'article'", defaultValue: "'section'", description: 'Semantic element. Cards that link wrap the whole card in the anchor instead.' },
          { name: '…rest', type: 'HTMLAttributes', description: 'className, aria-label, etc.' },
        ],
      },
      {
        component: 'CardHead',
        rows: [
          { name: 'title', type: 'string', description: 'Bold 13.5/700 title. Required.' },
          { name: 'subtitle', type: 'string', description: 'Faint 11.5 subtitle under the title.' },
          { name: 'action', type: 'ReactNode', description: 'ONE action, right-aligned — a ButtonLink or mono range control.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'CardHead renders an <code>&lt;h3&gt;</code>; keep the page\'s heading ladder unskipped (one h1 in the hero, h2s for page sections if needed).',
        'If the whole card links somewhere, the card itself is the anchor with a focus ring per C3 — hover shows nothing beyond the cursor; paper does not lift.',
      ],
    },
    donts: [
      'No borders, no second shadow, no tinted backgrounds — contrast alone separates paper from wall.',
      'No hover lift, scale, or glow. Paper does not perform.',
      'No icon-only "⋯" menu as the head action.',
      'No card-in-card nesting; if a card needs sections, use hairlines.',
    ],
    faq: [
      { q: 'How do I make a card clickable?', a: 'Wrap the Card in the anchor/Link and put the focus ring on the anchor. The Book\'s rule: whole card is the target, hover adds nothing visual beyond the cursor.' },
      { q: 'Can I change the elevation?', a: 'No. There is exactly one shadow token in the system. Depth hierarchies are expressed by layout, not by stacking shadows.' },
      { q: 'Where do filter tabs go?', a: 'Directly under CardHead, using the CardTabs component — the Bissaa pattern used by DataTable.' },
    ],
  },

  /* ================================================================ B13 */
  {
    slug: 'dialog',
    name: 'Dialog',
    book: 'B13',
    category: 'primitives',
    tagline: 'Native <dialog> in a paper card on a flat scrim — focus trap, Esc, and top layer for free.',
    job: 'Interrupt for one decision or one form.',
    tags: ['dialog', 'modal', 'native-dialog', 'confirm', 'destructive-confirm', 'scrim'],
    exports: ['Dialog'],
    files: ['components/seventy-six/dialog.tsx', 'components/seventy-six/dialog.css'],
    intro: [
      'Built on the platform: <code>showModal()</code> gives us the top layer, focus trapping, Esc handling, and <code>::backdrop</code> without a single dependency. The scrim is flat <code>rgba(27,31,38,.4)</code> — no blur, because glassmorphism is banned.',
      'Anatomy: 15/700 title, 13/1.55 soft body, right-aligned footer with a ghost cancel and <b>one</b> primary or danger action. 480px max width; forms get 640px via <code>wide</code>. There is no "X" close button as the only path out — the footer always carries a named cancel.',
      'Destructive confirms follow B10: the dialog title names the object ("Delete ORD-10482?"), and the confirming button is the single place a red fill is legal (<code>data-confirm</code> on a danger Button).',
    ],
    examples: [
      {
        title: 'Confirm dialog',
        demoKey: 'dialog-basic',
        code: `import { useState } from 'react';
import { Dialog, Button } from '@/components/seventy-six';

const [open, setOpen] = useState(false);

<Button variant="ghost" onClick={() => setOpen(true)}>Archive order</Button>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Archive ORD-10482?"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>Archive order</Button>
    </>
  }
>
  The order moves to the archive and leaves the open-orders table.
  You can restore it from Reports → Archive.
</Dialog>`,
      },
      {
        title: 'Destructive confirm',
        description: 'destructive disables scrim-click close; the red fill appears here and nowhere else.',
        demoKey: 'dialog-destructive',
        code: `<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete ORD-10482?"
  destructive
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" data-confirm onClick={handleDelete}>
        Delete order
      </Button>
    </>
  }
>
  This permanently removes the order and its 3 line items.
  This cannot be undone.
</Dialog>`,
      },
    ],
    props: [
      {
        component: 'Dialog',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled visibility; drives showModal()/close().' },
          { name: 'onClose', type: '() => void', description: 'Called on Esc, scrim click (non-destructive), or your cancel button.' },
          { name: 'title', type: 'string', description: 'The 15/700 title; wired to aria-labelledby. Required.' },
          { name: 'wide', type: 'boolean', defaultValue: 'false', description: '640px max width for forms; default 480px.' },
          { name: 'destructive', type: 'boolean', defaultValue: 'false', description: 'Scrim click no longer closes; Esc still works unless preventEscape.' },
          { name: 'preventEscape', type: 'boolean', defaultValue: 'false', description: 'Blocks Esc while a destructive action is mid-flight.' },
          { name: 'footer', type: 'ReactNode', description: 'Right-aligned actions: ghost cancel + ONE primary/danger.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Esc', action: 'Closes the topmost layer (suppressible mid-destructive-confirm via preventEscape).' },
        { keys: 'Tab / ⇧Tab', action: 'Cycles inside the dialog — native top-layer focus trapping.' },
      ],
      notes: [
        '<code>role="dialog"</code> semantics, <code>aria-modal</code>, and <code>aria-labelledby</code> come from the native element plus the wired title id.',
        'Focus moves to the first meaningful control on open and returns to the invoker on close — both native <code>showModal()</code> behaviors.',
        'Scrim click closes non-destructive dialogs only.',
      ],
    },
    donts: [
      'No "X" icon as the only close path — the footer names its cancel.',
      'No blur on the scrim; it is one flat rgba value.',
      'No stacked dialogs; a second decision is a second moment.',
      'No red-filled confirm outside this component\'s destructive footer.',
    ],
    faq: [
      { q: 'Why native <dialog> instead of a portal library?', a: 'The platform now provides the hard parts — top layer, focus trap, Esc, backdrop — with better screen-reader behavior than most reimplementations, and it removes an entire dependency tree.' },
      { q: 'How do I make a form dialog?', a: 'Set wide (640px) and render your Field/Select components as children; the footer\'s primary names the operation ("Create order"). Validation follows B11: on blur, then on change after first error.' },
      { q: 'How do I stop users closing during a delete?', a: 'Set destructive (kills scrim close) and flip preventEscape while the request is in flight; re-enable when it settles.' },
    ],
  },

  /* ================================================================ B14 */
  {
    slug: 'toast',
    name: 'Toast',
    book: 'B14',
    category: 'primitives',
    tagline: 'Bottom-left paper slips for success and neutral info only — errors always render inline at their source.',
    job: 'Confirm that something finished, without demanding attention.',
    tags: ['toast', 'notification', 'aria-live', 'auto-dismiss', 'success-feedback'],
    exports: ['ToastProvider', 'useToast'],
    files: ['components/seventy-six/toast.tsx', 'components/seventy-six/toast.css'],
    intro: [
      'Toasts are the system\'s quietest voice: a paper card with a 2px left rule (seed for info, green for ok), bottom-left, auto-dismissing after 5 seconds with pause-on-hover, at most two stacked. They confirm; they never warn — an error belongs inline next to the field or row that caused it (Firewall A2).',
      'Wrap the app once in <code>ToastProvider</code>; fire from anywhere with <code>useToast()</code>. A toast may repeat an available action ("Undo" also in context) but must never be the only path to one.',
    ],
    examples: [
      {
        title: 'Firing toasts',
        demoKey: 'toast-basic',
        surface: 'paper',
        code: `import { ToastProvider, useToast, Button } from '@/components/seventy-six';

// main.tsx: <ToastProvider><App /></ToastProvider>

function SaveBar() {
  const { toast } = useToast();
  return (
    <>
      <Button variant="ghost" onClick={() => toast('Export started — July orders', 'info')}>
        Export July
      </Button>
      <Button variant="primary" onClick={() => toast('Order ORD-10482 created', 'ok')}>
        Create order
      </Button>
    </>
  );
}`,
      },
    ],
    props: [
      {
        component: 'useToast → toast()',
        rows: [
          { name: 'message', type: 'string', description: 'Calm, factual, specific. No exclamation marks (A3).' },
          { name: 'tone', type: "'ok' | 'info'", defaultValue: "'info'", description: 'ok = green left rule; info = seed. There is deliberately no error tone.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The container is an <code>aria-live="polite"</code> region — announcements never interrupt the user mid-task.',
        'Auto-dismiss pauses on hover; the 5s window plus the polite region means content is announced in full before removal.',
        'Never put the only path to an action in a toast; undo must also exist in context.',
      ],
    },
    donts: [
      'No error toasts — errors render inline at their source.',
      'No more than two stacked; older toasts yield.',
      'No top-right placement; 76° toasts live bottom-left.',
      'No "Awesome!" / "Oops" copy — a toast speaks like a competent colleague.',
    ],
    faq: [
      { q: 'How do I show an error?', a: 'Not with a toast. Render the error inline next to its cause — a Field error, a table-row StatusWord, or a Dialog if the failure blocks the flow. Toast tones are ok and info only, by design.' },
      { q: 'How long do toasts stay?', a: '5 seconds, pausing while hovered, resuming with at least 800ms of grace. Two can stack; a third replaces the oldest.' },
      { q: 'Can I add an action button to a toast?', a: 'Yes, as a duplicate of an action that exists in context — a toast must never be the only path to anything.' },
    ],
  },

  /* ================================================================ B18 */
  {
    slug: 'tooltip',
    name: 'Tooltip',
    book: 'B18',
    category: 'primitives',
    tagline: 'The popover attribute in the top layer: ink card, 300ms delay, focus-visible triggers included.',
    job: 'Add one line of supplementary context to a control.',
    tags: ['tooltip', 'popover-attribute', 'top-layer', 'hover', 'focus', 'supplementary'],
    exports: ['Tooltip'],
    files: ['components/seventy-six/tooltip.tsx', 'components/seventy-six/tooltip.css'],
    intro: [
      'Built on the native <code>popover</code> attribute, so the tip renders in the top layer with zero z-index management and zero positioning dependencies. A small placement routine keeps it above the trigger, flipping below when there is no room.',
      'Tooltips are <b>supplementary only</b>. If removing the tooltip removes the meaning, the design is wrong — A4 requires every icon to have an adjacent text label or aria-label of its own. The tooltip adds detail (a full timestamp, a keyboard hint), it never substitutes for a label.',
    ],
    examples: [
      {
        title: 'On a button',
        description: 'Appears after 300ms of hover, or immediately on keyboard focus — hover-dependence is banned (C8).',
        demoKey: 'tooltip-basic',
        surface: 'paper',
        code: `import { Tooltip, Button } from '@/components/seventy-six';

<Tooltip content="Exports the filtered view · ⌘E">
  <Button variant="ghost">Export July</Button>
</Tooltip>`,
      },
    ],
    props: [
      {
        component: 'Tooltip',
        rows: [
          { name: 'content', type: 'string', description: 'The supplementary line. Plain text only, 11.5px white on ink.' },
          { name: 'children', type: 'ReactElement', description: 'A single focusable trigger (button, a). Receives aria-describedby automatically.' },
          { name: 'delay', type: 'number', defaultValue: '300', description: 'Hover delay in ms. Focus shows immediately regardless.' },
        ],
      },
    ],
    a11y: {
      keyboard: [{ keys: 'Tab (focus)', action: 'Shows the tooltip immediately; blur hides it.' }],
      notes: [
        'The tip carries <code>role="tooltip"</code> and is linked via <code>aria-describedby</code> on the trigger.',
        'Never the sole carrier of a label (A4) — icon-only triggers still need their own aria-label.',
      ],
    },
    donts: [
      'No interactive content inside a tooltip — no links, no buttons.',
      'No tooltip as the only label for an icon button.',
      'No arrow/beak decoration; the ink card is enough.',
      'No instant-on hover; the 300ms delay prevents flicker sweeps.',
    ],
    faq: [
      { q: 'Why the popover attribute instead of a positioning library?', a: 'popover puts the tip in the browser top layer — above dialogs and sticky headers — with no z-index rules. The only JS needed is a 10-line placement calc, which beats shipping a floating-UI dependency for 11.5px text.' },
      { q: 'Does it work for keyboard users?', a: 'Yes — focus shows it immediately (no delay) and blur hides it, per C8\'s "no hover-dependent functionality" rule.' },
      { q: 'Can I put rich content in it?', a: 'No. One line of plain text. Anything richer is a Dialog or in-page disclosure.' },
    ],
  },

  /* ================================================================ B15 */
  {
    slug: 'empty-state',
    name: 'EmptyState',
    book: 'B15',
    category: 'primitives',
    tagline: 'One soft sentence + one primary action. No illustration, no humor, max two lines.',
    job: 'Say what would appear here, why it is empty, and the one way forward.',
    tags: ['empty-state', 'zero-data', 'first-run', 'call-to-action'],
    exports: ['EmptyState'],
    files: ['components/seventy-six/empty-state.tsx', 'components/seventy-six/empty-state.css'],
    intro: [
      'An empty state is information, not a marketing moment. The sentence states what the region will contain and why it is currently empty ("No orders yet — orders appear here as soon as a channel syncs."). The single action is the most direct way to change that.',
      'The copy rules of A3 apply with full force here, because empty states are where "slop voice" usually leaks in: no exclamation marks, no "Awesome!", no illustrations of empty boxes.',
    ],
    examples: [
      {
        title: 'In a table card',
        demoKey: 'empty-basic',
        surface: 'paper',
        code: `import { EmptyState, Button } from '@/components/seventy-six';

<EmptyState
  sentence="No orders yet — orders appear here as soon as a sales channel syncs."
  action={<Button variant="primary">Connect channel</Button>}
/>`,
      },
    ],
    props: [
      {
        component: 'EmptyState',
        rows: [
          { name: 'sentence', type: 'string', description: 'What would appear here and why it is empty. Max two lines rendered.' },
          { name: 'action', type: 'ReactNode', description: 'Exactly one primary Button. Optional when no action exists.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Plain paragraph text — no live region; an empty state is a steady state, not an announcement.',
        'The action is a real Button with the standard focus contract.',
      ],
    },
    donts: [
      'No illustrations, mascots, or emoji (A2 bans them in product UI).',
      'No "Oops" / "Nothing to see here" — say what and why.',
      'No more than one action; two paths is a decision, and decisions get pages.',
    ],
    faq: [
      { q: 'What if there is nothing the user can do?', a: 'Omit the action. The sentence alone must still say why it is empty ("Reports appear after your first full day of data").' },
      { q: 'Where does it go inside a card?', a: 'In place of the widget body, under the universal CardHead — the head stays so the region keeps its name.' },
    ],
  },

  /* ================================================================ B17 */
  {
    slug: 'skeleton',
    name: 'Skeleton',
    book: 'B17',
    category: 'primitives',
    tagline: 'Static wall-colored blocks matching the target anatomy. No shimmer, no pulse, 300ms gate.',
    job: 'Hold the exact shape of content that is still loading.',
    tags: ['skeleton', 'loading', 'no-shimmer', 'static-placeholder'],
    exports: ['Skeleton', 'SkeletonGate'],
    files: ['components/seventy-six/skeleton.tsx', 'components/seventy-six/skeleton.css'],
    intro: [
      'Skeletons mirror the anatomy of what they replace — an S1 skeleton has three zones, a table skeleton has rows. They are static <code>--sv-wall</code> blocks: shimmer animations are a firewall violation (A2), and a calm system does not vibrate while it waits.',
      '<b>SkeletonGate</b> implements the 300ms rule: nothing skeleton-shaped appears until the wait has lasted 300ms, so fast loads never flash.',
    ],
    examples: [
      {
        title: 'An S1-shaped skeleton',
        demoKey: 'skeleton-stat',
        surface: 'paper',
        code: `import { Skeleton, SkeletonGate, Card } from '@/components/seventy-six';

<SkeletonGate>
  <Card>
    <div className="stat-skeleton">
      <Skeleton width={120} height={10} />
      <div className="stat-skeleton__mid">
        <Skeleton width={34} height={34} />
        <Skeleton width={96} height={24} />
      </div>
      <Skeleton height={12} />
    </div>
  </Card>
</SkeletonGate>`,
      },
    ],
    props: [
      {
        component: 'Skeleton',
        rows: [
          { name: 'width', type: 'number | string', defaultValue: "'100%'", description: 'Block width.' },
          { name: 'height', type: 'number | string', defaultValue: '12', description: 'Block height.' },
          { name: 'round', type: 'boolean', defaultValue: 'false', description: '50% radius for avatar ghosts.' },
        ],
      },
      {
        component: 'SkeletonGate',
        rows: [
          { name: 'children', type: 'ReactNode', description: 'The skeleton composition; renders only after 300ms.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Skeletons are <code>aria-hidden</code> — the loading state is communicated by the surrounding region (e.g. the table\'s polite live region), not by placeholder blocks.',
      ],
    },
    donts: [
      'No shimmer, no pulse, no gradient sweeps (A1/A2).',
      'No generic gray rectangles — match the target component\'s anatomy.',
      'No skeleton for waits under 300ms; use SkeletonGate.',
    ],
    faq: [
      { q: 'Why no shimmer?', a: 'Shimmer is decoration pretending to be progress. The Book bans it (A2); the static block communicates "content belongs here" with zero motion cost.' },
      { q: 'How do I announce loading to screen readers?', a: 'Through the owning region: DataTable\'s aria-live announcement ("Loading orders…"), or aria-busy on the section. Skeletons themselves stay hidden.' },
    ],
  },

  /* ================================================================ B16 */
  {
    slug: 'search-command',
    name: 'SearchCommand',
    book: 'B16',
    category: 'primitives',
    tagline: 'The ⌘K palette every 76° app ships — dialog anatomy, mono input, grouped results.',
    job: 'Be the keyboard front door to everything.',
    tags: ['command-palette', 'search', 'cmd-k', 'keyboard', 'combobox', 'dialog'],
    exports: ['SearchCommand', 'useSearchCommand'],
    files: ['components/seventy-six/search-command.tsx', 'components/seventy-six/search-command.css'],
    registryDeps: [],
    intro: [
      'Every 76° app ships ⌘K — it is the keyboard front door (C4). The palette reuses Dialog anatomy on native <code>&lt;dialog&gt;</code>: a mono input, results grouped under mono labels, arrow keys + Enter, Esc to leave.',
      'Feed it a flat list of <code>CommandItem</code>s (id, group, label, optional mono hint and keywords); it filters client-side and calls <code>onPick</code>. For server-backed search, debounce upstream and swap the items prop.',
    ],
    examples: [
      {
        title: 'Wiring the palette',
        demoKey: 'command-basic',
        surface: 'paper',
        code: `import { SearchCommand, useSearchCommand, Button } from '@/components/seventy-six';

const search = useSearchCommand(); // ⌘K binds automatically

<Button variant="ghost" onClick={search.show}>Search (⌘K)</Button>
<SearchCommand
  open={search.open}
  onClose={search.hide}
  placeholder="SEARCH ORDERS, PRODUCTS, PAGES…"
  items={[
    { id: 'ord-10482', group: 'ORDERS', label: 'ORD-10482 · Nasra Ali', hint: '$482.19' },
    { id: 'ord-10476', group: 'ORDERS', label: 'ORD-10476 · Bloom Retail', hint: '$1,204.00' },
    { id: 'page-inventory', group: 'PAGES', label: 'Inventory', hint: 'G then I' },
  ]}
  onPick={(item) => navigate(item.id)}
/>`,
      },
    ],
    props: [
      {
        component: 'SearchCommand',
        rows: [
          { name: 'open / onClose', type: 'boolean / () => void', description: 'Controlled visibility; pair with useSearchCommand().' },
          { name: 'items', type: 'CommandItem[]', description: '{ id, group, label, hint?, keywords? } — groups render as mono labels.' },
          { name: 'onPick', type: '(item) => void', description: 'Called on Enter or click; the palette closes itself.' },
          { name: 'placeholder', type: 'string', defaultValue: "'Search…'", description: 'Mono placeholder; also the input\'s aria-label.' },
          { name: 'bindShortcut', type: 'boolean', defaultValue: 'true', description: 'Binds ⌘K / Ctrl-K globally while mounted.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '⌘K / Ctrl-K', action: 'Opens (or closes) the palette from anywhere.' },
        { keys: '↑ / ↓', action: 'Moves the active option; wraps are deliberate non-features.' },
        { keys: 'Enter', action: 'Picks the active option.' },
        { keys: 'Esc', action: 'Closes and returns focus to the invoker.' },
      ],
      notes: [
        'The input is a <code>role="combobox"</code> with <code>aria-activedescendant</code> pointing at the active <code>role="option"</code> — the screen-reader combobox pattern, on a native dialog.',
        'Results live in a labeled listbox; group labels are presentational.',
      ],
    },
    donts: [
      'No fuzzy-match theatrics with highlighted letter fragments — plain substring match, plain results.',
      'No recent-searches clutter in v1; the palette is a router, not a feed.',
      'No hijacking ⌘K when a second palette is mounted — one front door per app.',
    ],
    faq: [
      { q: 'How do I open it programmatically?', a: 'useSearchCommand() returns { open, show, hide }; call show() from your search button and pass open/hide to the component.' },
      { q: 'Does it search the server?', a: 'The component filters the items you pass. For server search, treat items as the current result set and refresh it as the user types upstream.' },
      { q: 'What goes in hint?', a: 'A mono fragment on the right edge: an ID, an amount, a shortcut. Metadata voice, per Law 4.' },
    ],
  },
];
