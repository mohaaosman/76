import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './prose.css';

/**
 * B45 · Prose — the one component in 76° that styles elements it does not own.
 * One job: make authored HTML read as running copy inside the system.
 *
 * The product ramp is 13/1.5 and tight because it was built to scan a table.
 * Set two screens of a policy page in it and the reader is done. Prose is a
 * second ramp — 16/1.6 on a 66ch measure — scoped to one subtree, so the two
 * never argue: markdown rendered to HTML drops in and comes out on-system,
 * and nothing outside a `.sv-prose` changes by a pixel.
 *
 * It adds no roles and no ARIA, and it NEVER renumbers a heading. Levels are
 * the AUTHOR'S: an `h3` arriving from markdown is styled as an h3 and stays an
 * h3. The document outline is the author's structure, and a component that
 * re-ranks it rewrites what a screen reader announces — so this one only sets
 * type on what it is given.
 */
export interface ProseProps {
  children: ReactNode;
  className?: string;
  /** Drops the measure cap for a subtree that is already in a narrow column. */
  measure?: boolean;
}

export function Prose({ children, className, measure = true }: ProseProps) {
  /* One div, no wrappers. Anything else would put an element between the
     author's markup and the styles meant for it — and the child selectors
     that carry the rhythm (`> :first-child`) resolve against THIS element. */
  return <div className={cx('sv-prose', !measure && 'sv-prose--full', className)}>{children}</div>;
}
