import type { DocEntry } from './types';

/**
 * v0.5 · the public surface. Five components that let 76° dress the pitch
 * on its own terms: type, hairline and real figures. A2's illustration and
 * stock-photo bans stand unamended and F11 states the refusal outright, so
 * what is left is a newspaper — a masthead, columns, figures between rules,
 * one ask, and a footer. The display steps they set are theirs alone:
 * firewall rule 17 rejects --sv-display-* everywhere else, so no dashboard
 * grows a 64px number.
 */
export const marketing: DocEntry[] = [
  /* ================================================================ B47 */
  {
    slug: 'masthead',
    name: 'Masthead',
    book: 'B47',
    category: 'marketing',
    tagline: 'The hero, refused as imagery and rebuilt as type.',
    job: 'Open a public page with the claim, set in type.',
    tags: ['hero', 'masthead', 'landing', 'marketing', 'headline', 'display'],
    exports: ['Masthead'],
    files: ['components/seventy-six/masthead.tsx', 'components/seventy-six/masthead.css'],
    intro: [
      'F11 refuses hero imagery, stock photography and illustration; A2 refuses the stock-photo card. What is left is the thing a masthead always was — a claim, set large, with nothing behind it. There is <b>no image slot, no video slot and no background slot</b>, and adding one is a Book change rather than a prop.',
      'It is <code>PageHero</code>&rsquo;s (B1) public-surface sibling and speaks the same vocabulary on purpose: <code>title</code> plus a receded <code>titleSoft</code>, one line of context, an actions cluster with exactly one primary. The difference is the ramp and the surface — display type on the wall, instead of 27px on the band.',
      'The display steps clamp rather than sit at a fixed size: <code>--sv-display-1</code> is 64px at full width and 34px at 320px, which is the size the same line takes in the product ramp. The page degrades <i>into</i> the system, never out of it (C7).',
    ],
    examples: [
      {
        title: 'The opening claim',
        description: 'Eyebrow, claim, one sentence, one primary, and a mono line of terms.',
        demoKey: 'masthead-basic',
        code: `import { Masthead, Button } from '@/components/seventy-six';

<Masthead
  eyebrow="COMPONENT LIBRARY · v0.5"
  title="Flat, informational, corporate."
  titleSoft="Paper on a wall."
  statement="Fifty-one component specifications with one job each, zero runtime dependencies, and WCAG 2.2 AA verified on both surfaces."
  actions={<>
    <Button variant="primary">Install the registry</Button>
    <Button variant="ghost">Read the Book</Button>
  </>}
  note="MIT · ZERO DEPENDENCIES · REACT 19"
/>`,
      },
      {
        title: 'Centred',
        description: 'The measure caps and the column centres — everything else is unchanged.',
        demoKey: 'masthead-centred',
        code: `<Masthead
  align="center"
  title="One system, stated once."
  statement="Every widget is a registered type. If it is not in the Book, it is not on the screen."
  actions={<Button variant="primary">Open the taxonomy</Button>}
/>`,
      },
    ],
    props: [
      {
        component: 'Masthead',
        rows: [
          { name: 'eyebrow', type: 'string', description: 'Mono uppercase line above the title: the category, the release, the audience.' },
          { name: 'title', type: 'string', description: 'The claim. Becomes the page h1.' },
          { name: 'titleSoft', type: 'string', description: 'The claim\'s second half, receded to --sv-ink-soft inside the same heading.' },
          { name: 'statement', type: 'string', description: 'ONE sentence, capped near 58ch. A paragraph is B45 Prose.' },
          { name: 'actions', type: 'ReactNode', description: 'At most one primary and one ghost (B10).' },
          { name: 'note', type: 'string', description: 'A mono line under the actions: terms, licence, count.' },
          { name: 'align', type: "'start' | 'center'", defaultValue: "'start'", description: 'Left-aligned by default, because that is how the rest of the system sets type.' },
          { name: 'headingLevel', type: '1 | 2', defaultValue: '1', description: '2 only when the page already owns its h1.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The heading is a real h1 (or h2), and titleSoft sits inside it so the accessible name is the whole claim.',
        'The eyebrow is a sibling line, never a heading — a page whose h1 is preceded by an h2 has a broken outline (A4).',
        'Nothing in it is decorative-only, so nothing is aria-hidden.',
        'At 320px the title clamps to 34px and the actions go full width — no two-line clickables, no horizontal scroll (C7).',
      ],
    },
    donts: [
      'No image, video, or background — F11 refuses them, and the component has no slot to put one in.',
      'No second primary; B10 is at its most binding on a page whose whole job is one ask.',
      'No paragraph in the statement — one sentence, or reach for B45 Prose.',
      'No figures inside the Masthead; a proven number is B50 ProofRow.',
      'Never on paper — the Masthead is the wall, with no card and no shadow.',
    ],
    faq: [
      { q: 'Where is the hero image?', a: 'There is no slot for one. F11 refuses hero imagery, stock photography and illustration by name, and A1 refuses the gradient every hero grows next. The claim carries the page.' },
      { q: 'Masthead or PageHero?', a: 'PageHero (B1) is the band\'s product page header, at 27px on ink. Masthead is the public page, at display size on the wall. A product screen never uses a Masthead.' },
      { q: 'Can I use the display tokens elsewhere?', a: 'No — firewall rule 17 rejects --sv-display-* outside the five marketing components. The product ramp tops out at 27px, and a dashboard with a 64px number has left the system.' },
    ],
  },

  /* ================================================================ B48 */
  {
    slug: 'feature-list',
    name: 'FeatureList',
    book: 'B48',
    category: 'marketing',
    tagline: 'The claim, itemised — type on hairlines, never icon tiles.',
    job: 'State what the product does, one item at a time.',
    tags: ['features', 'marketing', 'landing', 'list', 'grid', 'benefits'],
    exports: ['FeatureList'],
    files: ['components/seventy-six/feature-list.tsx', 'components/seventy-six/feature-list.css'],
    intro: [
      'Every library answers this with a grid of tinted icon tiles. A2 refuses the icon-led card, F11 refuses the illustration it grows into, and Law 2 will not spend six colours on a decorative glyph — so what is left is a newspaper column: a rule, a number, a title, one sentence.',
      'It is a <b>statement, never a control</b>. Nothing in an item is clickable; if a feature needs a link, the link lives inside its body where the reader can see what it points at.',
    ],
    examples: [
      {
        title: 'Three across',
        description: 'A column rule per item, a mono ordinal, a title, one sentence.',
        demoKey: 'features-three',
        code: `import { FeatureList } from '@/components/seventy-six';

<FeatureList
  ariaLabel="What the system ships"
  items={[
    { id: 'taxonomy', title: 'A closed taxonomy', body: 'Fifty-one specifications, each with one job. If a screen needs a type that is not in the Book, the type gets named or the screen gets composed.', meta: 'B1 — B51' },
    { id: 'deps', title: 'Zero runtime dependencies', body: 'Native element first: <details>, <dialog>, [popover], <input type="date">. The browser already draws the calendar.', meta: 'REACT 19 ONLY' },
    { id: 'a11y', title: 'AA on both surfaces', body: 'Every token pair is contrast-verified in light and dark, and no meaning is ever carried by colour alone.', meta: 'WCAG 2.2 AA' },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'FeatureList',
        rows: [
          { name: 'items', type: 'FeatureItem[]', description: 'id · title · body (one sentence) · optional mono meta.' },
          { name: 'columns', type: '2 | 3', defaultValue: '3', description: 'Across at full width. Steps to 2 below 1000px and 1 below 620px.' },
          { name: 'numbered', type: 'boolean', defaultValue: 'true', description: 'Mono ordinals derived from the index — never passed in.' },
          { name: 'ariaLabel', type: 'string', description: 'Names the list when its section heading is elsewhere.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'A real <ul>, so the count is announced before the items.',
        'The ordinal is NOT aria-hidden: copy refers to items by number, and hiding a visible figure from a screen reader is the asymmetry C5 warns about.',
        'Ordinals and meta lines use --sv-ink-soft, never --sv-ink-faint — C2 forbids faint as a sole carrier.',
        'Content tracks are minmax(0, 1fr) so a long unbreakable word cannot blow the grid out at 320px (C7).',
      ],
    },
    donts: [
      'No icons and no tinted tiles (A2) — the rule and the ordinal are the structure.',
      'No illustration (F11).',
      'No card per item; cards are for work, and this is a statement.',
      'No clickable item — a link lives inside the body.',
      'No two-sentence body, and no tenth item: at ten this is a page.',
    ],
    faq: [
      { q: 'Why no icons?', a: 'A2 bans icon-only affordances and Law 2 allows neutrals plus one seed. A twelve-icon feature grid is either twelve seed glyphs, which is a wall of one colour, or six hues, which fails Ship Gate point 2.' },
      { q: 'Can an item link to a page?', a: 'The body can hold a link. The item itself never becomes a click target — a card-sized hit area with no visible affordance is mystery meat (A2).' },
    ],
  },

  /* ================================================================ B49 */
  {
    slug: 'cta',
    name: 'CallToAction',
    book: 'B49',
    category: 'marketing',
    tagline: 'The last row of a public page — the only one that asks.',
    job: 'Name the one act the page wants.',
    tags: ['cta', 'call to action', 'marketing', 'conversion', 'landing', 'band'],
    exports: ['CallToAction'],
    files: ['components/seventy-six/cta.tsx', 'components/seventy-six/cta.css'],
    intro: [
      'Everything above it states; this asks. That is why it holds exactly <b>one primary</b> — B10\'s rule is not relaxed on the public surface, it is at its most binding here, because a page that asks for two things has asked for neither.',
      'Two surfaces, one prop. <code>tone="paper"</code> is an ordinary 76° card on the wall: radius 4, one shadow, zero border. <code>tone="band"</code> paints the ink surface and takes the band\'s own tokens, so the page closes on the same ink it opened under. Ink takes no shadow — it is the wall\'s opposite, not a card resting on it.',
      'The copy contract is A3\'s: the button names its object. &ldquo;Start the 30-day trial&rdquo; is a call to action; &ldquo;Get started&rdquo; is a shrug.',
    ],
    examples: [
      {
        title: 'On paper',
        description: 'A card on the wall, one primary, one ghost, a mono line of terms.',
        demoKey: 'cta-paper',
        surface: 'wall',
        code: `import { CallToAction, Button } from '@/components/seventy-six';

<CallToAction
  title="Install the registry"
  statement="Every component is installable on its own, with the tokens as a shared dependency."
  actions={<>
    <Button variant="primary">Copy the install command</Button>
    <Button variant="ghost">Browse the components</Button>
  </>}
  note="NPX SHADCN@LATEST ADD 76.ZIFALA.COM/R/TOKENS.JSON"
/>`,
      },
      {
        title: 'On the band',
        description: 'The page closes on the same ink it opened under.',
        demoKey: 'cta-band',
        surface: 'wall',
        code: `<CallToAction
  tone="band"
  title="Read the Component Book"
  statement="Every specification, every refusal, and the fourteen-point gate each screen passes before it ships."
  actions={<Button variant="primary">Open the Book</Button>}
/>`,
      },
    ],
    props: [
      {
        component: 'CallToAction',
        rows: [
          { name: 'title', type: 'string', description: 'The ask, at --sv-display-3. Names the act\'s object (A3).' },
          { name: 'statement', type: 'string', description: 'One sentence: what happens after the click, or what it costs.' },
          { name: 'actions', type: 'ReactNode', description: 'ONE primary. A ghost beside it is permitted; a second primary is not.' },
          { name: 'note', type: 'string', description: 'A mono line under the actions: terms, trial length, card requirement.' },
          { name: 'tone', type: "'paper' | 'band'", defaultValue: "'paper'", description: 'A card on the wall, or the ink surface edge to edge.' },
          { name: 'headingLevel', type: '2 | 3', defaultValue: '2', description: 'A public page\'s h1 belongs to its Masthead (B47).' },
        ],
      },
    ],
    a11y: {
      notes: [
        'A real <section> named by the heading inside it — no redundant aria-label.',
        'headingLevel defaults to 2 because the page h1 is the Masthead\'s and levels are never skipped (A4).',
        'tone="band" carries the .sv-band class, so ghost buttons and focus rings inside it take the band treatment: white focus outline on ink (C3).',
        'Marks on ink paint with --sv-on-dark, never --sv-paper — paper inverts on dark and would collapse every white-on-ink pair (firewall rule 16).',
      ],
    },
    donts: [
      'Never two primaries.',
      'Never "Get started", "Learn more", or an exclamation mark (A3) — the button names its object.',
      'Never a countdown or a scarcity line; 76° speaks like a competent colleague.',
      'Never a form inside it — a form that collects something is a page, or a Plate (B24).',
      'Never a tinted "premium" surface or a gradient (A1).',
    ],
    faq: [
      { q: 'Paper or band?', a: 'Band when it is the last thing on the page and you want the page to close on ink. Paper when a CTA sits mid-page between two content sections, where a full ink row would cut the page in half.' },
      { q: 'Can it hold an email field?', a: 'No. A field plus a button is a form, and a form has validation, error states and a success condition — that is a page or a Plate, not a row.' },
    ],
  },

  /* ================================================================ B50 */
  {
    slug: 'proof-row',
    name: 'ProofRow',
    book: 'B50',
    category: 'marketing',
    tagline: 'The figures that carry the claim, between vertical hairlines.',
    job: 'State the few figures that prove the claim.',
    tags: ['stats', 'figures', 'proof', 'marketing', 'landing', 'metrics'],
    exports: ['ProofRow'],
    files: ['components/seventy-six/proof-row.tsx', 'components/seventy-six/proof-row.css'],
    intro: [
      'It is <b>not a StatS1</b>, and the distinction is written down because it is the only thing stopping someone reaching for one. B3 is the product\'s signature KPI card: an icon tile, a delta against a comparison period, a footnote that adds information, on paper, in a dashboard. This is a marketing row — no card, no icon, no delta, no comparison. A figure at display size, a mono label under it, on the wall, between vertical hairlines.',
      'The rules between the items are the point. They are what makes four figures read as one row of one page rather than four cards on a wall, and they are the same newspaper measure the whole system is built on.',
      'Ship Gate point 12 governs the content: the figures reconcile, and a number the product cannot substantiate is a defect, not a placeholder.',
    ],
    examples: [
      {
        title: 'Four figures',
        description: 'Pre-formatted, tabular, each with a mono label and a line of scope.',
        demoKey: 'proof-basic',
        code: `import { ProofRow } from '@/components/seventy-six';

<ProofRow
  ariaLabel="The system in figures"
  items={[
    { id: 'components', figure: '51', label: 'BOOK SPECS', note: 'B1 to B51, each with one job' },
    { id: 'deps', figure: '0', label: 'RUNTIME DEPS', note: 'React and the platform, nothing else' },
    { id: 'contrast', figure: '4.5:1', label: 'MINIMUM CONTRAST', note: 'Verified on light and dark paper' },
    { id: 'floor', figure: '320px', label: 'LAYOUT FLOOR', note: 'Nothing hidden, nothing scrolled sideways' },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'ProofRow',
        rows: [
          { name: 'items', type: 'ProofItem[]', description: 'id · figure (PRE-FORMATTED) · label · optional note. Two to four.' },
          { name: 'ariaLabel', type: 'string', description: 'Names the row when its section heading is elsewhere.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'A real <dl>: each figure is announced with its own label as one pair.',
        'The figure is visually above its label and still owns the <dd> — the DOM keeps <dt> first and CSS order does the rest, so nothing is announced backwards.',
        'Figures are tabular (A4) and pre-formatted by the caller, because C9 puts number formatting at the localization layer, never in a component.',
        'Nothing is aria-hidden: every mark on screen is also information.',
      ],
    },
    donts: [
      'Never a delta or an arrow — that is B3, and a public page has no comparison period.',
      'Never an icon, and never a card per figure.',
      'Never a figure the product cannot substantiate (Ship Gate point 12).',
      'Never more than four; a fifth is a table (B7).',
      'Never a percentage with no absolute anywhere on the page.',
    ],
    faq: [
      { q: 'Why not just use StatS1?', a: 'Because a stat card without its delta, its icon tile and its footnote is not a StatS1 — it is a broken one. The anatomy is required, all three zones (B3), and a marketing figure has none of the three.' },
      { q: 'Can it live on a dashboard?', a: 'No. It sets display type, and firewall rule 17 rejects --sv-display-* outside the marketing components. A dashboard figure is a StatS1.' },
    ],
  },

  /* ================================================================ B51 */
  {
    slug: 'site-footer',
    name: 'SiteFooter',
    book: 'B51',
    category: 'marketing',
    tagline: 'The one place a page is allowed to be a list of links.',
    job: 'Close a public page with everything it owes the reader.',
    tags: ['footer', 'marketing', 'landing', 'links', 'legal', 'sitemap'],
    exports: ['SiteFooter'],
    files: ['components/seventy-six/site-footer.tsx', 'components/seventy-six/site-footer.css'],
    intro: [
      'A brand column carrying the <code>76&deg;</code> wordmark and one sentence, then up to four labelled link groups, then a hairline and the legal line. It sits on the wall under a rule: no card, no shadow, no second surface.',
      'The accessibility is the whole design. Every footer that ships several unlabelled <code>&lt;nav&gt;</code>s is unusable by landmark navigation, so this ships <b>one</b> named nav and labels each group\'s list by its own title. The group titles are <b>not headings</b>: injecting h2s at the bottom of a document breaks the outline, and a labelled list is what a link group actually is.',
    ],
    examples: [
      {
        title: 'A public footer',
        description: 'Brand column, three groups, legal line, secondary links.',
        demoKey: 'footer-basic',
        code: `import { SiteFooter } from '@/components/seventy-six';

<SiteFooter
  statement="A component library for products that state their information rather than perform it."
  groups={[
    { title: 'SYSTEM', links: [{ label: 'Components', href: '/components' }, { label: 'Foundations', href: '/foundations' }, { label: 'Blocks', href: '/blocks' }] },
    { title: 'RESOURCES', links: [{ label: 'The Component Book', href: '/roadmap' }, { label: 'AI-ready layer', href: '/ai' }] },
    { title: 'PROJECT', links: [{ label: 'Roadmap', href: '/roadmap' }, { label: 'Changelog', href: '/roadmap' }] },
  ]}
  legal="© 2026 SEVENTY SIX DEGREES · MIT"
  secondary={[{ label: 'Licence', href: '/' }, { label: 'Status', href: '/' }]}
/>`,
      },
    ],
    props: [
      {
        component: 'SiteFooter',
        rows: [
          { name: 'groups', type: 'FooterGroup[]', description: 'title (mono uppercase) · links. At most four groups, six links each.' },
          { name: 'statement', type: 'string', description: 'One soft sentence beside the wordmark.' },
          { name: 'legal', type: 'string', description: 'The mono legal line. Required — a footer without it is not one.' },
          { name: 'secondary', type: 'FooterLink[]', description: 'Bottom-right links: privacy, terms, status.' },
          { name: 'renderLink', type: '(link, className) => ReactNode', description: 'Router adapter, exactly as BandNav takes one. Falls back to a plain anchor.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'A real <footer> landmark — no role attribute.',
        'ONE <nav aria-label="Footer"> around every link, including the secondary row. Several unlabelled navs in a footer is the classic landmark defect.',
        'Each group\'s <ul> is labelled by its own title via aria-labelledby, with ids derived from a single useId base so they are stable across renders.',
        'Group titles are not headings: a footer that injects h2s mid-document breaks the outline (A4).',
        'The wordmark carries one accessible name, "Seventy Six Degrees"; its glyph spans are aria-hidden so it is never spelled out.',
      ],
    },
    donts: [
      'No newsletter form — that is a page, or a Plate (B24).',
      'No social icon tiles (A2 refuses icon-only affordances).',
      'No language picker that is the only path to anything (C4).',
      'No second wordmark on a page whose band already carries one.',
      'No more than four groups or six links per group; a fifth group is a sitemap page.',
    ],
    faq: [
      { q: 'Why are the group titles not headings?', a: 'Because heading levels are a document outline, not a type style. A footer that adds four h2s below a page\'s content puts four top-level sections after the article. The group is a labelled list, and aria-labelledby says so exactly.' },
      { q: 'Can it carry the product nav?', a: 'No. Navigation is the Band (B1). A footer holds what a page owes the reader — legal, resources, the wordmark — not the app\'s own routes.' },
    ],
  },
];
