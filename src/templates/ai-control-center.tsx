// 76° AI agent control center — fleet instrumentation, seed cobalt (ERP posture).
import { useState } from 'react';
import {
  Band,
  BandTopbar,
  BandNav,
  BandSubTabs,
  PageHero,
  Sheet,
  Row,
  Card,
  CardHead,
  StatS1,
  DataTable,
  StatusWord,
  CardTabs,
  ActivityList,
  MeterList,
  Trend,
  Button,
  ButtonLink,
  useToast,
} from '@/components/seventy-six';

const NAV = [
  { label: 'Control center', href: '#control', active: true },
  { label: 'Runs', href: '#runs' },
  { label: 'Models', href: '#models' },
  { label: 'Policies', href: '#policies' },
];

const SUBTABS = [
  { label: 'Live', href: '#live', active: true },
  { label: '24 hours', href: '#day' },
  { label: '7 days', href: '#week' },
];

type Tone = 'ok' | 'neutral' | 'bad';
type Run = { run: string; agent: string; status: string; tone: Tone; latency: string };

const RUNS: Run[] = [
  { run: 'RUN-4821', agent: 'invoice-parser', status: 'Running', tone: 'ok', latency: '1.2s' },
  { run: 'RUN-4809', agent: 'ledger-sync', status: 'Escalated', tone: 'bad', latency: '8.4s' },
  { run: 'RUN-4788', agent: 'crawler-07', status: 'Done', tone: 'ok', latency: '0.9s' },
  { run: 'RUN-4771', agent: 'vision-tag', status: 'Retrying', tone: 'neutral', latency: '3.1s' },
  { run: 'RUN-4762', agent: 'route-planner', status: 'Running', tone: 'ok', latency: '2.0s' },
  { run: 'RUN-4740', agent: 'embed-batch', status: 'Failed', tone: 'bad', latency: '5.5s' },
];

const FILTERS = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'running', label: 'Running', count: 2 },
  { id: 'failed', label: 'Failed', count: 2 },
];

const columns = [
  { key: 'run', header: 'RUN', kind: 'id' as const, render: (r: Run) => r.run },
  { key: 'agent', header: 'AGENT', kind: 'text' as const, render: (r: Run) => r.agent },
  { key: 'status', header: 'STATUS', kind: 'status' as const, render: (r: Run) => <StatusWord tone={r.tone}>{r.status}</StatusWord> },
  { key: 'latency', header: 'LATENCY', kind: 'num' as const, render: (r: Run) => r.latency },
];

const EVENTS = [
  { time: '14:31', dateTime: '2026-07-24T14:31:00+03:00', children: <>Run started <b>RUN-4821</b> on <b>invoice-parser</b></> },
  { time: '14:29', dateTime: '2026-07-24T14:29:00+03:00', children: <>Tool call <b>sql.query</b> by <b>ledger-sync</b></> },
  { time: '14:24', dateTime: '2026-07-24T14:24:00+03:00', children: <>Escalation <b>RUN-4809</b> handed to <b>on-call</b></> },
  { time: '14:20', dateTime: '2026-07-24T14:20:00+03:00', children: <>Completed <b>RUN-4788</b> by <b>crawler-07</b></> },
  { time: '14:15', dateTime: '2026-07-24T14:15:00+03:00', children: <>Retry <b>RUN-4771</b> after timeout on <b>vision-tag</b></> },
  { time: '14:08', dateTime: '2026-07-24T14:08:00+03:00', children: <>Deployed <b>route-planner</b> to the fleet</> },
];

const MODELS = [
  { label: 'Opus', current: 12.4, max: 20, value: '62%', subtitle: '12.4M of 20M tokens · Opus' },
  { label: 'Sonnet', current: 9.8, max: 20, value: '49%', subtitle: '9.8M of 20M tokens · Sonnet' },
  { label: 'Haiku', current: 4.1, max: 12, value: '34%', subtitle: '4.1M of 12M tokens · Haiku' },
  { label: 'Fable', current: 1.9, max: 8, value: '24%', subtitle: '1.9M of 8M tokens · Fable' },
];

const THROUGHPUT = [
  { label: 'Today', data: [820, 960, 1180, 1284, 1210, 1340], tone: 'seed' as const },
  { label: 'Yesterday', data: [760, 880, 1020, 1090, 1150, 1180], tone: 'compare' as const },
];

const AgentsIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="8" cy="5" r="3" /><path d="M2 14a6 6 0 0 1 12 0" />
  </svg>
);
const TokenIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="8" cy="8" r="6" /><path d="M8 5v6M6 7h3.5" />
  </svg>
);
const TaskIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 8h4l2-5 3 10 2-5h1" />
  </svg>
);
const ErrorIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M8 2 1 14h14L8 2z" /><path d="M8 6v4M8 12v.5" />
  </svg>
);

export function AiControlCenter() {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const rows = RUNS.filter((r) => filter === 'all' || (filter === 'running' ? r.status === 'Running' : r.tone === 'bad'));

  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar
          app="Agents"
          nav={<BandNav items={NAV} />}
          utilities={<span className="sv-mono">SEARCH ⌘K</span>}
        />
        <BandSubTabs items={SUBTABS} />
        <PageHero
          headingLevel={1}
          title="Control center"
          context="Live · 18 agents · synced 12s ago"
          actions={
            <>
              <Button variant="ghost" onClick={() => toast('Pausing all 18 agents', 'info')}>Pause all</Button>
              <Button variant="primary" onClick={() => toast('Deploy agent panel opened', 'info')}>Deploy agent</Button>
            </>
          }
        />
      </Band>
      <Sheet aria-label="AI agent control center">
        <Row split="stats" overlap>
          <StatS1 label="ACTIVE AGENTS" value="18" icon={AgentsIcon} footnote={<><b>15</b> running · 3 idle</>} footnoteText="15 running, 3 idle" />
          <StatS1 label="TOKENS · TODAY" value="48.2M" delta={6.1} icon={TokenIcon} footnote={<>$612 of <b>$900</b> budget spent</>} footnoteText="612 of 900 dollar budget spent" />
          <StatS1 label="TASKS · PER HR" value="1,284" delta={4.2} icon={TaskIcon} footnote={<>peak <b>1,510</b> at 09:00</>} footnoteText="peak 1,510 at 09:00" />
          <StatS1 label="ERROR RATE" value="1.4" unit="%" delta={-0.3} deltaSuffix="pt" icon={ErrorIcon} footnote={<><b>23</b> failed of 1,640 runs</>} footnoteText="23 failed of 1,640 runs" />
        </Row>
        <Row split="main">
          <Card>
            <CardHead title="Agent runs" subtitle="Fleet activity for the live window" action={<ButtonLink href="#runs">Open runs</ButtonLink>} />
            <CardTabs mode="filters" tabs={FILTERS} active={filter} onChange={setFilter} />
            <DataTable
              caption="Agent runs in the live window"
              columns={columns}
              rows={rows}
              rowKey={(r) => r.run}
              onRowOpen={(r) => toast(`Opening ${r.run}`, 'info')}
              announcement={`${rows.length} runs shown`}
              page={{ from: 1, to: rows.length, of: 1640 }}
            />
          </Card>
          <Card>
            <CardHead title="Events" subtitle="Latest fleet activity" />
            <ActivityList items={EVENTS} />
          </Card>
        </Row>
        <Row split="main">
          <Card>
            <CardHead title="Model usage" subtitle="Token draw against daily caps" />
            <div className="sv-card__body">
              <MeterList items={MODELS} />
            </div>
          </Card>
          <Card>
            <CardHead title="Throughput" subtitle="Tasks completed per hour" />
            <div className="sv-card__body">
              <Trend
                kind="line"
                legend
                ariaLabel="Throughput trending up, 1,340 tasks/hr today vs 1,180 yesterday"
                series={THROUGHPUT}
                xLabels={['00', '04', '08', '12', '16', '20']}
              />
            </div>
          </Card>
        </Row>
      </Sheet>
    </div>
  );
}
