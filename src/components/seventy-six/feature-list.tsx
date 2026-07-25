import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './feature-list.css';

/**
 * B48 · FeatureList — the public page's claim, itemised. One job: state
 * what the product does, one item at a time. Every competing library
 * answers this with a grid of tinted icon tiles; 76° answers it with type
 * on hairlines, because A2 refuses the icon-led card and F11 refuses the
 * illustration that follows it. What is left is a newspaper column: a
 * rule, a number, a title, one sentence.
 *
 * A FeatureList is a STATEMENT, never a control — no state, no effects,
 * nothing inside it is clickable. If an item needs to link, the link
 * lives in its body, where a reader can see what it points at.
 */
export interface FeatureItem {
  id: string;
  /** 13/700 ink. Names the capability, not the benefit. */
  title: string;
  /** ONE sentence. Two is a page. */
  body: ReactNode;
  /** Optional mono uppercase line under the body: a count, a spec, a limit. */
  meta?: string;
}

export interface FeatureListProps {
  items: FeatureItem[];
  /** 2 or 3 across at full width. Default 3. */
  columns?: 2 | 3;
  /** Mono ordinals (01, 02, …) above each title. Default true. */
  numbered?: boolean;
  /** Names the set for a screen reader when the section heading is elsewhere. */
  ariaLabel?: string;
  className?: string;
}

/* The ordinal is derived from POSITION, never passed in: a hand-written
   number drifts the moment an item is inserted, and a claim that
   miscounts itself is worse than an unnumbered one. Nine items is the
   ceiling the two digits assume — a tenth feature is a page, not a list. */
const ordinal = (index: number) => String(index + 1).padStart(2, '0');

export function FeatureList({
  items,
  columns = 3,
  numbered = true,
  ariaLabel,
  className,
}: FeatureListProps) {
  return (
    /* A real <ul> so the count is announced, and the column count travels
       as data — a literal in an inline style would put layout back in the
       component and out of the stylesheet's reach. */
    <ul className={cx('sv-features', className)} data-columns={columns} aria-label={ariaLabel}>
      {items.map((item, index) => (
        <li key={item.id} className="sv-features__item">
          {numbered && (
            /* NOT aria-hidden. The ordinal is how the item is referred to
               in copy ("see 03"), and hiding a visible number from a
               screen reader is exactly the asymmetry C5 warns about. It
               takes --sv-ink-soft rather than --sv-ink-faint for the same
               reason C2 gives: a number read aloud is content. */
            <span className="sv-features__ordinal sv-mono">{ordinal(index)}</span>
          )}
          {/* A paragraph, not a heading: the component cannot know what
              level it sits at, and a guessed h3 skips levels on half the
              pages that use it (A4). The section around it carries the
              heading. */}
          <p className="sv-features__title">{item.title}</p>
          <p className="sv-features__body">{item.body}</p>
          {item.meta && <p className="sv-features__meta sv-mono">{item.meta}</p>}
        </li>
      ))}
    </ul>
  );
}
