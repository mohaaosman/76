# Tooltip · 76° UI (B18)

The popover attribute in the top layer: ink card, 300ms delay, focus-visible triggers included.

**One job:** Add one line of supplementary context to a control.
**Category:** primitives · **Exports:** Tooltip · **Tags:** tooltip, popover-attribute, top-layer, hover, focus, supplementary

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/tooltip.json
```

Manual: copy components/seventy-six/tooltip.tsx, components/seventy-six/tooltip.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Built on the native `popover` attribute, so the tip renders in the top layer with zero z-index management and zero positioning dependencies. A small placement routine keeps it above the trigger, flipping below when there is no room.

Tooltips are **supplementary only**. If removing the tooltip removes the meaning, the design is wrong — A4 requires every icon to have an adjacent text label or aria-label of its own. The tooltip adds detail (a full timestamp, a keyboard hint), it never substitutes for a label.

## Examples

### On a button

Appears after 300ms of hover, or immediately on keyboard focus — hover-dependence is banned (C8).

```tsx
import { Tooltip, Button } from '@/components/seventy-six';

<Tooltip content="Exports the filtered view · ⌘E">
  <Button variant="ghost">Export July</Button>
</Tooltip>
```

### On an icon-only button

The natural home for a tooltip: an icon affordance carrying a line of metadata. The button still owns its own aria-label — the tooltip supplements, it never becomes the only label (A4).

```tsx
<Tooltip content="Totals exclude tax and shipping · updated 14:32">
  <Button variant="ghost" aria-label="About this total" iconLeading={<InfoIcon />} />
</Tooltip>
```

## Props

### Tooltip

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | — | The supplementary line. Plain text only, 11.5px white on ink. |
| `children` | `ReactElement` | — | A single focusable trigger (button, a). Receives aria-describedby automatically. |
| `delay` | `number` | `300` | Hover delay in ms. Focus shows immediately regardless. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab (focus) | Shows the tooltip immediately; blur hides it. |

- The tip carries `role="tooltip"` and is linked via `aria-describedby` on the trigger.
- Never the sole carrier of a label (A4) — icon-only triggers still need their own aria-label.

## Don't

- No interactive content inside a tooltip — no links, no buttons.
- No tooltip as the only label for an icon button.
- No arrow/beak decoration; the ink card is enough.
- No instant-on hover; the 300ms delay prevents flicker sweeps.

## FAQ

**Why the popover attribute instead of a positioning library?**

popover puts the tip in the browser top layer — above dialogs and sticky headers — with no z-index rules. The only JS needed is a 10-line placement calc, which beats shipping a floating-UI dependency for 11.5px text.

**Does it work for keyboard users?**

Yes — focus shows it immediately (no delay) and blur hides it, per C8's "no hover-dependent functionality" rule.

**Can I put rich content in it?**

No. One line of plain text. Anything richer is a Dialog or in-page disclosure.
