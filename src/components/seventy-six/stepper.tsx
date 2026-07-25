import { cx } from '@/lib/cx';
import './stepper.css';

/**
 * B39 · Stepper — one job: state where you are in a FIXED sequence, and what
 * remains. It is a STATEMENT, not a control: steps render as plain text unless
 * `onStepSelect` is passed, and even then only ALREADY-COMPLETED steps become
 * buttons — you cannot click into a step you have not earned. It is not a
 * progress bar (that is B4, for a quantity), not a tablist (that is B38, for a
 * free choice between peers), and not navigation (that is B1). A real `<ol>`
 * carries the ordering, because the order is the whole point.
 */
export interface Step {
  id: string;
  label: string;
  /** One line under the label, e.g. "Signed 14 Jul". */
  note?: string;
}

export interface StepperProps {
  steps: Step[];
  /** Index of the current step, 0-based. Everything before it is done. */
  current: number;
  /** Passing this makes COMPLETED steps buttons. Omit and the stepper is a statement. */
  onStepSelect?: (index: number) => void;
  /** Accessible name, e.g. "Onboarding progress". */
  label: string;
  className?: string;
}

const STATE_WORD = {
  done: 'completed',
  current: 'current step',
  upcoming: 'not started',
} as const;

export function Stepper({ steps, current, onStepSelect, label, className }: StepperProps) {
  return (
    <ol className={cx('sv-stepper', className)} aria-label={label}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        const body = (
          <>
            {/* The marker is a picture of the index; the hidden line below
                says the same thing in words, so the marker stays silent. */}
            <span className="sv-stepper__marker sv-mono sv-num" aria-hidden="true">
              {state === 'done' ? (
                <svg viewBox="0 0 10 8" width="10" height="8" aria-hidden="true">
                  <path
                    d="M1 4l2.5 2.5L9 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="sv-stepper__text">
              <span className="sv-stepper__label">{step.label}</span>
              {step.note && <span className="sv-stepper__note">{step.note}</span>}
            </span>
            {/* C5 · the seed fill is a colour, and colour never carries
                meaning alone — every step also says its state in words. */}
            <span className="sv-visually-hidden">
              {` Step ${i + 1} of ${steps.length}, ${STATE_WORD[state]}`}
            </span>
          </>
        );
        return (
          <li
            key={step.id}
            className={cx('sv-stepper__step', `sv-stepper__step--${state}`)}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {state === 'done' && onStepSelect ? (
              <button
                type="button"
                className="sv-stepper__hit sv-stepper__hit--button"
                onClick={() => onStepSelect(i)}
              >
                {body}
              </button>
            ) : (
              <span className="sv-stepper__hit">{body}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
