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
import { db, closeDb } from '../src/index'
import { createImportJob } from '../src/import'

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
