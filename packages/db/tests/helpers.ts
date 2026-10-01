import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import type { Database } from '../src/types'
import { loadEnv } from '../scripts/env'

loadEnv()

const HERE = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = resolve(HERE, '../migrations')

/** Testler üretim/geliştirme verisine dokunmaz; ayrı bir veritabanı kullanır. */
export const TEST_DB_NAME = 'otocenter_test'

function baseUrl(): URL {
  const raw = process.env.DATABASE_URL
  if (!raw) throw new Error('DATABASE_URL tanımlı değil.')
  return new URL(raw)
}

export function testConnectionString(): string {
  const url = baseUrl()
  url.pathname = `/${TEST_DB_NAME}`
  return url.toString()
}

/** Test veritabanını sıfırdan kurar ve migration'ları uygular. */
export async function setupTestDatabase(): Promise<void> {
  const adminUrl = baseUrl()
  adminUrl.pathname = '/postgres'

  const admin = new pg.Client({ connectionString: adminUrl.toString() })
  await admin.connect()
  try {
    await admin.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME} WITH (FORCE)`)
    await admin.query(`CREATE DATABASE ${TEST_DB_NAME}`)
  } finally {
    await admin.end()
  }

  const client = new pg.Client({ connectionString: testConnectionString() })
  await client.connect()
  try {
    for (const file of readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort()) {
      await client.query(readFileSync(resolve(MIGRATIONS_DIR, file), 'utf8'))
    }
  } finally {
    await client.end()
  }
}

export function createTestDb(): Kysely<Database> {
  const { Pool, types } = pg
  types.setTypeParser(types.builtins.NUMERIC, (v) => Number.parseFloat(v))
  types.setTypeParser(types.builtins.INT8, (v) => Number.parseInt(v, 10))
  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool: new Pool({ connectionString: testConnectionString() }) }),
  })
}

/** Her testten önce çağrılır — tabloları boşaltır. */
export async function truncateAll(db: Kysely<Database>): Promise<void> {
  await db.executeQuery(
    db.getExecutor().compileQuery({
      kind: 'RawNode',
      sqlFragments: [
        `TRUNCATE payment_notification, order_item, customer_order,
                  import_change, import_staging_row, import_job, admin_user,
                  data_conflict, engine_category_index, product_compatibility,
                  compatibility_assertion, attribute_assertion, product_reference,
                  price, stock, product_variant, product_image, product,
                  category_attribute, category, product_brand,
                  vehicle_engine, vehicle_generation, vehicle_model,
                  vehicle_brand_type, vehicle_brand, vehicle_type, data_source
         RESTART IDENTITY CASCADE`,
      ],
      parameters: [],
    } as never),
  )
}

// ─────────────────────────── FIXTURE YARDIMCILARI ───────────────────────────

export type Fixtures = {
  sources: Record<string, number>
  engineId: number
  engineId2: number
  productId: number
  productId2: number
  categoryId: number
}

/**
 * Minimum ama gerçekçi bir veri seti kurar:
 * 1 araç tipi/marka/model/nesil + 2 motor, 1 kategori + 2 ürün, 5 veri kaynağı.
 */
export async function seedFixtures(db: Kysely<Database>): Promise<Fixtures> {
  const sourceDefs = [
    { code: 'MANUAL', name: 'Admin', kind: 'MANUAL' as const, trust: 100 },
    { code: 'TECDOC', name: 'TecDoc', kind: 'CATALOG' as const, trust: 90 },
    { code: 'MANN', name: 'MANN Kataloğu', kind: 'MANUFACTURER' as const, trust: 80 },
    { code: 'SUPPLIER', name: 'Tedarikçi', kind: 'SUPPLIER' as const, trust: 60 },
    { code: 'CSV', name: 'CSV', kind: 'CSV' as const, trust: 50 },
  ]
  const sources: Record<string, number> = {}
  for (const s of sourceDefs) {
    const row = await db
      .insertInto('data_source')
      .values({ code: s.code, name: s.name, kind: s.kind, trust_level: s.trust })
      .returning('id')
      .executeTakeFirstOrThrow()
    sources[s.code] = row.id
  }

  const type = await db
    .insertInto('vehicle_type')
    .values({ name: 'Otomobil', slug: 'otomobil' })
    .returning('id')
    .executeTakeFirstOrThrow()
  const brand = await db
    .insertInto('vehicle_brand')
    .values({ name: 'AUDI', slug: 'audi' })
    .returning('id')
    .executeTakeFirstOrThrow()
  await db
    .insertInto('vehicle_brand_type')
    .values({ brand_id: brand.id, type_id: type.id })
    .execute()
  const model = await db
    .insertInto('vehicle_model')
    .values({ brand_id: brand.id, name: 'A1 (GB)', slug: 'a1-gb', year_from: 2018 })
    .returning('id')
    .executeTakeFirstOrThrow()
  const gen = await db
    .insertInto('vehicle_generation')
    .values({ model_id: model.id, name: 'A1 II' })
    .returning('id')
    .executeTakeFirstOrThrow()

  const engine = await db
    .insertInto('vehicle_engine')
    .values({
      generation_id: gen.id,
      model_id: model.id,
      name: '30 TFSI 1.0',
      slug: '30-tfsi',
      engine_codes: ['CHZB'],
      fuel_type: 'BENZIN',
      year_from: 2018,
      year_to: 2024,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const engine2 = await db
    .insertInto('vehicle_engine')
    .values({
      generation_id: gen.id,
      model_id: model.id,
      name: '40 TFSI 2.0',
      slug: '40-tfsi',
      engine_codes: ['DADA'],
      fuel_type: 'BENZIN',
      year_from: 2019,
      year_to: 2024,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const category = await db
    .insertInto('category')
    .values({
      code: 'HAVA_FILTRESI',
      name: 'Hava Filtreleri',
      slug: 'hava-filtreleri',
      path: 'hava-filtreleri',
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const productBrand = await db
    .insertInto('product_brand')
    .values({ name: 'MANN-FILTER', slug: 'mann-filter' })
    .returning('id')
    .executeTakeFirstOrThrow()

  const product = await db
    .insertInto('product')
    .values({
      sku: 'MANN-C35154',
      slug: 'mann-c-35-154',
      name: 'Hava Filtresi',
      product_code: 'C 35 154',
      brand_id: productBrand.id,
      category_id: category.id,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const product2 = await db
    .insertInto('product')
    .values({
      sku: 'MANN-W71241',
      slug: 'mann-w-712-41',
      name: 'Yağ Filtresi',
      product_code: 'W 712/41',
      brand_id: productBrand.id,
      category_id: category.id,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  // Fiyat/stok — indeks testleri için
  for (const pid of [product.id, product2.id]) {
    const variant = await db
      .insertInto('product_variant')
      .values({ product_id: pid, sku: `V-${pid}`, is_default: true })
      .returning('id')
      .executeTakeFirstOrThrow()
    await db
      .insertInto('price')
      .values({ variant_id: variant.id, price_net: 1000, tax_rate: 20 })
      .execute()
    await db.insertInto('stock').values({ variant_id: variant.id, quantity: 5 }).execute()
  }

  return {
    sources,
    engineId: engine.id,
    engineId2: engine2.id,
    productId: product.id,
    productId2: product2.id,
    categoryId: category.id,
  }
}

export async function addAssertion(
  db: Kysely<Database>,
  input: {
    productId: number
    engineId: number
    sourceId: number
    type?: 'COMPATIBLE' | 'INCOMPATIBLE'
    yearFrom?: number
    yearTo?: number
    restriction?: string
    isActive?: boolean
  },
): Promise<number> {
  const row = await db
    .insertInto('compatibility_assertion')
    .values({
      product_id: input.productId,
      engine_id: input.engineId,
      source_id: input.sourceId,
      assertion_type: input.type ?? 'COMPATIBLE',
      year_from: input.yearFrom ?? null,
      year_to: input.yearTo ?? null,
      restriction: input.restriction ?? null,
      is_active: input.isActive ?? true,
    })
    .returning('id')
    .executeTakeFirstOrThrow()
  return row.id
}
