import { cx } from '@/lib/cx';
import './distribution-strip.css';

/**
 * B44 · DistributionStrip — the named replacement for the donut (Firewall
 * A2 bans donut, pie, radial and gauge). It states how ONE total divides
 * into its parts. This is NOT B6 MeterList, which the Book pointed at
 * until now: B6 measures each part against ITS OWN maximum — utilization,
 * "Zone A is 92% full" — while B44 divides ONE total into shares, "46% of
 * 128,953 sessions were mobile". Neither is a donut and neither ever will
 * be. The strip is one flat bar with structural 2px seams, because a
 * gradient smear would read as a continuum instead of as parts; the legend
 * is the data and repeats every figure as text, so nothing is carried by
 * colour or width alone (C5).
 *
 * Don'ts: never more than five rows — six parts is a B7 DataTable; never a
 * stack of strips comparing periods — that is B5 kind="stacked"; never a
 * strip whose parts do not sum to the stated total without saying so.
 */
export interface DistributionPart {
  label: string;
  value: number;
}

export interface DistributionStripProps {
  /** REQUIRED takeaway, e.g. "Devices accessed, 128,953 total: mobile 46%, desktop 31%, tablet 15%, other 8%". */
  ariaLabel: string;
  /** Mono uppercase label for the total, e.g. "DEVICES ACCESSED". */
  label: string;
  parts: DistributionPart[];
  /** Defaults to the sum of the parts. Pass it when the parts are a subset. */
  total?: number;
  /** Formats both the total and each absolute figure. Defaults to a grouped integer. */
  format?: (value: number) => string;
  className?: string;
}

/** Four named tones, in order. A fifth part is the caller's "Other" and reuses the last. */
const TONES = ['seed', 'compare', 'faint', 'edge'] as const;

/* Resolved per call, never at module scope: a formatter built at import
   time freezes whatever locale the module happened to load under. */
const groupedInteger = (value: number) => value.toLocaleString();

export function DistributionStrip({
  ariaLabel,
  label,
  parts,
  total,
  format = groupedInteger,
  className,
}: DistributionStripProps) {
  const sum = parts.reduce((acc, part) => acc + part.value, 0);
  const denominator = total ?? sum;
  const share = (value: number) => (denominator > 0 ? (value / denominator) * 100 : 0);
  const tone = (i: number) => TONES[Math.min(i, TONES.length - 1)];

  return (
    <div className={cx('sv-dist', className)}>
      <div className="sv-dist__line">
        <span className="sv-dist__label sv-mono">{label}</span>
        <span className="sv-dist__total sv-num">{format(denominator)}</span>
      </div>
      <div className="sv-dist__strip" role="img" aria-label={ariaLabel}>
        {parts.map((part, i) => (
          <span
            key={part.label}
            className={cx('sv-dist__seg', `sv-dist__tone--${tone(i)}`)}
            style={{ flexBasis: `${share(part.value)}%` }}
          />
        ))}
      </div>
      <ul className="sv-dist__legend">
        {parts.map((part, i) => (
          <li key={part.label} className="sv-dist__row">
            <span className={cx('sv-dist__swatch', `sv-dist__tone--${tone(i)}`)} aria-hidden="true" />
            <span className="sv-dist__name">{part.label}</span>
            {/* The absolute figure is REQUIRED beside the share, exactly as in B6. */}
            <span className="sv-dist__figure sv-num">
              {format(part.value)} · {Math.round(share(part.value))}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
