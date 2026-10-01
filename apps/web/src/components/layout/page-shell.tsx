import type * as React from 'react'
import { Breadcrumb, type Crumb } from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

/**
 * İÇERİK SAYFASI KABUĞU — kurumsal ve hukuki sayfalar için.
 *
 * Katalog sayfaları `ListingView` kullanıyor; onların dışındaki sayfaların da
 * aynı dili konuşması için ortak parçalar burada. Yeni bir tasarım dili
 * kurulmuyor: aynı `ocm-eyebrow`, aynı başlık ölçüleri, aynı kart kenarlığı,
 * aynı koyu mavi şerit.
 */

/** Sayfa başlığı — koyu zeminli, hero'nun küçük kardeşi. */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  crumbs: Crumb[]
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-[#061a30] py-9 text-white md:py-12">
      <span className="ocm-grid-pattern absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="ocm-container relative">
        <Breadcrumb items={crumbs} tone="dark" />
        <span className="ocm-eyebrow text-brand-300 before:bg-brand-300">{eyebrow}</span>
        <h1 className="mt-2.5 text-[26px] leading-tight font-bold tracking-tight text-white md:text-[34px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-[680px] text-[15px] leading-relaxed text-white/72">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  )
}

/** Genel içerik gövdesi. */
export function PageBody({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('ocm-container py-10 md:py-14', className)}>{children}</div>
  )
}

/** Bölüm başlığı — ana sayfadaki `SectionHead` ile aynı ölçüler. */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5">
      {eyebrow ? <span className="ocm-eyebrow">{eyebrow}</span> : null}
      <h2 className="mt-2 text-[21px] font-semibold text-ink-900 md:text-[25px]">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-ink-600">{subtitle}</p> : null}
    </div>
  )
}

/**
 * Uzun metin bloğu — hukuki sayfalar ve blog yazıları.
 *
 * Tailwind typography eklentisi projede yok; okunabilirlik kuralları burada
 * açıkça yazılıyor. Satır uzunluğu 74ch ile sınırlı: hukuki metinde uzun satır
 * okumayı ciddi biçimde zorlaştırıyor.
 */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'max-w-[74ch] text-[14.5px] leading-[1.75] text-ink-600',
        '[&_h2]:mt-9 [&_h2]:mb-2.5 [&_h2]:text-[17px] [&_h2]:font-semibold [&_h2]:text-ink-900',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-ink-900',
        '[&_p]:mb-3.5',
        '[&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5',
        '[&_ol]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_strong]:font-semibold [&_strong]:text-ink-800',
        '[&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-700',
        '[&>*:first-child]:mt-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
