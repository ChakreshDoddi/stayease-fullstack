import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BedDouble, Pencil, Power, Trash } from 'lucide-react';
import { fetchOwnerProperties } from '@/api/properties';
import { createRoom, deleteRoom, fetchOwnerRooms, toggleRoomStatus, updateRoom } from '@/api/rooms';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { StatusPill } from '@/components/StatusPill';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import type { PagedResponse, Property, Room } from '@/types/api';
import type { RoomType } from '@/types/domain';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

const roomSchema = z.object({
  roomNumber: z.string().min(1).max(20),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY']),
  floorNumber: z.coerce.number().optional(),
  totalBeds: z.coerce.number().min(1),
  rentPerBed: z.coerce.number().positive(),
  hasAttachedBathroom: z.boolean().optional(),
  hasAc: z.boolean().optional(),
  hasBalcony: z.boolean().optional(),
  roomSizeSqft: z.coerce.number().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof roomSchema>;
const roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY'];

const OwnerRoomsPage = () => {
  const queryClient = useQueryClient();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Room | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: {
      roomType: 'DOUBLE',
      totalBeds: 2,
      rentPerBed: 8000,
    },
  });

  const propertiesQuery = useQuery<PagedResponse<Property>>({
    queryKey: ['owner-properties', { page: 0, size: 50 }],
    queryFn: () => fetchOwnerProperties(0, 50),
  });

  useEffect(() => {
    if (!selectedPropertyId && propertiesQuery.data?.content.length) {
      setSelectedPropertyId(propertiesQuery.data.content[0].id);
    }
  }, [propertiesQuery.data, selectedPropertyId]);

  const roomsQuery = useQuery({
    queryKey: ['owner-rooms', selectedPropertyId],
    queryFn: () => fetchOwnerRooms(selectedPropertyId!),
    enabled: Boolean(selectedPropertyId),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        roomNumber: editing.roomNumber,
        roomType: editing.roomType,
        floorNumber: editing.floorNumber ?? 0,
        totalBeds: editing.totalBeds,
        rentPerBed: Number(editing.rentPerBed),
        hasAttachedBathroom: editing.hasAttachedBathroom,
        hasAc: editing.hasAc,
        hasBalcony: editing.hasBalcony,
        roomSizeSqft: editing.roomSizeSqft || undefined,
        description: editing.description || '',
      });
    }
  }, [editing, form]);

  const upsertMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!selectedPropertyId) throw new Error('Select property first');
      if (editing) return updateRoom(editing.id, values);
      return createRoom(selectedPropertyId, values);
    },
    onSuccess: () => {
      toast.success(editing ? 'Room updated' : 'Room created');
      setEditing(null);
      form.reset();
      void queryClient.invalidateQueries({ queryKey: ['owner-rooms', selectedPropertyId] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => toggleRoomStatus(id, isActive),
    onSuccess: () => {
      toast.success('Room status updated');
      void queryClient.invalidateQueries({ queryKey: ['owner-rooms', selectedPropertyId] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      toast.success('Room removed');
      void queryClient.invalidateQueries({ queryKey: ['owner-rooms', selectedPropertyId] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Manage rooms & beds</p>
            <h3 className="text-xl font-bold text-slate-900">Add rooms to your property</h3>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Select property</label>
            <Select
              value={selectedPropertyId ?? ''}
              onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
              className="mt-1"
            >
              {propertiesQuery.data?.content.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </Select>
          </div>
        </div>
        <form
          className="grid gap-4 md:grid-cols-3"
          onSubmit={form.handleSubmit((values) => upsertMutation.mutate(roomSchema.parse(values)))}
        >
          <div>
            <label className="text-sm font-semibold text-slate-700">Room number</label>
            <Input {...form.register('roomNumber')} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Room type</label>
            <Select {...form.register('roomType')}>
              {roomTypes.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Floor</label>
            <Input type="number" {...form.register('floorNumber', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Total beds</label>
            <Input type="number" {...form.register('totalBeds', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Rent per bed</label>
            <Input type="number" {...form.register('rentPerBed', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Room size (sqft)</label>
            <Input type="number" {...form.register('roomSizeSqft', { valueAsNumber: true })} />
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-3 text-sm font-semibold text-slate-700">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" {...form.register('hasAttachedBathroom')} />
              Attached bath
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" {...form.register('hasAc')} />
              AC
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" {...form.register('hasBalcony')} />
              Balcony
            </label>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <Textarea rows={3} {...form.register('description')} />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2">
            {editing && (
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel edit
              </Button>
            )}
            <Button type="submit" disabled={!selectedPropertyId || upsertMutation.isPending}>
              {upsertMutation.isPending ? 'Saving...' : editing ? 'Update room' : 'Create room'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {roomsQuery.data?.map((room) => (
          <Card key={room.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Room {room.roomNumber} · {room.roomType}
                </p>
                <p className="text-xs text-slate-500">Floor {room.floorNumber ?? 0}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                  <Badge tone="muted">
                    Beds {room.availableBeds}/{room.totalBeds}
                  </Badge>
                  <Badge tone="muted">{formatCurrency(Number(room.rentPerBed))}/bed</Badge>
                </div>
              </div>
              <StatusPill status={room.isActive ? 'ACTIVE' : 'INACTIVE'} />
            </div>
            <p className="mt-2 text-sm text-slate-700 line-clamp-2">{room.description || 'No description'}</p>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
              <div className="flex gap-2">
                {room.hasAttachedBathroom && <Badge tone="muted">Attached bath</Badge>}
                {room.hasAc && <Badge tone="muted">AC</Badge>}
                {room.hasBalcony && <Badge tone="muted">Balcony</Badge>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(room)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleMutation.mutate({ id: room.id, isActive: !room.isActive })}>
                  <Power className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(room.id)}>
                  <Trash className="h-4 w-4 text-rose-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {!roomsQuery.data?.length && (
          <Card className="text-sm text-slate-600">
            <div className="flex items-center gap-2 text-slate-700">
              <BedDouble className="h-4 w-4" />
              No rooms yet
            </div>
            <p className="mt-2">Add your first room to start accepting bookings.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OwnerRoomsPage;
