import { useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './tabs.css';

/**
 * B38 · Tabs — the sheet's content switch. One job: change WHICH SET OF
 * CARDS the sheet shows, without touching the URL. Three components look
 * alike and are not interchangeable: BandSubTabs (B1) NAVIGATE — they are
 * links, they change the URL, they live on the band; CardTabs (B8) FILTER
 * ONE CARD'S CONTENT in place and live on that card's hairline; Tabs (B38)
 * SWITCH A WHOLE CONTENT REGION OF THE SHEET and live on the wall, directly
 * above the region they switch. Pick by what changes, not by what it looks
 * like.
 *
 * There is no `filters` mode here — aria-pressed buttons are B8's job, and
 * a tablist that sometimes is not a tablist is a defect. If the switch is
 * addressable state a user should be able to link to or reload into, it is
 * navigation and belongs on the band.
 */
export interface Tab {
  id: string;
  label: string;
  /** Optional mono tabular count shown after the label. */
  count?: number;
}

export interface TabsProps {
  /** Cap: five. A sixth section is a band nav item, not a tab. */
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  /** Ties each tab to its OWN panel: `${idBase}-tab-${id}` / `${idBase}-panel-${id}`.
      Pass it explicitly whenever TabPanel is used — TabPanel requires the same base. */
  idBase?: string;
  /** Accessible name for the tablist, e.g. "Report sections". */
  label: string;
  className?: string;
}

export function Tabs({ tabs, active, onChange, idBase, label, className }: TabsProps) {
  const autoId = useId();
  const base = idBase ?? autoId;
  const listRef = useRef<HTMLDivElement>(null);

  /* Automatic activation: arrowing moves focus AND switches the region.
     The panels are already mounted client-side, so there is nothing to
     wait for and no reason to make the user press Enter twice. */
  function onKeyDown(e: KeyboardEvent) {
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
      className={cx('sv-tabs', className)}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            className={cx('sv-tabs__tab', isActive && 'sv-tabs__tab--active')}
            aria-selected={isActive}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="sv-tabs__count sv-mono sv-num">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  idBase: string;
  tabId: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Every tab owns its OWN panel — unlike B8, where one panel serves the whole
 * card and each tab points at the same id. Render one TabPanel per Tab, all
 * of them, and let `hidden` decide: the id contract only holds if the panel
 * the active tab names is in the document.
 */
export function TabPanel({ idBase, tabId, active, children, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${tabId}`}
      aria-labelledby={`${idBase}-tab-${tabId}`}
      hidden={!active}
      /* A panel of cards holds no focusable content of its own, so it takes
         tabIndex 0 — otherwise the tab key steps straight past the region
         the tabs just switched to. */
      tabIndex={0}
      className={cx('sv-tabs__panel', className)}
    >
      {children}
    </div>
  );
}
