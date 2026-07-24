import { PageHero, Sheet, Row, Card, CardHead, useToast } from '@/components/seventy-six';
import { entries } from '../../content';
import { HeroBand } from '../shell';
import { Prose } from '../blocks';

export function AiPage() {
  const { toast } = useToast();
  const llmsIndex = `# 76° UI — Seventy Six Degrees

> Flat, informational, corporate React components. Source distribution
> (shadcn-compatible registry), zero runtime dependencies, WCAG 2.2 AA.

## Components
${entries.map((e) => `- [${e.name}](/llms/${e.slug}.md): ${e.tagline}`).join('\n')}
`;

  return (
    <>
      <HeroBand>
        <PageHero
          title="Built for assistants"
          titleSoft="as much as for people"
          context="Registry metadata, markdown routes, and llms.txt — every doc page is machine-ingestible by design."
          actions={
            <button
              type="button"
              className="sv-btn sv-btn--primary"
              onClick={() => {
                navigator.clipboard.writeText(llmsIndex);
                toast('llms.txt index copied', 'ok');
              }}
            >
              Copy llms.txt
            </button>
          }
        />
      </HeroBand>
      <Sheet aria-label="AI-ready layer">
        <Row overlap split="main">
          <Card>
            <CardHead title="The three mechanisms" subtitle="Registry → markdown routes → MCP (the upgrade path)" />
            <div className="site-prose">
              <p>
                <Prose text="<b>1 · The registry.</b> Every component ships as a shadcn-compatible registry item at <code>/r/&lt;slug&gt;.json</code> — description, feature tags, category, file contents, and registry dependencies. Any AI agent that can run <code>npx shadcn add &lt;url&gt;</code> installs the component with correct imports; it never has to paste code from memory." />
              </p>
              <p>
                <Prose text="<b>2 · Markdown routes.</b> Each doc page is generated from pure data, so the same source renders this site and emits <code>/llms/&lt;slug&gt;.md</code>. The 'Copy page for AI' button on every component page yields the identical markdown. <code>/llms.txt</code> is the index." />
              </p>
              <p>
                <Prose text="<b>3 · MCP (later).</b> Once the registry has volume, an MCP server wraps it with search_components / get_component tools, the Untitled UI pattern. The metadata needed for semantic search — descriptions, tags, categories — already exists in every registry item, so nothing needs re-authoring." />
              </p>
            </div>
          </Card>
          <Card>
            <CardHead title="Why FAQs everywhere" subtitle="Question–answer pairs are the friendliest shape for retrieval" />
            <div className="site-prose">
              <p>
                <Prose text="Every component page ends in an FAQ that restates the API in natural language — the colors available, how to disable, how to make full-width. Humans skim it; retrieval systems and LLMs match user questions against it almost verbatim. It is documentation and embedding fodder in one." />
              </p>
              <p>
                <Prose text="The Don't lists serve AI collaborators the same way: they are the Slop Firewall in prose, so an assistant generating 76° UI knows a filled status pill or a donut chart is a <b>defect</b>, not a stylistic choice." />
              </p>
            </div>
          </Card>
        </Row>
        <Row>
          <Card>
            <CardHead title="llms.txt" subtitle="Served at the site root — the machine-readable table of contents" />
            <pre className="site-code site-code--framed">
              <code>{llmsIndex}</code>
            </pre>
          </Card>
        </Row>
      </Sheet>
    </>
  );
}
