import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OdemeSonucu } from './odeme-sonucu'

export const metadata: Metadata = {
  title: 'Sipariş sonucu',
  robots: { index: false, follow: false },
}

export default function OdemeSonucSayfasi() {
  return (
    <div className="ocm-container py-10 md:py-14">
      <Suspense>
        <OdemeSonucu />
      </Suspense>
    </div>
  )
}
