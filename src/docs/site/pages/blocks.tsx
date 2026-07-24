import { PageHero, Sheet, Row } from '@/components/seventy-six';
import { blocks } from '../../content/compositions';
import { HeroBand } from '../shell';
import { CompositionCard } from '../composition-card';

export function BlocksPage() {
  return (
    <>
      <HeroBand>
        <PageHero
          title="Blocks"
          titleSoft={`· ${blocks.length} composed sections`}
          context="Ready-made sections built only from the widget taxonomy. Install one and own the source."
        />
      </HeroBand>
      <Sheet aria-label="Block gallery">
        {blocks.map((comp, i) => (
          <Row key={comp.slug} overlap={i === 0}>
            <CompositionCard comp={comp} />
          </Row>
        ))}
      </Sheet>
    </>
  );
}
