/**
 * Araç ağacı gibi YAVAŞ DEĞİŞEN ama DEĞİŞTİĞİNDE HEMEN GÖRÜLMESİ GEREKEN
 * uç noktalar için önbellek başlıkları.
 *
 * NEDEN `max-age=0` + `s-maxage`:
 * Önceden `public, max-age=600` gönderiliyordu. Bu, yanıtı TARAYICIDA 10 dakika
 * dondurur; araç ağacı içe aktarıldıktan sonra kullanıcı eski marka/model
 * listesini görmeye devam eder ve sayfayı yenilemek bile yetmez (yalnızca
 * hard refresh temizler). Kategori sayfaları sunucuda üretildiği için güncel
 * görünür — ortaya "bir yerde yeni, bir yerde eski" gibi anlaşılması zor bir
 * tutarsızlık çıkar.
 *
 * Yeni davranış:
 *   max-age=0, must-revalidate → tarayıcı her seferinde sunucuya sorar (ucuz;
 *                                 değişmediyse 304 döner)
 *   s-maxage=<saniye>          → CDN / paylaşımlı önbellek yükü taşımaya
 *                                 devam eder
 *   stale-while-revalidate     → CDN süresi dolsa da yanıt anında verilir,
 *                                 tazeleme arka planda yapılır
 *
 * Geliştirme ortamında önbellek tamamen kapatılır; aksi hâlde seed/import
 * sonrası "neden değişmedi?" sorusu tekrar eder.
 */
export function catalogCacheHeaders(sMaxAgeSeconds: number): Record<string, string> {
  if (process.env.NODE_ENV !== 'production') {
    return { 'Cache-Control': 'no-store' }
  }
  return {
    'Cache-Control':
      `public, max-age=0, must-revalidate, ` +
      `s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=${sMaxAgeSeconds * 6}`,
  }
}
