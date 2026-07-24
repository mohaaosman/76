import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEntries } from './lib/load-entries.mjs';

/**
 * Emits a shadcn-compatible registry:
 *   public/r/registry.json  — the index (name, homepage, items)
 *   public/r/<slug>.json    — one installable item per component,
 *                             file contents inlined, metadata included.
 * Consumers: npx shadcn@latest add <base>/r/<slug>.json
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.REGISTRY_BASE ?? 'https://76.zifala.com';

const { entries } = await loadEntries(root);
const outDir = path.join(root, 'public', 'r');
await mkdir(outDir, { recursive: true });

async function fileEntry(relPath) {
  const abs = path.join(root, 'src', relPath);
  const content = await readFile(abs, 'utf8');
  const type = relPath.endsWith('.css')
    ? 'registry:file'
    : relPath.startsWith('lib/')
      ? 'registry:lib'
      : 'registry:ui';
  return { path: `registry/seventy-six/${path.basename(relPath)}`, content, type, target: relPath };
}

/* The shared foundation item every component depends on. */
const tokensItem = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'tokens',
  type: 'registry:theme',
  title: '76° tokens',
  description:
    'The 76° foundation: tokens.css (the only file allowed to contain color literals), base.css (reset, focus contract, mono/tabular utilities), and the cx class combiner.',
  files: [
    await fileEntry('styles/tokens.css'),
    await fileEntry('styles/base.css'),
    await fileEntry('lib/cx.ts'),
  ],
  meta: {
    system: '76° — Seventy Six Degrees',
    category: 'foundations',
    tags: ['tokens', 'css-variables', 'seeds', 'focus-contract'],
  },
};
await writeFile(path.join(outDir, 'tokens.json'), JSON.stringify(tokensItem, null, 2));

const items = [];
for (const entry of entries) {
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: entry.slug,
    type: 'registry:ui',
    title: entry.name,
    description: `${entry.tagline} One job: ${entry.job}`,
    registryDependencies: [
      `${BASE}/r/tokens.json`,
      ...(entry.registryDeps ?? []).map((dep) => `${BASE}/r/${dep}.json`),
    ],
    files: await Promise.all(entry.files.map(fileEntry)),
    categories: [entry.category],
    docs: `${BASE}/llms/${entry.slug}.md`,
    meta: {
      system: '76° — Seventy Six Degrees',
      book: entry.book,
      job: entry.job,
      tags: entry.tags,
      exports: entry.exports,
    },
  };
  await writeFile(path.join(outDir, `${entry.slug}.json`), JSON.stringify(item, null, 2));
  items.push({
    name: entry.slug,
    type: 'registry:ui',
    title: entry.name,
    description: item.description,
    categories: [entry.category],
    files: entry.files.map((f) => ({ path: f, type: 'registry:ui' })),
  });
}

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'seventy-six',
  homepage: BASE,
  items: [
    { name: 'tokens', type: 'registry:theme', title: '76° tokens', description: tokensItem.description },
    ...items,
  ],
};
await writeFile(path.join(outDir, 'registry.json'), JSON.stringify(registry, null, 2));

console.log(`registry: ${items.length + 1} items → public/r/ (base: ${BASE})`);
