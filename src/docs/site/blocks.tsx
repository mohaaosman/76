import { useState } from 'react';
import type { ReactNode } from 'react';
import { Card, CardHead, CardTabs, useToast } from '@/components/seventy-six';
import { cx } from '@/lib/cx';
import type { DocEntry, DocExample, PropRow, KeyRow } from '../content/types';
import { decodeEntities } from '../content/markdown';

/** Tiny renderer for <b> / <code> markup inside prose strings. */
export function Prose({ text }: { text: string }) {
  const parts = text.split(/(<b>.*?<\/b>|<code>.*?<\/code>)/g);
  return (
    <>
      {parts.map((part, i) => {
        /* React escapes its children, so entities must be decoded here or
           the page prints "&lt;select&gt;" verbatim. */
        if (part.startsWith('<b>')) return <b key={i}>{decodeEntities(part.slice(3, -4))}</b>;
        if (part.startsWith('<code>')) return <code key={i}>{decodeEntities(part.slice(6, -7))}</code>;
        return decodeEntities(part);
      })}
    </>
  );
}

/** Preview / Code pair — the heart of every variation block. */
export function PreviewCode({ example, demo }: { example: DocExample; demo: ReactNode }) {
  const [tab, setTab] = useState('preview');
  const { toast } = useToast();

  return (
    <Card>
      <CardHead title={example.title} />
      {example.description && (
        <p className="site-prose site-prose--tight">
          <Prose text={example.description} />
        </p>
      )}
      <CardTabs
        tabs={[
          { id: 'preview', label: 'Preview' },
          { id: 'code', label: 'Code' },
        ]}
        active={tab}
        onChange={setTab}
        idBase={`ex-${example.demoKey}`}
        mode="tabs"
      />
      <div
        id={`ex-${example.demoKey}-panel`}
        role="tabpanel"
        aria-labelledby={`ex-${example.demoKey}-tab-${tab}`}
      >
        {tab === 'preview' ? (
          <div className={cx('site-preview', example.surface === 'paper' && 'site-preview--paper', example.surface === 'band' && 'site-preview--band')}>
            {demo}
          </div>
        ) : (
          <>
            <div className="site-codebar">
              <button
                type="button"
                className="sv-btn sv-btn--link"
                onClick={() => {
                  navigator.clipboard.writeText(example.code.trim());
                  toast('Code copied to clipboard', 'ok');
                }}
              >
                Copy code
              </button>
            </div>
            <pre className="site-code">
              <code>{example.code.trim()}</code>
            </pre>
          </>
        )}
      </div>
    </Card>
  );
}

export function PropsCard({ groups }: { groups: DocEntry['props'] }) {
  return (
    <Card>
      <CardHead title="Props" subtitle="Every prop, its type, and what it controls" />
      {groups.map((group) => (
        <div key={group.component}>
          <p className="sv-mono site-props-group">{group.component}</p>
          <table className="site-props">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row: PropRow) => (
                <tr key={row.name}>
                  <td className="site-props__name">{row.name}</td>
                  <td className="site-props__type">{row.type}</td>
                  <td className="site-props__type">{row.defaultValue ?? '—'}</td>
                  <td className="site-props__desc">
                    <Prose text={row.description} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </Card>
  );
}

export function A11yCard({ a11y }: { a11y: DocEntry['a11y'] }) {
  return (
    <Card>
      <CardHead title="Accessibility" subtitle="The Part C contract this component ships with" />
      {a11y.keyboard && a11y.keyboard.length > 0 && (
        <table className="site-props site-keys">
          <thead>
            <tr>
              <th scope="col">Keys</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {a11y.keyboard.map((k: KeyRow) => (
              <tr key={k.keys}>
                <td>{k.keys}</td>
                <td className="site-props__desc">{k.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="site-prose">
        {a11y.notes.map((note) => (
          <p key={note}>
            <Prose text={note} />
          </p>
        ))}
      </div>
    </Card>
  );
}

export function DontsCard({ donts }: { donts: string[] }) {
  return (
    <Card>
      <CardHead title="Don't" subtitle="Slop Firewall — each of these is a defect, not a preference" />
      <ul className="site-donts">
        {donts.map((d) => (
          <li key={d}>
            <Prose text={d} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function FaqCard({ faq }: { faq: DocEntry['faq'] }) {
  return (
    <Card>
      <CardHead title="FAQ" subtitle="The API restated as questions — for humans and for LLMs" />
      <div className="site-faq">
        {faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>
              <Prose text={f.a} />
            </p>
          </details>
        ))}
      </div>
    </Card>
  );
}

export function InstallCard({ entry }: { entry: DocEntry }) {
  const { toast } = useToast();
  const [tab, setTab] = useState('cli');
  const cli = `npx shadcn@latest add https://76.zifala.com/r/${entry.slug}.json`;
  return (
    <Card>
      <CardHead
        title="Installation"
        subtitle="Source distribution — the code lands in your project and you own it"
      />
      <CardTabs
        tabs={[
          { id: 'cli', label: 'CLI' },
          { id: 'manual', label: 'Manual' },
        ]}
        active={tab}
        onChange={setTab}
        idBase={`install-${entry.slug}`}
        mode="tabs"
      />
      <div
        id={`install-${entry.slug}-panel`}
        role="tabpanel"
        aria-labelledby={`install-${entry.slug}-tab-${tab}`}
      >
        {tab === 'cli' ? (
          <div className="site-install">
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
              The CLI resolves file paths through your project's <code>components.json</code> aliases
              and installs{' '}
              {entry.registryDeps?.length ? 'registry dependencies automatically' : 'with no registry dependencies'}.
            </p>
          </div>
        ) : (
          <>
            <p className="site-prose">
              Copy these files into your project. All components require{' '}
              <code>styles/tokens.css</code> loaded once and <code>lib/cx.ts</code>.
              {entry.registryDeps?.length ? (
                <>
                  {' '}
                  Also install: <b>{entry.registryDeps.join(', ')}</b>.
                </>
              ) : null}
            </p>
            <ul className="site-filelist">
              {entry.files.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Card>
  );
}
