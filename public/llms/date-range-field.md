# DateRangeField · 76° UI (B35)

Two native date inputs, a mono preset row, and a context line — no month grid, ever.

**One job:** Choose a DATE RANGE.
**Category:** forms · **Exports:** DateRangeField, presetRange · **Tags:** date range, date, calendar, presets, filter, form

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/date-range-field.json
```

Manual: copy components/seventy-six/date-range-field.tsx, components/seventy-six/date-range-field.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

Part F is binding here: **76° draws no month grid** (F4). A range is a mono preset row — `7D · 30D · QTD · YTD · CUSTOM` — over two native `<input type="date">` fields welded into one Field, under a mono context line that states what the range actually means: "24 days · ends today".

The browser draws the picker, and it is better than any we would ship: localized, keyboard-complete, screen-reader-tested, and free. What 76° adds is the part that products actually reach for — the presets, which cover the overwhelming majority of selections without opening a picker at all. `presetRange` is exported so a Menu, a URL parameter or a saved view can compute the same ranges.

## Examples

### Presets, fields, context

```tsx
import { DateRangeField } from '@/components/seventy-six';

<DateRangeField
  label="Reporting period"
  value={range}
  onValueChange={setRange}
  today="2026-07-25"
/>
```

### Order enforced

A start after the end is caught by the field itself, in B11 voice.

```tsx
<DateRangeField
  label="Reporting period"
  value={{ from: '2026-07-30', to: '2026-07-02' }}
  onValueChange={setRange}
/>
// → "The start date is after the end date. Move the start date back."
```

## Props

### DateRangeField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The legend of the fieldset; also names each input for screen readers. |
| `value` | `{ from: string; to: string }` | — | ISO YYYY-MM-DD pair. |
| `onValueChange` | `(value: DateRange) => void` | — | Fires on preset click and on either input. |
| `presets` | `DateRangePreset[]` | `['7D','30D','QTD','YTD','CUSTOM']` | Pass a subset to drop any. CUSTOM is always last. |
| `today` | `string` | `today's date` | ISO date the presets count back from — pass it to keep renders deterministic. |
| `context` | `string` | — | Replaces the derived "24 days · ends today" line. |
| `error` | `string` | — | Overrides the built-in start-after-end check. |
| `min / max` | `string` | — | ISO bounds passed to both native inputs. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Walks the presets, then the start field, then the end field. |
| Native | Each date input keeps the browser's own segment editing and picker keys. |

- A real <fieldset>/<legend> groups the pair; each input adds its own aria-label ("Reporting period, start date").
- Presets are buttons with aria-pressed, so the active range is announced as a state, not implied by colour (C5).
- The context line is aria-live="polite" — changing the range announces the new span once.
- The end field takes the start date as its min, so the invalid half of the calendar is unreachable rather than merely rejected.

## Don't

- No month grid, no scheduler, no "compare to previous period" overlay — F4 is binding.
- No relative-only ranges ("Last quarter") without the absolute dates beside them (C9).
- No preset row longer than five; the sixth is a saved view, not a preset.
- No silent clamping of an inverted range — say what is wrong and how to fix it (B11).

## FAQ

**Why refuse a calendar component?**

F4. A month grid carries an internal toolbar and a sub-taxonomy, which by the Part F test makes it a screen, not a part — and the browser already ships an accessible, localized one for free.

**How do I add a fiscal-year preset?**

Compute the range yourself and pass it through onValueChange; presetRange covers the calendar-based four.
