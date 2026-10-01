/**
 * PayTR imzaları, tutar hesabı ve sipariş/ödeme durum makinesi.
 *
 * İmza testlerindeki beklenen değerler BU KODLA DEĞİL, Python `hmac` modülüyle
 * bağımsız olarak üretildi. Kendi fonksiyonumuzun çıktısını beklenen değer
 * olarak kullanmak, hatalı bir algoritmayı da "doğru" diye onaylardı.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { sql, type Kysely } from 'kysely'
import type { Database } from '../src/types'
import {
  bildirimHashGecerli,
  bildirimHashUret,
  brutKurus,
  istemciIp,
  kurusToPaytrFiyat,
  paytrTokenUret,
  sepetKodla,
  siparisNoUret,
} from '../src/odeme/paytr'
import {
  paytrBildirimiIsle,
  sepetiFiyatla,
  sepetiNormallestir,
  siparisDurumGuncelle,
  siparisListesi,
  siparisNotuEkle,
  siparisOlustur,
  siparisSorgula,
  type SiparisGirdisi,
} from '../src/siparis'
import { createTestDb, setupTestDatabase, truncateAll } from './helpers'

const AYAR = {
  merchantId: '123456',
  merchantKey: 'TESTANAHTAR123',
  merchantSalt: 'TESTTUZ456',
  testMode: true,
}

// ════════════════════════════ SAF FONKSİYONLAR ═════════════════════════════

describe('PayTR imzaları (Python hmac ile bağımsız üretilmiş değerler)', () => {
  const sepet = sepetKodla([['MANN-FILTER C 30 005 Hava Filtresi', '160.54', 1]])

  it('user_basket base64 kodlaması', () => {
    expect(sepet).toBe('W1siTUFOTi1GSUxURVIgQyAzMCAwMDUgSGF2YSBGaWx0cmVzaSIsIjE2MC41NCIsMV1d')
  })

  it('paytr_token', () => {
    const token = paytrTokenUret(AYAR, {
      userIp: '85.105.12.34',
      merchantOid: 'OCM2610017K3P9Q',
      email: 'musteri@example.com',
      paymentAmount: 16054,
      userBasket: sepet,
      noInstallment: 0,
      maxInstallment: 0,
      currency: 'TL',
    })
    expect(token).toBe('BcHu+/xcxDk7kypGI2n4xu/rTvwRgu1xl11OymBiU84=')
  })

  it('bildirim hash üretimi', () => {
    expect(bildirimHashUret(AYAR, 'OCM2610017K3P9Q', 'success', '16054')).toBe(
      'TJhniJf+Sbik58BZgmczdxR/CmkG2eX/TkQ8pK7Mmv4=',
    )
  })

  it('bildirim hash doğrulaması: doğruyu kabul, kurcalanmışı reddeder', () => {
    const temel = {
      merchant_oid: 'OCM2610017K3P9Q',
      status: 'success',
      total_amount: '16054',
      hash: 'TJhniJf+Sbik58BZgmczdxR/CmkG2eX/TkQ8pK7Mmv4=',
    }
    expect(bildirimHashGecerli(AYAR, temel)).toBe(true)
    // Tutar değiştirilmiş
    expect(bildirimHashGecerli(AYAR, { ...temel, total_amount: '1' })).toBe(false)
    // Durum değiştirilmiş
    expect(bildirimHashGecerli(AYAR, { ...temel, status: 'failed' })).toBe(false)
    // Başka siparişin imzası
    expect(bildirimHashGecerli(AYAR, { ...temel, merchant_oid: 'OCM2610017K3P9R' })).toBe(false)
    // Farklı uzunlukta / boş hash — istisna fırlatmadan false
    expect(bildirimHashGecerli(AYAR, { ...temel, hash: 'kisa' })).toBe(false)
    expect(bildirimHashGecerli(AYAR, { ...temel, hash: '' })).toBe(false)
    // Yanlış anahtar
    expect(bildirimHashGecerli({ ...AYAR, merchantSalt: 'baska' }, temel)).toBe(false)
  })
})

describe('Tutarlar', () => {
  it('kuruş → PayTR fiyat biçimi', () => {
    expect(kurusToPaytrFiyat(16054)).toBe('160.54')
    expect(kurusToPaytrFiyat(100)).toBe('1.00')
    expect(kurusToPaytrFiyat(5)).toBe('0.05')
    expect(kurusToPaytrFiyat(759632)).toBe('7596.32')
    expect(() => kurusToPaytrFiyat(1.5)).toThrow()
    expect(() => kurusToPaytrFiyat(-1)).toThrow()
  })

  it('brüt kuruş, KESİN aritmetikle hesaplanan değere 0,01 ₺ – 10.000 ₺ arasındaki HER net fiyatta eşit', () => {
    // net kuruş n için kesin brüt = n × 1,20 = n × 12 / 10. n×12 hep çift olduğu
    // için yarım kuruş eşitliği oluşmaz; kesin değer floor((n×12 + 5) / 10).
    // Kayan nokta hesabı (sitenin kullandığı yol) bunu bir milyon değerin hiçbirinde
    // şaşırmamalı — şaşırırsa sitede gösterilen fiyatla tahsil edilen ayrışır.
    let hatali = 0
    for (let n = 1; n <= 1_000_000; n++) {
      const kesin = Math.floor((n * 12 + 5) / 10)
      if (brutKurus(n / 100, 20) !== kesin) hatali++
    }
    expect(hatali).toBe(0)
  })

  it('brüt kuruş, sitenin gösterdiği fiyatla (grossPrice) aynı', () => {
    // apps/web/src/lib/utils.ts → grossPrice
    const grossPrice = (net: number, t: number) => Math.round(net * (1 + t / 100) * 100) / 100
    for (const net of [133.78, 7596.32, 0.01, 99.99, 416.67, 1000]) {
      expect(brutKurus(net, 20)).toBe(Math.round(grossPrice(net, 20) * 100))
    }
  })
})

describe('Sipariş numarası ve IP', () => {
  it('yalnızca harf-rakam, OCM + YYMMDD + 6 karakter, İstanbul tarihine göre', () => {
    // 30 Eylül 2026 22:30 UTC = 1 Ekim 01:30 İstanbul
    const no = siparisNoUret(new Date('2026-09-30T22:30:00Z'))
    expect(no).toMatch(/^OCM261001[0-9A-HJKMNP-TV-Z]{6}$/)
    expect(no.length).toBeLessThanOrEqual(64)
  })

  it('aynı anda üretilen numaralar farklı', () => {
    const set = new Set(Array.from({ length: 2000 }, () => siparisNoUret()))
    expect(set.size).toBe(2000)
  })

  it('istemci IP: x-forwarded-for ilk değeri', () => {
    const h = (o: Record<string, string>) => ({ get: (k: string) => o[k] ?? null })
    expect(istemciIp(h({ 'x-forwarded-for': '85.105.12.34, 10.0.0.1' }))).toBe('85.105.12.34')
    expect(istemciIp(h({ 'x-real-ip': '1.2.3.4' }))).toBe('1.2.3.4')
    expect(istemciIp(h({}))).toBeNull()
  })
})

describe('Sepet normalleştirme', () => {
  it('aynı varyantı birleştirir, adedi sınırlar, geçersizleri atar', () => {
    expect(
      sepetiNormallestir([
        { variantId: 1, adet: 2 },
        { variantId: 1, adet: 3 },
        { variantId: 2, adet: 500 },
        { variantId: -1, adet: 1 },
        { variantId: 3, adet: 0 },
        { variantId: 4, adet: 1.5 },
        { variantId: Number.NaN, adet: 1 },
      ]),
    ).toEqual([
      { variantId: 1, adet: 5 },
      { variantId: 2, adet: 99 },
    ])
  })
})

// ════════════════════════════ VERİTABANI ═══════════════════════════════════

let db: Kysely<Database>
type Urun = { variantId: number; productId: number }

async function urunEkle(
  kod: string,
  net: number,
  stok: number,
  durum: 'ACTIVE' | 'DRAFT' = 'ACTIVE',
): Promise<Urun> {
  const marka =
    (await db.selectFrom('product_brand').select('id').where('slug', '=', 'mann').executeTakeFirst()) ??
    (await db
      .insertInto('product_brand')
      .values({ name: 'MANN-FILTER', slug: 'mann' })
      .returning('id')
      .executeTakeFirstOrThrow())
  const kategori =
    (await db.selectFrom('category').select('id').where('code', '=', 'HAVA').executeTakeFirst()) ??
    (await db
      .insertInto('category')
      .values({ code: 'HAVA', name: 'Hava Filtresi', slug: 'hava', path: 'hava' })
      .returning('id')
      .executeTakeFirstOrThrow())
  const urun = await db
    .insertInto('product')
    .values({
      sku: `SKU-${kod}`,
      slug: `urun-${kod.toLowerCase()}`,
      name: 'Hava Filtresi',
      product_code: kod,
      brand_id: marka.id,
      category_id: kategori.id,
      status: durum,
    })
    .returning('id')
    .executeTakeFirstOrThrow()
  const varyant = await db
    .insertInto('product_variant')
    .values({ product_id: urun.id, sku: `SKU-${kod}` })
    .returning('id')
    .executeTakeFirstOrThrow()
  await db.insertInto('price').values({ variant_id: varyant.id, price_net: net }).execute()
  await db.insertInto('stock').values({ variant_id: varyant.id, quantity: stok }).execute()
  return { variantId: varyant.id, productId: urun.id }
}

function girdi(kalemler: SiparisGirdisi['kalemler']): SiparisGirdisi {
  return {
    kalemler,
    musteri: { adSoyad: 'Ayşe Yılmaz', email: 'Ayse@Example.com', telefon: '05001112233' },
    teslimat: { il: 'İstanbul', ilce: 'Ataşehir', adres: 'Örnek Mah. 1. Sk. No:2' },
    fatura: { tur: 'BIREYSEL' },
    ip: '85.105.12.34',
    sozlesmeSurumu: '2026-10-01',
    testModu: false,
  }
}

/** PayTR'ın göndereceği bildirimin aynısı — doğru imzayla. */
function bildirim(oid: string, status: 'success' | 'failed', total: number, ek: Record<string, string> = {}) {
  return {
    merchant_oid: oid,
    status,
    total_amount: String(total),
    hash: bildirimHashUret(AYAR, oid, status, String(total)),
    payment_amount: String(total),
    currency: 'TL',
    test_mode: '0',
    payment_type: 'card',
    ...ek,
  }
}

async function stok(variantId: number) {
  const r = await db
    .selectFrom('stock')
    .select('quantity')
    .where('variant_id', '=', variantId)
    .executeTakeFirstOrThrow()
  return r.quantity
}
async function siparis(oid: string) {
  return db.selectFrom('customer_order').selectAll().where('order_no', '=', oid).executeTakeFirstOrThrow()
}

describe('Sipariş ve ödeme (gerçek PostgreSQL)', () => {
  beforeAll(async () => {
    await setupTestDatabase()
    db = createTestDb()
  })
  afterAll(async () => {
    await db?.destroy()
  })
  beforeEach(async () => {
    await truncateAll(db)
  })

  it('sepet veritabanından fiyatlanır; ürün adı, KDV dahil kuruş ve kargo ödeyeni doğru', async () => {
    const a = await urunEkle('C30005', 133.78, 10) // 160,54 ₺
    const s = await sepetiFiyatla(db, [{ variantId: a.variantId, adet: 2 }])
    expect(s.sorunlar).toEqual([])
    expect(s.satirlar[0]).toMatchObject({
      baslik: 'MANN-FILTER C30005 Hava Filtresi',
      birimKurus: 16054,
      satirKurus: 32108,
      adet: 2,
    })
    expect(s.araToplamKurus).toBe(32108)
    expect(s.kargoOdeyen).toBe('ALICI') // 321,08 ₺ < 500 ₺
  })

  it('500 ₺ ve üzeri sepette kargoyu satıcı öder (eşik dahil)', async () => {
    // 416,67 × 1,20 = 500,004 → 500,00 ₺ = tam eşik
    const a = await urunEkle('ESIK', 416.67, 5)
    const s = await sepetiFiyatla(db, [{ variantId: a.variantId, adet: 1 }])
    expect(s.araToplamKurus).toBe(50_000)
    expect(s.kargoOdeyen).toBe('SATICI')
  })

  it('stok yetersiz, satışta olmayan ve bilinmeyen ürün sorun olarak döner; sipariş yazılmaz', async () => {
    const az = await urunEkle('AZ', 100, 1)
    const taslak = await urunEkle('TASLAK', 100, 5, 'DRAFT')
    const sonuc = await siparisOlustur(
      db,
      girdi([
        { variantId: az.variantId, adet: 3 },
        { variantId: taslak.variantId, adet: 1 },
        { variantId: 999999, adet: 1 },
      ]),
    )
    expect(sonuc.ok).toBe(false)
    if (sonuc.ok) return
    expect(sonuc.sorunlar.map((x) => x.sebep).sort()).toEqual(['BULUNAMADI', 'SATISTA_DEGIL', 'STOK_YETERSIZ'])
    expect(sonuc.sorunlar.find((x) => x.sebep === 'STOK_YETERSIZ')).toMatchObject({ mevcutStok: 1 })
    const say = await db.selectFrom('customer_order').select(sql<number>`count(*)::int`.as('n')).executeTakeFirstOrThrow()
    expect(say.n).toBe(0)
  })

  it('boş sepet sipariş oluşturmaz', async () => {
    const sonuc = await siparisOlustur(db, girdi([]))
    expect(sonuc).toEqual({ ok: false, sorunlar: [], bos: true })
  })

  it('sipariş yazılır: tutarlar, satır anlık görüntüsü ve PayTR sepeti tutarlı; stok henüz düşmez', async () => {
    const a = await urunEkle('A1', 133.78, 10)
    const b = await urunEkle('B2', 50, 4) // 60,00 ₺
    const sonuc = await siparisOlustur(
      db,
      girdi([
        { variantId: a.variantId, adet: 2 },
        { variantId: b.variantId, adet: 1 },
      ]),
    )
    expect(sonuc.ok).toBe(true)
    if (!sonuc.ok) return
    const s = sonuc.siparis
    expect(s.totalKurus).toBe(32108 + 6000)
    expect(s.paytrSepeti).toEqual([
      ['MANN-FILTER A1 Hava Filtresi', '160.54', 2],
      ['MANN-FILTER B2 Hava Filtresi', '60.00', 1],
    ])
    // PayTR sepetinin toplamı, PayTR'a gönderilecek tutarla birebir aynı olmalı.
    const sepetToplam = s.paytrSepeti.reduce((t, [, f, n]) => t + Math.round(Number(f) * 100) * n, 0)
    expect(sepetToplam).toBe(s.totalKurus)

    const kayit = await siparis(s.orderNo)
    expect(kayit).toMatchObject({
      status: 'PENDING_PAYMENT',
      subtotal_kurus: 38108,
      total_kurus: 38108,
      shipping_kurus: 0,
      shipping_payer: 'ALICI',
      invoice_type: 'BIREYSEL',
    })
    expect(await stok(a.variantId)).toBe(10)
  })

  it('kurumsal fatura bilgisi kaydedilir', async () => {
    const a = await urunEkle('K1', 500, 3)
    const g = girdi([{ variantId: a.variantId, adet: 1 }])
    g.fatura = { tur: 'KURUMSAL', unvan: 'Örnek Ltd. Şti.', vergiDairesi: 'Kadıköy', vergiNo: '1234567890' }
    const sonuc = await siparisOlustur(db, g)
    if (!sonuc.ok) throw new Error('sipariş oluşmadı')
    expect(await siparis(sonuc.siparis.orderNo)).toMatchObject({
      invoice_type: 'KURUMSAL',
      invoice_name: 'Örnek Ltd. Şti.',
      invoice_tax_no: '1234567890',
    })
  })

  describe('PayTR bildirimi', () => {
    async function yeniSiparis(adet = 2, stokAdet = 10) {
      const u = await urunEkle(`P${Math.random().toString(36).slice(2, 7).toUpperCase()}`, 133.78, stokAdet)
      const s = await siparisOlustur(db, girdi([{ variantId: u.variantId, adet }]))
      if (!s.ok) throw new Error('sipariş oluşmadı')
      return { ...s.siparis, variantId: u.variantId }
    }

    it('başarılı ödeme → PAID, stok düşer, OK döner, bildirim loglanır', async () => {
      const s = await yeniSiparis(2, 10)
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'success', s.totalKurus))
      expect(r).toEqual({ yanit: 'OK', httpStatus: 200, sonuc: 'PAID' })
      expect(await siparis(s.orderNo)).toMatchObject({
        status: 'PAID',
        paid_total_kurus: s.totalKurus,
        payment_type: 'card',
        test_mode: false,
        stock_shortage: false,
      })
      expect(await stok(s.variantId)).toBe(8)
      const log = await db.selectFrom('payment_notification').selectAll().execute()
      expect(log).toHaveLength(1)
      expect(log[0]).toMatchObject({ outcome: 'PAID', hash_valid: true, order_no: s.orderNo })
    })

    it('AYNI bildirim tekrar gelirse stok İKİNCİ KEZ düşmez', async () => {
      const s = await yeniSiparis(2, 10)
      const b = bildirim(s.orderNo, 'success', s.totalKurus)
      await paytrBildirimiIsle(db, AYAR, b)
      const r2 = await paytrBildirimiIsle(db, AYAR, b)
      const r3 = await paytrBildirimiIsle(db, AYAR, b)
      expect(r2).toMatchObject({ yanit: 'OK', sonuc: 'DUPLICATE' })
      expect(r3).toMatchObject({ yanit: 'OK', sonuc: 'DUPLICATE' })
      expect(await stok(s.variantId)).toBe(8)
    })

    it('aynı bildirim EŞZAMANLI gelse de stok bir kez düşer (satır kilidi)', async () => {
      const s = await yeniSiparis(3, 10)
      const b = bildirim(s.orderNo, 'success', s.totalKurus)
      const sonuclar = await Promise.all(Array.from({ length: 6 }, () => paytrBildirimiIsle(db, AYAR, b)))
      expect(sonuclar.filter((x) => x.sonuc === 'PAID')).toHaveLength(1)
      expect(sonuclar.filter((x) => x.sonuc === 'DUPLICATE')).toHaveLength(5)
      expect(await stok(s.variantId)).toBe(7)
    })

    it('sahte imza reddedilir, sipariş değişmez, OK DÖNMEZ (PayTR tekrar dener)', async () => {
      const s = await yeniSiparis()
      const sahte = { ...bildirim(s.orderNo, 'success', s.totalKurus), hash: bildirimHashUret({ merchantKey: 'yanlis', merchantSalt: 'yanlis' }, s.orderNo, 'success', String(s.totalKurus)) }
      const r = await paytrBildirimiIsle(db, AYAR, sahte)
      expect(r).toMatchObject({ httpStatus: 400, sonuc: 'BAD_HASH' })
      expect(r.yanit).not.toBe('OK')
      expect((await siparis(s.orderNo)).status).toBe('PENDING_PAYMENT')
      expect(await stok(s.variantId)).toBe(10)
      const log = await db.selectFrom('payment_notification').selectAll().executeTakeFirstOrThrow()
      expect(log).toMatchObject({ outcome: 'BAD_HASH', hash_valid: false })
    })

    it('imzası geçerli ama tutarı düşük bildirim ödendi sayılmaz', async () => {
      const s = await yeniSiparis()
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'success', s.totalKurus - 1))
      expect(r).toMatchObject({ yanit: 'OK', sonuc: 'AMOUNT_MISMATCH' })
      const k = await siparis(s.orderNo)
      expect(k.status).toBe('PENDING_PAYMENT')
      expect(k.admin_note).toContain('tutar uyuşmazlığı')
      expect(await stok(s.variantId)).toBe(10)
    })

    it('payment_amount sipariş tutarından farklıysa ödendi sayılmaz', async () => {
      const s = await yeniSiparis()
      const r = await paytrBildirimiIsle(
        db,
        AYAR,
        bildirim(s.orderNo, 'success', s.totalKurus, { payment_amount: '100' }),
      )
      expect(r.sonuc).toBe('AMOUNT_MISMATCH')
    })

    it('taksitte vade farkı müşteriye yansır: çekilen tutar büyük olabilir, ikisi ayrı saklanır', async () => {
      const s = await yeniSiparis()
      const vadeli = s.totalKurus + 2500
      const r = await paytrBildirimiIsle(
        db,
        AYAR,
        bildirim(s.orderNo, 'success', vadeli, {
          payment_amount: String(s.totalKurus),
          installment_count: '6',
        }),
      )
      expect(r.sonuc).toBe('PAID')
      expect(await siparis(s.orderNo)).toMatchObject({
        total_kurus: s.totalKurus,
        paid_total_kurus: vadeli,
        installment_count: 6,
      })
    })

    it('başarısız ödeme → PAYMENT_FAILED, sebep kaydedilir, stok düşmez', async () => {
      const s = await yeniSiparis()
      const r = await paytrBildirimiIsle(
        db,
        AYAR,
        bildirim(s.orderNo, 'failed', s.totalKurus, {
          failed_reason_code: '2',
          failed_reason_msg: 'Kart limiti yetersiz',
        }),
      )
      expect(r).toMatchObject({ yanit: 'OK', sonuc: 'FAILED' })
      expect(await siparis(s.orderNo)).toMatchObject({
        status: 'PAYMENT_FAILED',
        failed_reason_code: '2',
        failed_reason_msg: 'Kart limiti yetersiz',
      })
      expect(await stok(s.variantId)).toBe(10)
    })

    it('başarısızdan SONRA gelen geçerli başarı bildirimi göz ardı edilmez (para çekilmiştir)', async () => {
      const s = await yeniSiparis()
      await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'failed', s.totalKurus))
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'success', s.totalKurus))
      expect(r.sonuc).toBe('PAID_AFTER_FAIL')
      const k = await siparis(s.orderNo)
      expect(k.status).toBe('PAID')
      expect(k.admin_note).toContain('PAYMENT_FAILED')
      expect(await stok(s.variantId)).toBe(8)
    })

    it('ödenmiş siparişe sonradan gelen başarısız bildirim durumu bozmaz', async () => {
      const s = await yeniSiparis()
      await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'success', s.totalKurus))
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'failed', s.totalKurus))
      expect(r.sonuc).toBe('DUPLICATE')
      expect((await siparis(s.orderNo)).status).toBe('PAID')
    })

    it('stok ödeme anında yetmiyorsa sipariş yine ödenir ama işaretlenir', async () => {
      const s = await yeniSiparis(2, 2)
      // Sipariş verildikten sonra stok başka yoldan azaldı
      await db.updateTable('stock').set({ quantity: 1 }).where('variant_id', '=', s.variantId).execute()
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'success', s.totalKurus))
      expect(r.sonuc).toBe('PAID')
      expect(await siparis(s.orderNo)).toMatchObject({ status: 'PAID', stock_shortage: true })
    })

    it('TEST modunda açılan sipariş: stok düşmez, kargo kuyruğuna girmez, dikkat listesine düşer', async () => {
      const u = await urunEkle('TST1', 100, 10)
      const g = girdi([{ variantId: u.variantId, adet: 2 }])
      g.testModu = true
      const s = await siparisOlustur(db, g)
      if (!s.ok) throw new Error()
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.siparis.orderNo, 'success', s.siparis.totalKurus, { test_mode: '1' }))
      expect(r.sonuc).toBe('PAID')
      expect(await stok(u.variantId)).toBe(10)
      expect(await siparisListesi(db, { filtre: 'HAZIRLANACAK' })).toHaveLength(0)
      expect((await siparisListesi(db, { filtre: 'SORUNLU' })).map((x) => x.order_no)).toEqual([s.siparis.orderNo])
    })

    it('mod uyuşmazlığı: CANLI siparişe TEST bildirimi (ör. test kartı) ödendi sayılmaz', async () => {
      const s = await yeniSiparis()
      const r = await paytrBildirimiIsle(db, AYAR, bildirim(s.orderNo, 'success', s.totalKurus, { test_mode: '1' }))
      expect(r).toMatchObject({ yanit: 'OK', sonuc: 'MODE_MISMATCH' })
      const k = await siparis(s.orderNo)
      expect(k.status).toBe('PENDING_PAYMENT')
      expect(k.test_mode).toBe(false)
      expect(k.admin_note).toContain('mod uyuşmazlığı')
      expect(await stok(s.variantId)).toBe(10)
    })

    it('bildirim logu yalnızca bilinen PayTR alanlarını, kısaltarak saklar', async () => {
      await paytrBildirimiIsle(db, AYAR, {
        merchant_oid: 'X',
        status: 'success',
        total_amount: '1',
        hash: 'h'.repeat(5000),
        cop: 'z'.repeat(5000),
      })
      const log = await db.selectFrom('payment_notification').select('payload').executeTakeFirstOrThrow()
      const p = log.payload as Record<string, string>
      expect(p).not.toHaveProperty('cop')
      expect(p.hash!.length).toBe(300)
    })

    it('stok kontrolü ve düşümü aynı depodan (MERKEZ)', async () => {
      const u = await urunEkle('DEPO', 100, 0)
      // Yalnızca başka depoda stok var → MERKEZ'den satılamaz
      await db.insertInto('stock').values({ variant_id: u.variantId, warehouse_code: 'IZMIR', quantity: 50 }).execute()
      const s = await sepetiFiyatla(db, [{ variantId: u.variantId, adet: 1 }])
      expect(s.sorunlar[0]).toMatchObject({ sebep: 'STOK_YETERSIZ', mevcutStok: 0 })
    })

    it('bilinmeyen sipariş: loglanır, OK döner (tekrar denemenin faydası yok)', async () => {
      const r = await paytrBildirimiIsle(db, AYAR, bildirim('OCM000000AAAAAA', 'success', 100))
      expect(r).toMatchObject({ yanit: 'OK', sonuc: 'UNKNOWN_ORDER' })
    })

    it('eksik alanlı istek reddedilir', async () => {
      const r = await paytrBildirimiIsle(db, AYAR, { merchant_oid: 'X' })
      expect(r).toMatchObject({ httpStatus: 400, sonuc: 'MISSING_FIELDS' })
    })
  })

  describe('Yönetim paneli durum geçişleri', () => {
    async function odenmis() {
      const u = await urunEkle(`Y${Math.random().toString(36).slice(2, 7).toUpperCase()}`, 100, 10)
      const s = await siparisOlustur(db, girdi([{ variantId: u.variantId, adet: 1 }]))
      if (!s.ok) throw new Error('sipariş oluşmadı')
      await paytrBildirimiIsle(db, AYAR, bildirim(s.siparis.orderNo, 'success', s.siparis.totalKurus))
      return s.siparis.orderNo
    }

    it('PAID → SHIPPED kargo bilgisiyle; SHIPPED → DELIVERED; iz kaydı tutulur', async () => {
      const no = await odenmis()
      expect(await siparisDurumGuncelle(db, no, { yeni: 'SHIPPED', kargoFirmasi: '', takipNo: '' }, 'admin'))
        .toMatchObject({ ok: false })
      expect(await siparisDurumGuncelle(db, no, { yeni: 'SHIPPED', kargoFirmasi: 'Yurtiçi', takipNo: '123' }, 'admin'))
        .toEqual({ ok: true })
      expect(await siparisDurumGuncelle(db, no, { yeni: 'DELIVERED' }, 'admin')).toEqual({ ok: true })
      const k = await siparis(no)
      expect(k).toMatchObject({ status: 'DELIVERED', cargo_company: 'Yurtiçi', tracking_no: '123' })
      expect(k.admin_note).toContain('admin: PAID → SHIPPED')
      expect(k.admin_note).toContain('admin: SHIPPED → DELIVERED')
    })

    it('ödenmiş sipariş İPTAL edilemez (iade edilir); panelden ÖDENDİ yapılamaz', async () => {
      const no = await odenmis()
      expect((await siparisDurumGuncelle(db, no, { yeni: 'CANCELLED' }, 'admin')).ok).toBe(false)
      expect((await siparisDurumGuncelle(db, no, { yeni: 'REFUNDED' }, 'admin')).ok).toBe(true)

      const u = await urunEkle('BEK1', 100, 5)
      const s = await siparisOlustur(db, girdi([{ variantId: u.variantId, adet: 1 }]))
      if (!s.ok) throw new Error()
      // Bekleyen sipariş iptal edilebilir ama "ödendi"ye alınamaz
      expect(
        (await siparisDurumGuncelle(db, s.siparis.orderNo, { yeni: 'DELIVERED' }, 'admin')).ok,
      ).toBe(false)
      expect((await siparisDurumGuncelle(db, s.siparis.orderNo, { yeni: 'CANCELLED' }, 'admin')).ok).toBe(true)
    })

    it('liste filtreleri ve arama', async () => {
      const no = await odenmis()
      const u = await urunEkle('BEK2', 100, 5)
      await siparisOlustur(db, girdi([{ variantId: u.variantId, adet: 1 }]))
      expect((await siparisListesi(db, { filtre: 'HAZIRLANACAK' })).map((x) => x.order_no)).toEqual([no])
      expect(await siparisListesi(db, { filtre: 'ODEME_BEKLEYEN' })).toHaveLength(1)
      expect(await siparisListesi(db, { ara: 'ayşe' })).toHaveLength(2)
      expect(await siparisListesi(db, { ara: '%' })).toHaveLength(0) // joker karakter kaçışlı
      const tek = await siparisListesi(db, { ara: no })
      expect(tek[0]).toMatchObject({ order_no: no, adet: 1 })
    })

    it('not ekleme mevcut notu silmez', async () => {
      const no = await odenmis()
      await siparisNotuEkle(db, no, 'birinci')
      await siparisNotuEkle(db, no, 'ikinci')
      const k = await siparis(no)
      expect(k.admin_note).toContain('birinci')
      expect(k.admin_note).toContain('ikinci')
    })
  })

  it('sipariş sorgusu e-posta eşleşmeden hiçbir şey döndürmez; büyük/küçük harf ve boşluk önemsiz', async () => {
    const a = await urunEkle('Q1', 100, 5)
    const s = await siparisOlustur(db, girdi([{ variantId: a.variantId, adet: 1 }]))
    if (!s.ok) throw new Error('sipariş oluşmadı')
    const no = s.siparis.orderNo
    expect(await siparisSorgula(db, no, 'baska@example.com')).toBeNull()
    const bulunan = await siparisSorgula(db, ` ${no.toLowerCase()} `, ' ayse@EXAMPLE.com ')
    expect(bulunan?.order_no).toBe(no)
    expect(bulunan?.kalemler).toHaveLength(1)
    // İç kimlik dışarı sızmaz
    expect(bulunan).not.toHaveProperty('id')
  })
})
