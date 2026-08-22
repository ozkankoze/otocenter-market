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
 *   npm run db:urun-import-onayla -- <isNo>            uygular
 *   npm run db:urun-import-onayla -- <isNo> --olcum    KURU ÇALIŞMA (yazmaz)
 *   npm run db:urun-import-onayla -- <isNo> --kurtar   asılı kalmış işi kurtarır
 *
 * KURU ÇALIŞMA (--olcum)
 * ──────────────────────
 * Her şeyi gerçekten çalıştırır — okur, farkı hesaplar, yazar, çözümlemeyi
 * yapar — ve sonunda işlemi GERİ ALIR. Ne yazılacağını, kaç sorgu atıldığını ve
 * gerçek süreyi gösterir; veritabanına tek satır yazmaz, iş durumuna dokunmaz.
 * Uzak bir veritabanına ilk kez uygulamadan önce bunu çalıştırmak, süreyi
 * tahmin etmek yerine ÖLÇMEYİ sağlar.
 */
import { loadEnv } from './env'
loadEnv()

import { db, closeDb, sorguSayaci } from '../src/index'
import { commitImport, kurtarAsiliIs } from '../src/import'

const ARGS = process.argv.slice(2)
const JOB_ID = Number(ARGS.find((a) => !a.startsWith('--')))
const OLCUM = ARGS.includes('--olcum') || ARGS.includes('--dry-run')
const KURTAR = ARGS.includes('--kurtar')

/**
 * SON KORUMA — ne olursa olsun sessizce beklemez.
 * Aşama günlüğü zaten nerede olduğunu yazıyor; bu, hiç ilerlemeyen bir
 * çalıştırmayı takıldığı aşamanın adıyla sonlandırır.
 */
const TOPLAM_SINIRI = Number(process.env.OCM_TOPLAM_SINIRI ?? 3_600_000)
const kalkan = setTimeout(() => {
  console.error(
    `\n✗ TOPLAM ZAMAN AŞIMI (${Math.round(TOPLAM_SINIRI / 60_000)} dk).\n` +
      `  İşlem geri alındı; veritabanına hiçbir şey yazılmadı.\n` +
      `  Son basılan aşama satırı takıldığı yeri gösterir.\n`,
  )
  process.exit(2)
}, TOPLAM_SINIRI)

function sure(ms: number): string {
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} sn`
  const dk = Math.floor(ms / 60_000)
  return `${dk} dk ${Math.round((ms % 60_000) / 1000)} sn`
}

async function main(): Promise<void> {
  if (!Number.isInteger(JOB_ID) || JOB_ID <= 0) {
    throw new Error('Geçerli bir iş numarası verin: npm run db:urun-import-onayla -- 2')
  }

  if (KURTAR) {
    const r = await kurtarAsiliIs(db, JOB_ID)
    console.log(`\n${r.kurtarildi ? '✓' : '·'} ${r.sebep}\n`)
    return
  }

  const job = await db
    .selectFrom('import_job')
    .select(['id', 'file_name', 'status'])
    .where('id', '=', JOB_ID)
    .executeTakeFirst()
  if (!job) throw new Error(`İş bulunamadı: #${JOB_ID}`)

  console.log(
    `\n${OLCUM ? 'KURU ÇALIŞMA (ölçüm)' : 'UYGULANIYOR'} — iş #${job.id} · ${job.file_name} ` +
      `(durum: ${job.status})\n`,
  )

  sorguSayaci.sifirla()
  const r = await commitImport(db, JOB_ID, { olcum: OLCUM })

  console.log('\n── SONUÇ ────────────────────────────────────────────')
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

  // ── Ölçüm: uzak veritabanında ne kadar süreceğini TAHMİN değil HESAP ──────
  const ortMs = r.sorgu ? r.sureMs / r.sorgu : 0
  console.log('\n── ÖLÇÜM ────────────────────────────────────────────')
  console.log(`Toplam sorgu    : ${r.sorgu.toLocaleString('tr-TR')}`)
  console.log(`Toplam süre     : ${sure(r.sureMs)}`)
  console.log(`Sorgu başına    : ${ortMs.toFixed(1)} ms (gidiş-dönüş dahil)`)

  if (r.kuru) {
    console.log(
      `\n✓ KURU ÇALIŞMA — veritabanına hiçbir şey yazılmadı, iş durumu değişmedi.\n` +
        `  Gerçekten uygulamak için: npm run db:urun-import-onayla -- ${JOB_ID}\n`,
    )
  } else {
    console.log(`\nGeri almak için: npm run db:urun-import-geri-al -- ${JOB_ID}\n`)
  }
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(() => {
    clearTimeout(kalkan)
    return closeDb()
  })
