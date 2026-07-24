import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './data-table.css';

/**
 * B7 · DataTable — mono column headers, mono IDs, dot+word statuses,
 * right-aligned tabular numbers. ERP keyboard contract: ↑/↓ row focus,
 * Enter opens, Space selects, ⇧ range-selects, Home/End jump.
 * Tables scroll horizontally in a card — they never reflow into blobs.
 */
export type ColumnKind = 'text' | 'id' | 'num' | 'status';

export interface Column<Row> {
  key: string;
  header: string;
  kind?: ColumnKind;
  /** Sort state, rendered as aria-sort. Sorting itself is the caller's job. */
  sortable?: boolean;
  sorted?: 'ascending' | 'descending';
  onSort?: () => void;
  render: (row: Row) => ReactNode;
}

export interface DataTableProps<Row> {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Enter / double-click opens a row. */
  onRowOpen?: (row: Row) => void;
  /** Enables Space/⇧ selection. Controlled: pass selected + onSelect. */
  selectable?: boolean;
  selected?: Set<string>;
  onSelect?: (keys: Set<string>) => void;
  /** Announced via aria-live when rows/filters change, e.g. "12 orders · Pending". */
  announcement?: string;
  /** Pagination line, e.g. { from: 1, to: 50, of: 248 }. */
  page?: { from: number; to: number; of: number; onPrev?: () => void; onNext?: () => void };
  className?: string;
}

export function DataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  onRowOpen,
  selectable = false,
  selected,
  onSelect,
  announcement,
  page,
  className,
}: DataTableProps<Row>) {
  const [focusIdx, setFocusIdx] = useState(0);
  const [anchorIdx, setAnchorIdx] = useState(0);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (focusIdx > rows.length - 1) setFocusIdx(Math.max(0, rows.length - 1));
  }, [rows.length, focusIdx]);

  function focusRow(idx: number) {
    setFocusIdx(idx);
    bodyRef.current?.querySelectorAll('tr')[idx]?.focus();
  }

  function toggleSelect(idx: number, range: boolean) {
    if (!selectable || !onSelect) return;
    const next = new Set(selected ?? []);
    if (range) {
      const [a, b] = [Math.min(anchorIdx, idx), Math.max(anchorIdx, idx)];
      for (let i = a; i <= b; i++) next.add(rowKey(rows[i]));
    } else {
      const key = rowKey(rows[idx]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setAnchorIdx(idx);
    }
    onSelect(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTableRowElement>, idx: number) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (idx < rows.length - 1) {
          focusRow(idx + 1);
          if (e.shiftKey) toggleSelect(idx + 1, true);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (idx > 0) {
          focusRow(idx - 1);
          if (e.shiftKey) toggleSelect(idx - 1, true);
        }
        break;
      case 'Home':
        e.preventDefault();
        focusRow(0);
        break;
      case 'End':
        e.preventDefault();
        focusRow(rows.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        onRowOpen?.(rows[idx]);
        break;
      case ' ':
        e.preventDefault();
        toggleSelect(idx, e.shiftKey);
        break;
    }
  }

  return (
    <div className={cx('sv-table', className)}>
      <div className="sv-table__scroll">
        <table className="sv-table__table">
          <caption className="sv-visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cx('sv-table__th', col.kind === 'num' && 'sv-table__cell--num')}
                  aria-sort={col.sorted}
                >
                  {col.sortable ? (
                    <button type="button" className="sv-table__sort sv-mono" onClick={col.onSort}>
                      {col.header}
                      {col.sorted && (
                        <span aria-hidden="true">{col.sorted === 'ascending' ? ' ↑' : ' ↓'}</span>
                      )}
                    </button>
                  ) : (
                    <span className="sv-mono">{col.header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {rows.map((row, idx) => {
              const key = rowKey(row);
              const isSelected = selected?.has(key) ?? false;
              return (
                <tr
                  key={key}
                  className={cx('sv-table__row', isSelected && 'sv-table__row--selected')}
                  tabIndex={idx === focusIdx ? 0 : -1}
                  aria-selected={selectable ? isSelected : undefined}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                  onClick={() => setFocusIdx(idx)}
                  onDoubleClick={() => onRowOpen?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx(
                        'sv-table__td',
                        col.kind === 'num' && 'sv-table__cell--num sv-num',
                        col.kind === 'id' && 'sv-table__cell--id',
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="sv-visually-hidden" aria-live="polite">
        {announcement}
      </p>
      {page && (
        <div className="sv-table__pager">
          <span className="sv-mono sv-num">
            {page.from}–{page.to} OF {page.of}
          </span>
          <span className="sv-table__pager-controls">
            <button
              type="button"
              className="sv-table__pagebtn"
              onClick={page.onPrev}
              disabled={!page.onPrev}
            >
              Previous
            </button>
            <button
              type="button"
              className="sv-table__pagebtn"
              onClick={page.onNext}
              disabled={!page.onNext}
            >
              Next
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
