import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './badge.css';

/**
 * B23 · Badge — a small mono tag for CATEGORY metadata: environment,
 * plan, type, version. Never for live status — status is a StatusWord
 * (dot + word). Never for numbers that matter — those are stats.
 */
export interface BadgeProps {
  children: ReactNode;
  /** neutral (default) · seed — seed marks the CURRENT/active category. */
  tone?: 'neutral' | 'seed';
  className?: string;
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span className={cx('sv-badge sv-mono', tone === 'seed' && 'sv-badge--seed', className)}>
      {children}
    </span>
  );
}
