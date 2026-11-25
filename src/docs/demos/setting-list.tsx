import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { Card, CardHead } from '@/components/seventy-six/card';
import { SettingList } from '@/components/seventy-six/setting-list';
import type { SettingRow } from '@/components/seventy-six/setting-list';

type Sync = SettingRow['sync'];

/* Instant effect, honestly simulated: every change shows SAVING for 900ms,
   then settles. Nothing is sent anywhere. */
function useInstantSave() {
  const [sync, setSync] = useState<Record<string, Sync>>({});
  const timers = useRef<Record<string, number>>({});
  useEffect(() => {
    const all = timers.current;
    return () => Object.values(all).forEach((t) => window.clearTimeout(t));
  }, []);
  function save(id: string) {
    setSync((s) => ({ ...s, [id]: 'saving' }));
    window.clearTimeout(timers.current[id]);
    timers.current[id] = window.setTimeout(() => setSync((s) => ({ ...s, [id]: undefined })), 900);
  }
  return { sync, save };
}

const ROLES = [
  { value: 'viewer', label: 'Viewer', consequence: 'New members can read every shared record and change none of them.' },
  { value: 'editor', label: 'Editor', consequence: 'New members can create and edit records, but cannot delete them.' },
  { value: 'admin', label: 'Admin', consequence: 'New members can change workspace settings, including this one.' },
];

function SettingBasic() {
  const { sync, save } = useInstantSave();
  const [visible, setVisible] = useState(true);
  const [twoStep, setTwoStep] = useState(false);
  const [role, setRole] = useState('viewer');
  const [archived, setArchived] = useState(false);

  return (
    <Card style={{ maxWidth: 640 }}>
      <CardHead title="Workspace access" subtitle="Changes apply as soon as you make them" />
      <div className="sv-card__body">
        <SettingList
          label="Workspace access"
          rows={[
            {
              id: 'visibility',
              title: 'Open project visibility',
              consequence: {
                on: 'New members can see every project in the workspace.',
                off: 'New members see only the projects they are invited to.',
              },
              control: { kind: 'toggle', checked: visible, onChange: (v) => { setVisible(v); save('visibility'); } },
              sync: sync.visibility,
            },
            {
              id: 'two-step',
              title: 'Two-step sign-in',
              consequence: {
                on: 'Every member confirms sign-in with a code from their phone.',
                off: 'Members sign in with a password alone.',
              },
              control: { kind: 'toggle', checked: twoStep, onChange: (v) => { setTwoStep(v); save('two-step'); } },
              sync: sync['two-step'],
            },
            {
              id: 'role',
              title: 'Default role',
              control: { kind: 'select', value: role, options: ROLES, onChange: (v) => { setRole(v); save('role'); } },
              sync: sync.role,
            },
            {
              id: 'archived',
              title: 'Archived projects in search',
              consequence: {
                on: 'Search results include archived projects, marked ARCHIVED.',
                off: 'Search results leave archived projects out.',
              },
              control: { kind: 'checkbox', checked: archived, onChange: (v) => { setArchived(v); save('archived'); } },
              sync: sync.archived,
            },
          ]}
        />
      </div>
    </Card>
  );
}

function SettingStates() {
  const [sharing, setSharing] = useState(false);
  const [failed, setFailed] = useState(true);
  const [exporting, setExporting] = useState(true);

  return (
    <Card style={{ maxWidth: 640 }}>
      <CardHead title="Data and sharing" subtitle="Saving, not saved, and locked" />
      <div className="sv-card__body">
        <SettingList
          label="Data and sharing"
          rows={[
            {
              id: 'export',
              title: 'Weekly export to storage',
              consequence: {
                on: 'Every Monday at 06:00 a CSV of all records is written to the connected bucket.',
                off: 'No export runs. Records stay in the workspace only.',
              },
              control: { kind: 'toggle', checked: exporting, onChange: setExporting },
              /* Held in SAVING on purpose: this row is the specimen of the state. */
              sync: 'saving',
            },
            {
              id: 'sharing',
              title: 'Public share links',
              consequence: {
                on: 'Anyone with a share link can read the record without signing in.',
                off: 'Share links work only for signed-in members.',
              },
              control: {
                kind: 'toggle',
                checked: sharing,
                onChange: (v) => { setSharing(v); setFailed(false); },
              },
              sync: failed ? 'failed' : undefined,
              failure: 'The change did not reach the server, so share links are still members-only. Turn it on again to retry.',
            },
            {
              id: 'region',
              title: 'Data region',
              control: {
                kind: 'select',
                value: 'eu',
                options: [
                  { value: 'eu', label: 'EU · Frankfurt', consequence: 'Records are stored in Frankfurt and never leave the EU.' },
                  { value: 'us', label: 'US · Virginia', consequence: 'Records are stored in Virginia, in the United States.' },
                ],
                onChange: () => {},
              },
              lockedReason: 'Set when the workspace was created. Contact support to move the data to another region.',
            },
          ]}
        />
      </div>
    </Card>
  );
}

export const settingListDemos: Record<string, ComponentType> = {
  'setting-basic': SettingBasic,
  'setting-states': SettingStates,
};
