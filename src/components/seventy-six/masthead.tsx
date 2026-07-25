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
 * Don't: no image, no video, no background of its own; no second primary (B10
 * allows one per view region); no second sentence in the statement (running copy
 * is B45 Prose); no stat inside the Masthead (a number on the public surface is
 * B50 ProofRow).
 */
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './masthead.css';

export interface MastheadProps {
  /** Mono uppercase line above the title: the category, the release, the audience. */
  eyebrow?: string;
  /** The claim. Becomes the page's h1. */
  title: string;
  /** The claim's second half, receded — exactly PageHero's move. */
  titleSoft?: string;
  /** ONE sentence. Two is a paragraph, and a paragraph is B45 Prose. */
  statement?: string;
  /** At most one primary and one ghost (B10: one primary per view region). */
  actions?: ReactNode;
  /** A mono line under the actions: the terms, the licence, the count. */
  note?: string;
  align?: 'start' | 'center';
  /** 1 by default — a page has one h1. 2 only when embedded in a page that already owns one. */
  headingLevel?: 1 | 2;
  className?: string;
}

export function Masthead({
  eyebrow,
  title,
  titleSoft,
  statement,
  actions,
  note,
  align = 'start',
  headingLevel = 1,
  className,
}: MastheadProps) {
  /* One h1 per page (A4). Level 2 exists for the docs demo, where the page
     already owns its h1 and a second one would break the outline. */
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    /* start is the default because left-aligned type is how the rest of the
       system sets everything; centring is the exception a page asks for. */
    <header className={cx('sv-masthead', align === 'center' && 'sv-masthead--center', className)}>
      {/* A sibling LINE, not a heading: marking the category as an h-level
          would put a rung above the claim in the outline and announce the
          audience as the page's subject. Nothing here is decorative-only, so
          nothing is aria-hidden either. */}
      {eyebrow && <p className="sv-masthead__eyebrow sv-mono">{eyebrow}</p>}
      <Heading className="sv-masthead__title">
        {title}
        {/* Inside the heading, so the accessible name is the whole claim and
            not just its first half — with the space before it, exactly as
            PageHero writes it. */}
        {titleSoft && <span className="sv-masthead__title-soft"> {titleSoft}</span>}
      </Heading>
      {statement && <p className="sv-masthead__statement">{statement}</p>}
      {actions && <div className="sv-masthead__actions">{actions}</div>}
      {note && <p className="sv-masthead__note sv-mono">{note}</p>}
    </header>
  );
}
