import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import './field.css';
import './scan-field.css';

/**
 * B54 · ScanField — one job: take one identifier at a time, scanned or
 * typed, and state what the last one resolved to.
 *
 * A barcode scanner is a keyboard that types an identifier and presses
 * Enter, so this is a B11 text field that treats Enter as "take it": the
 * value goes to `onScan`, the box empties, and the caret stays where it
 * was, ready for the next one. Nothing else submits it — never a timer,
 * never a length, never a pause in typing — because a clerk typing a
 * smudged label by hand is as legitimate as the gun.
 *
 * **The boundary against B36 SearchField.** Search narrows a set while you
 * type and keeps the query; a scan is a discrete event that is consumed and
 * answered. If the box should still hold the text afterwards, it is search.
 *
 * It never resolves. The caller looks the identifier up and passes `last`;
 * the field only states it — one line, mono id, word + dot, one sentence —
 * in a polite live region, so a reader who never looks up from the pallet
 * still hears what the scan became.
 *
 * Don't: never auto-submits; never keeps the scanned value in the box;
 * never a history of scans (that is a B7 DataTable or B53 EntryTable of
 * what was received); never the tone as colour alone; never steals focus
 * on mount unless the screen exists to scan.
 */
export type ScanTone = 'ok' | 'bad' | 'pending';

export interface ScanResult {
  /** The identifier as resolved: "SKU-4471". Mono. */
  id: string;
  tone: ScanTone;
  /** One sentence: "Pallet racking, 2.4m · 3 of 12 received". */
  text: string;
}

export interface ScanFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  label: string;
  hint?: string;
  /** Called with the trimmed identifier on Enter. Never on a timer. */
  onScan: (value: string) => void;
  /** What the last identifier resolved to. Absent = nothing scanned yet. */
  last?: ScanResult;
  /** Override the tone words; defaults come from the locale catalog. */
  toneWords?: Record<ScanTone, string>;
}

export const ScanField = forwardRef<HTMLInputElement, ScanFieldProps>(function ScanField(
  { label, hint, onScan, last, toneWords: toneWordsProp, id: explicitId, className, onKeyDown, disabled, ...rest },
  ref,
) {
  const t = useStrings();
  const toneWords = toneWordsProp ?? { ok: t.scanOk, bad: t.scanBad, pending: t.scanPending };
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = `${id}-hint`;
  const resultId = `${id}-result`;
  const [draft, setDraft] = useState('');

  /* The same identifier scanned twice resolves to the same sentence, and a
     live region does not re-announce text that did not change. Each new
     `last` object gets a fresh key, so the line is re-inserted and heard
     again — the second carton of SKU-4471 is still news. */
  const [seen, setSeen] = useState<{ last?: ScanResult; n: number }>({ last, n: 0 });
  if (seen.last !== last) setSeen({ last, n: seen.n + 1 });

  return (
    <div className={cx('sv-field sv-scan', className)}>
      <label className="sv-field__label" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p className="sv-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      <input
        {...rest}
        ref={ref}
        id={id}
        type="text"
        className="sv-field__input sv-scan__input"
        value={draft}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        aria-describedby={[hint ? hintId : null, resultId].filter(Boolean).join(' ')}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented || e.key !== 'Enter') return;
          /* preventDefault: inside a page form, Enter would otherwise submit
             the whole form — a scan is not a submission. */
          e.preventDefault();
          const value = draft.trim();
          if (!value) return;
          setDraft('');
          onScan(value);
        }}
      />
      <p id={resultId} className="sv-scan__result" aria-live="polite">
        {last ? (
          <span key={seen.n} className="sv-scan__line">
            <span className="sv-visually-hidden">{t.scanResolved(last.id)}. </span>
            <span className="sv-scan__id sv-mono" aria-hidden="true">
              {last.id}
            </span>
            <span className={cx('sv-scan__tone', `sv-scan__tone--${last.tone}`)}>
              <span className="sv-scan__dot" aria-hidden="true" />
              {toneWords[last.tone]}
            </span>
            <span className="sv-scan__text sv-num">{last.text}</span>
          </span>
        ) : (
          <span className="sv-scan__ready sv-mono">{t.scanReady}</span>
        )}
      </p>
    </div>
  );
});
