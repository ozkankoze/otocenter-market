'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Undo2 } from 'lucide-react'

type Result = {
  reverted: number
  skipped: number
  deleted: number
  restored: number
  skippedDetails: Array<{ entityType: string; entityId: number; reason: string }>
}

/**
 * Geri alma — iki adımlı onay.
 * Sonuçta kaç kaydın GÜVENLİK GEREĞİ atlandığı açıkça gösterilir.
 */
export function RollbackButton({ jobId }: { jobId: number }) {
  const router = useRouter()
  const [confirming, setConfirming] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [result, setResult] = React.useState<Result | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function run() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/import/${jobId}/rollback`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Geri alma başarısız')
      setResult(json.result as Result)
      setConfirming(false)
      // Sunucu bileşeni yeniden çizilince kalıcı özet paneli devreye girer.
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return (
      <div
        className="w-full rounded-lg border border-[#F1DFBE] bg-[#FDF9F0] px-4 py-3 text-[12.5px] text-ink-700"
        data-testid="rollback-result"
      >
        <b className="block text-[13px] font-semibold text-ink-900">Geri alma tamamlandı</b>
        <p className="mt-1">
          {result.deleted} kayıt silindi · {result.restored} kayıt eski haline döndürüldü ·{' '}
          <b className="font-semibold">{result.skipped} kayıt güvenlik gereği atlandı</b>
        </p>
        {result.skippedDetails.length ? (
          <ul className="mt-2 list-inside list-disc space-y-0.5 text-[12px] text-ink-600">
            {result.skippedDetails.slice(0, 5).map((d, i) => (
              <li key={i}>
                <span className="ocm-code text-[11px]">
                  {d.entityType}#{d.entityId}
                </span>{' '}
                — {d.reason}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        data-testid="rollback-start"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-[#F3D4CF] bg-white px-4 text-[13px] font-semibold text-danger transition-colors hover:bg-[#FDF1EF]"
      >
        <Undo2 size={15} aria-hidden="true" />
        Bu import&apos;u geri al
      </button>
    )
  }

  return (
    <div className="w-full rounded-lg border border-[#F3D4CF] bg-[#FDF1EF] px-4 py-3">
      <b className="block text-[13px] font-semibold text-danger">
        Import #{jobId} geri alınsın mı?
      </b>
      <p className="mt-1 max-w-[560px] text-[12.5px] text-ink-700">
        Bu import&apos;un eklediği kayıtlar silinir, güncellediği kayıtlar eski haline döner.
        Daha sonra başka bir import tarafından güncellenmiş kayıtlar
        <b className="font-semibold"> güvenlik gereği atlanır</b> ve size listelenir.
        Uyumluluk çözümlemesi yeniden çalıştırılır.
      </p>
      {error ? <p className="mt-2 text-[12.5px] font-medium text-danger">{error}</p> : null}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          data-testid="rollback-confirm"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-danger px-4 text-[12.5px] font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : null}
          Evet, geri al
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="h-9 rounded-md border border-ink-200 bg-white px-4 text-[12.5px] font-medium text-ink-700"
        >
          Vazgeç
        </button>
      </div>
    </div>
  )
}
