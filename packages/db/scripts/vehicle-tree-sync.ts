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

import { sql } from 'kysely'
import type { Kysely, Transaction } from 'kysely'
import { db, closeDb, slugify } from '../src/index'
import type { Database } from '../src/types'
import { REAL_VEHICLE_TYPES, REAL_BRANDS, REAL_MODELS } from './seed-data/arac-agaci'
import { REAL_ENGINES, deriveFuel } from './seed-data/arac-motorlari'

/**
 * TÜM SENKRONİZASYON TEK İŞLEMDE (transaction) ÇALIŞIR.
 *
 * Eskiden her ekleme anında commit ediliyordu ve fonksiyonlar ortada hata
 * fırlatabiliyordu (ör. ikiz motor koruması). Sonuç: ağaç YARIM kalıyordu —
 * hatanın öncesindeki markaların motorları vardı, sonrasındakiler hiç yoktu.
 * Bunu hiçbir şey söylemiyordu; sorun ancak ürün içe aktarmasında binlerce
 * E_ENGINE_NOT_FOUND olarak ortaya çıkıyordu.
 *
 * Daha kötüsü, yarım ağaç sonraki çalıştırmaları da bozuyordu: motor slug'ları
 * model içindeki SIRAYA göre `-2`, `-3` ekiyle çakışma çözüyor; yarım kalmış
 * bir modelde sıra kaydığı için arama ıskalıyor ve ikiz koruması bu kez BAŞKA
 * bir yerde tetikleniyordu. Her deneme ağacı biraz daha bozuyordu.
 *
 * Artık ya hepsi yazılır ya hiçbiri. `tx`, main() içinde işlem tutamacıyla
 * değiştirilir; sync fonksiyonları doğrudan `db` yerine bunu kullanır.
 */
type Yazici = Kysely<Database> | Transaction<Database>
let tx: Yazici = db

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
  twinEngines: [] as string[],
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

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  TOPLU OKUMA / TOPLU YAZMA
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Eskiden her satır için ayrı SELECT + ayrı INSERT yapılıyordu. Ölçüldü:
 *  bir senkronizasyon **29.951 SQL sorgusu** üretiyordu (motor başına üç
 *  sorgu: slug ile arama, ikiz denetimi için neslin TÜM motorları, ekleme).
 *
 *  Yerelde gidiş-dönüş ~0,2 ms olduğu için bu 8 saniye sürüyor ve göze
 *  batmıyordu. Uzak bir veritabanında (Neon) gidiş-dönüş ~45 ms; aynı iş
 *  29.951 × 45 ms ≈ 22 DAKİKA sürüyor. Üstelik tüm çıktı main()'in sonunda
 *  basıldığı için ekranda hiçbir şey görünmüyor: kullanıcı donmuş sanıyor.
 *
 *  Artık her aşama üç adımdır: (1) ilgili tablonun tamamı TEK sorguyla
 *  belleğe alınır, (2) fark bellekte hesaplanır, (3) eklenecekler tek çok
 *  satırlı INSERT ile yazılır. Sorgu sayısı üç haneye iner.
 */

/** Kysely boş dizide hata verir; her toplu eklemede bu koruma kullanılır. */
async function topluEkle<T>(
  satirlar: T[],
  parca: number,
  ad: string,
  yaz: (dilim: T[]) => Promise<void>,
): Promise<void> {
  if (!satirlar.length) return
  const toplamDilim = Math.ceil(satirlar.length / parca)
  let no = 0
  for (let i = 0; i < satirlar.length; i += parca) {
    const dilim = satirlar.slice(i, i + parca)
    if (!dilim.length) continue
    no++
    await olc(`${ad} INSERT ${no}/${toplamDilim} (${dilim.length} satır)`, () => yaz(dilim))
  }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  AŞAMA GÜNLÜĞÜ VE ZAMAN SINIRLARI
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Bu betik daha önce Neon üzerinde 30 dakika HİÇBİR ÇIKTI VERMEDEN bekledi.
 *  Sebebini kimse göremedi, çünkü ekranda tek bir satır bile yoktu: bütün
 *  çıktı en sonda basılıyordu ve takılan sorgunun adı hiçbir yerde geçmiyordu.
 *
 *  Artık her sorgu BAŞLARKEN ve BİTERKEN satır basar, her sorgunun kendi süre
 *  sınırı vardır ve betiğin tamamının bir üst sınırı vardır. Takılma artık
 *  sessizlik olarak değil, takılan aşamanın ADIYLA birlikte hata olarak görünür.
 *
 *  Ayarlar (ortam değişkeni):
 *    OCM_SORGU_SINIRI   tek sorgu sınırı, ms   (öntanımlı 60000)
 *    OCM_TOPLAM_SINIRI  betik sınırı, ms       (öntanımlı 600000 = 10 dk)
 */
const SORGU_SINIRI = Number(process.env.OCM_SORGU_SINIRI ?? 60_000)
const TOPLAM_SINIRI = Number(process.env.OCM_TOPLAM_SINIRI ?? 600_000)

const t0 = Date.now()
let sonAsama = '(başlamadı)'

function sure(): string {
  return ((Date.now() - t0) / 1000).toFixed(1).padStart(6)
}

function adim(mesaj: string): void {
  console.log(`  [${sure()} sn] ${mesaj}`)
}

/**
 * Bir sorguyu adıyla birlikte çalıştırır: başlarken satır basar, bitince
 * süresini yazar, sınırı aşarsa AÇIKÇA hata verir.
 *
 * Not: zaman aşımı sorguyu iptal etmez — sunucu tarafında `lock_timeout` ve
 * `statement_timeout` bunu zaten yapıyor (bkz. packages/db/src/client.ts).
 * Buradaki sınır, ağ tamamen sessizleştiğinde (paket gitmiyor, hata da
 * dönmüyor) beklemeyi kesmek içindir.
 */
async function olc<T>(ad: string, is: () => Promise<T>): Promise<T> {
  sonAsama = ad
  process.stdout.write(`  [${sure()} sn] → ${ad}\n`)
  const bas = Date.now()
  let zaman: NodeJS.Timeout | undefined
  try {
    const sonuc = await Promise.race([
      is(),
      new Promise<never>((_, red) => {
        zaman = setTimeout(
          () => red(new Error(`ZAMAN AŞIMI (${SORGU_SINIRI} ms) — takılan aşama: ${ad}`)),
          SORGU_SINIRI,
        )
      }),
    ])
    console.log(`  [${sure()} sn] ✓ ${ad} · ${Date.now() - bas} ms`)
    return sonuc
  } finally {
    if (zaman) clearTimeout(zaman)
  }
}

async function syncTypes(): Promise<Map<string, number>> {
  const mevcut = await olc('3. vehicle_type SELECT', () =>
    tx
      .selectFrom('vehicle_type')
      .select(['id', 'name', 'slug', 'icon', 'sort_order', 'is_active'])
      .execute(),
  )
  const bySlug = new Map(mevcut.map((r) => [r.slug, r]))
  const ids = new Map<string, number>()

  const eklenecek = REAL_VEHICLE_TYPES.filter((t) => !bySlug.has(t.slug))
  for (const t of REAL_VEHICLE_TYPES) {
    const v = bySlug.get(t.slug)
    if (v) ids.set(t.slug, v.id)
  }
  if (eklenecek.length) {
    const yeni = await olc(`vehicle_type INSERT (${eklenecek.length} satır)`, () =>
      tx
        .insertInto('vehicle_type')
        .values(
          eklenecek.map((t) => ({
            name: t.name,
            slug: t.slug,
            icon: t.icon,
            sort_order: t.sortOrder,
          })),
        )
        .returning(['id', 'slug'])
        .execute(),
    )
    for (const r of yeni) ids.set(r.slug, r.id)
    stats.typeInserted += yeni.length
  }

  const guncellenecek = REAL_VEHICLE_TYPES.filter((t) => {
    const v = bySlug.get(t.slug)
    return (
      v && (v.name !== t.name || v.icon !== t.icon || v.sort_order !== t.sortOrder || !v.is_active)
    )
  })
  if (guncellenecek.length) {
    // İlk YAZMA işlemi burasıdır: takılırsa neredeyse kesinlikle SATIR KİLİDİ
    // vardır (yarıda kesilmiş bir çalıştırmadan kalan açık işlem).
    await olc(`vehicle_type UPDATE (${guncellenecek.length} satır)`, async () => {
      for (const t of guncellenecek) {
        const v = bySlug.get(t.slug)!
        await tx
          .updateTable('vehicle_type')
          .set({ name: t.name, icon: t.icon, sort_order: t.sortOrder, is_active: true })
          .where('id', '=', v.id)
          .execute()
        stats.typeUpdated++
      }
    })
  }
  adim(`tür: ${ids.size}`)
  return ids
}

async function syncBrands(typeIds: Map<string, number>): Promise<Map<string, number>> {
  const mevcut = await olc('4. vehicle_brand SELECT', () =>
    tx
      .selectFrom('vehicle_brand')
      .select(['id', 'name', 'slug', 'country', 'is_popular', 'sort_order', 'is_active'])
      .execute(),
  )
  const bySlug = new Map(mevcut.map((r) => [r.slug, r]))
  const brandIds = new Map<string, number>()

  type Hedef = { slug: string; name: string; country: string | null; pop: boolean; sira: number }
  const hedefler: Hedef[] = REAL_BRANDS.map((brand, index) => ({
    slug: brand.slug ?? slugify(brand.name),
    name: brand.name,
    country: brand.country ?? null,
    pop: index < POPULAR_COUNT,
    sira: index * 10,
  }))

  const eklenecek: Hedef[] = []
  const guncellenecek: Array<{ id: number; h: Hedef }> = []
  for (const [index, brand] of REAL_BRANDS.entries()) {
    const h = hedefler[index]!
    let v = bySlug.get(h.slug)
    if (!v && brand.aliasSlugs?.length) {
      for (const alias of brand.aliasSlugs) {
        const a = bySlug.get(alias)
        if (a) {
          v = a
          stats.brandRenamed.push(`${a.slug} → ${h.slug}`)
          break
        }
      }
    }
    if (!v) eklenecek.push(h)
    else {
      brandIds.set(h.slug, v.id)
      if (
        v.name !== h.name ||
        v.slug !== h.slug ||
        v.country !== h.country ||
        v.is_popular !== h.pop ||
        v.sort_order !== h.sira ||
        !v.is_active
      ) {
        guncellenecek.push({ id: v.id, h })
      }
    }
  }

  if (eklenecek.length) {
    const yeni = await olc(`vehicle_brand INSERT (${eklenecek.length} satır)`, () =>
      tx
        .insertInto('vehicle_brand')
        .values(
          eklenecek.map((h) => ({
            name: h.name,
            slug: h.slug,
            country: h.country,
            is_popular: h.pop,
            sort_order: h.sira,
          })),
        )
        .returning(['id', 'slug'])
        .execute(),
    )
    for (const r of yeni) brandIds.set(r.slug, r.id)
    stats.brandInserted += yeni.length
  }
  if (guncellenecek.length) {
    await olc(`vehicle_brand UPDATE (${guncellenecek.length} satır)`, async () => {
      for (const { id, h } of guncellenecek) {
        await tx
          .updateTable('vehicle_brand')
          .set({
            name: h.name,
            slug: h.slug,
            country: h.country,
            is_popular: h.pop,
            sort_order: h.sira,
            is_active: true,
          })
          .where('id', '=', id)
          .execute()
        stats.brandUpdated++
      }
    })
  }

  // Marka ↔ tür bağları — mevcut bağların tamamı tek sorguyla
  const baglar = await olc('5. vehicle_brand_type SELECT', () =>
    tx.selectFrom('vehicle_brand_type').select(['brand_id', 'type_id']).execute(),
  )
  const varOlan = new Set(baglar.map((b) => `${b.brand_id}:${b.type_id}`))
  const yeniBaglar: Array<{ brand_id: number; type_id: number }> = []
  for (const [index, brand] of REAL_BRANDS.entries()) {
    const brandId = brandIds.get(hedefler[index]!.slug)
    if (brandId === undefined) continue
    for (const typeSlug of brand.types) {
      const typeId = typeIds.get(typeSlug)
      if (typeId === undefined) continue
      const anahtar = `${brandId}:${typeId}`
      if (varOlan.has(anahtar)) continue
      varOlan.add(anahtar)
      yeniBaglar.push({ brand_id: brandId, type_id: typeId })
    }
  }
  await topluEkle(yeniBaglar, 500, 'vehicle_brand_type', async (dilim) => {
    await tx.insertInto('vehicle_brand_type').values(dilim).execute()
    stats.linkInserted += dilim.length
  })

  adim(`marka: ${brandIds.size} · tür bağı +${stats.linkInserted}`)
  return brandIds
}

/** Model anahtarı: `${brandId}|${slug}` */
type ModelBilgi = { id: number; genId: number | null }

async function syncModels(brandIds: Map<string, number>): Promise<Map<string, ModelBilgi>> {
  const ilgili = [...brandIds.values()]
  const mevcut = ilgili.length
    ? await olc(`6. vehicle_model SELECT (${ilgili.length} marka)`, () =>
        tx
          .selectFrom('vehicle_model')
          .select(['id', 'brand_id', 'name', 'slug', 'code', 'sort_order', 'is_active'])
          .where('brand_id', 'in', ilgili)
          .execute(),
      )
    : []

  const byKey = new Map(mevcut.map((m) => [`${m.brand_id}|${m.slug}`, m]))
  // İkiz denetimi marka içindeki TÜM adlara bakar; bu listeye bu çalıştırmada
  // eklenenler de katılır ki aynı koşuda iki kez eklenen ikizler yakalansın.
  const adlarByBrand = new Map<number, string[]>()
  for (const m of mevcut) {
    const l = adlarByBrand.get(m.brand_id) ?? []
    l.push(m.name)
    adlarByBrand.set(m.brand_id, l)
  }

  type YeniModel = {
    brand_id: number
    name: string
    slug: string
    code: string | null
    sort_order: number
  }
  const eklenecek: YeniModel[] = []
  const guncellenecek: Array<{ id: number; name: string; code: string | null; sira: number }> = []

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
      if (resolved.collided) stats.slugCollisions.push(`${brandSlug}/${slug} ← "${name}"`)

      const code = extractCode(name)
      const v = byKey.get(`${brandId}|${slug}`)
      if (v) {
        if (v.name !== name || v.code !== code || v.sort_order !== order * 10 || !v.is_active) {
          guncellenecek.push({ id: v.id, name, code, sira: order * 10 })
          /*
           * İKİZ LİSTESİ HEDEF ADI TAŞIR.
           *
           * Bu model yeniden adlandırılıyor (ör. vehicles.ts'deki "MEGANE IV",
           * kaynak yazımı "Mégane IV" olarak güncelleniyor). İkiz denetimi
           * veritabanının senkronizasyon SONRASI hâline bakmalı; listede eski
           * adı bırakırsak var olmayan bir satırı ikiz diye bildiririz.
           */
          const l = adlarByBrand.get(brandId)
          if (l) {
            const i = l.indexOf(v.name)
            if (i >= 0) l[i] = name
          }
        }
        continue
      }

      /*
       * İKİZ MODEL KORUMASI — ayrıntı için aşağıdaki nota bakınız.
       * Artık marka adlarının tamamı bellekte; her model için ayrı SELECT yok.
       */
      const adlar = adlarByBrand.get(brandId) ?? []
      const twin = adlar.find((n) => sameVehicle(n, name))
      /*
       * Burada HATA VERİLMEZ, RAPOR EDİLİR. Sebep: ikizin bir ucu bu
       * betiğin oluşturduğu KAYNAK adı, öteki ucu `vehicles.ts`'den gelen
       * eski addır. Hata verilirse kaynak adı hiç oluşmaz ve ona bağlanacak
       * ürünler yersiz kalır — yani ilacı hastalıktan beter olur.
       */
      if (twin) stats.twinModels.push(`${brandSlug}: "${twin}" ↔ "${name}"`)
      else {
        const benzer = adlar.find((n) => similarVehicle(n, name))
        if (benzer) stats.similarModels.push(`${brandSlug}: "${benzer}" ↔ "${name}"`)
      }
      adlar.push(name)
      adlarByBrand.set(brandId, adlar)

      eklenecek.push({ brand_id: brandId, name, slug, code, sort_order: order * 10 })
    }
  }

  if (guncellenecek.length) {
    await olc(`vehicle_model UPDATE (${guncellenecek.length} satır)`, async () => {
      for (const g of guncellenecek) {
        await tx
          .updateTable('vehicle_model')
          .set({ name: g.name, code: g.code, sort_order: g.sira, is_active: true })
          .where('id', '=', g.id)
          .execute()
        stats.modelUpdated++
      }
    })
  }

  const modelMap = new Map<string, ModelBilgi>()
  for (const m of mevcut) modelMap.set(`${m.brand_id}|${m.slug}`, { id: m.id, genId: null })

  await topluEkle(eklenecek, 500, 'vehicle_model', async (dilim) => {
    const yeni = await tx
      .insertInto('vehicle_model')
      .values(
        dilim.map((m) => ({
          brand_id: m.brand_id,
          name: m.name,
          slug: m.slug,
          code: m.code,
          // Yıl aralığı kaynak ekranlarda yok — bilinmiyor olarak bırakılır.
          year_from: null,
          year_to: null,
          body_type: null,
          sort_order: m.sort_order,
        })),
      )
      .returning(['id', 'brand_id', 'slug'])
      .execute()
    for (const r of yeni) modelMap.set(`${r.brand_id}|${r.slug}`, { id: r.id, genId: null })
    stats.modelInserted += yeni.length
  })

  // Motorların bağlanabilmesi için model başına tek nesil — hepsi tek sorguyla
  const modelIds = [...modelMap.values()].map((m) => m.id)
  const nesiller = modelIds.length
    ? await olc(`7. vehicle_generation SELECT (${modelIds.length} model)`, () =>
        tx
          .selectFrom('vehicle_generation')
          .select(['id', 'model_id'])
          .where('model_id', 'in', modelIds)
          .orderBy('id')
          .execute(),
      )
    : []
  const genByModel = new Map<number, number>()
  for (const g of nesiller) if (!genByModel.has(g.model_id)) genByModel.set(g.model_id, g.id)

  const adByModelId = new Map<number, { name: string; code: string | null }>()
  for (const [key, bilgi] of modelMap) {
    if (genByModel.has(bilgi.id)) continue
    const slug = key.split('|')[1] ?? ''
    const kaynak =
      eklenecek.find((e) => `${e.brand_id}|${e.slug}` === key) ??
      mevcut.find((m) => `${m.brand_id}|${m.slug}` === key)
    adByModelId.set(bilgi.id, { name: kaynak?.name ?? slug, code: kaynak?.code ?? null })
  }
  const yeniNesiller = [...adByModelId.entries()].map(([model_id, a]) => ({
    model_id,
    name: a.name,
    code: a.code,
    year_from: null,
    year_to: null,
  }))
  await topluEkle(yeniNesiller, 500, 'vehicle_generation', async (dilim) => {
    const yeni = await tx
      .insertInto('vehicle_generation')
      .values(dilim)
      .returning(['id', 'model_id'])
      .execute()
    for (const r of yeni) genByModel.set(r.model_id, r.id)
    stats.generationInserted += yeni.length
  })

  for (const [key, bilgi] of modelMap) {
    modelMap.set(key, { id: bilgi.id, genId: genByModel.get(bilgi.id) ?? null })
  }

  adim(`model: ${modelMap.size} (+${stats.modelInserted}) · nesil +${stats.generationInserted}`)
  return modelMap
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
async function syncEngines(
  brandIds: Map<string, number>,
  modelMap: Map<string, ModelBilgi>,
): Promise<void> {
  /*
   * ÖN KONTROL — yakıt tipi.
   * Tek bir motorun yakıtı belirlenemiyorsa hiçbir şey yazılmaz. (İşlem
   * içinde olduğumuz için fırlatmak zaten her şeyi geri alır.)
   */
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

  // İlgili nesillerin TÜM motorları tek sorguyla belleğe alınır.
  const genIds = [...modelMap.values()].map((m) => m.genId).filter((g): g is number => g !== null)
  const mevcutMotorlar = genIds.length
    ? await olc(`8. vehicle_engine SELECT (${genIds.length} nesil — en büyük sorgu)`, () =>
        tx
          .selectFrom('vehicle_engine')
          .select([
            'id',
            'generation_id',
            'name',
            'slug',
            'displacement_cc',
            'power_kw',
            'power_hp',
            'fuel_type',
            'sort_order',
            'is_active',
          ])
          .where('generation_id', 'in', genIds)
          .execute(),
      )
    : []

  const bySlug = new Map(mevcutMotorlar.map((e) => [`${e.generation_id}|${e.slug}`, e]))
  /*
   * İKİZ MOTOR DENETİMİ — artık sorgu değil, bellekte arama.
   * Eskiden her motor eklemesinden önce neslin tüm motorları SELECT
   * ediliyordu; tek başına 7.674 fazladan gidiş-dönüş demekti.
   */
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '')
  const adlarByGen = new Map<number, Map<string, string>>()
  for (const e of mevcutMotorlar) {
    const m = adlarByGen.get(e.generation_id) ?? new Map<string, string>()
    m.set(norm(e.name), e.name)
    adlarByGen.set(e.generation_id, m)
  }

  type YeniMotor = {
    generation_id: number
    model_id: number
    name: string
    slug: string
    displacement_cc: number | null
    power_kw: number | null
    power_hp: number | null
    fuel_type: ReturnType<typeof deriveFuel>
    sort_order: number
  }
  const eklenecek: YeniMotor[] = []
  const guncellenecek: Array<{ id: number; m: YeniMotor }> = []

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
      const bilgi = modelMap.get(`${brandId}|${modelSlug}`)
      if (!bilgi) {
        stats.engineModelMissing.push(`${brandSlug}/${modelSlug} (veritabanında yok)`)
        continue
      }
      if (bilgi.genId === null) {
        stats.engineModelMissing.push(`${brandSlug}/${modelSlug} (nesil yok)`)
        continue
      }
      const genId = bilgi.genId

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
        const hedef: YeniMotor = {
          generation_id: genId,
          model_id: bilgi.id,
          name,
          slug,
          displacement_cc: cc,
          power_kw: kw,
          power_hp: hp,
          fuel_type: fuel,
          sort_order: order * 10,
        }

        const v = bySlug.get(`${genId}|${slug}`)
        if (!v) {
          const adlar = adlarByGen.get(genId) ?? new Map<string, string>()
          const twin = adlar.get(norm(name))
          if (twin) {
            /*
             * FIRLATMA YOK — TOPLA.
             *
             * Eskiden ilk ikizde `throw` ediliyordu; o ana kadar yazılanlar
             * commit olmuş, sonrası hiç çalışmamış oluyordu. Artık hepsi
             * toplanıyor, işlemin sonunda tek seferde bildiriliyor ve işlem
             * geri alınıyor — ağaç ya bütün yazılır ya hiç.
             */
            const modelAdi = modelName
            stats.twinEngines.push(`${brandSlug}/"${modelAdi}": "${twin}" ↔ "${name}"`)
            continue
          }
          adlar.set(norm(name), name)
          adlarByGen.set(genId, adlar)
          eklenecek.push(hedef)
          continue
        }

        if (
          v.name !== name ||
          v.displacement_cc !== cc ||
          v.power_kw !== kw ||
          v.power_hp !== hp ||
          v.fuel_type !== fuel ||
          v.sort_order !== order * 10 ||
          !v.is_active
        ) {
          guncellenecek.push({ id: v.id, m: hedef })
        }
      }
    }
  }

  await topluEkle(eklenecek, 1000, 'vehicle_engine', async (dilim) => {
    await tx
      .insertInto('vehicle_engine')
      .values(
        dilim.map((m) => ({
          ...m,
          // Motor kodu kaynakta yok — boş bırakılır, uydurulmaz.
          engine_codes: [],
          year_from: null,
          year_to: null,
        })),
      )
      .execute()
    stats.engineInserted += dilim.length
  })
  if (guncellenecek.length) {
    await olc(`vehicle_engine UPDATE (${guncellenecek.length} satır)`, async () => {
      for (const { id, m } of guncellenecek) {
        await tx
          .updateTable('vehicle_engine')
          .set({
            name: m.name,
            displacement_cc: m.displacement_cc,
            power_kw: m.power_kw,
            power_hp: m.power_hp,
            fuel_type: m.fuel_type,
            sort_order: m.sort_order,
            is_active: true,
          })
          .where('id', '=', id)
          .execute()
        stats.engineUpdated++
      }
    })
  }

  adim(`motor: +${stats.engineInserted} yeni · ${stats.engineUpdated} güncellendi`)
}

/** Gerçek listede yer almayan mevcut kayıtlar — silinmez, yalnızca listelenir. */
async function reportLeftovers(brandIds: Map<string, number>): Promise<void> {
  const realBrandIds = new Set(brandIds.values())
  const allBrands = await tx
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
    const rows = await tx
      .selectFrom('vehicle_model')
      .select(['slug', 'name'])
      .where('brand_id', '=', brandId)
      .execute()
    for (const r of rows) {
      if (!realSlugs.has(r.slug)) extraModels.push(`${brandSlug}/${r.slug}`)
    }
  }

  // Motoru olmayan model sayısı — araç seçicide motor adımı boş kalır
  const [engineless] = await tx
    .selectFrom('vehicle_model as m')
    .leftJoin('vehicle_engine as e', 'e.model_id', 'm.id')
    .select(({ fn }) => fn.count<string>('m.id').distinct().as('n'))
    .where('e.id', 'is', null)
    .execute()

  const realTypeSlugs = REAL_VEHICLE_TYPES.map((t) => t.slug)
  const extraTypes = await tx
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
    await tx
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
    await tx
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
    await tx
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

  const adres = process.env.DATABASE_URL ?? ''
  let sunucu = '(çözümlenemedi)'
  try {
    const u = new URL(adres)
    sunucu = `${u.hostname}:${u.port || 5432}/${u.pathname.replace(/^\//, '')}`
  } catch {
    /* yut */
  }
  console.log(`  sunucu: ${sunucu}`)
  console.log(
    `  sınırlar: sorgu ${SORGU_SINIRI} ms · toplam ${TOPLAM_SINIRI} ms ` +
      `(OCM_SORGU_SINIRI / OCM_TOPLAM_SINIRI ile değiştirilir)\n`,
  )

  // ── 1-2. BAĞLANTI ─────────────────────────────────────────────────────────
  // Havuz TEMBEL kurulur; ilk sorgu bağlantıyı da kurar. Bunu ayrı ölçüyoruz ki
  // "bağlanamıyor" ile "sorgu yavaş" birbirine karışmasın.
  await olc('1-2. veritabanı bağlantısı (SELECT 1)', () => sql`select 1`.execute(db))

  // ── 9. KAYNAK VERİSİ ──────────────────────────────────────────────────────
  // Dosyadan gelir, veritabanına dokunmaz; yine de sayıları görmek işe yarar.
  const motorSayisi = Object.values(REAL_ENGINES).reduce(
    (a, m) => a + Object.values(m).reduce((b, l) => b + l.length, 0),
    0,
  )
  adim(
    `kaynak verisi: ${REAL_BRANDS.length} marka · ` +
      `${Object.values(REAL_MODELS).reduce((a, v) => a + v.length, 0)} model · ` +
      `${motorSayisi} motor`,
  )

  /*
   * HEPSİ YA DA HİÇBİRİ.
   *
   * Tür → marka → model → motor tek işlemde yazılır. Ortada bir hata çıkarsa
   * veritabanı senkronizasyondan ÖNCEKİ hâline döner. Yarım ağaç bırakmak,
   * ürün içe aktarmasında binlerce E_ENGINE_NOT_FOUND üreten asıl sebepti.
   */
  let brandIds!: Map<string, number>
  adim('10. işlem (transaction) açılıyor — BEGIN')
  await db.transaction().execute(async (trx) => {
    tx = trx
    try {
      /*
       * İŞLEM İÇİ ZAMAN SINIRLARI.
       *
       * Asıl koruma packages/db/src/client.ts içindeki havuz ayarlarıdır; bu
       * satır betiği havuzdan bağımsız olarak da güvene alır. `lock_timeout`
       * kritik: yarıda kesilmiş bir çalıştırmadan kalan açık işlem satır
       * kilidini tutuyorsa, buradaki UPDATE sonsuza kadar beklemek yerine
       * saniyeler içinde açık bir hata verir.
       */
      await olc('işlem zaman sınırları (SET LOCAL)', () =>
        sql`set local lock_timeout = '15s'`.execute(trx),
      )

      const typeIds = await syncTypes()
      brandIds = await syncBrands(typeIds)
      const modelMap = await syncModels(brandIds)
      await syncEngines(brandIds, modelMap)

      if (stats.twinEngines.length) {
        throw new Error(
          `İKİZ MOTOR — ${stats.twinEngines.length} çift. Aynı motor, iki farklı ` +
            `yazımla girilmiş. HİÇBİR ŞEY YAZILMADI (işlem geri alındı).\n\n` +
            stats.twinEngines.map((t) => '  ' + t).join('\n') +
            `\n\nDüzeltme: arac-motorlari.ts'den ikinci yazımı kaldırın ve ürün ` +
            `eşlemelerinde ilk yazımı kullanın.`,
        )
      }
      sonAsama = '11. COMMIT'
      adim('11. işlem kapanıyor — COMMIT')
    } finally {
      tx = db
    }
  })
  adim('11. COMMIT tamam — yazılanlar kalıcı')

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

/*
 * SON KORUMA.
 *
 * Yukarıdaki sorgu sınırları her aşamayı ayrı ayrı korur. Bu ise betiğin
 * tamamını korur: ne olursa olsun 10 dakikadan fazla beklemez ve çıkarken
 * TAKILDIĞI AŞAMANIN ADINI yazar. Kimse bir daha ekrana bakarak beklemez.
 */
const kalkan = setTimeout(() => {
  console.error(
    `\n✗ TOPLAM ZAMAN AŞIMI (${TOPLAM_SINIRI} ms).\n` +
      `  Takılan aşama: ${sonAsama}\n` +
      `  İşlem geri alındı; veritabanına hiçbir şey yazılmadı.\n` +
      `  Teşhis için:  npm run db:doctor\n`,
  )
  process.exit(2)
}, TOPLAM_SINIRI)

main()
  .catch((e) => {
    console.error(`\n✗ HATA — takılan/başarısız aşama: ${sonAsama}\n`)
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => {
    clearTimeout(kalkan)
    return closeDb()
  })
