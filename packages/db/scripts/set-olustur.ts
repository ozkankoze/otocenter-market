/**
 * FİLTRE SETLERİNİ OLUŞTUR / GÜNCELLE
 *
 *   npm run db:set-olustur              → yalnızca ÖNİZLEME, hiçbir şey değişmez
 *   npm run db:set-olustur -- --uygula  → setleri yazar
 *
 * Kaynak: packages/db/scripts/seed-data/setler.json — MANN-FILTER uygulama
 * listesinden derlenmiş, her biri bir aracın yağ/hava/yakıt/polen filtre
 * kodlarını içeren setler.
 *
 * Her set için:
 *  • Bileşenler MANN-FILTER ürünleri arasında koduyla bulunur. Biri bile
 *    bulunamazsa set YAZILMAZ ve raporda listelenir.
 *  • Fiyat (KDV dahil) = bileşenlerin toplamı × (1 − %İNDİRİM); liste fiyatı
 *    bileşenlerin toplamıdır, sitede üstü çizili gösterilir.
 *  • Stok = bileşen stoklarının en düşüğü.
 *  • Uyumluluk = bileşenlerin HEPSİNİN uyduğu motorlar. Ortak motor yoksa set
 *    YAZILMAZ (kodlardan biri yanlış okunmuş olabilir) ve raporlanır.
 *
 * Tekrar çalıştırılabilir: aynı set SKU'su varsa güncellenir. Bileşen fiyatı
 * veya stoğu değiştiğinde komutu yeniden çalıştırmak setleri günceller.
 */
import { loadEnv } from './env'
loadEnv()

import { existsSync, readFileSync } from 'node:fs'
import { sql } from 'kysely'
import { db, closeDb } from '../src/index'
import { slugify } from '../src/normalize'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../src/resolve'
import { fromRepo } from './paths'

const INDIRIM_YUZDE = 5
const uygula = process.argv.includes('--uygula')

type SetTanim = {
  ad: string
  icerik: { tur: string; kod: string }[]
  araclar: {
    marka: string
    seri: string
    model: string
    motor_kodu: string
    hp: number | null
    yil_ilk: string
    yil_son: string
  }[]
}

type Bilesen = {
  id: number
  brand_id: number
  product_code: string
  price_net: number
  tax_rate: number
  quantity: number
}

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')
const yuvarla = (n: number) => Math.round(n * 100) / 100
const tl = (n: number) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'

function aciklama(s: SetTanim): string {
  const icerik = s.icerik.map((i) => `${i.tur} ${i.kod}`).join(', ')
  const araclar = s.araclar
    .map((a) => {
      const yil = a.yil_ilk ? ` (${a.yil_ilk}${a.yil_son ? `–${a.yil_son}` : ' sonrası'})` : ''
      const hp = a.hp ? ` ${a.hp} HP` : ''
      const motor = a.motor_kodu ? `, motor ${a.motor_kodu}` : ''
      return `${a.marka} ${a.seri} ${a.model}${hp}${motor}${yil}`.replace(/\s+/g, ' ')
    })
    .join('; ')
  return (
    `Bu sette ${s.icerik.length} adet orijinal MANN-FILTER filtre bulunur: ${icerik}. ` +
    `Set, MANN-FILTER uygulama listesine göre şu araçlar için hazırlanmıştır: ${araclar}. ` +
    `Filtreleri set olarak almak, ayrı ayrı almaya göre %${INDIRIM_YUZDE} daha uygundur. ` +
    `Siparişten önce aracınızı seçerek uyumluluğu kontrol edebilirsiniz.`
  )
}

async function main(): Promise<void> {
  const setler = JSON.parse(
    readFileSync(fromRepo('packages/db/scripts/seed-data/setler.json'), 'utf8'),
  ) as SetTanim[]

  const kategori = await db
    .selectFrom('category')
    .select(['id'])
    .where('code', '=', 'SET_URUNLER')
    .executeTakeFirst()
  if (!kategori) throw new Error('SET_URUNLER kategorisi yok. Önce: npm run db:migrate')
  const kaynak = await db
    .selectFrom('data_source')
    .select(['id'])
    .where('code', '=', 'SET_TURETILMIS')
    .executeTakeFirst()
  if (!kaynak) throw new Error('SET_TURETILMIS veri kaynağı yok. Önce: npm run db:migrate')

  // Bütün MANN-FILTER ürünleri (setler hariç) — kodla eşleştirme için
  const urunler = await sql<Bilesen & { norm: string }>`
    SELECT p.id, p.brand_id, p.product_code, ocm_normalize_code(p.product_code) AS norm,
           coalesce(pr.price_net, 0)::float AS price_net, coalesce(pr.tax_rate, 20) AS tax_rate,
           coalesce(st.quantity, 0) AS quantity
    FROM product p
    JOIN product_brand pb ON pb.id = p.brand_id
    JOIN category c ON c.id = p.category_id
    LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
    LEFT JOIN price pr ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
    LEFT JOIN stock st ON st.variant_id = v.id
    WHERE pb.name ILIKE 'MANN%' AND c.code <> 'SET_URUNLER' AND p.status = 'ACTIVE'
      AND p.product_code IS NOT NULL
  `.execute(db)
  const kodla = new Map(urunler.rows.map((u) => [u.norm, u]))

  const eksikKod = new Map<string, number>()
  const ortakYok: string[] = []
  type Hazir = {
    tanim: SetTanim
    sku: string
    bilesenler: Bilesen[]
    motorlar: number[]
    brut: number
    liste: number
    stok: number
  }
  const hazir: Hazir[] = []

  for (const s of setler) {
    const bilesenler: Bilesen[] = []
    let eksik = false
    for (const i of s.icerik) {
      const u = kodla.get(norm(i.kod))
      if (!u) {
        eksikKod.set(i.kod, (eksikKod.get(i.kod) ?? 0) + 1)
        eksik = true
      } else bilesenler.push(u)
    }
    if (eksik) continue

    const ids = bilesenler.map((b) => b.id)
    const ortak = await sql<{ engine_id: number }>`
      SELECT engine_id FROM product_compatibility
      WHERE product_id = ANY(${ids}::bigint[]) AND status IN ('VERIFIED','SOURCED')
      GROUP BY engine_id HAVING count(DISTINCT product_id) = ${ids.length}
    `.execute(db)
    if (ortak.rows.length === 0) {
      ortakYok.push(`${s.ad}  [${s.icerik.map((i) => i.kod).join(', ')}]`)
      continue
    }

    const liste = yuvarla(
      bilesenler.reduce((t, b) => t + b.price_net * (1 + b.tax_rate / 100), 0),
    )
    hazir.push({
      tanim: s,
      sku: ('SET-' + s.icerik.map((i) => norm(i.kod)).join('-')).slice(0, 64),
      bilesenler,
      motorlar: ortak.rows.map((r) => Number(r.engine_id)),
      liste,
      brut: yuvarla(liste * (1 - INDIRIM_YUZDE / 100)),
      stok: Math.min(...bilesenler.map((b) => Number(b.quantity))),
    })
  }

  console.log(`\nKaynakta ${setler.length} set var.`)
  console.log(`✓ Yazılabilir: ${hazir.length}`)
  console.log(`✗ Bileşeni sitede olmadığı için atlanan: ${setler.length - hazir.length - ortakYok.length}`)
  if (eksikKod.size) {
    console.log(`  Sitede bulunamayan kodlar (${eksikKod.size}):`)
    for (const [k, n] of [...eksikKod].sort((a, b) => b[1] - a[1])) console.log(`    ${k}  (${n} set)`)
  }
  console.log(`✗ Bileşenlerin ortak motoru olmadığı için atlanan: ${ortakYok.length}`)
  for (const x of ortakYok) console.log(`    ${x}`)
  if (hazir[0]) {
    const h = hazir[0]
    console.log(`\nÖrnek: ${h.tanim.ad}\n  ${tl(h.liste)} → ${tl(h.brut)} · stok ${h.stok} · ${h.motorlar.length} motor`)
  }

  if (!uygula) {
    console.log('\nBu bir ÖNİZLEME, hiçbir şey yazılmadı. Uygulamak için: npm run db:set-olustur -- --uygula\n')
    return
  }

  let yeni = 0
  let guncel = 0
  await db.transaction().execute(async (trx) => {
    for (const h of hazir) {
      const s = h.tanim
      const kisa = (
        `Set içeriği: ${s.icerik.map((i) => `${i.tur} ${i.kod}`).join(' · ')}. ` +
        `Ayrı ayrı almaya göre %${INDIRIM_YUZDE} daha uygun.`
      ).slice(0, 320)
      const degerler = {
        name: s.ad.slice(0, 200),
        product_code: null,
        brand_id: h.bilesenler[0]!.brand_id,
        category_id: kategori.id,
        short_description: kisa,
        description: aciklama(s),
        status: 'ACTIVE' as const,
        // "Önerilen" sıralama artan sort_weight: 4'lü setler önce gelsin
        sort_weight: 10 - s.icerik.length,
        seo_title: `MANN-FILTER ${s.ad}`.slice(0, 160),
        seo_description: kisa.slice(0, 320),
        updated_at: new Date(),
      }

      const mevcut = await trx
        .selectFrom('product')
        .select(['id'])
        .where('sku', '=', h.sku)
        .executeTakeFirst()
      let productId: number
      if (mevcut) {
        productId = Number(mevcut.id)
        await trx.updateTable('product').set(degerler).where('id', '=', productId).execute()
        guncel++
      } else {
        const slug = `${slugify(s.ad).slice(0, 110)}-${h.sku.slice(4, 24).toLowerCase()}`.slice(0, 140)
        const r = await trx
          .insertInto('product')
          .values({ ...degerler, sku: h.sku, slug })
          .returning('id')
          .executeTakeFirstOrThrow()
        productId = Number(r.id)
        yeni++
      }

      // Varyant, fiyat, stok
      let variant = await trx
        .selectFrom('product_variant')
        .select(['id'])
        .where('product_id', '=', productId)
        .where('is_default', '=', true)
        .executeTakeFirst()
      if (!variant) {
        variant = await trx
          .insertInto('product_variant')
          .values({ product_id: productId, sku: h.sku, name: 'Set', is_default: true })
          .returning('id')
          .executeTakeFirstOrThrow()
      }
      const vid = Number(variant.id)
      await sql`DELETE FROM price WHERE variant_id = ${vid} AND customer_group = 'RETAIL'`.execute(trx)
      await trx
        .insertInto('price')
        .values({
          variant_id: vid,
          price_net: yuvarla(h.brut / 1.2),
          tax_rate: 20,
          list_price: h.liste,
        })
        .execute()
      await sql`
        INSERT INTO stock (variant_id, warehouse_code, quantity, updated_at)
        VALUES (${vid}, 'MERKEZ', ${h.stok}, now())
        ON CONFLICT (variant_id, warehouse_code)
        DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now()
      `.execute(trx)

      // İçerik
      await sql`DELETE FROM product_set_item WHERE set_product_id = ${productId}`.execute(trx)
      for (const [i, b] of h.bilesenler.entries()) {
        await sql`
          INSERT INTO product_set_item (set_product_id, component_product_id, quantity, sort_order)
          VALUES (${productId}, ${b.id}, 1, ${i})
        `.execute(trx)
      }

      // Görseller: önce setin kolaj kapağı (apps/web/public/urun/set/<SKU>.webp
      // varsa), ardından bileşenlerin ana görselleri, sırayla
      await sql`DELETE FROM product_image WHERE product_id = ${productId}`.execute(trx)
      let sira = 0
      const kapak = `/urun/set/${h.sku}.webp`
      if (existsSync(fromRepo(`apps/web/public${kapak}`))) {
        await trx
          .insertInto('product_image')
          .values({ product_id: productId, url: kapak, alt: s.ad.slice(0, 200), sort_order: 0, is_primary: true })
          .execute()
        sira++
      }
      for (const b of h.bilesenler) {
        const img = await sql<{ url: string }>`
          SELECT url FROM product_image
          WHERE product_id = ${b.id} ORDER BY is_primary DESC, sort_order LIMIT 1
        `.execute(trx)
        const url = img.rows[0]?.url
        if (!url) continue
        await trx
          .insertInto('product_image')
          .values({
            product_id: productId,
            url,
            alt: s.ad.slice(0, 200),
            sort_order: sira,
            is_primary: sira === 0,
          })
          .execute()
        sira++
      }

      // Uyumluluk iddiaları: ortak motorlar
      await sql`
        UPDATE compatibility_assertion SET is_active = false
        WHERE product_id = ${productId} AND source_id = ${kaynak.id}
          AND NOT (engine_id = ANY(${h.motorlar}::bigint[]))
      `.execute(trx)
      await sql`
        INSERT INTO compatibility_assertion (product_id, engine_id, source_id, assertion_type, note)
        SELECT ${productId}, e, ${kaynak.id}, 'COMPATIBLE', 'Set bileşenlerinin ortak uyumluluğu'
        FROM unnest(${h.motorlar}::bigint[]) AS e
        ON CONFLICT (product_id, engine_id, source_id, assertion_type)
        DO UPDATE SET is_active = true
      `.execute(trx)
    }
  })

  const r = await resolveCompatibility(db)
  const idx = await rebuildEngineCategoryIndex(db)
  console.log(
    `\n✓ ${yeni} yeni set, ${guncel} set güncellendi · ${r.resolved} uyumluluk · ${idx} indeks satırı\n`,
  )
}

main()
  .catch((e) => {
    console.error(`\nHATA: ${e instanceof Error ? e.message : e}\n`)
    process.exitCode = 1
  })
  .finally(closeDb)
