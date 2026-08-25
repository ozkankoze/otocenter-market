'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Package,
  Phone,
  ChevronRight,
  Car,
  Check,
} from 'lucide-react'
import { cn, formatCount } from '@/lib/utils'
import { Logo, LOGO_HEIGHTS } from './logo'
import { Button } from '@/components/ui/button'
import { SiteSearchForm } from './site-search-form'
import { useVehicleUi } from '@/components/vehicle/vehicle-ui-provider'
import { SITE } from '@/lib/site'
import type { MegaMenuData } from '@/server/catalog-queries'
import type { VehicleSelection } from '@/features/vehicle/types'

/**
 * Ana menü — kategori bağlantıları SABİT DEĞİL.
 *
 * Önceden "Filtreler" ve "Yağlar & Sıvılar" burada elle yazılıydı. Ürünü
 * olmayan bir grup (bugün Yağlar & Sıvılar) menüde kalıyor ve kullanıcıyı boş
 * bir sayfaya götürüyordu. Artık kategori bağlantıları mega menü verisinden
 * geliyor; o veri de yalnızca ürünü olan grupları içeriyor. Ürün girildiği
 * gün başlık kendiliğinden geri gelir.
 */
function navLinks(menu: MegaMenuData): Array<{ label: string; href: string }> {
  return [
    ...menu.vehicleTypes
      .filter((t) => t.brandCount > 0)
      .map((t) => ({ label: t.name, href: `/${t.slug}` })),
    ...menu.groups.map((g) => ({ label: g.name, href: `/${g.slug}` })),
    { label: 'Markalar', href: '/markalar' },
    { label: 'Kampanyalar', href: '/kampanyalar' },
  ]
}

/** Üst şerit — hepsi gerçek sayfalara gider. */
const UTILITY_LINKS = [
  { label: 'Kurumsal & Bayilik', href: '/bayilik-toptan' },
  { label: 'Sipariş Takip', href: '/siparis-takip' },
  { label: 'Kargo & Teslimat', href: '/kargo-teslimat' },
  { label: 'Yardım', href: '/sikca-sorulan-sorular' },
]

/**
 * Mobil arama katmanındaki popüler aramalar.
 *
 * Sabit liste tutulmuyor: en çok ürünü olan beş kategori kullanılıyor. Elle
 * yazıldığında ürünü olmayan kategoriler (Motor Yağı gibi) listede kalıyor ve
 * tıklayan kullanıcı boş bir sayfaya düşüyordu. Mega menü verisi zaten boş
 * kategorileri elemiş hâlde geliyor.
 */
function popularSearches(menu: MegaMenuData): Array<{ label: string; href: string }> {
  return menu.groups
    .flatMap((g) => g.children.map((c) => ({ ...c, groupSlug: g.slug })))
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5)
    .map((c) => ({ label: c.name, href: `/${c.groupSlug}/${c.slug}` }))
}

/** Mobil menünün alt bölümü — “Hesap” yerine gerçekten var olan sayfalar. */
const DRAWER_SERVICE_LINKS = [
  { label: 'Sipariş Takip', href: '/siparis-takip' },
  { label: 'Kargo & Teslimat', href: '/kargo-teslimat' },
  { label: 'İade & Değişim', href: '/iade-degisim' },
  { label: 'Sıkça Sorulan Sorular', href: '/sikca-sorulan-sorular' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
]

export function SiteHeader({
  menu,
  selection,
}: {
  menu: MegaMenuData
  selection: VehicleSelection | null
}) {
  const { openSelector } = useVehicleUi()
  const [megaOpen, setMegaOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [compact, setCompact] = React.useState(false)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sticky kompakt mod — 3 katman tek satıra iner
  React.useEffect(() => {
    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setCompact(window.scrollY > 140))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setDrawerOpen(false)
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, searchOpen])

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleClose = (delay = 200) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMegaOpen(false), delay)
  }

  return (
    <>
      {/* ══════════════ MASAÜSTÜ ══════════════ */}
      <header className="relative z-50 hidden bg-white lg:block" data-testid="desktop-header">
        {/* Katman 0 — utility bar */}
        <div
          className={cn(
            'overflow-hidden bg-brand-800 text-xs text-white/85 transition-[height] duration-200',
            compact ? 'h-0' : 'h-[34px]',
          )}
        >
          <div className="ocm-container flex h-[34px] items-center gap-6">
            {UTILITY_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                prefetch={false}
                className="transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <span className="ml-auto inline-flex items-center gap-2">
              <Check size={12} className="text-accent-600" aria-hidden="true" />
              Motor kodu seviyesinde uyumluluk
            </span>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 border-l border-white/15 pl-6 font-medium text-white transition-opacity hover:opacity-80"
            >
              <Phone size={13} aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Sticky blok: ana bar + nav */}
        <div
          className={cn(
            'sticky top-0 z-50 border-b border-ink-100 bg-white',
            compact && 'shadow-sm',
          )}
        >
          {/* Katman 1 */}
          <div
            className={cn(
              'ocm-container flex items-center gap-7 transition-[height] duration-200',
              compact ? 'h-[60px]' : 'h-[82px]',
            )}
          >
            <Logo
              height={compact ? LOGO_HEIGHTS.desktopCompact : LOGO_HEIGHTS.desktop}
              priority
            />

            <SiteSearchForm
              className="max-w-[560px] flex-1"
              inputClassName={cn(
                'border-ink-100 bg-ink-25 focus:bg-white',
                compact ? 'h-10' : 'h-11',
              )}
            />

            <div className="ml-auto flex items-center gap-6">
              <HeaderAction
                icon={<User size={20} strokeWidth={1.75} />}
                title="Hesabım"
                sub="Giriş yap"
              />
              <HeaderAction
                icon={<Package size={20} strokeWidth={1.75} />}
                title="Siparişlerim"
                sub="Takip et"
                href="/siparis-takip"
              />
              <HeaderAction
                icon={<ShoppingCart size={20} strokeWidth={1.75} />}
                title="Sepetim"
                sub="0,00 ₺"
                badge={0}
              />
            </div>
          </div>

          {/* Katman 2 — navigasyon */}
          <nav className="relative border-t border-ink-50" aria-label="Ana menü">
            <div className="ocm-container flex h-12 items-center gap-6">
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={openMega}
                onMouseLeave={() => scheduleClose(260)}
                className={cn(
                  'inline-flex h-8 shrink-0 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold text-white transition-colors duration-150',
                  megaOpen ? 'bg-brand-700' : 'bg-brand-600 hover:bg-brand-700',
                )}
                data-testid="mega-trigger"
              >
                <Menu size={15} strokeWidth={2.2} aria-hidden="true" />
                Kategoriler
              </button>

              <ul className="flex items-center gap-6 text-[13.5px] font-medium">
                {navLinks(menu).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-ink-800 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {selection ? (
                <button
                  type="button"
                  onClick={openSelector}
                  className="ml-auto inline-flex h-8 max-w-[300px] items-center gap-2 rounded-sm bg-accent-100 px-3 text-[12.5px] font-semibold text-accent-700 transition-colors hover:brightness-98"
                  data-testid="vehicle-chip"
                >
                  <Car size={15} aria-hidden="true" />
                  <span className="truncate">
                    {selection.brandName} {selection.modelName}
                  </span>
                  <span className="ocm-code shrink-0 text-[11px] text-accent-700/70">
                    {selection.engineName.split(' ').slice(0, 2).join(' ')}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openSelector}
                  className="ml-auto inline-flex h-8 items-center gap-2 rounded-sm border border-brand-300 px-3 text-[12.5px] font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                  data-testid="vehicle-chip-empty"
                >
                  <Car size={15} aria-hidden="true" />
                  Aracınızı seçin
                </button>
              )}
            </div>

            {/* ── MEGA MENÜ ── */}
            <div
              id="mega-menu"
              onMouseEnter={openMega}
              onMouseLeave={() => scheduleClose(180)}
              className={cn(
                'absolute inset-x-0 top-full z-40 border-t border-ink-100 bg-white shadow-lg',
                'transition-[opacity,transform] duration-200',
                megaOpen
                  ? 'visible translate-y-0 opacity-100'
                  : 'invisible -translate-y-1.5 opacity-0',
              )}
              data-testid="mega-menu"
            >
              <div className="ocm-container grid grid-cols-[1fr_1fr_1fr_290px] gap-9 py-8">
                {menu.groups.slice(0, 2).map((group) => (
                  <div key={group.code}>
                    <h3 className="mb-3 border-b border-ink-100 pb-2 text-[11px] font-bold tracking-wider text-brand-600 uppercase">
                      {group.name}
                    </h3>
                    <ul>
                      {group.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={`/${group.slug}/${child.slug}`}
                            prefetch={false}
                            title={`${child.name} — ${formatCount(child.productCount)} ürün`}
                            className="flex items-baseline gap-2 py-1.5 text-[13.5px] text-ink-600 transition-colors hover:text-brand-600"
                          >
                            <span>{child.name}</span>
                            <span className="ocm-code ml-auto text-[11px] text-ink-400">
                              {formatCount(child.productCount)}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={`/${group.slug}`}
                          prefetch={false}
                          className="inline-flex items-center gap-1 py-1.5 text-[13.5px] font-semibold text-brand-600"
                        >
                          Tümünü gör <ChevronRight size={13} aria-hidden="true" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}

                {/* Araç grupları — gerçek araç tipleri */}
                <div>
                  <h3 className="mb-3 border-b border-ink-100 pb-2 text-[11px] font-bold tracking-wider text-brand-600 uppercase">
                    Araç Grupları
                  </h3>
                  <ul>
                    {menu.vehicleTypes
                      .filter((t) => t.brandCount > 0)
                      .map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/${t.slug}`}
                            prefetch={false}
                            className="flex items-baseline gap-2 py-1.5 text-[13.5px] text-ink-600 transition-colors hover:text-brand-600"
                          >
                            <span>{t.name}</span>
                            <span className="ocm-code ml-auto text-[11px] text-ink-400">
                              {t.brandCount} marka
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Promo */}
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-brand-800 to-brand-900 p-6 text-white">
                  <span
                    className="ocm-grid-pattern absolute inset-0 opacity-60"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <b className="mb-2 block text-base leading-snug font-semibold">
                      Aracınıza göre parça bulun
                    </b>
                    <p className="mb-4 text-[12.5px] text-white/70">
                      Marka, model ve motoru seçin; yalnızca uyumlu ürünleri görün.
                    </p>
                    <Button
                      variant="white"
                      block
                      onClick={() => {
                        setMegaOpen(false)
                        openSelector()
                      }}
                    >
                      <Car size={16} aria-hidden="true" />
                      Aracımı Seç
                    </Button>
                    <div className="mt-5 border-t border-white/12 pt-4">
                      <span className="mb-2.5 block text-[10.5px] tracking-wider text-white/50">
                        POPÜLER MARKALAR
                      </span>
                      <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 text-[11px] text-white/80">
                        {menu.popularBrands.map((b) => (
                          <span key={b.slug} className="truncate">
                            {b.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ══════════════ MOBİL ══════════════ */}
      <header
        className="sticky top-0 z-50 border-b border-ink-100 bg-white lg:hidden"
        data-testid="mobile-header"
      >
        <div className="bg-brand-800 px-4 py-1.5 text-center text-[11px] text-white/85">
          <span className="inline-flex items-center gap-1.5">
            <Check size={11} className="text-accent-600" aria-hidden="true" />
            Motor kodu seviyesinde uyumluluk
          </span>
        </div>
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menüyü aç"
            className="-ml-1.5 p-1.5 text-ink-800"
            data-testid="mobile-menu-trigger"
          >
            <Menu size={22} />
          </button>
          <Logo height={LOGO_HEIGHTS.mobile} />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Ara"
            className="ml-auto p-1.5 text-ink-800"
            data-testid="mobile-search-trigger"
          >
            <Search size={21} />
          </button>
          <button type="button" aria-label="Sepetim" className="relative p-1.5 text-ink-800">
            <ShoppingCart size={21} />
            <i className="absolute top-0 right-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white not-italic">
              0
            </i>
          </button>
        </div>
      </header>

      {/* Mobil arama overlay */}
      <div
        className={cn(
          'fixed inset-0 z-100 bg-white transition-opacity duration-200 lg:hidden',
          searchOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        role="dialog"
        aria-label="Arama"
        aria-hidden={!searchOpen}
      >
        <div className="flex h-14 items-center gap-2 border-b border-ink-100 px-3">
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Aramayı kapat"
            className="p-2 text-ink-600"
          >
            <X size={20} />
          </button>
          <SiteSearchForm
            className="flex-1"
            autoFocus={searchOpen}
            onNavigate={() => setSearchOpen(false)}
          />
        </div>
        <div className="px-4 py-5">
          <span className="ocm-eyebrow">Popüler aramalar</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularSearches(menu).map((t) => (
              <Link
                key={t.href}
                href={t.href}
                prefetch={false}
                onClick={() => setSearchOpen(false)}
                className="rounded-sm border border-ink-100 bg-white px-3 py-1.5 text-[13px] text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                {t.label}
              </Link>
            ))}
          </div>
          <div className="mt-7 rounded-lg border border-brand-100 bg-brand-50 p-4">
            <b className="block text-sm font-semibold text-ink-900">Aracınızı bilmiyor musunuz?</b>
            <p className="mt-1 mb-3 text-[12.5px] text-ink-600">
              Parça kodu veya OEM numarası ile de arayabilirsiniz.
            </p>
            <Button
              block
              onClick={() => {
                setSearchOpen(false)
                openSelector()
              }}
            >
              <Car size={16} aria-hidden="true" />
              Aracımı Seç
            </Button>
          </div>
        </div>
      </div>

      {/* Mobil drawer */}
      <div
        className={cn(
          'fixed inset-0 z-90 bg-brand-900/45 transition-opacity duration-200 lg:hidden',
          drawerOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-100 w-[312px] max-w-[88vw] overflow-y-auto bg-white shadow-lg lg:hidden',
          'transition-transform duration-200',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Mobil menü"
        aria-hidden={!drawerOpen}
        data-testid="mobile-drawer"
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-4">
          <Logo height={LOGO_HEIGHTS.drawer} />
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Menüyü kapat">
            <X size={20} className="text-ink-400" />
          </button>
        </div>

        <div className="m-4 rounded-lg border border-brand-100 bg-brand-50 p-4">
          {selection ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-accent-700">
                <Check size={12} strokeWidth={3} aria-hidden="true" /> Aracınız seçili
              </span>
              <b className="mt-1 block text-sm font-semibold text-ink-900">
                {selection.brandName} {selection.modelName}
              </b>
              <span className="ocm-code mb-3 block text-[12px]">{selection.engineName}</span>
            </>
          ) : (
            <>
              <b className="block text-sm font-semibold text-ink-900">Aracınızı seçin</b>
              <span className="mt-1 mb-3 block text-[12.5px] text-ink-600">
                Yalnızca uyumlu ürünleri görün
              </span>
            </>
          )}
          <Button
            block
            onClick={() => {
              setDrawerOpen(false)
              openSelector()
            }}
          >
            <Car size={16} aria-hidden="true" />
            {selection ? 'Aracı Değiştir' : 'Aracımı Seç'}
          </Button>
        </div>

        {menu.groups.map((group) => (
          <div key={group.code} className="border-b border-ink-50 px-4 pb-3">
            <h3 className="mt-3 mb-1 text-[10.5px] font-bold tracking-wider text-brand-600 uppercase">
              {group.name}
            </h3>
            {group.children.map((child) => (
              <Link
                key={child.slug}
                href={`/${group.slug}/${child.slug}`}
                prefetch={false}
                title={`${child.name} — ${formatCount(child.productCount)} ürün`}
                className="flex items-center justify-between border-b border-ink-50 py-2.5 text-sm text-ink-800 last:border-0"
                onClick={() => setDrawerOpen(false)}
              >
                {child.name}
                <span className="ocm-code text-[11px] text-ink-400">
                  {formatCount(child.productCount)}
                </span>
              </Link>
            ))}
          </div>
        ))}

        <div className="border-b border-ink-50 px-4 pb-3">
          <h3 className="mt-3 mb-1 text-[10.5px] font-bold tracking-wider text-brand-600 uppercase">
            Araç Grupları
          </h3>
          {menu.vehicleTypes
            .filter((t) => t.brandCount > 0)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                prefetch={false}
                className="block border-b border-ink-50 py-2.5 text-sm text-ink-800 last:border-0"
                onClick={() => setDrawerOpen(false)}
              >
                {t.name}
              </Link>
            ))}
        </div>

        <div className="border-b border-ink-50 px-4 pb-3">
          <h3 className="mt-3 mb-1 text-[10.5px] font-bold tracking-wider text-brand-600 uppercase">
            Markalar
          </h3>
          <Link
            href="/markalar"
            prefetch={false}
            className="block border-b border-ink-50 py-2.5 text-sm text-ink-800 last:border-0"
            onClick={() => setDrawerOpen(false)}
          >
            Ürün markaları
          </Link>
        </div>

        <div className="px-4 pb-24">
          <h3 className="mt-3 mb-1 text-[10.5px] font-bold tracking-wider text-brand-600 uppercase">
            Yardım & Kurumsal
          </h3>
          {DRAWER_SERVICE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              prefetch={false}
              className="block border-b border-ink-50 py-2.5 text-sm text-ink-800 last:border-0"
              onClick={() => setDrawerOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobil alt sabit bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white lg:hidden"
        aria-label="Hızlı erişim"
        data-testid="mobile-bottom-bar"
      >
        <div className="grid h-14 grid-cols-4">
          <BottomItem
            icon={<Menu size={19} />}
            label="Kategoriler"
            onClick={() => setDrawerOpen(true)}
          />
          <BottomItem icon={<Search size={19} />} label="Ara" onClick={() => setSearchOpen(true)} />
          <BottomItem
            icon={<Car size={19} />}
            label="Aracım"
            active={Boolean(selection)}
            onClick={openSelector}
          />
          <BottomItem icon={<ShoppingCart size={19} />} label="Sepet" />
        </div>
      </nav>
    </>
  )
}

/**
 * `href` verilirse gerçek bir bağlantı olur. Verilmeyenler (Hesabım, Sepetim)
 * henüz sayfası olmayan, ileride açılacak akışlardır: tıklanabilir GÖRÜNMELERİ
 * için imleç değişmez — kullanıcıyı var olmayan bir adrese göndermektense
 * hiçbir şey yapmamak daha iyidir.
 */
function HeaderAction({
  icon,
  title,
  sub,
  badge,
  href,
}: {
  icon: React.ReactNode
  title: string
  sub: string
  badge?: number
  href?: string
}) {
  const govde = (
    <>
      <span className="relative inline-flex">
        {icon}
        {badge !== undefined ? (
          <i className="absolute -top-1.5 -right-2.5 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white not-italic">
            {badge}
          </i>
        ) : null}
      </span>
      <span className={badge !== undefined ? 'ml-1.5' : undefined}>
        <b className="block text-[12.5px] leading-tight font-semibold">{title}</b>
        <em className="block text-[11px] text-ink-400 not-italic">{sub}</em>
      </span>
    </>
  )

  const sinif = 'flex items-center gap-2.5 text-ink-800 transition-colors hover:text-brand-600'

  return href ? (
    <Link href={href} prefetch={false} className={sinif}>
      {govde}
    </Link>
  ) : (
    <span className={sinif}>{govde}</span>
  )
}

function BottomItem({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-colors',
        active ? 'text-accent-700' : 'text-ink-600',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
