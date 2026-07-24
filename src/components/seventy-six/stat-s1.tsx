import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Card } from './card';
import './stat-s1.css';

/**
 * B3 · StatS1 — the signature stat, the ONLY KPI card. Three required
 * zones: mono label + delta / icon tile + value / hairline footnote that
 * says something NOT already in the card. Answers "how much, and so what."
 */
export interface StatS1Props {
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
  /** 16px stroke icon, rendered in a 34px seed-tint tile. */
  icon: ReactNode;
  /** Footnote: MUST contain information not already in the card
      (target, exposure, oldest age…). The load-bearing figure in <b>. */
  footnote: ReactNode;
  /** Plain-language footnote for the aria-label (screen readers). */
  footnoteText?: string;
  className?: string;
}

export function StatS1({
  label,
  value,
  unit,
  delta,
  deltaSuffix = '%',
  icon,
  footnote,
  footnoteText,
  className,
}: StatS1Props) {
  const deltaText =
    delta === undefined ? '' : `${delta >= 0 ? 'up' : 'down'} ${Math.abs(delta)}${deltaSuffix}`;
  const ariaLabel = [`${label}: ${value}${unit ?? ''}`, deltaText, footnoteText]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className={cx('sv-stat', className)} aria-label={ariaLabel} role="group">
      <div aria-hidden="true">
        <div className="sv-stat__top">
          <span className="sv-stat__label sv-mono">{label}</span>
          {delta !== undefined && (
            <span className={cx('sv-stat__delta sv-num', delta >= 0 ? 'sv-stat__delta--ok' : 'sv-stat__delta--bad')}>
              {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}
              {deltaSuffix}
            </span>
          )}
        </div>
        <div className="sv-stat__mid">
          <span className="sv-stat__tile">{icon}</span>
          <span className="sv-stat__value sv-num">
            {value}
            {unit && <span className="sv-stat__unit">{unit}</span>}
          </span>
        </div>
        <div className="sv-stat__foot">{footnote}</div>
      </div>
    </Card>
  );
}
