import { cx } from '@/lib/cx';
import './meter-list.css';

/**
 * B6 · MeterList — named items with 3px bars. The absolute-numbers
 * subtitle is REQUIRED: a percentage alone is a defect. Replaces every
 * donut/gauge (Firewall A2). Answers "how is each part doing."
 */
export interface MeterItem {
  label: string;
  current: number;
  max: number;
  /** Formatted value shown right, e.g. "92%". */
  value: string;
  /** REQUIRED absolute numbers, e.g. "4,320 of 4,700 pallet positions". */
  subtitle: string;
}

export interface MeterListProps {
  items: MeterItem[];
  className?: string;
}

export function MeterList({ items, className }: MeterListProps) {
  return (
    <div className={cx('sv-meters', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="sv-meters__row"
          role="progressbar"
          aria-label={`${item.label}: ${item.subtitle}`}
          aria-valuenow={item.current}
          aria-valuemin={0}
          aria-valuemax={item.max}
        >
          <div className="sv-meters__line">
            <span className="sv-meters__label">{item.label}</span>
            <span className="sv-meters__value sv-num">{item.value}</span>
          </div>
          <div className="sv-meters__track">
            <div
              className="sv-meters__fill"
              style={{ width: `${item.max > 0 ? Math.min(100, (item.current / item.max) * 100) : 0}%` }}
            />
          </div>
          <p className="sv-meters__subtitle">{item.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
