# Masthead · 76° UI (B47)

The hero, refused as imagery and rebuilt as type.

**One job:** Open a public page with the claim, set in type.
**Category:** marketing · **Exports:** Masthead · **Tags:** hero, masthead, landing, marketing, headline, display

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/masthead.json
```

Manual: copy components/seventy-six/masthead.tsx, components/seventy-six/masthead.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

F11 refuses hero imagery, stock photography and illustration; A2 refuses the stock-photo card. What is left is the thing a masthead always was — a claim, set large, with nothing behind it. There is **no image slot, no video slot and no background slot**, and adding one is a Book change rather than a prop.

It is `PageHero`&rsquo;s (B1) public-surface sibling and speaks the same vocabulary on purpose: `title` plus a receded `titleSoft`, one line of context, an actions cluster with exactly one primary. The difference is the ramp and the surface — display type on the wall, instead of 27px on the band.

The display steps clamp rather than sit at a fixed size: `--sv-display-1` is 64px at full width and 34px at 320px, which is the size the same line takes in the product ramp. The page degrades <i>into</i> the system, never out of it (C7).

## Examples

### The opening claim

Eyebrow, claim, one sentence, one primary, and a mono line of terms.

```tsx
import { Masthead, Button } from '@/components/seventy-six';

<Masthead
  eyebrow="COMPONENT LIBRARY · v0.5"
  title="Flat, informational, corporate."
  titleSoft="Paper on a wall."
  statement="Fifty-one component specifications with one job each, zero runtime dependencies, and WCAG 2.2 AA verified on both surfaces."
  actions={<>
    <Button variant="primary">Install the registry</Button>
    <Button variant="ghost">Read the Book</Button>
  </>}
  note="MIT · ZERO DEPENDENCIES · REACT 19"
/>
```

### Centred

The measure caps and the column centres — everything else is unchanged.

```tsx
<Masthead
  align="center"
  title="One system, stated once."
  statement="Every widget is a registered type. If it is not in the Book, it is not on the screen."
  actions={<Button variant="primary">Open the taxonomy</Button>}
/>
```

## Props

### Masthead

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | — | Mono uppercase line above the title: the category, the release, the audience. |
| `title` | `string` | — | The claim. Becomes the page h1. |
| `titleSoft` | `string` | — | The claim's second half, receded to --sv-ink-soft inside the same heading. |
| `statement` | `string` | — | ONE sentence, capped near 58ch. A paragraph is B45 Prose. |
| `actions` | `ReactNode` | — | At most one primary and one ghost (B10). |
| `note` | `string` | — | A mono line under the actions: terms, licence, count. |
| `align` | `'start' | 'center'` | `'start'` | Left-aligned by default, because that is how the rest of the system sets type. |
| `headingLevel` | `1 | 2` | `1` | 2 only when the page already owns its h1. |

## Accessibility

- The heading is a real h1 (or h2), and titleSoft sits inside it so the accessible name is the whole claim.
- The eyebrow is a sibling line, never a heading — a page whose h1 is preceded by an h2 has a broken outline (A4).
- Nothing in it is decorative-only, so nothing is aria-hidden.
- At 320px the title clamps to 34px and the actions go full width — no two-line clickables, no horizontal scroll (C7).

## Don't

- No image, video, or background — F11 refuses them, and the component has no slot to put one in.
- No second primary; B10 is at its most binding on a page whose whole job is one ask.
- No paragraph in the statement — one sentence, or reach for B45 Prose.
- No figures inside the Masthead; a proven number is B50 ProofRow.
- Never on paper — the Masthead is the wall, with no card and no shadow.

## FAQ

**Where is the hero image?**

There is no slot for one. F11 refuses hero imagery, stock photography and illustration by name, and A1 refuses the gradient every hero grows next. The claim carries the page.

**Masthead or PageHero?**

PageHero (B1) is the band's product page header, at 27px on ink. Masthead is the public page, at display size on the wall. A product screen never uses a Masthead.

**Can I use the display tokens elsewhere?**

No — firewall rule 17 rejects --sv-display-* outside the five marketing components. The product ramp tops out at 27px, and a dashboard with a 64px number has left the system.
