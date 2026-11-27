import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useLocale, useNounFor, useStrings } from '@/lib/i18n';
import { Checkbox } from './field';
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

/**
 * B7 amendment (v0.6) · totals — the closing row every ledger, invoice,
 * goods receipt and stock transfer ends with. Pushed into `rows` it tells
 * four lies at once: ↑/↓ focuses it, Space selects it, `onRowOpen` opens
 * it, and `page.of` counts it as a record. A real `<tfoot>`, keyed to the
 * same columns, tells none of them. One job: state a table's closing
 * figures.
 */
export interface TotalsRow {
  /** The row's name — "Subtotal", "VAT 20%", "Total due". Mono uppercase. */
  label: string;
  /** Keyed by Column.key. A column with no entry renders an empty cell. */
  cells: Record<string, ReactNode>;
  /** The closing figure of the set. Rendered heavier, on a stronger rule. */
  strong?: boolean;
}

/**
 * B7 amendment (v0.6) · leadHold — a purchase order line table is fourteen
 * columns wide, and by column seven the reader has lost which line they are
 * on. It holds the row's identity column in place while the rest of the
 * table scrolls under it.
 *
 * It is not a pin, and that is exactly what keeps F3 refused. F3 protects
 * against a table whose shape the reader rearranges, and this lets the
 * reader rearrange nothing: it is one boolean the AUTHOR sets, never
 * per-column, never draggable, never resizable, never exposed at runtime.
 * It applies to the FIRST column ONLY, and only when that column already
 * declares `kind: 'id'` — the row identity B7 names. Any other first column
 * and the prop is ignored, because holding a description or an amount in
 * place holds nothing the reader was using to keep their place.
 */
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
  /**
   * B7 amendment (0.7) · rowSync — state that a row's change has not been
   * saved yet, is saving, or failed to save. Stated as a word + dot in the
   * row's first cell (C5), never as a row colour, and never for a row that
   * is in sync — return undefined and the row says nothing.
   */
  rowSync?: (row: Row) => RowSync | undefined;
  /**
   * v0.10 · pointer selection. With `selectable`, the table draws a leading
   * column of B11 Checkboxes and a select-all box in the head — indeterminate
   * while part of the set is selected. They sit OUTSIDE the tab order: the
   * keyboard model is unchanged (one tab stop, Space selects, ⇧ ranges), and
   * the boxes exist for the pointer, which had no way to select at all.
   * `rowLabel` names each box ("Select INV-2291"); defaults to the row key.
   */
  rowLabel?: (row: Row) => string;
  /** Rows that may not be selected (the workspace owner). Their box is disabled. */
  isRowSelectable?: (row: Row) => boolean;
  /**
   * v0.11 · a long table inside a dashboard card. The body scrolls inside
   * this height and the header holds at the top of it, so a reader forty
   * rows down still knows which column is which. Page-level scrolling
   * cannot do this: the table's horizontal scroll region would trap a
   * sticky header, so the region scrolls on both axes instead.
   */
  maxHeight?: number | string;
  /** Closing figures, rendered as a real `<tfoot>`. Never records. */
  totals?: TotalsRow[];
  /** Holds the first column in place while the rest scrolls. Ignored unless
      that column is `kind: 'id'` — see the amendment block above. */
  leadHold?: boolean;
  className?: string;
}

/**
 * The kind → class map, in ONE place. A foot cell has to align and count
 * exactly as the body cells of its own column do; a total that is
 * right-aligned only because someone remembered to re-derive it is a total
 * that will one day be left-aligned.
 */
function cellKind<Row>(col: Column<Row>): string {
  return cx(
    col.kind === 'num' && 'sv-table__cell--num sv-num',
    col.kind === 'id' && 'sv-table__cell--id',
  );
}

/**
 * B7 amendment (v0.4.0) · SelectionHead — what a selection DOES. It
 * replaces the CardHead in place: mono count, the verbs, "Clear". No
 * floating action bar, no new z-index — the card's own header already
 * owns that row. Destructive verbs still route through a typed-object
 * Dialog confirm (B10).
 */
export type RowSync = 'unsaved' | 'saving' | 'failed';

export interface SelectionHeadProps {
  count: number;
  /** The object, singular: "order", "invoice". */
  noun: string;
  /**
   * The plural form: "orders", "statuses". Defaults to `noun` + "s" in
   * English only — any other language, and any irregular English noun,
   * passes it, because a component cannot pluralise a word it does not know.
   */
  nounPlural?: string;
  onClear: () => void;
  /** The verbs, as Buttons. Keep to three; the fourth belongs in a Menu. */
  actions?: ReactNode;
  className?: string;
}

export function SelectionHead({ count, noun, nounPlural, onClear, actions, className }: SelectionHeadProps) {
  const tr = useStrings();
  const { locale } = useLocale();
  const nounFor = useNounFor();
  const plural = nounPlural ?? (locale.startsWith('en') ? `${noun}s` : noun);
  return (
    <header className={cx('sv-card__head sv-selhead', className)}>
      <p className="sv-selhead__count sv-mono sv-num" aria-live="polite">
        {tr.nSelected(count, nounFor(count, noun, plural))}
      </p>
      <div className="sv-selhead__verbs">
        {actions}
        <button type="button" className="sv-btn sv-btn--link" onClick={onClear}>
          {tr.clear}
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

/**
 * B7 amendment (0.8) · the saved view, stated. B42 already names the saved-
 * view PICKER as a reason Popover exists; the gap was the LINE that says
 * the view on screen is no longer the one that was saved. It is stated in
 * FilterLine's own voice, on FilterLine's own row, because the drift IS a
 * statement about the filters — and a second line elsewhere would be two
 * statements about one state.
 */
export interface SavedView {
  /** The saved view's name: "Open POs · Cobalt". */
  name: string;
  /** True when the filters on screen differ from the saved ones. */
  drifted: boolean;
  /** Overwrite the saved view with what is on screen. */
  onSave?: () => void;
  /** Return to the saved filters. */
  onReset?: () => void;
}

export interface FilterLineProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
  /** Optional lead, e.g. "12 of 248". Rendered first, tabular. */
  count?: string;
  /** The saved view this line is measured against (0.8). */
  savedView?: SavedView;
  className?: string;
}

export function FilterLine({ filters, onClearAll, count, savedView, className }: FilterLineProps) {
  const tr = useStrings();
  const drift = savedView?.drifted ? tr.savedViewDrift(savedView.name) : '';
  if (filters.length === 0 && !count && !drift) return null;
  const stated = filters.map((filter) => `${filter.label}: ${filter.value}`).join(' · ');
  return (
    <div className={cx('sv-filterline', className)}>
      <p className="sv-filterline__text sv-mono sv-num" aria-live="polite">
        {[count, stated].filter(Boolean).join(' · ')}
        {/* The drift rides in the same live region, so the reader hears
            "Status: Pending · Changed from the saved view" as ONE change. */}
        {drift && <span className="sv-filterline__drift">{drift}</span>}
      </p>
      <span className="sv-filterline__actions">
        {drift && savedView?.onReset && (
          <button type="button" className="sv-btn sv-btn--link" onClick={savedView.onReset}>
            {tr.resetView}
          </button>
        )}
        {drift && savedView?.onSave && (
          <button type="button" className="sv-btn sv-btn--link" onClick={savedView.onSave}>
            {tr.saveView}
          </button>
        )}
        {filters.length > 0 && (
          <button type="button" className="sv-btn sv-btn--link" onClick={onClearAll}>
            {tr.clearAll}
          </button>
        )}
      </span>
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
  label: labelProp,
  className,
}: FilterBarProps) {
  const tr = useStrings();
  const label = labelProp ?? tr.filters;
  return (
    <div className={cx('sv-filterbar', className)} role="group" aria-label={label}>
      <div className="sv-filterbar__controls">{controls}</div>
      {(actions || active) && (
        <div className="sv-filterbar__actions">
          {actions}
          {active && (
            <button type="button" className="sv-btn sv-btn--link" onClick={onClearAll}>
              {tr.clearAll}
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
  totals,
  leadHold = false,
  rowSync,
  rowLabel,
  isRowSelectable,
  maxHeight,
  className,
}: DataTableProps<Row>) {
  const tr = useStrings();
  /* The ignore, implemented rather than documented: the hold is legal only
     on a first column that is already the row's identity. Everything the
     reader could rearrange is what F3 refuses, so there is nothing here to
     configure — not the column, not its width, not its order. */
  const held = leadHold && columns[0]?.kind === 'id';
  const [focusIdx, setFocusIdx] = useState(0);
  /* The ⇧-range anchor is only ever read inside a handler, never rendered —
     as state it would cost a re-render of the whole table per selection. */
  const anchorIdx = useRef(0);
  const shiftHeld = useRef(false);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (focusIdx > rows.length - 1) setFocusIdx(Math.max(0, rows.length - 1));
  }, [rows.length, focusIdx]);

  function focusRow(idx: number) {
    setFocusIdx(idx);
    bodyRef.current?.querySelectorAll('tr')[idx]?.focus();
  }

  const canSelect = (row: Row) => (isRowSelectable ? isRowSelectable(row) : true);
  const boxes = selectable && !!onSelect;
  const selectableKeys = boxes ? rows.filter(canSelect).map(rowKey) : [];
  const selectedHere = selectableKeys.filter((k) => selected?.has(k)).length;

  function toggleAll() {
    if (!onSelect) return;
    const next = new Set(selected ?? []);
    if (selectedHere === selectableKeys.length) for (const k of selectableKeys) next.delete(k);
    else for (const k of selectableKeys) next.add(k);
    onSelect(next);
  }

  function toggleSelect(idx: number, range: boolean) {
    if (!selectable || !onSelect) return;
    const next = new Set(selected ?? []);
    if (range) {
      const [a, b] = [Math.min(anchorIdx.current, idx), Math.max(anchorIdx.current, idx)];
      for (let i = a; i <= b; i++) if (canSelect(rows[i])) next.add(rowKey(rows[i]));
    } else {
      if (!canSelect(rows[idx])) return;
      const key = rowKey(rows[idx]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      anchorIdx.current = idx;
    }
    onSelect(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTableRowElement>, idx: number) {
    /* The row's keys belong to the ROW. A keystroke from a control inside a
       cell — a role Select, a checkbox the pointer just clicked, a Menu —
       is that control's, and handling it here as well moved focus out from
       under the control or toggled a selection twice. */
    if (e.target !== e.currentTarget) return;
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
    <div className={cx('sv-table', boxes && 'sv-table--checks', className)}>
      <div
        className={cx('sv-table__scroll', maxHeight !== undefined && 'sv-table__scroll--capped')}
        style={maxHeight !== undefined ? { maxBlockSize: maxHeight } : undefined}
        /* A capped region scrolls vertically, so it must be reachable by the
           keyboard as a region too (2.1.1) — rows are focusable, but a reader
           tabbing past the table still needs to scroll it. */
        {...(maxHeight !== undefined ? { role: 'region', 'aria-label': caption, tabIndex: -1 } : {})}
      >
        <table className="sv-table__table">
          <caption className="sv-visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {boxes && (
                <th scope="col" className={cx('sv-table__th sv-table__cell--check', held && 'sv-table__cell--heldcheck')}>
                  <Checkbox
                    label={tr.selectAll}
                    className="sv-table__check"
                    tabIndex={-1}
                    checked={selectableKeys.length > 0 && selectedHere === selectableKeys.length}
                    indeterminate={selectedHere > 0 && selectedHere < selectableKeys.length}
                    disabled={selectableKeys.length === 0}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col, colIdx) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cx(
                    'sv-table__th',
                    col.kind === 'num' && 'sv-table__cell--num',
                    /* One axis, deliberately: this header does not stick
                       vertically today (nothing in data-table.css sets
                       position on .sv-table__th), so the held header cell
                       holds on `left` only. If the header ever goes sticky,
                       `top` joins it on this same element and the ladder
                       step below is already the right one. */
                    held && colIdx === 0 && 'sv-table__cell--held',
                  )}
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
              const sync = rowSync?.(row);
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
                  {boxes && (
                    <td
                      className={cx('sv-table__td sv-table__cell--check', held && 'sv-table__cell--heldcheck')}
                      /* ⇧-click ranges, exactly as ⇧-Space does. Read at pointer-down:
                         the click a <label> forwards to its input drops the modifier. */
                      onPointerDown={(e) => {
                        shiftHeld.current = e.shiftKey;
                        /* ⇧ + pointer would otherwise start a text selection. */
                        if (e.shiftKey) e.preventDefault();
                      }}
                      /* Chromium does not forward a ⇧-click on a <label> to its
                         input at all, so the cell takes the range itself. Adding
                         a range is idempotent, so a browser that DOES forward it
                         lands on the same set. */
                      onClick={(e) => {
                        if (!e.shiftKey) return;
                        e.preventDefault();
                        toggleSelect(idx, true);
                        setFocusIdx(idx);
                      }}
                    >
                      <Checkbox
                        label={tr.selectRow(rowLabel ? rowLabel(row) : key)}
                        className="sv-table__check"
                        tabIndex={-1}
                        checked={isSelected}
                        disabled={!canSelect(row)}
                        onChange={() => {
                          toggleSelect(idx, shiftHeld.current);
                          setFocusIdx(idx);
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key}
                      className={cx(
                        'sv-table__td',
                        cellKind(col),
                        held && colIdx === 0 && 'sv-table__cell--held',
                      )}
                    >
                      {col.render(row)}
                      {colIdx === 0 && sync && (
                        <span className={cx('sv-table__sync sv-mono', `sv-table__sync--${sync}`)}>
                          <span className="sv-table__syncdot" aria-hidden="true" />
                          {sync === 'unsaved' ? tr.rowUnsaved : sync === 'saving' ? tr.rowSaving : tr.rowFailed}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {/* The foot is NOT in `rows`, and that is the whole amendment: a
              closing figure drawn here cannot be focused by ↑/↓, selected by
              Space, opened by `onRowOpen` or counted by `page.of`, because
              none of those models can see it. Nothing guards it — it is
              simply not a record.
              Printing: `<tfoot>` may follow `<tbody>`, and browsers repeat
              the foot at the bottom of every printed page. Under 0.6's
              printed surface a ledger that breaks across pages therefore
              carries these figures on each one, and they are always the
              SET's closing figures, never that page's — which is why `label`
              names its own row ("Total due") and nothing here derives a
              per-page subtotal. */}
          {totals && totals.length > 0 && (
            <tfoot className="sv-table__foot">
              {totals.map((total) => (
                <tr
                  key={total.label}
                  className={cx(
                    'sv-table__footrow',
                    total.strong && 'sv-table__footrow--strong',
                  )}
                >
                  {boxes && <td className="sv-table__td sv-table__cell--check" />}
                  {columns.map((col, colIdx) =>
                    colIdx === 0 ? (
                      /* scope="row": the label names its row, exactly as a
                         column header names its column. */
                      <th
                        key={col.key}
                        scope="row"
                        className={cx(
                          'sv-table__footlabel sv-mono',
                          held && 'sv-table__cell--held',
                        )}
                      >
                        {total.label}
                      </th>
                    ) : (
                      <td key={col.key} className={cx('sv-table__td', cellKind(col))}>
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
      <p className="sv-visually-hidden" aria-live="polite">
        {announcement}
      </p>
      {page && (
        <div className="sv-table__pager">
          <span className="sv-mono sv-num">
            {tr.rangeOf(page.from, page.to, page.of)}
          </span>
          <span className="sv-table__pager-controls">
            <button
              type="button"
              className="sv-table__pagebtn"
              onClick={page.onPrev}
              disabled={!page.onPrev}
            >
              {tr.previous}
            </button>
            <button
              type="button"
              className="sv-table__pagebtn"
              onClick={page.onNext}
              disabled={!page.onNext}
            >
              {tr.next}
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
