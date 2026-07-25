import { cx } from '@/lib/cx';
import './divider.css';

/**
 * B29 · Divider — a hairline that separates two groups, optionally
 * naming the group below it in mono uppercase. A labelled divider is a
 * section marker, not a heading: it never replaces an <h2>.
 */
export interface DividerProps {
  /** Mono uppercase text sitting in the rule, e.g. "OR" or "ARCHIVED". */
  label?: string;
  align?: 'start' | 'center';
  className?: string;
}

export function Divider({ label, align = 'center', className }: DividerProps) {
  if (!label) return <hr className={cx('sv-divider', className)} />;
  return (
    <div
      className={cx('sv-divider__labelled', align === 'start' && 'sv-divider__labelled--start', className)}
      role="separator"
      aria-label={label}
    >
      <span className="sv-divider__rule" aria-hidden="true" />
      <span className="sv-divider__label sv-mono" aria-hidden="true">
        {label}
      </span>
      <span className="sv-divider__rule" aria-hidden="true" />
    </div>
  );
}
