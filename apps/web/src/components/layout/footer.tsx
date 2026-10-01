import Link from 'next/link'
import { Logo, LOGO_HEIGHTS } from './logo'
import { DIS_BAGLANTI_REL, SATICI, SITE } from '@/lib/site'
import type { MegaMenuData } from '@/server/catalog-queries'

/**
 * FOOTER.
 *
 * Buradaki her metin bir yere GİDER. Daha önce sütunlardaki başlıklar düz
 * `<span>` idi (tıklanamıyordu) ve alttaki hukuki metinler hepsi `/` adresine
 * bakıyordu — yani tıklayan kullanıcı ana sayfaya dönüyordu. Artık hepsi
 * gerçek sayfalara bağlı.
 *
 * Ürünler sütunu KATEGORİ ağacındaki gerçek slug'ları kullanır; araç grupları
 * araç tipi sayfalarına gider.
 */
type FooterLink = { label: string; href: string }

const COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'İletişim', href: '/iletisim' },
      { label: 'Bayilik & Toptan', href: '/bayilik-toptan' },
      { label: 'Kampanyalar', href: '/kampanyalar' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Müşteri Hizmetleri',
    links: [
      { label: 'Sipariş Takip', href: '/siparis-takip' },
      { label: 'Kargo & Teslimat', href: '/kargo-teslimat' },
      { label: 'İade & Değişim', href: '/iade-degisim' },
      { label: 'Sıkça Sorulan Sorular', href: '/sikca-sorulan-sorular' },
    ],
  },
]

const LEGAL: FooterLink[] = [
  { label: 'KVKK', href: '/kvkk' },
  { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
  { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
  { label: 'Çerez Politikası', href: '/cerez-politikasi' },
]

/**
 * "Ürünler" sütunu SABİT DEĞİL — mega menü verisinden geliyor.
 *
 * Elle yazıldığında ürünü olmayan bir grup (bugün "Yağlar & Sıvılar")
 * alt bilgide kalıyor ve kullanıcıyı boş bir sayfaya götürüyordu. Araç
 * grupları da aynı veriden, markası olanlarla sınırlı geliyor.
 */
function urunLinkleri(menu: MegaMenuData): FooterLink[] {
  return [
    ...menu.groups.map((g) => ({ label: g.name, href: `/${g.slug}` })),
    { label: 'Markalar', href: '/markalar' },
    ...menu.vehicleTypes
      .filter((t) => t.brandCount > 0)
      .map((t) => ({ label: t.name, href: `/${t.slug}` })),
  ]
}

export function Footer({ menu }: { menu: MegaMenuData }) {
  const columns: Array<{ title: string; links: FooterLink[] }> = [
    COLUMNS[0]!,
    { title: 'Ürünler', links: urunLinkleri(menu) },
    COLUMNS[1]!,
  ]

  return (
    <footer className="bg-brand-900 text-white/65">
      <div className="ocm-container grid gap-8 py-12 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <Logo height={LOGO_HEIGHTS.footer} />
          <p className="mt-4 mb-5 text-[13px] leading-relaxed">
            Otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri tedarik
            eden profesyonel e-ticaret platformu.
          </p>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            title={`WhatsApp'tan ${SITE.phoneDisplay} numarasına yazın`}
            rel={DIS_BAGLANTI_REL}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-white/10 px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-white/16"
          >
            WhatsApp ile yazın
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3.5 text-[11.5px] font-semibold tracking-wider text-white uppercase">
              {col.title}
            </h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.href} className="py-1 text-[13px]">
                  {/*
                    `title`: SEO denetimi "title etiketi olmayan linkler"
                    uyarısını footer için de veriyor. Metin bağlantı etiketini
                    tekrar etmiyor, sonuna ne olduğunu ekliyor — ekran okuyucu
                    için gereksiz yineleme olmasın diye.
                  */}
                  <Link
                    href={link.href}
                    prefetch={false}
                    title={`${link.label} sayfasına git`}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3.5 text-[11.5px] font-semibold tracking-wider text-white uppercase">
            İletişim
          </h3>
          <ul className="text-[13px]">
            <li className="py-1">
              <address className="not-italic">
                {SITE.addressLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </li>
            <li className="py-1">
              <a
                href={SITE.phoneHref}
                title={`${SITE.phoneDisplay} numarasını ara`}
                className="transition-colors hover:text-white"
              >
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="py-1">
              <a
                href={SITE.emailHref}
                title={`${SITE.email} adresine e-posta gönder`}
                className="transition-colors hover:text-white"
              >
                {SITE.email}
              </a>
            </li>
            <li className="py-1">{SITE.workingHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="ocm-container flex flex-wrap items-center gap-5 py-4 text-[12.5px]">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          {LEGAL.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              prefetch={false}
              title={`${l.label} metnini oku`}
              className="transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
        {/*
          Satıcı künyesi — 6563 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          satıcının unvanı, adresi ve MERSİS numarasının sitede kolayca
          ulaşılabilir olmasını istiyor; her sayfanın altında duruyor.
        */}
        <p className="ocm-container pb-4 text-[11.5px] leading-relaxed">
          {SATICI.unvan} · {SATICI.adres} · MERSİS {SATICI.mersisNo} · Vergi no {SATICI.vergiNo} (
          {SATICI.vergiDairesi})
        </p>
      </div>
    </footer>
  )
}
