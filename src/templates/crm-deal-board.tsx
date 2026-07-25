/* 76° · screen: deal board · gate: pass */
// 76° template · the pipeline as a board — seed verdigris.
//
// F2 REFUSES THE KANBAN BOARD WIDGET and answers it with "a template (the
// CRM already has one)". It did not: `crm-pipeline` is a dashboard — stats,
// a stage meter, a momentum trend and a table of top deals. F2 has been
// citing a screen that was never drawn. This is that screen, and F2 stands
// completely unamended: there is no board COMPONENT here, only four stage
// cards, each holding a B7 DataTable of the deals in it.
//
// **A deal moves by a named verb, never by drag.** F10 refuses drag-and-drop
// dashboard layout and its reasoning reaches this screen intact: a drag
// target has no keyboard equivalent, no accessible name, and no state a
// screen reader can report mid-gesture. Opening a deal gives it a Select and
// one primary that names the act — which works from the keyboard, states
// where the deal is going before it goes, and can be undone by doing it again.
//
// The columns are four because B2's canonical stats split IS four, and it
// already knows how to become 2×2 below 1000px and single file below 560px.
// A fifth stage would need a fifth track that the grid does not have, and a
// board that scrolls sideways is the thing A2 refuses on every nav-like row.
// "Stalled" is therefore a CONDITION, stated in a Banner above the board,
// not a fifth column deals go to die in.
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
  DataTable,
  DescriptionList,
  Drawer,
  Banner,
  Select,
  StatusWord,
  Avatar,
  Button,
  ButtonLink,
  FilterBar,
  FilterLine,
  SearchField,
} from '@/components/seventy-six';
import type { Column } from '@/components/seventy-six';

const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Pipeline', href: '#pipeline', active: true },
  { label: 'Accounts', href: '#accounts' },
  { label: 'Activity', href: '#activity' },
];

const subTabs = [
  { label: 'DASHBOARD', href: '#dashboard' },
  { label: 'BOARD', href: '#board', active: true },
  { label: 'FORECAST', href: '#forecast' },
];

type StageId = 'qualify' | 'proposal' | 'negotiation' | 'closing';

interface Deal {
  id: string;
  account: string;
  owner: string;
  value: string;
  amount: number;
  age: string;
  next: string;
  stalled?: boolean;
}

const STAGES: { id: StageId; label: string }[] = [
  { id: 'qualify', label: 'Qualify' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closing', label: 'Closing' },
];

/* Every column total is the sum of its own rows, and the pipeline line in
   the hero is the sum of the four — Ship Gate 12 is checkable by hand. */
const BOARD: Record<StageId, Deal[]> = {
  qualify: [
    { id: 'DL-4788', account: 'Meridian Health', owner: 'Ada Iyer', value: '$98,600', amount: 98600, age: '9 days in stage', next: 'Discovery call · 28 JUL' },
    { id: 'DL-4802', account: 'Corvus Freight', owner: 'Ada Iyer', value: '$54,300', amount: 54300, age: '4 days in stage', next: 'Requirements sent' },
    { id: 'DL-4815', account: 'Pallas Media', owner: 'Tom Reyes', value: '$41,900', amount: 41900, age: '2 days in stage', next: 'Awaiting budget confirmation' },
  ],
  proposal: [
    { id: 'DL-4809', account: 'Kestrel Logistics', owner: 'Tom Reyes', value: '$146,900', amount: 146900, age: '12 days in stage', next: 'Proposal review · 29 JUL' },
    { id: 'DL-4760', account: 'Arcadia Labs', owner: 'Ada Iyer', value: '$63,750', amount: 63750, age: '18 days in stage', next: 'Security questionnaire returned' },
  ],
  negotiation: [
    { id: 'DL-4821', account: 'Northwind Trading', owner: 'Ada Iyer', value: '$182,400', amount: 182400, age: '7 days in stage', next: 'Redlines with legal' },
    { id: 'DL-4771', account: 'Bluepeak Retail', owner: 'Tom Reyes', value: '$74,200', amount: 74200, age: '41 days in stage', next: 'No reply since 14 JUN', stalled: true },
  ],
  closing: [
    { id: 'DL-4794', account: 'Vantage Foods', owner: 'Tom Reyes', value: '$121,050', amount: 121050, age: '3 days in stage', next: 'Signature out · 26 JUL' },
  ],
};

const money = (n: number) => `$${Math.round(n / 1000).toLocaleString()}K`;
const stageTotal = (id: StageId) => BOARD[id].reduce((sum, deal) => sum + deal.amount, 0);

/* Two columns, and the restraint is deliberate: a 296px card at 1280px will
   hold an account and a figure without scrolling, and a third column would
   make every card on the board scroll on a desktop. The state that would
   have been that column is a CONDITION, and it is stated in the Banner. */
const columns: Column<Deal>[] = [
  { key: 'account', header: 'ACCOUNT', render: (d) => d.account },
  { key: 'value', header: 'VALUE', kind: 'num', render: (d) => d.value },
];

export function CrmDealBoard() {
  const [open, setOpen] = useState<Deal | null>(null);
  const [openStage, setOpenStage] = useState<StageId>('qualify');
  const [owner, setOwner] = useState('all');
  const [query, setQuery] = useState('');

  function openDeal(deal: Deal, stage: StageId) {
    setOpen(deal);
    setOpenStage(stage);
  }

  const filtersActive = owner !== 'all' || query.trim() !== '';
  const stalled = STAGES.flatMap((s) => BOARD[s.id]).filter((d) => d.stalled);

  return (
    <div data-seed="verdigris">
      <Band>
        <BandTopbar app="Revenue" nav={<BandNav items={nav} />} />
        <BandSubTabs items={subTabs} />
        <PageHero
          title="Pipeline"
          titleSoft="· board"
          context="8 open deals · $783,100 across four stages · Q3 to 30 SEP"
          actions={
            <>
              <ButtonLink href="#forecast">Forecast</ButtonLink>
              <Button variant="primary">New deal</Button>
            </>
          }
        />
      </Band>

      <Sheet aria-label="Pipeline board">
        <Row overlap>
          <Card>
            <CardHead
              title="Open pipeline"
              subtitle="Four stages · a deal moves by a named verb, never by drag"
              action={<ButtonLink href="#saved">Saved views</ButtonLink>}
            />
            {/* CardTabs would switch presets, FilterBar SETS and FilterLine
                STATES — the division is binding, and a board card carries the
                same three as a table card because they are a layout, not a
                table feature (B7 v0.4.0 amendment). */}
            <FilterBar
              label="Filter deals"
              active={filtersActive}
              onClearAll={() => {
                setOwner('all');
                setQuery('');
              }}
              controls={
                <>
                  <SearchField
                    label="Filter deals"
                    labelHidden
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Account or deal ID"
                  />
                  <Select
                    label="Owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  >
                    <option value="all">All owners</option>
                    <option value="ada">Ada Iyer</option>
                    <option value="tom">Tom Reyes</option>
                  </Select>
                </>
              }
            />
            <FilterLine
              count="8 of 8"
              filters={filtersActive ? [{ label: 'Owner', value: owner === 'all' ? 'All' : owner }] : []}
              onClearAll={() => {
                setOwner('all');
                setQuery('');
              }}
            />
          </Card>
        </Row>

        {stalled.length > 0 && (
          <Row>
            {/* "Stalled" is a condition, not a fifth column. A stage a deal
                enters and never leaves is a graveyard the board makes look
                like progress; a Banner names the deal and its silence. */}
            <Banner
              tone="warn"
              title={stalled.length === 1 ? 'One deal stalled' : `${stalled.length} deals stalled`}
              action={<ButtonLink href="#stalled">Review stalled deals</ButtonLink>}
            >
              {stalled.map((d) => `${d.id} · ${d.account}`).join(' · ')} has had no reply since 14
              June, at 41 days in Negotiation against a 21-day stage target.
            </Banner>
          </Row>
        )}

        <Row split="stats">
          {STAGES.map((stage) => (
            <Card key={stage.id} as="section">
              <CardHead
                title={stage.label}
                subtitle={`${BOARD[stage.id].length} ${
                  BOARD[stage.id].length === 1 ? 'deal' : 'deals'
                } · ${money(stageTotal(stage.id))}`}
              />
              <DataTable
                caption={`Deals in ${stage.label}`}
                columns={columns}
                rows={BOARD[stage.id]}
                rowKey={(d) => d.id}
                onRowOpen={(d) => openDeal(d, stage.id)}
                announcement={`${BOARD[stage.id].length} deals in ${stage.label}`}
                totals={[
                  { label: 'STAGE', cells: { value: money(stageTotal(stage.id)) }, strong: true },
                ]}
              />
            </Card>
          ))}
        </Row>
      </Sheet>

      {/* The move, as a decision beside the work rather than a gesture over
          it: the Drawer states the deal, offers the stage as a Select, and
          spends its ONE primary on the verb that names the act. */}
      <Drawer
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open?.account ?? ''}
        context={open ? `${open.id} · ${open.owner}` : undefined}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(null)}>
              Move deal to {STAGES.find((s) => s.id === openStage)?.label}
            </Button>
          </>
        }
      >
        {open && (
          <>
            <DescriptionList
              rows={[
                { term: 'DEAL', kind: 'id', children: open.id },
                { term: 'ACCOUNT', children: open.account },
                {
                  term: 'OWNER',
                  children: (
                    <>
                      <Avatar name={open.owner} size="sm" /> {open.owner}
                    </>
                  ),
                },
                { term: 'VALUE', kind: 'num', children: open.value },
                { term: 'AGE', children: open.age },
                {
                  term: 'STATE',
                  children: open.stalled ? (
                    <StatusWord tone="bad">Stalled</StatusWord>
                  ) : (
                    <StatusWord tone="ok">Active</StatusWord>
                  ),
                },
                { term: 'NEXT', children: open.next },
              ]}
            />
            <Select
              label="Stage"
              hint="The deal moves when you confirm below — nothing changes while you are choosing."
              value={openStage}
              onChange={(e) => setOpenStage(e.target.value as StageId)}
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </>
        )}
      </Drawer>
    </div>
  );
}
