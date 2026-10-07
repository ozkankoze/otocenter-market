import 'server-only'
import { db, normalizeCode, sql } from '@ocm/db'
import type { CompatibilityState } from '@/features/vehicle/types'
import type { ProductCardData } from '@/features/catalog/product-types'
import {
  SORT_OPTIONS,
  EMPTY_FILTERS,
  type SortKey,
  type ListingFilters,
  type FacetValue,
  type ListingFacets,
  type ListingResult,
} from '@/features/catalog/listing-types'

// ─────────────────────────────── TİPLER ─────────────────────────────────────
// Client bileşenleri de kullandığı için listeleme tipleri
// `@/features/catalog/listing-types` içinde tutulur ve buradan yeniden dışa aktarılır.

export {
  SORT_OPTIONS,
  EMPTY_FILTERS,
  type SortKey,
  type ListingFilters,
  type FacetValue,
  type ListingFacets,
  type ListingResult,
}

export type CategoryNode = {
  id: number
  code: string
  name: string
  slug: string
  path: string
  parentId: number | null
  parentName: string | null
  parentSlug: string | null
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoIntro: string | null
  children: Array<{ id: number; name: string; slug: string; productCount: number }>
}

// ──────────────────────────── KATEGORİ ÇÖZÜMLEME ────────────────────────────

export async function getCategoryBySlug(slug: string): Promise<CategoryNode | null> {
  const row = await db
    .selectFrom('category as c')
    .leftJoin('category as p', 'p.id', 'c.parent_id')
    .select([
      'c.id',
      'c.code',
      'c.name',
      'c.slug',
      'c.path',
      'c.parent_id',
      'c.description',
      'c.seo_title',
      'c.seo_description',
      'c.seo_intro',
      'p.name as parent_name',
      'p.slug as parent_slug',
    ])
    .where('c.slug', '=', slug)
    .where('c.is_active', '=', true)
    .executeTakeFirst()

  if (!row) return null

  const children = await db
    .selectFrom('category as c')
    .leftJoin('product as pr', (join) =>
      join.onRef('pr.category_id', '=', 'c.id').on('pr.status', '=', 'ACTIVE'),
    )
    .select(({ fn }) => ['c.id', 'c.name', 'c.slug', fn.count<string>('pr.id').as('product_count')])
    .where('c.parent_id', '=', row.id)
    .where('c.is_active', '=', true)
    .groupBy(['c.id', 'c.name', 'c.slug', 'c.sort_order'])
    .orderBy('c.sort_order')
    .execute()

  return {
    id: row.id,
    code: row.code,
    name: row.name,
    slug: row.slug,
    path: row.path,
    parentId: row.parent_id,
    parentName: row.parent_name,
    parentSlug: row.parent_slug,
    description: row.description,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoIntro: row.seo_intro,
    // Boş alt kategori, kategori sayfasındaki gezinme şeridinde gösterilmez —
    // tıklayan kullanıcıyı boş listeye götürüyordu.
    children: children
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        productCount: Number(c.product_count),
      }))
      .filter((c) => c.productCount > 0),
  }
}

/** Kategori ve tüm alt kategorilerinin kimlikleri (materialized path üzerinden). */
async function categoryScope(categoryId: number, path: string): Promise<number[]> {
  const rows = await db
    .selectFrom('category')
    .select('id')
    .where((eb) => eb.or([eb('id', '=', categoryId), eb('path', 'like', `${path}.%`)]))
    .execute()
  return rows.map((r) => r.id)
}

// ─────────────────────────────── LİSTELEME ──────────────────────────────────

/**
 * Kategori listeleme sorgusu.
 *
 * Uyumluluk kuralları Sprint 1–2 ile BİREBİR aynı:
 *   VERIFIED / SOURCED → 'compatible'
 *   CONFLICTED / kayıt yok → 'unknown'   (asla yeşil gösterilmez)
 *   INCOMPATIBLE → 'incompatible'
 */
export type ListingScope = {
  /** Kategori kapsamı (kategori sayfaları) */
  category?: { id: number; path: string }
  /**
   * Ürün markası kapsamı (marka sayfaları: /markalar/[slug]).
   * Kullanıcının seçtiği marka FİLTRESİNDEN ayrıdır: bu, sayfanın kapsamıdır
   * ve filtre panelinden kaldırılamaz.
   */
  brandId?: number
  /** Serbest metin araması (arama sayfası) — ürün adı, kod, SKU ve OEM numarası. */
  query?: string
  /** Seçili araç motoru — uyumluluk rozetleri için */
  engineId: number | null
  /**
   * true ise liste MOTOR kapsamlıdır: yalnızca o motora uyumlu (VERIFIED/SOURCED)
   * ürünler listelenir. Araç sonuç sayfaları bunu kullanır.
   */
  engineScoped?: boolean
}

/**
 * ARAMA KOŞULU — ürün adı, parça kodu, SKU ve OEM/çapraz numara.
 *
 * Üç ayrı yol denenir çünkü kullanıcı üç farklı şey yazıyor olabilir:
 *   • "hava filtresi"  → adda/kısa açıklamada tam metin araması (search_vector)
 *   • "AP179/2"        → parça kodu; normalleştirilerek karşılaştırılır
 *                        (ocm_normalize_code noktalama ve boşluğu atar)
 *   • "1F0129620"      → OEM ya da çapraz numara; product_reference üzerinden
 *
 * Katalog 2.677 ürün olduğu için ILIKE de yeterince hızlı; yine de kod eşleşmesi
 * indeksli (`product_sku_norm_idx`) yoldan gider.
 */
/**
 * Kod ÖNEK araması yapılacak mı? "HU7008" yazan, "HU 7008 z"yi bulmalı:
 * üretici sonek harfleri (x, z, y…) ve paket ekleri (-2) kodun parçasıdır ama
 * müşteri çoğu zaman onları yazmaz. Kısa ya da rakamsız girdide önek araması
 * kapalı — "HU" ya da "W7" bütün katalogu döker.
 */
function kodOneki(query: string): string | null {
  const n = normalizeCode(query)
  return n.length >= 4 && /[0-9]/.test(n) && /[A-Z]/.test(n) ? n : null
}

function searchCondition(query: string) {
  const q = query.trim()
  const like = `%${q}%`
  const onek = kodOneki(q)
  return sql`AND (
        p.search_vector @@ plainto_tsquery('turkish', ${q})
     OR p.name ILIKE ${like}
     OR ocm_normalize_code(p.sku) = ocm_normalize_code(${q})
     OR ocm_normalize_code(coalesce(p.product_code, '')) = ocm_normalize_code(${q})
     ${onek ? sql`OR ocm_normalize_code(coalesce(p.product_code, '')) LIKE ${onek + '%'}` : sql``}
     OR EXISTS (
          SELECT 1 FROM product_reference pref
          WHERE pref.product_id = p.id
            AND pref.normalized = ocm_normalize_code(${q})
        )
  )`
}

export async function getListing(options: {
  scope: ListingScope
  filters: ListingFilters
  sort: SortKey
  page: number
  pageSize?: number
}): Promise<ListingResult> {
  const { scope: listingScope, filters, sort, page, pageSize = 24 } = options
  const engineId = listingScope.engineId
  const scope = listingScope.category
    ? await categoryScope(listingScope.category.id, listingScope.category.path)
    : null

  const specEntries = Object.entries(filters.specs).filter(([, v]) => v.length > 0)
  const specFilter =
    specEntries.length > 0
      ? sql`AND ${sql.join(
          specEntries.map(
            ([key, values]) => sql`(p.specs->>${key}) = ANY(${sql.val(values)}::text[])`,
          ),
          sql` AND `,
        )}`
      : sql``

  const brandFilter =
    filters.brands.length > 0 ? sql`AND b.slug = ANY(${sql.val(filters.brands)}::text[])` : sql``

  const stockFilter = filters.inStock ? sql`AND coalesce(st.quantity, 0) > 0` : sql``

  // Motor kapsamlı listede (araç sonuç sayfası) yalnızca uyumlular gelir.
  // Kategori listesinde ise "yalnızca aracıma uygun" filtresi kullanıcıya bırakılır.
  const compatFilter =
    engineId && (listingScope.engineScoped || filters.compatibleOnly)
      ? sql`AND pc.status IN ('VERIFIED','SOURCED')`
      : sql``

  const categoryFilter = scope ? sql`AND p.category_id = ANY(${sql.val(scope)}::int[])` : sql``

  // Sayfa kapsamı: marka sayfası ve arama sayfası. Filtre değil, kapsamdır.
  const scopeBrandFilter = listingScope.brandId
    ? sql`AND p.brand_id = ${listingScope.brandId}::int`
    : sql``
  const queryFilter = listingScope.query?.trim() ? searchCondition(listingScope.query) : sql``

  const priceFilter = sql`
    ${filters.priceMin !== null ? sql`AND (pr.price_net * (1 + pr.tax_rate / 100.0)) >= ${filters.priceMin}` : sql``}
    ${filters.priceMax !== null ? sql`AND (pr.price_net * (1 + pr.tax_rate / 100.0)) <= ${filters.priceMax}` : sql``}
  `

  const orderBy = (() => {
    switch (sort) {
      case 'fiyat-artan':
        return sql`gross_price ASC NULLS LAST, p.id`
      case 'fiyat-azalan':
        return sql`gross_price DESC NULLS LAST, p.id`
      case 'yeni':
        return sql`p.created_at DESC, p.id`
      case 'marka':
        return sql`b.name ASC, p.name ASC, p.id`
      default:
        // Önerilen: (aramada) kodu birebir tutan önce, sonra uyumlular,
        // sonra öne çıkanlar, sonra ağırlık
        return sql`
          ${
            listingScope.query?.trim()
              ? sql`CASE WHEN ocm_normalize_code(coalesce(p.product_code, '')) = ocm_normalize_code(${listingScope.query.trim()}) THEN 0 ELSE 1 END,`
              : sql``
          }
          CASE
            WHEN pc.status IN ('VERIFIED','SOURCED') THEN 0
            WHEN pc.status = 'CONFLICTED' THEN 1
            WHEN pc.status = 'INCOMPATIBLE' THEN 3
            ELSE 2
          END,
          p.is_featured DESC, p.sort_weight, p.id`
    }
  })()

  const base = sql`
    FROM product p
    JOIN product_brand b ON b.id = p.brand_id
    JOIN category c      ON c.id = p.category_id
    LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
    LEFT JOIN price pr   ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
    LEFT JOIN stock st   ON st.variant_id = v.id
    LEFT JOIN product_compatibility pc
           ON pc.product_id = p.id AND pc.engine_id = ${engineId}::bigint
    WHERE p.status = 'ACTIVE'
      ${categoryFilter}
      ${scopeBrandFilter}
      ${queryFilter}
      ${brandFilter}
      ${stockFilter}
      ${compatFilter}
      ${specFilter}
      ${priceFilter}
  `

  const rows = await sql<{
    id: number
    variant_id: number | null
    sku: string
    slug: string
    name: string
    product_code: string | null
    brand_name: string
    brand_slug: string
    category_code: string
    category_name: string
    price_net: number | null
    tax_rate: number
    list_price: number | null
    gross_price: number | null
    quantity: number
    lead_time_days: number | null
    compat_status: string | null
    restriction: string | null
    specs: Record<string, unknown> | null
    spec_labels: Array<{ key: string; label: string; unit: string | null }> | null
    image_url: string | null
    total: string
  }>`
    SELECT p.id, v.id AS variant_id, p.sku, p.slug, p.name, p.product_code, p.specs,
           b.name AS brand_name, b.slug AS brand_slug,
           c.code AS category_code, c.name AS category_name,
           pr.price_net, pr.tax_rate, pr.list_price,
           (pr.price_net * (1 + pr.tax_rate / 100.0)) AS gross_price,
           coalesce(st.quantity, 0) AS quantity, st.lead_time_days,
           pc.status::text AS compat_status, pc.restriction,
           (
             SELECT pi.url FROM product_image pi
             WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order, pi.id
             LIMIT 1
           ) AS image_url,
           (
             SELECT jsonb_agg(jsonb_build_object('key', ca.key, 'label', ca.label, 'unit', ca.unit)
                              ORDER BY ca.sort_order)
             FROM category_attribute ca
             WHERE ca.category_id = p.category_id AND ca.is_facet
           ) AS spec_labels,
           count(*) OVER () AS total
    ${base}
    ORDER BY ${orderBy}
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
  `.execute(db)

  const total = rows.rows.length > 0 ? Number(rows.rows[0]!.total) : 0

  const products: ProductCardData[] = rows.rows.map((r) => {
    let compatibility: CompatibilityState = 'unknown'
    if (engineId) {
      if (r.compat_status === 'VERIFIED' || r.compat_status === 'SOURCED')
        compatibility = 'compatible'
      else if (r.compat_status === 'INCOMPATIBLE') compatibility = 'incompatible'
    }

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
      variantId: r.variant_id,
      sku: r.sku,
      slug: r.slug,
      name: r.name,
      productCode: r.product_code,
      brandName: r.brand_name,
      brandSlug: r.brand_slug,
      categoryCode: r.category_code,
      categoryName: r.category_name,
      imageUrl: r.image_url,
      price: r.gross_price ? Math.round(r.gross_price * 100) / 100 : 0,
      listPrice: r.list_price,
      stock: r.quantity,
      leadTimeDays: r.lead_time_days,
      compatibility,
      restriction: r.restriction,
      specs,
    }
  })

  const facets = await getListingFacets({
    scope,
    brandId: listingScope.brandId ?? null,
    query: listingScope.query ?? null,
    engineId,
    engineScoped: listingScope.engineScoped ?? false,
  })

  return { products, total, page, pageSize, facets }
}

/**
 * Facet sayımları. Marka/fiyat/stok/uyumluluk sayımları kategori kapsamının
 * TAMAMI üzerinden hesaplanır (uygulanan filtrelerden bağımsız) — böylece
 * kullanıcı bir filtreyi kaldırınca ne kazanacağını görebilir.
 */
async function getListingFacets(options: {
  scope: number[] | null
  brandId: number | null
  query: string | null
  engineId: number | null
  engineScoped: boolean
}): Promise<ListingFacets> {
  const { scope, brandId, query, engineId, engineScoped } = options

  // Facet kapsamı: kategori sayfasında kategori ağacı, marka sayfasında o
  // marka, arama sayfasında arama sonucu, araç sayfasında o motora uyumlular.
  const scopeSql = sql`
    p.status = 'ACTIVE'
    ${scope ? sql`AND p.category_id = ANY(${sql.val(scope)}::int[])` : sql``}
    ${brandId ? sql`AND p.brand_id = ${brandId}::int` : sql``}
    ${query?.trim() ? searchCondition(query) : sql``}
    ${
      engineScoped && engineId
        ? sql`AND EXISTS (
              SELECT 1 FROM product_compatibility x
              WHERE x.product_id = p.id AND x.engine_id = ${engineId}::bigint
                AND x.status IN ('VERIFIED','SOURCED'))`
        : sql``
    }
  `

  const [brandRows, priceRow, stockRow, compatRow, specDefs] = await Promise.all([
    sql<{ slug: string; name: string; count: string }>`
      SELECT b.slug, b.name, count(*)::text AS count
      FROM product p JOIN product_brand b ON b.id = p.brand_id
      WHERE ${scopeSql}
      GROUP BY b.slug, b.name
      ORDER BY count(*) DESC, b.name
    `.execute(db),

    sql<{ min: number | null; max: number | null }>`
      SELECT min(pr.price_net * (1 + pr.tax_rate / 100.0)) AS min,
             max(pr.price_net * (1 + pr.tax_rate / 100.0)) AS max
      FROM product p
      JOIN product_variant v ON v.product_id = p.id AND v.is_default
      JOIN price pr ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
      WHERE ${scopeSql}
    `.execute(db),

    sql<{ in_stock: string; out_of_stock: string }>`
      SELECT
        count(*) FILTER (WHERE coalesce(st.quantity,0) > 0)::text  AS in_stock,
        count(*) FILTER (WHERE coalesce(st.quantity,0) = 0)::text  AS out_of_stock
      FROM product p
      LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
      LEFT JOIN stock st ON st.variant_id = v.id
      WHERE ${scopeSql}
    `.execute(db),

    engineId
      ? sql<{ compatible: string; unknown: string; incompatible: string }>`
          SELECT
            count(*) FILTER (WHERE pc.status IN ('VERIFIED','SOURCED'))::text AS compatible,
            count(*) FILTER (WHERE pc.status IS NULL OR pc.status = 'CONFLICTED')::text AS unknown,
            count(*) FILTER (WHERE pc.status = 'INCOMPATIBLE')::text AS incompatible
          FROM product p
          LEFT JOIN product_compatibility pc
                 ON pc.product_id = p.id AND pc.engine_id = ${engineId}::bigint
          WHERE ${scopeSql}
        `.execute(db)
      : Promise.resolve(null),

    sql<{ key: string; label: string; unit: string | null; data_type: string }>`
      SELECT DISTINCT ON (ca.key) ca.key, ca.label, ca.unit, ca.data_type::text AS data_type
      FROM category_attribute ca
      WHERE ca.is_facet
        AND ca.category_id IN (
          SELECT DISTINCT p.category_id FROM product p WHERE ${scopeSql}
        )
      ORDER BY ca.key, ca.sort_order
    `.execute(db),
  ])

  // Teknik özellik değerleri — yalnızca ENUM/TEXT/BOOL tipleri facet olur;
  // sayısal alanlar (yükseklik, çap) aralık filtresi gerektirir, Faz 4'te eklenecek.
  const uniqueDefs = new Map<string, { key: string; label: string; unit: string | null }>()
  for (const d of specDefs.rows) {
    if (d.data_type === 'NUMBER') continue
    if (!uniqueDefs.has(d.key)) uniqueDefs.set(d.key, { key: d.key, label: d.label, unit: d.unit })
  }

  const specFacets: ListingFacets['specs'] = []
  for (const def of uniqueDefs.values()) {
    const values = await sql<{ value: string; count: string }>`
      SELECT p.specs->>${def.key} AS value, count(*)::text AS count
      FROM product p
      WHERE ${scopeSql}
        AND p.specs ? ${def.key}
        AND p.specs->>${def.key} <> ''
      GROUP BY 1
      ORDER BY count(*) DESC, 1
      LIMIT 12
    `.execute(db)

    if (values.rows.length === 0) continue
    specFacets.push({
      key: def.key,
      label: def.label,
      unit: def.unit,
      values: values.rows.map((v) => ({
        value: v.value,
        label: v.value === 'true' ? 'Var' : v.value === 'false' ? 'Yok' : v.value,
        count: Number(v.count),
      })),
    })
  }

  return {
    brands: brandRows.rows.map((b) => ({ slug: b.slug, name: b.name, count: Number(b.count) })),
    price: {
      min: Math.floor(priceRow.rows[0]?.min ?? 0),
      max: Math.ceil(priceRow.rows[0]?.max ?? 0),
    },
    stock: {
      inStock: Number(stockRow.rows[0]?.in_stock ?? 0),
      outOfStock: Number(stockRow.rows[0]?.out_of_stock ?? 0),
    },
    compatibility: compatRow
      ? {
          compatible: Number(compatRow.rows[0]?.compatible ?? 0),
          unknown: Number(compatRow.rows[0]?.unknown ?? 0),
          incompatible: Number(compatRow.rows[0]?.incompatible ?? 0),
        }
      : null,
    specs: specFacets,
  }
}

// ─────────────────────── SEARCHPARAMS ↔ FİLTRE DÖNÜŞÜMÜ ─────────────────────

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
  facetKeys: string[] = [],
): { filters: ListingFilters; sort: SortKey; page: number } {
  const asArray = (v: string | string[] | undefined): string[] =>
    v === undefined ? [] : Array.isArray(v) ? v : v.split(',').filter(Boolean)

  const specs: Record<string, string[]> = {}
  for (const key of facetKeys) {
    const values = asArray(searchParams[`o_${key}`])
    if (values.length) specs[key] = values
  }

  const num = (v: string | string[] | undefined): number | null => {
    const raw = Array.isArray(v) ? v[0] : v
    if (!raw) return null
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : null
  }

  const sortRaw = Array.isArray(searchParams.siralama)
    ? searchParams.siralama[0]
    : searchParams.siralama
  const sort: SortKey = SORT_OPTIONS.some((o) => o.key === sortRaw)
    ? (sortRaw as SortKey)
    : 'onerilen'

  const pageRaw = num(searchParams.sayfa)
  const page = pageRaw && pageRaw > 0 ? Math.floor(pageRaw) : 1

  return {
    filters: {
      brands: asArray(searchParams.marka),
      priceMin: num(searchParams.fiyat_min),
      priceMax: num(searchParams.fiyat_max),
      inStock: searchParams.stok === '1',
      compatibleOnly: searchParams.uyumlu === '1',
      specs,
    },
    sort,
    page,
  }
}
