import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastProvider, SearchCommand, useSearchCommand } from '@/components/seventy-six';
import type { CommandItem } from '@/components/seventy-six';
import { entries } from './content';
import { compositions } from './content/compositions';
import { Shell } from './site/shell';
import { HomePage } from './site/pages/home';
import { FoundationsPage } from './site/pages/foundations';
import { ComponentsIndexPage } from './site/pages/components-index';
import { ComponentPage } from './site/pages/component';
import { BlocksPage } from './site/pages/blocks';
import { TemplatesPage } from './site/pages/templates';
import { TemplateViewPage } from './site/pages/template-view';
import { RoadmapPage } from './site/pages/roadmap';
import { AiPage } from './site/pages/ai';

const pageRoutes: Record<string, string> = {
  home: '/',
  foundations: '/foundations',
  blocks: '/blocks',
  templates: '/templates',
  roadmap: '/roadmap',
  ai: '/ai',
};

const commandItems: CommandItem[] = [
  { id: 'home', group: 'PAGES', label: 'Introduction', hint: '76°' },
  { id: 'foundations', group: 'PAGES', label: 'Foundations', hint: 'TOKENS' },
  { id: 'blocks', group: 'PAGES', label: 'Blocks', hint: 'SECTIONS' },
  { id: 'templates', group: 'PAGES', label: 'Templates', hint: 'SCREENS' },
  { id: 'roadmap', group: 'PAGES', label: 'Roadmap', hint: 'PLAN' },
  { id: 'ai', group: 'PAGES', label: 'AI-ready layer', hint: 'LLMS.TXT' },
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

export function App() {
  const search = useSearchCommand();
  const navigate = useNavigate();

  function onPick(item: CommandItem) {
    if (pageRoutes[item.id]) navigate(pageRoutes[item.id]);
    else if (item.id.startsWith('c-')) navigate(`/components/${item.id.slice(2)}`);
    else if (item.id.startsWith('k-template-')) navigate(`/templates/${item.id.slice('k-template-'.length)}`);
    else if (item.id.startsWith('k-block-')) navigate('/blocks');
  }

  return (
    <ToastProvider>
      <Routes>
        <Route element={<Shell onSearch={search.show} />}>
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
      <SearchCommand
        open={search.open}
        onClose={search.hide}
        items={commandItems}
        onPick={onPick}
        placeholder="SEARCH COMPONENTS…"
      />
    </ToastProvider>
  );
}
