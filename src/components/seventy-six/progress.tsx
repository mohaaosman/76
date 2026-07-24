import { cx } from '@/lib/cx';
import './progress.css';

/**
 * B4 · Progress — value against target + one 3px bar + soft context.
 * The visible numbers are the primary information; the bar is illustration.
 * No red bars: danger is a word, not a bar.
 */
export interface ProgressProps {
  title: string;
  current: number;
  target: number;
  /** Renders the numbers, e.g. (c, t) => `$${c}K / $${t}K`. */
  format?: (current: number, target: number) => string;
  /** Faint context line under the bar. */
  context?: string;
  className?: string;
}

export function Progress({
  title,
  current,
  target,
  format = (c, t) => `${c.toLocaleString('en-US')} / ${t.toLocaleString('en-US')}`,
  context,
  className,
}: ProgressProps) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  return (
    <div className={cx('sv-progress', className)}>
      <p className="sv-progress__title">{title}</p>
      <p className="sv-progress__value sv-num">{format(current, target)}</p>
      <div
        className="sv-progress__track"
        role="progressbar"
        aria-label={title}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        <div className="sv-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      {context && <p className="sv-progress__context">{context}</p>}
    </div>
  );
}
