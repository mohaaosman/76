import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './drawer.css';

/**
 * B21 · Drawer — the slide-over. A paper panel entering from the screen
 * edge for detail-in-context work: inspect a row, edit a record, review
 * before commit — WITHOUT losing the sheet behind it. Built on native
 * <dialog>.showModal(): focus trap, Esc, ::backdrop, top layer for free.
 * Anything that replaces the whole task is a full-screen Dialog instead.
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Mono context line under the title, e.g. "ORD-2291 · 24 JUL". */
  context?: string;
  side?: 'right' | 'left';
  /** sm 360 · md 480 (default) · lg 640 · full — a mobile-style takeover. */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Footer actions, right-aligned: ghost cancel + ONE primary/danger. */
  footer?: ReactNode;
  /** Scrim click closes by default; disable for unsaved-work drawers. */
  dismissible?: boolean;
  children: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  context,
  side = 'right',
  size = 'md',
  footer,
  dismissible = true,
  children,
}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  function handleClick(e: MouseEvent<HTMLDialogElement>) {
    if (!dismissible) return;
    if (e.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      className={cx('sv-drawer', `sv-drawer--${side}`, `sv-drawer--${size}`)}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={handleClick}
      onClose={() => open && onClose()}
    >
      <div className="sv-drawer__panel">
        <header className="sv-drawer__head">
          <div className="sv-drawer__titles">
            <h2 className="sv-drawer__title" id={titleId}>
              {title}
            </h2>
            {context && <p className="sv-drawer__context sv-mono">{context}</p>}
          </div>
          <button
            type="button"
            className="sv-drawer__close"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div className="sv-drawer__body">{children}</div>
        {footer && <footer className="sv-drawer__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
