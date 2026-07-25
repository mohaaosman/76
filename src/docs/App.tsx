import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastProvider, SearchCommand, useSearchCommand } from '@/components/seventy-six';
import type { CommandItem } from '@/components/seventy-six';
import { Shell } from './site/shell';

/**
 * Every page is code-split. The doc corpus (36 entries of prose), the demo
 * registry, and the eleven full-screen templates are each an order of
 * magnitude larger than the shell that frames them, and the landing page
 * needs none of them — so they load with the route that shows them.
 */
const page = <T extends string>(name: T, load: () => Promise<Record<T, React.ComponentType>>) =>
  lazy(() => load().then((m) => ({ default: m[name] })));

const HomePage = page('HomePage', () => import('./site/pages/home'));
const FoundationsPage = page('FoundationsPage', () => import('./site/pages/foundations'));
const ComponentsIndexPage = page('ComponentsIndexPage', () => import('./site/pages/components-index'));
const ComponentPage = page('ComponentPage', () => import('./site/pages/component'));
const BlocksPage = page('BlocksPage', () => import('./site/pages/blocks'));
const TemplatesPage = page('TemplatesPage', () => import('./site/pages/templates'));
const TemplateViewPage = page('TemplateViewPage', () => import('./site/pages/template-view'));
const RoadmapPage = page('RoadmapPage', () => import('./site/pages/roadmap'));
const AiPage = page('AiPage', () => import('./site/pages/ai'));

const pageRoutes: Record<string, string> = {
  home: '/',
  foundations: '/foundations',
  blocks: '/blocks',
  templates: '/templates',
  roadmap: '/roadmap',
  ai: '/ai',
};

const pageItems: CommandItem[] = [
  { id: 'home', group: 'PAGES', label: 'Introduction', hint: '76°' },
  { id: 'foundations', group: 'PAGES', label: 'Foundations', hint: 'TOKENS' },
  { id: 'blocks', group: 'PAGES', label: 'Blocks', hint: 'SECTIONS' },
  { id: 'templates', group: 'PAGES', label: 'Templates', hint: 'SCREENS' },
  { id: 'roadmap', group: 'PAGES', label: 'Roadmap', hint: 'PLAN' },
  { id: 'ai', group: 'PAGES', label: 'AI-ready layer', hint: 'LLMS.TXT' },
];

/**
 * The palette indexes every component and composition, which means the whole
 * corpus. It is derived, never hand-listed (a hand-listed index drifts), so
 * it is loaded off the critical path: on idle, or the moment ⌘K is pressed,
 * whichever comes first.
 */
async function loadCommandItems(): Promise<CommandItem[]> {
  const [{ entries }, { compositions }] = await Promise.all([
    import('./content'),
    import('./content/compositions'),
  ]);
  return [
    ...pageItems,
    ...entries.map((e) => ({
      id: `c-${e.slug}`,
      group: e.category.toUpperCase(),
      label: e.name,
      hint: e.book,
      keywords: e.tags.join(' '),
    })),
    ...compositions.map((c) => ({
      id: `k-${c.kind}-${c.slug}`,
      group: c.kind === 'template' ? 'TEMPLATES' : 'BLOCKS',
      label: c.name,
      hint: c.kind === 'template' ? 'SCREEN' : 'BLOCK',
      keywords: c.tags.join(' '),
    })),
  ];
}

export function App() {
  const search = useSearchCommand();
  const navigate = useNavigate();
  const [commandItems, setCommandItems] = useState<CommandItem[]>(pageItems);
  const [indexed, setIndexed] = useState(false);

  const index = useCallback(() => {
    if (indexed) return;
    setIndexed(true);
    loadCommandItems().then(setCommandItems);
  }, [indexed]);

  useEffect(() => {
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(index)
      : window.setTimeout(index, 1500);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [index]);

  function openSearch() {
    index();
    search.show();
  }

  function onPick(item: CommandItem) {
    if (pageRoutes[item.id]) navigate(pageRoutes[item.id]);
    else if (item.id.startsWith('c-')) navigate(`/components/${item.id.slice(2)}`);
    else if (item.id.startsWith('k-template-')) navigate(`/templates/${item.id.slice('k-template-'.length)}`);
    else if (item.id.startsWith('k-block-')) navigate('/blocks');
  }

  return (
    <ToastProvider>
      {/* The Shell carries its own Suspense around the outlet, so the band
          never blinks; this boundary only covers the band-less route. */}
      <Suspense fallback={null}>
        <Routes>
          <Route element={<Shell onSearch={openSearch} />}>
            <Route index element={<HomePage />} />
            <Route path="/foundations" element={<FoundationsPage />} />
            <Route path="/components" element={<ComponentsIndexPage />} />
            <Route path="/components/:slug" element={<ComponentPage />} />
            <Route path="/blocks" element={<BlocksPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="/templates/:slug" element={<TemplateViewPage />} />
        </Routes>
      </Suspense>
      <SearchCommand
        open={search.open}
        onOpen={openSearch}
        onClose={search.hide}
        items={commandItems}
        onPick={onPick}
        placeholder="SEARCH COMPONENTS…"
      />
    </ToastProvider>
  );
}
