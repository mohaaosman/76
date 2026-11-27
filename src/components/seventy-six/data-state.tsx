import { useEffect, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import { Skeleton } from './skeleton';
import { EmptyState } from './empty-state';
import { Banner } from './banner';
import './data-state.css';

/**
 * B64 · DataState (v0.11) — one job: state which of the four lifecycle
 * states a data region is in, and draw the right one.
 *
 * The Craft Floor has always required every data region to ship all four —
 * loading (a skeleton, gated at 300ms), empty, inline error, loaded — and
 * every screen re-assembled them by hand from B16 Skeleton, B15 EmptyState
 * and B22 Banner, so most screens shipped one or two. This is that
 * assembly, once, around ANY widget: a DataTable, a MeterList, a Trend.
 * It adds no state of its own; the caller says which state the data is in.
 *
 * - **loading** — nothing for the first 300ms (a fast answer never flashes
 *   a skeleton), then skeleton rows. The region is `aria-busy` and a
 *   visually hidden line names what is loading. Its height is reserved
 *   with `minHeight`, so the card does not jump when the data lands.
 * - **empty** — B15's one sentence and one action.
 * - **error** — B22 inline, at the region, in --sv-bad: what happened and
 *   how to fix it, with the caller's named retry action. Never a toast.
 * - **ready** — the children, exactly as given.
 *
 * Inside a `<Card>` it sits directly, like the full-bleed B7 it usually
 * wraps; its own loading, empty and error states carry the card inset. A
 * widget that has no inset of its own (B6, B41) still takes `sv-card__body`
 * inside it when ready.
 *
 * Don't: never a spinner as the first paint (that is a skeleton); never an
 * error without what to do; never "No data" — say what is empty and why.
 */
export type DataStatus = 'loading' | 'empty' | 'error' | 'ready';

export interface DataStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  status: DataStatus;
  /** What is loading, for the announcement: "Loading orders". Defaults to the catalog's "Loading…". */
  loadingLabel?: string;
  /** Skeleton rows while loading (default 4), or a skeleton of your own via `skeleton`. */
  rows?: number;
  skeleton?: ReactNode;
  /** The empty state: one sentence saying WHAT is empty, and one action. */
  empty?: { sentence: string; action?: ReactNode };
  /** The inline error: what happened, how to fix it, and a named retry. */
  error?: { title: string; body?: ReactNode; action?: ReactNode };
  /** Reserved height while loading, so the region does not jump. */
  minHeight?: number | string;
  children?: ReactNode;
}

/* The gate: a skeleton that appears for 80ms is a flicker, not a state. */
function useGate(active: boolean, ms = 300) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!active) {
      setOpen(false);
      return;
    }
    const t = window.setTimeout(() => setOpen(true), ms);
    return () => window.clearTimeout(t);
  }, [active, ms]);
  return open;
}

export function DataState({
  status,
  loadingLabel,
  rows = 4,
  skeleton,
  empty,
  error,
  minHeight,
  className,
  style,
  children,
  ...rest
}: DataStateProps) {
  const tr = useStrings();
  const loading = status === 'loading';
  const showSkeleton = useGate(loading);

  return (
    <div
      {...rest}
      className={cx('sv-datastate', `sv-datastate--${status}`, className)}
      aria-busy={loading || undefined}
      style={loading && minHeight !== undefined ? { minHeight, ...style } : style}
    >
      {loading && (
        <div className="sv-datastate__pad">
          <p className="sv-visually-hidden" role="status">
            {loadingLabel ?? tr.loading}
          </p>
          {showSkeleton &&
            (skeleton ?? (
              <div className="sv-datastate__rows" aria-hidden="true">
                {Array.from({ length: rows }, (_, i) => (
                  <div className="sv-datastate__row" key={i}>
                    <Skeleton width="18%" height={10} />
                    <Skeleton width={`${46 - (i % 3) * 8}%`} height={10} />
                    <Skeleton width="14%" height={10} />
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
      {status === 'empty' && empty && <EmptyState sentence={empty.sentence} action={empty.action} />}
      {status === 'error' && error && (
        <div className="sv-datastate__pad">
          <Banner tone="bad" title={error.title} action={error.action}>
            {error.body}
          </Banner>
        </div>
      )}
      {status === 'ready' && children}
    </div>
  );
}
