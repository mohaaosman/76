/**
 * Composition model — PURE DATA (no React). Blocks and templates are
 * compositions of the widget taxonomy; the same entries feed the gallery
 * pages, the shadcn registry (registry:block), and llms.txt. Live previews
 * are looked up separately by slug in ../compositions.tsx.
 */
export type CompositionKind = 'block' | 'template';
export type Seed = 'cobalt' | 'verdigris' | 'signal';

export interface Composition {
  slug: string;
  kind: CompositionKind;
  name: string;
  /** Template seed via <html data-seed>. Omit for blocks / neutral screens. */
  seed?: Seed;
  /** One line: what it is. */
  tagline: string;
  /** Prose paragraphs (support <b> and <code>). */
  description: string[];
  tags: string[];
  /** Source file relative to src/, e.g. "blocks/stats-row.tsx". */
  file: string;
  /** 76° registry items it composes (direct). tokens is always implied. */
  deps: string[];
}

export const blocks: Composition[] = [
  {
    slug: 'stats-row',
    kind: 'block',
    name: 'Stats row',
    tagline: 'The four-up S1 row that overlaps the band on every overview.',
    description: [
      'Four <b>StatS1</b> cards in the <code>stats</code> split — the canonical KPI row. Each answers "how much, and so what": a mono label, a signed delta, the tabular value, and a footnote that earns its line with new information.',
    ],
    tags: ['kpi', 'stats', 'overview', 'dashboard'],
    file: 'blocks/stats-row.tsx',
    deps: ['sheet', 'stat-s1'],
  },
  {
    slug: 'trend-panel',
    kind: 'block',
    name: 'Trend panel',
    tagline: 'A card with in-card range filters and a two-series trend.',
    description: [
      'A <b>Trend</b> inside a card with <b>CardTabs</b> range filters. Seed line is this period, line-gray is the last — no legend needed, no area fills, no donuts.',
    ],
    tags: ['trend', 'chart', 'time-series', 'filters'],
    file: 'blocks/trend-panel.tsx',
    deps: ['sheet', 'card', 'card-tabs', 'trend'],
  },
  {
    slug: 'table-view',
    kind: 'block',
    name: 'Table view',
    tagline: 'A filtered, paginated data table with a card head action.',
    description: [
      'The workhorse: <b>DataTable</b> with mono IDs, dot+word statuses, right-aligned tabular numbers, in-card filter tabs, an export action, and a pagination line. Full keyboard contract comes from the component.',
    ],
    tags: ['table', 'data', 'filters', 'pagination'],
    file: 'blocks/table-view.tsx',
    deps: ['sheet', 'card', 'card-tabs', 'data-table', 'status-word', 'button'],
  },
  {
    slug: 'activity-panel',
    kind: 'block',
    name: 'Activity panel',
    tagline: 'A timestamped feed with bold entities.',
    description: [
      'An <b>ActivityList</b> in a card: a mono timestamp column and sentences whose entities are bold. Absolute time, as ERP contexts require.',
    ],
    tags: ['activity', 'feed', 'timeline', 'audit'],
    file: 'blocks/activity-panel.tsx',
    deps: ['sheet', 'card', 'activity-list'],
  },
  {
    slug: 'meter-panel',
    kind: 'block',
    name: 'Meter panel',
    tagline: 'Part-by-part utilization — the donut replacement.',
    description: [
      'A <b>MeterList</b> in a card: label, bold value, a 3px bar, and a required absolute-numbers subtitle ("4,320 of 4,700 pallet positions"). This is what replaces every donut in 76°.',
    ],
    tags: ['meter', 'utilization', 'capacity', 'progress'],
    file: 'blocks/meter-panel.tsx',
    deps: ['sheet', 'card', 'meter-list'],
  },
  {
    slug: 'empty-screen',
    kind: 'block',
    name: 'Empty screen',
    tagline: 'A calm empty state with exactly one action.',
    description: [
      'An <b>EmptyState</b> in a card: a factual sentence saying what would appear here and why it is empty, plus exactly one primary action that names its object. No shrugging illustrations, no "Oops".',
    ],
    tags: ['empty-state', 'zero-data', 'onboarding'],
    file: 'blocks/empty-screen.tsx',
    deps: ['sheet', 'card', 'empty-state', 'button'],
  },
  {
    slug: 'dashboard-header',
    kind: 'block',
    name: 'Dashboard header',
    tagline: 'The ink band: topbar, sub-tabs, and page hero.',
    description: [
      'The chrome, by itself: <b>Band</b> + <b>BandTopbar</b> + horizontal <b>BandNav</b> + <b>BandSubTabs</b> + <b>PageHero</b>. All navigation and page context in one ink zone; the paper below is 100% work.',
    ],
    tags: ['band', 'header', 'navigation', 'chrome'],
    file: 'blocks/dashboard-header.tsx',
    deps: ['band'],
  },
];

export const templates: Composition[] = [
  {
    slug: 'erp-dashboard',
    kind: 'template',
    name: 'ERP dashboard',
    seed: 'cobalt',
    tagline: 'A warehouse operations overview — the densest 76° screen.',
    description: [
      'The canonical ERP screen: ink band, a four-up stat row overlapping the band, an orders table beside an activity feed, and a utilization panel. Cobalt seed, instrumentation-first.',
    ],
    tags: ['erp', 'dashboard', 'operations', 'cobalt'],
    file: 'templates/erp-dashboard.tsx',
    deps: ['band', 'sheet', 'card', 'stat-s1', 'data-table', 'status-word', 'card-tabs', 'activity-list', 'meter-list', 'button'],
  },
  {
    slug: 'crm-pipeline',
    kind: 'template',
    name: 'CRM pipeline',
    seed: 'verdigris',
    tagline: 'A sales pipeline — stages, momentum, and deals.',
    description: [
      'Relationship-oriented: weighted-pipeline stats, per-stage progress, a momentum trend, and a top-deals table with an activity feed. Verdigris seed, same density discipline as ERP.',
    ],
    tags: ['crm', 'pipeline', 'sales', 'verdigris'],
    file: 'templates/crm-pipeline.tsx',
    deps: ['band', 'sheet', 'card', 'stat-s1', 'progress', 'trend', 'data-table', 'status-word', 'activity-list', 'button'],
  },
  {
    slug: 'pos-terminal',
    kind: 'template',
    name: 'POS terminal',
    seed: 'signal',
    tagline: 'A point-of-sale register — scaled up, touch-first.',
    description: [
      'Signal seed, scaled-up type and ≥48px targets. A cart table beside a large running total and two big actions. Minimal chrome; the numbers do the work.',
    ],
    tags: ['pos', 'retail', 'checkout', 'signal', 'touch'],
    file: 'templates/pos-terminal.tsx',
    deps: ['band', 'sheet', 'card', 'data-table', 'stat-s1', 'status-word', 'button'],
  },
  {
    slug: 'settings-account',
    kind: 'template',
    name: 'Settings',
    tagline: 'An account settings screen — the forms showcase as a page.',
    description: [
      'Seed-neutral. Sectioned cards of honest inputs: profile fields, notification toggles, a security section, and a save bar. The B11 form contract at full scale.',
    ],
    tags: ['settings', 'account', 'forms', 'preferences'],
    file: 'templates/settings-account.tsx',
    deps: ['band', 'sheet', 'card', 'field', 'button'],
  },
  {
    slug: 'ai-control-center',
    kind: 'template',
    name: 'AI agent control center',
    seed: 'cobalt',
    tagline: 'An ops console for a fleet of AI agents.',
    description: [
      'An ERP for agents: live fleet stats, a runs table beside an event feed, per-model usage meters, and a throughput trend. Cobalt seed, absolute timestamps, calm under load.',
    ],
    tags: ['ai', 'agents', 'observability', 'ops', 'cobalt'],
    file: 'templates/ai-control-center.tsx',
    deps: ['band', 'sheet', 'card', 'stat-s1', 'data-table', 'status-word', 'card-tabs', 'activity-list', 'meter-list', 'trend', 'button'],
  },
];

export const compositions: Composition[] = [...blocks, ...templates];
