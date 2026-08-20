import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Oto Center Market — Aracınız İçin Doğru Parça',
    template: '%s | Oto Center Market',
  },
  description:
    'Otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri. Aracınızı seçin, yalnızca uyumlu ürünleri görün.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Oto Center Market',
  },
  robots: { index: true, follow: true },
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
