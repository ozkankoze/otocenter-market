import { Package, ShieldCheck, Check, Lock, Truck, MessageCircle } from 'lucide-react'

const FEATURES = [
  {
    icon: Package,
    title: 'Geniş Ürün Yelpazesi',
    text: 'Otomobil, hafif ticari ve ağır vasıta için filtre, yağ ve bakım ürünleri tek katalogda.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenilir Markalar',
    text: 'Yalnızca yetkili distribütör kanalından tedarik edilen orijinal ve muadil ürünler.',
  },
  {
    icon: Check,
    title: 'Doğru Araç Uyumluluğu',
    text: 'Her ürün motor seviyesinde eşleştirilir. Uyumluluk doğrulanmadıysa açıkça belirtilir.',
  },
  {
    icon: Lock,
    title: 'Güvenli Ödeme',
    text: '3D Secure destekli sanal POS, kredi kartına taksit ve havale seçenekleri.',
  },
  {
    icon: Truck,
    title: 'Hızlı Kargo',
    text: "Saat 16:00'ya kadar verilen stoklu siparişler aynı gün kargoya teslim edilir.",
  },
  {
    icon: MessageCircle,
    title: 'Profesyonel Destek',
    text: 'Parça seçiminde tereddüt ederseniz teknik ekibimiz şasi numarasıyla doğrulama yapar.',
  },
]

export function TrustFeatures() {
  return (
    <section className="border-y border-ink-100 bg-white py-14">
      <div className="ocm-container">
        <h2 className="mb-7 text-[21px] font-semibold text-ink-900 md:text-[25px]">
          Neden Oto Center Market?
        </h2>
        <div className="grid gap-x-10 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <span>
                <b className="mb-1 block text-sm font-semibold text-ink-900">{title}</b>
                <p className="text-[13px] leading-relaxed text-ink-600">{text}</p>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
