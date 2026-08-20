import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { formatCount } from '@/lib/utils'
import type { CategoryCard as CategoryCardData } from '@/server/catalog-queries'

const ICONS: Record<string, React.ReactNode> = {
  'air-filter': (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
      <path d="M7 3v18M12 3v18M17 3v18" opacity=".45" />
    </>
  ),
  'oil-filter': (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 4v3.5M12 16.5V20M4 12h3.5M16.5 12H20" />
    </>
  ),
  'fuel-filter': (
    <>
      <path d="M7 3h7l3 4v14H7z" />
      <path d="M7 9h10" />
      <path d="M10 13h4" />
    </>
  ),
  'cabin-filter': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M7 6v12M11 6v12M15 6v12" />
    </>
  ),
  'engine-oil': <path d="M12 3s5 5.4 5 9a5 5 0 0 1-10 0c0-3.6 5-9 5-9z" />,
  coolant: <path d="M12 3v18M5 8l7 4 7-4M5 16l7-4 7 4" />,
  brake: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  dryer: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M10 8h4M10 12h4" />
    </>
  ),
  hydraulic: (
    <>
      <path d="M4 8h10l6 4-6 4H4z" />
    </>
  ),
  adblue: (
    <>
      <path d="M12 3s5 5.4 5 9a5 5 0 0 1-10 0c0-3.6 5-9 5-9z" />
      <path d="M9.5 13h5" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8z" />,
  oil: <path d="M12 3s5 5.4 5 9a5 5 0 0 1-10 0c0-3.6 5-9 5-9z" />,
}

export function CategoryCard({ category }: { category: CategoryCardData }) {
  const hasVehicle = category.compatibleCount !== null
  const compatible = category.compatibleCount ?? 0

  return (
    <Link href={category.href} prefetch={false}>
      <Card interactive className="h-full px-4 py-5 text-center">
        <span className="mx-auto mb-3.5 flex h-[54px] w-[54px] items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {ICONS[category.icon ?? 'filter'] ?? ICONS.filter}
          </svg>
        </span>
        <b className="mb-1 block text-sm font-semibold text-ink-900">{category.name}</b>
        <em className="block text-[12.5px] text-ink-400 not-italic">
          {formatCount(category.productCount)} ürün
        </em>
        {hasVehicle ? (
          <span
            className={
              compatible > 0
                ? 'mt-2 block text-[11.5px] font-semibold text-accent-700'
                : 'mt-2 block text-[11.5px] font-medium text-ink-400'
            }
          >
            {compatible > 0 ? `✓ Aracınıza uygun ${compatible} ürün` : 'Bu araç için ürün yok'}
          </span>
        ) : null}
      </Card>
    </Link>
  )
}
