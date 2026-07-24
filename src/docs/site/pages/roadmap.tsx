import { PageHero, Sheet, Row, Card, CardHead } from '@/components/seventy-six';
import { HeroBand } from '../shell';
import { Prose } from '../blocks';

interface Phase {
  title: string;
  note: string;
  items: { t: string; d: string }[];
}

const ROADMAP: Phase[] = [
  {
    title: 'Shipped',
    note: 'v0.1.0',
    items: [
      { t: '18 components', d: 'The full B1–B18 taxonomy, zero runtime dependencies, WCAG 2.2 AA.' },
      { t: 'shadcn registry', d: 'Every item installable from <code>76.zifala.com/r/</code>; tokens as a shared dependency.' },
      { t: 'AI-ready layer', d: 'llms.txt index + a full markdown doc per component and per composition.' },
      { t: 'Design skill', d: 'seventy-six-design on skills.sh, with the fundamentals discipline layer.' },
      { t: 'Blocks & templates', d: '7 composed blocks and 5 full-screen templates, all registry-installable.' },
    ],
  },
  {
    title: 'In progress',
    note: 'next',
    items: [
      { t: 'Registry MCP server', d: 'Search components, blocks, and templates by metadata from any assistant.' },
      { t: 'Combobox & date picker', d: 'The two deferred inputs enter the Book — Radix comes off the bench.' },
      { t: 'Health seed', d: 'A contrast-verified clinical seed, added through the seed rule.' },
      { t: '8-state preview files', d: 'The fundamentals state contract, shipped as a preview per component.' },
    ],
  },
  {
    title: 'Exploring',
    note: 'later',
    items: [
      { t: 'More templates', d: 'Analytics, billing, inbox, and onboarding screens.' },
      { t: 'Theming playground', d: 'Swap the seed live and watch a real screen re-theme.' },
      { t: 'Token sync', d: 'A Figma ⇄ tokens.css bridge so design and code share one source.' },
      { t: 'Dark-mode study', d: 'Light-first stays the default; a disciplined dark surface is under study.' },
    ],
  },
];

export function RoadmapPage() {
  return (
    <>
      <HeroBand>
        <PageHero
          breadcrumb={['76°', 'ROADMAP']}
          title="Roadmap"
          context="What has shipped, what is next, and what we are still weighing. The visual system is settled; the work is reach and rigor."
        />
      </HeroBand>
      <Sheet aria-label="Roadmap">
        {ROADMAP.map((phase, i) => (
          <Row key={phase.title} overlap={i === 0}>
            <Card>
              <CardHead title={phase.title} subtitle={phase.note} />
              <div className="site-prose">
                {phase.items.map((item) => (
                  <p key={item.t}>
                    <b>{item.t}</b> — <Prose text={item.d} />
                  </p>
                ))}
              </div>
            </Card>
          </Row>
        ))}
      </Sheet>
    </>
  );
}
