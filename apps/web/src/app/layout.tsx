import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SİTE GENELİ METADATA
 * ════════════════════════════════════════════════════════════════════════════
 *  SEO denetiminde çıkan eksikler burada kapatıldı:
 *
 *  · CANONICAL YOKTU (kırmızı). `metadataBase` vardı ama hiçbir sayfa varsayılan
 *    canonical üretmiyordu; alt sayfaların çoğunda `alternates.canonical` elle
 *    yazılı, ana sayfada hiç yoktu. Artık kökte varsayılan var, sayfalar kendi
 *    yolunu vererek üzerine yazıyor.
 *  · PAYLAŞIM GÖRSELİ YOKTU. og:image ve twitter:image tanımlı değildi;
 *    WhatsApp/X/Facebook'ta bağlantı görselsiz çıkıyordu. public/brand/og-kapak.png
 *    logodan üretildi (1200×630 — platformların beklediği ölçü).
 *  · TWITTER CARD eksikti → `summary_large_image`.
 *  · META DESCRIPTION 130 karakterdi, önerilen aralık 140–160. Genişletildi.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const ACIKLAMA =
  'Otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri. ' +
  'Aracınızı marka, model ve motora göre seçin; yalnızca uyumlu ürünleri görün.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Oto Center Market — Aracınız İçin Doğru Parça',
    template: '%s | Oto Center Market',
  },
  description: ACIKLAMA,
  applicationName: 'Oto Center Market',
  // Sayfalar kendi `alternates.canonical` değerini vererek bunu geçersiz kılar.
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Oto Center Market',
    title: 'Oto Center Market — Aracınız İçin Doğru Parça',
    description: ACIKLAMA,
    url: '/',
    images: [
      {
        url: '/brand/og-kapak.png',
        width: 1200,
        height: 630,
        alt: 'Oto Center Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oto Center Market — Aracınız İçin Doğru Parça',
    description: ACIKLAMA,
    images: ['/brand/og-kapak.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#0B315B',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Kök yerleşim — yalnızca belge iskeleti.
 * Mağaza kabuğu `(site)/layout.tsx`, yönetim kabuğu `admin/layout.tsx`
 * içindedir; böylece /admin mağaza header'ını miras almaz.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  )
}
