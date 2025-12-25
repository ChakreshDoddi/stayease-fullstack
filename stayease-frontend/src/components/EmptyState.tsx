import type { ReactNode } from 'react';
import { Box } from 'lucide-react';
import { Button } from './ui/Button';

type Props = {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
};

export const EmptyState = ({ title, description, action, icon }: Props) => (
  <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-slate-600">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
      {icon || <Box className="h-5 w-5" />}
    </div>
    <h4 className="mt-3 text-lg font-semibold text-slate-900">{title}</h4>
    {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
    {action && (
      <div className="mt-4 flex justify-center">
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      </div>
    )}
  </div>
);
