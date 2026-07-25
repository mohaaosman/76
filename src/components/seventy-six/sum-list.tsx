import { cx } from '@/lib/cx';
import './sum-list.css';

/**
 * B55 · SumList — one job: state a set of amounts and the figure they add
 * up to.
 *
 * **It is B44 `DistributionStrip`'s ARITHMETIC SIBLING, and the pairing is
 * the point: B44 divides ONE total into its shares; SumList builds ONE
 * total FROM its lines.** B44 starts with 128,953 sessions and asks how
 * they split; B55 starts with a line total, a discount, a tax and a
 * carriage charge and asks what the reader owes. They share a voice
 * deliberately — a mono uppercase label left, a pre-formatted figure right,
 * the closing figure at B4's 19/700 step — because they are the same
 * arithmetic read in opposite directions, and a reader who has learned one
 * has learned the other.
 *
 * **The boundary against B7, stated here because someone will otherwise use
 * the wrong one.** INSIDE a table the closing figures are B7's `totals`: a
 * real `<tfoot>` keyed to the table's own columns, outside the row, focus,
 * selection and pagination models, repeated by the browser at the foot of
 * every printed page. SumList is that block WHEREVER IT SITS OUTSIDE A
 * TABLE — the amount-due card beside an invoice, the order summary beside a
 * payment form, the fee breakdown under a quote. The test is not where the
 * block LOOKS right, it is whether the amounts belong to the table's
 * columns: a line total does, and is a `<tfoot>` row; shipping, a discount
 * and tax belong to the DOCUMENT and have no column to sit in, so pushing
 * them into the table would key them to a column they are not part of.
 *
 * **It never computes.** Every amount is a PRE-FORMATTED string the caller
 * supplies (C9, A4) — the currency symbol, the grouping, and the minus sign
 * on a discount all included. A component that adds up the numbers it was
 * handed is a component that can disagree with the invoice, and the invoice
 * is the document of record; a component that invents a minus sign is one
 * that will one day print `−$0.00`.
 *
 * It carries NO inset of its own — like B6 `MeterList` and B41 `Timeline`,
 * inside a `<Card>` it takes `<div className="sv-card__body">` (firewall
 * rule 18).
 *
 * Don't: never computes a sum; never more rows than a reader can check by
 * eye (a dozen charges is a B7 DataTable of charges); never a currency
 * symbol the caller did not supply; never a minus the component invented;
 * never inside a table — that is B7 `totals`.
 */
export interface SumRow {
  /** Mono uppercase, in the table-header voice: "SUBTOTAL", "VAT 20%". */
  label: string;
  /**
   * PRE-FORMATTED and complete: "$18,240.00", "−$1,280.00", "$0.00".
   * A negative amount is stated by this string — the component never
   * derives one, because it never sees a number.
   */
  amount: string;
  /** The rate or the basis this amount came from: "20% of $18,240.00". */
  note?: string;
  /**
   * The closing figure of the set — the one line the reader came for.
   * Stronger rule above it, 700 figures, a larger step. One per list:
   * a set with two closing figures has not closed.
   */
  strong?: boolean;
}

export interface SumListProps {
  rows: SumRow[];
  className?: string;
}

export function SumList({ rows, className }: SumListProps) {
  return (
    /* A real <dl>, exactly as B28: each label is announced with its own
       amount as one pair, and the note is read with the label it qualifies
       rather than floating between two rows. */
    <dl className={cx('sv-sum', className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cx('sv-sum__row', row.strong && 'sv-sum__row--strong')}
        >
          <dt className="sv-sum__term">
            <span className="sv-sum__label sv-mono">{row.label}</span>
            {/* The basis, where the figure came from: a rate, a base, a
                carrier. Soft, never faint — a reader who must read it is
                owed --sv-ink-soft (C2). */}
            {row.note && <span className="sv-sum__note sv-num">{row.note}</span>}
          </dt>
          <dd className="sv-sum__amount sv-num">{row.amount}</dd>
        </div>
      ))}
    </dl>
  );
}
