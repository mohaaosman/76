import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { DialogHTMLAttributes, KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import './search-command.css';

/**
 * B16 · SearchCommand (⌘K) — the keyboard front door every 76° app ships.
 * Dialog-anatomy palette: mono input, grouped results, ↑/↓ + Enter, Esc.
 */
export interface CommandItem {
  id: string;
  group: string;
  label: string;
  /** Mono hint on the right, e.g. an ID or shortcut. */
  hint?: string;
  keywords?: string;
  /** Listed but not pickable: arrow keys skip it and a click does nothing. */
  disabled?: boolean;
}

export interface SearchCommandProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'children'> {
  items: CommandItem[];
  onPick: (item: CommandItem) => void;
  placeholder?: string;
  /** Bind ⌘K/Ctrl-K globally (default true). */
  bindShortcut?: boolean;
  /**
   * Called when the shortcut opens the palette. Pass the same setter that
   * drives `open` — without it the shortcut opens the dialog imperatively
   * and `open` stays false, so the next onClose() has nothing to close.
   */
  onOpen?: () => void;
}

export function useSearchCommand() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false) };
}

export const SearchCommand = forwardRef<HTMLDialogElement, SearchCommandProps & { open: boolean; onClose: () => void }>(function SearchCommand({
  open,
  onClose,
  items,
  onPick,
  placeholder: placeholderProp,
  bindShortcut = true,
  onOpen,
  className,
  onCancel,
  onClick,
  ...rest
}, forwarded) {
  const tr = useStrings();
  const placeholder = placeholderProp ?? tr.searchEllipsis;
  /* Per-instance ids: two palettes on one page used to share one listbox id. */
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (id: string) => `${uid}-opt-${id}`;
  const ref = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!bindShortcut) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (ref.current?.open) onClose();
        else if (onOpen) onOpen();
        else ref.current?.showModal();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bindShortcut, onClose, onOpen]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      setQuery('');
      setActiveIdx(0);
      inputRef.current?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hits = q
      ? items.filter((i) => `${i.label} ${i.group} ${i.keywords ?? ''}`.toLowerCase().includes(q))
      : items;
    return hits.slice(0, 12);
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of results) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return [...map.entries()];
  }, [results]);

  /* Steps from `from` toward `dir` to the nearest enabled result; stays put at the edge. */
  function stepTo(from: number, dir: number) {
    for (let i = from + dir; i >= 0 && i < results.length; i += dir) if (!results[i].disabled) return i;
    return from;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => stepTo(i, 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => stepTo(i, -1));
    }
    if (e.key === 'Enter' && results[activeIdx] && !results[activeIdx].disabled) {
      e.preventDefault();
      onPick(results[activeIdx]);
      onClose();
    }
  }

  let flatIdx = -1;

  return (
    <dialog
      {...rest}
      ref={(node) => {
        ref.current = node;
        if (typeof forwarded === 'function') forwarded(node);
        else if (forwarded) forwarded.current = node;
      }}
      className={cx('sv-command', className)}
      aria-label={rest['aria-label'] ?? tr.search}
      onCancel={(e) => {
        onCancel?.(e);
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="sv-command__panel" onKeyDown={onKeyDown}>
        <input
          ref={inputRef}
          className="sv-command__input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[activeIdx] ? optionId(results[activeIdx].id) : undefined}
          placeholder={placeholder}
          aria-label={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
          }}
        />
        <ul className="sv-command__list" id={listId} role="listbox" aria-label={tr.results}>
          {groups.map(([group, groupItems]) => (
            <li key={group}>
              <p className="sv-command__group sv-mono">{group}</p>
              <ul role="presentation">
                {groupItems.map((item) => {
                  flatIdx += 1;
                  const idx = flatIdx;
                  return (
                    <li
                      key={item.id}
                      id={optionId(item.id)}
                      role="option"
                      aria-selected={idx === activeIdx}
                      aria-disabled={item.disabled || undefined}
                      className={cx('sv-command__item', idx === activeIdx && 'sv-command__item--active')}
                      onMouseEnter={() => !item.disabled && setActiveIdx(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (item.disabled) return;
                        onPick(item);
                        onClose();
                      }}
                    >
                      <span>{item.label}</span>
                      {item.hint && <span className="sv-command__hint sv-mono">{item.hint}</span>}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
          {results.length === 0 && (
            <li className="sv-command__none">No results for “{query}”. Try a component or page name.</li>
          )}
        </ul>
      </div>
    </dialog>
  );
});
