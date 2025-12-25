import { Link } from 'react-router-dom';
import { MapPin, BedDouble, ShieldCheck, Star } from 'lucide-react';
import type { Property } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '@/utils/cn';

type Props = {
  property: Property;
  ctaText?: string;
  className?: string;
  footer?: React.ReactNode;
};

export const PropertyCard = ({ property, ctaText = 'View details', className, footer }: Props) => {
  const img = property.primaryImage || property.images?.[0];
  return (
    <div className={cn('grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/50', className)}>
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        <img
          src={img || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'}
          alt={property.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {property.isVerified && <Badge tone="success">Verified</Badge>}
          {property.isFeatured && <Badge tone="primary">Featured</Badge>}
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{property.name}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>
              {property.city}, {property.state}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <Badge tone="muted">{property.propertyType}</Badge>
            <Badge tone="muted">{property.genderPreference}</Badge>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-semibold">
              <BedDouble className="h-4 w-4" />
              {property.availableBeds ?? 0} available
            </div>
          </div>
        </div>
        <div className="text-right">
          {property.avgRating ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
              <Star className="h-4 w-4" />
              {property.avgRating}
            </div>
          ) : (
            <Badge tone="muted">New</Badge>
          )}
          <p className="mt-3 text-sm text-slate-500">From</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(property.minRent)}</p>
          <p className="text-xs text-slate-500">upto {formatCurrency(property.maxRent)}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 line-clamp-2">{property.description || 'Comfortable PG managed by trusted owner.'}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 text-(--color-primary)" />
          <span>{property.owner.businessName || 'Verified owner'}</span>
        </div>
        <Link to={`/properties/${property.id}`}>
          <Button size="sm">{ctaText}</Button>
        </Link>
      </div>
      {footer}
    </div>
  );
};
