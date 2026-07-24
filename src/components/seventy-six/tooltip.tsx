import { cloneElement, useId, useRef } from 'react';
import type { ReactElement, RefObject } from 'react';
import './tooltip.css';

/**
 * B18 · Tooltip — built on the native popover attribute (top layer, no
 * z-index wars). Supplementary info only — never the sole carrier of a
 * label. 300ms delay; keyboard-focusable triggers show it on focus.
 */
export interface TooltipProps {
  /** The tooltip text. Supplementary — the trigger keeps its own label. */
  content: string;
  /** A single focusable element (button, a). Receives describedby. */
  children: ReactElement<Record<string, unknown>>;
  delay?: number;
}

export function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  const id = useId();
  const tipRef: RefObject<HTMLDivElement | null> = useRef(null);
  const triggerRef: RefObject<HTMLElement | null> = useRef(null);
  const timer = useRef<number>(0);

  function place() {
    const tip = tipRef.current;
    const trigger = triggerRef.current;
    if (!tip || !trigger) return;
    tip.showPopover();
    const t = trigger.getBoundingClientRect();
    const r = tip.getBoundingClientRect();
    const left = Math.max(8, Math.min(t.left + t.width / 2 - r.width / 2, window.innerWidth - r.width - 8));
    const top = t.top - r.height - 6 < 8 ? t.bottom + 6 : t.top - r.height - 6;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }

  function show() {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(place, delay);
  }

  function showNow() {
    window.clearTimeout(timer.current);
    place();
  }

  function hide() {
    window.clearTimeout(timer.current);
    tipRef.current?.hidePopover();
  }

  const trigger = cloneElement(children, {
    'aria-describedby': id,
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    },
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: showNow,
    onBlur: hide,
  });

  return (
    <>
      {trigger}
      <div ref={tipRef} id={id} className="sv-tooltip" popover="manual" role="tooltip">
        {content}
      </div>
    </>
  );
}
