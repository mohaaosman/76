import type { Category } from './types';

/**
 * The four doc categories. Their own module, not part of `./index`, so the
 * shell can name them without importing every entry's prose — that import
 * is what used to drag the whole doc corpus into the first chunk.
 */
export const categories: { id: Category; label: string; note: string }[] = [
  { id: 'chrome', label: 'Chrome', note: 'THE BAND & THE WALL' },
  { id: 'widgets', label: 'Widgets', note: 'ONE TYPE · ONE JOB' },
  { id: 'primitives', label: 'Primitives', note: 'NATIVE-FIRST · ZERO DEPS' },
  { id: 'forms', label: 'Forms', note: 'B11 · HONEST INPUTS' },
];
