import { Link } from 'react-router-dom';
import {
  Masthead,
  IndexRow,
  CaptionRow,
  Sheet,
  Row,
  Card,
  CardHead,
  DataTable,
  StatS1,
  StatusWord,
  ButtonLink,
} from '@/components/seventy-six';
import type { IndexItem } from '@/components/seventy-six';
import { RichText } from '../blocks';

/**
 * THE COVER (v0.8).
 *
 * The structure is Japanese editorial — the SUPER: Osaka cover, TOKYO PAPER,
 * the NAGANO and HOKKAIDO travel posters: an edge-set display title, a
 * numbered contents strip beneath it, a plate, a row of short captions under
 * the plate, and a great deal of white. English only.
 *
 * WHERE THE POSTER PUTS A PHOTOGRAPH, THIS PAGE PUTS A LIVE COMPONENT.
 * F11 refuses photography and illustration by name, and its replacement
 * column reads "type, hairline, and REAL DATA" — a component library has the
 * one asset that qualifies. The stat row and the table below are not pictures
 * of the product, they are the product, rendered by the code the installer
 * ships. Delete the screenshot problem and it can never rot.
 *
 * F14 stands too, so the poster's block of colour is the INK BAND the site
 * already carries above this page — not a seed rectangle. Exactly one thing
 * on the cover is coloured, and it is the button.
 */

const IconGrid = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
  </svg>
);

const IconShield = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M8 1.5l5.5 2v4c0 3.4-2.3 5.8-5.5 7-3.2-1.2-5.5-3.6-5.5-7v-4L8 1.5z" />
  </svg>
);

const IconKey = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="5" cy="8" r="3.5" />
    <path d="M8.5 8H15M12.5 8v3" />
  </svg>
);

const IconBot = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2.5" y="4.5" width="11" height="9" rx="1.5" />
    <path d="M8 4.5V1.5M5.5 8.5h.01M10.5 8.5h.01" strokeLinecap="round" />
  </svg>
);

/* Derived from the doc entries at build time (vite.config.ts), never typed
   by hand — a hardcoded count is a lie waiting to happen, and importing the
   whole corpus to count it puts 140kB of prose in the landing chunk. */
const entryCount = __ENTRY_COUNT__;
const specCount = __SPEC_COUNT__;
const highestSpec = __HIGHEST_SPEC__;

/* The contents strip. It links to the eight plain pages, which is what makes
   it a table of contents rather than decoration — a magazine has one cover
   and many inside pages set for reading, and this is the seam between them. */
const CONTENTS: IndexItem[] = [
  { id: 'foundations', label: 'Foundations', href: '/foundations', meta: 'TOKENS' },
  { id: 'components', label: 'Components', href: '/components', meta: `${entryCount} SPECS` },
  { id: 'blocks', label: 'Blocks', href: '/blocks', meta: 'SECTIONS' },
  { id: 'templates', label: 'Templates', href: '/templates', meta: 'SCREENS' },
  { id: 'ai', label: 'AI-ready', href: '/ai', meta: 'LLMS.TXT' },
  { id: 'roadmap', label: 'Roadmap', href: '/roadmap', meta: 'THE PLAN' },
];

/* The specimen's figures reconcile with its own closing row:
   18,240 + 12,960 + 9,850 + 6,362 = 47,412 (Ship Gate point 12). */
type Order = { id: string; customer: string; state: string; tone: 'ok' | 'neutral' | 'bad'; total: string };
const SPECIMEN: Order[] = [
  { id: 'ORD-10482', customer: 'Halcyon Freight', state: 'Fulfilled', tone: 'ok', total: '$18,240.00' },
  { id: 'ORD-10479', customer: 'Northwind Trading', state: 'Pending', tone: 'neutral', total: '$12,960.00' },
  { id: 'ORD-10471', customer: 'Kestrel Logistics', state: 'Fulfilled', tone: 'ok', total: '$9,850.00' },
  { id: 'ORD-10468', customer: 'Bluepeak Retail', state: 'On hold', tone: 'bad', total: '$6,362.00' },
];

export function HomePage() {
  const renderLink = (item: IndexItem, className: string) => (
    <Link to={item.href} className={className}>
      {item.label}
    </Link>
  );

  return (
    <Sheet aria-label="76° — the component library">
      {/* No HeroBand: a cover opens on the paper, not on the chrome. The ink
          block the poster wants is the band the shell already draws above. */}
      <Row>
        <Masthead
          scale="issue"
          title="Paper on a wall."
          titleSoft="The product is the design."
          statement="A component library for products that state their information rather than perform it. Every widget has one job, and nothing on a screen is there to be admired."
          actions={
            <>
              <Link className="sv-btn sv-btn--primary" to="/components">
                Browse components
              </Link>
              <ButtonLink href="/ai">Install the registry</ButtonLink>
            </>
          }
        />
      </Row>

      <Row>
        <IndexRow items={CONTENTS} ariaLabel="Contents" renderLink={renderLink} />
      </Row>

      {/* THE PLATE. Four figures about the system, each one checkable. */}
      <Row split="stats">
        <StatS1
          label="COMPONENTS"
          value={String(entryCount)}
          icon={IconGrid}
          footnote={
            <>
              <b>
                {specCount} of {highestSpec}
              </b>{' '}
              Component Book specs covered — B1 through B{highestSpec}
            </>
          }
          footnoteText={`${specCount} of ${highestSpec} Component Book specs covered`}
        />
        <StatS1
          label="RUNTIME DEPENDENCIES"
          value="0"
          icon={IconShield}
          footnote={
            <>
              native <b>&lt;dialog&gt;</b>, the popover attribute, plain ARIA — no Radix needed yet
            </>
          }
          footnoteText="Built on native dialog, the popover attribute and plain ARIA with zero runtime dependencies"
        />
        <StatS1
          label="ACCESSIBILITY"
          value="WCAG 2.2"
          icon={IconKey}
          footnote={
            <>
              Part C contract: <b>AA</b> contrast, full keyboard, visible focus everywhere
            </>
          }
          footnoteText="WCAG 2.2 AA: Part C contract with full keyboard support and visible focus"
        />
        <StatS1
          label="AI-READY"
          value="llms.txt"
          icon={IconBot}
          footnote={
            <>
              every page doubles as <b>markdown</b> plus a shadcn-compatible registry
            </>
          }
          footnoteText="Every page doubles as markdown plus a shadcn-compatible registry"
        />
      </Row>

      {/* The poster's caption line, kept verbatim in structure: three short
          fragments spread across one rule, describing the plate above them. */}
      <Row>
        <CaptionRow
          captions={['never a screenshot', 'always the shipped code', 'figures that reconcile']}
        />
      </Row>

      <Row>
        <Card>
          <CardHead
            title="Open orders"
            subtitle="A live DataTable — the same code the registry installs"
            action={<Link className="sv-btn sv-btn--link" to="/components/data-table">View the spec</Link>}
          />
          <DataTable
            caption="Open orders — a live DataTable, not a screenshot"
            rows={SPECIMEN}
            rowKey={(o) => o.id}
            announcement="4 orders"
            columns={[
              { key: 'id', header: 'ORDER', kind: 'id', render: (o) => o.id },
              { key: 'customer', header: 'CUSTOMER', render: (o) => o.customer },
              {
                key: 'state',
                header: 'STATUS',
                kind: 'status',
                render: (o) => <StatusWord tone={o.tone}>{o.state}</StatusWord>,
              },
              { key: 'total', header: 'TOTAL', kind: 'num', render: (o) => o.total },
            ]}
            totals={[{ label: 'TOTAL', cells: { total: '$47,412.00' }, strong: true }]}
          />
        </Card>
      </Row>

      {/* The two reading cards pair, so neither is a full-width card with a
          66ch measure and an empty right half. */}
      <Row split="main">
        <Card>
          <CardHead title="What this is" subtitle="A component library compiled from the Component Book" />
          <div className="site-prose">
            <p>
              <RichText text="76° is <b>flat, informational, corporate</b> — every component tells you information; none of them perform. This site documents the React implementation of the Component Book: one component per widget type, because <b>the taxonomy is the component API</b>." />
            </p>
            <p>
              <RichText text="Distribution follows the shadcn model: components are <b>source you own</b>, installed into your project via the CLI or copied manually. There is no npm package to fall out of date, and no dependency to audit — the entire library runs on native <code>&lt;dialog&gt;</code>, the <code>popover</code> attribute, native <code>&lt;select&gt;</code>, and hand-rolled SVG charts." />
            </p>
            <p>
              <RichText text="Each page follows the same skeleton: overview, installation, live variations with paired <b>Preview / Code</b> tabs, prop-by-prop documentation, the accessibility contract, the Don't list, and an FAQ. The page you read is the page an LLM ingests — one source of truth." />
            </p>
          </div>
        </Card>

        <Card>
          <CardHead title="The Six Laws" subtitle="Governing rules — everything else derives" />
          <ul className="site-donts site-laws">
            <li>Paper on a wall: contrast separates, nothing floats.</li>
            <li>Three colors, total: ink, seed, functional words and dots.</li>
            <li>Every widget has a type and one job. No hybrids.</li>
            <li>Mono speaks metadata; Hanken speaks content.</li>
            <li>The band is the chrome; the paper is 100% work.</li>
            <li>Numbers are instrumentation: tabular, bold, contextual.</li>
          </ul>
          <p className="site-prose site-prose--tight">
            Statuses in the wild: <StatusWord tone="ok">Fulfilled</StatusWord>{' '}
            <StatusWord tone="neutral">Pending</StatusWord>{' '}
            <StatusWord tone="bad">On hold</StatusWord>
          </p>
        </Card>
      </Row>

    </Sheet>
  );
}
