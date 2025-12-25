import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash2, Pencil, Power } from 'lucide-react';
import {
  createProperty,
  deleteProperty,
  fetchAmenities,
  fetchOwnerProperties,
  togglePropertyStatus,
  updateProperty,
} from '@/api/properties';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/Pagination';
import { StatusPill } from '@/components/StatusPill';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import type { Property } from '@/types/api';
import type { GenderPreference, PropertyType } from '@/types/domain';
import { getErrorMessage } from '@/utils/errors';

const propertySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  propertyType: z.enum(['PG', 'HOSTEL', 'FLAT', 'APARTMENT']),
  genderPreference: z.enum(['MALE', 'FEMALE', 'COED']),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^[0-9]{6}$/),
  minRent: z.coerce.number().positive(),
  maxRent: z.coerce.number().positive(),
  securityDeposit: z.coerce.number().optional(),
  noticePeriodDays: z.coerce.number().optional(),
  amenityIds: z.array(z.number()).optional(),
  imageUrls: z.string().optional(),
});

type FormValues = z.infer<typeof propertySchema>;

const propertyTypes: PropertyType[] = ['PG', 'HOSTEL', 'FLAT', 'APARTMENT'];
const genderPreferences: GenderPreference[] = ['MALE', 'FEMALE', 'COED'];

const OwnerPropertiesPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Property | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      propertyType: 'PG',
      genderPreference: 'COED',
      minRent: 5000,
      maxRent: 15000,
      noticePeriodDays: 30,
    },
  });

  const amenitiesQuery = useQuery({ queryKey: ['amenities'], queryFn: fetchAmenities });

  const propertiesQuery = useQuery({
    queryKey: ['owner-properties', { page }],
    queryFn: () => fetchOwnerProperties(page, 6),
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        description: editing.description || '',
        propertyType: editing.propertyType,
        genderPreference: editing.genderPreference,
        addressLine1: editing.addressLine1,
        addressLine2: editing.addressLine2 || '',
        city: editing.city,
        state: editing.state,
        pincode: editing.pincode,
        minRent: Number(editing.minRent),
        maxRent: Number(editing.maxRent),
        securityDeposit: editing.securityDeposit ? Number(editing.securityDeposit) : undefined,
        noticePeriodDays: editing.noticePeriodDays || 30,
        amenityIds: amenitiesQuery.data
          ?.filter((a) => editing.amenities?.includes(a.name))
          .map((a) => a.id),
        imageUrls: editing.images?.join(', ') || '',
      });
    }
  }, [editing, form, amenitiesQuery.data]);

  const upsertMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        imageUrls: values.imageUrls ? values.imageUrls.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editing) return updateProperty(editing.id, payload);
      return createProperty(payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Property updated' : 'Property created');
      setEditing(null);
      form.reset();
      void queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => togglePropertyStatus(id, isActive),
    onSuccess: () => {
      toast.success('Status updated');
      void queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      toast.success('Property deactivated');
      void queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {editing ? 'Edit property' : 'Add property'}
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              {editing ? `Updating ${editing.name}` : 'Create a new listing'}
            </h3>
          </div>
          {editing && (
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel edit
            </Button>
          )}
        </div>
        <form
          className="grid gap-4 md:grid-cols-3"
          onSubmit={form.handleSubmit((values) => upsertMutation.mutate(propertySchema.parse(values)))}
        >
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <Input placeholder="Property name" {...form.register('name')} />
            {form.formState.errors.name && <p className="mt-1 text-xs text-rose-600">{form.formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Property type</label>
            <Select {...form.register('propertyType')}>
              {propertyTypes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Gender preference</label>
            <Select {...form.register('genderPreference')}>
              {genderPreferences.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Min rent</label>
            <Input type="number" {...form.register('minRent', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Max rent</label>
            <Input type="number" {...form.register('maxRent', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Security deposit</label>
            <Input type="number" {...form.register('securityDeposit', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Notice period (days)</label>
            <Input type="number" {...form.register('noticePeriodDays', { valueAsNumber: true })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Address line 1</label>
            <Input {...form.register('addressLine1')} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Address line 2</label>
            <Input {...form.register('addressLine2')} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">City</label>
            <Input {...form.register('city')} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">State</label>
            <Input {...form.register('state')} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Pincode</label>
            <Input {...form.register('pincode')} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <Textarea rows={3} {...form.register('description')} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenitiesQuery.data?.map((a) => (
                <label key={a.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                  <input
                    type="checkbox"
                    value={a.id}
                    {...form.register('amenityIds', { valueAsNumber: true })}
                    className="accent-[--color-primary]"
                  />
                  {a.name}
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-slate-700">Image URLs (comma separated)</label>
            <Input placeholder="https://image1, https://image2" {...form.register('imageUrls')} />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? 'Saving...' : editing ? 'Update property' : 'Create property'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {propertiesQuery.data?.content.map((p) => {
          const active = p.isActive ?? true;
          return (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.city}, {p.state}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                    <Badge tone="muted">{p.propertyType}</Badge>
                    <Badge tone="muted">{p.genderPreference}</Badge>
                    <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold">
                      {p.availableBeds}/{p.totalBeds} beds
                    </span>
                  </div>
                </div>
                <StatusPill status={p.isVerified ? 'VERIFIED' : 'DRAFT'} />
              </div>
              <p className="mt-2 text-sm text-slate-700 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                <span>
                  Rent {formatCurrency(Number(p.minRent))} - {formatCurrency(Number(p.maxRent))}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleMutation.mutate({ id: p.id, isActive: !active })}>
                    <Power className="h-4 w-4" />
                    {active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {propertiesQuery.data && (
        <Pagination
          page={propertiesQuery.data.page}
          totalPages={propertiesQuery.data.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
};

export default OwnerPropertiesPage;
