import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ className, children, ...props }: Props) => {
  return (
    <select
      className={cn(
        'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30 disabled:cursor-not-allowed disabled:bg-slate-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
};
