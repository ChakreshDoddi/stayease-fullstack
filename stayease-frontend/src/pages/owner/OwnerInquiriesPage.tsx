import { Inbox } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const OwnerInquiriesPage = () => {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-100 p-3 text-slate-700">
          <Inbox className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inquiries</p>
          <h3 className="text-xl font-bold text-slate-900">Lead inbox</h3>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        The backend currently exposes the `Inquiry` entity but no controller/endpoint for owners. Once the API is added
        (e.g., `/owner/inquiries` and `/inquiries`), wire them here. For now, inquiries submitted on the property page
        will likely 404. Booking flows are fully wired.
      </p>
      <Button variant="outline" disabled>
        Awaiting backend endpoint
      </Button>
    </Card>
  );
};

export default OwnerInquiriesPage;
