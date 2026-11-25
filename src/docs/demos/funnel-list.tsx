import type { ComponentType } from 'react';
import { FunnelList } from '@/components/seventy-six/funnel-list';
import { Card, CardHead } from '@/components/seventy-six/card';

/* Checkout, July 2026. Every share is the step over the first step's
   48,200, every rate the step over the one before it, and every loss the
   difference:
     12,530 / 48,200 = 26.0%   48,200 − 12,530 = 35,670   share 0.2600
      5,160 / 12,530 = 41.2%   12,530 −  5,160 =  7,370   share 0.1071
      3,870 /  5,160 = 75.0%    5,160 −  3,870 =  1,290   share 0.0803
      3,210 /  3,870 = 82.9%    3,870 −  3,210 =    660   share 0.0666 */
function FunnelCheckout() {
  return (
    <div style={{ maxWidth: 440 }}>
      <FunnelList
        label="Checkout funnel, July 2026"
        steps={[
          { label: 'Viewed a product', value: '48,200', share: 1 },
          { label: 'Added to cart', value: '12,530', share: 0.26, conversion: '26.0% of previous · 35,670 lost' },
          { label: 'Began checkout', value: '5,160', share: 0.1071, conversion: '41.2% of previous · 7,370 lost' },
          { label: 'Entered payment', value: '3,870', share: 0.0803, conversion: '75.0% of previous · 1,290 lost' },
          { label: 'Placed an order', value: '3,210', share: 0.0666, conversion: '82.9% of previous · 660 lost' },
        ]}
      />
    </div>
  );
}

/* B2B pipeline, Q3 2026, against Q2. Shares are over the 240 leads; each
   delta is this quarter's step rate less Q2's (58.4, 66.0, 52.1, 55.0):
     150 / 240 = 62.5%  ▲ 4.1 pts    90 lost
      96 / 150 = 64.0%  ▼ 2.0 pts    54 lost
      54 /  96 = 56.3%  ▲ 4.2 pts    42 lost
      31 /  54 = 57.4%  ▲ 2.4 pts    23 lost */
function FunnelPipeline() {
  return (
    <Card style={{ maxWidth: 460 }}>
      <CardHead title="Pipeline conversion" subtitle="Q3 2026 · 240 leads" />
      <div className="sv-card__body">
        <FunnelList
          label="Pipeline conversion, Q3 2026"
          baseline="Q2 2026"
          steps={[
            { label: 'Lead', value: '240', share: 1 },
            { label: 'Qualified', value: '150', share: 0.625, conversion: '62.5% of previous · 90 lost · ▲ 4.1 pts' },
            { label: 'Quote sent', value: '96', share: 0.4, conversion: '64.0% of previous · 54 lost · ▼ 2.0 pts' },
            { label: 'Negotiation', value: '54', share: 0.225, conversion: '56.3% of previous · 42 lost · ▲ 4.2 pts' },
            { label: 'Won', value: '31', share: 0.1292, conversion: '57.4% of previous · 23 lost · ▲ 2.4 pts' },
          ]}
        />
      </div>
    </Card>
  );
}

export const funnelListDemos: Record<string, ComponentType> = {
  'funnel-checkout': FunnelCheckout,
  'funnel-pipeline': FunnelPipeline,
};
