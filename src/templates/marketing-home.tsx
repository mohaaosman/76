/* 76° · screen: public home · gate: pass */
// 76° template · the public surface — seed cobalt.
//
// The marketing SHELL is B1 with its product nav removed: the band keeps the
// wordmark and the right cluster, carries marketing links instead of app
// sections, and has no BandSubTabs row at all, because a public page has no
// section to sub-divide. Below 1000px BandNav swaps itself for the left
// drawer exactly as it does in the product — the public surface gets the
// 320px floor for free rather than re-solving it.
//
// Nothing on this page is an image. F11 refuses hero imagery, stock
// photography and illustration; A2 refuses the stock-photo card. What
// carries the page is type, hairlines and figures the project can stand
// behind (Ship Gate 12).
import {
  Band,
  BandTopbar,
  BandNav,
  Sheet,
  Row,
  Masthead,
  ProofRow,
  FeatureList,
  Accordion,
  CallToAction,
  SiteFooter,
  Prose,
  Button,
  ButtonLink,
} from '@/components/seventy-six';

const nav = [
  { label: 'System', href: '#system', active: true },
  { label: 'Components', href: '#components' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

const FEATURES = [
  {
    id: 'taxonomy',
    title: 'A closed taxonomy',
    body: 'Fifty-one specifications, each with one job, a fixed anatomy and a Don\'t list. A screen that needs a type the Book does not carry either gets the type named, or gets composed from the ones that exist.',
    meta: 'B1 — B51',
  },
  {
    id: 'deps',
    title: 'Zero runtime dependencies',
    body: 'Native element first: details, dialog, popover, and input type="date". The browser draws the calendar, and it draws it localized, keyboard-complete and already tested.',
    meta: 'REACT 19 ONLY',
  },
  {
    id: 'a11y',
    title: 'AA on both surfaces',
    body: 'Every token pair is contrast-verified on light and on dark paper, and no meaning anywhere in the system is carried by colour alone.',
    meta: 'WCAG 2.2 AA',
  },
  {
    id: 'firewall',
    title: 'A firewall that runs in CI',
    body: 'Seventeen machine-checkable rules. A gradient, an unregistered radius, a colour literal outside the token file or a 64px number on a dashboard fails the build.',
    meta: '17 RULES',
  },
  {
    id: 'registry',
    title: 'Installable one part at a time',
    body: 'Every component, block and template is a shadcn registry item with the tokens as its one shared dependency. Take the table without taking the system.',
    meta: 'SHADCN REGISTRY',
  },
  {
    id: 'llms',
    title: 'Readable by the assistant',
    body: 'An llms.txt index plus a full markdown document per component and per composition, generated from the same entries the site renders.',
    meta: 'LLMS.TXT',
  },
];

/* The FAQ is the B27 Accordion, not a new component: a question folded away
   until it is asked for is exactly what B27 is for, and a marketing page does
   not get its own disclosure widget. */
const FAQ = [
  {
    id: 'why-flat',
    title: 'Why is nothing shaded, rounded or glassy?',
    meta: 'THE FIREWALL',
    children: (
      <p>
        Because every one of those is a way of asking a screen to perform instead of inform. The
        system allows one radius, one shadow, neutrals and a single seed colour — and the firewall
        rejects the rest at build time, so the discipline does not depend on anyone remembering it.
      </p>
    ),
  },
  {
    id: 'dark',
    title: 'Is there a dark mode?',
    meta: 'OPT-IN · TOKEN-ONLY',
    children: (
      <p>
        Yes, and it changes tokens and nothing else. Light is the default surface; dark is opt-in
        via a data attribute on the document. No component may branch on the mode, and every
        functional and seed-as-text step is re-verified AA on dark paper.
      </p>
    ),
  },
  {
    id: 'charts',
    title: 'Where are the donut charts?',
    meta: 'REFUSED BY NAME',
    children: (
      <p>
        Refused since the first release, along with pie, radial and gauge. Two components replace
        them: one measures each part against its own maximum, the other divides a single total into
        its shares. Every donut a team has drawn was asking the second question.
      </p>
    ),
  },
  {
    id: 'rtl',
    title: 'Does it support right-to-left languages?',
    meta: 'STATED BOUNDARY',
    children: (
      <p>
        Not yet, and the boundary is stated rather than hidden. The component layer uses physical
        direction properties. Repealing that line is one system-wide change — the band, the overlap,
        the drawer side, numeric alignment and focus order — never a per-component patch.
      </p>
    ),
  },
];

export function MarketingHome() {
  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar
          nav={<BandNav items={nav} />}
          /* The band's button is a GHOST, not a second primary: A2 allows one
             seed fill per view region and the Masthead below owns the ask. Two
             blue rectangles visible at once is two primaries, which is none. */
          utilities={<ButtonLink href="#install">Install the registry</ButtonLink>}
        />
      </Band>

      <Sheet aria-label="76° — the component library">
        {/* No overlap row: B2 spends that move on a dashboard's stat row, and
            a public page has no stat row to pin over the band edge. */}
        <Row>
          <Masthead
            title="Flat, informational, corporate."
            titleSoft="Paper on a wall."
            statement="Fifty-one component specifications with one job each, zero runtime dependencies, and WCAG 2.2 AA verified on both surfaces."
            actions={
              <>
                <Button variant="primary">Install the registry</Button>
                <ButtonLink href="#components">Browse the components</ButtonLink>
              </>
            }
          />
        </Row>

        <Row>
          <ProofRow
            ariaLabel="The system in figures"
            items={[
              { id: 'specs', figure: '51', label: 'BOOK SPECS', note: 'B1 to B51, each with one job' },
              { id: 'deps', figure: '0', label: 'RUNTIME DEPS', note: 'React and the platform, nothing else' },
              { id: 'contrast', figure: '4.5:1', label: 'MINIMUM CONTRAST', note: 'Verified on light and dark paper' },
              { id: 'floor', figure: '320px', label: 'LAYOUT FLOOR', note: 'Nothing hidden, nothing scrolled sideways' },
            ]}
          />
        </Row>

        {/* The section heading is B45 Prose and not a new part: a heading
            with a sentence under it is authored running copy, which is the
            one thing Prose exists to set. The Row's own 14px gutter is what
            separates it from the list it opens. */}
        <Row space="section" id="components">
          <Prose>
            <h2>What ships</h2>
            <p>
              Six things a team gets on the first install. None of them is a feature of the
              components; all of them are properties of the system they belong to.
            </p>
          </Prose>
          <FeatureList items={FEATURES} ariaLabel="What the system ships" />
        </Row>

        <Row space="section">
          <Prose>
            <h2>Questions the Book answers</h2>
          </Prose>
          <Accordion sections={FAQ} />
        </Row>

        <Row space="section">
          <CallToAction
            tone="band"
            title="Read the Component Book"
            statement="Every specification, every refusal by name, and the fourteen-point gate each screen passes before it ships."
            actions={<Button variant="primary">Open the Book</Button>}
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
              { label: 'Blocks', href: '#blocks' },
              { label: 'Templates', href: '#templates' },
            ],
          },
          {
            title: 'RESOURCES',
            links: [
              { label: 'The Component Book', href: '#book' },
              { label: 'AI-ready layer', href: '#llms' },
              { label: 'Registry', href: '#registry' },
            ],
          },
          {
            title: 'PROJECT',
            links: [
              { label: 'Roadmap', href: '#roadmap' },
              { label: 'Changelog', href: '#changelog' },
              { label: 'Source', href: '#source' },
            ],
          },
        ]}
        legal="© 2026 SEVENTY SIX DEGREES · MIT"
        secondary={[
          { label: 'Licence', href: '#licence' },
          { label: 'Status', href: '#status' },
        ]}
      />
    </div>
  );
}
