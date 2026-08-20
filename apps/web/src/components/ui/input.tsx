import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-md border border-ink-200 bg-white px-3.5 text-sm text-ink-900',
        'placeholder:text-ink-400',
        'transition-[border-color,box-shadow] duration-150',
        'focus:border-brand-600 focus:ring-3 focus:ring-brand-600/12 focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
        className,
      )}
      {...props}
    />
  )
})

/** İkonlu arama kutusu — header ve hero'da kullanılır. */
export function SearchInput({
  className,
  inputClassName,
  ...props
}: InputProps & { inputClassName?: string }) {
  return (
    <div className={cn('relative', className)}>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-400"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <Input className={cn('pl-11', inputClassName)} {...props} />
    </div>
  )
}
