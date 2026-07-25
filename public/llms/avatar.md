# Avatar · 76° UI (B30)

A person, named — initials on wall, or their photo if the product has one.

**One job:** Identify a PERSON beside their name.
**Category:** primitives · **Exports:** Avatar, AvatarGroup · **Tags:** avatar, initials, people, assignee, group, stack

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/avatar.json
```

Manual: copy components/seventy-six/avatar.tsx, components/seventy-six/avatar.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Initials derived from the name, on wall, at 24/32/44px. A photo only when the product genuinely holds one — never a generic silhouette, never a stock face (A2, F11). The seed tone marks the current user or the active member, one per group like everything seed touches.

**AvatarGroup** overlaps a capped stack and states the remainder in mono ("+7"). The full list is a Drawer or a table, never a hover: hover is enhancement only (C8), so nothing may live there alone.

## Examples

### Faces and a stack

```tsx
import { Avatar, AvatarGroup } from '@/components/seventy-six';

<Avatar name="Amina Yusuf" />
<Avatar name="Karl Berg" tone="seed" size="lg" />
<AvatarGroup people={[{ name: 'Amina Yusuf' }, { name: 'Karl Berg' }, …]} max={4} />
```

## Props

### Avatar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The full name. Initials and the accessible name both come from it. |
| `src` | `string` | — | Photo URL. Renders an <img> with the name as alt. |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | 24 · 32 · 44px. |
| `tone` | `'neutral' | 'seed'` | `'neutral'` | seed marks the current user — one per group. |

### AvatarGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `people` | `{ name: string; src?: string }[]` | — | In display order — most relevant first. |
| `max` | `number` | `4` | Faces shown before the mono overflow count. |
| `size` | `'sm' | 'md'` | `'sm'` | Stacks stay small; 44px is for a profile head. |

## Accessibility

- An initials avatar is role="img" with the full name as its label; the initials themselves are aria-hidden.
- A photo avatar carries the name as alt text — never an empty alt, never "avatar".
- The overflow chip is labelled "N more"; the names it hides are reachable in the list it summarises (A4).
- Avatars never move on hover — images do not animate in 76° (Part E).

## Don't

- No avatar as the only carrier of a name — the name is always beside it (A4).
- No generic silhouette placeholder; a person with no photo gets their initials.
- No status dot welded onto an avatar — presence is a StatusWord (B12) beside the name.
- No group larger than the cap; the full list is a Drawer, not a tooltip.

## FAQ

**Why initials rather than a placeholder image?**

Initials are real information at any size and cost no request. A silhouette states nothing and reads as a broken image.

**Company logos?**

Out of taxonomy. A company is a Badge (B23) or a name in a cell — the avatar identifies a person.
