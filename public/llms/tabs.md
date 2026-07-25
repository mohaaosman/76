# Tabs · 76° UI (B38)

A hairline row on the wall — the sheet's whole content region, switched.

**One job:** Switch which set of cards the sheet shows, without touching the URL.
**Category:** primitives · **Exports:** Tabs, TabPanel · **Tags:** tabs, tablist, tabpanel, sections, content switch, sheet

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/tabs.json
```

Manual: copy components/seventy-six/tabs.tsx, components/seventy-six/tabs.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A row of real tabs on the wall, directly above the region they switch — most often between the band and the first card, or under a stat row that stays put while the analysis below it changes: 14/700 labels in soft ink with an optional mono tabular count, and the active one in seed text under a 2px seed underline sitting on the row's own hairline rather than beside it. There is no fill on a tab, ever — a tinted tab on the wall reads as a pill. Every tab owns its **own** `TabPanel`, tied to it by a shared `idBase`: pass the same base to both, render all the panels, and let `hidden` decide which one shows.

Three components look alike and are not interchangeable, and the line between them is what changes. **BandSubTabs** (B1) **navigate** — links, a URL change, on the band. **CardTabs** (B8) **filter one card's content in place**, on that card's hairline. **Tabs** switch the sheet's whole content region and change no URL. Anything that deserves a URL is a band nav item; anything that only changes one card is B8. There is no `filters` mode here — `aria-pressed` buttons are B8's job, and a tablist that is sometimes not a tablist is a defect.

## Examples

### Switching the sheet's sections

One panel per tab, all rendered — the id contract only holds if the panel the active tab names is in the document.

```tsx
import { useState } from 'react';
import { Tabs, TabPanel } from '@/components/seventy-six';

const [section, setSection] = useState('summary');

<Tabs
  label="Report sections"
  idBase="report"
  active={section}
  onChange={setSection}
  tabs={[
    { id: 'summary', label: 'Summary' },
    { id: 'lines', label: 'Line items', count: 148 },
    { id: 'audit', label: 'Audit', count: 6 },
  ]}
/>

<TabPanel idBase="report" tabId="summary" active={section === 'summary'}>
  {/* the cards this section holds */}
</TabPanel>
```

## Props

### Tabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `Tab[]` | — | id · label · optional mono tabular count. Cap: five. |
| `active / onChange` | `string / (id) => void` | — | Controlled active tab. |
| `label` | `string` | — | REQUIRED accessible name for the tablist, e.g. "Report sections". |
| `idBase` | `string` | — | Ties each tab to its OWN panel. Defaults to a generated id — pass it explicitly whenever TabPanel is used. |

### TabPanel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `idBase` | `string` | — | REQUIRED — the same base the Tabs carries, or aria-controls points at nothing. |
| `tabId` | `string` | — | The id of the tab this panel belongs to. |
| `active` | `boolean` | — | False renders the panel hidden. Render every panel and let this decide. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Enters the row at the active tab; again, moves into its panel. |
| ← / → | Move to the previous / next tab and switch the region with it. |
| Home / End | Jump to the first / last tab. |

- A real role="tablist" of role="tab" buttons over role="tabpanel" panels — never aria-pressed, which is B8's filters mode.
- The active tab is the only tab stop (roving tabindex), and activation is automatic: arrowing moves focus and the region together, because the panels are already mounted and there is nothing to wait for.
- The panel takes tabIndex 0, so a region of cards holding no focusable content is still reachable — otherwise Tab steps straight past what the tabs just switched to.
- The active state is weight, aria-selected and a 2px underline as well as seed ink; colour never carries it alone (C5).
- Below 1000px the row wraps onto more lines. A nav-like row never becomes a horizontal scroller (A2), nothing is dropped, and the hairline still spans the full width (C7).

## Don't

- No sixth tab — the cap is five, and the sixth section is a band nav item.
- No filters mode; aria-pressed buttons filtering one card are B8.
- No tab that changes the URL — addressable state is navigation, and navigation is the Band (B1).
- No horizontal scroller below 1000px; the row wraps (A2).
- No fill or pill on a tab; the underline carries the state.
- No TabPanel without the idBase its Tabs carries — the aria-controls contract then breaks silently.

## FAQ

**Tabs, CardTabs or BandSubTabs?**

Pick by what changes, not by what it looks like: the URL is B1, one card's content is B8, the sheet's whole content region is B38.

**Why automatic activation rather than Enter to confirm?**

Manual activation exists for tabs that fetch on selection. These do not — the panels are already in the document, so making the reader press a second key buys nothing.

**Can the active tab live in the URL?**

Then it is not a tab. State a reader should be able to link to or reload into is navigation and belongs on the band.
