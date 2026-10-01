'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertTriangle, Minus, Plus, ShoppingCart, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiyatliSepet } from '@/features/sepet/use-fiyatli-sepet'
import { kurusYaz } from '@/features/sepet/use-sepet'
import { sorunMetni } from '@/features/sepet/types'
import { SATIR_ADET_SINIRI, UCRETSIZ_KARGO_ESIGI_KURUS } from '@/features/sepet/sinirlar'

export function SepetIcerigi() {
  const { durum, adetAyarla, cikar } = useFiyatliSepet()

  if (durum.tur === 'hazirlaniyor') {
    return (
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]" aria-busy="true">
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (durum.tur === 'bos') {
    return (
      <Card className="mt-6 flex flex-col items-center px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <ShoppingCart size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink-900">Sepetiniz boş</h2>
        <p className="mt-1.5 max-w-sm text-sm text-ink-600">
          Aracınızı seçerek yalnızca uyumlu ürünleri görebilir ya da kategorilere göz atabilirsiniz.
        </p>
        <Button asChild className="mt-6">
          <Link href="/filtreler" title="Filtre kategorilerine göz at">
            Alışverişe başla
          </Link>
        </Button>
      </Card>
    )
  }

  if (durum.tur === 'hata') {
    return (
      <Card className="mt-6 p-6 text-sm text-ink-700" role="alert">
        Sepet şu an yüklenemedi. Sayfayı yenileyip tekrar deneyin; sorun sürerse{' '}
        <Link href="/iletisim" title="İletişim sayfasına git" className="font-semibold text-brand-600 underline">
          bize ulaşın
        </Link>
        .
      </Card>
    )
  }

  const { veri, yenileniyor } = durum
  const kalanKurus = UCRETSIZ_KARGO_ESIGI_KURUS - veri.araToplamKurus
  const sorunVar = veri.sorunlar.length > 0
  const satirYok = veri.satirlar.length === 0

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
      {/* min-w-0: ızgara sütunu içeriğin doğal genişliğine göre büyümesin, dar ekranda taşmasın */}
      <div className="min-w-0 space-y-3">
        {sorunVar ? (
          <div
            role="alert"
            className="rounded-lg border border-warning/35 bg-warning/8 p-4 text-[13.5px] text-ink-800"
            data-testid="sepet-sorunlari"
          >
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle size={16} className="text-warning" aria-hidden="true" />
              Sepetinizde düzeltilmesi gereken {veri.sorunlar.length === 1 ? 'bir ürün' : 'ürünler'} var
            </p>
            <ul className="mt-2.5 space-y-2">
              {veri.sorunlar.map((s) => (
                <li key={s.variantId} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{sorunMetni(s)}</span>
                  {s.sebep === 'STOK_YETERSIZ' && s.mevcutStok > 0 ? (
                    <Button size="sm" variant="secondary" onClick={() => adetAyarla(s.variantId, s.mevcutStok)}>
                      Adedi {s.mevcutStok} yap
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => cikar(s.variantId)}>
                      Sepetten çıkar
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {veri.satirlar.map((s) => {
          const ust = Math.min(s.stok, SATIR_ADET_SINIRI)
          return (
            <Card key={s.variantId} className="flex gap-3 p-3.5 sm:gap-4 sm:p-4" data-testid="sepet-satiri">
              <Link
                href={`/urun/${s.slug}`}
                title={`${s.baslik} — ürün detayına git`}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-white sm:h-20 sm:w-20"
              >
                {s.gorsel ? (
                  <Image src={s.gorsel} alt={s.baslik} fill sizes="80px" className="object-contain p-1" />
                ) : null}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/urun/${s.slug}`}
                    title={`${s.baslik} — ürün detayına git`}
                    className="line-clamp-2 text-[14px] leading-snug font-medium text-ink-900 hover:text-brand-600"
                  >
                    {s.baslik}
                  </Link>
                  <span className="mt-1 block text-[12px] text-ink-600">
                    Birim fiyat {kurusYaz(s.birimKurus)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
                  <div className="inline-flex h-10 items-center rounded-md border border-ink-200 bg-white">
                    <button
                      type="button"
                      className="flex h-full w-9 items-center justify-center text-ink-600 hover:text-brand-600 disabled:opacity-40"
                      onClick={() => adetAyarla(s.variantId, s.adet - 1)}
                      disabled={s.adet <= 1}
                      aria-label={`${s.baslik} adedini azalt`}
                    >
                      <Minus size={15} aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-ink-900" aria-live="polite">
                      {s.adet}
                    </span>
                    <button
                      type="button"
                      className="flex h-full w-9 items-center justify-center text-ink-600 hover:text-brand-600 disabled:opacity-40"
                      onClick={() => adetAyarla(s.variantId, s.adet + 1)}
                      disabled={s.adet >= ust}
                      aria-label={`${s.baslik} adedini artır`}
                    >
                      <Plus size={15} aria-hidden="true" />
                    </button>
                  </div>
                  <b className="text-right text-[15px] font-bold whitespace-nowrap text-ink-900 sm:min-w-[96px]">
                    {kurusYaz(s.satirKurus)}
                  </b>
                  <button
                    type="button"
                    onClick={() => cikar(s.variantId)}
                    aria-label={`${s.baslik} ürününü sepetten çıkar`}
                    className="p-1.5 text-ink-400 hover:text-danger"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-5 lg:sticky lg:top-24" aria-busy={yenileniyor}>
        <h2 className="text-[15px] font-semibold text-ink-900">Sipariş özeti</h2>
        <dl className="mt-4 space-y-2.5 text-[13.5px]">
          <div className="flex justify-between">
            <dt className="text-ink-600">Ürünler (KDV dahil)</dt>
            <dd className="font-medium text-ink-900">{kurusYaz(veri.araToplamKurus)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-600">Kargo</dt>
            <dd className="text-right font-medium text-ink-900">
              {veri.kargoOdeyen === 'SATICI' ? (
                <span className="text-accent-700">Ücretsiz</span>
              ) : (
                'Alıcı ödemeli'
              )}
            </dd>
          </div>
        </dl>
        {veri.kargoOdeyen === 'ALICI' && !satirYok ? (
          <p className="mt-3 flex gap-2 rounded-md bg-ink-25 p-3 text-[12.5px] leading-relaxed text-ink-600">
            <Truck size={15} className="mt-0.5 shrink-0 text-ink-400" aria-hidden="true" />
            <span>
              Kargo ücreti teslimatta kargo firmasına ödenir.{' '}
              <b className="font-semibold text-ink-800">{kurusYaz(kalanKurus)}</b> daha eklerseniz
              kargo ücretsiz.
            </span>
          </p>
        ) : null}
        <div className="mt-4 flex items-baseline justify-between border-t border-ink-100 pt-4">
          <span className="text-sm font-semibold text-ink-900">Ödenecek tutar</span>
          <b className="text-[22px] font-bold tracking-tight text-ink-900" data-testid="sepet-toplam">
            {kurusYaz(veri.araToplamKurus)}
          </b>
        </div>
        <Button asChild={!(sorunVar || satirYok)} block size="lg" className="mt-5" disabled={sorunVar || satirYok}>
          {sorunVar || satirYok ? (
            <span>Ödemeye geç</span>
          ) : (
            <Link href="/odeme" title="Ödeme adımına geç">
              Ödemeye geç
            </Link>
          )}
        </Button>
        {sorunVar ? (
          <p className="mt-2.5 text-center text-[12px] text-ink-600">
            Devam etmek için yukarıdaki uyarıyı düzeltin.
          </p>
        ) : null}
        <Link
          href="/filtreler"
          title="Alışverişe devam et"
          className="mt-3 block text-center text-[13px] font-semibold text-brand-600 hover:underline"
        >
          Alışverişe devam et
        </Link>
      </Card>
    </div>
  )
}
