# Kbd · 76° UI (B32)

A key, printed — mono cap on wall, for shortcuts that exist.

**One job:** Print the key that triggers something.
**Category:** primitives · **Exports:** Kbd · **Tags:** kbd, keyboard, shortcut, hotkey, command

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/kbd.json
```

Manual: copy components/seventy-six/kbd.tsx, components/seventy-six/kbd.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Real `<kbd>` elements in Fragment Mono on a wall-toned cap with a slightly heavier bottom border — the only skeuomorphic gesture in 76°, and it earns its place because a key cap is a physical object. On the band the cap goes transparent and takes band tokens.

It documents; it never acts. Every shortcut a Kbd prints must also have a visible control (C4) — the ⌘K cap in the search trigger sits beside a real button, and the Menu (B20) prints caps next to items that are also clickable.

## Examples

### Chords and sequences

```tsx
import { Kbd } from '@/components/seventy-six';

<Kbd keys={['⌘', 'K']} />
<Kbd keys={['G', 'O']} separator="then" />
```

## Props

### Kbd

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string[]` | — | One key per string — rendered as separate caps. |
| `separator` | `string` | — | Shown between caps for a sequence ("then"). Omit for a chord. |

## Accessibility

- Each cap is a real <kbd> element, so assistive tech announces it as keyboard input.
- A printed shortcut never replaces a visible control (C4) — it labels one that already exists.
- Glyph keys (⌘, ⇧, ⏎) are printed as characters, not images, so they scale and translate with the text.

## Don't

- No Kbd on a shortcut the app does not actually bind.
- No clickable Kbd — it is documentation, not a button.
- No pill radius; the cap takes the registered 3px, like the system's bars.
- No key sequence longer than three caps — that is a docs page, not a hint.

## FAQ

**Where do these belong?**

The ⌘K search trigger, Menu items, Dialog footers, and the shortcuts section of a settings page. Anywhere the shortcut already works.
