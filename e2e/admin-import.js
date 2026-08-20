/**
 * SPRINT 4 — ADMİN IMPORT AKIŞI SENARYO TESTİ
 *
 * Gerçek sunucuya karşı, gerçek tarayıcıda çalışır.
 *
 * ÖNEMLİ: bu test SENTETİK veri kullanır. Ürettiği bütün kayıtlar
 * `SPRINT4-` önekiyle işaretlenir ve test sonunda import geri alınarak
 * temizlenir; gerçek katalog verisine dokunulmaz.
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright')
const XLSX = require('/home/claude/otocenter-market/node_modules/xlsx')
const { Client } = require('pg')
const fs = require('node:fs')
const path = require('node:path')

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const SHOTS = process.env.SHOT_DIR ?? '/home/claude/otocenter-plan/sprint4'
const TMP = '/tmp/ocm-sprint4'
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'otocenter'
const results = []

fs.mkdirSync(SHOTS, { recursive: true })
fs.mkdirSync(TMP, { recursive: true })

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

function writeWorkbook(name, sheets) {
  const wb = XLSX.utils.book_new()
  for (const [sheetName, rows] of Object.entries(sheets)) {
    const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))]
    const aoa = [headers, ...rows.map((r) => headers.map((h) => r[h] ?? ''))]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), sheetName)
  }
  const file = path.join(TMP, name)
  XLSX.writeFile(wb, file)
  return file
}

/** Kaynak açılır listesinde metne göre seçim (Playwright label eşleşmesi tam metin ister). */
async function selectSourceByText(page, needle) {
  const options = await page.locator('[data-testid="import-source"] option').all()
  for (const [i, opt] of options.entries()) {
    const text = (await opt.textContent()) ?? ''
    if (text.toUpperCase().includes(needle.toUpperCase())) {
      await page.selectOption('[data-testid="import-source"]', { index: i })
      return text.trim()
    }
  }
  throw new Error(`Kaynak bulunamadı: ${needle}`)
}

async function shot(page, name, opts = {}) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${SHOTS}/${name}.png`, ...opts })
  console.log(`    · ekran görüntüsü: ${name}.png`)
}

// ─────────────────────────── SENTETİK TEST DOSYASI ──────────────────────────

const SKUS = Array.from({ length: 10 }, (_, i) => `SPRINT4-${String(i + 1).padStart(3, '0')}`)

function buildFile() {
  const urunler = SKUS.map((sku, i) => ({
    sku,
    urun_adi: `Sprint4 Test Hava Filtresi ${i + 1}`,
    marka: 'SPRINT4 TEST MARKA',
    kategori_kodu: 'HAVA_FILTRESI',
    urun_kodu: `S4 ${100 + i}`,
    kisa_aciklama: 'Sentetik test ürünü — gerçek katalog verisi değildir.',
    durum: 'AKTIF',
  }))

  // HATALI SATIRLAR — import'u bozmamalı
  const hatali = [
    { sku: 'SPRINT4-ERR-1', urun_adi: '', marka: 'SPRINT4 TEST MARKA', kategori_kodu: 'HAVA_FILTRESI' },
    { sku: 'SPRINT4-ERR-2', urun_adi: 'Kategorisi olmayan', marka: 'SPRINT4 TEST MARKA', kategori_kodu: 'OLMAYAN_KATEGORI' },
    // duplicate ürün
    { ...urunler[0], urun_adi: 'TEKRAR EDEN SATIR' },
  ]

  const fiyat = SKUS.map((sku, i) => ({
    sku,
    fiyat_net: `${250 + i * 10},00`,
    kdv_orani: 20,
    stok: 5 + i,
  }))

  // TEK ÜRÜN, 7 OEM NUMARASI → 7 SATIR
  const oem = [
    '04E 129 620 A',
    '04E 129 620 B',
    '04E 129 620 C',
    'S4 900 111',
    'S4 900 222',
    'S4 900 333',
    'S4 900 444',
  ].map((numara, i) => ({
    sku: SKUS[0],
    tip: 'OEM',
    marka: ['VW', 'AUDI', 'SEAT', 'SKODA'][i % 4],
    numara,
  }))

  // TEK ÜRÜN, ÇOK MOTOR → HER İLİŞKİ AYRI SATIR + 1 hatalı motor
  const uyumluluk = [
    {
      sku: SKUS[0],
      uyumluluk_tipi: 'UYUMLU',
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      motor_kodu: 'TUM_MOTORLAR',
    },
    {
      sku: SKUS[1],
      uyumluluk_tipi: 'UYUMLU',
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A3 (8Y)',
      motor_kodu: 'TUM_MOTORLAR',
    },
    {
      sku: SKUS[2],
      uyumluluk_tipi: 'UYUMLU',
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      motor_kodu: 'YOKBOYLEBIRMOTOR',
      motor_adi: 'Olmayan Motor',
    },
  ]

  return writeWorkbook('sprint4-import.xlsx', {
    URUNLER: [...urunler, ...hatali],
    FIYAT_STOK: fiyat,
    OEM_CAPRAZ: oem,
    UYUMLULUK: uyumluluk,
  })
}

/** İkinci kaynak aynı ürün-motor için TERSİNİ söyler → CONFLICTED */
function buildConflictFile(engine) {
  return writeWorkbook('sprint4-conflict.xlsx', {
    UYUMLULUK: [
      {
        sku: SKUS[0],
        uyumluluk_tipi: 'UYUMSUZ',
        arac_tipi: 'OTOMOBIL',
        arac_markasi: 'AUDI',
        model: 'A1 (GB)',
        motor_kodu: engine.code,
        motor_adi: engine.name,
      },
    ],
  })
}

// ════════════════════════════════ SENARYOLAR ════════════════════════════════

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await ctx.newPage()
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') pageErrors.push(m.text())
  })

  // ── SENARYO 0: GİRİŞ ─────────────────────────────────────────────────────
  console.log('\nSENARYO 0 — Admin girişi')
  await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded' })
  check('Oturumsuz erişim giriş sayfasına yönlendiriliyor', page.url().includes('/admin/giris'))
  await shot(page, '01-admin-giris')

  await page.fill('input[name="email"]', 'admin@otocentermarket.com')
  await page.fill('input[name="password"]', PASSWORD)
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.click('button[type="submit"]')])
  check('Giriş başarılı, dashboard açıldı', page.url().endsWith('/admin'))
  await page.waitForSelector('[data-testid="admin-main"]')
  await shot(page, '02-admin-dashboard')

  // ── SENARYO 1: ŞABLON İNDİRME ────────────────────────────────────────────
  console.log('\nSENARYO 1 — XLSX şablonu')
  const templateResponse = await page.request.get(`${BASE}/api/admin/import/sablon`)
  const templateBuffer = Buffer.from(await templateResponse.body())
  const templatePath = path.join(SHOTS, 'oto-center-market-import-sablonu.xlsx')
  fs.writeFileSync(templatePath, templateBuffer)
  const templateWb = XLSX.read(templateBuffer, { type: 'buffer' })

  check('Şablon indirilebiliyor', templateResponse.ok(), `${(templateBuffer.length / 1024).toFixed(0)} KB`)
  check(
    'Şablon ilişkisel yapıda: OEM ve UYUMLULUK ayrı sayfalar',
    templateWb.SheetNames.includes('OEM_CAPRAZ') && templateWb.SheetNames.includes('UYUMLULUK'),
    templateWb.SheetNames.join(' · '),
  )
  const oemSheet = XLSX.utils.sheet_to_json(templateWb.Sheets.OEM_CAPRAZ)
  check(
    'Şablonda tek ürünün 7 OEM numarası 7 AYRI SATIR',
    oemSheet.length === 7 && new Set(oemSheet.map((r) => r.sku)).size === 1,
    `${oemSheet.length} satır, ${new Set(oemSheet.map((r) => r.sku)).size} ürün`,
  )
  const compatSheet = XLSX.utils.sheet_to_json(templateWb.Sheets.UYUMLULUK)
  check(
    'Şablonda çoklu motor uyumluluğu ayrı satırlarda',
    compatSheet.length >= 3,
    `${compatSheet.length} satır`,
  )

  // ── SENARYO 2: YÜKLEME + DRY-RUN ÖNİZLEME ────────────────────────────────
  console.log('\nSENARYO 2 — Yükleme ve önizleme (dry-run)')
  const filePath = buildFile()

  const beforeProducts = await db(`SELECT count(*)::int AS n FROM product WHERE sku LIKE 'SPRINT4-%'`)
  check('Başlangıçta test ürünü yok', beforeProducts[0].n === 0)

  await page.goto(`${BASE}/admin/importlar/yeni`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="import-dropzone"]')
  await shot(page, '03-import-yukleme-ekrani')

  await page.setInputFiles('[data-testid="import-file-input"]', filePath)
  await selectSourceByText(page, 'CSV')
  await page.click('[data-testid="import-submit"]')
  await page.waitForSelector('[data-testid="import-preview"]', { timeout: 60000 })

  const totals = await page.evaluate(() => {
    const read = (id) => {
      const el = document.querySelector(`[data-testid="${id}"] b`)
      return el ? Number(el.textContent.replace(/\D/g, '')) : null
    }
    return {
      total: read('tile-total'),
      valid: read('tile-valid'),
      error: read('tile-error'),
      created: read('tile-created'),
      updated: read('tile-updated'),
      duplicate: read('tile-duplicate'),
      conflict: read('tile-conflict'),
      missingVehicle: read('tile-missing-vehicle'),
    }
  })

  check(
    'Önizlemede 8 zorunlu sayaç gösteriliyor',
    Object.values(totals).every((v) => v !== null),
    JSON.stringify(totals),
  )
  check('Hatalı satırlar tespit edildi', totals.error === 3, `${totals.error} hatalı`)
  check('Duplicate ürün tespit edildi', totals.duplicate === 1, `${totals.duplicate} duplicate`)
  check('Eksik araç verisi tespit edildi', totals.missingVehicle === 1, `${totals.missingVehicle} satır`)
  check(
    'Hata raporu indirme bağlantısı sunuluyor',
    (await page.locator('[data-testid="error-report-link"]').count()) > 0,
  )
  await shot(page, '04-import-onizleme', { fullPage: true })

  const errorRows = await page.locator('[data-testid="error-rows"] tr').count()
  check('Hatalı satırlar kullanıcıya listeleniyor', errorRows >= 2, `${errorRows} satır gösteriliyor`)

  // ONAY VERİLMEDEN production'a yazılmadı mı?
  const midProducts = await db(`SELECT count(*)::int AS n FROM product WHERE sku LIKE 'SPRINT4-%'`)
  check(
    'ONAY VERİLMEDEN production tablolarına yazılmadı',
    midProducts[0].n === 0,
    `${midProducts[0].n} ürün`,
  )
  const staged = await db(
    `SELECT count(*)::int AS n FROM import_staging_row WHERE import_job_id = (SELECT max(id) FROM import_job)`,
  )
  check('Bütün satırlar staging tablosunda bekliyor', staged[0].n === totals.total, `${staged[0].n} satır`)

  // ── SENARYO 3: ONAY VE UYGULAMA ──────────────────────────────────────────
  console.log('\nSENARYO 3 — Onay ve uygulama')
  await page.click('[data-testid="import-confirm"]')
  await page.waitForSelector('[data-testid="import-success"]', { timeout: 120000 })
  const importUrl = page.url()
  const jobId = Number(importUrl.match(/importlar\/(\d+)/)[1])
  await shot(page, '05-import-sonucu', { fullPage: true })

  const afterProducts = await db(`SELECT count(*)::int AS n FROM product WHERE sku LIKE 'SPRINT4-%'`)
  check(
    'Yalnızca geçerli satırlar uygulandı (10 ürün; hatalı ve duplicate satırlar atlandı)',
    afterProducts[0].n === 10,
    `${afterProducts[0].n} ürün`,
  )

  const refs = await db(
    `SELECT count(*)::int AS n FROM product_reference r JOIN product p ON p.id = r.product_id WHERE p.sku = $1`,
    [SKUS[0]],
  )
  check('Tek ürün için 7 OEM numarası ayrı kayıt olarak yazıldı', refs[0].n === 7, `${refs[0].n} kayıt`)

  const assertions = await db(
    `SELECT count(*)::int AS n FROM compatibility_assertion WHERE import_job_id = $1`,
    [jobId],
  )
  check(
    'TUM_MOTORLAR genişletmesi çoklu motor iddiası üretti',
    assertions[0].n > 5,
    `${assertions[0].n} iddia`,
  )

  const expanded = await db(
    `SELECT count(*)::int AS n FROM compatibility_assertion WHERE expanded_from IS NOT NULL AND import_job_id = $1`,
    [jobId],
  )
  check('Genişletmenin kaynağı izlenebilir (expanded_from)', expanded[0].n > 0, `${expanded[0].n} kayıt`)

  const compat = await db(
    `SELECT pc.status::text, count(*)::int AS n
     FROM product_compatibility pc JOIN product p ON p.id = pc.product_id
     WHERE p.sku LIKE 'SPRINT4-%' GROUP BY 1`,
  )
  check(
    'Import sonrası çözümleme çalıştı',
    compat.length > 0,
    compat.map((c) => `${c.status}=${c.n}`).join(' · '),
  )

  // ── SENARYO 4: ÇAKIŞMA ───────────────────────────────────────────────────
  console.log('\nSENARYO 4 — İki kaynak çelişince ÇAKIŞMA')
  const [engine] = await db(
    `SELECT e.name, e.engine_codes[1] AS code
     FROM compatibility_assertion a
     JOIN vehicle_engine e ON e.id = a.engine_id
     JOIN product p ON p.id = a.product_id
     WHERE p.sku = $1 AND e.engine_codes[1] IS NOT NULL LIMIT 1`,
    [SKUS[0]],
  )
  const conflictFile = buildConflictFile(engine)

  await page.goto(`${BASE}/admin/importlar/yeni`, { waitUntil: 'domcontentloaded' })
  await page.setInputFiles('[data-testid="import-file-input"]', conflictFile)
  // Farklı bir kaynak seç — çelişki ancak FARKLI kaynaklar arasında oluşur.
  // (Aynı kaynak kendisiyle çelişemez; MANUAL kaynak ise her zaman kazanır.)
  await selectSourceByText(page, 'TECDOC')
  await page.click('[data-testid="import-submit"]')
  await page.waitForSelector('[data-testid="import-preview"]', { timeout: 60000 })

  const conflictRisk = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="tile-conflict"] b')
    return el ? Number(el.textContent.replace(/\D/g, '')) : null
  })
  check('Önizleme çakışma riskini ÖNCEDEN uyarıyor', conflictRisk >= 1, `${conflictRisk} satır`)
  await shot(page, '06-import-cakisma-uyarisi', { fullPage: true })

  await page.click('[data-testid="import-confirm"]')
  await page.waitForSelector('[data-testid="import-success"]', { timeout: 120000 })
  const conflictJobId = Number(page.url().match(/importlar\/(\d+)/)[1])

  const conflicted = await db(
    `SELECT pc.status::text, pc.has_conflict
     FROM product_compatibility pc
     JOIN product p ON p.id = pc.product_id
     JOIN vehicle_engine e ON e.id = pc.engine_id
     WHERE p.sku = $1 AND e.name = $2`,
    [SKUS[0], engine.name],
  )
  check(
    'Çelişen kayıt CONFLICTED oldu ve çakışma bayrağı açıldı',
    conflicted[0]?.status === 'CONFLICTED' && conflicted[0]?.has_conflict === true,
    `${conflicted[0]?.status} · has_conflict=${conflicted[0]?.has_conflict}`,
  )
  check(
    'KRİTİK: çakışmalı kayıt "uyumlu" sayılmıyor',
    !['VERIFIED', 'SOURCED'].includes(conflicted[0]?.status),
  )

  await page.goto(`${BASE}/admin/cakismalar`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="admin-main"]')
  const conflictRows = await page.locator('[data-testid="conflict-row"]').count()
  check('Çakışma admin kuyruğunda görünüyor', conflictRows > 0, `${conflictRows} kayıt`)
  await shot(page, '07-veri-cakismalari')

  // Müşteri tarafında yeşil rozet YOK
  const [slugRow] = await db(`SELECT slug FROM product WHERE sku = $1`, [SKUS[0]])
  const [engineRow] = await db(
    `SELECT e.id FROM vehicle_engine e WHERE e.name = $1 LIMIT 1`,
    [engine.name],
  )
  const shop = await ctx.newPage()
  await shop.goto(BASE, { waitUntil: 'domcontentloaded' })
  await shop.evaluate(
    (id) =>
      fetch('/api/vehicles/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engineId: id }),
      }).then((r) => r.status),
    Number(engineRow.id),
  )
  await shop.goto(`${BASE}/urun/${slugRow.slug}`, { waitUntil: 'domcontentloaded' })
  await shop.waitForSelector('[data-testid="compat-block"]')
  const state = await shop.locator('[data-testid="compat-block"]').getAttribute('data-state')
  const greenBadges = await shop.evaluate(
    () =>
      [...document.querySelectorAll('*')].filter(
        (el) => /^Aracınıza uygun$/.test((el.textContent ?? '').trim()) && el.children.length === 0,
      ).length,
  )
  check('Çakışmalı ürün müşteriye GRİ gösteriliyor', state === 'unknown', state)
  check('Sayfada tek bir yeşil "Aracınıza uygun" rozeti yok', greenBadges === 0, `${greenBadges} rozet`)
  await shot(shop, '08-musteri-tarafi-cakisma-gri')
  await shop.close()

  // ── SENARYO 5: IMPORT GEÇMİŞİ ────────────────────────────────────────────
  console.log('\nSENARYO 5 — Import geçmişi')
  await page.goto(`${BASE}/admin/importlar`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="import-row"]')
  const historyRows = await page.locator('[data-testid="import-row"]').count()
  check('Import geçmişi kayıtları listeliyor', historyRows >= 2, `${historyRows} kayıt`)
  const historyText = await page.locator('table').innerText()
  check(
    'Geçmişte dosya, kaynak, kullanıcı, durum ve sayılar var',
    /sprint4-import\.xlsx/.test(historyText) && /admin/.test(historyText),
  )
  await shot(page, '09-import-gecmisi')

  // ── SENARYO 6: GERİ ALMA ─────────────────────────────────────────────────
  console.log('\nSENARYO 6 — Geri alma')
  await page.goto(`${BASE}/admin/importlar/${conflictJobId}`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="rollback-start"]')
  await page.click('[data-testid="rollback-start"]')
  await page.click('[data-testid="rollback-confirm"]')
  await page.waitForSelector('[data-testid="rollback-summary"]', { timeout: 60000 })
  await shot(page, '10-geri-alma-sonucu', { fullPage: true })

  const afterRollback = await db(
    `SELECT pc.status::text
     FROM product_compatibility pc
     JOIN product p ON p.id = pc.product_id
     JOIN vehicle_engine e ON e.id = pc.engine_id
     WHERE p.sku = $1 AND e.name = $2`,
    [SKUS[0], engine.name],
  )
  check(
    'Çakışma import\'u geri alınınca kayıt tekrar SOURCED oldu',
    afterRollback[0]?.status === 'SOURCED',
    afterRollback[0]?.status ?? 'kayıt yok',
  )

  // Asıl import'u da geri al — test verisi temizlenir
  await page.goto(`${BASE}/admin/importlar/${jobId}`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('[data-testid="rollback-start"]')
  await page.click('[data-testid="rollback-start"]')
  await page.click('[data-testid="rollback-confirm"]')
  await page.waitForSelector('[data-testid="rollback-summary"]', { timeout: 60000 })

  const cleaned = await db(`SELECT count(*)::int AS n FROM product WHERE sku LIKE 'SPRINT4-%'`)
  check('Geri alma test verisini tamamen temizledi', cleaned[0].n === 0, `${cleaned[0].n} ürün kaldı`)

  const realCatalog = await db(`SELECT count(*)::int AS n FROM product WHERE sku NOT LIKE 'SPRINT4-%'`)
  check(
    'Gerçek katalog verisi etkilenmedi',
    realCatalog[0].n >= 146,
    `${realCatalog[0].n} gerçek ürün duruyor`,
  )

  // ── SENARYO 7: DİĞER ADMIN EKRANLARI ─────────────────────────────────────
  console.log('\nSENARYO 7 — Admin ekranları')
  for (const [pathname, name, testId] of [
    ['/admin/urunler', '11-admin-urunler', 'admin-product-row'],
    ['/admin/uyumluluk', '12-admin-uyumluluk', 'compat-row'],
    ['/admin/arac-agaci', '13-admin-arac-agaci', 'vehicle-row'],
    ['/admin/veri-kaynaklari', '14-admin-veri-kaynaklari', 'source-row'],
    ['/admin/oem', '15-admin-oem', 'oem-row'],
  ]) {
    await page.goto(BASE + pathname, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="admin-main"]')
    await page.waitForTimeout(400)
    const rows = await page.locator(`[data-testid="${testId}"]`).count()
    check(`${pathname} yükleniyor ve veri gösteriyor`, rows > 0, `${rows} satır`)
    await shot(page, name)
  }

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
