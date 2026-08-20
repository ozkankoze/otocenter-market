/**
 * Uyumluluk çözümlemesini ve türetilmiş SEO indeksini yeniden hesaplar.
 * Faz 3'te CSV içe aktarımı sonrası otomatik tetiklenecektir.
 */
import { loadEnv } from './env'
loadEnv()

import { db, closeDb } from '../src/index'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../src/resolve'

async function main(): Promise<void> {
  const t0 = Date.now()
  const resolved = await resolveCompatibility(db)
  console.log(
    `✓ ${resolved.resolved} uyumluluk çözümlendi · ${resolved.conflicts} açık çakışma · ${resolved.removed} kaldırıldı`,
  )
  const indexed = await rebuildEngineCategoryIndex(db)
  console.log(`✓ ${indexed} araç×kategori indeks satırı`)
  console.log(`✓ Tamamlandı (${((Date.now() - t0) / 1000).toFixed(1)} sn)`)
}

main()
  .catch((err: unknown) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await closeDb()
  })
