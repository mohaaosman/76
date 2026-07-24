# Badge · 76° UI (B23)

A small mono tag for category metadata — never status, never numbers that matter.

**One job:** Name the CATEGORY a thing belongs to.
**Category:** primitives · **Exports:** Badge · **Tags:** badge, tag, chip, label, category, mono

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/badge.json
```

Manual: copy components/seventy-six/badge.tsx, components/seventy-six/badge.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A Badge names a category: environment (`PROD`), plan (`ENTERPRISE`), record type (`B2B`), version (`V2`). It speaks mono uppercase like all 76° metadata, on a wall-toned rectilinear chip — never a pill, pills are banned.

The boundary is sharp: live state is a **StatusWord** (dot + word), and quantities are stats or table cells. If it can change while you watch, it is not a Badge. The seed tone marks the current/active category — one per group, like everything seed touches.

## Examples

### Category tags

```tsx
import { Badge } from '@/components/seventy-six';

<Badge>B2B</Badge>
<Badge>EU-WEST</Badge>
<Badge tone="seed">CURRENT PLAN</Badge>
```

## Props

### Badge

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Short mono uppercase text — 1–3 words. |
| `tone` | `'neutral' | 'seed'` | `'neutral'` | seed marks the current/active category — one per group. |

## Accessibility

- Badges are text — no ARIA needed; they read inline where they sit.
- The seed tone is supplementary; the words alone carry the category (C2).

## Don't

- No status in a Badge — live state is a StatusWord.
- No counts in a Badge — numbers that matter are stats or cells.
- No pill radius; the Badge is rectilinear like the rest of the system.
- No badge rainbows — neutral, plus at most one seed per group.

## FAQ

**Badge or StatusWord?**

Can it change while you watch? StatusWord. Is it a fixed classification? Badge. "SYNCING" is status; "EU-WEST" is category.
