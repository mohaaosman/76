/* 76° · screen: deal record · gate: pass */
// 76° template · one deal, opened from its list — seed verdigris.
//
// THE RECORD AS A RELATIONSHIP. `erp-purchase-order` drew the record page
// as a document — identity, lines, totals. A deal has no lines. What it has
// is a conversation, a handful of facts and a history of where it has been,
// and the person who owns it lives inside all three at once. This screen
// holds them on one page:
//
//  1 · B62 `MessageThread` states the correspondence, oldest first, with
//      direction in words. It owns no composer, so the screen composes one
//      under it from a B11 multiline field and a B10 Button — and owns the
//      sending, the validation and the draft, exactly as B62 requires.
//  2 · B28 states the facts and a B21 Drawer edits them (the B28 pairing
//      `erp-purchase-order` established), with B52 at the head of the form.
//  3 · F13 is answered in the facts, not above the title: the list this
//      deal was opened from is the LIST row of its DescriptionList, a link
//      the reader can follow, never a trail of chevrons.
//
// It is DL-4809 from `crm-deal-board`, and the two screens agree: Kestrel
// Logistics, Tom Reyes, $146,900, 12 days in Proposal, review on 29 JUL.
// The board's "today" is 25 JUL 2026 (Bluepeak's 41 days since 14 JUN), so
// it is this page's today as well, and every date below precedes it.
import { useEffect, useRef, useState } from 'react';
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
  DescriptionList,
  MessageThread,
  Timeline,
  Drawer,
  Field,
  NumberField,
  Select,
  ErrorSummary,
  StatusWord,
  Delta,
  Avatar,
  Button,
  ButtonLink,
  MenuButton,
} from '@/components/seventy-six';
import type { FieldError, ThreadMessage, TimelineItem, StatusTone } from '@/components/seventy-six';
import './crm-deal.css';

/* The board's own navigation, so the reader arrives in the same Band they
   left: Pipeline stays the section, and DEALS is the sub-tab a single deal
   lives under. Where the reader is, is the Band's job (F13). */
const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Pipeline', href: '#pipeline', active: true },
  { label: 'Accounts', href: '#accounts' },
  { label: 'Activity', href: '#activity' },
];

const subTabs = [
  { label: 'DASHBOARD', href: '#dashboard' },
  { label: 'BOARD', href: '#board' },
  { label: 'DEALS', href: '#deals', active: true },
  { label: 'FORECAST', href: '#forecast' },
];

type StageId = 'qualify' | 'proposal' | 'negotiation' | 'closing' | 'won';

const STAGES: { id: StageId; label: string }[] = [
  { id: 'qualify', label: 'Qualify' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closing', label: 'Closing' },
  { id: 'won', label: 'Won' },
];

const stageLabel = (id: StageId) => STAGES.find((s) => s.id === id)?.label ?? id;
const nextStage = (id: StageId) => STAGES[STAGES.findIndex((s) => s.id === id) + 1];

const OWNERS = ['Tom Reyes', 'Ada Iyer'];

/* The figures reconcile by hand. The first proposal priced two depots at
   $135,800 over 36 months; Leeds was added as a cross-dock on the smaller
   tier for $11,100, which makes $146,900 — the board's figure — and the
   Delta's 8.2% is 11,100 ÷ 135,800. */
const FIRST_QUOTE = 135800;
const TODAY = '2026-07-25';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const pct = (n: number) => Math.round(((n - FIRST_QUOTE) / FIRST_QUOTE) * 1000) / 10;
const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .toUpperCase();

/* All times BST (+01:00), oldest first. Every message precedes 25 JUL. */
const THREAD: ThreadMessage[] = [
  {
    id: 'm1',
    day: 'MON 13 JUL 2026',
    author: 'Tom Reyes',
    direction: 'outbound',
    time: '13 JUL · 09:52',
    dateTime: '2026-07-13T09:52:00+01:00',
    body: [
      'Priya, the proposal for the Daventry and Corby depots is attached: $135,800 over 36 months, implementation included.',
      'Happy to walk your team through it whenever suits.',
    ],
    attachments: [{ name: 'P-4809-v1.pdf', meta: 'PDF · 412 KB' }],
  },
  {
    id: 'm2',
    day: 'WED 15 JUL 2026',
    author: 'Priya Shah',
    direction: 'inbound',
    time: '15 JUL · 14:18',
    dateTime: '2026-07-15T14:18:00+01:00',
    body: 'Thanks, Tom. We would like the Leeds cross-dock included from day one. Can you re-price with all three sites?',
  },
  {
    id: 'n1',
    day: 'TUE 21 JUL 2026',
    author: 'Tom Reyes',
    direction: 'note',
    time: '21 JUL · 10:05',
    dateTime: '2026-07-21T10:05:00+01:00',
    body: 'Finance approved Leeds on the cross-dock tier: $11,100 over the term. Do not discount the two depots to make room for it.',
  },
  {
    id: 'm3',
    author: 'Tom Reyes',
    direction: 'outbound',
    time: '21 JUL · 11:20',
    dateTime: '2026-07-21T11:20:00+01:00',
    body: 'The revised proposal adds the Leeds cross-dock: $146,900 over 36 months, $11,100 above the first version. Service levels are unchanged.',
    attachments: [{ name: 'P-4809-v2.pdf', meta: 'PDF · 436 KB' }],
  },
  {
    id: 'm4',
    day: 'FRI 24 JUL 2026',
    author: 'Priya Shah',
    direction: 'inbound',
    time: '24 JUL · 16:05',
    dateTime: '2026-07-24T16:05:00+01:00',
    body: [
      'That works for us. Our finance director wants to go through the terms on 29 July before we sign off.',
      'Can you join at 10:00?',
    ],
  },
];

const HISTORY: TimelineItem[] = [
  {
    id: 'h1',
    group: '02 JUL',
    time: '02 JUL · 10:14',
    dateTime: '2026-07-02T10:14',
    title: 'Deal created in Qualify',
    body: 'From an inbound enquiry about the Daventry and Corby depots.',
    actor: 'T. REYES',
    tone: 'done',
  },
  {
    id: 'h2',
    group: '13 JUL',
    time: '13 JUL · 09:40',
    dateTime: '2026-07-13T09:40',
    title: 'Moved to Proposal',
    body: 'Budget confirmed; first proposal at $135,800 for two depots.',
    actor: 'T. REYES',
    tone: 'done',
  },
  {
    id: 'h3',
    group: '21 JUL',
    time: '21 JUL · 11:20',
    dateTime: '2026-07-21T11:20',
    title: 'Value revised to $146,900',
    body: 'Leeds cross-dock added at $11,100 over the term.',
    actor: 'T. REYES',
    tone: 'done',
  },
];

interface Facts {
  owner: string;
  amount: number;
  close: string;
  next: string;
}

const START: Facts = {
  owner: 'Tom Reyes',
  amount: 146900,
  close: '2026-09-30',
  next: 'Proposal review with finance · 29 JUL 10:00',
};

const stageTone = (id: StageId): StatusTone => (id === 'won' ? 'ok' : 'neutral');

export function CrmDeal() {
  const [facts, setFacts] = useState<Facts>(START);
  const [stage, setStage] = useState<StageId>('proposal');
  const [history, setHistory] = useState<TimelineItem[]>(HISTORY);

  /* ---- the thread and its composer ---- */
  const [messages, setMessages] = useState<ThreadMessage[]>(THREAD);
  const [mode, setMode] = useState<'reply' | 'note'>('reply');
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* ---- the Drawer ---- */
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Facts>(START);
  const [errors, setErrors] = useState<FieldError[]>([]);

  const stamp = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return {
      time: `25 JUL · ${hh}:${mm}`,
      dateTime: `${TODAY}T${hh}:${mm}:00+01:00`,
      group: '25 JUL',
    };
  };

  function log(title: string, body: string) {
    const s = stamp();
    setHistory((h) => [
      ...h,
      {
        id: `h${h.length + 1}`,
        group: h.some((i) => i.group === s.group) ? undefined : s.group,
        time: s.time,
        dateTime: s.dateTime.slice(0, 16),
        title,
        body,
        actor: 'T. REYES',
        tone: 'done',
      },
    ]);
  }

  /* The message is appended at once with status 'sending', so the reader
     sees what they sent where it will live; the status word clears when the
     send resolves. B62 announces the change through its live region. */
  function send() {
    if (draft.trim().length === 0) {
      setDraftError(
        mode === 'reply' ? 'Write the reply before sending it.' : 'Write the note before adding it.',
      );
      return;
    }
    const s = stamp();
    const id = `c${messages.length + 1}`;
    const first = !messages.some((m) => m.day === 'SAT 25 JUL 2026');
    setMessages((list) => [
      ...list,
      {
        id,
        day: first ? 'SAT 25 JUL 2026' : undefined,
        author: facts.owner,
        direction: mode === 'reply' ? 'outbound' : 'note',
        time: s.time,
        dateTime: s.dateTime,
        body: draft.trim(),
        status: mode === 'reply' ? 'sending' : undefined,
      },
    ]);
    setDraft('');
    setDraftError(undefined);
    if (mode === 'note') return;
    setSending(true);
    timer.current = window.setTimeout(() => {
      setMessages((list) => list.map((m) => (m.id === id ? { ...m, status: undefined } : m)));
      setSending(false);
    }, 1200);
  }

  function openEdit() {
    setForm(facts);
    setErrors([]);
    setEditing(true);
  }

  /* The rules are the template's; B52 renders the index it is handed. Each
     message states what failed and how to fix it, and repeats at its field. */
  function save() {
    const found: FieldError[] = [];
    if (form.amount <= 0) {
      found.push({
        fieldId: 'deal-value',
        label: 'Value',
        message: 'Value must be above $0. Enter the total over the contract term.',
      });
    }
    if (!form.close) {
      found.push({
        fieldId: 'deal-close',
        label: 'Expected close',
        message: 'Choose an expected close date.',
      });
    } else if (form.close <= TODAY) {
      found.push({
        fieldId: 'deal-close',
        label: 'Expected close',
        message: 'Expected close must fall after 25 JUL 2026. Choose a later date or mark the deal lost.',
      });
    }
    if (form.next.trim().length < 4) {
      found.push({
        fieldId: 'deal-next',
        label: 'Next step',
        message: 'State the next step and its date, so the owner knows what is due.',
      });
    }
    setErrors(found);
    if (found.length > 0) return;

    const changes: string[] = [];
    if (form.amount !== facts.amount) changes.push(`value ${usd(facts.amount)} to ${usd(form.amount)}`);
    if (form.close !== facts.close)
      changes.push(`close ${shortDate(facts.close)} to ${shortDate(form.close)}`);
    if (form.owner !== facts.owner) changes.push(`owner ${facts.owner} to ${form.owner}`);
    if (form.next.trim() !== facts.next) changes.push('next step restated');
    if (changes.length > 0) log('Deal edited', `Changed ${changes.join(', ')}.`);
    setFacts({ ...form, next: form.next.trim() });
    setEditing(false);
  }

  function advance() {
    const to = nextStage(stage);
    if (!to) return;
    log(`Moved to ${to.label}`, `From ${stageLabel(stage)}, at ${usd(facts.amount)}.`);
    setStage(to.id);
  }

  const to = nextStage(stage);
  const ferr = (id: string) => errors.find((e) => e.fieldId === id)?.message;
  const delta = pct(facts.amount);
  const visible = messages.filter((m) => m.direction !== 'note').length;
  const notes = messages.length - visible;
  const last = [...messages].reverse().find((m) => m.direction === 'inbound');

  return (
    <div data-seed="verdigris">
      <Band>
        <BandTopbar app="Revenue" nav={<BandNav items={nav} />} />
        <BandSubTabs items={subTabs} />
        <PageHero
          title="Kestrel Logistics"
          titleSoft="· DL-4809"
          context={`${stageLabel(stage)} · ${usd(facts.amount)} · owner ${facts.owner} · last reply ${last?.time ?? 'none'}`}
          actions={
            <>
              <Button variant="ghost" onClick={openEdit}>
                Edit deal
              </Button>
              <MenuButton
                label="More"
                align="end"
                items={[
                  { label: 'Log a call', onSelect: () => undefined },
                  { label: 'Duplicate deal', onSelect: () => undefined },
                  'separator',
                  {
                    label: 'Mark deal lost',
                    onSelect: () => undefined,
                    danger: true,
                  },
                ]}
              />
              {to && (
                <Button variant="primary" onClick={advance}>
                  {to.id === 'won' ? 'Mark deal won' : `Move deal to ${to.label}`}
                </Button>
              )}
            </>
          }
        />
      </Band>

      <Sheet aria-label="Deal DL-4809 · Kestrel Logistics">
        <Row overlap split="main">
          <Card>
            <CardHead
              title="Conversation"
              subtitle={`Priya Shah, Head of Operations · ${visible} messages, ${notes} internal ${notes === 1 ? 'note' : 'notes'}`}
              action={<ButtonLink href="#files">All files</ButtonLink>}
            />
            {/* B62 carries no inset; the composer is B11 chrome, so both
                take the card's padded body (rule 18). */}
            <div className="sv-card__body">
              <MessageThread label="Conversation with Kestrel Logistics" messages={messages} />
            </div>
            <div className="sv-card__body">
              <div className="crm-deal__composer crm-deal__stack">
                {/* B11's multiline field, composed from its own chrome: label
                  above, hint, error below, aria-describedby wired to both. */}
                <div className="sv-field">
                  <label className="sv-field__label" htmlFor="deal-reply">
                    {mode === 'reply' ? 'Reply to Priya Shah' : 'Internal note'}
                  </label>
                  <p className="sv-field__hint" id="deal-reply-hint">
                    {mode === 'reply'
                      ? 'Sent by email from the deal owner. Kestrel sees it.'
                      : 'Stays inside Revenue. Kestrel never sees a note.'}
                  </p>
                  <textarea
                    id="deal-reply"
                    rows={3}
                    className={`sv-field__input${draftError ? ' sv-field__input--error' : ''}`}
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      if (draftError && e.target.value.trim()) setDraftError(undefined);
                    }}
                    aria-invalid={draftError ? true : undefined}
                    aria-describedby={draftError ? 'deal-reply-hint deal-reply-error' : 'deal-reply-hint'}
                  />
                  {draftError && (
                    <p className="sv-field__error" id="deal-reply-error">
                      {draftError}
                    </p>
                  )}
                </div>
                <div className="crm-deal__send">
                  <Select
                    label="Send as"
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value as 'reply' | 'note');
                      setDraftError(undefined);
                    }}
                  >
                    <option value="reply">Reply to Kestrel</option>
                    <option value="note">Internal note</option>
                  </Select>
                  <Button variant="ghost" onClick={send} isLoading={sending} loadingLabel="Sending reply">
                    {mode === 'reply' ? 'Send reply' : 'Add note'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* The second track holds two cards, one job each: the facts and
              their history. */}
          <div className="crm-deal__stack">
            <Card>
              <CardHead
                title="The deal"
                subtitle="Stated here, edited in the Drawer"
                action={<ButtonLink href="#account">Open account</ButtonLink>}
              />
              {/* F13: the list this deal came from is a FACT with a link, not
                a breadcrumb above the title. */}
              <DescriptionList
                rows={[
                  { term: 'DEAL', kind: 'id', children: 'DL-4809' },
                  {
                    term: 'ACCOUNT',
                    children: <a href="#account">Kestrel Logistics · ACC-0317</a>,
                  },
                  {
                    term: 'OWNER',
                    children: (
                      <>
                        <Avatar name={facts.owner} size="sm" /> {facts.owner}
                      </>
                    ),
                  },
                  {
                    term: 'STAGE',
                    children: <StatusWord tone={stageTone(stage)}>{stageLabel(stage)}</StatusWord>,
                  },
                  {
                    term: 'VALUE',
                    kind: 'num',
                    children: (
                      <>
                        {usd(facts.amount)} {delta !== 0 && <Delta value={delta} against="first quote" />}
                      </>
                    ),
                  },
                  { term: 'EXPECTED CLOSE', children: shortDate(facts.close) },
                  { term: 'NEXT STEP', children: facts.next },
                  {
                    term: 'LIST',
                    children: <a href="#board">Pipeline board · {stageLabel(stage)}</a>,
                  },
                ]}
              />
            </Card>

            <Card>
              <CardHead title="Stage history" subtitle="This deal, in order" />
              {/* B41 draws a rail, not hairline rows: it takes the padded body. */}
              <div className="sv-card__body">
                <Timeline
                  items={[
                    ...history,
                    ...(stage !== 'won'
                      ? [
                          {
                            id: 'hx',
                            group: 'EXPECTED',
                            time: '29 JUL · 10:00',
                            dateTime: '2026-07-29T10:00',
                            title: 'Proposal review',
                            body: 'Terms with Kestrel’s finance director, as Priya asked on 24 JUL.',
                            tone: 'pending' as const,
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            </Card>
          </div>
        </Row>
      </Sheet>

      <Drawer
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit deal"
        context="DL-4809 · Kestrel Logistics"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save}>
              Save deal
            </Button>
          </>
        }
      >
        <div className="crm-deal__stack">
          <ErrorSummary errors={errors} />
          <NumberField
            id="deal-value"
            label="Value"
            value={form.amount}
            onValueChange={(v) => setForm((f) => ({ ...f, amount: v }))}
            min={0}
            max={5000000}
            step={100}
            unit="USD"
            hint={`Total over the term. The first quote was ${usd(FIRST_QUOTE)}.`}
            error={ferr('deal-value')}
          />
          <Field
            id="deal-close"
            type="date"
            label="Expected close"
            hint="Q3 closes 30 SEP 2026"
            value={form.close}
            onChange={(e) => setForm((f) => ({ ...f, close: e.target.value }))}
            error={ferr('deal-close')}
          />
          <Select
            id="deal-owner"
            label="Owner"
            value={form.owner}
            onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
          >
            {OWNERS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <Field
            id="deal-next"
            label="Next step"
            hint="What is due, and when"
            value={form.next}
            onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
            error={ferr('deal-next')}
          />
        </div>
      </Drawer>
    </div>
  );
}
