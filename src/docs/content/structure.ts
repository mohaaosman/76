import type { DocEntry } from './types';

/**
 * v0.4.0 · closing the product taxonomy — the structure and display half.
 * Six parts a product reaches for constantly and had to leave 76° to get:
 * Accordion, DescriptionList, Divider, Avatar, Spinner/Busy, Kbd.
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
];
