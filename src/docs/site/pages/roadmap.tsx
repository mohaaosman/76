import { PageHero, Sheet, Row, Card, CardHead } from '@/components/seventy-six';
import { HeroBand } from '../shell';
import { RichText } from '../blocks';

interface Phase {
  title: string;
  note: string;
  items: { t: string; d: string }[];
}

/* Mirrors ROADMAP.md — the two are edited in the same change or neither is. */
const ROADMAP: Phase[] = [
  {
    title: 'Shipped',
    note: 'v0.5.0 · the public surface',
    items: [
      { t: 'Not one refusal repealed', d: 'No photography, no illustration, no 3D, no logo cloud. <b>F11 survived the surface it was written against</b>, which is how a refusal proves it was right. What changed is the type ramp, and nothing else.' },
      { t: 'Display tokens + firewall rule 17', d: '<code>--sv-display-1/2/3</code> — 64/48/34, clamping to 34/27/21 at 320px, which is the size each line takes in the product ramp. Rule 17 fences them to the three components that set them, so no dashboard grows a 64px number.' },
      { t: 'Prose (B45)', d: 'The one component that styles a subtree it does not own: 16/1.6 on a ~66ch measure, a heading ramp that stays inside the product ramp, hairline-ruled blockquote, inline mono, markdown straight in. It is also where <b>F1 is answered</b> — the refused WYSIWYG composes to a textarea plus a preview, and this is the preview.' },
      { t: 'Masthead (B47)', d: 'The hero, refused as imagery and rebuilt as type. No image slot, no video slot, no background slot — adding one is a Book change, not a prop. It speaks <b>PageHero</b>’s vocabulary one surface up.' },
      { t: 'FeatureList (B48) · CallToAction (B49)', d: 'The claim itemised as a newspaper column — a rule, an ordinal, a title, one sentence, and no icon tiles. Then the only row that asks, asking once; <code>tone="band"</code> closes the page on the same ink it opened under.' },
      { t: 'ProofRow (B50)', d: 'Figures at display size between vertical hairlines. <b>It is not a StatS1</b>: B3 is a measurement on paper with an icon tile, a delta and a footnote; this is a claim on the wall with none of the three.' },
      { t: 'SiteFooter (B51)', d: 'One named <code>&lt;nav&gt;</code> over the whole link region, and groups labelled as the lists they are — four h2s at the end of a document re-open an outline the content already closed.' },
      { t: 'Pricing is a DataTable', d: 'No tier cards, no "Most popular" pill, no three competing primaries. The plan is the column and the capability is the row, so every capability is stated for every plan instead of implied by its absence from a card.' },
      { t: 'The marketing shell and the section break', d: 'B1 makes <code>app</code> and <code>nav</code> optional — the band keeps the wordmark and the right cluster and drops the sub-tab row. B2 gains <code>space="section"</code>: 14px separates two cards of one dashboard, not two arguments of one page.' },
    ],
  },
  {
    title: 'Shipped',
    note: 'v0.4.0 · the taxonomy closed',
    items: [
      { t: 'The nine that were missing', d: 'SearchField (B36), FileField (B37), Tabs (B38), Stepper (B39), TreeList (B40), Timeline (B41), Popover (B42), CodeBlock (B43), DistributionStrip (B44). The line-by-line audit against Bootstrap, Tailwind UI, shadcn/ui and Material is now empty of everything Part F does not refuse.' },
      { t: 'The donut has a replacement, by name', d: '<b>DistributionStrip</b> divides ONE total into its shares; <b>MeterList</b> measures each part against its own maximum. Every donut ever drawn was asking the first question and being handed the second.' },
      { t: 'Three amendments', d: 'The Combobox picks a SET and states it as one mono line, never chips (B19). <b>FilterBar</b> sets what FilterLine states (B7). <b>Trend</b> prints the column it is about and labels its y axis — never on hover (B5).' },
      { t: 'Split (B46)', d: 'The band-less page cut in half, with the card ACROSS the cut — <b>B2\u2019s overlap, finished</b>. The dashboard\u2019s stat cards straddle ink and wall; a <b>Plate</b> has no Sheet, so the same physics arrive as a page type. The halves carry nothing at all, so they are <code>aria-hidden</code> and the page reads as the Plate it composes. Two orientations on one prop, side and stacked.' },
      { t: 'Two more templates', d: '<b>Analytics overview</b> — reconciling stats, a Trend whose peak is printed, wall-level Tabs, and the donut refused in favour of a strip. <b>Sign in · stacked band</b> — the same auth screen with the cut rotated. All seven auth screens ride B46.' },
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
                    <b>{item.t}</b> — <RichText text={item.d} />
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
