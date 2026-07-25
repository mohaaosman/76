# Popover · 76° UI (B42)

The non-modal panel on the native popover attribute — a few controls beside their trigger, 320px at the widest.

**One job:** Hold a FEW controls beside the control that asked for them.
**Category:** primitives · **Exports:** Popover · **Tags:** popover, popover-attribute, top-layer, non-modal, panel, column-chooser

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/popover.json
```

Manual: copy components/seventy-six/popover.tsx, components/seventy-six/popover.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button.

## Overview

B18 `Tooltip` is a phrase with no interactive content, on hover or focus. B20 `Menu` is a list of verbs with `role="menu"` and its own keyboard model. B21 `Drawer` is a workspace beside the work. B13 `Dialog` interrupts for one decision. A Popover is the non-modal panel that holds a few controls — a column chooser, a saved-view picker, a short explanation with a link — and nothing else in the taxonomy does that.

It is built on the native `popover` attribute: browser top layer, light dismiss, Esc, and **no z-index at all** — the `--sv-z-*` ladder never reaches it. It also **owns its own trigger**, exactly as `MenuButton` does, so `aria-expanded` and `aria-controls` cannot drift out of sync with what is on screen.

Labelling is enforced by the type system: `title` and `ariaLabel` are a mutually exclusive union, so an unlabelled panel does not compile. 320px is the ceiling; wider is a B21 Drawer. And the panel is non-modal — the page behind stays readable and keeps its scroll, and focus is never trapped: tabbing past the last control closes the panel and carries on into the page, because a panel left standing behind the focus ring is one nobody can see they have left.

**B20 Menu now stands on this component.** `usePopoverAnchor` — the hook that positions a top-layer panel under its trigger, since the top layer does not anchor itself without CSS anchor positioning — moved here, and Menu imports it. Popover is the primitive; Menu is a specialisation of it. The hook is deliberately not re-exported from the barrel: it is an implementation detail of the two components, not public API.

## Examples

### Column chooser

An untitled panel: three checkboxes and nothing else. ariaLabel names it, because there is no title to do the naming.

```tsx
import { Popover, Checkbox } from '@/components/seventy-six';

<Popover label="Columns" ariaLabel="Choose visible columns" align="end">
  <Checkbox label="Customer" defaultChecked />
  <Checkbox label="Total" defaultChecked />
  <Checkbox label="Dispatched" />
</Popover>
```

### Titled panel with one action

A title renders the hairline head and a close that names its panel. The action is a single text link, exactly as a Banner carries one.

```tsx
import { Popover, ButtonLink } from '@/components/seventy-six';

<Popover label="About this total" title="How the total is calculated">
  Line totals, less order-level discounts, plus shipping. Tax is applied at
  invoicing, so this figure can differ from the invoice by the tax line.
  <ButtonLink href="/docs/totals">Read the totals rules</ButtonLink>
</Popover>
```

## Props

### Popover

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The trigger's visible text — it names what the panel holds ("Columns"). |
| `title` | `string` | — | Renders the hairline head plus a named close, and labels the panel. Mutually exclusive with <code>ariaLabel</code>. |
| `ariaLabel` | `string` | — | Names an untitled panel. Mutually exclusive with <code>title</code>; omitting both does not compile. |
| `children` | `ReactNode` | — | A few controls, or a short explanation with one link. Not a form, not a page. |
| `align` | `'start' | 'end'` | `'start'` | Panel edge alignment against the trigger; it is clamped 8px inside the viewport either way. |
| `variant` | `'ghost' | 'primary' | 'link'` | `'ghost'` | Trigger variant — the panel is not an action, so the trigger is usually quiet. |
| `disabled / className` | `boolean / string` | — | Both apply to the trigger; the panel is top-layer and owns its own box. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter / Space | Opens the panel and moves focus to its first control. |
| Tab / ⇧Tab | Walks the panel; leaving it closes the panel and keeps going. Nothing is trapped and focus is never stolen back. |
| Esc | Closes (native popover) and returns focus to the trigger. |

- Trigger: `aria-haspopup="dialog"` + `aria-controls`, with `aria-expanded` read off the panel's own `toggle` event — the browser is the source of truth for open state, so the attribute cannot lie.
- Panel: `role="dialog"`, labelled by the title through `aria-labelledby` or by `ariaLabel`. The union of the two means the unlabelled case is unreachable, not merely discouraged.
- Focus moves to the first focusable control on open, or to the panel itself when it holds none; close returns focus to the trigger.
- A titled panel's close names its target ("Close How the total is calculated"); an untitled one exits by Esc or by clicking away.

## Don't

- No action whose only path is the popover (C4) — whatever lives here also lives somewhere reachable without it.
- No navigation in a popover; links between places belong in the Band.
- No popover nested inside another popover.
- No errors in a popover — an error renders inline at its cause, in a B22 Banner.
- No panel wider than 320px; at that point the content is a workspace and belongs in a B21 Drawer.

## FAQ

**Why not CSS anchor positioning?**

It is not yet baseline across the browsers 76° supports, so shipping it would mean shipping a fallback anyway. Instead `usePopoverAnchor` measures the trigger and places the panel under it, clamped inside the viewport, re-running on resize — about thirty lines, no dependency, and it deletes itself the day anchor positioning is safe.

**Why does it own the trigger instead of taking a children render prop?**

Because the ARIA wiring is the whole risk. A render prop hands aria-haspopup, aria-controls, and aria-expanded to the caller, and the first time one of them drifts the panel is silently unusable by keyboard. Owning the button makes the wiring unforgeable.

**Popover or Menu?**

Count the verbs. A list of actions is a B20 Menu and gets the menu keyboard model. Controls that change a view — checkboxes, a radio set, a short explanation — are a Popover. Both ride the same top layer and the same anchor hook.
