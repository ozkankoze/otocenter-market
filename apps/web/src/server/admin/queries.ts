import 'server-only'
import { db, sql } from '@ocm/db'

export type DashboardStats = {
  products: number
  activeProducts: number
  categories: number
  productBrands: number
  vehicleBrands: number
  models: number
  engines: number
  assertions: number
  compatibility: number
  verified: number
  sourced: number
  conflicted: number
  incompatible: number
  references: number
  openConflicts: number
  sources: number
  seoPages: number
  lastImports: Array<{
    id: number
    fileName: string
    status: string
    createdAt: Date
    sourceCode: string
    totals: Record<string, number>
  }>
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const row = await sql<{
    products: string
    active_products: string
    categories: string
    product_brands: string
    vehicle_brands: string
    models: string
    engines: string
    assertions: string
    compatibility: string
    verified: string
    sourced: string
    conflicted: string
    incompatible: string
    refs: string
    open_conflicts: string
    sources: string
    seo_pages: string
  }>`
    SELECT
      (SELECT count(*) FROM product)::text                                    AS products,
      (SELECT count(*) FROM product WHERE status = 'ACTIVE')::text            AS active_products,
      (SELECT count(*) FROM category)::text                                   AS categories,
      (SELECT count(*) FROM product_brand)::text                              AS product_brands,
      (SELECT count(*) FROM vehicle_brand)::text                              AS vehicle_brands,
      (SELECT count(*) FROM vehicle_model)::text                              AS models,
      (SELECT count(*) FROM vehicle_engine)::text                             AS engines,
      (SELECT count(*) FROM compatibility_assertion WHERE is_active)::text    AS assertions,
      (SELECT count(*) FROM product_compatibility)::text                      AS compatibility,
      (SELECT count(*) FROM product_compatibility WHERE status='VERIFIED')::text     AS verified,
      (SELECT count(*) FROM product_compatibility WHERE status='SOURCED')::text      AS sourced,
      (SELECT count(*) FROM product_compatibility WHERE status='CONFLICTED')::text   AS conflicted,
      (SELECT count(*) FROM product_compatibility WHERE status='INCOMPATIBLE')::text AS incompatible,
      (SELECT count(*) FROM product_reference)::text                          AS refs,
      (SELECT count(*) FROM data_conflict WHERE status='OPEN')::text          AS open_conflicts,
      (SELECT count(*) FROM data_source WHERE is_active)::text                AS sources,
      (SELECT count(*) FROM engine_category_index WHERE product_count > 0)::text AS seo_pages
  `.execute(db)

  const r = row.rows[0]!

  const imports = await db
    .selectFrom('import_job as j')
    .innerJoin('data_source as s', 's.id', 'j.source_id')
    .select(['j.id', 'j.file_name', 'j.status', 'j.created_at', 'j.totals', 's.code as source_code'])
    .orderBy('j.id', 'desc')
    .limit(5)
    .execute()

  return {
    products: Number(r.products),
    activeProducts: Number(r.active_products),
    categories: Number(r.categories),
    productBrands: Number(r.product_brands),
    vehicleBrands: Number(r.vehicle_brands),
    models: Number(r.models),
    engines: Number(r.engines),
    assertions: Number(r.assertions),
    compatibility: Number(r.compatibility),
    verified: Number(r.verified),
    sourced: Number(r.sourced),
    conflicted: Number(r.conflicted),
    incompatible: Number(r.incompatible),
    references: Number(r.refs),
    openConflicts: Number(r.open_conflicts),
    sources: Number(r.sources),
    seoPages: Number(r.seo_pages),
    lastImports: imports.map((i) => ({
      id: i.id,
      fileName: i.file_name,
      status: i.status,
      createdAt: i.created_at as unknown as Date,
      sourceCode: i.source_code,
      totals: (i.totals ?? {}) as unknown as Record<string, number>,
    })),
  }
}

// ─────────────────────────────── IMPORTLAR ──────────────────────────────────

export type ImportListRow = {
  id: number
  fileName: string
  fileSize: number
  sourceCode: string
  sourceName: string
  status: string
  userName: string | null
  createdAt: Date
  committedAt: Date | null
  rolledBackAt: Date | null
  totals: Record<string, number>
}

export async function listImports(limit = 50): Promise<ImportListRow[]> {
  const rows = await db
    .selectFrom('import_job as j')
    .innerJoin('data_source as s', 's.id', 'j.source_id')
    .leftJoin('admin_user as u', 'u.id', 'j.created_by_user_id')
    .select([
      'j.id',
      'j.file_name',
      'j.file_size',
      'j.status',
      'j.created_at',
      'j.committed_at',
      'j.rolled_back_at',
      'j.totals',
      's.code as source_code',
      's.name as source_name',
      'u.name as user_name',
    ])
    .orderBy('j.id', 'desc')
    .limit(limit)
    .execute()

  return rows.map((r) => ({
    id: r.id,
    fileName: r.file_name,
    fileSize: r.file_size,
    sourceCode: r.source_code,
    sourceName: r.source_name,
    status: r.status,
    userName: r.user_name,
    createdAt: r.created_at as unknown as Date,
    committedAt: (r.committed_at ?? null) as unknown as Date | null,
    rolledBackAt: (r.rolled_back_at ?? null) as unknown as Date | null,
    totals: (r.totals ?? {}) as unknown as Record<string, number>,
  }))
}

export type ImportDetail = {
  job: ImportListRow & { errorMessage: string | null; sheetCounts: Record<string, number> }
  sheets: Array<{ sheet: string; total: number; valid: number; warning: number; error: number; skipped: number; applied: number }>
  problemRows: Array<{
    sheet: string
    rowNo: number
    status: string
    messages: Array<{ code: string; level: string; field?: string; message: string }>
    raw: Record<string, string>
  }>
  changeSummary: Array<{ entityType: string; inserts: number; updates: number; reverted: number; skipped: number }>
  /** Geri alma sonrası özet — kalıcıdır, sayfa yenilense de görünür. */
  rollback: {
    reverted: number
    skipped: number
    skippedDetails: Array<{ entityType: string; entityId: number; reason: string }>
  } | null
}

export async function getImportDetail(id: number): Promise<ImportDetail | null> {
  const job = (await listImports(1000)).find((j) => j.id === id)
  if (!job) return null

  const extra = await db
    .selectFrom('import_job')
    .select(['error_message', 'sheet_counts'])
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  const sheetRows = await sql<{
    sheet: string
    total: string
    valid: string
    warning: string
    error: string
    skipped: string
    applied: string
  }>`
    SELECT sheet::text,
           count(*)::text                                        AS total,
           count(*) FILTER (WHERE status='VALID')::text          AS valid,
           count(*) FILTER (WHERE status='WARNING')::text        AS warning,
           count(*) FILTER (WHERE status='ERROR')::text          AS error,
           count(*) FILTER (WHERE status='SKIPPED')::text        AS skipped,
           count(*) FILTER (WHERE status='APPLIED')::text        AS applied
    FROM import_staging_row
    WHERE import_job_id = ${id}
    GROUP BY sheet
    ORDER BY sheet
  `.execute(db)

  const problems = await db
    .selectFrom('import_staging_row')
    .select(['sheet', 'row_no', 'status', 'messages', 'raw'])
    .where('import_job_id', '=', id)
    .where('status', 'in', ['ERROR', 'SKIPPED', 'WARNING'])
    .orderBy('row_no')
    .limit(200)
    .execute()

  const changes = await sql<{
    entity_type: string
    inserts: string
    updates: string
    reverted: string
    skipped: string
  }>`
    SELECT entity_type,
           count(*) FILTER (WHERE operation='INSERT')::text     AS inserts,
           count(*) FILTER (WHERE operation='UPDATE')::text     AS updates,
           count(*) FILTER (WHERE reverted_at IS NOT NULL)::text AS reverted,
           count(*) FILTER (WHERE skip_reason IS NOT NULL)::text AS skipped
    FROM import_change
    WHERE import_job_id = ${id}
    GROUP BY entity_type
    ORDER BY entity_type
  `.execute(db)

  const rollbackRows = await db
    .selectFrom('import_change')
    .select(['entity_type', 'entity_id', 'skip_reason', 'reverted_at'])
    .where('import_job_id', '=', id)
    .execute()

  const revertedCount = rollbackRows.filter((r) => r.reverted_at !== null).length
  const skippedRows = rollbackRows.filter((r) => r.skip_reason !== null)

  return {
    rollback:
      job.status === 'ROLLED_BACK'
        ? {
            reverted: revertedCount,
            skipped: skippedRows.length,
            skippedDetails: skippedRows.slice(0, 20).map((r) => ({
              entityType: r.entity_type,
              entityId: r.entity_id,
              reason: r.skip_reason ?? '',
            })),
          }
        : null,
    job: {
      ...job,
      errorMessage: extra.error_message,
      sheetCounts: (extra.sheet_counts ?? {}) as unknown as Record<string, number>,
    },
    sheets: sheetRows.rows.map((s) => ({
      sheet: s.sheet,
      total: Number(s.total),
      valid: Number(s.valid),
      warning: Number(s.warning),
      error: Number(s.error),
      skipped: Number(s.skipped),
      applied: Number(s.applied),
    })),
    problemRows: problems.map((p) => ({
      sheet: p.sheet,
      rowNo: p.row_no,
      status: p.status,
      messages: (p.messages ?? []) as unknown as Array<{ code: string; level: string; field?: string; message: string }>,
      raw: (p.raw ?? {}) as unknown as Record<string, string>,
    })),
    changeSummary: changes.rows.map((c) => ({
      entityType: c.entity_type,
      inserts: Number(c.inserts),
      updates: Number(c.updates),
      reverted: Number(c.reverted),
      skipped: Number(c.skipped),
    })),
  }
}

// ─────────────────────────────── LİSTELER ───────────────────────────────────

export async function listDataSources() {
  const rows = await db
    .selectFrom('data_source as s')
    .leftJoin('compatibility_assertion as a', (join) =>
      join.onRef('a.source_id', '=', 's.id').on('a.is_active', '=', true),
    )
    .select(({ fn }) => [
      's.id',
      's.code',
      's.name',
      's.kind',
      's.trust_level',
      's.is_active',
      fn.count<string>('a.id').as('assertion_count'),
    ])
    .groupBy(['s.id', 's.code', 's.name', 's.kind', 's.trust_level', 's.is_active'])
    .orderBy('s.trust_level', 'desc')
    .execute()
  return rows.map((r) => ({ ...r, assertionCount: Number(r.assertion_count) }))
}

export async function listAdminProducts(search: string | null, limit = 60) {
  let q = db
    .selectFrom('product as p')
    .innerJoin('product_brand as b', 'b.id', 'p.brand_id')
    .innerJoin('category as c', 'c.id', 'p.category_id')
    .leftJoin('product_variant as v', (join) =>
      join.onRef('v.product_id', '=', 'p.id').on('v.is_default', '=', true),
    )
    .leftJoin('price as pr', (join) =>
      join.onRef('pr.variant_id', '=', 'v.id').on('pr.customer_group', '=', 'RETAIL'),
    )
    .leftJoin('stock as st', 'st.variant_id', 'v.id')
    .select(({ fn }) => [
      'p.id',
      'p.sku',
      'p.slug',
      'p.name',
      'p.product_code',
      'p.status',
      'b.name as brand_name',
      'c.name as category_name',
      'pr.price_net',
      'pr.tax_rate',
      fn.coalesce('st.quantity', sql<number>`0`).as('quantity'),
    ])

  if (search) {
    const like = `%${search.toLocaleLowerCase('tr')}%`
    q = q.where(
      sql<boolean>`lower(p.name) LIKE ${like} OR lower(p.sku) LIKE ${like} OR lower(coalesce(p.product_code,'')) LIKE ${like}`,
    )
  }

  const rows = await q.orderBy('p.id', 'desc').limit(limit).execute()

  const counts = await sql<{ product_id: string; compat: string; refs: string }>`
    SELECT p.id::text AS product_id,
           (SELECT count(*) FROM product_compatibility pc WHERE pc.product_id = p.id)::text AS compat,
           (SELECT count(*) FROM product_reference r WHERE r.product_id = p.id)::text AS refs
    FROM product p
    WHERE p.id = ANY(${rows.map((r) => r.id)}::bigint[])
  `.execute(db)
  const countMap = new Map(counts.rows.map((c) => [Number(c.product_id), c]))

  return rows.map((r) => ({
    id: r.id,
    sku: r.sku,
    slug: r.slug,
    name: r.name,
    productCode: r.product_code,
    status: r.status,
    brandName: r.brand_name,
    categoryName: r.category_name,
    price: r.price_net ? Math.round(r.price_net * (1 + (r.tax_rate ?? 20) / 100) * 100) / 100 : null,
    stock: Number(r.quantity),
    compatCount: Number(countMap.get(r.id)?.compat ?? 0),
    refCount: Number(countMap.get(r.id)?.refs ?? 0),
  }))
}

export async function listAdminCategories() {
  const rows = await sql<{
    id: number
    code: string
    name: string
    slug: string
    path: string
    depth: number
    parent_name: string | null
    product_count: string
    attr_count: string
  }>`
    SELECT c.id, c.code, c.name, c.slug, c.path, c.depth, p.name AS parent_name,
           (SELECT count(*) FROM product pr WHERE pr.category_id = c.id)::text AS product_count,
           (SELECT count(*) FROM category_attribute a WHERE a.category_id = c.id)::text AS attr_count
    FROM category c
    LEFT JOIN category p ON p.id = c.parent_id
    ORDER BY c.path
  `.execute(db)
  return rows.rows.map((r) => ({
    ...r,
    productCount: Number(r.product_count),
    attrCount: Number(r.attr_count),
  }))
}

export async function listAdminBrands() {
  const rows = await db
    .selectFrom('product_brand as b')
    .leftJoin('product as p', 'p.brand_id', 'b.id')
    .select(({ fn }) => [
      'b.id',
      'b.name',
      'b.slug',
      'b.country',
      'b.is_featured',
      'b.is_active',
      fn.count<string>('p.id').as('product_count'),
    ])
    .groupBy(['b.id', 'b.name', 'b.slug', 'b.country', 'b.is_featured', 'b.is_active', 'b.sort_order'])
    .orderBy('b.sort_order')
    .execute()
  return rows.map((r) => ({ ...r, productCount: Number(r.product_count) }))
}

export async function listVehicleTree() {
  const rows = await sql<{
    brand_id: number
    brand: string
    model_id: number
    model: string
    model_years: string | null
    engine_id: string
    engine: string
    engine_codes: string[]
    fuel: string
    hp: number | null
    compat_count: string
  }>`
    SELECT b.id AS brand_id, b.name AS brand,
           m.id AS model_id, m.name AS model,
           CASE WHEN m.year_from IS NOT NULL
                THEN m.year_from || '–' || coalesce(m.year_to::text, '')
           END AS model_years,
           e.id::text AS engine_id, e.name AS engine, e.engine_codes,
           e.fuel_type::text AS fuel, e.power_hp AS hp,
           (SELECT count(*) FROM product_compatibility pc WHERE pc.engine_id = e.id)::text AS compat_count
    FROM vehicle_engine e
    JOIN vehicle_model m ON m.id = e.model_id
    JOIN vehicle_brand b ON b.id = m.brand_id
    ORDER BY b.name, m.name, e.sort_order, e.name
    LIMIT 400
  `.execute(db)
  return rows.rows.map((r) => ({ ...r, compatCount: Number(r.compat_count) }))
}

export async function listCompatibility(status: string | null, limit = 80) {
  const rows = await sql<{
    product_id: string
    sku: string
    product_name: string
    brand: string
    engine_id: string
    engine: string
    model: string
    vehicle_brand: string
    status: string
    has_conflict: boolean
    restriction: string | null
    source_code: string | null
    years: string | null
  }>`
    SELECT p.id::text AS product_id, p.sku, p.name AS product_name, pb.name AS brand,
           e.id::text AS engine_id, e.name AS engine, m.name AS model, vb.name AS vehicle_brand,
           pc.status::text, pc.has_conflict, pc.restriction, ds.code AS source_code,
           CASE WHEN pc.year_from IS NOT NULL
                THEN pc.year_from || '–' || coalesce(pc.year_to::text, '') END AS years
    FROM product_compatibility pc
    JOIN product p        ON p.id = pc.product_id
    JOIN product_brand pb ON pb.id = p.brand_id
    JOIN vehicle_engine e ON e.id = pc.engine_id
    JOIN vehicle_model m  ON m.id = e.model_id
    JOIN vehicle_brand vb ON vb.id = m.brand_id
    LEFT JOIN data_source ds ON ds.id = pc.source_id
    WHERE (${status}::text IS NULL OR pc.status::text = ${status})
    ORDER BY pc.has_conflict DESC, p.sku, vb.name, m.name
    LIMIT ${limit}
  `.execute(db)
  return rows.rows
}

export async function compatibilityStatusCounts() {
  const rows = await sql<{ status: string; n: string }>`
    SELECT status::text, count(*)::text AS n FROM product_compatibility GROUP BY status
  `.execute(db)
  return Object.fromEntries(rows.rows.map((r) => [r.status, Number(r.n)])) as Record<string, number>
}

export async function listReferences(search: string | null, limit = 80) {
  const rows = await sql<{
    id: string
    number: string
    normalized: string
    type: string
    brand_name: string | null
    sku: string
    product_name: string
    owners: string
  }>`
    SELECT r.id::text, r.number, r.normalized, r.type::text, r.brand_name,
           p.sku, p.name AS product_name,
           (SELECT count(DISTINCT r2.product_id) FROM product_reference r2
             WHERE r2.normalized = r.normalized)::text AS owners
    FROM product_reference r
    JOIN product p ON p.id = r.product_id
    WHERE (${search}::text IS NULL
           OR r.normalized LIKE '%' || upper(${search}) || '%'
           OR lower(p.sku) LIKE '%' || lower(${search}) || '%')
    ORDER BY (SELECT count(DISTINCT r2.product_id) FROM product_reference r2
               WHERE r2.normalized = r.normalized) DESC, r.normalized
    LIMIT ${limit}
  `.execute(db)
  return rows.rows.map((r) => ({ ...r, owners: Number(r.owners) }))
}

export async function listConflicts(limit = 100) {
  const rows = await sql<{
    id: string
    status: string
    severity: string
    created_at: Date
    sku: string | null
    product_name: string | null
    engine: string | null
    model: string | null
    vehicle_brand: string | null
    candidates: Array<Record<string, unknown>>
    compat_status: string | null
  }>`
    SELECT c.id::text, c.status::text, c.severity::text, c.created_at,
           p.sku, p.name AS product_name,
           e.name AS engine, m.name AS model, vb.name AS vehicle_brand,
           c.candidates,
           pc.status::text AS compat_status
    FROM data_conflict c
    LEFT JOIN product p        ON p.id = c.product_id
    LEFT JOIN vehicle_engine e ON e.id = c.engine_id
    LEFT JOIN vehicle_model m  ON m.id = e.model_id
    LEFT JOIN vehicle_brand vb ON vb.id = m.brand_id
    LEFT JOIN product_compatibility pc
           ON pc.product_id = c.product_id AND pc.engine_id = c.engine_id
    ORDER BY (c.status = 'OPEN') DESC, c.severity, c.created_at DESC
    LIMIT ${limit}
  `.execute(db)
  return rows.rows
}
