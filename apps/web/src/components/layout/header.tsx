import { SiteHeader } from './site-header'
import type { MegaMenuData } from '@/server/catalog-queries'
import type { VehicleSelection } from '@/features/vehicle/types'

/**
 * Header kabuğu — veri sunucuda çekilir, etkileşim istemcide.
 * Masaüstü: 3 katman (utility / ana bar / navigasyon + mega menü)
 * Mobil: kompakt bar + drawer + arama overlay + alt sabit bar
 */
export function Header({
  menu,
  selection,
}: {
  menu: MegaMenuData
  selection: VehicleSelection | null
}) {
  return <SiteHeader menu={menu} selection={selection} />
}
