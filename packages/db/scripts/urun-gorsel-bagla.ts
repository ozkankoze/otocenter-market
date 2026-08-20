/**
 * ÜRÜN GÖRSELLERİNİ VERİTABANINA BAĞLA
 *
 * `apps/web/public/urun/<SKU>.png` dosyalarını `product_image` tablosuna
 * bağlar. Idempotenttir: aynı URL zaten kayıtlıysa dokunmaz.
 *
 * Görsel DOSYASI üretmez — onu `urun-gorsel-cikar.ts` yapar. Bu betik yalnızca
 * var olan dosyaları ürünlerle eşler; dosyası olmayan ürün görselsiz kalır ve
 * arayüzde yer tutucu gösterilir.
 *
 * Çalıştırma: npm run db:urun-gorsel-bagla
 */
import { loadEnv } from './env'
loadEnv()

import { readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { PRODUCT_IMAGE_DIR } from './paths'
import { sql } from 'kysely'
import { db, closeDb } from '../src/index'

const DIR = process.env.IMG_DIR ? resolve(process.env.IMG_DIR) : PRODUCT_IMAGE_DIR

async function main(): Promise<void> {
  if (!existsSync(DIR)) throw new Error(`Görsel klasörü yok: ${DIR}`)

  const files = readdirSync(DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))

  /*
   * ÖNCE ARTIK SATIRLARI TEMİZLE.
   *
   * Ürün fotoğrafları PNG'den WebP'ye çevrilince eski `/urun/<SKU>.png`
   * satırları veritabanında kalıyor ve her ürün iki görselle görünüyordu.
   * Diskte karşılığı olmayan her `/urun/…` satırı silinir.
   */
  const diskteVar = new Set(files.map((f) => `/urun/${f}`))
  const mevcutSatirlar = await db
    .selectFrom('product_image')
    .select(['id', 'url'])
    .where('url', 'like', '/urun/%')
    .execute()
  const silinecek = mevcutSatirlar.filter((r) => !diskteVar.has(r.url)).map((r) => r.id)
  if (silinecek.length) {
    await db.deleteFrom('product_image').where('id', 'in', silinecek).execute()
    console.log(`  Diskte olmayan ${silinecek.length} görsel satırı silindi.`)
  }

  let linked = 0
  let already = 0
  const orphans: string[] = []

  for (const file of files) {
    const sku = file.replace(/\.[^.]+$/, '')
    const url = `/urun/${file}`

    // alt metni marka + parça kodu + ürün tipi olarak kurulur; ürün adının
    // kendisi yalnızca tiptir ("Yağ Filtresi") ve tek başına ayırt etmez.
    const product = await db
      .selectFrom('product as p')
      .innerJoin('product_brand as b', 'b.id', 'p.brand_id')
      .select([
        'p.id as id',
        sql<string>`concat_ws(' ', b.name, p.product_code, p.name)`.as('name'),
      ])
      .where('p.sku', '=', sku)
      .executeTakeFirst()
    if (!product) {
      orphans.push(file)
      continue
    }

    const existing = await db
      .selectFrom('product_image')
      .select('id')
      .where('product_id', '=', product.id)
      .where('url', '=', url)
      .executeTakeFirst()
    if (existing) {
      already++
      continue
    }

    await db
      .insertInto('product_image')
      .values({
        product_id: product.id,
        url,
        alt: product.name.slice(0, 200),
        sort_order: 0,
        is_primary: true,
      })
      .execute()
    linked++
  }

  const withImage = await db
    .selectFrom('product_image')
    .select(({ fn }) => fn.count<string>('product_id').distinct().as('n'))
    .executeTakeFirst()
  const totalProducts = await db
    .selectFrom('product')
    .select(({ fn }) => fn.count<string>('id').as('n'))
    .executeTakeFirst()

  console.log(`\n+${linked} yeni bağ · ${already} zaten bağlı`)
  if (orphans.length) console.log(`! SKU'su bulunamayan dosya: ${orphans.join(', ')}`)
  console.log(`Görseli olan ürün: ${withImage?.n ?? 0} / ${totalProducts?.n ?? 0}\n`)

  // Sessiz başarısızlık koruması: klasörde görsel dosyası varken TEK bir ürüne
  // bile bağlanmadıysa bu bir hatadır. Aksi hâlde kurulum "başarılı" görünür,
  // site açılır ve bütün ürünler yer tutucuyla çıkar — sebebi de belli olmaz.
  if (files.length > 0 && Number(withImage?.n ?? 0) === 0) {
    throw new Error(
      `${files.length} görsel dosyası var ama hiçbiri ürüne bağlanmadı. ` +
        `Dosya adları ürün SKU'suyla eşleşmiyor olabilir (ör. MANN-W7144.png).`,
    )
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(closeDb)
