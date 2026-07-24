import type { DocEntry } from './types';

/**
 * v0.2.0 — the interaction layer: B19–B23. Searchable selection,
 * action menus, slide-overs, inline notices, and category tags.
 */
export const interaction: DocEntry[] = [
  /* ================================================================ B19 */
  {
    slug: 'combobox',
    name: 'Combobox',
    book: 'B19',
    category: 'forms',
    tagline: 'The searchable select — ARIA 1.2 combobox pattern, hand-rolled, zero dependencies.',
    job: 'Pick ONE value from a list too long to scan.',
    tags: ['combobox', 'searchable-select', 'autocomplete', 'typeahead', 'listbox', 'filter'],
    exports: ['Combobox'],
    files: ['components/seventy-six/combobox.tsx', 'components/seventy-six/combobox.css'],
    registryDeps: ['field'],
    intro: [
      'Native <code>&lt;select&gt;</code> (B11) stays the default for short, known lists. The Combobox exists for the moment the list grows past roughly ten options, or the user knows the value\'s <b>name</b> faster than its position: customers, SKUs, warehouses, assignees. Typing filters; arrows walk the matches; Enter commits; Escape closes, then clears.',
      'It follows the ARIA 1.2 combobox pattern with <code>aria-activedescendant</code> — focus never leaves the input, so the screen-reader experience matches the visual one. Options can carry mono <code>meta</code> (an ID, a count) that is searched along with the label.',
      'The listbox is a child of the field and must not sit inside an <code>overflow</code> container (Firewall E) — lift the field out, or put the picker in a Dialog.',
    ],
    examples: [
      {
        title: 'Searchable customer picker',
        demoKey: 'combobox-basic',
        surface: 'paper',
        code: `import { useState } from 'react';
import { Combobox } from '@/components/seventy-six';

const customers = [
  { value: 'c-101', label: 'Almeida Logistics', meta: 'C-101' },
  { value: 'c-114', label: 'Bantam Freight',    meta: 'C-114' },
  { value: 'c-127', label: 'Corridor Foods',    meta: 'C-127' },
  // …400 more
];

const [customer, setCustomer] = useState<string | null>(null);

<Combobox
  label="Customer"
  options={customers}
  value={customer}
  onChange={(v) => setCustomer(v)}
  placeholder="Type a name or ID"
  hint="Search across 400 accounts by name or C-number."
/>`,
      },
      {
        title: 'Validation follows B11',
        description: 'Error on blur, stated with a fix; the empty state names what did not match.',
        demoKey: 'combobox-error',
        surface: 'paper',
        code: `<Combobox
  label="Assignee"
  required
  options={people}
  value={assignee}
  onChange={setAssignee}
  error="Pick an assignee — orders cannot dispatch unassigned."
  emptyText="No one matches. Check the spelling or invite them from Settings → Team."
/>`,
      },
    ],
    props: [
      {
        component: 'Combobox',
        rows: [
          { name: 'label', type: 'string', description: 'Field label above the input — never replaced by the placeholder (B11).' },
          { name: 'options', type: 'ComboOption[]', description: '{ value, label, meta?, disabled? }. meta renders mono, right-aligned, and is searched.' },
          { name: 'value', type: 'string | null', description: 'Controlled selected value.' },
          { name: 'onChange', type: '(value, option) => void', description: 'Fires on commit and on clear (null).' },
          { name: 'error / hint / required', type: 'string / string / boolean', description: 'B11 field chrome; error sets aria-invalid + describedby.' },
          { name: 'emptyText', type: 'string', defaultValue: "'No matching options.'", description: 'No-match copy — state what, like every 76° empty state.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '↓ / ↑', action: 'Open the list / move the active option.' },
        { keys: 'Home / End', action: 'First / last match.' },
        { keys: 'Enter', action: 'Commit the active option.' },
        { keys: 'Esc', action: 'Close the list; pressed again on a closed field, clear the selection.' },
        { keys: 'Tab', action: 'Close and move on — never traps.' },
      ],
      notes: [
        'ARIA 1.2 pattern: <code>role="combobox"</code> input, <code>aria-expanded</code>, <code>aria-controls</code>, and <code>aria-activedescendant</code> pointing at the active <code>role="option"</code>.',
        'Focus stays in the input the whole time; the active option is conveyed, not focused.',
        'The selected option carries <code>aria-selected</code> and a seed tick.',
      ],
    },
    donts: [
      'No Combobox for lists a native Select scans in one glance (≤ ~10 options).',
      'No multi-select — that is a different job and a future component.',
      'No listbox inside an overflow container; portal the field out or use a Dialog.',
      'No free-text values — the Combobox picks from the list; a creatable input is a Field.',
    ],
    faq: [
      { q: 'Select or Combobox?', a: 'Count the options. If the user scans, Select. If the user searches, Combobox. Both wear identical B11 field chrome, so swapping later costs nothing.' },
      { q: 'Async options?', a: 'Filter locally up to a few thousand rows — it is faster than any spinner. Past that, debounce the query upstream and pass the fetched page as options.' },
    ],
  },

  /* ================================================================ B20 */
  {
    slug: 'menu',
    name: 'Menu',
    book: 'B20',
    category: 'primitives',
    tagline: 'An actions dropdown on the native popover top layer — plus the SplitButton that carries one.',
    job: 'Hold the secondary VERBS one control cannot.',
    tags: ['menu', 'dropdown', 'popover', 'split-button', 'actions', 'kebab'],
    exports: ['MenuButton', 'SplitButton'],
    files: ['components/seventy-six/menu.tsx', 'components/seventy-six/menu.css'],
    registryDeps: ['button'],
    intro: [
      'A Menu holds <b>actions</b> — never navigation (that is the Band) and never selection (that is a Select or Combobox). Items are verbs that name their object, exactly like buttons: "Duplicate order", "Export as CSV", "Archive".',
      'It rides the native <code>popover</code> attribute: top layer, light dismiss, and Esc come from the browser, so there is no z-index and no dependency. <code>MenuButton</code> is a ghost button whose one job is opening the menu; <code>SplitButton</code> welds a primary verb to a chevron holding <b>variants of the same job</b> — "Create order" / "Create draft order" — never unrelated actions.',
      'A destructive item turns <code>--sv-bad</code> and still confirms in a Dialog — the menu is a doorway, not a confirmation.',
    ],
    examples: [
      {
        title: 'Row actions menu',
        demoKey: 'menu-basic',
        surface: 'paper',
        code: `import { MenuButton } from '@/components/seventy-six';

<MenuButton
  label="Actions"
  items={[
    { label: 'Duplicate order', onSelect: duplicate },
    { label: 'Export as CSV', onSelect: exportCsv, meta: '⌘E' },
    'separator',
    { label: 'Archive order', onSelect: confirmArchive, danger: true },
  ]}
/>`,
      },
      {
        title: 'SplitButton — one job, several doors',
        demoKey: 'split-basic',
        surface: 'paper',
        code: `import { SplitButton } from '@/components/seventy-six';

<SplitButton
  label="Create order"
  onClick={createOrder}
  items={[
    { label: 'Create draft order', onSelect: createDraft },
    { label: 'Create from template', onSelect: fromTemplate },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'MenuButton',
        rows: [
          { name: 'label', type: 'string', description: 'The trigger label; renders a ghost button with a chevron.' },
          { name: 'items', type: 'MenuItem[]', description: "{ label, onSelect, icon?, meta?, danger?, disabled? } or 'separator'." },
          { name: 'align', type: "'start' | 'end'", defaultValue: "'start'", description: 'Panel edge alignment against the trigger.' },
          { name: 'variant', type: 'ButtonVariant', defaultValue: "'ghost'", description: 'Trigger variant.' },
        ],
      },
      {
        component: 'SplitButton',
        rows: [
          { name: 'label / onClick', type: 'string / () => void', description: 'THE primary verb — it names its object.' },
          { name: 'items', type: 'MenuItem[]', description: 'Variants of the same job behind the chevron.' },
          { name: 'menuLabel', type: 'string', description: 'Accessible name for the chevron trigger.' },
          { name: 'isLoading / loadingLabel', type: 'boolean / string', description: 'B10 loading contract on the primary half; the chevron disables too.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '↓ / ↑', action: 'Move through enabled items, wrapping.' },
        { keys: 'Home / End', action: 'First / last item.' },
        { keys: 'Enter / Space', action: 'Run the focused item and close.' },
        { keys: 'Esc', action: 'Close (native popover) and return focus to the trigger.' },
      ],
      notes: [
        'Trigger: <code>aria-haspopup="menu"</code> + <code>aria-controls</code>; panel: <code>role="menu"</code> with <code>role="menuitem"</code> children, labelled by the trigger.',
        'Light dismiss and Esc are native popover behaviors; focus returns to the trigger on close.',
        'The SplitButton chevron is a separate, individually focusable control with its own aria-label.',
      ],
    },
    donts: [
      'No navigation in menus — links live in the Band.',
      'No selection in menus — picking a value is a Select/Combobox.',
      'No unrelated actions behind a SplitButton chevron — variants of the SAME job only.',
      'No destructive work executed from the menu — the item opens a confirming Dialog.',
    ],
    faq: [
      { q: 'Why the popover attribute and not a portal?', a: 'The top layer is exactly what portals simulate, natively: it beats every stacking context, closes on outside pointer-down and Esc, and needs no z-index from the ladder.' },
      { q: 'Where is the kebab (⋯) trigger?', a: 'Pass an icon-only ghost Button pattern via MenuButton with a short label like "More" — but named actions beat mystery meat; reach for ⋯ only in dense table rows.' },
    ],
  },

  /* ================================================================ B21 */
  {
    slug: 'drawer',
    name: 'Drawer',
    book: 'B21',
    category: 'primitives',
    tagline: 'The slide-over: a paper panel from the screen edge for detail-in-context, on native <dialog>.',
    job: 'Inspect or edit ONE record without leaving the sheet.',
    tags: ['drawer', 'slide-over', 'panel', 'detail-view', 'native-dialog', 'side-sheet'],
    exports: ['Drawer'],
    files: ['components/seventy-six/drawer.tsx', 'components/seventy-six/drawer.css'],
    registryDeps: ['button'],
    intro: [
      'The Drawer answers the moment a table row needs its full story: inspect the record, edit a field, review before commit — while the sheet stays visible behind the scrim as context. It is a full-height paper panel entering from the right (or left), on native <code>&lt;dialog&gt;.showModal()</code>: focus trap, Esc, backdrop, top layer, zero dependencies.',
      'Anatomy: a hairline-separated head (15/700 title + optional mono context line + close), a scrolling body, and a sticky footer with a ghost cancel and <b>one</b> primary. Sizes: sm 360 · md 480 · lg 640 · full. Entry slides 24px on transform only, 160ms ease-out, collapsing to 0 under reduced motion.',
      'The dividing line with Dialog: a Dialog interrupts for one decision; a Drawer opens a workspace beside the work. If the task replaces the page entirely, use <code>Dialog size="full"</code>.',
    ],
    examples: [
      {
        title: 'Order detail drawer',
        demoKey: 'drawer-basic',
        surface: 'paper',
        code: `import { useState } from 'react';
import { Drawer, Button } from '@/components/seventy-six';

const [open, setOpen] = useState(false);

<Button variant="ghost" onClick={() => setOpen(true)}>Review ORD-10482</Button>
<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Order ORD-10482"
  context="CORRIDOR FOODS · 24 JUL · 3 LINES"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
      <Button variant="primary" onClick={approve}>Approve order</Button>
    </>
  }
>
  {/* Fields, MeterList, ActivityList — anything paper carries */}
</Drawer>`,
      },
    ],
    props: [
      {
        component: 'Drawer',
        rows: [
          { name: 'open / onClose', type: 'boolean / () => void', description: 'Controlled visibility; drives showModal()/close().' },
          { name: 'title', type: 'string', description: 'The 15/700 head title; wired to aria-labelledby.' },
          { name: 'context', type: 'string', description: 'Mono metadata line under the title — ID, date, counts.' },
          { name: 'side', type: "'right' | 'left'", defaultValue: "'right'", description: 'Owning screen edge.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", defaultValue: "'md'", description: '360 / 480 / 640 / takeover. Every size caps at 100vw.' },
          { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: 'Scrim click closes; disable for unsaved-work drawers (Esc still works).' },
          { name: 'footer', type: 'ReactNode', description: 'Sticky, right-aligned: ghost cancel + ONE primary/danger.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Esc', action: 'Closes the drawer.' },
        { keys: 'Tab / ⇧Tab', action: 'Cycles inside — native top-layer focus trapping.' },
      ],
      notes: [
        'Native dialog semantics: <code>aria-modal</code>, focus moves in on open and returns to the invoker on close.',
        'The close control carries a full name ("Close Order ORD-10482"), and the footer always duplicates the exit as a named cancel.',
        'Slide-in is transform-only and honors <code>prefers-reduced-motion</code> through the duration tokens.',
      ],
    },
    donts: [
      'No navigation inside a drawer — it is a workspace, not a page.',
      'No stacked drawers; a second record is a second visit.',
      'No drawer for a one-line decision — that is a Dialog.',
      'No body scroll-jacking; only the drawer body scrolls.',
    ],
    faq: [
      { q: 'Drawer or full-screen Dialog?', a: 'Keep the sheet visible when it is context the user still needs (comparing, cross-checking): Drawer. Replace it when the task is self-contained (a composer, a wizard): Dialog size="full".' },
      { q: 'Can I put a DataTable inside?', a: 'Yes at lg or full — anything paper carries is legal in the body. At sm/md prefer key-value rows and MeterLists; tables need width to breathe.' },
    ],
  },

  /* ================================================================ B22 */
  {
    slug: 'banner',
    name: 'Banner',
    book: 'B22',
    category: 'primitives',
    tagline: 'The inline notice — where B14 sends every error: in the flow, at the point of relevance.',
    job: 'State a condition of THIS place, in this place.',
    tags: ['banner', 'alert', 'inline-error', 'notice', 'callout', 'status-region'],
    exports: ['Banner'],
    files: ['components/seventy-six/banner.tsx', 'components/seventy-six/banner.css'],
    intro: [
      'Toasts drift; banners sit. A Banner renders in the layout at the point of relevance — above the form that failed, atop the card whose sync degraded, under the hero while an import runs. It is the surface the toast discipline points errors at: the error lives <b>here</b>, next to its cause.',
      'Anatomy: paper card, 2px left tone rule, 16px tone icon, 13/700 title, soft body in full sentences (what happened <b>and how to fix it</b>), an optional single text-link action, and an optional dismiss. Tones follow the three-color law: seed for info, green ok, red bad — and warn uses ink, because no amber surface enters the system.',
      'A Banner with <code>tone="bad"</code> is <code>role="alert"</code>; everything else is a polite status region.',
    ],
    examples: [
      {
        title: 'The four tones',
        demoKey: 'banner-tones',
        surface: 'paper',
        code: `import { Banner, ButtonLink } from '@/components/seventy-six';

<Banner tone="info" title="Import running">
  1,204 of 2,400 rows processed. You can keep working — we will notify you here.
</Banner>

<Banner tone="ok" title="Backup complete" onDismiss={dismiss}>
  All 14 tables copied to cold storage at 03:00.
</Banner>

<Banner tone="warn" title="Sync degraded" action={<ButtonLink href="#">Retry sync</ButtonLink>}>
  Prices last updated 42 minutes ago. Orders still submit; totals may lag.
</Banner>

<Banner tone="bad" title="Submit failed — 2 fields need fixes">
  Quantity must be a whole number above 0. Customer is required.
</Banner>`,
      },
    ],
    props: [
      {
        component: 'Banner',
        rows: [
          { name: 'tone', type: "'info' | 'ok' | 'warn' | 'bad'", defaultValue: "'info'", description: 'Left rule + icon color. warn is ink — no amber in the system.' },
          { name: 'title', type: 'string', description: '13/700, states the condition plainly. No "Oops" (A3).' },
          { name: 'children', type: 'ReactNode', description: 'Full sentences: what happened and how to fix it.' },
          { name: 'action', type: 'ReactNode', description: 'ONE text-link action, e.g. a ButtonLink "Retry sync".' },
          { name: 'onDismiss', type: '() => void', description: 'Renders a dismiss control. Persistent conditions omit it.' },
        ],
      },
    ],
    a11y: {
      notes: [
        '<code>tone="bad"</code> renders <code>role="alert"</code> (assertive); other tones are <code>role="status"</code> (polite).',
        'Tone is never carried by color alone — the icon shape and the title text state it (C2).',
        'The dismiss control names its target: "Dismiss: Backup complete".',
      ],
    },
    donts: [
      'No page-level banner for a field-level error — field errors render on the Field (B11).',
      'No stacking three banners; the worst condition wins, the rest wait.',
      'No banner as a marketing surface; it states conditions, it does not promote.',
      'No auto-dismissing banners — that is a toast\'s job.',
    ],
    faq: [
      { q: 'Banner, toast, or field error?', a: 'Scope decides. One field: Field error. This page/form/card, needing to persist: Banner, adjacent to the cause. A finished background fact needing no action: toast.' },
      { q: 'Why is warn not amber?', a: 'Law 2 — three colors, total. Amber surfaces are how systems rot into rainbows. The triangle icon plus plain words carry the meaning at AA, in ink.' },
    ],
  },

  /* ================================================================ B23 */
  {
    slug: 'badge',
    name: 'Badge',
    book: 'B23',
    category: 'primitives',
    tagline: 'A small mono tag for category metadata — never status, never numbers that matter.',
    job: 'Name the CATEGORY a thing belongs to.',
    tags: ['badge', 'tag', 'chip', 'label', 'category', 'mono'],
    exports: ['Badge'],
    files: ['components/seventy-six/badge.tsx', 'components/seventy-six/badge.css'],
    intro: [
      'A Badge names a category: environment (<code>PROD</code>), plan (<code>ENTERPRISE</code>), record type (<code>B2B</code>), version (<code>V2</code>). It speaks mono uppercase like all 76° metadata, on a wall-toned rectilinear chip — never a pill, pills are banned.',
      'The boundary is sharp: live state is a <b>StatusWord</b> (dot + word), and quantities are stats or table cells. If it can change while you watch, it is not a Badge. The seed tone marks the current/active category — one per group, like everything seed touches.',
    ],
    examples: [
      {
        title: 'Category tags',
        demoKey: 'badge-basic',
        surface: 'paper',
        code: `import { Badge } from '@/components/seventy-six';

<Badge>B2B</Badge>
<Badge>EU-WEST</Badge>
<Badge tone="seed">CURRENT PLAN</Badge>`,
      },
    ],
    props: [
      {
        component: 'Badge',
        rows: [
          { name: 'children', type: 'ReactNode', description: 'Short mono uppercase text — 1–3 words.' },
          { name: 'tone', type: "'neutral' | 'seed'", defaultValue: "'neutral'", description: 'seed marks the current/active category — one per group.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Badges are text — no ARIA needed; they read inline where they sit.',
        'The seed tone is supplementary; the words alone carry the category (C2).',
      ],
    },
    donts: [
      'No status in a Badge — live state is a StatusWord.',
      'No counts in a Badge — numbers that matter are stats or cells.',
      'No pill radius; the Badge is rectilinear like the rest of the system.',
      'No badge rainbows — neutral, plus at most one seed per group.',
    ],
    faq: [
      { q: 'Badge or StatusWord?', a: 'Can it change while you watch? StatusWord. Is it a fixed classification? Badge. "SYNCING" is status; "EU-WEST" is category.' },
    ],
  },
];
