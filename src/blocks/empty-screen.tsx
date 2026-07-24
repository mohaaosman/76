// Empty state — no purchase orders yet this period, with a single primary action.
import { Sheet, Row, Card, EmptyState, Button } from '@/components/seventy-six';

export function EmptyScreen() {
  return (
    <Sheet aria-label="Purchase orders">
      <Row split="full">
        <Card>
          <EmptyState
            sentence="No purchase orders have been raised this period. Orders you create will appear here with their supplier, value, and approval status."
            action={<Button variant="primary">Create purchase order</Button>}
          />
        </Card>
      </Row>
    </Sheet>
  );
}
