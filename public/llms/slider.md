# Slider · 76° UI (B34)

A native range in 76° clothes — position matters, and the number is still printed.

**One job:** Set a value whose POSITION in a range matters more than its digits.
**Category:** forms · **Exports:** Slider · **Tags:** slider, range, threshold, input, form

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/slider.json
```

Manual: copy components/seventy-six/slider.tsx, components/seventy-six/slider.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

A native `<input type="range">` on the B4 bar geometry: a 3px track, a 14px seed thumb, the standard focus ring. Keyboard, touch and screen-reader behaviour are the platform's, unmodified.

The readout is not optional. B4's rule holds here — the bar illustrates, the printed figure informs — so the mono value sits beside the label and updates as the thumb moves. Note what is missing: there is no filled track, because a two-tone fill needs a gradient and gradients are banned (A1). The number carries what the fill would have.

## Examples

### Threshold with a formatted readout

```tsx
import { Slider } from '@/components/seventy-six';

<Slider
  label="Alert threshold"
  hint="Below this, the warehouse raises a replenishment task."
  value={threshold}
  onValueChange={setThreshold}
  min={0}
  max={100}
  step={5}
  format={(v) => `${v}%`}
/>
```

## Props

### Slider

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Above the track, with the readout on the same line. |
| `value` | `number` | — | Controlled value. |
| `onValueChange` | `(value: number) => void` | — | Fires on every input event. |
| `min` | `number` | `0` | Range floor. |
| `max` | `number` | `100` | Range ceiling. |
| `step` | `number` | `1` | Granularity — coarse steps beat false precision. |
| `format` | `(value: number) => string` | — | Formats the readout AND aria-valuetext. |
| `hint` | `string` | — | One line stating what the value does. |

## Accessibility

| Keys | Action |
| --- | --- |
| ← / → | Moves by one step (native). |
| Home / End | Jumps to min / max (native). |

- Native range semantics: role="slider" with valuemin/max/now supplied by the element itself.
- When format is given it also becomes aria-valuetext, so "40%" is announced rather than "40".
- The printed readout is aria-hidden — the input already announces its value, and twice is noise.
- The thumb is 14px with a 2px offset focus ring (C3); on touch the whole 14px row is draggable.
- The track uses `--sv-field-line-strong`, not B4's wall: with no fill to identify it, the track IS the affordance and owes the 3:1 non-text bar (1.4.11). Wall would be 1.06:1 on paper.

## Don't

- No slider for a value people know exactly — that is a NumberField (B33).
- No dual-thumb range slider; two bounds are two fields (see B35 for dates).
- No hiding the number: a bar with no figure states nothing (B4).
- No gradient fill on the track, ever (A1).

## FAQ

**Why no filled track?**

It requires a gradient, which A1 bans outright. The printed value carries the information the fill would have, at AA contrast, at any zoom.

**Slider or NumberField?**

Ask whether the exact digits matter. Threshold, weighting, opacity: Slider. Quantity, reorder point, headcount: NumberField.
