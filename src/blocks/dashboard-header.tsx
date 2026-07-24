// Chrome block — Band topbar, primary nav, sub-tabs, and the page hero.
import { Band, BandTopbar, BandNav, BandSubTabs, PageHero, Button } from '@/components/seventy-six';

export function DashboardHeader() {
  return (
    <Band>
      <BandTopbar
        app="Warehouse"
        nav={
          <BandNav
            items={[
              { label: 'Overview', href: '#overview', active: true },
              { label: 'Orders', href: '#orders' },
              { label: 'Inventory', href: '#inventory' },
              { label: 'Suppliers', href: '#suppliers' },
            ]}
          />
        }
        utilities={
          <button type="button" className="sv-mono" aria-label="Search">
            SEARCH ⌘K
          </button>
        }
      />
      <BandSubTabs
        items={[
          { label: 'Today', href: '#today', active: true },
          { label: '7 days', href: '#7-days' },
          { label: 'Month', href: '#month' },
        ]}
      />
      <PageHero
        headingLevel={2}
        breadcrumb={['OPERATIONS', 'OVERVIEW']}
        title="Overview"
        context="24 Jul · all zones · synced 2 min ago"
        actions={
          <>
            <Button variant="ghost">Export</Button>
            <Button variant="primary">Create order</Button>
          </>
        }
      />
    </Band>
  );
}
