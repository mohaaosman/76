// Warehouse floor activity — absolute-time ERP event log.
import { Sheet, Row, Card, CardHead, ActivityList } from '@/components/seventy-six';

const ITEMS = [
  {
    time: '14:28',
    dateTime: '2026-07-24T14:28:00+03:00',
    children: (
      <>
        <b>Priya Nair</b> released <b>ORD-10482</b> to picking in <b>Zone B</b>.
      </>
    ),
  },
  {
    time: '14:11',
    dateTime: '2026-07-24T14:11:00+03:00',
    children: (
      <>
        <b>PO-2291</b> received — 340 units booked to <b>Zone A</b>.
      </>
    ),
  },
  {
    time: '13:52',
    dateTime: '2026-07-24T13:52:00+03:00',
    children: (
      <>
        <b>Marcus Bell</b> flagged a short pick on <b>ORD-10476</b>.
      </>
    ),
  },
  {
    time: '13:37',
    dateTime: '2026-07-24T13:37:00+03:00',
    children: (
      <>
        <b>ORD-10479</b> staged for carrier pickup at <b>Dock 3</b>.
      </>
    ),
  },
  {
    time: '13:04',
    dateTime: '2026-07-24T13:04:00+03:00',
    children: (
      <>
        <b>Ana Sokolova</b> closed cycle count for <b>Zone C</b>.
      </>
    ),
  },
  {
    time: '12:46',
    dateTime: '2026-07-24T12:46:00+03:00',
    children: (
      <>
        <b>PO-2288</b> partially received — 12 units held for inspection.
      </>
    ),
  },
];

export function ActivityPanel() {
  return (
    <Sheet aria-label="Activity">
      <Row split="full">
        <Card>
          <CardHead title="Activity" subtitle="Warehouse floor · today" />
          <ActivityList items={ITEMS} />
        </Card>
      </Row>
    </Sheet>
  );
}
