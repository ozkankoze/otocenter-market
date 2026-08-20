/**
 * MARKA LOGOSU DOĞRULAMA
 *
 * Kontrol edilenler:
 *  · Logo dört yerde de (masaüstü header, sticky kompakt, mobil header,
 *    mobil drawer, footer) gerçek marka görseliyle çiziliyor mu
 *  · Görsel ESNETİLMİŞ mi — render edilen en-boy oranı kaynak dosyanınkiyle
 *    aynı olmalı (tolerans %1)
 *  · Yeterli boşluk var mı (header yüksekliği − logo yüksekliği)
 *  · Favicon / app icon'lar sunuluyor mu
 */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright')
const fs = require('node:fs')

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const SHOTS = process.env.SHOT_DIR ?? '/home/claude/otocenter-plan/logo'
const SRC_RATIO = 926 / 223 // kaynak dosyanın gerçek oranı
const results = []

fs.mkdirSync(SHOTS, { recursive: true })

function check(name, ok, detail = '') {
  results.push({ name, ok: Boolean(ok), detail })
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function logoBox(page, scopeSelector) {
  return page.evaluate((scope) => {
    const root = scope ? document.querySelector(scope) : document
    if (!root) return null
    const img = root.querySelector('img[alt="Oto Center Market"]')
    if (!img) return null
    const r = img.getBoundingClientRect()
    return {
      src: img.getAttribute('src') ?? '',
      width: Math.round(r.width * 100) / 100,
      height: Math.round(r.height * 100) / 100,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
    }
  }, scopeSelector)
}

function ratioOk(box) {
  if (!box || !box.height) return false
  return Math.abs(box.width / box.height - SRC_RATIO) / SRC_RATIO < 0.01
}

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('response', (r) => {
    if (r.url().includes('/brand/') && !r.ok()) errors.push(`${r.status()} ${r.url()}`)
  })

  // ── MASAÜSTÜ HEADER ──────────────────────────────────────────────────────
  console.log('\nMASAÜSTÜ HEADER')
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const desktop = await logoBox(page, '[data-testid="desktop-header"]')

  check('Header\'da gerçek logo görseli var', Boolean(desktop), desktop?.src?.slice(0, 60))
  check(
    'Görsel yüklendi (kırık değil)',
    desktop?.complete && desktop.naturalWidth > 0,
    `doğal boyut ${desktop?.naturalWidth}×${desktop?.naturalHeight}`,
  )
  check(
    'Oran KORUNUYOR — esneme yok',
    ratioOk(desktop),
    `render ${desktop?.width}×${desktop?.height} → ${(desktop.width / desktop.height).toFixed(3)} (kaynak ${SRC_RATIO.toFixed(3)})`,
  )

  const bar = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="desktop-header"] .ocm-container')
    return el ? Math.round(el.getBoundingClientRect().height) : 0
  })
  const headroom = await page.evaluate(() => {
    const img = document.querySelector('[data-testid="desktop-header"] img[alt="Oto Center Market"]')
    const row = img?.closest('.ocm-container')
    if (!img || !row) return null
    const a = img.getBoundingClientRect()
    const b = row.getBoundingClientRect()
    return { ust: Math.round(a.top - b.top), alt: Math.round(b.bottom - a.bottom) }
  })
  check(
    'Logo çevresinde yeterli boşluk var',
    headroom && headroom.ust >= 8 && headroom.alt >= 8,
    `üst ${headroom?.ust}px · alt ${headroom?.alt}px (bar ${bar}px)`,
  )
  await page.screenshot({ path: `${SHOTS}/01-desktop-header.png`, clip: { x: 0, y: 0, width: 1440, height: 220 } })

  // ── STICKY KOMPAKT MOD ───────────────────────────────────────────────────
  console.log('\nSTICKY KOMPAKT MOD')
  await page.evaluate(() => window.scrollTo(0, 400))
  await page.waitForTimeout(600)
  const compact = await logoBox(page, '[data-testid="desktop-header"]')
  check('Kompakt modda logo küçülüyor', compact.height < desktop.height, `${desktop.height}px → ${compact.height}px`)
  check('Kompakt logo bara sığıyor', compact.height <= 44, `${compact.height}px / 60px bar`)
  check(
    'Kompakt modda da oran korunuyor',
    ratioOk(compact),
    `${compact.width}×${compact.height} → ${(compact.width / compact.height).toFixed(3)}`,
  )
  await page.locator('[data-testid="desktop-header"]').screenshot({
    path: `${SHOTS}/02-sticky-kompakt.png`,
  })

  // ── MOBİL HEADER ─────────────────────────────────────────────────────────
  console.log('\nMOBİL HEADER')
  const mob = await ctx.newPage()
  await mob.setViewportSize({ width: 390, height: 844 })
  await mob.goto(BASE, { waitUntil: 'networkidle' })
  const mobile = await logoBox(mob, '[data-testid="mobile-header"]')
  check('Mobil header\'da logo var', Boolean(mobile))
  check(
    'Mobil oran korunuyor — esneme yok',
    ratioOk(mobile),
    `${mobile?.width}×${mobile?.height} → ${(mobile.width / mobile.height).toFixed(3)}`,
  )
  check(
    'Mobil logo ekrana sığıyor ve diğer öğeleri ezmiyor',
    mobile.width <= 200 && mobile.height <= 40,
    `${mobile.width}px genişlik / 390px ekran`,
  )
  await mob.screenshot({ path: `${SHOTS}/03-mobil-header.png`, clip: { x: 0, y: 0, width: 390, height: 130 } })

  // ── MOBİL DRAWER ─────────────────────────────────────────────────────────
  await mob.locator('[data-testid="mobile-menu-trigger"]').click()
  await mob.waitForSelector('[data-testid="mobile-drawer"]')
  await mob.waitForTimeout(400)
  const drawer = await logoBox(mob, '[data-testid="mobile-drawer"]')
  check('Mobil menüde logo var ve oranı doğru', ratioOk(drawer), `${drawer?.width}×${drawer?.height}`)
  await mob.screenshot({ path: `${SHOTS}/04-mobil-drawer.png` })

  // ── FOOTER ───────────────────────────────────────────────────────────────
  console.log('\nFOOTER')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(600)
  const footer = await logoBox(page, 'footer')
  check('Footer\'da logo var ve oranı doğru', ratioOk(footer), `${footer?.width}×${footer?.height}`)
  await page.locator('footer').screenshot({ path: `${SHOTS}/05-footer.png` })

  // ── İKONLAR ──────────────────────────────────────────────────────────────
  console.log('\nİKONLAR')
  for (const [path, label] of [
    ['/favicon.ico', 'favicon.ico'],
    ['/icon.png', 'icon.png (192)'],
    ['/apple-icon.png', 'apple-icon.png (180)'],
    ['/brand/oto-center-market-logo.png', 'brand/logo.png'],
    ['/brand/oto-center-market-amblem.png', 'brand/amblem.png'],
  ]) {
    const res = await page.request.get(BASE + path)
    const size = (await res.body()).length
    check(`${label} sunuluyor`, res.ok() && size > 100, `${res.status()} · ${(size / 1024).toFixed(0)} KB`)
  }

  // ── ESKİ YER TUTUCU KALMADI ──────────────────────────────────────────────
  const leftover = await page.evaluate(() =>
    document.querySelectorAll('svg#ocm-mark, linearGradient#ocm-mark').length,
  )
  check('Eski geçici vektör işaret tamamen kaldırıldı', leftover === 0)

  check('Konsolda hata yok', errors.length === 0, errors.slice(0, 2).join(' | '))

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${'═'.repeat(70)}`)
  console.log(`SONUÇ: ${results.length - failed.length}/${results.length} kontrol başarılı`)
  if (failed.length) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} — ${f.detail}`))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
