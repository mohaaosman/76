import { useMemo } from 'react';
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
  kind?: 'line' | 'bar';
  height?: number;
  /** Show a small legend row (14×2px swatches). Omit when the seed/gray
      convention carries it. */
  legend?: boolean;
  className?: string;
}

const X_PAD = 4;

export function Trend({
  ariaLabel,
  series,
  xLabels,
  kind = 'line',
  height = 160,
  legend = false,
  className,
}: TrendProps) {
  const capped = series.slice(0, 3); // max 3 series (B5)
  const width = 560;

  const { max, gridYs } = useMemo(() => {
    const all = capped.flatMap((s) => s.data);
    const top = Math.max(1, ...all);
    const niceMax = top * 1.15;
    return { max: niceMax, gridYs: [0.25, 0.5, 0.75, 1] };
  }, [capped]);

  const toneClass = (tone: TrendSeries['tone'], i: number) =>
    tone ?? (i === 0 ? 'seed' : 'compare');

  function linePath(data: number[]) {
    const n = data.length;
    if (n === 0) return '';
    const step = (width - X_PAD * 2) / Math.max(1, n - 1);
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${(X_PAD + i * step).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`)
      .join(' ');
  }

  return (
    <div className={cx('sv-trend', className)}>
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
                    className={cx('sv-trend__bar', `sv-trend__fill--${cls}`)}
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
      </svg>
      {xLabels && (
        <div className="sv-trend__x sv-mono" aria-hidden="true">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
