# Sheet & Row · 76° UI (B2)

The platinum wall and its 12-col grid — including the signature -44px overlap row.

**One job:** Hold the paper: grid, gutters, and the one overlap per page.
**Category:** chrome · **Exports:** Sheet, Row · **Tags:** layout, grid, main, overlap, wall, responsive

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/sheet.json
```

Manual: copy components/seventy-six/sheet.tsx, components/seventy-six/sheet.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Sheet is the `<main>` — the wall the paper hangs on, sharing the band's 1280px container and side padding. Row is the grid: 14px gutters with three canonical splits — **stats** (4×1fr, folding to 2×2 below 1000px), **main** (1.7fr/1fr), and **full**.

The signature move: the first row of every top-level page carries `overlap`, pulling the paper -44px up over the band edge. Exactly one overlap row per page — it is a signature, not a repeating trick.

## Examples

### The canonical overview skeleton

```tsx
import { Sheet, Row } from '@/components/seventy-six';

<Sheet>
  <Row split="stats" overlap>
    {/* four StatS1 cards */}
  </Row>
  <Row split="main">
    {/* Trend card · MeterList card */}
  </Row>
  <Row split="main">
    {/* DataTable card · ActivityList card */}
  </Row>
</Sheet>
```

## Props

### Row

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `split` | `'stats' | 'main' | 'full'` | `'full'` | The canonical grid splits. |
| `overlap` | `boolean` | `false` | The single -44px overlap row. One per page. |

## Accessibility

- Sheet renders `<main id="sv-content">` — the skip-link target and the screen-reader main landmark.
- Focus order: the overlap row is the first content stop after the band (C3).

## Don't

- No second overlap row on the same page.
- No custom grid fractions per screen — compose from the three splits.
- No cards touching: 14px minimum gap is structural.

## FAQ

**Can I nest Rows?**

A Row cell can contain a stack of cards (grid rows form naturally), but never a second Row grid — if a region needs its own grid, it is probably its own page section.

**What happens below 1000px?**

stats folds to 2×2, main stacks to one column, side padding drops to 18px — all built into the two components.
