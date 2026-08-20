'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Info, Loader2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

type Preview = {
  jobId: number
  fileName: string
  fileSize: number
  sourceCode: string
  totals: {
    total: number
    valid: number
    warning: number
    error: number
    duplicate: number
    created: number
    updated: number
    conflictRisk: number
    missingVehicle: number
    oemShared: number
  }
  sheets: Array<{
    sheet: string
    title: string
    total: number
    valid: number
    warning: number
    error: number
    skipped: number
    created: number
    updated: number
  }>
  unknownHeaders: Array<{ sheet: string; headers: string[] }>
  missingRequiredHeaders: Array<{ sheet: string; headers: string[] }>
  ignoredSheets: string[]
  expansions: Array<{ rowNo: number; sku: string; model: string; engineCount: number; engines: string[] }>
  errorSamples: Array<{ sheetTitle: string; rowNo: number; code: string; message: string }>
  warningSamples: Array<{ sheetTitle: string; rowNo: number; code: string; message: string }>
  duplicateOfJobId: number | null
}

type Source = { id: number; code: string; name: string; trust_level: number; kind: string }

const fmt = (n: number) => n.toLocaleString('tr-TR')

export function ImportWizard({ sources }: { sources: Source[] }) {
  const router = useRouter()
  const [file, setFile] = React.useState<File | null>(null)
  const [sourceId, setSourceId] = React.useState<number>(sources[0]?.id ?? 0)
  const [busy, setBusy] = React.useState<'upload' | 'commit' | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<Preview | null>(null)
  const [dragging, setDragging] = React.useState(false)

  async function upload() {
    if (!file) return
    setBusy('upload')
    setError(null)
    try {
      const body = new FormData()
      body.set('dosya', file)
      body.set('kaynak', String(sourceId))
      const res = await fetch('/api/admin/import', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Yükleme başarısız')
      setPreview(json.preview as Preview)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function commit() {
    if (!preview) return
    setBusy('commit')
    setError(null)
    try {
      const res = await fetch(`/api/admin/import/${preview.jobId}/commit`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Uygulama başarısız')
      router.push(`/admin/importlar/${preview.jobId}?sonuc=1`)
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  async function cancel() {
    if (!preview) return
    await fetch(`/api/admin/import/${preview.jobId}/cancel`, { method: 'POST' })
    setPreview(null)
    setFile(null)
  }

  // ── ADIM 1: DOSYA SEÇİMİ ─────────────────────────────────────────────────
  if (!preview) {
    return (
      <div className="max-w-[860px]">
        <Steps active={0} />

        {error ? <ErrorBox message={error} /> : null}

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const dropped = e.dataTransfer.files?.[0]
            if (dropped) setFile(dropped)
          }}
          className={cn(
            'rounded-lg border-2 border-dashed bg-white px-6 py-12 text-center transition-colors',
            dragging ? 'border-brand-600 bg-brand-50' : 'border-ink-200',
          )}
          data-testid="import-dropzone"
        >
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <FileSpreadsheet size={22} aria-hidden="true" />
          </span>
          <p className="text-[15px] font-semibold text-ink-900">
            {file ? file.name : 'XLSX veya CSV dosyanızı sürükleyin'}
          </p>
          <p className="mx-auto mt-1.5 max-w-[460px] text-[12.5px] text-ink-500">
            {file
              ? `${(file.size / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} KB · kaynak seçip devam edin`
              : 'Sayfa adları: KATEGORILER · ARAC_AGACI · URUNLER · FIYAT_STOK · OEM_CAPRAZ · UYUMLULUK'}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-[13px] font-medium text-ink-800 transition-colors hover:border-brand-300">
              <Upload size={15} aria-hidden="true" />
              Dosya seç
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="sr-only"
                data-testid="import-file-input"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {/* Dosya indirme uç noktası; Link ile sarılmamalı */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/admin/import/sablon"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-[13px] font-medium text-ink-800 transition-colors hover:border-brand-300"
              data-testid="template-download"
            >
              <Download size={15} aria-hidden="true" />
              Şablonu indir
            </a>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-ink-100 bg-white p-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-ink-800">Veri kaynağı</span>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(Number(e.target.value))}
              data-testid="import-source"
              className="h-10 w-full max-w-[420px] rounded-md border border-ink-200 bg-white px-3 text-[13.5px] outline-none focus:border-brand-600"
            >
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) · güven {s.trust_level}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 max-w-[560px] text-[12px] leading-relaxed text-ink-500">
            Kaynak, iddiaların sahibidir. Çözümleme motoru iki kaynak çeliştiğinde
            güven seviyesine bakar; MANUAL kaynak her zaman kazanır. Yanlış kaynak
            seçimi uyumluluk sonuçlarını doğrudan etkiler.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void upload()}
          disabled={!file || busy !== null}
          data-testid="import-submit"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-brand-700 px-6 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
        >
          {busy === 'upload' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {busy === 'upload' ? 'Doğrulanıyor…' : 'Yükle ve doğrula'}
        </button>
        <p className="mt-2 text-[12px] text-ink-500">
          Bu adım production tablolarına <b className="font-semibold text-ink-700">hiçbir şey yazmaz</b>.
          Dosya okunur, satır satır doğrulanır ve size özet gösterilir.
        </p>
      </div>
    )
  }

  // ── ADIM 2: ÖNİZLEME ─────────────────────────────────────────────────────
  const t = preview.totals
  const blocking = preview.missingRequiredHeaders.length > 0
  const applicable = t.valid + t.warning

  return (
    <div className="max-w-[1080px]" data-testid="import-preview">
      <Steps active={1} />

      {error ? <ErrorBox message={error} /> : null}

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-ink-100 bg-white px-4 py-3">
        <FileSpreadsheet size={18} className="text-brand-600" aria-hidden="true" />
        <b className="text-[13.5px] font-semibold text-ink-900">{preview.fileName}</b>
        <span className="ocm-code text-[11.5px]">
          {(preview.fileSize / 1024).toFixed(0)} KB · kaynak: {preview.sourceCode} · import #{preview.jobId}
        </span>
        {preview.duplicateOfJobId ? (
          <span className="rounded-sm bg-[#FDF3E2] px-2 py-0.5 text-[11.5px] font-semibold text-warning">
            Bu dosya daha önce #{preview.duplicateOfJobId} ile yüklendi
          </span>
        ) : null}
      </div>

      {/* ZORUNLU ÖZET — kullanıcı onaylamadan önce bunları görür */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8" data-testid="preview-totals">
        <Tile label="Toplam satır" value={t.total} testId="tile-total" />
        <Tile label="Geçerli" value={t.valid} tone="good" testId="tile-valid" />
        <Tile label="Hatalı" value={t.error} tone={t.error ? 'bad' : 'default'} testId="tile-error" />
        <Tile label="Yeni ürün" value={t.created} testId="tile-created" />
        <Tile label="Güncellenecek" value={t.updated} testId="tile-updated" />
        <Tile label="Duplicate" value={t.duplicate} tone={t.duplicate ? 'warn' : 'default'} testId="tile-duplicate" />
        <Tile label="Çakışma riski" value={t.conflictRisk} tone={t.conflictRisk ? 'warn' : 'default'} testId="tile-conflict" />
        <Tile label="Eksik araç verisi" value={t.missingVehicle} tone={t.missingVehicle ? 'bad' : 'default'} testId="tile-missing-vehicle" />
      </div>

      {t.error > 0 ? (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-[#F3D4CF] bg-[#FDF1EF] px-4 py-3">
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
          <div className="text-[13px] text-ink-800">
            <b className="font-semibold">
              {fmt(t.error)} satır hatalı — bu satırlar uygulanmayacak.
            </b>
            <p className="mt-0.5 text-[12.5px] text-ink-600">
              Kalan {fmt(applicable)} satır normal şekilde uygulanır. Hatalı satırlar
              import&apos;u durdurmaz; düzeltip aynı dosyayı yeniden yükleyebilirsiniz.
            </p>
            <a
              href={`/api/admin/import/${preview.jobId}/hata-raporu`}
              className="mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-600 hover:underline"
              data-testid="error-report-link"
            >
              <Download size={13} aria-hidden="true" />
              Hata raporunu Excel olarak indir
            </a>
          </div>
        </div>
      ) : null}

      {blocking ? (
        <div className="mb-5 rounded-lg border border-[#F3D4CF] bg-[#FDF1EF] px-4 py-3 text-[13px] text-danger">
          <b className="font-semibold">Zorunlu sütunlar eksik.</b>
          <ul className="mt-1 list-inside list-disc text-[12.5px] text-ink-700">
            {preview.missingRequiredHeaders.map((m) => (
              <li key={m.sheet}>
                {m.sheet}: {m.headers.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Sayfa bazlı özet */}
      <div className="mb-5 overflow-hidden rounded-lg border border-ink-100 bg-white">
        <table className="w-full text-left text-[13px]" data-testid="preview-sheets">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-25">
              <Th>Sayfa</Th>
              <Th align="right">Satır</Th>
              <Th align="right">Geçerli</Th>
              <Th align="right">Uyarı</Th>
              <Th align="right">Hata</Th>
              <Th align="right">Atlandı</Th>
              <Th align="right">Yeni</Th>
              <Th align="right">Güncelleme</Th>
            </tr>
          </thead>
          <tbody>
            {preview.sheets.map((s) => (
              <tr key={s.sheet} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-2.5 font-medium text-ink-900">{s.title}</td>
                <Num v={s.total} />
                <Num v={s.valid} tone={s.valid ? 'good' : undefined} />
                <Num v={s.warning} tone={s.warning ? 'warn' : undefined} />
                <Num v={s.error} tone={s.error ? 'bad' : undefined} />
                <Num v={s.skipped} />
                <Num v={s.created} />
                <Num v={s.updated} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview.expansions.length ? (
        <Notice tone="info" title={`${preview.expansions.length} satır TUM_MOTORLAR ile genişletilecek`}>
          <ul className="space-y-1">
            {preview.expansions.slice(0, 5).map((e) => (
              <li key={e.rowNo}>
                Satır {e.rowNo} · {e.sku} · {e.model} → <b className="font-semibold">{e.engineCount} motor</b>
                <span className="ml-1 text-ink-400">({e.engines.slice(0, 4).join(', ')}…)</span>
              </li>
            ))}
          </ul>
        </Notice>
      ) : null}

      {t.oemShared > 0 ? (
        <Notice tone="warn" title={`${fmt(t.oemShared)} OEM numarası başka ürünlere de bağlı`}>
          Muadil ürünlerde bu normaldir. Farklı bir parça bekliyorsanız numaraları kontrol edin.
        </Notice>
      ) : null}

      {t.conflictRisk > 0 ? (
        <Notice tone="warn" title={`${fmt(t.conflictRisk)} satır çakışma üretebilir`}>
          Bu satırlarda başka bir kaynak tersini söylüyor. Çakışan kayıtlar
          <b className="font-semibold"> ÇAKIŞMA</b> olarak işaretlenir ve müşteriye
          <b className="font-semibold"> asla &quot;Aracınıza uygun ✓&quot; gösterilmez</b>.
          Kararı Veri Çakışmaları ekranından siz verirsiniz.
        </Notice>
      ) : null}

      {preview.unknownHeaders.length ? (
        <Notice tone="info" title="Tanınmayan sütunlar yok sayıldı">
          {preview.unknownHeaders.map((u) => `${u.sheet}: ${u.headers.join(', ')}`).join(' · ')}
        </Notice>
      ) : null}

      {preview.errorSamples.length ? (
        <ProblemTable title="Hatalı satırlar" rows={preview.errorSamples} tone="bad" testId="error-rows" />
      ) : null}
      {preview.warningSamples.length ? (
        <ProblemTable title="Uyarılar" rows={preview.warningSamples} tone="warn" testId="warning-rows" />
      ) : null}

      {/* ONAY */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-ink-100 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => void commit()}
          disabled={busy !== null || blocking || applicable === 0}
          data-testid="import-confirm"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-brand-700 px-6 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
        >
          {busy === 'commit' ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} aria-hidden="true" />
          )}
          {busy === 'commit' ? 'Uygulanıyor…' : `${fmt(applicable)} satırı uygula`}
        </button>
        <button
          type="button"
          onClick={() => void cancel()}
          disabled={busy !== null}
          data-testid="import-cancel"
          className="h-11 rounded-md border border-ink-200 bg-white px-5 text-[13.5px] font-medium text-ink-700 transition-colors hover:border-brand-300 disabled:opacity-40"
        >
          Vazgeç
        </button>
        <span className="text-[12px] text-ink-500">
          Onaylayana kadar production tablolarına hiçbir şey yazılmadı.
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────── PARÇALAR ───────────────────────────────────

function Steps({ active }: { active: number }) {
  const steps = ['Dosya', 'Önizleme & doğrulama', 'Uygulama']
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-2 text-[12.5px]">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold',
              i < active
                ? 'bg-accent-100 text-accent-700'
                : i === active
                  ? 'bg-brand-700 text-white'
                  : 'bg-ink-50 text-ink-400',
            )}
          >
            {i + 1}
          </span>
          <span className={i === active ? 'font-semibold text-ink-900' : 'text-ink-500'}>{s}</span>
          {i < steps.length - 1 ? <span className="mx-1 text-ink-200">→</span> : null}
        </li>
      ))}
    </ol>
  )
}

function Tile({
  label,
  value,
  tone = 'default',
  testId,
}: {
  label: string
  value: number
  tone?: 'default' | 'good' | 'warn' | 'bad'
  testId?: string
}) {
  const cls = {
    default: 'text-ink-900',
    good: 'text-accent-700',
    warn: 'text-warning',
    bad: 'text-danger',
  }[tone]
  return (
    <div className="rounded-lg border border-ink-100 bg-white px-3 py-2.5" data-testid={testId}>
      <span className="block text-[10.5px] font-semibold tracking-wider text-ink-500 uppercase">
        {label}
      </span>
      <b className={cn('mt-0.5 block text-[20px] leading-tight font-bold', cls)}>{fmt(value)}</b>
    </div>
  )
}

function Th({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return (
    <th
      className={cn(
        'px-4 py-2.5 text-[10.5px] font-bold tracking-wider text-ink-600 uppercase',
        align === 'right' && 'text-right',
      )}
    >
      {children}
    </th>
  )
}

function Num({ v, tone }: { v: number; tone?: 'good' | 'warn' | 'bad' }) {
  const cls = tone
    ? { good: 'text-accent-700', warn: 'text-warning', bad: 'text-danger' }[tone]
    : 'text-ink-700'
  return <td className={cn('ocm-code px-4 py-2.5 text-right text-[12px]', cls)}>{fmt(v)}</td>
}

function Notice({
  tone,
  title,
  children,
}: {
  tone: 'info' | 'warn'
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'mb-4 flex items-start gap-3 rounded-lg border px-4 py-3',
        tone === 'warn' ? 'border-[#F1DFBE] bg-[#FDF9F0]' : 'border-brand-100 bg-brand-50',
      )}
    >
      {tone === 'warn' ? (
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
      ) : (
        <Info size={16} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
      )}
      <div className="text-[12.5px] text-ink-700">
        <b className="block text-[13px] font-semibold text-ink-900">{title}</b>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  )
}

function ProblemTable({
  title,
  rows,
  tone,
  testId,
}: {
  title: string
  rows: Array<{ sheetTitle: string; rowNo: number; code: string; message: string }>
  tone: 'bad' | 'warn'
  testId: string
}) {
  return (
    <div className="mb-5">
      <b className="mb-2 block text-[13px] font-semibold text-ink-900">
        {title}
        <span className="ml-2 text-[11.5px] font-normal text-ink-400">
          ilk {rows.length} kayıt gösteriliyor
        </span>
      </b>
      <div className="max-h-[280px] overflow-auto rounded-lg border border-ink-100 bg-white">
        <table className="w-full text-left text-[12.5px]" data-testid={testId}>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.rowNo}-${i}`} className="border-b border-ink-50 last:border-0">
                <td className="w-[130px] px-4 py-2 text-ink-500">{r.sheetTitle}</td>
                <td className="ocm-code w-[80px] px-2 py-2 text-[11.5px]">satır {r.rowNo}</td>
                <td className="ocm-code w-[190px] px-2 py-2 text-[11px] text-ink-500">{r.code}</td>
                <td className={cn('px-4 py-2', tone === 'bad' ? 'text-danger' : 'text-ink-700')}>
                  {r.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="mb-5 rounded-lg border border-[#F3D4CF] bg-[#FDF1EF] px-4 py-3 text-[13px] text-danger"
      data-testid="import-error"
    >
      {message}
    </div>
  )
}
