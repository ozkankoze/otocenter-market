import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href?: string }

/**
 * `tone`: koyu zeminli sayfa başlıklarında (PageHero) beyaz metin gerekiyor.
 * Ayrı bir bileşen açmak yerine ton parametresi verildi — böylece sayfa yolu
 * mantığı (son öğe link değildir, ayraçlar, erişilebilirlik etiketi) tek yerde
 * kalıyor.
 */
export function Breadcrumb({
  items,
  className,
  tone = 'light',
}: {
  items: Crumb[]
  className?: string
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <nav aria-label="Sayfa yolu" className={cn('mb-4', className)}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-[12.5px]',
          dark ? 'text-white/60' : 'text-ink-600',
        )}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    'transition-colors',
                    dark ? 'hover:text-white' : 'hover:text-brand-600',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? (dark ? 'font-medium text-white' : 'font-medium text-ink-900') : undefined
                  }
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  size={13}
                  className={dark ? 'text-white/35' : 'text-ink-300'}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Schema.org BreadcrumbList — SEO mimarisi §11.4 */
export function BreadcrumbJsonLd({ items, baseUrl }: { items: Crumb[]; baseUrl: string }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
