/**
 * ════════════════════════════════════════════════════════════════════════════
 *  EK ÜRÜNLER — set listesinde olup sitede olmayan MANN-FILTER filtreleri
 * ════════════════════════════════════════════════════════════════════════════
 *
 *   npm run db:ek-urun-ekle                → ÖNİZLEME, hiçbir şey değişmez
 *   npm run db:ek-urun-ekle -- --uygula    → ekler / günceller
 *
 * Kaynak: seed-data/ek-urunler.json (kullanıcının derlediği eksik ürün listesi).
 *  • Fiyat: listedeki LİSTE FİYATI, KDV DAHİL satış fiyatı olarak yazılır.
 *  • Stok: 100–500 arası rastgele (yalnızca ürün ilk eklenirken).
 *  • Görsel: apps/web/public/urun/MANN-<KOD>.webp (üreticinin katalog fotoğrafı).
 *  • Uyumluluk: MANN-FILTER basılı uygulama listesindeki satırlar araç
 *    ağacındaki motorlarla (marka + model + motor adı) eşleştirildi. Araç
 *    ağacında karşılığı olmayan eski motorlar için uyumluluk yazılmaz; ürün
 *    yine de kodla aranıp satılabilir.
 *  • `mevcut_urune_uyum`: sitede zaten olan bir ürüne (ör. PU 8021'in yeni kodu
 *    PU 8028) uygulama listesinden gelen ek motorlar.
 *
 * Tekrar çalıştırılabilir: ürün varsa adı, açıklaması, fiyatı, görseli ve
 * uyumluluğu güncellenir; stok korunur. Ardından set komutu çalıştırılmalı:
 *   npm run db:set-olustur -- --uygula
 */
import { loadEnv } from './env'
loadEnv()

import { existsSync, readFileSync } from 'node:fs'
import { sql } from 'kysely'
import { db, closeDb } from '../src/index'
import { slugify } from '../src/normalize'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../src/resolve'
import { fromRepo } from './paths'

const uygula = process.argv.includes('--uygula')

type Motor = { marka: string; model: string; motor: string }
type EkUrun = {
  kod: string
  urun_kodu: string
  kategori: 'YAG_FILTRESI' | 'YAKIT_FILTRESI' | 'HAVA_FILTRESI' | 'POLEN_FILTRESI'
  fiyat: number
  alis: number
  uyum: Motor[]
}
type Veri = {
  urunler: EkUrun[]
  mevcut_urune_uyum: { urun_kodu: string; not: string; uyum: Motor[] }[]
}

const ETIKET: Record<EkUrun['kategori'], string> = {
  YAG_FILTRESI: 'Yağ Filtresi',
  YAKIT_FILTRESI: 'Yakıt Filtresi',
  HAVA_FILTRESI: 'Hava Filtresi',
  POLEN_FILTRESI: 'Polen / Kabin Filtresi',
}
const KISA: Record<EkUrun['kategori'], string> = {
  YAG_FILTRESI:
    'Motor yağındaki metal parçacıkları, kurum ve yanma artıklarını tutar; yağın yağlama görevini sürdürmesini sağlar.',
  HAVA_FILTRESI:
    'Motora giren havadaki toz ve partikülleri tutar; yanma verimini korur ve silindir aşınmasını geciktirir.',
  POLEN_FILTRESI:
    'Kabine giren havadaki polen, toz ve is parçacıklarını tutar; cam buğulanmasını azaltır, iç hava kalitesini artırır.',
  YAKIT_FILTRESI: 'Yakıt içindeki su ve kirleri tutar; enjektörleri ve yakıt pompasını korur.',
}
const UZUN: Record<EkUrun['kategori'], string[]> = {
  YAG_FILTRESI: [
    'Yağ, motor içinde dolaşırken metal talaşı, kurum ve yanma artıklarını toplar. Yağ filtresi bu parçacıkları tutar; tutmazsa aynı parçacıklar yatak ve silindir yüzeylerini aşındırır.',
    'Tıkanmış ya da ömrünü doldurmuş bir yağ filtresi yağ basıncını düşürür ve motorun yağsız kalma riskini artırır. Bu nedenle yağ filtresi her motor yağı değişiminde birlikte değiştirilir.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın.',
  ],
  HAVA_FILTRESI: [
    'Motor, yaktığı her litre yakıt için binlerce litre hava emer. Hava filtresi bu havadaki tozu ve partikülleri tutarak silindirlere temiz hava girmesini sağlar.',
    'Kirlenmiş bir hava filtresi hava akışını kısar; yakıt tüketimi artar, tepki gecikir ve tutulamayan partiküller silindir cidarlarını aşındırır.',
    'Tozlu yollarda kullanılan araçlarda değişim aralığı kısalır. Üreticinin bakım aralığını esas alın.',
  ],
  POLEN_FILTRESI: [
    'Kabin filtresi, klima ve havalandırma sisteminden içeri giren havayı süzer. Polen, yol tozu, is ve egzoz partikülleri kabine girmeden tutulur.',
    'Kirlenmiş bir kabin filtresi hava akışını azaltır; camlar geç açılır, kliması zayıflar ve araç içinde rutubet kokusu oluşabilir.',
    'Genellikle yılda bir veya üreticinin belirlediği kilometrede değiştirilir; alerjisi olan sürücüler için daha sık değişim önerilir.',
  ],
  YAKIT_FILTRESI: [
    'Yakıt filtresi, depodan gelen yakıttaki su, pas ve kir parçacıklarını tutar. Özellikle dizel sistemlerde yüksek basınçlı enjektörler bu kirlere karşı hassastır.',
    'Tıkanmış bir yakıt filtresi güç kaybı, zor çalışma ve rölantide titreme yapar; ileri aşamada enjektör ve yakıt pompası arızasına yol açar.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın.',
  ],
}

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')
const yuvarla = (n: number) => Math.round(n * 100) / 100
const tl = (n: number) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'

async function main(): Promise<void> {
  const veri = JSON.parse(
    readFileSync(fromRepo('packages/db/scripts/seed-data/ek-urunler.json'), 'utf8'),
  ) as Veri

  const marka = await db
    .selectFrom('product_brand')
    .select(['id'])
    .where('name', '=', 'MANN-FILTER')
    .executeTakeFirst()
  if (!marka) throw new Error('MANN-FILTER markası bulunamadı.')
  const kaynak = await db
    .selectFrom('data_source')
    .select(['id'])
    .where('code', '=', 'MANN_CATALOG')
    .executeTakeFirst()
  if (!kaynak) throw new Error('MANN_CATALOG veri kaynağı bulunamadı.')
  const kategoriler = new Map(
    (await db.selectFrom('category').select(['id', 'code']).execute()).map((c) => [c.code, c.id]),
  )

  // Motorları ada göre çöz (id'ler veritabanından veritabanına değişir)
  const motorlar = await sql<{ id: string; marka: string; model: string; motor: string }>`
    SELECT e.id::text, b.name AS marka, m.name AS model, e.name AS motor
    FROM vehicle_engine e
    JOIN vehicle_model m ON m.id = e.model_id
    JOIN vehicle_brand b ON b.id = m.brand_id
  `.execute(db)
  const motorAnahtar = (m: Motor) => `${m.marka}|${m.model}|${m.motor}`
  const motorId = new Map(motorlar.rows.map((r) => [motorAnahtar(r), Number(r.id)]))
  const coz = (liste: Motor[], kod: string): number[] => {
    const ids: number[] = []
    for (const m of liste) {
      const id = motorId.get(motorAnahtar(m))
      if (id) ids.push(id)
      else console.log(`  ! ${kod}: motor bulunamadı → ${m.marka} / ${m.model} / ${m.motor}`)
    }
    return ids
  }

  const mevcutlar = await sql<{ id: string; norm: string }>`
    SELECT id::text, ocm_normalize_code(product_code) AS norm FROM product
    WHERE brand_id = ${marka.id} AND product_code IS NOT NULL
  `.execute(db)
  const kodla = new Map(mevcutlar.rows.map((r) => [r.norm, Number(r.id)]))

  console.log(`\nListede ${veri.urunler.length} ürün var.`)
  let uyumlu = 0
  for (const u of veri.urunler) {
    const ids = coz(u.uyum, u.kod)
    if (ids.length) uyumlu++
    const durum = kodla.has(norm(u.urun_kodu)) ? 'güncellenecek' : 'yeni'
    console.log(
      `  ${u.kod.padEnd(14)} ${ETIKET[u.kategori].padEnd(22)} ${tl(u.fiyat).padStart(12)} · ${String(ids.length).padStart(2)} motor · ${durum}`,
    )
    const gorsel = fromRepo(`apps/web/public/urun/MANN-${norm(u.urun_kodu)}.webp`)
    if (!existsSync(gorsel)) console.log(`    ! görsel yok: ${gorsel}`)
  }
  console.log(`Araç eşleşmesi olan: ${uyumlu} · olmayan: ${veri.urunler.length - uyumlu}`)
  for (const m of veri.mevcut_urune_uyum) {
    const ids = coz(m.uyum, m.urun_kodu)
    console.log(`Mevcut ${m.urun_kodu} (${m.not}): +${ids.length} motor`)
  }

  if (!uygula) {
    console.log('\nBu bir ÖNİZLEME, hiçbir şey değişmedi. Uygulamak için: --uygula\n')
    return
  }

  let yeni = 0
  let guncel = 0
  await db.transaction().execute(async (trx) => {
    const iddiaYaz = async (productId: number, ids: number[], not: string) => {
      await sql`
        UPDATE compatibility_assertion SET is_active = false
        WHERE product_id = ${productId} AND source_id = ${kaynak.id} AND note = ${not}
          AND NOT (engine_id = ANY(${ids}::bigint[]))
      `.execute(trx)
      if (!ids.length) return
      await sql`
        INSERT INTO compatibility_assertion (product_id, engine_id, source_id, assertion_type, note)
        SELECT ${productId}, e, ${kaynak.id}, 'COMPATIBLE', ${not}
        FROM unnest(${ids}::bigint[]) AS e
        ON CONFLICT (product_id, engine_id, source_id, assertion_type)
        DO UPDATE SET is_active = true
      `.execute(trx)
    }

    for (const u of veri.urunler) {
      const sku = `MANN-${norm(u.urun_kodu)}`
      const etiket = ETIKET[u.kategori]
      const kategoriId = kategoriler.get(u.kategori)
      if (!kategoriId) throw new Error(`Kategori yok: ${u.kategori}`)
      const degerler = {
        name: etiket,
        product_code: u.urun_kodu,
        brand_id: marka.id,
        category_id: kategoriId,
        short_description: KISA[u.kategori],
        description: [
          `MANN-FILTER ${u.urun_kodu}, MANN-FILTER üretimi bir ${etiket.toLocaleLowerCase('tr-TR')}dir.`,
          ...UZUN[u.kategori],
          'Aracınıza uygunluğunu sayfanın üstündeki araç seçiciden doğrulayın.',
        ].join('\n\n'),
        status: 'ACTIVE' as const,
        seo_title: `MANN-FILTER ${u.urun_kodu} ${etiket}`.slice(0, 160),
        seo_description:
          `MANN-FILTER ${u.urun_kodu} ${etiket.toLocaleLowerCase('tr-TR')}. ${KISA[u.kategori]}`.slice(0, 320),
        updated_at: new Date(),
      }

      const mevcut = await trx.selectFrom('product').select(['id']).where('sku', '=', sku).executeTakeFirst()
      let productId: number
      let ilk = false
      if (mevcut) {
        productId = Number(mevcut.id)
        await trx.updateTable('product').set(degerler).where('id', '=', productId).execute()
        guncel++
      } else {
        const slug = slugify(`MANN-FILTER ${u.urun_kodu} ${etiket}`).slice(0, 140)
        const r = await trx
          .insertInto('product')
          .values({ ...degerler, sku, slug })
          .returning('id')
          .executeTakeFirstOrThrow()
        productId = Number(r.id)
        ilk = true
        yeni++
      }

      let variant = await trx
        .selectFrom('product_variant')
        .select(['id'])
        .where('product_id', '=', productId)
        .where('is_default', '=', true)
        .executeTakeFirst()
      if (!variant) {
        variant = await trx
          .insertInto('product_variant')
          .values({ product_id: productId, sku, is_default: true })
          .returning('id')
          .executeTakeFirstOrThrow()
      }
      const vid = Number(variant.id)
      await sql`DELETE FROM price WHERE variant_id = ${vid} AND customer_group = 'RETAIL'`.execute(trx)
      await trx
        .insertInto('price')
        .values({ variant_id: vid, price_net: yuvarla(u.fiyat / 1.2), tax_rate: 20 })
        .execute()
      if (ilk) {
        await sql`
          INSERT INTO stock (variant_id, warehouse_code, quantity, updated_at)
          VALUES (${vid}, 'MERKEZ', ${100 + Math.floor(Math.random() * 401)}, now())
          ON CONFLICT (variant_id, warehouse_code) DO NOTHING
        `.execute(trx)
      }

      await sql`DELETE FROM product_image WHERE product_id = ${productId}`.execute(trx)
      const url = `/urun/MANN-${norm(u.urun_kodu)}.webp`
      if (existsSync(fromRepo(`apps/web/public${url}`))) {
        await trx
          .insertInto('product_image')
          .values({
            product_id: productId,
            url,
            alt: `MANN-FILTER ${u.urun_kodu} ${etiket}`.slice(0, 200),
            sort_order: 0,
            is_primary: true,
          })
          .execute()
      }

      await iddiaYaz(productId, coz(u.uyum, u.kod), 'MANN-FILTER uygulama listesi')
    }

    for (const m of veri.mevcut_urune_uyum) {
      const productId = kodla.get(norm(m.urun_kodu))
      if (!productId) {
        console.log(`  ! ${m.urun_kodu} sitede bulunamadı, ek uyumluluk yazılmadı`)
        continue
      }
      await iddiaYaz(productId, coz(m.uyum, m.urun_kodu), `MANN-FILTER uygulama listesi (${m.not})`)
    }
  })

  const r = await resolveCompatibility(db)
  const idx = await rebuildEngineCategoryIndex(db)
  console.log(
    `\n✓ ${yeni} yeni ürün, ${guncel} ürün güncellendi · ${r.resolved} uyumluluk · ${idx} indeks satırı`,
  )
  console.log('  Setleri güncellemek için: npm run db:set-olustur -- --uygula\n')
}

main()
  .catch((e) => {
    console.error(`\nHATA: ${e instanceof Error ? e.message : e}\n`)
    process.exitCode = 1
  })
  .finally(closeDb)
