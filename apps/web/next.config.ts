import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // packages/db workspace'i Next tarafından derlenir
  transpilePackages: ['@ocm/db'],

  experimental: {
    // Prisma client'ı server bundle'ında dışarıda tut
    optimizePackageImports: ['lucide-react'],
  },
  serverExternalPackages: ['@prisma/client', '.prisma/client'],

  /* ══════════════════════════════════════════════════════════════════════════
     METADATA'YI TARAYICILAR İÇİN <head>'E SABİTLE

     TEŞHİS (ölçüldü, tahmin değil)
     Next.js 15, dinamik render edilen sayfalarda `<title>`, `<meta
     name="description">` ve `<link rel="canonical">` etiketlerini <head>'e
     DEĞİL, gövdenin sonuna akıtıyor; React bunları hidrasyon sırasında
     JavaScript ile <head>'e taşıyor. Sitede ölçülen durum:

         /            desc: GÖVDE   canonical: GÖVDE
         /hakkimizda  desc: GÖVDE   canonical: GÖVDE
         /kvkk        desc: GÖVDE   canonical: GÖVDE
         /markalar    desc: GÖVDE   canonical: GÖVDE

     JavaScript çalıştıran bir tarayıcı için sorun yok. JavaScript
     ÇALIŞTIRMAYAN bir istemci — SEO denetim araçlarının çoğu, sosyal medya
     önizleme robotları, basit tarayıcılar — <head>'i boş görüyor ve
     "başlık yok / açıklama yok / canonical bulunamadı" diyor. Denetimdeki
     canonical uyarısı da buradan geliyordu: etiket vardı, ama araç onu
     hiç görmüyordu.

     ÇÖZÜM
     `htmlLimitedBots`, Next.js'e "bu istemciler akışı bekleyemez, metadata'yı
     bloklayarak <head>'e yaz" der. Next'in varsayılan listesi yalnızca birkaç
     sosyal medya robotunu içeriyor; Googlebot ve SEO araçları listede yok.
     Aşağıdaki desen varsayılanı korur ve üzerine ekler.

     Maliyet: yalnızca EŞLEŞEN istemci için metadata beklenir. Gerçek
     kullanıcının tarayıcısı desene uymaz, akış davranışı aynı kalır — yani
     sayfa hızından hiçbir şey kaybedilmez.
     ══════════════════════════════════════════════════════════════════════ */
  htmlLimitedBots:
    /Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Googlebot|Google-InspectionTool|AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|SeznamBot|Screaming Frog|SiteAuditBot|serpstatbot|DataForSeoBot|BLEXBot|Barkrowler|GPTBot|ClaudeBot|PerplexityBot|CCBot|Lighthouse|Chrome-Lighthouse|PageSpeed|HeadlessChrome|bot|crawler|crawling|spider|curl|wget|python-requests|node-fetch|Go-http-client/i,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default nextConfig
