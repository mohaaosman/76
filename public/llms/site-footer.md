# SiteFooter · 76° UI (B51)

The one place a page is allowed to be a list of links.

**One job:** Close a public page with everything it owes the reader.
**Category:** marketing · **Exports:** SiteFooter · **Tags:** footer, marketing, landing, links, legal, sitemap

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/site-footer.json
```

Manual: copy components/seventy-six/site-footer.tsx, components/seventy-six/site-footer.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

A brand column carrying the `76&deg;` wordmark and one sentence, then up to four labelled link groups, then a hairline and the legal line. It sits on the wall under a rule: no card, no shadow, no second surface.

The accessibility is the whole design. Every footer that ships several unlabelled `<nav>`s is unusable by landmark navigation, so this ships **one** named nav and labels each group's list by its own title. The group titles are **not headings**: injecting h2s at the bottom of a document breaks the outline, and a labelled list is what a link group actually is.

## Examples

### A public footer

Brand column, three groups, legal line, secondary links.

```tsx
import { SiteFooter } from '@/components/seventy-six';

<SiteFooter
  statement="A component library for products that state their information rather than perform it."
  groups={[
    { title: 'SYSTEM', links: [{ label: 'Components', href: '/components' }, { label: 'Foundations', href: '/foundations' }, { label: 'Blocks', href: '/blocks' }] },
    { title: 'RESOURCES', links: [{ label: 'The Component Book', href: '/roadmap' }, { label: 'AI-ready layer', href: '/ai' }] },
    { title: 'PROJECT', links: [{ label: 'Roadmap', href: '/roadmap' }, { label: 'Changelog', href: '/roadmap' }] },
  ]}
  legal="© 2026 SEVENTY SIX DEGREES · MIT"
  secondary={[{ label: 'Licence', href: '/' }, { label: 'Status', href: '/' }]}
/>
```

## Props

### SiteFooter

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` | `FooterGroup[]` | — | title (mono uppercase) · links. At most four groups, six links each. |
| `statement` | `string` | — | One soft sentence beside the wordmark. |
| `legal` | `string` | — | The mono legal line. Required — a footer without it is not one. |
| `secondary` | `FooterLink[]` | — | Bottom-right links: privacy, terms, status. |
| `renderLink` | `(link, className) => ReactNode` | — | Router adapter, exactly as BandNav takes one. Falls back to a plain anchor. |

## Accessibility

- A real <footer> landmark — no role attribute.
- ONE <nav aria-label="Footer"> around every link, including the secondary row. Several unlabelled navs in a footer is the classic landmark defect.
- Each group's <ul> is labelled by its own title via aria-labelledby, with ids derived from a single useId base so they are stable across renders.
- Group titles are not headings: a footer that injects h2s mid-document breaks the outline (A4).
- The wordmark carries one accessible name, "Seventy Six Degrees"; its glyph spans are aria-hidden so it is never spelled out.

## Don't

- No newsletter form — that is a page, or a Plate (B24).
- No social icon tiles (A2 refuses icon-only affordances).
- No language picker that is the only path to anything (C4).
- No second wordmark on a page whose band already carries one.
- No more than four groups or six links per group; a fifth group is a sitemap page.

## FAQ

**Why are the group titles not headings?**

Because heading levels are a document outline, not a type style. A footer that adds four h2s below a page's content puts four top-level sections after the article. The group is a labelled list, and aria-labelledby says so exactly.

**Can it carry the product nav?**

No. Navigation is the Band (B1). A footer holds what a page owes the reader — legal, resources, the wordmark — not the app's own routes.
