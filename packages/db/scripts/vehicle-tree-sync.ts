/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ARAÇ AĞACI SENKRONİZASYONU — TÜR / MARKA / MODEL / MOTOR
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Çalıştırma:
 *    pnpm --filter @ocm/db exec tsx scripts/vehicle-tree-sync.ts
 *    (veya)  npx tsx packages/db/scripts/vehicle-tree-sync.ts
 *
 *  DAVRANIŞ SÖZLEŞMESİ
 *  ───────────────────
 *  • YALNIZCA EKLER VE GÜNCELLER. Hiçbir kaydı SİLMEZ, pasife ÇEKMEZ.
 *  • IDEMPOTENT: iki kez çalıştırıldığında ikinci çalıştırma hiçbir şey
 *    değiştirmez (0 ekleme / 0 güncelleme raporlar).
 *  • UYUMLULUK MİMARİSİNE DOKUNMAZ. `compatibility_assertion`,
 *    `product_compatibility`, `data_conflict`, `engine_category_index`
 *    tablolarına YAZMAZ. Yalnızca araç ağacını (tür/marka/model/nesil/motor)
 *    kurar; hangi ürünün hangi motora uyduğu bu betiğin işi değildir.
 *  • Model başına tek bir `vehicle_generation` kaydı açar (seed betiğiyle aynı
 *    yaklaşım). Nesil arayüzde ayrı adım değil, motorların bağlandığı katman.
 *  • Motorlar `arac-motorlari.ts` dosyasından gelir ve `engine_codes` BOŞ
 *    yazılır — kaynakta üretici motor kodu yok, uydurulmaz.
 *
 *  Fazlalıklar (gerçek listede olmayan demo marka/modeller) yalnızca RAPORLANIR.
 *  Temizlik, motor verisi de geldikten sonra ayrı ve bilinçli bir adımdır.
 */
import { loadEnv } from './env'
loadEnv()

import { db, closeDb, slugify } from '../src/index'
import { REAL_VEHICLE_TYPES, REAL_BRANDS, REAL_MODELS } from './seed-data/arac-agaci'
import { REAL_ENGINES, deriveFuel } from './seed-data/arac-motorlari'

/** Kaynak listesinin ilk N markası "popüler" kabul edilir (marka çipleri için). */
const POPULAR_COUNT = 12

/**
 * `--temizle` bayrağı: gerçek listede olmayan tür/marka/modelleri PASİFE ÇEKER
 * (is_active = false). SİLMEZ — kayıtlar ve bağlı motorlar veritabanında kalır,
 * yalnızca arayüzde görünmez olur; bayrak kaldırılıp tekrar çalıştırıldığında
 * geri açılabilir. Motor verisi tamamlanmadan çalıştırılması ÖNERİLMEZ.
 */
const DEACTIVATE_EXTRAS = process.argv.includes('--temizle')

const stats = {
  typeInserted: 0,
  typeUpdated: 0,
  brandInserted: 0,
  brandUpdated: 0,
  brandRenamed: [] as string[],
  linkInserted: 0,
  modelInserted: 0,
  modelUpdated: 0,
  generationInserted: 0,
  engineInserted: 0,
  engineUpdated: 0,
  engineModelMissing: [] as string[],
  slugCollisions: [] as string[],
  twinModels: [] as string[],
  similarModels: [] as string[],
}

/** 'A4 (8K, B8)' → '8K, B8' · 'Cruze' → null */
function extractCode(name: string): string | null {
  const m = /\(([^)]+)\)/.exec(name)
  if (!m?.[1]) return null
  return m[1].trim().slice(0, 40)
}

/** 'X3 (G01, F97)' → { seri: 'X3', kodlar: ['G01','F97'] } */
function splitModelName(name: string): { seri: string; kodlar: string[] } {
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(name)
  const seri = (m?.[1] ?? name)
    .replace(/\bSER[İI]S[İI]\b/gi, '')
    .trim()
    .toLocaleUpperCase('tr')
  const kodlar = (m?.[2] ?? '')
    .split(/[/,]/)
    .map((c) => c.trim().toLocaleUpperCase('tr'))
    .filter(Boolean)
  return { seri, kodlar }
}

/**
 * İki model adı AYNI aracı mı anlatıyor?
 *
 * Seri adı aynı (SERİSİ sözcüğü yok sayılır) VE nesil kod kümeleri BİREBİR
 * aynıysa evet. Örnek: "3 (G20)" ile "3 SERİSİ (G20)" → aynı araç.
 *
 * ⚠ KESİŞİM YETMEZ, KÜME EŞİTLİĞİ ŞARTTIR.
 * Önce "kodlardan biri ortaksa aynıdır" kuralı vardı ve YANLIŞTI: kaynakta
 * "X3 (G01)" ile "X3 (G01, F97)" AYRI kategori sayfalarıdır ve motor
 * listeleri tamamen farklıdır (biri 20dX/25dX/30iX, öteki 18 d Mild-Hybrid /
 * M40 iX...). Aynı durum "3 (G20)" ↔ "3 (G20, G21, G80, G81)",
 * "X4 (G02)" ↔ "X4 (G02, F98)" ve "X5 (G05)" ↔ "X5 (G05, F95)" için de
 * geçerli. Kesişim kuralı bu dördünü ikiz sanıp birleştirmemize yol açtı;
 * kaynağın kendi sayfaları geldiğinde hata ortaya çıktı ve geri alındı.
 *
 * Kodu hiç olmayan adlar ('Cruze') yalnızca iki tarafta da kod yoksa eşleşir;
 * "Corolla" ile "Corolla (E210)" burada ikiz SAYILMAZ — kaynağın ikisini de
 * ayrı sayfa olarak tutması mümkün, karar gözle verilmelidir.
 */
export function sameVehicle(a: string, b: string): boolean {
  const x = splitModelName(a)
  const y = splitModelName(b)
  if (x.seri !== y.seri) return false
  if (x.kodlar.length !== y.kodlar.length) return false
  return x.kodlar.every((k) => y.kodlar.includes(k))
}

/**
 * Aynı seriden ama kod kümesi farklı adlar — ikiz DEĞİL, "bakılması gereken".
 *
 * "Corolla" ↔ "Corolla (E210)" ya da "X3 (G01)" ↔ "X3 (G01, F97)" bu gruba
 * girer. Birleştirilmezler; yalnızca raporlanır, çünkü kaynağın ikisini de
 * ayrı sayfa olarak tutması mümkündür (BMW'de öyle çıktı) ama eski elle
 * yazılmış bir kaydın artığı da olabilir. Karar gözle verilir.
 */
export function similarVehicle(a: string, b: string): boolean {
  if (sameVehicle(a, b)) return false
  const x = splitModelName(a)
  const y = splitModelName(b)
  if (x.seri !== y.seri) return false
  if (!x.kodlar.length || !y.kodlar.length) return true
  return x.kodlar.some((k) => y.kodlar.includes(k))
}

/**
 * Bir markanın model adlarını slug'lara çevirir.
 *
 * TEK KAYNAK: hem yazma hem raporlama bu fonksiyonu kullanır. Aksi hâlde
 * çakışma çözümü iki yerde farklı hesaplanır ve gerçek modeller "fazlalık"
 * diye raporlanır.
 *
 * • '206+' gibi adlarda sondaki '+' sessizce düşerdi → '206' ile çakışırdı;
 *   'plus'a çevrilir. DİKKAT: yalnızca SONA yapışık '+' çevrilir. Ayraç olarak
 *   kullanılan '+' ('A5 + A5 Cabriolet', 'B6+B7') olduğu gibi bırakılır; aksi
 *   hâlde bu modellerin slug'ları değişir ve veritabanında kopyaları oluşur.
 * • Kaynakta aynı araç iki farklı yazımla iki kez geçebiliyor (ör. Renault
 *   'Mégane IV' + 'Megane IV'). Çakışan ikinci kayda ARTAN SAYAÇ eklenir —
 *   dizi indeksi değil, çünkü listeye yeni model eklendiğinde indeks kayar
 *   ve aynı araç ikinci kez oluşurdu.
 */
function modelSlugs(names: string[]): Array<{ slug: string; collided: boolean }> {
  const used = new Map<string, number>()
  return names.map((name) => {
    const base = slugify(name.replace(/(\w)\+(?!\w)/g, '$1 plus')).slice(0, 80)
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    return seen === 0
      ? { slug: base, collided: false }
      : { slug: `${base}-${seen + 1}`.slice(0, 80), collided: true }
  })
}

async function syncTypes(): Promise<Map<string, number>> {
  const ids = new Map<string, number>()
  for (const t of REAL_VEHICLE_TYPES) {
    const existing = await db
      .selectFrom('vehicle_type')
      .select(['id', 'name', 'icon', 'sort_order', 'is_active'])
      .where('slug', '=', t.slug)
      .executeTakeFirst()

    if (!existing) {
      const row = await db
        .insertInto('vehicle_type')
        .values({ name: t.name, slug: t.slug, icon: t.icon, sort_order: t.sortOrder })
        .returning('id')
        .executeTakeFirstOrThrow()
      ids.set(t.slug, row.id)
      stats.typeInserted++
      continue
    }

    ids.set(t.slug, existing.id)
    const needsUpdate =
      existing.name !== t.name ||
      existing.icon !== t.icon ||
      existing.sort_order !== t.sortOrder ||
      existing.is_active !== true
    if (needsUpdate) {
      await db
        .updateTable('vehicle_type')
        .set({ name: t.name, icon: t.icon, sort_order: t.sortOrder, is_active: true })
        .where('id', '=', existing.id)
        .execute()
      stats.typeUpdated++
    }
  }
  return ids
}

async function syncBrands(typeIds: Map<string, number>): Promise<Map<string, number>> {
  const brandIds = new Map<string, number>()

  for (const [index, brand] of REAL_BRANDS.entries()) {
    const slug = brand.slug ?? slugify(brand.name)
    const isPopular = index < POPULAR_COUNT
    const sortOrder = index * 10

    // 1) Kanonik slug · 2) eski (bozuk) slug · 3) ad eşleşmesi
    let existing = await db
      .selectFrom('vehicle_brand')
      .select(['id', 'name', 'slug', 'country', 'is_popular', 'sort_order', 'is_active'])
      .where('slug', '=', slug)
      .executeTakeFirst()

    if (!existing && brand.aliasSlugs?.length) {
      existing = await db
        .selectFrom('vehicle_brand')
        .select(['id', 'name', 'slug', 'country', 'is_popular', 'sort_order', 'is_active'])
        .where('slug', 'in', brand.aliasSlugs)
        .executeTakeFirst()
      if (existing) stats.brandRenamed.push(`${existing.slug} → ${slug}`)
    }

    if (!existing) {
      const row = await db
        .insertInto('vehicle_brand')
        .values({
          name: brand.name,
          slug,
          country: brand.country ?? null,
          is_popular: isPopular,
          sort_order: sortOrder,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      brandIds.set(slug, row.id)
      stats.brandInserted++
    } else {
      brandIds.set(slug, existing.id)
      const needsUpdate =
        existing.name !== brand.name ||
        existing.slug !== slug ||
        existing.country !== (brand.country ?? null) ||
        existing.is_popular !== isPopular ||
        existing.sort_order !== sortOrder ||
        existing.is_active !== true
      if (needsUpdate) {
        await db
          .updateTable('vehicle_brand')
          .set({
            name: brand.name,
            slug,
            country: brand.country ?? null,
            is_popular: isPopular,
            sort_order: sortOrder,
            is_active: true,
          })
          .where('id', '=', existing.id)
          .execute()
        stats.brandUpdated++
      }
    }

    // Marka ↔ tür bağları (bir marka birden çok türde olabilir: Ford, Iveco…)
    const brandId = brandIds.get(slug)
    if (brandId === undefined) continue
    for (const typeSlug of brand.types) {
      const typeId = typeIds.get(typeSlug)
      if (typeId === undefined) continue
      const link = await db
        .selectFrom('vehicle_brand_type')
        .select('brand_id')
        .where('brand_id', '=', brandId)
        .where('type_id', '=', typeId)
        .executeTakeFirst()
      if (!link) {
        await db
          .insertInto('vehicle_brand_type')
          .values({ brand_id: brandId, type_id: typeId })
          .execute()
        stats.linkInserted++
      }
    }
  }

  return brandIds
}

async function syncModels(brandIds: Map<string, number>): Promise<void> {
  for (const [brandSlug, modelNames] of Object.entries(REAL_MODELS)) {
    const brandId = brandIds.get(brandSlug)
    if (brandId === undefined) {
      console.warn(`  ! '${brandSlug}' markası REAL_BRANDS içinde yok — modelleri atlandı`)
      continue
    }

    const slugs = modelSlugs(modelNames)
    for (const [order, name] of modelNames.entries()) {
      const resolved = slugs[order]
      if (resolved === undefined) continue
      const slug = resolved.slug
      if (resolved.collided) {
        stats.slugCollisions.push(`${brandSlug}/${slug} ← "${name}"`)
      }

      const code = extractCode(name)
      const existing = await db
        .selectFrom('vehicle_model')
        .select(['id', 'name', 'code', 'sort_order', 'is_active'])
        .where('brand_id', '=', brandId)
        .where('slug', '=', slug)
        .executeTakeFirst()

      let modelId: number
      if (!existing) {
        /*
         * İKİZ MODEL KORUMASI
         *
         * Slug ile arama, aynı aracın FARKLI yazımlarını yakalayamıyor:
         * "3 (G20)", "3 SERİSİ (G20)" ve "3 (G20, G21, G80, G81)" üç ayrı
         * slug üretir; üçü de kaydedilince katalogda aynı araç üç kez
         * görünüyordu (biri motorlu, ikisi boş).
         *
         * Kural: seri adı (SERİSİ sözcüğü atılarak) aynıysa ve parantez
         * içindeki nesil kodlarından EN AZ BİRİ ortaksa, bu aynı araçtır.
         * Kod listesi kesişmiyorsa ayrı nesildir — "X5 (E53)" ile
         * "X5 (E70)" birbirine karışmaz.
         */
        const mevcutlar = await db
          .selectFrom('vehicle_model')
          .select(['name'])
          .where('brand_id', '=', brandId)
          .execute()
        const twin = mevcutlar.find((m) => sameVehicle(m.name, name))
        /*
         * Burada HATA VERİLMEZ, RAPOR EDİLİR. Sebep: ikizin bir ucu bu
         * betiğin oluşturduğu KAYNAK adı, öteki ucu `vehicles.ts`'den gelen
         * eski addır. Hata verilirse kaynak adı hiç oluşmaz ve ona bağlanacak
         * ürünler yersiz kalır — yani ilacı hastalıktan beter olur.
         *
         * Rapor her çalıştırmada listeyi yüzümüze vurur; birleştirme kararı
         * marka marka verilir (BEKLEYEN-IS.md'ye bakınız).
         */
        if (twin) stats.twinModels.push(`${brandSlug}: "${twin.name}" ↔ "${name}"`)
        else {
          const benzer = mevcutlar.find((m) => similarVehicle(m.name, name))
          if (benzer) stats.similarModels.push(`${brandSlug}: "${benzer.name}" ↔ "${name}"`)
        }

        const row = await db
          .insertInto('vehicle_model')
          .values({
            brand_id: brandId,
            name,
            slug,
            code,
            // Yıl aralığı kaynak ekranlarda yok — bilinmiyor olarak bırakılır.
            year_from: null,
            year_to: null,
            body_type: null,
            sort_order: order * 10,
          })
          .returning('id')
          .executeTakeFirstOrThrow()
        modelId = row.id
        stats.modelInserted++
      } else {
        modelId = existing.id
        if (
          existing.name !== name ||
          existing.code !== code ||
          existing.sort_order !== order * 10 ||
          existing.is_active !== true
        ) {
          await db
            .updateTable('vehicle_model')
            .set({ name, code, sort_order: order * 10, is_active: true })
            .where('id', '=', modelId)
            .execute()
          stats.modelUpdated++
        }
      }

      // Motorların bağlanabilmesi için model başına tek nesil
      const gen = await db
        .selectFrom('vehicle_generation')
        .select('id')
        .where('model_id', '=', modelId)
        .executeTakeFirst()
      if (!gen) {
        await db
          .insertInto('vehicle_generation')
          .values({ model_id: modelId, name, code, year_from: null, year_to: null })
          .execute()
        stats.generationInserted++
      }
    }
  }
}

/**
 * '1.9 JTD 16V 103kw 140hp' → { cc: 1900, kw: 103, hp: 140 }
 *
 * `cc` PAZARLAMA HACMİNDEN üretilir (1.9 → 1900), gerçek silindir hacmi
 * (1910) değildir; kaynakta gerçek değer yok. Bu yüzden hacme dayalı
 * eşleştirme ıskalayabilir — bu, yanlış eşleşmeye yeğdir.
 */
function parseEngineSpecs(name: string): {
  cc: number | null
  kw: number | null
  hp: number | null
} {
  const disp = /^\s*(\d+)[.,](\d+)/.exec(name)
  const kw = /(\d+)\s*kw\b/i.exec(name)
  const hp = /(\d+)\s*hp\b/i.exec(name)
  return {
    cc: disp ? Math.round(Number(`${disp[1]}.${disp[2]}`) * 1000) : null,
    kw: kw?.[1] ? Number(kw[1]) : null,
    hp: hp?.[1] ? Number(hp[1]) : null,
  }
}

/**
 * Motor katmanı.
 *
 * • `engine_codes` BOŞ bırakılır — kaynakta motor kodu yok. Uydurulmuş kod
 *   yazmak, uyumluluk eşleştirmesinin en güvendiği anahtarı zehirlerdi.
 * • Motor adı kaynaktaki yazımla korunur; içe aktarmada 2. adım eşleştirme
 *   (marka + model + normalize motor adı) buna dayanır.
 * • Yakıt tipi belirlenemezse betik DURUR. Sessiz varsayım yok.
 */
async function syncEngines(brandIds: Map<string, number>): Promise<void> {
  // ── ÖN KONTROL: yazmadan ÖNCE bütün yakıt tiplerini çöz ──────────────────
  // Önceden bu kontrol yazma döngüsünün içindeydi ve hata en sonda atılıyordu:
  // 300 motor yazıldıktan sonra "yakıt belirlenemedi" hatası geliyor, kullanıcı
  // hiçbir şey yazılmadığını sanıyordu. Artık tek bir sorunlu ad varsa
  // veritabanına HİÇ dokunulmuyor.
  const unknownFuel: string[] = []
  for (const [brandSlug, byModel] of Object.entries(REAL_ENGINES)) {
    for (const [modelName, engines] of Object.entries(byModel)) {
      for (const entry of engines) {
        const name = typeof entry === 'string' ? entry : entry.name
        const fuel = typeof entry === 'string' ? deriveFuel(name) : entry.fuel
        if (!fuel) unknownFuel.push(`${brandSlug}/"${modelName}" → "${name}"`)
      }
    }
  }
  if (unknownFuel.length) {
    throw new Error(
      'Yakıt tipi belirlenemeyen motorlar var; hiçbir şey yazılmadı. Ada anahtar ' +
        "kelime ekleyin ya da arac-motorlari.ts'de { name, fuel } biçimiyle açıkça yazın:\n  " +
        unknownFuel.join('\n  '),
    )
  }

  for (const [brandSlug, byModel] of Object.entries(REAL_ENGINES)) {
    const brandId = brandIds.get(brandSlug)
    if (brandId === undefined) {
      console.warn(`  ! '${brandSlug}' markası REAL_BRANDS içinde yok — motorları atlandı`)
      continue
    }

    // Model ADI → slug (modeller de aynı fonksiyonla yazıldığı için birebir tutar)
    const modelNames = REAL_MODELS[brandSlug] ?? []
    const resolved = modelSlugs(modelNames)
    const slugByName = new Map(modelNames.map((n, i) => [n, resolved[i]?.slug]))

    for (const [modelName, engines] of Object.entries(byModel)) {
      const modelSlug = slugByName.get(modelName)
      if (!modelSlug) {
        stats.engineModelMissing.push(`${brandSlug}/"${modelName}"`)
        continue
      }

      const model = await db
        .selectFrom('vehicle_model')
        .select('id')
        .where('brand_id', '=', brandId)
        .where('slug', '=', modelSlug)
        .executeTakeFirst()
      if (!model) {
        stats.engineModelMissing.push(`${brandSlug}/${modelSlug} (veritabanında yok)`)
        continue
      }

      const gen = await db
        .selectFrom('vehicle_generation')
        .select('id')
        .where('model_id', '=', model.id)
        .orderBy('id')
        .executeTakeFirst()
      if (!gen) {
        stats.engineModelMissing.push(`${brandSlug}/${modelSlug} (nesil yok)`)
        continue
      }

      const usedSlugs = new Set<string>()
      for (const [order, entry] of engines.entries()) {
        const name = typeof entry === 'string' ? entry : entry.name
        // Ön kontrolden geçtiği için burada null olamaz.
        const fuel = typeof entry === 'string' ? deriveFuel(name) : entry.fuel
        if (!fuel) continue

        let slug = slugify(name).slice(0, 80)
        if (usedSlugs.has(slug)) slug = `${slug}-${order + 1}`.slice(0, 80)
        usedSlugs.add(slug)

        const { cc, kw, hp } = parseEngineSpecs(name)
        const existing = await db
          .selectFrom('vehicle_engine')
          .select([
            'id',
            'name',
            'displacement_cc',
            'power_kw',
            'power_hp',
            'fuel_type',
            'sort_order',
            'is_active',
          ])
          .where('generation_id', '=', gen.id)
          .where('slug', '=', slug)
          .executeTakeFirst()

        if (!existing) {
          /*
           * İKİZ MOTOR KORUMASI
           *
           * Arama `slug` ile yapılıyor; "30 TFSI 1.0 81 kW 110 HP" ile
           * "30 TFSI 1.0 81kw 110hp" FARKLI slug üretiyor ve aynı motor
           * katalogda iki kez çıkıyordu (biri ürünlü, biri bomboş). Yazım
           * farkını yok sayan bir karşılaştırma ile önce ikizi arıyoruz.
           */
          const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
          const twin = (
            await db
              .selectFrom('vehicle_engine')
              .select(['name'])
              .where('generation_id', '=', gen.id)
              .execute()
          ).find((e) => norm(e.name) === norm(name))
          if (twin) {
            throw new Error(
              `İKİZ MOTOR: "${model.name}" nesli altında "${twin.name}" zaten var; ` +
                `"${name}" onun başka yazımı. arac-motorlari.ts'den bu satırı kaldırın ` +
                `ve ürün eşlemelerinde "${twin.name}" yazımını kullanın.`,
            )
          }

          await db
            .insertInto('vehicle_engine')
            .values({
              generation_id: gen.id,
              model_id: model.id,
              name,
              slug,
              // Motor kodu kaynakta yok — boş bırakılır, uydurulmaz.
              engine_codes: [],
              displacement_cc: cc,
              power_kw: kw,
              power_hp: hp,
              fuel_type: fuel,
              year_from: null,
              year_to: null,
              sort_order: order * 10,
            })
            .execute()
          stats.engineInserted++
        } else if (
          existing.name !== name ||
          existing.displacement_cc !== cc ||
          existing.power_kw !== kw ||
          existing.power_hp !== hp ||
          existing.fuel_type !== fuel ||
          existing.sort_order !== order * 10 ||
          existing.is_active !== true
        ) {
          await db
            .updateTable('vehicle_engine')
            .set({
              name,
              displacement_cc: cc,
              power_kw: kw,
              power_hp: hp,
              fuel_type: fuel,
              sort_order: order * 10,
              is_active: true,
            })
            .where('id', '=', existing.id)
            .execute()
          stats.engineUpdated++
        }
      }
    }
  }
}

/** Gerçek listede yer almayan mevcut kayıtlar — silinmez, yalnızca listelenir. */
async function reportLeftovers(brandIds: Map<string, number>): Promise<void> {
  const realBrandIds = new Set(brandIds.values())
  const allBrands = await db
    .selectFrom('vehicle_brand')
    .select(['id', 'name', 'slug'])
    .orderBy('name')
    .execute()
  const extraBrands = allBrands.filter((b) => !realBrandIds.has(b.id))

  const extraModels: string[] = []
  for (const [brandSlug, modelNames] of Object.entries(REAL_MODELS)) {
    const brandId = brandIds.get(brandSlug)
    if (brandId === undefined) continue
    const realSlugs = new Set(modelSlugs(modelNames).map((r) => r.slug))
    const rows = await db
      .selectFrom('vehicle_model')
      .select(['slug', 'name'])
      .where('brand_id', '=', brandId)
      .execute()
    for (const r of rows) {
      if (!realSlugs.has(r.slug)) extraModels.push(`${brandSlug}/${r.slug}`)
    }
  }

  // Motoru olmayan model sayısı — araç seçicide motor adımı boş kalır
  const [engineless] = await db
    .selectFrom('vehicle_model as m')
    .leftJoin('vehicle_engine as e', 'e.model_id', 'm.id')
    .select(({ fn }) => fn.count<string>('m.id').distinct().as('n'))
    .where('e.id', 'is', null)
    .execute()

  const realTypeSlugs = REAL_VEHICLE_TYPES.map((t) => t.slug)
  const extraTypes = await db
    .selectFrom('vehicle_type')
    .select(['id', 'slug'])
    .where('slug', 'not in', realTypeSlugs)
    .where('is_active', '=', true)
    .execute()

  console.log('\n── FAZLALIK / EKSİK RAPORU ──────────────────────────────────')
  console.log(
    `Gerçek listede olmayan tür  : ${extraTypes.length}` +
      (extraTypes.length ? ` → ${extraTypes.map((t) => t.slug).join(', ')}` : ''),
  )
  console.log(
    `Gerçek listede olmayan marka: ${extraBrands.length}` +
      (extraBrands.length ? ` → ${extraBrands.map((b) => b.slug).join(', ')}` : ''),
  )
  console.log(
    `Gerçek listede olmayan model: ${extraModels.length}` +
      (extraModels.length ? ` → ${extraModels.join(', ')}` : ''),
  )
  console.log(`Motoru olmayan model: ${engineless?.n ?? '0'} (motor verisi bekleniyor)`)

  if (!DEACTIVATE_EXTRAS) {
    console.log(
      'Hiçbiri silinmedi/pasife çekilmedi. Gizlemek için: npm run db:vehicle-tree -- --temizle',
    )
    return
  }

  // ── --temizle: yalnızca is_active=false. DELETE YOK. ────────────────────────
  if (extraTypes.length) {
    await db
      .updateTable('vehicle_type')
      .set({ is_active: false })
      .where(
        'id',
        'in',
        extraTypes.map((t) => t.id),
      )
      .execute()
  }
  if (extraBrands.length) {
    await db
      .updateTable('vehicle_brand')
      .set({ is_active: false })
      .where(
        'id',
        'in',
        extraBrands.map((b) => b.id),
      )
      .execute()
  }
  for (const [brandSlug, modelNames] of Object.entries(REAL_MODELS)) {
    const brandId = brandIds.get(brandSlug)
    if (brandId === undefined) continue
    const realSlugs = modelSlugs(modelNames).map((r) => r.slug)
    await db
      .updateTable('vehicle_model')
      .set({ is_active: false })
      .where('brand_id', '=', brandId)
      .where('slug', 'not in', realSlugs)
      .execute()
  }
  console.log(
    `--temizle: ${extraTypes.length} tür · ${extraBrands.length} marka · ` +
      `${extraModels.length} model PASİFE ÇEKİLDİ (silinmedi).`,
  )
}

async function main(): Promise<void> {
  console.log('\nARAÇ AĞACI SENKRONİZASYONU (tür · marka · model)\n')

  const typeIds = await syncTypes()
  const brandIds = await syncBrands(typeIds)
  await syncModels(brandIds)
  await syncEngines(brandIds)

  const modelTotal = Object.values(REAL_MODELS).reduce((a, v) => a + v.length, 0)
  const withModels = Object.keys(REAL_MODELS).length

  console.log('── YAZILANLAR ───────────────────────────────────────────────')
  console.log(`Tür     : +${stats.typeInserted} yeni · ${stats.typeUpdated} güncellendi`)
  console.log(`Marka   : +${stats.brandInserted} yeni · ${stats.brandUpdated} güncellendi`)
  if (stats.brandRenamed.length) {
    console.log(`          slug taşındı: ${stats.brandRenamed.join(' · ')}`)
  }
  console.log(`Tür bağı: +${stats.linkInserted}`)
  console.log(`Model   : +${stats.modelInserted} yeni · ${stats.modelUpdated} güncellendi`)
  console.log(`Nesil   : +${stats.generationInserted}`)
  console.log(`Motor   : +${stats.engineInserted} yeni · ${stats.engineUpdated} güncellendi`)
  if (stats.engineModelMissing.length) {
    console.warn(
      `  ! Motoru olan ama modeli bulunamayan kayıt: ${stats.engineModelMissing.join(' · ')}`,
    )
  }
  if (stats.slugCollisions.length) {
    console.log(`Slug çakışması çözüldü: ${stats.slugCollisions.join(' · ')}`)
  }

  if (stats.twinModels.length) {
    console.log(
      `\n⚠ İKİZ MODEL — aynı araç birden fazla adla kayıtlı (${stats.twinModels.length} çift).\n` +
        `  Katalogda aynı araç iki kez görünür; ürünler yalnızca birine bağlanır.\n` +
        `  Birleştirme kararı marka marka verilir — BEKLEYEN-IS.md'ye bakınız.\n`,
    )
    for (const t of stats.twinModels) console.log(`    ${t}`)
  }

  if (stats.similarModels.length) {
    console.log(
      `\nℹ AYNI SERİ, FARKLI KOD — ${stats.similarModels.length} çift. İkiz DEĞİL:\n` +
        `  kaynak bunları ayrı sayfa olarak tutuyor olabilir (BMW'de öyle çıktı),\n` +
        `  ama eski elle yazılmış bir kaydın artığı da olabilir. Gözle bakılmalı.\n`,
    )
    for (const t of stats.similarModels) console.log(`    ${t}`)
  }

  console.log(
    `\nKaynak listesi: ${REAL_BRANDS.length} marka · ` +
      `${withModels} markanın modeli girildi (${modelTotal} model) · ` +
      `${REAL_BRANDS.length - withModels} marka henüz modelsiz`,
  )

  await reportLeftovers(brandIds)
  console.log('')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(closeDb)
