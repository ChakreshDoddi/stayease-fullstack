import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, BedSingle } from 'lucide-react';
import { cancelBooking, fetchMyBookings } from '@/api/bookings';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency, formatDate } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errors';

const UserBookingsPage = () => {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ['my-bookings', { page }],
    queryFn: () => fetchMyBookings(page, 10),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const canCancel = (status: string) => {
    return status === 'PENDING' || status === 'CONFIRMED';
  };

  if (bookingsQuery.isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your reservations</p>
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage your accommodation bookings</p>
        </div>
      </div>

      {!bookingsQuery.data?.content.length ? (
        <EmptyState
          icon={<BedSingle className="h-5 w-5" />}
          title="No bookings yet"
          description="When you book a bed, your reservations will appear here"
        />
      ) : (
        <>
          <div className="space-y-4">
            {bookingsQuery.data.content.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{booking.propertyName}</h3>
                      <StatusPill status={booking.status} />
                    </div>
                    <div className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>
                          Room {booking.roomNumber} · Bed {booking.bedNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>
                          {formatDate(booking.checkInDate)} → {booking.checkOutDate ? formatDate(booking.checkOutDate) : 'Open-ended'}
                        </span>
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-sm text-slate-600">
                        <span className="font-semibold">Notes:</span> {booking.notes}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold text-slate-500">Monthly Rent</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(Number(booking.monthlyRent))}</p>
                    {booking.securityDeposit && (
                      <p className="mt-1 text-xs text-slate-500">
                        Deposit: {formatCurrency(Number(booking.securityDeposit))}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold">Booking Ref:</span> {booking.bookingReference}
                  </div>
                  {canCancel(booking.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelMutation.mutate(booking.id)}
                      disabled={cancelMutation.isPending}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {bookingsQuery.data.totalPages > 1 && (
            <Pagination
              page={bookingsQuery.data.page}
              totalPages={bookingsQuery.data.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserBookingsPage;