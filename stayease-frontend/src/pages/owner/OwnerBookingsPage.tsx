import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { Button } from '@/components/ui/Button';
import { fetchOwnerBookings, updateBookingStatus } from '@/api/bookings';
import type { BookingStatus } from '@/types/domain';
import { formatCurrency, formatDate } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';

const statusOptions: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

const OwnerBookingsPage = () => {
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ['owner-bookings', { status, page }],
    queryFn: () => fetchOwnerBookings({ status: status || undefined, page }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ bookingId, nextStatus }: { bookingId: number; nextStatus: BookingStatus }) =>
      updateBookingStatus(bookingId, nextStatus),
    onSuccess: () => {
      toast.success('Booking status updated');
      void queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const availableActions: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
    CHECKED_IN: ['CHECKED_OUT'],
    CHECKED_OUT: [],
    CANCELLED: [],
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bookings</p>
          <h3 className="text-xl font-bold text-slate-900">Manage booking pipeline</h3>
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | '')} className="w-48">
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-3">
        {bookingsQuery.data?.content.map((b) => (
          <Card key={b.id} className="grid gap-2 md:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{b.userName}</p>
              <p className="text-xs text-slate-500">Ref {b.bookingReference}</p>
              <StatusPill status={b.status} />
            </div>
            <div className="text-sm text-slate-700">
              <p className="font-semibold">{b.propertyName}</p>
              <p className="text-xs text-slate-500">
                Room {b.roomNumber} · Bed {b.bedNumber}
              </p>
              <p className="text-xs text-slate-500">
                {formatDate(b.checkInDate)} → {b.checkOutDate ? formatDate(b.checkOutDate) : 'Open'}
              </p>
            </div>
            <div className="text-sm font-semibold text-slate-900">{formatCurrency(Number(b.monthlyRent))}/mo</div>
            <div className="flex flex-wrap items-center gap-2">
              {availableActions[b.status].map((next) => (
                <Button
                  key={next}
                  size="sm"
                  variant="outline"
                  onClick={() => statusMutation.mutate({ bookingId: b.id, nextStatus: next })}
                  disabled={statusMutation.isPending}
                >
                  {next}
                </Button>
              ))}
            </div>
          </Card>
        ))}
        {!bookingsQuery.data?.content.length && (
          <Card className="text-sm text-slate-600">No bookings yet for this filter.</Card>
        )}
      </div>

      {bookingsQuery.data && (
        <Pagination
          page={bookingsQuery.data.page}
          totalPages={bookingsQuery.data.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
};

export default OwnerBookingsPage;
