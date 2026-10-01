import { z } from 'zod'
import { ILLER } from './iller'

/**
 * ÖDEME FORMU ŞEMASI — tarayıcı ve sunucu AYNI kuralları kullanır.
 *
 * Tarayıcıdaki doğrulama yalnızca kullanıcıya hızlı geri bildirim içindir;
 * asıl doğrulama sunucuda (`/api/odeme/baslat`) bu şemayla yeniden yapılır.
 *
 * Sınırlar PayTR'dan geliyor: ad soyad ≤ 60, telefon ≤ 20, adres ≤ 400 (bizde
 * teslimat adresi + ilçe + il birleşiminin 400'ü aşmaması için 300),
 * e-posta ≤ 100 ve TÜRKÇE KARAKTER İÇEREMEZ.
 */

/** "0532 111 22 33", "+90 532...", "532..." → "05321112233" */
export function telefonNormallestir(ham: string): string {
  let r = ham.replace(/\D/g, '')
  if (r.startsWith('90') && r.length === 12) r = r.slice(2)
  if (r.length === 10) r = `0${r}`
  return r
}

const metin = (min: number, max: number, ad: string) =>
  z
    .string()
    .trim()
    .min(min, `${ad} en az ${min} karakter olmalı.`)
    .max(max, `${ad} en fazla ${max} karakter olabilir.`)

export const odemeFormuSemasi = z
  .object({
    adSoyad: metin(5, 60, 'Ad soyad').refine((v) => /\S+\s+\S+/.test(v), 'Adınızı ve soyadınızı yazın.'),
    email: z
      .string()
      .trim()
      .max(100, 'E-posta en fazla 100 karakter olabilir.')
      .email('Geçerli bir e-posta adresi yazın.')
      // PayTR e-postada Türkçe karakter kabul etmiyor.
      .refine((v) => /^[\x21-\x7E]+$/.test(v), 'E-posta adresinde Türkçe karakter olamaz.'),
    telefon: z
      .string()
      .transform(telefonNormallestir)
      .refine((v) => /^0[2-5]\d{9}$/.test(v), 'Telefonu 05XX XXX XX XX biçiminde yazın.'),
    il: z.enum(ILLER, { message: 'İl seçin.' }),
    ilce: metin(2, 60, 'İlçe'),
    adres: metin(10, 300, 'Adres'),
    postaKodu: z
      .string()
      .trim()
      .refine((v) => v === '' || /^\d{5}$/.test(v), 'Posta kodu 5 haneli olmalı.')
      .optional(),
    faturaTuru: z.enum(['BIREYSEL', 'KURUMSAL']),
    unvan: z.string().trim().max(160).optional(),
    vergiDairesi: z.string().trim().max(60).optional(),
    vergiNo: z.string().trim().optional(),
    faturaAdresiFarkli: z.boolean(),
    faturaAdresi: z.string().trim().max(300).optional(),
    sozlesmeOnay: z.literal(true, {
      message: 'Devam etmek için ön bilgilendirme formunu ve mesafeli satış sözleşmesini onaylayın.',
    }),
  })
  .superRefine((v, ctx) => {
    if (v.faturaTuru === 'KURUMSAL') {
      if (!v.unvan || v.unvan.length < 2)
        ctx.addIssue({ code: 'custom', path: ['unvan'], message: 'Şirket unvanını yazın.' })
      if (!v.vergiDairesi || v.vergiDairesi.length < 2)
        ctx.addIssue({ code: 'custom', path: ['vergiDairesi'], message: 'Vergi dairesini yazın.' })
      if (!v.vergiNo || !/^(\d{10}|\d{11})$/.test(v.vergiNo))
        ctx.addIssue({
          code: 'custom',
          path: ['vergiNo'],
          message: 'Vergi numarası 10, şahıs şirketinde TC kimlik no 11 hane olmalı.',
        })
    }
    if (v.faturaAdresiFarkli && (!v.faturaAdresi || v.faturaAdresi.length < 10))
      ctx.addIssue({ code: 'custom', path: ['faturaAdresi'], message: 'Fatura adresini yazın.' })
  })

export type OdemeFormu = z.input<typeof odemeFormuSemasi>
export type OdemeFormuTemiz = z.output<typeof odemeFormuSemasi>
export type AlanHatalari = Partial<Record<keyof OdemeFormu, string>>

export function alanHatalari(e: z.ZodError): AlanHatalari {
  const h: AlanHatalari = {}
  for (const s of e.issues) {
    const alan = s.path[0] as keyof OdemeFormu | undefined
    if (alan && !h[alan]) h[alan] = s.message
  }
  return h
}

export const baslatIstegi = z.object({
  form: z.unknown(),
  kalemler: z
    .array(z.object({ variantId: z.number().int().positive(), adet: z.number().int().positive().max(99) }))
    .min(1)
    .max(50),
})
