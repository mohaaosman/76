# library.md — the built React library (`seventy-six-ui`)

Purpose: when you work in React, **consume** these components — don't rebuild what already ships. All **52 components** below exist, are exported, and install via the shadcn registry. Reach for the export first; only compose new UI from primitives when no widget covers the job.

The doc site files them under **five categories** — chrome (4) · widgets (8) · primitives (26) · forms (9) · marketing (5). Marketing is the v0.5 public surface (B47–B51) and a product screen imports none of it.

- npm package: `seventy-six-ui`
- Registry / doc site: **https://76.zifala.com**
- Peer: React only (`react` / `react-dom` ^19). **Zero runtime dependencies** — everything runs on the platform (native `<dialog>`, `popover` attribute, native `<select>`, real inputs, hand-rolled SVG).

---

## File map

```
src/
  styles/tokens.css            the ONLY file allowed to contain color literals (CSS variables/seeds)
  styles/base.css              reset · focus contract · mono/tabular voices
  lib/cx.ts                    class combiner — the only "utility" (import { cx } from '@/lib/cx')
  components/seventy-six/      the library — ONE component per widget type (52 of them)
    index.ts                   the export barrel (source of truth for names below)
    band.tsx  band.css         chrome (band, sheet, plate, split)
    card.tsx  card.css         the paper primitive
    stat-s1.tsx  ...           widgets (each is a .tsx + scoped .css pair): progress, trend,
                               meter-list, distribution-strip, data-table, card-tabs, activity-list
    button.tsx ...             primitives: status-word, dialog, drawer, toast, banner, badge,
                               menu, popover, tooltip, empty-state, skeleton, spinner,
                               search-command, accordion, description-list, divider, avatar,
                               kbd, tabs, stepper, tree-list, timeline, code-block, prose
    field.tsx ...              forms: combobox, pin-field, social-button, number-field, slider,
                               date-range-field, search-field, file-field
    masthead.tsx ...           marketing (v0.5, public surface only): feature-list, cta,
                               proof-row, site-footer
  docs/
    content/                   pure-data doc entries → drive site + markdown + registry
      categories.ts            the five categories: chrome · widgets · primitives · forms · marketing
      chrome-forms.ts widgets.ts primitives.ts interaction.ts auth.ts
      structure.ts inputs.ts marketing.ts    the 52 entries
      compositions.ts          7 blocks + 15 templates
    demos.tsx                  live preview components
    site/                      shell, blocks, pages
scripts/
  build-registry.mjs           emits public/r/*.json (shadcn items)
  build-llms.mjs               emits public/llms.txt + public/llms/*.md
  slop-firewall.mjs            lint gate (CI, non-zero exit on a hit)
```

Each component is a **`.tsx` + scoped `.css` pair**. Components import `cx` from `@/lib/cx` and their own CSS; all color comes from `tokens.css` seeds — never hardcode a color literal in a component.

---

## The exports

Every name below is exported from `src/components/seventy-six/index.ts`. Do not invent others.

### Chrome — the ink zone and the paper it sits on

| Import | One job | Type exports |
| --- | --- | --- |
| `Band`, `BandTopbar`, `BandNav`, `BandSubTabs`, `PageHero` | Carry ALL navigation + page context (topbar, wordmark, horizontal nav, mono sub-tabs, hero). Nav is horizontal — never a sidebar. | `BandNavItem`, `PageHeroProps` |
| `Sheet`, `Row` | The platinum wall + its 12-col grid, including the one signature `-44px` overlap row per page. `Row space="section"` is the v0.5 public-page break (64px / 40px). | — |
| `Plate`, `PlateHead` | B24 — the band-less page: wall edge to edge, one centred ≤400px card, the `76°` wordmark above. Auth, 404, 500, maintenance. | `PlateProps`, `PlateHeadProps` |
| `Split` | B46 — the band-less page cut in half, with the Plate straddling the seam (B2's overlap, finished). | `SplitProps` |
| `Card`, `CardHead` | The paper primitive: one shadow, one radius, zero border. Every widget composes it. | — |

### Widgets — the answer-a-question units

| Import | One job | Type exports |
| --- | --- | --- |
| `StatS1`, `Delta` | The signature stat and the ONLY legal KPI card — "how much, and so what." `Delta` is the extracted ▲/▼ chip, reusable in a cell or a head (`polarity="down-good"` for inverse metrics). | `StatS1Props`, `DeltaProps` |
| `Progress` | Value against target with one 3px bar — "how far along." | — |
| `Trend`, `Sparkline` | Flat single-weight SVG lines on a hairline grid — "which direction." `kind` is `line`/`bar`/`stacked`; `yTicks` and `highlight` state the axis and the one column the chart is about. `Sparkline` is the series at cell size, legal ONLY beside a printed figure. | `TrendSeries`, `SparklineProps` |
| `MeterList` | Named items with 3px bars + mandatory absolute numbers — each part against ITS OWN maximum. | `MeterItem` |
| `DistributionStrip` | B44 — one total divided into its shares (the donut, answered). Not the same question as `MeterList`. | `DistributionPart`, `DistributionStripProps` |
| `DataTable`, `SelectionHead`, `FilterLine`, `FilterBar` | The ERP workhorse: mono headers/IDs, dot+word statuses, tabular numbers, keyboard contract. `FilterBar` SETS filters, `FilterLine` STATES what is set, `SelectionHead` replaces the CardHead in place while rows are selected. | `Column`, `SelectionHeadProps`, `FilterLineProps`, `FilterBarProps`, `ActiveFilter` |
| `CardTabs` | In-card filter tabs on the card hairline — filter one card's content in place. | `CardTab` |
| `ActivityList` | Mono timestamp column beside sentence rows with bold entities — "what needs me." | `ActivityItem` |

### Primitives — the atoms widgets and pages compose

| Import | One job | Type exports |
| --- | --- | --- |
| `Button`, `ButtonLink` | Native `<button>`, four registered variants, one primary per region. | `ButtonProps`, `ButtonVariant` |
| `StatusWord` | A 6px currentColor dot + a colored word — one thing's status, one word. | `StatusTone` |
| `Dialog` | Native `<dialog>` in a paper card — interrupt for one decision or form. `size`: `default` 480 · `wide` 640 · `full`. | — |
| `Drawer` | Full-height paper panel from the screen edge — a workspace beside the work. sm/md/lg/full. | `DrawerProps` |
| `ToastProvider`, `useToast` | Bottom-left notifications, tones ok/info/warn/bad — errors still render inline at source FIRST. | `NotifyOptions`, `ToastTone` |
| `Banner` | The inline notice, adjacent to its cause — where every error goes. warn renders in INK. | `BannerProps`, `BannerTone` |
| `Badge` | Mono uppercase CATEGORY tag — never a pill, never live state (that is `StatusWord`). | `BadgeProps` |
| `MenuButton`, `SplitButton` | The actions dropdown of VERBS on the native `popover` top layer. | `MenuItem`, `MenuItemSpec`, `MenuButtonProps`, `SplitButtonProps` |
| `Popover` | B42 — a few controls parked beside their trigger, non-modal, focus never trapped. | `PopoverProps` |
| `Tooltip` | One line of supplementary context via the `popover` attribute. | — |
| `EmptyState` | One soft sentence + one primary action. | — |
| `SearchCommand`, `useSearchCommand` | The ⌘K palette — the keyboard front door to everything. It NAVIGATES (`SearchField` filters). | `CommandItem` |
| `Skeleton`, `SkeletonGate` | Static wall-colored blocks matching target anatomy (no shimmer, 300ms gate) — FIRST paint. | — |
| `Spinner`, `Busy` | The one continuous animation; `Busy` names what a region is fetching. Not first paint — that is `Skeleton`. | `SpinnerProps`, `BusyProps` |
| `Accordion` | Native `<details>` sections with a mono meta column — fold SECONDARY detail away. | `AccordionProps`, `AccordionSection` |
| `DescriptionList` | A real `<dl>`: labelled facts about ONE record, in the table-header voice. | `DescriptionListProps`, `DescriptionRow` |
| `Divider` | A hairline, or a rule carrying mono uppercase text ("OR", "DANGER ZONE"). | `DividerProps` |
| `Avatar`, `AvatarGroup` | Initials (or a real photo) beside a name — never the sole carrier of it. | `AvatarProps`, `AvatarGroupProps` |
| `Kbd` | A key, printed — real `<kbd>` caps, never clickable, never an unbound shortcut. | `KbdProps` |
| `Tabs`, `TabPanel` | B38 — switches a WHOLE CONTENT REGION of the sheet (`CardTabs` filters one card; `BandSubTabs` navigate). Cap five. | `Tab`, `TabsProps`, `TabPanelProps` |
| `Stepper` | Position in a named sequence — a STATEMENT, not a control. Max five steps. | `Step`, `StepperProps` |
| `TreeList` | The full ARIA tree pattern for a hierarchy whose DEPTH is the information. | `TreeNode`, `TreeListProps` |
| `Timeline` | One record's life in order, including what has NOT happened yet (`ActivityList` is the flat live feed). | `TimelineItem`, `TimelineTone`, `TimelineProps` |
| `CodeBlock` | Code printed exactly as it must be typed — no syntax highlighting, ever. | `CodeBlockProps` |
| `Prose` | B45 — the second type ramp, scoped to running copy the system did not author. | `ProseProps` |

### Forms — honest inputs (B11 chrome throughout)

| Import | One job | Type exports |
| --- | --- | --- |
| `Field`, `Select`, `Checkbox`, `Radio`, `Toggle` | Collect one value per control, honestly labeled (labels above, seed focus, fix-it errors). | — |
| `Combobox` | The searchable select past ~10 options. `multiple` gives a `string[]` whose selection is STATED in a mono line, never worn as pills. | `ComboOption`, `ComboboxProps` |
| `SearchField` | Filter a set ALREADY on screen by typing, with a live "n of m" line. | `SearchFieldProps` |
| `FileField` | Attach files and state each one's state. Owns NO transport. | `FileRow`, `FileStatus`, `FileFieldProps` |
| `NumberField` | A bounded QUANTITY: −/+ pair, enforced clamping, the unit beside the field. | `NumberFieldProps` |
| `Slider` | A value whose POSITION in a range matters more than its digits. No filled track. | `SliderProps` |
| `DateRangeField`, `presetRange` | A date range with no month grid (F4) — mono presets + two native date inputs. | `DateRange`, `DateRangePreset`, `DateRangeFieldProps` |
| `PinField` | A short fixed-length code — one semantic input behind 4–8 boxes. | `PinFieldProps`, `PinCharset` |
| `SocialButton` | Hand authentication to one named provider; the mark is one `currentColor` path. | `SocialButtonProps`, `SocialProvider` |

### Marketing — the public surface (v0.5, B47–B51)

These five set the display steps, and **firewall rule 17 fences `--sv-display-1|2|3` to `tokens.css` plus `masthead.css`, `cta.css` and `proof-row.css`**. A product screen imports none of them; the product ramp still tops out at 27px.

| Import | One job | Type exports |
| --- | --- | --- |
| `Masthead` | Open a public page with the claim, set in type. No image, video or background slot — ever. | `MastheadProps` |
| `FeatureList` | State what the product does, one item at a time. A statement, never a control. | `FeatureItem`, `FeatureListProps` |
| `CallToAction` | Name the one act the page wants — exactly ONE primary. `tone="paper"` or `"band"`. | `CallToActionProps` |
| `ProofRow` | The few figures that prove the claim. Not a `StatS1`: no card, no icon, no delta. | `ProofItem`, `ProofRowProps` |
| `SiteFooter` | Close a public page — one `<nav aria-label="Footer">`, up to four groups of six links. | `FooterGroup`, `FooterLink`, `SiteFooterProps` |

---

## Install via shadcn registry

In any React project that has a `components.json`:

```bash
npx shadcn@latest add https://76.zifala.com/r/skeleton.json
# any item by slug: button, stat-s1, data-table, meter-list, field, dialog, tooltip, …
```

What an item carries and does:

- **Files**: its component `.tsx` + scoped `.css` pair (some items pull extra files — e.g. `stat-s1` also pulls `card`).
- **Tokens dependency**: every item lists `tokens.json` as a `registryDependency`, so installing any component also installs the foundation — `styles/tokens.css`, `styles/base.css`, `lib/cx.ts` — once.
- **Alias rewriting**: imports (`@/lib/cx`, `@/components/...`) are rewritten through the consumer's `components.json` aliases on install. You own the code afterward.
- **Docs link**: each item's `docs` points at `https://76.zifala.com/llms/<slug>.md`.

Registry slugs (from `public/r/registry.json` — 1 theme + 52 components + 22 blocks/templates):

- theme: `tokens`
- chrome: `band`, `sheet`, `plate`, `split`
- widgets: `stat-s1`, `progress`, `trend`, `meter-list`, `distribution-strip`, `data-table`, `card-tabs`, `activity-list`
- primitives: `button`, `status-word`, `card`, `dialog`, `drawer`, `toast`, `banner`, `badge`, `menu`, `popover`, `tooltip`, `empty-state`, `skeleton`, `spinner`, `search-command`, `accordion`, `description-list`, `divider`, `avatar`, `kbd`, `tabs`, `stepper`, `tree-list`, `timeline`, `code-block`, `prose`
- forms: `field` (installs Field/Select/Checkbox/Radio/Toggle together), `combobox`, `search-field`, `file-field`, `number-field`, `slider`, `date-range-field`, `pin-field`, `social-button`
- marketing: `masthead`, `feature-list`, `cta`, `proof-row`, `site-footer`
- compositions: 7 `block-*` items and 15 `template-*` items (dashboards, auth screens, marketing home, pricing page)

**Manual path** (no shadcn CLI): copy `styles/tokens.css`, `styles/base.css`, and `lib/cx.ts` once, then copy any component `.tsx`/`.css` pair from `components/seventy-six/`.

---

## Import usage

Real prop shapes — compose the chrome, then drop a widget row over the band edge with `overlap`:

```tsx
import { Band, BandTopbar, BandNav, PageHero } from '@/components/seventy-six/band';
import { Sheet, Row } from '@/components/seventy-six/sheet';
import { StatS1 } from '@/components/seventy-six/stat-s1';
import { Boxes } from 'lucide-react';

export function OrdersPage() {
  return (
    <>
      <Band>
        <BandTopbar
          app="Warehouse"
          nav={
            <BandNav
              items={[
                { label: 'Overview', href: '/', active: true },
                { label: 'Orders', href: '/orders' },
              ]}
            />
          }
        />
        <PageHero
          title="Orders"
          titleSoft="this month"
          context="Jul 2026 · all regions · synced 2m ago"
        />
      </Band>

      <Sheet>
        <Row split="stats" overlap>
          <StatS1
            label="REVENUE · MTD"
            value="$482,190"
            delta={12.4}
            icon={<Boxes size={16} strokeWidth={1.5} />}
            footnote={<>vs. target <b>$450,000</b></>}
            footnoteText="versus target 450,000"
          />
        </Row>
      </Sheet>
    </>
  );
}
```

Notes: `Row split` is `'stats' | 'main' | 'full'` (default `'full'`); exactly **one** `overlap` row per page. `StatS1` requires `label`, `value`, `icon`, `footnote`; `delta` is a signed number (renders ▲/▼). `Band` and `Sheet` spread native HTML attributes. When a real router is present, pass `renderLink` to `BandNav`/`BandSubTabs` instead of raw `<a>`.

---

## Registry & AI layer

Two build steps emit the consumable + AI-readable artifacts (`npm run build` runs both, or `npm run registry` / `npm run llms` individually):

- `public/r/registry.json` — the index; `public/r/<slug>.json` — one installable shadcn item per component, with file contents inlined and `meta` carrying `book`, `job`, `tags`, and `exports`.
- `public/r/tokens.json` — the shared foundation item every component depends on.
- `public/llms.txt` — index for assistants.
- `public/llms/<slug>.md` — the full doc per component, generated from the same data the site renders. The doc-site **"Copy page for AI"** button yields the same markdown.

`REGISTRY_BASE` bakes the absolute base URL at build time:

```bash
REGISTRY_BASE=https://76.zifala.com npm run build
```

This is what stamps `https://76.zifala.com/r/tokens.json` into each item's `registryDependencies` and `https://76.zifala.com/llms/<slug>.md` into `docs`. The repo default in `build-registry.mjs` and `build-llms.mjs` is already `https://76.zifala.com`; set `REGISTRY_BASE` only to bake a different host.

---

## Don't

- **Don't rebuild a widget that already exists.** Need a KPI card → `StatS1`. A table → `DataTable` (+ `FilterBar`/`FilterLine`/`SelectionHead`). Each part against its own maximum → `MeterList`; one total split into shares → `DistributionStrip`. A ⌘K palette → `SearchCommand`; an in-place filter → `SearchField`. Loading shape → `Skeleton`/`SkeletonGate`; a region already holding content → `Busy`. A hierarchy → `TreeList`; one record's history → `Timeline`. Running copy → `Prose`; a snippet → `CodeBlock`. A public page → `Masthead`/`FeatureList`/`CallToAction`/`ProofRow`/`SiteFooter`. Check "The exports" before writing a component.
- **Don't add a component without registering it** in `components/seventy-six/index.ts` **and** the registry (a doc `content/` entry → `public/r/<slug>.json`). An unbarreled, unregistered component is invisible to consumers and to the AI layer.
- **Don't use `--sv-display-1|2|3` outside `tokens.css`, `masthead.css`, `cta.css` and `proof-row.css`** — firewall rule 17. The product ramp tops out at 27px; a dashboard that grows a 64px number has left the system.
- **Don't hardcode color literals** in a component — every color comes from `tokens.css` seeds.
- **Don't import fonts other than Hanken Grotesk / Fragment Mono** (`@fontsource-variable/hanken-grotesk`, `@fontsource/fragment-mono`). Mono is the `sv-mono` voice; tabular numbers are `sv-num`.
