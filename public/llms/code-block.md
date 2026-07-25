# CodeBlock · 76° UI (B43)

Code as a quotation: monospace, ink, an inset panel on wall — and no syntax highlighting, ever.

**One job:** Print code or a command exactly as it must be typed.
**Category:** primitives · **Exports:** CodeBlock · **Tags:** code-block, no-highlighting, copy-to-clipboard, monospace, line-numbers, scroll-region

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/code-block.json
```

Manual: copy components/seventy-six/code-block.tsx, components/seventy-six/code-block.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button.

## Overview

**No syntax highlighting, ever.** Highlighting is six to nine colours on one surface; Ship Gate point 2 counts the colours on a screen and Law 2 allows neutrals plus one seed, so a token theme fails the gate before it renders. Code in 76° is monospace, ink, and correct. A reader who needs colour to parse a snippet has been handed a snippet that is too long.

The block sits on `--sv-wall` inside a 1px `--sv-line` border — the one place in the system a bordered inset panel is right, because the code is a **quotation** and not a card. The head carries a mono `label` on the left (a filename, a language, a target) and the copy control on the right.

The copy control reads "Copy", becomes "Copied" for two seconds at a **locked minimum width** — B10 says buttons never resize on state change — and announces through a visually-hidden polite live region rather than through the label alone. When `navigator.clipboard` is absent it is **not rendered at all**: a control that cannot work is not shown. A write that fails claims nothing; the label stays "Copy".

`numbered` puts the gutter outside the `<code>` element, `aria-hidden` and `user-select: none`, so a selection or a copy never picks the numbers up; the gutter is sticky, so the numbers hold while the code scrolls under them. Horizontal overflow is `auto` and never `hidden` — the firewall rejects `hidden` and C7 forbids silent truncation. `role="region"` and `tabIndex={0}` are applied **only when the block actually scrolls**, measured at runtime: a keyboard user must be able to scroll it, and an unnecessary tab stop on a block that does not scroll is its own defect.

## Examples

### An install command

A label, one line, and copy. The command is the whole content, so it is also the whole accessible name.

```tsx
import { CodeBlock } from '@/components/seventy-six';

<CodeBlock
  label="TERMINAL"
  code="npx shadcn@latest add https://76.zifala.com/r/code-block.json"
/>
```

### A numbered snippet

Numbers live in a sticky gutter outside the code, so selecting the block copies the code alone.

```tsx
const snippet = `<DataTable
  columns={columns}
  rows={rows}
  empty="No orders match this filter."
/>`;

<CodeBlock label="orders-table.tsx" numbered code={snippet} />
```

## Props

### CodeBlock

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | — | The snippet, printed verbatim. A trailing newline is trimmed so the last line carries no empty number. |
| `label` | `string` | — | Mono head label — a filename, a language, a target. Omitting it drops the head unless copy is available. |
| `numbered` | `boolean` | `false` | Renders the sticky, unselectable line gutter. |
| `copyable` | `boolean` | `true` | Offers the copy control — and only when the clipboard API exists. |
| `ariaLabel` | `string` | — | Names the block; defaults to "Code, {label}", or "Code" when unlabelled. |
| `className` | `string` | — | Applied to the outer panel. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Reaches the block only when it scrolls — the tab stop exists precisely when there is something to scroll. |
| ← / → | Scrolls a focused overflowing block; the focus ring is the standard 2px seed. |

- The scroll container becomes `role="region"` with a name only while it overflows, measured with a `ResizeObserver` — no permanent tab stop on a block that fits.
- Copy confirmation is announced from a visually-hidden `aria-live="polite"` region, so the change is spoken and not merely seen.
- The line gutter is `aria-hidden` and unselectable: screen readers read the code, and a copy returns the code.

## Don't

- No syntax highlighting — the colour count is the whole reason this component exists.
- No CodeBlock for inline code: a term in running copy is a `<code>` in the sentence, which the B45 Prose component carries in 0.5.
- No code as an image — it cannot be copied, searched, read aloud, or zoomed.
- No snippet long enough to need a scrollbar in both directions; that is a file, and a file gets a link.

## FAQ

**Can I add a highlighter myself?**

The component takes a string and prints it, so nothing in the code stops you wrapping it. But a product that overrides this owns the Ship Gate consequence and declares it in its own overrides — exactly as B26 permits for provider brand marks. The escape hatch is written down, not taken quietly.

**Why no filename tab row?**

One label, one snippet. A tab row of files is several snippets, which is a B38 Tabs holding several CodeBlocks — the keyboard model and the ARIA for tabbing belong to that component, not to this one.

**Why is the copy control sometimes missing?**

Because `navigator.clipboard` is unavailable — an insecure origin, or a browser that withholds it. A button that would fail on press is worse than no button, so it is not rendered, and the code stays selectable.
