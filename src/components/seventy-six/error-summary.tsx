import { useEffect, useId, useRef } from 'react';
import { cx } from '@/lib/cx';
import './error-summary.css';

/**
 * B52 · ErrorSummary — the top-of-form index of a failed submit.
 * One job: index a failed submit's field errors as one list of links to the
 * fields that caused them.
 *
 * B11's validation contract has ended on this sentence since the first
 * version — "Submit reveals a top-of-form error summary linking to each field
 * (focus moves to summary)" — and every 76° form shipped so far quietly
 * skipped it. This component is that sentence, and nothing else.
 *
 * It is the INDEX; the inline field error is the STATEMENT. B11 and A2 both
 * put the error at its source and B22 says it a third time, so the two ship
 * together, always: a summary that replaces the inline error sends the reader
 * back up the page to learn what is wrong with the input their cursor is
 * already sitting in.
 *
 * The anatomy is B22 Banner's `bad`, deliberately — this IS a banner whose
 * body happens to be a list — and the one line to remember is the boundary: a
 * Banner states a condition that has no field to point at; an ErrorSummary
 * points. Nothing to link to means reach for the Banner.
 *
 * Don't: never a toast (A2 — an error renders at its source); never the
 * inline error's replacement; never a list of conditions with no field behind
 * them (that is a Banner); never rendered when the form is clean; never
 * longer than the fields that actually failed.
 */
export interface FieldError {
  /** The id of the input this points at. The link is href={`#${fieldId}`}. */
  fieldId: string;
  /** The field's LABEL, exactly as it reads on screen — the link text. */
  label: string;
  /** What is wrong and how to fix it, in B11's voice. */
  message: string;
}

export interface ErrorSummaryProps {
  errors: FieldError[];
  /** Overrides the generated count sentence. Rarely needed. */
  title?: string;
  /** Move focus here when a new set of errors arrives. Default true. */
  autoFocus?: boolean;
  className?: string;
}

export function ErrorSummary({ errors, title, autoFocus = true, className }: ErrorSummaryProps) {
  /* One base id, suffixed — never a random one. The title has to be nameable
     from the container, and a name that changes between renders unhooks the
     reference the moment React re-renders under it. */
  const base = useId();
  const titleId = `${base}-title`;
  const ref = useRef<HTMLDivElement>(null);

  /* Focus moves on every new SET of errors, not only on the first appearance:
     a second failed submit that names different fields is a second event, and
     a reader who fixed two of three is owed the same signal they got the first
     time. The key is the joined field ids because `errors` is a fresh array on
     every parent render — keying the effect on the array itself would drag
     focus back here while the reader is typing in a field. The ids are what
     actually changes when the failure changes. */
  const fieldIds = errors.map((error) => error.fieldId).join('|');

  useEffect(() => {
    if (!autoFocus || fieldIds === '') return;
    ref.current?.focus();
  }, [fieldIds, autoFocus]);

  /* A clean form renders nothing. An empty summary is a card that announces a
     failure that did not happen — after the hooks, because the hooks above
     have to keep running as the set empties and refills. */
  if (errors.length === 0) return null;

  const plural = errors.length !== 1;

  return (
    /* Focused, NOT alerted. Moving focus to an element announces its content;
       role="alert" announces it again, so the pair reads one failed submit
       out twice — the same defect class as the second live region B7's
       FilterBar refuses. B11 mandates the focus move, so the focus move is
       what this component does, and the alert role stays absent.
       role="group" and not a bare div: the accessible name below is what
       focus announces, and ARIA prohibits a name on a generic element. */
    <div
      ref={ref}
      role="group"
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cx('sv-errsum', className)}
    >
      {/* Decorative beside its own text (A4). The tone is carried three ways —
          the rule, this icon and the sentence — so colour is never alone (C5). */}
      <span className="sv-errsum__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>

      <div className="sv-errsum__text">
        {/* The COUNT is the one fact the reader cannot see from the submit
            button: the fields are above them, off screen. A3 bans every
            alternative that says nothing — "Oops", "Something went wrong",
            the exclamation mark. The number is tabular (A4) because it changes
            from submit to submit. */}
        <p className="sv-errsum__title" id={titleId}>
          {title ?? (
            <>
              <span className="sv-num">{errors.length}</span>
              {plural ? ' fields need attention' : ' field needs attention'}
            </>
          )}
        </p>

        {/* An ordered list because the order IS the form's order — the reader
            works down the page, and a set of links whose sequence is arbitrary
            is a bag, not an index. */}
        <ol className="sv-errsum__list sv-num">
          {errors.map((error) => (
            <li className="sv-errsum__item" key={error.fieldId}>
              {/* A plain fragment link. Every browser moves focus to the target
                  when the target is focusable, and the caller's inputs carry
                  real ids — so hijacking the jump with scripted scrolling
                  would replace working behaviour with a worse copy of it.
                  Underlined, not seed-coloured alone: C5 forbids an
                  affordance carried by colour. */}
              <a className="sv-errsum__link" href={`#${error.fieldId}`}>
                {error.label}
              </a>
              <span className="sv-errsum__message">
                {'— '}
                {error.message}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
