import { forwardRef, useId } from 'react';
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
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'> {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  /** Formats the readout and aria-valuetext, e.g. (v) => `${v}%`. */
  format?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, value, onValueChange, min = 0, max = 100, step = 1, hint, format, id: explicitId, className, ...rest },
  ref,
) {
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = `${id}-hint`;
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
        onChange={(e) => onValueChange(Number(e.target.value))}
        aria-describedby={hint ? hintId : undefined}
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
