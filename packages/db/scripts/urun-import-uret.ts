/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ÜRÜN İÇE AKTARMA DOSYASI ÜRETİCİSİ
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Ham transkripsiyonu (seed-data/urunler-alfa-romeo.ts) Sprint 4 içe aktarma
 *  şablonuna uygun XLSX'e çevirir. VERİTABANINA HİÇBİR ŞEY YAZMAZ — çıktısı
 *  yalnızca bir dosyadır; yükleme ve onay ayrı adımdır.
 *
 *  Çalıştırma:
 *    npm run db:urun-import-uret
 *    OUT=/yol/dosya.xlsx npm run db:urun-import-uret
 *
 *  ÜRETİLEN (yapay zekâ ile yazılan) ALANLAR
 *  ─────────────────────────────────────────
 *    urun_adi · slug · kisa_aciklama · aciklama · seo_baslik · seo_aciklama
 *
 *  ÜRETİLMEYEN — YALNIZCA KAYNAKTAN GELEN ALANLAR
 *  ──────────────────────────────────────────────
 *    marka · parça kodu (SKU) · kategori · fiyat · UYUMLULUK
 *  Uyumluluk ve OEM asla türetilmez: uydurulmuş bir uyumluluk satırı müşteriye
 *  yeşil "Aracınıza uygun ✓" gösterir ve yanlış parça satışına yol açar.
 *
 *  FİYAT DÖNÜŞÜMÜ
 *  ──────────────
 *  Kaynaktaki fiyatlar vitrin fiyatı, yani KDV DAHİL. Şablon KDV HARİÇ ister
 *  ve KDV'li fiyatı sistem hesaplar. Bu yüzden burada 1,20'ye bölünür —
 *  bölünmezse sitedeki fiyat kaynaktakinden %20 yüksek çıkardı.
 */
import { loadEnv } from './env'
loadEnv()

import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { ARTIFACTS_DIR } from './paths'
import * as XLSX from 'xlsx'
import { slugify } from '../src/index'
import { ONE_CIKAN_SKULAR } from './seed-data/one-cikanlar'
import {
  PRODUCTS,
  FITMENT,
  MISSING_CODE_ITEMS,
  type CategoryCode,
  type SourceProduct,
} from './seed-data/urunler'

const OUT = process.env.OUT ? resolve(process.env.OUT) : resolve(ARTIFACTS_DIR, 'urunler.xlsx')

/**
 * Araç tipi. Şu ana kadarki bütün markalar otomobil & hafif ticari; ağır
 * vasıta ürünleri geldiğinde bu da uyumluluk satırına taşınacak.
 */
const VEHICLE_TYPE = 'OTOMOBIL'
const KDV = 20
/**
 * Stok adedi. Kullanıcı ekranları "Stoktakiler" filtresi işaretli aldığı için
 * buradaki her ürün stokta kabul edilir; kesin adet bilinmediğinden sabit bir
 * başlangıç değeri yazılır ve panelden güncellenebilir.
 */
const DEFAULT_STOCK = 10

const CATEGORY_LABEL: Record<CategoryCode, string> = {
  YAG_FILTRESI: 'Yağ Filtresi',
  HAVA_FILTRESI: 'Hava Filtresi',
  POLEN_FILTRESI: 'Polen / Kabin Filtresi',
  YAKIT_FILTRESI: 'Yakıt Filtresi',
  SANZUMAN_FILTRESI: 'Şanzuman Filtresi',
  DIREKSIYON_FILTRESI: 'Direksiyon Filtresi',
  KARTER_HAVALANDIRMA: 'Karter Havalandırma Filtresi',
  KURUTUCU_FILTRE: 'Kurutucu Filtre',
  IC_HAVA_FILTRESI: 'İç Hava Filtresi',
  AD_BLUE_FILTRESI: 'AdBlue Filtresi',
}

const SHORT: Record<CategoryCode, string> = {
  YAG_FILTRESI:
    'Motor yağındaki metal parçacıkları, kurum ve yanma artıklarını tutar; yağın yağlama görevini sürdürmesini sağlar.',
  HAVA_FILTRESI:
    'Motora giren havadaki toz ve partikülleri tutar; yanma verimini korur ve silindir aşınmasını geciktirir.',
  POLEN_FILTRESI:
    'Kabine giren havadaki polen, toz ve is parçacıklarını tutar; cam buğulanmasını azaltır, iç hava kalitesini artırır.',
  YAKIT_FILTRESI: 'Yakıt içindeki su ve kirleri tutar; enjektörleri ve yakıt pompasını korur.',
  SANZUMAN_FILTRESI:
    'Otomatik şanzuman yağındaki balata tozunu ve metal parçacıkları tutar; vites geçişlerinin düzgün kalmasını sağlar.',
  DIREKSIYON_FILTRESI:
    'Hidrolik direksiyon devresindeki metal parçacıkları ve kiri tutar; direksiyon pompasının ve kutusunun ömrünü uzatır.',
  KARTER_HAVALANDIRMA:
    'Karter gazındaki yağ buharını ayırır; temiz gazı emme sistemine geri verir ve yağ tüketimini kontrol altında tutar.',
  KURUTUCU_FILTRE:
    'Hava fren sistemine giren havadaki nemi ve yağı tutar; hava tanklarında su birikmesini ve valf donmasını önler.',
  IC_HAVA_FILTRESI:
    'Ana hava filtresinin içine yerleşen güvenlik filtresidir; ana filtre yırtıldığında motora toz gitmesini önler.',
  AD_BLUE_FILTRESI:
    'AdBlue çözeltisindeki kristal ve tortuyu tutar; SCR dozaj pompasını ve enjektörü korur.',
}

const LONG: Record<CategoryCode, string[]> = {
  YAG_FILTRESI: [
    'Yağ, motor içinde dolaşırken metal talaşı, kurum ve yanma artıklarını toplar. Yağ filtresi bu parçacıkları tutar; tutmazsa aynı parçacıklar yatak ve silindir yüzeylerini aşındırır.',
    'Tıkanmış ya da ömrünü doldurmuş bir yağ filtresi yağ basıncını düşürür ve motorun yağsız kalma riskini artırır. Bu nedenle yağ filtresi her motor yağı değişiminde birlikte değiştirilir.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın.',
  ],
  HAVA_FILTRESI: [
    'Motor, yaktığı her litre yakıt için binlerce litre hava emer. Hava filtresi bu havadaki tozu ve partikülleri tutarak silindirlere temiz hava girmesini sağlar.',
    'Kirlenmiş bir hava filtresi hava akışını kısar; yakıt tüketimi artar, tepki gecikir ve tutulamayan partiküller silindir cidarlarını aşındırır.',
    'Tozlu yollarda kullanılan araçlarda değişim aralığı kısalır. Üreticinin bakım aralığını esas alın.',
  ],
  POLEN_FILTRESI: [
    'Kabin filtresi, klima ve havalandırma sisteminden içeri giren havayı süzer. Polen, yol tozu, is ve egzoz partikülleri kabine girmeden tutulur.',
    'Kirlenmiş bir kabin filtresi hava akışını azaltır; camlar geç açılır, kliması zayıflar ve araç içinde rutubet kokusu oluşabilir.',
    'Genellikle yılda bir veya üreticinin belirlediği kilometrede değiştirilir; alerjisi olan sürücüler için daha sık değişim önerilir.',
  ],
  YAKIT_FILTRESI: [
    'Yakıt filtresi, depodan gelen yakıttaki su, pas ve kir parçacıklarını tutar. Özellikle dizel sistemlerde yüksek basınçlı enjektörler bu kirlere karşı hassastır.',
    'Tıkanmış bir yakıt filtresi güç kaybı, zor çalışma ve rölantide titreme yapar; ileri aşamada enjektör ve yakıt pompası arızasına yol açar.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın.',
  ],
  SANZUMAN_FILTRESI: [
    'Otomatik şanzumanda yağ, hem yağlama hem de kavrama basıncını taşıyan hidrolik akışkandır. Şanzuman filtresi bu yağdaki balata tozunu ve metal parçacıkları tutar.',
    'Tıkanmış bir şanzuman filtresi yağ debisini düşürür; vites geçişleri sertleşir, gecikir ya da kavrama kayar. İleri aşamada valf gövdesi ve kavrama paketleri zarar görür.',
    'Şanzuman filtresi genellikle yağ ve karter contasıyla birlikte set hâlinde değiştirilir. Değişim aralığı ve yağ tipi için üreticinin talimatını esas alın.',
  ],
  DIREKSIYON_FILTRESI: [
    'Hidrolik direksiyon sistemi, kapalı bir devrede yüksek basınçlı yağ ile çalışır. Direksiyon filtresi bu devredeki metal parçacıkları ve kir birikimini tutar.',
    'Tıkanmış ya da ömrünü doldurmuş bir direksiyon filtresi akışı kısar; direksiyon ağırlaşır, pompadan uğultu gelir ve ileri aşamada pompa ile direksiyon kutusu zarar görür.',
    'Ağırlıklı olarak hafif ticari araçlarda ayrı bir filtre olarak bulunur. Değişim aralığı için aracınızın bakım kitapçığını esas alın.',
  ],
  KARTER_HAVALANDIRMA: [
    'Yanma sırasında segmanlardan kartere sızan gazlar burada birikir. Karter havalandırma (PCV) filtresi bu gazdaki yağ buharını ayırır ve temizlenen gazı emme sistemine geri verir.',
    'Tıkanan bir karter havalandırma filtresi karter basıncını yükseltir; yağ tüketimi artar, keçelerden yağ sızar ve emme sistemine yağ taşınabilir.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın.',
  ],
  KURUTUCU_FILTRE: [
    'Hava frenli araçlarda kompresörün bastığı hava nem ve yağ buharı taşır. Kurutucu filtre bu nemi ve yağı tutar; tanklarda su birikmesini, kışın valf donmasını ve fren performansı kaybını önler.',
    'Doymuş bir kurutucu filtre nemi geçirmeye başlar; hava tanklarından su gelir, valfler paslanır ve fren tepkisi gecikir.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın; ağır şartlarda aralık kısalır.',
  ],
  IC_HAVA_FILTRESI: [
    'İç hava filtresi (güvenlik filtresi) ana hava filtresinin içine oturur. Ana filtre yırtılır ya da bakımda çıkarılırsa motora toz girmesini bu filtre engeller.',
    'Görevi gereği normalde az kirlenir; kirlenmişse ana filtrede kaçak var demektir ve ikisi birlikte değerlendirilmelidir.',
    'Genellikle iki ana filtre değişiminde bir yenilenir. Üreticinin bakım aralığını esas alın.',
  ],
  AD_BLUE_FILTRESI: [
    'SCR sistemi egzoz gazındaki azot oksitleri AdBlue (üre çözeltisi) püskürterek azaltır. AdBlue filtresi bu çözeltideki kristalleşmiş üreyi ve tortuyu tutar.',
    'Tıkanan bir AdBlue filtresi dozaj pompasını zorlar; SCR arıza lambası yanar, araç tork kısıtlamasına ve ileri aşamada çalışmama moduna geçebilir.',
    'Değişim aralığı için aracınızın bakım kitapçığındaki üretici talimatını esas alın.',
  ],
}

/**
 * KDV dahil vitrin fiyatından KDV hariç net fiyatı üretir.
 *
 * Net fiyat veritabanında 2 ondalıkla saklandığı için bazı vitrin fiyatları
 * KDV eklendiğinde BİREBİR geri gelmez: 1.055,07 / 1,20 = 879,225 — iki
 * ondalığa yuvarlanan hiçbir net değer 1.055,07'yi tam üretmez (879,22 →
 * 1.055,06 · 879,23 → 1.055,08). Bu, yuvarlama hatası değil, iki ondalıklı
 * para biriminin matematiksel sınırı.
 *
 * Bu yüzden iki aday denenir:
 *   1. Standart yuvarlama — geri dönüşü kaynakla BİREBİR tutuyorsa o kullanılır.
 *   2. Tutmuyorsa bir kuruş AŞAĞISI seçilir; böylece sitedeki fiyat kaynaktakini
 *      asla AŞMAZ. Müşteriye ilan edilenden fazlasını yansıtmamak, bir kuruş
 *      eksik yansıtmaktan önemlidir.
 */
function netFromGross(gross: number): number {
  const k = 1 + KDV / 100
  const round2 = (n: number): number => Math.round(n * 100) / 100
  const candidate = round2(gross / k)
  if (round2(candidate * k) === gross) return candidate
  const lower = round2(candidate - 0.01)
  return round2(lower * k) <= gross ? lower : candidate
}

/** 'W714/4' → 'W7144' — SKU'da ayraç bırakmamak için. */
function skuOf(p: SourceProduct): string {
  const brandKey = p.brand === 'MANN-FILTER' ? 'MANN' : 'FILTRON'
  return `${brandKey}-${p.code.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}`
}

/**
 * Ürün adı YALNIZCA ürün tipidir ("Yağ Filtresi").
 *
 * Marka ve parça kodu ayrı alanlarda duruyor ve arayüz başlığı zaten
 * `marka + kod + ad` biçiminde kuruyor. Ada markayı da yazmak
 * "MANN-FILTER W714/4 MANN-FILTER W714/4 Yağ Filtresi" gibi iki kez tekrar
 * eden bir başlık üretiyordu. Şablonun kendi örneği de bunu söylüyor:
 * urun_adi örneği 'Hava Filtresi'.
 */
function productName(p: SourceProduct): string {
  return CATEGORY_LABEL[p.category]
}

/** Slug marka ve kodu İÇERİR — yoksa bütün yağ filtreleri aynı slug'a düşer. */
function productSlug(p: SourceProduct): string {
  return slugify(`${p.brand} ${p.code} ${CATEGORY_LABEL[p.category]}`).slice(0, 140)
}

function description(p: SourceProduct): string {
  const label = CATEGORY_LABEL[p.category].toLocaleLowerCase('tr')
  const intro = `${p.brand} ${p.code}, ${p.brand} üretimi bir ${label}dir.`
  return [
    intro,
    ...LONG[p.category],
    'Aracınıza uygunluğunu sayfanın üstündeki araç seçiciden doğrulayın.',
  ].join('\n\n')
}

function main(): void {
  // ── Kaynak tutarlılığı: uyumlulukta geçen her ürün katalogda var mı? ──────
  const unknown = new Set<string>()
  for (const f of FITMENT) for (const key of f.products) if (!PRODUCTS[key]) unknown.add(key)
  if (unknown.size) {
    throw new Error(
      `UYUMLULUK'ta geçen ama PRODUCTS'ta tanımsız ürün var:\n  ${[...unknown].join('\n  ')}`,
    )
  }

  // ── URUNLER ───────────────────────────────────────────────────────────────
  /*
   * Öne çıkanlar: liste `seed-data/one-cikanlar.ts` içinde, seçim gerekçesiyle
   * birlikte duruyor. Burada yalnızca uygulanıyor.
   *
   * Listede olup katalogda olmayan bir SKU sessizce yok sayılmaz: vitrinin
   * eksik çıkması, kurulumun durmasından daha kötüdür — çünkü fark edilmez.
   */
  const oneCikan = new Set(ONE_CIKAN_SKULAR)
  const tumSkular = new Set(Object.values(PRODUCTS).map((p) => skuOf(p)))
  const bulunmayan = [...oneCikan].filter((s) => !tumSkular.has(s))
  if (bulunmayan.length) {
    throw new Error(
      `ÖNE ÇIKANLAR listesinde katalogda olmayan SKU var:\n  ${bulunmayan.join('\n  ')}`,
    )
  }

  const productRows = Object.values(PRODUCTS).map((p) => {
    const name = productName(p)
    return {
      sku: skuOf(p),
      urun_adi: name,
      marka: p.brand,
      kategori_kodu: p.category,
      urun_kodu: p.code,
      slug: productSlug(p),
      kisa_aciklama: SHORT[p.category],
      aciklama: description(p),
      durum: 'AKTIF',
      one_cikan: oneCikan.has(skuOf(p)) ? 'EVET' : 'HAYIR',
      // Site adı EKLENMEZ: layout'taki başlık şablonu (`%s | Oto Center Market`)
      // onu zaten ekliyor. Burada da eklenince sekmede iki kez yazıyordu.
      seo_baslik: `${p.brand} ${p.code} ${CATEGORY_LABEL[p.category]}`.slice(0, 160),
      seo_aciklama:
        `${p.brand} ${p.code} ${CATEGORY_LABEL[p.category].toLocaleLowerCase('tr')}. ${SHORT[p.category]}`.slice(
          0,
          320,
        ),
    }
  })

  // ── FIYAT_STOK ────────────────────────────────────────────────────────────
  const priceRows = Object.values(PRODUCTS).map((p) => ({
    sku: skuOf(p),
    varyant_adi: '',
    ambalaj_miktari: 1,
    birim: 'ADET',
    fiyat_net: netFromGross(p.priceGross),
    kdv_orani: KDV,
    stok: DEFAULT_STOCK,
    depo_kodu: 'MERKEZ',
  }))

  // ── UYUMLULUK ─────────────────────────────────────────────────────────────
  const compatRows = FITMENT.flatMap((f) =>
    f.products.map((key) => {
      const p = PRODUCTS[key]
      if (!p) throw new Error(`Tanımsız ürün: ${key}`)
      return {
        sku: skuOf(p),
        uyumluluk_tipi: 'UYUMLU',
        arac_tipi: VEHICLE_TYPE,
        arac_markasi: f.vehicleBrand,
        model: f.model,
        // Motor kodu kaynakta yok; eşleştirme motor ADIYLA yapılacak.
        motor_kodu: '',
        motor_adi: f.engine,
        not: 'Kaynak: tedarikçi katalog listesi (ekran görüntüsü transkripsiyonu)',
      }
    }),
  )

  const wb = XLSX.utils.book_new()
  const add = (rows: object[], name: string, widths: number[]): void => {
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = widths.map((wch) => ({ wch }))
    XLSX.utils.book_append_sheet(wb, ws, name)
  }
  add(productRows, 'URUNLER', [18, 46, 14, 18, 14, 46, 60, 80, 8, 8, 50, 60])
  add(priceRows, 'FIYAT_STOK', [18, 12, 14, 8, 12, 10, 12, 10])
  add(compatRows, 'UYUMLULUK', [18, 14, 12, 14, 16, 12, 30, 56])

  mkdirSync(dirname(OUT), { recursive: true })
  XLSX.writeFile(wb, OUT)

  const byCat = new Map<string, number>()
  for (const p of Object.values(PRODUCTS)) {
    byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1)
  }

  console.log(`\n✓ ${OUT}`)
  console.log(`  URUNLER    : ${productRows.length} ürün`)
  for (const [c, n] of byCat)
    console.log(`               ${CATEGORY_LABEL[c as CategoryCode]}: ${n}`)
  console.log(
    `  FIYAT_STOK : ${priceRows.length} satır (KDV %${KDV} hariç fiyat, stok ${DEFAULT_STOCK})`,
  )
  console.log(`  UYUMLULUK  : ${compatRows.length} satır · ${FITMENT.length} motor`)
  console.log(`\n  Kodsuz olduğu için ATLANAN ürün: ${MISSING_CODE_ITEMS.length}`)
  for (const m of MISSING_CODE_ITEMS) {
    console.log(`    - ${m.brand} "${m.label}" ${m.priceGross} TL (${m.models.join(', ')})`)
  }
  console.log('')
}

main()
