import { useId } from 'react';
import { cx } from '@/lib/cx';
import { useStrings } from '@/lib/i18n';
import { Checkbox, Toggle } from './field';
import { StatusWord } from './status-word';
import './setting-list.css';

/**
 * B63 · SettingList — one job: state one setting's consequence beside the
 * instant-effect control that changes it.
 *
 * **It is B28 `DescriptionList`'s settable twin.** B28 states facts and
 * refuses editing controls by name; this states a setting and carries the
 * one control that changes it. The sentence is the point: a bare switch
 * labelled "Public projects" says what the control is called, not what
 * flipping it does. Each row says what the CURRENT value does — "New members
 * can see every project in the workspace." — and the sentence changes with
 * the value, so the reader learns the consequence before and after.
 *
 * **Instant effect, so no Save button.** Every change applies the moment it
 * is made, and the row says so in words: SAVING while it travels, NOT SAVED
 * with a fix sentence when it did not arrive. A set of fields that applies
 * on submit is a B11 form with a B10 primary, not this.
 *
 * **It composes B11, it does not redraw it.** Toggle and Checkbox are the
 * field.tsx controls; the select is B11's own native select anatomy
 * (`sv-field__input sv-field__select`) without B11's visible label, because
 * here the row's title IS the label. Density follows the token posture
 * (`--sv-row-y`, `--sv-control-*`), never a prop.
 *
 * It carries NO inset of its own — inside a `<Card>` it takes
 * `<div className="sv-card__body">` (firewall rule 18).
 *
 * Don't: never a setting without its consequence sentence; never a Save
 * button; never a locked row without the reason; never a control the row's
 * title does not name; never two controls in one row — that is two settings.
 */
export type SettingControl =
  | { kind: 'toggle'; checked: boolean; onChange: (checked: boolean) => void }
  | { kind: 'checkbox'; checked: boolean; onChange: (checked: boolean) => void }
  | {
      kind: 'select';
      value: string;
      /** Each option may carry the consequence of choosing it. */
      options: { value: string; label: string; consequence?: string }[];
      onChange: (value: string) => void;
    };

export interface SettingRow {
  id: string;
  /** What the setting is called. Also the control's accessible name. */
  title: string;
  /**
   * What the CURRENT value does, as a sentence. `{ on, off }` for a toggle
   * or checkbox; for a select, prefer `consequence` on each option.
   */
  consequence?: string | { on: string; off: string };
  control: SettingControl;
  /** The change is in flight, or did not arrive. */
  sync?: 'saving' | 'failed';
  /** With `failed`: what happened and how to fix it, in one sentence. */
  failure?: string;
  /** Disables the control and states why — a disabled row never goes unexplained. */
  lockedReason?: string;
}

export interface SettingListProps {
  rows: SettingRow[];
  /** Names the group for assistive tech: "Workspace access". */
  label?: string;
  className?: string;
}

function resolveConsequence(row: SettingRow): string | undefined {
  const c = row.control;
  if (c.kind === 'select') {
    const hit = c.options.find((o) => o.value === c.value)?.consequence;
    if (hit) return hit;
    return typeof row.consequence === 'string' ? row.consequence : undefined;
  }
  if (typeof row.consequence === 'string' || row.consequence === undefined) return row.consequence;
  return c.checked ? row.consequence.on : row.consequence.off;
}

function Setting({ row }: { row: SettingRow }) {
  const t = useStrings();
  const base = useId();
  const titleId = `${base}-title`;
  const consId = `${base}-cons`;
  const lockId = `${base}-lock`;
  const syncId = `${base}-sync`;
  const consequence = resolveConsequence(row);
  const locked = Boolean(row.lockedReason);
  const describedBy = [consequence && consId, locked && lockId, row.sync && syncId].filter(Boolean).join(' ') || undefined;
  const c = row.control;

  /* aria-labelledby points at the row title: the control's own label is
     kept for B11's anatomy but hidden, so the name is read once. */
  const shared = {
    'aria-labelledby': titleId,
    'aria-describedby': describedBy,
    disabled: locked,
  };

  let control;
  if (c.kind === 'toggle') {
    control = (
      <Toggle {...shared} label={row.title} checked={c.checked} onChange={(e) => c.onChange(e.target.checked)} />
    );
  } else if (c.kind === 'checkbox') {
    control = (
      <Checkbox {...shared} label={row.title} checked={c.checked} onChange={(e) => c.onChange(e.target.checked)} />
    );
  } else {
    control = (
      <span className="sv-field__selectwrap">
        <select
          {...shared}
          className="sv-field__input sv-field__select"
          value={c.value}
          onChange={(e) => c.onChange(e.target.value)}
        >
          {c.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="sv-field__chevron" aria-hidden="true" />
      </span>
    );
  }

  return (
    <li className={cx('sv-setting', `sv-setting--${c.kind}`, locked && 'sv-setting--locked')}>
      <div className="sv-setting__text">
        <p className="sv-setting__title" id={titleId}>
          {row.title}
        </p>
        {/* Live, so the new consequence is read the moment the value flips. */}
        <p className="sv-setting__consequence" id={consId} aria-live="polite">
          {consequence}
        </p>
        {locked && (
          <p className="sv-setting__locked" id={lockId}>
            {row.lockedReason}
          </p>
        )}
        <div className="sv-setting__sync" id={syncId} aria-live="polite">
          {row.sync === 'saving' && <StatusWord tone="neutral">{t.rowSaving}</StatusWord>}
          {row.sync === 'failed' && (
            <>
              <StatusWord tone="bad">{t.rowFailed}</StatusWord>
              {row.failure && <p className="sv-setting__fix">{row.failure}</p>}
            </>
          )}
        </div>
      </div>
      <div className="sv-setting__control">{control}</div>
    </li>
  );
}

export function SettingList({ rows, label, className }: SettingListProps) {
  return (
    <ul className={cx('sv-settings', className)} aria-label={label}>
      {rows.map((row) => (
        <Setting key={row.id} row={row} />
      ))}
    </ul>
  );
}
