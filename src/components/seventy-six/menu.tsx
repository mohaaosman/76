import { useCallback, useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Button } from './button';
import type { ButtonVariant } from './button';
import './menu.css';

/**
 * B20 · Menu — a dropdown of ACTIONS (never navigation, never selection —
 * selection is a Select or Combobox). Built on the native popover
 * attribute: top layer, light dismiss, and Esc come from the browser.
 * Items are verbs that name their object, exactly like buttons.
 */
export interface MenuItemSpec {
  label: string;
  onSelect: () => void;
  /** 16px stroke icon before the label. */
  icon?: ReactNode;
  /** Mono metadata after the label, e.g. a shortcut. */
  meta?: string;
  /** Destructive tone: --sv-bad text. Confirm destructive work in a Dialog. */
  danger?: boolean;
  disabled?: boolean;
}

export type MenuItem = MenuItemSpec | 'separator';

interface MenuPanelProps {
  id: string;
  items: MenuItem[];
  labelledBy: string;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  align: 'start' | 'end';
}

function MenuPanel({ id, items, labelledBy, onClose, panelRef, align }: MenuPanelProps) {
  const actionable = items.filter((i): i is MenuItemSpec => i !== 'separator' && !i.disabled);

  function focusItem(delta: number) {
    const nodes = panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:enabled');
    if (!nodes || nodes.length === 0) return;
    const list = Array.from(nodes);
    const current = list.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      current === -1
        ? delta > 0
          ? 0
          : list.length - 1
        : (current + delta + list.length) % list.length;
    list[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(-1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(Number.NEGATIVE_INFINITY as unknown as number);
        break;
      case 'End':
        e.preventDefault();
        focusItem(Number.POSITIVE_INFINITY as unknown as number);
        break;
      case 'Tab':
        onClose();
        break;
    }
  }

  let sep = 0;
  return (
    <div
      ref={panelRef}
      id={id}
      popover="auto"
      role="menu"
      aria-labelledby={labelledBy}
      className={cx('sv-menu', align === 'end' && 'sv-menu--end')}
      onKeyDown={onKeyDown}
    >
      {items.map((item) =>
        item === 'separator' ? (
          <hr key={`sep-${sep++}`} className="sv-menu__sep" role="separator" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            className={cx('sv-menu__item', item.danger && 'sv-menu__item--danger')}
            disabled={item.disabled}
            onClick={() => {
              onClose();
              item.onSelect();
            }}
          >
            {item.icon && (
              <span className="sv-menu__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="sv-menu__label">{item.label}</span>
            {item.meta && <span className="sv-menu__meta sv-mono">{item.meta}</span>}
          </button>
        ),
      )}
      {actionable.length === 0 && <p className="sv-menu__empty">No actions available.</p>}
    </div>
  );
}

/* Position the popover under its trigger (popovers are top-layer and do
   not anchor themselves without CSS anchor positioning). */
function usePopoverAnchor(align: 'start' | 'end') {
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

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
    function onToggle(e: Event) {
      if ((e as ToggleEvent).newState === 'open') {
        place();
        panel?.querySelector<HTMLButtonElement>('[role="menuitem"]:enabled')?.focus();
      } else {
        (triggerRef.current as HTMLButtonElement | null)?.focus();
      }
    }
    panel.addEventListener('toggle', onToggle);
    window.addEventListener('resize', place);
    return () => {
      panel.removeEventListener('toggle', onToggle);
      window.removeEventListener('resize', place);
    };
  }, [place]);

  return { triggerRef, panelRef };
}

/* ---------- MenuButton — a button whose job is opening the menu ---------- */

export interface MenuButtonProps {
  label: string;
  items: MenuItem[];
  variant?: ButtonVariant;
  align?: 'start' | 'end';
  disabled?: boolean;
  className?: string;
}

export function MenuButton({
  label,
  items,
  variant = 'ghost',
  align = 'start',
  disabled,
  className,
}: MenuButtonProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const btnId = `${id}-btn`;
  const { triggerRef, panelRef } = usePopoverAnchor(align);

  return (
    <>
      <Button
        id={btnId}
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        variant={variant}
        disabled={disabled}
        className={className}
        aria-haspopup="menu"
        aria-controls={menuId}
        popoverTarget={menuId}
      >
        {label}
        <span className="sv-menubtn__chevron" aria-hidden="true" />
      </Button>
      <MenuPanel
        id={menuId}
        items={items}
        labelledBy={btnId}
        align={align}
        panelRef={panelRef}
        onClose={() => panelRef.current?.hidePopover()}
      />
    </>
  );
}

/* ---------- SplitButton — one primary action + related actions ---------- */

export interface SplitButtonProps {
  /** The primary action's label — names its object ("Create order"). */
  label: string;
  onClick: () => void;
  /** The related actions behind the chevron. */
  items: MenuItem[];
  variant?: Extract<ButtonVariant, 'primary' | 'ghost'>;
  /** Accessible name for the chevron trigger. */
  menuLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * The split button carries ONE primary verb; the chevron opens variants
 * of the same job ("Create order" / "Create draft order"). Unrelated
 * actions belong in their own controls, not behind the chevron.
 */
export function SplitButton({
  label,
  onClick,
  items,
  variant = 'primary',
  menuLabel = 'More ways to ' + label.toLowerCase(),
  isLoading,
  loadingLabel,
  disabled,
  className,
}: SplitButtonProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const btnId = `${id}-btn`;
  const { triggerRef, panelRef } = usePopoverAnchor('end');

  return (
    <span className={cx('sv-split', className)}>
      <Button
        id={btnId}
        variant={variant}
        onClick={onClick}
        isLoading={isLoading}
        loadingLabel={loadingLabel}
        disabled={disabled}
        className="sv-split__main"
      >
        {label}
      </Button>
      <Button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        variant={variant}
        disabled={disabled || isLoading}
        className="sv-split__toggle"
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-controls={menuId}
        popoverTarget={menuId}
      >
        <span className="sv-menubtn__chevron" aria-hidden="true" />
      </Button>
      <MenuPanel
        id={menuId}
        items={items}
        labelledBy={btnId}
        align="end"
        panelRef={panelRef}
        onClose={() => panelRef.current?.hidePopover()}
      />
    </span>
  );
}
