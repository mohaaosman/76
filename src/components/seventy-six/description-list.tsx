import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './description-list.css';

/**
 * B28 · DescriptionList — the record readout: what a Drawer or a detail
 * page shows when the answer is a set of labelled facts, not a table.
 * Terms speak mono uppercase like every other 76° label; values carry
 * the information.
 */
export interface DescriptionRow {
  term: string;
  children: ReactNode;
  /** id renders the value in mono · num right-aligns it and goes tabular. */
  kind?: 'text' | 'id' | 'num';
}

export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'> {
  rows: DescriptionRow[];
  /** columns (default) pairs term and value side by side; stacked puts the
      value under its term — the 320px floor falls back to stacked on its own. */
  layout?: 'columns' | 'stacked';
  className?: string;
}

export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList({ rows, layout = 'columns', className, ...rest }, ref) {
  return (
    <dl {...rest} ref={ref} className={cx('sv-dl', layout === 'stacked' && 'sv-dl--stacked', className)}>
      {rows.map((row) => (
        <div className="sv-dl__row" key={row.term}>
          <dt className="sv-dl__term sv-mono">{row.term}</dt>
          <dd
            className={cx(
              'sv-dl__value',
              row.kind === 'id' && 'sv-dl__value--id sv-mono',
              row.kind === 'num' && 'sv-dl__value--num sv-num',
            )}
          >
            {row.children}
          </dd>
        </div>
      ))}
    </dl>
  );
});
