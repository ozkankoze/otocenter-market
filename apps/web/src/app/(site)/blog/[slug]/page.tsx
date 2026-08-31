import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronDown, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose } from '@/components/layout/page-shell'
import { REHBER_YAZILARI, rehberBul } from '@/features/content/rehber'
import { RehberJsonLd } from '@/components/seo/rehber-jsonld'
import { Paragraf } from '@/features/content/paragraf'
import type { Crumb } from '@/components/ui/breadcrumb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type Props = { params: Promise<{ slug: string }> }

/** Yazılar statik; hepsi derleme anında üretilir. */
export function generateStaticParams() {
  return REHBER_YAZILARI.map((y) => ({ slug: y.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const yazi = rehberBul(slug)
  if (!yazi) return { title: 'Yazı bulunamadı' }
  return {
    /*
     * `metaTitle` varsa kök şablon (`'%s | Oto Center Market'`) ATLANIR —
     * çünkü o başlık marka adını zaten içeriyor; şablondan geçseydi marka adı
     * iki kez yazılırdı.
     */
    title: yazi.metaTitle ? { absolute: yazi.metaTitle } : yazi.title,
    description: yazi.summary,
    alternates: { canonical: `/blog/${yazi.slug}` },
    openGraph: {
      type: 'article',
      title: yazi.metaTitle ?? yazi.title,
      description: yazi.summary,
      url: `${SITE_URL}/blog/${yazi.slug}`,
      ...(yazi.guncelleme ? { modifiedTime: yazi.guncelleme } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const yazi = rehberBul(slug)
  if (!yazi) notFound()

  /*
   * Kenar çubuğu: yazının kendi seçtiği ilgili yazılar önce gelir, kalan yer
   * diğerleriyle doldurulur. Konu bazlı iç bağlantı, rastgele sıralamadan
   * hem kullanıcı hem arama motoru için daha değerli.
   */
  const secilenler = (yazi.ilgiliYazilar ?? [])
    .map((s) => REHBER_YAZILARI.find((y) => y.slug === s))
    .filter((y): y is NonNullable<typeof y> => Boolean(y))
  const digerleri = [
    ...secilenler,
    ...REHBER_YAZILARI.filter(
      (y) => y.slug !== yazi.slug && !secilenler.some((s) => s.slug === y.slug),
    ),
  ].slice(0, 3)
  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: yazi.title },
  ]

  return (
    <>
      <RehberJsonLd yazi={yazi} siteUrl={SITE_URL} />

      <PageHero eyebrow={yazi.tag} title={yazi.title} description={yazi.summary} crumbs={crumbs}>
        <p className="mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} aria-hidden="true" />
            {yazi.readMinutes} dakika okuma
          </span>
          {yazi.guncelleme ? (
            <span>
              Güncelleme:{' '}
              <time dateTime={yazi.guncelleme}>{tarihYaz(yazi.guncelleme)}</time>
            </span>
          ) : null}
        </p>
      </PageHero>

      <PageBody>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <article>
            <Prose>
              {/*
                Giriş paragrafları başlıksız gelir ve soruyu DOĞRUDAN cevaplar.
                Google öne çıkan snippet'i çoğunlukla sayfanın ilk net
                cevabından alır; cevabı üç başlık sonra vermek o şansı harcar.
              */}
              {yazi.intro?.map((p, i) => (
                <p
                  key={p.slice(0, 40)}
                  className={i === 0 ? 'text-[15.5px] font-medium text-ink-800' : undefined}
                >
                  <Paragraf metin={p} />
                </p>
              ))}

              {yazi.body.map((bolum) => (
                <section key={bolum.heading}>
                  <h2>{bolum.heading}</h2>
                  {bolum.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>
                      <Paragraf metin={p} />
                    </p>
                  ))}
                  {bolum.table ? (
                    /*
                      Tablo kendi kutusunda yatay kayar. Sayfanın gövdesi asla
                      yatay kaymaz — dar telefonda dört sütunlu bir tablo yoksa
                      bütün düzeni bozardı.
                    */
                    <div className="mb-4 overflow-x-auto rounded-lg border border-ink-100">
                      <table className="w-full border-collapse text-left text-[13px]">
                        <caption className="sr-only">{bolum.table.caption}</caption>
                        <thead>
                          <tr className="bg-ink-25">
                            {bolum.table.head.map((h) => (
                              <th
                                key={h}
                                scope="col"
                                className="border-b border-ink-100 px-3.5 py-2.5 text-[12px] font-semibold tracking-wide text-ink-900 uppercase"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bolum.table.rows.map((satir) => (
                            <tr key={satir[0]} className="border-b border-ink-50 last:border-0">
                              {satir.map((h, i) =>
                                i === 0 ? (
                                  <th
                                    key={h}
                                    scope="row"
                                    className="px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap text-ink-900"
                                  >
                                    {h}
                                  </th>
                                ) : (
                                  <td key={h} className="px-3.5 py-2.5 text-ink-600">
                                    {h}
                                  </td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                  {bolum.list ? (
                    <ul>
                      {bolum.list.map((m) => (
                        <li key={m.slice(0, 40)}>
                          <Paragraf metin={m} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {bolum.steps ? (
                    <ol>
                      {bolum.steps.map((m) => (
                        <li key={m.slice(0, 40)}>
                          <Paragraf metin={m} />
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </section>
              ))}
            </Prose>

            {/*
              SSS bölümü SAYFADA GÖRÜNÜR olmak ZORUNDA.
              Aynı veri FAQPage yapısal verisine de gidiyor; Google, şemadaki
              soru ve cevapların sayfada da bulunmasını şart koşuyor. Burası
              gizlenirse ya da şemadan ayrışırsa zengin sonuç reddedilir.
              Açılır-kapanır <details> kullanılıyor — içerik DOM'da her zaman
              var, yalnızca görsel olarak katlanmış.
            */}
            {yazi.sss && yazi.sss.length > 0 ? (
              <section className="mt-10" aria-labelledby="sss-baslik">
                <h2
                  id="sss-baslik"
                  className="mb-4 text-[17px] font-semibold text-ink-900"
                >
                  Sıkça sorulan sorular
                </h2>
                <div className="divide-y divide-ink-100 rounded-lg border border-ink-100">
                  {yazi.sss.map((s, i) => (
                    <details key={s.q} className="group px-4" open={i === 0}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[14px] font-semibold text-ink-900 marker:content-none">
                        <h3 className="text-[14px] font-semibold">{s.q}</h3>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <p className="pb-4 text-[13.5px] leading-relaxed text-ink-600">{s.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <Card className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-brand-50 p-5">
              <div>
                <b className="block text-sm font-semibold text-ink-900">
                  Aracınıza uyan ürünü görün
                </b>
                <p className="mt-1 text-[13px] text-ink-600">
                  Uyumluluk motor kodu seviyesinde doğrulanır.
                </p>
              </div>
              <Link
                href={yazi.relatedHref}
                prefetch={false}
                title={yazi.relatedLabel}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600 hover:underline"
              >
                {yazi.relatedLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Card>
          </article>

          <aside>
            <span className="ocm-eyebrow">Diğer yazılar</span>
            <div className="mt-4 space-y-3">
              {digerleri.map((y) => (
                <Link
                  key={y.slug}
                  href={`/blog/${y.slug}`}
                  prefetch={false}
                  title={`${y.title} — rehberi oku`}
                >
                  <Card interactive className="p-4">
                    <span className="text-[11px] font-semibold tracking-wider text-brand-600 uppercase">
                      {y.tag}
                    </span>
                    <b className="mt-1.5 block text-[14.5px] leading-snug font-semibold text-ink-900">
                      {y.title}
                    </b>
                    <p className="mt-1.5 line-clamp-2 text-[12.5px] text-ink-600">{y.summary}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </PageBody>
    </>
  )
}

/**
 * ISO tarihi Türkçe okunur biçime çevirir: 2026-08-31 → 31 Ağustos 2026.
 *
 * `Intl` yerine sabit dizi kullanılıyor: sunucu ile tarayıcının yerel ayarı
 * farklıysa `Intl` iki farklı metin üretir ve React hidrasyon uyuşmazlığı
 * hatası verir.
 */
const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]
function tarihYaz(iso: string): string {
  const parcalar = iso.split('-')
  const yil = Number(parcalar[0])
  const ay = Number(parcalar[1])
  const gun = Number(parcalar[2])
  const ayAdi = AYLAR[ay - 1]
  // Beklenmedik biçimde gelirse ham değeri göster — sayfa patlamasın.
  if (!ayAdi || Number.isNaN(yil) || Number.isNaN(gun)) return iso
  return `${gun} ${ayAdi} ${yil}`
}
