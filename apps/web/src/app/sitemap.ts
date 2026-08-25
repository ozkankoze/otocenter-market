import type { MetadataRoute } from 'next'
import { db } from '@ocm/db'
import { REHBER_YAZILARI } from '@/features/content/rehber'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  sitemap.xml — YOKTU
 * ════════════════════════════════════════════════════════════════════════════
 *  Site 28 binden fazla araç×kategori sayfası üretiyor ama hiçbiri arama
 *  motorlarına haritalanmıyordu. Bulunmanın önündeki en büyük engel buydu.
 *
 *  NE GİRİYOR
 *    · Sabit sayfalar (kurumsal, hukuki, blog)
 *    · Ürünü olan kategoriler
 *    · Satışta olan ürün markaları
 *    · Araç tipi → marka → model sayfaları
 *    · Ürün sayfaları (2.677)
 *
 *  NE GİRMİYOR — bilinçli
 *    · /admin, /api, /arama  → robots.txt'te de kapalı
 *    · Motor seviyesindeki araç×kategori sayfaları. Bunlar 28 binden fazla ve
 *      sitemap başına 50.000 URL / 50 MB sınırını zorluyor; dahası çoğu ince
 *      içerik. Model sayfaları zaten motorlara bağlantı veriyor, Google
 *      oradan tarayabiliyor. Ürün sayısı arttıkça bu karar yeniden gözden
 *      geçirilmeli (sitemap index'e bölmek gerekebilir).
 *    · Ürünü olmayan kategoriler — sitede de gösterilmiyorlar.
 *
 *  `lastModified` uydurulmuyor: ürünlerde gerçek `updated_at` kullanılıyor,
 *  bilinmeyen yerlerde alan hiç yazılmıyor.
 */
export const revalidate = 3600 // saatte bir tazelenir

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [kategoriler, markalar, turler, aracMarkalari, modeller, urunler] = await Promise.all([
    // Ürünü olan kategoriler (kendisinde ya da alt ağacında)
    db
      .selectFrom('category as c')
      .leftJoin('category as p', 'p.id', 'c.parent_id')
      .select(['c.slug', 'c.path', 'p.slug as parent_slug'])
      .where('c.is_active', '=', true)
      .execute(),
    db
      .selectFrom('product_brand as b')
      .innerJoin('product as p', (j) =>
        j.onRef('p.brand_id', '=', 'b.id').on('p.status', '=', 'ACTIVE'),
      )
      .select('b.slug')
      .where('b.is_active', '=', true)
      .groupBy('b.slug')
      .execute(),
    db.selectFrom('vehicle_type').select('slug').where('is_active', '=', true).execute(),
    db
      .selectFrom('vehicle_brand as b')
      .innerJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
      .innerJoin('vehicle_type as t', 't.id', 'bt.type_id')
      .select(['b.slug', 't.slug as type_slug'])
      .where('b.is_active', '=', true)
      .where('t.is_active', '=', true)
      .execute(),
    db
      .selectFrom('vehicle_model as m')
      .innerJoin('vehicle_brand as b', 'b.id', 'm.brand_id')
      .innerJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
      .innerJoin('vehicle_type as t', 't.id', 'bt.type_id')
      .select(['m.slug', 'b.slug as brand_slug', 't.slug as type_slug'])
      .where('m.is_active', '=', true)
      .where('b.is_active', '=', true)
      .where('t.is_active', '=', true)
      .execute(),
    db
      .selectFrom('product')
      .select(['slug', 'updated_at'])
      .where('status', '=', 'ACTIVE')
      .execute(),
  ])

  // Kategori ağacındaki ürün sayısı — boş kategoriler haritaya girmesin.
  const sayimlar = await db
    .selectFrom('product as p')
    .innerJoin('category as c', 'c.id', 'p.category_id')
    .select(({ fn }) => ['c.path', fn.countAll<string>().as('n')])
    .where('p.status', '=', 'ACTIVE')
    .groupBy('c.path')
    .execute()
  const doluMu = (path: string): boolean =>
    sayimlar.some((s) => s.path === path || s.path.startsWith(`${path}.`))

  /*
   * `yol === '/'` için son eğik çizgi ATILIR.
   *
   * Ana sayfanın canonical etiketi Next.js tarafından
   * "https://otocentermarket.com" olarak yazılıyor (eğik çizgisiz — çerçeve
   * `trailingSlash: false` iken kırpıyor, mutlak URL verilse bile). Sitemap
   * burada "…/.com/" yazınca aynı sayfa iki farklı dizgeyle bildirilmiş
   * oluyordu; denetim aracı bunu "canonical riski / sinyal çakışması" diye
   * işaretliyordu. İki sinyal tek biçime sabitlendi.
   */
  const u = (yol: string, priority: number, changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly') => ({
    url: yol === '/' ? SITE_URL : `${SITE_URL}${yol}`,
    changeFrequency,
    priority,
  })

  const sabitler: MetadataRoute.Sitemap = [
    u('/', 1.0, 'daily'),
    u('/markalar', 0.8, 'weekly'),
    u('/kampanyalar', 0.6, 'weekly'),
    u('/hakkimizda', 0.5, 'monthly'),
    u('/iletisim', 0.5, 'monthly'),
    u('/bayilik-toptan', 0.5, 'monthly'),
    u('/blog', 0.5, 'weekly'),
    u('/siparis-takip', 0.3, 'monthly'),
    u('/kargo-teslimat', 0.4, 'monthly'),
    u('/iade-degisim', 0.4, 'monthly'),
    u('/sikca-sorulan-sorular', 0.4, 'monthly'),
    u('/kvkk', 0.2, 'yearly'),
    u('/gizlilik-politikasi', 0.2, 'yearly'),
    u('/mesafeli-satis-sozlesmesi', 0.2, 'yearly'),
    u('/cerez-politikasi', 0.2, 'yearly'),
    ...REHBER_YAZILARI.map((y) => u(`/blog/${y.slug}`, 0.5, 'monthly')),
  ]

  return [
    ...sabitler,
    ...kategoriler
      .filter((c) => doluMu(c.path))
      .map((c) => u(c.parent_slug ? `/${c.parent_slug}/${c.slug}` : `/${c.slug}`, 0.8, 'weekly')),
    ...markalar.map((b) => u(`/markalar/${b.slug}`, 0.7, 'weekly')),
    ...turler.map((t) => u(`/${t.slug}`, 0.7, 'weekly')),
    ...aracMarkalari.map((b) => u(`/${b.type_slug}/${b.slug}`, 0.6, 'weekly')),
    ...modeller.map((m) => u(`/${m.type_slug}/${m.brand_slug}/${m.slug}`, 0.5, 'monthly')),
    ...urunler.map((p) => ({
      url: `${SITE_URL}/urun/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
