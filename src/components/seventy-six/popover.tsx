import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from './button';
import './popover.css';

/**
 * B42 · Popover — a small non-modal panel holding SECONDARY content beside
 * the control that asked for it: a column chooser, a saved-view picker, a
 * short explanation with a link. It earns its place only at the boundaries
 * of four neighbours. B18 Tooltip is a phrase with no interactive content,
 * on hover or focus. B20 Menu is a list of VERBS with role="menu" and one
 * keyboard model. B21 Drawer is a workspace beside the work, full height.
 * B13 Dialog interrupts for ONE decision, modally. The Popover is what is
 * left: a few controls, parked next to their trigger, dismissible by
 * looking away. Built on the native popover attribute — the browser gives
 * the top layer, light dismiss and Esc, so the panel needs no z-index.
 */

/* Position the panel under its trigger: the top layer does not anchor
   itself until CSS anchor positioning is baseline everywhere 76° ships.
   Shared with B20 Menu — Popover is the primitive, Menu stands on it, and
   the hook knows nothing about either one's contents. */
export function usePopoverAnchor(
  align: 'start' | 'end',
  /** Runs after placement on open and before focus return on close. */
  onToggle?: (open: boolean, panel: HTMLDivElement) => void,
) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  /* Held in a ref so a caller's inline closure cannot re-bind the listener
     on every render. */
  const toggleRef = useRef(onToggle);
  toggleRef.current = onToggle;

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const r = trigger.getBoundingClientRect();
    const w = panel.offsetWidth;
    const x = align === 'end' ? r.right - w : r.left;
    panel.style.top = `${Math.round(r.bottom + 4)}px`;
    panel.style.left = `${Math.round(Math.min(Math.max(8, x), window.innerWidth - w - 8))}px`;
  }, [align]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    function onNativeToggle(e: Event) {
      const isOpen = (e as ToggleEvent).newState === 'open';
      if (isOpen) place();
      if (panel) toggleRef.current?.(isOpen, panel);
      if (isOpen) return;
      /* Return focus to the trigger ONLY if the panel still holds it. When
         the panel closed because focus already left it — a Tab out of a
         non-modal popover — stealing it back would undo the user's move. */
      const active = document.activeElement;
      if (!active || active === document.body || panel?.contains(active)) {
        (triggerRef.current as HTMLButtonElement | null)?.focus();
      }
    }
    panel.addEventListener('toggle', onNativeToggle);
    window.addEventListener('resize', place);
    return () => {
      panel.removeEventListener('toggle', onNativeToggle);
      window.removeEventListener('resize', place);
    };
  }, [place]);

  return { triggerRef, panelRef };
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/** A titled panel is labelled by its title; an untitled one MUST carry a name. */
type PopoverLabel = { title: string; ariaLabel?: never } | { title?: never; ariaLabel: string };

export type PopoverProps = PopoverLabel & {
  /** The trigger's visible text. Names what the panel holds. */
  label: string;
  variant?: 'ghost' | 'primary' | 'link';
  align?: 'start' | 'end';
  disabled?: boolean;
  children: ReactNode;
  /** Applied to the trigger — the panel is top-layer and owns its own box. */
  className?: string;
};

/**
 * The component owns its trigger, exactly like MenuButton, so aria-expanded
 * and aria-controls cannot drift from the panel's real state.
 *
 * Never the only path to an action (C4) — whatever lives here also lives
 * somewhere a keyboard and a screen reader reach without it. Never
 * navigation: links between places belong in the Band. Never nested inside
 * another popover. Never an error — an error goes inline at its source, in
 * a B22 Banner. Wider than 320px is not a Popover, it is a Drawer.
 */
export function Popover({
  label,
  title,
  ariaLabel,
  variant = 'ghost',
  align = 'start',
  disabled,
  children,
  className,
}: PopoverProps) {
  const id = useId();
  const panelId = `${id}-panel`;
  const btnId = `${id}-btn`;
  const titleId = `${id}-title`;
  const [open, setOpen] = useState(false);
  /* The browser owns the open state, so aria-expanded is read off the
     panel's own toggle event rather than guessed alongside it. */
  const { triggerRef, panelRef } = usePopoverAnchor(align, (isOpen, panel) => {
    setOpen(isOpen);
    if (isOpen) (panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();
  });

  /* Non-modal means focus is never trapped, and a panel left open behind
     the focus ring is a panel nobody can see they are outside of. Tabbing
     past the last control closes it; native light dismiss only covers
     Esc and an outside pointer. */
  function onFocusOut(e: React.FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (next && (panelRef.current?.contains(next) || triggerRef.current?.contains(next))) return;
    panelRef.current?.hidePopover();
  }

  return (
    <>
      <Button
        id={btnId}
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        variant={variant}
        disabled={disabled}
        className={className}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-expanded={open}
        popoverTarget={panelId}
      >
        {label}
      </Button>
      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        role="dialog"
        tabIndex={-1}
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        className="sv-popover"
        onBlur={onFocusOut}
      >
        {title && (
          <div className="sv-popover__head">
            <h2 className="sv-popover__title" id={titleId}>
              {title}
            </h2>
            <button
              type="button"
              className="sv-btn sv-btn--link"
              aria-label={`Close ${title ?? label}`}
              onClick={() => panelRef.current?.hidePopover()}
            >
              Close
            </button>
          </div>
        )}
        <div className="sv-popover__body">{children}</div>
      </div>
    </>
  );
}
