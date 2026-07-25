import { useRef, type ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Card } from './card';
import { useCountUp } from './count-up';
import './stat-s1.css';

/**
 * B3 · StatS1 — the signature stat, the ONLY KPI card. Three required
 * zones: mono label + delta / icon tile + value / hairline footnote that
 * says something NOT already in the card. Answers "how much, and so what."
 */
interface StatS1Base {
  /** Mono micro label, e.g. "REVENUE · MTD". */
  label: string;
  /** The value as display text, e.g. "$482,190". */
  value: string;
  /** Unit suffix rendered soft at 14px, e.g. "%", "pt", "d". */
  unit?: string;
  /** Signed delta, e.g. +12.4 renders "▲ 12.4%". Omit when no comparison exists. */
  delta?: number;
  /** How the delta is formatted; default appends "%". */
  deltaSuffix?: string;
  /** Which direction is good. Returns, cost and churn are 'down-good'. */
  deltaPolarity?: DeltaProps['polarity'];
  /** 16px stroke icon, rendered in a 34px seed-tint tile. */
  icon: ReactNode;
  /** Footnote: MUST contain information not already in the card
      (target, exposure, oldest age…). The load-bearing figure in <b>. */
  footnote: ReactNode;
  /** Plain-language footnote for the aria-label (screen readers). */
  footnoteText?: string;
  className?: string;
}

/**
 * The counting figure (v0.6.1) — the moving surface, wired to B3.
 *
 * `value` is PRE-FORMATTED and stays the source of truth (C9): it is what
 * the accessible name announces, what prints when the posture is off, and
 * what prints on paper. A count-up cannot animate a string without parsing
 * it back into a number, and a component that parses its own display text
 * is a component that formats — which is the caller's layer, not this one.
 *
 * So the pair is OPTIONAL and it is a pair: `countTo` is the number, and
 * `format` is the caller's own formatter, in the caller's own locale. The
 * type makes them inseparable, exactly as B42 Popover's `title`/`ariaLabel`
 * union does — a `countTo` with no `format` would leave the card printing
 * a bare 482190 for 640ms and then a formatted $482,190, which is two
 * different figures for one number.
 *
 * MOTION NEVER CARRIES INFORMATION: with the posture off — the default —
 * `value` prints and nothing has changed. Nothing here is announced
 * mid-count; see the note on the card's aria-label below.
 */
type StatS1Count =
  | { countTo?: never; format?: never }
  | {
      /** The figure to count to. `value` still states it, formatted. */
      countTo: number;
      /** The caller's formatter — the component never formats (C9). */
      format: (n: number) => string;
    };

export type StatS1Props = StatS1Base & StatS1Count;

/**
 * B3 amendment (v0.4.0) · Delta — the arrow-and-figure chip, extracted so
 * a table cell, a DescriptionList row or a Trend head states a change in
 * exactly the voice the S1 card does. Direction is NEVER colour-only:
 * the arrow glyph and the word are the non-colour cue (C5).
 */
export interface DeltaProps {
  /** Signed change. +12.4 renders "▲ 12.4%". */
  value: number;
  /** Appended to the figure; default "%". */
  suffix?: string;
  /** Which direction is good. Cost and churn are 'down-good'. */
  polarity?: 'up-good' | 'down-good';
  className?: string;
}

export function Delta({ value, suffix = '%', polarity = 'up-good', className }: DeltaProps) {
  const up = value >= 0;
  const good = polarity === 'up-good' ? up : !up;
  return (
    <span className={cx('sv-delta sv-num', good ? 'sv-delta--ok' : 'sv-delta--bad', className)}>
      <span aria-hidden="true">{up ? '▲' : '▼'}</span>
      <span className="sv-visually-hidden">{up ? 'up ' : 'down '}</span>
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

export function StatS1({
  label,
  value,
  unit,
  delta,
  deltaSuffix = '%',
  deltaPolarity = 'up-good',
  icon,
  footnote,
  footnoteText,
  countTo,
  format,
  className,
}: StatS1Props) {
  const deltaText =
    delta === undefined ? '' : `${delta >= 0 ? 'up' : 'down'} ${Math.abs(delta)}${deltaSuffix}`;

  /* THE ACCESSIBLE NAME IS BUILT FROM `value`, ALWAYS — never from the
     counting figure. A screen reader must never hear a number counting,
     and here it structurally cannot: the card's whole inner tree is
     already `aria-hidden` (B3 reads the value and label as ONE unit, C6),
     so the animated text is not in the accessibility tree at all, and the
     name below is a static string that never re-renders with the count.
     The final figure is in the name at first paint, before the count has
     drawn a single frame — which is the same guarantee stated the other
     way round: delete the animation and nothing announced changes. */
  const ariaLabel = [`${label}: ${value}${unit ?? ''}`, deltaText, footnoteText]
    .filter(Boolean)
    .join(', ');

  /* The posture resolves at the element that PRINTS the figure — its
     nearest `[data-motion]` ancestor decides, exactly as a custom
     property resolves at its nearest declaration. */
  const valueRef = useRef<HTMLSpanElement>(null);
  const counted = useCountUp(countTo ?? 0, {
    enabled: countTo !== undefined,
    scope: valueRef,
  });
  const printed = countTo !== undefined && format ? format(counted) : value;

  return (
    <Card className={cx('sv-stat', className)} aria-label={ariaLabel} role="group">
      <div aria-hidden="true">
        <div className="sv-stat__top">
          <span className="sv-stat__label sv-mono">{label}</span>
          {delta !== undefined && <Delta value={delta} suffix={deltaSuffix} polarity={deltaPolarity} />}
        </div>
        <div className="sv-stat__mid">
          <span className="sv-stat__tile">{icon}</span>
          {/* A4 · tabular via .sv-num, which is what holds the figure
              still while it counts: every digit is one width, so a 4
              becoming a 7 moves nothing beside it. */}
          <span className="sv-stat__value sv-num" ref={valueRef}>
            {printed}
            {unit && <span className="sv-stat__unit">{unit}</span>}
          </span>
        </div>
        <div className="sv-stat__foot">{footnote}</div>
      </div>
    </Card>
  );
}
