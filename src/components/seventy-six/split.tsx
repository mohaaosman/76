import { cx } from '@/lib/cx';
import { Plate } from './plate';
import type { PlateProps } from './plate';
import './split.css';

/**
 * B46 · Split — the band-less page, cut in half, with the card ACROSS THE
 * CUT. Two flat surfaces meet on one seam — ink and wall, side by side or
 * stacked — and the Plate sits centred on that seam, so half the card is on
 * ink and half is on wall.
 *
 * This is B2's overlap, finished. The Sheet spends it once per page by
 * pulling its first row 44px over the band edge; a Plate has no Sheet and no
 * band, so the same physics arrive as a page type: not a card that peeks
 * over an edge, a card that STRADDLES one. It is the only 76° layout where
 * paper crosses a surface boundary rather than resting on one.
 *
 * The halves are BACKGROUND and nothing else. No statement, no widget, no
 * screenshot, no illustration: they carry no text, so they are marked
 * aria-hidden and the page reads as exactly the Plate it is. A1 refuses
 * gradients, so the cut is two real elements rather than a colour stop —
 * which is also why it lands on a hard pixel instead of a soft blend.
 *
 * B24 is composed verbatim, with one consequence: everything the Plate puts
 * on the WALL moves INTO the card. Centred above and below a card that
 * straddles the seam, the wordmark and the footer would each land half on
 * ink and half on paper — ink type on ink, which reads as a rendering fault.
 * Both become rows of the card, hairline-ruled, and the Plate's own slots
 * are emptied. Nothing else about the Plate changes: same anatomy, same one
 * h1, same one primary, same 400px measure.
 *
 * One job: carry a single decision on the line between two surfaces.
 */
export interface SplitProps extends PlateProps {
  /**
   * `side` (default) cuts the page left/right: ink, then wall, with the card
   * on the vertical seam. `stacked` cuts it top/bottom, card on the
   * horizontal seam. Below 1000px `side` becomes `stacked` on its own — a
   * vertical seam behind a full-width card is a seam nobody can see.
   */
  orientation?: 'side' | 'stacked';
}

/* The mark, inside the card. It keeps the Plate's own recipe — six in seed,
   degree in faint ink — and takes a hairline under it so it reads as the
   card's first row rather than a badge floating over the title. Left, not
   centred: every other line in a 76° card starts on the same edge. */
const CARD_MARK = (
  <div className="sv-split__mark">
    <span className="sv-plate__wordmark" role="img" aria-label="Seventy Six Degrees">
      <span aria-hidden="true">7</span>
      <span className="sv-plate__wordmark-six" aria-hidden="true">6</span>
      <span className="sv-plate__wordmark-deg" aria-hidden="true">°</span>
    </span>
  </div>
);

export function Split({ orientation = 'side', footer, className, children, ...plate }: SplitProps) {
  return (
    <div className={cx('sv-split', `sv-split--${orientation}`, className)}>
      {/* Decoration, stated as such: two empty surfaces meeting on a seam.
          There is no skip link, because B24's exception holds — a Split has
          nothing to skip past to reach the decision. */}
      <div className="sv-split__halves" aria-hidden="true">
        <div className="sv-split__ink" />
        <div className="sv-split__wall" />
      </div>
      {/* wordmark and footer are intercepted, not passed: on a Split they are
          rows of the card, and the Plate's wall-side slots stay empty. */}
      <Plate {...plate} wordmark={null} className="sv-split__plate">
        {CARD_MARK}
        {children}
        {footer && <p className="sv-split__foot">{footer}</p>}
      </Plate>
    </div>
  );
}
