# Prose · 76° UI (B45)

One component that styles a whole subtree — markdown, on-system.

**One job:** Set running copy the system did not author.
**Category:** primitives · **Exports:** Prose · **Tags:** prose, typography, markdown, article, documentation, rich text

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/prose.json
```

Manual: copy components/seventy-six/prose.tsx, components/seventy-six/prose.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

The only component in 76° that styles elements it does not own. It exists because a changelog, a help article, a policy page and a public page are **running copy**, and the product ramp — 13px, tight leading, built for scanning tables — is the wrong instrument for reading paragraphs. Inside `Prose` the body is 16/1.6 on a ~66ch measure, the heading ramp stays inside the product ramp, and markdown rendered to HTML drops straight in.

It is also where **F1 is answered**. 76° refuses the rich-text toolbar and composes a textarea plus a preview instead; `Prose` is that preview, and the same component sets the published article afterwards.

Part E permits italic in running body copy and nowhere else. This is that one place — the firewall's italic rule carries `prose.css` as a registered exception, and a heading inside it is still upright.

## Examples

### An article

Headings, paragraphs, a list, a quote, inline code, a link.

```tsx
import { Prose } from '@/components/seventy-six';

<Prose>
  <h2>Why the donut is refused</h2>
  <p>A2 has banned donut, pie, radial and gauge charts since v0.1.0 …</p>
  <ul>
    <li><b>B6</b> measures each part against its own maximum.</li>
    <li><b>B44</b> divides one total into its shares.</li>
  </ul>
  <blockquote>Every donut a team has drawn was asking B44's question.</blockquote>
</Prose>
```

### Rendered markdown

The subtree came from a markdown renderer; nothing was styled by hand.

```tsx
<Prose dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />

/* Or, with a renderer that returns elements: */
<Prose>{renderMarkdown(source)}</Prose>
```

## Props

### Prose

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The subtree. Every element inside is styled by the stylesheet. |
| `measure` | `boolean` | `true` | The ~66ch cap. Set false inside a column that is already narrow. |
| `className` | `string` | — | Appended to sv-prose. |

## Accessibility

- Prose adds no roles and no ARIA — it is typography, not structure.
- Heading LEVELS belong to the author: the component styles what it is given and never renumbers, so an article dropped into a page keeps the outline the author wrote (A4).
- The measure is capped in ch, so it holds at 200% zoom and reflows rather than truncating at 320px (C7).
- Links keep the base focus contract (C3) and are underlined, never colour-only (C5).

## Don't

- Never wraps application UI — a card, a table or a form inside Prose inherits type it was not designed for.
- Never italic outside running copy: a heading, a label and a caption stay upright (Part E).
- Never for a real snippet — a command with a filename and a copy control is B43 CodeBlock.
- Never nested inside another Prose.
- Never used to smuggle a second type scale into a product screen.

## FAQ

**Why style elements the component does not own?**

Because the alternative is a component per tag, and markdown does not emit components. One stylesheet with a scoped root is the only honest way to make arbitrary authored HTML land on-system.

**Does it use the display tokens?**

No. Its h1 is 27px — the top of the product ramp. The display steps belong to the marketing components alone (firewall rule 17), and an article is not a masthead.

**What about tables inside an article?**

They take the table-header voice and hairlines so they read as 76°, but a table a user must sort, filter or select in is a B7 DataTable, not markdown.
