import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** 1249.9 → "1.249,90 ₺" */
export function formatPrice(value: number, currency = '₺'): string {
  return `${value.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`
}

/** 1240 → "1.240" */
export function formatCount(value: number): string {
  return value.toLocaleString('tr-TR')
}

/** KDV hariç fiyattan KDV dahil fiyat üretir. */
export function grossPrice(net: number, taxRate: number): number {
  return Math.round(net * (1 + taxRate / 100) * 100) / 100
}

/**
 * Tarih/saat biçimlendirme — SABİT saat dilimiyle.
 *
 * Sunucu UTC, tarayıcı yerel saat dilimindeyken `toLocaleString()` iki tarafta
 * farklı metin üretir ve React hydration uyuşmazlığı çıkar. Saat dilimi açıkça
 * verilerek sunucu ve istemci aynı metni üretir.
 */
const TZ = process.env.NEXT_PUBLIC_TIMEZONE ?? 'Europe/Istanbul'

export function formatDateTime(value: Date | string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

/**
 * Ürünün tam adı: "MANN-FILTER WK854/5 Yakıt Filtresi".
 *
 * `product.name` kaynakta yalnızca ÜRÜN TİPİDİR ("Yakıt Filtresi"); tek başına
 * hiçbir ürünü ayırt etmez. Kartta, detay başlığında, sekme başlığında ve
 * JSON-LD'de aynı dizgi kullanılsın diye tek yerde kuruluyor — daha önce beş
 * ayrı yerde elle birleştiriliyordu ve kart ile detay farklı isim gösteriyordu.
 */
export function productTitle(parts: {
  brandName: string
  productCode?: string | null
  name: string
}): string {
  return [parts.brandName, parts.productCode, parts.name].filter(Boolean).join(' ')
}
