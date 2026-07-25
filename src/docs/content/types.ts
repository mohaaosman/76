/**
 * Doc entry model — PURE DATA. No React imports here: the same entries
 * feed the site, the copy-as-markdown button, llms.txt, and the registry.
 * Live demos are looked up separately by demoKey (see ../demos.tsx).
 */
export type Category = 'chrome' | 'widgets' | 'primitives' | 'forms' | 'marketing';

export interface DocExample {
  title: string;
  description?: string;
  code: string;
  demoKey: string;
  /** Preview surface: wall (default), paper, or band (for band chrome). */
  surface?: 'wall' | 'paper' | 'band';
}

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface KeyRow {
  keys: string;
  action: string;
}

export interface DocEntry {
  slug: string;
  name: string;
  /** Component Book reference, e.g. "B10". */
  book: string;
  category: Category;
  /** One-line description naming the foundation. */
  tagline: string;
  /** The widget's one job (Law 3). */
  job: string;
  /** Feature tags for search / registry metadata. */
  tags: string[];
  /** Exported symbols. */
  exports: string[];
  /** Source files, relative to the registry root. */
  files: string[];
  /** Other 76° registry items this depends on. */
  registryDeps?: string[];
  /** Prose paragraphs (support <b> and <code> via a tiny renderer). */
  intro: string[];
  examples: DocExample[];
  props: { component: string; rows: PropRow[] }[];
  a11y: { keyboard?: KeyRow[]; notes: string[] };
  donts: string[];
  faq: { q: string; a: string }[];
}
