import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

type Props = {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: 'blue' | 'orange' | 'emerald' | 'slate';
};

export const StatCard = ({ title, value, hint, icon: Icon, accent = 'blue' }: Props) => {
  const accentClass = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }[accent];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-sm text-slate-600">{hint}</p>}
        </div>
        <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1', accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
