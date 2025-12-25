import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;
  const prevDisabled = page <= 0;
  const nextDisabled = page >= totalPages - 1;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={prevDisabled}
        onClick={() => onPageChange(Math.max(0, page - 1))}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-slate-600">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={nextDisabled}
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
