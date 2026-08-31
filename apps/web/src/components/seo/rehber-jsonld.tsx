import { SITE } from '@/lib/site'
import type { RehberYazisi } from '@/features/content/rehber'

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  REHBER YAZISI — YAPILANDIRILMIŞ VERİ
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  İki şema basılır:
 *
 *    Article   → Google'a bunun bir haber/blog değil, teknik bir rehber yazısı
 *                olduğunu söyler. Arama sonucunda başlık ve tarih gösterimini
 *                düzeltir.
 *    FAQPage   → Yazının SSS bölümünü makine tarafından okunabilir hâle getirir.
 *
 *  ── FAQPage HAKKINDA DÜRÜST NOT ────────────────────────────────────────────
 *  Google, FAQ zengin sonuçlarını (arama sonucundaki açılır soru-cevap
 *  kutuları) 7 Mayıs 2026'da TAMAMEN KALDIRDI. 2023'te yalnızca devlet ve
 *  sağlık sitelerine kısıtlanmıştı, 2026'da bütünüyle sonlandırıldı; Search
 *  Console raporu da Haziran 2026'da kapandı.
 *
 *  Yani bu şema Google'da artık görsel bir kazanç SAĞLAMIYOR. Yine de
 *  bırakılıyor, çünkü:
 *    · Google kullanılmayan yapısal verinin zarar vermediğini açıkça belirtti;
 *    · Bing ve DuckDuckGo FAQ işaretlemesini işlemeye devam ediyor;
 *    · Yapay zekâ tarayıcıları soru-cevap çiftlerini bu yapıdan daha temiz
 *      okuyor.
 *
 *  Asıl değer şemada değil, SAYFADA GÖRÜNEN SSS bölümünde: uzun kuyruk
 *  soruların ("hava filtresi temizlenir mi" gibi) metinde birebir karşılığını
 *  oluşturuyor ve öne çıkan snippet için aday hâle getiriyor.
 *
 *  ── UYDURULMAYAN ALANLAR ───────────────────────────────────────────────────
 *  `author`  : Organization olarak yazılıyor — yazıyı yazan gerçekten şirket.
 *              Var olmayan bir kişi adı UYDURULMUYOR.
 *  `datePublished` : YOK. Yazıların ilk yayın tarihi kayıt altında değil;
 *              tahmini bir tarih yazmak yanlış veri üretmek olur.
 *  `dateModified`  : YALNIZCA `guncelleme` alanı dolu olan yazılarda basılır.
 *  `aggregateRating` / `review` : YOK. Gerçek değerlendirme verisi olmadan
 *              eklemek Google'ın politikasına aykırı ve manuel işlem sebebi.
 *
 *  ── TEK KAYNAK KURALI ──────────────────────────────────────────────────────
 *  SSS bölümü aynı kaynaktan (`yazi.sss`) hem ekrana hem şemaya basılıyor;
 *  ikisi ayrışamaz. Yapısal veride olup sayfada olmayan içerik, hangi arama
 *  motoru olursa olsun politika ihlalidir.
 */
export function RehberJsonLd({ yazi, siteUrl }: { yazi: RehberYazisi; siteUrl: string }) {
  const url = `${siteUrl}/blog/${yazi.slug}`

  const article: Record<string, unknown> = {
    '@type': 'Article',
    '@id': `${url}#yazi`,
    headline: yazi.title,
    description: yazi.summary,
    inLanguage: 'tr-TR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: SITE.name, url: siteUrl },
    publisher: { '@id': `${siteUrl}/#kurulus` },
    image: `${siteUrl}/brand/og-kapak.png`,
  }

  // Tarih yalnızca GERÇEKTEN biliniyorsa yazılır.
  if (yazi.guncelleme) article.dateModified = yazi.guncelleme

  const graph: Array<Record<string, unknown>> = [article]

  if (yazi.sss && yazi.sss.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#sss`,
      mainEntity: yazi.sss.map((s) => ({
        '@type': 'Question',
        name: s.q,
        acceptedAnswer: { '@type': 'Answer', text: s.a },
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}
