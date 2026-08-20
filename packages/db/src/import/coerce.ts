/**
 * Hücre değerlerinin tip dönüşümü.
 *
 * Kurallar (04-CSV-IMPORT-FORMATI.md §1):
 *   · Boş hücre = "bu alanı değiştirme"
 *   · `[BOŞALT]` = alanı temizle
 *   · Ondalık ayırıcı `,` veya `.` — ikisi de kabul
 *   · Binlik ayırıcı KULLANILMAZ
 *   · EVET/HAYIR, 1/0, TRUE/FALSE kabul
 */
export const CLEAR_TOKEN = '[BOŞALT]'

export type CoerceResult<T> = { ok: true; value: T | null } | { ok: false; error: string }

export function isBlank(v: string | undefined | null): boolean {
  return v === undefined || v === null || v.trim() === ''
}

export function isClear(v: string): boolean {
  return v.trim().toLocaleUpperCase('tr') === CLEAR_TOKEN
}

export function coerceText(v: string, maxLength?: number): CoerceResult<string> {
  const t = v.trim()
  if (isClear(t)) return { ok: true, value: null }
  if (maxLength && t.length > maxLength) {
    return { ok: false, error: `En fazla ${maxLength} karakter olabilir (${t.length} karakter girildi)` }
  }
  return { ok: true, value: t }
}

export function coerceNumber(v: string): CoerceResult<number> {
  const t = v.trim()
  if (isClear(t)) return { ok: true, value: null }
  if (/\d\.\d{3}(\D|$)/.test(t) && t.includes(',')) {
    return { ok: false, error: `Binlik ayırıcı kullanmayın: "${t}" yerine "${t.replace(/\./g, '')}"` }
  }
  const n = Number(t.replace(/\s/g, '').replace(',', '.'))
  if (!Number.isFinite(n)) return { ok: false, error: `Sayı bekleniyordu, "${t}" geldi` }
  return { ok: true, value: n }
}

export function coerceInteger(v: string): CoerceResult<number> {
  const r = coerceNumber(v)
  if (!r.ok) return r
  if (r.value === null) return r
  if (!Number.isInteger(r.value)) {
    return { ok: false, error: `Tam sayı bekleniyordu, "${v.trim()}" geldi` }
  }
  return r
}

export function coerceYear(v: string): CoerceResult<number> {
  const r = coerceInteger(v)
  if (!r.ok) return r
  if (r.value === null) return r
  if (r.value < 1900 || r.value > 2100) {
    return { ok: false, error: `Yıl 1900–2100 aralığında olmalı, "${v.trim()}" geldi` }
  }
  return r
}

const TRUE_WORDS = new Set(['EVET', 'E', '1', 'TRUE', 'DOGRU', 'DOĞRU', 'VAR', 'YES'])
const FALSE_WORDS = new Set(['HAYIR', 'HAYIR.', 'H', '0', 'FALSE', 'YANLIS', 'YANLIŞ', 'YOK', 'NO'])

export function coerceBool(v: string): CoerceResult<boolean> {
  const t = v.trim().toLocaleUpperCase('tr')
  if (isClear(t)) return { ok: true, value: null }
  if (TRUE_WORDS.has(t)) return { ok: true, value: true }
  if (FALSE_WORDS.has(t)) return { ok: true, value: false }
  return { ok: false, error: `EVET veya HAYIR bekleniyordu, "${v.trim()}" geldi` }
}

export function coerceEnum(v: string, values: readonly string[]): CoerceResult<string> {
  const t = v.trim().toLocaleUpperCase('tr').replace(/[\s-]+/g, '_')
  if (isClear(t)) return { ok: true, value: null }
  const hit = values.find((x) => x.toLocaleUpperCase('tr') === t)
  if (!hit) {
    return { ok: false, error: `Geçersiz değer "${v.trim()}". İzin verilenler: ${values.join(', ')}` }
  }
  return { ok: true, value: hit }
}

/** `CHZB|CHZJ` → ['CHZB','CHZJ'] */
export function splitList(v: string): string[] {
  return v
    .split(/[|;]/)
    .map((x) => x.trim())
    .filter(Boolean)
}

/** Karşılaştırma için metin normalizasyonu (motor adı, model adı eşleştirmesi). */
export function normalizeName(input: string): string {
  return input
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '')
}
