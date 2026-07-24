// 76° block · Revenue trend panel with in-card range filters.
import { useState } from 'react';
import { Sheet, Row, Card, CardHead, CardTabs, Trend } from '@/components/seventy-six';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const THIS_YEAR = [318, 342, 361, 355, 389, 431, 482, 470, 498, 512, 540, 566];
const LAST_YEAR = [290, 301, 330, 322, 351, 388, 402, 415, 430, 448, 471, 495];

export function TrendPanel() {
  const [range, setRange] = useState('ytd');
  return (
    <Sheet aria-label="Revenue trend">
      <Row split="full">
        <Card>
          <CardHead title="Revenue" subtitle="Monthly, this year vs last" />
          <CardTabs
            mode="filters"
            active={range}
            onChange={setRange}
            tabs={[
              { id: '30d', label: '30D' },
              { id: 'qtd', label: 'QTD' },
              { id: 'ytd', label: 'YTD' },
            ]}
          />
          <div className="sv-card__body">
            <Trend
              kind="line"
              xLabels={MONTHS}
              ariaLabel="Revenue is running ahead of last year every month, $566K in December versus $495K a year ago"
              series={[
                { label: 'This year', data: THIS_YEAR, tone: 'seed' },
                { label: 'Last year', data: LAST_YEAR, tone: 'compare' },
              ]}
            />
          </div>
        </Card>
      </Row>
    </Sheet>
  );
}
