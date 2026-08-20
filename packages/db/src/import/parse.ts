/**
 * ADIM 1–2: UPLOAD → PARSE
 *
 * Dosyayı okur, sayfaları tanır, hücreleri ham JSON satırlara çevirir.
 * BU AŞAMADA HİÇBİR DOĞRULAMA YAPILMAZ — amaç dosyayı olduğu gibi
 * staging'e almak. Böylece hatalı bir satır ayrıştırmayı durdurmaz.
 */
import * as XLSX from 'xlsx'
import { createHash } from 'node:crypto'
import type { ImportSheet } from '../types'
import { SHEET_BY_KEY, detectSheet, findField, normalizeHeader, type FieldDef } from './schema'

export type ParsedRow = {
  rowNo: number
  /** alan anahtarı → ham metin (kırpılmış) */
  values: Record<string, string>
  /** tanınmayan sütunlar — kullanıcıya "bu sütunlar yok sayıldı" olarak gösterilir */
  unknown: Record<string, string>
}

export type ParsedSheet = {
  sheet: ImportSheet
  sheetName: string
  rows: ParsedRow[]
  /** dosyada bulunan ama şemada olmayan sütun başlıkları */
  unknownHeaders: string[]
  /** şemada zorunlu olup dosyada hiç olmayan sütunlar */
  missingRequiredHeaders: string[]
  /** spec_ gibi dinamik önekli sütunlar */
  dynamicHeaders: string[]
}

export type ParseResult = {
  fileHash: string
  sheets: ParsedSheet[]
  /** tanınamayan sekmeler */
  ignoredSheets: string[]
  totalRows: number
}

export class ImportParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImportParseError'
  }
}

const MAX_ROWS_PER_SHEET = 200_000

export function parseWorkbook(buffer: Buffer, fileName: string): ParseResult {
  const fileHash = createHash('sha256').update(buffer).digest('hex')

  let wb: XLSX.WorkBook
  try {
    // CSV de XLSX kütüphanesi ile okunur; ayırıcı otomatik algılanır.
    wb = XLSX.read(buffer, { type: 'buffer', codepage: 65001, raw: false, cellDates: false })
  } catch (err) {
    throw new ImportParseError(
      `Dosya okunamadı. Geçerli bir .xlsx veya .csv dosyası mı? (${(err as Error).message})`,
    )
  }

  if (!wb.SheetNames.length) throw new ImportParseError('Dosyada hiç sayfa bulunamadı.')

  const sheets: ParsedSheet[] = []
  const ignoredSheets: string[] = []
  const isCsv = /\.csv$/i.test(fileName)

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName]
    if (!ws) continue

    // CSV tek sayfadır; sayfa adı dosya adından çıkarılır.
    const nameForDetect = isCsv ? fileName.replace(/\.[^.]+$/, '') : sheetName
    const kind = detectSheet(nameForDetect)
    if (!kind) {
      ignoredSheets.push(sheetName)
      continue
    }

    const parsed = parseSheet(ws, kind, sheetName)
    if (parsed.rows.length > MAX_ROWS_PER_SHEET) {
      throw new ImportParseError(
        `${sheetName} sayfası ${parsed.rows.length.toLocaleString('tr-TR')} satır içeriyor. ` +
          `Sayfa başına en fazla ${MAX_ROWS_PER_SHEET.toLocaleString('tr-TR')} satır işlenebilir; dosyayı bölün.`,
      )
    }
    sheets.push(parsed)
  }

  if (!sheets.length) {
    throw new ImportParseError(
      'Tanınan bir sayfa yok. Sayfa adları KATEGORILER, ARAC_AGACI, URUNLER, FIYAT_STOK, ' +
        'OEM_CAPRAZ, UYUMLULUK olmalıdır. Şablonu indirip kullanabilirsiniz.',
    )
  }

  return {
    fileHash,
    sheets,
    ignoredSheets,
    totalRows: sheets.reduce((a, s) => a + s.rows.length, 0),
  }
}

function parseSheet(ws: XLSX.WorkSheet, kind: ImportSheet, sheetName: string): ParsedSheet {
  const def = SHEET_BY_KEY[kind]
  const matrix = XLSX.utils.sheet_to_json<string[]>(ws, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: false,
  })

  const headerRow = matrix[0] ?? []
  const headers = headerRow.map((h) => String(h ?? '').trim())

  const mapping: Array<{ index: number; field: FieldDef | null; header: string; dynamic: boolean }> =
    []
  const unknownHeaders: string[] = []
  const dynamicHeaders: string[] = []

  headers.forEach((header, index) => {
    if (!header) return
    const field = findField(def, header)
    if (field) {
      mapping.push({ index, field, header, dynamic: false })
      return
    }
    const norm = normalizeHeader(header)
    const dynamic = def.dynamicPrefixes?.some((p) => norm.startsWith(normalizeHeader(p)))
    if (dynamic) {
      mapping.push({ index, field: null, header, dynamic: true })
      dynamicHeaders.push(norm)
      return
    }
    unknownHeaders.push(header)
  })

  const presentKeys = new Set(mapping.filter((m) => m.field).map((m) => m.field!.key))
  const missingRequiredHeaders = def.fields
    .filter((f) => f.required && !presentKeys.has(f.key))
    .map((f) => f.key)

  const rows: ParsedRow[] = []
  for (let r = 1; r < matrix.length; r++) {
    const raw = matrix[r]
    if (!raw) continue

    const values: Record<string, string> = {}
    const unknown: Record<string, string> = {}
    let hasContent = false

    for (const m of mapping) {
      const cell = raw[m.index]
      const text = cell === undefined || cell === null ? '' : String(cell).trim()
      if (text !== '') hasContent = true
      if (m.dynamic) unknown[normalizeHeader(m.header)] = text
      else if (m.field) values[m.field.key] = text
    }

    // Tamamen boş satırlar sessizce atlanır (Excel'in sonundaki boşluklar)
    if (!hasContent) continue

    rows.push({ rowNo: r + 1, values, unknown })
  }

  return { sheet: kind, sheetName, rows, unknownHeaders, missingRequiredHeaders, dynamicHeaders }
}
