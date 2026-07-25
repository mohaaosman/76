# PinField · 76° UI (B25)

The verification-code input — N boxes that are one value, with B11 field chrome.

**One job:** Enter a short fixed-length code.
**Category:** forms · **Exports:** PinField · **Tags:** pin, otp, one-time-code, 2fa, verification, invite-code

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/pin-field.json
```

Manual: copy components/seventy-six/pin-field.tsx, components/seventy-six/pin-field.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

OTP, 2FA, invite code: 4–8 fixed single-character boxes (default 6), wearing B11 field chrome verbatim — label above, optional hint naming the delivery and the window, an error that says **what** and **how to fix it**.

The boxes are a **view of one string**. They sit in a `role="group"` labelled by the field label, so the error is announced once by the chrome instead of once per box, and the value posts as a single form field via `name`. Every box carries `autocomplete="one-time-code"`, so SMS autofill lands wherever the platform drops it.

Paste is the interaction it lives or dies on. A payload as long as the field is treated as the whole code and fills from box one, whichever box received it; anything shorter overwrites from the box that was focused. Separators and spaces are stripped, so `123-456` and `123 456` paste clean.

## Examples

### Six-digit verification code

```tsx
import { useState } from 'react';
import { PinField, Button } from '@/components/seventy-six';

const [code, setCode] = useState('');

<PinField
  label="Verification code"
  hint="Six digits, valid for 10 minutes"
  value={code}
  onChange={setCode}
  onComplete={(full) => verify(full)}
  autoFocus
/>
<Button type="submit" variant="primary" style={{ width: '100%' }}>
  Verify email
</Button>
```

### The code fails as a unit

Every box takes the bad border — never one character. The error states what and how to fix.

```tsx
<PinField
  label="Verification code"
  hint="Six digits, valid for 10 minutes"
  value={code}
  onChange={edit}
  error="That code did not match. Retype it from the email, or resend the code."
/>
```

### Alphanumeric invite code

charset="alphanumeric" allows letters and drops the numeric keypad hint; length clamps to 4–8.

```tsx
<PinField
  label="Invitation code"
  length={8}
  charset="alphanumeric"
  hint="Eight characters from the invitation email"
  name="invite_code"
  onComplete={submitInvite}
/>
```

## Props

### PinField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label above the row — never replaced by the boxes (B11). |
| `length` | `number` | `6` | Box count, truncated and clamped to 4–8. |
| `charset` | `'numeric' | 'alphanumeric'` | `'numeric'` | numeric drives the phone keypad (inputmode + pattern); alphanumeric allows letters. Everything outside the charset is dropped. |
| `value / onChange` | `string / (value: string) => void` | — | Controlled code as ONE string. Omit value for uncontrolled. |
| `defaultValue` | `string` | — | Uncontrolled starting value, sanitized to the charset and length. |
| `onComplete` | `(value: string) => void` | — | Fires the moment every box is filled, with the complete code. |
| `error / hint / required` | `string / string / boolean` | — | B11 field chrome; error sets aria-invalid on the boxes and describes the group. |
| `disabled / autoFocus` | `boolean / boolean` | — | Locks every box; autoFocus applies to the first box only. |
| `name` | `string` | — | Renders a hidden input posting the whole code as one form value. |
| `id` | `string` | — | Base id; boxes are <code>{id}-0…n</code> and the label points at box 0. |

## Accessibility

| Keys | Action |
| --- | --- |
| Type a character | Writes it into the box and advances to the next. |
| Backspace | On a filled box, clears it in place. On an empty box, clears the previous box and moves back to it. |
| Delete | Clears the current box without moving. |
| ← / → | Move one box, clamped at the ends — no wrap. |
| Home / End | First / last box. |
| ⌘V / Ctrl+V | Paste into ANY box: a full-length code fills from box one; a shorter payload overwrites from the focused box. |
| Tab / ⇧Tab | Steps through the boxes and out the end — never trapped. |

- The row is a `role="group"` labelled by the field label and described by the hint and error, so the failure is announced once for the code, not once per character.
- Each box is a real input named for its position — `Digit 3 of 6` (or `Character 3 of 8` on the alphanumeric charset).
- Every box carries `autocomplete="one-time-code"`, `autocorrect`/`autocapitalize` off and no `maxlength` — a filled box still accepts an overtype, and iOS can drop the entire autofilled code into whichever box holds focus.
- Focus selects the box contents, so the next keystroke overtypes instead of stalling on a full box.
- Error state paints every box with `--sv-bad` and sets `aria-invalid` on each: the code is wrong as a unit (C2 — the text states it too).

## Don't

- No masking — a code is not a password. Use a Field (B11) with type="password" for secrets.
- No variable-length secret in a PinField; if the length is not fixed, it is a Field.
- No auto-submit without a visible primary — `onComplete` may prefill, the button still commits.
- No countdown that hides the resend action; state the wait beside it.
- No per-character error tone; the code fails as one value.

## FAQ

**Why boxes at all, if it is one string?**

The boxes tell the user the length before they start typing, which is the whole reason codes are chunked. Semantically it stays one labelled group with one value and one error.

**Does it work with SMS autofill?**

Yes. Every box carries autocomplete="one-time-code", and the write path treats a full-length payload as the whole code regardless of which box received it — so iOS dropping six digits into box four still fills the row correctly.

**How do I submit as soon as the code is complete?**

Use onComplete to fire the request, but keep the primary button visible and enabled: a code can be pasted wrong, and the user needs a control to retry with.
