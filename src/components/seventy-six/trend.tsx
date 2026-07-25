import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import './trend.css';

/**
 * B5 · Trend — flat single-weight lines on a hairline grid. Current
 * period = seed, comparison = --sv-compare. No area fills, no dual axes,
 * max 3 series, no animated draw-in. Charts answer "which direction."
 */
export interface TrendSeries {
  label: string;
  data: number[];
  /** 'seed' (current period) | 'compare' (previous period) | 'faint'. */
  tone?: 'seed' | 'compare' | 'faint';
}

export interface TrendProps {
  /** REQUIRED: the takeaway, e.g. "Revenue trending up, $482K MTD vs $431K in June". */
  ariaLabel: string;
  series: TrendSeries[];
  /** X labels rendered in mono under the plot (subset shown). */
  xLabels?: string[];
  /** stacked sums the series per column — parts of ONE total, never
      unrelated measures sharing an axis. */
  kind?: 'line' | 'bar' | 'stacked';
  height?: number;
  /** Show a small legend row (14×2px swatches). Omit when the seed/gray
      convention carries it. */
  legend?: boolean;
  /** B5 amendment (v0.4.0) · up to four PRE-FORMATTED axis labels, given
      bottom-to-top: yTicks[0] sits on the 25% gridline, yTicks[3] on the
      100% one — the gridlines the chart already draws. The component never
      formats a number (C9), and the column is aria-hidden because the
      required ariaLabel already carries the takeaway. */
  yTicks?: string[];
  /** B5 amendment (v0.4.0) · the ONE column this chart is ABOUT. Printed,
      never hovered (C8 forbids hover-dependent information): the other
      columns recede to --sv-compare, a chip states the label above the
      highlighted column, and its x label goes ink/700. */
  highlight?: { index: number; label: string };
  className?: string;
}

const X_PAD = 4;

/** The gridlines the plot already draws, bottom-to-top. */
const GRID_YS = [0.25, 0.5, 0.75, 1];

/** Stacked segments read bottom-up: the live part in seed, the rest receding. */
const STACK_TONES = ['seed', 'compare', 'faint'] as const;

/**
 * B5 amendment (v0.4.0) · Sparkline — the shape of a series at cell size:
 * no axes, no grid, no labels, no interaction. It is only ever legal
 * BESIDE a printed figure, because a line with no scale states nothing on
 * its own (B4's rule: the numbers inform, the bar illustrates).
 */
export interface SparklineProps {
  data: number[];
  /** REQUIRED takeaway, e.g. "Orders per day, trending up over 14 days". */
  ariaLabel: string;
  width?: number;
  height?: number;
  tone?: 'seed' | 'faint';
  className?: string;
}

export function Sparkline({ data, ariaLabel, width = 72, height = 20, tone = 'seed', className }: SparklineProps) {
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const span = hi - lo || 1;
  const step = (width - 2) / Math.max(1, data.length - 1);
  const y = (v: number) => height - 2 - ((v - lo) / span) * (height - 4);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${(1 + i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  return (
    <svg
      className={cx('sv-spark', tone === 'faint' && 'sv-spark--faint', className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      <path className="sv-spark__line" d={path} />
      {data.length > 0 && (
        <circle className="sv-spark__dot" cx={1 + (data.length - 1) * step} cy={y(data[data.length - 1])} r="2" />
      )}
    </svg>
  );
}

export function Trend({
  ariaLabel,
  series,
  xLabels,
  kind = 'line',
  height = 160,
  legend = false,
  yTicks,
  highlight,
  className,
}: TrendProps) {
  const capped = series.slice(0, 3); // max 3 series (B5)
  const width = 560;

  const { max, gridYs } = useMemo(() => {
    /* Stacked columns are read against their SUM — scaling to the tallest
       single series would push the stack off the plot. */
    const tops =
      kind === 'stacked'
        ? capped[0]?.data.map((_, i) => capped.reduce((sum, s) => sum + (s.data[i] ?? 0), 0)) ?? []
        : capped.flatMap((s) => s.data);
    const top = Math.max(1, ...tops);
    return { max: top * 1.15, gridYs: GRID_YS };
  }, [capped, kind]);

  const toneClass = (tone: TrendSeries['tone'], i: number) =>
    tone ?? (i === 0 ? 'seed' : 'compare');

  /* The chip is drawn in HTML, not SVG: the plot is preserveAspectRatio
     ="none", so any <text> inside it would be stretched with the geometry.
     Both percentages come from the same arithmetic the marks use. */
  const chipAt = useMemo(() => {
    if (!highlight) return null;
    const i = highlight.index;
    const n = capped[0]?.data.length ?? 0;
    if (n === 0 || i < 0 || i >= n) return null;
    if (kind === 'line') {
      const v = capped[0]?.data[i];
      if (v === undefined) return null;
      const step = (width - X_PAD * 2) / Math.max(1, n - 1);
      return { left: ((X_PAD + i * step) / width) * 100, bottom: (v / max) * 100 };
    }
    const group = (width - X_PAD * 2) / n;
    const top =
      kind === 'stacked'
        ? capped.reduce((sum, s) => sum + (s.data[i] ?? 0), 0)
        : Math.max(...capped.map((s) => s.data[i] ?? 0));
    return { left: ((X_PAD + i * group + group / 2) / width) * 100, bottom: (top / max) * 100 };
  }, [highlight, capped, kind, max, width]);

  function linePath(data: number[]) {
    const n = data.length;
    if (n === 0) return '';
    const step = (width - X_PAD * 2) / Math.max(1, n - 1);
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${(X_PAD + i * step).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`)
      .join(' ');
  }

  return (
    <div className={cx('sv-trend', chipAt && 'sv-trend--chipped', className)}>
      {legend && (
        <div className="sv-trend__legend">
          {capped.map((s, i) => (
            <span key={s.label} className="sv-trend__legend-item">
              <span className={cx('sv-trend__swatch', `sv-trend__stroke--${toneClass(s.tone, i)}`)} aria-hidden="true" />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <div className="sv-trend__plotwrap">
        {yTicks && yTicks.length > 0 && (
          <div className="sv-trend__y sv-mono sv-num" aria-hidden="true">
            {yTicks.slice(0, 4).map((tick, i) => (
              <span key={tick} className="sv-trend__ytick" style={{ top: `${(1 - GRID_YS[i]) * 100}%` }}>
                {tick}
              </span>
            ))}
          </div>
        )}
        <div className="sv-trend__plotarea">
          <svg
            className="sv-trend__plot"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel}
            preserveAspectRatio="none"
          >
            {gridYs.map((g) => (
              <line
                key={g}
                className="sv-trend__grid"
                x1="0"
                x2={width}
                y1={height - g * height + 0.5}
                y2={height - g * height + 0.5}
              />
            ))}
            {kind === 'line' &&
              capped.map((s, i) => {
                const cls = toneClass(s.tone, i);
                const last = s.data[s.data.length - 1];
                const step = (width - X_PAD * 2) / Math.max(1, s.data.length - 1);
                return (
                  <g key={s.label}>
                    <path className={cx('sv-trend__line', `sv-trend__stroke--${cls}`)} d={linePath(s.data)} />
                    {cls === 'seed' && s.data.length > 0 && (
                      <circle
                        className="sv-trend__dot"
                        cx={X_PAD + (s.data.length - 1) * step}
                        cy={height - (last / max) * height}
                        r="4"
                      />
                    )}
                  </g>
                );
              })}
            {kind === 'bar' &&
              capped.map((s, si) => {
                const cls = toneClass(s.tone === 'compare' ? 'faint' : s.tone, si === 0 ? 0 : 2);
                const n = s.data.length;
                const group = (width - X_PAD * 2) / n;
                const barW = Math.min(18, (group / capped.length) * 0.7);
                return (
                  <g key={s.label}>
                    {s.data.map((v, i) => (
                      <rect
                        key={i}
                        className={cx(
                          'sv-trend__bar',
                          `sv-trend__fill--${highlight && i !== highlight.index ? 'compare' : cls}`,
                        )}
                        x={X_PAD + i * group + group / 2 - (barW * capped.length) / 2 + si * barW}
                        y={height - (v / max) * height}
                        width={barW}
                        height={(v / max) * height}
                        rx="2"
                      />
                    ))}
                  </g>
                );
              })}
            {kind === 'stacked' &&
              (capped[0]?.data ?? []).map((_, i) => {
                const group = (width - X_PAD * 2) / (capped[0]?.data.length ?? 1);
                const barW = Math.min(26, group * 0.62);
                /* A highlighted chart is ABOUT one column: the others recede
                   whole, stack tones and all, rather than half-receding. */
                const dim = highlight !== undefined && i !== highlight.index;
                let base = height;
                return (
                  <g key={i}>
                    {capped.map((s, si) => {
                      const v = s.data[i] ?? 0;
                      const h = (v / max) * height;
                      base -= h;
                      return (
                        <rect
                          key={s.label}
                          className={cx(
                            'sv-trend__bar',
                            `sv-trend__fill--${dim ? 'compare' : s.tone ?? STACK_TONES[si]}`,
                          )}
                          x={X_PAD + i * group + (group - barW) / 2}
                          y={base}
                          width={barW}
                          height={h}
                        />
                      );
                    })}
                  </g>
                );
              })}
          </svg>
          {/* aria-hidden: the required ariaLabel on the plot already states
              the takeaway, and two readings of one fact is a defect. */}
          {highlight && chipAt && (
            <span
              className="sv-trend__chip sv-mono sv-num"
              style={{ left: `${chipAt.left}%`, bottom: `${chipAt.bottom}%` }}
              aria-hidden="true"
            >
              {highlight.label}
            </span>
          )}
        </div>
      </div>
      {xLabels && (
        <div
          className={cx('sv-trend__x sv-mono', yTicks && yTicks.length > 0 && 'sv-trend__x--inset')}
          style={{ '--sv-trend-cols': xLabels.length } as CSSProperties}
          aria-hidden="true"
        >
          {xLabels.map((l, i) => (
            <span key={l} className={cx(highlight?.index === i && 'sv-trend__x-item--on')}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
