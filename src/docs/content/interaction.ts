import type { DocEntry } from './types';

/**
 * The interaction layer. B19–B23 from v0.2.0: searchable selection,
 * action menus, slide-overs, inline notices, and category tags — plus
 * B42 Popover, the non-modal top-layer panel B20 Menu now stands on.
 */
export const interaction: DocEntry[] = [
  /* ================================================================ B19 */
  {
    slug: 'combobox',
    name: 'Combobox',
    book: 'B19',
    category: 'forms',
    tagline: 'The searchable select — ARIA 1.2 combobox pattern, hand-rolled, zero dependencies.',
    job: 'Pick one value — or a set of them — from a list too long to scan.',
    tags: ['combobox', 'searchable-select', 'multi-select', 'autocomplete', 'typeahead', 'listbox', 'filter'],
    exports: ['Combobox'],
    files: ['components/seventy-six/combobox.tsx', 'components/seventy-six/combobox.css'],
    registryDeps: ['field'],
    intro: [
      'Native <code>&lt;select&gt;</code> (B11) stays the default for short, known lists. The Combobox exists for the moment the list grows past roughly ten options, or the user knows the value\'s <b>name</b> faster than its position: customers, SKUs, warehouses, assignees. Typing filters; arrows walk the matches; Enter commits; Escape closes, then clears.',
      'It follows the ARIA 1.2 combobox pattern with <code>aria-activedescendant</code> — focus never leaves the input, so the screen-reader experience matches the visual one. Options can carry mono <code>meta</code> (an ID, a count) that is searched along with the label.',
      'The listbox is a child of the field and must not sit inside an <code>overflow</code> container (Firewall E) — lift the field out, or put the picker in a Dialog.',
      '<b>The v0.4.0 amendment: multi-select.</b> The original spec refused it outright, which was a refusal of the usual implementation rather than of the job. Pass <code>multiple</code> and <code>value</code> becomes a <code>string[]</code>: Enter and click toggle the active option and <b>leave the list open</b>, the query survives the toggle so three matches of one search are taken without retyping it, and Backspace on an empty query drops the value taken last. The two modes are a discriminated union, so they cannot be mixed by accident and every existing single-select call site is untouched.',
      'What is refused is the chip wall. A multi-selection is <b>stated, never worn</b>: one mono line of running text under the field, in the B7 <code>FilterLine</code> voice, naming at most three values and counting the rest, ending in a single Clear. A2 bans pills, B23 keeps Badge category-only and non-dismissible, and a growing row of chips reflows the form on every pick while a one-line statement holds its ground. That line is also the only live region in the component.',
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
      {
        title: 'Multi-select, stated as one line',
        description: 'The list stays open while you pick, the query survives each toggle, and the selection states itself in the FilterLine voice underneath. No chips, and nothing reflows.',
        demoKey: 'combobox-multi',
        surface: 'paper',
        code: `const [picked, setPicked] = useState<string[]>(['c-127', 'c-152']);

<Combobox
  multiple
  noun="account"
  label="Accounts in this report"
  options={customers}
  value={picked}
  onChange={(values) => setPicked(values)}
  placeholder="Type a name or C-number"
  hint="Pick as many as the report covers — the list stays open."
/>

// The line under the field reads:
// 2 ACCOUNTS · Corridor Foods · Fairline Imports        Clear`,
      },
    ],
    props: [
      {
        component: 'Combobox',
        rows: [
          { name: 'label', type: 'string', description: 'Field label above the input — never replaced by the placeholder (B11).' },
          { name: 'options', type: 'ComboOption[]', description: '{ value, label, meta?, disabled? }. meta renders mono, right-aligned, and is searched.' },
          { name: 'multiple', type: 'boolean', description: 'Switches the props to the multi union: value becomes string[] and onChange receives (values, options).' },
          { name: 'value', type: 'string | null | string[]', description: 'Controlled selection. string | null in single mode, string[] in pick order when multiple.' },
          { name: 'onChange', type: '(value, option) => void', description: 'Single: fires on commit and on clear (null). Multi: fires on every toggle with the full array.' },
          { name: 'noun', type: 'string', defaultValue: "'selected'", description: 'Multi only. The singular noun the selection line counts: "account" reads "3 ACCOUNTS".' },
          { name: 'error / hint / required', type: 'string / string / boolean', description: 'B11 field chrome; error sets aria-invalid + describedby.' },
          { name: 'emptyText', type: 'string', defaultValue: "'No matching options.'", description: 'No-match copy — state what, like every 76° empty state.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '↓ / ↑', action: 'Open the list / move the active option.' },
        { keys: 'Home / End', action: 'First / last match.' },
        { keys: 'Enter', action: 'Single: commit the active option and close. Multi: toggle it and stay open.' },
        { keys: 'Backspace', action: 'Multi only, on an empty query: drops the value taken last.' },
        { keys: 'Esc', action: 'Close the list; pressed again on a closed field, clear the selection.' },
        { keys: 'Tab', action: 'Close and move on — never traps.' },
      ],
      notes: [
        'ARIA 1.2 pattern: <code>role="combobox"</code> input, <code>aria-expanded</code>, <code>aria-controls</code>, and <code>aria-activedescendant</code> pointing at the active <code>role="option"</code>.',
        'Focus stays in the input the whole time; the active option is conveyed, not focused.',
        'The selected option carries <code>aria-selected</code> and a seed tick.',
        'In multi mode the listbox adds <code>aria-multiselectable="true"</code>, and the selection line is <code>aria-live="polite"</code> — one announcement per toggle, and no second live region anywhere in the component.',
      ],
    },
    donts: [
      'No Combobox for lists a native Select scans in one glance (≤ ~10 options).',
      'No chips for a multi-selection — the line states it, and a dismissible chip is a control row pretending to be state (A2, B23).',
      'No listbox inside an overflow container; portal the field out or use a Dialog.',
      'No free-text values — the Combobox picks from the list; a creatable input is a Field.',
    ],
    faq: [
      { q: 'Select or Combobox?', a: 'Count the options. If the user scans, Select. If the user searches, Combobox. Both wear identical B11 field chrome, so swapping later costs nothing.' },
      { q: 'Async options?', a: 'Filter locally up to a few thousand rows — it is faster than any spinner. Past that, debounce the query upstream and pass the fetched page as options.' },
      { q: 'Why did multi-select take until v0.4.0?', a: 'Because the refusal in v0.2.0 was aimed at the chip wall every implementation ships with, and the replacement — a stated mono line — did not exist until B7 shipped FilterLine. The pattern had to be invented before the feature could be allowed.' },
      { q: 'Multi-select or a column of checkboxes?', a: 'Count again. Under about ten options a checkbox group shows every choice at once and costs no interaction model. The multi Combobox is for the set you have to search for.' },
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

  /* ================================================================ B42 */
  {
    slug: 'popover',
    name: 'Popover',
    book: 'B42',
    category: 'primitives',
    tagline: 'The non-modal panel on the native popover attribute — a few controls beside their trigger, 320px at the widest.',
    job: 'Hold a FEW controls beside the control that asked for them.',
    tags: ['popover', 'popover-attribute', 'top-layer', 'non-modal', 'panel', 'column-chooser'],
    exports: ['Popover'],
    files: ['components/seventy-six/popover.tsx', 'components/seventy-six/popover.css'],
    registryDeps: ['button'],
    intro: [
      'B18 <code>Tooltip</code> is a phrase with no interactive content, on hover or focus. B20 <code>Menu</code> is a list of verbs with <code>role="menu"</code> and its own keyboard model. B21 <code>Drawer</code> is a workspace beside the work. B13 <code>Dialog</code> interrupts for one decision. A Popover is the non-modal panel that holds a few controls — a column chooser, a saved-view picker, a short explanation with a link — and nothing else in the taxonomy does that.',
      'It is built on the native <code>popover</code> attribute: browser top layer, light dismiss, Esc, and <b>no z-index at all</b> — the <code>--sv-z-*</code> ladder never reaches it. It also <b>owns its own trigger</b>, exactly as <code>MenuButton</code> does, so <code>aria-expanded</code> and <code>aria-controls</code> cannot drift out of sync with what is on screen.',
      'Labelling is enforced by the type system: <code>title</code> and <code>ariaLabel</code> are a mutually exclusive union, so an unlabelled panel does not compile. 320px is the ceiling; wider is a B21 Drawer. And the panel is non-modal — the page behind stays readable and keeps its scroll, and focus is never trapped: tabbing past the last control closes the panel and carries on into the page, because a panel left standing behind the focus ring is one nobody can see they have left.',
      '<b>B20 Menu now stands on this component.</b> <code>usePopoverAnchor</code> — the hook that positions a top-layer panel under its trigger, since the top layer does not anchor itself without CSS anchor positioning — moved here, and Menu imports it. Popover is the primitive; Menu is a specialisation of it. The hook is deliberately not re-exported from the barrel: it is an implementation detail of the two components, not public API.',
    ],
    examples: [
      {
        title: 'Column chooser',
        description: 'An untitled panel: three checkboxes and nothing else. ariaLabel names it, because there is no title to do the naming.',
        demoKey: 'popover-basic',
        surface: 'paper',
        code: `import { Popover, Checkbox } from '@/components/seventy-six';

<Popover label="Columns" ariaLabel="Choose visible columns" align="end">
  <Checkbox label="Customer" defaultChecked />
  <Checkbox label="Total" defaultChecked />
  <Checkbox label="Dispatched" />
</Popover>`,
      },
      {
        title: 'Titled panel with one action',
        description: 'A title renders the hairline head and a close that names its panel. The action is a single text link, exactly as a Banner carries one.',
        demoKey: 'popover-titled',
        surface: 'paper',
        code: `import { Popover, ButtonLink } from '@/components/seventy-six';

<Popover label="About this total" title="How the total is calculated">
  Line totals, less order-level discounts, plus shipping. Tax is applied at
  invoicing, so this figure can differ from the invoice by the tax line.
  <ButtonLink href="/docs/totals">Read the totals rules</ButtonLink>
</Popover>`,
      },
    ],
    props: [
      {
        component: 'Popover',
        rows: [
          { name: 'label', type: 'string', description: 'The trigger\'s visible text — it names what the panel holds ("Columns").' },
          { name: 'title', type: 'string', description: 'Renders the hairline head plus a named close, and labels the panel. Mutually exclusive with <code>ariaLabel</code>.' },
          { name: 'ariaLabel', type: 'string', description: 'Names an untitled panel. Mutually exclusive with <code>title</code>; omitting both does not compile.' },
          { name: 'children', type: 'ReactNode', description: 'A few controls, or a short explanation with one link. Not a form, not a page.' },
          { name: 'align', type: "'start' | 'end'", defaultValue: "'start'", description: 'Panel edge alignment against the trigger; it is clamped 8px inside the viewport either way.' },
          { name: 'variant', type: "'ghost' | 'primary' | 'link'", defaultValue: "'ghost'", description: 'Trigger variant — the panel is not an action, so the trigger is usually quiet.' },
          { name: 'disabled / className', type: 'boolean / string', description: 'Both apply to the trigger; the panel is top-layer and owns its own box.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Enter / Space', action: 'Opens the panel and moves focus to its first control.' },
        { keys: 'Tab / ⇧Tab', action: 'Walks the panel; leaving it closes the panel and keeps going. Nothing is trapped and focus is never stolen back.' },
        { keys: 'Esc', action: 'Closes (native popover) and returns focus to the trigger.' },
      ],
      notes: [
        'Trigger: <code>aria-haspopup="dialog"</code> + <code>aria-controls</code>, with <code>aria-expanded</code> read off the panel\'s own <code>toggle</code> event — the browser is the source of truth for open state, so the attribute cannot lie.',
        'Panel: <code>role="dialog"</code>, labelled by the title through <code>aria-labelledby</code> or by <code>ariaLabel</code>. The union of the two means the unlabelled case is unreachable, not merely discouraged.',
        'Focus moves to the first focusable control on open, or to the panel itself when it holds none; close returns focus to the trigger.',
        'A titled panel\'s close names its target ("Close How the total is calculated"); an untitled one exits by Esc or by clicking away.',
      ],
    },
    donts: [
      'No action whose only path is the popover (C4) — whatever lives here also lives somewhere reachable without it.',
      'No navigation in a popover; links between places belong in the Band.',
      'No popover nested inside another popover.',
      'No errors in a popover — an error renders inline at its cause, in a B22 Banner.',
      'No panel wider than 320px; at that point the content is a workspace and belongs in a B21 Drawer.',
    ],
    faq: [
      { q: 'Why not CSS anchor positioning?', a: 'It is not yet baseline across the browsers 76° supports, so shipping it would mean shipping a fallback anyway. Instead <code>usePopoverAnchor</code> measures the trigger and places the panel under it, clamped inside the viewport, re-running on resize — about thirty lines, no dependency, and it deletes itself the day anchor positioning is safe.' },
      { q: 'Why does it own the trigger instead of taking a children render prop?', a: 'Because the ARIA wiring is the whole risk. A render prop hands aria-haspopup, aria-controls, and aria-expanded to the caller, and the first time one of them drifts the panel is silently unusable by keyboard. Owning the button makes the wiring unforgeable.' },
      { q: 'Popover or Menu?', a: 'Count the verbs. A list of actions is a B20 Menu and gets the menu keyboard model. Controls that change a view — checkboxes, a radio set, a short explanation — are a Popover. Both ride the same top layer and the same anchor hook.' },
    ],
  },
];
