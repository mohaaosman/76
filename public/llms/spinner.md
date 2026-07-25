# Spinner & Busy · 76° UI (B31)

The wait, stated — the one continuous animation the system allows.

**One job:** State that a region is fetching, and name what.
**Category:** primitives · **Exports:** Spinner, Busy · **Tags:** spinner, loading, busy, progress, wait, fetching

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/spinner.json
```

Manual: copy components/seventy-six/spinner.tsx, components/seventy-six/spinner.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

**Spinner** is the 12–16px mark beside a label — the same one B10 puts inside a loading button. **Busy** covers a region with one centred spinner and a sentence naming what is loading: "Loading July orders…". The sentence is required; a bare spinner tells the reader only that something, somewhere, is slow.

It divides cleanly with B17 Skeleton: a **Skeleton** is first paint, where the anatomy is known and the data is not. A **Busy** is a region that already has content and is fetching the next of it — pass that content as children and it stays legible underneath at reduced emphasis, because it is still true until it changes.

## Examples

### Inline and regional

```tsx
import { Spinner, Busy } from '@/components/seventy-six';

<Spinner label="Saving" />

<Busy label="Loading July orders…" minHeight={140} />
```

### Refreshing in place

The stale table stays readable — it is still true until it changes.

```tsx
<Busy label="Refreshing…">
  <DataTable {...props} />
</Busy>
```

## Props

### Spinner

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `12 | 16 | 20` | `12` | Matches the type it sits beside. |
| `label` | `string` | — | Announced via role="status". Omit only when an adjacent live region says it. |

### Busy

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | REQUIRED sentence naming what is loading. |
| `minHeight` | `number` | `160` | Region height while empty — match the component it replaces so nothing jumps. |
| `children` | `ReactNode` | — | Existing content, kept legible underneath while it refreshes. |

## Accessibility

- Busy sets aria-busy="true" and aria-live="polite" on the region, so the label is announced once.
- A labelled Spinner is role="status"; an unlabelled one is decorative and must sit inside a region that announces.
- Under prefers-reduced-motion the rotation is the system's single registered exception — it is the only mark that says "still working".
- The label never uses "Please wait" or an exclamation mark (A3): it names the object.

## Don't

- No spinner on first paint where the anatomy is known — that is a Skeleton (B17).
- No bare spinner without a sentence; "loading" alone is not information.
- No spinner under 300ms of waiting — a flash of spinner is worse than none (B17).
- No full-page blocking spinner; regions load, pages do not freeze.

## FAQ

**Spinner or Skeleton?**

Nothing on screen yet and the shape is known: Skeleton. Content present and refreshing, or an action in flight: Spinner/Busy.

**Is the rotation not banned by A1?**

A1 bans animations over 200ms except the registered `sv-rotate`, which is exactly this mark. It is the one continuous animation in the system.
