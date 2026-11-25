import type { ComponentType } from 'react';
import { Card, CardHead } from '@/components/seventy-six/card';
import { MessageThread } from '@/components/seventy-six/message-thread';
import type { ThreadMessage } from '@/components/seventy-six/message-thread';

/* One deal, told consistently: Halden Logistics asks for a shorter term on
   the Rotterdam quote. €0.90 per pallet position on 36 months; finance
   approves 24 months at +4% (0.90 × 1.04 = 0.936, quoted as €0.94) with a
   floor of €0.92. All times CET (+01:00), oldest first. */

const OPENING: ThreadMessage[] = [
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
    body: [
      'Thank you, Jonas. A 24-month term is possible at €0.94 per pallet position, up from €0.90 on 36 months. Service levels stay as proposed.',
      'The revised quote is attached.',
    ],
    attachments: [{ name: 'Q-2291-rev2.pdf', meta: 'PDF · 184 KB' }],
  },
  {
    id: 'm3',
    author: 'Jonas Brandt',
    direction: 'inbound',
    time: '17 NOV · 08:47',
    dateTime: '2026-11-17T08:47:00+01:00',
    body: 'That works for us. Send the order form and I will have it signed this week.',
  },
];

function ThreadBasic() {
  return (
    <div style={{ maxWidth: 640 }}>
      <MessageThread label="Conversation with Halden Logistics" messages={OPENING} />
    </div>
  );
}

const FULL: ThreadMessage[] = [
  { ...OPENING[0], day: 'MON 16 NOV 2026' },
  {
    id: 'n1',
    author: 'Mara Lind',
    direction: 'note',
    time: '16 NOV · 10:40',
    dateTime: '2026-11-16T10:40:00+01:00',
    body: 'Finance approved 24 months at +4% on the per-pallet rate. Do not go below €0.92.',
  },
  OPENING[1],
  { ...OPENING[2], day: 'TUE 17 NOV 2026' },
  {
    id: 'm4',
    author: 'Mara Lind',
    direction: 'outbound',
    time: '17 NOV · 09:20',
    dateTime: '2026-11-17T09:20:00+01:00',
    body: 'The order form for the 24-month term is attached, with the rate from Q-2291-rev2.',
    attachments: [{ name: 'OF-2291-scan.pdf', meta: 'PDF · 14.2 MB' }],
    status: 'failed',
    statusNote: 'Halden’s mail server refuses files over 10 MB. Compress the PDF or send it as a link, then resend.',
  },
  {
    id: 'm5',
    author: 'Mara Lind',
    direction: 'outbound',
    time: '17 NOV · 09:31',
    dateTime: '2026-11-17T09:31:00+01:00',
    body: 'The order form for the 24-month term is attached, with the rate from Q-2291-rev2.',
    attachments: [{ name: 'OF-2291.pdf', meta: 'PDF · 1.1 MB' }],
    status: 'sending',
  },
];

function ThreadRecord() {
  return (
    <Card style={{ maxWidth: 680 }}>
      <CardHead title="Conversation" subtitle="Halden Logistics · DEAL-2291 · 6 messages" />
      <div className="sv-card__body">
        <MessageThread label="Conversation with Halden Logistics" messages={FULL} avatars />
      </div>
    </Card>
  );
}

export const messageThreadDemos: Record<string, ComponentType> = {
  'thread-basic': ThreadBasic,
  'thread-record': ThreadRecord,
};
