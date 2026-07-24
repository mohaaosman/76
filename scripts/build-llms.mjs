import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEntries } from './lib/load-entries.mjs';

/**
 * Emits the markdown layer from the same entries the site renders:
 *   public/llms.txt        — the llms.txt index
 *   public/llms/<slug>.md  — one full markdown doc per component
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.REGISTRY_BASE ?? 'https://76.zifala.com';

const { entries, entryToMarkdown } = await loadEntries(root);
const outDir = path.join(root, 'public', 'llms');
await mkdir(outDir, { recursive: true });

for (const entry of entries) {
  await writeFile(path.join(outDir, `${entry.slug}.md`), entryToMarkdown(entry, BASE));
}

const index = `# 76° UI — Seventy Six Degrees

> Flat, informational, corporate React components compiled from the 76° Component Book.
> Source distribution (shadcn-compatible registry at ${BASE}/r/), zero runtime
> dependencies, WCAG 2.2 AA. Install: npx shadcn@latest add ${BASE}/r/<name>.json

## Foundations

- [Tokens](${BASE}/r/tokens.json): CSS custom properties — neutrals, per-product seeds, functional colors, geometry, motion.

## Components

${entries.map((e) => `- [${e.name}](${BASE}/llms/${e.slug}.md): ${e.tagline} One job: ${e.job}`).join('\n')}

## Rules that bind every component

- Three colors per screen: ink, one product seed, functional green/red as words and 6px dots only.
- One radius (4px), one shadow, no gradients, no glassmorphism, no dark mode.
- Status is never a filled pill; charts are never donuts; nav is never a sidebar.
- Every interactive element is keyboard-operable with a visible focus state.
`;

await writeFile(path.join(root, 'public', 'llms.txt'), index);
console.log(`llms: index + ${entries.length} markdown docs → public/`);
