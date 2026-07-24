import { useEffect, useId, useRef } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { cx } from '@/lib/cx';
import './dialog.css';

/**
 * B13 · Dialog — built on the native <dialog> element (showModal gives us
 * focus trapping, Esc, ::backdrop and top-layer for free). Paper card on a
 * flat scrim, no blur. Footer: ghost cancel + ONE primary/danger.
 */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** default 480 · wide 640 (forms) · full — a full-screen takeover for
      tasks that replace the page (composers, pickers, review flows).
      Full-screen dialogs get a visible close button and never dismiss
      on scrim click (there is no scrim to click). */
  size?: 'default' | 'wide' | 'full';
  /** @deprecated Use size="wide". Kept for 0.1.x call sites. */
  wide?: boolean;
  /** Destructive confirms: scrim click does not close, Esc still does
      unless the confirm is mid-flight (disable via preventEscape). */
  destructive?: boolean;
  preventEscape?: boolean;
  children: ReactNode;
  /** Footer actions, right-aligned. Ghost cancel + one primary/danger. */
  footer?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  size,
  wide = false,
  destructive = false,
  preventEscape = false,
  children,
  footer,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const resolved = size ?? (wide ? 'wide' : 'default');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  function handleCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
    if (preventEscape) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    onClose();
  }

  /* Scrim click closes non-destructive, non-full dialogs only. */
  function handleClick(e: MouseEvent<HTMLDialogElement>) {
    if (destructive || resolved === 'full') return;
    if (e.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      className={cx(
        'sv-dialog',
        resolved === 'wide' && 'sv-dialog--wide',
        resolved === 'full' && 'sv-dialog--full',
      )}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
      onClose={() => open && onClose()}
    >
      <div className="sv-dialog__panel">
        <header className="sv-dialog__head">
          <h2 className="sv-dialog__title" id={titleId}>
            {title}
          </h2>
          {resolved === 'full' && (
            <button
              type="button"
              className="sv-dialog__close"
              aria-label={`Close ${title}`}
              onClick={onClose}
            >
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </header>
        <div className="sv-dialog__body">{children}</div>
        {footer && <footer className="sv-dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
