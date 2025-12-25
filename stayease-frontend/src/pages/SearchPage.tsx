import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { searchProperties } from '@/api/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import type { GenderPreference, PropertyType } from '@/types/domain';
import type { PagedResponse, Property } from '@/types/api';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'react-hot-toast';

type FilterForm = {
  city?: string;
  propertyType?: PropertyType | '';
  genderPreference?: GenderPreference | '';
  minRent?: number | undefined;
  maxRent?: number | undefined;
  availableBeds?: number | undefined;
};

const propertyTypes: PropertyType[] = ['PG', 'HOSTEL', 'FLAT', 'APARTMENT'];
const genders: GenderPreference[] = ['MALE', 'FEMALE', 'COED'];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 0;

  const { register, handleSubmit, reset } = useForm<FilterForm>({
    defaultValues: {
      city: params.get('city') || '',
      propertyType: (params.get('propertyType') as PropertyType) || '',
      genderPreference: (params.get('genderPreference') as GenderPreference) || '',
      minRent: params.get('minRent') ? Number(params.get('minRent')) : undefined,
      maxRent: params.get('maxRent') ? Number(params.get('maxRent')) : undefined,
      availableBeds: params.get('availableBeds') ? Number(params.get('availableBeds')) : undefined,
    },
  });

  const queryParams = {
    city: params.get('city') || undefined,
    propertyType: (params.get('propertyType') as PropertyType) || undefined,
    genderPreference: (params.get('genderPreference') as GenderPreference) || undefined,
    minRent: params.get('minRent') ? Number(params.get('minRent')) : undefined,
    maxRent: params.get('maxRent') ? Number(params.get('maxRent')) : undefined,
    availableBeds: params.get('availableBeds') ? Number(params.get('availableBeds')) : undefined,
    page,
    size: 6,
  };

  const query = useQuery<PagedResponse<Property>>({
    queryKey: ['search-properties', queryParams],
    queryFn: () => searchProperties(queryParams),
  });

  useEffect(() => {
    if (query.error) {
      toast.error(getErrorMessage(query.error));
    }
  }, [query.error]);

  useEffect(() => {
    reset({
      city: queryParams.city || '',
      propertyType: (queryParams.propertyType as PropertyType) || '',
      genderPreference: (queryParams.genderPreference as GenderPreference) || '',
      minRent: queryParams.minRent,
      maxRent: queryParams.maxRent,
      availableBeds: queryParams.availableBeds,
    });
  }, [params, reset]);

  const onSubmit = (values: FilterForm) => {
    const next = new URLSearchParams();
    if (values.city) next.set('city', values.city);
    if (values.propertyType) next.set('propertyType', values.propertyType);
    if (values.genderPreference) next.set('genderPreference', values.genderPreference);
    if (values.minRent) next.set('minRent', String(values.minRent));
    if (values.maxRent) next.set('maxRent', String(values.maxRent));
    if (values.availableBeds) next.set('availableBeds', String(values.availableBeds));
    next.set('page', '0');
    setParams(next);
    void query.refetch();
  };

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(nextPage));
    setParams(next);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm shadow-slate-200/60">
        <form className="grid gap-4 md:grid-cols-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">City</label>
            <Input placeholder="e.g. Bangalore" {...register('city')} />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Property type</label>
            <Select {...register('propertyType')}>
              <option value="">Any</option>
              {propertyTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Gender preference</label>
            <Select {...register('genderPreference')}>
              <option value="">Any</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Min rent</label>
              <Input type="number" min={0} {...register('minRent', { valueAsNumber: true })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Max rent</label>
              <Input type="number" min={0} {...register('maxRent', { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Beds available</label>
            <Input type="number" min={0} {...register('availableBeds', { valueAsNumber: true })} />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="w-full">
              Apply filters
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setParams(new URLSearchParams());
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      {query.isLoading || query.isFetching ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : query.data && query.data.content.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {query.data.content.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <Pagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">No properties match the current filters</p>
          <p className="text-sm text-slate-600">Try adjusting your criteria or reset filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
