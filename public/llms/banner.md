# Banner · 76° UI (B22)

The inline notice — where B14 sends every error: in the flow, at the point of relevance.

**One job:** State a condition of THIS place, in this place.
**Category:** primitives · **Exports:** Banner · **Tags:** banner, alert, inline-error, notice, callout, status-region

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/banner.json
```

Manual: copy components/seventy-six/banner.tsx, components/seventy-six/banner.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Toasts drift; banners sit. A Banner renders in the layout at the point of relevance — above the form that failed, atop the card whose sync degraded, under the hero while an import runs. It is the surface the toast discipline points errors at: the error lives **here**, next to its cause.

Anatomy: paper card, 2px left tone rule, 16px tone icon, 13/700 title, soft body in full sentences (what happened **and how to fix it**), an optional single text-link action, and an optional dismiss. Tones follow the three-color law: seed for info, green ok, red bad — and warn uses ink, because no amber surface enters the system.

A Banner with `tone="bad"` is `role="alert"`; everything else is a polite status region.

## Examples

### The four tones

```tsx
import { Banner, ButtonLink } from '@/components/seventy-six';

<Banner tone="info" title="Import running">
  1,204 of 2,400 rows processed. You can keep working — we will notify you here.
</Banner>

<Banner tone="ok" title="Backup complete" onDismiss={dismiss}>
  All 14 tables copied to cold storage at 03:00.
</Banner>

<Banner tone="warn" title="Sync degraded" action={<ButtonLink href="#">Retry sync</ButtonLink>}>
  Prices last updated 42 minutes ago. Orders still submit; totals may lag.
</Banner>

<Banner tone="bad" title="Submit failed — 2 fields need fixes">
  Quantity must be a whole number above 0. Customer is required.
</Banner>
```

## Props

### Banner

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'info' | 'ok' | 'warn' | 'bad'` | `'info'` | Left rule + icon color. warn is ink — no amber in the system. |
| `title` | `string` | — | 13/700, states the condition plainly. No "Oops" (A3). |
| `children` | `ReactNode` | — | Full sentences: what happened and how to fix it. |
| `action` | `ReactNode` | — | ONE text-link action, e.g. a ButtonLink "Retry sync". |
| `onDismiss` | `() => void` | — | Renders a dismiss control. Persistent conditions omit it. |

## Accessibility

- `tone="bad"` renders `role="alert"` (assertive); other tones are `role="status"` (polite).
- Tone is never carried by color alone — the icon shape and the title text state it (C2).
- The dismiss control names its target: "Dismiss: Backup complete".

## Don't

- No page-level banner for a field-level error — field errors render on the Field (B11).
- No stacking three banners; the worst condition wins, the rest wait.
- No banner as a marketing surface; it states conditions, it does not promote.
- No auto-dismissing banners — that is a toast's job.

## FAQ

**Banner, toast, or field error?**

Scope decides. One field: Field error. This page/form/card, needing to persist: Banner, adjacent to the cause. A finished background fact needing no action: toast.

**Why is warn not amber?**

Law 2 — three colors, total. Amber surfaces are how systems rot into rainbows. The triangle icon plus plain words carry the meaning at AA, in ink.
