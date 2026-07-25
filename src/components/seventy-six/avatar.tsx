import { cx } from '@/lib/cx';
import './avatar.css';

/**
 * B30 · Avatar — a person, named. Initials on wall by default; a photo
 * only when the product genuinely has one. Never decorative, never a
 * generic silhouette, never the sole carrier of the name (A4).
 */
export interface AvatarProps {
  /** The full name. Initials and the accessible name both come from it. */
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Marks the current user / active member — one per group, like all seed. */
  tone?: 'neutral' | 'seed';
  className?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, size = 'md', tone = 'neutral', className }: AvatarProps) {
  const cls = cx('sv-avatar', `sv-avatar--${size}`, tone === 'seed' && 'sv-avatar--seed', className);
  if (src) return <img className={cls} src={src} alt={name} width={32} height={32} />;
  return (
    <span className={cls} role="img" aria-label={name}>
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}

export interface AvatarGroupProps {
  people: { name: string; src?: string }[];
  /** Faces shown before the overflow count. Default 4. */
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * The overlapped stack, capped. The overflow chip is mono and states the
 * count; the full list belongs in a Drawer or a table, never in a hover.
 */
export function AvatarGroup({ people, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span className={cx('sv-avatars', className)}>
      {shown.map((person) => (
        <Avatar key={person.name} name={person.name} src={person.src} size={size} />
      ))}
      {rest > 0 && (
        <span className={cx('sv-avatar', `sv-avatar--${size}`, 'sv-avatar--rest', 'sv-mono')} role="img" aria-label={`${rest} more`}>
          <span aria-hidden="true">+{rest}</span>
        </span>
      )}
    </span>
  );
}
