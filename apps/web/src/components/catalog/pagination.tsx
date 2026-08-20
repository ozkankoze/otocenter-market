'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pagination({
  page,
  pageSize,
  total,
}: {
  page: number
  pageSize: number
  total: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageCount = Math.ceil(total / pageSize)

  if (pageCount <= 1) return null

  function go(next: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (next === 1) params.delete('sayfa')
    else params.set('sayfa', String(next))
    const q = params.toString()
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: true })
  }

  const pages: number[] = []
  const from = Math.max(1, page - 2)
  const to = Math.min(pageCount, from + 4)
  for (let i = from; i <= to; i++) pages.push(i)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Sayfalama">
      <PageButton disabled={page === 1} onClick={() => go(page - 1)} aria-label="Önceki sayfa">
        <ChevronLeft size={16} />
      </PageButton>
      {from > 1 ? (
        <>
          <PageButton onClick={() => go(1)}>1</PageButton>
          {from > 2 ? <span className="px-1 text-ink-400">…</span> : null}
        </>
      ) : null}
      {pages.map((p) => (
        <PageButton key={p} active={p === page} onClick={() => go(p)}>
          {p}
        </PageButton>
      ))}
      {to < pageCount ? (
        <>
          {to < pageCount - 1 ? <span className="px-1 text-ink-400">…</span> : null}
          <PageButton onClick={() => go(pageCount)}>{pageCount}</PageButton>
        </>
      ) : null}
      <PageButton
        disabled={page === pageCount}
        onClick={() => go(page + 1)}
        aria-label="Sonraki sayfa"
      >
        <ChevronRight size={16} />
      </PageButton>
    </nav>
  )
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5 text-[13px] font-medium transition-colors',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-100 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-600',
        disabled && 'cursor-not-allowed opacity-40 hover:border-ink-100 hover:text-ink-700',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
