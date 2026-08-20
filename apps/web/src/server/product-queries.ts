import 'server-only'
import { db, sql } from '@ocm/db'
import type { CompatibilityState } from '@/features/vehicle/types'

export type ProductVariantView = {
  id: number
  sku: string
  name: string | null
  packSize: number
  unit: string
  isDefault: boolean
  price: number
  listPrice: number | null
  taxRate: number
  stock: number
  leadTimeDays: number | null
}

export type ProductReferenceView = {
  type: 'OEM' | 'CROSS_EQUIVALENT' | 'CROSS_REPLACES' | 'CROSS_REPLACED_BY'
  brandName: string | null
  number: string
  note: string | null
}

export type CompatibleVehicleRow = {
  brandName: string
  modelName: string
  engineName: string
  engineSlug: string
  modelSlug: string
  brandSlug: string
  typeSlug: string
  years: string
  status: 'VERIFIED' | 'SOURCED' | 'CONFLICTED' | 'INCOMPATIBLE'
  restriction: string | null
}

export type ProductDetail = {
  id: number
  sku: string
  slug: string
  name: string
  productCode: string | null
  shortDescription: string | null
  description: string | null
  brand: { id: number; name: string; slug: string; country: string | null }
  category: {
    id: number
    name: string
    slug: string
    parentName: string | null
    parentSlug: string | null
  }
  specs: Array<{ key: string; label: string; value: string; unit: string | null }>
  /** Ürün görselleri — birincil önce. Boşsa arayüz yer tutucu gösterir. */
  images: Array<{ url: string; alt: string | null }>
  variants: ProductVariantView[]
  references: ProductReferenceView[]
  seoTitle: string | null
  seoDescription: string | null
  /** Seçili araç için uyumluluk — Sprint 1–2 kuralları birebir */
  compatibility: CompatibilityState
  compatibilityRestriction: string | null
  compatibleVehicleCount: number
}

export async function getProductDetail(
  slug: string,
  engineId: number | null,
): Promise<ProductDetail | null> {
  const row = await db
    .selectFrom('product as p')
    .innerJoin('product_brand as b', 'b.id', 'p.brand_id')
    .innerJoin('category as c', 'c.id', 'p.category_id')
    .leftJoin('category as pc2', 'pc2.id', 'c.parent_id')
    .select([
      'p.id',
      'p.sku',
      'p.slug',
      'p.name',
      'p.product_code',
      'p.short_description',
      'p.description',
      'p.specs',
      'p.seo_title',
      'p.seo_description',
      'b.id as brand_id',
      'b.name as brand_name',
      'b.slug as brand_slug',
      'b.country as brand_country',
      'c.id as category_id',
      'c.name as category_name',
      'c.slug as category_slug',
      'pc2.name as parent_name',
      'pc2.slug as parent_slug',
    ])
    .where('p.slug', '=', slug)
    .where('p.status', '=', 'ACTIVE')
    .executeTakeFirst()

  if (!row) return null

  const [attrs, variants, references, compatRow, vehicleCount, images] = await Promise.all([
    db
      .selectFrom('category_attribute')
      .select(['key', 'label', 'unit'])
      .where('category_id', '=', row.category_id)
      .orderBy('sort_order')
      .execute(),

    sql<{
      id: number
      sku: string
      name: string | null
      pack_size: number
      unit: string
      is_default: boolean
      price_net: number | null
      tax_rate: number | null
      list_price: number | null
      quantity: number
      lead_time_days: number | null
    }>`
      SELECT v.id, v.sku, v.name, v.pack_size, v.unit, v.is_default,
             pr.price_net, pr.tax_rate, pr.list_price,
             coalesce(st.quantity, 0) AS quantity, st.lead_time_days
      FROM product_variant v
      LEFT JOIN price pr ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
      LEFT JOIN stock st ON st.variant_id = v.id
      WHERE v.product_id = ${row.id}::bigint AND v.is_active
      ORDER BY v.is_default DESC, v.pack_size
    `.execute(db),

    db
      .selectFrom('product_reference')
      .select(['type', 'brand_name', 'number', 'note'])
      .where('product_id', '=', row.id)
      .orderBy('type')
      .orderBy('brand_name')
      .execute(),

    engineId
      ? db
          .selectFrom('product_compatibility')
          .select(['status', 'restriction'])
          .where('product_id', '=', row.id)
          .where('engine_id', '=', engineId)
          .executeTakeFirst()
      : Promise.resolve(undefined),

    db
      .selectFrom('product_compatibility')
      .select(({ fn }) => fn.countAll<string>().as('count'))
      .where('product_id', '=', row.id)
      .where('status', 'in', ['VERIFIED', 'SOURCED'])
      .executeTakeFirst(),

    db
      .selectFrom('product_image')
      .select(['url', 'alt'])
      .where('product_id', '=', row.id)
      .orderBy('is_primary', 'desc')
      .orderBy('sort_order')
      .orderBy('id')
      .execute(),
  ])

  const specsRaw = (row.specs ?? {}) as Record<string, unknown>
  const specs = attrs
    .map((a) => {
      const raw = specsRaw[a.key]
      if (raw === undefined || raw === null || raw === '') return null
      const value = typeof raw === 'boolean' ? (raw ? 'Var' : 'Yok') : String(raw)
      return { key: a.key, label: a.label, value, unit: a.unit }
    })
    .filter(
      (s): s is { key: string; label: string; value: string; unit: string | null } => s !== null,
    )

  let compatibility: CompatibilityState = 'unknown'
  if (engineId && compatRow) {
    if (compatRow.status === 'VERIFIED' || compatRow.status === 'SOURCED')
      compatibility = 'compatible'
    else if (compatRow.status === 'INCOMPATIBLE') compatibility = 'incompatible'
    // CONFLICTED → 'unknown' (bilinçli: yanlış güven verme)
  }

  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    productCode: row.product_code,
    shortDescription: row.short_description,
    description: row.description,
    images: images.map((i) => ({ url: i.url, alt: i.alt })),
    brand: {
      id: row.brand_id,
      name: row.brand_name,
      slug: row.brand_slug,
      country: row.brand_country,
    },
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      parentName: row.parent_name,
      parentSlug: row.parent_slug,
    },
    specs,
    variants: variants.rows.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      packSize: Number(v.pack_size),
      unit: v.unit,
      isDefault: v.is_default,
      price: v.price_net ? Math.round(v.price_net * (1 + (v.tax_rate ?? 20) / 100) * 100) / 100 : 0,
      listPrice: v.list_price,
      taxRate: v.tax_rate ?? 20,
      stock: v.quantity,
      leadTimeDays: v.lead_time_days,
    })),
    references: references.map((r) => ({
      type: r.type,
      brandName: r.brand_name,
      number: r.number,
      note: r.note,
    })),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    compatibility,
    compatibilityRestriction: compatRow?.restriction ?? null,
    compatibleVehicleCount: Number(vehicleCount?.count ?? 0),
  }
}

/**
 * Uyumlu araçlar tablosu (sayfalı).
 * CONFLICTED ve INCOMPATIBLE kayıtlar da gösterilir ama durumlarıyla birlikte —
 * kullanıcı neyin doğrulanmadığını görebilmeli.
 */
export async function getCompatibleVehicles(
  productId: number,
  options: { limit?: number; offset?: number; brandSlug?: string } = {},
): Promise<{
  rows: CompatibleVehicleRow[]
  total: number
  brands: Array<{ slug: string; name: string; count: number }>
}> {
  const { limit = 25, offset = 0, brandSlug } = options

  const result = await sql<{
    brand_name: string
    brand_slug: string
    model_name: string
    model_slug: string
    engine_name: string
    engine_slug: string
    type_slug: string
    year_from: number | null
    year_to: number | null
    status: CompatibleVehicleRow['status']
    restriction: string | null
    total: string
  }>`
    SELECT b.name AS brand_name, b.slug AS brand_slug,
           m.name AS model_name, m.slug AS model_slug,
           e.name AS engine_name, e.slug AS engine_slug,
           t.slug AS type_slug,
           coalesce(pc.year_from, e.year_from) AS year_from,
           coalesce(pc.year_to, e.year_to)     AS year_to,
           pc.status::text AS status,
           pc.restriction,
           count(*) OVER () AS total
    FROM product_compatibility pc
    JOIN vehicle_engine e ON e.id = pc.engine_id
    JOIN vehicle_model m  ON m.id = e.model_id
    JOIN vehicle_brand b  ON b.id = m.brand_id
    JOIN vehicle_brand_type bt ON bt.brand_id = b.id
    JOIN vehicle_type t   ON t.id = bt.type_id
    WHERE pc.product_id = ${productId}::bigint
      ${brandSlug ? sql`AND b.slug = ${brandSlug}` : sql``}
    ORDER BY
      CASE pc.status WHEN 'VERIFIED' THEN 0 WHEN 'SOURCED' THEN 1 WHEN 'CONFLICTED' THEN 2 ELSE 3 END,
      b.name, m.name, e.sort_order
    LIMIT ${limit} OFFSET ${offset}
  `.execute(db)

  const brands = await sql<{ slug: string; name: string; count: string }>`
    SELECT b.slug, b.name, count(*)::text AS count
    FROM product_compatibility pc
    JOIN vehicle_engine e ON e.id = pc.engine_id
    JOIN vehicle_model m  ON m.id = e.model_id
    JOIN vehicle_brand b  ON b.id = m.brand_id
    WHERE pc.product_id = ${productId}::bigint
    GROUP BY b.slug, b.name
    ORDER BY count(*) DESC, b.name
  `.execute(db)

  return {
    rows: result.rows.map((r) => ({
      brandName: r.brand_name,
      brandSlug: r.brand_slug,
      modelName: r.model_name,
      modelSlug: r.model_slug,
      engineName: r.engine_name,
      engineSlug: r.engine_slug,
      typeSlug: r.type_slug,
      years:
        r.year_from && r.year_to
          ? `${r.year_from}–${r.year_to}`
          : r.year_from
            ? `${r.year_from}→`
            : '',
      status: r.status,
      restriction: r.restriction,
    })),
    total: result.rows.length > 0 ? Number(result.rows[0]!.total) : 0,
    brands: brands.rows.map((b) => ({ slug: b.slug, name: b.name, count: Number(b.count) })),
  }
}

/**
 * Eşdeğer ürünler — çapraz referans kodları üzerinden eşleşen diğer ürünler.
 * İki yönlü çalışır: "bu ürünün muadili olarak listelenenler" ve
 * "bu ürünü muadil olarak listeleyenler".
 */
export async function getEquivalentProducts(
  productId: number,
  engineId: number | null,
  limit = 4,
): Promise<
  Array<{
    id: number
    slug: string
    name: string
    productCode: string | null
    brandName: string
    price: number
    stock: number
    compatibility: CompatibilityState
  }>
> {
  const rows = await sql<{
    id: number
    slug: string
    name: string
    product_code: string | null
    brand_name: string
    price_net: number | null
    tax_rate: number | null
    quantity: number
    compat_status: string | null
  }>`
    WITH my_codes AS (
      SELECT normalized FROM product_reference
      WHERE product_id = ${productId}::bigint AND type <> 'OEM'
    ),
    my_sku AS (
      SELECT ocm_normalize_code(coalesce(product_code, sku)) AS normalized
      FROM product WHERE id = ${productId}::bigint
    ),
    candidates AS (
      -- Bu ürünün muadil olarak gösterdiği kodlara sahip ürünler
      SELECT DISTINCT p2.id
      FROM product p2
      WHERE p2.id <> ${productId}::bigint
        AND p2.status = 'ACTIVE'
        AND ocm_normalize_code(coalesce(p2.product_code, p2.sku)) IN (SELECT normalized FROM my_codes)
      UNION
      -- Bu ürünü muadil olarak gösteren ürünler
      SELECT DISTINCT r.product_id
      FROM product_reference r
      WHERE r.type <> 'OEM'
        AND r.normalized IN (SELECT normalized FROM my_sku)
        AND r.product_id <> ${productId}::bigint
    )
    SELECT p.id, p.slug, p.name, p.product_code,
           b.name AS brand_name,
           pr.price_net, pr.tax_rate,
           coalesce(st.quantity, 0) AS quantity,
           pc.status::text AS compat_status
    FROM candidates cd
    JOIN product p ON p.id = cd.id AND p.status = 'ACTIVE'
    JOIN product_brand b ON b.id = p.brand_id
    LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
    LEFT JOIN price pr ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
    LEFT JOIN stock st ON st.variant_id = v.id
    LEFT JOIN product_compatibility pc
           ON pc.product_id = p.id AND pc.engine_id = ${engineId}::bigint
    ORDER BY
      CASE WHEN pc.status IN ('VERIFIED','SOURCED') THEN 0 ELSE 1 END,
      pr.price_net NULLS LAST
    LIMIT ${limit}
  `.execute(db)

  return rows.rows.map((r) => {
    let compatibility: CompatibilityState = 'unknown'
    if (engineId) {
      if (r.compat_status === 'VERIFIED' || r.compat_status === 'SOURCED')
        compatibility = 'compatible'
      else if (r.compat_status === 'INCOMPATIBLE') compatibility = 'incompatible'
    }
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      productCode: r.product_code,
      brandName: r.brand_name,
      price: r.price_net ? Math.round(r.price_net * (1 + (r.tax_rate ?? 20) / 100) * 100) / 100 : 0,
      stock: r.quantity,
      compatibility,
    }
  })
}
