import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'text-white bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 shadow-lg shadow-blue-500/20 hover:from-blue-600/90 hover:via-indigo-500/90 hover:to-cyan-500/90 focus-visible:ring-blue-500/40 dark:from-blue-500 dark:via-indigo-500 dark:to-cyan-400',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-blue-500/30 bg-white/80 text-blue-700 shadow-xs hover:bg-blue-50 dark:border-blue-400/40 dark:bg-slate-900/60 dark:text-blue-100 dark:hover:bg-slate-900',
        secondary:
          'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-100 dark:hover:bg-blue-500/30',
        ghost:
          'text-blue-700 hover:bg-blue-50/80 hover:text-blue-800 dark:text-blue-200 dark:hover:bg-blue-500/20',
        link: 'text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline dark:text-blue-300',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
