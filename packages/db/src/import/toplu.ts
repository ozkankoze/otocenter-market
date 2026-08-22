/**
 * ════════════════════════════════════════════════════════════════════════════
 *  TOPLU YAZMA YARDIMCILARI
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  NEDEN VAR
 *  ─────────
 *  İçe aktarma uygulaması eskiden satır satır çalışıyordu: her kayıt için önce
 *  bir SELECT, sonra bir UPDATE ya da INSERT. 65.953 satırlık bir dosyada bu
 *  **148.136 SQL sorgusu** demekti. Yerelde (0,3 ms gidiş-dönüş) 71 saniye
 *  süren bu iş, Neon gibi uzak bir veritabanında (89 ms gidiş-dönüş)
 *  148.136 × 89 ms ≈ **3 saat 40 dakika** sürüyordu ve ekrana hiçbir şey
 *  yazmadığı için "takıldı" gibi görünüyordu.
 *
 *  Önizleme aynı dosyayı **158 sorguda** bitiriyordu; çünkü her tabloyu bir kez
 *  toplu okuyup geri kalan her şeyi bellekte yapıyordu. Uygulama artık aynı
 *  yöntemi kullanıyor.
 *
 *  YÖNTEM
 *  ──────
 *  1. İlgili mevcut kayıtları TEK (ya da birkaç) sorguyla oku.
 *  2. Farkı BELLEKTE hesapla: eklenecekler / değişenler / değişmeyenler.
 *  3. Parçalar hâlinde toplu INSERT ve toplu UPDATE at.
 *
 *  Değişmeyen satır hiç yazılmaz — bu, aynı dosyanın ikinci kez uygulanmasını
 *  neredeyse bedava hâle getirir.
 */
import { sql, type Transaction } from 'kysely'
import type { Database } from '../types'

/** Diziyi eşit parçalara böler. Boş parça üretmez. */
export function dilimle<T>(satirlar: readonly T[], parca: number): T[][] {
  const cikti: T[][] = []
  for (let i = 0; i < satirlar.length; i += parca) {
    const d = satirlar.slice(i, i + parca)
    if (d.length) cikti.push(d)
  }
  return cikti
}

/**
 * Bir kolonun toplu güncellemedeki tanımı.
 *
 * `tip`  → `jsonb_to_recordset` sütun listesinde kullanılacak PostgreSQL tipi.
 * `cast` → SET tarafında gerekiyorsa ek dönüşüm (enum kolonları için).
 *          Enum kolonlar recordset'te `text` olarak okunur, SET'te enum'a
 *          çevrilir; çünkü jsonb_to_recordset enum tipini doğrudan almaz.
 */
export type GuncelKolon = { ad: string; tip: string; cast?: string }

/**
 * TOPLU GÜNCELLEME — tek sorguda binlerce satır.
 *
 * Klasik yol her satır için ayrı bir UPDATE atmaktır. Burada bunun yerine
 * satırlar TEK bir jsonb parametresi olarak gönderilir ve sunucu tarafında
 * `jsonb_to_recordset` ile tabloya çevrilip tek UPDATE ... FROM ile
 * uygulanır:
 *
 *     update "price" as t
 *        set "price_net" = v."price_net", ...
 *       from jsonb_to_recordset($1::jsonb) as v("id" int8, "price_net" numeric, ...)
 *      where t."id" = v."id"
 *
 * Tek parametre kullanıldığı için PostgreSQL'in 65.535 parametre sınırına
 * takılmaz; parça boyutu yalnızca bellek/paket büyüklüğü için vardır.
 */
export async function topluGuncelle(
  trx: Transaction<Database>,
  tablo: string,
  kolonlar: readonly GuncelKolon[],
  satirlar: ReadonlyArray<Record<string, unknown> & { id: number }>,
  parca = 1000,
): Promise<number> {
  if (!satirlar.length || !kolonlar.length) return 0

  const atamalar = kolonlar
    .map((k) => `"${k.ad}" = v."${k.ad}"${k.cast ? `::${k.cast}` : ''}`)
    .join(', ')
  const sutunListesi = [`"id" int8`, ...kolonlar.map((k) => `"${k.ad}" ${k.tip}`)].join(', ')

  let toplam = 0
  for (const dilim of dilimle(satirlar, parca)) {
    // Yalnızca ilgili alanlar taşınır; fazlası paketi şişirir.
    const yuk = dilim.map((s) => {
      const o: Record<string, unknown> = { id: s.id }
      for (const k of kolonlar) o[k.ad] = s[k.ad] ?? null
      return o
    })
    await sql`
      update ${sql.table(tablo)} as t
         set ${sql.raw(atamalar)}
        from jsonb_to_recordset(${JSON.stringify(yuk)}::jsonb) as v(${sql.raw(sutunListesi)})
       where t."id" = v."id"
    `.execute(trx)
    toplam += dilim.length
  }
  return toplam
}

/**
 * İki kaydın ilgili alanları aynı mı?
 *
 * Değişmeyen satırı yazmamak için kullanılır. Karşılaştırma gevşektir:
 * veritabanından gelen `numeric` bir alan string, uygulamadan gelen aynı alan
 * number olabilir; `Date` ile ISO metni de aynı anı gösterebilir. Sıkı
 * karşılaştırma bu yüzden her satırı "değişmiş" sayardı ve toplu güncelleme
 * hiçbir işe yaramazdı.
 */
export function ayniMi(
  mevcut: Record<string, unknown>,
  yeni: Record<string, unknown>,
  alanlar: readonly string[],
): boolean {
  for (const a of alanlar) {
    if (!esit(mevcut[a], yeni[a])) return false
  }
  return true
}

function esit(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || a === undefined) return b === null || b === undefined
  if (b === null || b === undefined) return false
  if (a instanceof Date || b instanceof Date) {
    const t1 = a instanceof Date ? a.getTime() : new Date(String(a)).getTime()
    const t2 = b instanceof Date ? b.getTime() : new Date(String(b)).getTime()
    return Number.isFinite(t1) && Number.isFinite(t2) && t1 === t2
  }
  if (typeof a === 'object' || typeof b === 'object') {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch {
      return false
    }
  }
  // '20' ile 20, '1250.00' ile 1250 aynı sayılır (NUMERIC/INT2 kolonları).
  const sa = String(a)
  const sb = String(b)
  if (sa === sb) return true
  const na = Number(sa)
  const nb = Number(sb)
  return Number.isFinite(na) && Number.isFinite(nb) && na === nb
}
