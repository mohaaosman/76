import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHead, CardTabs, useToast } from '@/components/seventy-six';
import type { Composition } from '../content/compositions';
import { compositionRender } from '../compositions';
import { Prose } from './blocks';

const BASE = 'https://76.zifala.com';

/** One block/template: live preview, its own source, and the shadcn install. */
export function CompositionCard({ comp }: { comp: Composition }) {
  const [tab, setTab] = useState('preview');
  const { toast } = useToast();
  const render = compositionRender[comp.slug];
  if (!render) return null;
  const Demo = render.Component;
  const cli = `npx shadcn@latest add ${BASE}/r/${comp.kind}-${comp.slug}.json`;
  const idBase = `comp-${comp.slug}`;

  return (
    <Card as="article">
      <CardHead
        title={comp.name}
        subtitle={comp.tagline}
        action={
          comp.kind === 'template' ? (
            <Link className="sv-btn sv-btn--link" to={`/templates/${comp.slug}`}>
              Full screen
            </Link>
          ) : undefined
        }
      />
      {comp.description[0] && (
        <p className="site-prose site-prose--tight">
          <Prose text={comp.description[0]} />
        </p>
      )}
      <CardTabs
        tabs={[
          { id: 'preview', label: 'Preview' },
          { id: 'code', label: 'Code' },
          { id: 'install', label: 'Install' },
        ]}
        active={tab}
        onChange={setTab}
        idBase={idBase}
        mode="tabs"
      />
      <div id={`${idBase}-panel`} role="tabpanel" aria-labelledby={`${idBase}-tab-${tab}`}>
        {tab === 'preview' && (
          <div className="site-preview site-preview--composition">
            <Demo />
          </div>
        )}
        {tab === 'code' && (
          <>
            <div className="site-codebar">
              <button
                type="button"
                className="sv-btn sv-btn--link"
                onClick={() => {
                  navigator.clipboard.writeText(render.source);
                  toast('Source copied to clipboard', 'ok');
                }}
              >
                Copy source
              </button>
            </div>
            <pre className="site-code site-code--framed">
              <code>{render.source}</code>
            </pre>
          </>
        )}
        {tab === 'install' && (
          <>
            <div className="site-codebar">
              <button
                type="button"
                className="sv-btn sv-btn--link"
                onClick={() => {
                  navigator.clipboard.writeText(cli);
                  toast('Command copied', 'ok');
                }}
              >
                Copy command
              </button>
            </div>
            <pre className="site-code">
              <code>{cli}</code>
            </pre>
            <p className="site-prose site-prose--flush">
              Installs the source and pulls {comp.deps.length} component
              {comp.deps.length === 1 ? '' : 's'} + tokens as registry dependencies.
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
