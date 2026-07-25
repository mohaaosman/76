import type { DocEntry } from './types';

/**
 * v0.4.0 · closing the product taxonomy — the structure and display half.
 * Ten parts a product reaches for constantly and had to leave 76° to get.
 * Six that hold and dress content: Accordion, DescriptionList, Divider,
 * Avatar, Spinner/Busy, Kbd. Four that state shape and sequence: Tabs
 * (the sheet's content switch), Stepper (a fixed sequence), TreeList (a
 * hierarchy whose depth is the information), Timeline (one record's life).
 */
export const structure: DocEntry[] = [
  /* ================================================================ B27 */
  {
    slug: 'accordion',
    name: 'Accordion',
    book: 'B27',
    category: 'primitives',
    tagline: 'Native <details> sections on hairlines — secondary detail, folded away.',
    job: 'Fold SECONDARY detail out of the way until it is asked for.',
    tags: ['accordion', 'details', 'disclosure', 'collapse', 'faq', 'sections'],
    exports: ['Accordion'],
    files: ['components/seventy-six/accordion.tsx', 'components/seventy-six/accordion.css'],
    intro: [
      'One <code>&lt;details&gt;</code> per section, hairline-ruled, with a mono meta column on the right for the count or date that tells you whether opening it is worth the click. The platform does the disclosure: no state, no height animation, no ARIA to wire — <code>open</code> is a real attribute and Ctrl-F finds text inside a closed section in modern browsers.',
      'The boundary is what may be folded. An Accordion hides <b>secondary</b> detail — line items, changelog, advanced settings, FAQ answers. It never hides the primary job of a screen, and it is never navigation: navigation is the Band (B1), and one level of anything deeper becomes a page (F6).',
    ],
    examples: [
      {
        title: 'Order detail sections',
        description: 'Independent sections — closing one the reader opened is a surprise.',
        demoKey: 'accordion-basic',
        surface: 'paper',
        code: `import { Accordion } from '@/components/seventy-six';

<Accordion
  sections={[
    { id: 'lines', title: 'Line items', meta: '14 SKUS', defaultOpen: true, children: <p>…</p> },
    { id: 'ship', title: 'Shipping', meta: 'DHL · 24 JUL', children: <p>…</p> },
    { id: 'audit', title: 'Audit trail', meta: '6 EVENTS', children: <p>…</p> },
  ]}
/>`,
      },
      {
        title: 'One at a time',
        description: 'Native exclusive grouping via the shared name — no JavaScript.',
        demoKey: 'accordion-exclusive',
        surface: 'paper',
        code: `<Accordion exclusive name="settings" sections={sections} />`,
      },
    ],
    props: [
      {
        component: 'Accordion',
        rows: [
          { name: 'sections', type: 'AccordionSection[]', description: 'id · title · optional mono meta · children · defaultOpen.' },
          { name: 'exclusive', type: 'boolean', defaultValue: 'false', description: 'One open at a time, via the native name group.' },
          { name: 'name', type: 'string', description: 'The shared native group name. Required when exclusive.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Tab', action: 'Moves to the next summary.' },
        { keys: 'Enter / Space', action: 'Opens or closes the focused section.' },
      ],
      notes: [
        'Native <details>/<summary> carries its own expanded state — no aria-expanded to keep in sync.',
        'The chevron is supplementary: the open state is carried by the panel itself (C5).',
        'The summary shows the standard focus ring (C3); the marker is removed but never the focus.',
      ],
    },
    donts: [
      'No accordion holding the primary job of a screen — that content is not secondary.',
      'No accordion as navigation; that is the Band, and deeper than one level is a page (F6).',
      'No height animation on open — layout properties never transition (A1).',
      'No nested accordions; a section that needs sections is a page.',
    ],
    faq: [
      { q: 'Accordion or Tabs?', a: 'Accordion when the reader may want two things at once, or none. CardTabs (B8) when the options are alternatives filtering one region.' },
      { q: 'Why not animate the open?', a: 'A1 bans transitions on layout properties, and a height animation is the most expensive one there is. The section opens instantly; nothing is lost.' },
    ],
  },

  /* ================================================================ B28 */
  {
    slug: 'description-list',
    name: 'DescriptionList',
    book: 'B28',
    category: 'primitives',
    tagline: 'The record readout — mono terms, informative values, on hairlines.',
    job: 'State a set of labelled facts about ONE record.',
    tags: ['description list', 'dl', 'record', 'detail', 'key value', 'metadata'],
    exports: ['DescriptionList'],
    files: ['components/seventy-six/description-list.tsx', 'components/seventy-six/description-list.css'],
    intro: [
      'A real <code>&lt;dl&gt;</code>. Terms speak the same mono uppercase as a table header, values carry the information at 13/500, and each pair sits on a hairline. It is what a Drawer (B21) shows when you open a row, and what a detail page shows above its tables.',
      'The line between this and a DataTable is the count of records: a table compares MANY rows on the same columns; a description list states many facts about ONE. Values take the table\'s own conventions — <code>kind="id"</code> goes mono, <code>kind="num"</code> goes tabular and right-aligned.',
    ],
    examples: [
      {
        title: 'Order record',
        demoKey: 'dl-record',
        surface: 'paper',
        code: `import { DescriptionList } from '@/components/seventy-six';

<DescriptionList
  rows={[
    { term: 'ORDER', kind: 'id', children: 'ORD-10482' },
    { term: 'CUSTOMER', children: 'Halcyon Freight' },
    { term: 'STATUS', children: <StatusWord tone="ok">Fulfilled</StatusWord> },
    { term: 'TOTAL', kind: 'num', children: '$18,240.00' },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'DescriptionList',
        rows: [
          { name: 'rows', type: 'DescriptionRow[]', description: 'term · children · optional kind (text | id | num).' },
          { name: 'layout', type: "'columns' | 'stacked'", defaultValue: "'columns'", description: 'stacked puts the value under its term; below 520px columns stack on their own (C7).' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Real <dl>/<dt>/<dd> markup — screen readers announce the term with its value as one pair.',
        'Numeric values carry tabular figures (A4); ID values stay mono like their table cells.',
        'Below 520px the pairs stack rather than crush the value into a two-character gutter (C7).',
      ],
    },
    donts: [
      'No description list comparing two records side by side — that is a table.',
      'No interactive controls inside a value; a record that can be edited opens a Drawer with a form.',
      'No sentence-case terms — labels in 76° are mono uppercase, everywhere.',
      'No empty rows: a fact with no value is omitted, or stated as "None recorded".',
    ],
    faq: [
      { q: 'DescriptionList or DataTable?', a: 'One record: DescriptionList. Many records on shared columns: DataTable (B7).' },
      { q: 'Can a value hold a StatusWord or a Badge?', a: 'Yes — values are ReactNode. Status stays a StatusWord (B12), category stays a Badge (B23).' },
    ],
  },

  /* ================================================================ B29 */
  {
    slug: 'divider',
    name: 'Divider',
    book: 'B29',
    category: 'primitives',
    tagline: 'One hairline, optionally naming the group below it in mono.',
    job: 'Separate two groups that share a surface.',
    tags: ['divider', 'separator', 'rule', 'hairline', 'hr'],
    exports: ['Divider'],
    files: ['components/seventy-six/divider.tsx', 'components/seventy-six/divider.css'],
    intro: [
      'A bare <code>&lt;hr&gt;</code> at <code>--sv-line</code>, or — with a label — a rule carrying mono uppercase text: the "OR" between a social stack and a credential form (B26), an "ARCHIVED" break in a long list, a "DANGER ZONE" step in settings.',
      'A labelled divider is a section <b>marker</b>, not a heading. It never replaces an <code>&lt;h2&gt;</code>, and it never appears twice in a row: two dividers with nothing between them is a spacing problem, not a structure one.',
    ],
    examples: [
      {
        title: 'Plain and labelled',
        demoKey: 'divider-basic',
        surface: 'paper',
        code: `import { Divider } from '@/components/seventy-six';

<Divider />
<Divider label="OR" />
<Divider label="ARCHIVED" align="start" />`,
      },
    ],
    props: [
      {
        component: 'Divider',
        rows: [
          { name: 'label', type: 'string', description: 'Mono uppercase text in the rule. Omit for a plain hairline.' },
          { name: 'align', type: "'start' | 'center'", defaultValue: "'center'", description: 'start keeps the label flush left and runs the rule past it.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Unlabelled renders a real <hr> — an implicit separator role.',
        'Labelled renders role="separator" with the label as its accessible name; the visible text is aria-hidden so it is not read twice.',
        'On the band the rule and label switch to band tokens automatically.',
      ],
    },
    donts: [
      'No divider standing in for a heading — a section with a title takes an <h2>.',
      'No two dividers in a row, and none as the first or last child of a card.',
      'No thick or coloured rules; the hairline is the system\'s only rule weight.',
      'No divider inside a table — rows already carry their own hairlines (B7).',
    ],
    faq: [
      { q: 'Does the auth "OR" rule use this?', a: 'It is the same anatomy. B26 SocialButton ships its own copy so the registry item installs standalone; a product composing by hand should reach for Divider.' },
    ],
  },

  /* ================================================================ B30 */
  {
    slug: 'avatar',
    name: 'Avatar',
    book: 'B30',
    category: 'primitives',
    tagline: 'A person, named — initials on wall, or their photo if the product has one.',
    job: 'Identify a PERSON beside their name.',
    tags: ['avatar', 'initials', 'people', 'assignee', 'group', 'stack'],
    exports: ['Avatar', 'AvatarGroup'],
    files: ['components/seventy-six/avatar.tsx', 'components/seventy-six/avatar.css'],
    intro: [
      'Initials derived from the name, on wall, at 24/32/44px. A photo only when the product genuinely holds one — never a generic silhouette, never a stock face (A2, F11). The seed tone marks the current user or the active member, one per group like everything seed touches.',
      '<b>AvatarGroup</b> overlaps a capped stack and states the remainder in mono ("+7"). The full list is a Drawer or a table, never a hover: hover is enhancement only (C8), so nothing may live there alone.',
    ],
    examples: [
      {
        title: 'Faces and a stack',
        demoKey: 'avatar-group',
        surface: 'paper',
        code: `import { Avatar, AvatarGroup } from '@/components/seventy-six';

<Avatar name="Amina Yusuf" />
<Avatar name="Karl Berg" tone="seed" size="lg" />
<AvatarGroup people={[{ name: 'Amina Yusuf' }, { name: 'Karl Berg' }, …]} max={4} />`,
      },
    ],
    props: [
      {
        component: 'Avatar',
        rows: [
          { name: 'name', type: 'string', description: 'The full name. Initials and the accessible name both come from it.' },
          { name: 'src', type: 'string', description: 'Photo URL. Renders an <img> with the name as alt.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: '24 · 32 · 44px.' },
          { name: 'tone', type: "'neutral' | 'seed'", defaultValue: "'neutral'", description: 'seed marks the current user — one per group.' },
        ],
      },
      {
        component: 'AvatarGroup',
        rows: [
          { name: 'people', type: '{ name: string; src?: string }[]', description: 'In display order — most relevant first.' },
          { name: 'max', type: 'number', defaultValue: '4', description: 'Faces shown before the mono overflow count.' },
          { name: 'size', type: "'sm' | 'md'", defaultValue: "'sm'", description: 'Stacks stay small; 44px is for a profile head.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'An initials avatar is role="img" with the full name as its label; the initials themselves are aria-hidden.',
        'A photo avatar carries the name as alt text — never an empty alt, never "avatar".',
        'The overflow chip is labelled "N more"; the names it hides are reachable in the list it summarises (A4).',
        'Avatars never move on hover — images do not animate in 76° (Part E).',
      ],
    },
    donts: [
      'No avatar as the only carrier of a name — the name is always beside it (A4).',
      'No generic silhouette placeholder; a person with no photo gets their initials.',
      'No status dot welded onto an avatar — presence is a StatusWord (B12) beside the name.',
      'No group larger than the cap; the full list is a Drawer, not a tooltip.',
    ],
    faq: [
      { q: 'Why initials rather than a placeholder image?', a: 'Initials are real information at any size and cost no request. A silhouette states nothing and reads as a broken image.' },
      { q: 'Company logos?', a: 'Out of taxonomy. A company is a Badge (B23) or a name in a cell — the avatar identifies a person.' },
    ],
  },

  /* ================================================================ B31 */
  {
    slug: 'spinner',
    name: 'Spinner & Busy',
    book: 'B31',
    category: 'primitives',
    tagline: 'The wait, stated — the one continuous animation the system allows.',
    job: 'State that a region is fetching, and name what.',
    tags: ['spinner', 'loading', 'busy', 'progress', 'wait', 'fetching'],
    exports: ['Spinner', 'Busy'],
    files: ['components/seventy-six/spinner.tsx', 'components/seventy-six/spinner.css'],
    intro: [
      '<b>Spinner</b> is the 12–16px mark beside a label — the same one B10 puts inside a loading button. <b>Busy</b> covers a region with one centred spinner and a sentence naming what is loading: "Loading July orders…". The sentence is required; a bare spinner tells the reader only that something, somewhere, is slow.',
      'It divides cleanly with B17 Skeleton: a <b>Skeleton</b> is first paint, where the anatomy is known and the data is not. A <b>Busy</b> is a region that already has content and is fetching the next of it — pass that content as children and it stays legible underneath at reduced emphasis, because it is still true until it changes.',
    ],
    examples: [
      {
        title: 'Inline and regional',
        demoKey: 'spinner-basic',
        surface: 'paper',
        code: `import { Spinner, Busy } from '@/components/seventy-six';

<Spinner label="Saving" />

<Busy label="Loading July orders…" minHeight={140} />`,
      },
      {
        title: 'Refreshing in place',
        description: 'The stale table stays readable — it is still true until it changes.',
        demoKey: 'spinner-over',
        surface: 'paper',
        code: `<Busy label="Refreshing…">
  <DataTable {...props} />
</Busy>`,
      },
    ],
    props: [
      {
        component: 'Spinner',
        rows: [
          { name: 'size', type: '12 | 16 | 20', defaultValue: '12', description: 'Matches the type it sits beside.' },
          { name: 'label', type: 'string', description: 'Announced via role="status". Omit only when an adjacent live region says it.' },
        ],
      },
      {
        component: 'Busy',
        rows: [
          { name: 'label', type: 'string', description: 'REQUIRED sentence naming what is loading.' },
          { name: 'minHeight', type: 'number', defaultValue: '160', description: 'Region height while empty — match the component it replaces so nothing jumps.' },
          { name: 'children', type: 'ReactNode', description: 'Existing content, kept legible underneath while it refreshes.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Busy sets aria-busy="true" and aria-live="polite" on the region, so the label is announced once.',
        'A labelled Spinner is role="status"; an unlabelled one is decorative and must sit inside a region that announces.',
        'Under prefers-reduced-motion the rotation is the system\'s single registered exception — it is the only mark that says "still working".',
        'The label never uses "Please wait" or an exclamation mark (A3): it names the object.',
      ],
    },
    donts: [
      'No spinner on first paint where the anatomy is known — that is a Skeleton (B17).',
      'No bare spinner without a sentence; "loading" alone is not information.',
      'No spinner under 300ms of waiting — a flash of spinner is worse than none (B17).',
      'No full-page blocking spinner; regions load, pages do not freeze.',
    ],
    faq: [
      { q: 'Spinner or Skeleton?', a: 'Nothing on screen yet and the shape is known: Skeleton. Content present and refreshing, or an action in flight: Spinner/Busy.' },
      { q: 'Is the rotation not banned by A1?', a: 'A1 bans animations over 200ms except the registered `sv-rotate`, which is exactly this mark. It is the one continuous animation in the system.' },
    ],
  },

  /* ================================================================ B32 */
  {
    slug: 'kbd',
    name: 'Kbd',
    book: 'B32',
    category: 'primitives',
    tagline: 'A key, printed — mono cap on wall, for shortcuts that exist.',
    job: 'Print the key that triggers something.',
    tags: ['kbd', 'keyboard', 'shortcut', 'hotkey', 'command'],
    exports: ['Kbd'],
    files: ['components/seventy-six/kbd.tsx', 'components/seventy-six/kbd.css'],
    intro: [
      'Real <code>&lt;kbd&gt;</code> elements in Fragment Mono on a wall-toned cap with a slightly heavier bottom border — the only skeuomorphic gesture in 76°, and it earns its place because a key cap is a physical object. On the band the cap goes transparent and takes band tokens.',
      'It documents; it never acts. Every shortcut a Kbd prints must also have a visible control (C4) — the ⌘K cap in the search trigger sits beside a real button, and the Menu (B20) prints caps next to items that are also clickable.',
    ],
    examples: [
      {
        title: 'Chords and sequences',
        demoKey: 'kbd-basic',
        surface: 'paper',
        code: `import { Kbd } from '@/components/seventy-six';

<Kbd keys={['⌘', 'K']} />
<Kbd keys={['G', 'O']} separator="then" />`,
      },
    ],
    props: [
      {
        component: 'Kbd',
        rows: [
          { name: 'keys', type: 'string[]', description: 'One key per string — rendered as separate caps.' },
          { name: 'separator', type: 'string', description: 'Shown between caps for a sequence ("then"). Omit for a chord.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Each cap is a real <kbd> element, so assistive tech announces it as keyboard input.',
        'A printed shortcut never replaces a visible control (C4) — it labels one that already exists.',
        'Glyph keys (⌘, ⇧, ⏎) are printed as characters, not images, so they scale and translate with the text.',
      ],
    },
    donts: [
      'No Kbd on a shortcut the app does not actually bind.',
      'No clickable Kbd — it is documentation, not a button.',
      'No pill radius; the cap takes the registered 3px, like the system\'s bars.',
      'No key sequence longer than three caps — that is a docs page, not a hint.',
    ],
    faq: [
      { q: 'Where do these belong?', a: 'The ⌘K search trigger, Menu items, Dialog footers, and the shortcuts section of a settings page. Anywhere the shortcut already works.' },
    ],
  },

  /* ================================================================ B38 */
  {
    slug: 'tabs',
    name: 'Tabs',
    book: 'B38',
    category: 'primitives',
    tagline: 'A hairline row on the wall — the sheet\'s whole content region, switched.',
    job: 'Switch which set of cards the sheet shows, without touching the URL.',
    tags: ['tabs', 'tablist', 'tabpanel', 'sections', 'content switch', 'sheet'],
    exports: ['Tabs', 'TabPanel'],
    files: ['components/seventy-six/tabs.tsx', 'components/seventy-six/tabs.css'],
    intro: [
      'A row of real tabs on the wall, directly above the region they switch — most often between the band and the first card, or under a stat row that stays put while the analysis below it changes: 14/700 labels in soft ink with an optional mono tabular count, and the active one in seed text under a 2px seed underline sitting on the row\'s own hairline rather than beside it. There is no fill on a tab, ever — a tinted tab on the wall reads as a pill. Every tab owns its <b>own</b> <code>TabPanel</code>, tied to it by a shared <code>idBase</code>: pass the same base to both, render all the panels, and let <code>hidden</code> decide which one shows.',
      'Three components look alike and are not interchangeable, and the line between them is what changes. <b>BandSubTabs</b> (B1) <b>navigate</b> — links, a URL change, on the band. <b>CardTabs</b> (B8) <b>filter one card\'s content in place</b>, on that card\'s hairline. <b>Tabs</b> switch the sheet\'s whole content region and change no URL. Anything that deserves a URL is a band nav item; anything that only changes one card is B8. There is no <code>filters</code> mode here — <code>aria-pressed</code> buttons are B8\'s job, and a tablist that is sometimes not a tablist is a defect.',
    ],
    examples: [
      {
        title: 'Switching the sheet\'s sections',
        description: 'One panel per tab, all rendered — the id contract only holds if the panel the active tab names is in the document.',
        demoKey: 'tabs-basic',
        surface: 'wall',
        code: `import { useState } from 'react';
import { Tabs, TabPanel } from '@/components/seventy-six';

const [section, setSection] = useState('summary');

<Tabs
  label="Report sections"
  idBase="report"
  active={section}
  onChange={setSection}
  tabs={[
    { id: 'summary', label: 'Summary' },
    { id: 'lines', label: 'Line items', count: 148 },
    { id: 'audit', label: 'Audit', count: 6 },
  ]}
/>

<TabPanel idBase="report" tabId="summary" active={section === 'summary'}>
  {/* the cards this section holds */}
</TabPanel>`,
      },
    ],
    props: [
      {
        component: 'Tabs',
        rows: [
          { name: 'tabs', type: 'Tab[]', description: 'id · label · optional mono tabular count. Cap: five.' },
          { name: 'active / onChange', type: 'string / (id) => void', description: 'Controlled active tab.' },
          { name: 'label', type: 'string', description: 'REQUIRED accessible name for the tablist, e.g. "Report sections".' },
          { name: 'idBase', type: 'string', description: 'Ties each tab to its OWN panel. Defaults to a generated id — pass it explicitly whenever TabPanel is used.' },
        ],
      },
      {
        component: 'TabPanel',
        rows: [
          { name: 'idBase', type: 'string', description: 'REQUIRED — the same base the Tabs carries, or aria-controls points at nothing.' },
          { name: 'tabId', type: 'string', description: 'The id of the tab this panel belongs to.' },
          { name: 'active', type: 'boolean', description: 'False renders the panel hidden. Render every panel and let this decide.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Tab', action: 'Enters the row at the active tab; again, moves into its panel.' },
        { keys: '← / →', action: 'Move to the previous / next tab and switch the region with it.' },
        { keys: 'Home / End', action: 'Jump to the first / last tab.' },
      ],
      notes: [
        'A real role="tablist" of role="tab" buttons over role="tabpanel" panels — never aria-pressed, which is B8\'s filters mode.',
        'The active tab is the only tab stop (roving tabindex), and activation is automatic: arrowing moves focus and the region together, because the panels are already mounted and there is nothing to wait for.',
        'The panel takes tabIndex 0, so a region of cards holding no focusable content is still reachable — otherwise Tab steps straight past what the tabs just switched to.',
        'The active state is weight, aria-selected and a 2px underline as well as seed ink; colour never carries it alone (C5).',
        'Below 1000px the row wraps onto more lines. A nav-like row never becomes a horizontal scroller (A2), nothing is dropped, and the hairline still spans the full width (C7).',
      ],
    },
    donts: [
      'No sixth tab — the cap is five, and the sixth section is a band nav item.',
      'No filters mode; aria-pressed buttons filtering one card are B8.',
      'No tab that changes the URL — addressable state is navigation, and navigation is the Band (B1).',
      'No horizontal scroller below 1000px; the row wraps (A2).',
      'No fill or pill on a tab; the underline carries the state.',
      'No TabPanel without the idBase its Tabs carries — the aria-controls contract then breaks silently.',
    ],
    faq: [
      { q: 'Tabs, CardTabs or BandSubTabs?', a: 'Pick by what changes, not by what it looks like: the URL is B1, one card\'s content is B8, the sheet\'s whole content region is B38.' },
      { q: 'Why automatic activation rather than Enter to confirm?', a: 'Manual activation exists for tabs that fetch on selection. These do not — the panels are already in the document, so making the reader press a second key buys nothing.' },
      { q: 'Can the active tab live in the URL?', a: 'Then it is not a tab. State a reader should be able to link to or reload into is navigation and belongs on the band.' },
    ],
  },

  /* ================================================================ B39 */
  {
    slug: 'stepper',
    name: 'Stepper',
    book: 'B39',
    category: 'primitives',
    tagline: 'A fixed sequence, stated — where you are, and what remains.',
    job: 'State where you are in a FIXED sequence, and what remains.',
    tags: ['stepper', 'steps', 'sequence', 'wizard', 'checkout', 'onboarding'],
    exports: ['Stepper'],
    files: ['components/seventy-six/stepper.tsx', 'components/seventy-six/stepper.css'],
    intro: [
      'A real <code>&lt;ol&gt;</code>, because the order is the whole point: a 24px marker per step, a 12.5/500 label and an optional one line under it ("Signed 14 Jul"). Done and current markers take the seed fill; the connector behind the current step is seed and ahead of it is hairline, so the span already closed is legible at a glance. The connector is the step\'s own <code>::after</code> rather than an extra element — an empty span between steps would land inside the ordered list as a phantom item.',
      'A stepper is a <b>statement, not a control</b>. Steps render as plain text unless <code>onStepSelect</code> is passed, and even then only already-completed steps become buttons: you cannot click into a step you have not earned. It is not B4 <b>Progress</b> — a stepper counts named steps, a progress bar measures a quantity against a target — and it is not a tablist, because tabs are free peers and steps are ordered and gated.',
    ],
    examples: [
      {
        title: 'Four steps, the third current',
        description: 'No onStepSelect, so the stepper holds no tab stops — it states, and nothing more.',
        demoKey: 'stepper-basic',
        surface: 'paper',
        code: `import { Stepper } from '@/components/seventy-six';

<Stepper
  label="Onboarding progress"
  current={2}
  steps={[
    { id: 'account', label: 'Account', note: 'Created 12 Jul' },
    { id: 'contract', label: 'Contract', note: 'Signed 14 Jul' },
    { id: 'kyc', label: 'Verification' },
    { id: 'live', label: 'Go live' },
  ]}
/>`,
      },
      {
        title: 'Completed steps as buttons',
        description: 'onStepSelect turns the earned steps into buttons. The current step and everything ahead of it stay text.',
        demoKey: 'stepper-navigable',
        surface: 'paper',
        code: `<Stepper
  label="Checkout"
  current={2}
  onStepSelect={(index) => setStep(index)}
  steps={steps}
/>`,
      },
    ],
    props: [
      {
        component: 'Stepper',
        rows: [
          { name: 'steps', type: 'Step[]', description: 'id · label · optional one-line note.' },
          { name: 'current', type: 'number', description: 'Index of the current step, 0-based. Everything before it is done.' },
          { name: 'onStepSelect', type: '(index: number) => void', description: 'Makes COMPLETED steps buttons. Omit and the stepper is a statement.' },
          { name: 'label', type: 'string', description: 'REQUIRED accessible name for the list, e.g. "Onboarding progress".' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Tab', action: 'Moves to the next completed step — only when onStepSelect makes them buttons.' },
        { keys: 'Enter / Space', action: 'Selects the focused completed step.' },
      ],
      notes: [
        'A real <ol> with an aria-label; the current step carries aria-current="step".',
        'Every step also states its position and state in visually-hidden words ("Step 2 of 4, completed") — the seed fill is a colour, and colour never carries meaning alone (C5).',
        'The marker is aria-hidden: it is a picture of the index those words already say.',
        'The upcoming marker\'s 1px border is <code>--sv-field-line-strong</code>, not the hairline, because that border is its only affordance against the wall and owes the 3:1 non-text bar (C1).',
        'Below 620px the sequence stands up vertically and the connectors become rules in the marker column. Nothing is hidden and nothing scrolls (C7).',
      ],
    },
    donts: [
      'No clickable upcoming step — a step you have not earned is not a destination.',
      'No stepper for a quantity; a value against a target is Progress (B4).',
      'No stepper standing in for a tablist — steps are ordered and gated, tabs are peers (B38).',
      'No step count that changes as the reader moves; the sequence is fixed before it starts.',
      'No hairline border on the upcoming marker; it owes 3:1 (C1).',
      'No horizontal scroller below 620px; the sequence stands up (C7).',
    ],
    faq: [
      { q: 'Stepper or Progress?', a: 'Named steps in a fixed order: Stepper. A quantity against a target — 62% uploaded, 8 of 20 seats: Progress (B4).' },
      { q: 'Can the reader jump ahead?', a: 'No. onStepSelect turns completed steps into buttons and nothing else; moving forward is the form\'s own submit, not the indicator\'s job.' },
      { q: 'Why an ordered list rather than divs?', a: 'The order is the information, and a real <ol> announces position and count for free. It is also why the connector rides the item\'s ::after — nothing phantom may land in that count.' },
    ],
  },

  /* ================================================================ B40 */
  {
    slug: 'tree-list',
    name: 'TreeList',
    book: 'B40',
    category: 'primitives',
    tagline: 'The full ARIA tree, hand-rolled — depth drawn, one tab stop, no dependency.',
    job: 'Move through a HIERARCHY whose depth is itself the information.',
    tags: ['tree', 'treeview', 'hierarchy', 'nested', 'folders', 'chart of accounts'],
    exports: ['TreeList'],
    files: ['components/seventy-six/tree-list.tsx', 'components/seventy-six/tree-list.css'],
    intro: [
      'Nested <code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code> carrying the real ARIA tree: <code>role="tree"</code> on the root, <code>role="treeitem"</code> on every <code>&lt;li&gt;</code>, <code>role="group"</code> on each open branch, and <code>aria-level</code>, <code>aria-setsize</code> and <code>aria-posinset</code> on every row. Depth is 18px per level set inline as a custom property, because the indent is the only thing that varies down the tree; a leaf holds the 7px chevron slot open so every label on a level starts at the same x. The selected row wears B7\'s language — seed-tint plus a 2px seed left rule, the only other place in the system a left rule is allowed. Nothing here is stateful: <code>expanded</code> is a <code>Set</code> the caller owns.',
      'The boundaries are tight. B27 <b>Accordion</b> folds SECONDARY detail on one flat list, never nests and never navigates; B7 <b>DataTable</b> holds flat records that all share the same columns. A tree is neither, and it is not F3\'s refused data grid either — it is for a chart of accounts, a bill of materials, a folder tree, an org. The platform has no <code>&lt;tree&gt;</code> element, so the pattern is hand-rolled with zero dependencies: <b>one tab stop for the whole tree</b> on a roving tabindex, arrow keys walking the visible nodes depth-first. The <code>&lt;li&gt;</code> itself is the treeitem and there is no chevron button, because a focusable inside a treeitem breaks the pattern.',
    ],
    examples: [
      {
        title: 'A chart of accounts',
        description: 'Controlled throughout — the caller holds the open set and the selection.',
        demoKey: 'tree-basic',
        surface: 'paper',
        code: `import { useState } from 'react';
import { TreeList } from '@/components/seventy-six';

const [expanded, setExpanded] = useState(new Set(['assets']));
const [selected, setSelected] = useState<string | null>('current');

<TreeList
  label="Chart of accounts"
  expanded={expanded}
  onExpandedChange={setExpanded}
  selected={selected}
  onSelect={(id) => setSelected(id)}
  nodes={[
    {
      id: 'assets',
      label: 'Assets',
      meta: '1000',
      children: [
        { id: 'current', label: 'Current assets', meta: '1100' },
        { id: 'fixed', label: 'Fixed assets', meta: '1200' },
      ],
    },
    { id: 'liabilities', label: 'Liabilities', meta: '2000' },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'TreeList',
        rows: [
          { name: 'label', type: 'string', description: 'REQUIRED accessible name for the tree, e.g. "Chart of accounts".' },
          { name: 'nodes', type: 'TreeNode[]', description: 'id · label · optional mono meta · children.' },
          { name: 'expanded / onExpandedChange', type: 'Set<string> / (next) => void', description: 'Ids of the OPEN parents. Fully controlled — the tree owns no data state.' },
          { name: 'selected', type: 'string | null', description: 'The selected id, or null for "a selection exists, none made". Omit it entirely and rows carry no aria-selected.' },
          { name: 'onSelect', type: '(id: string, node: TreeNode) => void', description: 'Fired by Enter, Space and a pointer. A pointer on a parent also toggles its branch.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '↑ / ↓', action: 'Move focus to the previous / next VISIBLE row.' },
        { keys: '→', action: 'Open a closed parent; on an open one, step to its first child. A leaf does nothing.' },
        { keys: '←', action: 'Close an open parent; on a closed one or a leaf, move to the parent row.' },
        { keys: 'Home / End', action: 'Jump to the first / last visible row.' },
        { keys: 'Enter / Space', action: 'Select the focused row.' },
      ],
      notes: [
        'One tab stop for the whole tree: the roving index lands on the last focused row, else the selection, else the first row. Both fallbacks matter — collapsing a parent can take the focused node off screen.',
        'The focus ring is drawn on the row, not the treeitem: a treeitem owns its whole subtree, and a ring around that reads as a selection of the branch. Equal replacement, per C3.',
        'aria-level, aria-setsize and aria-posinset are on every row, so depth and position are announced instead of counted.',
        'The keys the tree owns stop at the row that handles them; treeitems nest, and without that a child\'s keystroke would run every ancestor\'s handler and move focus twice.',
        'The chevron is aria-hidden — aria-expanded on the treeitem carries the open state (C5).',
      ],
    },
    donts: [
      'No checkbox tree; bulk selection over a hierarchy needs tri-state and is a different problem.',
      'No inline row verbs — acting on a record is a Menu (B20) on that record\'s page.',
      'No lazy-load spinner inside a row; fetch the branch, then render it.',
      'No level that exists to hold a single child — a one-child level is a lie about the structure.',
      'No button inside a treeitem; a focusable there breaks the one-tab-stop contract.',
      'No tree standing in for a table — flat records sharing columns are B7.',
    ],
    faq: [
      { q: 'TreeList or Accordion?', a: 'Accordion (B27) folds secondary detail on one flat list and explicitly never nests. TreeList is for depth that is itself the information.' },
      { q: 'Why is the whole tree one tab stop?', a: 'That is the tree pattern: tab to the widget once, arrow within it. A tab stop per row turns a 400-account ledger into 400 presses.' },
      { q: 'Why no dependency?', a: 'The whole of it is a roving tabindex over a depth-first list of the visible nodes, plus the ARIA a nested list already implies. A package for that is weight without information.' },
      { q: 'Is this the data grid F3 refuses?', a: 'No. F3 refuses column resize, pinning and grouping over flat records — that is DataTable (B7) plus a Drawer (B21). A tree carries no columns.' },
    ],
  },

  /* ================================================================ B41 */
  {
    slug: 'timeline',
    name: 'Timeline',
    book: 'B41',
    category: 'primitives',
    tagline: 'One record\'s history on a clipped rail — including what has not happened.',
    job: 'State the ordered HISTORY of ONE record, with the gaps visible.',
    tags: ['timeline', 'history', 'audit trail', 'events', 'record', 'pending'],
    exports: ['Timeline'],
    files: ['components/seventy-six/timeline.tsx', 'components/seventy-six/timeline.css'],
    intro: [
      'A real <code>&lt;ol&gt;</code> down a 1px rail: an 11px marker per row, an absolute mono timestamp in a real <code>&lt;time dateTime&gt;</code>, a 13/600 title, one sentence of body and an optional mono actor. The rail is clipped at the first and last markers so the line never dangles past the sequence, and a day divider restarts it the same way. The marker\'s ring is an <code>inset</code> shadow, not an elevation one, so what reads is a dot sitting cleanly on the line rather than crossing it. There are no hairlines anywhere in it — the rail carries the rhythm.',
      'The boundary is B9 <b>ActivityList</b>: a live, flat feed answering "what needs me", newest first, across many records. A Timeline is one record\'s life, and it states what has <b>not</b> happened yet as well as what has. That is why <code>pending</code> is a first-class tone rather than an omitted row — a gap the reader cannot see is a gap nobody chases.',
    ],
    examples: [
      {
        title: 'An order\'s life',
        description: 'The last row has not happened. It is still stated, with a pending marker and the date it is expected.',
        demoKey: 'timeline-record',
        surface: 'paper',
        code: `import { Timeline } from '@/components/seventy-six';

<Timeline
  items={[
    { id: 'placed', group: '22 JUL', time: '09:14', dateTime: '2026-07-22T09:14:00+03:00',
      title: 'Order placed', actor: 'Halcyon Freight' },
    { id: 'picked', time: '11:02', dateTime: '2026-07-22T11:02:00+03:00',
      title: 'Picked', body: '14 SKUs from warehouse A.', actor: 'A. Yusuf' },
    { id: 'shipped', group: '24 JUL', time: '08:40', dateTime: '2026-07-24T08:40:00+03:00',
      title: 'Shipped', body: 'DHL · 4820 1183 55' },
    { id: 'delivered', time: '26 JUL', title: 'Delivery expected', tone: 'pending' },
  ]}
/>`,
      },
      {
        title: 'A run that failed',
        description: 'The bad row names what failed. "The run failed" states that something went wrong and nothing else (A3).',
        demoKey: 'timeline-failed',
        surface: 'paper',
        code: `<Timeline
  items={[
    { id: 'queued', time: '02:00', title: 'Run queued' },
    { id: 'extract', time: '02:01', title: 'Extract complete', body: '18,402 rows read.' },
    { id: 'load', time: '02:06', title: 'Load failed', tone: 'bad',
      body: 'Duplicate key on invoice_no at row 9,118.', actor: 'etl-worker-3' },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'Timeline',
        rows: [
          { name: 'items', type: 'TimelineItem[]', description: 'In display order — the component renders the order it is given.' },
        ],
      },
      {
        component: 'TimelineItem',
        rows: [
          { name: 'time', type: 'string', description: 'Absolute display time, e.g. "24 JUL · 14:28". Never "3 minutes ago" (C9).' },
          { name: 'dateTime', type: 'string', description: 'The machine timestamp, used for <time dateTime> and the title attribute.' },
          { name: 'title', type: 'string', description: 'What happened, in a few words.' },
          { name: 'body', type: 'ReactNode', description: 'One sentence. Two is a record page.' },
          { name: 'actor', type: 'string', description: 'Who did it — mono, under the body.' },
          { name: 'tone', type: "'done' | 'pending' | 'bad'", defaultValue: "'done'", description: 'Seed dot, hollow ring, or bad. Each is also stated in words.' },
          { name: 'group', type: 'string', description: 'Mono uppercase day divider rendered ABOVE this item.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'A real <ol>, so assistive tech announces position in the sequence without being told.',
        'Every row states its tone in visually-hidden words before the title ("Completed", "Not started", "Failed") — a coloured dot is colour-only meaning (C5), and the dot itself is aria-hidden.',
        'Day dividers render as role="presentation" siblings, so they stay out of the list\'s count: a divider is not a step in the history.',
        'Timestamps are absolute, in mono, inside a real <time dateTime>, with the machine value also on title (C9).',
        'The pending marker\'s ring takes <code>--sv-field-line-strong</code>, because that ring is the dot\'s only affordance (C1).',
      ],
    },
    donts: [
      'No relative timestamps — "3 minutes ago" is not a record (C9).',
      'No timeline as a feed across many records; that is ActivityList (B9).',
      'No dropping the rows that have not happened yet — the gap is the information.',
      'No second sentence in a body; a row needing a paragraph is a record page.',
      'No elevation shadow on the marker; the ring is an inset, and the dot sits on the rail, not above it.',
      'No tone carried by the dot alone — every marker says its state in words (C5).',
    ],
    faq: [
      { q: 'Timeline or ActivityList?', a: 'One record\'s life, including what is still pending: Timeline. A live feed across many records answering "what needs me": ActivityList (B9).' },
      { q: 'Oldest first or newest first?', a: 'Either — the component renders the order the caller passes. A record page usually reads oldest first, because the pending rows then sit at the bottom where the reader is heading.' },
      { q: 'Where does a failure explanation go?', a: 'In the body, in one sentence naming what failed and where. A bad tone with no sentence states only that something went wrong (A3).' },
    ],
  },
];
