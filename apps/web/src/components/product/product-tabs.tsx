'use client'

import * as React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export function ProductTabs({
  tabs,
}: {
  tabs: Array<{ id: string; label: string; count?: number; content: React.ReactNode }>
}) {
  const available = tabs.filter((t) => t.content !== null)
  const [value, setValue] = React.useState(available[0]?.id ?? '')

  return (
    <Tabs.Root value={value} onValueChange={setValue} className="mt-10">
      <Tabs.List
        className="ocm-noscrollbar flex gap-1 overflow-x-auto border-b border-ink-100"
        aria-label="Ürün bilgileri"
      >
        {available.map((t) => (
          <Tabs.Trigger
            key={t.id}
            value={t.id}
            className={cn(
              'relative shrink-0 px-4 py-3 text-[13.5px] font-medium whitespace-nowrap transition-colors',
              'text-ink-600 hover:text-brand-600',
              'data-[state=active]:text-brand-700',
              'after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-transparent',
              'data-[state=active]:after:bg-brand-600',
            )}
            data-testid={`tab-${t.id}`}
          >
            {t.label}
            {t.count !== undefined ? (
              <span className="ocm-code ml-1.5 text-[11px] text-ink-400">{t.count}</span>
            ) : null}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {available.map((t) => (
        <Tabs.Content
          key={t.id}
          value={t.id}
          className="pt-6 focus-visible:outline-none"
          data-testid={`tabpanel-${t.id}`}
        >
          {t.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
