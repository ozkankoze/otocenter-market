/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ÜRÜNLERİ YÜKLE — sıfırdan kurulum için tek komut
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Depodaki transkripsiyondan içe aktarma dosyasını üretir, pipeline'dan
 *  geçirir ve görselleri bağlar. `db:seed` bunu kendi sonunda çağırır; böylece
 *  temiz bir veritabanı kurulduğunda site ürünsüz kalmaz.
 *
 *  ONAY KAPISI HAKKINDA
 *  Bu betik önizlemede durup onay beklemez — çünkü YENİ veri içe aktarmıyor;
 *  depoya işlenmiş, daha önce incelenip onaylanmış veriyi geri yüklüyor.
 *  Dışarıdan gelen yeni bir dosya için akış değişmedi: `db:urun-import-onizle`
 *  sayaçları gösterir, `db:urun-import-onayla` yalnızca siz isteyince yazar.
 *
 *  Hata varsa YAZMAZ: doğrulamadan hatalı satır çıkarsa iş iptal edilir.
 */
import { loadEnv } from './env'
loadEnv()

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { db, closeDb } from '../src/index'
import { createImportJob, commitImport } from '../src/import'
import { ARTIFACTS_DIR, fromRepo } from './paths'

const FILE = resolve(ARTIFACTS_DIR, 'urunler.xlsx')
const SOURCE_CODE = process.env.IMPORT_SOURCE ?? 'CSV_V1'

function run(script: string): void {
  execFileSync('npx', ['tsx', fromRepo('packages/db/scripts', script)], {
    stdio: 'inherit',
    cwd: fromRepo(),
  })
}

async function main(): Promise<void> {
  console.log('\n── ÜRÜNLER ──────────────────────────────────────────')

  // 1) Transkripsiyondan içe aktarma dosyasını üret (her seferinde tazelenir)
  run('urun-import-uret.ts')

  // 2) Yükle + doğrula
  const source = await db
    .selectFrom('data_source')
    .select(['id', 'code', 'trust_level'])
    .where('code', '=', SOURCE_CODE)
    .executeTakeFirst()
  if (!source) throw new Error(`Veri kaynağı bulunamadı: ${SOURCE_CODE}`)

  const preview = await createImportJob(db, {
    fileName: basename(FILE),
    buffer: readFileSync(FILE),
    sourceId: source.id,
  })

  if (preview.totals.error > 0) {
    console.error(
      `\n! ${preview.totals.error} hatalı satır — hiçbir şey yazılmadı. ` +
        `Ayrıntı için: npm run db:urun-import-onizle`,
    )
    process.exitCode = 1
    return
  }

  // 3) Uygula
  const r = await commitImport(db, preview.jobId)
  console.log(
    `İş #${preview.jobId} · ${r.applied} satır uygulandı · ` +
      `${r.resolution.resolved} uyumluluk · ${r.resolution.conflicts} çelişki · ` +
      `${r.seoPages} SEO sayfası`,
  )

  await closeDb()

  // 4) Gerçek fotoğrafı olmayan ürünler için kategori görseli üret,
  //    sonra bütün görselleri ürünlerle eşle.
  //    (Ayrı süreçler: her biri kendi veritabanı bağlantısını açıp kapatır.)
  //    Çizim adımı İSTEĞE BAĞLIDIR (Python + Pillow ister). Başarısız olsa bile
  //    bağlama adımı MUTLAKA çalışmalı: depoda gelen gerçek fotoğraflar bu
  //    adımda ürünlere bağlanıyor. Aksi hâlde tek bir görsel bile görünmez.
  try {
    run('urun-gorsel-yertutucu.ts')
  } catch {
    console.log(
      '\n! Kategori çizimi adımı çalışmadı (Python/Pillow gerekir) — atlandı.\n' +
        '  Gerçek ürün fotoğrafları etkilenmedi, bağlanmaya devam ediliyor.\n',
    )
  }
  run('urun-gorsel-bagla.ts')
}

main().catch(async (e) => {
  console.error(e)
  process.exitCode = 1
  await closeDb().catch(() => {})
})
