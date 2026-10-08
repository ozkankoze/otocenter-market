/**
 * TOPLU FİYAT ZAMMI (tek seferlik)
 *
 *   npm run db:fiyat-zam -- --oran 1            → yalnızca ÖNİZLEME, hiçbir şey değişmez
 *   npm run db:fiyat-zam -- --oran 1 --uygula   → uygular
 *
 * Hedef, müşterinin gördüğü KDV DAHİL fiyatın oran kadar artması: önce yeni
 * brüt fiyat kuruşa yuvarlanır, sonra KDV hariç fiyat ondan geri hesaplanır.
 * KDV hariç fiyat 2 ondalıkla saklandığı için ürünlerin bir kısmında brüt
 * fiyat hedeften 1 kuruş sapabilir (doğrudan neti artırmaktan daha isabetli:
 * yerel veride %83'e karşı %61 birebir). Liste fiyatı varsa o da oranlanır.
 *
 * GÜVENLİK
 *  • Tek transaction: ya hepsi değişir ya hiçbiri.
 *  • Son 24 saatte bir zam uygulandıysa durur — aynı komutu iki kez
 *    çalıştırmak %1 yerine %2,01 zam demektir. Bilerek tekrar etmek için
 *    `--tekrar` eklenir.
 *  • Verilen siparişler etkilenmez: sipariş satırı fiyatı sipariş anında
 *    kopyalanır.
 *
 * KALICI DEĞİL: Bir sonraki ürün içe aktarması fiyatları kaynaktaki değerle
 * yeniden yazar.
 */
import { loadEnv } from './env'
loadEnv()

import { sql } from 'kysely'
import { db, closeDb } from '../src/index'

function arg(ad: string): string | undefined {
  const i = process.argv.indexOf(ad)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const oran = Number(arg('--oran'))
const uygula = process.argv.includes('--uygula')
const tekrar = process.argv.includes('--tekrar')

const tl = (n: number) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'

async function main(): Promise<void> {
  // Yanlış yazılmış oranı (ör. "10" yerine "1,0" ya da 100) yakalamak için
  // makul aralık: indirim için eksi değer de kabul edilir.
  if (!Number.isFinite(oran) || oran === 0 || oran < -50 || oran > 50) {
    throw new Error('Oran -50 ile 50 arasında, sıfırdan farklı bir yüzde olmalı. Örnek: --oran 1')
  }
  const carpan = 1 + oran / 100

  const ozet = await sql<{ n: string; net: string; yeni_net: string }>`
    SELECT count(*)::text AS n,
           coalesce(sum(price_net), 0)::text AS net,
           coalesce(sum(round(round(round(price_net * (1 + tax_rate / 100.0), 2) * ${carpan}::numeric, 2) / (1 + tax_rate / 100.0), 2)), 0)::text AS yeni_net
      FROM price
  `.execute(db)
  const { n, net, yeni_net } = ozet.rows[0]!

  const ornek = await sql<{
    sku: string
    eski: string
    yeni: string
  }>`
    SELECT p.sku,
           round(pr.price_net * (1 + pr.tax_rate / 100.0), 2)::text AS eski,
           round(round(round(round(pr.price_net * (1 + pr.tax_rate / 100.0), 2) * ${carpan}::numeric, 2) / (1 + pr.tax_rate / 100.0), 2) * (1 + pr.tax_rate / 100.0), 2)::text AS yeni
      FROM price pr
      JOIN product_variant v ON v.id = pr.variant_id
      JOIN product p ON p.id = v.product_id
     ORDER BY p.sku
     LIMIT 5
  `.execute(db)

  console.log(`\nZam oranı: %${oran}  ·  fiyat satırı: ${n}`)
  console.log(`KDV hariç toplam: ${tl(Number(net))} → ${tl(Number(yeni_net))}\n`)
  console.log('Örnek (KDV dahil):')
  for (const r of ornek.rows) console.log(`  ${r.sku.padEnd(22)} ${tl(Number(r.eski))} → ${tl(Number(r.yeni))}`)

  const son = await db
    .selectFrom('fiyat_degisikligi')
    .select(['oran_yuzde', 'uygulandi_at'])
    .where('uygulandi_at', '>', sql<Date>`now() - interval '24 hours'`)
    .orderBy('uygulandi_at', 'desc')
    .executeTakeFirst()
  if (son) {
    console.log(
      `\n! Son 24 saatte zaten %${son.oran_yuzde} zam uygulandı (${new Date(son.uygulandi_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}).`,
    )
  }

  if (!uygula) {
    console.log('\nBu bir ÖNİZLEME, hiçbir fiyat değişmedi. Uygulamak için komutun sonuna --uygula ekleyin.\n')
    return
  }
  if (son && !tekrar) {
    throw new Error('Zam iki kez uygulanmasın diye durduruldu. Bilerek tekrar ediyorsanız --tekrar ekleyin.')
  }

  const degisen = await db.transaction().execute(async (trx) => {
    const r = await sql`
      UPDATE price
         SET price_net  = round(round(round(price_net * (1 + tax_rate / 100.0), 2) * ${carpan}::numeric, 2) / (1 + tax_rate / 100.0), 2),
             list_price = CASE WHEN list_price IS NULL THEN NULL
                               ELSE round(list_price * ${carpan}::numeric, 2) END
    `.execute(trx)
    const satir = Number(r.numAffectedRows ?? 0)
    if (satir !== Number(n)) throw new Error(`Beklenen ${n} satır, değişen ${satir}. Geri alındı.`)
    await trx
      .insertInto('fiyat_degisikligi')
      .values({ oran_yuzde: oran, satir_sayisi: satir, onceki_toplam: net, sonraki_toplam: yeni_net })
      .execute()
    return satir
  })

  console.log(`\n✓ ${degisen} fiyat güncellendi. Site en geç 5 dakika içinde yeni fiyatları gösterir.\n`)
}

main()
  .catch((e) => {
    console.error(`\nHATA: ${e instanceof Error ? e.message : e}\n`)
    process.exitCode = 1
  })
  .finally(closeDb)
