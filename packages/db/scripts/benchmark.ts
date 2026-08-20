/**
 * ════════════════════════════════════════════════════════════════════════════
 *  20M SATIR UYUMLULUK YÜK TESTİ  —  SENTETİK BENCHMARK
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  GÜVENLİK KURALI (kullanıcı şartı):
 *    Benchmark verisi gerçek seed/katalog verisinden TAMAMEN AYRIDIR.
 *    Veri, adı `_bench` ile biten AYRI BİR VERİTABANINA yazılır; script
 *    hedef veritabanı adı `_bench` ile bitmiyorsa çalışmayı reddeder.
 *    `drop` komutu ile tek satırda tamamen temizlenir.
 *
 *  Şema: gerçek 0001_init.sql aynen uygulanır. Tablo/kolon yapısı,
 *  assertion mimarisi ve HASH×16 partition stratejisi DEĞİŞTİRİLMEZ —
 *  ölçüm ancak birebir aynı şema üzerinde anlamlıdır.
 *
 *  Kullanım:
 *    npm run bench            -- setup + load + run (varsayılan)
 *    npm run bench -- setup
 *    npm run bench -- run
 *    npm run bench -- drop
 *
 *  Ölçek (env ile değiştirilebilir):
 *    BENCH_ENGINES=40000  BENCH_PRODUCTS=100000  BENCH_ROWS_PER_ENGINE=500
 *    → 40.000 × 500 = 20.000.000 product_compatibility satırı
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { loadEnv } from './env'

loadEnv()

const HERE = dirname(fileURLToPath(import.meta.url))
const SCHEMA_SQL = resolve(HERE, '../migrations/0001_init.sql')

// ─────────────────────────────── ÖLÇEK ──────────────────────────────────────

const ENGINES = Number(process.env.BENCH_ENGINES ?? 40_000)
const PRODUCTS = Number(process.env.BENCH_PRODUCTS ?? 100_000)
const ROWS_PER_ENGINE = Number(process.env.BENCH_ROWS_PER_ENGINE ?? 500)
const TARGET_ROWS = ENGINES * ROWS_PER_ENGINE

const MODELS_PER_BRAND = 10
const ENGINES_PER_MODEL = 20
const BRANDS = Math.max(1, Math.ceil(ENGINES / (MODELS_PER_BRAND * ENGINES_PER_MODEL)))
const MODELS = BRANDS * MODELS_PER_BRAND

const LEAF_CATEGORIES = 10
const PRODUCT_BRANDS = 30

/** Tek seferde yazılacak motor sayısı (batch = ENGINE_BATCH × ROWS_PER_ENGINE satır) */
const ENGINE_BATCH = Number(process.env.BENCH_ENGINE_BATCH ?? 2_000)

// ────────────────────────── BAĞLANTI & GÜVENLİK ─────────────────────────────

function benchUrl(): { url: string; adminUrl: string; dbName: string } {
  const base = process.env.BENCHMARK_DATABASE_URL ?? process.env.DATABASE_URL
  if (!base) throw new Error('DATABASE_URL tanımlı değil')

  const u = new URL(base)
  if (!process.env.BENCHMARK_DATABASE_URL) {
    // Gerçek veritabanının adını ASLA kullanma — ayrı bir isim türet.
    u.pathname = '/otocenter_bench'
    u.search = ''
  }
  const dbName = u.pathname.replace(/^\//, '')

  if (!dbName.endsWith('_bench')) {
    throw new Error(
      `GÜVENLİK: benchmark veritabanı adı "_bench" ile bitmelidir (gelen: "${dbName}"). ` +
        'Gerçek katalog verisinin üzerine yazılmasını önlemek için işlem durduruldu.',
    )
  }

  const admin = new URL(u.toString())
  admin.pathname = '/postgres'
  return { url: u.toString(), adminUrl: admin.toString(), dbName }
}

const { url: BENCH_URL, adminUrl: ADMIN_URL, dbName: BENCH_DB } = benchUrl()

async function withClient<T>(url: string, fn: (c: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

// ───────────────────────────── YARDIMCILAR ──────────────────────────────────

const t0 = Date.now()
function log(msg: string): void {
  const s = ((Date.now() - t0) / 1000).toFixed(1).padStart(6)
  console.log(`[${s}s] ${msg}`)
}

function fmt(n: number): string {
  return n.toLocaleString('tr-TR')
}

async function timed<T>(fn: () => Promise<T>): Promise<{ ms: number; value: T }> {
  const start = process.hrtime.bigint()
  const value = await fn()
  return { ms: Number(process.hrtime.bigint() - start) / 1e6, value }
}

function stats(samples: number[]): { p50: number; p95: number; max: number; avg: number } {
  const s = [...samples].sort((a, b) => a - b)
  const at = (q: number) => s[Math.min(s.length - 1, Math.floor(q * s.length))] ?? 0
  return {
    p50: at(0.5),
    p95: at(0.95),
    max: s[s.length - 1] ?? 0,
    avg: s.reduce((a, b) => a + b, 0) / (s.length || 1),
  }
}

// ═══════════════════════════════ SETUP ══════════════════════════════════════

async function createDatabase(): Promise<void> {
  await withClient(ADMIN_URL, async (c) => {
    await c.query(`DROP DATABASE IF EXISTS ${BENCH_DB} WITH (FORCE)`)
    await c.query(`CREATE DATABASE ${BENCH_DB}`)
  })
  log(`Benchmark veritabanı oluşturuldu: ${BENCH_DB} (gerçek katalogdan ayrı)`)
}

async function applySchema(): Promise<void> {
  const sql = readFileSync(SCHEMA_SQL, 'utf8')
  await withClient(BENCH_URL, async (c) => {
    await c.query(sql)
  })
  log('Gerçek şema (0001_init.sql) uygulandı — partition/index birebir aynı')
}

async function loadReferenceData(): Promise<void> {
  await withClient(BENCH_URL, async (c) => {
    await c.query('SET synchronous_commit = off')
    await c.query(`SET maintenance_work_mem = '512MB'`)

    // ── Araç ağacı ────────────────────────────────────────────────────────
    await c.query(`
      INSERT INTO vehicle_type (name, slug) VALUES ('BENCH Otomobil', 'bench-otomobil');

      INSERT INTO vehicle_brand (name, slug, sort_order)
      SELECT 'BENCH Marka ' || i, 'bench-marka-' || i, i
      FROM generate_series(1, ${BRANDS}) i;

      INSERT INTO vehicle_brand_type (brand_id, type_id)
      SELECT b.id, (SELECT id FROM vehicle_type LIMIT 1) FROM vehicle_brand b;

      INSERT INTO vehicle_model (brand_id, name, slug, year_from, year_to)
      SELECT b.id, 'BENCH Model ' || b.id || '-' || k, 'bench-model-' || b.id || '-' || k,
             2005 + (k % 15), 2015 + (k % 10)
      FROM vehicle_brand b, generate_series(1, ${MODELS_PER_BRAND}) k;

      INSERT INTO vehicle_generation (model_id, name, year_from, year_to)
      SELECT m.id, 'BENCH Nesil ' || m.id, m.year_from, m.year_to FROM vehicle_model m;

      INSERT INTO vehicle_engine
        (generation_id, model_id, name, slug, engine_codes, displacement_cc,
         power_kw, power_hp, fuel_type, year_from, year_to)
      SELECT g.id, g.model_id,
             'BENCH Motor ' || g.model_id || '-' || k,
             'bench-motor-' || g.model_id || '-' || k,
             ARRAY['BM' || g.model_id || k],
             1000 + (k * 137) % 2500,
             70 + (k * 7) % 130,
             95 + (k * 9) % 180,
             (ARRAY['DIZEL','BENZIN','LPG','HIBRIT']::vehicle_fuel_type[])[1 + (k % 4)],
             g.year_from, g.year_to
      FROM vehicle_generation g, generate_series(1, ${ENGINES_PER_MODEL}) k;
    `)
    log(`Araç ağacı: ${fmt(BRANDS)} marka · ${fmt(MODELS)} model · ${fmt(ENGINES)} motor`)

    // ── Katalog ───────────────────────────────────────────────────────────
    await c.query(`
      INSERT INTO category (parent_id, code, name, slug, path, depth, sort_order)
      VALUES (NULL, 'BENCH_ROOT', 'BENCH Kök', 'bench-kok', 'bench-kok', 0, 0);

      INSERT INTO category (parent_id, code, name, slug, path, depth, sort_order)
      SELECT (SELECT id FROM category WHERE code = 'BENCH_ROOT'),
             'BENCH_CAT_' || i, 'BENCH Kategori ' || i, 'bench-kategori-' || i,
             'bench-kok.bench-kategori-' || i, 1, i
      FROM generate_series(1, ${LEAF_CATEGORIES}) i;

      INSERT INTO category_attribute (category_id, key, label, data_type, unit, is_facet, sort_order)
      SELECT c.id, 'bench_ozellik', 'BENCH Özellik', 'ENUM', NULL, TRUE, 1
      FROM category c WHERE c.depth = 1;

      INSERT INTO product_brand (name, slug, sort_order)
      SELECT 'BENCH Üretici ' || i, 'bench-uretici-' || i, i
      FROM generate_series(1, ${PRODUCT_BRANDS}) i;
    `)

    await c.query(`
      INSERT INTO product (sku, slug, name, product_code, brand_id, category_id, specs, status, sort_weight)
      SELECT 'BENCH-SKU-' || i,
             'bench-urun-' || i,
             'BENCH Ürün ' || i,
             'BC ' || i,
             (SELECT min(id) FROM product_brand) + (i % ${PRODUCT_BRANDS}),
             (SELECT min(id) FROM category WHERE depth = 1) + (i % ${LEAF_CATEGORIES}),
             jsonb_build_object('bench_ozellik', 'V' || (i % 8)),
             'ACTIVE',
             i % 1000
      FROM generate_series(1, ${PRODUCTS}) i;
    `)

    await c.query(`
      INSERT INTO product_variant (product_id, sku, name, is_default)
      SELECT p.id, p.sku || '-V1', 'Tekli', TRUE FROM product p;

      INSERT INTO price (variant_id, price_net, tax_rate, list_price)
      SELECT v.id, 100 + (v.id % 4000)::numeric, 20, 120 + (v.id % 4000)::numeric
      FROM product_variant v;

      INSERT INTO stock (variant_id, quantity, lead_time_days)
      SELECT v.id, (v.id % 40), CASE WHEN v.id % 40 = 0 THEN 5 ELSE NULL END
      FROM product_variant v;
    `)
    log(`Katalog: ${fmt(PRODUCTS)} ürün · ${fmt(PRODUCTS)} varyant · fiyat + stok`)

    await c.query(`
      INSERT INTO data_source (code, name, kind, trust_level, is_active)
      VALUES ('BENCH', 'BENCH Sentetik Kaynak', 'DERIVED', 40, TRUE)
    `)
  })
}

/**
 * 20M satır product_compatibility üretimi.
 *
 * Ürün seçimi determinist: engine e için k. ürün
 *   ((e * 37 + k * 211) mod PRODUCTS) + 1
 * gcd(211, 100000) = 1 olduğundan k < 500 için ürün id'leri ÇAKIŞMAZ →
 * (engine_id, product_id) birincil anahtarı ihlal edilmez.
 *
 * Durum dağılımı gerçek hayata yakın tutuldu:
 *   ~%12 VERIFIED · ~%80 SOURCED · ~%5 CONFLICTED · ~%3 INCOMPATIBLE
 * CONFLICTED satırlar has_conflict = TRUE alır (admin kuyruğu ölçümü için).
 */
async function loadCompatibility(): Promise<void> {
  await withClient(BENCH_URL, async (c) => {
    await c.query('SET synchronous_commit = off')
    await c.query(`SET maintenance_work_mem = '1GB'`)
    await c.query(`SET work_mem = '256MB'`)

    const { rows } = await c.query<{ min: string; max: string }>(
      'SELECT min(id)::text AS min, max(id)::text AS max FROM vehicle_engine',
    )
    const minEngine = Number(rows[0]!.min)
    const maxEngine = Number(rows[0]!.max)
    const { rows: prodRows } = await c.query<{ min: string }>(
      'SELECT min(id)::text AS min FROM product',
    )
    const minProduct = Number(prodRows[0]!.min)

    const start = Date.now()
    let written = 0

    for (let from = minEngine; from <= maxEngine; from += ENGINE_BATCH) {
      const to = Math.min(maxEngine, from + ENGINE_BATCH - 1)
      const res = await c.query(
        `
        INSERT INTO product_compatibility
          (engine_id, product_id, status, year_from, year_to, restriction,
           source_id, confidence, has_conflict, updated_at)
        SELECT e AS engine_id,
               ${minProduct} + ((e * 37 + k * 211) % ${PRODUCTS}) AS product_id,
               CASE
                 WHEN (e + k) % 100 < 12 THEN 'VERIFIED'
                 WHEN (e + k) % 100 < 92 THEN 'SOURCED'
                 WHEN (e + k) % 100 < 97 THEN 'CONFLICTED'
                 ELSE 'INCOMPATIBLE'
               END::compat_status,
               2005 + ((e + k) % 15),
               2015 + ((e + k) % 10),
               CASE WHEN (e + k) % 23 = 0 THEN 'BENCH: yalnızca belirli şasi aralığı' END,
               (SELECT id FROM data_source WHERE code = 'BENCH'),
               50 + ((e + k) % 50),
               ((e + k) % 100 >= 92 AND (e + k) % 100 < 97),
               now()
        FROM generate_series($1::bigint, $2::bigint) e,
             generate_series(0, ${ROWS_PER_ENGINE - 1}) k
        `,
        [from, to],
      )
      written += res.rowCount ?? 0
      const pct = ((written / TARGET_ROWS) * 100).toFixed(1)
      const rate = written / ((Date.now() - start) / 1000)
      log(
        `  uyumluluk: ${fmt(written)} / ${fmt(TARGET_ROWS)} satır (%${pct}) · ${fmt(Math.round(rate))} satır/sn`,
      )
    }

    log('ANALYZE çalışıyor...')
    await c.query('ANALYZE product_compatibility')
    await c.query('ANALYZE product')
    await c.query('ANALYZE vehicle_engine')
    log(`Yükleme tamamlandı: ${fmt(written)} satır`)
  })
}

/** Referans bütünlüğü kanıtı — sentetik veri gerçek FK'lara uyuyor mu. */
async function verifyIntegrity(): Promise<void> {
  await withClient(BENCH_URL, async (c) => {
    const { rows } = await c.query<{
      orphan_engine: string
      orphan_product: string
      total: string
    }>(`
      SELECT
        (SELECT count(*)::text FROM product_compatibility pc
          LEFT JOIN vehicle_engine e ON e.id = pc.engine_id WHERE e.id IS NULL) AS orphan_engine,
        (SELECT count(*)::text FROM product_compatibility pc
          LEFT JOIN product p ON p.id = pc.product_id WHERE p.id IS NULL) AS orphan_product,
        (SELECT count(*)::text FROM product_compatibility) AS total
    `)
    const r = rows[0]!
    log(
      `Bütünlük: ${fmt(Number(r.total))} satır · sahipsiz motor=${r.orphan_engine} · sahipsiz ürün=${r.orphan_product}`,
    )
    if (r.orphan_engine !== '0' || r.orphan_product !== '0') {
      throw new Error('Sentetik veri referans bütünlüğünü bozuyor — benchmark geçersiz')
    }
  })
}

// ═══════════════════════════════ SORGULAR ═══════════════════════════════════

/** Motor → uyumlu ürün listesi (kategori sayfası / araç sonuç sayfası ile birebir aynı şekil) */
const Q_ENGINE_LISTING = `
  SELECT p.id, p.sku, p.name, b.name AS brand_name, c.name AS category_name,
         pr.price_net, coalesce(st.quantity, 0) AS quantity,
         pc.status::text, pc.restriction
  FROM product_compatibility pc
  JOIN product p            ON p.id = pc.product_id AND p.status = 'ACTIVE'
  JOIN product_brand b      ON b.id = p.brand_id
  JOIN category c           ON c.id = p.category_id
  LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
  LEFT JOIN price pr          ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
  LEFT JOIN stock st          ON st.variant_id = v.id
  WHERE pc.engine_id = $1
    AND pc.status IN ('VERIFIED','SOURCED')
  ORDER BY (pc.restriction IS NOT NULL), p.sort_weight, p.id
  LIMIT 24
`

const Q_ENGINE_CATEGORY = `
  SELECT p.id, p.name, pr.price_net, pc.status::text
  FROM product_compatibility pc
  JOIN product p            ON p.id = pc.product_id AND p.status = 'ACTIVE'
  LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
  LEFT JOIN price pr          ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
  WHERE pc.engine_id = $1
    AND pc.status IN ('VERIFIED','SOURCED')
    AND p.category_id = $2
  ORDER BY pr.price_net NULLS LAST, p.id
  LIMIT 24
`

const Q_COUNT = `
  SELECT count(*) FROM product_compatibility pc
  JOIN product p ON p.id = pc.product_id AND p.status = 'ACTIVE'
  WHERE pc.engine_id = $1 AND pc.status IN ('VERIFIED','SOURCED') AND p.category_id = $2
`

const Q_FACETS = `
  SELECT b.slug, b.name, count(*) AS n
  FROM product_compatibility pc
  JOIN product p       ON p.id = pc.product_id AND p.status = 'ACTIVE'
  JOIN product_brand b ON b.id = p.brand_id
  WHERE pc.engine_id = $1 AND pc.status IN ('VERIFIED','SOURCED')
  GROUP BY b.slug, b.name
  ORDER BY n DESC
`

/** Ürün detayı → uyumlu araçlar tablosu (product_id yönü — ters index) */
const Q_PRODUCT_VEHICLES = `
  SELECT vb.name AS brand_name, vm.name AS model_name, e.name AS engine_name,
         pc.status::text, pc.year_from, pc.year_to
  FROM product_compatibility pc
  JOIN vehicle_engine e ON e.id = pc.engine_id
  JOIN vehicle_model vm ON vm.id = e.model_id
  JOIN vehicle_brand vb ON vb.id = vm.brand_id
  WHERE pc.product_id = $1
  ORDER BY vb.name, vm.name, e.name
  LIMIT 25
`

/** Ürün detayı uyumluluk kutusu — tek satır PK araması (en sık çağrı) */
const Q_SINGLE = `SELECT status::text, restriction FROM product_compatibility WHERE engine_id = $1 AND product_id = $2`

/** Admin çakışma kuyruğu — 20M içinde has_conflict taraması */
const Q_CONFLICTS = `SELECT count(*) FROM product_compatibility WHERE engine_id = $1 AND has_conflict`

async function runQueries(): Promise<void> {
  await withClient(BENCH_URL, async (c) => {
    const { rows: ids } = await c.query<{ id: string }>(
      'SELECT id::text FROM vehicle_engine ORDER BY random() LIMIT 60',
    )
    const engineIds = ids.map((r) => Number(r.id))
    const { rows: cats } = await c.query<{ id: number }>(
      'SELECT id FROM category WHERE depth = 1 ORDER BY id',
    )
    const catIds = cats.map((r) => r.id)
    const { rows: prods } = await c.query<{ id: string }>(
      'SELECT id::text FROM product ORDER BY random() LIMIT 60',
    )
    const productIds = prods.map((r) => Number(r.id))

    const results: Array<{ name: string; s: ReturnType<typeof stats>; rows: number }> = []

    async function bench(
      name: string,
      sql: string,
      argsFor: (i: number) => unknown[],
      runs = 40,
    ): Promise<void> {
      // ısınma
      for (let i = 0; i < 3; i++) await c.query(sql, argsFor(i))
      const samples: number[] = []
      let lastRows = 0
      for (let i = 0; i < runs; i++) {
        const { ms, value } = await timed(() => c.query(sql, argsFor(i)))
        samples.push(ms)
        lastRows = value.rowCount ?? 0
      }
      results.push({ name, s: stats(samples), rows: lastRows })
    }

    const eng = (i: number) => engineIds[i % engineIds.length]!
    const cat = (i: number) => catIds[i % catIds.length]!
    const prod = (i: number) => productIds[i % productIds.length]!

    await bench('Motor → uyumlu ürünler (sayfa 1, 24 kayıt)', Q_ENGINE_LISTING, (i) => [eng(i)])
    await bench('Motor + kategori listeleme', Q_ENGINE_CATEGORY, (i) => [eng(i), cat(i)])
    await bench('Sayfalama COUNT(*)', Q_COUNT, (i) => [eng(i), cat(i)])
    await bench('Marka facet toplaması', Q_FACETS, (i) => [eng(i)])
    await bench('Ürün → uyumlu araçlar (25 kayıt)', Q_PRODUCT_VEHICLES, (i) => [prod(i)])
    await bench('Tek satır uyumluluk (PK)', Q_SINGLE, (i) => [eng(i), prod(i)], 200)
    await bench('Çakışma sayımı (has_conflict)', Q_CONFLICTS, (i) => [eng(i)])

    const { rows: totalRows } = await c.query<{ n: string }>(
      'SELECT count(*)::text AS n FROM product_compatibility',
    )
    const loadedRows = Number(totalRows[0]!.n)

    console.log(
      `\n┌─ SORGU GECİKMELERİ (${fmt(loadedRows)} satır) ${'─'.repeat(Math.max(0, 50 - fmt(loadedRows).length))}┐`,
    )
    console.log(
      '│ ' + 'Sorgu'.padEnd(42) + 'p50'.padStart(8) + 'p95'.padStart(8) + 'max'.padStart(9) + ' │',
    )
    console.log('├' + '─'.repeat(73) + '┤')
    for (const r of results) {
      console.log(
        '│ ' +
          r.name.padEnd(42) +
          `${r.s.p50.toFixed(2)}ms`.padStart(8) +
          `${r.s.p95.toFixed(2)}ms`.padStart(8) +
          `${r.s.max.toFixed(2)}ms`.padStart(9) +
          ' │',
      )
    }
    console.log('└' + '─'.repeat(73) + '┘\n')

    // ── Partition pruning kanıtı ─────────────────────────────────────────
    const plan = await c.query<{ 'QUERY PLAN': string }>(
      `EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
       SELECT product_id FROM product_compatibility
       WHERE engine_id = ${engineIds[0]} AND status IN ('VERIFIED','SOURCED')`,
    )
    const planText = plan.rows.map((r) => r['QUERY PLAN']).join('\n')
    const scanned = new Set(planText.match(/product_compatibility_p(\d\d)/g) ?? []).size
    console.log('── PARTITION PRUNING KANITI ─────────────────────────────────────────────')
    console.log(planText)
    console.log(
      `\n→ 16 partition'dan ${scanned} tanesi taranıyor. ` +
        (scanned === 1 ? '✓ Pruning çalışıyor.' : '✗ BEKLENMEYEN: pruning devre dışı!'),
    )

    // ── Listeleme sorgusunun planı ───────────────────────────────────────
    const listPlan = await c.query<{ 'QUERY PLAN': string }>(
      `EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) ${Q_ENGINE_LISTING.replace('$1', String(engineIds[0]))}`,
    )
    console.log('\n── MOTOR → ÜRÜN LİSTELEME PLANI ─────────────────────────────────────────')
    console.log(listPlan.rows.map((r) => r['QUERY PLAN']).join('\n'))

    // ── engine_category_index toplu yeniden inşası (gece işi) ────────────
    console.log('\n── TOPLU İŞ: engine_category_index yeniden inşası ───────────────────────')
    const rebuild = await timed(() =>
      c.query(`
        TRUNCATE engine_category_index;
        INSERT INTO engine_category_index
          (engine_id, category_id, product_count, verified_count, brand_count, min_price, max_price)
        SELECT pc.engine_id, p.category_id,
               count(*),
               count(*) FILTER (WHERE pc.status = 'VERIFIED'),
               count(DISTINCT p.brand_id),
               min(pr.price_net), max(pr.price_net)
        FROM product_compatibility pc
        JOIN product p ON p.id = pc.product_id AND p.status = 'ACTIVE'
        LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
        LEFT JOIN price pr ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
        WHERE pc.status IN ('VERIFIED','SOURCED')
        GROUP BY pc.engine_id, p.category_id
      `),
    )
    const { rows: eciRows } = await c.query<{ n: string }>(
      'SELECT count(*)::text AS n FROM engine_category_index',
    )
    console.log(
      `${fmt(loadedRows)} satır → ${fmt(Number(eciRows[0]!.n))} özet satır · ` +
        `${(rebuild.ms / 1000).toFixed(1)} sn`,
    )

    // ── Boyutlar ─────────────────────────────────────────────────────────
    const sizes = await c.query<{ rel: string; size: string; bytes: string }>(`
      SELECT relname AS rel,
             pg_size_pretty(pg_total_relation_size(c.oid)) AS size,
             pg_total_relation_size(c.oid)::text AS bytes
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND relname ~ '^product_compatibility_p[0-9]{2}$'
      ORDER BY relname
    `)
    const total = sizes.rows.reduce((a, r) => a + Number(r.bytes), 0)
    const min = Math.min(...sizes.rows.map((r) => Number(r.bytes)))
    const max = Math.max(...sizes.rows.map((r) => Number(r.bytes)))
    console.log('\n── PARTITION DAĞILIMI ───────────────────────────────────────────────────')
    console.log(sizes.rows.map((r) => `${r.rel}: ${r.size}`).join('  |  '))
    console.log(
      `Toplam: ${(total / 1024 ** 3).toFixed(2)} GB · en küçük/en büyük partition farkı: %${(((max - min) / max) * 100).toFixed(1)}`,
    )

    const db = await c.query<{ size: string }>(
      `SELECT pg_size_pretty(pg_database_size(current_database())) AS size`,
    )
    console.log(`Benchmark veritabanı toplam boyutu: ${db.rows[0]!.size}`)
  })
}

// ═══════════════════ EŞZAMANLI YÜK (THROUGHPUT) ════════════════════════════

/**
 * Gerçek trafiği taklit eder: N eşzamanlı bağlantı, DURATION_MS boyunca
 * durmadan "motor → uyumlu ürünler" sorgusu atar. Ölçülen: saniyedeki sorgu
 * (QPS) ve p95 gecikme.
 */
async function runConcurrency(): Promise<void> {
  const CLIENTS = Number(process.env.BENCH_CLIENTS ?? 16)
  const DURATION_MS = Number(process.env.BENCH_DURATION_MS ?? 15_000)

  const pool = new pg.Pool({ connectionString: BENCH_URL, max: CLIENTS })
  const probe = await pool.query<{ id: string }>(
    'SELECT id::text FROM vehicle_engine ORDER BY random() LIMIT 500',
  )
  const ids = probe.rows.map((r) => Number(r.id))

  const samples: number[] = []
  const deadline = Date.now() + DURATION_MS
  let n = 0

  await Promise.all(
    Array.from({ length: CLIENTS }, async (_, w) => {
      let i = w
      while (Date.now() < deadline) {
        const { ms } = await timed(() => pool.query(Q_ENGINE_LISTING, [ids[i % ids.length]]))
        samples.push(ms)
        n++
        i += CLIENTS
      }
    }),
  )
  await pool.end()

  const s = stats(samples)
  const qps = n / (DURATION_MS / 1000)
  console.log('\n── EŞZAMANLI YÜK ────────────────────────────────────────────────────────')
  console.log(
    `${CLIENTS} eşzamanlı istemci · ${(DURATION_MS / 1000).toFixed(0)} sn · ` +
      `${fmt(n)} sorgu → ${fmt(Math.round(qps))} sorgu/sn`,
  )
  console.log(
    `Gecikme: p50 ${s.p50.toFixed(1)}ms · p95 ${s.p95.toFixed(1)}ms · max ${s.max.toFixed(1)}ms`,
  )
}

// ═══════════════════════════════ TEMİZLİK ═══════════════════════════════════

async function drop(): Promise<void> {
  await withClient(ADMIN_URL, async (c) => {
    await c.query(`DROP DATABASE IF EXISTS ${BENCH_DB} WITH (FORCE)`)
  })
  log(`Benchmark veritabanı silindi: ${BENCH_DB} — gerçek katalog etkilenmedi`)
}

// ═══════════════════════════════ GİRİŞ ══════════════════════════════════════

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? 'all'
  log(`Hedef: ${BENCH_DB} · ${fmt(TARGET_ROWS)} satır hedefleniyor`)

  switch (cmd) {
    case 'setup':
      await createDatabase()
      await applySchema()
      await loadReferenceData()
      await loadCompatibility()
      await verifyIntegrity()
      break
    case 'run':
      await runQueries()
      await runConcurrency()
      break
    case 'drop':
      await drop()
      break
    case 'all':
      await createDatabase()
      await applySchema()
      await loadReferenceData()
      await loadCompatibility()
      await verifyIntegrity()
      await runQueries()
      await runConcurrency()
      break
    default:
      console.error('Kullanım: benchmark.ts [all|setup|run|drop]')
      process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
