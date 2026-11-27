import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import './number-field.css';

/**
 * B33 · NumberField — the quantity input: a native number input wearing
 * B11 chrome, with a − / + pair for the small adjustments a keyboard
 * makes clumsy. The number is tabular, the unit is stated, and the
 * bounds are enforced in the component, not just announced.
 */
export interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  label: string;
  /** Controlled value. When passed it wins over internal state. */
  value?: number;
  /** Uncontrolled: the starting value. Defaults to `min` (0). */
  defaultValue?: number;
  /** Called with every committed number — in both modes. */
  onValueChange?: (value: number) => void;
  hint?: string;
  /** What went wrong AND how to fix it (B11). */
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** Rendered after the input in mono: "kg", "days", "%". Never inside it. */
  unit?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    label,
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    hint,
    error,
    required,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    step = 1,
    unit,
    id: explicitId,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const tr = useStrings();
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  /* A caller's own aria-describedby is MERGED, never replaced. */
  const describedBy =
    [hint ? hintId : null, error ? errorId : null, rest['aria-describedby']].filter(Boolean).join(' ') || undefined;
  const [own, setOwn] = useState(() => defaultValue ?? clamp(0, min, max));
  const value = valueProp ?? own;
  const onValueChange = (next: number) => {
    if (valueProp === undefined) setOwn(next);
    onValueChangeProp?.(next);
  };
  const nudge = (by: number) => {
    setDraft(null);
    onValueChange(clamp(value + by, min, max));
  };

  /**
   * A number prop cannot represent an empty box, but people clear a field
   * before retyping it. The draft holds exactly what was typed until blur;
   * only a real number leaves the component, so `Number('')` — which is 0,
   * not "empty" — can never be mistaken for an entry.
   */
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div className={cx('sv-field sv-numfield', className)}>
      <label className="sv-field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="sv-field__req sv-mono" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="sv-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="sv-numfield__row">
        <button
          type="button"
          className="sv-numfield__step"
          onClick={() => nudge(-step)}
          disabled={disabled || value <= min}
          aria-label={tr.decrease(label)}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          {...rest}
          ref={ref}
          id={id}
          type="number"
          inputMode="numeric"
          className={cx('sv-field__input sv-numfield__input sv-num', error && 'sv-field__input--error')}
          value={draft ?? String(value)}
          min={min}
          max={max}
          step={step}
          required={required}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            if (raw.trim() === '') return;
            const next = Number(raw);
            if (Number.isFinite(next)) onValueChange(clamp(next, min, max));
          }}
          onBlur={(e) => {
            setDraft(null);
            rest.onBlur?.(e);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className="sv-numfield__step"
          onClick={() => nudge(step)}
          disabled={disabled || value >= max}
          aria-label={tr.increase(label)}
        >
          <span aria-hidden="true">+</span>
        </button>
        {unit && (
          <span className="sv-numfield__unit sv-mono" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="sv-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});
