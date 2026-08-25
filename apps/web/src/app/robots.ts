import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/**
 * robots.txt — YOKTU.
 *
 * Dosya bulunmadığında arama motorları her şeyi taramaya çalışır; bu sitede
 * 28 binden fazla araç×kategori sayfası üretildiği için tarama bütçesi
 * yönetim paneline ve arama sonuçlarına harcanabiliyordu.
 *
 * Kapatılanlar:
 *   /admin  → yönetim paneli, dizine girmemeli
 *   /api    → veri uçları, sayfa değil
 *   /arama  → arama sonuçları ince ve yinelenen içerik üretir
 *             (sayfanın kendi metadata'sında da `robots: noindex` var)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/arama'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
