import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './timeline.css';

/**
 * B41 · Timeline — one job: state the ordered HISTORY of ONE record, with
 * the gaps visible. It is NOT B9 ActivityList, which is a live, flat feed
 * answering "what needs me", newest first, across many records. A Timeline
 * is one record's life — oldest-first or newest-first as the caller renders
 * it — and it shows what has NOT happened yet as well as what has, which is
 * why `pending` is a first-class tone rather than an absent row. A real
 * <ol> carries the order, so assistive tech announces position for free.
 */
export type TimelineTone = 'done' | 'pending' | 'bad';

export interface TimelineItem {
  id: string;
  /** Absolute display time, e.g. "24 JUL · 14:28". */
  time: string;
  /** Full machine timestamp for <time dateTime>. */
  dateTime?: string;
  title: string;
  /** One sentence. Two is a record page. */
  body?: ReactNode;
  /** Who did it — mono, under the body. */
  actor?: string;
  tone?: TimelineTone;
  /** Mono uppercase day divider rendered ABOVE this item. */
  group?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

/* C5 · a coloured dot is colour-only meaning, so every row says its tone
   in words too — and says it BEFORE the title, the way a reader scanning
   the rail sees the marker before the text. */
const TONE_WORD: Record<TimelineTone, string> = {
  done: 'Completed',
  pending: 'Not started',
  bad: 'Failed',
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cx('sv-timeline', className)}>
      {items.map((item) => {
        const tone = item.tone ?? 'done';
        return (
          <Fragment key={item.id}>
            {item.group && (
              /* The day divider labels the rows below it; it is not a step
                 in the history, so it stays out of the <ol>'s count. */
              <li className="sv-timeline__day sv-mono" role="presentation">
                {item.group}
              </li>
            )}
            <li className="sv-timeline__item">
              <span
                className={cx('sv-timeline__dot', `sv-timeline__dot--${tone}`)}
                aria-hidden="true"
              />
              <time
                className="sv-timeline__time sv-mono"
                dateTime={item.dateTime}
                title={item.dateTime}
              >
                {item.time}
              </time>
              <p className="sv-timeline__title">
                <span className="sv-visually-hidden">{TONE_WORD[tone]}. </span>
                {item.title}
              </p>
              {item.body && <p className="sv-timeline__body">{item.body}</p>}
              {item.actor && <p className="sv-timeline__actor sv-mono">{item.actor}</p>}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
