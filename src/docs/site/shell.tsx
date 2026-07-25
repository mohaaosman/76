import { Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Band, BandTopbar, BandNav, BandSubTabs, Busy } from '@/components/seventy-six';
import type { BandNavItem } from '@/components/seventy-six';
import { categories } from '../content/categories';

/**
 * The docs site shell IS a 76° screen: ink band, horizontal nav,
 * paper on the platinum wall. No desktop sidebar — the Book forbids it;
 * below 1000px BandNav swaps itself for the left drawer on its own.
 * Pages render their own PageHero inside <HeroBand> so the band reads
 * as one continuous ink zone.
 */
export function Shell({ onSearch }: { onSearch: () => void }) {
  const { pathname, search } = useLocation();

  /* v0.2.0 — the dark surface. Light-first: light is the default,
     dark is opt-in and persisted. Only tokens change. */
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('sv-mode') === 'dark' ? 'dark' : 'light'),
  );
  useEffect(() => {
    if (mode === 'dark') document.documentElement.dataset.mode = 'dark';
    else delete document.documentElement.dataset.mode;
    localStorage.setItem('sv-mode', mode);
  }, [mode]);

  const nav: BandNavItem[] = [
    { label: 'Introduction', href: '/', active: pathname === '/' },
    { label: 'Foundations', href: '/foundations', active: pathname === '/foundations' },
    { label: 'Components', href: '/components', active: pathname.startsWith('/components') },
    { label: 'Blocks', href: '/blocks', active: pathname === '/blocks' },
    { label: 'Templates', href: '/templates', active: pathname.startsWith('/templates') },
    { label: 'AI-ready', href: '/ai', active: pathname === '/ai' },
    { label: 'Roadmap', href: '/roadmap', active: pathname === '/roadmap' },
  ];

  /* The category row is REAL navigation, and it reads the URL rather than
     local state: B1 says sub-tabs are links that navigate, `aria-current`
     comes from the route, and a reader who bookmarks or reloads
     /components?cat=marketing lands back on the same filtered index. It used
     to render `active: false` unconditionally, so the row never told anyone
     where they were — a nav that cannot say where you are is not a nav. */
  const cat = new URLSearchParams(search).get('cat');
  const onIndex = pathname === '/components';
  const subtabs: BandNavItem[] = pathname.startsWith('/components')
    ? [
        { label: 'ALL', href: '/components', active: onIndex && !cat },
        ...categories.map((c) => ({
          label: c.label.toUpperCase(),
          href: `/components?cat=${c.id}`,
          active: onIndex && cat === c.id,
        })),
      ]
    : [];

  /* A route change starts at the top of the new page. A multi-page app gets
     this from the browser; a hash-routed SPA has to say it, and until it does
     the reader arrives at whatever scroll offset the previous page left
     behind — or at whatever the new page's first control pulled them to.
     `instant` rather than smooth: this is not a transition the reader asked
     for, and C7 sends every animation to 0ms under reduced motion anyway. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

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
            <>
            <button
              type="button"
              className="site-search sv-mono"
              aria-pressed={mode === 'dark'}
              onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            >
              {mode === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
            <button type="button" className="site-search sv-mono" onClick={onSearch}>
              SEARCH <kbd className="site-kbd">⌘K</kbd>
            </button>
            </>
          }
        />
        <BandSubTabs items={subtabs} renderLink={renderLink} />
      </Band>
      {/* Routes are code-split, so a page can be in flight. The band stays
          put and the wall carries a B31 Busy — the system's own answer to
          "a region is fetching", used on itself. */}
      <Suspense fallback={<Busy label="Loading the page…" minHeight={320} />}>
        <Outlet />
      </Suspense>
    </>
  );
}

/** The hero's slice of the ink band — pages place PageHero inside it. */
export function HeroBand({ children }: { children: ReactNode }) {
  return <div className="sv-band">{children}</div>;
}
