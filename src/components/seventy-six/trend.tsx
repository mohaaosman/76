import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { cx } from '@/lib/cx';
import './trend.css';

/**
 * B5 · Trend — flat single-weight lines on a hairline grid. Current
 * period = seed, comparison = --sv-compare. No area fills, no dual axes,
 * max 3 series. Charts answer "which direction."
 *
 * B5's ban on an animated draw-in stands by DEFAULT and is not repealed:
 * it is now conditional on the [data-motion='on'] posture, which is absent
 * unless a product sets it and is dropped again under prefers-reduced-
 * motion. With no posture the chart paints finished on the first frame.
 * `readouts` adds interaction on the same terms — enhancement only, never
 * the carrier of a figure the chart does not already print (C8).
 */
export interface TrendSeries {
  label: string;
  data: number[];
  /** 'seed' (current period) | 'compare' (previous period) | 'faint'. */
  tone?: 'seed' | 'compare' | 'faint';
}

/**
 * B5 amendment (v0.6.1) · one column's worth of PRINTED truth. The
 * component never formats a number (C9), so both halves arrive
 * pre-formatted, exactly as `yTicks` and `highlight.label` do.
 */
export interface TrendColumn {
  /** The column's own short name — "WK4", "THU". It is the accessible name
      of that column's control, so it is the one thing a keyboard reader
      hears BEFORE the figures, and it is never repeated inside them. */
  name: string;
  /** The figures this column ALREADY draws, e.g. "$1.44M this quarter ·
      $1.28M last quarter". Keep it to one line: the readout is printed
      under the plot, and a line that wraps reflows the card as the reader
      moves along the chart. */
  figures: string;
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
  /** B5 amendment (v0.6.1) · one entry per DATA column (not per x label —
      xLabels is a subset), which turns the plot into a readable strip.
      It is PURE ENHANCEMENT and that is the whole of its licence under C8:
      the readout row it feeds is printed from the first frame, it always
      names and states SOME column, and every figure it prints is a figure
      the marks already encode. A reader who never points at the chart loses
      nothing. Sparse arrays are legal — a column with no entry has no
      control and is skipped by the arrow keys. */
  readouts?: TrendColumn[];
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
      {/* pathLength normalises the line to ONE unit, exactly as the B5 plot
          does, so trend.css can express the draw-in as a dash of 1 whatever
          the cell is wide. Un-animated the pair is the finished line. */}
      <path className="sv-spark__line" d={path} pathLength={1} />
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
  readouts,
  className,
}: TrendProps) {
  const capped = series.slice(0, 3); // max 3 series (B5)
  const width = 560;
  const colsRef = useRef<HTMLDivElement>(null);
  /* null = nobody is pointing at or focused on a column. It is NOT "no
     column stated": the readout falls back to the printed default below,
     because a row that empties when the pointer leaves is a hover-dependent
     row (C8). */
  const [cursor, setCursor] = useState<number | null>(null);

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

  /* The interactive strip, resolved once: how many columns the DATA has (x
     labels are a declared subset and cannot be trusted for this), which of
     them are actually statable, and which one the row prints at rest. */
  const live = useMemo(() => {
    const n = capped[0]?.data.length ?? 0;
    if (!readouts || readouts.length === 0 || n === 0) return null;
    const at = Array.from({ length: n }, (_, i) => readouts[i]);
    const reachable = at.flatMap((r, i) => (r ? [i] : []));
    if (reachable.length === 0) return null;
    /* At rest the row states the column the CHART is about: the highlighted
       one where B5's chip already names it, otherwise the live end of the
       series — the point the terminal dot already marks. */
    const rest =
      highlight && at[highlight.index] ? highlight.index : reachable[reachable.length - 1];
    return { n, at, reachable, rest };
  }, [readouts, capped, highlight]);

  /* Pointed = the reader is actually there. Shown = what the row prints,
     which is never nothing. */
  const pointed = live && cursor !== null && live.at[cursor] ? cursor : null;
  const shown = pointed ?? live?.rest ?? 0;

  /* Roving tabindex over the statable columns (C4): one tab stop for the
     whole strip, arrows walk it, Home/End jump. A pointer-only affordance
     would fail C4 as squarely as it fails C8. */
  function onColsKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!live) return;
    const order = live.reachable;
    const from = order.indexOf(shown);
    let next = -1;
    if (e.key === 'ArrowRight') next = (from + 1) % order.length;
    if (e.key === 'ArrowLeft') next = (from - 1 + order.length) % order.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = order.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setCursor(order[next]);
    colsRef.current?.querySelector<HTMLButtonElement>(`[data-col="${order[next]}"]`)?.focus();
  }

  /* The pointer leaving does NOT reset a column the keyboard is still
     standing on — otherwise moving the mouse away wipes the focused
     reader's place. Same reason `onBlur` only fires when focus has actually
     left the strip. */
  function onColsPointerLeave(e: ReactPointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(document.activeElement)) setCursor(null);
  }

  function linePath(data: number[]) {
    const n = data.length;
    if (n === 0) return '';
    const step = (width - X_PAD * 2) / Math.max(1, n - 1);
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${(X_PAD + i * step).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`)
      .join(' ');
  }

  return (
    <div
      className={cx('sv-trend', chipAt && 'sv-trend--chipped', live && 'sv-trend--live', className)}
      /* The plot's ratio, published to CSS. It is what lets a chart card
         GROW into the height the grid gave it without the stylesheet having
         to know the viewBox — see trend.css, "a chart card grows". */
      style={{ '--sv-trend-ratio': `${width} / ${height}` } as CSSProperties}
    >
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
          {/* The hit strip is drawn BEFORE the plot so the plot paints over
              it: the active column's tint has to read BEHIND the marks, not
              across them. The plot is made pointer-transparent in CSS so the
              columns still take the pointer. */}
          {live && (
            <div
              ref={colsRef}
              className="sv-trend__cols"
              style={{ '--sv-trend-hits': live.n } as CSSProperties}
              role="group"
              aria-label="Chart columns"
              onKeyDown={onColsKeyDown}
              onPointerLeave={onColsPointerLeave}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setCursor(null);
              }}
            >
              {live.at.map((col, i) =>
                col ? (
                  <button
                    key={i}
                    type="button"
                    data-col={i}
                    className={cx('sv-trend__col', pointed === i && 'sv-trend__col--on')}
                    /* The column's own name and nothing else. The figures
                       arrive from the live region below, so focusing a
                       column is announced once, not twice. */
                    aria-label={col.name}
                    tabIndex={i === shown ? 0 : -1}
                    onFocus={() => setCursor(i)}
                    onPointerEnter={() => setCursor(i)}
                    onClick={() => setCursor(i)}
                  />
                ) : (
                  /* A column with no readout keeps its grid track so the
                     strip stays registered with the marks, but it is not a
                     control and not a tab stop. */
                  <span key={i} aria-hidden="true" />
                ),
              )}
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
                    {/* pathLength normalises the line to ONE unit, which is
                        what lets the opt-in draw-in be pure CSS: one dash of
                        length 1 IS the finished line, so the un-animated
                        state is the correct state (see trend.css). */}
                    <path
                      className={cx('sv-trend__line', `sv-trend__stroke--${cls}`)}
                      d={linePath(s.data)}
                      pathLength={1}
                    />
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
      {/* PRINTED, from the first frame, whether or not anything is pointed
          at — the same contract the highlight chip keeps. Interaction only
          changes WHICH column it states; it never brings the row into
          existence, so nothing here lives behind a pointer (C8). It is HTML
          and not SVG <text> for the same reason the chip is: the plot is
          preserveAspectRatio="none" and would stretch the glyphs. */}
      {live && (
        <p className={cx('sv-trend__readout', yTicks && yTicks.length > 0 && 'sv-trend__readout--inset')}>
          <b className="sv-trend__readout-name sv-mono" aria-hidden="true">
            {live.at[shown]?.name}
          </b>
          {/* The name is aria-hidden and the figures are the live region, so
              a keyboard reader hears the column name once (from the button)
              and its figures once (from here). */}
          <span className="sv-mono sv-num" aria-live="polite" aria-atomic="true">
            {live.at[shown]?.figures}
          </span>
        </p>
      )}
    </div>
  );
}
