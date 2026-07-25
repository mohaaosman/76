import { forwardRef, useId, useRef, useState } from 'react';
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
import './pin-field.css';

/**
 * B25 · PinField — the verification-code input (OTP, 2FA, invite code).
 * B11's field chrome verbatim: label above, optional hint, an error that
 * says WHAT and HOW TO FIX. The N boxes are a VIEW of one string, so to a
 * screen reader this is one labelled group, not six anonymous inputs, and
 * the error is announced once by the chrome rather than once per box.
 * Paste fills every box — people paste codes out of email, and that is the
 * interaction the component lives or dies on. Zero runtime dependencies.
 */

const MIN_BOXES = 4;
const MAX_BOXES = 8;

/** Everything outside the charset is dropped, so "123 456" and "123-456" paste clean. */
const REJECT: Record<PinCharset, RegExp> = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^0-9a-zA-Z]/g,
};

export type PinCharset = 'numeric' | 'alphanumeric';

export interface PinFieldProps {
  label: string;
  /** Number of boxes, clamped to 4–8. Default 6. */
  length?: number;
  /** numeric (default) drives the phone keypad; alphanumeric allows letters. */
  charset?: PinCharset;
  /** Controlled value. Pass with onChange; omit it for uncontrolled. */
  value?: string;
  /** Uncontrolled starting value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires the moment every box is filled, with the complete code. */
  onComplete?: (value: string) => void;
  hint?: string;
  /** Error text: what went wrong and how to fix it. Sets aria-invalid + describedby. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Posts the whole code as one form value. */
  name?: string;
  id?: string;
  className?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export const PinField = forwardRef<HTMLInputElement, PinFieldProps>(function PinField(
  {
    label,
    length = 6,
    charset = 'numeric',
    value,
    defaultValue,
    onChange,
    onComplete,
    hint,
    error,
    required,
    disabled,
    autoFocus,
    name,
    id: explicitId,
    className,
  },
  ref,
) {
  const auto = useId();
  const id = explicitId ?? auto;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const size = clamp(Math.trunc(length), MIN_BOXES, MAX_BOXES);

  function sanitize(raw: string) {
    return raw.replace(REJECT[charset], '').slice(0, size);
  }

  const [inner, setInner] = useState(() => sanitize(defaultValue ?? ''));
  const controlled = value !== undefined;
  const code = controlled ? sanitize(value) : inner;

  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  function focusBox(i: number) {
    const el = boxes.current[clamp(i, 0, size - 1)];
    el?.focus();
    el?.select();
  }

  function commit(next: string) {
    if (next === code) return;
    if (!controlled) setInner(next);
    onChange?.(next);
    if (next.length === size) onComplete?.(next);
  }

  /**
   * The one write path: typing, pasting and SMS autofill all land here.
   * A payload as long as the field is the whole code, so it starts at box 0
   * whichever box received it; anything shorter overwrites from `at`. The
   * landing index is clamped to the code's length, so the value can never
   * grow a hole in the middle. Returns the resulting code.
   */
  function write(at: number, text: string) {
    const clean = sanitize(text);
    if (!clean) return code;
    const start = clean.length >= size ? 0 : Math.min(at, code.length);
    const next = (code.slice(0, start) + clean + code.slice(start + clean.length)).slice(0, size);
    commit(next);
    focusBox(start + clean.length);
    return next;
  }

  function erase(at: number) {
    if (at < 0 || at >= size) return;
    commit(code.slice(0, at) + code.slice(at + 1));
  }

  function onInput(e: ChangeEvent<HTMLInputElement>, i: number) {
    const raw = e.target.value;
    const current = code[i] ?? '';
    /* No maxLength: a filled box must still accept an overtype, and iOS drops
       the entire autofilled code into whichever box holds focus. Strip the
       character that was already there, then treat the rest as new input. */
    const typed =
      current && raw.length === 2 && raw.startsWith(current)
        ? raw.slice(1)
        : current && raw.length === 2 && raw.endsWith(current)
          ? raw.slice(0, 1)
          : raw;
    const next = write(i, typed);
    /* Each box only mirrors `code`. A rejected character changes no state and
       so triggers no re-render — put the DOM back by hand. */
    e.target.value = next[i] ?? '';
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>, i: number) {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (code[i]) {
          erase(i);
        } else {
          erase(i - 1);
          focusBox(i - 1);
        }
        break;
      case 'Delete':
        e.preventDefault();
        erase(i);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusBox(i - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusBox(i + 1);
        break;
      case 'Home':
        e.preventDefault();
        focusBox(0);
        break;
      case 'End':
        e.preventDefault();
        focusBox(size - 1);
        break;
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>, i: number) {
    e.preventDefault();
    write(i, e.clipboardData.getData('text'));
  }

  /* Select on entry so the next keystroke overtypes rather than stalls. */
  function onFocus(e: FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const boxWord = charset === 'numeric' ? 'Digit' : 'Character';

  return (
    <div className={cx('sv-field sv-pin', className)}>
      <label className="sv-field__label" id={labelId} htmlFor={`${id}-0`}>
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
      <div
        className="sv-pin__boxes"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
      >
        {Array.from({ length: size }, (_, i) => (
          <input
            key={i}
            ref={(node) => {
              boxes.current[i] = node;
              if (i !== 0) return;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={`${id}-${i}`}
            className={cx('sv-pin__box', error && 'sv-pin__box--error')}
            type="text"
            inputMode={charset === 'numeric' ? 'numeric' : 'text'}
            pattern={charset === 'numeric' ? '[0-9]*' : undefined}
            autoComplete="one-time-code"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            required={required}
            disabled={disabled}
            autoFocus={i === 0 ? autoFocus : undefined}
            aria-label={`${boxWord} ${i + 1} of ${size}`}
            aria-invalid={error ? true : undefined}
            value={code[i] ?? ''}
            onChange={(e) => onInput(e, i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            onPaste={(e) => onPaste(e, i)}
            onFocus={onFocus}
          />
        ))}
      </div>
      {error && (
        <p className="sv-field__error" id={errorId}>
          {error}
        </p>
      )}
      {name && <input type="hidden" name={name} value={code} readOnly />}
    </div>
  );
});
