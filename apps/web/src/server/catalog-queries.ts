import 'server-only'
import { unstable_cache } from 'next/cache'
import { db, sql } from '@ocm/db'
import type { CompatibilityState } from '@/features/vehicle/types'
import type { ProductCardData } from '@/features/catalog/product-types'

export type CategoryCard = {
  id: number
  code: string
  name: string
  slug: string
  /** Kanonik yol: /{ust-kategori}/{kategori} */
  href: string
  icon: string | null
  productCount: number
  /** Araç seçiliyse: bu kategoride kaç uyumlu ürün var */
  compatibleCount: number | null
}

export type { ProductCardData }

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  BOŞ KATEGORİ GÖSTERİLMEZ
 * ══════════════════════════════════════════════════════════════════════════
 *  Katalogda henüz ürünü olmayan kategoriler var (Hidrolik Filtreler ve
 *  "Yağlar & Sıvılar" grubunun tamamı: Motor Yağları, Antifriz, Fren
 *  Hidroliği, AdBlue). Bunlar menüde, ana sayfa kartlarında ve alt bilgide
 *  görünüyor, tıklayan kullanıcıyı "bu kategoriye henüz ürün eklenmemiştir"
 *  diyen boş bir sayfaya götürüyordu.
 *
 *  Kural: bir kategori, KENDİSİNDE ya da ALT KATEGORİLERİNDE en az bir aktif
 *  ürün varsa gösterilir. Alt ağaç sayımı şart — "Filtreler" kök kategorisinin
 *  doğrudan hiç ürünü yok, 2.677 ürünün tamamı alt kategorilerinde.
 *
 *  Kategori kaydı SİLİNMEZ, pasife de çekilmez: ürün girildiği anda
 *  kendiliğinden geri gelir. Adrese doğrudan gidilirse sayfa yine açılır;
 *  yalnızca navigasyonda görünmez.
 */

/** Ana sayfa kategori kartları. Araç seçiliyse uyumlu ürün sayısı da gelir. */
export async function getCategoryCards(engineId: number | null): Promise<CategoryCard[]> {
  const categories = await db
    .selectFrom('category as c')
    .leftJoin('category as parent', 'parent.id', 'c.parent_id')
    .leftJoin('product as p', (join) =>
      join.onRef('p.category_id', '=', 'c.id').on('p.status', '=', 'ACTIVE'),
    )
    .select(({ fn }) => [
      'c.id',
      'c.code',
      'c.name',
      'c.slug',
      'c.icon',
      'parent.slug as parent_slug',
      fn.count<string>('p.id').as('product_count'),
    ])
    .where('c.parent_id', 'is not', null)
    .where('c.is_active', '=', true)
    .groupBy(['c.id', 'c.code', 'c.name', 'c.slug', 'c.icon', 'c.sort_order', 'parent.slug'])
    .orderBy('c.sort_order')
    .execute()

  let compatible = new Map<number, number>()
  if (engineId) {
    const rows = await db
      .selectFrom('engine_category_index')
      .select(['category_id', 'product_count'])
      .where('engine_id', '=', engineId)
      .execute()
    compatible = new Map(rows.map((r) => [r.category_id, r.product_count]))
  }

  return categories
    .map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      slug: c.slug,
      href: c.parent_slug ? `/${c.parent_slug}/${c.slug}` : `/${c.slug}`,
      icon: c.icon,
      productCount: Number(c.product_count),
      compatibleCount: engineId ? (compatible.get(c.id) ?? 0) : null,
    }))
    // Boş kategori kartı gösterilmez (bkz. yukarıdaki not). Burada alt ağaç
    // sayımına gerek yok: sorgu zaten yalnızca alt kategorileri getiriyor.
    .filter((c) => c.productCount > 0)
}

/**
 * Ana sayfa ürün listesi.
 *
 * Araç seçiliyse:
 *   · yalnızca VERIFIED/SOURCED olanlar 'compatible' işaretlenir
 *   · CONFLICTED kayıtlar 'unknown' döner (ASLA yeşil rozet almaz)
 *   · INCOMPATIBLE kayıtlar listenin sonuna alınır
 */
export async function getProducts(options: {
  engineId?: number | null
  limit?: number
  featuredOnly?: boolean
}): Promise<ProductCardData[]> {
  const { engineId = null, limit = 8, featuredOnly = false } = options

  const rows = await sql<{
    id: number
    sku: string
    slug: string
    name: string
    product_code: string | null
    brand_name: string
    brand_slug: string
    category_code: string
    category_name: string
    price_net: number
    tax_rate: number
    list_price: number | null
    quantity: number
    lead_time_days: number | null
    compat_status: string | null
    restriction: string | null
    specs: Record<string, unknown> | null
    spec_labels: Array<{ key: string; label: string; unit: string | null }> | null
    image_url: string | null
  }>`
    SELECT p.id, p.sku, p.slug, p.name, p.product_code, p.specs,
           b.name AS brand_name, b.slug AS brand_slug,
           c.code AS category_code, c.name AS category_name,
           pr.price_net, pr.tax_rate, pr.list_price,
           coalesce(st.quantity, 0) AS quantity, st.lead_time_days,
           pc.status::text AS compat_status,
           pc.restriction,
           (
             SELECT jsonb_agg(jsonb_build_object('key', ca.key, 'label', ca.label, 'unit', ca.unit)
                              ORDER BY ca.sort_order)
             FROM category_attribute ca
             WHERE ca.category_id = p.category_id AND ca.is_facet
           ) AS spec_labels,
           (
             SELECT pi.url FROM product_image pi
             WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order, pi.id
             LIMIT 1
           ) AS image_url
    FROM product p
    JOIN product_brand b ON b.id = p.brand_id
    JOIN category c      ON c.id = p.category_id
    LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
    LEFT JOIN price pr   ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
    LEFT JOIN stock st   ON st.variant_id = v.id
    LEFT JOIN product_compatibility pc
           ON pc.product_id = p.id
          AND pc.engine_id = ${engineId}::bigint
    WHERE p.status = 'ACTIVE'
      AND (${featuredOnly}::boolean = false OR p.is_featured)
      AND (${engineId}::bigint IS NULL
           OR pc.status IN ('VERIFIED','SOURCED','CONFLICTED','INCOMPATIBLE'))
    ORDER BY
      CASE
        WHEN pc.status IN ('VERIFIED','SOURCED') THEN 0
        WHEN pc.status = 'CONFLICTED'            THEN 1
        WHEN pc.status = 'INCOMPATIBLE'          THEN 3
        ELSE 2
      END,
      -- kısıtsız uyumluluk, kısıtlıdan önce
      (pc.restriction IS NOT NULL),
      p.is_featured DESC,
      p.sort_weight,
      p.id
    LIMIT ${limit}
  `.execute(db)

  return rows.rows.map((r) => {
    let compatibility: CompatibilityState = 'unknown'
    if (engineId) {
      if (r.compat_status === 'VERIFIED' || r.compat_status === 'SOURCED') {
        compatibility = 'compatible'
      } else if (r.compat_status === 'INCOMPATIBLE') {
        compatibility = 'incompatible'
      }
      // CONFLICTED ve null → 'unknown' (bilinçli: yanlış güven verme)
    }

    const gross = r.price_net ? Math.round(r.price_net * (1 + r.tax_rate / 100) * 100) / 100 : 0

    // Kartta en fazla 2 teknik özellik — kalabalık yapmadan "teknik katalog" hissi
    const specs: Array<{ label: string; value: string }> = []
    for (const def of r.spec_labels ?? []) {
      const raw = r.specs?.[def.key]
      if (raw === undefined || raw === null || raw === '') continue
      const value = typeof raw === 'boolean' ? (raw ? 'Var' : 'Yok') : String(raw)
      specs.push({ label: def.label, value: def.unit ? `${value} ${def.unit}` : value })
      if (specs.length === 2) break
    }

    return {
      id: r.id,
      sku: r.sku,
      slug: r.slug,
      name: r.name,
      productCode: r.product_code,
      brandName: r.brand_name,
      brandSlug: r.brand_slug,
      categoryCode: r.category_code,
      categoryName: r.category_name,
      imageUrl: r.image_url,
      price: gross,
      listPrice: r.list_price,
      stock: r.quantity,
      leadTimeDays: r.lead_time_days,
      compatibility,
      restriction: r.restriction,
      specs,
    }
  })
}

/*
 * `getFeaturedBrands` KALDIRILDI.
 *
 * Markaları `product_brand.is_featured` bayrağına göre listeliyordu; bu bayrak
 * ürünü olmayan kayıtlarda da açık olduğu için vitrinde satılmayan markalar
 * (BOSCH, MAHLE, PURFLUX …) görünüyor ve tıklayan kullanıcı boş sayfaya
 * düşüyordu. Yerine `server/brand-queries.ts` içindeki `getSellingBrands()`
 * kullanılıyor: liste doğrudan aktif ürün sayısından türetilir.
 */

/** Mega menü içeriği — gerçek kategori ağacı, ürün sayıları ve araç tipleriyle. */
export type MegaMenuData = {
  groups: Array<{
    code: string
    name: string
    slug: string
    children: Array<{ name: string; slug: string; productCount: number }>
  }>
  vehicleTypes: Array<{ name: string; slug: string; brandCount: number }>
  popularBrands: Array<{ name: string; slug: string }>
}

/**
 * Mega menü verisi HER SAYFADA, HER İSTEKTE çekiliyordu — dört ayrı sorgu.
 *
 * İçeriği kullanıcıya göre değişmiyor: kategori ağacı, ürün sayıları ve araç
 * tipleri herkes için aynı. Yerelde maliyeti görünmezdi (sorgu ~0,3 ms), ama
 * canlıda veritabanı uzakta: her sorgu ~89 ms gidiş-dönüş. Yani her sayfa
 * açılışı, hiç değişmeyen bir menü için yüz milisaniyelerce bekliyordu.
 *
 * Katalog yalnızca içe aktarma çalıştığında değişir; 5 dakikalık pencere
 * kullanıcı için görünmez, sunucu için büyük fark.
 */
export const getMegaMenuData = unstable_cache(getMegaMenuDataHam, ['ocm-mega-menu'], {
  revalidate: 300,
  tags: ['katalog'],
})

async function getMegaMenuDataHam(): Promise<MegaMenuData> {
  const [categories, counts, types, brands] = await Promise.all([
    db
      .selectFrom('category')
      .select(['id', 'parent_id', 'code', 'name', 'slug', 'sort_order'])
      .where('is_active', '=', true)
      .orderBy('sort_order')
      .execute(),
    db
      .selectFrom('product')
      .select(({ fn }) => ['category_id', fn.countAll<string>().as('count')])
      .where('status', '=', 'ACTIVE')
      .groupBy('category_id')
      .execute(),
    db
      .selectFrom('vehicle_type as t')
      .leftJoin('vehicle_brand_type as bt', 'bt.type_id', 't.id')
      .select(({ fn }) => ['t.name', 't.slug', fn.count<string>('bt.brand_id').as('brand_count')])
      .where('t.is_active', '=', true)
      .groupBy(['t.id', 't.name', 't.slug', 't.sort_order'])
      .orderBy('t.sort_order')
      .execute(),
    db
      .selectFrom('vehicle_brand')
      .select(['name', 'slug'])
      .where('is_active', '=', true)
      .where('is_popular', '=', true)
      .orderBy('name')
      .limit(6)
      .execute(),
  ])

  const countMap = new Map(counts.map((c) => [c.category_id, Number(c.count)]))

  const groups = categories
    .filter((c) => c.parent_id === null)
    .map((root) => ({
      code: root.code,
      name: root.name,
      slug: root.slug,
      /** Kökün kendi doğrudan ürünü — grup boş mu kararında kullanılır. */
      ownCount: countMap.get(root.id) ?? 0,
      children: categories
        .filter((c) => c.parent_id === root.id)
        .map((c) => ({
          name: c.name,
          slug: c.slug,
          productCount: countMap.get(c.id) ?? 0,
        }))
        // Ürünü olmayan alt kategori menüde görünmez.
        .filter((c) => c.productCount > 0),
    }))
    /*
     * Alt kategorisi kalmayan ve kendi ürünü de olmayan grup tamamen düşer.
     * "Yağlar & Sıvılar" bugün böyle: dört alt kategorisinin dördü de boş,
     * grubun kendisinin de doğrudan ürünü yok. Grubu menüde bırakmak,
     * kullanıcıyı boş bir sayfaya götüren bir başlık bırakmak demekti.
     */
    .filter((g) => g.children.length > 0 || g.ownCount > 0)
    .map((g) => ({ code: g.code, name: g.name, slug: g.slug, children: g.children }))

  return {
    groups,
    vehicleTypes: types.map((t) => ({
      name: t.name,
      slug: t.slug,
      brandCount: Number(t.brand_count),
    })),
    popularBrands: brands,
  }
}

/** Mega menü içeriği — kategori ağacı. */
export async function getMenuTree(): Promise<
  Array<{
    code: string
    name: string
    slug: string
    children: Array<{ name: string; slug: string }>
  }>
> {
  const rows = await db
    .selectFrom('category')
    .select(['id', 'parent_id', 'code', 'name', 'slug', 'sort_order'])
    .where('is_active', '=', true)
    .orderBy('sort_order')
    .execute()

  const roots = rows.filter((r) => r.parent_id === null)
  return roots.map((root) => ({
    code: root.code,
    name: root.name,
    slug: root.slug,
    children: rows
      .filter((r) => r.parent_id === root.id)
      .map((r) => ({ name: r.name, slug: r.slug })),
  }))
}
