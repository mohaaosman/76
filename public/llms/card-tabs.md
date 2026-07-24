# CardTabs · 76° UI (B8)

In-card filter tabs on the card hairline — honest ARIA in both of its two modes.

**One job:** Filter one card's content in place.
**Category:** widgets · **Exports:** CardTabs · **Tags:** tabs, filters, tablist, aria-pressed, in-card

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/card-tabs.json
```

Manual: copy components/seventy-six/card-tabs.tsx, components/seventy-six/card-tabs.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

CardTabs filter content in place — that is what separates them from BandSubTabs, which navigate. 13.5/600 soft text; the active tab turns seed with a 2px underline sitting exactly on the card's hairline.

Pick the mode by behavior and never mix (B8): **tabs** renders a real tablist/tab/tabpanel with arrow-key movement for client-side panels; **filters** renders plain buttons with `aria-pressed` when the click drives a server-side filter.

## Examples

### Filtering a table

```tsx
import { useState } from 'react';
import { Card, CardHead, CardTabs } from '@/components/seventy-six';

const [filter, setFilter] = useState('all');

<Card>
  <CardHead title="Orders" subtitle="July · warehouse A" />
  <CardTabs
    mode="filters"
    tabs={[
      { id: 'all', label: 'All', count: 248 },
      { id: 'pending', label: 'Pending', count: 36 },
      { id: 'hold', label: 'On hold', count: 5 },
    ]}
    active={filter}
    onChange={setFilter}
  />
  {/* table filtered by `filter` */}
</Card>
```

## Props

### CardTabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `CardTab[]` | — | { id, label, count? } — count renders as a mono figure. |
| `active / onChange` | `string / (id) => void` | — | Controlled active tab. |
| `mode` | `'tabs' | 'filters'` | `'tabs'` | tabs = ARIA tablist with arrow keys; filters = aria-pressed buttons. |
| `idBase` | `string` | — | In tabs mode, ties tabs to your panel: panel id={`${idBase}-panel`}. |

## Accessibility

| Keys | Action |
| --- | --- |
| ← / → · Home / End | Move between tabs (tabs mode; selection follows focus). |

- In tabs mode the active tab is the only tab stop (roving tabindex) and panels carry role="tabpanel".
- In filters mode each button exposes `aria-pressed` — no fake tab semantics for things that are not tabs.

## Don't

- No third nesting level — deeper structure becomes a page.
- No mixing modes: server filters never wear role="tab".
- No pill or filled active states; the underline + seed text is the whole state.

## FAQ

**Tabs or filters — which mode?**

Does the click swap client-rendered panels? tabs. Does it refetch or refilter data in the same view? filters. Behavior decides, never appearance — both look identical.

**How do I show counts?**

Pass count per tab; it renders as a mono tabular figure after the label, in faint ink.
