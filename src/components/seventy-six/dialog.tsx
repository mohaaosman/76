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
  /** Forms get 640px; everything else 480px. */
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
  wide = false,
  destructive = false,
  preventEscape = false,
  children,
  footer,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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

  /* Scrim click closes non-destructive dialogs only. */
  function handleClick(e: MouseEvent<HTMLDialogElement>) {
    if (destructive) return;
    if (e.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      className={cx('sv-dialog', wide && 'sv-dialog--wide')}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
      onClose={() => open && onClose()}
    >
      <div className="sv-dialog__panel">
        <h2 className="sv-dialog__title" id={titleId}>
          {title}
        </h2>
        <div className="sv-dialog__body">{children}</div>
        {footer && <footer className="sv-dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
