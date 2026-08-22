/**
 * GERİ ALMA (ROLLBACK)
 *
 * Kural (kullanıcı şartı):
 *   "Daha sonra başka bir import tarafından güncellenmiş bir kaydı
 *    yanlışlıkla eski haline döndürme."
 *
 * Uygulama:
 *   Her kayıt için `import_change` defterine bakılır. Geri alınacak
 *   import'un değişikliğinden SONRA, BAŞKA bir import aynı kaydı
 *   değiştirmişse (ve o değişiklik hâlâ geçerliyse) kayıt ATLANIR ve
 *   nedeni `skip_reason` olarak yazılır. Böylece eski bir import'un geri
 *   alınması, sonraki import'un doğru verisini bozmaz.
 *
 *   INSERT → kayıt silinir (bağlı kayıtlar CASCADE ile gider)
 *   UPDATE → `before` içindeki kolonlar geri yazılır
 *
 * Geri alma sonunda çözümleme motoru yeniden çalıştırılır; iddialar
 * kalktığı için ilgili ürün-motor kayıtları da düşer (veri yoksa satır yok
 * = arayüzde gri "teyit edilmedi").
 */
import { sql, type Kysely } from 'kysely'
import type { Database } from '../types'
import { rebuildEngineCategoryIndex, resolveCompatibility } from '../resolve'

export type RollbackResult = {
  reverted: number
  skipped: number
  deleted: number
  restored: number
  skippedDetails: Array<{ entityType: string; entityId: number; reason: string }>
  resolution: { resolved: number; conflicts: number; removed: number }
}

/** Silme sırası — bağımlılığı olan tablolar önce boşaltılır. */
const DELETE_ORDER = [
  'compatibility_assertion',
  'product_reference',
  'stock',
  'price',
  'product_variant',
  'product',
  'vehicle_engine',
  'vehicle_generation',
  'vehicle_model',
  'vehicle_brand',
  'category_attribute',
  'category',
  'product_brand',
]

export async function rollbackImport(
  db: Kysely<Database>,
  jobId: number,
  options: { userId?: number | null } = {},
): Promise<RollbackResult> {
  const job = await db
    .selectFrom('import_job')
    .selectAll()
    .where('id', '=', jobId)
    .executeTakeFirst()
  if (!job) throw new Error(`Import #${jobId} bulunamadı`)
  if (job.status !== 'COMPLETED') {
    throw new Error(
      `Import #${jobId} durumu "${job.status}". Yalnızca uygulanmış (COMPLETED) bir import geri alınabilir.`,
    )
  }

  const result: RollbackResult = {
    reverted: 0,
    skipped: 0,
    deleted: 0,
    restored: 0,
    skippedDetails: [],
    resolution: { resolved: 0, conflicts: 0, removed: 0 },
  }

  await db.transaction().execute(async (trx) => {
    const changes = await trx
      .selectFrom('import_change')
      .selectAll()
      .where('import_job_id', '=', jobId)
      .where('reverted_at', 'is', null)
      .orderBy('id', 'desc')
      .execute()

    // Bu import'tan SONRA aynı kaydı değiştiren başka import var mı?
    const laterRows = await sql<{
      entity_type: string
      entity_id: string
      later_job: string
    }>`
      SELECT DISTINCT c.entity_type, c.entity_id::text AS entity_id, c.import_job_id::text AS later_job
      FROM import_change c
      WHERE c.import_job_id <> ${jobId}
        AND c.reverted_at IS NULL
        AND c.id > (
          SELECT min(c2.id) FROM import_change c2
          WHERE c2.import_job_id = ${jobId}
            AND c2.entity_type = c.entity_type
            AND c2.entity_id = c.entity_id
        )
    `.execute(trx)

    const blocked = new Map<string, number>()
    for (const r of laterRows.rows) {
      blocked.set(`${r.entity_type}:${r.entity_id}`, Number(r.later_job))
    }

    const toDelete: Array<{ entityType: string; entityId: number; changeId: number }> = []
    const revertedIds: number[] = []

    for (const change of changes) {
      const key = `${change.entity_type}:${change.entity_id}`
      const laterJob = blocked.get(key)
      if (laterJob) {
        const reason = `#${laterJob} numaralı import bu kaydı daha sonra güncelledi — güvenlik gereği geri alınmadı.`
        await trx
          .updateTable('import_change')
          .set({ skip_reason: reason })
          .where('id', '=', change.id)
          .execute()
        result.skipped++
        result.skippedDetails.push({
          entityType: change.entity_type,
          entityId: change.entity_id,
          reason,
        })
        continue
      }

      if (change.operation === 'UPDATE' && change.before) {
        const before = change.before as Record<string, unknown>
        if (Object.keys(before).length) {
          await sql`
            UPDATE ${sql.table(change.entity_type)}
            SET ${sql.join(
              Object.keys(before).map((col) => sql`${sql.ref(col)} = ${before[col] as never}`),
              sql`, `,
            )}
            WHERE id = ${change.entity_id}
          `.execute(trx)
        }
        result.restored++
        result.reverted++
        revertedIds.push(change.id)
      } else if (change.operation === 'INSERT') {
        toDelete.push({
          entityType: change.entity_type,
          entityId: change.entity_id,
          changeId: change.id,
        })
      }
    }

    // Silmeleri bağımlılık sırasına göre yap
    toDelete.sort((a, b) => DELETE_ORDER.indexOf(a.entityType) - DELETE_ORDER.indexOf(b.entityType))

    /*
     * ÖNCE TOPLU DENE.
     *
     * Bir içe aktarmanın geri alınması 71.309 kayda kadar çıkabiliyor. Her biri
     * için ayrı DELETE atmak uzak bir veritabanında (89 ms gidiş-dönüş) saatler
     * demek — uygulamanın kendisindeki hatanın aynısı. Tablo tablo tek DELETE
     * atıyoruz; yalnızca yabancı anahtar yüzünden düşen tablolarda satır satır
     * yönteme (savepoint'li) geri dönülüyor, çünkü hangi satırın kullanımda
     * olduğunu ancak o zaman ayırt edebiliyoruz.
     */
    const kalanSilme: typeof toDelete = []
    const gruplar = new Map<string, typeof toDelete>()
    for (const d of toDelete) {
      const l = gruplar.get(d.entityType) ?? []
      l.push(d)
      gruplar.set(d.entityType, l)
    }
    for (const [tip, grup] of gruplar) {
      for (let i = 0; i < grup.length; i += 1000) {
        const dilim = grup.slice(i, i + 1000)
        const sp = `ocm_rb_toplu_${tip}_${i}`
        await sql.raw(`SAVEPOINT ${sp}`).execute(trx)
        try {
          await sql`DELETE FROM ${sql.table(tip)} WHERE id = any(${dilim.map((d) => String(d.entityId))}::bigint[])`.execute(
            trx,
          )
          await sql.raw(`RELEASE SAVEPOINT ${sp}`).execute(trx)
          result.deleted += dilim.length
          result.reverted += dilim.length
          for (const d of dilim) revertedIds.push(d.changeId)
        } catch {
          // Bu parçada en az bir satır hâlâ kullanımda. Hangisi olduğunu
          // ancak tek tek deneyerek ayırt edebiliriz.
          await sql.raw(`ROLLBACK TO SAVEPOINT ${sp}`).execute(trx)
          kalanSilme.push(...dilim)
        }
      }
    }

    for (const [i, d] of kalanSilme.entries()) {
      // Kayıt hâlâ başka bir veri tarafından kullanılıyorsa (yabancı anahtar)
      // silme BAŞARISIZ olur. Bu bir hata değil, beklenen bir durumdur:
      // örneğin bu import'un oluşturduğu marka, geri alınmayan (sonraki bir
      // import tarafından güncellenmiş) ürünler tarafından hâlâ kullanılıyordur.
      // Savepoint sayesinde tek bir silme hatası bütün geri almayı düşürmez.
      const sp = `ocm_rb_${i}`
      await sql.raw(`SAVEPOINT ${sp}`).execute(trx)
      try {
        await sql`DELETE FROM ${sql.table(d.entityType)} WHERE id = ${d.entityId}`.execute(trx)
        await sql.raw(`RELEASE SAVEPOINT ${sp}`).execute(trx)
        result.deleted++
        result.reverted++
        revertedIds.push(d.changeId)
      } catch (err) {
        await sql.raw(`ROLLBACK TO SAVEPOINT ${sp}`).execute(trx)
        const reason =
          (err as { code?: string }).code === '23503'
            ? 'Kayıt hâlâ kullanımda (başka kayıtlar buna bağlı) — güvenlik gereği silinmedi.'
            : `Silinemedi: ${(err as Error).message}`
        await trx
          .updateTable('import_change')
          .set({ skip_reason: reason })
          .where('id', '=', d.changeId)
          .execute()
        result.skipped++
        result.skippedDetails.push({ entityType: d.entityType, entityId: d.entityId, reason })
      }
    }

    for (let i = 0; i < revertedIds.length; i += 500) {
      await trx
        .updateTable('import_change')
        .set({ reverted_at: new Date() })
        .where('id', 'in', revertedIds.slice(i, i + 500))
        .execute()
    }

    await trx
      .updateTable('import_job')
      .set({
        status: 'ROLLED_BACK',
        rolled_back_at: new Date(),
        rolled_back_by_user_id: options.userId ?? null,
      })
      .where('id', '=', jobId)
      .execute()
  })

  // İddialar kalktı → çözümleme yeniden yapılmalı
  result.resolution = await resolveCompatibility(db)
  await rebuildEngineCategoryIndex(db)

  return result
}
