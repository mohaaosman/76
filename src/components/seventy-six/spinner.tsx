import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './spinner.css';

/**
 * B31 · Spinner & Busy — the wait, stated. A Spinner is the inline
 * 12–16px mark beside a label; Busy covers a whole region with one
 * centred spinner and a sentence naming what is loading. Skeleton (B17)
 * still owns first paint — a spinner is for a region that already has
 * content and is fetching the next of it.
 */
export interface SpinnerProps {
  size?: 12 | 16 | 20;
  /** Announced label. Omit only when an adjacent live region says it. */
  label?: string;
  className?: string;
}

export function Spinner({ size = 12, label, className }: SpinnerProps) {
  return (
    <span className={cx('sv-spin', className)} role={label ? 'status' : undefined}>
      <svg
        className="sv-spin__mark"
        viewBox="0 0 12 12"
        width={size}
        height={size}
        aria-hidden="true"
      >
        <circle
          cx="6"
          cy="6"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="23"
          strokeDashoffset="8"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="sv-visually-hidden">{label}</span>}
    </span>
  );
}

export interface BusyProps {
  /** REQUIRED sentence naming what is loading: "Loading July orders…". */
  label: string;
  /** Region height while empty. Match the component it replaces. */
  minHeight?: number;
  /** Rendered underneath at reduced emphasis when refreshing in place. */
  children?: ReactNode;
  className?: string;
}

export function Busy({ label, minHeight = 160, children, className }: BusyProps) {
  return (
    <div
      className={cx('sv-busy', children != null && 'sv-busy--over', className)}
      style={{ minHeight }}
      aria-busy="true"
      aria-live="polite"
    >
      {children}
      <p className="sv-busy__line">
        <Spinner size={16} />
        <span>{label}</span>
      </p>
    </div>
  );
}
