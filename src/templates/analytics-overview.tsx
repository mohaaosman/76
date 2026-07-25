// 76° analytics overview — seed cobalt.
import { useState } from 'react';
import {
  Band, BandTopbar, BandNav, PageHero, Sheet, Row, Card, CardHead, Avatar,
  StatS1, Trend, CardTabs, DistributionStrip, Tabs, TabPanel, TreeList, Timeline,
  Stepper, MeterList, DataTable, StatusWord, FilterBar, FilterLine, SearchField,
  Select, MenuButton, Button, useToast,
} from '@/components/seventy-six';

const svg = (d: string) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
);
const iImpressions = svg('M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z|M8 9.8A1.8 1.8 0 108 6.2a1.8 1.8 0 000 3.6');
const iClicks = svg('M6 2v3|M2 6h3|M3.2 3.2l2 2|M7 7l7 2.6-3 1.2-1.2 3z');
const iCustomers = svg('M10.5 13.5v-1a2.5 2.5 0 00-2.5-2.5H4a2.5 2.5 0 00-2.5 2.5v1|M6 7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5|M14.5 13.5v-1a2.5 2.5 0 00-2-2.45');
const iSales = svg('M8 1v14|M11 4H6.5a2 2 0 000 4h3a2 2 0 010 4H4');

/* One week of takings per day, four weeks. The peak is the point of the
   chart, so each week names its own — printed, never hovered (B5, C8). */
const WEEKS = [
  { id: 'w1', label: 'Week 1', data: [2140, 3080, 2460, 4120, 1980, 3260, 2410], peak: 3, note: '4 Jul · $4,120', total: '$19,450' },
  { id: 'w2', label: 'Week 2', data: [2610, 2280, 3540, 2960, 3870, 2140, 1890], peak: 4, note: '12 Jul · $3,870', total: '$19,290' },
  { id: 'w3', label: 'Week 3', data: [1980, 2740, 3120, 2880, 4460, 3010, 2260], peak: 4, note: '19 Jul · $4,460', total: '$20,450' },
  { id: 'w4', label: 'Week 4', data: [2450, 3310, 2890, 3620, 4010, 2780, 2070], peak: 4, note: '26 Jul · $4,010', total: '$21,130' },
];
const DAY_LABELS = [
  ['1 JUL', '2 JUL', '3 JUL', '4 JUL', '5 JUL', '6 JUL', '7 JUL'],
  ['8 JUL', '9 JUL', '10 JUL', '11 JUL', '12 JUL', '13 JUL', '14 JUL'],
  ['15 JUL', '16 JUL', '17 JUL', '18 JUL', '19 JUL', '20 JUL', '21 JUL'],
  ['22 JUL', '23 JUL', '24 JUL', '25 JUL', '26 JUL', '27 JUL', '28 JUL'],
];

type Page = { path: string; channel: string; views: string; rate: string; state: string; tone: 'ok' | 'neutral' | 'bad' };
const PAGES: Page[] = [
  { path: '/shop/kettles', channel: 'Organic', views: '18,402', rate: '4.8%', state: 'Healthy', tone: 'ok' },
  { path: '/shop/grinders', channel: 'Paid', views: '14,118', rate: '3.1%', state: 'Healthy', tone: 'ok' },
  { path: '/guides/first-brew', channel: 'Organic', views: '11,960', rate: '0.9%', state: 'Watch', tone: 'neutral' },
  { path: '/shop/filters', channel: 'Referral', views: '8,745', rate: '5.4%', state: 'Healthy', tone: 'ok' },
  { path: '/checkout', channel: 'Direct', views: '6,208', rate: '1.1%', state: 'Degraded', tone: 'bad' },
  { path: '/shop/beans', channel: 'Paid', views: '5,930', rate: '2.7%', state: 'Watch', tone: 'neutral' },
];

const CHANNELS = [
  { id: 'organic', label: 'Organic', meta: '52%', children: [
    { id: 'google', label: 'Google', meta: '44%' },
    { id: 'bing', label: 'Bing', meta: '6%' },
    { id: 'ddg', label: 'DuckDuckGo', meta: '2%' },
  ] },
  { id: 'paid', label: 'Paid', meta: '27%', children: [
    { id: 'gads', label: 'Google Ads', meta: '19%' },
    { id: 'meta', label: 'Meta', meta: '8%' },
  ] },
  { id: 'direct', label: 'Direct', meta: '14%' },
  { id: 'referral', label: 'Referral', meta: '7%', children: [
    { id: 'newsletter', label: 'Partner newsletters', meta: '5%' },
    { id: 'press', label: 'Press', meta: '2%' },
  ] },
];

const BUILD_STEPS = [
  { id: 'collect', label: 'Collect', note: 'Closed 02:06' },
  { id: 'reconcile', label: 'Reconcile', note: '1 mismatch open' },
  { id: 'approve', label: 'Approve' },
  { id: 'publish', label: 'Publish' },
];

export function AnalyticsOverview() {
  const { toast } = useToast();
  const [week, setWeek] = useState('w1');
  const [section, setSection] = useState('acquisition');
  const [query, setQuery] = useState('');
  const [channel, setChannel] = useState('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['organic']));
  const [source, setSource] = useState<string | null>('google');

  const w = WEEKS.findIndex((x) => x.id === week);
  const active = WEEKS[w];
  const peakValue = Math.max(...active.data);
  /* The plot scales to 1.15× the tallest bar, so the four gridlines land on
     these figures. Formatted here, never inside the chart (C9). */
  const yTicks = [0.25, 0.5, 0.75, 1].map((g) => `${((peakValue * 1.15 * g) / 1000).toFixed(1)}K`);

  const q = query.trim().toLowerCase();
  const rows = PAGES.filter(
    (p) => (channel === 'all' || p.channel.toLowerCase() === channel) && p.path.toLowerCase().includes(q),
  );
  const filtersSet = query !== '' || channel !== 'all';

  function clearFilters() {
    setQuery('');
    setChannel('all');
  }

  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar
          app="Analytics"
          nav={<BandNav items={[
            { label: 'Overview', href: '#', active: true },
            { label: 'Audience', href: '#audience' },
            { label: 'Products', href: '#products' },
            { label: 'Payouts', href: '#payouts' },
          ]} />}
          utilities={<>
            <Button variant="ghost" className="sv-mono" aria-label="Search, Command K">SEARCH ⌘K</Button>
            <Avatar name="Rizal Ahmad" size="sm" tone="seed" />
          </>}
        />
        <PageHero
          headingLevel={1}
          title="Overview"
          titleSoft="· July"
          context="1–31 Jul · all channels · synced 4 min ago"
          actions={<>
            <Button variant="ghost" onClick={() => toast('Share link copied for July', 'ok')}>Share July</Button>
            <Button variant="primary" onClick={() => toast('Preparing the July export', 'ok')}>Download July data</Button>
          </>}
        />
      </Band>

      <Sheet aria-label="Analytics overview">
        {/* Every footnote carries a figure the card does not already print
            (Ship Gate 4), and the four reconcile: 1,249,300 × 10.32% =
            128,953 clicks; × 1.11% = 1,428 customers; × $57.65 = $82,320. */}
        <Row split="stats" overlap>
          <StatS1 label="IMPRESSIONS · JULY" value="1,249,300" delta={12.8} icon={iImpressions} footnote={<><b>10.32%</b> clicked through</>} footnoteText="10.32 percent clicked through" />
          <StatS1 label="PRODUCT CLICKS" value="128,953" delta={-0.2} icon={iClicks} footnote={<><b>1.11%</b> reached checkout</>} footnoteText="1.11 percent reached checkout" />
          <StatS1 label="CUSTOMERS" value="1,428" delta={8.3} icon={iCustomers} footnote={<><b>412</b> ordered for the first time</>} footnoteText="412 ordered for the first time" />
          <StatS1 label="SALES · JULY" value="$82,320" delta={11.9} icon={iSales} footnote={<>average order <b>$57.65</b></>} footnoteText="average order 57 dollars 65" />
        </Row>

        <Row split="main">
          <Card>
            <CardHead
              title="Sales report"
              subtitle={`${active.label} · ${active.total} taken`}
              action={<MenuButton
                label="1 JUL – 31 JUL"
                className="sv-mono"
                align="end"
                items={[
                  { label: 'This month', onSelect: () => toast('Range: 1–31 Jul', 'ok') },
                  { label: 'Last month', onSelect: () => toast('Range: 1–30 Jun', 'ok') },
                  { label: 'Quarter to date', onSelect: () => toast('Range: 1 Jul – 31 Jul', 'ok') },
                ]}
              />}
            />
            <CardTabs mode="filters" tabs={WEEKS.map((x) => ({ id: x.id, label: x.label }))} active={week} onChange={setWeek} idBase="sales" />
            <div className="sv-card__body">
              <Trend
                kind="bar"
                ariaLabel={`Daily takings for ${active.label} of July, peaking on ${active.note}, ${active.total} taken across the week`}
                series={[{ label: 'Takings', data: active.data, tone: 'seed' }]}
                xLabels={DAY_LABELS[w]}
                yTicks={yTicks}
                highlight={{ index: active.peak, label: active.note }}
                height={150}
              />
            </div>
          </Card>

          <Card>
            <CardHead title="Devices" subtitle="Product clicks by device · July" />
            <div className="sv-card__body">
              {/* The donut this replaces asked how one total divides. B44
                  answers it in a strip whose legend prints every figure. */}
              <DistributionStrip
                label="DEVICES ACCESSED"
                ariaLabel="128,953 product clicks: mobile 46%, desktop 31%, tablet 15%, other 8%"
                parts={[
                  { label: 'Mobile', value: 59318 },
                  { label: 'Desktop', value: 39975 },
                  { label: 'Tablet', value: 19343 },
                  { label: 'Other', value: 10317 },
                ]}
              />
            </div>
          </Card>
        </Row>

        {/* The stats stay put; these tabs switch only the analysis under
            them. Nothing here deserves a URL — that would be band nav. */}
        <Row split="full">
          <Tabs
            label="Analysis sections"
            idBase="analysis"
            active={section}
            onChange={setSection}
            tabs={[
              { id: 'acquisition', label: 'Acquisition', count: 6 },
              { id: 'behaviour', label: 'Behaviour' },
              { id: 'pipeline', label: 'Pipeline' },
            ]}
          />
        </Row>

        <TabPanel idBase="analysis" tabId="acquisition" active={section === 'acquisition'}>
          <Row split="main">
            <Card>
              <CardHead title="Landing pages" subtitle="Entry point, by views" />
              <FilterBar
                label="Filter landing pages"
                active={filtersSet}
                onClearAll={clearFilters}
                controls={<>
                  <SearchField
                    label="Search landing pages"
                    labelHidden
                    placeholder="Search by path"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <Select label="Channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
                    <option value="all">All channels</option>
                    <option value="organic">Organic</option>
                    <option value="paid">Paid</option>
                    <option value="direct">Direct</option>
                    <option value="referral">Referral</option>
                  </Select>
                </>}
              />
              <FilterLine
                count={`${rows.length} of ${PAGES.length}`}
                filters={[
                  ...(channel === 'all' ? [] : [{ label: 'Channel', value: channel[0].toUpperCase() + channel.slice(1) }]),
                  { label: 'Period', value: 'July' },
                ]}
                onClearAll={clearFilters}
              />
              <DataTable
                caption="Landing pages by views"
                rowKey={(r) => r.path}
                rows={rows}
                announcement={`${rows.length} landing pages shown`}
                page={{ from: 1, to: rows.length, of: 212 }}
                columns={[
                  { key: 'path', header: 'PATH', kind: 'id', render: (r) => r.path },
                  { key: 'channel', header: 'CHANNEL', kind: 'text', render: (r) => r.channel },
                  { key: 'state', header: 'STATE', kind: 'status', render: (r) => <StatusWord tone={r.tone}>{r.state}</StatusWord> },
                  { key: 'rate', header: 'CONV.', kind: 'num', render: (r) => r.rate },
                  { key: 'views', header: 'VIEWS', kind: 'num', render: (r) => r.views },
                ]}
              />
            </Card>

            <Card>
              <CardHead title="Channels" subtitle="Share of 1,249,300 impressions" />
              <div className="sv-card__body">
                <TreeList
                  label="Channels by share of impressions"
                  nodes={CHANNELS}
                  expanded={expanded}
                  onExpandedChange={setExpanded}
                  selected={source}
                  onSelect={(id) => setSource(id)}
                />
              </div>
            </Card>
          </Row>
        </TabPanel>

        <TabPanel idBase="analysis" tabId="behaviour" active={section === 'behaviour'}>
          <Row split="main">
            <Card>
              <CardHead title="Checkout funnel" subtitle="July · every session that reached the shop" />
              <div className="sv-card__body">
                <MeterList
                  items={[
                    { label: 'Viewed a product', current: 128953, max: 128953, value: '100%', subtitle: '128,953 of 128,953 clicks' },
                    { label: 'Added to basket', current: 21360, max: 128953, value: '16.6%', subtitle: '21,360 of 128,953 clicks' },
                    { label: 'Started checkout', current: 4104, max: 128953, value: '3.2%', subtitle: '4,104 of 128,953 clicks' },
                    { label: 'Paid', current: 1428, max: 128953, value: '1.1%', subtitle: '1,428 of 128,953 clicks' },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <CardHead title="Session length" subtitle="Share of 41,820 sessions" />
              <div className="sv-card__body">
                <DistributionStrip
                  label="SESSIONS BY LENGTH"
                  ariaLabel="41,820 sessions: under a minute 38%, one to five minutes 34%, five to fifteen 19%, over fifteen 9%"
                  parts={[
                    { label: 'Under 1 min', value: 15892 },
                    { label: '1–5 min', value: 14219 },
                    { label: '5–15 min', value: 7946 },
                    { label: 'Over 15 min', value: 3763 },
                  ]}
                />
              </div>
            </Card>
          </Row>
        </TabPanel>

        <TabPanel idBase="analysis" tabId="pipeline" active={section === 'pipeline'}>
          <Row split="main">
            <Card>
              <CardHead title="Nightly build" subtitle="Run 2026-07-25 · one record's life" />
              <div className="sv-card__body">
                <Timeline
                  items={[
                    { id: 'queued', group: '25 JUL', time: '02:00', dateTime: '2026-07-25T02:00:00+03:00', title: 'Run queued', actor: 'scheduler' },
                    { id: 'extract', time: '02:01', dateTime: '2026-07-25T02:01:00+03:00', title: 'Extract complete', body: '1,249,300 impressions read from four sources.', actor: 'etl-worker-1' },
                    { id: 'reconcile', time: '02:06', dateTime: '2026-07-25T02:06:00+03:00', title: 'Reconciliation mismatch', tone: 'bad', body: 'Paid clicks differ from the ad network by 118. Re-pull the Meta day file, then re-run reconcile.', actor: 'etl-worker-3' },
                    { id: 'approve', time: '09:00', title: 'Approval expected', tone: 'pending' },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <CardHead title="Publication" subtitle="July close · four steps" />
              <div className="sv-card__body">
                <Stepper label="July close progress" current={1} steps={BUILD_STEPS} />
              </div>
            </Card>
          </Row>
        </TabPanel>
      </Sheet>
    </div>
  );
}
