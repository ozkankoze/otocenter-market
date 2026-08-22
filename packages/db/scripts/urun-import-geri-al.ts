/**
 * İÇE AKTARMAYI GERİ AL
 *
 * Uygulanmış (COMPLETED) bir içe aktarmanın yazdıklarını `import_change`
 * defterine bakarak geri alır:
 *   INSERT → kayıt silinir      UPDATE → önceki değerler geri yazılır
 *
 * GÜVENLİK KURALI: bu içe aktarmadan SONRA aynı kaydı başka bir içe aktarma
 * değiştirmişse o kayıt ATLANIR ve sebebi yazılır. Eski bir işin geri alınması
 * sonraki işin doğru verisini bozmaz.
 *
 * Geri alma tek işlemde yapılır: yarıda kalırsa hiçbir şey değişmez.
 * Sonunda uyumluluk çözümlemesi ve SEO indeksi yeniden kurulur.
 *
 * Çalıştırma:
 *   npm run db:urun-import-geri-al -- <isNo>
 */
import { loadEnv } from './env'
loadEnv()

import { db, closeDb, sorguSayaci } from '../src/index'
import { rollbackImport } from '../src/import'

const JOB_ID = Number(process.argv.slice(2).find((a) => !a.startsWith('--')))

async function main(): Promise<void> {
  if (!Number.isInteger(JOB_ID) || JOB_ID <= 0) {
    throw new Error('Geçerli bir iş numarası verin: npm run db:urun-import-geri-al -- 3')
  }

  const job = await db
    .selectFrom('import_job')
    .select(['id', 'file_name', 'status'])
    .where('id', '=', JOB_ID)
    .executeTakeFirst()
  if (!job) throw new Error(`İş bulunamadı: #${JOB_ID}`)

  const defter = await db
    .selectFrom('import_change')
    .select(({ fn }) => fn.countAll<string>().as('n'))
    .where('import_job_id', '=', JOB_ID)
    .where('reverted_at', 'is', null)
    .executeTakeFirst()

  console.log(
    `\nGERİ ALINIYOR — iş #${job.id} · ${job.file_name} (durum: ${job.status})\n` +
      `Defterde geri alınacak ${Number(defter?.n ?? 0).toLocaleString('tr-TR')} kayıt var.\n`,
  )

  sorguSayaci.sifirla()
  const t0 = Date.now()
  const r = await rollbackImport(db, JOB_ID)
  const gecen = Date.now() - t0

  console.log('── SONUÇ ────────────────────────────────────────────')
  console.log(`Geri alınan     : ${r.reverted}`)
  console.log(`  silinen       : ${r.deleted}`)
  console.log(`  eski haline   : ${r.restored}`)
  console.log(`Atlanan         : ${r.skipped}`)
  console.log(
    `Çözümleme       : ${r.resolution.resolved} uyumluluk · ` +
      `${r.resolution.conflicts} çelişki · ${r.resolution.removed} kaldırılan`,
  )
  console.log(`\nToplam sorgu    : ${sorguSayaci.sayi.toLocaleString('tr-TR')}`)
  console.log(`Toplam süre     : ${(gecen / 1000).toFixed(1)} sn`)

  if (r.skippedDetails.length) {
    console.log('\n── ATLANANLAR ───────────────────────────────────────')
    for (const s of r.skippedDetails.slice(0, 20)) {
      console.log(`  ${s.entityType} #${s.entityId} — ${s.reason}`)
    }
    if (r.skippedDetails.length > 20) {
      console.log(`  … ve ${r.skippedDetails.length - 20} tane daha`)
    }
  }
  console.log('')
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(closeDb)
