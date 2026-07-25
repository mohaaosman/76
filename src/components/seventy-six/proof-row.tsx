import { cx } from '@/lib/cx';
import './proof-row.css';

/**
 * B50 · ProofRow — the figures that carry the claim, on the public surface.
 * One job: state the few figures that prove the claim.
 *
 * It is NOT B3 StatS1, and the difference is written down here because it is
 * the only thing stopping the next reader reaching for the card. B3 is the
 * product's signature KPI: an icon tile, a delta against a comparison period,
 * a footnote that adds information the value does not carry — a measurement
 * ON PAPER, in a dashboard, read by someone who owns the number. A ProofRow
 * is a marketing row: no card, no icon, no delta, no comparison — a figure at
 * display size with a mono label under it, ON THE WALL, between hairlines,
 * read by someone deciding whether to believe the claim above it. A2 names
 * "generic admin widget" as a defect class; "generic marketing widget" is the
 * same defect, and both start the same way — by reaching for the component
 * that is already built instead of the one the surface asks for.
 *
 * A ProofRow is a STATEMENT, never a control: no state, no effects, nothing
 * inside it is clickable, and it never sources or derives a figure.
 *
 * Don't: never a delta or an arrow (a public page has no comparison period,
 * and the chip that states one is B3's); never an icon and never a card per
 * figure (that is four cards, which is a dashboard, not a claim); never a
 * figure the product cannot substantiate; never more than four — a fifth
 * figure is a set of records, and a set of records is B7 DataTable.
 */
export interface ProofItem {
  id: string;
  /** PRE-FORMATTED. The component never formats a number (C9). */
  figure: string;
  /** Mono uppercase, under the figure. Names what was counted. */
  label: string;
  /** Optional 12px line: the scope, the period, the source. */
  note?: string;
}

export interface ProofRowProps {
  /** Two to four. A fifth figure is a table (B7). */
  items: ProofItem[];
  /** Names the row for a screen reader when the section heading is elsewhere. */
  ariaLabel?: string;
  className?: string;
}

export function ProofRow({ items, ariaLabel, className }: ProofRowProps) {
  return (
    /* A real <dl>: each figure is the description of the thing its label
       names, so the pair is announced together instead of as two loose runs
       of text. The wrapper <div> is what lets a pair keep its own column and
       its own hairline — dl > div > (dt, dd) is the structure HTML gives for
       exactly this, so no ARIA is needed to hold the pairing. */
    <dl className={cx('sv-proof', className)} aria-label={ariaLabel}>
      {items.map((item) => (
        /* Reading order and visual order are BOTH honest, and they differ.
           In the DOM the <dt> comes first, because the term owns the pair and
           a <dd> before its <dt> is invalid markup that breaks the pairing in
           every screen reader — so it is announced "orders shipped: 1.2M".
           On screen the figure sits on top, because that is what the surface
           is for, and a single CSS `order` on the figure is what moves it.
           Nothing is announced backwards: the two orders say the same thing
           in the two directions their readers scan. (Sequence-swapping in CSS
           is a hazard when a focus path crosses it — here there is nothing
           focusable in the row at all, so the mismatch costs nothing.) */
        <div className="sv-proof__item" key={item.id}>
          <dt className="sv-proof__label sv-mono">{item.label}</dt>
          {/* Pre-formatted text, printed as given: C9 puts formatting at the
              caller's layer, so this reads exactly as it is written — and a
              figure the product cannot substantiate is a defect, not a
              placeholder (Ship Gate 12). A4 · tabular via .sv-num, reused
              rather than restated. */}
          <dd className="sv-proof__figure sv-num">{item.figure}</dd>
          {/* Nothing in the row is aria-hidden: every mark on screen is also
              information, and the scope line is the half of a claim that
              makes it checkable. */}
          {item.note && <dd className="sv-proof__note">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
