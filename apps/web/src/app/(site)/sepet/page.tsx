import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SepetIcerigi } from './sepet-icerigi'

export const metadata: Metadata = {
  title: 'Sepetim',
  // Kişiye özel, içeriği olmayan sayfa — arama sonucuna girmemeli.
  robots: { index: false, follow: false },
  alternates: { canonical: '/sepet' },
}

export default function SepetSayfasi() {
  return (
    <div className="ocm-container py-8 md:py-10">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Sepetim' }]} />
      <h1 className="mt-2 text-[24px] font-bold tracking-tight text-ink-900 md:text-[28px]">
        Sepetim
      </h1>
      {/* Asgari yükseklik — boş sepet mesajı iskeletten kısa kalınca footer zıplamasın. */}
      <div className="min-h-[560px]">
        <SepetIcerigi />
      </div>
    </div>
  )
}
