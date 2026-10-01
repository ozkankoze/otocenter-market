/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SİPARİŞ ALANI — sepet fiyatlama, sipariş oluşturma, ödeme bildirimi
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Üç kural bu dosyanın varlık sebebi:
 *
 *  1. FİYAT HER ZAMAN VERİTABANINDAN. İstemci yalnızca "hangi varyanttan kaç
 *     adet" söyler. Tarayıcıdan gelen bir fiyat, toplam ya da indirim hiçbir
 *     yerde okunmaz.
 *
 *  2. SİPARİŞ YALNIZCA İMZALI BİLDİRİMLE "ÖDENDİ" OLUR. Tarayıcının başarı
 *     sayfasına dönmesi hiçbir şey kanıtlamaz; o adres elle de açılabilir.
 *
 *  3. BİLDİRİM TEKRAR EDEBİLİR. PayTR "OK" yanıtı alamazsa bir dakika sonra
 *     yeniden gönderir. Aynı bildirimin ikinci kez işlenmesi stoğu ikinci kez
 *     düşürmemeli. Sipariş satırı `FOR UPDATE` ile kilitlenir ve durum geçişi
 *     tek transaction içinde yapılır.
 * ════════════════════════════════════════════════════════════════════════════
 */
import { sql, type Kysely } from 'kysely'
import type { Database, InvoiceType, OrderStatus, ShippingPayer } from '../types'
import {
  bildirimHashGecerli,
  brutKurus,
  kurusToPaytrFiyat,
  siparisNoUret,
  type PaytrAyarlari,
  type PaytrSepetSatiri,
} from '../odeme/paytr'

/** 500 ₺ ve üzeri: kargo bedelini SATICI öder; altı: ALICI, teslimatta kargoya. */
export const UCRETSIZ_KARGO_ESIGI_KURUS = 50_000

/** Tek satırda en fazla adet; tek siparişte en fazla satır. Kötüye kullanım sınırı. */
export const SATIR_ADET_SINIRI = 99
export const SEPET_SATIR_SINIRI = 50

export type SepetKalemi = { variantId: number; adet: number }

export type FiyatliSatir = {
  variantId: number
  productId: number
  sku: string
  baslik: string
  slug: string
  gorsel: string | null
  adet: number
  birimKurus: number
  kdvOrani: number
  satirKurus: number
  stok: number
}

export type SepetSorunu =
  | { variantId: number; sebep: 'BULUNAMADI' }
  | { variantId: number; sebep: 'SATISTA_DEGIL'; baslik: string }
  | { variantId: number; sebep: 'FIYAT_YOK'; baslik: string }
  | { variantId: number; sebep: 'STOK_YETERSIZ'; baslik: string; mevcutStok: number }

export type FiyatliSepet = {
  satirlar: FiyatliSatir[]
  sorunlar: SepetSorunu[]
  araToplamKurus: number
  kargoOdeyen: ShippingPayer
}

/**
 * Aynı varyant iki kez gelirse birleştirir, adetleri sınırlar, geçersizleri atar.
 * Girdi istemciden geldiği için her alan yeniden doğrulanır.
 */
export function sepetiNormallestir(kalemler: SepetKalemi[]): SepetKalemi[] {
  const toplam = new Map<number, number>()
  for (const k of kalemler) {
    if (!Number.isSafeInteger(k.variantId) || k.variantId <= 0) continue
    if (!Number.isSafeInteger(k.adet) || k.adet <= 0) continue
    toplam.set(k.variantId, Math.min(SATIR_ADET_SINIRI, (toplam.get(k.variantId) ?? 0) + k.adet))
  }
  return [...toplam.entries()]
    .slice(0, SEPET_SATIR_SINIRI)
    .map(([variantId, adet]) => ({ variantId, adet }))
}

/**
 * Sepeti VERİTABANINDAN fiyatlar ve stoğu kontrol eder.
 *
 * Sepet sayfası da ödeme adımı da bunu kullanır — müşterinin sepette gördüğü
 * tutar ile ödeme sayfasına gönderilen tutar aynı fonksiyondan çıkar.
 *
 * Fiyat seçimi ürün sayfasıyla aynıdır: RETAIL müşteri grubu. Birden fazla
 * geçerli fiyat satırı olursa en son başlayan seçilir (bugün her varyantta tek
 * satır var; kural, ileride kampanya fiyatı eklendiğinde de doğru çalışsın diye).
 */
export async function sepetiFiyatla(
  db: Kysely<Database>,
  kalemler: SepetKalemi[],
): Promise<FiyatliSepet> {
  const temiz = sepetiNormallestir(kalemler)
  if (temiz.length === 0) {
    return { satirlar: [], sorunlar: [], araToplamKurus: 0, kargoOdeyen: 'ALICI' }
  }

  const idler = temiz.map((k) => k.variantId)
  const satirlar = await sql<{
    variant_id: number
    product_id: number
    sku: string
    slug: string
    baslik: string
    product_status: string
    variant_active: boolean
    price_net: number | null
    tax_rate: number | null
    stok: number
    gorsel: string | null
  }>`
    SELECT v.id AS variant_id, p.id AS product_id, v.sku, p.slug,
           concat_ws(' ', b.name, nullif(p.product_code, ''), p.name) AS baslik,
           p.status::text AS product_status, v.is_active AS variant_active,
           fiyat.price_net, fiyat.tax_rate,
           -- Kontrol ve düşüm AYNI depodan: ödeme onayında stok MERKEZ'den düşülür.
           coalesce((SELECT s.quantity FROM stock s WHERE s.variant_id = v.id AND s.warehouse_code = 'MERKEZ'), 0)::int AS stok,
           (SELECT pi.url FROM product_image pi WHERE pi.product_id = p.id
             ORDER BY pi.is_primary DESC, pi.sort_order, pi.id LIMIT 1) AS gorsel
    FROM product_variant v
    JOIN product p        ON p.id = v.product_id
    JOIN product_brand b  ON b.id = p.brand_id
    LEFT JOIN LATERAL (
      SELECT pr.price_net, pr.tax_rate FROM price pr
      WHERE pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
        AND pr.valid_from <= now() AND (pr.valid_to IS NULL OR pr.valid_to > now())
      ORDER BY pr.valid_from DESC LIMIT 1
    ) fiyat ON TRUE
    WHERE v.id = ANY(${idler}::bigint[])
  `.execute(db)

  const bul = new Map(satirlar.rows.map((r) => [r.variant_id, r]))
  const sonuc: FiyatliSatir[] = []
  const sorunlar: SepetSorunu[] = []

  for (const k of temiz) {
    const r = bul.get(k.variantId)
    if (!r) {
      sorunlar.push({ variantId: k.variantId, sebep: 'BULUNAMADI' })
      continue
    }
    if (r.product_status !== 'ACTIVE' || !r.variant_active) {
      sorunlar.push({ variantId: k.variantId, sebep: 'SATISTA_DEGIL', baslik: r.baslik })
      continue
    }
    if (r.price_net === null || r.price_net <= 0) {
      sorunlar.push({ variantId: k.variantId, sebep: 'FIYAT_YOK', baslik: r.baslik })
      continue
    }
    if (r.stok < k.adet) {
      sorunlar.push({
        variantId: k.variantId,
        sebep: 'STOK_YETERSIZ',
        baslik: r.baslik,
        mevcutStok: Math.max(0, r.stok),
      })
      continue
    }
    const kdv = r.tax_rate ?? 20
    const birim = brutKurus(r.price_net, kdv)
    sonuc.push({
      variantId: k.variantId,
      productId: r.product_id,
      sku: r.sku,
      baslik: r.baslik,
      slug: r.slug,
      gorsel: r.gorsel,
      adet: k.adet,
      birimKurus: birim,
      kdvOrani: kdv,
      satirKurus: birim * k.adet,
      stok: r.stok,
    })
  }

  const araToplamKurus = sonuc.reduce((t, s) => t + s.satirKurus, 0)
  return {
    satirlar: sonuc,
    sorunlar,
    araToplamKurus,
    kargoOdeyen: araToplamKurus >= UCRETSIZ_KARGO_ESIGI_KURUS ? 'SATICI' : 'ALICI',
  }
}

// ─────────────────────────────── Sipariş oluşturma ────────────────────────

export type SiparisGirdisi = {
  kalemler: SepetKalemi[]
  musteri: { adSoyad: string; email: string; telefon: string }
  teslimat: { il: string; ilce: string; adres: string; postaKodu?: string | null }
  fatura:
    | { tur: 'BIREYSEL'; adres?: string | null }
    | {
        tur: 'KURUMSAL'
        unvan: string
        vergiDairesi: string
        vergiNo: string
        adres?: string | null
      }
  ip: string
  sozlesmeSurumu: string
  /** PayTR'a hangi modda gidileceği — siparişe OLUŞTURULURKEN yazılır. */
  testModu: boolean
}

export type OlusanSiparis = {
  orderNo: string
  totalKurus: number
  email: string
  adSoyad: string
  telefon: string
  adres: string
  paytrSepeti: PaytrSepetSatiri[]
}

export type SiparisSonucu =
  | { ok: true; siparis: OlusanSiparis }
  | { ok: false; sorunlar: SepetSorunu[]; bos?: boolean }

/**
 * Sepeti yeniden fiyatlar ve siparişi PENDING_PAYMENT olarak yazar.
 *
 * Sepette TEK bir sorun bile varsa sipariş yazılmaz ve sorunlar döner —
 * müşteri "2 adet istedim, 1 tane geldi" sürpriziyle karşılaşmasın; sepeti
 * kendisi düzeltir.
 */
export async function siparisOlustur(
  db: Kysely<Database>,
  g: SiparisGirdisi,
): Promise<SiparisSonucu> {
  const sepet = await sepetiFiyatla(db, g.kalemler)
  if (sepet.satirlar.length === 0 && sepet.sorunlar.length === 0) {
    return { ok: false, sorunlar: [], bos: true }
  }
  if (sepet.sorunlar.length > 0) return { ok: false, sorunlar: sepet.sorunlar }

  const fatura =
    g.fatura.tur === 'KURUMSAL'
      ? {
          invoice_type: 'KURUMSAL' as InvoiceType,
          invoice_name: g.fatura.unvan,
          invoice_tax_office: g.fatura.vergiDairesi,
          invoice_tax_no: g.fatura.vergiNo,
          invoice_address: g.fatura.adres || null,
        }
      : {
          invoice_type: 'BIREYSEL' as InvoiceType,
          invoice_name: null,
          invoice_tax_office: null,
          invoice_tax_no: null,
          invoice_address: g.fatura.adres || null,
        }

  // Sipariş no çakışması (≈ milyarda bir) olursa yenisiyle tekrar dene.
  for (let deneme = 0; deneme < 5; deneme++) {
    const orderNo = siparisNoUret()
    try {
      await db.transaction().execute(async (trx) => {
        const siparis = await trx
          .insertInto('customer_order')
          .values({
            order_no: orderNo,
            full_name: g.musteri.adSoyad,
            email: g.musteri.email,
            phone: g.musteri.telefon,
            ship_city: g.teslimat.il,
            ship_district: g.teslimat.ilce,
            ship_address: g.teslimat.adres,
            ship_postal_code: g.teslimat.postaKodu || null,
            ...fatura,
            subtotal_kurus: sepet.araToplamKurus,
            shipping_kurus: 0,
            shipping_payer: sepet.kargoOdeyen,
            total_kurus: sepet.araToplamKurus,
            terms_version: g.sozlesmeSurumu,
            terms_accepted_at: new Date(),
            customer_ip: g.ip,
            test_mode: g.testModu,
          })
          .returning('id')
          .executeTakeFirstOrThrow()

        await trx
          .insertInto('order_item')
          .values(
            sepet.satirlar.map((s) => ({
              order_id: siparis.id,
              variant_id: s.variantId,
              product_id: s.productId,
              sku: s.sku,
              product_title: s.baslik.slice(0, 255),
              product_slug: s.slug,
              quantity: s.adet,
              unit_price_kurus: s.birimKurus,
              tax_rate: s.kdvOrani,
              line_total_kurus: s.satirKurus,
            })),
          )
          .execute()
      })
    } catch (e) {
      if (benzersizlikIhlali(e, 'customer_order_order_no_key')) continue
      throw e
    }

    const t = g.teslimat
    return {
      ok: true,
      siparis: {
        orderNo,
        totalKurus: sepet.araToplamKurus,
        email: g.musteri.email,
        adSoyad: g.musteri.adSoyad,
        telefon: g.musteri.telefon,
        adres: [t.adres, t.ilce, t.il, t.postaKodu].filter(Boolean).join(', ').slice(0, 400),
        paytrSepeti: sepet.satirlar.map((s) => [s.baslik, kurusToPaytrFiyat(s.birimKurus), s.adet]),
      },
    }
  }
  throw new Error('Sipariş numarası 5 denemede de çakıştı.')
}

function benzersizlikIhlali(e: unknown, kisit: string): boolean {
  const h = e as { code?: string; constraint?: string }
  return h?.code === '23505' && h?.constraint === kisit
}

// ─────────────────────────────── PayTR bildirimi ──────────────────────────

export type BildirimSonucu = {
  /** PayTR'a döndürülecek düz metin. Yalnızca "OK" bildirimi kapatır. */
  yanit: string
  httpStatus: number
  sonuc:
    | 'PAID'
    | 'PAID_AFTER_FAIL'
    | 'FAILED'
    | 'DUPLICATE'
    | 'BAD_HASH'
    | 'MISSING_FIELDS'
    | 'UNKNOWN_ORDER'
    | 'AMOUNT_MISMATCH'
    | 'MODE_MISMATCH'
}

/** PayTR bildiriminin belgelenmiş alanları — loga yalnızca bunlar yazılır. */
const PAYTR_BILDIRIM_ALANLARI = [
  'merchant_oid', 'status', 'total_amount', 'hash', 'failed_reason_code', 'failed_reason_msg',
  'test_mode', 'payment_type', 'currency', 'payment_amount', 'installment_count',
] as const

/** Ödenmiş kabul edilen ve bir daha değişmemesi gereken durumlar. */
const KAPANMIS: OrderStatus[] = ['PAID', 'SHIPPED', 'DELIVERED', 'REFUNDED']

/**
 * PayTR bildirim URL'sine gelen POST'u işler.
 *
 * Yanıt kuralı:
 *  · "OK"   → bildirim işlendi ya da tekrar gönderilmesinin faydası yok
 *             (tekrar, bilinmeyen sipariş, tutar uyuşmazlığı — hepsi loglanır).
 *  · başka  → PayTR bir dakika sonra tekrar dener. Yalnızca imza tutmadığında
 *             ve geçici bir hata olduğunda (veritabanı istisnası) böyle döner:
 *             anahtar yanlış girildiyse düzeltilene kadar bildirim kaybolmaz.
 */
export async function paytrBildirimiIsle(
  db: Kysely<Database>,
  ayar: Pick<PaytrAyarlari, 'merchantKey' | 'merchantSalt'>,
  form: Record<string, string>,
): Promise<BildirimSonucu> {
  const oid = form.merchant_oid ?? ''
  const status = form.status ?? ''
  const totalStr = form.total_amount ?? ''
  const hash = form.hash ?? ''

  // Yalnızca PayTR'ın belgelenmiş alanları, kısaltılarak saklanır. İmzasız
  // istekler de loglandığı için, aksi hâlde dışarıdan gelen her POST tabloya
  // sınırsız veri yazdırabilirdi.
  const kayit: Record<string, string> = {}
  for (const alan of PAYTR_BILDIRIM_ALANLARI) {
    if (typeof form[alan] === 'string') kayit[alan] = form[alan]!.slice(0, 300)
  }

  const logla = (sonuc: string, hashGecerli: boolean) =>
    db
      .insertInto('payment_notification')
      .values({
        order_no: oid.slice(0, 64) || null,
        status: status.slice(0, 16) || null,
        total_amount: /^\d{1,15}$/.test(totalStr) ? Number(totalStr) : null,
        hash_valid: hashGecerli,
        outcome: sonuc,
        payload: kayit,
      })
      .execute()

  if (!oid || !status || !totalStr || !hash) {
    await logla('MISSING_FIELDS', false)
    return { yanit: 'MISSING_FIELDS', httpStatus: 400, sonuc: 'MISSING_FIELDS' }
  }

  const gecerli = bildirimHashGecerli(ayar, {
    merchant_oid: oid,
    status,
    total_amount: totalStr,
    hash,
  })
  if (!gecerli) {
    await logla('BAD_HASH', false)
    return { yanit: 'BAD_HASH', httpStatus: 400, sonuc: 'BAD_HASH' }
  }

  const sonuc = await db.transaction().execute(async (trx) => {
    const siparis = await trx
      .selectFrom('customer_order')
      .selectAll()
      .where('order_no', '=', oid)
      .forUpdate()
      .executeTakeFirst()

    if (!siparis) return 'UNKNOWN_ORDER' as const
    if (KAPANMIS.includes(siparis.status)) return 'DUPLICATE' as const

    // Mod kontrolü: `test_mode` alanı PayTR imzasına dahil DEĞİL. Siparişin modu
    // oluşturulurken bizim yapılandırmamızdan yazıldı; bildirim farklı mod
    // söylüyorsa (ör. canlı siparişe test kartıyla ödeme) ödendi sayılmaz.
    const bildirimTest = form.test_mode === '1'
    if (bildirimTest !== siparis.test_mode) {
      await trx
        .updateTable('customer_order')
        .set({
          admin_note: sql`concat_ws(E'\n', admin_note, ${`PayTR mod uyuşmazlığı: sipariş ${siparis.test_mode ? 'TEST' : 'CANLI'}, bildirim ${bildirimTest ? 'TEST' : 'CANLI'} (status=${status}). Ödendi sayılmadı; PayTR panelinden kontrol edin.`}::text)`,
          updated_at: sql`now()`,
        })
        .where('id', '=', siparis.id)
        .execute()
      return 'MODE_MISMATCH' as const
    }

    if (status !== 'success') {
      // Başarısız bildirim yalnızca bekleyen siparişi etkiler. Zaten başarısız
      // ya da iptal olan bir sipariş için gelen ikinci başarısızlık tekrar sayılır.
      if (siparis.status !== 'PENDING_PAYMENT') return 'DUPLICATE' as const
      await trx
        .updateTable('customer_order')
        .set({
          status: 'PAYMENT_FAILED',
          failed_reason_code: (form.failed_reason_code ?? '').slice(0, 16) || null,
          failed_reason_msg: (form.failed_reason_msg ?? '').slice(0, 300) || null,
          updated_at: sql`now()`,
        })
        .where('id', '=', siparis.id)
        .execute()
      return 'FAILED' as const
    }

    // ── Başarılı ödeme ──
    // Tutar kontrolü: token imzası tutarı içerdiği için PayTR tarafında
    // değiştirilemez; yine de bizim kaydımızla karşılaştırılır. Çekilen tutar
    // (total_amount) taksit vade farkı yüzünden BÜYÜK olabilir, küçük olamaz.
    const odenen = Number(totalStr)
    const istenen = form.payment_amount !== undefined ? Number(form.payment_amount) : null
    const paraBirimi = (form.currency ?? 'TL').toUpperCase()
    if (
      !Number.isSafeInteger(odenen) ||
      odenen < siparis.total_kurus ||
      (istenen !== null && istenen !== siparis.total_kurus) ||
      !['TL', 'TRY'].includes(paraBirimi)
    ) {
      await trx
        .updateTable('customer_order')
        .set({
          admin_note: sql`concat_ws(E'\n', admin_note, ${`PayTR tutar uyuşmazlığı: total_amount=${totalStr}, payment_amount=${form.payment_amount ?? '-'}, currency=${paraBirimi}. Ödeme panelden kontrol edilmeli.`}::text)`,
          updated_at: sql`now()`,
        })
        .where('id', '=', siparis.id)
        .execute()
      return 'AMOUNT_MISMATCH' as const
    }

    const oncekiDurum = siparis.status
    const taksit = Number(form.installment_count)

    // Stok düşümü — sipariş satırları kilitli siparişe bağlı, tek transaction.
    // Satırlar varyant kimliğine göre SIRALI kilitlenir: aynı ürünleri içeren
    // iki sipariş aynı anda ödenirse ters sırada kilitleyip birbirini beklemesin.
    // TEST siparişi gerçek stoğa dokunmaz.
    const kalemler = siparis.test_mode
      ? []
      : await trx
          .selectFrom('order_item')
          .select(['variant_id', 'quantity'])
          .where('order_id', '=', siparis.id)
          .orderBy('variant_id')
          .execute()
    let stokYetersiz = false
    for (const k of kalemler) {
      if (k.variant_id === null) continue
      const kalan = await trx
        .updateTable('stock')
        .set({ quantity: sql`quantity - ${k.quantity}`, updated_at: sql`now()` })
        .where('variant_id', '=', k.variant_id)
        .where('warehouse_code', '=', 'MERKEZ')
        .returning('quantity')
        .executeTakeFirst()
      if (!kalan || kalan.quantity < 0) stokYetersiz = true
    }

    await trx
      .updateTable('customer_order')
      .set({
        status: 'PAID',
        paid_total_kurus: odenen,
        installment_count: Number.isSafeInteger(taksit) && taksit > 0 ? taksit : null,
        payment_type: (form.payment_type ?? '').slice(0, 16) || null,
        stock_shortage: stokYetersiz,
        failed_reason_code: null,
        failed_reason_msg: null,
        paid_at: sql`now()`,
        updated_at: sql`now()`,
        ...(oncekiDurum !== 'PENDING_PAYMENT'
          ? {
              admin_note: sql`concat_ws(E'\n', admin_note, ${`Ödeme, sipariş "${oncekiDurum}" durumundayken onaylandı. Para çekildi; sipariş ÖDENDİ'ye alındı.`}::text)`,
            }
          : {}),
      })
      .where('id', '=', siparis.id)
      .execute()

    return oncekiDurum === 'PENDING_PAYMENT' ? ('PAID' as const) : ('PAID_AFTER_FAIL' as const)
  })

  await logla(sonuc, true)
  return { yanit: 'OK', httpStatus: 200, sonuc }
}

// ─────────────────────────────── Sorgular ─────────────────────────────────

/** Sipariş takip ve sonuç sayfası için — e-posta eşleşmezse hiçbir şey dönmez. */
export async function siparisSorgula(db: Kysely<Database>, orderNo: string, email: string) {
  const temizNo = orderNo.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!temizNo || !email.trim()) return null
  const siparis = await db
    .selectFrom('customer_order')
    .select([
      'id',
      'order_no',
      'status',
      'full_name',
      'ship_city',
      'ship_district',
      'subtotal_kurus',
      'total_kurus',
      'paid_total_kurus',
      'installment_count',
      'shipping_payer',
      'cargo_company',
      'tracking_no',
      'created_at',
      'paid_at',
      'shipped_at',
      'test_mode',
    ])
    .where('order_no', '=', temizNo)
    .where(sql<boolean>`lower(email) = lower(${email.trim()})`)
    .executeTakeFirst()
  if (!siparis) return null
  const kalemler = await db
    .selectFrom('order_item')
    .select(['product_title', 'product_slug', 'quantity', 'unit_price_kurus', 'line_total_kurus'])
    .where('order_id', '=', siparis.id)
    .orderBy('id')
    .execute()
  const { id: _id, ...gorunur } = siparis
  return { ...gorunur, kalemler }
}

/** Siparişe yönetim notu ekler (mevcut notun altına, zaman damgasıyla). */
export async function siparisNotuEkle(db: Kysely<Database>, orderNo: string, not: string) {
  await db
    .updateTable('customer_order')
    .set({
      admin_note: sql`concat_ws(E'\n', admin_note, to_char(now() AT TIME ZONE 'Europe/Istanbul', 'DD.MM.YYYY HH24:MI') || ' · ' || ${not.slice(0, 500)}::text)`,
      updated_at: sql`now()`,
    })
    .where('order_no', '=', orderNo)
    .execute()
}

/**
 * Aynı IP'den son N dakikada açılan sipariş sayısı — ödeme başlatma ucunu
 * kötüye kullanıma karşı sınırlamak için. Ayrı bir önbellek sunucusu (Redis)
 * gerektirmeden, sunucusuz ortamda da çalışır.
 */
export async function ipSonSiparisSayisi(db: Kysely<Database>, ip: string, dakika: number) {
  const r = await db
    .selectFrom('customer_order')
    .select(sql<number>`count(*)::int`.as('n'))
    .where('customer_ip', '=', ip)
    .where(sql<boolean>`created_at > now() - make_interval(mins => ${dakika})`)
    .executeTakeFirstOrThrow()
  return r.n
}

/** Sonuç sayfası için — yalnızca durum, kişisel veri yok. */
export async function siparisDurumu(db: Kysely<Database>, orderNo: string) {
  const r = await db
    .selectFrom('customer_order')
    .select(['status'])
    .where('order_no', '=', orderNo.replace(/[^A-Z0-9]/g, '').slice(0, 32))
    .executeTakeFirst()
  return r?.status ?? null
}

// ─────────────────────────────── Yönetim paneli ───────────────────────────

export type SiparisFiltresi = 'TUMU' | 'HAZIRLANACAK' | 'KARGODA' | 'ODEME_BEKLEYEN' | 'SORUNLU' | 'KAPANAN'

/** Panel listesi. Varsayılan sıralama: en yeni üstte. */
export async function siparisListesi(
  db: Kysely<Database>,
  secenek: { filtre?: SiparisFiltresi; ara?: string | null; limit?: number } = {},
) {
  let q = db
    .selectFrom('customer_order as o')
    .select([
      'o.order_no',
      'o.status',
      'o.full_name',
      'o.email',
      'o.phone',
      'o.ship_city',
      'o.total_kurus',
      'o.paid_total_kurus',
      'o.shipping_payer',
      'o.test_mode',
      'o.stock_shortage',
      'o.created_at',
      'o.paid_at',
      sql<number>`(SELECT coalesce(sum(i.quantity), 0)::int FROM order_item i WHERE i.order_id = o.id)`.as('adet'),
    ])
    .orderBy('o.created_at', 'desc')
    .limit(Math.min(secenek.limit ?? 200, 500))

  switch (secenek.filtre ?? 'TUMU') {
    case 'HAZIRLANACAK':
      // Test siparişi kargo kuyruğuna girmez — yanlışlıkla gönderilmesin.
      q = q.where('o.status', '=', 'PAID').where('o.test_mode', '=', false)
      break
    case 'KARGODA':
      q = q.where('o.status', '=', 'SHIPPED')
      break
    case 'ODEME_BEKLEYEN':
      q = q.where('o.status', '=', 'PENDING_PAYMENT')
      break
    case 'SORUNLU':
      q = q.where((eb) =>
        eb.or([
          eb('o.stock_shortage', '=', true),
          eb('o.status', '=', 'PAYMENT_FAILED'),
          eb('o.admin_note', 'ilike', '%uyuşmazlığı%'),
          eb.and([eb('o.status', '=', 'PAID'), eb('o.test_mode', '=', true)]),
        ]),
      )
      break
    case 'KAPANAN':
      q = q.where('o.status', 'in', ['DELIVERED', 'CANCELLED', 'REFUNDED'])
      break
  }

  const ara = secenek.ara?.trim()
  if (ara) {
    const desen = `%${ara.replace(/[%_\\]/g, (m) => `\\${m}`)}%`
    q = q.where((eb) =>
      eb.or([
        eb('o.order_no', 'ilike', desen),
        eb('o.full_name', 'ilike', desen),
        eb('o.email', 'ilike', desen),
        eb('o.phone', 'ilike', desen),
      ]),
    )
  }
  return q.execute()
}

/** Panel sayaçları — sekmelerde gösterilir. */
export async function siparisSayaclari(db: Kysely<Database>) {
  const r = await db
    .selectFrom('customer_order')
    .select([
      sql<number>`count(*) FILTER (WHERE status = 'PAID' AND NOT test_mode)::int`.as('hazirlanacak'),
      sql<number>`count(*) FILTER (WHERE status = 'SHIPPED')::int`.as('kargoda'),
      sql<number>`count(*) FILTER (WHERE status = 'PENDING_PAYMENT')::int`.as('odemeBekleyen'),
      sql<number>`count(*) FILTER (WHERE stock_shortage OR status = 'PAYMENT_FAILED' OR admin_note ILIKE '%uyuşmazlığı%' OR (status = 'PAID' AND test_mode))::int`.as('sorunlu'),
    ])
    .executeTakeFirstOrThrow()
  return r
}

export async function siparisDetay(db: Kysely<Database>, orderNo: string) {
  const siparis = await db
    .selectFrom('customer_order')
    .selectAll()
    .where('order_no', '=', orderNo)
    .executeTakeFirst()
  if (!siparis) return null
  const [kalemler, bildirimler] = await Promise.all([
    db.selectFrom('order_item').selectAll().where('order_id', '=', siparis.id).orderBy('id').execute(),
    db
      .selectFrom('payment_notification')
      .select(['status', 'total_amount', 'hash_valid', 'outcome', 'received_at'])
      .where('order_no', '=', orderNo)
      .orderBy('received_at', 'desc')
      .limit(50)
      .execute(),
  ])
  return { siparis, kalemler, bildirimler }
}

/**
 * Elle yapılabilen durum geçişleri.
 *
 * Ödeme durumları (PAID, PAYMENT_FAILED) YALNIZCA PayTR bildirimiyle değişir;
 * panelden "ödendi" işaretlenemez. Ödenmiş bir sipariş "iptal" edilemez —
 * para alınmıştır, doğru durum "iade edildi"dir (iade PayTR panelinden yapılır).
 */
export const ELLE_GECISLER: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['CANCELLED'],
  PAYMENT_FAILED: ['CANCELLED'],
  PAID: ['SHIPPED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
}

export type DurumGuncelleme =
  | { yeni: 'SHIPPED'; kargoFirmasi: string; takipNo: string }
  | { yeni: 'DELIVERED' | 'CANCELLED' | 'REFUNDED' }

export async function siparisDurumGuncelle(
  db: Kysely<Database>,
  orderNo: string,
  g: DurumGuncelleme,
  yapan: string,
): Promise<{ ok: true } | { ok: false; sebep: string }> {
  return db.transaction().execute(async (trx) => {
    const s = await trx
      .selectFrom('customer_order')
      .select(['id', 'status'])
      .where('order_no', '=', orderNo)
      .forUpdate()
      .executeTakeFirst()
    if (!s) return { ok: false as const, sebep: 'Sipariş bulunamadı.' }
    if (!ELLE_GECISLER[s.status].includes(g.yeni)) {
      return { ok: false as const, sebep: `"${s.status}" durumundaki sipariş "${g.yeni}" yapılamaz.` }
    }
    if (g.yeni === 'SHIPPED' && (!g.kargoFirmasi.trim() || !g.takipNo.trim())) {
      return { ok: false as const, sebep: 'Kargo firması ve takip numarası gerekli.' }
    }
    await trx
      .updateTable('customer_order')
      .set({
        status: g.yeni,
        updated_at: sql`now()`,
        ...(g.yeni === 'SHIPPED'
          ? {
              cargo_company: g.kargoFirmasi.trim().slice(0, 40),
              tracking_no: g.takipNo.trim().slice(0, 60),
              shipped_at: sql`now()`,
            }
          : {}),
        admin_note: sql`concat_ws(E'\n', admin_note, to_char(now() AT TIME ZONE 'Europe/Istanbul', 'DD.MM.YYYY HH24:MI') || ' · ' || ${`${yapan}: ${s.status} → ${g.yeni}`}::text)`,
      })
      .where('id', '=', s.id)
      .execute()
    return { ok: true as const }
  })
}

/** Aynı e-postayla son N dakikada açılan sipariş sayısı (paylaşılan IP'li mobil hatlar için ikinci sınır). */
export async function emailSonSiparisSayisi(db: Kysely<Database>, email: string, dakika: number) {
  const r = await db
    .selectFrom('customer_order')
    .select(sql<number>`count(*)::int`.as('n'))
    .where(sql<boolean>`lower(email) = lower(${email.trim()})`)
    .where(sql<boolean>`created_at > now() - make_interval(mins => ${dakika})`)
    .executeTakeFirstOrThrow()
  return r.n
}
