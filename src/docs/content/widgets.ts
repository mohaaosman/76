import type { DocEntry } from './types';

export const widgets: DocEntry[] = [
  /* ================================================================ B3 */
  {
    slug: 'stat-s1',
    name: 'StatS1',
    book: 'B3',
    category: 'widgets',
    tagline: 'The signature stat and the only legal KPI card: label + delta, icon tile + value, and a footnote that earns its line.',
    job: 'Answer "how much — and so what."',
    tags: ['kpi', 'stat-card', 'delta', 'tabular-numerals', 'icon-tile', 'footnote'],
    exports: ['StatS1'],
    files: ['components/seventy-six/stat-s1.tsx', 'components/seventy-six/stat-s1.css', 'components/seventy-six/card.tsx', 'components/seventy-six/card.css'],
    registryDeps: ['card'],
    intro: [
      'Three zones, all required. <b>Top:</b> mono label left, colored delta right (▲/▼ + tabular value — the arrow glyph is the non-color cue). <b>Middle:</b> a 34px seed-tint icon tile beside the 24/800 tabular value. <b>Foot:</b> a hairline-separated 11.5px sentence whose load-bearing figure sits in bold ink.',
      'The footnote is the discipline: it must contain information <b>not already in the card</b> — the target, the exposure, the oldest item\'s age. "Revenue is up" under a revenue number is a defect; "$610K target · 79% with 7 days left" is the point of the component.',
      '"Generic admin KPI card" is a registered defect class (A2). If a stat needs a sparkline, it is a Trend; if it needs two values, it is two stats.',
    ],
    examples: [
      {
        title: 'The canonical stat row',
        description: 'Four S1s in the stats split — the row that overlaps the band on every 76° overview.',
        demoKey: 'stat-row',
        code: `import { StatS1, Row } from '@/components/seventy-six';

<Row split="stats">
  <StatS1
    label="REVENUE · MTD"
    value="$482,190"
    delta={12.4}
    icon={<CoinsIcon />}
    footnote={<><b>$610K</b> target · 79% with 7 days left</>}
    footnoteText="$610K target, 79% reached with 7 days left"
  />
  <StatS1
    label="OPEN ORDERS"
    value="1,284"
    delta={-3.1}
    icon={<BoxIcon />}
    footnote={<>oldest open order is <b>4 days</b> · SLA is 5</>}
    footnoteText="Oldest open order is 4 days, SLA is 5"
  />
</Row>`,
      },
      {
        title: 'Without a comparison',
        description: 'When no comparison period exists the delta is simply omitted — the label never moves.',
        demoKey: 'stat-nodelta',
        code: `<StatS1
  label="ACTIVE SKUS"
  value="4,207"
  icon={<TagIcon />}
  footnote={<><b>312</b> added this quarter across 3 categories</>}
  footnoteText="312 added this quarter across 3 categories"
/>`,
      },
    ],
    props: [
      {
        component: 'StatS1',
        rows: [
          { name: 'label', type: 'string', description: 'Mono micro label, e.g. "REVENUE · MTD".' },
          { name: 'value', type: 'string', description: 'Pre-formatted display value; rendered 24/800 tabular.' },
          { name: 'unit', type: 'string', description: 'Suffix (%, pt, d) at 14/600 soft.' },
          { name: 'delta', type: 'number', description: 'Signed comparison; ▲/▼ + value in ok/bad. Omit when none exists.' },
          { name: 'deltaSuffix', type: 'string', defaultValue: "'%'", description: 'Appended to the delta figure.' },
          { name: 'icon', type: 'ReactNode', description: '16px stroke icon; the tile provides the seed tint.' },
          { name: 'footnote', type: 'ReactNode', description: 'The "so what" line; put the load-bearing figure in <b>.' },
          { name: 'footnoteText', type: 'string', description: 'Plain-text footnote for the aria-label.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The card reads as ONE unit: <code>aria-label="Revenue month to date: $482,190, up 12.4%, $610K target…"</code>; the visual internals are aria-hidden to avoid double-speak.',
        'Delta direction is never color-only — the arrow glyph carries it (C5).',
        '<code>tabular-nums</code> on the value and delta, per A4.',
      ],
    },
    donts: [
      'No sparklines, menus, or second values inside a stat.',
      'No icon on the right side; the tile sits left of the value.',
      'No tinted card backgrounds — the tile is the only tint.',
      'No footnote that paraphrases the value; it must add information.',
      'No generic KPI cards: S1 is the only stat anatomy.',
    ],
    faq: [
      { q: 'How do I format the value?', a: 'Format upstream and pass a string ($482,190). The component handles type discipline (tabular, tracking) but not locale math.' },
      { q: 'What if the metric got worse but down is good (e.g. returns)?', a: 'The delta colors by sign. For inverse metrics, pass the delta whose sign matches sentiment — e.g. returns dropping 8% is delta={+8} labeled "RETURNS · FEWER" — or omit the delta and carry it in the footnote.' },
      { q: 'Can the whole card link to a report?', a: 'Yes — wrap it in the anchor; the whole card is the target, focus ring per C3, and hover shows nothing beyond the cursor.' },
    ],
  },

  /* ================================================================ B4 */
  {
    slug: 'progress',
    name: 'Progress',
    book: 'B4',
    category: 'widgets',
    tagline: 'Value against target with one 3px bar. The numbers are the information; the bar is illustration.',
    job: 'Answer "how far along."',
    tags: ['progress', 'target', 'goal', 'bar', 'progressbar'],
    exports: ['Progress'],
    files: ['components/seventy-six/progress.tsx', 'components/seventy-six/progress.css'],
    intro: [
      'Soft title, a 19/700 tabular "current / target" line, a 3px seed bar on a wall track, and a faint context line. The fill transitions width once (160ms) and never animates on load beyond that.',
      'Danger is a word, not a bar: there is no red fill state. If something is overdue it belongs in a table or list with a StatusWord, not in a meter.',
    ],
    examples: [
      {
        title: 'Target progress',
        demoKey: 'progress-basic',
        surface: 'paper',
        code: `import { Progress } from '@/components/seventy-six';

<Progress
  title="July revenue target"
  current={482190}
  target={610000}
  format={(c, t) => \`$\${(c / 1000).toFixed(0)}K / $\${(t / 1000).toFixed(0)}K\`}
  context="79% · 7 days remaining"
/>`,
      },
    ],
    props: [
      {
        component: 'Progress',
        rows: [
          { name: 'title', type: 'string', description: 'Soft 12/500 title.' },
          { name: 'current / target', type: 'number', description: 'The real values; also drive aria-valuenow/max.' },
          { name: 'format', type: '(c, t) => string', defaultValue: 'localized "c / t"', description: 'Renders the value line.' },
          { name: 'context', type: 'string', description: 'Faint line under the bar — percentage lives here, never alone.' },
        ],
      },
    ],
    a11y: {
      notes: [
        '<code>role="progressbar"</code> with real aria-valuenow/min/max and an aria-label from the title.',
        'The visible numbers carry the information; the bar could disappear and nothing would be lost.',
      ],
    },
    donts: [
      'No percentages without absolute numbers somewhere in the card.',
      'No red bars; overdue items go to a table, not a meter.',
      'No load animations beyond the single 160ms width transition.',
    ],
    faq: [
      { q: 'Can the bar exceed 100%?', a: 'The fill clamps at 100%; overachievement is stated in the context line ("104% of target"), where it is information rather than decoration.' },
      { q: 'When do I use Progress vs MeterList?', a: 'One goal → Progress. Several named parts each with capacity → MeterList.' },
    ],
  },

  /* ================================================================ B5 */
  {
    slug: 'trend',
    name: 'Trend',
    book: 'B5',
    category: 'widgets',
    tagline: 'Flat single-weight SVG lines on a hairline grid — seed for now, line-gray for before. No fills, no draw-in.',
    job: 'Answer "which direction."',
    tags: ['chart', 'line-chart', 'bar-chart', 'comparison', 'svg', 'no-area-fill'],
    exports: ['Trend'],
    files: ['components/seventy-six/trend.tsx', 'components/seventy-six/trend.css'],
    intro: [
      'Hand-rolled SVG, no chart library: 2.25px round-joined lines, horizontal hairlines only, a 4px terminal dot on the live series, and the color convention that removes most legends — <b>seed is this period, line-gray is last period</b>. Bars are flat seed with faint-ink secondaries and 2px top radius.',
      'Trend cards live on report pages, not overviews (overviews use S1 stats). Maximum three series; a chart needing more is a table wearing a costume.',
      'The <code>ariaLabel</code> prop is required and must state the takeaway, because a chart\'s role="img" summary is the accessible content. For decision-critical data, pair the chart with a "View data" affordance or a visually-hidden table.',
    ],
    examples: [
      {
        title: 'This period vs last',
        demoKey: 'trend-line',
        code: `import { Trend, Card, CardHead } from '@/components/seventy-six';

<Card>
  <CardHead title="Revenue" subtitle="Daily · July vs June" />
  <div className="trend-pad">
    <Trend
      ariaLabel="Revenue trending up: $482K month to date against $431K at this point in June"
      series={[
        { label: 'July', data: julyDaily, tone: 'seed' },
        { label: 'June', data: juneDaily, tone: 'compare' },
      ]}
      xLabels={['01 JUL', '08 JUL', '15 JUL', '22 JUL']}
    />
  </div>
</Card>`,
      },
      {
        title: 'Bars',
        demoKey: 'trend-bar',
        code: `<Trend
  kind="bar"
  ariaLabel="Orders per weekday peaking Thursday at 312"
  series={[{ label: 'Orders', data: [180, 224, 251, 312, 296, 142, 98], tone: 'seed' }]}
  xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
  height={120}
/>`,
      },
    ],
    props: [
      {
        component: 'Trend',
        rows: [
          { name: 'ariaLabel', type: 'string', description: 'REQUIRED. The takeaway, stated in words.' },
          { name: 'series', type: 'TrendSeries[]', description: '{ label, data, tone? } — max 3; first defaults to seed, others to compare.' },
          { name: 'kind', type: "'line' | 'bar'", defaultValue: "'line'", description: 'Bars are flat seed / faint-ink.' },
          { name: 'xLabels', type: 'string[]', description: 'Mono labels spread under the plot.' },
          { name: 'height', type: 'number', defaultValue: '160', description: 'Plot height in viewBox units.' },
          { name: 'legend', type: 'boolean', defaultValue: 'false', description: 'Show 14×2px swatch legend when the seed/gray convention is not enough.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The SVG is <code>role="img"</code> with the takeaway as its label — screen-reader users get the conclusion, not a coordinate dump.',
        'Series are never referenced by color alone in copy (C5): label them directly or via the legend.',
      ],
    },
    donts: [
      'No area or gradient fills under lines (A1).',
      'No dual-axis charts; two units means two charts.',
      'No animated draw-in; the chart is simply there.',
      'No donuts, pies, radials, or gauges anywhere in product (A2) — MeterList replaces them.',
      'No more than three series.',
    ],
    faq: [
      { q: 'Which colors do series use?', a: 'tone: "seed" (current), "compare" (line-gray #D6DAE0, the one aliased non-token color), or "faint" for secondary bars. There is no palette to pick from — the convention is the palette.' },
      { q: 'Why no chart library?', a: 'A flat line on hairlines is ~60 lines of SVG. A library would add a dependency, its own theme system to fight, and animation defaults that violate the firewall.' },
      { q: 'How do users get exact values?', a: 'Pair the card with a "View data" text-link action in the CardHead that opens the underlying table — decision-critical numbers always exist as text somewhere.' },
    ],
  },

  /* ================================================================ B6 */
  {
    slug: 'meter-list',
    name: 'MeterList',
    book: 'B6',
    category: 'widgets',
    tagline: 'Named items with 3px bars and mandatory absolute numbers — the donut chart\'s replacement.',
    job: 'Answer "how is each part doing."',
    tags: ['meter', 'capacity', 'utilization', 'donut-replacement', 'progressbar-list'],
    exports: ['MeterList'],
    files: ['components/seventy-six/meter-list.tsx', 'components/seventy-six/meter-list.css'],
    intro: [
      'Rows of: soft label + bold tabular value, a 3px bar, and a subtitle with the real numbers. The subtitle is <b>required</b> — "92%" alone is a defect; "4,320 of 4,700 pallet positions" is the component doing its job.',
      'Wherever a donut, pie, or gauge is tempting, this is the registered answer (A2). It ranks, it shows capacity, and it stays readable at a squint.',
    ],
    examples: [
      {
        title: 'Warehouse utilization',
        demoKey: 'meter-basic',
        code: `import { MeterList, Card, CardHead } from '@/components/seventy-six';

<Card>
  <CardHead title="Capacity" subtitle="By zone · live" />
  <div className="trend-pad">
    <MeterList
      items={[
        { label: 'Zone A · ambient', current: 4320, max: 4700, value: '92%', subtitle: '4,320 of 4,700 pallet positions' },
        { label: 'Zone B · chilled', current: 1180, max: 1600, value: '74%', subtitle: '1,180 of 1,600 pallet positions' },
        { label: 'Zone C · bonded', current: 410, max: 900, value: '46%', subtitle: '410 of 900 pallet positions' },
      ]}
    />
  </div>
</Card>`,
      },
    ],
    props: [
      {
        component: 'MeterList',
        rows: [
          { name: 'items', type: 'MeterItem[]', description: '{ label, current, max, value, subtitle } — subtitle (absolute numbers) is required by the type.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Each row is a <code>role="progressbar"</code> labeled by its name AND absolute numbers — a screen reader hears "Zone A: 4,320 of 4,700 pallet positions", not "92 percent".',
      ],
    },
    donts: [
      'No percentage-only rows; the absolute subtitle is mandatory.',
      'No red fills for hot zones — a zone in trouble gets a row in a table with a StatusWord.',
      'No sorting animations; re-render in the new order.',
    ],
    faq: [
      { q: 'When is MeterList wrong?', a: 'When there is one value against one target (use Progress) or when items need drilling into (use DataTable — meters are read-only summaries).' },
      { q: 'Can bars use different colors per row?', a: 'No. Seed on wall, every row. Differentiation comes from labels and values, not hue (Law 2).' },
    ],
  },

  /* ================================================================ B7 */
  {
    slug: 'data-table',
    name: 'DataTable',
    book: 'B7',
    category: 'widgets',
    tagline: 'The ERP workhorse: mono headers, mono IDs, dot+word statuses, right-aligned tabular numbers, full keyboard contract.',
    job: 'Answer "what exactly happened."',
    tags: ['table', 'data-grid', 'keyboard-navigation', 'sorting', 'selection', 'pagination', 'erp'],
    exports: ['DataTable'],
    files: ['components/seventy-six/data-table.tsx', 'components/seventy-six/data-table.css'],
    intro: [
      'Column headers are Fragment Mono 9.5 uppercase; cells are 13/500 with 10.5px vertical padding; IDs render in mono soft; numeric columns are right-aligned, tabular, 600. Rows hover in seed-tint; a selected row adds the system\'s only 2px left rule. The last row is unruled.',
      'Column <code>kind</code> does the type discipline for you: <code>id</code> gets mono, <code>num</code> gets right/tabular, <code>status</code> expects a StatusWord. Sorting is the caller\'s job — the table renders <code>aria-sort</code> and header buttons, your code reorders the rows.',
      'On narrow screens the table scrolls horizontally inside its card. It never reflows into stacked blobs, and the header row never disappears.',
    ],
    examples: [
      {
        title: 'Orders table with selection and keyboard nav',
        description: 'Click a row, then drive it entirely from the keyboard: ↑/↓ to move, Space to select, ⇧↓ to range-select, Enter to open.',
        demoKey: 'table-full',
        code: `import { DataTable, StatusWord } from '@/components/seventy-six';

<DataTable
  caption="Open orders"
  rows={orders}
  rowKey={(o) => o.id}
  selectable
  selected={selected}
  onSelect={setSelected}
  onRowOpen={(o) => navigate(\`/orders/\${o.id}\`)}
  announcement={\`\${orders.length} orders · Pending filter\`}
  columns={[
    { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
    { key: 'customer', header: 'CUSTOMER', render: (o) => o.customer },
    { key: 'status', header: 'STATUS', kind: 'status',
      render: (o) => <StatusWord tone={o.tone}>{o.status}</StatusWord> },
    { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
  ]}
  page={{ from: 1, to: 5, of: 248, onNext: nextPage }}
/>`,
      },
    ],
    props: [
      {
        component: 'DataTable',
        rows: [
          { name: 'caption', type: 'string', description: 'Visually-hidden <code>&lt;caption&gt;</code> naming the table for screen readers.' },
          { name: 'columns', type: 'Column<Row>[]', description: '{ key, header, kind?, sortable?, sorted?, onSort?, render }.' },
          { name: 'rows / rowKey', type: 'Row[] / (row) => string', description: 'Data and its stable key.' },
          { name: 'onRowOpen', type: '(row) => void', description: 'Enter or double-click opens the row.' },
          { name: 'selectable / selected / onSelect', type: 'boolean / Set<string> / (keys) => void', description: 'Controlled selection; Space toggles, ⇧ extends.' },
          { name: 'announcement', type: 'string', description: 'aria-live polite text on data/filter changes ("12 orders · Pending").' },
          { name: 'page', type: '{ from, to, of, onPrev?, onNext? }', description: 'Mono "1–50 OF 248" + ghost prev/next. No numbered pill walk.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '↑ / ↓', action: 'Move row focus (roving tabindex).' },
        { keys: 'Enter', action: 'Open the focused row.' },
        { keys: 'Space', action: 'Toggle selection on the focused row.' },
        { keys: '⇧ + ↑/↓ · ⇧Space', action: 'Range-select from the anchor row.' },
        { keys: 'Home / End', action: 'Jump to first / last row.' },
      ],
      notes: [
        'Headers are <code>&lt;th scope="col"&gt;</code>; sortable headers are real buttons inside the th carrying <code>aria-sort</code>.',
        'Row count and filter state announce via a polite live region on change.',
        'The focused row shows the hover visual plus the focus ring — same information, keyboard or mouse.',
      ],
    },
    donts: [
      'No mobile "card-ification" — tables scroll horizontally, headers stay.',
      'No zebra striping; hairlines separate rows.',
      'No numbered pagination pill walks; range + prev/next only.',
      'No left rules except the 2px seed rule on selected rows.',
      'No relative timestamps in ERP contexts — absolute, in mono.',
    ],
    faq: [
      { q: 'How do I make a column sortable?', a: 'Set sortable, render your current order into sorted ("ascending" | "descending"), and reorder rows in onSort. The table is deliberately headless about sort logic.' },
      { q: 'How does selection work?', a: 'Controlled: pass selectable, a Set of keys in selected, and onSelect. Space toggles, ⇧ extends from the last anchor, and the selected row gets seed-tint plus the 2px left rule.' },
      { q: 'Where do filter tabs go?', a: 'A CardTabs row (mode="filters") between the CardHead and the table — the Bissaa pattern. Update announcement when the filter changes.' },
      { q: 'What about virtualization for 10,000 rows?', a: 'Paginate at 50 (the Book\'s pager pattern) and keep the DOM small. If a screen truly needs infinite scroll, that is a new widget type to register — not a silent fork of this one.' },
    ],
  },

  /* ================================================================ B8 */
  {
    slug: 'card-tabs',
    name: 'CardTabs',
    book: 'B8',
    category: 'widgets',
    tagline: 'In-card filter tabs on the card hairline — honest ARIA in both of its two modes.',
    job: 'Filter one card\'s content in place.',
    tags: ['tabs', 'filters', 'tablist', 'aria-pressed', 'in-card'],
    exports: ['CardTabs'],
    files: ['components/seventy-six/card-tabs.tsx', 'components/seventy-six/card-tabs.css'],
    intro: [
      'CardTabs filter content in place — that is what separates them from BandSubTabs, which navigate. 13.5/600 soft text; the active tab turns seed with a 2px underline sitting exactly on the card\'s hairline.',
      'Pick the mode by behavior and never mix (B8): <b>tabs</b> renders a real tablist/tab/tabpanel with arrow-key movement for client-side panels; <b>filters</b> renders plain buttons with <code>aria-pressed</code> when the click drives a server-side filter.',
    ],
    examples: [
      {
        title: 'Filtering a table',
        demoKey: 'cardtabs-basic',
        code: `import { useState } from 'react';
import { Card, CardHead, CardTabs } from '@/components/seventy-six';

const [filter, setFilter] = useState('all');

<Card>
  <CardHead title="Orders" subtitle="July · warehouse A" />
  <CardTabs
    mode="filters"
    tabs={[
      { id: 'all', label: 'All', count: 248 },
      { id: 'pending', label: 'Pending', count: 36 },
      { id: 'hold', label: 'On hold', count: 5 },
    ]}
    active={filter}
    onChange={setFilter}
  />
  {/* table filtered by \`filter\` */}
</Card>`,
      },
    ],
    props: [
      {
        component: 'CardTabs',
        rows: [
          { name: 'tabs', type: 'CardTab[]', description: '{ id, label, count? } — count renders as a mono figure.' },
          { name: 'active / onChange', type: 'string / (id) => void', description: 'Controlled active tab.' },
          { name: 'mode', type: "'tabs' | 'filters'", defaultValue: "'tabs'", description: 'tabs = ARIA tablist with arrow keys; filters = aria-pressed buttons.' },
          { name: 'idBase', type: 'string', description: 'In tabs mode, ties tabs to your panel: panel id={`${idBase}-panel`}.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '← / → · Home / End', action: 'Move between tabs (tabs mode; selection follows focus).' },
      ],
      notes: [
        'In tabs mode the active tab is the only tab stop (roving tabindex) and panels carry role="tabpanel".',
        'In filters mode each button exposes <code>aria-pressed</code> — no fake tab semantics for things that are not tabs.',
      ],
    },
    donts: [
      'No third nesting level — deeper structure becomes a page.',
      'No mixing modes: server filters never wear role="tab".',
      'No pill or filled active states; the underline + seed text is the whole state.',
    ],
    faq: [
      { q: 'Tabs or filters — which mode?', a: 'Does the click swap client-rendered panels? tabs. Does it refetch or refilter data in the same view? filters. Behavior decides, never appearance — both look identical.' },
      { q: 'How do I show counts?', a: 'Pass count per tab; it renders as a mono tabular figure after the label, in faint ink.' },
    ],
  },

  /* ================================================================ B9 */
  {
    slug: 'activity-list',
    name: 'ActivityList',
    book: 'B9',
    category: 'widgets',
    tagline: 'A mono timestamp column beside sentence rows with bold entities. Absolute time, always.',
    job: 'Answer "what needs me."',
    tags: ['activity', 'feed', 'timeline', 'audit-log', 'timestamps'],
    exports: ['ActivityList'],
    files: ['components/seventy-six/activity-list.tsx', 'components/seventy-six/activity-list.css'],
    intro: [
      'A fixed mono timestamp column and 12.5px sentences where the entities — order IDs, names, amounts — sit in 600 ink. Hairlines separate rows; the sentence reads like a colleague\'s note: "PO-2291 approved by <b>Nasra Ali</b>".',
      'Timestamps are absolute in ERP contexts (14:28, 24 JUL) — "3 minutes ago" is banned there. Consumer seeds may go relative, but the absolute value always exists on hover via <code>title</code> and in the datetime attribute.',
    ],
    examples: [
      {
        title: 'Today\'s activity',
        demoKey: 'activity-basic',
        code: `import { ActivityList, Card, CardHead } from '@/components/seventy-six';

<Card>
  <CardHead title="Activity" subtitle="Today · all zones" />
  <ActivityList
    items={[
      { time: '14:28', dateTime: '2026-07-24T14:28:00+03:00',
        children: <><b>ORD-10482</b> picked complete — 12 of 12 items</> },
      { time: '13:51', dateTime: '2026-07-24T13:51:00+03:00',
        children: <><b>PO-2291</b> approved by <b>Nasra Ali</b></> },
      { time: '11:04', dateTime: '2026-07-24T11:04:00+03:00',
        children: <>Zone B temperature back in range after <b>18 min</b></> },
    ]}
  />
</Card>`,
      },
    ],
    props: [
      {
        component: 'ActivityList',
        rows: [
          { name: 'items', type: 'ActivityItem[]', description: '{ time, dateTime?, children } — children is the sentence with entities in <b>.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'Rendered as an ordered list — the sequence is the semantics.',
        'Timestamps use <code>&lt;time dateTime&gt;</code> with the full ISO value on title.',
      ],
    },
    donts: [
      'No avatars, icons, or color-coded event types — the sentence carries the meaning.',
      'No "3 minutes ago" in ERP contexts.',
      'No infinite feeds inside overview cards; cap the list and link to the full log.',
    ],
    faq: [
      { q: 'How many items should an overview card show?', a: 'Five to eight, with a "View log" text-link action in the CardHead. The widget answers "what needs me", not "everything that happened".' },
      { q: 'Can rows link to their objects?', a: 'Wrap the entity in your router\'s Link inside the sentence — the bold entity is the natural target.' },
    ],
  },
];
