# library.md — the built React library (`seventy-six-ui`)

Purpose: when you work in React, **consume** these components — don't rebuild what already ships. Every widget below exists, is exported, and installs via the shadcn registry. Reach for the export first; only compose new UI from primitives when no widget covers the job.

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
  components/seventy-six/      the library — ONE component per widget type
    index.ts                   the export barrel (source of truth for names below)
    band.tsx  band.css         chrome
    sheet.tsx sheet.css        chrome
    card.tsx  card.css         chrome / paper primitive
    stat-s1.tsx  ...           widgets (each is a .tsx + scoped .css pair)
    ...                        progress, trend, meter-list, data-table, card-tabs, activity-list
    button.tsx ...             primitives (button, status-word, field, dialog, toast,
                               empty-state, search-command, skeleton, tooltip)
  docs/
    content/                   pure-data doc entries → drive site + markdown + registry
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
| `Sheet`, `Row` | The platinum wall + its 12-col grid, including the one signature `-44px` overlap row per page. | — |
| `Card`, `CardHead` | The paper primitive: one shadow, one radius, zero border. Every widget composes it. | — |

### Widgets — the answer-a-question units

| Import | One job | Type exports |
| --- | --- | --- |
| `StatS1` | The signature stat and the ONLY legal KPI card — "how much, and so what." | `StatS1Props` |
| `Progress` | Value against target with one 3px bar — "how far along." | — |
| `Trend` | Flat single-weight SVG lines on a hairline grid — "which direction." | `TrendSeries` |
| `MeterList` | Named items with 3px bars + mandatory absolute numbers (the donut's replacement). | `MeterItem` |
| `DataTable` | The ERP workhorse: mono headers/IDs, dot+word statuses, tabular numbers, keyboard contract. | `Column` |
| `CardTabs` | In-card filter tabs on the card hairline — filter one card's content in place. | `CardTab` |
| `ActivityList` | Mono timestamp column beside sentence rows with bold entities — "what needs me." | `ActivityItem` |

### Primitives — the atoms widgets and pages compose

| Import | One job | Type exports |
| --- | --- | --- |
| `Button`, `ButtonLink` | Native `<button>`, four registered variants, one primary per region. | `ButtonProps`, `ButtonVariant` |
| `StatusWord` | A 6px currentColor dot + a colored word — one thing's status, one word. | `StatusTone` |
| `Field`, `Select`, `Checkbox`, `Radio`, `Toggle` | Collect one value per control, honestly labeled (labels above, seed focus, fix-it errors). | — |
| `Dialog` | Native `<dialog>` in a paper card — interrupt for one decision or form. | — |
| `ToastProvider`, `useToast` | Bottom-left slips for success/neutral only — errors render inline at source. | — |
| `EmptyState` | One soft sentence + one primary action. | — |
| `SearchCommand`, `useSearchCommand` | The ⌘K palette — the keyboard front door to everything. | `CommandItem` |
| `Skeleton`, `SkeletonGate` | Static wall-colored blocks matching target anatomy (no shimmer, 300ms gate). | — |
| `Tooltip` | One line of supplementary context via the `popover` attribute. | — |

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

Registry slugs (from `public/r/registry.json`): `tokens` (theme) · chrome `band`, `sheet`, `card` · widgets `stat-s1`, `progress`, `trend`, `meter-list`, `data-table`, `card-tabs`, `activity-list` · primitives `button`, `status-word`, `dialog`, `toast`, `tooltip`, `empty-state`, `skeleton`, `search-command` · forms `field` (installs Field/Select/Checkbox/Radio/Toggle together).

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
          breadcrumb={['OPERATIONS', 'ORDERS']}
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

- **Don't rebuild a widget that already exists.** Need a KPI card → `StatS1`. A table → `DataTable`. Part-by-part breakdown → `MeterList`. A ⌘K palette → `SearchCommand`. Loading shape → `Skeleton`/`SkeletonGate`. Check "The exports" before writing a component.
- **Don't add a component without registering it** in `components/seventy-six/index.ts` **and** the registry (a doc `content/` entry → `public/r/<slug>.json`). An unbarreled, unregistered component is invisible to consumers and to the AI layer.
- **Don't hardcode color literals** in a component — every color comes from `tokens.css` seeds.
- **Don't import fonts other than Hanken Grotesk / Fragment Mono** (`@fontsource-variable/hanken-grotesk`, `@fontsource/fragment-mono`). Mono is the `sv-mono` voice; tabular numbers are `sv-num`.
