import { forwardRef, useId, useState } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import { Button } from './button';
import type { ButtonVariant } from './button';
import { usePopoverAnchor } from './popover';
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
  const tr = useStrings();
  const actionable = items.filter((i): i is MenuItemSpec => i !== 'separator' && !i.disabled);

  function focusItem(delta: number) {
    const nodes = panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:enabled');
    if (!nodes || nodes.length === 0) return;
    const list = Array.from(nodes);
    const current = list.indexOf(document.activeElement as HTMLButtonElement);
    /* Home / End pass ±Infinity: jump to the edge. Arithmetic on Infinity
       gave NaN, so Home and End used to do nothing once an item had focus. */
    const next = !Number.isFinite(delta)
      ? delta > 0
        ? list.length - 1
        : 0
      : current === -1
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
        focusItem(Number.NEGATIVE_INFINITY);
        break;
      case 'End':
        e.preventDefault();
        focusItem(Number.POSITIVE_INFINITY);
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
          /* <hr> is already a separator to assistive tech — no role needed. */
          <hr key={`sep-${sep++}`} className="sv-menu__sep" />
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
      {actionable.length === 0 && <p className="sv-menu__empty">{tr.noActions}</p>}
    </div>
  );
}

/* An opened menu puts focus on its first verb. B42's anchor hook only
   places the panel and returns focus on close — knowing what to focus is
   this component's business, not the primitive's. */
function focusFirstItem(open: boolean, panel: HTMLDivElement) {
  if (open) panel.querySelector<HTMLButtonElement>('[role="menuitem"]:enabled')?.focus();
}

/* ---------- MenuButton — a button whose job is opening the menu ---------- */

export interface MenuButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'popoverTarget' | 'popoverTargetAction' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup'
  > {
  label: string;
  items: MenuItem[];
  variant?: ButtonVariant;
  align?: 'start' | 'end';
  disabled?: boolean;
  className?: string;
  /** Called whenever the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton({
  label,
  items,
  variant = 'ghost',
  align = 'start',
  disabled,
  className,
  onOpenChange,
  id: explicitId,
  ...rest
}, forwarded) {
  const id = useId();
  const menuId = `${id}-menu`;
  const btnId = explicitId ?? `${id}-btn`;
  const [open, setOpen] = useState(false);
  const { triggerRef, panelRef } = usePopoverAnchor(align, (isOpen, panel) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
    focusFirstItem(isOpen, panel);
  });

  return (
    <>
      <Button
        {...rest}
        id={btnId}
        ref={(node) => {
          triggerRef.current = node;
          if (typeof forwarded === 'function') forwarded(node);
          else if (forwarded) forwarded.current = node;
        }}
        variant={variant}
        disabled={disabled}
        className={className}
        aria-expanded={open}
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
});

/* ---------- SplitButton — one primary action + related actions ---------- */

export interface SplitButtonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onClick' | 'children'> {
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
export const SplitButton = forwardRef<HTMLSpanElement, SplitButtonProps>(function SplitButton({
  label,
  onClick,
  items,
  variant = 'primary',
  menuLabel: menuLabelProp,
  isLoading,
  loadingLabel,
  disabled,
  className,
  ...rest
}, ref) {
  const tr = useStrings();
  const menuLabel = menuLabelProp ?? tr.moreWaysTo(label);
  const id = useId();
  const menuId = `${id}-menu`;
  const btnId = `${id}-btn`;
  const [open, setOpen] = useState(false);
  const { triggerRef, panelRef } = usePopoverAnchor('end', (isOpen, panel) => {
    setOpen(isOpen);
    focusFirstItem(isOpen, panel);
  });

  return (
    <span {...rest} ref={ref} className={cx('sv-splitbtn', className)}>
      <Button
        id={btnId}
        variant={variant}
        onClick={onClick}
        isLoading={isLoading}
        loadingLabel={loadingLabel}
        disabled={disabled}
        className="sv-splitbtn__main"
      >
        {label}
      </Button>
      <Button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        variant={variant}
        disabled={disabled || isLoading}
        className="sv-splitbtn__toggle"
        aria-label={menuLabel}
        aria-expanded={open}
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
});
