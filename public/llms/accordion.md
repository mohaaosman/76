# Accordion · 76° UI (B27)

Native <details> sections on hairlines — secondary detail, folded away.

**One job:** Fold SECONDARY detail out of the way until it is asked for.
**Category:** primitives · **Exports:** Accordion · **Tags:** accordion, details, disclosure, collapse, faq, sections

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/accordion.json
```

Manual: copy components/seventy-six/accordion.tsx, components/seventy-six/accordion.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

One `<details>` per section, hairline-ruled, with a mono meta column on the right for the count or date that tells you whether opening it is worth the click. The platform does the disclosure: no state, no height animation, no ARIA to wire — `open` is a real attribute and Ctrl-F finds text inside a closed section in modern browsers.

The boundary is what may be folded. An Accordion hides **secondary** detail — line items, changelog, advanced settings, FAQ answers. It never hides the primary job of a screen, and it is never navigation: navigation is the Band (B1), and one level of anything deeper becomes a page (F6).

## Examples

### Order detail sections

Independent sections — closing one the reader opened is a surprise.

```tsx
import { Accordion } from '@/components/seventy-six';

<Accordion
  sections={[
    { id: 'lines', title: 'Line items', meta: '14 SKUS', defaultOpen: true, children: <p>…</p> },
    { id: 'ship', title: 'Shipping', meta: 'DHL · 24 JUL', children: <p>…</p> },
    { id: 'audit', title: 'Audit trail', meta: '6 EVENTS', children: <p>…</p> },
  ]}
/>
```

### One at a time

Native exclusive grouping via the shared name — no JavaScript.

```tsx
<Accordion exclusive name="settings" sections={sections} />
```

## Props

### Accordion

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sections` | `AccordionSection[]` | — | id · title · optional mono meta · children · defaultOpen. |
| `exclusive` | `boolean` | `false` | One open at a time, via the native name group. |
| `name` | `string` | — | The shared native group name. Required when exclusive. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Moves to the next summary. |
| Enter / Space | Opens or closes the focused section. |

- Native <details>/<summary> carries its own expanded state — no aria-expanded to keep in sync.
- The chevron is supplementary: the open state is carried by the panel itself (C5).
- The summary shows the standard focus ring (C3); the marker is removed but never the focus.

## Don't

- No accordion holding the primary job of a screen — that content is not secondary.
- No accordion as navigation; that is the Band, and deeper than one level is a page (F6).
- No height animation on open — layout properties never transition (A1).
- No nested accordions; a section that needs sections is a page.

## FAQ

**Accordion or Tabs?**

Accordion when the reader may want two things at once, or none. CardTabs (B8) when the options are alternatives filtering one region.

**Why not animate the open?**

A1 bans transitions on layout properties, and a height animation is the most expensive one there is. The section opens instantly; nothing is lost.
