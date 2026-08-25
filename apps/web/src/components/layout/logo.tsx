import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * MARKA LOGOSU — gerçek Oto Center Market logosu.
 *
 * Kaynak dosya : public/brand/oto-center-market-logo.png
 * Orijinal      : public/brand/kaynak-orijinal.png (dokunulmamış hâli)
 * Amblem        : public/brand/oto-center-market-amblem.png
 *
 * KURALLAR
 *  · Logo yeniden çizilmez, renkleri değiştirilmez, efekt uygulanmaz.
 *  · En-boy oranı 926 × 223 (≈ 4.15 : 1). Yalnızca YÜKSEKLİK verilir,
 *    genişlik `width: auto` ile oranla hesaplanır → hiçbir kırılma
 *    noktasında esneme/bozulma olmaz.
 *  · Logonun kendi beyaz zemini tasarımının parçasıdır; ayrıca kutu,
 *    çerçeve, gölge veya arka plan EKLENMEZ.
 *  · Görselin dışındaki beyaz alan şeffaftır — koyu zeminde dikdörtgen
 *    bir blok olarak görünmez.
 */

/** Kaynak dosyanın gerçek pikselleri — oran hesabı bunlardan yapılır. */
const LOGO_WIDTH = 926
const LOGO_HEIGHT = 223
const MARK_SIZE = 188

/** Yerleşim başına yükseklikler — her biri bulunduğu barda ≥10 px boşluk bırakır. */
export const LOGO_HEIGHTS = {
  /** Masaüstü ana bar (82 px) */
  desktop: 52,
  /** Masaüstü sticky kompakt bar (60 px) */
  desktopCompact: 40,
  /** Mobil header (56 px) */
  mobile: 34,
  /** Mobil menü başlığı ve footer */
  drawer: 40,
  footer: 44,
} as const

export function Logo({
  height = LOGO_HEIGHTS.desktop,
  className,
  priority = false,
}: {
  /** Piksel cinsinden yükseklik; genişlik oranla hesaplanır */
  height?: number
  className?: string
  /** Header'daki ilk logo için true — LCP'yi geciktirmemek adına */
  priority?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('flex shrink-0 items-center', className)}
      aria-label="Oto Center Market — ana sayfa"
    >
      <Image
        src="/brand/oto-center-market-logo.png"
        alt="Oto Center Market"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        /*
         * `sizes` OLMADAN Next.js bu görseli sayfa genişliğinde sanıyor ve
         * tarayıcıya 1920 piksellik (2× ekranlarda 3840) bir sürüm indiriyordu.
         *
         * SABİT "220px" de yeterli değildi: mobil header'daki logo 34 px
         * yüksekliğinde, yani ~141 px genişliğinde çiziliyor — ama 220 px
         * denildiği için tarayıcı yüksek piksel yoğunluklu telefonda 640 px'lik
         * sürümü indiriyordu (ölçüldü: 14 KiB boşa). Genişlik yükseklikten
         * oranla türetiliyor, böylece her kullanım kendi gerçek boyutunu
         * bildiriyor ve tarayıcı en küçük yeterli dosyayı seçiyor.
         */
        sizes={`${Math.ceil(height * (LOGO_WIDTH / LOGO_HEIGHT))}px`}
        // Yükseklik sabit, genişlik otomatik → oran her zaman korunur.
        style={{ height, width: 'auto' }}
        className="max-w-full"
      />
    </Link>
  )
}

/**
 * Yalnızca amblem — çok dar alanlar için hazır tutulur.
 * (Şu an header'da kullanılmıyor; favicon ve app icon'lar bu görselden üretildi.)
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/oto-center-market-amblem.png"
      alt="Oto Center Market"
      width={MARK_SIZE}
      height={MARK_SIZE}
      sizes="64px"
      className={cn('shrink-0', className)}
      style={{ width: size, height: size }}
    />
  )
}
