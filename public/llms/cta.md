# CallToAction · 76° UI (B49)

The last row of a public page — the only one that asks.

**One job:** Name the one act the page wants.
**Category:** marketing · **Exports:** CallToAction · **Tags:** cta, call to action, marketing, conversion, landing, band

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/cta.json
```

Manual: copy components/seventy-six/cta.tsx, components/seventy-six/cta.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Everything above it states; this asks. That is why it holds exactly **one primary** — B10's rule is not relaxed on the public surface, it is at its most binding here, because a page that asks for two things has asked for neither.

Two surfaces, one prop. `tone="paper"` is an ordinary 76° card on the wall: radius 4, one shadow, zero border. `tone="band"` paints the ink surface and takes the band's own tokens, so the page closes on the same ink it opened under. Ink takes no shadow — it is the wall's opposite, not a card resting on it.

The copy contract is A3's: the button names its object. &ldquo;Start the 30-day trial&rdquo; is a call to action; &ldquo;Get started&rdquo; is a shrug.

## Examples

### On paper

A card on the wall, one primary, one ghost, a mono line of terms.

```tsx
import { CallToAction, Button } from '@/components/seventy-six';

<CallToAction
  title="Install the registry"
  statement="Every component is installable on its own, with the tokens as a shared dependency."
  actions={<>
    <Button variant="primary">Copy the install command</Button>
    <Button variant="ghost">Browse the components</Button>
  </>}
  note="NPX SHADCN@LATEST ADD 76.ZIFALA.COM/R/TOKENS.JSON"
/>
```

### On the band

The page closes on the same ink it opened under.

```tsx
<CallToAction
  tone="band"
  title="Read the Component Book"
  statement="Every specification, every refusal, and the fourteen-point gate each screen passes before it ships."
  actions={<Button variant="primary">Open the Book</Button>}
/>
```

## Props

### CallToAction

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The ask, at --sv-display-3. Names the act's object (A3). |
| `statement` | `string` | — | One sentence: what happens after the click, or what it costs. |
| `actions` | `ReactNode` | — | ONE primary. A ghost beside it is permitted; a second primary is not. |
| `note` | `string` | — | A mono line under the actions: terms, trial length, card requirement. |
| `tone` | `'paper' | 'band'` | `'paper'` | A card on the wall, or the ink surface edge to edge. |
| `headingLevel` | `2 | 3` | `2` | A public page's h1 belongs to its Masthead (B47). |

## Accessibility

- A real <section> named by the heading inside it — no redundant aria-label.
- headingLevel defaults to 2 because the page h1 is the Masthead's and levels are never skipped (A4).
- tone="band" carries the .sv-band class, so ghost buttons and focus rings inside it take the band treatment: white focus outline on ink (C3).
- Marks on ink paint with --sv-on-dark, never --sv-paper — paper inverts on dark and would collapse every white-on-ink pair (firewall rule 16).

## Don't

- Never two primaries.
- Never "Get started", "Learn more", or an exclamation mark (A3) — the button names its object.
- Never a countdown or a scarcity line; 76° speaks like a competent colleague.
- Never a form inside it — a form that collects something is a page, or a Plate (B24).
- Never a tinted "premium" surface or a gradient (A1).

## FAQ

**Paper or band?**

Band when it is the last thing on the page and you want the page to close on ink. Paper when a CTA sits mid-page between two content sections, where a full ink row would cut the page in half.

**Can it hold an email field?**

No. A field plus a button is a form, and a form has validation, error states and a success condition — that is a page or a Plate, not a row.
