import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import './cross-table.css';

/**
 * B60 · CrossTable — one job: state ONE measure at every intersection of two
 * dimensions. Revenue by region and quarter; shipments by warehouse and
 * carrier.
 *
 * **The boundary.** B7 `DataTable` states records — each row a thing, each
 * column a different attribute of it. Here every cell is the SAME measure and
 * both axes are dimensions, so both get real headers: `<th scope="col">` for
 * one, `<th scope="row">` for the other, and a corner that names both and the
 * measure ("REGION × QUARTER · REVENUE"). A second measure is a second table.
 *
 * **The heatmap stays refused.** The matrix is stated in figures; a colour
 * scale is six colours on one surface. The one emphasis is `highlight` — a
 * single cell in bold ink on the seed tint — because a reader can find one
 * marked cell, and cannot rank twenty shaded ones.
 *
 * **It never computes (C9).** Cells and totals are pre-formatted strings; the
 * caller owes the reader that the totals reconcile.
 *
 * It scrolls inside its container and never reflows; the row-header column
 * holds in place. Full-bleed like B7: cells inset 18px, hairlines to the edge.
 *
 * Don't: never a colour scale or shaded cells; never two highlighted cells;
 * never two measures in one cell; never a zero printed for "no value" — an
 * absent intersection is an em dash, and zero is a figure.
 */
export interface CrossAxisItem {
  key: string;
  /** The dimension value, e.g. "North", "Q3". */
  header: string;
  /** Mono metadata beside a row header — a warehouse code. */
  code?: string;
}

export interface CrossTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible caption, e.g. "Revenue by region and quarter, FY2026, $ thousands". */
  caption: string;
  /** The row dimension's name: "REGION". */
  rowDimension: string;
  /** The column dimension's name: "QUARTER". */
  colDimension: string;
  /** The one measure every cell states: "REVENUE ($K)". */
  measure: string;
  rows: CrossAxisItem[];
  columns: CrossAxisItem[];
  /** PRE-FORMATTED, `cells[rowKey][colKey]`. Missing, null or '' renders an em dash. */
  cells: Record<string, Record<string, string | null | undefined>>;
  /** A totals column, keyed by row key. */
  rowTotals?: Record<string, string>;
  /** A totals row, keyed by column key. */
  colTotals?: Record<string, string>;
  /** The figure where both totals meet. */
  grandTotal?: string;
  /** ONE cell marked in bold ink on the seed tint. `note` is announced with it. */
  highlight?: { row: string; col: string; note?: string };
  /** Header of the totals column and row. */
  totalLabel?: string;
  /** Announced for an empty intersection. */
  noValueLabel?: string;
  className?: string;
}

function Cell({ value, noValueLabel }: { value: string | null | undefined; noValueLabel: string }) {
  if (value === null || value === undefined || value === '') {
    return (
      <>
        <span aria-hidden="true" className="sv-cross__empty">
          —
        </span>
        <span className="sv-visually-hidden">{noValueLabel}</span>
      </>
    );
  }
  return <>{value}</>;
}

export const CrossTable = forwardRef<HTMLDivElement, CrossTableProps>(function CrossTable({
  caption,
  rowDimension,
  colDimension,
  measure,
  rows,
  columns,
  cells,
  rowTotals,
  colTotals,
  grandTotal,
  highlight,
  totalLabel: totalProp,
  noValueLabel: noValueProp,
  className,
  ...rest
}, ref) {
  const t = useStrings();
  const totalLabel = totalProp ?? t.total;
  const noValueLabel = noValueProp ?? t.noValue;
  const hasRowTotals = rowTotals !== undefined;
  return (
    /* The scroll region is focusable so a keyboard can scroll it (2.1.1). */
    <div {...rest} ref={ref} className={cx('sv-cross', className)} role="region" aria-label={caption} tabIndex={0}>
      <table className="sv-cross__table">
        <caption className="sv-visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="sv-cross__corner sv-cross__hold sv-mono">
              {rowDimension} × {colDimension} · {measure}
            </th>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="sv-cross__colhead sv-mono">
                {col.header}
              </th>
            ))}
            {hasRowTotals && (
              <th scope="col" className="sv-cross__colhead sv-cross__totalcol sv-mono">
                {totalLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="sv-cross__row">
              <th scope="row" className="sv-cross__rowhead sv-cross__hold">
                {row.code && <span className="sv-cross__code sv-mono">{row.code}</span>}
                {row.header}
              </th>
              {columns.map((col) => {
                const marked = highlight?.row === row.key && highlight?.col === col.key;
                return (
                  <td
                    key={col.key}
                    className={cx('sv-cross__cell sv-num', marked && 'sv-cross__cell--marked')}
                  >
                    <Cell value={cells[row.key]?.[col.key]} noValueLabel={noValueLabel} />
                    {marked && highlight?.note && (
                      <span className="sv-visually-hidden">, {highlight.note}</span>
                    )}
                  </td>
                );
              })}
              {hasRowTotals && (
                <td className="sv-cross__cell sv-cross__totalcol sv-cross__total sv-num">
                  <Cell value={rowTotals[row.key]} noValueLabel={noValueLabel} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {colTotals && (
          <tfoot>
            <tr className="sv-cross__footrow">
              <th scope="row" className="sv-cross__footlabel sv-cross__hold sv-mono">
                {totalLabel}
              </th>
              {columns.map((col) => (
                <td key={col.key} className="sv-cross__cell sv-cross__total sv-num">
                  <Cell value={colTotals[col.key]} noValueLabel={noValueLabel} />
                </td>
              ))}
              {hasRowTotals && (
                <td className="sv-cross__cell sv-cross__totalcol sv-cross__total sv-num">
                  <Cell value={grandTotal} noValueLabel={noValueLabel} />
                </td>
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
});
