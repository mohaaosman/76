import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
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
}

export interface SearchCommandProps {
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

export function SearchCommand({
  open,
  onClose,
  items,
  onPick,
  placeholder = 'Search…',
  bindShortcut = true,
  onOpen,
}: SearchCommandProps & { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
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

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault();
      onPick(results[activeIdx]);
      onClose();
    }
  }

  let flatIdx = -1;

  return (
    <dialog
      ref={ref}
      className="sv-command"
      aria-label="Search"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
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
          aria-controls="sv-command-list"
          aria-activedescendant={results[activeIdx] ? `sv-cmd-${results[activeIdx].id}` : undefined}
          placeholder={placeholder}
          aria-label={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
          }}
        />
        <ul className="sv-command__list" id="sv-command-list" role="listbox" aria-label="Results">
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
                      id={`sv-cmd-${item.id}`}
                      role="option"
                      aria-selected={idx === activeIdx}
                      className={cx('sv-command__item', idx === activeIdx && 'sv-command__item--active')}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
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
}
