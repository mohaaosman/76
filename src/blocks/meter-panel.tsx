// Warehouse utilization by zone — the donut-replacement (absolute numbers mandatory).
import { Sheet, Row, Card, CardHead, MeterList } from '@/components/seventy-six';

export function MeterPanel() {
  return (
    <Sheet aria-label="Warehouse utilization">
      <Row split="full">
        <Card>
          <CardHead title="Warehouse utilization" subtitle="By zone" />
          <MeterList
            items={[
              {
                label: 'Zone A · Ambient',
                current: 4320,
                max: 4700,
                value: '92%',
                subtitle: '4,320 of 4,700 pallet positions',
              },
              {
                label: 'Zone B · Chilled',
                current: 1680,
                max: 2000,
                value: '84%',
                subtitle: '1,680 of 2,000 pallet positions',
              },
              {
                label: 'Zone C · Frozen',
                current: 912,
                max: 1200,
                value: '76%',
                subtitle: '912 of 1,200 pallet positions',
              },
              {
                label: 'Zone D · Hazmat',
                current: 148,
                max: 320,
                value: '46%',
                subtitle: '148 of 320 pallet positions',
              },
              {
                label: 'Zone E · Returns',
                current: 534,
                max: 600,
                value: '89%',
                subtitle: '534 of 600 pallet positions',
              },
            ]}
          />
        </Card>
      </Row>
    </Sheet>
  );
}
