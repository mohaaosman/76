import { forwardRef, useId, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
import { inlineStep, useDirection } from '@/lib/i18n';
import './card-tabs.css';

/**
 * B8 · CardTabs — in-card filters that change content IN PLACE (unlike
 * BandSubTabs, which navigate). Two honest modes, never mixed:
 * - mode="tabs":    real tablist/tab/tabpanel with arrow keys (client panels)
 * - mode="filters": buttons with aria-pressed (server-side filtering)
 */
export interface CardTab {
  id: string;
  label: string;
  /** Optional mono count shown after the label. */
  count?: number;
  /** The tab or filter cannot be chosen; arrow keys step over it. */
  disabled?: boolean;
}

export interface CardTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: CardTab[];
  /** Controlled: the active id. When passed it wins over internal state. */
  active?: string;
  /** Uncontrolled: the id active on first render. Defaults to the first enabled tab. */
  defaultActive?: string;
  /** Called with the id the user chose — in both modes. */
  onChange?: (id: string) => void;
  mode?: 'tabs' | 'filters';
  /** Ties tabs to their panel: panel must carry id={`${idBase}-panel`}
      and aria-labelledby={`${idBase}-tab-${active}`} in tabs mode. */
  idBase?: string;
  className?: string;
}

export const CardTabs = forwardRef<HTMLDivElement, CardTabsProps>(function CardTabs(
  { tabs, active: activeProp, defaultActive, onChange, mode = 'tabs', idBase, className, onKeyDown: onKeyDownProp, ...rest },
  ref,
) {
  const dir = useDirection();
  const autoId = useId();
  const base = idBase ?? autoId;
  const listRef = useRef<HTMLDivElement | null>(null);
  const [own, setOwn] = useState(() => defaultActive ?? tabs.find((t) => !t.disabled)?.id ?? '');
  const active = activeProp ?? own;

  function choose(id: string) {
    if (activeProp === undefined) setOwn(id);
    onChange?.(id);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    onKeyDownProp?.(e);
    if (e.defaultPrevented || mode !== 'tabs') return;
    const idx = tabs.findIndex((t) => t.id === active);
    const n = tabs.length;
    /* Walks from `from` in `step` direction to the next enabled tab. */
    const seek = (from: number, step: number) => {
      for (let k = 0, i = from; k < n; k++, i = (i + step + n) % n) if (!tabs[i].disabled) return i;
      return -1;
    };
    let next = -1;
    /* ← and → follow the reading direction: in RTL the next tab is to the left. */
    const step = inlineStep(e.key, dir);
    if (step !== 0) next = seek((idx + step + n) % n, step);
    if (e.key === 'Home') next = seek(0, 1);
    if (e.key === 'End') next = seek(n - 1, -1);
    if (next >= 0) {
      e.preventDefault();
      choose(tabs[next].id);
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button');
      buttons?.[next]?.focus();
    }
  }

  return (
    <div
      {...rest}
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx('sv-cardtabs', className)}
      role={mode === 'tabs' ? 'tablist' : undefined}
      onKeyDown={onKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        /* `key` is passed explicitly below, never through this spread —
           React 19 does not read a key out of spread props. */
        const shared = {
          className: cx('sv-cardtabs__tab', isActive && 'sv-cardtabs__tab--active'),
          disabled: tab.disabled,
          onClick: () => choose(tab.id),
          children: (
            <>
              {tab.label}
              {tab.count !== undefined && (
                <span className="sv-cardtabs__count sv-mono sv-num">{tab.count}</span>
              )}
            </>
          ),
        };
        return mode === 'tabs' ? (
          <button
            key={tab.id}
            type="button"
            {...shared}
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${base}-panel`}
            tabIndex={isActive ? 0 : -1}
          />
        ) : (
          <button key={tab.id} type="button" {...shared} aria-pressed={isActive} />
        );
      })}
    </div>
  );
});
