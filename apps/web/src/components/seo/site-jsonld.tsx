import { SITE } from '@/lib/site'

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  YAPILANDIRILMIŞ VERİ (schema.org) — site geneli
 * ════════════════════════════════════════════════════════════════════════════
 *  SEO denetimi "Yapılandırılmış veri bulunamadı" uyarısı veriyordu. Ürün
 *  sayfasında Product şeması ve tüm liste sayfalarında BreadcrumbList vardı;
 *  eksik olan SİTE DÜZEYİNDEKİ tanımlardı.
 *
 *  Üç şema veriliyor:
 *
 *    Organization  → arama sonucunda marka bilgi kutusu (logo, iletişim).
 *    WebSite       → SearchAction ile Google'ın site içi arama kutusu
 *                    gösterebilmesi. `/arama?q=` gerçek bir uç nokta.
 *    Store         → fiziksel adres ve çalışma saatleri; yerel aramada işe yarar.
 *
 *  UYDURMA ALAN YOK: vergi numarası, ticaret unvanı, kuruluş yılı, puan/yorum
 *  sayısı gibi doğrulayamadığımız hiçbir alan yazılmadı. `aggregateRating`
 *  özellikle yok — gerçek yorum verisi olmadan eklemek Google'ın yapılandırılmış
 *  veri politikasına aykırı ve manuel işlem sebebi.
 */
export function SiteJsonLd({ siteUrl }: { siteUrl: string }) {
  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#kurulus`,
    name: SITE.name,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/brand/oto-center-market-logo.png`,
      width: 926,
      height: 223,
    },
    image: `${siteUrl}/brand/og-kapak.png`,
    email: SITE.email,
    telephone: SITE.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.addressLines[0],
      addressLocality: SITE.district,
      addressRegion: SITE.city,
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+905078914728',
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: 'Turkish',
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#site`,
    url: siteUrl,
    name: SITE.name,
    inLanguage: 'tr-TR',
    publisher: { '@id': `${siteUrl}/#kurulus` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/arama?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const store = {
    '@type': 'Store',
    '@id': `${siteUrl}/#magaza`,
    name: SITE.name,
    url: siteUrl,
    image: `${siteUrl}/brand/og-kapak.png`,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    address: organization.address,
    priceRange: '₺₺',
    // "Hafta içi 09:00 – 18:00" — sitede duyurulan gerçek saatler.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [organization, website, store],
        }),
      }}
    />
  )
}
