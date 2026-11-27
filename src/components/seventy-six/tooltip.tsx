import { cloneElement, useId, useRef } from 'react';
import type { FocusEvent, KeyboardEvent, MouseEvent, ReactElement, Ref, RefObject } from 'react';
import { cx } from '@/lib/cx';
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
  /** Suppresses the tooltip entirely; the trigger renders untouched. */
  disabled?: boolean;
  /** Applied to the tooltip bubble (the trigger keeps its own className). */
  className?: string;
  /** Explicit id for the bubble; defaults to a generated one. */
  id?: string;
}

type Handler<E> = ((e: E) => void) | undefined;

export function Tooltip({ content, children, delay = 300, disabled = false, className, id: explicitId }: TooltipProps) {
  const autoId = useId();
  const id = explicitId ?? autoId;
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

  if (disabled) return children;

  /* The child's own props are MERGED, never replaced: its describedby, its
     ref and its handlers all keep working beside the tooltip's. */
  const own = children.props as {
    'aria-describedby'?: string;
    ref?: Ref<HTMLElement>;
    onMouseEnter?: Handler<MouseEvent<HTMLElement>>;
    onMouseLeave?: Handler<MouseEvent<HTMLElement>>;
    onFocus?: Handler<FocusEvent<HTMLElement>>;
    onBlur?: Handler<FocusEvent<HTMLElement>>;
    onKeyDown?: Handler<KeyboardEvent<HTMLElement>>;
  };
  const trigger = cloneElement(children, {
    'aria-describedby': [own['aria-describedby'], id].filter(Boolean).join(' '),
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const childRef = own.ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef) childRef.current = node;
    },
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      own.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      own.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      own.onFocus?.(e);
      showNow();
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      own.onBlur?.(e);
      hide();
    },
    /* WCAG 1.4.13: a tooltip can be dismissed without moving focus. */
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      own.onKeyDown?.(e);
      if (e.key === 'Escape') hide();
    },
  });

  return (
    <>
      {trigger}
      <div ref={tipRef} id={id} className={cx('sv-tooltip', className)} popover="manual" role="tooltip">
        {content}
      </div>
    </>
  );
}
