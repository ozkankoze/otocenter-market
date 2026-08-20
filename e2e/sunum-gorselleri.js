/**
 * MÜŞTERİ SUNUMU İÇİN EKRAN GÖRÜNTÜLERİ
 *
 * Retina kalitesinde (2x) 6 görsel üretir. Test/senaryo betiklerinden farkı:
 * burada doğrulama yapılmaz, yalnızca temiz ve sunuma uygun kareler alınır.
 *
 * Çalıştırma: node e2e/sunum-gorselleri.js
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright')
const { Client } = require('pg')
const fs = require('node:fs')

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const OUT = process.env.SHOT_DIR ?? '/home/claude/otocenter-plan/sunum'
fs.mkdirSync(OUT, { recursive: true })

async function db(sql, params = []) {
  const c = new Client({ connectionString: process.env.DATABASE_URL })
  await c.connect()
  try {
    return (await c.query(sql, params)).rows
  } finally {
    await c.end()
  }
}

async function selectVehicle(page, engineId) {
  await page.evaluate(
    (id) =>
      fetch('/api/vehicles/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engineId: id }),
      }).then((r) => r.status),
    engineId,
  )
}

/** Sayfa üstünden verilen yükseklikte temiz bir kare al. */
async function shot(page, name, height) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  const size = page.viewportSize()
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    clip: { x: 0, y: 0, width: size.width, height: height ?? size.height },
  })
  console.log(`  ✓ ${name}.png`)
}

async function main() {
  const browser = await chromium.launch()
  // deviceScaleFactor: 2 → sunumda ve büyük ekranda net görünür
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  const [a1] = await db(`
    SELECT ve.id, ve.slug AS engine_slug, vm.slug AS model_slug, vb.slug AS brand_slug,
           vt.slug AS type_slug
    FROM vehicle_engine ve
    JOIN vehicle_model vm ON vm.id = ve.model_id
    JOIN vehicle_brand vb ON vb.id = vm.brand_id
    JOIN vehicle_brand_type vbt ON vbt.brand_id = vb.id
    JOIN vehicle_type vt ON vt.id = vbt.type_id
    WHERE vb.slug = 'audi' AND vm.slug = 'a1-gb' AND ve.slug LIKE '30-tfsi%'
  `)

  const [urun] = await db(
    `SELECT p.slug FROM product_compatibility pc
     JOIN product p ON p.id = pc.product_id AND p.status = 'ACTIVE'
     JOIN product_variant v ON v.product_id = p.id AND v.is_default
     JOIN stock st ON st.variant_id = v.id
     WHERE pc.engine_id = $1 AND pc.status IN ('VERIFIED','SOURCED') AND st.quantity > 0
     ORDER BY p.id LIMIT 1`,
    [a1.id],
  )

  console.log('\nSUNUM GÖRSELLERİ ÜRETİLİYOR (2x retina)\n')

  // ── 1. ANA SAYFA — araç seçmeden ─────────────────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await shot(page, '01-ana-sayfa', 950)

  // ── 2. ARAÇ SEÇİLDİ → UYUMLU ÜRÜNLER ─────────────────────────────────────
  await selectVehicle(page, a1.id)
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="result-bar"]')
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo(0, y)
    }
  })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/02-arac-secildi-uyumlu-urunler.png` })
  console.log('  ✓ 02-arac-secildi-uyumlu-urunler.png')

  // ── 3. KATEGORİ LİSTELEME + FİLTRELER ────────────────────────────────────
  await page.goto(`${BASE}/filtreler/hava-filtreleri`, { waitUntil: 'networkidle' })
  await shot(page, '03-kategori-filtreler', 1180)

  // ── 4. ÜRÜN DETAY — uyumluluk yeşil ──────────────────────────────────────
  await page.goto(`${BASE}/urun/${urun.slug}`, { waitUntil: 'networkidle' })
  await shot(page, '04-urun-detay', 950)

  // ── 5. ARAÇ SONUÇ SAYFASI ────────────────────────────────────────────────
  await page.goto(
    `${BASE}/${a1.type_slug}/${a1.brand_slug}/${a1.model_slug}/${a1.engine_slug}`,
    { waitUntil: 'networkidle' },
  )
  await shot(page, '05-arac-uyumlu-parcalar', 1180)

  // ── 6. MOBİL — ana sayfa + menü yan yana ─────────────────────────────────
  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })
  const m1 = await mobCtx.newPage()
  await m1.goto(BASE, { waitUntil: 'networkidle' })
  await selectVehicle(m1, a1.id)
  await m1.goto(BASE, { waitUntil: 'networkidle' })
  await m1.waitForTimeout(600)
  await m1.screenshot({ path: `${OUT}/06a-mobil-ana-sayfa.png` })

  const m2 = await mobCtx.newPage()
  await m2.goto(`${BASE}/filtreler/hava-filtreleri`, { waitUntil: 'networkidle' })
  await m2.waitForTimeout(500)
  await m2.screenshot({ path: `${OUT}/06b-mobil-kategori.png` })
  console.log('  ✓ 06a-mobil-ana-sayfa.png · 06b-mobil-kategori.png')

  // ── 7. YÖNETİM PANELİ — içe aktarma önizlemesi ───────────────────────────
  await page.goto(`${BASE}/admin/giris`, { waitUntil: 'networkidle' })
  await page.fill('input[name="email"]', 'admin@otocentermarket.com')
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'otocenter')
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ])
  await page.waitForSelector('[data-testid="admin-main"]')
  await shot(page, '07-yonetim-paneli', 1000)

  await browser.close()
  console.log(`\nTamamlandı → ${OUT}\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
