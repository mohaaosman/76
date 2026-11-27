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
    note: 'v0.11.0 · sturdier, and every component reaches every use',
    items: [
      { t: 'IBM Plex', d: 'Sans for content, <b>Mono at weight 500</b> for metadata, and <b>Sans Arabic</b> as the companion in both stacks. Fragment Mono shipped one weight, which is why every label, header, ID and timestamp read as a hairline.' },
      { t: 'The weight amendment', d: 'ink-soft 6.86:1 (the old step <b>failed AA on the wall</b>), faint reserved for disabled and decorative, firmer hairlines, a deeper wall, the one shadow at .08, <code>--sv-bar</code> at 4px, nothing below 10px.' },
      { t: 'DataState (B64) · DataTable maxHeight', d: 'The four lifecycle states assembled once around any widget, and long tables that scroll inside their card with the header held.' },
      { t: 'Every component reaches every use', d: 'Native attributes, refs, uncontrolled modes and per-item <code>disabled</code> on all components, backwards compatible — and MenuButton\'s missing <code>aria-expanded</code>, dead Home/End in menus, colliding palette ids and Tooltip handler clobbering, fixed.' },
    ],
  },
  {
    title: 'Shipped',
    note: 'v0.10.0 · the roadmap, finished — and every language',
    items: [
      { t: 'Posting the work (0.7)', d: '<b>EntryTable (B53)</b> types one bounded number into every line and posts the lot once — Enter moves down, never submits. <b>ScanField (B54)</b> takes one identifier at a time and states what it resolved to. <b>JobList (B58)</b> states what became of a background job and where its result landed. B7 gains <code>rowSync</code>: a word and a 6px dot for a row whose save has not landed.' },
      { t: 'Density, as a posture', d: '<code>data-density="compact | regular | touch"</code> on a wrapper, resolved at the nearest declaration exactly as <code>data-seed</code> and <code>data-mode</code> are. It re-tokenizes three things — row inset, control inset, control minimum — and the touch posture takes B10’s POS numbers, so the bespoke variant becomes the posture.' },
      { t: 'The number in relation (0.8)', d: '<b>TreeTable (B59)</b>, a hierarchy whose every parent is the sum of its children, on a real treegrid. <b>CrossTable (B60)</b>, one measure at every intersection of two dimensions — in figures, never a heatmap. <b>FunnelList (B61)</b>, one total narrowing step by step, on straight bars. <b>Delta</b> gains <code>against</code>, so no delta is an unsourced assertion, and <b>FilterLine</b> states when the view has drifted from the saved one.' },
      { t: 'The record and the console (0.9)', d: '<b>MessageThread (B62)</b>, a conversation with direction stated in words. <b>SettingList (B63)</b>, the settable twin of B28 — every control beside the sentence that says what it does. Two templates: <b>crm-deal</b> and <b>settings-team</b>, the first administration console in the set.' },
      { t: 'The language layer', d: '<code>LocaleProvider</code> carries every built-in word the components speak — "Clear all", "Close Purchase order", "Digit 3 of 6" — in English, French, Arabic and Somali, with real plural rules. No provider, no change. <code>useFormat()</code> gives the <i>caller</i> Intl-backed money, number and date strings, so C9 stands: no component formats a figure.' },
      { t: 'The LTR boundary, repealed', d: 'Every component stylesheet is on logical properties, arrow keys follow the reading direction, drawers open from <code>start</code>/<code>end</code>, and a script layer keeps Arabic letters joined — no tracking, and a mono stack that falls through to a proportional face for the script while IDs stay mono. Code, PIN codes and the chart’s time axis stay left to right, on purpose.' },
      { t: 'The gates and the reach', d: '<b>Firewall rule 21</b> rejects a physical left/right in any stylesheet, so RTL cannot regress. <code>npm run test:interaction</code> drives the built site in a browser — 70 assertions over keyboard models, live regions, direction, the language layer and a 320px sweep of every page — whose first run found the floor broken on all 64 component pages. <b>DataTable</b> gains pointer selection: a checkbox column with an indeterminate select-all, outside the tab order. And <code>seventy-six-mcp</code>, a zero-dependency registry server for any assistant.' },
      { t: 'From Exploring', d: 'The <b>Iris</b> health seed through the seed rule (6.35:1 both ways, dark text 6.06:1). The <b>playground</b> — seed, mode, density, motion and language, live, on one real screen. And the <code>indeterminate</code> Checkbox the 0.6 review named.' },
      { t: 'Defects fixed on the way', d: 'Placeholders were <code>--sv-ink-faint</code> (2.6:1) against the system’s own C2 rule; they are ink-soft now. <b>Field</b> and <b>Select</b> silently dropped a caller’s <code>aria-describedby</code>. Doc prose written with <code>&lt;i&gt;</code> printed the tags. Plurals were <code>noun + "s"</code> ("STATUSS"). A row\'s keys fired twice from controls inside it.' },
    ],
  },
  {
    title: 'Shipped',
    note: 'v0.6 – v0.9 · promises kept, motion, the cover',
    items: [
      { t: 'The promises already made (0.6)', d: '<b>ErrorSummary (B52)</b>, DataTable <code>totals</code> and <code>leadHold</code>, the printed surface in tokens only, and the <b>erp-purchase-order</b> and <b>crm-deal-board</b> templates.' },
      { t: 'Motion and money (0.7)', d: 'The opt-in motion posture, <code>useCountUp</code>, <b>SumList (B55)</b>, and the invoice and checkout templates.' },
      { t: 'The cover (0.8 – 0.9)', d: '<b>IndexRow (B56)</b>, <b>CaptionRow (B57)</b>, the issue-scale Masthead, clean URLs, and the moving surface reaching the widgets.' },
    ],
  },
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
      { t: 'Native-speaker review of the catalogs', d: 'French, Arabic and Somali ship machine-drafted and English-sourced. Each needs a native reviewer before a product ships it, and Hebrew and Persian are the next RTL catalogs.' },
      { t: 'Full type tokenization', d: 'A complete <code>--sv-text-*</code> scale replacing the literals across every component — now cheaper, because density already moved <code>--sv-body-size</code> into the token layer.' },
      { t: '8-state preview files · token sync', d: 'The fundamentals state contract as a preview per component, and a Figma ⇄ <code>tokens.css</code> bridge.' },
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
