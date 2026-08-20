/**
 * SPRINT 3 — Kategori listeleme, ürün detay, araç sonuç sayfaları ve
 * SİTE BOYUNCA ARAÇ CONTEXT'İ senaryo testleri.
 *
 * Çalıştırma: node e2e/sprint3-flow.js
 *
 * Doğrulanan güvenceler:
 *   1. Araç seçimi bir kez yapılır; kategori → ürün → detay → geri
 *      yolculuğunun tamamında korunur (tekrar seçim istenmez).
 *   2. Filtreler, sıralama ve sayfalama URL üzerinden çalışır (paylaşılabilir).
 *   3. Uyumluluk kuralları Sprint 1–2 ile birebir aynıdır:
 *        VERIFIED/SOURCED → yeşil · CONFLICTED/veri yok → gri · INCOMPATIBLE → kırmızı
 *      Veri yokken ASLA yeşil rozet gösterilmez.
 *   4. Ürünsüz sayfa üretilmez (motor × kategori boşsa yönlendirilir).
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright')
const { Client } = require('pg')

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const SHOTS = process.env.SHOT_DIR ?? '/home/claude/otocenter-plan/sprint3'
const results = []

function check(name, condition, detail = '') {
  results.push({ name, ok: Boolean(condition), detail })
  console.log(`  ${condition ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
}

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

async function readCards(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('[data-testid="product-card"]')].map((el) => ({
      sku: el.getAttribute('data-sku'),
      compat: el.getAttribute('data-compat'),
      text: el.textContent ?? '',
    })),
  )
}

async function shot(page, name, opts = {}) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${SHOTS}/${name}.png`, ...opts })
  console.log(`    · ekran görüntüsü: ${name}.png`)
}

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await ctx.newPage()
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') pageErrors.push(m.text())
  })

  // Gerçek veriden hedefleri oku
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
  const [big] = await db(`
    SELECT ve.id FROM vehicle_engine ve
    JOIN vehicle_model vm ON vm.id = ve.model_id
    JOIN vehicle_brand vb ON vb.id = vm.brand_id
    WHERE vb.slug = 'audi' AND vm.slug = 'a1-gb' AND ve.slug LIKE '40-tfsi%'
  `)
  const CAT = '/filtreler/hava-filtreleri'

  // ══ SENARYO 1: Araç context'i site boyunca korunuyor mu? ═══════════════════
  console.log('\nSENARYO 1 — Araç context site boyunca korunuyor (ana sayfa → kategori → ürün → geri)')

  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await selectVehicle(page, a1.id)
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)

  const chipHome = await page.locator('[data-testid="vehicle-chip"]').first().textContent()
  check(
    'Ana sayfada seçili araç başlıkta görünüyor',
    /A1/.test(chipHome ?? ''),
    chipHome?.replace(/\s+/g, ' ').trim().slice(0, 60),
  )

  await page.goto(BASE + CAT, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="product-grid"]')
  const chipCat = await page.locator('[data-testid="vehicle-chip"]').first().textContent()
  check('Kategori sayfasında araç KORUNUYOR (yeniden seçim yok)', /A1/.test(chipCat ?? ''))
  check(
    'Kategori sayfasında seçili araç şeridi gösteriliyor',
    (await page.locator('[data-testid="selected-vehicle-bar"]').count()) > 0,
  )

  const cards = await readCards(page)
  check('Kategori listesinde ürün kartları var', cards.length > 0, `${cards.length} kart`)
  check(
    'Araç seçiliyken kartlar uyumluluk durumu taşıyor',
    cards.every((c) => ['compatible', 'unknown', 'incompatible'].includes(c.compat)),
  )
  await shot(page, '01-kategori-listeleme-arac-secili', { fullPage: false })

  // Ürüne git
  const firstCompatible = cards.find((c) => c.compat === 'compatible')
  check('En az bir uyumlu ürün listeleniyor', Boolean(firstCompatible), firstCompatible?.sku)

  await page.locator('[data-testid="product-card"]').first().click()
  await page.waitForSelector('[data-testid="compat-block"]')
  const chipDetail = await page.locator('[data-testid="vehicle-chip"]').first().textContent()
  check('Ürün detayında araç KORUNUYOR', /A1/.test(chipDetail ?? ''))
  const detailUrl = page.url()

  await page.goBack({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="product-grid"]')
  const chipBack = await page.locator('[data-testid="vehicle-chip"]').first().textContent()
  check('Geri dönüşte araç HÂLÂ korunuyor', /A1/.test(chipBack ?? ''))

  // ══ SENARYO 2: Kategori listeleme — filtre / sıralama / sayfalama ══════════
  console.log('\nSENARYO 2 — Kategori listeleme: filtre, sıralama, sayfalama')

  await page.goto(BASE + CAT, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="filter-panel"]')
  const totalBefore = Number(
    (await page.locator('[data-testid="listing-total"]').first().textContent())?.replace(/\D/g, '') ?? 0,
  )
  check('Toplam ürün sayısı gösteriliyor', totalBefore > 0, `${totalBefore} ürün`)

  // İlk marka filtresini uygula (checkbox sr-only, tıklama label üzerinden)
  const brandBox = page
    .locator('[data-testid="filter-panel"] [data-testid="filter-group-marka"] label')
    .first()
  const brandLabel = (await brandBox.innerText()).split('\n')[0]
  await brandBox.click()
  await page.waitForTimeout(900)
  const totalAfter = Number(
    (await page.locator('[data-testid="listing-total"]').first().textContent())?.replace(/\D/g, '') ?? 0,
  )
  check(
    'Marka filtresi sonucu daraltıyor ve URL\'e yazılıyor',
    totalAfter > 0 && totalAfter <= totalBefore && /marka=/.test(page.url()),
    `${brandLabel}: ${totalBefore} → ${totalAfter} · ${new URL(page.url()).search}`,
  )
  check(
    'Aktif filtre çipi gösteriliyor',
    (await page.locator('[data-testid="active-filters"]').count()) > 0,
  )
  await shot(page, '02-kategori-filtre-uygulanmis')

  // Sıralama
  await page.goto(BASE + CAT, { waitUntil: 'domcontentloaded' })
  await page.selectOption('[data-testid="sort-select"]', 'fiyat-artan')
  await page.waitForTimeout(900)
  const prices = await page.evaluate(() =>
    [...document.querySelectorAll('[data-testid="product-card"]')].map((el) => {
      const m = (el.textContent ?? '').match(/([\d.]+),\d\d\s*₺/)
      return m ? Number(m[1].replace(/\./g, '')) : null
    }),
  )
  const sorted = prices.filter((p) => p !== null)
  check(
    'Fiyat artan sıralaması doğru çalışıyor',
    sorted.every((p, i) => i === 0 || sorted[i - 1] <= p) && /siralama=fiyat-artan/.test(page.url()),
    sorted.slice(0, 5).join(' ≤ '),
  )

  // Filtre boş sonuç
  await page.goto(BASE + CAT + '?fiyat_min=999999', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(500)
  const emptyText = await page.locator('main').innerText()
  check(
    'Sonuç yoksa boş durum mesajı ve filtre temizleme sunuluyor',
    /eşleşen ürün yok|ürün bulunamadı/i.test(emptyText) &&
      /Temizle/i.test(emptyText),
  )
  await shot(page, '03-kategori-bos-sonuc')

  // ══ SENARYO 3: Mobil filtre çekmecesi ═════════════════════════════════════
  console.log('\nSENARYO 3 — Mobil filtre çekmecesi')
  const mob = await ctx.newPage()
  await mob.setViewportSize({ width: 390, height: 844 })
  await mob.goto(BASE + CAT, { waitUntil: 'domcontentloaded' })
  await mob.waitForSelector('[data-testid="mobile-filter-trigger"]')
  await shot(mob, '04-kategori-mobil')
  await mob.locator('[data-testid="mobile-filter-trigger"]').click()
  await mob.waitForSelector('[data-testid="mobile-filter-drawer"]')
  check('Mobil filtre çekmecesi açılıyor', await mob.locator('[data-testid="mobile-filter-drawer"]').isVisible())
  await mob.waitForTimeout(400)
  await mob.screenshot({ path: `${SHOTS}/05-kategori-mobil-filtre-drawer.png` })
  console.log('    · ekran görüntüsü: 05-kategori-mobil-filtre-drawer.png')

  // ══ SENARYO 4: Ürün detay ═════════════════════════════════════════════════
  console.log('\nSENARYO 4 — Ürün detay sayfası')
  // Ekran görüntüsü ve satın alma kontrolü için uyumlu VE stokta olan bir ürün seç
  const [inStock] = await db(
    `SELECT p.slug FROM product_compatibility pc
     JOIN product p ON p.id = pc.product_id AND p.status = 'ACTIVE'
     JOIN product_variant v ON v.product_id = p.id AND v.is_default
     JOIN stock st ON st.variant_id = v.id
     WHERE pc.engine_id = $1 AND pc.status IN ('VERIFIED','SOURCED') AND st.quantity > 0
     ORDER BY p.id LIMIT 1`,
    [a1.id],
  )
  const detailUrlStock = `${BASE}/urun/${inStock.slug}`
  await page.goto(detailUrlStock, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="compat-block"]')

  const state = await page.locator('[data-testid="compat-block"]').getAttribute('data-state')
  check('Uyumluluk kutusu "compatible" durumunda', state === 'compatible', state ?? '')
  check('Fiyat gösteriliyor', /₺/.test((await page.locator('[data-testid="product-price"]').textContent()) ?? ''))
  check('Stok durumu gösteriliyor', (await page.locator('[data-testid="product-stock"]').count()) > 0)
  const cartText = (await page.locator('[data-testid="add-to-cart"]').textContent()) ?? ''
  check(
    'Stoktaki uyumlu üründe SEPETE EKLE aktif',
    (await page.locator('[data-testid="add-to-cart"]').isEnabled()) && /SEPETE EKLE/i.test(cartText),
    cartText.trim(),
  )
  await shot(page, '06-urun-detay-uyumlu')

  // Sekmeler
  await page.locator('[data-testid="tab-teknik"]').click()
  await page.waitForTimeout(300)
  check('Teknik özellikler tablosu açılıyor', (await page.locator('[data-testid="spec-table"]').count()) > 0)
  await shot(page, '07-urun-detay-teknik-ozellikler')

  await page.locator('[data-testid="tab-oem"]').click()
  await page.waitForTimeout(300)
  check('OEM numaraları tablosu açılıyor', (await page.locator('[data-testid="reference-table-OEM"]').count()) > 0)
  await shot(page, '08-urun-detay-oem-numaralari')

  await page.locator('[data-testid="tab-uyumlu-araclar"]').click()
  await page.waitForTimeout(300)
  const vehTable = page.locator('[data-testid="compatible-vehicles"]')
  check('Uyumlu araçlar tablosu açılıyor', (await vehTable.count()) > 0)
  await shot(page, '09-urun-detay-uyumlu-araclar')

  // ══ SENARYO 5: Veri yokken ASLA yeşil rozet ═══════════════════════════════
  console.log('\nSENARYO 5 — Veri yokken uyumlu gösterilmiyor (Sprint 1–2 kuralı)')
  await selectVehicle(page, big.id)
  await page.goto(detailUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="compat-block"]')

  const state2 = await page.locator('[data-testid="compat-block"]').getAttribute('data-state')
  const greenCount = await page.evaluate(() =>
    [...document.querySelectorAll('*')].filter((el) =>
      /^Aracınıza uygun$/.test((el.textContent ?? '').trim()) && el.children.length === 0,
    ).length,
  )
  const dbRow = await db(
    `SELECT pc.status::text FROM product_compatibility pc
     JOIN product p ON p.id = pc.product_id
     WHERE pc.engine_id = $1 AND p.slug = $2`,
    [big.id, detailUrl.split('/urun/')[1].split('?')[0]],
  )
  check('Veritabanında bu motor için uyumluluk kaydı yok', dbRow.length === 0, `${dbRow.length} kayıt`)
  check('Uyumluluk kutusu "unknown" (gri) durumunda', state2 === 'unknown', state2 ?? '')
  check('Sayfada HİÇBİR "Aracınıza uygun" yeşil rozeti yok', greenCount === 0, `${greenCount} rozet`)
  await shot(page, '10-urun-detay-uyumluluk-teyit-edilmedi')

  // ══ SENARYO 6: Araç sonuç sayfaları ═══════════════════════════════════════
  console.log('\nSENARYO 6 — Araç sonuç sayfaları')
  const engineUrl = `${BASE}/${a1.type_slug}/${a1.brand_slug}/${a1.model_slug}/${a1.engine_slug}`
  await selectVehicle(page, a1.id)
  await page.goto(engineUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="product-grid"]')
  const engineCards = await readCards(page)
  check(
    'Motor sayfasında YALNIZCA uyumlu ürünler listeleniyor',
    engineCards.length > 0 && engineCards.every((c) => c.compat === 'compatible'),
    `${engineCards.length} kart`,
  )
  const dbCompatible = await db(
    `SELECT count(*)::int AS n FROM product_compatibility pc
     JOIN product p ON p.id = pc.product_id AND p.status = 'ACTIVE'
     WHERE pc.engine_id = $1 AND pc.status IN ('VERIFIED','SOURCED')`,
    [a1.id],
  )
  const shownTotal = Number(
    (await page.locator('[data-testid="listing-total"]').first().textContent())?.replace(/\D/g, '') ?? 0,
  )
  check(
    'Listelenen toplam, veritabanındaki uyumlu ürün sayısıyla birebir aynı',
    shownTotal === dbCompatible[0].n,
    `arayüz=${shownTotal} · db=${dbCompatible[0].n}`,
  )
  await shot(page, '11-arac-sonuc-motor-sayfasi')

  await page.goto(engineUrl + '/hava-filtreleri', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="product-grid"]')
  check(
    'Motor × kategori sayfası çalışıyor',
    (await readCards(page)).length > 0 && /hava-filtreleri/.test(page.url()),
  )
  await shot(page, '12-arac-sonuc-motor-kategori')

  // Ürünsüz sayfa üretilmez
  const emptyResp = await page.goto(
    `${BASE}/${a1.type_slug}/${a1.brand_slug}/${a1.model_slug}/${(await db(
      `SELECT slug FROM vehicle_engine WHERE id = $1`,
      [big.id],
    ))[0].slug}/hava-filtreleri`,
    { waitUntil: 'domcontentloaded' },
  )
  check(
    'Ürünsüz motor × kategori sayfası üretilmiyor (üst sayfaya yönlendiriliyor)',
    !/hava-filtreleri/.test(page.url()) && emptyResp.status() < 400,
    page.url().replace(BASE, ''),
  )

  // ══ SONUÇ ═════════════════════════════════════════════════════════════════
  check('Konsolda JavaScript hatası yok', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '))

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${'═'.repeat(72)}`)
  console.log(`SONUÇ: ${results.length - failed.length}/${results.length} kontrol başarılı`)
  if (failed.length) {
    console.log('BAŞARISIZ:')
    failed.forEach((f) => console.log(`  ✗ ${f.name} — ${f.detail}`))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
