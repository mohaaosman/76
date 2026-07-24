// 76° template · CRM sales pipeline (seed: verdigris)
import { useState } from 'react';
import {
  Band, BandTopbar, BandNav, BandSubTabs, PageHero,
  Sheet, Row, Card, CardHead, StatS1, Progress, Trend,
  DataTable, StatusWord, ActivityList, Button, useToast,
} from '@/components/seventy-six';
import type { Column, StatusTone } from '@/components/seventy-six';

const s = { stroke: 'currentColor', strokeWidth: 2, fill: 'none' } as const;
const svg = { viewBox: '0 0 16 16', 'aria-hidden': true, ...s } as const;
const IconFunnel = () => <svg {...svg}><path d="M1 2h14l-5 6v6l-4-2V8L1 2Z" /></svg>;
const IconTrophy = () => <svg {...svg}><path d="M4 2h8v3a4 4 0 0 1-8 0V2ZM6 12h4M8 9v3M5 14h6" /></svg>;
const IconTarget = () => <svg {...svg}><circle cx="8" cy="8" r="6" /><circle cx="8" cy="8" r="2" /></svg>;
const IconClock = () => <svg {...svg}><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" /></svg>;

interface Deal { id: string; account: string; stage: string; tone: StatusTone; value: string }
const deals: Deal[] = [
  { id: 'DL-4821', account: 'Northwind Trading', stage: 'Negotiation', tone: 'ok', value: '$182,400' },
  { id: 'DL-4809', account: 'Kestrel Logistics', stage: 'Proposal', tone: 'neutral', value: '$146,900' },
  { id: 'DL-4794', account: 'Vantage Foods', stage: 'Closing', tone: 'ok', value: '$121,050' },
  { id: 'DL-4788', account: 'Meridian Health', stage: 'Qualify', tone: 'neutral', value: '$98,600' },
  { id: 'DL-4771', account: 'Bluepeak Retail', stage: 'Stalled', tone: 'bad', value: '$74,200' },
  { id: 'DL-4760', account: 'Arcadia Labs', stage: 'Proposal', tone: 'neutral', value: '$63,750' },
];

export function CrmPipeline() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cols: Column<Deal>[] = [
    { key: 'id', header: 'DEAL', kind: 'id', render: (r) => r.id },
    { key: 'account', header: 'ACCOUNT', render: (r) => r.account },
    { key: 'stage', header: 'STAGE', kind: 'status', render: (r) => <StatusWord tone={r.tone}>{r.stage}</StatusWord> },
    { key: 'value', header: 'VALUE', kind: 'num', render: (r) => r.value },
  ];

  return (
    <div data-seed="verdigris">
      <Band>
        <BandTopbar
          app="Sales"
          nav={<BandNav items={[
            { label: 'Pipeline', href: '#', active: true },
            { label: 'Contacts', href: '#' },
            { label: 'Accounts', href: '#' },
            { label: 'Reports', href: '#' },
          ]} />}
          utilities={<span className="sv-mono" aria-hidden="true">SEARCH ⌘K</span>}
        />
        <BandSubTabs items={[
          { label: 'THIS QUARTER', href: '#', active: true },
          { label: 'THIS MONTH', href: '#' },
          { label: 'ALL', href: '#' },
        ]} />
        <PageHero
          headingLevel={1}
          breadcrumb={['REVENUE', 'PIPELINE']}
          title="Pipeline"
          context="Q3 · 42 open deals · $1.8M weighted"
          actions={<>
            <Button variant="ghost" onClick={() => toast('Import started — CSV upload', 'info')}>Import</Button>
            <Button variant="primary" onClick={() => toast('New deal drafted', 'ok')}>Add deal</Button>
          </>}
        />
      </Band>

      <Sheet aria-label="Sales pipeline">
        <Row split="stats" overlap>
          <StatS1 label="WEIGHTED PIPELINE" value="$1.84M" delta={9.2} icon={<IconFunnel />}
            footnote={<>Target <b>$2.1M</b> this quarter</>} footnoteText="Target 2.1 million dollars this quarter" />
          <StatS1 label="DEALS WON · MTD" value="14" delta={3} deltaSuffix="" icon={<IconTrophy />}
            footnote={<><b>$412,900</b> closed this month</>} footnoteText="412,900 dollars closed this month" />
          <StatS1 label="WIN RATE" value="34" unit="%" delta={2.1} icon={<IconTarget />}
            footnote={<>Trailing 90 days across <b>168</b> deals</>} footnoteText="Trailing 90 days across 168 deals" />
          <StatS1 label="AVG CYCLE" value="41" unit="d" delta={-4} deltaSuffix="d" icon={<IconClock />}
            footnote={<>Fastest stage: <b>Qualify</b>, 6 days</>} footnoteText="Fastest stage Qualify, 6 days" />
        </Row>

        <Row split="main">
          <Card>
            <CardHead title="Stages" subtitle="Open deals by stage · Q3" />
            <div style={{ display: 'grid', gap: 'var(--sv-s4)', padding: 'var(--sv-s2) 18px 18px' }}>
              <Progress title="Qualify" current={620} target={900} format={(c, t) => `$${c}K / $${t}K`}
                context="18 deals · early discovery" />
              <Progress title="Proposal" current={540} target={700} format={(c, t) => `$${c}K / $${t}K`}
                context="12 deals · pricing sent" />
              <Progress title="Negotiation" current={410} target={500} format={(c, t) => `$${c}K / $${t}K`}
                context="8 deals · terms in review" />
              <Progress title="Closing" current={270} target={300} format={(c, t) => `$${c}K / $${t}K`}
                context="4 deals · signature pending" />
            </div>
          </Card>
          <Card>
            <CardHead title="Momentum" subtitle="Weighted pipeline by week" />
            <div style={{ padding: 'var(--sv-s2) 18px 18px' }}>
              <Trend
                ariaLabel="Weighted pipeline trending up, $1.84M this quarter versus $1.61M last quarter"
                legend
                xLabels={['WK1', 'WK4', 'WK8', 'WK13']}
                series={[
                  { label: 'This quarter', data: [1.31, 1.44, 1.52, 1.61, 1.7, 1.84], tone: 'seed' },
                  { label: 'Last quarter', data: [1.2, 1.28, 1.36, 1.42, 1.55, 1.61], tone: 'compare' },
                ]}
              />
            </div>
          </Card>
        </Row>

        <Row split="main">
          <Card>
            <CardHead title="Top deals" subtitle="Weighted value · descending" />
            <DataTable
              caption="Top open deals by weighted value"
              columns={cols}
              rows={deals}
              rowKey={(r) => r.id}
              selectable
              selected={selected}
              onSelect={setSelected}
              onRowOpen={(r) => toast(`Opening ${r.id}`, 'info')}
              announcement={`${deals.length} open deals`}
              page={{ from: 1, to: 6, of: 42, onNext: () => toast('Next page', 'info') }}
            />
          </Card>
          <Card>
            <CardHead title="Recent activity" subtitle="Contacts and deals" />
            <ActivityList items={[
              { time: '14:28', dateTime: '2026-07-24T14:28:00+03:00', children: <><b>Lena Ortiz</b> moved <b>DL-4821</b> to Negotiation</> },
              { time: '13:52', dateTime: '2026-07-24T13:52:00+03:00', children: <>Proposal sent to <b>Kestrel Logistics</b> on <b>DL-4809</b></> },
              { time: '12:10', dateTime: '2026-07-24T12:10:00+03:00', children: <><b>Vantage Foods</b> requested revised terms on <b>DL-4794</b></> },
              { time: '11:03', dateTime: '2026-07-24T11:03:00+03:00', children: <><b>Priya Nair</b> logged a call with <b>Meridian Health</b></> },
              { time: '09:41', dateTime: '2026-07-24T09:41:00+03:00', children: <><b>DL-4771</b> flagged stalled — no reply for 14 days</> },
              { time: '08:57', dateTime: '2026-07-24T08:57:00+03:00', children: <>New lead <b>Arcadia Labs</b> assigned to <b>Sofia Reyes</b></> },
            ]} />
          </Card>
        </Row>
      </Sheet>
    </div>
  );
}
