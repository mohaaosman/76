import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import './slider.css';

/**
 * B34 · Slider — a native <input type="range"> in 76° clothes. It is for
 * a value whose EXACT number matters less than its position in a range
 * (opacity, threshold, weighting). The number is still printed in mono
 * beside the label: the bar illustrates, the figure informs (B4).
 */
export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  label: string;
  /** Controlled value. When passed it wins over internal state. */
  value?: number;
  /** Uncontrolled: the starting value. Defaults to `min`. */
  defaultValue?: number;
  /** Called on every change — in both modes. */
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  /** Formats the readout and aria-valuetext, e.g. (v) => `${v}%`. */
  format?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    label,
    value: valueProp,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    hint,
    format,
    id: explicitId,
    className,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = `${id}-hint`;
  const [own, setOwn] = useState(() => defaultValue ?? min);
  const value = valueProp ?? own;
  const readout = format ? format(value) : String(value);

  return (
    <div className={cx('sv-field sv-slider', className)}>
      <div className="sv-slider__head">
        <label className="sv-field__label" htmlFor={id}>
          {label}
        </label>
        <output className="sv-slider__value sv-mono sv-num" htmlFor={id} aria-hidden="true">
          {readout}
        </output>
      </div>
      <input
        {...rest}
        ref={ref}
        id={id}
        type="range"
        className="sv-slider__input"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (valueProp === undefined) setOwn(next);
          onValueChange?.(next);
        }}
        /* A caller's own aria-describedby is MERGED, never replaced. */
        aria-describedby={[hint ? hintId : null, rest['aria-describedby']].filter(Boolean).join(' ') || undefined}
        aria-valuetext={format ? readout : undefined}
      />
      {hint && (
        <p className="sv-field__hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
});
