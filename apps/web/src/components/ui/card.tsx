import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Kart — border ile tanımlanır, gölge YALNIZCA hover'da.
 * Bu, sayfanın "hafif ve temiz" kalmasını sağlayan bilinçli bir karardır.
 */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-ink-100 bg-white',
        interactive &&
          'transition-[box-shadow,border-color] duration-200 hover:border-brand-300 hover:shadow-md',
        className,
      )}
      {...props}
    />
  )
}
