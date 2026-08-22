import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { VehicleUiProvider } from '@/components/vehicle/vehicle-ui-provider'
import { getMegaMenuData } from '@/server/catalog-queries'
import { getVehicleTypes } from '@/server/vehicle-queries'
import { readSelectedVehicle } from '@/features/vehicle/cookie'

/**
 * Mağaza kabuğu — header, mega menü, araç seçici ve footer.
 * Yönetim paneli (/admin) bu kabuğun DIŞINDADIR; kendi kabuğunu kullanır.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menu, types, selection] = await Promise.all([
    getMegaMenuData(),
    getVehicleTypes(),
    readSelectedVehicle(),
  ])

  return (
    <VehicleUiProvider types={types} selection={selection}>
      <Header menu={menu} selection={selection} />
      {/* pb: mobil alt sabit bar yüksekliği kadar boşluk */}
      <main id="icerik" className="pb-14 lg:pb-0">
        {children}
      </main>
      <Footer menu={menu} />
      <WhatsAppButton />
    </VehicleUiProvider>
  )
}
