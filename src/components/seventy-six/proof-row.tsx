import { useRef } from 'react';
import { cx } from '@/lib/cx';
import { useCountUp } from './count-up';
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
 * A ProofRow is a STATEMENT, never a control: nothing inside it is clickable,
 * and it never sources or derives a figure. v0.6.1 qualifies "no state, no
 * effects" by exactly one item: a figure the caller asked to COUNT holds a
 * frame value and a cancelled animation frame, and nothing else does — an
 * item with no `countTo` renders a plain <dd> and calls no hook at all, so
 * the ordinary row is still a component with no state and no effects.
 *
 * Don't: never a delta or an arrow (a public page has no comparison period,
 * and the chip that states one is B3's); never an icon and never a card per
 * figure (that is four cards, which is a dashboard, not a claim); never a
 * figure the product cannot substantiate; never more than four — a fifth
 * figure is a set of records, and a set of records is B7 DataTable.
 */
interface ProofItemBase {
  id: string;
  /** PRE-FORMATTED. The component never formats a number (C9). */
  figure: string;
  /** Mono uppercase, under the figure. Names what was counted. */
  label: string;
  /** Optional 12px line: the scope, the period, the source. */
  note?: string;
}

/**
 * The counting figure (v0.6.1) — the moving surface, wired to B50.
 *
 * `figure` is PRE-FORMATTED and stays the source of truth (C9): it is what
 * is announced, what prints when the posture is off, and what prints on
 * paper. A count-up cannot animate that string without parsing it back
 * into a number, and a component that parses its own display text has
 * started formatting — which is the caller's layer, not this one. So the
 * number arrives as a number, beside the caller's own formatter, and the
 * type makes the two inseparable: a `countTo` without a `format` would
 * count in bare digits and then snap to a formatted figure, which is two
 * different-looking numbers for one fact.
 *
 * MOTION NEVER CARRIES INFORMATION. Ship Gate 12 is the reason this is
 * safe on a public page: a ProofRow may only print a figure the product
 * can substantiate, and animating one changes nothing about it. Delete the
 * count and the row states the same four figures it always stated.
 */
type ProofItemCount =
  | { countTo?: never; format?: never }
  | {
      /** The figure to count to. `figure` still states it, formatted. */
      countTo: number;
      /** The caller's formatter — the component never formats (C9). */
      format: (n: number) => string;
    };

export type ProofItem = ProofItemBase & ProofItemCount;

export interface ProofRowProps {
  /** Two to four. A fifth figure is a table (B7). */
  items: ProofItem[];
  /** Names the row for a screen reader when the section heading is elsewhere. */
  ariaLabel?: string;
  className?: string;
}

/**
 * The one <dd> in the system whose visible text is not its announced text,
 * and the split is the whole accessibility contract of this surface.
 *
 * B50 states that nothing in a ProofRow is `aria-hidden`, "because every
 * mark on screen is also information". A counting figure is the exception
 * that keeps the rule rather than breaking it: mid-count the mark on
 * screen is NOT information — it is a frame of an animation on its way to
 * the figure — so it is the one mark that must not be announced. The
 * pre-formatted `figure` sits beside it, visually hidden, carrying the
 * meaning from first paint. A screen reader hears "orders shipped: 1.2M",
 * once, whole, at the moment the row renders, and never hears a number
 * counting.
 *
 * The <dd> keeps `sv-num` (A4) so both children are tabular, and keeps its
 * class, so the CSS `order` that puts the figure above its own <dt> is
 * untouched and the pairing is still the browser's.
 */
function CountedFigure({
  figure,
  countTo,
  format,
}: {
  figure: string;
  countTo: number;
  format: (n: number) => string;
}) {
  /* The posture resolves at the element that PRINTS the figure — its
     nearest `[data-motion]` ancestor decides. */
  const ref = useRef<HTMLElement>(null);
  const counted = useCountUp(countTo, { scope: ref });

  return (
    <dd className="sv-proof__figure sv-num" ref={ref}>
      <span aria-hidden="true">{format(counted)}</span>
      <span className="sv-visually-hidden">{figure}</span>
    </dd>
  );
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
              rather than restated.

              The counted variant is a different ELEMENT rather than a flag,
              so a row that does not count carries no hook, no state and no
              observer — the ordinary ProofRow is the statement it always
              was, and the moving surface costs it nothing at all. */}
          {item.countTo !== undefined && item.format ? (
            <CountedFigure figure={item.figure} countTo={item.countTo} format={item.format} />
          ) : (
            <dd className="sv-proof__figure sv-num">{item.figure}</dd>
          )}
          {/* Nothing in the row is aria-hidden: every mark on screen is also
              information, and the scope line is the half of a claim that
              makes it checkable. */}
          {item.note && <dd className="sv-proof__note">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
