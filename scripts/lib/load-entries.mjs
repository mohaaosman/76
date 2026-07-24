import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

/**
 * The doc entries are pure-data TypeScript. Bundle them with esbuild
 * (already present via vite) so node scripts can import the same single
 * source of truth the site renders.
 */
export async function loadEntries(root) {
  const outDir = path.join(root, 'node_modules', '.sv-tmp');
  await mkdir(outDir, { recursive: true });
  const entrySrc = `
    export { entries, categories } from '${path.join(root, 'src/docs/content/index.ts').replace(/\\/g, '/')}';
    export { entryToMarkdown } from '${path.join(root, 'src/docs/content/markdown.ts').replace(/\\/g, '/')}';
    export { blocks, templates, compositions } from '${path.join(root, 'src/docs/content/compositions.ts').replace(/\\/g, '/')}';
  `;
  const entryFile = path.join(outDir, 'entry.ts');
  await writeFile(entryFile, entrySrc);
  const outFile = path.join(outDir, 'entries.mjs');
  await build({
    entryPoints: [entryFile],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    outfile: outFile,
    logLevel: 'silent',
  });
  return import(pathToFileURL(outFile).href + `?t=${Date.now()}`);
}
