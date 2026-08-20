/**
 * İÇE AKTARMAYI ONAYLA — COMMIT → RESOLVE → REPORT
 *
 * Yalnızca KULLANICI ONAYIYLA çalıştırılır. Önizlemede oluşturulan işi
 * production tablolarına uygular, ardından uyumluluk çözümlemesini ve SEO
 * indeksini yeniden hesaplar.
 *
 * Yazılan her kayıt `import_change` defterine düşer; geri almak için:
 *   npm run db:urun-import-geri-al -- <isNo>
 *
 * Çalıştırma:
 *   npm run db:urun-import-onayla -- <isNo>
 */
import { loadEnv } from './env'
loadEnv()

import { db, closeDb } from '../src/index'
import { commitImport } from '../src/import'

const JOB_ID = Number(process.argv[2])

async function main(): Promise<void> {
  if (!Number.isInteger(JOB_ID) || JOB_ID <= 0) {
    throw new Error('Geçerli bir iş numarası verin: npm run db:urun-import-onayla -- 2')
  }

  const job = await db
    .selectFrom('import_job')
    .select(['id', 'file_name', 'status'])
    .where('id', '=', JOB_ID)
    .executeTakeFirst()
  if (!job) throw new Error(`İş bulunamadı: #${JOB_ID}`)

  console.log(`\nUYGULANIYOR — iş #${job.id} · ${job.file_name} (durum: ${job.status})\n`)
  const r = await commitImport(db, JOB_ID)

  console.log('── SONUÇ ────────────────────────────────────────────')
  console.log(`Uygulanan satır : ${r.applied}`)
  console.log(`Atlanan satır   : ${r.skipped}`)
  console.log(`Defter kaydı    : ${r.changes}`)
  console.log(`Oluşturulan     : ${JSON.stringify(r.created)}`)
  console.log(`Güncellenen     : ${JSON.stringify(r.updated)}`)
  console.log(
    `Çözümleme       : ${r.resolution.resolved} uyumluluk · ` +
      `${r.resolution.conflicts} çelişki · ${r.resolution.removed} kaldırılan`,
  )
  console.log(`SEO sayfası     : ${r.seoPages}`)
  console.log(`\nGeri almak için: npm run db:urun-import-geri-al -- ${JOB_ID}\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(closeDb)
