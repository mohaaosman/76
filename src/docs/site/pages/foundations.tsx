import { PageHero, Sheet, Row, Card, CardHead } from '@/components/seventy-six';
import { HeroBand } from '../shell';
import { RichText } from '../blocks';

const NEUTRALS = [
  { name: '--sv-band', hex: '#1B1F26', note: 'ink band' },
  { name: '--sv-band-line', hex: '#2C323B', note: 'band hairlines' },
  { name: '--sv-band-soft', hex: '#8A93A2', note: 'band secondary · 5.32:1' },
  { name: '--sv-wall', hex: '#F2F3F5', note: 'platinum wall' },
  { name: '--sv-paper', hex: '#FFFFFF', note: 'card surface' },
  { name: '--sv-ink', hex: '#1C2026', note: 'primary text · 15.7:1' },
  { name: '--sv-ink-soft', hex: '#667080', note: 'secondary · 4.99:1 AA' },
  { name: '--sv-ink-faint', hex: '#99A1AD', note: 'hints · never sole carrier' },
  { name: '--sv-line', hex: '#E9EBEE', note: 'internal hairlines' },
];

const SEEDS = [
  { name: 'Cobalt · ERP', hex: '#2C5BE0', note: '5.70:1 both ways' },
  { name: 'Verdigris · CRM', hex: '#12836F', note: '5.0:1 both ways' },
  { name: 'Signal · POS', hex: '#D9531E', note: 'fills only · text #C24413' },
  { name: '--sv-ok', hex: '#14804A', note: 'words + dots · 4.98:1' },
  { name: '--sv-bad', hex: '#C43D2E', note: 'words + dots · 5.18:1' },
];

export function FoundationsPage() {
  return (
    <>
      <HeroBand>
        <PageHero
          title="Foundations"
          titleSoft="tokens, type, geometry"
          context="Everything below ships in one file: styles/tokens.css — the only file allowed to contain a color literal."
        />
      </HeroBand>
      <Sheet aria-label="Foundations">
        <Row overlap split="main">
          <Card>
            <CardHead title="Neutrals" subtitle="The wall and the ink — Law 1 separates by contrast alone" />
            <div className="site-swatches">
              {NEUTRALS.map((c) => (
                <div key={c.name}>
                  <div className="site-swatch__chip" style={{ background: c.hex }} />
                  <p className="site-swatch__name">{c.name}</p>
                  <p className="site-swatch__hex">
                    {c.hex} · {c.note}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Seeds & functional" subtitle="Three colors total on any screen — Law 2" />
            <div className="site-swatches">
              {SEEDS.map((c) => (
                <div key={c.name}>
                  <div className="site-swatch__chip" style={{ background: c.hex }} />
                  <p className="site-swatch__name">{c.name}</p>
                  <p className="site-swatch__hex">
                    {c.hex} · {c.note}
                  </p>
                </div>
              ))}
            </div>
            <p className="site-prose site-prose--tight">
              <RichText text="New seeds are REJECTED unless seed-on-white ≥ 4.5:1 <b>and</b> white-on-seed ≥ 4.5:1. When the two differ (Signal), register <code>--sv-seed</code> and <code>--sv-seed-text</code> separately." />
            </p>
          </Card>
        </Row>
        <Row split="main">
          <Card>
            <CardHead title="Typography" subtitle="Hanken Grotesk speaks content · Fragment Mono speaks metadata" />
            <div className="site-type-specimen">
              <div>
                <p style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.2 }}>
                  Good morning, <span style={{ color: 'var(--sv-ink-faint)' }}>Warehouse</span>
                </p>
                <p className="site-swatch__hex">H1 greeting · Hanken 27/1.2 · 800</p>
              </div>
              <div>
                <p className="sv-num" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em' }}>
                  $482,190
                </p>
                <p className="site-swatch__hex">Stat value · 24/1.1 · 800 · tabular-nums</p>
              </div>
              <div>
                <p style={{ fontSize: 13 }}>Body and table cells set at 13/1.5 in weight 500; numeric cells step up to 600.</p>
                <p className="site-swatch__hex">Body · Hanken 13/1.5 · 500</p>
              </div>
              <div>
                <p className="sv-mono" style={{ color: 'var(--sv-ink-soft)' }}>REVENUE · MONTH TO DATE</p>
                <p className="site-swatch__hex">Micro label · Fragment Mono 10 · UPPERCASE · tracking .13em</p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--sv-font-mono)', fontSize: 11.5, color: 'var(--sv-ink-soft)' }}>
                  ORD-10482 · 14:32
                </p>
                <p className="site-swatch__hex">IDs & timestamps · Fragment Mono 10–11.5</p>
              </div>
            </div>
          </Card>
          <Card>
            <CardHead title="Geometry & motion" subtitle="One radius, one shadow, two durations" />
            <div className="site-prose">
              <p>
                <RichText text="<b>Radius:</b> <code>--sv-r</code> (4px) everywhere; 50% for avatars and dots; 2–3px for bars. Nothing else — no 8, no 12, no pills." />
              </p>
              <p>
                <RichText text="<b>Elevation:</b> exactly one shadow, <code>0 1px 2px rgba(16,20,28,.05)</code> — one breath of depth. Cards never blend and never float." />
              </p>
              <p>
                <RichText text="<b>Spacing:</b> 4px base scale, <code>--sv-s1</code> through <code>--sv-s8</code>. Grid is 12-col with 14px gutters; canonical splits are 4×1fr for stat rows and 1.7fr/1fr for content rows." />
              </p>
              <p>
                <RichText text="<b>Motion:</b> <code>--sv-t-fast</code> 120ms and <code>--sv-t</code> 160ms, opacity and color only — nothing moves layout. Both collapse to 0ms under <code>prefers-reduced-motion</code>, and 76° loses nothing, by design." />
              </p>
              <p>
                <RichText text="<b>Per-product theming:</b> set <code>&lt;html data-seed=&quot;cobalt&quot;&gt;</code> (or verdigris, signal…). Nothing else may change between products." />
              </p>
            </div>
          </Card>
        </Row>
      </Sheet>
    </>
  );
}
