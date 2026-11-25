import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import { Button } from './button';
import './field.css';
import './entry-table.css';

/**
 * B53 · EntryTable — one job: type one bounded number into every row of a
 * fixed list of lines, and post the lot once.
 *
 * **It is B7's WRITING sibling, and the keyboard is the whole difference.**
 * B7 is a reader: Enter opens a row, Space selects it. Here Enter and ↓ move
 * the caret to the next line's input and ↑ to the previous one, because a
 * clerk receiving forty lines types a figure and presses Enter forty times.
 * Enter never posts — posting is one deliberate press of the one button in
 * the foot. It speaks B7's voice on purpose (mono headers, mono ids, tabular
 * figures at the inline end) so a receipt reads like the PO it came from.
 *
 * **The list is fixed.** Rows are the caller's lines; this adds none,
 * removes none, sorts none and pages none. A list the reader can grow is a
 * form, and forty lines across pages is two postings.
 *
 * It bounds, it never formats. The figure stays the string the reader typed
 * (C9); the component only reads it as a number to check `bounds(row)`, and
 * the sentence that states the bounds is the caller's, because the caller
 * owns the locale the bounds are written in.
 *
 * Like B7 it draws its rows to the card's edge — its cells carry the 18px
 * inline inset, so inside a Card it sits as a direct child, never in a
 * `sv-card__body`.
 *
 * Don't: never Enter-to-post; never an editable column that is not a number
 * (that is a form, B11); never two entry columns; never derives a total
 * (pass `totals`, pre-formatted); never a row's save state as colour alone;
 * never pages, sorts or filters while entry is open.
 */
export type EntrySync = 'unsaved' | 'saving' | 'failed';

export interface EntryColumn<Row> {
  key: string;
  header: string;
  /** `entry` marks THE one input column; its `render` is ignored. */
  kind?: 'text' | 'id' | 'num' | 'entry';
  render?: (row: Row) => ReactNode;
}

export interface EntryTotalsRow {
  /** Mono uppercase, B7 `totals` voice: "TOTAL RECEIVED". */
  label: string;
  /** Keyed by EntryColumn.key. PRE-FORMATTED — the component never sums. */
  cells: Record<string, ReactNode>;
  strong?: boolean;
}

export interface EntryTableProps<Row> {
  caption: string;
  columns: EntryColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Raw strings exactly as typed, keyed by rowKey. '' means not entered. */
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  /** Inclusive bounds per line: { min: 0, max: 12 } for a line of 12. */
  bounds: (row: Row) => { min: number; max: number; step?: number };
  /** The out-of-bounds sentence, what AND how to fix:
      "Enter 0 to 12 — PO-2291 ordered 12." */
  boundsError: (row: Row) => string;
  /** Accessible name of a line's input: "Received, SKU-4471". */
  inputLabel: (row: Row) => string;
  /** Errors the caller knows about (a server rejection), keyed by rowKey.
      Shown at once and win over the bounds sentence. */
  errors?: Record<string, string>;
  /** Per-line save state, stated as mono word + dot. Absent = saved. */
  sync?: Record<string, EntrySync>;
  totals?: EntryTotalsRow[];
  /** Lines the post would carry. Defaults to the count of non-empty values. */
  changedCount?: number;
  onPost: () => void;
  posting?: boolean;
  /** Shown in the button while posting. Defaults to the catalog's "Working…". */
  postingLabel?: string;
  /** One sentence beside the button: "9 of 14 lines counted". */
  summary?: ReactNode;
  disabled?: boolean;
  className?: string;
}

function outOfBounds(raw: string, min: number, max: number): boolean {
  if (raw.trim() === '') return false;
  const n = Number(raw);
  return !Number.isFinite(n) || n < min || n > max;
}

export function EntryTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  values,
  onValueChange,
  bounds,
  boundsError,
  inputLabel,
  errors,
  sync,
  totals,
  changedCount,
  onPost,
  posting = false,
  postingLabel,
  summary,
  disabled = false,
  className,
}: EntryTableProps<Row>) {
  const t = useStrings();
  const base = useId();
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  const postRef = useRef<HTMLButtonElement>(null);
  /* B11 timing: a bounds error appears on blur, then follows every keystroke
     once shown. Typing "1" on the way to "12" is never an error. */
  const [shown, setShown] = useState<Set<string>>(() => new Set());

  const keys = rows.map(rowKey);
  const invalid = rows.map((row, i) => {
    const { min, max } = bounds(row);
    return outOfBounds(values[keys[i]] ?? '', min, max);
  });
  const count = changedCount ?? keys.filter((k) => (values[k] ?? '').trim() !== '').length;

  function show(key: string) {
    setShown((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }

  function focusLine(idx: number) {
    const input = bodyRef.current?.querySelectorAll<HTMLInputElement>('input')[idx];
    input?.focus();
    input?.select();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>, idx: number) {
    /* ↑/↓ on a number input would nudge the value by one step. In a typist
       table they move between lines instead — the figure changes only when
       the reader types it. */
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      show(keys[idx]);
      if (idx < rows.length - 1) focusLine(idx + 1);
      /* Past the last line, Enter lands on the post button — it does not
         press it. Posting stays one deliberate keystroke of its own. */
      else if (e.key === 'Enter') postRef.current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      show(keys[idx]);
      if (idx > 0) focusLine(idx - 1);
    }
  }

  function post() {
    const first = invalid.indexOf(true);
    if (first !== -1) {
      /* Never posts a line it knows is out of bounds: every error is stated
         and the caret goes to the first one, which is the fix. */
      setShown(new Set(keys.filter((_, i) => invalid[i])));
      focusLine(first);
      return;
    }
    onPost();
  }

  return (
    <div className={cx('sv-entry', className)}>
      <div className="sv-entry__scroll">
        <table className="sv-entry__table">
          <caption className="sv-visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cx(
                    'sv-entry__th',
                    (col.kind === 'num' || col.kind === 'entry') && 'sv-entry__cell--num',
                  )}
                >
                  <span className="sv-mono">{col.header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {rows.map((row, idx) => {
              const key = keys[idx];
              const raw = values[key] ?? '';
              const { min, max, step } = bounds(row);
              const error = errors?.[key] ?? (invalid[idx] && shown.has(key) ? boundsError(row) : undefined);
              const state = sync?.[key];
              const errorId = `${base}-${idx}-err`;
              const syncId = `${base}-${idx}-sync`;
              const describedBy = [error ? errorId : null, state ? syncId : null].filter(Boolean).join(' ') || undefined;
              return (
                <tr key={key} className={cx('sv-entry__row', error && 'sv-entry__row--error')}>
                  {columns.map((col) => {
                    if (col.kind !== 'entry') {
                      return (
                        <td
                          key={col.key}
                          className={cx(
                            'sv-entry__td',
                            col.kind === 'num' && 'sv-entry__cell--num sv-num',
                            col.kind === 'id' && 'sv-entry__cell--id',
                          )}
                        >
                          {col.render?.(row)}
                        </td>
                      );
                    }
                    return (
                      <td key={col.key} className="sv-entry__td sv-entry__cell--entry">
                        <div className="sv-entry__control">
                          {state && (
                            <span
                              id={syncId}
                              className={cx('sv-entry__sync sv-mono', `sv-entry__sync--${state}`)}
                            >
                              <span className="sv-entry__dot" aria-hidden="true" />
                              {state === 'unsaved' ? t.rowUnsaved : state === 'saving' ? t.rowSaving : t.rowFailed}
                            </span>
                          )}
                          <input
                            type="number"
                            inputMode="decimal"
                            className={cx(
                              'sv-field__input sv-entry__input sv-num',
                              error && 'sv-field__input--error',
                            )}
                            value={raw}
                            min={min}
                            max={max}
                            step={step ?? 'any'}
                            disabled={disabled}
                            /* readOnly, not disabled, while posting: a
                               disabled input drops the caret, and the reader
                               should still be on their line when it lands. */
                            readOnly={posting}
                            aria-label={inputLabel(row)}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={describedBy}
                            onChange={(e) => onValueChange(key, e.target.value)}
                            onFocus={(e) => e.currentTarget.select()}
                            onBlur={() => show(key)}
                            onKeyDown={(e) => onKeyDown(e, idx)}
                          />
                        </div>
                        {error && (
                          <p id={errorId} className="sv-entry__error">
                            {error}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {totals && totals.length > 0 && (
            <tfoot>
              {totals.map((total) => (
                <tr
                  key={total.label}
                  className={cx('sv-entry__footrow', total.strong && 'sv-entry__footrow--strong')}
                >
                  {columns.map((col, colIdx) =>
                    colIdx === 0 ? (
                      <th key={col.key} scope="row" className="sv-entry__footlabel sv-mono">
                        {total.label}
                      </th>
                    ) : (
                      <td
                        key={col.key}
                        className={cx(
                          'sv-entry__td',
                          (col.kind === 'num' || col.kind === 'entry') && 'sv-entry__cell--num sv-num',
                        )}
                      >
                        {total.cells[col.key]}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      <div className="sv-entry__foot">
        {summary && <p className="sv-entry__summary sv-num">{summary}</p>}
        <Button
          ref={postRef}
          type="button"
          variant="primary"
          className="sv-entry__post"
          onClick={post}
          disabled={disabled || count === 0}
          isLoading={posting}
          loadingLabel={postingLabel ?? t.posting}
        >
          {t.post(count)}
        </Button>
      </div>
    </div>
  );
}
