import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { loadEntries } from './scripts/lib/load-entries.mjs';

/**
 * The corpus counts are DERIVED at build time, never typed by hand — the
 * home page states "36 components · B1–B35" and those numbers come from the
 * doc entries themselves. Inlining them as constants keeps the single
 * source of truth while leaving the ~140kB corpus out of the landing
 * chunk: the entries load only with the routes that render their prose.
 */
const root = fileURLToPath(new URL('.', import.meta.url));
const { entries } = await loadEntries(root);
const specs: number[] = entries
  .map((entry: { book: string }) => Number(entry.book.replace(/\D/g, '')))
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  define: {
    __ENTRY_COUNT__: JSON.stringify(entries.length),
    __SPEC_COUNT__: JSON.stringify(new Set(specs).size),
    __HIGHEST_SPEC__: JSON.stringify(Math.max(...specs)),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
