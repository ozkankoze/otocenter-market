'use client'

import * as React from 'react'
import { useSepet } from './use-sepet'
import type { SepetYaniti } from './types'

type Durum =
  | { tur: 'hazirlaniyor' }
  | { tur: 'bos' }
  | { tur: 'hazir'; veri: SepetYaniti; yenileniyor: boolean }
  | { tur: 'hata' }

/**
 * Sepeti sunucuda fiyatlar; sepet her değiştiğinde yeniden sorar.
 *
 * Tarayıcıdaki sepet ilk render'da (sunucu anlık görüntüsü) boştur. "Henüz
 * okunmadı" ile "gerçekten boş" ayrımı `yuklendi` ile yapılır; yoksa dolu
 * sepeti olan kullanıcı bir an "sepetiniz boş" görür.
 */
export function useFiyatliSepet() {
  const sepet = useSepet()
  const [yuklendi, setYuklendi] = React.useState(false)
  const [durum, setDurum] = React.useState<Durum>({ tur: 'hazirlaniyor' })

  React.useEffect(() => setYuklendi(true), [])

  const anahtar = JSON.stringify(sepet.kalemler)

  React.useEffect(() => {
    if (!yuklendi) return
    const kalemler = JSON.parse(anahtar) as typeof sepet.kalemler
    if (kalemler.length === 0) {
      setDurum({ tur: 'bos' })
      return
    }
    const iptal = new AbortController()
    setDurum((d) => (d.tur === 'hazir' ? { ...d, yenileniyor: true } : { tur: 'hazirlaniyor' }))
    fetch('/api/sepet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kalemler }),
      signal: iptal.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        const veri = (await r.json()) as SepetYaniti
        setDurum({ tur: 'hazir', veri, yenileniyor: false })
      })
      .catch((e: unknown) => {
        if ((e as Error).name === 'AbortError') return
        setDurum({ tur: 'hata' })
      })
    return () => iptal.abort()
    // `anahtar` sepetin içeriğini temsil ediyor; nesne kimliği değişse de içerik aynıysa tekrar sorulmaz.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anahtar, yuklendi])

  return { ...sepet, durum }
}
