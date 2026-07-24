import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastProvider, SearchCommand, useSearchCommand } from '@/components/seventy-six';
import type { CommandItem } from '@/components/seventy-six';
import { entries } from './content';
import { Shell } from './site/shell';
import { HomePage } from './site/pages/home';
import { FoundationsPage } from './site/pages/foundations';
import { ComponentsIndexPage } from './site/pages/components-index';
import { ComponentPage } from './site/pages/component';
import { AiPage } from './site/pages/ai';

const commandItems: CommandItem[] = [
  { id: 'home', group: 'PAGES', label: 'Introduction', hint: '76°' },
  { id: 'foundations', group: 'PAGES', label: 'Foundations', hint: 'TOKENS' },
  { id: 'ai', group: 'PAGES', label: 'AI-ready layer', hint: 'LLMS.TXT' },
  ...entries.map((e) => ({
    id: `c-${e.slug}`,
    group: e.category.toUpperCase(),
    label: e.name,
    hint: e.book,
    keywords: e.tags.join(' '),
  })),
];

export function App() {
  const search = useSearchCommand();
  const navigate = useNavigate();

  function onPick(item: CommandItem) {
    if (item.id === 'home') navigate('/');
    else if (item.id === 'foundations') navigate('/foundations');
    else if (item.id === 'ai') navigate('/ai');
    else navigate(`/components/${item.id.slice(2)}`);
  }

  return (
    <ToastProvider>
      <Routes>
        <Route element={<Shell onSearch={search.show} />}>
          <Route index element={<HomePage />} />
          <Route path="/foundations" element={<FoundationsPage />} />
          <Route path="/components" element={<ComponentsIndexPage />} />
          <Route path="/components/:slug" element={<ComponentPage />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
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
