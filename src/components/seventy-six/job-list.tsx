import { useId } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import { Spinner } from './spinner';
import './progress.css';
import './job-list.css';

/**
 * B58 · JobList — one job: state what became of each background operation
 * this reader started, and where its result landed.
 *
 * The posting is ninety seconds away from its outcome, and the reader has
 * moved on. This is where they come back to: one row per operation — its
 * name, its mono id and the absolute time it started, its state as word +
 * dot, how far it has got, and, once it has landed, the one link to what it
 * produced. A failed row states what failed and how to fix it, in the row,
 * because that is where the reader is looking (errors never toast).
 *
 * **The boundary against B9 ActivityList and B41 Timeline.** ActivityList is
 * what OTHER people did across many records; Timeline is one record's
 * history. A JobList is only this reader's own operations, and each row
 * changes in place — queued becomes running becomes finished — rather than
 * a new row being appended for each step.
 *
 * It never computes progress. `progress` is the caller's pre-formatted
 * sentence ("3,120 of 4,700 rows") and `ratio` only draws B4's 3px bar
 * under it; the words are the information and the bar is illustration.
 *
 * No inset of its own — inside a Card it takes `sv-card__body` (rule 18).
 *
 * Don't: never a percentage without the absolute numbers; never relative
 * time ("2 min ago") in an ERP; never a failed row without the fix; never
 * more than one link per row; never the state as colour or spinner alone;
 * never other people's operations.
 */
export type JobState = 'queued' | 'running' | 'done' | 'failed';

export interface Job {
  id: string;
  /** Names the operation and its object: "Post goods receipt PO-2291". */
  title: string;
  state: JobState;
  /** Absolute display time, e.g. "24 JUL · 14:28". */
  time: string;
  /** Machine timestamp for <time dateTime>. */
  dateTime?: string;
  /** PRE-FORMATTED: "3,120 of 4,700 rows". */
  progress?: string;
  /** 0–1. Draws the B4 bar under `progress`; ignored without it. */
  ratio?: number;
  /** Where the result landed. `label` names it: "Open GR-50817". */
  result?: { href: string; label?: string };
  /** Failed only: what failed and how to fix it, one sentence. */
  error?: string;
}

export interface JobListProps {
  jobs: Job[];
  /** Polite announcement of the latest change: "Post goods receipt PO-2291 finished". */
  announcement?: string;
  className?: string;
}

export function JobList({ jobs, announcement, className }: JobListProps) {
  const t = useStrings();
  const base = useId();
  const word: Record<JobState, string> = {
    queued: t.jobQueued,
    running: t.jobRunning,
    done: t.jobDone,
    failed: t.jobFailed,
  };

  return (
    <div className={cx('sv-jobs', className)}>
      <ul className="sv-jobs__list">
        {jobs.map((job, idx) => {
          const titleId = `${base}-${idx}-title`;
          const showBar = job.state === 'running' && job.progress && job.ratio != null;
          const pct = Math.max(0, Math.min(1, job.ratio ?? 0)) * 100;
          return (
            <li key={job.id} className="sv-jobs__row">
              <div className="sv-jobs__main">
                <p className="sv-jobs__title" id={titleId}>
                  {job.title}
                </p>
                <p className="sv-jobs__meta sv-mono">
                  <span>{job.id}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={job.dateTime} className="sv-num">
                    {job.time}
                  </time>
                </p>
                {job.progress && <p className="sv-jobs__progress sv-num">{job.progress}</p>}
                {showBar && (
                  <div
                    className="sv-progress__track sv-jobs__track"
                    role="progressbar"
                    aria-labelledby={titleId}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pct)}
                    aria-valuetext={job.progress}
                  >
                    <div className="sv-progress__fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
                {job.state === 'failed' && job.error && <p className="sv-jobs__error">{job.error}</p>}
                {job.result && job.state === 'done' && (
                  <a className="sv-jobs__link" href={job.result.href} aria-describedby={titleId}>
                    {job.result.label ?? t.openResult}
                  </a>
                )}
              </div>
              <span className={cx('sv-jobs__state', `sv-jobs__state--${job.state}`)}>
                {job.state === 'running' ? (
                  <Spinner size={12} className="sv-jobs__spin" />
                ) : (
                  <span className="sv-jobs__dot" aria-hidden="true" />
                )}
                {word[job.state]}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="sv-visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
