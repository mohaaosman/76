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
 * One job: pick one value — or a set of them — from a list too long to
 * scan. Multi-select is specified as of v0.4.0; free-text is still
 * refused, because a Combobox may never mint an option its caller did
 * not supply.
 *
 * A multi-selection is STATED, never worn: one mono line of running text
 * under the field, in the B7 FilterLine voice, ending in a single Clear.
 * Not a row of dismissible chips — A2 bans pills, B23 keeps Badge
 * category-only and non-dismissible, and a growing wall of chips reflows
 * the form on every pick while a one-line statement holds its ground.
 */
export interface ComboOption {
  value: string;
  label: string;
  /** Mono metadata rendered right-aligned, e.g. an ID or count. */
  meta?: string;
  disabled?: boolean;
}

export interface ComboboxBase {
  label: string;
  options: ComboOption[];
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

export interface ComboboxSingle {
  multiple?: false;
  /** Controlled selected value. */
  value: string | null;
  onChange: (value: string | null, option: ComboOption | null) => void;
}

export interface ComboboxMulti {
  multiple: true;
  /** Controlled selection, in pick order. */
  value: string[];
  onChange: (values: string[], options: ComboOption[]) => void;
  /** Singular noun for the selection line: "status" → "3 STATUSES". */
  noun?: string;
}

/** A discriminated union: the two modes cannot be mixed by accident. */
export type ComboboxProps = ComboboxBase & (ComboboxSingle | ComboboxMulti);

/** Beyond three, the line names three and counts the rest. */
const NAMED_MAX = 3;
const NO_VALUES: string[] = [];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  const {
    label,
    options,
    hint,
    error,
    required,
    placeholder = 'Type to search',
    emptyText = 'No matching options.',
    disabled,
    id: explicitId,
    className,
  } = props;

  /* Narrow once, here: past this line the two modes never share a shape. */
  const multi = props.multiple === true ? props : null;
  const single = props.multiple === true ? null : props;

  const auto = useId();
  const id = explicitId ?? auto;
  const listId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const value = single ? single.value : null;
  const values = multi ? multi.value : NO_VALUES;

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);
  const chosen = useMemo(() => new Set(values), [values]);

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

  const isSelected = (v: string) => (multi ? chosen.has(v) : v === value);

  /* Input shows the selection when closed, the query while searching. A
     multi field shows nothing when closed: it never tries to hold three
     values, which is precisely what the selection line is for. */
  const display = open ? query : multi ? '' : (selected?.label ?? '');

  function openList(seed = '') {
    if (disabled) return;
    setQuery(seed);
    const idx = Math.max(
      0,
      filtered.findIndex((o) => isSelected(o.value)),
    );
    setActive(idx);
    setOpen(true);
  }

  function commit(option: ComboOption | null) {
    if (option?.disabled) return;
    single?.onChange(option ? option.value : null, option);
    setOpen(false);
    setQuery('');
    inputRef.current?.focus();
  }

  function emit(next: string[]) {
    const byValue = new Map(options.map((o) => [o.value, o]));
    multi?.onChange(
      next,
      next.map((v) => byValue.get(v)).filter((o): o is ComboOption => o !== undefined),
    );
  }

  /* Multi mode toggles and LEAVES THE LIST OPEN — closing after every
     pick is the single-select's job. The query survives the toggle too,
     so three matches of one search are taken without retyping it. */
  function toggle(option: ComboOption | null) {
    if (!option || option.disabled) return;
    emit(
      chosen.has(option.value)
        ? values.filter((v) => v !== option.value)
        : [...values, option.value],
    );
    inputRef.current?.focus();
  }

  function choose(option: ComboOption | null) {
    if (multi) toggle(option);
    else commit(option);
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
          choose(filtered[active] ?? null);
        }
        break;
      case 'Backspace':
        /* The standard affordance: Backspace on an empty query drops the
           value taken last. It costs nothing and everyone expects it. */
        if (multi && query === '' && values.length > 0) {
          e.preventDefault();
          emit(values.slice(0, -1));
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        } else if (multi ? values.length > 0 : selected) {
          /* Second Escape clears the selection — the pattern's clear path. */
          e.preventDefault();
          if (multi) emit([]);
          else commit(null);
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

  const noun = multi?.noun;
  const lead = noun
    ? `${values.length} ${values.length === 1 ? noun : `${noun}s`}`
    : `${values.length} selected`;
  const named = values.map((v) => options.find((o) => o.value === v)?.label ?? v);
  const overflow = named.length - NAMED_MAX;
  const stated = [
    lead.toUpperCase(),
    ...named.slice(0, NAMED_MAX),
    overflow > 0 ? `+${overflow} more` : null,
  ]
    .filter(Boolean)
    .join(' · ');

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
          /* Closed over a set, the placeholder would advertise an empty
             field. Nothing is the honest prompt — the line below states
             what is chosen. */
          placeholder={multi && !open && values.length > 0 ? undefined : placeholder}
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
          aria-multiselectable={multi ? true : undefined}
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
              aria-selected={isSelected(o.value)}
              aria-disabled={o.disabled || undefined}
              className={cx(
                'sv-combo__option',
                i === active && 'sv-combo__option--active',
                isSelected(o.value) && 'sv-combo__option--selected',
                o.disabled && 'sv-combo__option--disabled',
              )}
              onPointerMove={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault() /* keep input focus */}
              onClick={() => choose(o)}
            >
              <span className="sv-combo__optlabel">{o.label}</span>
              {o.meta && <span className="sv-combo__optmeta sv-mono">{o.meta}</span>}
              {isSelected(o.value) && (
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
      {/* The selection stated as one mono line in the B7 FilterLine voice:
          a selection is state, and 76° states state in a line with one
          clear, never in a row of dismissible chips. This line is also the
          only live region in the component — the options must stay silent,
          because two announcements for one toggle is a defect. */}
      {multi && values.length > 0 && (
        <div className="sv-combo__selection">
          <p className="sv-combo__selection-text sv-mono sv-num" aria-live="polite">
            {stated}
          </p>
          <button
            type="button"
            className="sv-btn sv-btn--link"
            aria-label={`Clear ${label}`}
            onClick={() => {
              emit([]);
              inputRef.current?.focus();
            }}
          >
            Clear
          </button>
        </div>
      )}
      {error && (
        <p className="sv-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
});

export type { ComboOption as ComboboxOption };
