/* 76° · screen: settings team · gate: pass */
// 76° template · Team settings — one workspace's people — seed cobalt.
//
// THE ADMINISTRATION CONSOLE. Fifteen templates shipped before this one and
// none of them administered anything: every screen read a set, decided on
// it, or posted into it. This one answers three questions about ONE
// workspace, and every figure on it is derived from the same state, so the
// hero, the seat line, the role counts and the matrix always reconcile:
//
//  1 · Who is a member — B7 DataTable with FilterBar · FilterLine, a
//      SelectionHead for the bulk verb, and `rowSync` stating a role change
//      that is in flight or did not arrive (word + dot, never a row colour).
//  2 · What each may do — B60 CrossTable, roles × permissions. GrantMatrix
//      was refused (Part F). CrossTable cells are PRE-FORMATTED STRINGS, so
//      the matrix is stated read-only as "Yes" / an em dash: a role's grants
//      are fixed, and a member's access changes by changing their role.
//  3 · Which invitations are outstanding — a second DataTable, each row's
//      verbs in a B20 Menu; the invite form is a B21 Drawer headed by B52.
//
// Removal and revocation confirm in a B13 Dialog with a B10 Danger verb —
// ConfirmDialog was refused for exactly this composition. Access policies
// are B62 SettingList: instant effect, and each row states its consequence.
import { useState } from 'react';
import type { ReactNode } from 'react';
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
  SelectionHead,
  FilterBar,
  FilterLine,
  SearchField,
  SettingList,
  CrossTable,
  JobList,
  Select,
  Field,
  Drawer,
  Dialog,
  Banner,
  Badge,
  Avatar,
  StatusWord,
  EmptyState,
  ErrorSummary,
  MenuButton,
  Button,
  ButtonLink,
} from '@/components/seventy-six';
import type { Column, FieldError, RowSync, SettingRow, StatusTone } from '@/components/seventy-six';

const nav = [
  { label: 'General', href: '#general', active: true },
  { label: 'Notifications', href: '#notifications' },
  { label: 'Security', href: '#security' },
  { label: 'Billing', href: '#billing' },
];

const subTabs = [
  { label: 'PROFILE', href: '#profile' },
  { label: 'DELIVERY', href: '#delivery' },
  { label: 'TEAM', href: '#team', active: true },
];

const WORKSPACE = 'Halden Logistics';
const DOMAIN = 'halden.co';
/* The Team plan's seat count. Members and pending invitations both hold one. */
const SEATS = 20;

type Role = 'owner' | 'admin' | 'member' | 'viewer';
const ROLE_LABEL: Record<Role, string> = { owner: 'Owner', admin: 'Admin', member: 'Member', viewer: 'Viewer' };
const ASSIGNABLE: Exclude<Role, 'owner'>[] = ['admin', 'member', 'viewer'];

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  twoFactor: boolean;
  lastActive: string;
  lastActiveIso: string;
}

/* Fourteen people: 1 owner · 2 admins · 8 members · 3 viewers. Two have no
   second factor, which is the figure the two-factor policy row quotes. */
const MEMBERS: Member[] = [
  { id: 'm01', name: 'Maya Osman', email: 'maya.osman@halden.co', role: 'owner', twoFactor: true, lastActive: '25 NOV 2026 · 09:14', lastActiveIso: '2026-11-25T09:14' },
  { id: 'm02', name: 'Daniel Okonkwo', email: 'd.okonkwo@halden.co', role: 'admin', twoFactor: true, lastActive: '25 NOV 2026 · 08:52', lastActiveIso: '2026-11-25T08:52' },
  { id: 'm03', name: 'Marta Aranda', email: 'm.aranda@halden.co', role: 'admin', twoFactor: true, lastActive: '24 NOV 2026 · 17:30', lastActiveIso: '2026-11-24T17:30' },
  { id: 'm04', name: 'Amara Ndiaye', email: 'a.ndiaye@halden.co', role: 'member', twoFactor: true, lastActive: '25 NOV 2026 · 07:41', lastActiveIso: '2026-11-25T07:41' },
  { id: 'm05', name: 'Jonas Berg', email: 'j.berg@halden.co', role: 'member', twoFactor: true, lastActive: '24 NOV 2026 · 16:05', lastActiveIso: '2026-11-24T16:05' },
  { id: 'm06', name: 'Priya Raman', email: 'p.raman@halden.co', role: 'member', twoFactor: true, lastActive: '24 NOV 2026 · 15:22', lastActiveIso: '2026-11-24T15:22' },
  { id: 'm07', name: 'Tomás Reyes', email: 't.reyes@halden.co', role: 'member', twoFactor: false, lastActive: '21 NOV 2026 · 11:08', lastActiveIso: '2026-11-21T11:08' },
  { id: 'm08', name: 'Lena Ortiz', email: 'l.ortiz@halden.co', role: 'member', twoFactor: true, lastActive: '24 NOV 2026 · 12:47', lastActiveIso: '2026-11-24T12:47' },
  { id: 'm09', name: 'Kwame Mensah', email: 'k.mensah@halden.co', role: 'member', twoFactor: true, lastActive: '23 NOV 2026 · 18:19', lastActiveIso: '2026-11-23T18:19' },
  { id: 'm10', name: 'Sofia Lindqvist', email: 's.lindqvist@halden.co', role: 'member', twoFactor: true, lastActive: '22 NOV 2026 · 09:33', lastActiveIso: '2026-11-22T09:33' },
  { id: 'm11', name: 'Hassan Farah', email: 'h.farah@halden.co', role: 'member', twoFactor: false, lastActive: '14 NOV 2026 · 10:02', lastActiveIso: '2026-11-14T10:02' },
  { id: 'm12', name: 'Ines Duarte', email: 'i.duarte@halden.co', role: 'viewer', twoFactor: true, lastActive: '20 NOV 2026 · 14:56', lastActiveIso: '2026-11-20T14:56' },
  { id: 'm13', name: 'Oliver Grant', email: 'o.grant@halden.co', role: 'viewer', twoFactor: true, lastActive: '18 NOV 2026 · 08:10', lastActiveIso: '2026-11-18T08:10' },
  { id: 'm14', name: 'Yuki Tanaka', email: 'y.tanaka@halden.co', role: 'viewer', twoFactor: true, lastActive: '03 NOV 2026 · 13:44', lastActiveIso: '2026-11-03T13:44' },
];

interface Invite {
  id: string;
  email: string;
  role: Exclude<Role, 'owner'>;
  invitedBy: string;
  sent: string;
  expires: string;
  state: string;
  tone: StatusTone;
}

/* Three outstanding. Two came from the 24 NOV import the JobList states. */
const INVITES: Invite[] = [
  { id: 'INV-0412', email: 'r.mensah@kestrel-freight.com', role: 'member', invitedBy: 'M. OSMAN', sent: '24 NOV 2026', expires: '01 DEC 2026', state: 'Opened', tone: 'neutral' },
  { id: 'INV-0413', email: 'a.haddad@halden.co', role: 'member', invitedBy: 'M. OSMAN', sent: '24 NOV 2026', expires: '01 DEC 2026', state: 'Sent', tone: 'neutral' },
  { id: 'INV-0398', email: 'p.novak@halden.co', role: 'viewer', invitedBy: 'D. OKONKWO', sent: '18 NOV 2026', expires: '25 NOV 2026', state: 'Not delivered', tone: 'bad' },
];

/* What each role may do. Fixed per role; "invite" follows the policy row. */
const PERMISSIONS: { key: string; header: string; roles: Role[] }[] = [
  { key: 'view', header: 'View shipments and orders', roles: ['owner', 'admin', 'member', 'viewer'] },
  { key: 'edit', header: 'Create and edit orders', roles: ['owner', 'admin', 'member'] },
  { key: 'export', header: 'Export reports', roles: ['owner', 'admin', 'member'] },
  { key: 'invite', header: 'Invite members', roles: ['owner', 'admin'] },
  { key: 'roles', header: 'Change member roles', roles: ['owner', 'admin'] },
  { key: 'remove', header: 'Remove members', roles: ['owner', 'admin'] },
  { key: 'policies', header: 'Manage access policies', roles: ['owner', 'admin'] },
  { key: 'billing', header: 'Manage billing and seats', roles: ['owner'] },
  { key: 'delete', header: 'Delete the workspace', roles: ['owner'] },
];

const ROLES: Role[] = ['owner', 'admin', 'member', 'viewer'];

const nameCell = { display: 'flex', alignItems: 'center', gap: 'var(--sv-s3)' } as const;
/* One explicit minmax(0, 1fr) track: an implicit grid track sizes to its
   min-content, and a table's min-content pushed the card past 320px (C7). */
const stack = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--sv-s3)', alignContent: 'start' } as const;
const column = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '14px', alignContent: 'start' } as const;

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

type Confirm = { kind: 'members'; ids: string[] } | { kind: 'invite'; id: string } | null;

export function SettingsTeam() {
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [invites, setInvites] = useState<Invite[]>(INVITES);

  /* One row is seeded mid-failure so the screen draws the state it must
     handle: a role change to Admin that did not reach the server. */
  const [sync, setSync] = useState<Record<string, RowSync | undefined>>({ m10: 'failed' });
  const [pendingRole, setPendingRole] = useState<Record<string, Role>>({ m10: 'admin' });

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<Confirm>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Exclude<Role, 'owner'>>('member');
  const [inviteErrors, setInviteErrors] = useState<FieldError[]>([]);

  const [whoInvites, setWhoInvites] = useState<'admins' | 'members'>('admins');
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);
  const [restrictDomain, setRestrictDomain] = useState(false);
  const [defaultRole, setDefaultRole] = useState<'member' | 'viewer'>('member');
  const [policySync, setPolicySync] = useState<Record<string, 'saving' | undefined>>({});

  /* ---- derived figures: the one source every line on the page reads ---- */
  const seatsUsed = members.length + invites.length;
  const seatsFree = SEATS - seatsUsed;
  const withoutTwoFactor = members.filter((m) => !m.twoFactor).length;
  const roleCount = (r: Role) => members.filter((m) => m.role === r).length;
  const owner = members.find((m) => m.role === 'owner');
  const failedId = Object.keys(sync).find((id) => sync[id] === 'failed');
  const failedMember = members.find((m) => m.id === failedId);

  const q = query.trim().toLowerCase();
  const visible = members.filter(
    (m) =>
      (roleFilter === 'all' || m.role === roleFilter) &&
      (q === '' || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)),
  );
  const filtered = q !== '' || roleFilter !== 'all';
  const activeFilters = [
    ...(q !== '' ? [{ label: 'Search', value: query.trim() }] : []),
    ...(roleFilter !== 'all' ? [{ label: 'Role', value: ROLE_LABEL[roleFilter] }] : []),
  ];

  function clearFilters() {
    setQuery('');
    setRoleFilter('all');
  }

  /* ---- role changes: saving, then saved or failed, stated on the row ---- */
  function changeRole(id: string, role: Role) {
    /* One change in flight per row. The select is NOT disabled while it
       saves — disabling a focused control drops keyboard focus to <body> —
       so a second change is simply ignored until the first lands. */
    if (sync[id] === 'saving') return;
    setPendingRole((p) => ({ ...p, [id]: role }));
    setSync((s) => ({ ...s, [id]: 'saving' }));
    window.setTimeout(() => {
      setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));
      setSync((s) => ({ ...s, [id]: undefined }));
    }, 900);
  }

  function retryRole(id: string) {
    const role = pendingRole[id];
    if (role) changeRole(id, role);
  }

  /* The owner is never removable, so Space can never select them either. */
  function select(keys: Set<string>) {
    const next = new Set(keys);
    if (owner) next.delete(owner.id);
    setSelected(next);
  }

  function confirmRemoval() {
    if (!confirm) return;
    if (confirm.kind === 'members') {
      const gone = new Set(confirm.ids);
      setMembers((list) => list.filter((m) => !gone.has(m.id)));
      setSelected(new Set());
    } else {
      setInvites((list) => list.filter((i) => i.id !== confirm.id));
    }
    setConfirm(null);
  }

  function resend(id: string) {
    setInvites((list) =>
      list.map((i) =>
        i.id === id ? { ...i, sent: '25 NOV 2026', expires: '02 DEC 2026', state: 'Sent', tone: 'neutral' } : i,
      ),
    );
  }

  /* ---- policies: instant effect, so each change states SAVING, then settles ---- */
  function applyPolicy(id: string, apply: () => void) {
    apply();
    setPolicySync((s) => ({ ...s, [id]: 'saving' }));
    window.setTimeout(() => setPolicySync((s) => ({ ...s, [id]: undefined })), 700);
  }

  /* ---- the invite Drawer: B52 indexes, each Field states its own error ---- */
  function openInvite() {
    setInviteEmail('');
    setInviteRole(defaultRole);
    setInviteErrors([]);
    setInviteOpen(true);
  }

  function sendInvite() {
    const email = inviteEmail.trim().toLowerCase();
    const found: FieldError[] = [];
    const field = { fieldId: 'invite-email', label: 'Email address' };
    if (email === '') {
      found.push({ ...field, message: `Enter the person's email address, such as name@${DOMAIN}.` });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      found.push({ ...field, message: 'Enter the address in the format name@company.com.' });
    } else if (members.some((m) => m.email === email)) {
      found.push({ ...field, message: `${email} is already a member of ${WORKSPACE}.` });
    } else if (invites.some((i) => i.email === email)) {
      found.push({ ...field, message: `${email} already has a pending invitation. Resend it from the invitations list.` });
    } else if (restrictDomain && !email.endsWith(`@${DOMAIN}`)) {
      found.push({ ...field, message: `Invitations are restricted to @${DOMAIN}. Use a ${DOMAIN} address or lift the restriction.` });
    }
    if (seatsFree <= 0) {
      found.push({ fieldId: 'invite-role', label: 'Seats', message: `All ${SEATS} seats are held. Revoke an invitation or add seats in Billing.` });
    }
    setInviteErrors(found);
    if (found.length > 0) return;
    const next = 414 + invites.length;
    setInvites((list) => [
      ...list,
      { id: `INV-0${next}`, email, role: inviteRole, invitedBy: 'M. OSMAN', sent: '25 NOV 2026', expires: '02 DEC 2026', state: 'Sent', tone: 'neutral' },
    ]);
    setInviteOpen(false);
  }

  /* ---- columns ---- */
  const memberColumns: Column<Member>[] = [
    {
      key: 'member',
      header: 'MEMBER',
      render: (m) => (
        <span style={nameCell}>
          <Avatar name={m.name} size="sm" tone={m.role === 'owner' ? 'seed' : 'neutral'} />
          <b>{m.name}</b>
        </span>
      ),
    },
    { key: 'email', header: 'EMAIL', render: (m) => m.email },
    {
      key: 'role',
      header: 'ROLE',
      render: (m) =>
        m.role === 'owner' ? (
          <Badge tone="seed">OWNER</Badge>
        ) : (
          <span className="sv-field__selectwrap">
            <select
              className="sv-field__input sv-field__select"
              aria-label={`Role for ${m.name}`}
              value={m.role}
              aria-busy={sync[m.id] === 'saving' || undefined}
              onChange={(e) => changeRole(m.id, e.target.value as Role)}
            >
              {ASSIGNABLE.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <span className="sv-field__chevron" aria-hidden="true" />
          </span>
        ),
    },
    {
      key: 'twofactor',
      header: 'TWO-FACTOR',
      kind: 'status',
      render: (m) => <StatusWord tone={m.twoFactor ? 'ok' : 'bad'}>{m.twoFactor ? 'On' : 'Not set up'}</StatusWord>,
    },
    {
      key: 'active',
      header: 'LAST ACTIVE',
      kind: 'id',
      render: (m) => <time dateTime={m.lastActiveIso}>{m.lastActive}</time>,
    },
  ];

  const inviteColumns: Column<Invite>[] = [
    { key: 'email', header: 'EMAIL', render: (i) => i.email },
    { key: 'role', header: 'ROLE', render: (i) => ROLE_LABEL[i.role] },
    { key: 'state', header: 'DELIVERY', kind: 'status', render: (i) => <StatusWord tone={i.tone}>{i.state}</StatusWord> },
    { key: 'expires', header: 'EXPIRES', kind: 'id', render: (i) => i.expires },
    {
      key: 'verbs',
      header: 'ACTIONS',
      render: (i) => (
        <span>
          <MenuButton
            label="Manage invitation"
            variant="ghost"
            align="end"
            items={[
              { label: `Resend to ${i.email}`, meta: `SENT ${i.sent}`, onSelect: () => resend(i.id) },
              'separator',
              { label: 'Revoke invitation', danger: true, onSelect: () => setConfirm({ kind: 'invite', id: i.id }) },
            ]}
          />
        </span>
      ),
    },
  ];

  /* ---- the matrix: figures, read-only, because CrossTable cells are strings ---- */
  const grants = (p: (typeof PERMISSIONS)[number]): Role[] =>
    p.key === 'invite' && whoInvites === 'members' ? [...p.roles, 'member'] : p.roles;
  const cells: Record<string, Record<string, string | null>> = {};
  for (const p of PERMISSIONS) {
    const has = grants(p);
    cells[p.key] = Object.fromEntries(ROLES.map((r) => [r, has.includes(r) ? 'Yes' : null]));
  }
  const colTotals = Object.fromEntries(
    ROLES.map((r) => [r, `${PERMISSIONS.filter((p) => grants(p).includes(r)).length} of ${PERMISSIONS.length}`]),
  );

  const policies: SettingRow[] = [
    {
      id: 'invite',
      title: 'Who can invite',
      control: {
        kind: 'select',
        value: whoInvites,
        options: [
          { value: 'admins', label: 'Owner and admins', consequence: `Only the owner and ${plural(roleCount('admin'), 'admin')} can send invitations.` },
          { value: 'members', label: 'Admins and members', consequence: `Any of ${roleCount('owner') + roleCount('admin') + roleCount('member')} people can send invitations. Viewers still cannot.` },
        ],
        onChange: (v) => applyPolicy('invite', () => setWhoInvites(v as 'admins' | 'members')),
      },
      sync: policySync.invite,
    },
    {
      id: 'default-role',
      title: 'Default role for invitations',
      control: {
        kind: 'select',
        value: defaultRole,
        options: [
          { value: 'member', label: 'Member', consequence: 'New people can create and edit orders from their first sign-in.' },
          { value: 'viewer', label: 'Viewer', consequence: 'New people can only read until an admin raises their role.' },
        ],
        onChange: (v) => applyPolicy('default-role', () => setDefaultRole(v as 'member' | 'viewer')),
      },
      sync: policySync['default-role'],
    },
    {
      id: 'two-factor',
      title: 'Require two-factor authentication',
      consequence: {
        on: `Members without a second factor are signed out until they set one up. ${plural(withoutTwoFactor, 'member is', 'members are')} affected now.`,
        off: `Members can sign in with a password alone. ${withoutTwoFactor} of ${members.length} have not set up a second factor.`,
      },
      control: { kind: 'toggle', checked: requireTwoFactor, onChange: (v) => applyPolicy('two-factor', () => setRequireTwoFactor(v)) },
      sync: policySync['two-factor'],
    },
    {
      id: 'domain',
      title: `Restrict invitations to ${DOMAIN}`,
      consequence: {
        on: `Only @${DOMAIN} addresses can be invited. Invitations already sent elsewhere stay valid until they expire.`,
        off: 'Any email address can be invited, including contractors outside the company.',
      },
      control: { kind: 'checkbox', checked: restrictDomain, onChange: (v) => applyPolicy('domain', () => setRestrictDomain(v)) },
      sync: policySync.domain,
    },
    {
      id: 'sso',
      title: 'Sign in with single sign-on',
      consequence: { on: 'Members sign in through the company identity provider.', off: 'Members sign in with their email address and password.' },
      control: { kind: 'toggle', checked: false, onChange: () => undefined },
      lockedReason: `Single sign-on needs the Business plan. ${WORKSPACE} is on Team, ${SEATS} seats.`,
    },
  ];

  /* ---- dialog copy ---- */
  const removing = confirm?.kind === 'members' ? members.filter((m) => confirm.ids.includes(m.id)) : [];
  const revoking = confirm?.kind === 'invite' ? invites.find((i) => i.id === confirm.id) : undefined;
  let dialogTitle = '';
  let dialogVerb = '';
  let dialogBody: ReactNode = null;
  if (confirm?.kind === 'members') {
    dialogTitle = `Remove ${plural(removing.length, 'member')}`;
    dialogVerb = dialogTitle;
    dialogBody = (
      <>
        <p>
          <b>{removing.map((m) => m.name).join(', ')}</b> {removing.length === 1 ? 'loses' : 'lose'} access to{' '}
          {WORKSPACE} immediately and {removing.length === 1 ? 'is' : 'are'} signed out of every device.
        </p>
        <p>
          Orders and shipments they created stay in the workspace. {plural(removing.length, 'seat')} return to the
          plan, leaving {seatsFree + removing.length} of {SEATS} free.
        </p>
      </>
    );
  } else if (revoking) {
    dialogTitle = `Revoke invitation ${revoking.id}`;
    dialogVerb = 'Revoke invitation';
    dialogBody = (
      <p>
        The link sent to <b>{revoking.email}</b> stops working now. The seat it holds returns to the plan, leaving{' '}
        {seatsFree + 1} of {SEATS} free.
      </p>
    );
  }

  const selectedCount = selected.size;

  return (
    <div data-seed="cobalt">
      <Band>
        <BandTopbar
          app="Settings"
          nav={<BandNav items={nav} />}
          utilities={
            <input type="search" className="sv-mono" placeholder="SEARCH SETTINGS" aria-label="Search settings" />
          }
        />
        <BandSubTabs items={subTabs} />
        <PageHero
          title="Team"
          context={`${WORKSPACE} workspace · ${plural(members.length, 'member')} · ${plural(invites.length, 'invitation')} pending`}
          actions={
            <Button variant="primary" onClick={openInvite}>
              Invite members
            </Button>
          }
        />
      </Band>

      <Sheet aria-label="Team settings">
        <Row overlap>
          <Card>
            {selectedCount > 0 ? (
              <SelectionHead
                count={selectedCount}
                noun="member"
                onClear={() => setSelected(new Set())}
                actions={
                  <Button variant="danger" onClick={() => setConfirm({ kind: 'members', ids: [...selected] })}>
                    {`Remove ${plural(selectedCount, 'member')}`}
                  </Button>
                }
              />
            ) : (
              <CardHead
                title="Members"
                subtitle={`${seatsUsed} of ${SEATS} seats used · ${members.length} members, ${invites.length} held by invitations`}
                action={<ButtonLink href="#export-members">Export member list</ButtonLink>}
              />
            )}
            <FilterBar
              label="Filter members"
              active={filtered}
              onClearAll={clearFilters}
              controls={
                <>
                  <SearchField
                    label="Search members"
                    labelHidden
                    placeholder="Search members by name or email"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <Select label="Role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'all' | Role)}>
                    <option value="all">All roles</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </Select>
                </>
              }
            />
            <FilterLine filters={activeFilters} onClearAll={clearFilters} count={filtered ? `${visible.length} of ${members.length}` : undefined} />
            {failedMember && (
              <Banner
                tone="bad"
                title={`Role change for ${failedMember.name} did not save`}
                action={
                  <Button variant="ghost" onClick={() => retryRole(failedMember.id)}>
                    Retry role change
                  </Button>
                }
              >
                The change to {ROLE_LABEL[pendingRole[failedMember.id] ?? 'admin']} did not reach the server, so their
                role is still {ROLE_LABEL[failedMember.role]}. Retry it; nothing else on this page was affected.
              </Banner>
            )}
            {visible.length === 0 ? (
              <EmptyState
                sentence={`No members match these filters. Clear them to see all ${members.length}.`}
                action={
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear member filters
                  </Button>
                }
              />
            ) : (
              <DataTable
                caption={`Members of ${WORKSPACE}`}
                columns={memberColumns}
                rows={visible}
                rowKey={(m) => m.id}
                selectable
                selected={selected}
                onSelect={select}
                rowLabel={(m) => m.name}
                isRowSelectable={(m) => m.role !== 'owner'}
                rowSync={(m) => sync[m.id]}
                announcement={`${plural(visible.length, 'member')}${filtered ? ` of ${members.length}` : ''}`}
                page={{ from: 1, to: visible.length, of: visible.length }}
              />
            )}
          </Card>
        </Row>

        <Row split="main">
          <div style={column}>
            <Card>
              <CardHead
                title="Pending invitations"
                subtitle={`${plural(invites.length, 'invitation')} · each holds a seat until accepted, revoked or expired`}
              />
              {invites.length === 0 ? (
                <EmptyState
                  sentence={`No invitations are outstanding. Invitations you send appear here until the person joins ${WORKSPACE}.`}
                  action={
                    <Button variant="ghost" onClick={openInvite}>
                      Invite a member
                    </Button>
                  }
                />
              ) : (
                <DataTable
                  caption="Pending invitations"
                  columns={inviteColumns}
                  rows={invites}
                  rowKey={(i) => i.id}
                  announcement={`${plural(invites.length, 'pending invitation')}`}
                />
              )}
            </Card>

            <Card>
              <CardHead title="Invitation imports" subtitle="CSV imports you started, and what became of them" />
              {/* B58 carries no inset of its own (rule 18). */}
              <div className="sv-card__body">
                <JobList
                  jobs={[
                    {
                      id: 'JOB-2207',
                      title: 'Import invitations from staff-nov.csv',
                      state: 'done',
                      time: '24 NOV · 10:12',
                      dateTime: '2026-11-24T10:12',
                      progress: '2 of 3 rows invited · 1 row skipped, already a member',
                      ratio: 1,
                      result: { href: '#import-report', label: 'Open import report' },
                    },
                    {
                      id: 'JOB-2189',
                      title: 'Import invitations from contractors.csv',
                      state: 'failed',
                      time: '21 NOV · 15:40',
                      dateTime: '2026-11-21T15:40',
                      error: 'The file has no email column. Add a header row named email and import it again.',
                    },
                  ]}
                />
              </div>
            </Card>
          </div>

          <Card>
            <CardHead title="Access policies" subtitle="Each change applies to the whole workspace at once" />
            <div className="sv-card__body">
              <SettingList label="Workspace access policies" rows={policies} />
            </div>
          </Card>
        </Row>

        <Row>
          <Card>
            <CardHead
              title="Roles and permissions"
              subtitle={`Fixed per role · change a member's role to change what they can do · Owner ${roleCount('owner')} · Admin ${roleCount('admin')} · Member ${roleCount('member')} · Viewer ${roleCount('viewer')}`}
            />
            <CrossTable
              caption={`What each role may do in ${WORKSPACE}`}
              rowDimension="PERMISSION"
              colDimension="ROLE"
              measure="GRANTED"
              rows={PERMISSIONS.map((p) => ({ key: p.key, header: p.header }))}
              columns={ROLES.map((r) => ({ key: r, header: ROLE_LABEL[r].toUpperCase() }))}
              cells={cells}
              colTotals={colTotals}
              totalLabel="GRANTED"
              noValueLabel="Not granted"
            />
          </Card>
        </Row>
      </Sheet>

      <Drawer
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a member"
        context={`${WORKSPACE} · ${seatsFree} of ${SEATS} seats free`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={sendInvite}>
              Send invitation
            </Button>
          </>
        }
      >
        <div style={stack}>
          <ErrorSummary errors={inviteErrors} />
          <Field
            id="invite-email"
            label="Email address"
            type="email"
            required
            autoComplete="off"
            hint={restrictDomain ? `Restricted to @${DOMAIN} addresses` : 'The invitation link expires after 7 days'}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            error={inviteErrors.find((e) => e.fieldId === 'invite-email')?.message}
          />
          <Select
            id="invite-role"
            label="Role"
            hint="What they can do is listed under Roles and permissions"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as Exclude<Role, 'owner'>)}
            error={inviteErrors.find((e) => e.fieldId === 'invite-role')?.message}
          >
            {ASSIGNABLE.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </Select>
        </div>
      </Drawer>

      <Dialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={dialogTitle}
        destructive
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemoval}>
              {dialogVerb}
            </Button>
          </>
        }
      >
        {dialogBody}
      </Dialog>
    </div>
  );
}
