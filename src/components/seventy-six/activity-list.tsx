import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './activity-list.css';

/**
 * B9 · ActivityList — mono timestamp column + sentence rows with bold
 * entities. Timestamps ABSOLUTE in ERP contexts (14:28, never
 * "3 minutes ago"); relative allowed in consumer seeds with the absolute
 * value always on title. Answers "what needs me."
 */
export interface ActivityItem {
  /** Absolute display time, e.g. "14:28" or "24 JUL 14:28". */
  time: string;
  /** Full machine timestamp for title/dateTime, e.g. "2026-07-24T14:28:00+03:00". */
  dateTime?: string;
  /** The sentence; wrap entities in <b>. */
  children: ReactNode;
}

export interface ActivityListProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityList({ items, className }: ActivityListProps) {
  return (
    <ol className={cx('sv-activity', className)}>
      {items.map((item, i) => (
        <li key={i} className="sv-activity__row">
          <time className="sv-activity__time sv-mono" dateTime={item.dateTime} title={item.dateTime}>
            {item.time}
          </time>
          <p className="sv-activity__sentence">{item.children}</p>
        </li>
      ))}
    </ol>
  );
}
