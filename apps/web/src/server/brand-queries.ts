import 'server-only'
import { unstable_cache } from 'next/cache'
import { db } from '@ocm/db'

/**
 * ÜRÜN MARKALARI — yalnızca GERÇEKTEN SATILAN markalar.
 *
 * `product_brand` tablosunda kurulum sırasında açılmış, henüz ürünü olmayan
 * marka kayıtları da var (BOSCH, MAHLE, PURFLUX, HENGST, …). Bunlar vitrinde
 * gösterilirse kullanıcı tıklar ve boş bir sayfayla karşılaşır.
 *
 * Bu yüzden marka listesi HER YERDE aktif ürün sayısından türetilir:
 * ürünü olmayan marka listelenmez. Ayrı bir "gösterilecek markalar" listesi
 * tutulmaz — böylece katalog değiştiğinde vitrin kendiliğinden doğru kalır.
 */
export type SellingBrand = {
  id: number
  name: string
  slug: string
  productCount: number
  /** Markanın ürün verdiği kategoriler — kart altındaki özet satırı için. */
  categories: string[]
}

export async function getSellingBrands(): Promise<SellingBrand[]> {
  const rows = await db
    .selectFrom('product_brand as b')
    .innerJoin('product as p', (join) =>
      join.onRef('p.brand_id', '=', 'b.id').on('p.status', '=', 'ACTIVE'),
    )
    .innerJoin('category as c', 'c.id', 'p.category_id')
    .select(({ fn }) => [
      'b.id',
      'b.name',
      'b.slug',
      'c.name as category_name',
      'c.sort_order as category_sort',
      fn.countAll<string>().as('count'),
    ])
    .where('b.is_active', '=', true)
    .groupBy(['b.id', 'b.name', 'b.slug', 'c.name', 'c.sort_order'])
    .orderBy('b.name')
    .orderBy('c.sort_order')
    .execute()

  const byBrand = new Map<number, SellingBrand>()
  for (const r of rows) {
    const mevcut = byBrand.get(r.id)
    if (mevcut) {
      mevcut.productCount += Number(r.count)
      mevcut.categories.push(r.category_name)
    } else {
      byBrand.set(r.id, {
        id: r.id,
        name: r.name,
        slug: r.slug,
        productCount: Number(r.count),
        categories: [r.category_name],
      })
    }
  }

  return [...byBrand.values()].sort((a, b) => b.productCount - a.productCount)
}

/** Marka detay sayfası için — ürünü olmayan marka `null` döner (404). */
export async function getSellingBrandBySlug(slug: string): Promise<SellingBrand | null> {
  const brands = await getSellingBrands()
  return brands.find((b) => b.slug === slug) ?? null
}

/**
 * Önbellekli sürüm — vitrin ve /markalar sayfası için.
 *
 * `getSellingBrands` iki tabloyu join edip ürün sayıyor; sonuç yalnızca
 * içe aktarma çalıştığında değişir. Canlıda veritabanı uzakta (Neon,
 * ~89 ms gidiş-dönüş) ve ana sayfa her istekte yeniden çiziliyor —
 * yani bu sorgu her ziyaretçi için tekrar ediyordu.
 *
 * Anahtar ve etiket mega menüyle aynı ailede: `db:katalog-yenile`
 * çalıştığında `katalog` etiketi hepsini birden düşürür.
 */
export const getSellingBrandsCached = unstable_cache(getSellingBrands, ['ocm-satistaki-markalar'], {
  revalidate: 300,
  tags: ['katalog'],
})
