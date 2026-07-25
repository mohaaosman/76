import { Link, useSearchParams } from 'react-router-dom';
import { PageHero, Sheet, Row, Card, CardHead } from '@/components/seventy-six';
import { categories, entries } from '../../content';
import { HeroBand } from '../shell';

export function ComponentsIndexPage() {
  const [params] = useSearchParams();
  const cat = params.get('cat');
  const visible = categories.filter((c) => !cat || c.id === cat);

  return (
    <>
      <HeroBand>
        <PageHero
          title="Components"
          titleSoft={`· ${entries.length} components across B1–B51`}
          context="Every component: one job, a fixed anatomy, enumerated states, an accessibility contract, and a Don't list."
        />
      </HeroBand>
      <Sheet aria-label="Component index">
        {visible.map((category, ci) => (
          <div key={category.id}>
            <Row overlap={ci === 0}>
              <Card className="site-catstrip">
                <p className="sv-mono site-catstrip__inner">
                  <span>{category.label.toUpperCase()}</span>
                  <span className="site-catstrip__note">{category.note}</span>
                </p>
              </Card>
            </Row>
            <Row split="stats">
              {entries
                .filter((e) => e.category === category.id)
                .map((entry) => (
                  <Link key={entry.slug} to={`/components/${entry.slug}`} className="site-index-link">
                    <Card as="article">
                      <CardHead title={entry.name} subtitle={entry.job} />
                      <p className="sv-mono site-index-meta">
                        <span>{entry.book}</span>
                        <span>{entry.exports.length} EXPORTS</span>
                      </p>
                    </Card>
                  </Link>
                ))}
            </Row>
          </div>
        ))}
      </Sheet>
    </>
  );
}
