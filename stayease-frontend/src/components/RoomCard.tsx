import { BedDouble, Bath, Snowflake, SunMedium, CircleCheck } from 'lucide-react';
import type { Room } from '@/types/api';
import { formatCurrency } from '@/utils/format';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

type Props = {
  room: Room;
  onSelect?: (room: Room) => void;
  actionLabel?: string;
};

export const RoomCard = ({ room, onSelect, actionLabel = 'Select room' }: Props) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Room {room.roomNumber}</p>
          <h4 className="text-lg font-semibold text-slate-900">{room.roomType} sharing</h4>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <Badge tone="primary">{room.availableBeds} / {room.totalBeds} beds</Badge>
            {room.hasAttachedBathroom && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                <Bath className="h-4 w-4" /> Attached bath
              </span>
            )}
            {room.hasAc && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                <Snowflake className="h-4 w-4" /> AC
              </span>
            )}
            {room.hasBalcony && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                <SunMedium className="h-4 w-4" /> Balcony
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-600">{room.description || 'Well lit, ventilated room.'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-slate-500">Per bed</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(Number(room.rentPerBed))}</p>
          <p className="text-xs text-slate-500">Floor {room.floorNumber ?? 0}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CircleCheck className="h-4 w-4 text-emerald-500" />
          {room.availableBeds > 0 ? 'Beds open' : 'No beds available'}
        </div>
        {onSelect && (
          <Button size="sm" disabled={!room.availableBeds} onClick={() => onSelect(room)}>
            <BedDouble className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
