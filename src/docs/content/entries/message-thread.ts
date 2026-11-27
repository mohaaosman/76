import type { DocEntry } from '../types';

export const messageThreadEntry: DocEntry = {
  slug: 'message-thread',
  name: 'MessageThread',
  book: 'B62',
  category: 'widgets',
  tagline: 'One conversation — every message attributed to a person and marked with its direction, in words.',
  job: 'State one conversation as an ordered list of messages, each attributed to a person and marked with its direction.',
  tags: ['message', 'thread', 'conversation', 'email', 'inbox', 'crm', 'note', 'reply', 'correspondence'],
  exports: ['MessageThread', 'ThreadMessage', 'ThreadAttachment', 'MessageDirection'],
  files: ['components/seventy-six/message-thread.tsx', 'components/seventy-six/message-thread.css'],
  registryDeps: ['avatar', 'status-word'],
  intro: [
    'The record page as a relationship: what the customer wrote, what you sent back, and what your team said to each other in between. Each message is an <code>&lt;article&gt;</code> inside an ordered list — author in bold, an absolute mono timestamp, the direction stated as a word, the body as paragraphs, any files as mono rows.',
    '<b>It is not B41 Timeline, and B41 says so itself.</b> A Timeline row is one sentence, never interactive, and its tones are lifecycle — done, pending, failed. A message is several paragraphs, may carry files, and its mark is <b>direction</b>: received, sent, or an internal note the other party never sees. Nor is it B9 ActivityList, a flat feed across many records.',
    '<b>Direction is stated in words (C5).</b> RECEIVED, SENT and INTERNAL NOTE sit in mono beside the author. The surface repeats it — sent sits on the one permitted <code>--sv-seed-tint</code> panel, indented from the start edge; a note is hairline-framed with no surface — but alignment and tint are rhythm, never the only carrier. The indent is <code>margin-inline-start</code>, so an Arabic thread mirrors on its own.',
    '<b>It has no composer.</b> The reply box is a B11 multiline Field and a B10 Button, composed by the screen under the thread. A thread that owned its input would own sending, drafts and validation, and that is a screen.',
  ],
  examples: [
    {
      title: 'A conversation',
      description: 'Received and sent, oldest first, one attachment.',
      demoKey: 'thread-basic',
      surface: 'paper',
      code: `import { MessageThread } from '@/components/seventy-six';

<MessageThread
  label="Conversation with Halden Logistics"
  messages={[
    {
      id: 'm1',
      author: 'Jonas Brandt',
      direction: 'inbound',
      time: '16 NOV · 09:12',
      dateTime: '2026-11-16T09:12:00+01:00',
      body: [
        'We have reviewed the proposal for the three Rotterdam sites. The per-pallet rate works for us; the 36-month term does not.',
        'Can you price a 24-month term with the same service levels?',
      ],
    },
    {
      id: 'm2',
      author: 'Mara Lind',
      direction: 'outbound',
      time: '16 NOV · 11:05',
      dateTime: '2026-11-16T11:05:00+01:00',
      body: 'A 24-month term is possible at €0.94 per pallet position. The revised quote is attached.',
      attachments: [{ name: 'Q-2291-rev2.pdf', meta: 'PDF · 184 KB', href: '/files/q-2291-rev2.pdf' }],
    },
  ]}
/>`,
    },
    {
      title: 'On the record page',
      description: 'Inside a Card body, with day rows, avatars, an internal note, a message that was not sent and its resend in flight.',
      demoKey: 'thread-record',
      code: `<Card>
  <CardHead title="Conversation" subtitle="Halden Logistics · DEAL-2291 · 6 messages" />
  <div className="sv-card__body">
    <MessageThread
      label="Conversation with Halden Logistics"
      avatars
      messages={[
        { id: 'm1', day: 'MON 16 NOV 2026', author: 'Jonas Brandt', direction: 'inbound', /* … */ },
        {
          id: 'n1',
          author: 'Mara Lind',
          direction: 'note',
          time: '16 NOV · 10:40',
          dateTime: '2026-11-16T10:40:00+01:00',
          body: 'Finance approved 24 months at +4% on the per-pallet rate. Do not go below €0.92.',
        },
        /* … */
        {
          id: 'm4',
          author: 'Mara Lind',
          direction: 'outbound',
          time: '17 NOV · 09:20',
          dateTime: '2026-11-17T09:20:00+01:00',
          body: 'The order form for the 24-month term is attached.',
          attachments: [{ name: 'OF-2291-scan.pdf', meta: 'PDF · 14.2 MB' }],
          status: 'failed',
          statusNote: 'Halden’s mail server refuses files over 10 MB. Compress the PDF or send it as a link, then resend.',
        },
      ]}
    />
  </div>
</Card>`,
    },
  ],
  props: [
    {
      component: 'MessageThread',
      rows: [
        { name: 'messages', type: 'ThreadMessage[]', description: 'Oldest first. The component never sorts — the caller states the order.' },
        { name: 'label', type: 'string', description: 'Accessible name of the list: "Conversation with Halden Logistics".' },
        { name: 'avatars', type: 'boolean', defaultValue: 'false', description: 'An initials Avatar beside each author. The name stays the attribution; the face is not announced.' },
        { name: 'sendingWord', type: 'string', defaultValue: "'Sending'", description: 'The word for status sending. Override per locale until the catalog carries it.' },
        { name: 'failedWord', type: 'string', defaultValue: "'Not sent'", description: 'The word for status failed. Override per locale until the catalog carries it.' },
        { name: '…rest', type: 'HTMLAttributes<HTMLOListElement>', description: 'id, style, data-*, aria-*, event handlers — spread onto the list; ref forwards to it. className is appended.' },
      ],
    },
    {
      component: 'ThreadMessage',
      rows: [
        { name: 'id', type: 'string', description: 'Stable identity — a thread gains messages, and position keys would hand the new one the old one’s DOM.' },
        { name: 'author', type: 'string', description: 'The person, in full. Bold, and part of the article’s accessible name.' },
        { name: 'direction', type: "'inbound' | 'outbound' | 'note'", description: 'Stated as RECEIVED / SENT / INTERNAL NOTE from the language catalog, then repeated by the surface.' },
        { name: 'time', type: 'string', description: 'Absolute display time, mono: "16 NOV · 09:12". Never relative alone.' },
        { name: 'dateTime', type: 'string', description: 'Machine timestamp for <time dateTime> and its title.' },
        { name: 'body', type: 'string | string[] | ReactNode', description: 'One paragraph, several paragraphs, or your own nodes.' },
        { name: 'attachments', type: 'ThreadAttachment[]', description: 'name (as stored, case kept) · meta (pre-formatted "PDF · 184 KB") · optional href.' },
        { name: 'status', type: "'sending' | 'failed'", description: 'Stated as a B12 StatusWord inside a polite live region.' },
        { name: 'statusNote', type: 'string', description: 'With failed: what happened and how to fix it, in one sentence.' },
        { name: 'day', type: 'string', description: 'Mono day row rendered above this message: "MON 16 NOV 2026".' },
        { name: 'avatarSrc', type: 'string', description: 'A real photo, only when the product genuinely has one.' },
      ],
    },
  ],
  a11y: {
    keyboard: [{ keys: 'Tab', action: 'Moves through attachment links in reading order. Messages themselves are not focus stops.' }],
    notes: [
      'A real <ol>, so assistive tech announces each message’s position; day rows are role="presentation" and stay out of the count.',
      'Each <article> is named by its author, direction word and time together: "Mara Lind, Sent, 16 NOV · 11:05".',
      'Direction is a word, never alignment or tint alone (C5). The word is soft ink, never faint (C2).',
      'Sending and failed are announced through an always-mounted polite live region, so a change is read when it happens.',
      'The indent uses logical properties: under dir="rtl" sent messages indent from the right with no component change.',
      'It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).',
    ],
  },
  donts: [
    'No chat bubbles with tails, and no coloured surface beyond the one seed tint on sent messages.',
    'Never direction by alignment or colour alone — the word is the meaning.',
    'Never relative time ("2h ago") as the only time.',
    'Never a composer inside the thread — the reply box is a B11 Field and a B10 Button composed by the screen.',
    'No typing indicators, read receipts or presence dots — they perform, they do not inform.',
    'Never a lifecycle history — status changes of the record are B41 Timeline, beside the thread.',
  ],
  faq: [
    { q: 'MessageThread or Timeline?', a: 'Did a person write it to another person? Then it is a message, with an author, a direction and paragraphs. If the system recorded that something happened to the record — stage moved, invoice paid — it is a one-sentence Timeline row.' },
    { q: 'Where does the reply box go?', a: 'Under the thread, in the same card: a multiline B11 Field labelled "Reply to Jonas Brandt" and one B10 primary named for its object, "Send reply". When it sends, append the message with status sending and update it when the server answers.' },
    { q: 'Why is there no right-aligned chat layout?', a: 'Alignment is a direction cue a screen reader never hears and a printout loses. 76° states direction in a word and lets a small start-edge indent and the seed tint repeat it.' },
    { q: 'What about an empty conversation?', a: 'Render a B15 EmptyState in its place: one sentence saying no messages have been exchanged with this contact, and the composer under it.' },
  ],
};
