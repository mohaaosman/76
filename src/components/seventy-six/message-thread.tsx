import { Fragment, forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import { Avatar } from './avatar';
import { StatusWord } from './status-word';
import './message-thread.css';

/**
 * B62 · MessageThread — one job: state one conversation as an ordered list
 * of messages, each attributed to a person and marked with its direction.
 *
 * **It is not B41 `Timeline`, and B41 says so itself.** A Timeline row is
 * one sentence, never interactive, and its tones are LIFECYCLE — done,
 * pending, failed. A message is several paragraphs, may carry files, and its
 * mark is DIRECTION: received, sent, or an internal note the other party
 * never sees. Nor is it B9 `ActivityList`, a flat feed across many records.
 * The thread is one record's correspondence, oldest first.
 *
 * **Direction is stated in words (C5).** Every message says RECEIVED, SENT
 * or INTERNAL NOTE in mono beside its author. The surface repeats it — sent
 * sits on the one permitted `--sv-seed-tint` panel, indented from the start
 * edge; a note is hairline-ruled — but alignment and tint are rhythm, never
 * the only carrier. The indent is `margin-inline-start`, so an Arabic thread
 * mirrors without the component knowing.
 *
 * **It has no composer.** The reply box is a B11 multiline Field and a B10
 * Button, composed by the screen under the thread. A thread that owned its
 * input would own sending, drafts and validation — that is a screen.
 *
 * It carries NO inset of its own — inside a `<Card>` it takes
 * `<div className="sv-card__body">` (firewall rule 18).
 *
 * Don't: no bubbles with tails and no coloured bubble beyond the seed tint;
 * never direction by alignment alone; never relative time ("2h ago") as the
 * only time; never a composer inside it; never typing indicators or read
 * receipts — they perform, they do not inform.
 */
export type MessageDirection = 'inbound' | 'outbound' | 'note';

export interface ThreadAttachment {
  /** The file name exactly as stored: "Q-2291-rev2.pdf". */
  name: string;
  /** PRE-FORMATTED type and size: "PDF · 184 KB". */
  meta?: string;
  /** Where the file opens. Without it the row states the file and links nowhere. */
  href?: string;
}

export interface ThreadMessage {
  id: string;
  author: string;
  /** A real photo, used only when `avatars` is on. Initials otherwise. */
  avatarSrc?: string;
  direction: MessageDirection;
  /** Absolute display time, mono: "16 NOV · 09:12". */
  time: string;
  /** Full machine timestamp for <time dateTime>. */
  dateTime: string;
  /**
   * The message. A string is one paragraph; a string[] is several; any
   * other node renders as given (already in its own <p>s).
   */
  body: string | string[] | ReactNode;
  attachments?: ThreadAttachment[];
  /** Outbound only, in practice. Stated as a word, never as an icon. */
  status?: 'sending' | 'failed';
  /** With `failed`: what happened and how to fix it, in one sentence. */
  statusNote?: string;
  /** Mono day row rendered ABOVE this message: "MON 16 NOV 2026". */
  day?: string;
}

export interface MessageThreadProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  messages: ThreadMessage[];
  /** Names the conversation for assistive tech: "Conversation with Halden Logistics". */
  label: string;
  /** Show an initials Avatar beside each author. Default off: the name is the attribution. */
  avatars?: boolean;
  /** The word for `status: 'sending'`. No catalog key yet. */
  sendingWord?: string;
  /** The word for `status: 'failed'`. No catalog key yet. */
  failedWord?: string;
  className?: string;
}

function Body({ body }: { body: ThreadMessage['body'] }) {
  if (typeof body === 'string') return <p>{body}</p>;
  if (Array.isArray(body) && body.every((b) => typeof b === 'string')) {
    return (
      <>
        {(body as string[]).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </>
    );
  }
  return <>{body}</>;
}

export const MessageThread = forwardRef<HTMLOListElement, MessageThreadProps>(function MessageThread({
  messages,
  label,
  avatars = false,
  sendingWord: sendingProp,
  failedWord: failedProp,
  className,
  ...rest
}, ref) {
  const t = useStrings();
  const sendingWord = sendingProp ?? t.messageSending;
  const failedWord = failedProp ?? t.messageFailed;
  const base = useId();
  const word: Record<MessageDirection, string> = {
    inbound: t.inbound,
    outbound: t.outbound,
    note: t.internalNote,
  };

  return (
    <ol {...rest} ref={ref} className={cx('sv-thread', avatars && 'sv-thread--avatars', className)} aria-label={label}>
      {messages.map((m) => {
        const id = `${base}-${m.id}`;
        return (
          <Fragment key={m.id}>
            {m.day && (
              /* The day row labels the messages below it; it is not a
                 message, so it stays out of the <ol>'s count — B41's rule. */
              <li className="sv-thread__day sv-mono" role="presentation">
                {m.day}
              </li>
            )}
            <li className="sv-thread__item">
              <article
                className={cx('sv-thread__msg', `sv-thread__msg--${m.direction}`)}
                aria-labelledby={`${id}-a ${id}-d ${id}-t`}
              >
                <header className="sv-thread__head">
                  {avatars && (
                    /* The name beside it is the attribution; the face is
                       rhythm, so it is not announced twice (A4). */
                    <span className="sv-thread__face" aria-hidden="true">
                      <Avatar name={m.author} src={m.avatarSrc} size="sm" />
                    </span>
                  )}
                  <span className="sv-thread__author" id={`${id}-a`}>
                    {m.author}
                  </span>
                  <span className="sv-thread__dir sv-mono" id={`${id}-d`}>
                    {word[m.direction]}
                  </span>
                  <time className="sv-thread__time sv-mono" id={`${id}-t`} dateTime={m.dateTime} title={m.dateTime}>
                    {m.time}
                  </time>
                </header>
                <div className="sv-thread__body">
                  <Body body={m.body} />
                </div>
                {m.attachments && m.attachments.length > 0 && (
                  <ul className="sv-thread__files">
                    {m.attachments.map((f) => (
                      <li key={f.name} className="sv-thread__file">
                        {f.href ? (
                          <a className="sv-thread__filename" href={f.href}>
                            {f.name}
                          </a>
                        ) : (
                          <span className="sv-thread__filename">{f.name}</span>
                        )}
                        {f.meta && <span className="sv-thread__filemeta sv-num">{f.meta}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Always mounted, so a message that goes from sending to
                    failed is announced at the moment it happens. */}
                <div className="sv-thread__status" aria-live="polite">
                  {m.status === 'sending' && <StatusWord tone="neutral">{sendingWord}</StatusWord>}
                  {m.status === 'failed' && (
                    <>
                      <StatusWord tone="bad">{failedWord}</StatusWord>
                      {m.statusNote && <p className="sv-thread__fix">{m.statusNote}</p>}
                    </>
                  )}
                </div>
              </article>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
});
