import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero } from '@/components/layout/page-shell'
import { REHBER_YAZILARI } from '@/features/content/rehber'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Teknik Rehber',
  description:
    'Filtre değişim zamanı, OEM numarasıyla parça bulma ve bakım konularında kısa, uygulanabilir teknik yazılar.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Blog' }]

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Teknik Rehber"
        description="Parça seçerken en sık karşılaşılan soruların kısa ve uygulanabilir cevapları. Kesin bakım aralıkları için her zaman aracınızın kendi bakım kitapçığı esastır."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-4 md:grid-cols-2">
          {REHBER_YAZILARI.map((yazi) => (
            <Link
              key={yazi.slug}
              href={`/blog/${yazi.slug}`}
              prefetch={false}
              title={`${yazi.title} — rehberi oku`}
            >
              <Card interactive className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 items-center rounded-sm bg-brand-50 px-2.5 text-[11px] font-semibold tracking-wider text-brand-600 uppercase">
                    {yazi.tag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-400">
                    <Clock size={13} aria-hidden="true" />
                    {yazi.readMinutes} dk okuma
                  </span>
                </div>
                <h2 className="mt-3 text-[17px] leading-snug font-semibold text-ink-900">
                  {yazi.title}
                </h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-600">
                  {yazi.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600">
                  Yazıyı oku
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </PageBody>
    </>
  )
}
