# Forms · 76° UI (B11)

Field, Select, Checkbox, Radio, Toggle — labels above, seed focus without glow, errors that say how to fix.

**One job:** Collect one value per control, honestly labeled.
**Category:** forms · **Exports:** Field, Select, Checkbox, Radio, Toggle · **Tags:** form, input, select, checkbox, radio, toggle, switch, validation, error-message

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/field.json
```

Manual: copy components/seventy-six/field.tsx, components/seventy-six/field.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Every control follows the same skeleton: a 12/600 label above (the placeholder is **never** a substitute), an optional 11.5 hint, the control itself — white with a hairline border, radius 4 — and, when needed, an error line in functional red stating **what went wrong and how to fix it**: "Quantity must be a whole number above 0."

Focus is a 1.5px seed border with no glow ring. Validation timing is fixed system-wide: on blur, then on change after the first error — never on the first keystroke. Submit failures render a top-of-form error summary that links to each field and takes focus.

**Select stays native** until a searchable combobox is genuinely required (then the full ARIA combobox pattern, as its own registered component). **Toggle** is only for instant-effect settings — anything that waits for "Save" is a Checkbox.

## Examples

### A complete form group

```tsx
import { Field, Select, Checkbox, Toggle } from '@/components/seventy-six';

<Field
  label="Quantity"
  hint="Whole units, per carton"
  required
  inputMode="numeric"
  placeholder="0"
/>
<Select label="Zone" required defaultValue="a">
  <option value="a">Zone A · ambient</option>
  <option value="b">Zone B · chilled</option>
</Select>
<Checkbox label="Notify the picking team" defaultChecked />
<Toggle label="Auto-print labels" />
```

### Error state

The error is text a colleague would say — what and how to fix — wired via aria-describedby and aria-invalid.

```tsx
<Field
  label="Quantity"
  required
  defaultValue="-2"
  error="Quantity must be a whole number above 0"
/>
```

## Props

### Field / Select (shared chrome)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The visible label. Required — placeholders never substitute. |
| `hint` | `string` | — | 11.5 soft line under the label. |
| `error` | `string` | — | What went wrong and how to fix it. Sets aria-invalid + describedby. |
| `required` | `boolean` | — | Mono * after the label + native required. |
| `…rest` | `native input/select props` | — | value, onChange, type, inputMode, disabled… |

### Checkbox / Radio / Toggle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Part of the hit area, always. |
| `…rest` | `native input props` | — | checked, defaultChecked, onChange, name, disabled… |

## Accessibility

| Keys | Action |
| --- | --- |
| Space | Toggles Checkbox / Toggle; opens native Select. |
| ↑ / ↓ | Moves within a Radio group / native Select options. |

- Every control is a real native input — Checkbox, Radio, and Toggle are visually-hidden inputs with styled proxies, so form posts, autofill, and AT all behave.
- Toggle carries `role="switch"`; its state is announced as on/off.
- Errors are announced via `aria-describedby` the moment they render; required fields carry both the mono * and the attribute (C5).

## Don't

- No placeholder-as-label. The label is above the field, always.
- No focus glow rings; the border change is the focus state.
- No validation on first keystroke.
- No error toasts — errors render at the field (A2).
- No Toggle for anything that needs a Save button.
- No custom dropdown until a searchable combobox is genuinely required.

## FAQ

**How do I mark a field required?**

Pass required — it renders the mono asterisk after the label and sets the native attribute, satisfying the C5 double-cue rule.

**How should error copy read?**

State what and how to fix, no blame, no "Please" openers: "Quantity must be a whole number above 0". The A3 copy rules are enforced in review.

**Toggle or Checkbox?**

Does flipping it take effect instantly? Toggle. Does it wait for a Save/Submit? Checkbox. This is behavioral, not aesthetic.

**Where is the combobox?**

Deliberately absent. Native Select covers v1; a searchable ARIA combobox joins the Book as its own registered component (with Radix as a candidate foundation) when a real product needs one.
