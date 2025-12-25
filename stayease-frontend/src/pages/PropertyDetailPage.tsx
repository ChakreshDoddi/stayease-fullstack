import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Phone, ShieldCheck, BedSingle, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { fetchPropertyById, fetchPropertyRooms } from '@/api/properties';
import { createBooking } from '@/api/bookings';
import { createInquiry } from '@/api/inquiries';
import { RoomCard } from '@/components/RoomCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusPill } from '@/components/StatusPill';
import { useAuth } from '@/auth/AuthProvider';
import { getErrorMessage } from '@/utils/errors';
import { formatCurrency } from '@/utils/format';
import type { Room } from '@/types/api';
import type { BedStatus } from '@/types/domain';
import { toast } from 'react-hot-toast';

const bookingSchema = z.object({
  roomId: z.coerce.number().min(1, 'Room is required'),
  bedId: z.coerce.number().min(1, 'Bed is required'),
  checkInDate: z.string().min(1, 'Check-in date required'),
  checkOutDate: z.string().optional(),
  notes: z.string().max(500).optional(),
});

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10}$/, '10-digit phone'),
  message: z.string().max(500).optional(),
  preferredVisitDate: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;
type InquiryForm = z.infer<typeof inquirySchema>;

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const propertyQuery = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => fetchPropertyById(propertyId),
    enabled: Number.isFinite(propertyId),
  });

  const roomsQuery = useQuery({
    queryKey: ['property-rooms', propertyId],
    queryFn: () => fetchPropertyRooms(propertyId),
    enabled: Number.isFinite(propertyId),
  });

  const bookingForm = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      roomId: undefined,
      bedId: undefined,
      checkInDate: '',
      checkOutDate: '',
      notes: '',
    },
  });

  const inquiryForm = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: 'Hi, I am interested in this PG. Please contact me.',
    },
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success('Booking created. Await owner confirmation.');
      void queryClient.invalidateQueries({ queryKey: ['property-rooms', propertyId] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const inquiryMutation = useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      toast.success('Inquiry sent to owner');
      inquiryForm.reset();
    },
    onError: (err) => {
      const msg = getErrorMessage(err);
      toast.error(msg.includes('404') ? 'Inquiry endpoint not available in backend yet.' : msg);
    },
  });

  const selectedRoomId = bookingForm.watch('roomId');
  const selectedRoom: Room | undefined = useMemo(
    () => roomsQuery.data?.find((r) => r.id === Number(selectedRoomId)),
    [roomsQuery.data, selectedRoomId],
  );

  const availableBeds = selectedRoom?.beds?.filter((b) => b.status === ('AVAILABLE' as BedStatus)) || [];

  const handleBookingSubmit = (values: BookingForm) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a bed.');
      return;
    }
    bookingMutation.mutate({
      propertyId,
      roomId: Number(values.roomId),
      bedId: Number(values.bedId),
      checkInDate: values.checkInDate,
      checkOutDate: values.checkOutDate || null,
      notes: values.notes,
    });
  };

  const handleInquirySubmit = (values: InquiryForm) => {
    inquiryMutation.mutate({
      propertyId,
      ...values,
      preferredVisitDate: values.preferredVisitDate || null,
    });
  };

  if (propertyQuery.isLoading || roomsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!propertyQuery.data) {
    return <p className="text-sm text-slate-600">Property not found.</p>;
  }

  const property = propertyQuery.data;

  return (
    <div className="space-y-8">
      <Link to="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary)">
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/60">
            <div className="relative">
              <img
                src={
                  property.primaryImage ||
                  property.images?.[0] ||
                  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
                }
                alt={property.name}
                className="h-64 w-full object-cover"
              />
              <div className="absolute left-4 top-4 flex gap-2">
                {property.isVerified && <Badge tone="success">Verified</Badge>}
                {property.isFeatured && <Badge tone="primary">Featured</Badge>}
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">{property.name}</h1>
                <StatusPill status={property.propertyType} />
                <StatusPill status={property.genderPreference} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {property.fullAddress || `${property.addressLine1}, ${property.city}`}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Security deposit {formatCurrency(Number(property.securityDeposit))}
                </span>
              </div>
              <p className="text-slate-700">{property.description || 'Comfortable PG with owner-managed amenities.'}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                {property.amenities?.map((a) => (
                  <span key={a} className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                    {a}
                  </span>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-700">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Available beds</p>
                  <p className="text-xl font-semibold">{property.availableBeds ?? 0}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Rent range</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(Number(property.minRent))} - {formatCurrency(Number(property.maxRent))}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Notice period</p>
                  <p className="text-xl font-semibold">{property.noticePeriodDays} days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Rooms & beds</h3>
              <StatusPill status={`${property.totalRooms || 0} rooms`} />
            </div>
            <div className="space-y-3">
              {roomsQuery.data?.map((room) => (
                <RoomCard key={room.id} room={room} onSelect={(r) => bookingForm.setValue('roomId', r.id)} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Book a bed</p>
                <p className="text-lg font-bold text-slate-900">Instant request</p>
              </div>
              <BedSingle className="h-8 w-8 text-(--color-primary)" />
            </div>
            {!isAuthenticated && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                Sign in to reserve a bed.
              </p>
            )}
            <form
              className="mt-4 space-y-3"
              onSubmit={bookingForm.handleSubmit((values) => handleBookingSubmit(values as BookingForm))}
            >
              <div>
                <label className="text-sm font-semibold text-slate-700">Room</label>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...bookingForm.register('roomId')}
                >
                  <option value="">Select room</option>
                  {roomsQuery.data?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} · {room.roomType} · {room.availableBeds} beds open
                    </option>
                  ))}
                </select>
                {bookingForm.formState.errors.roomId && (
                  <p className="mt-1 text-xs text-rose-600">{bookingForm.formState.errors.roomId.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Bed</label>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...bookingForm.register('bedId')}
                  disabled={!selectedRoom}
                >
                  <option value="">Select bed</option>
                  {availableBeds.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.bedNumber}
                    </option>
                  ))}
                </select>
                {bookingForm.formState.errors.bedId && (
                  <p className="mt-1 text-xs text-rose-600">{bookingForm.formState.errors.bedId.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Check-in</label>
                  <Input type="date" {...bookingForm.register('checkInDate')} min={new Date().toISOString().split('T')[0]} />
                  {bookingForm.formState.errors.checkInDate && (
                    <p className="mt-1 text-xs text-rose-600">{bookingForm.formState.errors.checkInDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Check-out (optional)</label>
                  <Input type="date" {...bookingForm.register('checkOutDate')} />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Notes</label>
                <Textarea placeholder="Add preferences or move-in notes" {...bookingForm.register('notes')} />
              </div>
              <Button type="submit" disabled={!isAuthenticated || bookingMutation.isPending} className="w-full">
                {bookingMutation.isPending ? 'Booking...' : 'Request booking'}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Talk to owner</p>
                <p className="text-lg font-bold text-slate-900">{property.owner.name}</p>
                <p className="text-sm text-slate-600">{property.owner.businessName || 'Property owner'}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{property.owner.phone || 'Shared after booking'}</span>
              </div>
            </div>
            <form className="mt-4 space-y-3" onSubmit={inquiryForm.handleSubmit(handleInquirySubmit)}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Name</label>
                  <Input placeholder="Your name" {...inquiryForm.register('name')} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <Input type="email" placeholder="you@example.com" {...inquiryForm.register('email')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Phone</label>
                  <Input placeholder="10-digit" {...inquiryForm.register('phone')} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Preferred visit</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input type="date" className="pl-9" {...inquiryForm.register('preferredVisitDate')} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <Textarea rows={3} {...inquiryForm.register('message')} />
              </div>
              <Button type="submit" variant="outline" className="w-full" disabled={inquiryMutation.isPending}>
                {inquiryMutation.isPending ? 'Sending...' : 'Send inquiry'}
              </Button>
              <p className="text-[11px] text-slate-500">
                Endpoint note: backend has no inquiries controller yet. If this fails, booking is still available.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetailPage;
