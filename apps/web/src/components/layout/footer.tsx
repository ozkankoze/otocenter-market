import Link from 'next/link'
import { Logo, LOGO_HEIGHTS } from './logo'
import { SITE } from '@/lib/site'

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
    title: 'Ürünler',
    links: [
      { label: 'Filtreler', href: '/filtreler' },
      { label: 'Yağlar & Sıvılar', href: '/yaglar-sivilar' },
      { label: 'Markalar', href: '/markalar' },
      { label: 'Otomobil & Hafif Ticari', href: '/otomobil' },
      { label: 'Ağır Vasıta', href: '/agir-vasita' },
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

export function Footer() {
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
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-white/10 px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-white/16"
          >
            WhatsApp ile yazın
          </a>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3.5 text-[11.5px] font-semibold tracking-wider text-white uppercase">
              {col.title}
            </h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.href} className="py-1 text-[13px]">
                  <Link
                    href={link.href}
                    prefetch={false}
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
              <a href={SITE.phoneHref} className="transition-colors hover:text-white">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="py-1">
              <a href={SITE.emailHref} className="transition-colors hover:text-white">
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
              className="transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
