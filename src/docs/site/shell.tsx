import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Band, BandTopbar, BandNav, BandSubTabs } from '@/components/seventy-six';
import type { BandNavItem } from '@/components/seventy-six';
import { categories } from '../content';

/**
 * The docs site shell IS a 76° screen: ink band, horizontal nav,
 * paper on the platinum wall. No sidebar — the Book forbids it.
 * Pages render their own PageHero inside <HeroBand> so the band reads
 * as one continuous ink zone.
 */
export function Shell({ onSearch }: { onSearch: () => void }) {
  const { pathname } = useLocation();

  const nav: BandNavItem[] = [
    { label: 'Introduction', href: '/', active: pathname === '/' },
    { label: 'Foundations', href: '/foundations', active: pathname === '/foundations' },
    { label: 'Components', href: '/components', active: pathname.startsWith('/components') },
    { label: 'AI-ready', href: '/ai', active: pathname === '/ai' },
  ];

  const subtabs: BandNavItem[] = pathname.startsWith('/components')
    ? [
        { label: 'ALL', href: '/components', active: pathname === '/components' },
        ...categories.map((c) => ({
          label: c.label.toUpperCase(),
          href: `/components?cat=${c.id}`,
          active: pathname === '/components' ? false : false,
        })),
      ]
    : [];

  const renderLink = (item: BandNavItem, className: string, ariaCurrent?: 'page') => (
    <Link to={item.href} className={className} aria-current={ariaCurrent}>
      {item.label}
    </Link>
  );

  return (
    <>
      <a className="sv-skip" href="#sv-content">
        Skip to content
      </a>
      <Band>
        <BandTopbar
          app="Design System"
          nav={<BandNav items={nav} renderLink={renderLink} />}
          utilities={
            <button type="button" className="site-search sv-mono" onClick={onSearch}>
              SEARCH <kbd className="site-kbd">⌘K</kbd>
            </button>
          }
        />
        <BandSubTabs items={subtabs} renderLink={renderLink} />
      </Band>
      <Outlet />
    </>
  );
}

/** The hero's slice of the ink band — pages place PageHero inside it. */
export function HeroBand({ children }: { children: ReactNode }) {
  return <div className="sv-band">{children}</div>;
}
