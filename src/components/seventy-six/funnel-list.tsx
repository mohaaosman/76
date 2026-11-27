import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import './funnel-list.css';

/**
 * B61 · FunnelList — one job: state how one total narrows through an ordered
 * sequence of steps. Sessions to orders; leads to won deals.
 *
 * **The boundary.** B6 `MeterList` measures each part against ITS OWN
 * maximum; B44 `DistributionStrip` divides one total into parallel shares.
 * Here the parts are not parallel — each step is a subset of the one before
 * it — so the list is an `<ol>`, every bar is drawn against the FIRST step,
 * and every step after the first states what it kept from the previous one.
 * The funnel trapezoid stays refused: it is a shape performing a number. The
 * bars are B6's straight 3px bars.
 *
 * **It never computes (C9).** Every figure, rate and loss is a pre-formatted
 * string; `share` (0–1 of the first step) only draws the bar. The absolute
 * figure is required on every step — a bare percentage is a defect (B6).
 *
 * It carries NO inset of its own — inside a `<Card>` it takes
 * `sv-card__body` (firewall rule 18), like B6.
 *
 * Don't: never a trapezoid or tapering shape; never a step without its
 * absolute figure; never steps that are not subsets of the step before
 * (that is B44 or B6); never more steps than a reader holds — eight is a
 * B7 DataTable; never coloured bars for good or bad steps.
 */
export interface FunnelStep {
  /** Defaults to `label`. */
  id?: string;
  label: string;
  /** REQUIRED, PRE-FORMATTED absolute figure: "12,530". */
  value: string;
  /** 0–1 of the FIRST step, for drawing only. The first step is 1. */
  share: number;
  /** PRE-FORMATTED, from the previous step: "26.0% of previous · 35,670 lost". */
  conversion?: string;
}

export interface FunnelListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name for the list, e.g. "Checkout funnel, July 2026". */
  label: string;
  steps: FunnelStep[];
  /** What the conversion lines are compared against, printed once at the head: "Q2 2026". */
  baseline?: string;
  className?: string;
}

const clamp = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

export const FunnelList = forwardRef<HTMLDivElement, FunnelListProps>(function FunnelList({ label, steps, baseline, className, ...rest }, ref) {
  const t = useStrings();
  return (
    <div {...rest} ref={ref} className={cx('sv-funnel', className)}>
      {baseline && <p className="sv-funnel__baseline sv-mono">{t.against(baseline)}</p>}
      <ol className="sv-funnel__list" aria-label={label}>
        {steps.map((step, i) => (
          <li key={step.id ?? step.label} className="sv-funnel__step">
            {/* The ordinal is the list's own position; <ol> already announces it. */}
            <span className="sv-funnel__ordinal sv-mono sv-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="sv-funnel__body">
              <div className="sv-funnel__line">
                <span className="sv-funnel__label">{step.label}</span>
                <span className="sv-funnel__value sv-num">{step.value}</span>
              </div>
              {/* Illustration only — the figure is printed beside it. */}
              <div className="sv-funnel__track" aria-hidden="true">
                <div
                  className="sv-funnel__fill"
                  style={{ '--sv-funnel-share': clamp(step.share) } as CSSProperties}
                />
              </div>
              {step.conversion && <p className="sv-funnel__conversion sv-num">{step.conversion}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});
