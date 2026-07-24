import { forwardRef, useId } from 'react';
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';
import { cx } from '@/lib/cx';
import './field.css';

/**
 * B11 · Forms. Label above field, always — placeholder is NEVER a
 * substitute for the label. Errors state what and how to fix.
 * Validation timing: on blur, then on change after first error.
 */

interface FieldChromeProps {
  label: string;
  hint?: string;
  /** Error text: what went wrong and how to fix it. Sets aria-invalid + describedby. */
  error?: string;
  required?: boolean;
}

function useFieldIds(explicit?: string) {
  const auto = useId();
  const id = explicit ?? auto;
  return { id, hintId: `${id}-hint`, errorId: `${id}-error` };
}

function FieldLabel({ id, label, required, hint, hintId }: { id: string; label: string; required?: boolean; hint?: string; hintId: string }) {
  return (
    <>
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
    </>
  );
}

function FieldError({ error, errorId }: { error?: string; errorId: string }) {
  if (!error) return null;
  return (
    <p className="sv-field__error" id={errorId}>
      {error}
    </p>
  );
}

/* ---------- Field (text input / textarea) ---------- */

export type FieldProps = FieldChromeProps &
  InputHTMLAttributes<HTMLInputElement> & { multiline?: false };

export type TextareaFieldProps = FieldChromeProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, required, id: explicitId, className, ...rest },
  ref,
) {
  const { id, hintId, errorId } = useFieldIds(explicitId);
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx('sv-field', className)}>
      <FieldLabel id={id} label={label} required={required} hint={hint} hintId={hintId} />
      <input
        {...rest}
        ref={ref}
        id={id}
        required={required}
        className={cx('sv-field__input', error && 'sv-field__input--error')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      <FieldError error={error} errorId={errorId} />
    </div>
  );
});

/* ---------- Select (native until a combobox is genuinely required) ---------- */

export type SelectProps = FieldChromeProps &
  SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, required, id: explicitId, className, children, ...rest },
  ref,
) {
  const { id, hintId, errorId } = useFieldIds(explicitId);
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx('sv-field', className)}>
      <FieldLabel id={id} label={label} required={required} hint={hint} hintId={hintId} />
      <span className="sv-field__selectwrap">
        <select
          {...rest}
          ref={ref}
          id={id}
          required={required}
          className={cx('sv-field__input', 'sv-field__select', error && 'sv-field__input--error')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        >
          {children}
        </select>
        <span className="sv-field__chevron" aria-hidden="true" />
      </span>
      <FieldError error={error} errorId={errorId} />
    </div>
  );
});

/* ---------- Checkbox / Radio ---------- */

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className={cx('sv-check', className)}>
      <input {...rest} ref={ref} type="checkbox" className="sv-check__input" />
      <span className="sv-check__box" aria-hidden="true">
        <svg viewBox="0 0 10 8" width="10" height="8">
          <path d="M1 4l2.5 2.5L9 1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="sv-check__label">{label}</span>
    </label>
  );
});

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className={cx('sv-check sv-check--radio', className)}>
      <input {...rest} ref={ref} type="radio" className="sv-check__input" />
      <span className="sv-check__box" aria-hidden="true">
        <span className="sv-check__dot" />
      </span>
      <span className="sv-check__label">{label}</span>
    </label>
  );
});

/* ---------- Toggle (instant-effect settings ONLY) ---------- */

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Anything that needs "Save" is a Checkbox, not a Toggle (B11). */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className={cx('sv-toggle', className)}>
      <input {...rest} ref={ref} type="checkbox" role="switch" className="sv-toggle__input" />
      <span className="sv-toggle__track" aria-hidden="true">
        <span className="sv-toggle__thumb" />
      </span>
      <span className="sv-check__label">{label}</span>
    </label>
  );
});
