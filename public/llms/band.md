# Band · 76° UI (B1)

The ink chrome zone: topbar with wordmark and horizontal nav, mono sub-tabs, and the page hero.

**One job:** Carry ALL navigation and page context, so the paper below is 100% work.
**Category:** chrome · **Exports:** Band, BandTopbar, BandNav, BandSubTabs, PageHero · **Tags:** header, navigation, topbar, hero, no-sidebar, wordmark, responsive

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/band.json
```

Manual: copy components/seventy-six/band.tsx, components/seventy-six/band.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button, drawer.

## Overview

Every 76° screen is two zones, and this is the first: three stacked rows on `--sv-band` inside a 1280px container. **Topbar:** the 76° wordmark (six in seed, degree mark in band-soft — never omitted), the app name behind a hairline, horizontal nav, and the utility cluster. **Sub-tabs:** the active section's children in mono uppercase, collapsing to nothing when there are none. **PageHero:** the page's single h1 → one soft context line, with page-level actions on the right.

Navigation is horizontal at 1000px and up — a sidebar as the desktop primary nav is still a firewall violation (A2). The active item is white at weight 700 with a 2px seed underline flush to the row hairline; no background fills on nav items, ever.

Below 1000px the nav and sub-tab rows have no honest horizontal home, so they move — whole — into a left **Drawer** (B21) behind a ghost **Menu** trigger in the topbar. The trigger is never icon-only: the three-line glyph is `aria-hidden` decoration beside the word. The drawer lists the primary items and nests the active section's sub-tabs beneath it, indented. The nav never scrolls sideways at any width, and the band survives 320px and 200% zoom with nothing lost (C7).

The hero's 68px bottom padding is load-bearing: it is what the Sheet's first row overlaps into. Stats never render in the hero — numbers live on paper.

## Examples

### Full band composition

```tsx
import { Band, BandTopbar, BandNav, BandSubTabs, PageHero, Button } from '@/components/seventy-six';

<Band>
  <BandTopbar
    app="Warehouse"
    nav={
      <BandNav
        items={[
          { label: 'Overview', href: '/', active: true },
          { label: 'Operations', href: '/ops' },
          { label: 'Inventory', href: '/inventory' },
          { label: 'Reports', href: '/reports' },
        ]}
      />
    }
    utilities={<button className="site-search sv-mono">SEARCH ⌘K</button>}
  />
  <BandSubTabs
    items={[
      { label: 'ORDERS', href: '/ops/orders', active: true },
      { label: 'PICKING', href: '/ops/picking' },
      { label: 'DISPATCH', href: '/ops/dispatch' },
    ]}
  />
  <PageHero
    title="Good afternoon,"
    titleSoft="Warehouse A"
    context="24 JUL · all zones · synced 14:32"
    actions={<Button variant="primary">Create order</Button>}
  />
</Band>
```

## Props

### BandTopbar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `app` | `string` | — | App name after the wordmark hairline. |
| `nav` | `ReactNode` | — | A BandNav. |
| `utilities` | `ReactNode` | — | Right cluster: search trigger, notifications, avatar. The one place icon-only buttons are legal (with aria-label). |

### BandNav / BandSubTabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BandNavItem[]` | — | { label, href, active? }. SubTabs render nothing when empty. |
| `renderLink` | `(item, className, ariaCurrent) => ReactNode` | — | Adapter for router Links — keeps the component router-agnostic. |

### PageHero

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title / titleSoft` | `string` | — | The h1 (27/800); the soft secondary word in band-soft. |
| `context` | `string` | — | One sentence max: date · scope · last sync. |
| `actions` | `ReactNode` | — | Max: one mono range control, two ghosts, ONE primary. |

## Accessibility

- Primary nav is `&lt;nav aria-label="Primary"&gt;`; sub-tabs are `&lt;nav aria-label="Section"&gt;` — they are links that navigate, never ARIA tabs.
- Active state carries three cues: `aria-current="page"`, weight 700, and the underline — never color alone (C5).
- PageHero renders the page's ONE h1. The skip-link lands on the Sheet, the first content after the band.
- Below 1000px the Menu trigger carries `aria-expanded` and `aria-controls` pointing at the drawer's nav, and focus returns to it on every close path — Esc, scrim, close control, or following a link.

## Don't

- No sidebar as the desktop primary navigation. The left drawer below 1000px is the only sanctioned exception, and it is the same B21 Drawer — never a second one.
- No stat numbers in the hero — stats live on paper.
- No third nav level — that becomes CardTabs or a page.
- No bare "76" — the wordmark always carries the degree mark.
- No background fills on nav items; the underline is the state.

## FAQ

**How do I use it with React Router?**

Pass renderLink={(item, className, ariaCurrent) => <Link to={item.href} className={className} aria-current={ariaCurrent}>{item.label}</Link>} — the components stay router-agnostic.

**What if a section has no children?**

Pass an empty items array to BandSubTabs and the row renders nothing — the band simply gets shorter.

**What happens below 1000px?**

Nothing you have to wire. The band hides both rows and BandNav opens a left B21 Drawer instead, carrying the same items and the same renderLink adapter. BandSubTabs hands its items to the drawer through the Band, so the active section's children appear nested under it.

**How many actions can the hero hold?**

The Book's ceiling: one mono range control, two ghost buttons, and one primary. More than that means the page is trying to be two pages.
