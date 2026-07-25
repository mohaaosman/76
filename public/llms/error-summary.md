# ErrorSummary · 76° UI (B52)

The top-of-form index B11 has always required and the barrel never had.

**One job:** Index a failed submit's field errors as one list of links to the fields that caused them.
**Category:** forms · **Exports:** ErrorSummary · **Tags:** error summary, validation, form, submit, accessibility, wcag

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/error-summary.json
```

Manual: copy components/seventy-six/error-summary.tsx, components/seventy-six/error-summary.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

B11's validation contract has ended the same way since v0.1.0: <i>"Submit reveals a top-of-form error summary linking to each field (focus moves to summary)."</i> Every 76° form that shipped skipped that sentence, because there was nothing in the barrel to satisfy it. This is that component, and it is why 0.6 is called **the promises already made**.

It is **not** a replacement for the inline field error. A2 sends every error to its source, B11 states it at the field, and B22 says it a third time. The summary is the **index**; the field error is the **statement**. A long form that fails on field eleven needs both — one to find it, one to fix it.

Focus moves here on a failed submit, and that is why it carries no `role="alert"`: focusing an element already announces its content, and announcing the same event twice is the defect B7's `FilterBar` refuses when it declines a second live region.

## Examples

### A failed submit

Three fields, in the form's own order, each a link to the input that failed.

```tsx
import { ErrorSummary } from '@/components/seventy-six';

<ErrorSummary
  errors={[
    { fieldId: 'po-supplier', label: 'Supplier', message: 'Choose a supplier before submitting.' },
    { fieldId: 'po-qty', label: 'Quantity', message: 'Quantity must be a whole number above 0.' },
    { fieldId: 'po-date', label: 'Delivery date', message: 'The delivery date is before the order date.' },
  ]}
/>
```

### Wired to a form

The summary indexes; the fields still state. Both, always.

```tsx
const [errors, setErrors] = useState<FieldError[]>([]);

<form onSubmit={(e) => { e.preventDefault(); setErrors(validate(values)); }}>
  <ErrorSummary errors={errors} />
  <Field id="po-qty" label="Quantity" error={errorFor('po-qty')} />
  <Button variant="primary" type="submit">Create purchase order</Button>
</form>
```

## Props

### ErrorSummary

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errors` | `FieldError[]` | — | fieldId · label · message. Renders nothing when empty. |
| `title` | `string` | — | Overrides the generated tabular count sentence. Rarely needed. |
| `autoFocus` | `boolean` | `true` | Moves focus here when a new set of errors arrives, per B11. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Enters the list from the summary container, which already holds focus. |
| Enter | Follows a link to the field that failed. |

- The container is tabIndex={-1} and takes focus on a failed submit — B11's requirement, and the reason there is no role="alert".
- Focus moves again when the set of errors CHANGES, not only when it first appears: a second failed submit is a second event.
- Each entry is a real fragment link to the input's own id, so the browser moves focus without any scripted scrolling.
- The list is an <ol> because the order is the form's order.
- The tone is carried by the rule, the icon and the count sentence — never by colour alone (C5). The count is tabular (A4).

## Don't

- Never replaces the inline field error — the summary indexes, the field states.
- Never a toast: an error renders at its source (A2).
- Never lists an error with no field to point at; that is a B22 Banner.
- Never renders when there is nothing wrong.
- Never opens with "Oops" or "Please" and never carries an exclamation mark (A3).

## FAQ

**Why not role="alert"?**

Because focus moves here. Focusing an element announces its content, and an alert announces it again — one event, two announcements. B11 mandates the focus move, so the focus move is what ships.

**Banner or ErrorSummary?**

A Banner (B22) states one condition in a sentence. An ErrorSummary indexes N field failures as links. If the failure has no field to point at — a network error, a stale record — it is a Banner.

**Do I still need the field errors?**

Always. The summary is how a user finds the eleventh field on a long form; the field error is how they fix it. Shipping one is not shipping the other.
