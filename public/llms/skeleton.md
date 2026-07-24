# Skeleton · 76° UI (B17)

Static wall-colored blocks matching the target anatomy. No shimmer, no pulse, 300ms gate.

**One job:** Hold the exact shape of content that is still loading.
**Category:** primitives · **Exports:** Skeleton, SkeletonGate · **Tags:** skeleton, loading, no-shimmer, static-placeholder

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/skeleton.json
```

Manual: copy components/seventy-six/skeleton.tsx, components/seventy-six/skeleton.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Skeletons mirror the anatomy of what they replace — an S1 skeleton has three zones, a table skeleton has rows. They are static `--sv-wall` blocks: shimmer animations are a firewall violation (A2), and a calm system does not vibrate while it waits.

**SkeletonGate** implements the 300ms rule: nothing skeleton-shaped appears until the wait has lasted 300ms, so fast loads never flash.

## Examples

### An S1-shaped skeleton

```tsx
import { Skeleton, SkeletonGate, Card } from '@/components/seventy-six';

<SkeletonGate>
  <Card>
    <div className="stat-skeleton">
      <Skeleton width={120} height={10} />
      <div className="stat-skeleton__mid">
        <Skeleton width={34} height={34} />
        <Skeleton width={96} height={24} />
      </div>
      <Skeleton height={12} />
    </div>
  </Card>
</SkeletonGate>
```

## Props

### Skeleton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number | string` | `'100%'` | Block width. |
| `height` | `number | string` | `12` | Block height. |
| `round` | `boolean` | `false` | 50% radius for avatar ghosts. |

### SkeletonGate

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The skeleton composition; renders only after 300ms. |

## Accessibility

- Skeletons are `aria-hidden` — the loading state is communicated by the surrounding region (e.g. the table's polite live region), not by placeholder blocks.

## Don't

- No shimmer, no pulse, no gradient sweeps (A1/A2).
- No generic gray rectangles — match the target component's anatomy.
- No skeleton for waits under 300ms; use SkeletonGate.

## FAQ

**Why no shimmer?**

Shimmer is decoration pretending to be progress. The Book bans it (A2); the static block communicates "content belongs here" with zero motion cost.

**How do I announce loading to screen readers?**

Through the owning region: DataTable's aria-live announcement ("Loading orders…"), or aria-busy on the section. Skeletons themselves stay hidden.
