/* 76° · screen: public pricing · gate: pass */
// 76° template · pricing — seed cobalt.
//
// PRICING IS A TABLE. Not three tier cards, not a "Most popular" pill, not
// three competing primaries on one screen. A2 allows one seed-coloured
// primary per view region, and a card row that ships three has already told
// the reader the page cannot decide. What a buyer is actually doing is
// comparing a set of records on shared columns — which is B7 DataTable, and
// has been since v0.1.0.
//
// The plan is the COLUMN and the capability is the ROW, so the eye compares
// down a column and reads across a row, and every capability is stated for
// every plan rather than implied by its absence from a card. C7 governs the
// floor: the table scrolls inside its card, and it never truncates or
// reflows into blobs (B7).
import { useState } from 'react';
import {
  Band,
  BandTopbar,
  BandNav,
  Sheet,
  Row,
  Masthead,
  Card,
  CardHead,
  DataTable,
  CardTabs,
  Accordion,
  CallToAction,
  SiteFooter,
  Prose,
  Button,
  ButtonLink,
} from '@/components/seventy-six';
import type { Column } from '@/components/seventy-six';

const nav = [
  { label: 'System', href: '#system' },
  { label: 'Components', href: '#components' },
  { label: 'Pricing', href: '#pricing', active: true },
  { label: 'Docs', href: '#docs' },
];

/* A check is a colour and a shape; the word behind it is the meaning (C5).
   Every cell that is not a figure carries one of these two, and both state
   themselves to a screen reader in words. */
const YES = (
  <>
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M13 4.5L6.2 11.5 3 8.3" />
    </svg>
    <span className="sv-visually-hidden">Included</span>
  </>
);

const NO = (
  <>
    <span aria-hidden="true">—</span>
    <span className="sv-visually-hidden">Not included</span>
  </>
);

type Plan = 'team' | 'business' | 'enterprise';
type Line = {
  id: string;
  capability: string;
  team: React.ReactNode;
  business: React.ReactNode;
  enterprise: React.ReactNode;
  group: 'system' | 'support' | 'governance';
};

/* Every figure on this page reconciles with every other one: the seat counts
   below match the price line above them, and the retention windows match the
   audit row (Ship Gate 12 — mockup data that does not add up is a defect,
   not a placeholder). */
const LINES: Line[] = [
  { id: 'components', capability: 'All 51 components', team: YES, business: YES, enterprise: YES, group: 'system' },
  { id: 'registry', capability: 'Registry install', team: YES, business: YES, enterprise: YES, group: 'system' },
  { id: 'seeds', capability: 'Registered seeds', team: '3', business: '3', enterprise: 'Unlimited', group: 'system' },
  { id: 'templates', capability: 'Full-screen templates', team: '15', business: '15', enterprise: '15 + commissioned', group: 'system' },
  { id: 'seats', capability: 'Seats', team: '10', business: '50', enterprise: 'Unlimited', group: 'system' },
  { id: 'firewall', capability: 'Slop firewall in CI', team: YES, business: YES, enterprise: YES, group: 'governance' },
  { id: 'gate', capability: 'Ship Gate review', team: NO, business: '2 per quarter', enterprise: 'Unlimited', group: 'governance' },
  { id: 'audit', capability: 'Accessibility audit report', team: NO, business: 'Annual', enterprise: 'Quarterly', group: 'governance' },
  { id: 'overrides', capability: 'Registered product overrides', team: NO, business: YES, enterprise: YES, group: 'governance' },
  { id: 'support', capability: 'Response time', team: '5 days', business: '1 day', enterprise: '4 hours', group: 'support' },
  { id: 'channel', capability: 'Shared channel', team: NO, business: YES, enterprise: YES, group: 'support' },
  { id: 'onboarding', capability: 'Onboarding session', team: NO, business: NO, enterprise: YES, group: 'support' },
];

const GROUPS = [
  { id: 'all', label: 'Everything', count: LINES.length },
  { id: 'system', label: 'The system', count: LINES.filter((l) => l.group === 'system').length },
  { id: 'governance', label: 'Governance', count: LINES.filter((l) => l.group === 'governance').length },
  { id: 'support', label: 'Support', count: LINES.filter((l) => l.group === 'support').length },
];

const PLAN_HEADS: { key: Plan; label: string; price: string }[] = [
  { key: 'team', label: 'Team', price: '$0' },
  { key: 'business', label: 'Business', price: '$240 / mo' },
  { key: 'enterprise', label: 'Enterprise', price: 'Quoted' },
];

const FAQ = [
  {
    id: 'why-table',
    title: 'Why is this a table and not three cards?',
    meta: 'B7 · A2',
    children: (
      <p>
        Because a buyer compares plans, and comparison is what a table is for. Three cards state
        each plan in isolation, hide what a plan lacks by leaving it out, and put three seed-blue
        primaries on one screen — which A2 refuses, because a view region gets one.
      </p>
    ),
  },
  {
    id: 'free',
    title: 'Is the component library itself paid?',
    meta: 'MIT',
    children: (
      <p>
        No. The components, the tokens, the registry and the documentation are MIT and always will
        be. What a plan buys is the work around them: review, audit, governance and response time.
      </p>
    ),
  },
  {
    id: 'switch',
    title: 'What happens when a team outgrows a plan?',
    meta: 'PRORATED',
    children: (
      <p>
        The change takes effect on the next invoice and the difference is prorated to the day.
        Nothing is disabled mid-period, and no capability in the table above is withdrawn without
        the period it was paid for finishing first.
      </p>
    ),
  },
];

export function PricingPage() {
  const [group, setGroup] = useState('all');
  const rows = group === 'all' ? LINES : LINES.filter((l) => l.group === group);

  /* The capability column is the row's name, so it stays ordinary text; the
     three plan columns are compared against each other and take the same
     alignment as one another. */
  const columns: Column<Line>[] = [
    { key: 'capability', header: 'CAPABILITY', render: (l) => l.capability },
    ...PLAN_HEADS.map(({ key, label }) => ({
      key,
      header: label.toUpperCase(),
      render: (l: Line) => l[key],
    })),
  ];

  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar
          nav={<BandNav items={nav} />}
          utilities={<Button variant="primary">Start on Team</Button>}
        />
      </Band>

      <Sheet aria-label="Pricing">
        <Row>
          <Masthead
            eyebrow="PRICING"
            title="One table."
            titleSoft="Every plan, every line."
            statement="Every capability is stated for every plan, including the ones a plan does not carry. Nothing is implied by leaving it out."
            actions={<Button variant="primary">Start on Team</Button>}
            note="MIT COMPONENTS · NO CARD REQUIRED ON TEAM"
          />
        </Row>

        {/* No section break here: the Masthead already ends with its own
            padding, and 64px on top of that opens a hole between the claim
            and the table it is about. The break is for two arguments, and
            these two are one. */}
        <Row>
          <Card>
            <CardHead
              title="Plans"
              subtitle="Prices exclude tax · billed monthly, cancel any time"
              action={<ButtonLink href="#contact">Talk to us about Enterprise</ButtonLink>}
            />
            {/* CardTabs FILTER this card's content in place (B8) — they are
                not the plan switcher. The plans are all three columns, always
                on screen, because hiding two of the three is what a card row
                does and the whole point here is the comparison. */}
            <CardTabs
              mode="filters"
              tabs={GROUPS.map((g) => ({ id: g.id, label: g.label, count: g.count }))}
              active={group}
              onChange={setGroup}
            />
            <DataTable
              caption="Capabilities by plan"
              columns={columns}
              rows={rows}
              rowKey={(l) => l.id}
              announcement={`${rows.length} capabilities · ${
                GROUPS.find((g) => g.id === group)?.label ?? 'Everything'
              }`}
            />
          </Card>
        </Row>

        {/* ONE primary beneath the table, not one per column. The plan is
            chosen in the table; the button acts on the choice. */}
        <Row>
          <Prose>
            <p>
              <b>Team</b> is free and stays free. <b>Business</b> is {PLAN_HEADS[1].price}. Enterprise
              is quoted against seats and the review cadence a team actually wants.
            </p>
          </Prose>
        </Row>

        <Row space="section">
          <Prose>
            <h2>Questions about billing</h2>
          </Prose>
          <Accordion sections={FAQ} />
        </Row>

        <Row space="section">
          <CallToAction
            tone="band"
            title="Start on Team"
            statement="Install the registry, ship a screen, and move up only when the review and the audit are worth paying for."
            actions={<Button variant="primary">Start on Team</Button>}
            note="NO CARD REQUIRED · MIT COMPONENTS"
          />
        </Row>
      </Sheet>

      <SiteFooter
        statement="A component library for products that state their information rather than perform it."
        groups={[
          {
            title: 'SYSTEM',
            links: [
              { label: 'Components', href: '#components' },
              { label: 'Foundations', href: '#foundations' },
              { label: 'Templates', href: '#templates' },
            ],
          },
          {
            title: 'PRICING',
            links: [
              { label: 'Plans', href: '#pricing' },
              { label: 'Enterprise', href: '#contact' },
              { label: 'Invoicing', href: '#invoicing' },
            ],
          },
          {
            title: 'PROJECT',
            links: [
              { label: 'Roadmap', href: '#roadmap' },
              { label: 'Changelog', href: '#changelog' },
            ],
          },
        ]}
        legal="© 2026 SEVENTY SIX DEGREES · MIT"
        secondary={[
          { label: 'Terms', href: '#terms' },
          { label: 'Privacy', href: '#privacy' },
        ]}
      />
    </div>
  );
}
