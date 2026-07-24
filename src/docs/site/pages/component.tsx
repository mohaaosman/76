import { Link, Navigate, useParams } from 'react-router-dom';
import { PageHero, Sheet, Row, Card, CardHead, useToast } from '@/components/seventy-six';
import { entries } from '../../content';
import { entryToMarkdown } from '../../content/markdown';
import { demos } from '../../demos';
import { HeroBand } from '../shell';
import { A11yCard, DontsCard, FaqCard, InstallCard, PreviewCode, PropsCard, Prose } from '../blocks';

export function ComponentPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const idx = entries.findIndex((e) => e.slug === slug);
  if (idx === -1) return <Navigate to="/components" replace />;
  const entry = entries[idx];
  const prev = entries[idx - 1];
  const next = entries[idx + 1];

  function copyMarkdown() {
    navigator.clipboard.writeText(entryToMarkdown(entry));
    toast('Page copied as markdown — paste it into any assistant', 'ok');
  }

  return (
    <>
      <HeroBand>
        <PageHero
          breadcrumb={['COMPONENTS', entry.category.toUpperCase(), entry.book]}
          title={entry.name}
          context={entry.tagline}
          actions={
            <>
              <a
                className="sv-btn sv-btn--ghost"
                href={`llms/${entry.slug}.md`}
                target="_blank"
                rel="noreferrer"
              >
                View as markdown
              </a>
              <button type="button" className="sv-btn sv-btn--primary" onClick={copyMarkdown}>
                Copy page for AI
              </button>
            </>
          }
        />
      </HeroBand>
      <Sheet aria-label={`${entry.name} documentation`}>
        <Row overlap>
          <Card>
            <CardHead title="Overview" subtitle={`One job: ${entry.job}`} />
            <div className="site-prose">
              {entry.intro.map((p, i) => (
                <p key={i}>
                  <Prose text={p} />
                </p>
              ))}
            </div>
          </Card>
        </Row>
        <Row>
          <InstallCard entry={entry} />
        </Row>
        {entry.examples.map((ex) => {
          const Demo = demos[ex.demoKey];
          return (
            <Row key={ex.demoKey}>
              <PreviewCode example={ex} demo={Demo ? <Demo /> : null} />
            </Row>
          );
        })}
        <Row>
          <PropsCard groups={entry.props} />
        </Row>
        <Row split="main">
          <A11yCard a11y={entry.a11y} />
          <DontsCard donts={entry.donts} />
        </Row>
        <Row>
          <FaqCard faq={entry.faq} />
        </Row>
        <Row split="main">
          <div>
            {prev && (
              <Link className="sv-btn sv-btn--ghost" to={`/components/${prev.slug}`}>
                ← {prev.name}
              </Link>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {next && (
              <Link className="sv-btn sv-btn--ghost" to={`/components/${next.slug}`}>
                {next.name} →
              </Link>
            )}
          </div>
        </Row>
      </Sheet>
    </>
  );
}
