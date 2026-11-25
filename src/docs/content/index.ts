import type { Category, DocEntry } from './types';
import { chrome, forms } from './chrome-forms';
import { widgets } from './widgets';
import { primitives } from './primitives';
import { interaction } from './interaction';
import { auth } from './auth';
import { structure } from './structure';
import { inputs } from './inputs';
import { marketing } from './marketing';
import { entryTableEntry } from './entries/entry-table';
import { scanFieldEntry } from './entries/scan-field';
import { jobListEntry } from './entries/job-list';
import { treeTableEntry } from './entries/tree-table';
import { crossTableEntry } from './entries/cross-table';
import { funnelListEntry } from './entries/funnel-list';
import { messageThreadEntry } from './entries/message-thread';
import { settingListEntry } from './entries/setting-list';

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
  ...marketing,
  /* v0.10 · the 0.7 – 0.9 surfaces */
  entryTableEntry,
  scanFieldEntry,
  jobListEntry,
  treeTableEntry,
  crossTableEntry,
  funnelListEntry,
  messageThreadEntry,
  settingListEntry,
];

export type { DocEntry } from './types';
