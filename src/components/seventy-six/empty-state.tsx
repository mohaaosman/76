import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './empty-state.css';

/**
 * B15 · EmptyState — one soft sentence stating what would appear here
 * and why it's empty + one primary action. No illustration, no humor,
 * max 2 lines.
 */
export interface EmptyStateProps {
  /** What would appear here, and why it's empty. Calm, factual, specific. */
  sentence: string;
  /** Exactly one primary action (a Button). */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ sentence, action, className }: EmptyStateProps) {
  return (
    <div className={cx('sv-empty', className)}>
      <p className="sv-empty__sentence">{sentence}</p>
      {action && <div className="sv-empty__action">{action}</div>}
    </div>
  );
}
