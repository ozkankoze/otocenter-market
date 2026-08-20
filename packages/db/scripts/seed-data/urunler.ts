/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ÜRÜN KATALOĞU — BÜTÜN MARKALARIN BİRLEŞİMİ
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Ürünler marka marka ayrı dosyalarda transkribe edilir (okunabilirlik ve
 *  ekran görüntüsüyle karşılaştırma kolaylığı için); içe aktarma dosyasını
 *  üreten betik ise TEK bir katalog görür.
 *
 *  NEDEN BİRLEŞİK KATALOG
 *  Aynı parça kodu birden çok ARAÇ markasında geçebilir: MANN CU2450 hem
 *  Audi'de hem başka bir VW grubu aracında çıkar. Ürün, parça koduyla
 *  tekildir; hangi araca uyduğu uyumluluk katmanının işidir. Kataloglar
 *  ayrı kalsaydı aynı filtre her araç markası için yeniden oluşur, stok ve
 *  fiyat onlarca kopyada yönetilirdi.
 *
 *  ÇAKIŞMA KONTROLÜ
 *  İki dosya aynı anahtarı MARKA ya da KATEGORİ olarak farklı tanımlarsa betik
 *  DURUR — bu kimlik karışıklığıdır, sessizce birini seçmek yanlış parça
 *  satmak demektir.
 *
 *  FİYAT farkı ise beklenen bir durumdur: aynı parça birden çok araç
 *  markasının sayfasında geçer ve kaynak sayfadan sayfaya farklı fiyat
 *  yazabilir. Usta kararı gereği EN YÜKSEK fiyat alınır ve hangi dosyadan
 *  geldiği raporlanır.
 */
import { AUDI_MISSING_CODE as AUDI_MISSING } from './urunler-audi'
import {
  PRODUCTS as ALFA_PRODUCTS,
  FITMENT as ALFA_FITMENT,
  MISSING_CODE_ITEMS as ALFA_MISSING,
  type SourceProduct,
} from './urunler-alfa-romeo'
import { AUDI_PRODUCTS, AUDI_FITMENT } from './urunler-audi'
import { BMW_PRODUCTS, BMW_FITMENT, BMW_MISSING_CODE as BMW_MISSING } from './urunler-bmw'
import {
  CHEVROLET_PRODUCTS,
  CHEVROLET_FITMENT,
  CHEVROLET_MISSING_CODE as CHEVROLET_MISSING,
} from './urunler-chevrolet'
import {
  CITROEN_PRODUCTS,
  CITROEN_FITMENT,
  CITROEN_MISSING_CODE as CITROEN_MISSING,
} from './urunler-citroen'
import { CUPRA_PRODUCTS, CUPRA_FITMENT, CUPRA_MISSING_CODE as CUPRA_MISSING } from './urunler-cupra'
import { DACIA_PRODUCTS, DACIA_FITMENT, DACIA_MISSING_CODE as DACIA_MISSING } from './urunler-dacia'
import { DS_PRODUCTS, DS_FITMENT, DS_MISSING_CODE as DS_MISSING } from './urunler-ds-automobiles'
import { FIAT_PRODUCTS, FIAT_FITMENT, FIAT_MISSING_CODE as FIAT_MISSING } from './urunler-fiat'
import { FORD_PRODUCTS, FORD_FITMENT, FORD_MISSING_CODE as FORD_MISSING } from './urunler-ford'
import { GEELY_PRODUCTS, GEELY_FITMENT, GEELY_MISSING_CODE as GEELY_MISSING } from './urunler-geely'
import {
  GENESIS_PRODUCTS,
  GENESIS_FITMENT,
  GENESIS_MISSING_CODE as GENESIS_MISSING,
} from './urunler-genesis'
import { HAVAL_PRODUCTS, HAVAL_FITMENT, HAVAL_MISSING_CODE as HAVAL_MISSING } from './urunler-haval'
import { HONDA_PRODUCTS, HONDA_FITMENT, HONDA_MISSING_CODE as HONDA_MISSING } from './urunler-honda'
import {
  HYUNDAI_PRODUCTS,
  HYUNDAI_FITMENT,
  HYUNDAI_MISSING_CODE as HYUNDAI_MISSING,
} from './urunler-hyundai'
import { ISUZU_PRODUCTS, ISUZU_FITMENT, ISUZU_MISSING_CODE as ISUZU_MISSING } from './urunler-isuzu'
import { IVECO_PRODUCTS, IVECO_FITMENT, IVECO_MISSING_CODE as IVECO_MISSING } from './urunler-iveco'
import {
  JAGUAR_PRODUCTS,
  JAGUAR_FITMENT,
  JAGUAR_MISSING_CODE as JAGUAR_MISSING,
} from './urunler-jaguar'
import { JEEP_PRODUCTS, JEEP_FITMENT, JEEP_MISSING_CODE as JEEP_MISSING } from './urunler-jeep'
import { KIA_PRODUCTS, KIA_FITMENT, KIA_MISSING_CODE as KIA_MISSING } from './urunler-kia'
import {
  LANDROVER_PRODUCTS,
  LANDROVER_FITMENT,
  LANDROVER_MISSING_CODE as LANDROVER_MISSING,
} from './urunler-land-rover'
import { MAZDA_PRODUCTS, MAZDA_FITMENT, MAZDA_MISSING_CODE as MAZDA_MISSING } from './urunler-mazda'
import { BMC_PRODUCTS, BMC_FITMENT, BMC_MISSING_CODE as BMC_MISSING } from './urunler-bmc'
import { DAF_PRODUCTS, DAF_FITMENT, DAF_MISSING_CODE as DAF_MISSING } from './urunler-daf'
import {
  FORDTRUCKS_PRODUCTS,
  FORDTRUCKS_FITMENT,
  FORDTRUCKS_MISSING_CODE as FORDTRUCKS_MISSING,
} from './urunler-ford-trucks'
import {
  IVECOTRUCKS_PRODUCTS,
  IVECOTRUCKS_FITMENT,
  IVECOTRUCKS_MISSING_CODE as IVECOTRUCKS_MISSING,
} from './urunler-iveco-trucks'
import { MAN_PRODUCTS, MAN_FITMENT, MAN_MISSING_CODE as MAN_MISSING } from './urunler-man'
import {
  MERCEDESTR_PRODUCTS,
  MERCEDESTR_FITMENT,
  MERCEDESTR_MISSING_CODE as MERCEDESTR_MISSING,
} from './urunler-mercedes-benz-kamyon-otobus'
import {
  NEOPLAN_PRODUCTS,
  NEOPLAN_FITMENT,
  NEOPLAN_MISSING_CODE as NEOPLAN_MISSING,
} from './urunler-neoplan'
import {
  OTOKAR_PRODUCTS,
  OTOKAR_FITMENT,
  OTOKAR_MISSING_CODE as OTOKAR_MISSING,
} from './urunler-otokar'
import {
  RENAULTTR_PRODUCTS,
  RENAULTTR_FITMENT,
  RENAULTTR_MISSING_CODE as RENAULTTR_MISSING,
} from './urunler-renault-trucks'
import {
  SCANIA_PRODUCTS,
  SCANIA_FITMENT,
  SCANIA_MISSING_CODE as SCANIA_MISSING,
} from './urunler-scania'
import { SETRA_PRODUCTS, SETRA_FITMENT, SETRA_MISSING_CODE as SETRA_MISSING } from './urunler-setra'
import { TEMSA_PRODUCTS, TEMSA_FITMENT, TEMSA_MISSING_CODE as TEMSA_MISSING } from './urunler-temsa'
import {
  VOLVOTR_PRODUCTS,
  VOLVOTR_FITMENT,
  VOLVOTR_MISSING_CODE as VOLVOTR_MISSING,
} from './urunler-volvo-trucks'
import {
  MERCEDES_PRODUCTS,
  MERCEDES_FITMENT,
  MERCEDES_MISSING_CODE as MERCEDES_MISSING,
} from './urunler-mercedes-benz'
import { MINI_PRODUCTS, MINI_FITMENT, MINI_MISSING_CODE as MINI_MISSING } from './urunler-mini'
import {
  MITSUBISHI_PRODUCTS,
  MITSUBISHI_FITMENT,
  MITSUBISHI_MISSING_CODE as MITSUBISHI_MISSING,
} from './urunler-mitsubishi'
import {
  NISSAN_PRODUCTS,
  NISSAN_FITMENT,
  NISSAN_MISSING_CODE as NISSAN_MISSING,
} from './urunler-nissan'
import { OPEL_PRODUCTS, OPEL_FITMENT, OPEL_MISSING_CODE as OPEL_MISSING } from './urunler-opel'
import {
  PEUGEOT_PRODUCTS,
  PEUGEOT_FITMENT,
  PEUGEOT_MISSING_CODE as PEUGEOT_MISSING,
} from './urunler-peugeot'
import {
  PORSCHE_PRODUCTS,
  PORSCHE_FITMENT,
  PORSCHE_MISSING_CODE as PORSCHE_MISSING,
} from './urunler-porsche'
import {
  RENAULT_PRODUCTS,
  RENAULT_FITMENT,
  RENAULT_MISSING_CODE as RENAULT_MISSING,
} from './urunler-renault'
import { SEAT_PRODUCTS, SEAT_FITMENT, SEAT_MISSING_CODE as SEAT_MISSING } from './urunler-seat'
import { SKODA_PRODUCTS, SKODA_FITMENT, SKODA_MISSING_CODE as SKODA_MISSING } from './urunler-skoda'
import { SMART_PRODUCTS, SMART_FITMENT, SMART_MISSING_CODE as SMART_MISSING } from './urunler-smart'
import {
  SSANGYONG_PRODUCTS,
  SSANGYONG_FITMENT,
  SSANGYONG_MISSING_CODE as SSANGYONG_MISSING,
} from './urunler-ssangyong'
import {
  SUBARU_PRODUCTS,
  SUBARU_FITMENT,
  SUBARU_MISSING_CODE as SUBARU_MISSING,
} from './urunler-subaru'
import {
  SUZUKI_PRODUCTS,
  SUZUKI_FITMENT,
  SUZUKI_MISSING_CODE as SUZUKI_MISSING,
} from './urunler-suzuki'
import { TESLA_PRODUCTS, TESLA_FITMENT, TESLA_MISSING_CODE as TESLA_MISSING } from './urunler-tesla'
import {
  TOYOTA_PRODUCTS,
  TOYOTA_FITMENT,
  TOYOTA_MISSING_CODE as TOYOTA_MISSING,
} from './urunler-toyota'
import {
  VOLGA_PRODUCTS,
  VOLGA_FITMENT,
  VOLGA_MISSING_CODE as VOLGA_MISSING,
} from './urunler-volga-gaz'
import {
  VOLKSWAGEN_PRODUCTS,
  VOLKSWAGEN_FITMENT,
  VOLKSWAGEN_MISSING_CODE as VOLKSWAGEN_MISSING,
} from './urunler-volkswagen'
import { VOLVO_PRODUCTS, VOLVO_FITMENT, VOLVO_MISSING_CODE as VOLVO_MISSING } from './urunler-volvo'

export type { SourceProduct, CategoryCode, ProductBrand } from './urunler-alfa-romeo'

/** Uyumluluk satırı — hangi ARAÇ markasına ait olduğu artık satırda. */
export type Fitment = {
  /** Araç markası — `vehicle_brand.name` ile eşleşmeli */
  vehicleBrand: string
  model: string
  engine: string
  products: string[]
}

function tag(
  vehicleBrand: string,
  rows: Array<{ model: string; engine: string; products: string[] }>,
): Fitment[] {
  return rows.map((r) => ({ vehicleBrand, ...r }))
}

function merge(
  sources: Array<[string, Record<string, SourceProduct>]>,
): Record<string, SourceProduct> {
  const out: Record<string, SourceProduct> = {}
  const origin: Record<string, string> = {}
  const clashes: string[] = []
  const priceBumps: string[] = []

  for (const [fileName, products] of sources) {
    for (const [key, value] of Object.entries(products)) {
      const existing = out[key]
      if (!existing) {
        out[key] = value
        origin[key] = fileName
        continue
      }
      /*
       * FİYAT FARKI KURALA BAĞLI, GERİSİ HATA.
       *
       * Aynı parça birden çok araç markasının sayfasında geçebiliyor ve
       * kaynak aynı ürüne sayfadan sayfaya farklı fiyat yazabiliyor (ör.
       * MANN PU7005: Alfa Romeo 1.717,12 · Citroen 1.686,37). Usta kararı:
       * çakışan fiyatlarda EN YÜKSEĞİ alınır — böylece site hiçbir sayfada
       * ilan edilenin altında fiyat göstermez.
       *
       * Fiyat DIŞINDA bir alan (marka, kategori) farklıysa bu artık fiyat
       * dalgalanması değil, kimlik karışıklığıdır: sessizce birini seçmek
       * yanlış parça satmak demek olur, o yüzden DURULUR.
       */
      const { priceGross: mevcutFiyat, ...mevcutGerisi } = existing
      const { priceGross: yeniFiyat, ...yeniGerisi } = value
      if (JSON.stringify(mevcutGerisi) !== JSON.stringify(yeniGerisi)) {
        clashes.push(
          `${key}: ${origin[key]} → ${JSON.stringify(existing)} · ${fileName} → ${JSON.stringify(value)}`,
        )
        continue
      }
      if (yeniFiyat > mevcutFiyat) {
        out[key] = value
        priceBumps.push(`${key}: ${mevcutFiyat} (${origin[key]}) → ${yeniFiyat} (${fileName})`)
        origin[key] = fileName
      }
    }
  }

  if (clashes.length) {
    throw new Error(
      `Aynı ürün iki katalogda FARKLI tanımlanmış; hangisinin doğru olduğu ` +
        `belirsiz olduğu için durduruldu:\n  ${clashes.join('\n  ')}`,
    )
  }
  if (priceBumps.length) {
    console.log(
      `\nFiyat çakışması — en yüksek alındı (${priceBumps.length}):\n  ` +
        priceBumps.join('\n  ') +
        '\n',
    )
  }
  return out
}

export const PRODUCTS: Record<string, SourceProduct> = merge([
  ['urunler-alfa-romeo.ts', ALFA_PRODUCTS],
  ['urunler-audi.ts', AUDI_PRODUCTS],
  ['urunler-bmw.ts', BMW_PRODUCTS],
  ['urunler-chevrolet.ts', CHEVROLET_PRODUCTS],
  ['urunler-citroen.ts', CITROEN_PRODUCTS],
  ['urunler-cupra.ts', CUPRA_PRODUCTS],
  ['urunler-dacia.ts', DACIA_PRODUCTS],
  ['urunler-ds-automobiles.ts', DS_PRODUCTS],
  ['urunler-fiat.ts', FIAT_PRODUCTS],
  ['urunler-ford.ts', FORD_PRODUCTS],
  ['urunler-geely.ts', GEELY_PRODUCTS],
  ['urunler-genesis.ts', GENESIS_PRODUCTS],
  ['urunler-haval.ts', HAVAL_PRODUCTS],
  ['urunler-honda.ts', HONDA_PRODUCTS],
  ['urunler-hyundai.ts', HYUNDAI_PRODUCTS],
  ['urunler-isuzu.ts', ISUZU_PRODUCTS],
  ['urunler-iveco.ts', IVECO_PRODUCTS],
  ['urunler-jaguar.ts', JAGUAR_PRODUCTS],
  ['urunler-jeep.ts', JEEP_PRODUCTS],
  ['urunler-kia.ts', KIA_PRODUCTS],
  ['urunler-land-rover.ts', LANDROVER_PRODUCTS],
  ['urunler-mazda.ts', MAZDA_PRODUCTS],
  ['urunler-mercedes-benz.ts', MERCEDES_PRODUCTS],
  ['urunler-mini.ts', MINI_PRODUCTS],
  ['urunler-mitsubishi.ts', MITSUBISHI_PRODUCTS],
  ['urunler-nissan.ts', NISSAN_PRODUCTS],
  ['urunler-opel.ts', OPEL_PRODUCTS],
  ['urunler-peugeot.ts', PEUGEOT_PRODUCTS],
  ['urunler-porsche.ts', PORSCHE_PRODUCTS],
  ['urunler-renault.ts', RENAULT_PRODUCTS],
  ['urunler-seat.ts', SEAT_PRODUCTS],
  ['urunler-skoda.ts', SKODA_PRODUCTS],
  ['urunler-smart.ts', SMART_PRODUCTS],
  ['urunler-ssangyong.ts', SSANGYONG_PRODUCTS],
  ['urunler-subaru.ts', SUBARU_PRODUCTS],
  ['urunler-suzuki.ts', SUZUKI_PRODUCTS],
  ['urunler-tesla.ts', TESLA_PRODUCTS],
  ['urunler-toyota.ts', TOYOTA_PRODUCTS],
  ['urunler-volga-gaz.ts', VOLGA_PRODUCTS],
  ['urunler-volkswagen.ts', VOLKSWAGEN_PRODUCTS],
  ['urunler-volvo.ts', VOLVO_PRODUCTS],

  // ── Ağır vasıta ──
  ['urunler-bmc.ts', BMC_PRODUCTS],
  ['urunler-daf.ts', DAF_PRODUCTS],
  ['urunler-ford-trucks.ts', FORDTRUCKS_PRODUCTS],
  ['urunler-iveco-trucks.ts', IVECOTRUCKS_PRODUCTS],
  ['urunler-man.ts', MAN_PRODUCTS],
  ['urunler-mercedes-benz-kamyon-otobus.ts', MERCEDESTR_PRODUCTS],
  ['urunler-neoplan.ts', NEOPLAN_PRODUCTS],
  ['urunler-otokar.ts', OTOKAR_PRODUCTS],
  ['urunler-renault-trucks.ts', RENAULTTR_PRODUCTS],
  ['urunler-scania.ts', SCANIA_PRODUCTS],
  ['urunler-setra.ts', SETRA_PRODUCTS],
  ['urunler-temsa.ts', TEMSA_PRODUCTS],
  ['urunler-volvo-trucks.ts', VOLVOTR_PRODUCTS],
])

export const FITMENT: Fitment[] = [
  ...tag('Alfa Romeo', ALFA_FITMENT),
  ...tag('Audi', AUDI_FITMENT),
  ...tag('BMW', BMW_FITMENT),
  ...tag('Chevrolet', CHEVROLET_FITMENT),
  ...tag('Citroen', CITROEN_FITMENT),
  ...tag('Cupra', CUPRA_FITMENT),
  ...tag('Dacia', DACIA_FITMENT),
  ...tag('DS Automobiles', DS_FITMENT),
  ...tag('Fiat', FIAT_FITMENT),
  ...tag('Ford', FORD_FITMENT),
  ...tag('Geely', GEELY_FITMENT),
  ...tag('Genesis', GENESIS_FITMENT),
  ...tag('Haval', HAVAL_FITMENT),
  ...tag('Honda', HONDA_FITMENT),
  ...tag('Hyundai', HYUNDAI_FITMENT),
  ...tag('Isuzu', ISUZU_FITMENT),
  ...tag('Iveco', IVECO_FITMENT),
  ...tag('Jaguar', JAGUAR_FITMENT),
  ...tag('Jeep', JEEP_FITMENT),
  ...tag('Kia', KIA_FITMENT),
  ...tag('Land Rover', LANDROVER_FITMENT),
  ...tag('Mazda', MAZDA_FITMENT),
  ...tag('Mercedes-Benz', MERCEDES_FITMENT),
  ...tag('Mini', MINI_FITMENT),
  ...tag('Mitsubishi', MITSUBISHI_FITMENT),
  ...tag('Nissan', NISSAN_FITMENT),
  ...tag('Opel', OPEL_FITMENT),
  ...tag('Peugeot', PEUGEOT_FITMENT),
  ...tag('Porsche', PORSCHE_FITMENT),
  ...tag('Renault', RENAULT_FITMENT),
  ...tag('Seat', SEAT_FITMENT),
  ...tag('Skoda', SKODA_FITMENT),
  ...tag('Smart', SMART_FITMENT),
  ...tag('SsangYong', SSANGYONG_FITMENT),
  ...tag('Subaru', SUBARU_FITMENT),
  ...tag('Suzuki', SUZUKI_FITMENT),
  ...tag('Tesla', TESLA_FITMENT),
  ...tag('Toyota', TOYOTA_FITMENT),
  ...tag('Volga (GAZ)', VOLGA_FITMENT),
  ...tag('Volkswagen', VOLKSWAGEN_FITMENT),
  ...tag('Volvo', VOLVO_FITMENT),

  // ── Ağır vasıta ──
  ...tag('BMC', BMC_FITMENT),
  ...tag('DAF', DAF_FITMENT),
  ...tag('Ford Trucks', FORDTRUCKS_FITMENT),
  ...tag('Iveco Trucks', IVECOTRUCKS_FITMENT),
  ...tag('MAN', MAN_FITMENT),
  ...tag('Mercedes-Benz Kamyon & Otobüs', MERCEDESTR_FITMENT),
  ...tag('Neoplan', NEOPLAN_FITMENT),
  ...tag('Otokar', OTOKAR_FITMENT),
  ...tag('Renault Trucks', RENAULTTR_FITMENT),
  ...tag('Scania', SCANIA_FITMENT),
  ...tag('Setra', SETRA_FITMENT),
  ...tag('Temsa', TEMSA_FITMENT),
  ...tag('Volvo Trucks', VOLVOTR_FITMENT),
]

export const MISSING_CODE_ITEMS = [
  ...ALFA_MISSING,
  ...AUDI_MISSING,
  ...BMW_MISSING,
  ...CHEVROLET_MISSING,
  ...CITROEN_MISSING,
  ...CUPRA_MISSING,
  ...DACIA_MISSING,
  ...DS_MISSING,
  ...FIAT_MISSING,
  ...FORD_MISSING,
  ...GEELY_MISSING,
  ...GENESIS_MISSING,
  ...HAVAL_MISSING,
  ...HONDA_MISSING,
  ...HYUNDAI_MISSING,
  ...ISUZU_MISSING,
  ...IVECO_MISSING,
  ...JAGUAR_MISSING,
  ...JEEP_MISSING,
  ...KIA_MISSING,
  ...LANDROVER_MISSING,
  ...MAZDA_MISSING,
  ...MERCEDES_MISSING,
  ...MINI_MISSING,
  ...MITSUBISHI_MISSING,
  ...NISSAN_MISSING,
  ...OPEL_MISSING,
  ...PEUGEOT_MISSING,
  ...PORSCHE_MISSING,
  ...RENAULT_MISSING,
  ...SEAT_MISSING,
  ...SKODA_MISSING,
  ...SMART_MISSING,
  ...SSANGYONG_MISSING,
  ...SUBARU_MISSING,
  ...SUZUKI_MISSING,
  ...TESLA_MISSING,
  ...TOYOTA_MISSING,
  ...VOLGA_MISSING,
  ...VOLKSWAGEN_MISSING,
  ...VOLVO_MISSING,
  ...BMC_MISSING,
  ...DAF_MISSING,
  ...FORDTRUCKS_MISSING,
  ...IVECOTRUCKS_MISSING,
  ...MAN_MISSING,
  ...MERCEDESTR_MISSING,
  ...NEOPLAN_MISSING,
  ...OTOKAR_MISSING,
  ...RENAULTTR_MISSING,
  ...SCANIA_MISSING,
  ...SETRA_MISSING,
  ...TEMSA_MISSING,
  ...VOLVOTR_MISSING,
]
