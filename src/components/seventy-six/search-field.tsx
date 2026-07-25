import { forwardRef, useId, useRef } from 'react';
import type { ForwardedRef, InputHTMLAttributes, KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
import './search-field.css';

/**
 * B36 · SearchField — one job: filter a set that is ALREADY on screen by
 * typing. It is NOT B16 SearchCommand (⌘K, a dialog, navigating the whole
 * app), and it is not a submit form — there is no button to press and no
 * page to wait for, the caller filters on every keystroke. The platform
 * choice is a native <input type="search">, for the semantics, the mobile
 * keyboard and the Esc-to-clear muscle memory; the only native part removed
 * is WebKit's cancel button, which is unlabelled and unstyleable, replaced
 * by a named button that hands focus back where it found it.
 */
export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  /** Names the set being filtered: "Search orders", not "Search". */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** States the scope. Never the label — it vanishes on the first keystroke. */
  placeholder?: string;
  /**
   * REGISTERED EXCEPTION, not a convenience. Moves the visible label into
   * sv-visually-hidden, and is legal ONLY where a surrounding CardHead or
   * FilterBar already names the set on screen. The placeholder must then
   * state the scope ("Search orders") — and it is still not the label.
   */
  labelHidden?: boolean;
  hint?: string;
  /** Mono count under the field, announced politely: "12 OF 248 MATCH". */
  resultText?: string;
  /** What is wrong AND how to fix it (B11). */
  error?: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    label,
    value,
    onValueChange,
    placeholder = 'Search',
    labelHidden,
    hint,
    resultText,
    error,
    disabled,
    id: explicitId,
    className,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const resultId = `${id}-result`;
  /* The result line is announced by its own live region; naming it in
     aria-describedby too would read the count twice on every focus. */
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  const inner = useRef<HTMLInputElement | null>(null);
  const attach = (node: HTMLInputElement | null) => {
    inner.current = node;
    assignRef(ref, node);
  };

  const clear = () => {
    onValueChange('');
    inner.current?.focus();
  };

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    /* Esc clears the filter and stays put. preventDefault only when there is
       something to clear, so an empty field still lets Esc reach an enclosing
       dialog or popover. */
    if (e.key === 'Escape' && value !== '') {
      e.preventDefault();
      onValueChange('');
    }
    rest.onKeyDown?.(e);
  }

  return (
    <div className={cx('sv-field sv-search', className)}>
      <label className={cx('sv-field__label', labelHidden && 'sv-visually-hidden')} htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p className="sv-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <div className="sv-search__wrap">
        <svg className="sv-search__icon" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
          <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.3 9.3L12.6 12.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          {...rest}
          ref={attach}
          id={id}
          type="search"
          className={cx('sv-field__input', 'sv-search__input', error && 'sv-field__input--error')}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={onKeyDown}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {value !== '' && (
          <button
            type="button"
            className="sv-search__clear"
            aria-label={`Clear ${label}`}
            disabled={disabled}
            onClick={clear}
          >
            <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
              <path
                d="M1.2 1.2L8.8 8.8M8.8 1.2L1.2 8.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      {/* The live region exists even when empty — a region added at the same
          moment as its first text is routinely missed by screen readers. */}
      <p className="sv-search__result sv-mono sv-num" id={resultId} aria-live="polite">
        {resultText}
      </p>
      {error && (
        <p className="sv-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});

function assignRef(ref: ForwardedRef<HTMLInputElement>, node: HTMLInputElement | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}
