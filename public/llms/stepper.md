# Stepper · 76° UI (B39)

A fixed sequence, stated — where you are, and what remains.

**One job:** State where you are in a FIXED sequence, and what remains.
**Category:** primitives · **Exports:** Stepper · **Tags:** stepper, steps, sequence, wizard, checkout, onboarding

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/stepper.json
```

Manual: copy components/seventy-six/stepper.tsx, components/seventy-six/stepper.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A real `<ol>`, because the order is the whole point: a 24px marker per step, a 12.5/500 label and an optional one line under it ("Signed 14 Jul"). Done and current markers take the seed fill; the connector behind the current step is seed and ahead of it is hairline, so the span already closed is legible at a glance. The connector is the step's own `::after` rather than an extra element — an empty span between steps would land inside the ordered list as a phantom item.

A stepper is a **statement, not a control**. Steps render as plain text unless `onStepSelect` is passed, and even then only already-completed steps become buttons: you cannot click into a step you have not earned. It is not B4 **Progress** — a stepper counts named steps, a progress bar measures a quantity against a target — and it is not a tablist, because tabs are free peers and steps are ordered and gated.

## Examples

### Four steps, the third current

No onStepSelect, so the stepper holds no tab stops — it states, and nothing more.

```tsx
import { Stepper } from '@/components/seventy-six';

<Stepper
  label="Onboarding progress"
  current={2}
  steps={[
    { id: 'account', label: 'Account', note: 'Created 12 Jul' },
    { id: 'contract', label: 'Contract', note: 'Signed 14 Jul' },
    { id: 'kyc', label: 'Verification' },
    { id: 'live', label: 'Go live' },
  ]}
/>
```

### Completed steps as buttons

onStepSelect turns the earned steps into buttons. The current step and everything ahead of it stay text.

```tsx
<Stepper
  label="Checkout"
  current={2}
  onStepSelect={(index) => setStep(index)}
  steps={steps}
/>
```

## Props

### Stepper

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `Step[]` | — | id · label · optional one-line note. |
| `current` | `number` | — | Index of the current step, 0-based. Everything before it is done. |
| `onStepSelect` | `(index: number) => void` | — | Makes COMPLETED steps buttons. Omit and the stepper is a statement. |
| `label` | `string` | — | REQUIRED accessible name for the list, e.g. "Onboarding progress". |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Moves to the next completed step — only when onStepSelect makes them buttons. |
| Enter / Space | Selects the focused completed step. |

- A real <ol> with an aria-label; the current step carries aria-current="step".
- Every step also states its position and state in visually-hidden words ("Step 2 of 4, completed") — the seed fill is a colour, and colour never carries meaning alone (C5).
- The marker is aria-hidden: it is a picture of the index those words already say.
- The upcoming marker's 1px border is `--sv-field-line-strong`, not the hairline, because that border is its only affordance against the wall and owes the 3:1 non-text bar (C1).
- Below 620px the sequence stands up vertically and the connectors become rules in the marker column. Nothing is hidden and nothing scrolls (C7).

## Don't

- No clickable upcoming step — a step you have not earned is not a destination.
- No stepper for a quantity; a value against a target is Progress (B4).
- No stepper standing in for a tablist — steps are ordered and gated, tabs are peers (B38).
- No step count that changes as the reader moves; the sequence is fixed before it starts.
- No hairline border on the upcoming marker; it owes 3:1 (C1).
- No horizontal scroller below 620px; the sequence stands up (C7).

## FAQ

**Stepper or Progress?**

Named steps in a fixed order: Stepper. A quantity against a target — 62% uploaded, 8 of 20 seats: Progress (B4).

**Can the reader jump ahead?**

No. onStepSelect turns completed steps into buttons and nothing else; moving forward is the form's own submit, not the indicator's job.

**Why an ordered list rather than divs?**

The order is the information, and a real <ol> announces position and count for free. It is also why the connector rides the item's ::after — nothing phantom may land in that count.
