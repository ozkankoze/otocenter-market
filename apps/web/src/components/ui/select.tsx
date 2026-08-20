import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Yerel `<select>` — araç seçicinin temel yapıtaşı.
 * Erişilebilirlik ve mobil davranış için bilinçli olarak native kullanılıyor;
 * mobilde işletim sisteminin kendi seçicisi açılır.
 */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235B6675' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")"

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-11 w-full appearance-none rounded-md border border-ink-200 bg-white bg-no-repeat py-0 pr-9 pl-3.5',
        'text-sm text-ink-900 transition-[border-color,box-shadow] duration-150',
        'focus:border-brand-600 focus:ring-3 focus:ring-brand-600/12 focus:outline-none',
        'disabled:cursor-not-allowed disabled:border-ink-100 disabled:bg-ink-50 disabled:text-ink-400',
        className,
      )}
      style={{ backgroundImage: CHEVRON, backgroundPosition: 'right 0.8125rem center' }}
      {...props}
    />
  )
})
