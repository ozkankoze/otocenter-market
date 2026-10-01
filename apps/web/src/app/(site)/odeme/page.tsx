import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { paytrAyarlari } from '@/server/odeme/ayar'
import { OdemeAkisi } from './odeme-akisi'

export const metadata: Metadata = {
  title: 'Ödeme',
  robots: { index: false, follow: false },
  alternates: { canonical: '/odeme' },
}

// Ödeme anahtarlarının varlığı her istekte okunur; derleme anına sabitlenmez.
export const dynamic = 'force-dynamic'

export default function OdemeSayfasi() {
  const ayar = paytrAyarlari()
  return (
    <div className="ocm-container py-8 md:py-10">
      <Breadcrumb
        items={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Sepetim', href: '/sepet' },
          { label: 'Ödeme' },
        ]}
      />
      <h1 className="mt-2 text-[24px] font-bold tracking-tight text-ink-900 md:text-[28px]">
        Ödeme
      </h1>
      {/*
        Asgari yükseklik: sepet tarayıcıdan okunana kadar iskelet görünür. İçerik
        boş sepet ya da hata mesajı çıkarsa iskeletten kısa kalır ve footer
        yukarı zıplardı (yavaş telefonda ölçülen CLS 0,55). Alan sabit tutulunca
        kayma olmaz; dolu formda içerik zaten bu yükseklikten uzun.
      */}
      <div className="min-h-[600px]">
        <OdemeAkisi odemeAcik={ayar !== null} testModu={ayar?.testMode ?? false} />
      </div>
    </div>
  )
}
