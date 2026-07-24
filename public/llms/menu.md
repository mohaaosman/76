# Menu · 76° UI (B20)

An actions dropdown on the native popover top layer — plus the SplitButton that carries one.

**One job:** Hold the secondary VERBS one control cannot.
**Category:** primitives · **Exports:** MenuButton, SplitButton · **Tags:** menu, dropdown, popover, split-button, actions, kebab

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/menu.json
```

Manual: copy components/seventy-six/menu.tsx, components/seventy-six/menu.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button.

## Overview

A Menu holds **actions** — never navigation (that is the Band) and never selection (that is a Select or Combobox). Items are verbs that name their object, exactly like buttons: "Duplicate order", "Export as CSV", "Archive".

It rides the native `popover` attribute: top layer, light dismiss, and Esc come from the browser, so there is no z-index and no dependency. `MenuButton` is a ghost button whose one job is opening the menu; `SplitButton` welds a primary verb to a chevron holding **variants of the same job** — "Create order" / "Create draft order" — never unrelated actions.

A destructive item turns `--sv-bad` and still confirms in a Dialog — the menu is a doorway, not a confirmation.

## Examples

### Row actions menu

```tsx
import { MenuButton } from '@/components/seventy-six';

<MenuButton
  label="Actions"
  items={[
    { label: 'Duplicate order', onSelect: duplicate },
    { label: 'Export as CSV', onSelect: exportCsv, meta: '⌘E' },
    'separator',
    { label: 'Archive order', onSelect: confirmArchive, danger: true },
  ]}
/>
```

### SplitButton — one job, several doors

```tsx
import { SplitButton } from '@/components/seventy-six';

<SplitButton
  label="Create order"
  onClick={createOrder}
  items={[
    { label: 'Create draft order', onSelect: createDraft },
    { label: 'Create from template', onSelect: fromTemplate },
  ]}
/>
```

## Props

### MenuButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The trigger label; renders a ghost button with a chevron. |
| `items` | `MenuItem[]` | — | { label, onSelect, icon?, meta?, danger?, disabled? } or 'separator'. |
| `align` | `'start' | 'end'` | `'start'` | Panel edge alignment against the trigger. |
| `variant` | `ButtonVariant` | `'ghost'` | Trigger variant. |

### SplitButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label / onClick` | `string / () => void` | — | THE primary verb — it names its object. |
| `items` | `MenuItem[]` | — | Variants of the same job behind the chevron. |
| `menuLabel` | `string` | — | Accessible name for the chevron trigger. |
| `isLoading / loadingLabel` | `boolean / string` | — | B10 loading contract on the primary half; the chevron disables too. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↓ / ↑ | Move through enabled items, wrapping. |
| Home / End | First / last item. |
| Enter / Space | Run the focused item and close. |
| Esc | Close (native popover) and return focus to the trigger. |

- Trigger: `aria-haspopup="menu"` + `aria-controls`; panel: `role="menu"` with `role="menuitem"` children, labelled by the trigger.
- Light dismiss and Esc are native popover behaviors; focus returns to the trigger on close.
- The SplitButton chevron is a separate, individually focusable control with its own aria-label.

## Don't

- No navigation in menus — links live in the Band.
- No selection in menus — picking a value is a Select/Combobox.
- No unrelated actions behind a SplitButton chevron — variants of the SAME job only.
- No destructive work executed from the menu — the item opens a confirming Dialog.

## FAQ

**Why the popover attribute and not a portal?**

The top layer is exactly what portals simulate, natively: it beats every stacking context, closes on outside pointer-down and Esc, and needs no z-index from the ladder.

**Where is the kebab (⋯) trigger?**

Pass an icon-only ghost Button pattern via MenuButton with a short label like "More" — but named actions beat mystery meat; reach for ⋯ only in dense table rows.
