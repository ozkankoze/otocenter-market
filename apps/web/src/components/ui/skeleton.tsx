import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-ink-100', className)} aria-hidden="true" />
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
      <p className="text-base font-semibold text-ink-900">{title}</p>
      {description ? <p className="mt-2 text-sm text-ink-600">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}
