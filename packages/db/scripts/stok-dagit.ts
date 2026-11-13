/**
 * TOPLU STOK DAĞITIMI
 *
 *   npm run db:stok-dagit                      → ÖNİZLEME, hiçbir şey değişmez
 *   npm run db:stok-dagit -- --uygula          → uygular (varsayılan 100–500)
 *   npm run db:stok-dagit -- --min 100 --max 500 --uygula
 *
 * Tedarik sınırsız olduğu için her ürünün MERKEZ deposundaki stoğunu, aralık
 * içinde rastgele bir sayıya ayarlar; böylece sitede hepsi aynı sayı görünmez.
 * Set ürünlere dokunmaz: onların stoğu `npm run db:set-olustur -- --uygula`
 * ile bileşenlerin en düşüğünden hesaplanır (bu komuttan sonra çalıştırın).
 */
import { loadEnv } from './env'
loadEnv()

import { sql } from 'kysely'
import { db, closeDb } from '../src/index'

function arg(ad: string, varsayilan: number): number {
  const i = process.argv.indexOf(ad)
  return i >= 0 ? Number(process.argv[i + 1]) : varsayilan
}
const min = arg('--min', 100)
const max = arg('--max', 500)
const uygula = process.argv.includes('--uygula')

async function main(): Promise<void> {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < min) {
    throw new Error('--min ve --max tam sayı olmalı ve min ≤ max. Örnek: --min 100 --max 500')
  }
  const ozet = await sql<{ n: string }>`
    SELECT count(*)::text AS n
      FROM product_variant v
      JOIN product p ON p.id = v.product_id
      JOIN category c ON c.id = p.category_id
     WHERE c.code <> 'SET_URUNLER'
  `.execute(db)
  const n = ozet.rows[0]!.n
  console.log(`\nSet dışı ürün çeşidi: ${n} · yeni stok aralığı: ${min}–${max}`)
  if (!uygula) {
    console.log('\nBu bir ÖNİZLEME, hiçbir stok değişmedi. Uygulamak için komutun sonuna --uygula ekleyin.\n')
    return
  }
  const degisen = await db.transaction().execute(async (trx) => {
    const r = await sql`
      INSERT INTO stock (variant_id, warehouse_code, quantity, updated_at)
      SELECT v.id, 'MERKEZ', ${min}::int + floor(random() * (${max}::int - ${min}::int + 1))::int, now()
        FROM product_variant v
        JOIN product p ON p.id = v.product_id
        JOIN category c ON c.id = p.category_id
       WHERE c.code <> 'SET_URUNLER'
      ON CONFLICT (variant_id, warehouse_code)
      DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now()
    `.execute(trx)
    return Number(r.numAffectedRows ?? 0)
  })
  console.log(`\n✓ ${degisen} ürünün stoğu ${min}–${max} arasında güncellendi.`)
  console.log('  Set stoklarını güncellemek için: npm run db:set-olustur -- --uygula\n')
}

main()
  .catch((e) => {
    console.error(`\nHATA: ${e instanceof Error ? e.message : e}\n`)
    process.exitCode = 1
  })
  .finally(closeDb)
