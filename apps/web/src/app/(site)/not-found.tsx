import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 404 — Faz 1'de kategori ve araç sayfaları henüz yayında olmadığı için
 * bu ekran aynı zamanda "yakında" bilgisini de veriyor.
 */
export default function NotFound() {
  return (
    <div className="ocm-container py-20 md:py-28">
      <div className="mx-auto max-w-[560px] text-center">
        <span className="ocm-code text-brand-600">404</span>
        <h1 className="mt-2 text-[26px] font-bold text-ink-900 md:text-[32px]">Sayfa bulunamadı</h1>
        <p className="mt-3 text-sm text-ink-600">
          Aradığınız sayfa taşınmış olabilir. Aracınızı seçerek uyumlu ürünlere ulaşabilir veya
          parça kodu ile arama yapabilirsiniz.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/" title="Ana sayfaya dön">Ana sayfaya dön</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/#arac-secici">Aracımı seç</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
