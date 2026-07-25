import { PageHero, Sheet, Row, Card, CardHead } from '@/components/seventy-six';
import { HeroBand } from '../shell';
import { Prose } from '../blocks';

interface Phase {
  title: string;
  note: string;
  items: { t: string; d: string }[];
}

/* Mirrors ROADMAP.md — the two are edited in the same change or neither is. */
const ROADMAP: Phase[] = [
  {
    title: 'Shipped',
    note: 'v0.4.0 · closing the product taxonomy',
    items: [
      { t: 'The table’s missing half', d: '<b>SelectionHead</b> swaps the card head in place while rows are selected; <b>FilterLine</b> states active filters as one mono line with one "Clear all" — no floating bar, no chips.' },
      { t: 'Structure & display', d: 'Accordion (B27), DescriptionList (B28), Divider (B29), Avatar + AvatarGroup (B30), Spinner + Busy (B31), Kbd (B32).' },
      { t: 'The three missing inputs', d: 'NumberField (B33), Slider (B34), and DateRangeField (B35) — the F4 range, presets and two native date fields, still with no month grid.' },
      { t: 'Charts', d: 'Stacked-bar Trend, the cell-sized Sparkline, and the Delta chip extracted from the S1 card with honest polarity.' },
    ],
  },
  {
    title: 'Shipped',
    note: 'v0.3.0 · the floor and the auth surface',
    items: [
      { t: 'The 320px floor', d: 'Below 1000px the band’s nav moves into a left Drawer opened by a labelled "Menu" button; sub-tabs nest inside it. C7 verified at 320px and 200% zoom.' },
      { t: 'The Plate (B24)', d: 'The first band-less page type — wall, wordmark, one card. It carries auth, 404, 500, maintenance and expired-link pages.' },
      { t: 'The auth set', d: 'Six templates on one anatomy, plus PinField (B25) and SocialButton (B26) — one currentColor path per provider, no brand hexes.' },
      { t: 'Part F · The Refused', d: 'Eleven refusals documented by name with the composition that replaces each, so no "no" gets re-litigated.' },
    ],
  },
  {
    title: 'Shipped',
    note: 'v0.2.0–0.2.1 · the interaction layer',
    items: [
      { t: 'Combobox, Menu, Drawer', d: 'The searchable select (ARIA 1.2, hand-rolled), actions dropdowns on the native popover top layer, and the slide-over on native <code>&lt;dialog&gt;</code>.' },
      { t: 'Banner & Badge', d: 'The inline notice where errors actually render, and mono category tags — status stays a StatusWord.' },
      { t: 'The dark surface', d: 'Opt-in <code>data-mode="dark"</code>, tokens only, AA re-verified. No component branches on the mode.' },
      { t: 'The dark chrome hotfix', d: '<code>--sv-on-dark</code> separates the mark from the surface; firewall rule 16 makes painting a mark with the card-surface token a defect.' },
    ],
  },
  {
    title: 'Next',
    note: 'v0.5.0 · the public surface',
    items: [
      { t: 'Display tokens', d: '<code>--sv-display-1/2/3</code>, banned outside marketing block CSS by firewall rule 17.' },
      { t: 'Prose (B36)', d: 'One registered component styling a whole subtree — and the only place Part E permits italic.' },
      { t: 'Marketing blocks', d: 'Hero (type only), feature list, FAQ, footer, CTA, stat band. No photography, no illustration, no logo clouds (F11).' },
      { t: 'Pricing is a DataTable', d: 'One row per feature, one column per plan, one primary beneath. No tier cards, no "Most popular" pill.' },
    ],
  },
  {
    title: 'Still open',
    note: 'v0.4 remainder',
    items: [
      { t: 'Inputs', d: 'Multi-select Combobox, file upload, search field.' },
      { t: 'Structure', d: 'Page-level Tabs, stepper/wizard header, tree list, timeline.' },
      { t: 'Display', d: 'Popover primitive, code block, distribution strip.' },
      { t: 'FilterBar', d: 'The control row above the stated filter line.' },
    ],
  },
  {
    title: 'Exploring',
    note: 'later',
    items: [
      { t: 'Registry MCP server', d: 'Search components, blocks, and templates by metadata from any assistant.' },
      { t: 'Health seed', d: 'A contrast-verified clinical seed, added through the seed rule — both directions ≥ 4.5:1.' },
      { t: 'Full type tokenization', d: 'A complete <code>--sv-text-*</code> scale replacing the literals across every component.' },
      { t: 'Theming playground', d: 'Swap the seed and the mode live and watch a real screen re-theme.' },
    ],
  },
];

export function RoadmapPage() {
  return (
    <>
      <HeroBand>
        <PageHero
          title="Roadmap"
          context="What has shipped, what is next, and what we are still weighing. The visual system is settled; the work is reach and rigor."
        />
      </HeroBand>
      <Sheet aria-label="Roadmap">
        {ROADMAP.map((phase, i) => (
          <Row key={phase.note} overlap={i === 0}>
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
