# StatusWord · 76° UI (B12)

A 6px currentColor dot + a colored word. The word is the meaning; the dot is rhythm.

**One job:** State the status of one thing, in one word.
**Category:** primitives · **Exports:** StatusWord · **Tags:** status, badge-replacement, dot, semantic-color, no-pills

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/status-word.json
```

Manual: copy components/seventy-six/status-word.tsx, components/seventy-six/status-word.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

This is the system's entire status vocabulary: **ok** renders the green word, **neutral** the soft-ink word, **bad** the red word. Functional colors may color words and 6px dots — never surfaces (Law 2), which is why filled pills, badges, and chips are firewall violations.

Status wording is **registered per product**: an ERP might register Fulfilled=ok, Pending=neutral, On hold=bad. Inventing statuses ad hoc is a defect — add new words to the product's registry first.

## Examples

### The three tones

```tsx
import { StatusWord } from '@/components/seventy-six';

<StatusWord tone="ok">Fulfilled</StatusWord>
<StatusWord tone="neutral">Pending</StatusWord>
<StatusWord tone="bad">On hold</StatusWord>
```

### In a table cell

The natural habitat: DataTable status columns, where the dot+word pattern scans in a fast vertical sweep.

```tsx
{
  key: 'status',
  header: 'STATUS',
  kind: 'status',
  render: (row) => <StatusWord tone={row.tone}>{row.status}</StatusWord>,
}
```

## Props

### StatusWord

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'ok' | 'neutral' | 'bad'` | — | Maps to --sv-ok, --sv-ink-soft, --sv-bad. Required. |
| `children` | `string` | — | The registered status word. Required — the dot never appears alone. |

## Accessibility

- Meaning is never carried by color alone (C5): the word IS the status, so screen readers and color-blind users read exactly what sighted users read.
- The dot is `aria-hidden` decoration.

## Don't

- No filled pills, badges, or chips — ever (A2).
- No dot without a word; the dot is rhythm, not information.
- No ad-hoc status words: the vocabulary is registered per product.
- No coloring of table rows or cells to echo the status — the word is enough.

## FAQ

**Which colors are available?**

Three tones: ok (green #14804A), neutral (soft ink), bad (red #C43D2E). All pass AA on paper. There is deliberately no yellow/amber tone — attention states use the neutral word.

**How do I add a new status like "Escalated"?**

Register the word and its tone in your product's status vocabulary, then use it: <StatusWord tone="bad">Escalated</StatusWord>. The registration step is what keeps status language consistent product-wide.

**Can I use it outside tables?**

Yes — activity rows, card footnotes, and detail panels all use the same dot+word. Only the hero is off-limits (stats live on paper).
