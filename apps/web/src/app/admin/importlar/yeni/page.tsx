import { listDataSources } from '@/server/admin/queries'
import { requireAdmin } from '@/server/admin/auth'
import { PageHeader } from '@/components/admin/shell'
import { ImportWizard } from '@/components/admin/import-wizard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Yeni import' }

export default async function NewImportPage() {
  await requireAdmin()
  const sources = await listDataSources()

  return (
    <>
      <PageHeader
        eyebrow="Veri"
        title="Yeni import"
        description="Dosya yüklenir, satır satır doğrulanır ve size özet gösterilir. Siz onaylamadan production tablolarına hiçbir şey yazılmaz."
      />
      <ImportWizard
        sources={sources.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          kind: s.kind,
          trust_level: s.trust_level,
        }))}
      />
    </>
  )
}
