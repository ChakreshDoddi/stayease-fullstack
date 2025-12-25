import { cn } from '@/utils/cn';
import type { BookingStatus, BedStatus, RoomType } from '@/types/domain';

type Status = BookingStatus | BedStatus | RoomType | string;

const toneMap: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  CONFIRMED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  CHECKED_IN: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  CHECKED_OUT: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  AVAILABLE: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  RESERVED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  OCCUPIED: 'bg-orange-50 text-orange-700 ring-1 ring-orange-100',
  MAINTENANCE: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
};

export const StatusPill = ({ status }: { status: Status }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      toneMap[status] || 'bg-slate-100 text-slate-700',
    )}
  >
    {status}
  </span>
);
