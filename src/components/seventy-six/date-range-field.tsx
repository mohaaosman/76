import { useId } from 'react';
import { cx } from '@/lib/cx';
import './date-range-field.css';

/**
 * B35 · DateRangeField — the range, without a calendar. Part F (F4) is
 * binding: 76° draws no month grid, ever. Two native
 * <input type="date"> fields welded into one B11 Field, preceded by a
 * mono preset row and followed by a mono context line. The browser draws
 * the picker — free, native, localized, accessible.
 */
export interface DateRange {
  /** ISO YYYY-MM-DD. */
  from: string;
  to: string;
}

export type DateRangePreset = '7D' | '30D' | 'QTD' | 'YTD' | 'CUSTOM';

export interface DateRangeFieldProps {
  label: string;
  value: DateRange;
  onValueChange: (value: DateRange) => void;
  /** Preset order is fixed; pass a subset to drop any. CUSTOM always last. */
  presets?: DateRangePreset[];
  /** ISO date the presets count back from. Defaults to the current day. */
  today?: string;
  hint?: string;
  /** What went wrong AND how to fix it (B11). Overrides the built-in order check. */
  error?: string;
  min?: string;
  max?: string;
  /** Replaces the derived "24 days · ends today" line. */
  context?: string;
  className?: string;
}

const DAY = 86_400_000;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DEFAULT_PRESETS: DateRangePreset[] = ['7D', '30D', 'QTD', 'YTD', 'CUSTOM'];

const toMs = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
};
const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** C9 · dates read absolute and mono: 24 JUL, never 7/24. */
function monoDate(iso: string) {
  const date = new Date(toMs(iso));
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

/** Exported so callers can drive the same ranges from a Menu or a URL. */
export function presetRange(preset: Exclude<DateRangePreset, 'CUSTOM'>, todayIso: string): DateRange {
  const end = toMs(todayIso);
  const today = new Date(end);
  switch (preset) {
    case '7D':
      return { from: toIso(end - 6 * DAY), to: todayIso };
    case '30D':
      return { from: toIso(end - 29 * DAY), to: todayIso };
    case 'QTD':
      return {
        from: toIso(Date.UTC(today.getUTCFullYear(), Math.floor(today.getUTCMonth() / 3) * 3, 1)),
        to: todayIso,
      };
    case 'YTD':
      return { from: toIso(Date.UTC(today.getUTCFullYear(), 0, 1)), to: todayIso };
  }
}

export function DateRangeField({
  label,
  value,
  onValueChange,
  presets = DEFAULT_PRESETS,
  today = new Date().toISOString().slice(0, 10),
  hint,
  error,
  min,
  max,
  context,
  className,
}: DateRangeFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const inverted = value.from !== '' && value.to !== '' && toMs(value.from) > toMs(value.to);
  const shownError =
    error ?? (inverted ? 'The start date is after the end date. Move the start date back.' : undefined);
  const describedBy = [hint ? hintId : null, shownError ? errorId : null].filter(Boolean).join(' ') || undefined;

  const active = presets.find(
    (preset) => preset !== 'CUSTOM' && matches(presetRange(preset as Exclude<DateRangePreset, 'CUSTOM'>, today), value),
  );

  const days = inverted || !value.from || !value.to ? 0 : Math.round((toMs(value.to) - toMs(value.from)) / DAY) + 1;
  const derived =
    days > 0 ? `${days} ${days === 1 ? 'day' : 'days'} · ends ${value.to === today ? 'today' : monoDate(value.to)}` : '';
  const contextLine = context ?? derived;

  return (
    <fieldset className={cx('sv-field sv-daterange', className)}>
      <legend className="sv-field__label">{label}</legend>
      {hint && (
        <p className="sv-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="sv-daterange__presets" role="group" aria-label={`${label} presets`}>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className="sv-daterange__preset sv-mono"
            aria-pressed={preset === 'CUSTOM' ? active === undefined : active === preset}
            onClick={() => {
              if (preset !== 'CUSTOM') onValueChange(presetRange(preset as Exclude<DateRangePreset, 'CUSTOM'>, today));
            }}
          >
            {preset}
          </button>
        ))}
      </div>
      <div className="sv-daterange__inputs">
        <input
          type="date"
          className={cx('sv-field__input sv-daterange__input', shownError && 'sv-field__input--error')}
          value={value.from}
          min={min}
          max={max}
          aria-label={`${label}, start date`}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onValueChange({ ...value, from: e.target.value })}
        />
        <span className="sv-daterange__weld sv-mono" aria-hidden="true">
          →
        </span>
        <input
          type="date"
          className={cx('sv-field__input sv-daterange__input', shownError && 'sv-field__input--error')}
          value={value.to}
          min={value.from || min}
          max={max}
          aria-label={`${label}, end date`}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onValueChange({ ...value, to: e.target.value })}
        />
      </div>
      {contextLine && (
        <p className="sv-daterange__context sv-mono" aria-live="polite">
          {contextLine}
        </p>
      )}
      {shownError && (
        <p className="sv-field__error" id={errorId}>
          {shownError}
        </p>
      )}
    </fieldset>
  );
}

const matches = (a: DateRange, b: DateRange) => a.from === b.from && a.to === b.to;
