# CaptionRow · 76° UI (B57)

Up to four short fragments spread across one rule.

**One job:** State up to four short captions across one rule.
**Category:** marketing · **Exports:** CaptionRow · **Tags:** caption, marketing, landing, editorial, specimen

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/caption-row.json
```

Manual: copy components/seventy-six/caption-row.tsx, components/seventy-six/caption-row.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

The travel poster's `never too · far away · always there` line: three or four fragments spread across the full measure on a single hairline, under the thing they caption. In 76° the thing above them is a **live component specimen**, so the captions say what the reader is actually looking at.

Each caption is a PHRASE, not a sentence. Four is the cap — a fifth is a B48 **FeatureList**, which is the component for itemising a claim.

**It is the accent's one non-fill, non-link use on the public surface.** F14 governs the seed FILL, and the argument there is about mass: a rectangle competes with a button. A 12.5px line has no area, so at the squint test the row blurs to a grey rule while the one seed rectangle on the page stays the only coloured object. What the seed buys is the row's job — saying <i>this, here, deliberately</i> about a specimen made of the same neutrals as everything else on the wall.

## Examples

### Under a specimen

Three fragments, evenly spread, on the rule that separates them from the plate above.

```tsx
import { CaptionRow } from '@/components/seventy-six';

<CaptionRow
  captions={['never a screenshot', 'always the shipped code', 'figures that reconcile']}
/>
```

## Props

### CaptionRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `captions` | `string[]` | — | Two to four short fragments. Each is a phrase, not a sentence. |
| `rule` | `'top' | 'bottom' | 'none'` | `'top'` | Which edge carries the hairline. Top captions the block above. |

## Accessibility

- A real paragraph per caption — they are read in order, left to right, exactly as they are set.
- Nothing is aria-hidden and nothing is a link: the row states, it does not navigate.
- It stacks below 560px rather than compressing, so no fragment ever wraps mid-phrase (C7).

## Don't

- Never a sentence — a sentence under a specimen is a caption that became a paragraph, and a paragraph is B45 Prose.
- Never a link; it states, it does not navigate.
- Never more than four; a fifth is a B48 FeatureList.
- Never used as navigation.

## FAQ

**Why is it seed and not ink-soft?**

Because in ink-soft it reads as a footnote under a widget. The row's job is to say "this, here, deliberately" about a specimen otherwise made of the same neutrals as the rest of the wall. F14 is an argument about mass, and a 12.5px line has none.

**CaptionRow or FeatureList?**

Is each item a phrase describing the thing above it? CaptionRow. Is each item a capability with a title and a sentence? That is B48.
