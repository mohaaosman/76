import { useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
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
}

export interface CardTabsProps {
  tabs: CardTab[];
  active: string;
  onChange: (id: string) => void;
  mode?: 'tabs' | 'filters';
  /** Ties tabs to their panel: panel must carry id={`${idBase}-panel`}
      and aria-labelledby={`${idBase}-tab-${active}`} in tabs mode. */
  idBase?: string;
  className?: string;
}

export function CardTabs({ tabs, active, onChange, mode = 'tabs', idBase, className }: CardTabsProps) {
  const autoId = useId();
  const base = idBase ?? autoId;
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: KeyboardEvent) {
    if (mode !== 'tabs') return;
    const idx = tabs.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      onChange(tabs[next].id);
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button');
      buttons?.[next]?.focus();
    }
  }

  return (
    <div
      ref={listRef}
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
          onClick: () => onChange(tab.id),
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
}
