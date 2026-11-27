import { forwardRef, useEffect, useId, useRef } from 'react';
import type { DialogHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import './drawer.css';

/**
 * B21 · Drawer — the slide-over. A paper panel entering from the screen
 * edge for detail-in-context work: inspect a row, edit a record, review
 * before commit — WITHOUT losing the sheet behind it. Built on native
 * <dialog>.showModal(): focus trap, Esc, ::backdrop, top layer for free.
 * Anything that replaces the whole task is a full-screen Dialog instead.
 */
export interface DrawerProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'onClose' | 'title' | 'children'> {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Mono context line under the title, e.g. "ORD-2291 · 24 JUL". */
  context?: string;
  /**
   * `end` (default) and `start` follow the reading direction — the right
   * and left edges in English, mirrored in Arabic. `right` / `left` are
   * physical and stay for callers that mean a fixed edge.
   */
  side?: 'end' | 'start' | 'right' | 'left';
  /** sm 360 · md 480 (default) · lg 640 · full — a mobile-style takeover. */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Footer actions, right-aligned: ghost cancel + ONE primary/danger. */
  footer?: ReactNode;
  /** Scrim click closes by default; disable for unsaved-work drawers. */
  dismissible?: boolean;
  /**
   * v0.11 · Escape stays put too. For a drawer holding unsaved work whose
   * footer offers an explicit "Discard changes" — the same prop B13 has.
   * The visible close control still works, so the reader is never trapped.
   */
  preventEscape?: boolean;
  children: ReactNode;
}

export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer({
  open,
  onClose,
  title,
  context,
  side = 'end',
  size = 'md',
  footer,
  dismissible = true,
  preventEscape = false,
  children,
  className,
  onCancel,
  onClick,
  ...rest
}, forwarded) {
  const tr = useStrings();
  const ref = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  function handleClick(e: MouseEvent<HTMLDialogElement>) {
    onClick?.(e);
    if (!dismissible) return;
    if (e.target === ref.current) onClose();
  }

  return (
    <dialog
      {...rest}
      ref={(node) => {
        ref.current = node;
        if (typeof forwarded === 'function') forwarded(node);
        else if (forwarded) forwarded.current = node;
      }}
      className={cx('sv-drawer', `sv-drawer--${side}`, `sv-drawer--${size}`, className)}
      aria-labelledby={titleId}
      onCancel={(e) => {
        onCancel?.(e);
        e.preventDefault();
        if (!preventEscape) onClose();
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
            aria-label={tr.close(title)}
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
});
