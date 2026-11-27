# JobList · 76° UI (B58)

Your background operations — what became of each, and where it landed.

**One job:** State what became of each background operation this reader started, and where its result landed.
**Category:** widgets · **Exports:** JobList, Job, JobState, JobListProps · **Tags:** jobs, background, export, import, posting, queue, status, async, operations

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/job-list.json
```

Manual: copy components/seventy-six/job-list.tsx, components/seventy-six/job-list.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: spinner, progress.

## Overview

The posting is ninety seconds from its outcome, and the reader has moved on. This is where they come back to: one row per operation — its name, its mono id and the absolute time it started, its state as a word and a dot (`queued`, `running`, `done`, `failed`), how far it has got, and once it has landed, the one link to what it produced.

**A failed row states what failed and how to fix it, in the row**, because that is where the reader is looking. Errors never toast. "Row 214 has no unit price. Add a price in column F and import the file again."

**The boundary against B9 ActivityList and B41 Timeline.** ActivityList is what other people did across many records; Timeline is one record's history. A JobList is only this reader's own operations, and each row changes in place — queued becomes running becomes finished — rather than a new row being appended for every step.

**It never computes progress.** `progress` is the caller's pre-formatted sentence ("3,120 of 4,700 rows"); `ratio` only draws B4's 3px bar under it while the job runs. Running swaps the dot for B31's spinner and keeps the word.

## Examples

### An afternoon of operations

Queued, running with a ratio, finished with its file, and failed with the fix.

```tsx
import { Card, CardHead, JobList } from '@/components/seventy-six';

<Card>
  <CardHead title="Your operations" subtitle="Today · started by you" />
  <div className="sv-card__body">
    <JobList
      jobs={[
        { id: 'JOB-7741', title: 'Post goods receipt PO-2291', state: 'running',
          time: '25 NOV · 14:28', progress: '3 of 5 lines posted', ratio: 0.6 },
        { id: 'JOB-7740', title: 'Export November stock valuation', state: 'done',
          time: '25 NOV · 14:02', progress: '4,700 of 4,700 rows',
          result: { href: '/files/stock-valuation-nov.csv', label: 'Open stock-valuation-nov.csv' } },
        { id: 'JOB-7738', title: 'Import Harbor & Co price list', state: 'failed',
          time: '25 NOV · 13:47',
          error: 'Row 214 has no unit price. Add a price in column F and import the file again.' },
      ]}
    />
  </div>
</Card>
```

### A job changing in place

Start the export: the row is queued, runs through 4,700 rows, and lands with its link. The change is announced politely.

```tsx
<JobList
  jobs={jobs}
  announcement="Export November receipts finished"
/>
```

## Props

### JobList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `jobs` | `Job[]` | — | This reader's operations, newest first. Each row changes in place. |
| `announcement` | `string` | — | Polite live announcement of the latest change: "Export November receipts finished". |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | id, style, data-*, aria-*, event handlers — spread onto the root; ref forwards to it. className is appended. |

### Job

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Mono operation id: "JOB-7741". |
| `title` | `string` | — | Names the operation and its object: "Post goods receipt PO-2291". |
| `state` | `'queued' | 'running' | 'done' | 'failed'` | — | Stated with the catalog's jobQueued · jobRunning · jobDone · jobFailed. |
| `time / dateTime` | `string` | — | Absolute display time ("25 NOV · 14:28") and its machine form for <time>. |
| `progress` | `string` | — | PRE-FORMATTED absolute progress: "3,120 of 4,700 rows". |
| `ratio` | `number (0–1)` | — | Draws B4's 3px bar under progress while running. Ignored without progress. |
| `result` | `{ href, label? }` | — | Where the result landed, shown when done. label defaults to t.openResult — name the object instead. |
| `error` | `string` | — | Failed only: what failed and how to fix it, one sentence. |

## Accessibility

- A real <ul>; each row reads title, id and time, progress, then the state word.
- Running shows B31's spinner beside the word — the state never rests on motion or colour alone.
- The bar is role="progressbar" labelled by the job title, with aria-valuetext set to the progress sentence, so the absolute numbers are what is announced.
- The result link is described by its job title, so a list of links never reads as several identical "Open result" links.
- State changes are announced through one polite region (announcement), not one region per row.
- Lifecycle: an EmptyState ("Exports and postings you start appear here.") when there are none; a Banner when the list itself failed to load.

## Don't

- Never a percentage without the absolute numbers.
- Never relative time ("2 min ago") in an ERP — absolute, in mono.
- Never a failed row without the fix.
- Never more than one link per row.
- Never other people's operations; that is an ActivityList.
- Never a toast as the only place a job's outcome is stated.

## FAQ

**JobList or Toast?**

A toast may say a job finished, once, while the reader is still there. The JobList is where the outcome stays, with its link, after the toast is gone — and failures go only here.

**Does it poll?**

No. The caller owns the transport (polling, SSE, a socket) and passes the jobs; the list states them.

**Why is the bar only shown while running?**

Once finished or failed, the sentence states the outcome. A full bar beside "Failed" is a bar telling a different story than the word.
