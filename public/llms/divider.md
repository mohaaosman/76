# Divider · 76° UI (B29)

One hairline, optionally naming the group below it in mono.

**One job:** Separate two groups that share a surface.
**Category:** primitives · **Exports:** Divider · **Tags:** divider, separator, rule, hairline, hr

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/divider.json
```

Manual: copy components/seventy-six/divider.tsx, components/seventy-six/divider.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A bare `<hr>` at `--sv-line`, or — with a label — a rule carrying mono uppercase text: the "OR" between a social stack and a credential form (B26), an "ARCHIVED" break in a long list, a "DANGER ZONE" step in settings.

A labelled divider is a section **marker**, not a heading. It never replaces an `<h2>`, and it never appears twice in a row: two dividers with nothing between them is a spacing problem, not a structure one.

## Examples

### Plain and labelled

```tsx
import { Divider } from '@/components/seventy-six';

<Divider />
<Divider label="OR" />
<Divider label="ARCHIVED" align="start" />
```

## Props

### Divider

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Mono uppercase text in the rule. Omit for a plain hairline. |
| `align` | `'start' | 'center'` | `'center'` | start keeps the label flush left and runs the rule past it. |

## Accessibility

- Unlabelled renders a real <hr> — an implicit separator role.
- Labelled renders role="separator" with the label as its accessible name; the visible text is aria-hidden so it is not read twice.
- On the band the rule and label switch to band tokens automatically.

## Don't

- No divider standing in for a heading — a section with a title takes an <h2>.
- No two dividers in a row, and none as the first or last child of a card.
- No thick or coloured rules; the hairline is the system's only rule weight.
- No divider inside a table — rows already carry their own hairlines (B7).

## FAQ

**Does the auth "OR" rule use this?**

It is the same anatomy. B26 SocialButton ships its own copy so the registry item installs standalone; a product composing by hand should reach for Divider.
