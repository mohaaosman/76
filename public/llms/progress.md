# Progress · 76° UI (B4)

Value against target with one 3px bar. The numbers are the information; the bar is illustration.

**One job:** Answer "how far along."
**Category:** widgets · **Exports:** Progress · **Tags:** progress, target, goal, bar, progressbar

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/progress.json
```

Manual: copy components/seventy-six/progress.tsx, components/seventy-six/progress.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Soft title, a 19/700 tabular "current / target" line, a 3px seed bar on a wall track, and a faint context line. The fill transitions width once (160ms) and never animates on load beyond that.

Danger is a word, not a bar: there is no red fill state. If something is overdue it belongs in a table or list with a StatusWord, not in a meter.

## Examples

### Target progress

```tsx
import { Progress } from '@/components/seventy-six';

<Progress
  title="July revenue target"
  current={482190}
  target={610000}
  format={(c, t) => `$${(c / 1000).toFixed(0)}K / $${(t / 1000).toFixed(0)}K`}
  context="79% · 7 days remaining"
/>
```

## Props

### Progress

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Soft 12/500 title. |
| `current / target` | `number` | — | The real values; also drive aria-valuenow/max. |
| `format` | `(c, t) => string` | `localized "c / t"` | Renders the value line. |
| `context` | `string` | — | Faint line under the bar — percentage lives here, never alone. |

## Accessibility

- `role="progressbar"` with real aria-valuenow/min/max and an aria-label from the title.
- The visible numbers carry the information; the bar could disappear and nothing would be lost.

## Don't

- No percentages without absolute numbers somewhere in the card.
- No red bars; overdue items go to a table, not a meter.
- No load animations beyond the single 160ms width transition.

## FAQ

**Can the bar exceed 100%?**

The fill clamps at 100%; overachievement is stated in the context line ("104% of target"), where it is information rather than decoration.

**When do I use Progress vs MeterList?**

One goal → Progress. Several named parts each with capacity → MeterList.
