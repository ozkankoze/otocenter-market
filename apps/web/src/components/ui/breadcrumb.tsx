import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type Crumb = { label: string; href?: string }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-600">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  prefetch={false}
                  className="transition-colors hover:text-brand-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-ink-900' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight size={13} className="text-ink-300" aria-hidden="true" />
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
