import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './cta.css';

/**
 * B49 · CallToAction — the last row of a public page, and the only one that
 * asks for anything. One job: name the one act the page wants.
 *
 * Everything above it states; this asks. That is why it holds exactly ONE
 * primary. B10's rule is not relaxed on the public surface — it is at its
 * most binding here, because a page that asks for two things has asked for
 * neither. `actions` is a slot rather than a `label`/`onClick` pair so a
 * ghost may stand beside the primary; the discipline is the caller's, and
 * the prop doc is where it is written down.
 *
 * There is no `note` prop either, and F12 is why: a mono line under the
 * actions is a footnote nobody reads, in the voice reserved for metadata,
 * restating what the statement was for. The refusal is the absent slot.
 *
 * There is no `urgency`, no `countdown` and no `scarcity` prop, and there
 * never will be: 76° speaks like a competent colleague (A3), and a clock
 * that pressures the reader is the opposite of that. There is no `form`
 * slot either — a form is a page, or a B24 Plate.
 */
export interface CallToActionProps {
  /** The ask, at display size. Not a slogan — name the act's object (A3). */
  title: string;
  /** ONE sentence: what happens after the click, or what it costs. */
  statement?: string;
  /** ONE primary. A ghost beside it is permitted; a second primary is not. */
  actions: ReactNode;
  /** 'paper' — a card on the wall. 'band' — the ink surface, edge to edge. */
  tone?: 'paper' | 'band';
  /** 2 by default: a page's h1 is its Masthead (B47), and levels never skip (A4). */
  headingLevel?: 2 | 3;
  className?: string;
}

export function CallToAction({
  title,
  statement,
  actions,
  tone = 'paper',
  headingLevel = 2,
  className,
}: CallToActionProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    /* `sv-band` rides along on the ink tone because the re-toning already
       exists system-wide: button.css re-borders `.sv-band .sv-btn--ghost` in
       --sv-band-line, and base.css turns `.sv-band :focus-visible` white. A
       ghost and a focus ring inside this row therefore need no rules of their
       own — verified against both files, so cta.css writes none.
       A real <section> carries the row, with the heading inside it and no
       aria-label beside it: the heading is the name already, and a second one
       would only give one row two. */
    <section className={cx('sv-cta', `sv-cta--${tone}`, tone === 'band' && 'sv-band', className)}>
      <div className="sv-cta__text">
        <Heading className="sv-cta__title">{title}</Heading>
        {statement && <p className="sv-cta__statement">{statement}</p>}
      </div>
      {/* Nothing under the buttons. F12 refuses the mono line of terms that
          every generated CTA grows there: it is a footnote in the metadata
          voice doing the job the statement above it already had. A term that
          is load-bearing goes in the statement or on the page the button
          opens — never in 10px type beneath the thing being clicked. */}
      <div className="sv-cta__side">
        <div className="sv-cta__actions">{actions}</div>
      </div>
    </section>
  );
}
