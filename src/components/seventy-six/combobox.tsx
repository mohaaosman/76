import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './combobox.css';

/**
 * B19 · Combobox — the searchable select. Native <select> (B11) remains
 * the default for short, known lists; the Combobox exists for the moment
 * a list grows past ~10 options or the user knows the value's NAME
 * faster than its position. ARIA 1.2 combobox pattern, hand-rolled:
 * zero runtime dependencies, no portal library — the listbox is a child
 * of the field and must not sit inside an overflow container (Firewall E).
 */
export interface ComboOption {
  value: string;
  label: string;
  /** Mono metadata rendered right-aligned, e.g. an ID or count. */
  meta?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  label: string;
  options: ComboOption[];
  /** Controlled selected value. */
  value: string | null;
  onChange: (value: string | null, option: ComboOption | null) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  /** Copy for the no-match state. States what, like every 76° empty state. */
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    options,
    value,
    onChange,
    hint,
    error,
    required,
    placeholder = 'Type to search',
    emptyText = 'No matching options.',
    disabled,
    id: explicitId,
    className,
  },
  ref,
) {
  const auto = useId();
  const id = explicitId ?? auto;
  const listId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return options;
    return options.filter((o) => normalize(o.label).includes(q) || normalize(o.meta ?? '').includes(q));
  }, [options, query]);

  /* Input shows the selection when closed, the query while searching. */
  const display = open ? query : (selected?.label ?? '');

  function openList(seed = '') {
    if (disabled) return;
    setQuery(seed);
    const idx = Math.max(
      0,
      filtered.findIndex((o) => o.value === value),
    );
    setActive(idx);
    setOpen(true);
  }

  function commit(option: ComboOption | null) {
    if (option?.disabled) return;
    onChange(option ? option.value : null, option);
    setOpen(false);
    setQuery('');
    inputRef.current?.focus();
  }

  function close() {
    setOpen(false);
    setQuery('');
  }

  /* Light dismiss: pointer down outside the field closes without committing. */
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  /* Keep the active option in view while arrowing. */
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) return openList();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActive(filtered.length - 1);
        }
        break;
      case 'Enter':
        if (open) {
          e.preventDefault();
          commit(filtered[active] ?? null);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        } else if (selected) {
          /* Second Escape clears the selection — the pattern's clear path. */
          e.preventDefault();
          commit(null);
        }
        break;
      case 'Tab':
        if (open) close();
        break;
    }
  }

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const activeId = open && filtered[active] ? `${id}-opt-${filtered[active].value}` : undefined;

  return (
    <div className={cx('sv-field sv-combo', className)} ref={rootRef}>
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
      <div className="sv-combo__anchor">
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          id={id}
          className={cx('sv-field__input', 'sv-combo__input', error && 'sv-field__input--error')}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={display}
          onChange={(e) => {
            if (!open) setOpen(true);
            setQuery(e.target.value);
            setActive(0);
          }}
          onClick={() => !open && openList()}
          onKeyDown={onKeyDown}
        />
        <span className="sv-field__chevron" aria-hidden="true" />
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="sv-combo__list"
          hidden={!open}
        >
          {filtered.length === 0 && (
            <li className="sv-combo__empty" role="presentation">
              {emptyText}
            </li>
          )}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${o.value}`}
              role="option"
              aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined}
              className={cx(
                'sv-combo__option',
                i === active && 'sv-combo__option--active',
                o.value === value && 'sv-combo__option--selected',
                o.disabled && 'sv-combo__option--disabled',
              )}
              onPointerMove={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault() /* keep input focus */}
              onClick={() => commit(o)}
            >
              <span className="sv-combo__optlabel">{o.label}</span>
              {o.meta && <span className="sv-combo__optmeta sv-mono">{o.meta}</span>}
              {o.value === value && (
                <svg
                  className="sv-combo__tick"
                  viewBox="0 0 10 8"
                  width="10"
                  height="8"
                  aria-hidden="true"
                >
                  <path
                    d="M1 4l2.5 2.5L9 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </div>
      {error && (
        <p className="sv-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});

export type { ComboOption as ComboboxOption };
