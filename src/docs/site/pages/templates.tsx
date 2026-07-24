import { PageHero, Sheet, Row } from '@/components/seventy-six';
import { templates } from '../../content/compositions';
import { HeroBand } from '../shell';
import { CompositionCard } from '../composition-card';

export function TemplatesPage() {
  return (
    <>
      <HeroBand>
        <PageHero
          breadcrumb={['76°', 'TEMPLATES']}
          title="Templates"
          titleSoft={`· ${templates.length} full screens`}
          context="Complete screens, each themed by its seed. Open one full screen, or install it and make it yours."
        />
      </HeroBand>
      <Sheet aria-label="Template gallery">
        {templates.map((comp, i) => (
          <Row key={comp.slug} overlap={i === 0}>
            <CompositionCard comp={comp} />
          </Row>
        ))}
      </Sheet>
    </>
  );
}
