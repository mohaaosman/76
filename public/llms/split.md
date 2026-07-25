# Split · 76° UI (B46)

The band-less page cut in half, with the card across the cut.

**One job:** Carry a single decision on the line between two surfaces.
**Category:** chrome · **Exports:** Split · **Tags:** auth, split-screen, sign-in, plate, page-type, layout, overlap

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/split.json
```

Manual: copy components/seventy-six/split.tsx, components/seventy-six/split.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: plate.

## Overview

Two flat surfaces meet on one seam — ink and wall, side by side or stacked — and the **Plate** sits centred on that seam. Half the card is on ink and half is on wall. That is the whole component: there is no panel, no hero, no second column, and nothing to read on either half.

**This is B2's overlap, finished.** The Sheet spends that move once per page by pulling its first row 44px over the band edge — the stat cards on every 76° dashboard straddle the boundary between the ink band and the platinum wall. A Plate has no Sheet and no band, so the same physics arrive as a page type: not a card that peeks over an edge, a card that STRADDLES one. It is the only 76° layout in which paper crosses a surface boundary rather than resting on one.

The halves carry **no content whatsoever** — no statement, no widget, no screenshot, no illustration. They hold no text, so they are `aria-hidden` and the page reads to a screen reader as exactly the Plate it is. A1 refuses gradients, so the cut is two real elements rather than a colour stop; that is also why it lands on a hard pixel instead of a soft blend, which is what gives the card an edge to straddle.

B24 is composed verbatim, with one consequence: **everything the Plate puts on the wall moves into the card.** Centred above and below a card that straddles the seam, the wordmark and the footer would each land half on ink and half on paper — ink type on ink, which reads as a rendering fault rather than a design. Both become hairline-ruled rows of the card, left-aligned like every other line in it, and the Plate's own slots are emptied. Nothing else changes: same anatomy, same one h1, same one primary, same 400px measure.

Two orientations, one prop. `side` cuts left/right and puts the card on the vertical seam; `stacked` cuts top/bottom and puts it on the horizontal one. Below 1000px `side` becomes `stacked` on its own, because a vertical seam behind a card that has grown to the full width is a seam nobody can see. The card stays centred at every width, so it never stops straddling — nothing is hidden and nothing scrolls (C7).

## Examples

### Side by side — the card on a vertical seam

The default, and the whole API: an ordinary Plate with a surface cut behind it. An existing auth screen converts by changing one component name.

```tsx
import { Split, PlateHead, Field, Button } from '@/components/seventy-six';

<Split footer={<>Trouble signing in? <a href="/support">Contact support</a></>}>
  <PlateHead title="Sign in" context="Northwind operations console" />
  {/* …the form, unchanged from the Plate version… */}
</Split>
```

### Stacked — the card on a horizontal seam

One prop. The same card, the same measure, the cut rotated 90 degrees — closest to the dashboard stat row it borrows from.

```tsx
<Split orientation="stacked" footer={footer}>
  <PlateHead title="Sign in" context="Northwind operations console" />
  {/* …the same form… */}
</Split>
```

## Props

### Split

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'side' | 'stacked'` | `'side'` | Which way the page is cut. side puts the card on a vertical seam, stacked on a horizontal one. Below 1000px side becomes stacked. |
| `footer` | `ReactNode` | — | Intercepted, not forwarded: on a Split it renders as the card's last row under a hairline, because centred under the card it would straddle the seam. |
| `width` | `'sm' | 'md'` | `'sm'` | Passed through to the Plate — 400px, or 520px for a two-column form (B24). |
| `children` | `ReactNode` | — | The card's contents. Exactly one h1, normally a PlateHead. Identical to what a Plate takes. |
| `wordmark` | `—` | — | Not accepted here. The Split supplies the mark as the card's first row; the Plate's wall-side slot is emptied. |

## Accessibility

- The halves are two empty `<div>`s marked `aria-hidden="true"`. They carry no text and no role, so a screen reader reads a Split as exactly the Plate it composes — the surface cut is a visual fact, not information.
- There is no skip link, and that is deliberate: B24 waives C4's skip link because a Plate has nothing to skip, and a Split has nothing either. The first tab stop is the first control in the card.
- The page keeps exactly one h1, inside the card (B24). The wordmark is `role="img"` labelled "Seventy Six Degrees", not a heading, so the outline is the form's.
- The card is the only surface anything is read on, so every contrast pair on the page is the Plate's own — already verified on paper in C1, in both modes. No text is ever painted on the ink half.
- The halves are stacked in one grid cell with the card, not absolutely positioned, so there is no z-index and no focus-order surprise: the DOM order is decoration then decision.

## Don't

- No text on either half — a statement there is a landing page, and F11 refuses the imagery it grows into next.
- No widget, no screenshot, no illustration and no photograph on the halves (A2, F11).
- No gradient between the surfaces — A1 refuses it, and a soft blend leaves the card no edge to straddle.
- No second card and no second decision; two decisions are two pages (B24).
- No Split for 404, 500, maintenance or an expired link — a plain Plate is the whole answer there.
- No wordmark or footer left on the wall, where the seam cuts through it.

## FAQ

**Why not amend the Plate instead of adding a page type?**

Because B24's value is that it is absolute — one card on a bare wall, nothing else. A page type that sometimes cuts its own background is one nobody can check against. The Split composes the Plate, so the Plate keeps its spec and the reader keeps a rule they can enforce.

**Where does the surface cut come from?**

B2. Every 76° dashboard pulls its first row 44px over the band edge, so the stat cards straddle ink and wall. This is that move as a page type, with the card centred on the seam instead of hanging over it.

**side or stacked?**

Side reads wider and holds more ink on a desktop; stacked is closer to the dashboard row it borrows from and needs no breakpoint change. Pick one per product and hold it — mixing them across an auth set makes one task look like two products.

**Can the ink half be on the right?**

Not as a prop. 76° is LTR-only (C10), and with nothing on either half to read there is nothing the mirror would buy. A product that needs it owns that override locally.

**Does the seam survive dark mode?**

Yes, but quietly: on dark the band is the darkest surface and the wall recedes toward it, so the cut is a subtle step rather than a hard contrast. The card still reads as the lightest thing on screen, which is the physics dark mode is meant to preserve.
