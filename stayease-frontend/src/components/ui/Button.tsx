import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        primary:
          'bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/30 hover:-translate-y-[1px] focus-visible:outline-(--color-primary)',
        outline:
          'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-slate-400',
        ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-300',
        muted: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:outline-slate-300',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-2.5',
        lg: 'px-5 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
};
