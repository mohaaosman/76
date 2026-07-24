// 76° block · Key metrics stat row (ERP operations).
import { Sheet, Row, StatS1 } from '@/components/seventy-six';

export function StatsRow() {
  return (
    <Sheet aria-label="Key metrics">
      <Row split="stats">
        <StatS1
          label="REVENUE · MTD"
          value="$482,190"
          delta={12.4}
          icon={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 11l4-4 3 3 5-6" />
              <path d="M14 4v4h-4" />
            </svg>
          }
          footnote={<><b>$610K</b> target · 79% with 7 days left</>}
          footnoteText="610 thousand dollar target, 79 percent reached with 7 days left"
        />
        <StatS1
          label="OPEN ORDERS"
          value="1,284"
          delta={-3.1}
          icon={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 4h9l1 8H3z" />
              <path d="M11 4l2 2" />
            </svg>
          }
          footnote={<>Oldest is <b>4d 6h</b> against a 3-day SLA</>}
          footnoteText="Oldest open order is 4 days 6 hours against a 3-day SLA"
        />
        <StatS1
          label="FILL RATE · MTD"
          value="96.3"
          unit="%"
          delta={1.8}
          icon={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M13 4L6 12 3 9" />
            </svg>
          }
          footnote={<><b>412</b> lines short-shipped from 11,140</>}
          footnoteText="412 lines short-shipped out of 11,140"
        />
        <StatS1
          label="ON-HAND VALUE"
          value="$3.94M"
          icon={
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 5l6-3 6 3-6 3z" />
              <path d="M2 5v6l6 3 6-3V5" />
            </svg>
          }
          footnote={<><b>62 days</b> of cover across 4 warehouses</>}
          footnoteText="62 days of cover across 4 warehouses"
        />
      </Row>
    </Sheet>
  );
}
