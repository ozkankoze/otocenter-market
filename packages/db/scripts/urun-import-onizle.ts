/**
 * İÇE AKTARMA ÖNİZLEMESİ — COMMIT YOK
 *
 * Dosyayı yükler, staging'e yazar, doğrular ve sayaçları basar.
 * PRODUCTION TABLOLARINA HİÇBİR ŞEY YAZILMAZ; yazma ayrı komuttur
 * (urun-import-onayla.ts) ve yalnızca kullanıcı onayıyla çalıştırılır.
 *
 * Çalıştırma:
 *   npm run db:urun-import-onizle -- <dosya.xlsx> [KAYNAK_KODU]
 */
import { loadEnv } from './env'
loadEnv()

import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { ARTIFACTS_DIR } from './paths'
import { db, closeDb, sql } from '../src/index'
import { createImportJob } from '../src/import'
import { REAL_ENGINES } from './seed-data/arac-motorlari'

/**
 * ARAÇ AĞACI ÖNKONTROLÜ
 *
 * Uyumluluk satırları motoru ADIYLA arar. Ağaç eksikse her satır ayrı ayrı
 * E_ENGINE_NOT_FOUND üretir; 60 bin satırlık bir dosyada bu, ekranı dolduran
 * on binlerce aynı hata demektir ve asıl sebebi (ağacın yarım olması)
 * gizler. Bu kontrol, hataları saymadan önce ağacın beklenen boyutta olup
 * olmadığına bakar ve eksikse tek cümleyle söyler.
 */
async function agacDurumu(): Promise<{
  beklenen: number
  mevcut: number
  eksikMarkalar: string[]
}> {
  const beklenen = Object.values(REAL_ENGINES).reduce(
    (a, byModel) => a + Object.values(byModel).reduce((b, list) => b + list.length, 0),
    0,
  )
  const { rows } = await sql<{ slug: string; n: number }>`
    select b.slug, count(e.id)::int as n
      from vehicle_brand b
      left join vehicle_model m on m.brand_id = b.id
      left join vehicle_engine e on e.model_id = m.id
     group by b.slug
  `.execute(db)
  const sayim = new Map(rows.map((r) => [r.slug, Number(r.n)]))
  const mevcut = [...sayim.values()].reduce((a, b) => a + b, 0)
  const eksikMarkalar = Object.keys(REAL_ENGINES).filter((k) => (sayim.get(k) ?? 0) === 0)
  return { beklenen, mevcut, eksikMarkalar }
}

const FILE = process.argv[2] ? resolve(process.argv[2]) : resolve(ARTIFACTS_DIR, 'urunler.xlsx')
const SOURCE_CODE = process.argv[3] ?? 'CSV_V1'

async function main(): Promise<void> {
  const source = await db
    .selectFrom('data_source')
    .select(['id', 'code', 'name', 'trust_level'])
    .where('code', '=', SOURCE_CODE)
    .executeTakeFirst()
  if (!source) throw new Error(`Veri kaynağı bulunamadı: ${SOURCE_CODE}`)

  const buffer = readFileSync(FILE)
  const preview = await createImportJob(db, {
    fileName: basename(FILE),
    buffer,
    sourceId: source.id,
  })

  const t = preview.totals
  console.log(`\nÖNİZLEME — iş #${preview.jobId} · ${preview.fileName}`)
  console.log(`Kaynak: ${source.name} (${source.code}, güven ${source.trust_level})\n`)

  console.log('── SAYAÇLAR ─────────────────────────────────────────')
  console.log(`Toplam satır          : ${t.total}`)
  console.log(`Geçerli               : ${t.valid}`)
  console.log(`Uyarılı               : ${t.warning}`)
  console.log(`Hatalı                : ${t.error}`)
  console.log(`Dosya içi tekrar      : ${t.duplicate}`)
  console.log(`Yeni oluşturulacak    : ${t.created}`)
  console.log(`Güncellenecek         : ${t.updated}`)
  console.log(`Çelişki riski         : ${t.conflictRisk}`)
  console.log(`Araçta bulunamayan    : ${t.missingVehicle}`)
  console.log(`Paylaşılan OEM        : ${t.oemShared}`)

  console.log('\n── SAYFALAR ─────────────────────────────────────────')
  for (const s of preview.sheets) {
    console.log(
      `${s.title.padEnd(14)} ${String(s.total).padStart(4)} satır · ` +
        `${s.valid} geçerli · ${s.warning} uyarı · ${s.error} hata · ` +
        `${s.created} yeni · ${s.updated} güncelleme`,
    )
  }

  if (preview.missingRequiredHeaders.length) {
    console.log('\n! EKSİK ZORUNLU SÜTUN:')
    for (const m of preview.missingRequiredHeaders)
      console.log(`  ${m.sheet}: ${m.headers.join(', ')}`)
  }
  if (preview.unknownHeaders.length) {
    console.log('\n! TANINMAYAN SÜTUN:')
    for (const m of preview.unknownHeaders) console.log(`  ${m.sheet}: ${m.headers.join(', ')}`)
  }
  if (preview.ignoredSheets.length)
    console.log(`\n! Yok sayılan sayfa: ${preview.ignoredSheets.join(', ')}`)

  // Motor bulunamadı hataları varsa ÖNCE ağacın kendisine bak.
  if (t.missingVehicle > 0) {
    const { beklenen, mevcut, eksikMarkalar } = await agacDurumu()
    if (eksikMarkalar.length || mevcut < beklenen) {
      console.log('\n── ⚠ ARAÇ AĞACI EKSİK ───────────────────────────────')
      console.log(
        `Bu ${t.missingVehicle} hatanın sebebi dosya değil, veritabanındaki\n` +
          `araç ağacının yarım olması.\n`,
      )
      console.log(`  Beklenen motor : ${beklenen}`)
      console.log(`  Veritabanında  : ${mevcut}`)
      if (eksikMarkalar.length) {
        console.log(
          `  Motoru HİÇ olmayan marka (${eksikMarkalar.length}): ${eksikMarkalar.join(', ')}`,
        )
      }
      console.log(
        `\nÇözüm — ağacı yeniden kurun, sonra bu komutu tekrar çalıştırın:\n` +
          `  npm run db:seed\n` +
          `  npm run db:urun-import-onizle\n\n` +
          `db:vehicle-tree TEK BAŞINA yetmez: ağacın tabanı (motor kodlu\n` +
          `kayıtlar, vehicles.ts) seed.ts tarafından yazılıyor ve bir kısım\n` +
          `uyumluluk satırı o motorlara bağlanıyor. Tam kurulum db:seed'dir.\n\n` +
          `Not: ağaç senkronizasyonu artık tek işlemde çalışıyor; yarıda\n` +
          `kalırsa hiçbir şey yazmaz, ağacı yarım bırakmaz.`,
      )
    }
  }

  if (preview.errorSamples.length) {
    console.log('\n── HATALAR ──────────────────────────────────────────')
    for (const e of preview.errorSamples)
      console.log(`  ${e.sheetTitle} sat.${e.rowNo} [${e.code}] ${e.message}`)
  }
  if (preview.warningSamples.length) {
    console.log('\n── UYARILAR ─────────────────────────────────────────')
    for (const w of preview.warningSamples.slice(0, 25)) {
      console.log(`  ${w.sheetTitle} sat.${w.rowNo} [${w.code}] ${w.message}`)
    }
    if (preview.warningSamples.length > 25) {
      console.log(`  … ve ${preview.warningSamples.length - 25} uyarı daha`)
    }
  }

  console.log(
    `\nHiçbir şey yazılmadı. Onaylamak için:\n  npm run db:urun-import-onayla -- ${preview.jobId}\n`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(closeDb)
