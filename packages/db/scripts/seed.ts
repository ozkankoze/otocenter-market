/**
 * Seed
 *
 * VARSAYILAN (ürünsüz kurulum) — gerçek katalog verisi import ile gelir:
 *   · 7 araç tipi, 31 marka, 74 model, 74 nesil, 120 motor
 *   · 12 kategori (+ facet tanımları), 10 ürün markası
 *   · 7 veri kaynağı
 *   · ÜRÜN, OEM ve UYUMLULUK VERİSİ OLUŞTURULMAZ
 *
 * Araç ağacı ve kategoriler gerçek dünya verisidir (motor kodları, model
 * kuşakları); ürünler ise yalnızca demo amaçlı üretiliyordu ve gerçek
 * katalog verisi DEĞİLDİR — bu yüzden varsayılan kurulumdan çıkarıldı.
 *
 * DEMO KATALOĞU (sunum/ekran görüntüsü için):
 *   OCM_SEED_DEMO_CATALOG=1 npm run db:seed
 *   → 146 temsili ürün, ~2.700 iddia ve bilinçli çakışma demosu ekler.
 *   Bu veri MÜŞTERİYE GERÇEK KATALOG OLARAK SUNULMAMALIDIR.
 *
 * Akış: temizle → araç ağacı → katalog → [demo ürünler] → ÇÖZÜMLE → İNDEKSLE
 */
import { loadEnv } from './env'
loadEnv()

import { db, closeDb, normalizeCode, slugify } from '../src/index'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../src/resolve'
import { VEHICLE_TYPES, VEHICLE_TREE } from './seed-data/vehicles'
import {
  CATEGORIES,
  PRODUCT_BRANDS,
  PLATFORMS,
  CATEGORY_TEMPLATES,
  FLUID_PRODUCTS,
  DATA_SOURCES,
} from './seed-data/catalog'

/**
 * Demo kataloğu yalnızca açıkça istendiğinde üretilir.
 * Varsayılan: KAPALI → `npm run db:seed` sahte ürün oluşturmaz.
 */
const SEED_DEMO_CATALOG = ['1', 'true', 'evet', 'yes'].includes(
  (process.env.OCM_SEED_DEMO_CATALOG ?? '').toLowerCase(),
)

// Deterministik sözde-rastgele — her seed aynı sonucu üretsin
let seedState = 20260816
function rnd(): number {
  seedState = (seedState * 1103515245 + 12345) % 2147483648
  return seedState / 2147483648
}
function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length] as T
}

async function truncateAll(): Promise<void> {
  await db.executeQuery(
    db.getExecutor().compileQuery({
      kind: 'RawNode',
      sqlFragments: [
        `TRUNCATE
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

async function main(): Promise<void> {
  const t0 = Date.now()
  console.log('› Mevcut veriler temizleniyor...')
  await truncateAll()

  // ───────────────────────────── VERİ KAYNAKLARI ────────────────────────────
  const sourceIds = new Map<string, number>()
  for (const s of DATA_SOURCES) {
    const row = await db
      .insertInto('data_source')
      .values({ code: s.code, name: s.name, kind: s.kind, trust_level: s.trustLevel })
      .returning('id')
      .executeTakeFirstOrThrow()
    sourceIds.set(s.code, row.id)
  }
  console.log(`✓ ${sourceIds.size} veri kaynağı`)

  // ─────────────────────────────── ARAÇ TİPLERİ ─────────────────────────────
  const typeIds = new Map<string, number>()
  for (const t of VEHICLE_TYPES) {
    const row = await db
      .insertInto('vehicle_type')
      .values({ name: t.name, slug: t.slug, icon: t.icon, sort_order: t.sortOrder })
      .returning('id')
      .executeTakeFirstOrThrow()
    typeIds.set(t.slug, row.id)
  }

  // ──────────────────────── MARKA / MODEL / NESİL / MOTOR ───────────────────
  type EngineRow = { id: number; codes: string[]; modelId: number; fuel: string }
  const engines: EngineRow[] = []
  let modelCount = 0
  let generationCount = 0

  for (const brand of VEHICLE_TREE) {
    const brandRow = await db
      .insertInto('vehicle_brand')
      .values({
        name: brand.name,
        slug: slugify(brand.name),
        country: brand.country ?? null,
        is_popular: brand.popular ?? false,
        sort_order: brand.popular ? 0 : 10,
      })
      .returning('id')
      .executeTakeFirstOrThrow()

    for (const typeSlug of brand.types) {
      const typeId = typeIds.get(typeSlug)
      if (!typeId) continue
      await db
        .insertInto('vehicle_brand_type')
        .values({ brand_id: brandRow.id, type_id: typeId })
        .execute()
    }

    for (const model of brand.models) {
      const modelRow = await db
        .insertInto('vehicle_model')
        .values({
          brand_id: brandRow.id,
          name: model.name,
          slug: slugify(model.name),
          code: model.code ?? null,
          year_from: model.from,
          year_to: model.to ?? null,
          body_type: model.body ?? null,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      modelCount++

      // Nesil katmanı: veri modelinde var, arayüzde ayrı adım DEĞİL
      const genRow = await db
        .insertInto('vehicle_generation')
        .values({
          model_id: modelRow.id,
          name: model.name,
          code: model.code ?? null,
          year_from: model.from,
          year_to: model.to ?? null,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      generationCount++

      let order = 0
      const usedSlugs = new Set<string>()
      for (const engine of model.engines) {
        let slug = slugify(engine.name).slice(0, 60)
        if (usedSlugs.has(slug)) slug = `${slug}-${order}`
        usedSlugs.add(slug)

        const engineRow = await db
          .insertInto('vehicle_engine')
          .values({
            generation_id: genRow.id,
            model_id: modelRow.id,
            name: engine.name,
            slug,
            engine_codes: engine.codes,
            displacement_cc: engine.cc,
            power_kw: engine.kw,
            power_hp: engine.hp,
            fuel_type: engine.fuel,
            year_from: engine.from ?? model.from,
            year_to: engine.to ?? model.to ?? null,
            sort_order: order++,
          })
          .returning('id')
          .executeTakeFirstOrThrow()

        engines.push({
          id: engineRow.id,
          codes: engine.codes,
          modelId: modelRow.id,
          fuel: engine.fuel,
        })
      }
    }
  }
  console.log(
    `✓ ${VEHICLE_TREE.length} araç markası · ${modelCount} model · ${generationCount} nesil · ${engines.length} motor`,
  )

  // ─────────────────────────────── KATEGORİLER ──────────────────────────────
  const categoryIds = new Map<string, number>()
  const categoryPaths = new Map<string, string>()
  for (const cat of CATEGORIES) {
    const parentId = cat.parent ? (categoryIds.get(cat.parent) ?? null) : null
    const parentPath = cat.parent ? categoryPaths.get(cat.parent) : undefined
    const path = parentPath ? `${parentPath}.${cat.slug}` : cat.slug

    const row = await db
      .insertInto('category')
      .values({
        parent_id: parentId,
        code: cat.code,
        name: cat.name,
        slug: cat.slug,
        path,
        depth: parentPath ? 1 : 0,
        icon: cat.icon ?? null,
        sort_order: cat.sortOrder,
        seo_title: `${cat.name} | Oto Center Market`,
        seo_description: `Aracınıza uygun ${cat.name.toLowerCase()} modelleri, fiyatları ve uyumluluk bilgisi.`,
        seo_intro: cat.seoIntro ?? null,
      })
      .returning('id')
      .executeTakeFirstOrThrow()

    categoryIds.set(cat.code, row.id)
    categoryPaths.set(cat.code, path)

    for (const [i, attr] of (cat.attributes ?? []).entries()) {
      await db
        .insertInto('category_attribute')
        .values({
          category_id: row.id,
          key: attr.key,
          label: attr.label,
          unit: attr.unit ?? null,
          data_type: attr.dataType,
          enum_values: attr.enumValues ?? [],
          sort_order: i,
        })
        .execute()
    }
  }
  console.log(`✓ ${categoryIds.size} kategori + facet tanımları`)

  // ────────────────────────────── ÜRÜN MARKALARI ────────────────────────────
  const brandIds = new Map<string, number>()
  for (const [i, b] of PRODUCT_BRANDS.entries()) {
    const row = await db
      .insertInto('product_brand')
      .values({
        name: b.name,
        slug: b.slug,
        country: b.country,
        is_featured: b.featured,
        sort_order: i,
        seo_title: `${b.name} Ürünleri | Oto Center Market`,
        description: `${b.name} marka filtre ve bakım ürünleri.`,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    brandIds.set(b.name, row.id)
  }
  console.log(`✓ ${brandIds.size} ürün markası`)

  // ─────────────────────── DEMO KATALOĞU (opsiyonel) ────────────────────────
  // Buradaki ürünler, OEM numaraları ve uyumluluklar TEMSİLİDİR; gerçek
  // katalog verisi değildir. Yalnızca OCM_SEED_DEMO_CATALOG=1 ile üretilir.
  type SeededProduct = { id: number; platform: string; category: string; brand: string }
  const products: SeededProduct[] = []

  if (SEED_DEMO_CATALOG) {
    const filterBrands = PRODUCT_BRANDS.filter((b) =>
      [
        'MANN-FILTER',
        'FILTRON',
        'BOSCH',
        'MAHLE',
        'PURFLUX',
        'HENGST',
        'DONALDSON',
        'WIX FILTERS',
      ].includes(b.name),
    )

    let famIndex = 0
    for (const platform of PLATFORMS) {
      for (const catCode of platform.categories) {
        const tpl = CATEGORY_TEMPLATES[catCode]
        const categoryId = categoryIds.get(catCode)
        if (!tpl || !categoryId) continue

        // Her aile 3 markadan üretilir → doğal "eşdeğer ürünler" ilişkisi
        const brandsForFamily = platform.heavy
          ? [filterBrands[0], filterBrands[6], filterBrands[7]]
          : [
              pick(filterBrands, famIndex),
              pick(filterBrands, famIndex + 1),
              pick(filterBrands, famIndex + 3),
            ]

        const oemNumbers = [
          `${String(10 + (famIndex % 89))}E ${String(100 + (famIndex % 800))} ${String(600 + (famIndex % 90))} A`,
          `${String(10 + (famIndex % 89))}E ${String(100 + (famIndex % 800))} ${String(600 + (famIndex % 90))} B`,
        ]

        for (const [bi, brand] of brandsForFamily.entries()) {
          if (!brand) continue
          const codeNum = 1000 + famIndex * 7 + bi
          const productCode =
            brand.name === 'MANN-FILTER'
              ? `${catCode === 'HAVA_FILTRESI' ? 'C' : catCode === 'YAG_FILTRESI' ? 'W' : catCode === 'YAKIT_FILTRESI' ? 'WK' : 'CU'} ${String(codeNum).slice(0, 2)} ${String(codeNum).slice(2)}`
              : brand.name === 'FILTRON'
                ? `${catCode === 'HAVA_FILTRESI' ? 'AP' : catCode === 'YAG_FILTRESI' ? 'OP' : catCode === 'YAKIT_FILTRESI' ? 'PP' : 'K'} ${codeNum}`
                : brand.name === 'BOSCH'
                  ? `F 026 ${400 + (famIndex % 9)} ${String(100 + bi * 7 + (famIndex % 90)).padStart(3, '0')}`
                  : `${brand.prefix.slice(0, 2).toUpperCase()} ${codeNum}`

          const sku = `${brand.prefix}-${normalizeCode(productCode)}`
          const name = tpl.name
          const price =
            Math.round((tpl.priceMin + rnd() * (tpl.priceMax - tpl.priceMin)) / 10) * 10 - 0.1

          const row = await db
            .insertInto('product')
            .values({
              sku,
              slug: slugify(`${brand.name}-${productCode}`),
              name,
              product_code: productCode,
              brand_id: brandIds.get(brand.name)!,
              category_id: categoryId,
              short_description: `${platform.label} motorlar için ${name.toLowerCase()}.`,
              description: `${brand.name} ${productCode} ${name.toLowerCase()}, ${platform.label} motor ailesi için üretilmiştir. Uyumluluk bilgisi araç motor kodu seviyesinde doğrulanır.`,
              specs: tpl.specs(famIndex + bi, platform.heavy ?? false),
              is_featured: famIndex < 3 && bi === 0,
              sort_weight: famIndex,
              seo_title: `${brand.name} ${productCode} ${name} | Oto Center Market`,
              seo_description: `${brand.name} ${productCode} ${name.toLowerCase()} fiyatı, teknik özellikleri ve uyumlu araç listesi.`,
            })
            .returning('id')
            .executeTakeFirstOrThrow()

          const variant = await db
            .insertInto('product_variant')
            .values({ product_id: row.id, sku: `${sku}-STD`, is_default: true })
            .returning('id')
            .executeTakeFirstOrThrow()

          const taxRate = 20
          const netPrice = Math.round((price / (1 + taxRate / 100)) * 100) / 100
          await db
            .insertInto('price')
            .values({
              variant_id: variant.id,
              price_net: netPrice,
              tax_rate: taxRate,
              list_price:
                bi === 0 && famIndex % 4 === 0 ? Math.round(price * 1.18 * 100) / 100 : null,
            })
            .execute()

          const qty = famIndex % 11 === 0 ? 0 : Math.floor(rnd() * 40) + 1
          await db
            .insertInto('stock')
            .values({
              variant_id: variant.id,
              quantity: qty,
              lead_time_days: qty === 0 ? 3 : null,
            })
            .execute()

          // OEM + çapraz referanslar (satır bazlı — çoklu ilişki kuralı)
          for (const [oi, oem] of oemNumbers.entries()) {
            await db
              .insertInto('product_reference')
              .values({
                product_id: row.id,
                type: 'OEM',
                brand_name: oi === 0 ? 'VW' : 'AUDI',
                number: oem,
                normalized: normalizeCode(oem),
                source_id: sourceIds.get('TECDOC')!,
              })
              .onConflict((oc) => oc.columns(['product_id', 'type', 'normalized']).doNothing())
              .execute()
          }
          for (const [oi, other] of brandsForFamily.entries()) {
            if (!other || other.name === brand.name) continue
            const otherCode = `${other.prefix} ${codeNum}/${oi}`
            await db
              .insertInto('product_reference')
              .values({
                product_id: row.id,
                type: 'CROSS_EQUIVALENT',
                brand_name: other.name,
                number: otherCode,
                normalized: normalizeCode(otherCode),
                source_id: sourceIds.get('CSV_V1')!,
                note: 'muadil',
              })
              .onConflict((oc) => oc.columns(['product_id', 'type', 'normalized']).doNothing())
              .execute()
          }

          products.push({
            id: row.id,
            platform: platform.key,
            category: catCode,
            brand: brand.name,
          })
        }
        famIndex++
      }
    }

    // Sıvı ürünleri (araçtan bağımsız, çok varyantlı)
    for (const fluid of FLUID_PRODUCTS) {
      const categoryId = categoryIds.get(fluid.category)
      if (!categoryId) continue
      const row = await db
        .insertInto('product')
        .values({
          sku: fluid.sku,
          slug: slugify(`${fluid.brand}-${fluid.name}`),
          name: fluid.name,
          product_code: fluid.code,
          brand_id: brandIds.get(fluid.brand)!,
          category_id: categoryId,
          short_description: `${fluid.brand} ${fluid.name}.`,
          description: `${fluid.brand} ${fluid.name}. Üretici onaylarını kontrol ederek aracınıza uygun ürünü seçiniz.`,
          specs: fluid.specs as Record<string, unknown>,
          is_featured: fluid.sku === 'LM-3707',
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      // Varsayılan varyant: 5 L varsa o, yoksa en büyük ambalaj.
      // Kart üzerindeki "vitrin fiyatı" en çok satan ambalajı yansıtmalı.
      const defaultIndex = (() => {
        const five = fluid.variants.findIndex((v) => v.pack === 5)
        return five >= 0 ? five : fluid.variants.length - 1
      })()

      for (const [vi, v] of fluid.variants.entries()) {
        const variant = await db
          .insertInto('product_variant')
          .values({
            product_id: row.id,
            sku: `${fluid.sku}-${String(v.pack).replace('.', '')}${v.unit}`,
            name: v.name,
            pack_size: v.pack,
            unit: v.unit,
            is_default: vi === defaultIndex,
          })
          .returning('id')
          .executeTakeFirstOrThrow()

        const net = Math.round((v.price / 1.2) * 100) / 100
        await db
          .insertInto('price')
          .values({ variant_id: variant.id, price_net: net, tax_rate: 20 })
          .execute()
        await db
          .insertInto('stock')
          .values({ variant_id: variant.id, quantity: Math.floor(rnd() * 50) + 3 })
          .execute()
      }

      products.push({ id: row.id, platform: 'FLUID', category: fluid.category, brand: fluid.brand })
    }
    console.log(`✓ ${products.length} ürün (varyant, fiyat, stok, OEM/çapraz referans dahil)`)

    // ───────────────────── UYUMLULUK İDDİALARI (KATMAN 2) ─────────────────────
    // Motorları platforma göre grupla
    const platformEngines = new Map<string, EngineRow[]>()
    for (const platform of PLATFORMS) {
      const matched = engines.filter((e) =>
        e.codes.some((code) => platform.codes.some((pc) => code === pc || code.startsWith(pc))),
      )
      platformEngines.set(platform.key, matched)
    }

    const csvSource = sourceIds.get('CSV_V1')!
    const tecdocSource = sourceIds.get('TECDOC')!
    const mannSource = sourceIds.get('MANN_CATALOG')!
    const manualSource = sourceIds.get('MANUAL')!

    type AssertionRow = {
      product_id: number
      engine_id: number
      source_id: number
      assertion_type: 'COMPATIBLE' | 'INCOMPATIBLE'
      restriction?: string | null
      note?: string | null
    }
    const assertions: AssertionRow[] = []

    let conflictDemo = 0
    let verifiedDemo = 0

    for (const product of products) {
      if (product.platform === 'FLUID') {
        // Motor yağları: benzinli/dizel ayrımıyla geniş uyumluluk (ilk 60 motor)
        const targets = engines
          .filter((e) => e.fuel === 'BENZIN' || e.fuel === 'DIZEL')
          .slice(0, 60)
        for (const e of targets) {
          assertions.push({
            product_id: product.id,
            engine_id: e.id,
            source_id: csvSource,
            assertion_type: 'COMPATIBLE',
          })
        }
        continue
      }

      const targets = platformEngines.get(product.platform) ?? []
      for (const [ei, engine] of targets.entries()) {
        // Ana iddia: kendi CSV'imiz
        assertions.push({
          product_id: product.id,
          engine_id: engine.id,
          source_id: csvSource,
          assertion_type: 'COMPATIBLE',
          restriction: ei % 17 === 0 ? 'Klimalı araçlar için' : null,
        })

        // İkinci kaynak: TecDoc — hemfikir (SOURCED, güven artar)
        if (ei % 2 === 0) {
          assertions.push({
            product_id: product.id,
            engine_id: engine.id,
            source_id: tecdocSource,
            assertion_type: 'COMPATIBLE',
          })
        }

        // ÇAKIŞMA DEMOSU: MANN kataloğu UYUMSUZ diyor → CONFLICTED
        // (arayüzde ASLA yeşil rozet almamalı)
        if (ei === 1 && conflictDemo < 25 && product.brand === 'MANN-FILTER') {
          assertions.push({
            product_id: product.id,
            engine_id: engine.id,
            source_id: mannSource,
            assertion_type: 'INCOMPATIBLE',
            note: 'Üretici kataloğu bu motoru kapsam dışı bırakıyor',
          })
          conflictDemo++
        }

        // DOĞRULAMA DEMOSU: admin manuel onayı → VERIFIED
        if (ei === 0 && verifiedDemo < 40) {
          assertions.push({
            product_id: product.id,
            engine_id: engine.id,
            source_id: manualSource,
            assertion_type: 'COMPATIBLE',
            note: 'Teknik ekip tarafından doğrulandı',
          })
          verifiedDemo++
        }
      }
    }

    // Toplu ekleme — 1.000'lik parçalar hâlinde
    const CHUNK = 1000
    for (let i = 0; i < assertions.length; i += CHUNK) {
      await db
        .insertInto('compatibility_assertion')
        .values(assertions.slice(i, i + CHUNK))
        .onConflict((oc) =>
          oc.columns(['product_id', 'engine_id', 'source_id', 'assertion_type']).doNothing(),
        )
        .execute()
    }
    console.log(
      `✓ ${assertions.length} uyumluluk iddiası (${conflictDemo} çakışma demosu, ${verifiedDemo} manuel doğrulama)`,
    )
  } else {
    console.log('› Demo kataloğu atlandı — ürün, OEM ve uyumluluk verisi oluşturulmadı.')
    console.log('  (Demo veri için: OCM_SEED_DEMO_CATALOG=1 npm run db:seed)')
  }

  // ─────────────────── ÇÖZÜMLEME (KATMAN 2 → KATMAN 3) ──────────────────────
  console.log('› Çözümleme motoru çalışıyor...')
  const resolved = await resolveCompatibility(db)
  console.log(
    `✓ ${resolved.resolved} uyumluluk çözümlendi · ${resolved.conflicts} açık çakışma · ${resolved.removed} kayıt kaldırıldı`,
  )

  // ─────────────────── TÜRETİLMİŞ SEO/FACET İNDEKSİ ─────────────────────────
  const indexed = await rebuildEngineCategoryIndex(db)
  console.log(`✓ ${indexed} araç×kategori indeks satırı (yalnızca ürünü olanlar)`)

  // ───────────────────────────── ÖZET RAPOR ─────────────────────────────────
  const summary = await db
    .selectFrom('product_compatibility')
    .select(({ fn }) => ['status', fn.countAll<string>().as('count')])
    .groupBy('status')
    .orderBy('status')
    .execute()

  console.log('\n  Uyumluluk durumu dağılımı:')
  for (const r of summary) {
    const label =
      r.status === 'VERIFIED'
        ? 'VERIFIED     (yeşil ✓ rozet)'
        : r.status === 'SOURCED'
          ? 'SOURCED      (yeşil ✓ rozet)'
          : r.status === 'CONFLICTED'
            ? 'CONFLICTED   (GRİ rozet — asla uyumlu gösterilmez)'
            : 'INCOMPATIBLE (kırmızı rozet)'
    console.log(`    ${label.padEnd(50)} ${String(r.count).padStart(6)}`)
  }

  console.log(`\n✓ Seed tamamlandı (${((Date.now() - t0) / 1000).toFixed(1)} sn)`)
}

main()
  .catch((err: unknown) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await closeDb()
  })
