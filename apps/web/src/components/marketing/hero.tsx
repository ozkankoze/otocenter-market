import { Check } from 'lucide-react'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCount } from '@/lib/utils'

const POPULAR = ['Hava Filtresi', 'Yağ Filtresi', 'Polen Filtresi', 'Motor Yağı', 'Antifriz']

/**
 * Hero — stok araç fotoğrafı YOK.
 * Arka plan: koyu mavi degrade + ince teknik grid + soyut halka geometrisi.
 */
export function Hero({
  stats,
}: {
  stats: { products: number; vehicleBrands: number; compatibilities: number }
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-[#061a30] pt-12 pb-24 text-white md:pt-16 md:pb-28">
      {/* teknik grid deseni */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 75% 75% at 72% 30%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 72% 30%, #000, transparent)',
        }}
      />
      {/* soyut halkalar — filtre kesiti çağrışımı */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-32 h-[520px] w-[520px] rounded-full border border-brand-300/16"
        style={{
          boxShadow:
            'inset 0 0 0 54px rgba(143,188,228,.045), inset 0 0 0 55px rgba(143,188,228,.13), inset 0 0 0 118px rgba(143,188,228,.045), inset 0 0 0 119px rgba(143,188,228,.10)',
        }}
      />

      <div className="ocm-container relative">
        <div className="max-w-[620px]">
          <span className="mb-5 inline-flex items-center gap-2 rounded-sm border border-accent-600/35 bg-accent-600/15 px-3 py-1.5 text-xs font-semibold text-[#8FE0B4]">
            <Check size={13} strokeWidth={3} aria-hidden="true" />
            {/* Katalog henüz boşken "0+ ürün" yazmak yerine ürün sayısı gizlenir */}
            {stats.products > 0 ? `${formatCount(stats.products)}+ ürün · ` : ''}
            {stats.vehicleBrands}+ araç markası · Motor seviyesinde uyumluluk
          </span>

          <h1 className="text-[32px] leading-[1.12] font-bold tracking-tight text-white md:text-[46px]">
            Aracınız İçin Doğru Parçayı Bulun
          </h1>
          <p className="mt-4 mb-7 max-w-[530px] text-[15px] leading-relaxed text-white/76 md:text-[17px]">
            Binlerce ürün arasından aracınıza uyumlu filtre, yağ ve bakım ürünlerini kolayca
            keşfedin.
          </p>

          <div className="flex max-w-[620px] flex-col gap-3 sm:flex-row">
            <SearchInput
              className="flex-1"
              inputClassName="h-13 border-transparent"
              placeholder="Ürün, OEM numarası veya parça kodu ara..."
              aria-label="Ürün, OEM numarası veya parça kodu ara"
            />
            <Button size="lg" variant="white">
              Ürünleri Keşfet
            </Button>
          </div>

          <p className="mt-5 text-[13px] text-white/55">
            Popüler:{' '}
            {POPULAR.map((p, i) => (
              <span key={p}>
                {i > 0 ? ' · ' : ''}
                <span className="border-b border-white/22 text-white/85">{p}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
