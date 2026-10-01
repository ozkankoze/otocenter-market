/**
 * SEPET — tarayıcıda yalnızca "hangi varyanttan kaç adet" tutulur.
 *
 * Fiyat, ürün adı, stok BURADA YOK. Bunlar her gösterimde sunucudan
 * (`/api/sepet`) yeniden alınır; ödeme adımında da sunucu sepeti veritabanından
 * baştan fiyatlar. Tarayıcıdaki veri kurcalanırsa en kötü ihtimalle olmayan bir
 * ürün sepette görünür ve sunucu onu reddeder — fiyat değiştirilemez.
 *
 * `useSyncExternalStore` ile okunur:
 *   · sunucu render'ında boş sepet döner → hidrasyon uyuşmazlığı olmaz,
 *   · başka sekmede yapılan değişiklik `storage` olayıyla bu sekmeye yansır.
 */
import { SATIR_ADET_SINIRI, SEPET_SATIR_SINIRI } from '@/features/sepet/sinirlar'

export type SepetKalemi = { variantId: number; adet: number }

const ANAHTAR = 'ocm-sepet-v1'
const BOS: SepetKalemi[] = []

let onbellek: SepetKalemi[] | null = null
const dinleyiciler = new Set<() => void>()

function oku(): SepetKalemi[] {
  if (onbellek) return onbellek
  try {
    const ham = window.localStorage.getItem(ANAHTAR)
    const veri: unknown = ham ? JSON.parse(ham) : []
    onbellek = Array.isArray(veri)
      ? veri
          .filter(
            (k): k is SepetKalemi =>
              typeof k === 'object' &&
              k !== null &&
              Number.isSafeInteger((k as SepetKalemi).variantId) &&
              (k as SepetKalemi).variantId > 0 &&
              Number.isSafeInteger((k as SepetKalemi).adet) &&
              (k as SepetKalemi).adet > 0,
          )
          .slice(0, SEPET_SATIR_SINIRI)
      : []
  } catch {
    // Gizli sekme, engellenmiş depolama ya da bozuk veri — boş sepetle devam.
    onbellek = []
  }
  return onbellek
}

function yaz(yeni: SepetKalemi[]) {
  onbellek = yeni
  try {
    window.localStorage.setItem(ANAHTAR, JSON.stringify(yeni))
  } catch {
    // Depolama kapalıysa sepet yalnızca bu sayfa açıkken yaşar.
  }
  dinleyiciler.forEach((d) => d())
}

export const sepetDeposu = {
  abone(dinleyici: () => void) {
    dinleyiciler.add(dinleyici)
    const depolama = (e: StorageEvent) => {
      if (e.key !== ANAHTAR) return
      onbellek = null
      dinleyici()
    }
    window.addEventListener('storage', depolama)
    return () => {
      dinleyiciler.delete(dinleyici)
      window.removeEventListener('storage', depolama)
    }
  },
  anlik: () => oku(),
  sunucuAnlik: () => BOS,

  ekle(variantId: number, adet = 1) {
    const mevcut = oku()
    const var_ = mevcut.find((k) => k.variantId === variantId)
    if (var_) {
      yaz(
        mevcut.map((k) =>
          k.variantId === variantId
            ? { ...k, adet: Math.min(SATIR_ADET_SINIRI, k.adet + adet) }
            : k,
        ),
      )
    } else if (mevcut.length < SEPET_SATIR_SINIRI) {
      yaz([...mevcut, { variantId, adet: Math.min(SATIR_ADET_SINIRI, adet) }])
    }
  },
  adetAyarla(variantId: number, adet: number) {
    if (adet <= 0) return sepetDeposu.cikar(variantId)
    yaz(
      oku().map((k) =>
        k.variantId === variantId ? { ...k, adet: Math.min(SATIR_ADET_SINIRI, adet) } : k,
      ),
    )
  },
  cikar(variantId: number) {
    yaz(oku().filter((k) => k.variantId !== variantId))
  },
  temizle() {
    yaz([])
  },
}
