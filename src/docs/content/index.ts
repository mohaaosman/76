import type { Category, DocEntry } from './types';
import { chrome, forms } from './chrome-forms';
import { widgets } from './widgets';
import { primitives } from './primitives';
import { interaction } from './interaction';
import { auth } from './auth';

export const categories: { id: Category; label: string; note: string }[] = [
  { id: 'chrome', label: 'Chrome', note: 'THE BAND & THE WALL' },
  { id: 'widgets', label: 'Widgets', note: 'ONE TYPE · ONE JOB' },
  { id: 'primitives', label: 'Primitives', note: 'NATIVE-FIRST · ZERO DEPS' },
  { id: 'forms', label: 'Forms', note: 'B11 · HONEST INPUTS' },
];

export const entries: DocEntry[] = [...chrome, ...widgets, ...primitives, ...interaction, ...auth, ...forms];

export type { DocEntry } from './types';
