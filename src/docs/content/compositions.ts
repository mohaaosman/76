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
    slug: 'marketing-home',
    kind: 'template',
    name: 'Public home',
    seed: 'cobalt',
    tagline: 'The public surface — a masthead, figures, columns, one ask.',
    description: [
      'The marketing SHELL is B1 with its product nav removed: the band keeps the wordmark and the right cluster, carries marketing links instead of app sections, and has no sub-tab row, because a public page has no section to sub-divide. Below 1000px <b>BandNav</b> swaps itself for the left drawer exactly as it does in the product, so the public surface inherits the 320px floor rather than re-solving it.',
      'Nothing on the page is an image. <b>Masthead</b> (B47) opens it, <b>ProofRow</b> (B50) states the figures, <b>FeatureList</b> (B48) itemises the claim on hairlines, the FAQ is the B27 <b>Accordion</b> rather than a new widget, and <b>CallToAction</b> (B49) closes on the same ink the page opened under. F11 refuses the photography and A2 refuses the stock-photo card, so type, hairline and real figures carry it.',
    ],
    tags: ['marketing', 'landing', 'public', 'home', 'hero', 'cobalt'],
    file: 'templates/marketing-home.tsx',
    deps: ['band', 'sheet', 'masthead', 'proof-row', 'feature-list', 'accordion', 'cta', 'site-footer', 'prose', 'button'],
  },
  {
    slug: 'pricing-page',
    kind: 'template',
    name: 'Pricing',
    seed: 'cobalt',
    tagline: 'Pricing as a DataTable — no tier cards, no "Most popular" pill.',
    description: [
      'Three tier cards state each plan in isolation, hide what a plan lacks by leaving it out, and put three seed-coloured primaries on one screen — which A2 refuses, because a view region gets one. What a buyer is doing is comparing a set of records on shared columns, and that has been <b>B7 DataTable</b> since v0.1.0.',
      'The plan is the COLUMN and the capability is the ROW, so the eye compares down a column and reads across a row, and every capability is stated for every plan. <b>CardTabs</b> filter which capabilities are shown — never which plans, because hiding two of three is exactly what the card row does. One primary sits beneath the table, and C7 governs the floor: the table scrolls inside its card and never truncates.',
    ],
    tags: ['marketing', 'pricing', 'plans', 'public', 'table', 'cobalt'],
    file: 'templates/pricing-page.tsx',
    deps: ['band', 'sheet', 'card', 'data-table', 'card-tabs', 'masthead', 'accordion', 'cta', 'site-footer', 'prose', 'button'],
  },
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
  {
    slug: 'analytics-overview',
    kind: 'template',
    name: 'Analytics overview',
    seed: 'cobalt',
    tagline: 'A marketing analytics screen — and the donut it refuses to draw.',
    description: [
      'The screen every analytics product ships, built on 76° terms: a four-up stat row whose figures reconcile with each other, a daily-takings <b>Trend</b> whose peak column is <i>printed</i> rather than waiting for a pointer, and wall-level <b>Tabs</b> that switch the analysis underneath while the KPIs stay put.',
      'The donut is the point. Where the reference design put a ring with a number in the hole, this puts a <b>DistributionStrip</b> (B44) — one 10px bar and a legend that prints every count and every share. A2 bans the donut; B44 is the component that finally answers the question the donut was asked. The table below it carries the full filter stack in order: <b>FilterBar</b> sets, <b>FilterLine</b> states, the table shows.',
    ],
    tags: ['analytics', 'dashboard', 'marketing', 'reporting', 'cobalt'],
    file: 'templates/analytics-overview.tsx',
    deps: ['band', 'sheet', 'card', 'stat-s1', 'trend', 'card-tabs', 'distribution-strip', 'tabs', 'tree-list', 'timeline', 'stepper', 'meter-list', 'data-table', 'status-word', 'search-field', 'field', 'menu', 'avatar', 'button'],
  },
  {
    slug: 'auth-sign-in',
    kind: 'template',
    name: 'Sign in',
    seed: 'cobalt',
    tagline: 'The credential screen: three providers, the form, and one seed button.',
    description: [
      'Rides the <b>Split</b> (B46): the <b>Plate</b> (B24) unchanged — wall, one centred card, the mono wordmark, no navigation to leave by — with an ink panel beside it carrying REAL 76° parts on live figures. Never a screenshot and never an illustration: F11 and A2 do not loosen because the image moved next to the form. Three stacked <b>SocialButton</b>s sit above a hairline "or" rule, then email and password on the B11 timing contract.',
      'A refused sign-in states itself twice, both in the layout: a <b>Banner</b> above the form says what failed and what to do, and each field carries its own error. Never a toast — the browser\'s own validation bubbles are refused for the same reason.',
    ],
    tags: ['auth', 'sign-in', 'login', 'split', 'plate', 'cobalt'],
    file: 'templates/auth-sign-in.tsx',
    deps: ['split', 'plate', 'social-button', 'field', 'button', 'banner'],
  },
  {
    slug: 'auth-stacked',
    kind: 'template',
    name: 'Sign in · stacked band',
    seed: 'cobalt',
    tagline: 'The other Split orientation — ink across the top, the card over its edge.',
    description: [
      'The same screen as <b>Sign in</b> on <code>orientation="stacked"</code>: the page is cut top/bottom instead of left/right, and the card sits centred on the horizontal seam. This is the orientation closest to the dashboard row the move comes from — B2 pulls the stat cards over the band edge, and a <b>Plate</b> has no Sheet to do that in, so B46 does it as a page type.',
      'Which orientation a product picks is one prop, not two codebases. Neither half carries anything to read, so neither needs a fallback: below 1000px <code>side</code> simply becomes <code>stacked</code>, because a vertical seam behind a card grown to the full width is a seam nobody can see. The card stays centred at every width, so it never stops straddling.',
    ],
    tags: ['auth', 'sign-in', 'split', 'stacked', 'overlap', 'cobalt'],
    file: 'templates/auth-stacked.tsx',
    deps: ['split', 'plate', 'social-button', 'field', 'button', 'banner'],
  },
  {
    slug: 'auth-sign-up',
    kind: 'template',
    name: 'Create account',
    seed: 'cobalt',
    tagline: 'Registration — the password rule stated up front, no strength meter.',
    description: [
      'The sign-in anatomy with a third field: <b>Plate</b> (B24), band-less, providers over a hairline "or" rule, then name, work email, and password. F7 is in force — the length rule is the field\'s hint, and a miss is an inline error naming how many characters are short.',
      'Terms read as running copy under the one primary, not a tick-box. Failures render inline through <b>Banner</b> + field chrome, never as toasts.',
    ],
    tags: ['auth', 'sign-up', 'registration', 'split', 'plate', 'cobalt'],
    file: 'templates/auth-sign-up.tsx',
    deps: ['split', 'plate', 'social-button', 'field', 'button', 'banner'],
  },
  {
    slug: 'auth-forgot',
    kind: 'template',
    name: 'Forgot password',
    seed: 'cobalt',
    tagline: 'Request a reset link, with the same answer for every address.',
    description: [
      'One <b>Plate</b> (B24) carrying two states: the single-field request, and the sent state, whose head names the window and whose copy says where to look before resending. The answer is identical whether or not the address has an account — no enumeration leak.',
      'The only failure, a malformed address, renders where it happened: a <b>Banner</b> above the form plus the field\'s own error. No toast, and no browser bubble.',
    ],
    tags: ['auth', 'password-reset', 'forgot-password', 'split', 'plate', 'cobalt'],
    file: 'templates/auth-forgot.tsx',
    deps: ['split', 'plate', 'field', 'button', 'banner'],
  },
  {
    slug: 'auth-reset',
    kind: 'template',
    name: 'Reset password',
    tagline: 'Set a new password from a link — or state that the link is dead.',
    description: [
      'Seed-neutral. Two conditions on the same band-less <b>Plate</b> (B24): the new-password pair with the rule stated as a hint (F7 refuses the strength meter), and the expired-link plate, which drops the form and keeps one primary that sends a fresh link.',
      'A rule miss or a mismatch renders in a <b>Banner</b> at the top of the card and again on the field that failed — the pair is re-checked together, and nothing is announced as a toast.',
    ],
    tags: ['auth', 'password-reset', 'new-password', 'split', 'plate'],
    file: 'templates/auth-reset.tsx',
    deps: ['split', 'plate', 'field', 'button', 'banner'],
  },
  {
    slug: 'auth-verify',
    kind: 'template',
    name: 'Verify email',
    tagline: 'A six-digit code, judged on submit.',
    description: [
      'Seed-neutral. A <b>PinField</b> (B25) on the band-less <b>Plate</b> (B24), under a mono line naming the address the code went to. The code is judged on the primary, never mid-entry, and editing a rejected code clears the verdict.',
      'A short or wrong code states itself in a <b>Banner</b> at the top of the card and in the field, which borders every box bad — the code is wrong as a unit. The resend action stays visible while its cooldown counts down in tabular figures; no toast, ever.',
    ],
    tags: ['auth', 'otp', 'verification-code', 'pin-field', 'split', 'plate'],
    file: 'templates/auth-verify.tsx',
    deps: ['split', 'plate', 'pin-field', 'button', 'banner'],
  },
  {
    slug: 'auth-invite',
    kind: 'template',
    name: 'Accept invitation',
    seed: 'cobalt',
    tagline: 'Join a workspace, on a named invitation.',
    description: [
      'A band-less <b>Plate</b> (B24) that first states who invited whom, to what — an invitation with no author is a phish. A new account gets name and password on the B11 contract; an address that already has one gets no fields at all, because the decision is the form.',
      'Both paths keep the one primary that names its object, and both report failure inline via <b>Banner</b> + field chrome rather than a toast.',
    ],
    tags: ['auth', 'invitation', 'onboarding', 'split', 'plate', 'cobalt'],
    file: 'templates/auth-invite.tsx',
    deps: ['split', 'plate', 'field', 'button', 'banner'],
  },
];

export const compositions: Composition[] = [...blocks, ...templates];
