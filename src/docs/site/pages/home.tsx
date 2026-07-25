import { Link } from 'react-router-dom';
import { PageHero, Sheet, Row, Card, CardHead, StatS1, StatusWord } from '@/components/seventy-six';
import { HeroBand } from '../shell';
import { RichText } from '../blocks';

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

export function HomePage() {
  return (
    <>
      <HeroBand>
        <PageHero
          title="Paper on a wall."
          titleSoft="The product is the design."
          context={`25 JUL 2026 · Component Book v1 · every spec implemented, B1–B${highestSpec}`}
          actions={
            <Link className="sv-btn sv-btn--primary" to="/components">
              Browse components
            </Link>
          }
        />
      </HeroBand>
      <Sheet aria-label="Introduction">
        <Row split="stats" overlap>
          <StatS1
            label="COMPONENTS · V1"
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
                native <b>&lt;dialog&gt;</b>, popover attribute, plain ARIA — no Radix needed yet
              </>
            }
            footnoteText="Built on native dialog, popover attribute and plain ARIA with zero runtime dependencies"
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
                every page doubles as <b>markdown</b> + a shadcn-compatible registry
              </>
            }
            footnoteText="Every page doubles as markdown plus a shadcn-compatible registry"
          />
        </Row>
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
              <StatusWord tone="neutral">Pending</StatusWord> <StatusWord tone="bad">On hold</StatusWord>
            </p>
          </Card>
        </Row>
      </Sheet>
      <footer className="site-footer sv-mono">76° — SEVENTY SIX DEGREES · THE PRODUCT IS THE DESIGN</footer>
    </>
  );
}
