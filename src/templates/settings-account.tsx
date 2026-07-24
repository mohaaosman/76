// 76° template · Account settings (seed-neutral → default cobalt root).
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
  Field,
  Select,
  Toggle,
  Radio,
  Checkbox,
  Button,
} from '@/components/seventy-six';

const nav = [
  { label: 'General', href: '#general' },
  { label: 'Notifications', href: '#notifications', active: true },
  { label: 'Security', href: '#security' },
  { label: 'Billing', href: '#billing' },
];

const subTabs = [
  { label: 'PROFILE', href: '#profile', active: true },
  { label: 'DELIVERY', href: '#delivery' },
];

const grid2 = { display: 'grid', gap: 'var(--sv-s4)', gridTemplateColumns: '1fr 1fr' } as const;
const stack = { display: 'grid', gap: 'var(--sv-s3)' } as const;
const rightBar = { display: 'flex', gap: 'var(--sv-s3)', justifyContent: 'flex-end' } as const;

export function SettingsAccount() {
  return (
    <div>
      <Band>
        <BandTopbar
          app="Settings"
          nav={<BandNav items={nav} />}
          utilities={
            <input
              type="search"
              className="sv-mono"
              placeholder="SEARCH SETTINGS"
              aria-label="Search settings"
            />
          }
        />
        <BandSubTabs items={subTabs} />
        <PageHero
          headingLevel={1}
          title="Notifications"
          context="Changes save to your profile"
          actions={
            <>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save changes</Button>
            </>
          }
        />
      </Band>

      <Sheet aria-label="Account settings">
        <Row split="full">
          <Card>
            <CardHead title="Profile" subtitle="How your account appears to teammates" />
            <div className="sv-card__body" style={grid2}>
              <Field label="Full name" defaultValue="Maya Osman" autoComplete="name" />
              <Field label="Email" type="email" required defaultValue="maya@northwind.co" autoComplete="email" />
              <Field label="Job title" defaultValue="Operations Lead" />
              <Select label="Time zone" defaultValue="eat">
                <option value="eat">East Africa Time (UTC+3)</option>
                <option value="cet">Central European Time (UTC+1)</option>
                <option value="est">Eastern Time (UTC−5)</option>
              </Select>
            </div>
          </Card>
        </Row>

        <Row split="full">
          <Card>
            <CardHead title="Notifications" subtitle="Toggles apply immediately" />
            <div className="sv-card__body" style={stack}>
              <Toggle label="Order updates" defaultChecked />
              <Toggle label="Weekly digest" defaultChecked />
              <Toggle label="Security alerts" defaultChecked />
              <Toggle label="Product news" />
            </div>
            <fieldset className="sv-card__body" style={stack}>
              <legend className="sv-mono">DIGEST FREQUENCY</legend>
              <Radio name="freq" label="Daily" value="daily" />
              <Radio name="freq" label="Weekly" value="weekly" defaultChecked />
              <Radio name="freq" label="Monthly" value="monthly" />
            </fieldset>
          </Card>
        </Row>

        <Row split="full">
          <Card>
            <CardHead title="Security" subtitle="Protect access to this account" />
            <div className="sv-card__body" style={stack}>
              <Field
                label="Current password"
                type="password"
                autoComplete="current-password"
                hint="Enter your existing password to confirm changes"
              />
              <Checkbox label="Require 2FA on new devices" defaultChecked />
              <div>
                <Button variant="ghost">Update password</Button>
              </div>
            </div>
          </Card>
        </Row>

        <Row split="main">
          <div />
          <div style={rightBar}>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save changes</Button>
          </div>
        </Row>
      </Sheet>
    </div>
  );
}
