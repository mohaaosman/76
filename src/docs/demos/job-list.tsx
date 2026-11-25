import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { Card, CardHead } from '@/components/seventy-six/card';
import { Button } from '@/components/seventy-six/button';
import { JobList } from '@/components/seventy-six/job-list';
import type { Job } from '@/components/seventy-six/job-list';

/* One clerk's afternoon, newest first, all on 25 NOV 2026. The running
   posting is the PO-2291 receipt from the EntryTable demo: 5 lines. */
const JOBS: Job[] = [
  {
    id: 'JOB-7742',
    title: 'Recalculate reorder points, warehouse A',
    state: 'queued',
    time: '25 NOV · 14:29',
    dateTime: '2026-11-25T14:29',
  },
  {
    id: 'JOB-7741',
    title: 'Post goods receipt PO-2291',
    state: 'running',
    time: '25 NOV · 14:28',
    dateTime: '2026-11-25T14:28',
    progress: '3 of 5 lines posted',
    ratio: 0.6,
  },
  {
    id: 'JOB-7740',
    title: 'Export November stock valuation',
    state: 'done',
    time: '25 NOV · 14:02',
    dateTime: '2026-11-25T14:02',
    progress: '4,700 of 4,700 rows',
    result: { href: '#/components/job-list', label: 'Open stock-valuation-nov.csv' },
  },
  {
    id: 'JOB-7738',
    title: 'Import Harbor & Co price list',
    state: 'failed',
    time: '25 NOV · 13:47',
    dateTime: '2026-11-25T13:47',
    progress: '213 of 640 rows imported',
    error: 'Row 214 has no unit price. Add a price in column F and import the file again; rows 1–213 were kept.',
  },
];

function JobsBasic() {
  return (
    <Card>
      <CardHead title="Your operations" subtitle="Today · started by you" />
      <div className="sv-card__body">
        <JobList jobs={JOBS} />
      </div>
    </Card>
  );
}

/* A live export: 4,700 rows in steps of 940, five ticks to finish. */
const TOTAL_ROWS = 4700;
const STEP = 940;

function JobsLive() {
  const [rows, setRows] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);

  function start() {
    window.clearInterval(timer.current);
    setRows(0);
    setAnnouncement('Export November receipts queued');
    timer.current = window.setInterval(() => {
      setRows((prev) => {
        const next = Math.min(TOTAL_ROWS, (prev ?? 0) + STEP);
        if (next >= TOTAL_ROWS) {
          window.clearInterval(timer.current);
          setAnnouncement('Export November receipts finished');
        }
        return next;
      });
    }, 700);
  }

  const live: Job | null =
    rows === null
      ? null
      : {
          id: 'JOB-7743',
          title: 'Export November receipts',
          state: rows === 0 ? 'queued' : rows < TOTAL_ROWS ? 'running' : 'done',
          time: '25 NOV · 14:31',
          dateTime: '2026-11-25T14:31',
          progress: rows === 0 ? undefined : `${rows.toLocaleString('en-US')} of ${TOTAL_ROWS.toLocaleString('en-US')} rows`,
          ratio: rows / TOTAL_ROWS,
          result: rows >= TOTAL_ROWS ? { href: '#/components/job-list', label: 'Open receipts-nov.csv' } : undefined,
        };

  const running = live !== null && live.state !== 'done';

  return (
    <Card>
      <CardHead
        title="Your operations"
        subtitle="Today · started by you"
        action={
          <Button variant="link" type="button" onClick={start} disabled={running}>
            Export November receipts
          </Button>
        }
      />
      <div className="sv-card__body">
        <JobList jobs={live ? [live, JOBS[2]] : [JOBS[2]]} announcement={announcement} />
      </div>
    </Card>
  );
}

export const jobListDemos: Record<string, ComponentType> = {
  'job-list-basic': JobsBasic,
  'job-list-live': JobsLive,
};
