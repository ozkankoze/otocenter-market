'use client'

import * as React from 'react'
import { sepetDeposu } from './sepet-store'

/** Sepet kalemleri (variantId + adet). Sunucu render'ında her zaman boş. */
export function useSepet() {
  const kalemler = React.useSyncExternalStore(
    sepetDeposu.abone,
    sepetDeposu.anlik,
    sepetDeposu.sunucuAnlik,
  )
  const toplamAdet = React.useMemo(() => kalemler.reduce((t, k) => t + k.adet, 0), [kalemler])
  return {
    kalemler,
    toplamAdet,
    ekle: sepetDeposu.ekle,
    adetAyarla: sepetDeposu.adetAyarla,
    cikar: sepetDeposu.cikar,
    temizle: sepetDeposu.temizle,
  }
}

/** Kuruş → "1.249,90 ₺" */
export function kurusYaz(kurus: number): string {
  return `${(kurus / 100).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₺`
}
