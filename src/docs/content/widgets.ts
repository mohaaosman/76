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
    exports: ['StatS1', 'Delta'],
    files: ['components/seventy-six/stat-s1.tsx', 'components/seventy-six/stat-s1.css', 'components/seventy-six/card.tsx', 'components/seventy-six/card.css'],
    registryDeps: ['card'],
    intro: [
      'Three zones, all required. <b>Top:</b> mono label left, colored delta right (▲/▼ + tabular value — the arrow glyph is the non-color cue). <b>Middle:</b> a 34px seed-tint icon tile beside the 24/800 tabular value. <b>Foot:</b> a hairline-separated 11.5px sentence whose load-bearing figure sits in bold ink.',
      'The footnote is the discipline: it must contain information <b>not already in the card</b> — the target, the exposure, the oldest item\'s age. "Revenue is up" under a revenue number is a defect; "$610K target · 79% with 7 days left" is the point of the component.',
      '"Generic admin KPI card" is a registered defect class (A2). If a stat needs a sparkline, it is a Trend; if it needs two values, it is two stats.',
      '<b>v0.4.0</b> extracts the delta chip as <b>Delta</b>, so a table cell or a DescriptionList row states a change in exactly the voice this card does — one implementation, not two. <code>polarity</code> handles inverse metrics honestly: cost falling is <code>down-good</code> and colours ok, without the old trick of flipping the sign.',
    ],
    examples: [
      {
        title: 'Delta beside a figure',
        description: 'The same chip outside the card — a record readout, a table cell, a Trend head.',
        demoKey: 'delta-inline',
        surface: 'paper',
        code: `import { Delta, Sparkline } from '@/components/seventy-six';

<Delta value={12.4} />
<Delta value={-6.2} polarity="down-good" />   // cost falling is good
<Sparkline data={ordersPerDay} ariaLabel="Orders per day, trending up over seven days" />`,
      },
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
          { name: 'deltaPolarity', type: "'up-good' | 'down-good'", defaultValue: "'up-good'", description: 'Which direction colours ok. Cost, churn and returns are down-good.' },
          { name: 'icon', type: 'ReactNode', description: '16px stroke icon; the tile provides the seed tint.' },
          { name: 'footnote', type: 'ReactNode', description: 'The "so what" line; put the load-bearing figure in <b>.' },
          { name: 'footnoteText', type: 'string', description: 'Plain-text footnote for the aria-label.' },
        ],
      },
      {
        component: 'Delta',
        rows: [
          { name: 'value', type: 'number', description: 'Signed change; +12.4 renders "▲ 12.4%".' },
          { name: 'suffix', type: 'string', defaultValue: "'%'", description: 'Appended to the figure.' },
          { name: 'polarity', type: "'up-good' | 'down-good'", defaultValue: "'up-good'", description: 'Which direction colours ok.' },
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
      { q: 'What if the metric got worse but down is good (e.g. returns)?', a: 'Pass the real signed change and set deltaPolarity="down-good". Returns dropping 8% renders "▼ 8%" in ok — honest arrow, honest colour. The old advice of flipping the sign is withdrawn as of v0.4.0.' },
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
      'Soft title, a 19/700 tabular "current / target" line, a 3px seed bar on a wall track, and a faint context line. The fill transitions width once (160ms) when the value changes.',
      '<b>v0.9</b> lets the bar arrive. Under <code>data-motion="on"</code> the fill draws from the left in 200ms — a <code>scaleX</code>, never a width, because A1 forbids animating layout and the track, the figure above it and the context line under it must not reflow. With no posture declared not one declaration applies and the bar paints finished on the first frame, which is what it did before. Nothing is carried by it: B4 specifies the numbers as the information and the bar as illustration.',
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
      {
        title: 'At or over target',
        description: 'The fill clamps at 100% even when current exceeds target; the overage is stated as information in the context line, never as a bar that runs off the end.',
        demoKey: 'progress-over',
        surface: 'paper',
        code: `<Progress
  title="Q3 units shipped vs target"
  current={9360}
  target={9000}
  format={(c, t) => \`\${c.toLocaleString()} / \${t.toLocaleString()} units\`}
  context="104% of target · bar caps at 100%, the overage lives in this line"
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
    tagline: 'Flat single-weight SVG lines on a hairline grid — seed for now, line-gray for before. No fills; the draw-in is off until the app asks.',
    job: 'Answer "which direction."',
    tags: ['chart', 'line-chart', 'bar-chart', 'stacked-bar', 'sparkline', 'comparison', 'svg', 'no-area-fill'],
    exports: ['Trend', 'Sparkline'],
    files: ['components/seventy-six/trend.tsx', 'components/seventy-six/trend.css'],
    intro: [
      'Hand-rolled SVG, no chart library: 2.25px round-joined lines, horizontal hairlines only, a 4px terminal dot on the live series, and the color convention that removes most legends — <b>seed is this period, line-gray is last period</b>. Bars are flat seed with faint-ink secondaries and 2px top radius.',
      'Trend cards live on report pages, not overviews (overviews use S1 stats). Maximum three series; a chart needing more is a table wearing a costume.',
      '<b>v0.4.0</b> adds two things. <code>kind="stacked"</code> sums the series per column and scales the plot to the total — legal only when the segments are parts of ONE total, never unrelated measures sharing an axis. <b>Sparkline</b> is the same shape at cell size: no axes, no grid, no labels, and legal only BESIDE a printed figure, because a line with no scale states nothing on its own.',
      'The <b>v0.4.0 remainder amendment</b> adds the two things a printed chart was still missing. <code>yTicks</code> takes up to four PRE-FORMATTED labels, given bottom-to-top, pinned to the four gridlines the chart already draws at 25, 50, 75 and 100 percent of the plot — the component never formats a number (C9), and the column is <code>aria-hidden</code> because the required <code>ariaLabel</code> already carries the takeaway. <code>highlight</code> names the one column the chart is ABOUT, and it is a <b>printed statement, never a hover tooltip</b>: C8 forbids hover-dependent information, so the chip is always visible. The other columns recede to <code>--sv-compare</code>, the chip is drawn in HTML rather than SVG because the plot is <code>preserveAspectRatio="none"</code> and would stretch any <code>&lt;text&gt;</code> inside it, and the matching x label goes ink at 700.',
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
      {
        title: 'Stacked — parts of one total',
        description: 'Only when the segments sum to something real. Two unrelated measures are two charts.',
        demoKey: 'trend-stacked',
        code: `<Trend
  kind="stacked"
  legend
  ariaLabel="Weekly volume by channel, total peaking Thursday at 412 orders"
  series={[
    { label: 'Direct', data: direct },
    { label: 'Partner', data: partner },
    { label: 'Marketplace', data: marketplace },
  ]}
  xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
  height={140}
/>`,
      },
      {
        title: 'The bar the chart is about',
        description: 'Thursday is the point, so Thursday is stated: the chip is printed above the peak, the other six bars recede to compare, and the THU label goes ink at 700. Nothing here waits for a pointer. The yTicks are formatted upstream and land on the gridlines the plot already draws.',
        demoKey: 'trend-highlight',
        surface: 'paper',
        code: `<Trend
  kind="bar"
  ariaLabel="Orders per weekday peak on Thursday at 312, a quarter above the weekday average"
  series={[{ label: 'Orders', data: [180, 224, 251, 312, 296, 142, 98], tone: 'seed' }]}
  xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
  yTicks={['90', '180', '270', '360']}
  highlight={{ index: 3, label: 'THU · 312' }}
  height={140}
/>`,
      },
    ],
    props: [
      {
        component: 'Trend',
        rows: [
          { name: 'ariaLabel', type: 'string', description: 'REQUIRED. The takeaway, stated in words.' },
          { name: 'series', type: 'TrendSeries[]', description: '{ label, data, tone? } — max 3; first defaults to seed, others to compare.' },
          { name: 'kind', type: "'line' | 'bar' | 'stacked'", defaultValue: "'line'", description: 'Bars are flat seed / faint-ink; stacked sums the series per column.' },
          { name: 'xLabels', type: 'string[]', description: 'Mono labels spread under the plot.' },
          { name: 'height', type: 'number', defaultValue: '160', description: 'Plot height in viewBox units.' },
          { name: 'legend', type: 'boolean', defaultValue: 'false', description: 'Show 14×2px swatch legend when the seed/gray convention is not enough.' },
          { name: 'yTicks', type: 'string[]', description: 'Up to four PRE-FORMATTED labels, bottom-to-top, pinned to the 25/50/75/100% gridlines. The chart never formats a number (C9); the column is aria-hidden.' },
          { name: 'highlight', type: '{ index: number; label: string }', description: 'The one column the chart is about. Prints a chip above it, recedes the rest to compare, and takes its x label to ink/700. Never a hover state (C8).' },
        ],
      },
      {
        component: 'Sparkline',
        rows: [
          { name: 'data', type: 'number[]', description: 'The series. Scaled to its own min/max — it shows shape, not level.' },
          { name: 'ariaLabel', type: 'string', description: 'REQUIRED takeaway, as on Trend.' },
          { name: 'width / height', type: 'number', defaultValue: '72 / 20', description: 'Cell-sized by default.' },
          { name: 'tone', type: "'seed' | 'faint'", defaultValue: "'seed'", description: 'faint for a secondary row in a dense table.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The SVG is <code>role="img"</code> with the takeaway as its label — screen-reader users get the conclusion, not a coordinate dump.',
        'Series are never referenced by color alone in copy (C5): label them directly or via the legend.',
        'The y-tick column is <code>aria-hidden</code>, and so is the highlight chip: both are ordinary HTML text in the flow rather than stretched SVG, but the required <code>ariaLabel</code> already states the takeaway and two readings of one fact is a defect.',
      ],
    },
    donts: [
      'No area or gradient fills under lines (A1).',
      'No dual-axis charts; two units means two charts.',
      'No animated draw-in <b>by default</b> — the chart is simply there. It draws only where a wrapper declares <code>data-motion="on"</code>, in 200ms, along a <code>pathLength</code>-normalised line whose un-animated state is the finished line. The Sparkline follows it; the highlight chip deliberately does not, because a printed statement does not arrive late.',
      'No donuts, pies, radials, or gauges anywhere in product (A2) — MeterList replaces them.',
      'No more than three series.',
      'No stacked bars for measures that do not sum to a real total.',
      'No Sparkline standing alone — it sits beside the figure that carries the value.',
      'No <code>highlight</code> standing in for interaction — a chart that only tells the truth on hover has failed C8.',
    ],
    faq: [
      { q: 'Which colors do series use?', a: 'tone: "seed" (current), "compare" (line-gray #D6DAE0, the one aliased non-token color), or "faint" for secondary bars. There is no palette to pick from — the convention is the palette.' },
      { q: 'Why no chart library?', a: 'A flat line on hairlines is ~60 lines of SVG. A library would add a dependency, its own theme system to fight, and animation defaults that violate the firewall.' },
      { q: 'How do users get exact values?', a: 'Pair the card with a "View data" text-link action in the CardHead that opens the underlying table — decision-critical numbers always exist as text somewhere.' },
      { q: 'Did the x labels move in v0.4.0?', a: 'Yes, and it was a fix. <code>.sv-trend__x</code> went from <code>space-between</code> to a real column grid of <code>xLabels.length</code> equal columns, matching the columns the bars are centred in. Under space-between only the first and last label ever sat on their bar; every label between them drifted, and the more labels a chart had the further off they were.' },
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
      {
        title: 'A row near capacity',
        description: 'There is no red "danger" fill (A2) — a zone about to run out carries its warning in words inside the mandatory absolute-numbers subtitle, which is exactly what a screen reader hears too.',
        demoKey: 'meter-critical',
        code: `<MeterList
  items={[
    { label: 'Zone A · ambient', current: 4630, max: 4700, value: '99%',
      subtitle: '4,630 of 4,700 — only 70 positions left, reorder space now' },
    { label: 'Zone B · chilled', current: 1180, max: 1600, value: '74%',
      subtitle: '1,180 of 1,600 pallet positions' },
    { label: 'Zone C · bonded', current: 410, max: 900, value: '46%',
      subtitle: '410 of 900 pallet positions' },
  ]}
/>`,
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

  /* =============================================================== B44 */
  {
    slug: 'distribution-strip',
    name: 'DistributionStrip',
    book: 'B44',
    category: 'widgets',
    tagline: 'One total divided into its shares: a 10px strip with structural seams and a legend that prints every figure.',
    job: 'Answer "what share is each part."',
    tags: ['distribution', 'share', 'part-to-whole', 'composition', 'donut-replacement', 'legend', 'strip'],
    exports: ['DistributionStrip'],
    files: ['components/seventy-six/distribution-strip.tsx', 'components/seventy-six/distribution-strip.css'],
    intro: [
      'A2 bans donut, pie, radial and gauge charts. Until now the Book answered "use B6 MeterList", but that is a different question. <b>B6 measures each part against ITS OWN maximum</b> — utilization, "Zone A is 92% full". <b>B44 divides ONE total into its shares</b> — "46% of 128,953 sessions were mobile". Every donut a team has ever drawn was asking B44\'s question and being handed B6\'s answer.',
      'The anatomy is fixed: a B4-voiced value line (mono label left, the 19/700 tabular total right), one 10px strip, and a legend beneath it. Segments are parted by a 2px <code>--sv-paper</code> seam, and that seam is structure rather than decoration — a gradient is banned (A1), so the seam is the only thing making the parts read as parts instead of one continuous smear. Four tones run in fixed order — seed, compare, ink-faint, and <code>--sv-field-line-strong</code>, which is the last step that is still visibly a fill; the hairline stays a rule, because a part of the total nobody can see is a part that was not stated. A fifth part reuses the fourth tone, which is the component saying the list should have ended at "Other".',
      'The legend is <b>the data</b>. It repeats every figure as text, which is why the strip itself is <code>role="img"</code> illustration and nothing is carried by colour or width alone (C5). B6\'s rule is inherited whole: <b>an absolute figure sits beside every percentage, because a percentage alone is a defect</b>. "46%" states nothing until "59,318 · 46%" says how many.',
      '<code>total</code> defaults to the sum of the parts. Pass it when the parts are a subset of something larger — the top three queues out of all of them — and the wall shows through for the remainder. A strip whose parts do not reach its stated total is legal only when the label and the <code>ariaLabel</code> say so.',
    ],
    examples: [
      {
        title: 'Device share of one session total',
        description: 'The four parts sum to the total, so no total is passed. Each legend row prints the count and the share — the strip could be deleted and the card would still answer the question.',
        demoKey: 'dist-basic',
        surface: 'paper',
        code: `import { DistributionStrip } from '@/components/seventy-six';

<DistributionStrip
  label="DEVICES ACCESSED · JULY"
  ariaLabel="128,953 sessions: mobile 46%, desktop 31%, tablet 15%, other 8%"
  parts={[
    { label: 'Mobile', value: 59318 },
    { label: 'Desktop', value: 39975 },
    { label: 'Tablet', value: 19343 },
    { label: 'Other', value: 10317 },
  ]}
/>`,
      },
      {
        title: 'Parts that are a subset of the total',
        description: 'The three named queues hold 3,180 of 4,720 tickets. <code>total</code> becomes the denominator, the unclaimed third stays wall, and the ariaLabel states the shortfall in words rather than leaving the gap to be inferred from a width.',
        demoKey: 'dist-partial',
        surface: 'paper',
        code: `<DistributionStrip
  label="OPEN TICKETS · TOP THREE QUEUES"
  ariaLabel="Three queues hold 3,180 of 4,720 open tickets: billing 33%, shipping 21%, returns 13%; the remaining 1,540 are spread across nine smaller queues"
  total={4720}
  parts={[
    { label: 'Billing', value: 1540 },
    { label: 'Shipping', value: 1010 },
    { label: 'Returns', value: 630 },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'DistributionStrip',
        rows: [
          { name: 'ariaLabel', type: 'string', description: 'REQUIRED. The whole division stated in words, total included.' },
          { name: 'label', type: 'string', description: 'Mono uppercase name for the total, e.g. "DEVICES ACCESSED".' },
          { name: 'parts', type: 'DistributionPart[]', description: '{ label, value } — five at most; the fifth reuses the fourth tone.' },
          { name: 'total', type: 'number', defaultValue: 'sum of parts', description: 'The denominator. Pass it when the parts are a subset; the remainder shows as wall.' },
          { name: 'format', type: '(value: number) => string', defaultValue: 'grouped integer', description: 'Formats the total and every absolute figure. Resolved per call, never at module scope.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The strip is <code>role="img"</code> with the takeaway as its label — one reading of the division, not four segment announcements.',
        'The legend is an ordinary list under it, so every name and figure is read as text whether or not the illustration is. Swatches are <code>aria-hidden</code>: colour never carries a part (C5).',
        '<code>tabular-nums</code> on the total and on every legend figure, per A4.',
      ],
    },
    donts: [
      'No sixth part — five rows is the ceiling, and beyond it the answer is a B7 DataTable.',
      'No stack of strips comparing periods; parts of one total over time are B5 <code>kind="stacked"</code>.',
      'No strip whose parts do not sum to the stated total without saying so in the label and the ariaLabel.',
      'No hand-picked colour per part — the four tones run in order (Law 2).',
      'No bending it into a ring. That is the chart this component exists to replace.',
    ],
    faq: [
      { q: 'Why not just a donut, everyone reads them?', a: 'They do not. Angle is the least accurately judged visual channel there is, so two slices of similar size are guesswork and the reader falls back on the printed labels — at which point the ring is decoration wrapped around a legend. A 10px strip plus the printed figures is both smaller and exact.' },
      { q: 'What about a single percentage?', a: 'That is B4 Progress — one value against one target. A strip with one segment is a bar with extra steps.' },
      { q: 'MeterList or DistributionStrip?', a: 'Does each item have its own ceiling? B6. Do the items divide one number between them? B44. "Zone A is 92% full" is B6; "mobile is 46% of sessions" is B44.' },
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
    tags: ['table', 'data-grid', 'keyboard-navigation', 'sorting', 'selection', 'bulk-actions', 'filters', 'pagination', 'erp'],
    exports: ['DataTable', 'SelectionHead', 'FilterLine', 'FilterBar'],
    files: ['components/seventy-six/data-table.tsx', 'components/seventy-six/data-table.css'],
    intro: [
      'Column headers are Fragment Mono 9.5 uppercase; cells are 13/500 with 10.5px vertical padding; IDs render in mono soft; numeric columns are right-aligned, tabular, 600. Rows hover in seed-tint; a selected row adds the system\'s only 2px left rule. The last row is unruled.',
      'Column <code>kind</code> does the type discipline for you: <code>id</code> gets mono, <code>num</code> gets right/tabular, <code>status</code> expects a StatusWord. Sorting is the caller\'s job — the table renders <code>aria-sort</code> and header buttons, your code reorders the rows.',
      'On narrow screens the table scrolls horizontally inside its card. It never reflows into stacked blobs, and the header row never disappears.',
      '<b>v0.4.0 closes the table\'s missing half</b> — what a selection DOES, and how filter state is shown. <b>SelectionHead</b> replaces the CardHead in place while rows are selected: mono count, the verbs, "Clear". No floating action bar and no new z-index, because the card\'s own header already owns that row. <b>FilterLine</b> states the active filters as one mono line of running text with a single "Clear all", and that line doubles as the <code>aria-live</code> announcement — no chips, no pills, because B23 Badge stays category-only and non-dismissible.',
      '<b>FilterBar</b> closes the third side of that row, and the division of labour is exact: <b><code>CardTabs</code> switches between mutually exclusive presets · <code>FilterBar</code> sets the filters · <code>FilterLine</code> states what is set.</b> A card may carry all three, in that order, and each does one of the three jobs — a control that does two of them is the defect. FilterBar itself is a layout with slots, not a filter engine: it takes a SearchField and at most three Selects or Comboboxes in <code>controls</code>, anything that is not a filter in <code>actions</code>, and your code owns every value. It is <code>role="group"</code> with an <code>aria-label</code>, deliberately NOT <code>role="search"</code>, because this filters a set in place and does not search a site. It holds no live region either, because the announcement is FilterLine\'s job and two live regions for one change is a defect. It wraps when it runs out of room and never scrolls — a horizontally scrolling filter row hides the filters it is offering — and "Clear all" appears only when <code>active</code> says something is actually set.',
      '<b>v0.6 adds the closing row and the held column.</b> <code>totals</code> renders a real <code>&lt;tfoot&gt;</code> keyed to the same columns — which matters because the only way to draw a totals row before this was to push a fake record into <code>rows</code>, where ↑/↓ focuses it, Space selects it, <code>onRowOpen</code> opens it and <code>page.of</code> counts it. Four lies for one row. Foot cells inherit each column\'s own <code>kind</code>, so a <code>num</code> column\'s total is right-aligned and tabular exactly as its body cells are.',
      '<code>leadHold</code> holds the identity column in place while the rest of a wide table scrolls under it — at column seven of a fourteen-column line table, the reader has otherwise lost which line they are on. <b>It is self-limiting, and that is what keeps F3 refused:</b> it is not caller-configurable per column, not draggable, and it applies to the first column ONLY when that column is already declared <code>kind: "id"</code>, which is the row identity B7 already names. Pass it on a table whose first column is anything else and it is ignored. F3 protects against a table whose shape the reader rearranges; this lets the reader rearrange nothing.',
    ],
    examples: [
      {
        title: 'A document\'s closing figures',
        description: 'Subtotal, tax and total in a real <tfoot> — outside the row, focus, selection and pagination models.',
        demoKey: 'table-totals',
        code: `<DataTable
  caption="Purchase order lines"
  rows={lines}
  rowKey={(l) => l.sku}
  columns={columns}
  totals={[
    { label: 'SUBTOTAL', cells: { total: '$18,240.00' } },
    { label: 'VAT 20%', cells: { total: '$3,648.00' } },
    { label: 'TOTAL DUE', cells: { total: '$21,888.00' }, strong: true },
  ]}
/>`,
      },
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
      {
        title: 'Selection driving a bulk action',
        description: 'Selection is controlled — hold a Set in state, pass onSelect, and let the count drive both the live announcement and a bulk action in the CardHead. Space toggles a row, ⇧Space extends the range.',
        demoKey: 'table-select',
        code: `const [selected, setSelected] = useState<Set<string>>(new Set());
const count = selected.size;

<Card>
  <CardHead
    title="Draft invoices"
    subtitle="July · unsent"
    action={
      <ButtonLink href="#" onClick={() => sendInvoices(selected)}>
        {count > 0 ? \`Send \${count}\` : 'Send selected'}
      </ButtonLink>
    }
  />
  <DataTable
    caption="Draft invoices"
    rows={draftInvoices}
    rowKey={(r) => r.id}
    selectable
    selected={selected}
    onSelect={setSelected}
    announcement={\`\${count} of \${draftInvoices.length} invoices selected\`}
    columns={[
      { key: 'id', header: 'INVOICE', kind: 'id', render: (r) => r.id },
      { key: 'customer', header: 'CUSTOMER', render: (r) => r.customer },
      { key: 'total', header: 'TOTAL', kind: 'num', render: (r) => r.total },
    ]}
  />
</Card>`,
      },
      {
        title: 'The selection head and the stated filter line',
        description: 'Selecting rows swaps the head in place. Filters state themselves in one mono line — never as chips.',
        demoKey: 'table-selection',
        code: `{count > 0 ? (
  <SelectionHead
    count={count}
    noun="invoice"
    onClear={() => setSelected(new Set())}
    actions={
      <>
        <Button variant="ghost" onClick={() => send(selected)}>Send {count}</Button>
        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
      </>
    }
  />
) : (
  <CardHead title="Draft invoices" subtitle="July · unsent" />
)}

<FilterLine
  count="12 of 248"
  filters={[{ label: 'Status', value: 'Draft' }, { label: 'Period', value: 'July' }]}
  onClearAll={clearFilters}
/>`,
      },
      {
        title: 'The whole stack: set, stated, applied',
        description: 'FilterBar sets the filters, FilterLine states what is set and announces the change, the table shows the result. Three components, three jobs, one direction of travel.',
        demoKey: 'filterbar-basic',
        code: `import { FilterBar, FilterLine, DataTable, SearchField, Select, Popover } from '@/components/seventy-six';

const active = query !== '' || status !== 'all';

<Card>
  <CardHead title="Orders" subtitle="July · warehouse A" />
  <FilterBar
    label="Filter orders"
    active={active}
    onClearAll={clearFilters}
    controls={
      <>
        <SearchField
          label="Search orders"
          labelHidden
          placeholder="Search orders"
          value={query}
          onValueChange={setQuery}
        />
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="hold">On hold</option>
        </Select>
      </>
    }
    actions={
      <Popover label="Saved views" ariaLabel="Saved views" align="end">
        <Radio name="view" label="Everything open" defaultChecked />
        <Radio name="view" label="Awaiting my approval" />
      </Popover>
    }
  />
  <FilterLine
    count={\`\${filtered.length} of 248\`}
    filters={[{ label: 'Status', value: 'Pending' }, { label: 'Period', value: 'July' }]}
    onClearAll={clearFilters}
  />
  <DataTable caption="Open orders" rows={filtered} rowKey={(o) => o.id} columns={columns} />
</Card>`,
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
          { name: 'totals', type: 'TotalsRow[]', description: 'v0.6 · a real <code>&lt;tfoot&gt;</code>: { label, cells (keyed by column key), strong? }. Outside the row, focus, selection and pagination models.' },
          { name: 'leadHold', type: 'boolean', description: 'v0.6 · holds the first column while the rest scrolls. IGNORED unless that column is <code>kind: "id"</code>.' },
        ],
      },
      {
        component: 'SelectionHead',
        rows: [
          { name: 'count', type: 'number', description: 'Selected rows. Rendered mono and tabular.' },
          { name: 'noun', type: 'string', description: 'The object, singular ("invoice") — pluralised for the count.' },
          { name: 'onClear', type: '() => void', description: 'Backs the always-present "Clear" action.' },
          { name: 'actions', type: 'ReactNode', description: 'The verbs, as Buttons. Keep to three; the fourth belongs in a Menu (B20).' },
        ],
      },
      {
        component: 'FilterLine',
        rows: [
          { name: 'filters', type: 'ActiveFilter[]', description: '{ label, value } pairs, rendered as running mono text.' },
          { name: 'onClearAll', type: '() => void', description: 'The single clear affordance — filters are not individually dismissible.' },
          { name: 'count', type: 'string', description: 'Optional lead, e.g. "12 of 248". Rendered first, tabular.' },
        ],
      },
      {
        component: 'FilterBar',
        rows: [
          { name: 'controls', type: 'ReactNode', description: 'The filters themselves — a SearchField, then at most three Selects or Comboboxes.' },
          { name: 'actions', type: 'ReactNode', description: 'Anything that is not a filter: a saved-view Popover, an export Button.' },
          { name: 'active', type: 'boolean', defaultValue: 'false', description: 'Is anything actually set. "Clear all" exists only when it is true.' },
          { name: 'onClearAll', type: '() => void', description: 'Backs that single "Clear all"; individual controls are cleared by their own empty value.' },
          { name: 'label', type: 'string', defaultValue: "'Filters'", description: 'The group\'s aria-label. Name the set: "Filter orders".' },
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
      'No floating bulk-action bar — the selection head swaps the card head in place.',
      'No dismissible filter chips; filters state themselves in one line with one "Clear all".',
      'No dimension in both a FilterBar control and a CardTab — the reader cannot tell which one won.',
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
      {
        title: 'Counts on each tab',
        description: 'In filters mode each tab carries a mono count of what it holds, so the numbers are visible before you click. The count derives from the same data the filter narrows — one source of truth, no drift.',
        demoKey: 'cardtabs-counts',
        code: `const [filter, setFilter] = useState('all');
const filtered = filter === 'all' ? invoices : invoices.filter(byStatus(filter));

<Card>
  <CardHead title="Invoices" subtitle="July · receivables" />
  <CardTabs
    mode="filters"
    tabs={[
      { id: 'all', label: 'All', count: invoices.length },
      { id: 'paid', label: 'Paid', count: 2 },
      { id: 'due', label: 'Due', count: 2 },
      { id: 'overdue', label: 'Overdue', count: 1 },
    ]}
    active={filter}
    onChange={setFilter}
  />
  {/* table filtered by \`filter\`, announcing \`\${filtered.length} · \${filter}\` */}
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
      {
        title: 'A CRM pipeline feed',
        description: 'Same widget, a different domain: deals, contacts, and amounts are the bold entities in a sales feed. The timestamps stay absolute and the sentence still reads like a colleague\'s note — no avatars, no coloured event types.',
        demoKey: 'activity-relative',
        code: `<ActivityList
  items={[
    { time: '15:12', dateTime: '2026-07-24T15:12:00+03:00',
      children: <><b>Acme Corp</b> deal moved to <b>Negotiation</b> — $48K</> },
    { time: '13:40', dateTime: '2026-07-24T13:40:00+03:00',
      children: <><b>Priya Nair</b> booked a demo for <b>Northwind</b></> },
    { time: '11:26', dateTime: '2026-07-24T11:26:00+03:00',
      children: <><b>Deka Wholesale</b> replied — awaiting a revised quote</> },
  ]}
/>`,
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

  /* ================================================================ B55 */
  {
    slug: 'sum-list',
    name: 'SumList',
    book: 'B55',
    category: 'widgets',
    tagline: 'The amount block — a set of charges and the figure they add up to.',
    job: 'State a set of amounts and the figure they add up to.',
    tags: ['sum', 'total', 'invoice', 'checkout', 'billing', 'amounts', 'subtotal', 'tax'],
    exports: ['SumList'],
    files: ['components/seventy-six/sum-list.tsx', 'components/seventy-six/sum-list.css'],
    intro: [
      'It is <b>B44 DistributionStrip\'s arithmetic sibling, and the pairing is the point: B44 divides ONE total into its shares; SumList builds ONE total from its lines.</b> B44 starts with 128,953 sessions and asks how they split; this starts with a line total, a discount, a tax and a carriage charge and asks what the reader owes. They share a voice on purpose — mono label left, pre-formatted figure right, the closing figure at B4\'s 19/700 step — because they are the same arithmetic read in opposite directions.',
      '<b>The boundary against B7, because someone will otherwise use the wrong one.</b> Inside a table the closing figures are B7\'s <code>totals</code>: a real <code>&lt;tfoot&gt;</code> keyed to the table\'s own columns, which the browser repeats at the foot of every printed page. SumList is that block wherever it sits <i>outside</i> a table. The test is not where it looks right — it is whether the amounts belong to the table\'s columns. A line total does. Shipping, a discount and tax belong to the <b>document</b>, and have no column to sit in.',
      '<b>It never computes.</b> Every amount is a pre-formatted string the caller supplies (C9), the currency symbol and the minus sign on a discount included. A component that adds up the numbers it was handed is a component that can disagree with the invoice, and the invoice is the document of record.',
    ],
    examples: [
      {
        title: 'The amount due',
        description: 'Line total, discount, tax, deposit — and the one figure the reader came for.',
        demoKey: 'sum-basic',
        surface: 'paper',
        code: `import { SumList } from '@/components/seventy-six';

<SumList
  rows={[
    { label: 'LINE TOTAL', amount: '$25,600.00' },
    { label: 'DISCOUNT', amount: '\u2212$1,280.00', note: '5% agreed rate' },
    { label: 'VAT 20%', amount: '$4,864.00', note: '20% of $24,320.00' },
    { label: 'DEPOSIT RECEIVED', amount: '\u2212$7,296.00', note: '19 JUN 2026' },
    { label: 'BALANCE DUE', amount: '$21,888.00', strong: true },
  ]}
/>`,
      },
    ],
    props: [
      {
        component: 'SumList',
        rows: [
          { name: 'rows', type: 'SumRow[]', description: 'label (mono uppercase) · amount (PRE-FORMATTED) · optional note · optional strong.' },
          { name: 'rows[].strong', type: 'boolean', description: 'The closing figure: stronger rule above it, 700 figures, a larger step. One per list.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'A real <dl>, so each label is announced with its own amount as one pair.',
        'Amounts are tabular (A4) and pre-formatted by the caller, because C9 puts number formatting at the localization layer.',
        'Nothing is aria-hidden: every mark on screen is also information.',
        'It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).',
      ],
    },
    donts: [
      'Never computes a sum — a component that adds up its own inputs can disagree with the document of record.',
      'Never a currency symbol the caller did not supply, and never a minus sign the component invented.',
      'Never inside a table; that is B7 totals, keyed to the table\'s own columns.',
      'Never more rows than a reader can check by eye — a dozen charges is a DataTable of charges.',
      'Never two closing figures: a set with two has not closed.',
    ],
    faq: [
      { q: 'SumList or DataTable totals?', a: 'Does the amount belong to one of the table\'s columns? A line total does, and is a <tfoot> row. Shipping, tax and a discount belong to the document and have no column, so they are a SumList outside the table.' },
      { q: 'Why must I format the amounts?', a: 'C9 puts number and currency formatting at the localization layer. A component that formats has picked a locale and a currency for you, and it will be the wrong one somewhere.' },
    ],
  },
];
