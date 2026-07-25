# ProofRow · 76° UI (B50)

The figures that carry the claim, between vertical hairlines.

**One job:** State the few figures that prove the claim.
**Category:** marketing · **Exports:** ProofRow · **Tags:** stats, figures, proof, marketing, landing, metrics

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/proof-row.json
```

Manual: copy components/seventy-six/proof-row.tsx, components/seventy-six/proof-row.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

It is **not a StatS1**, and the distinction is written down because it is the only thing stopping someone reaching for one. B3 is the product's signature KPI card: an icon tile, a delta against a comparison period, a footnote that adds information, on paper, in a dashboard. This is a marketing row — no card, no icon, no delta, no comparison. A figure at display size, a mono label under it, on the wall, between vertical hairlines.

The rules between the items are the point. They are what makes four figures read as one row of one page rather than four cards on a wall, and they are the same newspaper measure the whole system is built on.

Ship Gate point 12 governs the content: the figures reconcile, and a number the product cannot substantiate is a defect, not a placeholder.

## Examples

### Four figures

Pre-formatted, tabular, each with a mono label and a line of scope.

```tsx
import { ProofRow } from '@/components/seventy-six';

<ProofRow
  ariaLabel="The system in figures"
  items={[
    { id: 'components', figure: '51', label: 'BOOK SPECS', note: 'B1 to B51, each with one job' },
    { id: 'deps', figure: '0', label: 'RUNTIME DEPS', note: 'React and the platform, nothing else' },
    { id: 'contrast', figure: '4.5:1', label: 'MINIMUM CONTRAST', note: 'Verified on light and dark paper' },
    { id: 'floor', figure: '320px', label: 'LAYOUT FLOOR', note: 'Nothing hidden, nothing scrolled sideways' },
  ]}
/>
```

## Props

### ProofRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ProofItem[]` | — | id · figure (PRE-FORMATTED) · label · optional note. Two to four. |
| `ariaLabel` | `string` | — | Names the row when its section heading is elsewhere. |

## Accessibility

- A real <dl>: each figure is announced with its own label as one pair.
- The figure is visually above its label and still owns the <dd> — the DOM keeps <dt> first and CSS order does the rest, so nothing is announced backwards.
- Figures are tabular (A4) and pre-formatted by the caller, because C9 puts number formatting at the localization layer, never in a component.
- Nothing is aria-hidden: every mark on screen is also information.

## Don't

- Never a delta or an arrow — that is B3, and a public page has no comparison period.
- Never an icon, and never a card per figure.
- Never a figure the product cannot substantiate (Ship Gate point 12).
- Never more than four; a fifth is a table (B7).
- Never a percentage with no absolute anywhere on the page.

## FAQ

**Why not just use StatS1?**

Because a stat card without its delta, its icon tile and its footnote is not a StatS1 — it is a broken one. The anatomy is required, all three zones (B3), and a marketing figure has none of the three.

**Can it live on a dashboard?**

No. It sets display type, and firewall rule 17 rejects --sv-display-* outside the marketing components. A dashboard figure is a StatS1.
