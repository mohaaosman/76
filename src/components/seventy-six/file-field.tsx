import { useId, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { cx } from '@/lib/cx';
/* The row bar IS the B4 bar — its track, fill and single 160ms width
   transition are defined once, in progress.css, and worn here. */
import './progress.css';
import './file-field.css';

/**
 * B37 · FileField — one job: attach files, and state what happened to each
 * one. It owns NO transport. Uploading, retrying, cancelling and measuring
 * progress are the product's work; this component renders the state it is
 * handed and says it in words, never in colour alone. The platform choice is
 * a real <input type="file"> behind a named button: the drop zone is a
 * target, not a control, so the keyboard reaches everything without a fake
 * tabIndex on a div, and a file picker that people already know opens.
 */
export type FileStatus = 'uploading' | 'done' | 'error';

export interface FileRow {
  id: string;
  name: string;
  /** Pre-formatted, e.g. "2.4 MB" — byte formatting is a locale concern (C9). */
  size: string;
  status: FileStatus;
  /** 0–100, for `uploading` rows. */
  percent?: number;
  /** For `error` rows: what is wrong AND how to fix it. */
  error?: string;
}

export interface FileFieldProps {
  label: string;
  hint?: string;
  /** Mono line naming what is accepted and the ceiling: "CSV · XLSX · MAX 10 MB". */
  constraint?: string;
  /** Native accept filter, e.g. ".csv,.xlsx". A hint to the picker, not a guarantee. */
  accept?: string;
  multiple?: boolean;
  /** The rows to render. The caller owns this list and every status in it. */
  files: FileRow[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  /** Field-level error: what is wrong AND how to fix it (B11). */
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const clampPercent = (percent?: number) => Math.round(Math.min(100, Math.max(0, percent ?? 0)));

export function FileField({
  label,
  hint,
  constraint,
  accept,
  multiple = true,
  files,
  onAdd,
  onRemove,
  error,
  disabled,
  id: explicitId,
  className,
}: FileFieldProps) {
  const auto = useId();
  const id = explicitId ?? auto;
  const hintId = `${id}-hint`;
  const constraintId = `${id}-constraint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, constraint ? constraintId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    /* Without preventDefault the browser navigates to the dropped file and
       no drop event ever reaches us. */
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) onAdd(dropped);
  }

  return (
    <div className={cx('sv-field sv-filefield', className)}>
      <label className="sv-field__label" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p className="sv-field__hint" id={hintId}>
          {hint}
        </p>
      )}

      <div
        className={cx('sv-filefield__zone', dragging && 'sv-filefield__zone--drag')}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <p className="sv-filefield__prompt">
          {multiple ? 'Drop files here, or choose them from your computer.' : 'Drop a file here, or choose one from your computer.'}
        </p>
        <button
          type="button"
          className="sv-btn sv-btn--ghost"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {multiple ? 'Choose files' : 'Choose file'}
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="sv-visually-hidden sv-filefield__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            const picked = e.target.files;
            if (picked && picked.length > 0) onAdd(Array.from(picked));
            /* Reset, or choosing the same file twice fires no change event. */
            e.target.value = '';
          }}
        />
        {constraint && (
          <p className="sv-filefield__constraint sv-mono" id={constraintId}>
            {constraint}
          </p>
        )}
      </div>

      {/* Live from the start: a region that appears with its first row is
          routinely missed, so the list is always in the tree, empty or not. */}
      <ul className="sv-filefield__list" aria-live="polite">
        {files.map((file) => {
          const percent = clampPercent(file.percent);
          return (
            <li key={file.id} className="sv-filefield__row">
              <span className="sv-filefield__name">{file.name}</span>
              <span className="sv-filefield__size sv-mono sv-num">{file.size}</span>

              {file.status === 'uploading' && (
                <span className="sv-filefield__progress">
                  <span
                    className="sv-progress__track sv-filefield__track"
                    role="progressbar"
                    aria-label={`Uploading ${file.name}`}
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {/* B4 geometry, reused rather than restated — one bar in
                        the system, one place its 160ms fill is defined. */}
                    <span className="sv-progress__fill sv-filefield__fill" style={{ width: `${percent}%` }} />
                  </span>
                  <span className="sv-filefield__percent sv-mono sv-num">{percent}%</span>
                </span>
              )}

              {file.status === 'done' && (
                <span className="sv-filefield__done">
                  <svg viewBox="0 0 10 8" width="10" height="8" aria-hidden="true">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* The WORD carries the state; the colour and tick only agree. */}
                  Uploaded
                </span>
              )}

              {file.status === 'error' && file.error && <span className="sv-filefield__bad">{file.error}</span>}

              <button
                type="button"
                className="sv-btn sv-btn--link"
                aria-label={`Remove ${file.name}`}
                onClick={() => onRemove(file.id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="sv-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
