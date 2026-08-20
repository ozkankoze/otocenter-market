import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Buton — design system §12.4
 * Geçiş yalnızca renk üzerinden, 150ms. Ölçek/zıplama animasyonu YOK.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'rounded-md border border-transparent',
    'transition-[background-color,border-color,color] duration-150 ease-out',
    'disabled:cursor-not-allowed disabled:border-ink-100 disabled:bg-ink-100 disabled:text-ink-400',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700',
        secondary:
          'border-brand-300 bg-white text-brand-600 hover:border-brand-600 hover:bg-brand-50',
        ghost: 'bg-transparent text-ink-600 hover:bg-ink-50 hover:text-ink-900',
        white: 'bg-white text-brand-700 hover:bg-brand-50',
        danger: 'bg-danger text-white hover:brightness-90',
      },
      size: {
        sm: 'h-9 px-3.5 text-[13px]',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-6 text-[15px]',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
})

export { buttonVariants }
