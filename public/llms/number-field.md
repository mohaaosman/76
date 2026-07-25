# NumberField · 76° UI (B33)

The quantity input — native number, B11 chrome, a − / + pair, stated unit.

**One job:** Enter a bounded QUANTITY.
**Category:** forms · **Exports:** NumberField · **Tags:** number, stepper, quantity, input, spinner, form

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/number-field.json
```

Manual: copy components/seventy-six/number-field.tsx, components/seventy-six/number-field.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

A native `<input type="number">` wearing B11 chrome — label above, optional hint, an error that says **what** and **how to fix it** — with a square − / + pair replacing the browser spinners, which duplicate the job and cannot be styled to system. The figure is tabular and right-aligned; the unit is stated beside the field in mono, never hidden inside it as a placeholder.

The bounds are enforced, not merely announced: typing past `max` clamps, the − button disables at `min`, and the + at `max`. A control that lets you enter an impossible value and then scolds you for it has failed twice.

## Examples

### Quantity with a unit

```tsx
import { NumberField } from '@/components/seventy-six';

<NumberField
  label="Pallet positions"
  hint="Whole pallets only — partials go on the overflow line."
  value={qty}
  onValueChange={setQty}
  min={1}
  max={48}
  unit="pallets"
/>
```

### Error state

The error names what and how to fix — never "invalid input" (A3).

```tsx
<NumberField
  label="Reorder point"
  value={value}
  onValueChange={setValue}
  error="Reorder point must be below the maximum stock level of 4,700."
/>
```

## Props

### NumberField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Above the field, always. Also names the − / + buttons. |
| `value` | `number` | — | Controlled value. |
| `onValueChange` | `(value: number) => void` | — | Receives the CLAMPED value — never an out-of-bounds one, and never a parse of an empty box. |
| `min` | `number` | `0` | Enforced, not just announced. |
| `max` | `number` | — | Enforced. Defaults to the safe-integer ceiling. |
| `step` | `number` | `1` | What the − / + pair adds and removes. |
| `unit` | `string` | — | Mono uppercase, beside the field — never a placeholder. |
| `hint` | `string` | — | One line under the label stating the rule up front. |
| `error` | `string` | — | What went wrong AND how to fix it. Wires aria-invalid + describedby. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↑ / ↓ | Native step, honouring min/max/step. |
| Tab | Enters the input; the − / + buttons are separate stops with their own labels. |

- The step buttons carry aria-labels naming the object ("Decrease pallet positions") — never bare "+" and "−" (A4).
- The input keeps inputmode="numeric" so touch keyboards open on digits.
- The figure is tabular (A4), so a changing quantity does not shift the field width.
- Errors are wired through aria-describedby with aria-invalid="true", stated below the field (B11).
- Clearing the box leaves it empty while you retype. A number prop cannot express "empty", so the field holds what you typed until blur and reconciles then — `Number('')` is `0`, and 0 is an entry, not an absence.

## Don't

- No unit inside the input as a placeholder — the placeholder is never a label (B11).
- No unbounded stepper on a value that has real bounds; state them and enforce them.
- No stepper for a value people type in full (a price, a year) — that is a plain Field.
- No validation on the first keystroke; blur first, then on change once an error exists (B11).

## FAQ

**Why replace the native spinners?**

They are unstyleable across browsers, invisible on touch, and 12px tall. The − / + pair is the same behaviour at a real hit area (C8).

**Currency?**

A plain Field with a mono prefix. A stepper implies nudging; nobody nudges a price by one cent.
