import type { Category, DocEntry } from './types';
import { chrome, forms } from './chrome-forms';
import { widgets } from './widgets';
import { primitives } from './primitives';
import { interaction } from './interaction';
import { auth } from './auth';
import { structure } from './structure';
import { inputs } from './inputs';

export { categories } from './categories';

export const entries: DocEntry[] = [
  ...chrome,
  ...widgets,
  ...primitives,
  ...interaction,
  ...auth,
  ...structure,
  ...forms,
  ...inputs,
];

export type { DocEntry } from './types';
