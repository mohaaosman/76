# IndexRow · 76° UI (B56)

The cover's contents strip — numbered sections on vertical hairlines.

**One job:** State a publication's sections as a numbered strip, and link to them.
**Category:** marketing · **Exports:** IndexRow · **Tags:** index, contents, nav, marketing, landing, editorial, sections

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/index-row.json
```

Manual: copy components/seventy-six/index-row.tsx, components/seventy-six/index-row.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A row of cells divided by vertical hairlines, each carrying a display-face ordinal, a label, and an optional mono count — and each a link. It is the magazine cover's table of contents, and it is what makes a public page a **cover** rather than a hero: a cover indexes the pages behind it.

A real `<nav>` around an `<ol>`. Ordered, because the ordinals are the point — an `<ol>` makes them meaning rather than decoration — and the ordinal is derived from POSITION, never passed in. A hand-written number drifts the moment a section is inserted, and a contents page that miscounts itself is worse than an unnumbered one.

**The boundary against B1.** `BandNav` is the app's navigation: always present, `aria-current` on the active item, the thing you move with. IndexRow appears <i>once</i>, on the page that indexes the others, and it states what exists. A product screen never carries one.

## Examples

### The contents strip

Six sections, each a link, each with a mono note on what is behind it.

```tsx
import { IndexRow } from '@/components/seventy-six';

<IndexRow
  ariaLabel="Contents"
  items={[
    { id: 'foundations', label: 'Foundations', href: '/foundations', meta: 'TOKENS' },
    { id: 'components', label: 'Components', href: '/components', meta: '56 SPECS' },
    { id: 'blocks', label: 'Blocks', href: '/blocks', meta: 'SECTIONS' },
    { id: 'templates', label: 'Templates', href: '/templates', meta: 'SCREENS' },
  ]}
/>
```

## Props

### IndexRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `IndexItem[]` | — | id · label · href · optional mono meta. Two to eight. |
| `ariaLabel` | `string` | — | Required — it is navigation, and navigation is named. |
| `renderLink` | `(item, className) => ReactNode` | — | Router adapter, exactly as BandNav takes one. |

## Accessibility

- A real <nav> with a required label around an ordered list, so the count and the order are both announced.
- The ordinal is NOT aria-hidden — copy refers to sections by number, and hiding a visible figure from a screen reader is the asymmetry C5 warns about.
- The anchor is the label, not the whole cell, so the link's accessible name never changes when a section is inserted above it.
- It wraps at 860px and stands up at 560px. It never scrolls sideways — A2's ban is written for the band and reads on every nav-like row.

## Don't

- Never a substitute for the Band; the app's navigation is B1 and it is always present.
- Never more than eight cells — a ninth section is a sitemap page.
- Never a horizontal scroller.
- Never on a product screen.

## FAQ

**IndexRow or BandNav?**

Do you move with it, on every page? That is BandNav. Does it appear once, on the page that indexes the others, to state what exists? That is IndexRow.

**Why is the ordinal in the display face?**

It is the only element in the component that is not language — it is the cover's device. Set in 10px mono it would be B48's ordinal, and IndexRow would differ from a FeatureList by layout alone. It is fixed at 20px, below the 27px h1, so the strip can never speak above the claim above it.
