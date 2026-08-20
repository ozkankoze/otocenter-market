import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Rozet — design system §12.4
 * DİSİPLİN: bir ürün kartında en fazla 2 rozet gösterilir.
 */
const badgeVariants = cva(
  'inline-flex h-6 w-fit shrink-0 items-center gap-1.5 self-start rounded-sm px-2.5 text-xs leading-none font-medium',
  {
    variants: {
      tone: {
        /** Uyumluluk / başarı — YALNIZCA doğrulanmış uyumlulukta */
        fit: 'bg-accent-100 text-accent-700',
        /** Bilinmiyor / teyit edilmedi */
        neutral: 'bg-ink-50 text-ink-600',
        /** Uyumsuz */
        danger: 'bg-[#FBEAE8] text-danger',
        /** Bilgi */
        brand: 'bg-brand-50 text-brand-700',
        /** İndirim */
        warning: 'bg-[#FDF3E2] text-warning',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
