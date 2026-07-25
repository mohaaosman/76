# Plate · 76° UI (B24)

The band-less page — one card on the bare wall, under the mono 76° wordmark.

**One job:** Carry a single decision on a page that has no navigation.
**Category:** chrome · **Exports:** Plate, PlateHead · **Tags:** plate, auth, sign-in, centered-card, error-page, band-less

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/plate.json
```

Manual: copy components/seventy-six/plate.tsx, components/seventy-six/plate.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: card.

## Overview

Every other 76° screen opens with a Band (B1). A Plate has no nav, no sub-tabs and no hero, so it has no band at all: wall edge to edge, the mono `76°` wordmark, one card centred on both axes, and an optional mono footer line. Sign in, sign up, reset, verify, invite, 404, 500, maintenance, expired link — the wording is the caller's, the anatomy is fixed.

The card is ordinary paper from B12 — radius 4, one `--sv-shadow`, zero border — self-padded at 24px, so its children are the page and never need `sv-card__body`. Width is 400px, or 520px with `width="md"` for a two-column form.

`PlateHead` supplies the screen's one `<h1>` plus at most one sentence of context, because here the card IS the page. The wordmark is a `role="img"` label, not a heading, and the skip-link is omitted — a registered exception to C4, since a Plate has nothing to skip.

## Examples

### Sign-in plate

Head, providers, hairline OR, credential form, one primary at full card width.

```tsx
import { Plate, PlateHead, Field, Button, ButtonLink } from '@/components/seventy-six';

<Plate footer={<>Trouble signing in? <a href="#support">Contact support</a></>}>
  <PlateHead title="Sign in" context="Northwind operations console" />

  <form onSubmit={submit} noValidate>
    <Field label="Email" type="email" required autoComplete="email" />
    <Field label="Password" type="password" required autoComplete="current-password" />
    <Button type="submit" variant="primary" style={{ width: '100%' }}>
      Sign in
    </Button>
  </form>

  <ButtonLink href="#reset">Forgot password?</ButtonLink>
</Plate>
```

### The condition plate

404, 500, maintenance and expired links are the same anatomy: state what happened, then the one way forward.

```tsx
<Plate footer="ERR-4041 · 25 JUL 09:14 UTC">
  <PlateHead
    title="Page not found"
    context="The address is right but nothing is filed under it. It may have been renamed or archived."
  />
  <Button variant="primary" onClick={goHome} style={{ width: '100%' }}>
    Back to the dashboard
  </Button>
</Plate>
```

### Wider card for a two-column form

width="md" takes the card to 520px. Nothing else changes.

```tsx
<Plate width="md" footer={<a href="#signin">Back to sign in</a>}>
  <PlateHead title="Create account" context="Northwind operations console" />
  {/* First name / last name side by side inside the 520px card */}
</Plate>
```

## Props

### Plate

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The card's contents. Exactly one h1 — normally a PlateHead. |
| `width` | `'sm' | 'md'` | `'sm'` | 400px, or 520px for a two-column form. |
| `footer` | `ReactNode` | — | One mono line under the card: legal, a support link, an error id. |
| `wordmark` | `ReactNode` | — | Overrides the built-in mono 76° mark. The degree sign is never dropped. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | Spread onto the <main> element the Plate renders. |

### PlateHead

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The page's one h1. Names the task or the condition — never the app. |
| `context` | `string` | — | One sentence: what this screen wants, or what went wrong and what is next. |

## Accessibility

- The Plate renders `<main>`; `PlateHead` renders the screen's single `<h1>` inside the card.
- The wordmark is `role="img"` with `aria-label="Seventy Six Degrees"` — one word to a screen reader, not three orphaned characters, and not a heading.
- The skip-link is omitted: a registered exception to C4, because a Plate carries nothing to skip past.
- Centering is `align-content` on a grid, so tall content grows the page instead of clipping — 200% zoom and 320px scroll.

## Don't

- No nav on a Plate — no band, no tabs, no "back to the app" bar.
- No PageHero; the h1 lives inside the card, via PlateHead.
- No second card, and no second decision — two decisions are two pages.
- No background image and no illustration (F11); the wall stays the wall.

## FAQ

**Where does the error Banner go?**

Inside the card, above or below the PlateHead — a Plate has no page-level surface. Field errors still render on the Field (B11); the Banner states the failure as a whole.

**Can the wordmark be the product's own?**

Yes — pass `wordmark`. It stays mono, stays centred, and keeps the degree mark if it is a 76° build.

**Plate or Dialog for a confirmation?**

A Plate is a page reached by URL with no way back into the app; a Dialog interrupts a page the user is already on. If there is an app behind it, it is a Dialog.
