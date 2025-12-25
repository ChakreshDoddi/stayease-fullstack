import { useQuery } from '@tanstack/react-query';
import { Activity, BedDouble, Home, Users } from 'lucide-react';
import { fetchOwnerBookings } from '@/api/bookings';
import { fetchOwnerProperties } from '@/api/properties';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/StatusPill';
import { formatCurrency, formatDate } from '@/utils/format';

const OwnerDashboardPage = () => {
  const propertiesQuery = useQuery({
    queryKey: ['owner-properties', { page: 0, size: 50 }],
    queryFn: () => fetchOwnerProperties(0, 50),
  });

  const bookingsQuery = useQuery({
    queryKey: ['owner-bookings', { status: undefined, page: 0, size: 20 }],
    queryFn: () => fetchOwnerBookings({ page: 0, size: 20 }),
  });

  const totalProperties = propertiesQuery.data?.totalElements || 0;
  const totalBeds = propertiesQuery.data?.content.reduce((acc, p) => acc + (p.totalBeds || 0), 0) || 0;
  const availableBeds = propertiesQuery.data?.content.reduce((acc, p) => acc + (p.availableBeds || 0), 0) || 0;
  const openBookings =
    bookingsQuery.data?.content.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED').length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total properties" value={totalProperties} hint="Your live listings" icon={Home} />
        <StatCard
          title="Beds available"
          value={availableBeds}
          hint={`${totalBeds} total beds`}
          icon={BedDouble}
          accent="emerald"
        />
        <StatCard
          title="Active bookings"
          value={openBookings}
          hint="Pending + confirmed"
          icon={Activity}
          accent="orange"
        />
        <StatCard title="Tenants pipeline" value={bookingsQuery.data?.totalElements || 0} icon={Users} accent="blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">My properties</h3>
            <p className="text-xs text-slate-500">{propertiesQuery.data?.totalElements || 0} total</p>
          </div>
          <div className="space-y-3">
            {propertiesQuery.data?.content.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.city} · {p.state}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Beds: {p.availableBeds}/{p.totalBeds} · Rent {formatCurrency(Number(p.minRent))}
                  </p>
                </div>
                <StatusPill status={p.isVerified ? 'VERIFIED' : 'DRAFT'} />
              </div>
            ))}
            {!propertiesQuery.data?.content.length && <p className="text-sm text-slate-600">No properties yet.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent bookings</h3>
            <p className="text-xs text-slate-500">Last 20</p>
          </div>
          <div className="space-y-3">
            {bookingsQuery.data?.content.slice(0, 5).map((b) => (
              <div key={b.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{b.userName}</p>
                    <p className="text-xs text-slate-500">
                      {b.propertyName} · Room {b.roomNumber} · Bed {b.bedNumber}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    {formatDate(b.checkInDate)} → {b.checkOutDate ? formatDate(b.checkOutDate) : 'Open'}
                  </span>
                  <span>{formatCurrency(Number(b.monthlyRent))}/month</span>
                </div>
              </div>
            ))}
            {!bookingsQuery.data?.content.length && <p className="text-sm text-slate-600">No bookings yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
