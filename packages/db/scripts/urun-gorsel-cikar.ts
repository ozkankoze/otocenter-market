/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ÜRÜN GÖRSELİ ÇIKARICI
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kaynak ekran görüntülerindeki ürün kartlarından görselleri keser ve
 *  `apps/web/public/urun/` altına kare PNG olarak yazar.
 *
 *  NASIL ÇALIŞIR
 *  Kart ızgarası sabit varsayılmaz: satır bantları, "beyaza yakın olmayan"
 *  piksel yoğunluğuna bakılarak bulunur; sütunlar 4'e eşit bölünür. Her hücre
 *  beyaz kenarlarından kırpılır. Böylece ekran görüntülerinin kenar boşlukları
 *  farklı olsa da aynı betik çalışır.
 *
 *  ⚠ SIRA VARSAYIMI
 *  Her ekran görüntüsü için ürün sırası ELLE verilir (SHOTS listesi) ve
 *  transkripsiyondaki (urunler-alfa-romeo.ts) sırayla aynıdır. Betik, kesilen
 *  kart sayısı ile verilen SKU sayısı tutmazsa DURUR — sessizce yanlış görseli
 *  yanlış ürüne bağlamaktansa hata vermek yeğdir.
 *
 *  ⚠ YER TUTUCUYU EZER, GERÇEK FOTOĞRAFI EZMEZ
 *  Bir SKU için dosya zaten varsa, PNG metadata'sındaki `ocm-placeholder`
 *  işaretine bakılır: işaretliyse (kategori çizimi) üzerine yazılır, değilse
 *  (gerçek fotoğraf) dokunulmaz. Yalnızca "dosya var mı" diye bakmak, bir kez
 *  çizim üretilen ürünün sonradan gelen gerçek fotoğrafını kalıcı olarak
 *  engelliyordu.
 *
 *  ⚠ ÇÖZÜNÜRLÜK
 *  Kaynak kartlar ~300 piksel. Kare tuvale yerleştirilip 600'e ölçekleniyor;
 *  bu bir miktar büyütme demektir. Liste kartında sorun değil, ürün detayında
 *  hafif yumuşak görünür. Üreticinin kendi görsel kütüphanesinden gelen dosyalar
 *  bunların yerine konabilir — SKU adıyla üzerine yazmak yeterli.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { PRODUCT_IMAGE_DIR } from './paths'

const UPLOADS = process.env.SHOT_DIR ?? '/root/.claude/uploads/84085c28-7e6f-504b-ba51-484d77b6814d'
const OUT = process.env.OUT ? resolve(process.env.OUT) : PRODUCT_IMAGE_DIR

/**
 * Ekran görüntüsü → karttaki ürünlerin SOLDAN SAĞA, YUKARIDAN AŞAĞIYA sırası.
 * Aynı ürün birden çok ekranda geçiyor; her SKU için yalnızca İLK görülen
 * ekrandan kesilir (daha sonra tekrar edenler atlanır).
 */
/**
 * `null` = o karttan görsel ALINMAYACAK. İki durumda kullanılır:
 *   1. Kartta gerçek fotoğraf yok ("ÜRÜN GÖRSELİ HAZIRLANIYOR" ya da
 *      "Alerji Önleyici Filtre" gibi pazarlama görseli) — bunlar ürünün
 *      fotoğrafı değil, kesilirse yanıltıcı olur.
 *   2. Aynı ürün ekranda iki kez listelenmiş.
 * Kart sayısı ile liste uzunluğu yine BİREBİR tutmalıdır; null'lar sırayı korur.
 */
const SHOTS: Array<{ file: string; engine: string; skus: Array<string | null> }> = [
  {
    file: '86fb278c-Screenshot_20260818_at_11.23.36.png',
    engine: '156 · 1.9 JTD 85kw 115hp',
    skus: [
      'MANN-W7144',
      'MANN-CUK18202',
      'MANN-C15893',
      'MANN-CU2951',
      'MANN-CUK2951',
      'MANN-WK8545',
      'FILTRON-K1035',
      'FILTRON-AR3481',
    ],
  },
  {
    file: '1bdbd0b0-Screenshot_20260818_at_11.25.05.png',
    engine: '156 · 1.9 JTD 16V 103kw 140hp',
    skus: [
      'MANN-W7003',
      'MANN-CUK18202',
      'MANN-C15893',
      'MANN-WK8545',
      'MANN-WK8543',
      'FILTRON-OP5372',
      'FILTRON-AR3481',
      'FILTRON-PP9681',
    ],
  },
  {
    file: '28706c09-Screenshot_20260818_at_11.25.40.png',
    engine: '156 · 1.9 JTD 81kw 110hp',
    skus: [
      'MANN-W7144',
      'MANN-C15893',
      'MANN-CU2951',
      'MANN-CUK2951',
      'FILTRON-K1035',
      'FILTRON-AR3481',
      'FILTRON-PP968',
    ],
  },
  {
    file: '30086309-Screenshot_20260818_at_11.26.02.png',
    engine: '156 · 1.8 16V T.Spark 103kw 140hp',
    skus: [
      'MANN-CUK18202',
      'MANN-C15893',
      'MANN-CU2951',
      'MANN-CUK2951',
      'FILTRON-OP5371',
      'FILTRON-K1035',
      'FILTRON-AR3481',
    ],
  },
  {
    file: '85131399-Screenshot_20260818_at_11.27.38.png',
    engine: '159 · 1.9 JTDM 16V 100kw 136hp',
    skus: [
      'MANN-HU71211X',
      'MANN-HU7114X',
      'MANN-C18003',
      'MANN-CU22321',
      'MANN-CUK22321',
      'FILTRON-OE6485',
      'FILTRON-OE6822',
      'FILTRON-PP9663',
    ],
  },
  {
    file: '5efe5649-Screenshot_20260818_at_12.17.10.png',
    engine: 'A5 (8T, 8F) · 2.0 TDI 120kw 163hp',
    skus: [
      'MANN-HU7197X',
      'MANN-HU7008Z',
      'MANN-HU7020Z',
      'MANN-CU2450',
      null,
      'MANN-C32130',
      'MANN-CUK2450',
      null,
    ],
  },
  {
    file: '0961df61-Screenshot_20260818_at_12.17.23.png',
    engine: 'A5 (8T, 8F) · 2.0 TDI 120kw 163hp (devam)',
    skus: [
      'MANN-WK6003',
      null,
      null,
      null,
      'FILTRON-OE6501',
      'FILTRON-OE688',
      'FILTRON-OE6883',
      'FILTRON-K1278',
    ],
  },
  {
    file: '6cd83567-Screenshot_20260818_at_12.18.59.png',
    engine: 'A5 (8T, 8F) · 2.0 TDI 110kw 150hp',
    skus: [null, null, 'FILTRON-K1278A', 'FILTRON-AP1394', 'FILTRON-PP991', null, null],
  },
  {
    file: 'ccc6dc67-Screenshot_20260818_at_12.19.20.png',
    engine: 'A5 (8T, 8F) · 2.7 TDI 120kw 163hp',
    skus: ['FILTRON-OE6503', 'FILTRON-OE6506', null, null, null],
  },
  {
    file: '087b9843-Screenshot_20260818_at_12.19.13.png',
    engine: 'A5 (8T, 8F) · 2.7 TDI 120kw 163hp (MANN)',
    skus: ['MANN-HU8001X', null, 'MANN-HU831X', null, null, null, null, null],
  },
  {
    file: 'b3ebc867-Screenshot_20260818_at_13.02.23.png',
    engine: 'A5 (8T, 8F) · 3.0 TFSI 200kw 272hp',
    skus: [
      null,
      'MANN-HU7029Z',
      null,
      'MANN-HU7035Y',
      'MANN-C16114X',
      null,
      null,
      'FILTRON-OE6714',
    ],
  },
  {
    file: '85229bc4-Screenshot_20260818_at_13.02.27.png',
    engine: 'A5 (8T, 8F) · 3.0 TFSI 200kw 272hp (devam)',
    // Yarım satırlı ekran: satır bandı tespiti görsel ve metin alanını ayrı
    // birer bant sayıyor, bu yüzden 2 kart 4 kırpma üretiyor. Metin kırpmaları
    // null ile atlanıyor.
    skus: [null, 'FILTRON-AK3714', null, null],
  },
  {
    file: 'b3e81ec4-Screenshot_20260818_at_13.02.42.png',
    engine: 'A5 (8T, 8F) · 1.8 TFSI 125kw 170hp',
    skus: [null, 'MANN-W71945', null, null, null, null, null, 'FILTRON-OP5267'],
  },
  {
    file: '2a173e2c-Screenshot_20260818_at_13.03.05.png',
    engine: 'A5 (8T, 8F) · 3.0 TDI 180kw 245hp',
    skus: ['MANN-HU8005Z', null, null, null, null, null, null, 'FILTRON-OE6507'],
  },
  {
    file: 'db56dcd0-Screenshot_20260818_at_15.59.07.png',
    engine: 'B6+B7 · 1.8 T 120kw 163hp (MANN)',
    skus: [
      'MANN-CU3037',
      'MANN-W94066',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-WK7203',
      'MANN-WK7205',
      'MANN-WK7206',
      'MANN-H2019KIT1',
    ],
  },
  {
    file: '42fcf29c-Screenshot_20260818_at_15.59.14.png',
    engine: 'B6+B7 · 1.8 T 120kw 163hp (FILTRON)',
    skus: [
      'FILTRON-K1078',
      'FILTRON-OP5266',
      'FILTRON-K1078A',
      'FILTRON-AP1792',
      'FILTRON-PP8365',
      'FILTRON-PP8368',
    ],
  },
  {
    file: 'a6bc3c93-Screenshot_20260818_at_15.59.26.png',
    engine: 'B6+B7 · 1.8 T 125kw 170hp (MANN)',
    skus: [
      'MANN-W71930',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-WK7203',
      'MANN-WK7205',
      'MANN-WK7206',
      'MANN-H2019KIT1',
    ],
  },
  {
    file: '2d655745-Screenshot_20260818_at_15.59.33.png',
    engine: 'B6+B7 · 1.8 T 125kw 170hp (FILTRON)',
    skus: [
      'FILTRON-OP5261',
      'FILTRON-K1078',
      'FILTRON-K1078A',
      'FILTRON-AP1792',
      'FILTRON-PP8365',
      'FILTRON-PP8368',
    ],
  },
  {
    file: '5382d14d-Screenshot_20260818_at_15.59.45.png',
    engine: 'B6+B7 · 1.8 T 140kw 190hp (MANN)',
    skus: [
      'MANN-CU3037',
      'MANN-W94066',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-WK7203',
      'MANN-WK7205',
      'MANN-WK7206',
      'MANN-H2019KIT1',
    ],
  },
  {
    file: '014702a9-Screenshot_20260818_at_15.59.51.png',
    engine: 'B6+B7 · 1.8 T 140kw 190hp (FILTRON)',
    skus: [
      'FILTRON-K1078',
      'FILTRON-OP5266',
      'FILTRON-K1078A',
      'FILTRON-AP1792',
      'FILTRON-PP8365',
      'FILTRON-PP8368',
    ],
  },
  {
    file: 'e513c20b-Screenshot_20260818_at_16.00.02.png',
    engine: 'B6+B7 · 1.8 T 110kw 150hp (MANN)',
    skus: [
      'MANN-CU3037',
      'MANN-W94066',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-WK7203',
      'MANN-WK7205',
      'MANN-WK7206',
      'MANN-H2019KIT1',
    ],
  },
  {
    file: '82d32c86-Screenshot_20260818_at_16.00.09.png',
    engine: 'B6+B7 · 1.8 T 110kw 150hp (FILTRON)',
    skus: [
      'FILTRON-K1078',
      'FILTRON-OP5266',
      'FILTRON-K1078A',
      'FILTRON-AP1792',
      'FILTRON-PP8365',
      'FILTRON-PP8368',
    ],
  },
  {
    file: '96a0262c-Screenshot_20260818_at_16.00.21.png',
    engine: 'B6+B7 · 1.6 75kw 102hp',
    skus: [
      'MANN-W71930',
      'MANN-WK7301',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-OP5261',
      'FILTRON-K1078',
    ],
  },
  {
    file: '354d7848-Screenshot_20260818_at_16.00.26.png',
    engine: 'B6+B7 · 1.6 75kw 102hp (devam)',
    skus: ['FILTRON-PP8361', 'FILTRON-K1078A', 'FILTRON-AP1792', null, null, null],
  },
  {
    file: 'c7ee5e5f-Screenshot_20260818_at_16.00.38.png',
    engine: 'B6+B7 · 3.0 V6 162kw 220hp',
    skus: [
      'MANN-WK7301',
      'MANN-CU3037',
      'MANN-W93021',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-K1078',
      'FILTRON-PP8361',
    ],
  },
  {
    file: '94aa2dd5-Screenshot_20260818_at_16.00.45.png',
    engine: 'B6+B7 · 3.0 V6 162kw 220hp (devam)',
    skus: ['FILTRON-K1078A', 'FILTRON-AP1792', 'FILTRON-OP5265', null, null, null],
  },
  {
    file: 'b8cd172f-Screenshot_20260818_at_16.02.40.png',
    engine: 'B6+B7 · 2.0 TFSI 147kw 200hp',
    skus: [
      'MANN-CU3037',
      'MANN-HU7196X',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-WK7204',
      'MANN-H2019KIT1',
      'FILTRON-K1078',
      'FILTRON-OE6713',
    ],
  },
  {
    file: '1df09fae-Screenshot_20260818_at_16.02.46.png',
    engine: 'B6+B7 · 2.0 TFSI 147kw 200hp (devam)',
    skus: ['FILTRON-K1078A', 'FILTRON-AP1792', 'FILTRON-PP8366', null, null, null],
  },
  {
    file: '296c084d-Screenshot_20260818_at_16.02.58.png',
    engine: 'B6+B7 · 2.0 TFSI 125kw 170hp',
    skus: [
      'MANN-CU3037',
      'MANN-HU7196X',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-WK7204',
      'MANN-H2019KIT1',
      'FILTRON-K1078',
      'FILTRON-OE6713',
    ],
  },
  {
    file: '7518c49d-Screenshot_20260818_at_16.03.03.png',
    engine: 'B6+B7 · 2.0 TFSI 125kw 170hp (devam)',
    skus: ['FILTRON-K1078A', 'FILTRON-AP1792', 'FILTRON-PP8366', null, null, null],
  },
  {
    file: '3fb56191-Screenshot_20260818_at_17.36.18.png',
    engine: 'B6+B7 · 1.9 TDI 96kw 130hp',
    skus: [
      'MANN-HU7262X',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-WK8533X',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-OE6401',
      'FILTRON-K1078',
    ],
  },
  {
    file: 'c5cab88c-Screenshot_20260818_at_17.36.25.png',
    engine: 'B6+B7 · 1.9 TDI 96kw 130hp (devam)',
    skus: ['FILTRON-K1078A', 'FILTRON-AP1792', 'FILTRON-PP8391', null, null, null],
  },
  {
    file: '0b6b3b92-Screenshot_20260818_at_17.37.14.png',
    engine: 'B6+B7 · 1.9 TDI 85kw 115hp',
    skus: [
      'MANN-HU7262X',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-WK8533X',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-OE6401',
      'FILTRON-K1078',
    ],
  },
  {
    file: 'c3109389-Screenshot_20260818_at_17.37.21.png',
    engine: 'B6+B7 · 1.9 TDI 85kw 115hp (devam)',
    skus: ['FILTRON-K1078A', 'FILTRON-AP1792', 'FILTRON-PP8391', null, null, null],
  },
  {
    file: '6efe2f33-Screenshot_20260818_at_17.37.38.png',
    engine: 'B6+B7 · 1.9 TDI 74kw 100hp',
    skus: [
      'MANN-HU7262X',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-WK8533X',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-OE6401',
      'FILTRON-K1078',
    ],
  },
  {
    file: '36575f8d-Screenshot_20260818_at_17.37.43.png',
    engine: 'B6+B7 · 1.9 TDI 74kw 100hp (devam)',
    skus: ['FILTRON-K1078A', 'FILTRON-AP1792', 'FILTRON-PP8391', null, null, null],
  },
  {
    file: '7bf51c61-Screenshot_20260818_at_17.37.58.png',
    engine: 'B6+B7 · 2.0 TDI 125kw 170hp',
    skus: [
      'MANN-HU7197X',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-OE6501',
      'FILTRON-K1078',
      'FILTRON-K1078A',
    ],
  },
  {
    file: 'd5da95ec-Screenshot_20260818_at_17.38.03.png',
    engine: 'B6+B7 · 2.0 TDI 125kw 170hp (devam)',
    skus: ['FILTRON-AP1792', 'FILTRON-PP83910', null, null],
  },
  {
    file: '6e5acd57-Screenshot_20260818_at_17.38.16.png',
    engine: 'B6+B7 · 2.0 TDI 92kw 125hp',
    skus: [
      'MANN-HU7197X',
      'MANN-CU3037',
      'MANN-C271921',
      'MANN-CUK3037',
      'MANN-H2019KIT1',
      'FILTRON-OE6501',
      'FILTRON-K1078',
      'FILTRON-K1078A',
    ],
  },
  {
    file: 'c8479002-Screenshot_20260818_at_17.38.21.png',
    engine: 'B6+B7 · 2.0 TDI 92kw 125hp (devam)',
    skus: ['FILTRON-AP1792', 'FILTRON-PP83910', null, null],
  },
  {
    file: '3b40822c-Screenshot_20260818_at_17.40.52.png',
    engine: 'A6 (4F/C6) · 2.7 TDI V6 120kw 163hp',
    skus: [
      'MANN-HU8001X',
      null,
      'MANN-HU831X',
      'MANN-CU30232',
      'MANN-C17137X',
      'MANN-CUK30232',
      null,
      'MANN-WK7351',
    ],
  },
  {
    file: 'bb94da27-Screenshot_20260818_at_17.41.01.png',
    engine: 'A6 (4F/C6) · 2.7 TDI V6 120kw 163hp (devam)',
    skus: [
      'MANN-WK7002',
      'FILTRON-OE6503',
      'FILTRON-OE6506',
      null,
      'FILTRON-K11622X',
      'FILTRON-K1162A2X',
      'FILTRON-AR3713',
      'FILTRON-PP9862',
    ],
  },
  {
    file: 'f6f911eb-Screenshot_20260818_at_17.41.12.png',
    engine: 'A6 (4F/C6) · 3.0 TDI V6 155kw 211hp',
    skus: [
      'MANN-HU8001X',
      null,
      'MANN-HU831X',
      'MANN-CU30232',
      'MANN-C17137X',
      'MANN-CUK30232',
      null,
      'MANN-WK7351',
    ],
  },
  {
    file: '30932266-Screenshot_20260818_at_17.41.20.png',
    engine: 'A6 (4F/C6) · 3.0 TDI V6 155kw 211hp (devam)',
    skus: [
      'MANN-WK7002',
      'FILTRON-OE6503',
      'FILTRON-OE6506',
      null,
      'FILTRON-K11622X',
      'FILTRON-K1162A2X',
      'FILTRON-AR3713',
      'FILTRON-PP9862',
    ],
  },
  {
    file: '6538647b-Screenshot_20260818_at_17.41.30.png',
    engine: 'A6 (4F/C6) · 2.7 TDI V6 132kw 180hp',
    skus: [
      'MANN-HU8001X',
      'MANN-HU831X',
      'MANN-CU30232',
      'MANN-C17137X',
      'MANN-CUK30232',
      null,
      'MANN-WK7351',
      'FILTRON-OE6503',
    ],
  },
  {
    file: '4dcf9a42-Screenshot_20260818_at_17.41.39.png',
    engine: 'A6 (4F/C6) · 2.7 TDI V6 132kw 180hp (devam)',
    skus: [
      'FILTRON-OE6506',
      'FILTRON-K11622X',
      'FILTRON-K1162A2X',
      'FILTRON-AR3713',
      'FILTRON-PP9862',
    ],
  },
  {
    file: 'e248d3d2-Screenshot_20260818_at_19.44.46.png',
    engine: 'A6 · 2.0 TDI 120kw 163hp',
    skus: [
      'MANN-HU7197X',
      'MANN-C16118',
      'MANN-CU30232',
      'MANN-CUK30232',
      'MANN-WK6001',
      null,
      'FILTRON-OE6501',
      'FILTRON-AR3712',
    ],
  },
  {
    file: 'df00aa8b-Screenshot_20260818_at_19.44.52.png',
    engine: 'A6 · 2.0 TDI 120kw 163hp (devam)',
    skus: ['FILTRON-K11622X', 'FILTRON-K1162A2X', 'FILTRON-PP993', null, null, null],
  },
  {
    file: '1a13a311-Screenshot_20260818_at_19.45.03.png',
    engine: 'A6 · 2.0 TDI 125kw 170hp',
    skus: [
      'MANN-HU7197X',
      'MANN-C16118',
      'MANN-CU30232',
      'MANN-CUK30232',
      'MANN-WK6001',
      null,
      'FILTRON-OE6501',
      'FILTRON-AR3712',
    ],
  },
  {
    file: '30215a8e-Screenshot_20260818_at_19.45.09.png',
    engine: 'A6 · 2.0 TDI 125kw 170hp (devam)',
    skus: ['FILTRON-K11622X', 'FILTRON-K1162A2X', 'FILTRON-PP993', null, null, null],
  },
  {
    file: '21d0408e-Screenshot_20260818_at_19.45.21.png',
    engine: 'A6 · 2.0 TFSI 125kw 170hp',
    skus: [
      'MANN-HU7196X',
      'MANN-C16118',
      'MANN-CU30232',
      'MANN-WK7204',
      'MANN-CUK30232',
      null,
      'FILTRON-OE6713',
      'FILTRON-AR3712',
    ],
  },
  {
    file: 'e8342f90-Screenshot_20260818_at_19.45.26.png',
    engine: 'A6 · 2.0 TFSI 125kw 170hp (devam)',
    skus: ['FILTRON-K11622X', 'FILTRON-K1162A2X', 'FILTRON-PP8366', null, null, null],
  },
  {
    file: '00bd34c9-Screenshot_20260818_at_19.45.38.png',
    engine: 'A6 · 3.0 TDI V6 176kw 239hp',
    skus: [
      'MANN-HU8001X',
      'MANN-CU30232',
      'MANN-C17137X',
      'MANN-CUK30232',
      null,
      'MANN-WK7002',
      'FILTRON-OE6506',
      'FILTRON-K11622X',
    ],
  },
  {
    file: '05bb2fb1-Screenshot_20260818_at_19.45.42.png',
    engine: 'A6 · 3.0 TDI V6 176kw 239hp (devam)',
    skus: ['FILTRON-K1162A2X', 'FILTRON-AR3713', 'FILTRON-PP9912', null, null, null],
  },
  {
    file: '88ea3c7d-Screenshot_20260818_at_19.45.53.png',
    engine: 'A6 · 2.7 TDI V6 140kw 190hp',
    skus: [
      'MANN-HU8001X',
      'MANN-CU30232',
      'MANN-C17137X',
      'MANN-CUK30232',
      null,
      'MANN-WK7002',
      'FILTRON-OE6506',
      'FILTRON-K11622X',
    ],
  },
  {
    file: 'bb039bf8-Screenshot_20260818_at_19.45.58.png',
    engine: 'A6 · 2.7 TDI V6 140kw 190hp (devam)',
    skus: ['FILTRON-K1162A2X', 'FILTRON-AR3713', 'FILTRON-PP9912', null, null, null],
  },
  {
    file: '37f7b775-Screenshot_20260818_at_19.46.11.png',
    engine: 'A6 · 2.0 TDI 103kw 140hp',
    skus: [
      'MANN-HU7197X',
      'MANN-C16118',
      'MANN-CU30232',
      'MANN-WK84221X',
      'MANN-CUK30232',
      null,
      'FILTRON-OE6501',
      'FILTRON-AR3712',
    ],
  },
  {
    file: '7037f600-Screenshot_20260818_at_19.46.16.png',
    engine: 'A6 · 2.0 TDI 103kw 140hp (devam)',
    skus: ['FILTRON-K11622X', 'FILTRON-PP83910', 'FILTRON-K1162A2X', null, null, null],
  },
  {
    file: '1e9dab08-Screenshot_20260818_at_19.46.35.png',
    engine: 'A6 · 3.0 TDI V6 166kw 226hp',
    skus: [
      'MANN-HU831X',
      'MANN-CU30232',
      'MANN-C17137X',
      'MANN-CUK30232',
      null,
      'MANN-WK7351',
      'FILTRON-OE6503',
      'FILTRON-K11622X',
    ],
  },
  {
    file: 'f29b0394-Screenshot_20260818_at_19.46.40.png',
    engine: 'A6 · 3.0 TDI V6 166kw 226hp (devam)',
    skus: ['FILTRON-K1162A2X', 'FILTRON-AR3713', 'FILTRON-PP9862', null, null, null],
  },
  {
    file: '02c3cf15-Screenshot_20260818_at_19.46.53.png',
    engine: 'A6 · 2.8 FSI V6 140kw 190hp',
    skus: [
      'MANN-HU7029Z',
      'MANN-CU30232',
      'MANN-C171371X',
      'MANN-WK7204',
      'MANN-CUK30232',
      null,
      'FILTRON-OE6714',
      'FILTRON-K11622X',
    ],
  },
  {
    file: '4827531e-Screenshot_20260818_at_19.46.58.png',
    engine: 'A6 · 2.8 FSI V6 140kw 190hp (devam)',
    skus: ['FILTRON-K1162A2X', 'FILTRON-PP8366', null, null],
  },
  {
    file: 'ca2ba112-Screenshot_20260818_at_20.24.32.png',
    engine: 'A6 · 2.4 V6 130kw 177hp',
    skus: [
      'MANN-HU7029Z',
      'MANN-CU30232',
      'MANN-C171371X',
      'MANN-WK7203',
      'MANN-CUK30232',
      null,
      'FILTRON-OE6714',
      'FILTRON-K11622X',
    ],
  },
  {
    file: '5cc08506-Screenshot_20260818_at_20.24.36.png',
    engine: 'A6 · 2.4 V6 130kw 177hp (devam)',
    skus: ['FILTRON-K1162A2X', 'FILTRON-PP8365', null, null],
  },
  {
    file: 'd54f79c7-Screenshot_20260818_at_20.24.48.png',
    engine: 'A6 · 3.0 TFSI V6 213kw 290hp',
    skus: [
      'MANN-HU7029Z',
      'MANN-CU30232',
      'MANN-C171371X',
      'MANN-CUK30232',
      null,
      'FILTRON-OE6714',
      'FILTRON-K11622X',
      'FILTRON-K1162A2X',
    ],
  },
  {
    file: 'c48a682e-Screenshot_20260818_at_20.25.06.png',
    engine: 'A6 · 3.0 TFSI V6 220kw 299hp',
    skus: [
      'MANN-HU7029Z',
      'MANN-CU30232',
      'MANN-C171371X',
      'MANN-CUK30232',
      null,
      'FILTRON-OE6714',
      'FILTRON-K11622X',
      'FILTRON-K1162A2X',
    ],
  },
  {
    file: 'c7104829-Screenshot_20260818_at_20.26.14.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 120kw 163hp',
    skus: [
      'MANN-HU7197X',
      'MANN-HU7008Z',
      'MANN-HU7020Z',
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
    ],
  },
  {
    file: 'df2b238f-Screenshot_20260818_at_20.26.22.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 120kw 163hp (devam)',
    skus: [
      'MANN-WK6011',
      'FILTRON-OE6501',
      'FILTRON-OE688',
      'FILTRON-OE6883',
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-AP1394',
      'FILTRON-PP9911',
    ],
  },
  {
    file: '61c32e5d-Screenshot_20260818_at_20.26.41.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 100kw 136hp',
    skus: [
      'MANN-HU7197X',
      'MANN-HU7008Z',
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      'MANN-WK6003',
      'MANN-WK6021',
      null,
    ],
  },
  {
    file: '75fde1a4-Screenshot_20260818_at_20.26.47.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 100kw 136hp (devam)',
    skus: [
      'MANN-WK6011',
      'FILTRON-OE6501',
      'FILTRON-OE688',
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-AP1394',
      'FILTRON-PP991',
      'FILTRON-PP9911',
    ],
  },
  {
    file: 'b321c4b2-Screenshot_20260818_at_20.26.58.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 125kw 170hp',
    skus: [
      'MANN-HU7197X',
      'MANN-HU7008Z',
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      'MANN-WK6003',
      'MANN-WK6021',
      null,
    ],
  },
  {
    file: '0d05f9f6-Screenshot_20260818_at_20.27.04.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 125kw 170hp (devam)',
    skus: [
      'MANN-WK6011',
      'FILTRON-OE6501',
      'FILTRON-OE688',
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-AP1394',
      'FILTRON-PP991',
      'FILTRON-PP9911',
    ],
  },
  {
    file: 'f38b40a5-Screenshot_20260818_at_20.27.17.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 105kw 143hp',
    skus: [
      'MANN-HU7197X',
      'MANN-HU7008Z',
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      'MANN-WK6003',
      'MANN-WK6021',
      null,
    ],
  },
  {
    file: '2878097e-Screenshot_20260818_at_20.27.24.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 105kw 143hp (devam)',
    skus: [
      'MANN-WK6011',
      'FILTRON-OE6501',
      'FILTRON-OE688',
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-AP1394',
      'FILTRON-PP991',
      'FILTRON-PP9911',
    ],
  },
  {
    file: '733096e2-Screenshot_20260818_at_20.27.34.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 110kw 150hp',
    skus: [
      'MANN-HU7008Z',
      'MANN-HU7020Z',
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
      'FILTRON-OE688',
    ],
  },
  {
    file: 'bd58f18c-Screenshot_20260818_at_20.27.43.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 110kw 150hp (devam)',
    skus: ['FILTRON-OE6883', 'FILTRON-K1278', 'FILTRON-K1278A', 'FILTRON-AP1394', null],
  },
  {
    file: 'ee93805d-Screenshot_20260818_at_20.27.55.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 130kw 177hp',
    skus: [
      'MANN-HU7008Z',
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
      'FILTRON-OE688',
      'FILTRON-K1278',
    ],
  },
  {
    file: '019dad94-Screenshot_20260818_at_20.28.01.png',
    engine: 'Q5 (8R) · 2.0 TDI quattro 130kw 177hp (devam)',
    skus: ['FILTRON-K1278A', 'FILTRON-AP1394', null, null, null, null],
  },
  {
    file: '8c01ea8d-Screenshot_20260818_at_20.51.50.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 180kw 245hp',
    skus: [
      'MANN-HU8005Z',
      'MANN-CU2450',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-OE6507',
    ],
  },
  {
    file: '7bd42e34-Screenshot_20260818_at_20.52.11.png',
    engine: 'Q5 (8R) · 3.0 TFSI quattro 200kw 272hp',
    skus: [
      'MANN-CU2450',
      'MANN-HU7029Z',
      'MANN-CUK2450',
      'MANN-C16114X',
      null,
      'FILTRON-K1278',
      'FILTRON-OE6714',
      'FILTRON-K1278A',
    ],
  },
  {
    file: '74d80184-Screenshot_20260818_at_20.52.21.png',
    engine: 'Q5 (8R) · 3.0 TFSI quattro 200kw 272hp (devam)',
    skus: ['FILTRON-AK3714', null],
  },
  {
    file: '028fea2a-Screenshot_20260818_at_20.52.34.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 190kw 258hp',
    skus: [
      'MANN-HU8005Z',
      'MANN-CU2450',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-OE6507',
    ],
  },
  {
    file: '7f69511d-Screenshot_20260818_at_20.52.47.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 184kw 250hp',
    skus: [
      'MANN-HU8005Z',
      'MANN-CU2450',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-OE6507',
    ],
  },
  {
    file: 'ea403bd0-Screenshot_20260818_at_20.53.15.png',
    engine: 'Q5 (8R) · 3.2 FSI quattro 199kw 270hp',
    skus: [
      'MANN-CU2450',
      'MANN-HU7029Z',
      'MANN-CUK2450',
      'MANN-C16114X',
      null,
      'FILTRON-K1278',
      'FILTRON-OE6714',
      'FILTRON-K1278A',
    ],
  },
  {
    file: 'aa994bf2-Screenshot_20260818_at_20.53.20.png',
    engine: 'Q5 (8R) · 3.2 FSI quattro 199kw 270hp (devam)',
    skus: ['FILTRON-AK3714', null],
  },
  {
    file: '6f39041a-Screenshot_20260818_at_20.53.40.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 176kw 240hp',
    skus: [
      'MANN-HU8001X',
      'MANN-CU2450',
      'MANN-CUK2450',
      null,
      'MANN-WK6011',
      'FILTRON-K1278',
      'FILTRON-OE6506',
      'FILTRON-K1278A',
    ],
  },
  {
    file: 'adb2b6a0-Screenshot_20260818_at_20.53.46.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 176kw 240hp (devam)',
    skus: ['FILTRON-PP9911', null],
  },
  {
    file: 'a5022672-Screenshot_20260818_at_20.53.58.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 176kw 239hp',
    skus: [
      'MANN-HU8005Z',
      'MANN-CU2450',
      'MANN-CUK2450',
      'MANN-WK6021',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-OE6507',
    ],
  },
  {
    file: '2fe9fef4-Screenshot_20260818_at_20.54.15.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 155kw 211hp',
    skus: [
      'MANN-HU8001X',
      'MANN-CU2450',
      'MANN-CUK2450',
      null,
      'MANN-WK6011',
      'FILTRON-K1278',
      'FILTRON-OE6506',
      'FILTRON-K1278A',
    ],
  },
  {
    file: '42832472-Screenshot_20260818_at_20.54.21.png',
    engine: 'Q5 (8R) · 3.0 TDI quattro 155kw 211hp (devam)',
    skus: ['FILTRON-PP9911', null],
  },
  {
    file: '58fde7f2-Screenshot_20260818_at_20.54.36.png',
    engine: 'Q5 (8R) · 2.0 TFSI quattro 162kw 220hp',
    skus: [
      'MANN-CU2450',
      'MANN-W71945',
      'MANN-C32130',
      'MANN-CUK2450',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-OP5267',
    ],
  },
  {
    file: 'cad2aef5-Screenshot_20260818_at_20.54.41.png',
    engine: 'Q5 (8R) · 2.0 TFSI quattro 162kw 220hp (devam)',
    skus: ['FILTRON-AP1394', null],
  },
  {
    file: '89d6905d-Screenshot_20260818_at_20.54.59.png',
    engine: 'Q5 (8R) · 2.0 TFSI quattro 169kw 230hp',
    skus: [
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-AP1394',
      null,
    ],
  },
  {
    file: '3a709eca-Screenshot_20260818_at_20.55.12.png',
    engine: 'Q5 (8R) · 2.0 TFSI quattro 165kw 225hp',
    skus: [
      'MANN-CU2450',
      'MANN-C32130',
      'MANN-CUK2450',
      null,
      'FILTRON-K1278',
      'FILTRON-K1278A',
      'FILTRON-AP1394',
      null,
    ],
  },
  {
    file: 'e11d5c86-Screenshot_20260818_at_21.45.20.png',
    engine: 'A3 (8P) · 2.0 TDI 103kw 140hp',
    skus: [
      'MANN-HU7197X',
      'MANN-HU7008Z',
      'MANN-CU2939',
      'MANN-C35154',
      'MANN-CUK2939',
      null,
      'MANN-PU825X',
      'MANN-PU9361X',
    ],
  },
  {
    file: 'e655364c-Screenshot_20260818_at_21.45.30.png',
    engine: 'A3 (8P) · 2.0 TDI 103kw 140hp (devam)',
    skus: [
      'MANN-PU9362X',
      'FILTRON-OE6501',
      'FILTRON-OE688',
      'FILTRON-K1111',
      'FILTRON-AP1392',
      'FILTRON-K1111A',
      'FILTRON-PE9733',
      'FILTRON-PE9732',
    ],
  },
  {
    file: 'bae02fa8-Screenshot_20260818_at_21.45.43.png',
    engine: 'A3 (8P) · 1.4 TFSI 92kw 125hp',
    skus: [
      'MANN-CU2939',
      'MANN-HU7126X',
      'MANN-W71294',
      'MANN-W71293',
      'MANN-CUK2939',
      'MANN-C14130',
      'MANN-WK69',
      null,
    ],
  },
  {
    file: 'b6dfa564-Screenshot_20260818_at_21.45.50.png',
    engine: 'A3 (8P) · 1.4 TFSI 92kw 125hp (devam)',
    skus: [
      'FILTRON-K1111',
      'FILTRON-OE6502',
      'FILTRON-K1111A',
      'FILTRON-AK3704',
      'FILTRON-OP6411',
      'FILTRON-OP6412',
      'FILTRON-PP8362',
    ],
  },
  {
    file: 'b18c4b8e-Screenshot_20260818_at_21.46.03.png',
    engine: 'A3 (8P) · 2.0 TFSI 147kw 200hp',
    skus: [
      'MANN-CU2939',
      'MANN-C35154',
      'MANN-CUK2939',
      'MANN-HU7196X',
      'MANN-W71945',
      'MANN-C41110',
      'MANN-WK69',
      null,
    ],
  },
  {
    file: 'e8e08d46-Screenshot_20260818_at_21.46.10.png',
    engine: 'A3 (8P) · 2.0 TFSI 147kw 200hp (devam)',
    skus: [
      'FILTRON-K1111',
      'FILTRON-AP1392',
      'FILTRON-OE6713',
      'FILTRON-K1111A',
      'FILTRON-AP1498',
      'FILTRON-OP5267',
      'FILTRON-PP8362',
    ],
  },
  {
    file: 'e0930c41-Screenshot_20260818_at_21.46.20.png',
    engine: 'A3 (8P) · 1.9 TDI 77kw 105hp',
    skus: [
      'MANN-HU7197X',
      'MANN-CU2939',
      'MANN-C35154',
      'MANN-CUK2939',
      null,
      'MANN-PU825X',
      'MANN-PU9361X',
      'MANN-PU9362X',
    ],
  },
  {
    file: '0bd94eaf-Screenshot_20260818_at_21.46.27.png',
    engine: 'A3 (8P) · 1.9 TDI 77kw 105hp (devam)',
    skus: [
      'FILTRON-OE6501',
      'FILTRON-K1111',
      'FILTRON-AP1392',
      'FILTRON-K1111A',
      'FILTRON-PE9733',
      'FILTRON-PE9732',
    ],
  },
  {
    file: '3988a0b8-Screenshot_20260818_at_21.46.39.png',
    engine: 'A3 (8P) · 1.6 FSI 85kw 115hp',
    skus: [
      'MANN-WK512',
      'MANN-CU2939',
      'MANN-HU7126X',
      'MANN-CUK2939',
      'MANN-C30831',
      'MANN-WK69',
      null,
      'FILTRON-PP905',
    ],
  },
  {
    file: '7d7f09e5-Screenshot_20260818_at_21.46.47.png',
    engine: 'A3 (8P) · 1.6 FSI 85kw 115hp (devam)',
    skus: ['FILTRON-K1111', 'FILTRON-OE6502', 'FILTRON-K1111A', 'FILTRON-AP1497', 'FILTRON-PP8362'],
  },
  {
    file: '8dbaaa7a-Screenshot_20260818_at_21.46.54.png',
    engine: 'A3 (8P) · 2.0 FSI 110kw 150hp',
    skus: [
      'MANN-WK512',
      'MANN-CU2939',
      'MANN-CUK2939',
      'MANN-HU7196X',
      'MANN-C14130',
      'MANN-WK69',
      null,
      'FILTRON-PP905',
    ],
  },
  {
    file: '85acf102-Screenshot_20260818_at_21.47.00.png',
    engine: 'A3 (8P) · 2.0 FSI 110kw 150hp (devam)',
    skus: ['FILTRON-K1111', 'FILTRON-OE6713', 'FILTRON-K1111A', 'FILTRON-AK3704', 'FILTRON-PP8362'],
  },
  {
    file: 'fa2f30e4-Screenshot_20260818_at_21.47.07.png',
    engine: 'A3 (8P) · 1.6 75kw 102hp',
    skus: [
      'MANN-W71930',
      'MANN-CU2939',
      'MANN-CUK2939',
      'MANN-C14130',
      'MANN-WK59X',
      'MANN-WK692',
      null,
      'FILTRON-OP5261',
    ],
  },
  {
    file: '7b37b5cb-Screenshot_20260818_at_21.47.12.png',
    engine: 'A3 (8P) · 1.6 75kw 102hp (devam)',
    skus: [
      'FILTRON-K1111',
      'FILTRON-K1111A',
      'FILTRON-AK3704',
      'FILTRON-PP8364',
      null,
      null,
      null,
      null,
    ],
  },
  {
    file: 'dff8517c-Screenshot_20260818_at_21.48.12.png',
    engine: 'A3 (8P) · 2.0 TDI 120kw 163hp',
    skus: [
      'MANN-HU7197X',
      'MANN-CU2939',
      'MANN-C35154',
      'MANN-CUK2939',
      null,
      'MANN-PU825X',
      'FILTRON-OE6501',
      'FILTRON-K1111',
    ],
  },
  {
    file: '35e5e443-Screenshot_20260818_at_21.48.17.png',
    engine: 'A3 (8P) · 2.0 TDI 120kw 163hp (devam)',
    skus: ['FILTRON-AP1392', 'FILTRON-K1111A', 'FILTRON-PE9733', null, null, null],
  },
  {
    file: '7fccf79f-Screenshot_20260819_at_08.50.56.png',
    engine: 'A3 (8P) · 1.6 TDI 77kw 105hp',
    skus: [
      'MANN-HU7008Z',
      'MANN-CU2939',
      'MANN-C35154',
      'MANN-CUK2939',
      null,
      'MANN-PU825X',
      'FILTRON-OE688',
      'FILTRON-K1111',
    ],
  },
  {
    file: 'f32175e1-Screenshot_20260819_at_08.51.02.png',
    engine: 'A3 (8P) · 1.6 TDI 77kw 105hp (devam)',
    skus: ['FILTRON-AP1392', 'FILTRON-K1111A', 'FILTRON-PE9733', null, null, null],
  },
  {
    file: '9a9b4e17-Screenshot_20260819_at_08.51.15.png',
    engine: 'A3 (8P) · 1.6 TDI 66kw 90hp',
    skus: [
      'MANN-HU7008Z',
      'MANN-CU2939',
      'MANN-C35154',
      'MANN-CUK2939',
      null,
      'MANN-PU825X',
      'FILTRON-OE688',
      'FILTRON-K1111',
    ],
  },
  {
    file: '44e42cf5-Screenshot_20260819_at_08.51.24.png',
    engine: 'A3 (8P) · 1.6 TDI 66kw 90hp (devam)',
    skus: ['FILTRON-AP1392', 'FILTRON-K1111A', 'FILTRON-PE9733', null, null, null],
  },
  {
    file: 'ae3c5829-Screenshot_20260819_at_08.51.49.png',
    engine: 'A3 (8P) · 2.0 TFSI 188kw 256hp',
    skus: [
      'MANN-CU2939',
      'MANN-CUK2939',
      'MANN-HU7196X',
      'MANN-C41002',
      'MANN-WK69',
      null,
      'FILTRON-K1111',
      'FILTRON-OE6713',
    ],
  },
  {
    file: 'aef44a60-Screenshot_20260819_at_08.51.53.png',
    engine: 'A3 (8P) · 2.0 TFSI 188kw 256hp (devam)',
    skus: ['FILTRON-K1111A', 'FILTRON-PP8362', null, null],
  },
  {
    file: '67c47dda-Screenshot_20260819_at_08.52.05.png',
    engine: 'A3 (8P) · 2.0 TFSI 195kw 265hp',
    skus: [
      'MANN-CU2939',
      'MANN-CUK2939',
      'MANN-HU7196X',
      'MANN-C41002',
      'MANN-WK69',
      null,
      'FILTRON-K1111',
      'FILTRON-OE6713',
    ],
  },
  {
    file: '49b6f509-Screenshot_20260819_at_08.52.09.png',
    engine: 'A3 (8P) · 2.0 TFSI 195kw 265hp (devam)',
    skus: ['FILTRON-K1111A', 'FILTRON-PP8362', null, null],
  },
  {
    file: '7e9faadb-Screenshot_20260819_at_08.52.25.png',
    engine: 'A3 (8P) · 1.4 TFSI 85kw 116hp',
    skus: [
      'MANN-CU2939',
      'MANN-W71295',
      'MANN-CUK2939',
      'MANN-C27009',
      null,
      'FILTRON-K1111',
      'FILTRON-OP6163',
      'FILTRON-K1111A',
    ],
  },
  {
    file: '651e251f-Screenshot_20260819_at_08.52.30.png',
    engine: 'A3 (8P) · 1.4 TFSI 85kw 116hp (devam)',
    skus: ['FILTRON-AP0621', null],
  },
  {
    file: '9fdb9593-Screenshot_20260819_at_08.53.31.png',
    engine: 'A6 (4G) · 2.0 TDI 100kw 136hp',
    skus: ['MANN-HU7008Z', 'MANN-HU7020Z', null, null, null, null, null, null],
  },
  {
    file: '52ad5241-Screenshot_20260819_at_08.53.38.png',
    engine: 'A6 (4G) · 2.0 TDI 100kw 136hp (devam)',
    skus: [null, null, null, null, 'FILTRON-OE688', 'FILTRON-OE6883', 'FILTRON-AR3716', null],
  },
  {
    file: '3396a3ec-Screenshot_20260819_at_08.53.44.png',
    engine: 'A6 (4G) · 2.0 TDI 100kw 136hp (devam 2)',
    skus: ['FILTRON-PP991', 'FILTRON-PP9913', 'FILTRON-K1318A', null, null, null, null, null],
  },
  {
    file: '0dbb6828-Screenshot_20260819_at_08.53.58.png',
    engine: 'A6 (4G) · 2.0 TDI 140kw 190hp',
    skus: ['MANN-HU7020Z', null, null, null, null, null, null, null],
  },
  {
    file: '99af79aa-Screenshot_20260819_at_08.54.05.png',
    engine: 'A6 (4G) · 2.0 TDI 140kw 190hp (devam)',
    skus: [null, null, null, null, 'FILTRON-OE6883', null, 'FILTRON-AR3716', null],
  },
  {
    file: '68cb62c0-Screenshot_20260819_at_08.54.10.png',
    engine: 'A6 (4G) · 2.0 TDI 140kw 190hp (devam 2)',
    skus: ['FILTRON-PP991', 'FILTRON-PP9913', 'FILTRON-K1318A', null, null, null, null, null],
  },
  {
    file: 'f2ccb144-Screenshot_20260819_at_10.14.25.png',
    engine: 'A6 (4G) · 3.0 TDI 180kw 245hp (FILTRON)',
    skus: [
      'FILTRON-PP991',
      'FILTRON-AR3717',
      'FILTRON-PP9913',
      'FILTRON-K1318A',
      null,
      null,
      null,
      null,
    ],
  },
  {
    file: '7e1ec028-Screenshot_20260819_at_10.26.17.png',
    engine: 'A4 (8W) · 2.0 TDI 110kw 150hp',
    skus: [
      'MANN-HU7020Z',
      'MANN-CU31003',
      'MANN-WK6003',
      'MANN-C17011',
      'MANN-CUK31003',
      null,
      'FILTRON-OE6883',
      'FILTRON-PP991',
    ],
  },
  {
    file: 'd67d5f4a-Screenshot_20260819_at_10.41.24.png',
    engine: 'A4 (8W) · 1.4 TFSI 110kw 150hp',
    skus: [
      'MANN-W71295',
      'MANN-CU31003',
      'MANN-C17013',
      'MANN-CUK31003',
      null,
      'FILTRON-OP6163',
      null,
      null,
    ],
  },
  {
    file: '76c901af-Screenshot_20260819_at_10.41.59.png',
    engine: 'A4 (8W) · 2.0 TFSI 140kw 190hp',
    skus: ['MANN-CU31003', 'MANN-C170121', 'MANN-CUK31003', null, null, null, null],
  },
  {
    file: '1f45a663-Screenshot_20260819_at_11.22.39.png',
    engine: 'Q3 (8U) · 2.0 TDI 103kw 140hp (devam)',
    skus: [null, null, 'MANN-PU80081', null, 'MANN-PU8015', 'FILTRON-OE688', null, 'FILTRON-K1111'],
  },
  {
    file: '32c7b9f0-Screenshot_20260819_at_11.22.50.png',
    engine: 'Q3 (8U) · 2.0 TDI 103kw 140hp (devam 3)',
    skus: ['FILTRON-K1111A', 'FILTRON-PE9737', null, null, null, null, null, null],
  },
  {
    file: '958715b7-Screenshot_20260819_at_11.49.28.png',
    engine: 'A1 (8X) · 1.6 TDI 77kw 105hp',
    skus: [
      'MANN-HU7008Z',
      'MANN-CU26010',
      'MANN-C15008',
      'MANN-CUK26010',
      'MANN-WK8032',
      null,
      'MANN-WK8232',
      'MANN-WK80291',
    ],
  },
  {
    file: '19554396-Screenshot_20260819_at_11.49.34.png',
    engine: 'A1 (8X) · 1.6 TDI 77kw 105hp (devam)',
    skus: [
      'FILTRON-OE688',
      'FILTRON-K1313',
      'FILTRON-AK3702',
      'FILTRON-K1313A',
      'FILTRON-PP986',
      'FILTRON-PP9864',
    ],
  },
  {
    file: '006644a8-Screenshot_20260819_at_11.49.42.png',
    engine: 'A1 (8X) · 1.6 TDI 66kw 90hp',
    skus: [
      'MANN-HU7008Z',
      'MANN-CU26010',
      'MANN-C15008',
      'MANN-CUK26010',
      'MANN-WK8032',
      null,
      'MANN-WK80291',
      'FILTRON-OE688',
    ],
  },
  {
    file: 'afcb26b5-Screenshot_20260819_at_11.49.48.png',
    engine: 'A1 (8X) · 1.6 TDI 66kw 90hp (devam)',
    skus: [
      'FILTRON-K1313',
      'FILTRON-AK3702',
      'FILTRON-K1313A',
      'FILTRON-PP9864',
      null,
      null,
      null,
      null,
    ],
  },
  {
    file: '584d53fd-Screenshot_20260819_at_11.49.59.png',
    engine: 'A1 (8X) · 1.6 TDI 85kw 116hp',
    skus: [
      'MANN-HU7020Z',
      'MANN-CU26010',
      'MANN-C29029',
      'MANN-CUK26010',
      null,
      'MANN-WK80291',
      'FILTRON-OE6883',
      'FILTRON-K1313',
    ],
  },
  {
    file: 'd5c06386-Screenshot_20260819_at_11.50.04.png',
    engine: 'A1 (8X) · 1.6 TDI 85kw 116hp (devam)',
    skus: ['FILTRON-K1313A', 'FILTRON-PP9864', null, null, null, null, null, null],
  },
  {
    file: '22a71273-Screenshot_20260819_at_11.50.13.png',
    engine: 'A1 (8X) · 1.2 TFSI 63kw 85hp',
    skus: [
      'MANN-W71294',
      'MANN-CU26010',
      'MANN-C15008',
      'MANN-CUK26010',
      'MANN-WK69',
      null,
      'FILTRON-AK3702',
      'FILTRON-K1313A',
    ],
  },
  {
    file: '0ae96109-Screenshot_20260819_at_11.50.17.png',
    engine: 'A1 (8X) · 1.2 TFSI 63kw 85hp (devam)',
    skus: ['FILTRON-OP6412', 'FILTRON-PP8362', null, null],
  },
  {
    file: '547de989-Screenshot_20260819_at_11.50.24.png',
    engine: 'A1 (8X) · 1.4 TDI 66kw 90hp',
    skus: [
      'MANN-W7062',
      'MANN-CU26010',
      'MANN-C35011',
      'MANN-CUK26010',
      null,
      'MANN-WK80291',
      'FILTRON-K1313',
      'FILTRON-K1313A',
    ],
  },
  {
    file: '30941a97-Screenshot_20260819_at_11.50.29.png',
    engine: 'A1 (8X) · 1.4 TDI 66kw 90hp (devam)',
    skus: ['FILTRON-PP9864', null, null, null],
  },
  {
    file: '42455d71-Screenshot_20260819_at_11.50.37.png',
    engine: 'A1 (8X) · 1.4 TFSI 103kw 140hp',
    skus: [
      'MANN-W71295',
      'MANN-CU26010',
      'MANN-C27009',
      'MANN-CUK26010',
      'MANN-WK69',
      null,
      'FILTRON-OP6163',
      'FILTRON-AP0621',
    ],
  },
  {
    file: '6d780169-Screenshot_20260819_at_11.50.41.png',
    engine: 'A1 (8X) · 1.4 TFSI 103kw 140hp (devam)',
    skus: ['FILTRON-K1313A', 'FILTRON-PP8362', null, null],
  },
  {
    file: 'cfa356c9-Screenshot_20260819_at_11.53.12.png',
    engine: 'Q7 (4L) · 3.0 TDI V6 quattro 176kw 240hp',
    skus: [
      'MANN-CU2842',
      'MANN-HU8005Z',
      'MANN-HU8001X',
      null,
      'MANN-HU831X',
      'MANN-C39219',
      'MANN-C39002',
      'MANN-CUK2842',
    ],
  },
  {
    file: 'd47e3837-Screenshot_20260819_at_11.53.17.png',
    engine: 'Q7 (4L) · 3.0 TDI V6 quattro 176kw 240hp (devam)',
    skus: [
      null,
      'MANN-WK6003',
      'MANN-PU1033X',
      'FILTRON-K1155',
      'FILTRON-OE6503',
      'FILTRON-AP0043',
      'FILTRON-OE6506',
      null,
    ],
  },
  {
    file: 'c120dc58-Screenshot_20260819_at_11.53.21.png',
    engine: 'Q7 (4L) · 3.0 TDI V6 quattro 176kw 240hp (devam 2)',
    skus: [
      'FILTRON-K1155A',
      'FILTRON-OE6507',
      'FILTRON-PP991',
      'FILTRON-PE9736',
      null,
      null,
      null,
      null,
    ],
  },
  {
    file: 'a91e1503-Screenshot_20260819_at_11.58.40.png',
    engine: 'Q7 (4L) · 3.6 FSI quattro 206kw 280hp',
    skus: [
      'MANN-CU2842',
      'MANN-C39219',
      'MANN-HU9326N',
      'MANN-C39002',
      'MANN-CUK2842',
      null,
      'FILTRON-K1155',
      'FILTRON-OE640',
    ],
  },
  {
    file: '04daed7c-Screenshot_20260819_at_12.08.39.png',
    engine: 'A7 (4GA/GF) · 3.0 TDI 150kw 204hp',
    skus: [
      'MANN-HU8005Z',
      'MANN-WK6003',
      'MANN-C16005',
      'MANN-WK6008',
      'MANN-WK6037',
      'MANN-CUK2641',
      null,
      'FILTRON-OE6507',
    ],
  },
  {
    file: 'eda57316-Screenshot_20260819_at_14.58.32.png',
    engine: 'TT (8J) · 2.0 TFSI 195kw 265hp',
    skus: [
      'MANN-CU2939',
      'MANN-CUK2939',
      'MANN-HU7196X',
      'MANN-C36188',
      'MANN-WK69',
      null,
      'FILTRON-K1111',
      'FILTRON-OE6713',
    ],
  },
  {
    file: 'd0619a43-Screenshot_20260819_at_14.58.36.png',
    engine: 'TT (8J) · 2.0 TFSI 195kw 265hp (devam)',
    skus: ['FILTRON-K1111A', 'FILTRON-AP0044', 'FILTRON-PP8362', null, null, null],
  },

  // ── A8 (4H) · TT III (FV) ────────────────────────────────────────────────
  // FP2641 / FP26009 kartlarında ürün değil "Alerji Önleyici Filtre" afişi var;
  // HU6013z ve K1311 kartlarında "ÜRÜN GÖRSELİ HAZIRLANIYOR" duruyor. İkisi de
  // ürün fotoğrafı değil — null geçildi, kategori çizimi korunuyor.
  {
    file: '777d7e46-Screenshot_20260819_at_15.24.02.png',
    engine: 'A8 (4H) · 3.0 TDI 150kw 204hp',
    skus: [
      'MANN-HU8005Z',
      'MANN-WK6003',
      'MANN-CUK2641',
      'MANN-C17023',
      null,
      'FILTRON-OE6507',
      'FILTRON-PP991',
      'FILTRON-K1318A',
    ],
  },
  {
    file: 'a5acd018-Screenshot_20260819_at_15.25.21.png',
    engine: 'A8 (4H) · 2.5 TFSI 150kw 204hp',
    skus: ['MANN-HU7029Z', 'MANN-CUK2641', 'MANN-C17023', null, 'FILTRON-OE6714', 'FILTRON-K1318A'],
  },
  {
    file: '0626b2f0-Screenshot_20260819_at_15.25.11.png',
    engine: 'A8 (4H) · 2.0 TFSI 185kw 252hp',
    skus: ['MANN-C15010', 'MANN-CUK2641', null, 'FILTRON-AR3716', 'FILTRON-K1318A', null],
  },
  {
    file: '873c3619-Screenshot_20260819_at_15.25.50.png',
    engine: 'TT III (FV) · 2.0 TDI 135kw 184hp',
    skus: [
      'MANN-HU7020Z',
      'MANN-CU26009',
      'MANN-CUK26009',
      'MANN-C30005',
      null,
      'MANN-PU8028',
      'FILTRON-OE6883',
      'FILTRON-K1311A',
    ],
  },
  {
    file: '7f0afd28-Screenshot_20260819_at_15.25.53.png',
    engine: 'TT III (FV) · 2.0 TDI 135kw 184hp (devam)',
    // Tek sıralık kısa ekran: kırpıcı her kartı görsel + yazı bandı olarak iki
    // parça buluyor. Üç kart = 3 SKU + 3 null.
    skus: ['FILTRON-AP1395', 'FILTRON-PE9739', null, null, null, null],
  },
  {
    file: '9904551b-Screenshot_20260819_at_15.26.25.png',
    engine: 'TT III (FV) · 2.0 TFSI 162kw 220hp',
    skus: [
      'MANN-CU26009',
      'MANN-CUK26009',
      'MANN-C30005',
      null,
      'FILTRON-K1311A',
      'FILTRON-AP1395',
      null,
      null,
    ],
  },

  // ── Q2 (GA) · A6 (4B/C5) · Q7 (4M) ───────────────────────────────────────
  {
    file: '69294dc9-Screenshot_20260819_at_15.28.24.png',
    engine: 'Q2 (GA) · 1.6 TDI, 30 TDI 85kw 116hp',
    skus: [
      'MANN-HU7020Z',
      'MANN-CU26009',
      'MANN-CUK26009',
      'MANN-C30005',
      null,
      'MANN-PU8028',
      'FILTRON-OE6883',
      'FILTRON-K1311A',
    ],
  },
  {
    file: '143f5b43-Screenshot_20260819_at_15.28.28.png',
    engine: 'Q2 (GA) · 1.6 TDI, 30 TDI (devam)',
    skus: ['FILTRON-AP1395', 'FILTRON-PE9739', null, null, null, null],
  },
  {
    file: '1f4f1d0b-Screenshot_20260819_at_15.28.49.png',
    engine: 'Q2 (GA) · 1.4 TFSI 110kw 150hp',
    skus: [
      'MANN-W71295',
      'MANN-CU26009',
      'MANN-CUK26009',
      'MANN-C27009',
      null,
      'FILTRON-OP6163',
      'FILTRON-K1311A',
      'FILTRON-AP0621',
    ],
  },
  {
    file: '90453828-Screenshot_20260819_at_15.29.26.png',
    engine: 'A6 (4B/C5) · 2.5 TDI V6 114kw 155hp',
    skus: [
      'MANN-CU3037',
      'MANN-CU3192',
      'MANN-HU842X',
      'MANN-C262061',
      'MANN-CUK3192',
      'MANN-CUK3037',
      'MANN-WK8231',
      'MANN-H2019KIT1',
    ],
  },
  {
    file: 'bf5de987-Screenshot_20260819_at_15.29.31.png',
    engine: 'A6 (4B/C5) · 2.5 TDI V6 114kw (devam)',
    skus: [
      'FILTRON-K1032',
      'FILTRON-K1078',
      'FILTRON-K1032A',
      'FILTRON-AP1791',
      'FILTRON-OE650',
      'FILTRON-K1078A',
    ],
  },
  {
    file: '292644ce-Screenshot_20260819_at_15.30.39.png',
    engine: 'Q7 (4M) · 3.0 TDI quattro 160kw 218hp',
    skus: ['MANN-HU7012Z', 'MANN-CUK31003', null, 'MANN-C38011', null, null],
  },
  {
    file: '3ef8b62a-Screenshot_20260819_at_15.30.50.png',
    engine: 'Q7 (4M) · 3.0 TDI quattro 183kw 249hp',
    skus: ['MANN-HU7012Z', 'MANN-CUK31003', null, 'MANN-PU10011Z', 'MANN-C38011', null],
  },

  // ── TT I (8N) · A3 (8L) ──────────────────────────────────────────────────
  {
    file: '3c00536f-Screenshot_20260819_at_15.51.53.png',
    engine: 'TT I (8N) · 1.8 20V Sport Turbo 177kw 240hp',
    skus: [
      'MANN-W71930',
      'MANN-C37153',
      'MANN-WK7301',
      'MANN-CUK2862',
      null,
      'FILTRON-OP5261',
      'FILTRON-AP1491',
      'FILTRON-K1047A',
    ],
  },
  // ── A8 (4E) · A6 (4A) · A4 (8D, B5) ──────────────────────────────────────
  {
    file: 'e030c0b5-Screenshot_20260819_at_16.13.03.png',
    engine: 'A8 (4E) · 3.0 V6 TDI 171kw 233hp',
    skus: [
      'MANN-HU8001X',
      'MANN-HU831X',
      'MANN-C16521',
      'MANN-CUK4136',
      'MANN-WK1136',
      'FILTRON-OE6503',
      'FILTRON-OE6506',
      'FILTRON-AR3711',
    ],
  },
  {
    file: 'beffe9a0-Screenshot_20260819_at_16.13.07.png',
    engine: 'A8 (4E) · 3.0 V6 TDI 171kw 233hp (devam)',
    skus: ['FILTRON-K1118A', 'FILTRON-PP9863', null, null],
  },
  {
    file: 'cc556533-Screenshot_20260819_at_16.13.16.png',
    engine: 'A8 (4E) · 3.0 V6 162kw 220hp',
    skus: [
      'MANN-WK7301',
      'MANN-W93021',
      'MANN-C1652',
      'MANN-CUK4136',
      'FILTRON-PP8361',
      'FILTRON-OP5265',
      'FILTRON-AR371',
      'FILTRON-K1118A',
    ],
  },
  {
    file: '7563a1f5-Screenshot_20260819_at_16.13.27.png',
    engine: 'A8 (4E) · 3.2 FSI 191kw 260hp',
    skus: [
      'MANN-HU7029Z',
      'MANN-WK7204',
      'MANN-C1652',
      'MANN-CUK4136',
      'FILTRON-OE6714',
      'FILTRON-AR371',
      'FILTRON-PP8366',
      'FILTRON-K1118A',
    ],
  },
  {
    // 4. kart "Alerji Önleyici Filtre" afişi, 5-6. kartlar "HAZIRLANIYOR".
    file: 'fd4e1cee-Screenshot_20260819_at_16.14.04.png',
    engine: 'A6 (4A) · 45 TDI 3.0 quattro 170kw 231hp',
    skus: ['MANN-HU7012Z', 'MANN-CU31003', 'MANN-CUK31003', null, null, null],
  },
  {
    file: 'b59c7693-Screenshot_20260819_at_16.15.01.png',
    engine: 'A4 (8D, B5) · 1.9 TDI 85kw 115hp',
    skus: [
      'MANN-HU7262X',
      'MANN-C26168',
      'MANN-CU3955',
      'MANN-CUK3955',
      'MANN-WK84211',
      'MANN-H2019KIT1',
      'FILTRON-OE6401',
      'FILTRON-K1004',
    ],
  },
  {
    file: '8aeb11d7-Screenshot_20260819_at_16.15.05.png',
    engine: 'A4 (8D, B5) · 1.9 TDI 85kw 115hp (devam)',
    skus: ['FILTRON-AP0631', 'FILTRON-K1004A', 'FILTRON-PP8502', null, null, null],
  },
  {
    file: '359d3ae9-Screenshot_20260819_at_16.15.20.png',
    engine: 'A4 (8D, B5) · 1.6 75kw 102hp',
    skus: [
      'MANN-W71930',
      'MANN-C26168',
      'MANN-CU3955',
      'MANN-WK8307',
      'MANN-CUK3955',
      'MANN-H2019KIT1',
      'FILTRON-OP5261',
      'FILTRON-K1004',
    ],
  },
  {
    file: '251a70ef-Screenshot_20260819_at_16.15.24.png',
    engine: 'A4 (8D, B5) · 1.6 75kw 102hp (devam)',
    skus: ['FILTRON-AP0631', 'FILTRON-K1004A', null, null],
  },
  {
    file: '59554454-Screenshot_20260819_at_15.52.42.png',
    engine: 'A3 (8L) · 1.6 75kw 102hp',
    skus: [
      'MANN-W71930',
      'MANN-C37153',
      'MANN-WK7301',
      'MANN-CUK2862',
      null,
      'MANN-H2019KIT',
      'FILTRON-OP5261',
      'FILTRON-AP1491',
    ],
  },
]

const PY = `
import sys, os, json
import numpy as np
from PIL import Image

MARK = 'ocm-placeholder'

def is_placeholder(path):
    """Dosya, yer tutucu ureticisinin cizdigi kategori gorseli mi?"""
    try:
        with Image.open(path) as im:
            return im.info.get(MARK) == '1'
    except Exception:
        return False

CANVAS, FILL = 600, 0.88

def card_columns(a, w):
    """Kartların YESIL dikey kenarligini bularak gercek sutun sinirlarini verir.

    Sabit pay (inset) yetmiyordu: kartlarin sol/sag kenarligi sutun icinde
    17-39 piksel arasinda degisen konumlarda duruyor. Kenarlik renkli oldugu
    icin beyaz-kirpma da silmiyor, gorselin iki yaninda yesil cizgi kaliyordu.
    Burada kenarlik dogrudan tespit edilip ICINDEN kirpiliyor; bulunamazsa
    4 esit sutuna dusulur."""
    g = (a[:, :, 1] > a[:, :, 0] + 12) & (a[:, :, 1] > a[:, :, 2] + 12)
    xs = [i for i, v in enumerate(g.mean(axis=0)) if v > 0.25]
    lines = []
    for x in xs:
        if not lines or x - lines[-1] > 3:
            lines.append(x)
    # Kenarlik cizgileri CIFT gelir (her kartin solu ve sagi). Kac kart varsa
    # o kadar cift bulunur: dolu satirda 4 kart = 8 cizgi, yarim satirda 2 kart
    # = 4 cizgi. Onceden yalnizca 8 cizgi kabul ediliyordu; 2-3 kartlik ekranlar
    # 4 esit sutuna dusuyor ve kartlar yanlis kirpiliyordu.
    if len(lines) >= 2 and len(lines) % 2 == 0:
        return [(lines[i] + 4, lines[i + 1] - 4) for i in range(0, len(lines), 2)]
    return [(int(c * w / 4) + 24, int((c + 1) * w / 4) - 24) for c in range(4)]

def bands(mask, min_len):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None: start = i
        elif not v and start is not None:
            if i - start >= min_len: out.append((start, i))
            start = None
    if start is not None and len(mask) - start >= min_len: out.append((start, len(mask)))
    return out

def trim(im):
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    nz = (a.max(axis=2) - a.min(axis=2) > 10) | (a.mean(axis=2) < 248)
    if not nz.any(): return None
    ys, xs = np.where(nz)
    return im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))

def square(im):
    w, h = im.size
    s = (CANVAS * FILL) / max(w, h)
    im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    canvas = Image.new('RGB', (CANVAS, CANVAS), 'white')
    canvas.paste(im, ((CANVAS - im.width) // 2, (CANVAS - im.height) // 2))
    return canvas

path, outdir, skus = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
im = Image.open(path).convert('RGB')
a = np.asarray(im).astype(np.int16)
nonwhite = (a.max(axis=2) - a.min(axis=2) > 12) | (a.mean(axis=2) < 244)
rows = bands(nonwhite.mean(axis=1) > 0.02, im.height // 10)
W = im.width
cols = card_columns(a, W)
crops = []
for (y0, y1) in rows:
    for (x0, x1) in cols:
        cell = im.crop((x0, max(0, y0 - 8), x1, min(im.height, y1 + 8)))
        t = trim(cell)
        if t is None or t.width < 60 or t.height < 60:
            continue
        crops.append(t)

if len(crops) != len(skus):
    print(json.dumps({'error': f'{len(crops)} kart bulundu ama {len(skus)} SKU verildi'}))
    sys.exit(2)

written = []
for t, sku in zip(crops, skus):
    if sku is None:          # bu karttan gorsel alinmayacak
        continue
    p = os.path.join(outdir, sku + '.png')
    # Gercek fotograf, kategori cizimini EZER; ama baska bir gercek fotografin
    # uzerine yazmaz. Isaret olmadan sadece "dosya var mi" bakmak, yer tutucuyu
    # kalici hale getiriyordu.
    if os.path.exists(p) and not is_placeholder(p):
        continue
    square(t).save(p, optimize=True)
    written.append(sku)
print(json.dumps({'written': written, 'cards': len(crops)}))
`

function main(): void {
  mkdirSync(OUT, { recursive: true })
  const all: string[] = []
  for (const shot of SHOTS) {
    const out = execFileSync(
      'python3',
      ['-c', PY, `${UPLOADS}/${shot.file}`, OUT, JSON.stringify(shot.skus)],
      { encoding: 'utf8' },
    )
    const r = JSON.parse(out.trim()) as { written?: string[]; cards?: number; error?: string }
    if (r.error) throw new Error(`${shot.file}: ${r.error}`)
    console.log(
      `${shot.engine.padEnd(36)} ${r.cards} kart · +${r.written?.length ?? 0} yeni görsel`,
    )
    all.push(...(r.written ?? []))
  }
  console.log(`\n✓ ${all.length} görsel → ${OUT}`)
}

main()
