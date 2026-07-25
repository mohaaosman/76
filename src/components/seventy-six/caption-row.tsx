import { cx } from '@/lib/cx';
import './caption-row.css';

/**
 * B57 · CaptionRow — a few short fragments spread across one rule. One job:
 * state up to four short captions across one rule.
 *
 * It is the travel poster's `never too · far away · always there` line:
 * fragments distributed across the full measure under the thing they
 * caption, on a single hairline. In 76° the thing above it is never a
 * photograph — F11 stands, and where the reference puts a picture a 76°
 * page puts a LIVE COMPONENT — so the captions describe the specimen the
 * reader is actually looking at, running, with figures that reconcile.
 *
 * A CaptionRow is a STATEMENT, never a control: no state, no effects,
 * nothing in it is clickable, nothing in it is a landmark. It is not
 * navigation and it is not a feature list — B48 `FeatureList` states what
 * the product does, one item at a time, in sentences; this states three
 * fragments about ONE thing, in one line. The moment a caption needs a
 * verb and an object it has become a feature, and it belongs to B48.
 *
 * Don't: never a sentence (a fragment has no full stop and no subject);
 * never a link (the row carries no hit area and no affordance, and the
 * type it is set in is deliberately not B10's text-link voice — see
 * caption-row.css); never more than four; never used as a nav; never a
 * caption for something that is not directly above or below it.
 */
export interface CaptionRowProps {
  /** Two to four short fragments. Each is a PHRASE, not a sentence. */
  captions: string[];
  /** Where the rule sits. 'top' (default) captions the block above. */
  rule?: 'top' | 'bottom' | 'none';
  className?: string;
}

export function CaptionRow({ captions, rule = 'top', className }: CaptionRowProps) {
  return (
    /* A plain <div>, and the plainness is deliberate: this is not a list
       (a list announces a count the reader did not ask for and the row does
       not mean), not a <nav>, and not a landmark. The rule's position
       travels as data — a literal in an inline style would put the border
       back in the component and out of the stylesheet's reach (B48). */
    <div className={cx('sv-captions', className)} data-rule={rule}>
      {captions.map((caption) => (
        /* A real <p> per caption, so each fragment is announced as its own
           run of text rather than as one comma-less sentence. The caption
           IS its own key: there is no id in the shape because there is no
           record here, and two identical fragments in one row is a defect
           no key could fix. */
        <p className="sv-captions__caption" key={caption}>
          {caption}
        </p>
      ))}
    </div>
  );
}
