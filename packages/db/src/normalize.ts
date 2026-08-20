/**
 * Ürün kodu / OEM numarası normalizasyonu.
 * Veritabanındaki `ocm_normalize_code()` fonksiyonuyla BİREBİR aynı davranmalı.
 *
 *   'C 35 154'      → 'C35154'
 *   'AP 182/2'      → 'AP1822'
 *   '04e-129-620-a' → '04E129620A'
 */
export function normalizeCode(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

/**
 * Türkçe karakterleri koruyarak SEO-uyumlu slug üretir.
 *
 * Türkçe dışındaki Latin diyakritikleri de eşlenir; aksi hâlde araç markası
 * adlarında sessizce bozuk slug üretiliyordu:
 *   'Citroën' → 'citro-n'   (ë eşlenmediği için)
 *   'Škoda'   → 'koda'      (Š eşlenmediği için)
 * Bu eşlemeler yalnızca EKLEME yapar; mevcut Türkçe davranışı değişmez.
 */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
    // ── Türkçe dışı Latin diyakritikleri ────────────────────────────────────
    á: 'a',
    à: 'a',
    â: 'a',
    ä: 'a',
    ã: 'a',
    å: 'a',
    ā: 'a',
    Á: 'a',
    À: 'a',
    Â: 'a',
    Ä: 'a',
    Ã: 'a',
    Å: 'a',
    Ā: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    ē: 'e',
    ě: 'e',
    É: 'e',
    È: 'e',
    Ê: 'e',
    Ë: 'e',
    Ē: 'e',
    Ě: 'e',
    í: 'i',
    ì: 'i',
    î: 'i',
    ï: 'i',
    ī: 'i',
    Í: 'i',
    Ì: 'i',
    Î: 'i',
    Ï: 'i',
    Ī: 'i',
    ó: 'o',
    ò: 'o',
    ô: 'o',
    õ: 'o',
    ō: 'o',
    ø: 'o',
    Ó: 'o',
    Ò: 'o',
    Ô: 'o',
    Õ: 'o',
    Ō: 'o',
    Ø: 'o',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ū: 'u',
    Ú: 'u',
    Ù: 'u',
    Û: 'u',
    Ū: 'u',
    ñ: 'n',
    Ñ: 'n',
    ň: 'n',
    Ň: 'n',
    š: 's',
    Š: 's',
    ś: 's',
    Ś: 's',
    ž: 'z',
    Ž: 'z',
    ź: 'z',
    Ź: 'z',
    ż: 'z',
    Ż: 'z',
    č: 'c',
    Č: 'c',
    ć: 'c',
    Ć: 'c',
    ř: 'r',
    Ř: 'r',
    ď: 'd',
    Ď: 'd',
    đ: 'd',
    Đ: 'd',
    ť: 't',
    Ť: 't',
    ý: 'y',
    Ý: 'y',
    ÿ: 'y',
    ł: 'l',
    Ł: 'l',
    ß: 'ss',
    æ: 'ae',
    Æ: 'ae',
  }
  return input
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
