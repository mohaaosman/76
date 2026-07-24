import type { HTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import './status-word.css';

/**
 * B12 · StatusWord — 6px currentColor dot + word. The word IS the meaning;
 * the dot is rhythm. Vocabulary is registered per product — inventing
 * statuses ad hoc is a defect. Never pills, never filled chips.
 */
export type StatusTone = 'ok' | 'neutral' | 'bad';

export interface StatusWordProps extends HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone;
  children: string;
}

export function StatusWord({ tone, className, children, ...rest }: StatusWordProps) {
  return (
    <span {...rest} className={cx('sv-status', `sv-status--${tone}`, className)}>
      <span className="sv-status__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
