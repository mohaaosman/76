import type { HTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import './sheet.css';

/**
 * B2 · Sheet — the platinum wall the paper sits on. The first child row
 * gets data-overlap: margin-top -44px, pinning paper over the band edge.
 * Exactly ONE overlap row per page — a signature, not a repeating trick.
 */
export function Sheet({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <main {...rest} id="sv-content" className={cx('sv-sheet', className)}>
      {children}
    </main>
  );
}

/** 12-col grid row, 14px gutters. Use the canonical splits. */
export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  /** 'stats' = repeat(4,1fr) (2×2 below 1000px) · 'main' = 1.7fr/1fr · 'full'. */
  split?: 'stats' | 'main' | 'full';
  /** The single overlap row that pins over the band. */
  overlap?: boolean;
}

export function Row({ split = 'full', overlap = false, className, children, ...rest }: RowProps) {
  return (
    <div
      {...rest}
      className={cx('sv-row', `sv-row--${split}`, className)}
      data-overlap={overlap || undefined}
    >
      {children}
    </div>
  );
}
