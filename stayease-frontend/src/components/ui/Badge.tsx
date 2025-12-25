import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'primary' | 'success' | 'warning' | 'muted';
};

export const Badge = ({ className, tone = 'muted', ...props }: Props) => {
  const toneClass = {
    primary: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    muted: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  }[tone];

  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', toneClass, className)}
      {...props}
    />
  );
};
