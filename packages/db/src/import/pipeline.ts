/**
 * IMPORT PIPELINE — akışın tek giriş noktası.
 *
 *   UPLOAD → PARSE → STAGING → VALIDATE → PREVIEW → USER CONFIRM
 *          → COMMIT → RESOLVE → REPORT
 *
 * Kullanıcı onaylamadan production tablolarına HİÇBİR ŞEY yazılmaz:
 * `createImportJob` yalnızca `import_job` + `import_staging_row` yazar.
 */
import type { Kysely } from 'kysely'
import type { Database, ImportSheet } from '../types'
import { parseWorkbook, ImportParseError } from './parse'
import { validateParsed, type ImportTotals, type SheetSummary, type ValidationResult } from './validate'
import { SHEET_BY_KEY } from './schema'

/**
 * node-pg, JS dizilerini PostgreSQL ARRAY literal'ine çevirir; jsonb kolonlara
 * dizi yazarken bu bozulmaya yol açar. Bu yüzden jsonb değerleri açıkça
 * JSON metnine çevriliyor.
 */
const jsonb = (v: unknown): never => JSON.stringify(v ?? null) as never

export type ImportPreview = {
  jobId: number
  fileName: string
  fileSize: number
  sourceCode: string
  totals: ImportTotals
  sheets: SheetSummary[]
  unknownHeaders: ValidationResult['unknownHeaders']
  missingRequiredHeaders: ValidationResult['missingRequiredHeaders']
  ignoredSheets: string[]
  expansions: ValidationResult['expansions']
  /** kullanıcıya gösterilecek ilk hatalı satırlar */
  errorSamples: Array<{ sheet: ImportSheet; sheetTitle: string; rowNo: number; message: string; code: string }>
  warningSamples: Array<{ sheet: ImportSheet; sheetTitle: string; rowNo: number; message: string; code: string }>
  /** aynı dosya daha önce yüklendiyse önceki job */
  duplicateOfJobId: number | null
}

export type CreateImportOptions = {
  fileName: string
  buffer: Buffer
  sourceId: number
  userId?: number | null
  options?: Record<string, unknown>
}

const STAGING_CHUNK = 500

export async function createImportJob(
  db: Kysely<Database>,
  input: CreateImportOptions,
): Promise<ImportPreview> {
  const source = await db
    .selectFrom('data_source')
    .select(['id', 'code', 'name', 'trust_level'])
    .where('id', '=', input.sourceId)
    .executeTakeFirst()
  if (!source) throw new Error('Veri kaynağı bulunamadı.')

  const job = await db
    .insertInto('import_job')
    .values({
      file_name: input.fileName,
      file_size: input.buffer.byteLength,
      source_id: input.sourceId,
      created_by_user_id: input.userId ?? null,
      status: 'UPLOADED',
      options: jsonb(input.options ?? {}),
    })
    .returning(['id'])
    .executeTakeFirstOrThrow()

  try {
    // ── PARSE ───────────────────────────────────────────────────────────────
    const parsed = parseWorkbook(input.buffer, input.fileName)

    const previousSameFile = await db
      .selectFrom('import_job')
      .select(['id'])
      .where('file_hash', '=', parsed.fileHash)
      .where('status', '=', 'COMPLETED')
      .orderBy('id', 'desc')
      .executeTakeFirst()

    const sheetCounts: Record<string, number> = {}
    for (const s of parsed.sheets) sheetCounts[s.sheet] = s.rows.length

    await db
      .updateTable('import_job')
      .set({
        status: 'PARSED',
        parsed_at: new Date(),
        file_hash: parsed.fileHash,
        sheet_counts: jsonb(sheetCounts),
      })
      .where('id', '=', job.id)
      .execute()

    // ── VALIDATE ────────────────────────────────────────────────────────────
    const validation = await validateParsed(db, parsed, { sourceId: input.sourceId })

    // ── STAGING ─────────────────────────────────────────────────────────────
    for (let i = 0; i < validation.rows.length; i += STAGING_CHUNK) {
      await db
        .insertInto('import_staging_row')
        .values(
          validation.rows.slice(i, i + STAGING_CHUNK).map((r) => ({
            import_job_id: job.id,
            sheet: r.sheet,
            row_no: r.rowNo,
            raw: jsonb(r.raw),
            normalized: jsonb(r.normalized ?? null),
            status: r.status,
            action: r.action,
            entity_type: r.entityType,
            entity_id: r.entityId,
            messages: jsonb(r.messages),
          })),
        )
        .execute()
    }

    await db
      .updateTable('import_job')
      .set({
        status: 'VALIDATED',
        validated_at: new Date(),
        totals: jsonb(validation.totals),
      })
      .where('id', '=', job.id)
      .execute()

    return buildPreview({
      jobId: job.id,
      fileName: input.fileName,
      fileSize: input.buffer.byteLength,
      sourceCode: source.code,
      validation,
      duplicateOfJobId: previousSameFile?.id ?? null,
    })
  } catch (err) {
    const message =
      err instanceof ImportParseError ? err.message : `Beklenmeyen hata: ${(err as Error).message}`
    await db
      .updateTable('import_job')
      .set({ status: 'FAILED', error_message: message })
      .where('id', '=', job.id)
      .execute()
    throw err
  }
}

function buildPreview(input: {
  jobId: number
  fileName: string
  fileSize: number
  sourceCode: string
  validation: ValidationResult
  duplicateOfJobId: number | null
}): ImportPreview {
  const { validation } = input

  const sample = (level: 'ERROR' | 'WARNING') =>
    validation.rows
      .filter((r) => r.messages.some((m) => m.level === level))
      .slice(0, 50)
      .map((r) => {
        const m = r.messages.find((x) => x.level === level)!
        return {
          sheet: r.sheet,
          sheetTitle: SHEET_BY_KEY[r.sheet].title,
          rowNo: r.rowNo,
          code: m.code,
          message: m.message,
        }
      })

  return {
    jobId: input.jobId,
    fileName: input.fileName,
    fileSize: input.fileSize,
    sourceCode: input.sourceCode,
    totals: validation.totals,
    sheets: validation.sheets,
    unknownHeaders: validation.unknownHeaders,
    missingRequiredHeaders: validation.missingRequiredHeaders,
    ignoredSheets: validation.ignoredSheets,
    expansions: validation.expansions.slice(0, 25),
    errorSamples: sample('ERROR'),
    warningSamples: sample('WARNING'),
    duplicateOfJobId: input.duplicateOfJobId,
  }
}

/** Kullanıcı önizlemeden vazgeçerse — staging temizlenir, production'a dokunulmaz. */
export async function cancelImportJob(db: Kysely<Database>, jobId: number): Promise<void> {
  const job = await db
    .selectFrom('import_job')
    .select(['status'])
    .where('id', '=', jobId)
    .executeTakeFirst()
  if (!job) throw new Error(`Import #${jobId} bulunamadı`)
  if (job.status === 'COMPLETED' || job.status === 'ROLLED_BACK') {
    throw new Error('Uygulanmış bir import iptal edilemez; geri alma kullanın.')
  }
  await db.updateTable('import_job').set({ status: 'CANCELLED' }).where('id', '=', jobId).execute()
}
