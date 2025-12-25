import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm shadow-slate-200/60 backdrop-blur-sm',
      className,
    )}
    {...props}
  />
);
