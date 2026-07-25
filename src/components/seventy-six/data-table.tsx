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

/**
 * B7 amendment (v0.4.0) · SelectionHead — what a selection DOES. It
 * replaces the CardHead in place: mono count, the verbs, "Clear". No
 * floating action bar, no new z-index — the card's own header already
 * owns that row. Destructive verbs still route through a typed-object
 * Dialog confirm (B10).
 */
export interface SelectionHeadProps {
  count: number;
  /** The object, singular: "order", "invoice". Pluralised for the count. */
  noun: string;
  onClear: () => void;
  /** The verbs, as Buttons. Keep to three; the fourth belongs in a Menu. */
  actions?: ReactNode;
  className?: string;
}

export function SelectionHead({ count, noun, onClear, actions, className }: SelectionHeadProps) {
  return (
    <header className={cx('sv-card__head sv-selhead', className)}>
      <p className="sv-selhead__count sv-mono sv-num" aria-live="polite">
        {count} {count === 1 ? noun : `${noun}s`} selected
      </p>
      <div className="sv-selhead__verbs">
        {actions}
        <button type="button" className="sv-btn sv-btn--link" onClick={onClear}>
          Clear
        </button>
      </div>
    </header>
  );
}

/**
 * B7 amendment (v0.4.0) · FilterLine — the stated filter. Active filters
 * are ONE mono line of running text plus a single "Clear all", and that
 * line doubles as the aria-live announcement. No chips and no pills:
 * B23 Badge stays category-only and non-dismissible.
 */
export interface ActiveFilter {
  /** The dimension, e.g. "Status". */
  label: string;
  /** The chosen value, e.g. "Pending". */
  value: string;
}

export interface FilterLineProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
  /** Optional lead, e.g. "12 of 248". Rendered first, tabular. */
  count?: string;
  className?: string;
}

export function FilterLine({ filters, onClearAll, count, className }: FilterLineProps) {
  if (filters.length === 0 && !count) return null;
  const stated = filters.map((filter) => `${filter.label}: ${filter.value}`).join(' · ');
  return (
    <div className={cx('sv-filterline', className)}>
      <p className="sv-filterline__text sv-mono sv-num" aria-live="polite">
        {[count, stated].filter(Boolean).join(' · ')}
      </p>
      {filters.length > 0 && (
        <button type="button" className="sv-btn sv-btn--link" onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  );
}

/**
 * B7 amendment (v0.4.0) · FilterBar — the controls that SET the filters.
 * A card can carry all three, in this order: CardTabs switches between
 * mutually exclusive presets · FilterBar sets the filters · FilterLine
 * states what is currently set. It is role="group", NOT role="search":
 * this filters a set in place, it does not search the site. It carries no
 * live region either — announcing the change is FilterLine's job, and two
 * live regions for one change is a defect.
 */
export interface FilterBarProps {
  /** The controls — a SearchField, then at most three Selects or Comboboxes. */
  controls: ReactNode;
  /** Anything that is not a filter: a saved-view Popover, an export Button. */
  actions?: ReactNode;
  /** Shown as "Clear all" only when something is actually set. */
  active?: boolean;
  onClearAll?: () => void;
  label?: string;
  className?: string;
}

export function FilterBar({
  controls,
  actions,
  active = false,
  onClearAll,
  label = 'Filters',
  className,
}: FilterBarProps) {
  return (
    <div className={cx('sv-filterbar', className)} role="group" aria-label={label}>
      <div className="sv-filterbar__controls">{controls}</div>
      {(actions || active) && (
        <div className="sv-filterbar__actions">
          {actions}
          {active && (
            <button type="button" className="sv-btn sv-btn--link" onClick={onClearAll}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
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
  /* The ⇧-range anchor is only ever read inside a handler, never rendered —
     as state it would cost a re-render of the whole table per selection. */
  const anchorIdx = useRef(0);
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
      const [a, b] = [Math.min(anchorIdx.current, idx), Math.max(anchorIdx.current, idx)];
      for (let i = a; i <= b; i++) next.add(rowKey(rows[i]));
    } else {
      const key = rowKey(rows[idx]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      anchorIdx.current = idx;
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
