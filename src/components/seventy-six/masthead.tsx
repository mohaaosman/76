/**
 * B47 · Masthead — the hero, refused as imagery and rebuilt as type. One job:
 * open a public page with the claim, set in type.
 *
 * F11 refuses hero photography, illustration and 3D; A2 refuses the stock-photo
 * card. What is left is the thing a newspaper masthead always was: a claim, set
 * large, with nothing behind it. There is no image slot, no video slot and no
 * background slot, and adding one is a Book change rather than a prop.
 *
 * This is B1 PageHero's public-surface sibling and deliberately speaks its
 * vocabulary — title + titleSoft, one line of context, an actions cluster with
 * ONE primary — at display size on the wall instead of at 27px on the band. The
 * display steps exist for exactly this surface (firewall rule 17): the product
 * ramp tops out at the PageHero h1, so a marketing page had no honest way to
 * speak above the work.
 *
 * THE HEADER ANATOMY, and it is closed: a TITLE, ONE line under it, and ONE
 * or TWO buttons. Nothing above the title and nothing under the buttons.
 *
 * v0.8 adds ONE prop, `scale`, and it buys type and nothing else. `issue`
 * takes the STRUCTURE the Japanese editorial covers use — a title cut
 * condensed on the display face's width axis, set to the page's own edge,
 * over a deck in the ordinary UI voice. The anatomy above is untouched by
 * it: the cover is a way of setting the claim, not a licence to add to it.
 *
 * Don't: no kicker, eyebrow or category line above the title, and no mono note
 * under the actions — F12 refuses both by name, and the refusal is enforced by
 * the props not existing; no image, no video, no background of its own; no
 * second primary (B10 allows one per view region) and no third button; no
 * second sentence in the statement (running copy is B45 Prose); no stat inside
 * the Masthead (a number on the public surface is B50 ProofRow); no breadcrumb
 * anywhere near it (F13).
 */
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './masthead.css';

/**
 * THE HEADER ANATOMY IS CLOSED, and it is three things: a title, ONE line
 * under it, and one or two buttons. There is no kicker prop and no note prop,
 * and F12 refuses both by name — see the Don't list above. A slot that exists
 * is a slot that gets filled, so the refusal is the absent prop.
 */
export interface MastheadProps {
  /** The claim. Becomes the page's h1. */
  title: string;
  /** The claim's second half, receded — exactly PageHero's move. */
  titleSoft?: string;
  /** ONE sentence. Two is a paragraph, and a paragraph is B45 Prose. */
  statement?: string;
  /** ONE or TWO buttons, one of them primary. A third is a menu or a page. */
  actions?: ReactNode;
  align?: 'start' | 'center';
  /**
   * The TYPE, and only the type. `default` is what every page already
   * ships — display-1 in the UI face — and is byte-for-byte unchanged.
   *
   * `issue` is the cover treatment the Japanese editorial references set:
   * the same step in `--sv-font-display`, cut condensed on the face's WIDTH
   * axis, heavy, and flush to the container's edge, with the statement left
   * in the UI face at the ordinary step underneath it. THE CONTRAST IS THE
   * DEVICE — a display title over a plain deck is what a magazine does, and
   * setting the deck in the display face too would collapse the two voices
   * into one poster and lose the thing being borrowed.
   *
   * It is a SCALE and not a variant, which is the whole of its licence: it
   * changes type and nothing else. F11 still refuses the picture, F12 still
   * refuses the kicker and the note — the props do not exist at either
   * scale — and F14 still leaves the seed fill to the action. A scale that
   * started admitting slots would be a second component wearing this one's
   * name.
   *
   * ENGLISH ONLY, and the case is the CALLER's — see masthead.css, which
   * argues why `issue` does not force uppercase.
   */
  scale?: 'default' | 'issue';
  /** 1 by default — a page has one h1. 2 only when embedded in a page that already owns one. */
  headingLevel?: 1 | 2;
  className?: string;
}

export function Masthead({
  title,
  titleSoft,
  statement,
  actions,
  align = 'start',
  scale = 'default',
  headingLevel = 1,
  className,
}: MastheadProps) {
  /* One h1 per page (A4). Level 2 exists for the docs demo, where the page
     already owns its h1 and a second one would break the outline. */
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    /* start is the default because left-aligned type is how the rest of the
       system sets everything; centring is the exception a page asks for. */
    <header
      className={cx(
        'sv-masthead',
        align === 'center' && 'sv-masthead--center',
        /* The default scale adds NO class, so the element every existing
           page renders is the element it rendered before — the amendment
           is unreachable from a call site that does not ask for it. */
        scale === 'issue' && 'sv-masthead--issue',
        className,
      )}
    >
      {/* Nothing above the title. F12 refuses the mono kicker outright: it is
          a line of type that states the page's category to a reader who is
          already on the page, it pushes the claim down the sheet, and it is
          the single most reliable tell of a header nobody wrote. The claim
          opens the page. */}
      <Heading className="sv-masthead__title">
        {title}
        {/* Inside the heading, so the accessible name is the whole claim and
            not just its first half — with the space before it, exactly as
            PageHero writes it. */}
        {titleSoft && <span className="sv-masthead__title-soft"> {titleSoft}</span>}
      </Heading>
      {statement && <p className="sv-masthead__statement">{statement}</p>}
      {/* And nothing under the buttons. The mono line of terms, licences and
          counts that every generated landing page grows there is F12's other
          half: it is a footnote nobody asked for, in the metadata voice, doing
          the job the statement above already had. If a term is load-bearing it
          belongs in the statement or on the page the button opens. */}
      {actions && <div className="sv-masthead__actions">{actions}</div>}
    </header>
  );
}
