/**
 * Araç → motor → uyumluluk akışı senaryo testleri.
 *
 * Gerçek sunucuya karşı çalışır: node e2e/vehicle-flow.js
 * Doğrulanan güvenceler:
 *   · Kademeli seçim kilitleri ve veri doğruluğu
 *   · Farklı motorların FARKLI sonuç üretmesi
 *   · Veri olmayan / çelişkili kombinasyonlarda ASLA "uyumlu" gösterilmemesi
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright')
const { Client } = require('pg')
const { execSync } = require('node:child_process')

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const results = []

function check(name, condition, detail = '') {
  results.push({ name, ok: Boolean(condition), detail })
  const mark = condition ? '✓' : '✗'
  console.log(`  ${mark} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function selectVehicleByApi(page, engineId) {
  await page.evaluate(
    (id) =>
      fetch('/api/vehicles/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engineId: id }),
      }).then((r) => r.status),
    engineId,
  )
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(900)
}

async function readCards(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('[data-testid="product-card"]')].map((el) => ({
      sku: el.getAttribute('data-sku'),
      compat: el.getAttribute('data-compat'),
      badge: el.querySelector('span.h-6')?.textContent?.trim() ?? '',
      badges: [...el.querySelectorAll('span.h-6')].map((b) => b.textContent.trim()),
    })),
  )
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

  // ── SENARYO 1: kademeli seçim ──────────────────────────────────────────────
  console.log('\nSENARYO 1 — Kademeli araç seçimi (Audi A1 30 TFSI)')
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="vehicle-selector"]')
  await page.waitForTimeout(600)

  const sel = page.locator('[data-testid="vehicle-selector"]')
  check(
    'Başlangıçta 2., 3. ve 4. adım kilitli',
    (await sel.locator('select').nth(1).isDisabled()) &&
      (await sel.locator('select').nth(2).isDisabled()) &&
      (await sel.locator('select').nth(3).isDisabled()),
  )
  check(
    'Başlangıçta buton pasif',
    await page.locator('[data-testid="vehicle-submit"]').isDisabled(),
  )

  await sel.locator('select').nth(0).selectOption({ label: 'Otomobil & Hafif Ticari' })
  await page.waitForTimeout(600)
  check('Araç tipi seçilince marka açıldı', !(await sel.locator('select').nth(1).isDisabled()))

  await sel.locator('select').nth(1).selectOption({ label: 'AUDI' })
  await page.waitForTimeout(600)
  const models = (await sel.locator('select').nth(2).locator('option').allTextContents()).filter(
    (t) => !t.includes('seçiniz'),
  )
  check('AUDI modelleri yüklendi', models.length === 4, models.join(' | '))

  await sel.locator('select').nth(2).selectOption({ index: 1 }) // A1 (GB)
  await page.waitForTimeout(600)
  const engines = (await sel.locator('select').nth(3).locator('option').allTextContents()).filter(
    (t) => !t.includes('seçiniz'),
  )
  check('A1 motorları yüklendi', engines.length === 3, engines.join(' | '))

  await sel.locator('select').nth(3).selectOption({ index: 1 }) // 30 TFSI
  check(
    'Motor seçilince buton aktif',
    !(await page.locator('[data-testid="vehicle-submit"]').isDisabled()),
  )

  await page.click('[data-testid="vehicle-submit"]')
  await page.waitForTimeout(2200)
  check(
    'Seçili araç şeridi göründü',
    await page.locator('[data-testid="selected-vehicle-bar"]').isVisible(),
  )
  check('Header araç çipi göründü', await page.locator('[data-testid="vehicle-chip"]').isVisible())

  const total30 = await page.locator('[data-testid="result-total"]').textContent()
  const cards30 = await readCards(page)
  check('30 TFSI için sonuç üretildi', Number(total30) > 0, `${total30} ürün`)
  check(
    '30 TFSI kartlarının tamamı yeşil rozetli',
    cards30.every((c) => c.compat === 'compatible'),
    `${cards30.filter((c) => c.compat === 'compatible').length}/${cards30.length}`,
  )

  // ── SENARYO 2: aynı model, farklı motor → farklı sonuç ─────────────────────
  console.log('\nSENARYO 2 — Aynı model, farklı motor (A1 40 TFSI)')
  const engineIds = await page.evaluate(async () => {
    const models = await (await fetch('/api/vehicles/models?brandId=1')).json()
    const a1 = models.models.find((m) => m.slug === 'a1-gb')
    const engines = await (await fetch(`/api/vehicles/engines?modelId=${a1.id}`)).json()
    return engines.engines.map((e) => ({ id: e.id, name: e.name }))
  })
  const e30 = engineIds.find((e) => e.name.includes('30 TFSI'))
  const e40 = engineIds.find((e) => e.name.includes('40 TFSI'))

  await selectVehicleByApi(page, e40.id)
  const total40 = await page.locator('[data-testid="result-total"]').textContent()
  const cards40 = await readCards(page)
  check(
    '40 TFSI farklı sonuç sayısı verdi',
    total30 !== total40,
    `30 TFSI: ${total30} · 40 TFSI: ${total40}`,
  )
  check(
    '40 TFSI listesinde ürün var',
    cards40.length > 0,
    cards40
      .map((c) => `${c.sku}:${c.compat}`)
      .slice(0, 4)
      .join(' '),
  )

  // ── SENARYO 3: çelişkili veri asla "uyumlu" görünmez ───────────────────────
  console.log('\nSENARYO 3 — Çelişkili/eksik veri güvencesi')
  const allCards = [...cards30, ...cards40]
  check(
    'Hiçbir kart hem gri hem yeşil rozet taşımıyor',
    allCards.every(
      (c) =>
        !(
          c.badges.some((b) => b.includes('Aracınıza uygun')) &&
          c.badges.some((b) => b.includes('teyit edilmedi'))
        ),
    ),
  )
  check(
    'compat=unknown olan kart yeşil rozet almıyor',
    allCards
      .filter((c) => c.compat === 'unknown')
      .every((c) => !c.badges.some((b) => b.includes('Aracınıza uygun'))),
  )
  check(
    'compat=incompatible olan kart yeşil rozet almıyor',
    allCards
      .filter((c) => c.compat === 'incompatible')
      .every((c) => !c.badges.some((b) => b.includes('Aracınıza uygun'))),
  )

  // ── SENARYO 4: veri OLMAYAN motor → asla "uyumlu" gösterilmez ────────────
  // Bu senaryo kontrollü bir deneydir: bir motorun tüm uyumluluk iddiaları
  // geçici olarak pasifleştirilir, arayüz doğrulanır, sonra geri alınır.
  console.log('\nSENARYO 4 — Veri olmayan motor (kontrollü deney)')
  const pg = new Client({ connectionString: process.env.DATABASE_URL })
  await pg.connect()
  let restored = false
  try {
    await pg.query(`UPDATE compatibility_assertion SET is_active = false WHERE engine_id = $1`, [
      e40.id,
    ])
    execSync('npm run db:reindex --silent', { stdio: 'pipe' })

    const rowCount = await pg.query(
      `SELECT count(*)::int AS n FROM product_compatibility WHERE engine_id = $1`,
      [e40.id],
    )
    check('Veritabanında motora ait uyumluluk kaydı kalmadı', rowCount.rows[0].n === 0)

    await selectVehicleByApi(page, e40.id)
    const cardsEmpty = await readCards(page)
    const bodyText = await page.locator('body').innerText()

    check(
      'Ürünsüz motorda hiçbir yeşil "uyumlu" rozeti yok',
      !cardsEmpty.some((c) => c.badges.some((b) => b.includes('Aracınıza uygun'))),
      `${cardsEmpty.length} kart`,
    )
    check(
      'Kullanıcıya açıklayıcı boş durum gösteriliyor',
      bodyText.includes('henüz uyumlu ürün eklenmedi'),
    )
    check(
      'Kategori kartlarında "Bu araç için ürün yok" yazıyor',
      bodyText.includes('Bu araç için ürün yok'),
    )
  } finally {
    await pg.query(`UPDATE compatibility_assertion SET is_active = true WHERE engine_id = $1`, [
      e40.id,
    ])
    execSync('npm run db:reindex --silent', { stdio: 'pipe' })
    await pg.end()
    restored = true
  }
  check('Deney sonrası veri geri yüklendi', restored)

  // ── SENARYO 5: araç kaldırma ──────────────────────────────────────────────
  console.log('\nSENARYO 5 — Araç seçimini kaldırma')
  await selectVehicleByApi(page, e30.id)
  await page.evaluate(() => fetch('/api/vehicles/select', { method: 'DELETE' }))
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(900)
  const cardsNoVehicle = await readCards(page)
  check(
    'Araç yokken hiçbir uyumluluk rozeti gösterilmiyor',
    cardsNoVehicle.every((c) =>
      c.badges.every((b) => !b.includes('Aracınıza uygun') && !b.includes('teyit edilmedi')),
    ),
  )
  check(
    'Araç şeridi kaldırıldı',
    !(await page.locator('[data-testid="selected-vehicle-bar"]').isVisible()),
  )

  // ── SENARYO 6: mobil bottom-sheet ─────────────────────────────────────────
  console.log('\nSENARYO 6 — Mobil araç seçici (bottom-sheet)')
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await mobile.goto(BASE, { waitUntil: 'domcontentloaded' })
  await mobile.waitForTimeout(900)
  check('Mobil header görünür', await mobile.locator('[data-testid="mobile-header"]').isVisible())
  check(
    'Mobil alt bar görünür',
    await mobile.locator('[data-testid="mobile-bottom-bar"]').isVisible(),
  )

  await mobile.locator('[data-testid="vehicle-mobile-trigger"]').click()
  await mobile.waitForTimeout(700)
  check('Bottom-sheet açıldı', await mobile.locator('[data-testid="vehicle-dialog"]').isVisible())

  await mobile.locator('[data-testid="vehicle-dialog"] button:has-text("Otomobil")').first().click()
  await mobile.waitForTimeout(700)
  await mobile.locator('[data-testid="vehicle-dialog"] button:has-text("AUDI")').first().click()
  await mobile.waitForTimeout(700)
  await mobile.locator('[data-testid="vehicle-dialog"] button:has-text("A1 (GB)")').first().click()
  await mobile.waitForTimeout(700)
  await mobile.locator('[data-testid="vehicle-dialog"] button:has-text("30 TFSI")').first().click()
  await mobile.waitForTimeout(400)
  check(
    'Mobil akış sonunda buton aktif',
    !(await mobile.locator('[data-testid="vehicle-dialog-submit"]').isDisabled()),
  )
  await mobile.locator('[data-testid="vehicle-dialog-submit"]').click()
  await mobile.waitForTimeout(2200)
  check(
    'Mobil seçim sonrası araç şeridi göründü',
    await mobile.locator('[data-testid="selected-vehicle-bar"]').isVisible(),
  )

  check('Sayfada JS hatası yok', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '))

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} kontrol geçti`)
  if (failed.length) {
    console.log('BAŞARISIZ:', failed.map((f) => f.name).join(' | '))
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
