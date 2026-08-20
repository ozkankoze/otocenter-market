import Link from 'next/link'
import { Logo, LOGO_HEIGHTS } from './logo'

const COLUMNS = [
  {
    title: 'Kurumsal',
    links: ['Hakkımızda', 'İletişim', 'Bayilik & Toptan', 'Kampanyalar', 'Blog'],
  },
  {
    title: 'Ürünler',
    links: ['Filtreler', 'Yağlar & Sıvılar', 'Otomobil', 'Hafif Ticari', 'Ağır Vasıta'],
  },
  {
    title: 'Müşteri Hizmetleri',
    links: ['Siparişlerim', 'Kargo & Teslimat', 'İade & Değişim', 'Sıkça Sorulan Sorular'],
  },
]

const LEGAL = ['KVKK', 'Gizlilik Politikası', 'Mesafeli Satış Sözleşmesi', 'Çerez Politikası']

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
          <div className="flex gap-2">
            {['f', 'in', 'ig', 'yt'].map((s) => (
              <span
                key={s}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/8 text-xs text-white"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3.5 text-[11.5px] font-semibold tracking-wider text-white uppercase">
              {col.title}
            </h3>
            <ul>
              {col.links.map((link) => (
                <li key={link} className="py-1 text-[13px]">
                  <span className="transition-colors hover:text-white">{link}</span>
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
            <li className="py-1">Adres satırı, İlçe / İl</li>
            <li className="py-1">0507 891 47 28</li>
            <li className="py-1">info@otocentermarket.com</li>
            <li className="py-1">Hafta içi 09:00 – 18:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="ocm-container flex flex-wrap items-center gap-5 py-4 text-[12.5px]">
          <span>© {new Date().getFullYear()} Oto Center Market</span>
          {LEGAL.map((l) => (
            <Link key={l} href="/" prefetch={false} className="transition-colors hover:text-white">
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
