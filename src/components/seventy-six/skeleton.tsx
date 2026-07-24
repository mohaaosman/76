import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import './skeleton.css';

/**
 * B17 · Skeleton — static --sv-wall blocks matching the target anatomy.
 * No shimmer, no pulse. Appears only after 300ms of waiting.
 */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** Render as a circle (avatar ghosts). */
  round?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = '100%', height = 12, round = false, className, style }: SkeletonProps) {
  return (
    <span
      className={cx('sv-skeleton', round && 'sv-skeleton--round', className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

/**
 * Delays children by 300ms so skeletons never flash on fast loads.
 * Wrap the skeleton composition, not the loaded content.
 */
export function SkeletonGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);
  return show ? <>{children}</> : null;
}
