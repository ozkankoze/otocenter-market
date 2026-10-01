import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { db, sepetiFiyatla } from '@ocm/db'

export const dynamic = 'force-dynamic'

const govde = z.object({
  kalemler: z
    .array(
      z.object({
        variantId: z.number().int().positive(),
        adet: z.number().int().positive().max(99),
      }),
    )
    .max(50),
})

/**
 * Sepeti VERİTABANINDAN fiyatlar. Tarayıcı yalnızca varyant ve adet gönderir;
 * dönen fiyat, ödeme adımında kullanılacak fiyatla aynı fonksiyondan çıkar.
 */
export async function POST(request: NextRequest) {
  let veri: unknown
  try {
    veri = await request.json()
  } catch {
    return NextResponse.json({ hata: 'Geçersiz istek.' }, { status: 400 })
  }
  const p = govde.safeParse(veri)
  if (!p.success) return NextResponse.json({ hata: 'Geçersiz sepet.' }, { status: 400 })

  const sepet = await sepetiFiyatla(db, p.data.kalemler)
  return NextResponse.json(
    {
      satirlar: sepet.satirlar.map((s) => ({
        variantId: s.variantId,
        sku: s.sku,
        baslik: s.baslik,
        slug: s.slug,
        gorsel: s.gorsel,
        adet: s.adet,
        birimKurus: s.birimKurus,
        satirKurus: s.satirKurus,
        stok: s.stok,
      })),
      sorunlar: sepet.sorunlar,
      araToplamKurus: sepet.araToplamKurus,
      kargoOdeyen: sepet.kargoOdeyen,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
